# Implementation Plan - Structured Section Content

This plan details the steps to transition "Before vs After" and "Trade-offs" content to structured JSON.

## Phase 1: Backend Foundation
Update the data models and schemas to support structured content.

- [x] Task: Update `Section` schema/model (d1e2f3g)
  - **How-to:**
    1. Open `backend/src/schemas/post.py`.
    2. Define Pydantic models for `ComparisonItem` and `Tradeoffs`.
    3. Update the `Section` model to include optional fields: `comparison` (List[ComparisonItem]) and `tradeoffs` (Tradeoffs).
    4. Repeat similar updates for the MongoEngine model in `backend/src/models/post.py`.
- [x] Task: Update `Post` validation logic (h4i5j6k)
  - **How-to:**
    1. In `backend/src/routes/posts.py` (or relevant controller), ensure the new fields are accepted during creation/update.
    2. Add a simple test case or verify manually that passing the new structure works.
- [ ] Task: Conductor - User Manual Verification 'Phase 1: Backend Foundation' (Protocol in workflow.md)

## Phase 2: Agent Intelligence
Update the AI agent prompts and response parsing.

- [ ] Task: Update Topic Researcher prompts
  - **How-to:**
    1. Edit `backend/src/agents/topic_researcher.py`.
    2. Locate the system prompt.
    3. Add specific instructions: "For 'Before vs After', return JSON with 'comparison' structure... For 'Trade-offs', return JSON with 'tradeoffs' structure...".
    4. Provide clear JSON examples for both.
- [ ] Task: Update Agent Response Parser
  - **How-to:**
    1. In `backend/src/agents/topic_researcher.py`, ensure the parsing logic captures these specific JSON blocks.
    2. Map the parsed JSON to the `comparison` and `tradeoffs` fields in the `Post` model.
- [ ] Task: Verify Agent Output
  - **How-to:**
    1. Run the agent locally.
    2. Check the database to confirm `comparison` and `tradeoffs` fields are populated.
- [ ] Task: Conductor - User Manual Verification 'Phase 2: Agent Intelligence' (Protocol in workflow.md)

## Phase 3: Frontend Interface
Implement structured rendering for the new section types.

- [ ] Task: Update Frontend Types
  - **How-to:**
    1. Open `frontend/lib/store.ts` (or types file).
    2. Add `ComparisonItem` and `Tradeoffs` interfaces.
    3. Update `Section` to include these optional properties.
- [ ] Task: Create `SectionComparison` Component
  - **How-to:**
    1. Create `frontend/components/calendar/section-comparison.tsx`.
    2. Implement a comparison view (e.g., table or side-by-side list) using the `comparison` data.
- [ ] Task: Create `SectionTradeoffs` Component
  - **How-to:**
    1. Create `frontend/components/calendar/section-tradeoffs.tsx`.
    2. Implement visual distinct lists for `pros`, `cons`, and `constraints`.
- [ ] Task: Integrate Structured Components into Post Preview
  - **How-to:**
    1. Open `frontend/components/calendar/carousel-preview.tsx`.
    2. Add logic to render `SectionComparison` or `SectionTradeoffs` if the respective data exists; otherwise default to text.
- [ ] Task: Conductor - User Manual Verification 'Phase 3: Frontend Interface' (Protocol in workflow.md)
