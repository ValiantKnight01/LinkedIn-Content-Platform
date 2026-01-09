# Implementation Plan: Progressive Monthly Curriculum & Deep Research

## Phase 1: Data Model Updates
- [~] Task: Update `Post` model in `backend/src/models/post.py`.
    -   *How To*: Add `day = IntField()`, `learning_objective = StringField()`, `difficulty = StringField()`, and `search_queries = ListField(StringField())`. Update `status` default to `'planned'`.
- [~] Task: Update `Post` schemas in `backend/src/schemas/`.
    -   *How To*: Update Pydantic models to reflect `search_queries` (List[str]) and other new fields.
- [ ] Task: Conductor - User Manual Verification 'Phase 1: Data Model Updates' (Protocol in workflow.md)

## Phase 2: Agent Refactor (Splitting & Deep Research)
- [ ] Task: Install scraping dependencies.
    -   *How To*: `uv pip install beautifulsoup4 aiohttp`. Update `requirements.txt`.
- [ ] Task: Refactor `backend/src/agents/topic_researcher.py` - Shared Config.
    -   *How To*: Ensure `get_llm()` is accessible to both new functions and respects `LLM_PROVIDER`.
- [ ] Task: Implement `plan_curriculum` function.
    -   *How To*: Write prompt to generate monthly plan with *multiple* search queries per day. Use `get_llm()`. Return `List[DailyTopic]`.
- [ ] Task: Implement `research_single_topic` with Scraping.
    -   *How To*:
        1. `DDGS` search using `search_queries`.
        2. Filter top 10 URLs.
        3. Async fetch & `BeautifulSoup` clean.
        4. Concatenate cleaned text.
        5. Pass to `get_llm()` for synthesis.
- [ ] Task: Conductor - User Manual Verification 'Phase 2: Agent Refactor' (Protocol in workflow.md)

## Phase 3: API & Backend Integration
- [ ] Task: Update `POST /themes/{id}/plan` (Renamed from `/research`).
    -   *How To*: Call `plan_curriculum`. Save `Post` objects with `search_queries` list.
- [ ] Task: Create `POST /posts/{id}/research`.
    -   *How To*: Fetch Post. Call `research_single_topic`. Update `sources` (urls scraped), `summary` (synthesized text), and `status`.
- [ ] Task: Conductor - User Manual Verification 'Phase 3: API & Backend Integration' (Protocol in workflow.md)

## Phase 4: Frontend Implementation
- [ ] Task: Update Syllabus Calendar View.
    -   *How To*: Wire "Research Theme" to `/plan`. Display "Planned" cards.
- [ ] Task: Update Post Card/Detail View.
    -   *How To*: Add "Research Day" button. Show progress (scraping takes longer than simple search). Display rich result.
- [ ] Task: Conductor - User Manual Verification 'Phase 4: Frontend Implementation' (Protocol in workflow.md)
