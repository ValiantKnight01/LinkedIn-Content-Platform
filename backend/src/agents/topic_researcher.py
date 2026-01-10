import json
import calendar
import asyncio
import aiohttp
from datetime import datetime
from typing import List, Dict, Any, Optional, TypedDict
from bs4 import BeautifulSoup

from langchain_core.messages import SystemMessage, HumanMessage
from pydantic import BaseModel, Field
from ddgs import DDGS
from langgraph.graph import StateGraph, END

from ..config import settings, get_llm

# --- Schemas ---

class DailyTopic(BaseModel):
    day: int = Field(description="The day of the month (1-31)")
    title: str = Field(description="A compelling title for the post")
    learning_objective: str = Field(description="What the reader will learn")
    difficulty: str = Field(description="Difficulty level: Beginner, Intermediate, Advanced")
    type: str = Field(description="Type of post: link, article, or forum")
    search_queries: List[str] = Field(description="3-5 specific search queries for deep research")

class CurriculumPlan(BaseModel):
    topics: List[DailyTopic] = Field(description="List of daily topics for the entire month")

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

class ResearchSection(BaseModel):
    header: str = Field(description="The section header (plain text, no emojis)")
    content: str = Field(description="The main content of the section (plain text, no emojis)")
    example_use_case: Optional[str] = Field(None, description="A practical example or use case (plain text, no emojis)")

class ResearchSynthesis(BaseModel):
    day: int = Field(description="The day of the curriculum")
    title: str = Field(description="A compelling title for the post (plain text, no emojis)")
    hook: str = Field(description="An engaging opening hook for the LinkedIn post (plain text, no emojis)")
    sections: List[ResearchSection] = Field(description="The main body sections of the post")
    key_takeaways: List[str] = Field(description="3-5 key takeaways (plain text, no emojis)")
    call_to_action: str = Field(description="A question or statement to encourage engagement (plain text, no emojis)")
    hashtags: List[str] = Field(description="Relevant LinkedIn hashtags (no # symbol, just the words)")
    sources: List[str] = Field(description="The most relevant source URLs used")

# --- State ---

class AgentState(TypedDict):
    theme: str
    existing_titles: List[str]
    plan: Optional[ResearchPlan]
    results: List[Dict[str, Any]]

# --- Utilities ---

async def fetch_url(session: aiohttp.ClientSession, url: str) -> Optional[str]:
    """Fetches a URL and returns cleaned text content."""
    try:
        async with session.get(url, timeout=15) as response:
            if response.status != 200:
                print(f"      ! Failed to fetch {url}: Status {response.status}")
                return None
            html = await response.text()
            soup = BeautifulSoup(html, 'html.parser')
            
            # Remove scripts, styles, nav, and footers
            for element in soup(['script', 'style', 'nav', 'footer', 'header']):
                element.decompose()
            
            # Extract text
            text = soup.get_text(separator=' ', strip=True)
            return text[:6000] # Limit per source
    except Exception as e:
        print(f"      ! Error fetching {url}: {e}")
        return None

# --- Curriculum Planning ---

async def plan_curriculum(theme_title: str, month: int, year: int) -> List[Dict[str, Any]]:
    """Generates a monthly curriculum plan for a given theme."""
    print(f"--- Planning Curriculum: {theme_title} for {month}/{year} ({settings.llm_provider}) ---")
    
    num_days = calendar.monthrange(year, month)[1]
    llm = get_llm(temperature=0.7)
    structured_llm = llm.with_structured_output(CurriculumPlan)

    prompt = f"""You are an expert content strategist and educator.
    Theme: {theme_title}
    Target Month: {month}/{year} ({num_days} days)

    Create a progressive 30-day (or {num_days}-day) curriculum. 
    The curriculum should start with foundational concepts and gradually move to advanced topics.
    
    For EACH day, provide:
    1. A compelling title.
    2. A clear learning objective.
    3. Difficulty level (Beginner for first 10 days, Intermediate for next 10, Advanced for last 10).
    4. Content type (link, article, or forum).
    5. 3-5 specific, high-intent search queries that will be used to scrape deep information for that day's post.

    Ensure the topics are distinct and follow a logical learning path.
    """
    
    try:
        plan = await structured_llm.ainvoke([
            SystemMessage(content="You are an expert curriculum planner."),
            HumanMessage(content=prompt)
        ])
        print(f"   + Successfully planned {len(plan.topics)} topics.")
        return [topic.dict() for topic in plan.topics]
    except Exception as e:
        print(f"   x Curriculum Planning Error: {e}")
        return []

# --- Deep Research ---

async def research_single_topic(title: str, learning_objective: str, search_queries: List[str], difficulty: str, day: int) -> Dict[str, Any]:
    """Executes deep research by searching, scraping, and synthesizing multiple sources."""
    print(f"--- Deep Researching: {title} ({settings.llm_provider}) ---")
    
    ddgs = DDGS()
    urls = []
    
    # 1. Search
    max_search_results = 20 if difficulty == "Beginner" else 35 if difficulty == "Intermediate" else 45
    print(f"   > Step 1: Searching (Max results: {max_search_results})...")
    
    for query in search_queries:
        try:
            print(f"     - Query: {query}")
            results = list(ddgs.text(query, max_results=max_search_results // len(search_queries), timelimit="y"))
            urls.extend([r['href'] for r in results if 'href' in r])
        except Exception as e:
            print(f"     ! Search error for query '{query}': {e}")
    
    # Deduplicate and limit to top 10 unique URLs
    unique_urls = list(dict.fromkeys(urls))[:10]
    print(f"   > Found {len(unique_urls)} unique URLs to scrape.")
    
    # 2. Scrape
    print(f"   > Step 2: Scraping content...")
    scraped_content = []
    async with aiohttp.ClientSession(headers={"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"}) as session:
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
            "status": "researched"
        }

    # 3. Synthesize
    print(f"   > Step 3: Synthesizing with {settings.llm_provider}...")
    llm = get_llm(temperature=0.5)
    structured_llm = llm.with_structured_output(ResearchSynthesis)
    
    context = "\n\n---\n\n".join(scraped_content)
    prompt = f"""
        Topic: {title}
        Day: {day}
        Learning Objective: {learning_objective}
        Difficulty: {difficulty}

        Researched Content:
        {context}

        Create a LinkedIn post following this EXACT structure. Missing ANY section = FAIL.

        MANDATORY SECTIONS (in order):
        1. Hook (max 3 sentences, must include 2+ numbers)
        2. Problem (why old methods failed)
        3. Solution (what attention mechanism does differently)
        4. How It Works (explain mechanism with analogy)
        5. Before vs After (side-by-side comparison table format)
        6. Trade-offs (3+ benefits, 3+ challenges)
        7. Key Takeaways (5-7 bullets, actionable + surprising)
        8. Call to Action (personal question, not abstract)

        CRITICAL: Each of the body sections (Problem, Solution, How It Works, Before vs After, Trade-offs) MUST have a specific, detailed Company Example populated in its `example_use_case` field. Do NOT create a separate "Real Examples" section. Distribute the high-quality company examples (Google, etc.) across these sections.

        ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

        CRITICAL HOOK RULES (STRICTLY ENFORCE):

        ✓ DO:
        - Start with concrete scenario: "You do X. Models do Y. How?"
        - Include 2+ specific numbers
        - Max 3 sentences (preferably 2)
        - Conversational tone

        ✗ DON'T:
        - NO semicolons (;) in hook - EVER
        - NO academic writing style
        - NO marketing fluff ("revolutionary", "game-changing")
        - NO sentences over 25 words
        - NO vague statements without numbers

        TEST YOUR HOOK:
        - Contains semicolon? → REJECT, rewrite
        - Over 3 sentences? → REJECT, shorten
        - No numbers? → REJECT, add metrics
        - Sounds like academic paper? → REJECT, make conversational

        ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

        EXAMPLE RULES (DISTRIBUTED):

        You must find 3-4 high-quality company examples.
        Instead of listing them in one block, ASSIGN each one to the most relevant section using the `example_use_case` field.
        
        CRITICAL: EVERY section (Problem, Solution, etc.) MUST have a populated `example_use_case`.

        For EACH example used:

        1. Company/Product Name (specific)
        2. Specific Feature (not "their system" - name it)
        3. Technical Details (2-3 sentences on HOW)
        4. Business Metrics (separate accuracy from revenue)
        5. Time Period (when this happened)

        FORMAT TEMPLATE:
        "[Company]'s [Product Name] ([Year]):
        - Technical approach: [How they use attention - 2 details]
        - Accuracy improvement: [Before X% → After Y%]
        - Business impact: [Revenue/cost/time saved with $]
        - Key insight: [Interesting detail]"

        SEPARATE CLEARLY:
        - Prediction accuracy: "Forecasting accuracy improved from 72% to 94%"
        - Business outcome: "This accuracy gain saved $120M in energy costs"

        NEVER write: "predicted X resulting in Y% revenue increase" (confusing!)

        CRITICAL SOURCE RULE (ANTI-HALLUCINATION):
        - You must ONLY use numbers ($, %, dates) that appear in the provided `Researched Content`.
        - DO NOT generate plausible-sounding business metrics (like '$2.3M saved' or '40% reduction') unless they are explicitly in the source text.
        - **PRIORITY OVERRIDE:** If you cannot find specific numbers to satisfy the "3 numbers per post" rule, DO NOT INVENT THEM. Use qualitative descriptions (e.g., "significant reduction", "faster processing") instead.
        - ACCURACY IS MORE IMPORTANT THAN FORMATTING. Hallucinating numbers = IMMEDIATE FAIL.

        ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

        BEFORE vs AFTER FORMAT:

        Always include comparison in this format:

        Traditional Methods ([Method Name]):
        → Accuracy: [X%]
        → Forecast horizon: [timeframe]
        → Cost: [$]
        → Limitations: [what it couldn't do]

        With Attention Mechanisms:
        → Accuracy: [Y%] (+Z%)
        → Forecast horizon: [longer timeframe]
        → Cost savings: [$]
        → New capabilities: [what it can do now]

        Result: [Company] saved $[X] from [year] to [year]

        ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

        TECHNICAL TERMS (Days 1-10 ONLY):

        If you mention ANY of these terms, define them IMMEDIATELY:
        - ARIMA → "AutoRegressive Integrated Moving Average - a 1970s statistical method that assumes smooth patterns"
        - Transformer → "Deep learning architecture from 2017 that uses attention to focus on relevant data"
        - RNN → "Recurrent Neural Network - processes sequences step-by-step"
        - MAE/RMSE/F1 → Convert to simple language: "Accuracy improved from 65% to 95%"

        FORMAT: [Term] → [One sentence definition] → [When/why it's used]

        NO jargon dumps. If you use a technical term, explain it in the SAME sentence.

        ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

        WRITING STYLE (MANDATORY):

        Sentence rules:
        - Average length: 12-15 words
        - Maximum length: 25 words
        - NO semicolons anywhere (use periods)
        - NO run-on sentences

        Paragraph rules:
        - Maximum: 4 sentences per paragraph
        - Prefer: 2-3 sentences
        - Add blank line between paragraphs

        Tone:
        - Conversational (write like you're explaining to a friend)
        - Active voice ("Google built" not "was built by Google")
        - Direct ("This works" not "This can potentially work")

        ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

        TRADE-OFFS SECTION (MANDATORY):

        Benefits (3-4 points):
        ✓ [Specific improvement with %]
        ✓ [Capability that didn't exist before]
        ✓ [Speed/cost advantage with numbers]

        Challenges (3-4 points):
        ✗ [Resource requirement with numbers]
        ✗ [Limitation with specific scenario]
        ✗ [Downside with real-world example]

        When NOT to use:
        → [Scenario 1 with reason]
        → [Scenario 2 with reason]

        Real-world problem: [1 specific example of when attention failed/had issues]

        ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

        KEY TAKEAWAYS FORMAT:

        Each takeaway must be ONE of these types:
        → Surprising metric: "[Technology] improved [metric] from X% to Y%"
        → Business impact: "[Company] saved/earned $X using [technology]"
        → Actionable tool: "Start with [specific tool/library name]"
        → Key limitation: "Minimum [number] data points needed"
        → Best use case: "Works best for [specific industry/problem]"

        Minimum 5 takeaways, maximum 7.
        Each must include numbers OR specific product names OR actionable advice.

        NO generic statements like "Attention mechanisms are powerful" ← REJECT

        ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

        CALL TO ACTION:

        ✗ DON'T ask abstract questions: "What are potential applications in your industry?"

        ✓ DO ask personal questions:
        - "What's the weirdest recommendation you've gotten?"
        - "Have you noticed [product] getting better? What changed?"
        - "What's the hardest forecasting problem in your work?"

        Make it about THEIR experience, not hypothetical scenarios.

        ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

        FINAL VALIDATION CHECKLIST:

        Before submitting, verify:
        □ Hook has 2+ numbers and no semicolons
        □ All 9 sections present
        □ 3+ company examples with specific products
        □ Each example has: accuracy metrics + business impact + timeframe
        □ Before/After comparison included
        □ Trade-offs section has benefits + challenges + when not to use
        □ All technical terms defined (for Days 1-10)
        □ No sentences over 25 words
        □ No marketing fluff in hook
        □ CTA is personal, not abstract
        □ 5+ actionable takeaways

        If ANY checkbox is unchecked → FIX before submitting.

        ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

        JSON STRUCTURE MAPPING (CRITICAL):
        - "Hook" content goes to -> `hook` field
        - "Key Takeaways" content goes to -> `key_takeaways` field
        - "Call to Action" content goes to -> `call_to_action` field
        - ALL OTHER BODY CONTENT (Problem, Solution, How it works, Examples, Trade-offs) goes to -> `sections` list
        - Do NOT put Takeaways or CTA in the `sections` list.

        Now generate the post following ALL rules above.
    """
    
    try:
        synthesis = await structured_llm.ainvoke([
            SystemMessage(content="You are an expert researcher and LinkedIn content strategist."),
            HumanMessage(content=prompt)
        ])
        print("   + Synthesis complete.")
        return {
            "day": synthesis.day,
            "title": synthesis.title,
            "hook": synthesis.hook,
            "sections": [s.dict() for s in synthesis.sections],
            "key_takeaways": synthesis.key_takeaways,
            "call_to_action": synthesis.call_to_action,
            "hashtags": synthesis.hashtags,
            "sources": synthesis.sources,
            "status": "researched"
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
            "status": "researched"
        }

# --- Nodes (Legacy Research Theme Flow) ---

def planner_node(state: AgentState):
    """Generates research angles using the configured LLM."""
    print(f"--- Planning: {state['theme']} ({settings.llm_provider}) ---")
    
    llm = get_llm(temperature=0.7)
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
        return {"plan": ResearchPlan(angles=[
            AnglePlan(angle="Overview", query=f"{state['theme']} trends 2026"),
            AnglePlan(angle="Technical", query=f"{state['theme']} implementation"),
            AnglePlan(angle="Examples", query=f"{state['theme']} case studies"),
            AnglePlan(angle="Deep Dive", query=f"advanced {state['theme']} concepts")
        ])}

def researcher_node(state: AgentState):
    """Executes search and synthesizes results using the configured LLM and DDGS."""
    print(f"--- Researching ({settings.llm_provider}) ---")
    
    plan = state.get("plan")
    if not plan:
        return {"results": []}

    ddgs = DDGS()
    llm = get_llm(temperature=0.5)
    structured_llm = llm.with_structured_output(TopicResult)

    results = []
    
    for angle in plan.angles:
        print(f"  > Searching: {angle.angle}...")
        try:
            search_results = list(ddgs.text(angle.query, max_results=20, timelimit="y"))
            context = "\n\n".join([
                f"Source: {r.get('href')}\nTitle: {r.get('title')}\nSnippet: {r.get('body')}"
                for r in search_results
            ])
            
            prompt = f"""Research Angle: {angle.angle}
            Search Query: {angle.query}
            Search Results:
            {context}
            
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
    
    final_state = await app.ainvoke(initial_state)
    return final_state["results"]
