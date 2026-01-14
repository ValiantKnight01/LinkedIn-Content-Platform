import asyncio
import aiohttp
from typing import List, Dict, Any
from ddgs import DDGS
from langchain_core.messages import SystemMessage, HumanMessage

from ...config import settings, get_llm
from ..tools.web import fetch_url
from .models import ResearchSynthesis
from .prompts import RESEARCH_SYNTHESIS_PROMPT


async def research_single_topic(
    title: str,
    learning_objective: str,
    search_queries: List[str],
    difficulty: str,
    day: int,
) -> Dict[str, Any]:
    """Executes deep research by searching, scraping, and synthesizing multiple sources."""
    print(f"--- Deep Researching: {title} ({settings.llm_provider}) ---")

    ddgs = DDGS()
    urls = []

    # 1. Search
    max_search_results = (
        20 if difficulty == "Beginner" else 35 if difficulty == "Intermediate" else 45
    )
    print(f"   > Step 1: Searching (Max results: {max_search_results})...")

    for query in search_queries:
        try:
            print(f"     - Query: {query}")
            results = list(
                ddgs.text(
                    query,
                    max_results=max_search_results // len(search_queries),
                    timelimit="y",
                )
            )
            urls.extend([r["href"] for r in results if "href" in r])
        except Exception as e:
            print(f"     ! Search error for query '{query}': {e}")

    # Deduplicate and limit to top 10 unique URLs
    unique_urls = list(dict.fromkeys(urls))[:10]
    print(f"   > Found {len(unique_urls)} unique URLs to scrape.")

    # 2. Scrape
    print(f"   > Step 2: Scraping content...")
    scraped_content = []
    async with aiohttp.ClientSession(
        headers={
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
        }
    ) as session:
        tasks = [fetch_url(session, url) for url in unique_urls]
        pages = await asyncio.gather(*tasks)

        for url, content in zip(unique_urls, pages):
            if content:
                scraped_content.append(f"Source: {url}\nContent: {content}")

    print(f"   > Successfully scraped {len(scraped_content)} pages.")

    if not scraped_content:
        print("   ! No content scraped. Ending research.")
        return {
            "summary": "Deep research failed to find or scrape relevant sources.",
            "sources": unique_urls,
            "status": "researched",
        }

    # 3. Synthesize
    print(f"   > Step 3: Synthesizing with {settings.llm_provider}...")
    llm = get_llm(temperature=0.5)
    structured_llm = llm.with_structured_output(ResearchSynthesis)

    context = "\n\n---\n\n".join(scraped_content)
    prompt = RESEARCH_SYNTHESIS_PROMPT.format(
        title=title,
        day=day,
        learning_objective=learning_objective,
        difficulty=difficulty,
        context=context,
    )

    try:
        synthesis = await structured_llm.ainvoke(
            [
                SystemMessage(
                    content="You are an expert researcher and LinkedIn content strategist."
                ),
                HumanMessage(content=prompt),
            ]
        )
        print("   + Synthesis complete.")
        return {
            "day": synthesis.day,
            "title": synthesis.title,
            "hook": synthesis.hook,
            "sections": [s.model_dump() for s in synthesis.sections],
            "key_takeaways": synthesis.key_takeaways,
            "call_to_action": synthesis.call_to_action,
            "hashtags": synthesis.hashtags,
            "sources": synthesis.sources,
            "status": "researched",
        }
    except Exception as e:
        print(f"   x Synthesis Error: {e}")
        return {
            "day": day,
            "title": title,
            "hook": "Error during synthesis.",
            "sections": [],
            "key_takeaways": [],
            "call_to_action": "",
            "hashtags": [],
            "sources": unique_urls,
            "status": "researched",
        }
