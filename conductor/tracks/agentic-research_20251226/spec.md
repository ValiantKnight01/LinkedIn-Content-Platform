# Specification: Agentic Topic Research (Sub-Agent Architecture)

## Overview
This feature implements a sophisticated AI research system to generate 4 high-value content topics for a "Monthly Theme". It mimics the "Deep Research" pattern by using a lead orchestrator to plan distinct research angles and specialized sub-agent logic to execute targeted searches. Each generated topic synthesizes information from one or more search sources.

## Functional Requirements
1.  **New Data Model**:
    -   File: `backend/src/models/post.py`.
    -   Model: `Post` (Document).
    -   Fields: 
        - `title` (String)
        - `type` (Enum: 'link', 'article', 'forum')
        - `sources` (List of Strings/URLs)
        - `theme_id` (ObjectId)
        - `status` (Enum: 'proposed', 'selected', 'inDraft', 'scheduled')
        - `created_at` (DateTime)

2.  **Agentic Architecture (`backend/src/agents/topic_researcher.py`)**:
    -   **Orchestrator (Lead Agent)**:
        -   Analyzes the Monthly Theme and existing topics.
        -   Identifies 4 distinct "Research Angles".
    -   **Worker Logic (Sub-Agent)**:
        -   For each Angle:
            -   Executes targeted searches using `google.adk.tools.google_search`.
            -   **Multi-Source Synthesis**: Collects multiple relevant URLs to provide a comprehensive foundation for the topic.
            -   **Verification**: Checks for overlap with existing content.
            -   **Fallback**: Uses DuckDuckGo search if Google Search fails.
    -   **Synthesis**: Aggregates the results into 4 Post objects, each potentially containing multiple source URLs.

3.  **API Integration**:
    -   Endpoint: `POST /api/themes/{id}/research`
    -   Workflow: Retrieve context -> Execute Agent -> Persist 4 Posts with multiple sources.

4.  **Frontend Integration**:
    -   Page: `frontend/app/(dashboard)/syllabus/page.tsx`.
    -   Trigger: Button to initiate research for the active theme.
    -   Display: Append generated topics to the "Proposed" pool.

## Acceptance Criteria
- [ ] `Post` model supports a list of `sources`.
- [ ] Agent performs iterative, sub-agent style research.
- [ ] Agent handles fallbacks (DDG) and avoids duplicates.
- [ ] Each generated post contains 1 or more validated source URLs.
- [ ] UI triggers research and displays results in the proposed column.
