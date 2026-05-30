from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime


class OptimizeRequest(BaseModel):
    prompt: str
    format: str = "gpt"
    model: str = "llama3.1"


class DiffSegment(BaseModel):
    text: str
    type: str  # 'added' | 'removed' | 'unchanged'


class PromptSection(BaseModel):
    label: str
    content: str


class OptimizedResult(BaseModel):
    optimizedPrompt: str
    originalPrompt: str
    score: int
    clarityScore: int
    contextScore: int
    tokenCount: int
    generationTime: int  # ms
    diffHighlights: List[DiffSegment]
    sections: Optional[List[PromptSection]] = None
    tags: Optional[List[str]] = None


class HistoryItemOut(BaseModel):
    id: str
    title: str
    originalPrompt: str
    optimizedPrompt: str
    score: int
    tokenCount: int
    model: str
    format: str
    latency: float
    estimatedCost: Optional[float] = None
    hasHallucinationRisk: bool = False
    createdAt: str

    class Config:
        from_attributes = True


class TemplateOut(BaseModel):
    id: str
    title: str
    description: str
    category: str
    promptText: str
    icon: str
    previewText: Optional[str] = None

    class Config:
        from_attributes = True
