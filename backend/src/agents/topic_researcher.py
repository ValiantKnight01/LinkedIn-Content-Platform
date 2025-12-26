import asyncio
import json
import os
from typing import Any, Dict, List, Optional

from duckduckgo_search import DDGS
from google.genai import Client, types

# Ensure API key is set
# os.environ["GOOGLE_API_KEY"] must be set

class TopicResearchOrchestrator:
    def __init__(self, model_name: str = "gemini-3-flash-preview"):
        self.client = Client(api_key=os.environ.get("GOOGLE_API_KEY"))
        self.model_name = model_name

    async def plan_angles(self, theme: str, existing_titles: List[str]) -> List[Dict[str, str]]:
        """
        Generates 4 distinct research angles.
        Returns a list of dicts: [{'angle': '...', 'query': '...'}, ...]
        """
        prompt = f"""
        Theme: "{theme}"
        Existing Topics: {json.dumps(existing_titles)}

        Task: Generate 4 DISTINCT research angles for new content.
        For each angle, provide:
        1. A short name (e.g., "Performance Benchmarks")
        2. A specific Google Search query to find a high-quality source.

        Output MUST be a valid JSON list of objects with keys "angle" and "query".
        Example:
        [
            {{"angle": "Technical Deep Dive", "query": "RAG vector database benchmarks 2024"}},
            ...
        ]
        """

        try:
            response = await self.client.aio.models.generate_content(
                model=self.model_name,
                contents=prompt,
                config={"response_mime_type": "application/json"},
            )

            content = response.text
            angles = json.loads(content)
            return angles[:4]

        except Exception as e:
            print(f"Error generating angles: {e}")
            # Fallback
            return [
                {"angle": "General Overview", "query": f"{theme} overview guide"},
                {"angle": "Advanced Techniques", "query": f"advanced {theme} techniques"},
                {"angle": "Case Studies", "query": f"{theme} case studies"},
                {"angle": "Future Trends", "query": f"future of {theme} 2025"},
            ]


class ResearchWorker:
    def __init__(self, model_name: str = "gemini-3-flash-preview"):
        self.client = Client(api_key=os.environ.get("GOOGLE_API_KEY"))
        self.model_name = model_name
        self.ddgs = DDGS()

    async def execute_search(self, angle: str, query: str) -> Dict[str, Any]:
        """
        Executes search for a given angle/query.
        Returns a dict with post data (title, type, sources).
        """
        print(f"Searching for angle: {angle} with query: {query}")

        # 1. Try Google Search (Grounding)
        try:
            # We ask the model to use Google Search to find the info and return it as JSON.
            # We explicitly ask for the URL in the JSON fields.
            search_prompt = f"""
            Task: Research the query "{query}" using Google Search.
            Find a high-quality, definitive source (article, forum discussion, or documentation).

            Return a JSON object with:
            - "title": A compelling title for a post about this resource.
            - "type": One of ['link', 'article', 'forum'].
            - "sources": A list of strings, containing the specific URL(s) found.
            - "summary": A brief 1-sentence summary of what the source covers.

            Ensure the URL is real and comes from the search results.
            """

            response = await self.client.aio.models.generate_content(
                model=self.model_name,
                contents=search_prompt,
                config=types.GenerateContentConfig(
                    tools=[types.Tool(google_search=types.GoogleSearch())],
                    response_mime_type="application/json",
                ),
            )

            content = response.text
            result = json.loads(content)

            # Basic validation
            if not result.get("sources") or not result["sources"][0].startswith("http"):
                raise ValueError("No valid URL returned by Google Search agent.")

            return result

        except Exception as e:
            print(f"Google Search agent failed ({e}), trying DuckDuckGo...")
            try:
                # Fallback to DDGS
                ddg_results = list(self.ddgs.text(query, max_results=3))
                if ddg_results:
                    top_result = ddg_results[0]
                    return {
                        "title": top_result["title"],
                        "type": "link",
                        "sources": [top_result["href"]],
                    }
            except Exception as e2:
                print(f"DDG failed too: {e2}")

        # Fallback if everything fails
        return {"title": f"{angle}: {query}", "type": "article", "sources": []}


async def research_theme(
    theme_title: str, existing_titles: List[str]
) -> List[Dict[str, Any]]:
    orchestrator = TopicResearchOrchestrator()
    worker = ResearchWorker()

    # 1. Plan
    angles = await orchestrator.plan_angles(theme_title, existing_titles)

    # 2. Execute Workers in Parallel
    tasks = [worker.execute_search(a["angle"], a["query"]) for a in angles]
    results = await asyncio.gather(*tasks)

    return results