from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime


class ComparisonItem(BaseModel):
    dimension: str
    before: str
    after: str


class ComparisonContent(BaseModel):
    items: List[ComparisonItem]
    summary: Optional[str] = None


class TradeoffsContent(BaseModel):
    pros: List[str]
    cons: List[str]
    constraints: List[str]
    real_world_context: Optional[str] = None


class Section(BaseModel):
    header: str
    content: Optional[str] = None
    example_use_case: Optional[str] = None
    comparison: Optional[ComparisonContent] = None
    tradeoffs: Optional[TradeoffsContent] = None


class PostBase(BaseModel):
    title: str = Field(..., max_length=200)
    type: str = Field(..., pattern="^(link|article|forum)$")
    status: Optional[str] = Field(
        "planned", pattern="^(proposed|planned|researched|selected|inDraft|scheduled)$"
    )
    sources: Optional[List[str]] = []
    summary: Optional[str] = None

    # Structured LinkedIn Content
    hook: Optional[str] = None
    sections: Optional[List[Section]] = None
    key_takeaways: Optional[List[str]] = None
    call_to_action: Optional[str] = None
    hashtags: Optional[List[str]] = None

    # New fields for Progressive Curriculum
    day: Optional[int] = None
    learning_objective: Optional[str] = None
    difficulty: Optional[str] = None
    search_queries: Optional[List[str]] = []


class PostCreate(PostBase):
    theme_id: str


class PostUpdate(BaseModel):
    title: Optional[str] = Field(None, max_length=200)
    type: Optional[str] = Field(None, pattern="^(link|article|forum)$")
    status: Optional[str] = Field(
        None, pattern="^(proposed|planned|researched|selected|inDraft|scheduled)$"
    )
    sources: Optional[List[str]] = None
    summary: Optional[str] = None
    hook: Optional[str] = None
    sections: Optional[List[Section]] = None
    key_takeaways: Optional[List[str]] = None
    call_to_action: Optional[str] = None
    hashtags: Optional[List[str]] = None
    day: Optional[int] = None
    learning_objective: Optional[str] = None
    difficulty: Optional[str] = None
    search_queries: Optional[List[str]] = None


class PostResponse(PostBase):
    id: str
    theme_id: str
    created_at: datetime

    class Config:
        from_attributes = True
