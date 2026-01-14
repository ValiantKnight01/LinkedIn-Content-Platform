from typing import List, Optional
from pydantic import BaseModel, Field


class AnglePlan(BaseModel):
    angle: str = Field(description="The name of the research angle")
    query: str = Field(description="The specific search query for this angle")


class ResearchPlan(BaseModel):
    angles: List[AnglePlan] = Field(description="List of 4 distinct research angles")


class TopicResult(BaseModel):
    title: str = Field(description="A compelling title for the post")
    type: str = Field(description="Type of post: link, article, or forum")
    sources: List[str] = Field(description="List of source URLs found")
    summary: str = Field(description="Brief summary of the topic")


class ComparisonItem(BaseModel):
    dimension: str = Field(
        description="The aspect being compared (e.g., Performance, Context)"
    )
    before: str = Field(description="State before the implementation of the solution")
    after: str = Field(description="State after the implementation of the solution")


class ComparisonContent(BaseModel):
    items: List[ComparisonItem] = Field(
        description="List of side-by-side comparison points"
    )
    summary: Optional[str] = Field(
        None, description="A concluding summary of the comparison"
    )


class TradeoffsContent(BaseModel):
    pros: List[str] = Field(description="List of 3+ benefits")
    cons: List[str] = Field(description="List of 3+ challenges or limitations")
    constraints: List[str] = Field(
        description="2+ specific scenarios where this should NOT be used"
    )
    real_world_context: Optional[str] = Field(
        None, description="A real-world example of issues or failures"
    )


class ResearchSection(BaseModel):
    header: str = Field(description="The section header (plain text, no emojis)")
    content: Optional[str] = Field(
        None, description="The main content of the section (plain text, no emojis)"
    )
    example_use_case: Optional[str] = Field(
        None, description="A practical example or use case (plain text, no emojis)"
    )
    comparison: Optional[ComparisonContent] = Field(
        None, description="Structured data for comparison sections"
    )
    tradeoffs: Optional[TradeoffsContent] = Field(
        None, description="Structured data for tradeoffs sections"
    )


class ResearchSynthesis(BaseModel):
    day: int = Field(description="The day of the curriculum")
    title: str = Field(
        description="A compelling title for the post (plain text, no emojis)"
    )
    hook: str = Field(
        description="An engaging opening hook for the LinkedIn post (plain text, no emojis)"
    )
    sections: List[ResearchSection] = Field(
        description="The main body sections of the post"
    )
    key_takeaways: List[str] = Field(
        description="3-5 key takeaways (plain text, no emojis)"
    )
    call_to_action: str = Field(
        description="A question or statement to encourage engagement (plain text, no emojis)"
    )
    hashtags: List[str] = Field(
        description="Relevant LinkedIn hashtags (no # symbol, just the words)"
    )
    sources: List[str] = Field(description="The most relevant source URLs used")
