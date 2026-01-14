import calendar
from typing import List, Dict, Any
from langchain_core.messages import SystemMessage, HumanMessage

from ...config import settings, get_llm
from .models import CurriculumPlan
from .prompts import CURRICULUM_PLANNING_PROMPT


async def plan_curriculum(
    theme_title: str, month: int, year: int
) -> List[Dict[str, Any]]:
    """Generates a monthly curriculum plan for a given theme."""
    print(
        f"--- Planning Curriculum: {theme_title} for {month}/{year} ({settings.llm_provider}) ---"
    )

    num_days = calendar.monthrange(year, month)[1]
    llm = get_llm(temperature=0.7)
    structured_llm = llm.with_structured_output(CurriculumPlan)

    prompt = CURRICULUM_PLANNING_PROMPT.format(
        theme_title=theme_title, month=month, year=year, num_days=num_days
    )

    try:
        plan = await structured_llm.ainvoke(
            [
                SystemMessage(content="You are an expert curriculum planner."),
                HumanMessage(content=prompt),
            ]
        )
        print(f"   + Successfully planned {len(plan.topics)} topics.")
        return [topic.model_dump() for topic in plan.topics]
    except Exception as e:
        print(f"   x Curriculum Planning Error: {e}")
        return []
