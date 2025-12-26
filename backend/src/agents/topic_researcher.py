import asyncio
import json
import os
from typing import Any, Dict, List, Optional
from google.adk.agents import Agent
from google.adk.runners import Runner
from google.adk.sessions import InMemorySessionService
from google.adk.tools import google_search
from google.genai import types
from pydantic import BaseModel, Field

# Ensure API key is set
# GOOGLE_API_KEY must be set in environment

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

class ResearchOrchestrator:
    def __init__(self, model_name: str = "gemini-3-flash-preview"):
        self.agent = Agent(
            name="orchestrator",
            model=model_name,
            instruction="""You are an expert editorial planner. 
            Given a monthly theme and existing topics, generate 4 DISTINCT, high-value research angles.
            For each angle, provide a descriptive name and a specific Google Search query.
            Output must be structured JSON.""",
            output_schema=ResearchPlan
        )
        self.session_service = InMemorySessionService()
        self.runner = Runner(
            agent=self.agent,
            app_name="topic_research",
            session_service=self.session_service
        )

    async def plan_angles(self, theme: str, existing_titles: List[str]) -> List[Dict[str, str]]:
        prompt = f"Theme: {theme}\nExisting Topics: {json.dumps(existing_titles)}"
        
        user_content = types.Content(role='user', parts=[types.Part(text=prompt)])
        
        # Run agent
        # We use a unique session ID for this request
        session_id = f"plan_{os.urandom(4).hex()}"
        await self.session_service.create_session(app_name="topic_research", user_id="system", session_id=session_id)
        
        final_text = ""
        async for event in self.runner.run_async(user_id="system", session_id=session_id, new_message=user_content):
            if event.is_final_response() and event.content and event.content.parts:
                final_text = event.content.parts[0].text
        
        try:
            plan = ResearchPlan.model_validate_json(final_text)
            return [{"angle": a.angle, "query": a.query} for a in plan.angles]
        except Exception as e:
            print(f"Error parsing plan: {e}")
            return [
                {"angle": "Overview", "query": f"{theme} trends 2025"},
                {"angle": "Technical", "query": f"{theme} implementation guide"},
                {"angle": "Case Study", "query": f"{theme} real world examples"},
                {"angle": "Advanced", "query": f"advanced {theme} techniques"}
            ]

class ResearchWorker:
    def __init__(self, model_name: str = "gemini-3-flash-preview"):
        self.agent = Agent(
            name="researcher",
            model=model_name,
            instruction="""Research the provided query using Google Search. 
            Find 1-3 high-quality sources.
            Synthesize a compelling topic title and identify the content type.
            Return the result as structured JSON.""",
            tools=[google_search],
            output_schema=TopicResult
        )
        self.session_service = InMemorySessionService()
        self.runner = Runner(
            agent=self.agent,
            app_name="topic_research",
            session_service=self.session_service
        )

    async def execute_search(self, angle: str, query: str) -> Dict[str, Any]:
        prompt = f"Angle: {angle}\nQuery: {query}"
        user_content = types.Content(role='user', parts=[types.Part(text=prompt)])
        
        session_id = f"worker_{os.urandom(4).hex()}"
        await self.session_service.create_session(app_name="topic_research", user_id="system", session_id=session_id)
        
        final_text = ""
        async for event in self.runner.run_async(user_id="system", session_id=session_id, new_message=user_content):
            if event.is_final_response() and event.content and event.content.parts:
                final_text = event.content.parts[0].text
        
        try:
            result = TopicResult.model_validate_json(final_text)
            return result.model_dump()
        except Exception as e:
            print(f"Error parsing worker result: {e}")
            # Fallback (DDG could be added here if needed, but for now generic)
            return {
                "title": f"Discovery: {angle}",
                "type": "link",
                "sources": [f"https://www.google.com/search?q={query.replace(' ', '+')}"],
                "summary": "Manual search required due to research agent error."
            }

async def research_theme(theme_title: str, existing_titles: List[str]) -> List[Dict[str, Any]]:
    orchestrator = ResearchOrchestrator()
    worker = ResearchWorker()
    
    # 1. Plan
    angles = await orchestrator.plan_angles(theme_title, existing_titles)
    
    # 2. Execute Research for each angle
    tasks = [worker.execute_search(a['angle'], a['query']) for a in angles]
    results = await asyncio.gather(*tasks)
    
    return results
