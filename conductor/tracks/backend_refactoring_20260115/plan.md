# Plan: Backend Refactoring & Modularization

## Phase 1: Shared Tools & Domain Preparation [Checkpoint: 9dae0c1]
- [x] Task: Create new directory structure
  - Create `backend/src/agents/tools`
  - Create `backend/src/agents/curriculum`
  - Create `backend/src/agents/research`
  - Commit SHA: 72b3311
- [x] Task: Extract Shared Web Tools
  - Create `backend/src/agents/tools/web.py`
  - Move `fetch_url` from `topic_researcher.py` to `web.py`
  - Ensure all necessary imports (aiohttp, BeautifulSoup) are included.
  - Commit SHA: 6630ce1
- [x] Task: Conductor - User Manual Verification 'Phase 1' (Protocol in workflow.md)

## Phase 2: Refactor Curriculum Planning Domain [Checkpoint: 5905471]
- [x] Task: Extract Curriculum Models
  - Create `backend/src/agents/curriculum/models.py`
  - Move `DailyTopic` and `CurriculumPlan` from `topic_researcher.py`.
  - Commit SHA: 8e7f54f
- [x] Task: Extract Curriculum Prompts
  - Create `backend/src/agents/curriculum/prompts.py`
  - Extract the curriculum planning prompt string into a constant `CURRICULUM_PLANNING_PROMPT`.
  - Commit SHA: 8ae8cc9
- [x] Task: Implement Curriculum Agent
  - Create `backend/src/agents/curriculum/agent.py`
  - Move `plan_curriculum` logic here.
  - Update imports to use the new local `models` and `prompts`.
  - Commit SHA: f18ce9b
- [x] Task: Conductor - User Manual Verification 'Phase 2' (Protocol in workflow.md)

## Phase 3: Refactor Deep Research Domain
- [ ] Task: Extract Research Models
  - Create `backend/src/agents/research/models.py`
  - Move `ResearchSynthesis`, `ResearchSection`, `TradeoffsContent`, `ComparisonContent`, `ComparisonItem`, `TopicResult`, `ResearchPlan`, `AnglePlan` from `topic_researcher.py`.
- [ ] Task: Extract Research Prompts
  - Create `backend/src/agents/research/prompts.py`
  - Extract the research synthesis prompt string into a constant `RESEARCH_SYNTHESIS_PROMPT`.
- [ ] Task: Implement Research Agent
  - Create `backend/src/agents/research/agent.py`
  - Move `research_single_topic` logic here.
  - Update imports to use the new local `models`, `prompts`, and shared `web` tools.
- [ ] Task: Conductor - User Manual Verification 'Phase 3' (Protocol in workflow.md)

## Phase 4: Integration & Cleanup
- [ ] Task: Update Route Imports
  - Update `backend/src/routes/themes.py` to import `plan_curriculum` from `backend.src.agents.curriculum.agent`.
  - Update `backend/src/routes/posts.py` to import `research_single_topic` from `backend.src.agents.research.agent`.
- [ ] Task: Delete Legacy File
  - Remove `backend/src/agents/topic_researcher.py`.
- [ ] Task: Final Verification
  - Ensure backend starts without import errors.
  - Verify `__init__.py` files exist in new directories for proper package resolution.
- [ ] Task: Conductor - User Manual Verification 'Phase 4' (Protocol in workflow.md)
