from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from typing import List, Optional

from database import get_db
import models
from schemas import HistoryItemOut

router = APIRouter()


@router.get("/history", response_model=List[HistoryItemOut])
def get_history(
    search: Optional[str] = Query(None),
    limit: int = Query(50, le=100),
    offset: int = Query(0),
    db: Session = Depends(get_db),
):
    query = db.query(models.PromptHistory)

    if search:
        query = query.filter(
            models.PromptHistory.title.ilike(f"%{search}%") |
            models.PromptHistory.original_prompt.ilike(f"%{search}%")
        )

    items = (
        query.order_by(models.PromptHistory.created_at.desc())
        .offset(offset)
        .limit(limit)
        .all()
    )

    return [
        HistoryItemOut(
            id=item.id,
            title=item.title,
            originalPrompt=item.original_prompt,
            optimizedPrompt=item.optimized_prompt,
            score=item.score,
            tokenCount=item.token_count,
            model=item.model,
            format=item.format,
            latency=item.latency,
            estimatedCost=item.estimated_cost,
            hasHallucinationRisk=item.has_hallucination_risk or False,
            createdAt=item.created_at.isoformat() if item.created_at else "",
        )
        for item in items
    ]


@router.get("/history/{item_id}", response_model=HistoryItemOut)
def get_history_item(item_id: str, db: Session = Depends(get_db)):
    item = db.query(models.PromptHistory).filter(models.PromptHistory.id == item_id).first()
    if not item:
        from fastapi import HTTPException
        raise HTTPException(status_code=404, detail="History item not found")

    return HistoryItemOut(
        id=item.id,
        title=item.title,
        originalPrompt=item.original_prompt,
        optimizedPrompt=item.optimized_prompt,
        score=item.score,
        tokenCount=item.token_count,
        model=item.model,
        format=item.format,
        latency=item.latency,
        estimatedCost=item.estimated_cost,
        hasHallucinationRisk=item.has_hallucination_risk or False,
        createdAt=item.created_at.isoformat() if item.created_at else "",
    )
