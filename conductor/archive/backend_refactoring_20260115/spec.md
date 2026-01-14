# Specification: Backend Refactoring & Modularization

## Overview
The goal of this track is to refactor the backend `topic_researcher.py` agent by splitting it into distinct, domain-specific sub-modules. We will organize the code into `curriculum` and `research` directories, each containing their own prompts, models, and agent logic, while extracting shared tools.

## Functional Requirements

### 1. Extract Shared Tools
- Create `backend/src/agents/tools/web.py`.
- Move `fetch_url` and web scraping logic here.

### 2. Refactor "Curriculum Planning" Domain
- Create directory `backend/src/agents/curriculum/`.
- **Prompts:** Create `backend/src/agents/curriculum/prompts.py` for curriculum planning prompts.
- **Models:** Create `backend/src/agents/curriculum/models.py` for `CurriculumPlan`, `DailyTopic` schemas.
- **Logic:** Create `backend/src/agents/curriculum/agent.py`. Move `plan_curriculum` logic here.

### 3. Refactor "Deep Research" Domain
- Create directory `backend/src/agents/research/`.
- **Prompts:** Create `backend/src/agents/research/prompts.py` for synthesis and research prompts.
- **Models:** Create `backend/src/agents/research/models.py` for `ResearchSynthesis`, `ResearchSection`, `TopicResult`, etc.
- **Logic:** Create `backend/src/agents/research/agent.py`. Move `research_single_topic` logic here.

### 4. Update References & Cleanup
- Update `backend/src/routes/themes.py` to import `plan_curriculum` from the new location.
- Update `backend/src/routes/posts.py` to import `research_single_topic` from the new location.
- Delete the original `backend/src/agents/topic_researcher.py`.
- Remove all legacy code (Legacy Research Theme Flow) that is not transferred to the new files.

## Non-Functional Requirements
- **Maintainability:** Clear separation of concerns by domain.
- **Consistency:** Follow existing Python code style.

## Acceptance Criteria
- `topic_researcher.py` is deleted.
- New folder structure exists and is populated.
- `routes/themes.py` and `routes/posts.py` imports are updated and valid.
- Application starts without errors.
- Curriculum planning and deep research features work as before.

## Out of Scope
- Service layer extraction for routes.
- Frontend changes.
