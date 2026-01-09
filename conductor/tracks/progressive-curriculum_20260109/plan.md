# Implementation Plan: Progressive Monthly Curriculum & Deep Research

## Phase 1: Data Model Updates (Checkpoint: 56fe293)
- [x] Task: Update `Post` model in `backend/src/models/post.py`. (b361cdf)
    -   *How To*: Add `day = IntField()`, `learning_objective = StringField()`, `difficulty = StringField()`, and `search_queries = ListField(StringField())`. Update `status` default to `'planned'`.
- [x] Task: Update `Post` schemas in `backend/src/schemas/`. (b361cdf)
    -   *How To*: Update Pydantic models to reflect `search_queries` (List[str]) and other new fields.
- [x] Task: Conductor - User Manual Verification 'Phase 1: Data Model Updates' (Protocol in workflow.md) (56fe293)

## Phase 2: Agent Refactor (Splitting & Deep Research) (Checkpoint: 45b8a36)
- [x] Task: Install scraping dependencies. (9f78d52)
    -   *How To*: `uv pip install beautifulsoup4 aiohttp`. Update `requirements.txt`.
- [x] Task: Refactor `backend/src/agents/topic_researcher.py` - Shared Config. (979d749)
    -   *How To*: Ensure `get_llm()` is accessible to both new functions and respects `LLM_PROVIDER`.
- [x] Task: Implement `plan_curriculum` function. (5a7de90)
    -   *How To*: Write prompt to generate monthly plan with *multiple* search queries per day. Use `get_llm()`. Return `List[DailyTopic]`.
- [x] Task: Implement `research_single_topic` with Scraping. (3308aeb)
    -   *How To*:
        1. `DDGS` search using `search_queries`.
        2. Filter top 10 URLs.
        3. Async fetch & `BeautifulSoup` clean.
        4. Concatenate cleaned text.
        5. Pass to `get_llm()` for synthesis.
- [x] Task: Conductor - User Manual Verification 'Phase 2: Agent Refactor' (Protocol in workflow.md)

## Phase 3: API & Backend Integration
- [x] Task: Update `POST /themes/{id}/plan` (Renamed from `/research`). (f7433e3)
    -   *How To*: Call `plan_curriculum`. Save `Post` objects with `search_queries` list.
- [~] Task: Create `POST /posts/{id}/research`.
    -   *How To*: Fetch Post. Call `research_single_topic`. Update `sources` (urls scraped), `summary` (synthesized text), and `status`.
- [ ] Task: Conductor - User Manual Verification 'Phase 3: API & Backend Integration' (Protocol in workflow.md)

## Phase 4: Frontend Implementation
- [ ] Task: Update Syllabus Calendar View.
    -   *How To*: Wire "Research Theme" to `/plan`. Display "Planned" cards.
- [ ] Task: Update Post Card/Detail View.
    -   *How To*: Add "Research Day" button. Show progress (scraping takes longer than simple search). Display rich result.
- [ ] Task: Conductor - User Manual Verification 'Phase 4: Frontend Implementation' (Protocol in workflow.md)
