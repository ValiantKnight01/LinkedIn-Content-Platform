from typing import List
from pydantic import BaseModel, Field


class DailyTopic(BaseModel):
    day: int = Field(description="The day of the month (1-31)")
    title: str = Field(description="A compelling title for the post")
    learning_objective: str = Field(description="What the reader will learn")
    difficulty: str = Field(
        description="Difficulty level: Beginner, Intermediate, Advanced"
    )
    type: str = Field(description="Type of post: link, article, or forum")
    search_queries: List[str] = Field(
        description="3-5 specific search queries for deep research"
    )


class CurriculumPlan(BaseModel):
    topics: List[DailyTopic] = Field(
        description="List of daily topics for the entire month"
    )
