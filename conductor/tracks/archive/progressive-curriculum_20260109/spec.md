# Track Specification: Progressive Monthly Curriculum & Deep Research

## Overview
Refactor the research workflow into two phases: (1) Curriculum Planning (generating a month of topics with multiple queries) and (2) Deep Daily Research (scraping full content from search results for high-quality synthesis), supporting dynamic LLM providers (Groq/Claude).

## Functional Requirements
### 1. Phase A: Curriculum Planner (Theme Level)
- **Input:** Monthly Theme.
- **LLM:** Uses `LLM_PROVIDER` (Groq for dev, Claude for prod).
- **Logic:**
    - Calculate days in month.
    - Generate `CurriculumPlan` with `DailyTopic` objects.
    - **Key Change:** Generate `search_queries` (List[str]), not just one.
- **Output:** Create `Post` objects for every day (Status: `planned`).

### 2. Phase B: Deep Daily Researcher (Post Level)
- **Input:** A specific `Post` ID.
- **LLM:** Uses `LLM_PROVIDER`.
- **Logic:**
    - Retrieve `search_queries` and `difficulty`.
    - **Step 1: Search:** Use `DDGS` (limits: 20/35/45 based on difficulty).
    - **Step 2: Scrape:** Select top 10 relevant URLs. Async fetch and clean body text using `BeautifulSoup`.
    - **Step 3: Synthesize:** Pass FULL scraped content to LLM to generate the post draft.
- **Output:** Update `Post` with `sources` (list of scraped URLs), `summary`, and `status='researched'`.

## Technical Requirements
- **Libraries:** `beautifulsoup4`, `aiohttp` (for async fetching).
- **Agents:** Refactor to support the `LLM_PROVIDER` toggle across all nodes.
- **Models:** Update `Post` model for `search_queries` (ListField).

## Acceptance Criteria
- [ ] Planning phase uses the configured LLM provider.
- [ ] Post object stores multiple search queries.
- [ ] Research phase scrapes at least 10 URLs (verified by logs/output quality).
- [ ] Scraper handles basic errors (404, timeouts) gracefully.
- [ ] "Research Theme" button triggers the planning phase.
- [ ] Individual "Research Day" action triggers the deep research.
