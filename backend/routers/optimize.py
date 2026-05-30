import asyncio
import json
import time
import uuid
from fastapi import APIRouter, Depends
from fastapi.responses import StreamingResponse
from sqlalchemy.orm import Session

from database import get_db
from schemas import OptimizeRequest
import models
from pipeline.analyzer import analyze
from pipeline.cleaner import clean
from pipeline.builder import build
from pipeline.optimizer import optimize

router = APIRouter()


async def pipeline_generator(prompt: str, fmt: str, model: str, db: Session):
    """SSE generator that runs the 4-agent pipeline and streams events."""

    def event(data: dict) -> str:
        return f"data: {json.dumps(data)}\n\n"

    total_start = time.time()

    # ─── Step 1: Analyzer ────────────────────────────────
    yield event({"type": "step_start", "step": "analyzer", "timestamp": time.time()})
    yield event({"type": "progress", "progress": 5, "eta": "~12s"})

    t0 = time.time()
    analysis = await analyze(prompt, model=model)
    analyzer_ms = int((time.time() - t0) * 1000)

    yield event({
        "type": "step_complete",
        "step": "analyzer",
        "result": json.dumps(analysis),
        "duration": analyzer_ms,
        "preview": f"Intent: {analysis.get('intent', '')[:60]}",
        "timestamp": time.time(),
    })
    yield event({"type": "progress", "progress": 25, "eta": "~9s"})

    # ─── Step 2: Cleaner ─────────────────────────────────
    yield event({"type": "step_start", "step": "cleaner", "timestamp": time.time()})

    t0 = time.time()
    cleaned = await clean(prompt, analysis, model=model)
    cleaner_ms = int((time.time() - t0) * 1000)
    cleaned_text = cleaned.get("cleaned_text", prompt)

    yield event({
        "type": "step_complete",
        "step": "cleaner",
        "result": cleaned_text,
        "duration": cleaner_ms,
        "preview": f"Removed: {', '.join(cleaned.get('removed_items', [])[:2])}",
        "timestamp": time.time(),
    })
    yield event({"type": "progress", "progress": 50, "eta": "~6s"})

    # ─── Step 3: Builder ─────────────────────────────────
    yield event({"type": "step_start", "step": "builder", "timestamp": time.time()})

    t0 = time.time()
    built = await build(cleaned_text, analysis, fmt, model=model)
    builder_ms = int((time.time() - t0) * 1000)
    structured = built.get("structured_prompt", cleaned_text)
    sections = built.get("sections", [])

    yield event({
        "type": "step_complete",
        "step": "builder",
        "result": structured,
        "duration": builder_ms,
        "preview": structured[:80],
        "timestamp": time.time(),
    })
    yield event({"type": "progress", "progress": 75, "eta": "~3s"})

    # ─── Step 4: Optimizer ───────────────────────────────
    yield event({"type": "step_start", "step": "optimizer", "timestamp": time.time()})

    t0 = time.time()
    optimized = await optimize(structured, sections, analysis, model=model)
    optimizer_ms = int((time.time() - t0) * 1000)

    final_prompt = optimized.get("optimized_prompt", structured)
    score = optimized.get("score", 75)
    clarity_score = optimized.get("clarity_score", 75)
    context_score = optimized.get("context_score", 75)
    token_count = optimized.get("token_estimate", len(final_prompt.split()))
    gen_time = optimized.get("generation_time", optimizer_ms)
    diff_segments = optimized.get("diff_segments", [{"text": final_prompt, "type": "unchanged"}])
    tags = optimized.get("tags", [])

    yield event({
        "type": "step_complete",
        "step": "optimizer",
        "result": final_prompt[:80],
        "duration": optimizer_ms,
        "preview": f"Score: {score}/100",
        "timestamp": time.time(),
    })
    yield event({"type": "progress", "progress": 100, "eta": "Done"})

    # ─── Save to DB ──────────────────────────────────────
    history_id = str(uuid.uuid4())
    title = prompt[:60] + ("..." if len(prompt) > 60 else "")
    total_ms = int((time.time() - total_start) * 1000)

    db_item = models.PromptHistory(
        id=history_id,
        title=title,
        original_prompt=prompt,
        optimized_prompt=final_prompt,
        score=score,
        clarity_score=clarity_score,
        context_score=context_score,
        token_count=token_count,
        model=model,
        format=fmt,
        latency=float(total_ms),
        has_hallucination_risk=score < 50,
    )
    db.add(db_item)
    db.commit()

    # ─── Final result event ──────────────────────────────
    result = {
        "optimizedPrompt": final_prompt,
        "originalPrompt": prompt,
        "score": score,
        "clarityScore": clarity_score,
        "contextScore": context_score,
        "tokenCount": token_count,
        "generationTime": gen_time,
        "diffHighlights": diff_segments,
        "sections": sections,
        "tags": tags,
    }

    yield event({"type": "complete", "result": result})


@router.post("/optimize")
async def optimize_prompt(request: OptimizeRequest, db: Session = Depends(get_db)):
    return StreamingResponse(
        pipeline_generator(request.prompt, request.format, request.model, db),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "X-Accel-Buffering": "no",
        },
    )
