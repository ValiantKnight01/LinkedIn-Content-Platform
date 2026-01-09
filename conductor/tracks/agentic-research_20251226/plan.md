# Implementation Plan: Agentic Topic Research

## Phase 1: Foundation & Data Model (bba5dd2)
- [x] Task: Create `backend/src/models/post.py` with `Post` document. (517c79b)
    -   *Action*: Create file `backend/src/models/post.py`.
    -   *Code Snippet*: `class Post(Document): title = StringField(); type = StringField(); sources = ListField(StringField()); theme = ReferenceField('Theme'); status = StringField(default='proposed'); created_at = DateTimeField(default=lambda: datetime.now(timezone.utc))`
- [x] Task: Register `Post` model. (c2adc39)
    -   *Action*: Update `backend/src/routes/themes.py` imports to include `Post`.
- [x] Task: Add dependencies. (4b37a78)
    -   *Action*: `run_shell_command("uv pip install google-adk duckduckgo-search")`
    -   *Action*: `run_shell_command("uv pip freeze > requirements.txt")`
- [ ] Task: Conductor - User Manual Verification 'Phase 1: Foundation & Data Model' (Protocol in workflow.md)

## Phase 2: Agent Implementation (Sub-Agent Architecture) (50595f6)
- [x] Task: Create `backend/src/agents/topic_researcher.py`. (de1379b)
- [x] Task: Implement `TopicResearchOrchestrator.plan_angles`. (a94a3f8)
    -   *Logic*: Use `google-adk` to prompt Gemini to generate 4 search queries for distinct angles based on the theme and existing titles.
- [x] Task: Implement `ResearchWorker.execute_search`. (a94a3f8)
    -   *Logic*: Use `google.adk.tools.google_search` with a fallback to `duckduckgo-search` (`DDGS().text()`).
    -   *Synthesis*: Extract Title, Type, and multiple source URLs for each angle.
- [x] Task: Implement main `research_theme(theme_id)` orchestration. (a94a3f8)
    -   *Logic*: Coordinate the orchestrator and parallel workers to produce the final 4 topic objects.
- [ ] Task: Conductor - User Manual Verification 'Phase 2: Agent Implementation' (Protocol in workflow.md)

## Phase 3: API & Integration
- [x] Task: Implement `POST /api/themes/{id}/research` in `backend/src/routes/themes.py`. (105b524)
    -   *Workflow*: Fetch Theme -> Get existing Post titles -> Call `research_theme` agent -> Save 4 `Post` objects -> Return JSON.
- [ ] Task: Conductor - User Manual Verification 'Phase 3: API & Integration' (Protocol in workflow.md)

## Phase 4: Frontend & Verification
- [ ] Task: Update `frontend/app/(dashboard)/syllabus/page.tsx`.
    -   *Action*: Add a button to trigger research for the active theme.
    -   *Action*: Append results to the "Proposed Topics" pool in the Kanban/List view.
- [ ] Task: Verify end-to-end flow.
    -   *Verification*: Click "Research", wait for agent, see 4 new cards with multiple sources appear in "Proposed".
- [ ] Task: Conductor - User Manual Verification 'Phase 4: Frontend & Verification' (Protocol in workflow.md)

## Phase 5: Refactor to LangGraph
- [x] Task: Refactor `topic_researcher.py` to use LangGraph with Anthropic Claude 4.5 Haiku. (0df48a7)
    -   *Logic*: Use LangGraph `StateGraph` with a Planner and Researcher both powered by `claude-haiku-4-5-20251001`.
- [x] Task: Conductor - User Manual Verification 'Phase 5: Refactor to LangGraph' (6bbc2fc)




