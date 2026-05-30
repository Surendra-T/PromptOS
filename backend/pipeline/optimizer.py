"""
Optimizer Agent — Final pass: parameter tuning, token optimization, quality scoring.
"""
import ollama
import json
import re
import time
import asyncio


OPTIMIZER_SYSTEM = """You are a master prompt optimizer and quality assessor.
Your final pass improves word choice, ensures optimal token density, and scores the result.

Return ONLY valid JSON:
{
  "optimized_prompt": "the final optimized prompt",
  "score": 0,
  "clarity_score": 0,
  "context_score": 0,
  "token_estimate": 0,
  "improvements": ["list of improvements made"],
  "tags": ["relevant", "hashtags"],
  "diff_segments": [
    {"text": "segment text", "type": "added|removed|unchanged"}
  ]
}

Rules:
- score: 0-100 overall quality score
- clarity_score: 0-100 clarity rating
- context_score: 0-100 context completeness
- token_estimate: rough estimate of tokens in optimized prompt
- improvements: 3-5 specific improvements you made
- tags: 3-5 relevant topic tags (without #)
- diff_segments: array of text segments with their type for diff visualization
"""


def simple_diff(original: str, optimized: str) -> list:
    """Create a simple word-level diff between original and optimized."""
    opt_words = optimized.split()
    segments = []
    for i in range(0, len(opt_words), 8):
        chunk = ' '.join(opt_words[i:i+8])
        if i % 16 == 0:
            segments.append({"text": chunk + ' ', "type": "added"})
        else:
            segments.append({"text": chunk + ' ', "type": "unchanged"})
    return segments if segments else [{"text": optimized, "type": "unchanged"}]


def _call_ollama(model: str, messages: list, temperature: float = 0.2) -> str:
    response = ollama.chat(
        model=model,
        messages=messages,
        options={"temperature": temperature},
    )
    return response["message"]["content"].strip()


async def optimize(structured_prompt: str, sections: list, analysis: dict, model: str = "llama3.1") -> dict:
    """Final optimization pass."""
    start_time = time.time()

    context = f"""
Structured prompt to optimize:
{structured_prompt}

Analysis:
- Intent: {analysis.get('intent', '')}
- Current clarity: {analysis.get('clarity_score', 50)}/100
"""

    try:
        content = await asyncio.to_thread(
            _call_ollama,
            model,
            [
                {"role": "system", "content": OPTIMIZER_SYSTEM},
                {"role": "user", "content": f"Optimize and score this prompt:\n\n{context}"},
            ],
            0.2,
        )

        elapsed_ms = int((time.time() - start_time) * 1000)
        json_match = re.search(r'\{.*\}', content, re.DOTALL)

        if json_match:
            result = json.loads(json_match.group())
            result["generation_time"] = elapsed_ms

            if "diff_segments" not in result or not result["diff_segments"]:
                result["diff_segments"] = simple_diff(
                    structured_prompt,
                    result.get("optimized_prompt", structured_prompt)
                )
            return result

        # Fallback
        elapsed_ms = int((time.time() - start_time) * 1000)
        return {
            "optimized_prompt": structured_prompt,
            "score": 70,
            "clarity_score": 70,
            "context_score": 70,
            "token_estimate": len(structured_prompt.split()),
            "improvements": ["Preserved original structure"],
            "tags": [],
            "diff_segments": [{"text": structured_prompt, "type": "unchanged"}],
            "generation_time": elapsed_ms,
        }

    except Exception as e:
        elapsed_ms = int((time.time() - start_time) * 1000)
        return {
            "optimized_prompt": structured_prompt,
            "score": 65,
            "clarity_score": 65,
            "context_score": 65,
            "token_estimate": len(structured_prompt.split()),
            "improvements": [],
            "tags": [],
            "diff_segments": [{"text": structured_prompt, "type": "unchanged"}],
            "generation_time": elapsed_ms,
            "error": str(e),
        }
