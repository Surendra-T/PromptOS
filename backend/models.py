from sqlalchemy import Column, String, Integer, Float, Boolean, Text, DateTime
from sqlalchemy.sql import func
from database import Base


class PromptHistory(Base):
    __tablename__ = "prompt_history"

    id = Column(String, primary_key=True, index=True)
    title = Column(String, nullable=False)
    original_prompt = Column(Text, nullable=False)
    optimized_prompt = Column(Text, nullable=False)
    score = Column(Integer, default=0)
    clarity_score = Column(Integer, default=0)
    context_score = Column(Integer, default=0)
    token_count = Column(Integer, default=0)
    model = Column(String, default="llama3.1")
    format = Column(String, default="gpt")
    latency = Column(Float, default=0.0)
    estimated_cost = Column(Float, nullable=True)
    has_hallucination_risk = Column(Boolean, default=False)
    created_at = Column(DateTime, server_default=func.now())


class Template(Base):
    __tablename__ = "templates"

    id = Column(String, primary_key=True, index=True)
    title = Column(String, nullable=False)
    description = Column(Text, nullable=False)
    category = Column(String, nullable=False)
    prompt_text = Column(Text, nullable=False)
    icon = Column(String, default="📝")
    preview_text = Column(Text, nullable=True)
