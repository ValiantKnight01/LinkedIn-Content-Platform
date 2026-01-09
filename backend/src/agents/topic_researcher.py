import os
import json
import asyncio
from typing import List, Dict, Any, Optional, TypedDict
from dotenv import load_dotenv

from langchain_core.messages import SystemMessage, HumanMessage
from pydantic import BaseModel, Field
from langchain_anthropic import ChatAnthropic
from langchain_groq import ChatGroq
from langchain_community.tools import DuckDuckGoSearchRun
from langgraph.graph import StateGraph, END

# Load environment variables
load_dotenv(dotenv_path=os.path.join(os.path.dirname(__file__), "../../.env"))

# --- Schemas ---

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

# --- State ---

class AgentState(TypedDict):
    theme: str
    existing_titles: List[str]
    plan: Optional[ResearchPlan]
    results: List[Dict[str, Any]]

# --- Nodes ---

def planner_node(state: AgentState):
    """Generates research angles using Anthropic (Claude 4.5 Haiku)."""
    print(f"--- Planning: {state['theme']} ---")
    
    # Using the latest Haiku model (Claude 4.5)
    llm = ChatAnthropic(model="claude-haiku-4-5-20251001", temperature=0.7)
    structured_llm = llm.with_structured_output(ResearchPlan)

    prompt = f"""You are an expert editorial planner. 
    Theme: {state['theme']}
    Existing Topics: {json.dumps(state['existing_titles'])}
    
    Generate 4 DISTINCT, high-value research angles.
    For each angle, provide a descriptive name and a specific search query.
    """
    
    try:
        plan = structured_llm.invoke([SystemMessage(content="Generate a research plan."), HumanMessage(content=prompt)])
        return {"plan": plan}
    except Exception as e:
        print(f"Planning Error: {e}")
        # Fallback plan
        return {"plan": ResearchPlan(angles=[
            AnglePlan(angle="Overview", query=f"{state['theme']} trends 2026"),
            AnglePlan(angle="Technical", query=f"{state['theme']} implementation"),
            AnglePlan(angle="Examples", query=f"{state['theme']} case studies"),
            AnglePlan(angle="Deep Dive", query=f"advanced {state['theme']} concepts")
        ])}

def researcher_node(state: AgentState):
    """Executes search and synthesizes results using Anthropic (Claude 4.5 Haiku)."""
    print("--- Researching ---")
    
    plan = state.get("plan")
    if not plan:
        return {"results": []}

    # Initialize Tools & Model
    search = DuckDuckGoSearchRun()
    # Moving from Groq to Anthropic Haiku for synthesis
    llm = ChatAnthropic(model="claude-haiku-4-5-20251001", temperature=0.5)
    structured_llm = llm.with_structured_output(TopicResult)

    results = []
    
    for angle in plan.angles:
        print(f"  > Searching: {angle.angle}...")
        try:
            # 1. Search
            search_results = search.invoke(angle.query)
            
            # 2. Synthesize
            prompt = f"""Research Angle: {angle.angle}
            Search Query: {angle.query}
            Search Results: {search_results}
            
            Synthesize a compelling topic title and identify the content type based on these results.
            """
            
            result = structured_llm.invoke([
                SystemMessage(content="Synthesize search results into a topic."), 
                HumanMessage(content=prompt)
            ])
            results.append(result.dict())
            
        except Exception as e:
            print(f"  x Failed angle {angle.angle}: {e}")
            results.append({
                "title": f"Explore: {angle.angle}",
                "type": "link",
                "sources": [],
                "summary": "Research failed, manual review required."
            })

    return {"results": results}

# --- Graph Definition ---

def build_graph():
    workflow = StateGraph(AgentState)
    
    workflow.add_node("planner", planner_node)
    workflow.add_node("researcher", researcher_node)
    
    workflow.set_entry_point("planner")
    workflow.add_edge("planner", "researcher")
    workflow.add_edge("researcher", END)
    
    return workflow.compile()

# --- Public Interface ---

async def research_theme(theme_title: str, existing_titles: List[str]) -> List[Dict[str, Any]]:
    """Entry point for the application to call the research agent."""
    app = build_graph()
    
    initial_state = {
        "theme": theme_title,
        "existing_titles": existing_titles,
        "plan": None,
        "results": []
    }
    
    # LangGraph apps can be invoked directly
    # Note: invoke is synchronous, but we can wrap it if we need strictly async top-level,
    # or use .ainvoke if the nodes were async. For simplicity here we assume blocking for now
    # or we can make nodes async.
    
    # Since the original interface was async, we should probably use ainvoke.
    # Let's verify if the nodes are compatible with ainvoke (they are regular functions).
    # LangGraph handles both.
    
    final_state = await app.ainvoke(initial_state)
    return final_state["results"]

