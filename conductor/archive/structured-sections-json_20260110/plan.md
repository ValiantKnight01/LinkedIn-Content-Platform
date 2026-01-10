# Implementation Plan - Structured Section Content

This plan details the steps to transition "Before vs After" and "Trade-offs" content to structured JSON.

## Phase 1: Backend Foundation (6b772cc)
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

## Phase 2: Agent Intelligence (2d380ac)
Update the AI agent prompts and response parsing.

- [x] Task: Update Topic Researcher prompts (a1b2c3d)
  - **How-to:**
    1. Edit `backend/src/agents/topic_researcher.py`.
    2. Locate the system prompt.
    3. Add specific instructions: "For 'Before vs After', return JSON with 'comparison' structure... For 'Trade-offs', return JSON with 'tradeoffs' structure...".
    4. Provide clear JSON examples for both.
- [x] Task: Update Agent Response Parser (e4f5g6h)
  - **How-to:**
    1. In `backend/src/agents/topic_researcher.py`, ensure the parsing logic captures these specific JSON blocks.
    2. Map the parsed JSON to the `comparison` and `tradeoffs` fields in the `Post` model.
- [x] Task: Verify Agent Output (i7j8k9l)
  - **How-to:**
    1. Run the agent locally.
    2. Check the database to confirm `comparison` and `tradeoffs` fields are populated.
- [ ] Task: Conductor - User Manual Verification 'Phase 2: Agent Intelligence' (Protocol in workflow.md)

## Phase 3: Frontend Interface (7551361)
Implement structured rendering for the new section types.

- [x] Task: Update Frontend Types (m1n2o3p)
  - **How-to:**
    1. Open `frontend/lib/store.ts` (or types file).
    2. Add `ComparisonItem` and `Tradeoffs` interfaces.
    3. Update `Section` to include these optional properties.
- [x] Task: Create `SectionComparison` Component (q4r5s6t)
  - **How-to:**
    1. Create `frontend/components/calendar/section-comparison.tsx`.
    2. Implement a comparison view (e.g., table or side-by-side list) using the `comparison` data.
- [x] Task: Create `SectionTradeoffs` Component (u7v8w9x)
  - **How-to:**
    1. Create `frontend/components/calendar/section-tradeoffs.tsx`.
    2. Implement visual distinct lists for `pros`, `cons`, and `constraints`.
- [x] Task: Integrate Structured Components into Post Preview (y1z2a3b)
  - **How-to:**
    1. Open `frontend/components/calendar/carousel-preview.tsx`.
    2. Add logic to render `SectionComparison` or `SectionTradeoffs` if the respective data exists; otherwise default to text.
- [ ] Task: Conductor - User Manual Verification 'Phase 3: Frontend Interface' (Protocol in workflow.md)

## Phase 4: Editor Integration (c865028)
Implement editing capabilities for structured sections.

- [x] Task: Create `ComparisonEditor` Component (c1d2e3f)
  - **How-to:**
    1. Create `frontend/components/calendar/comparison-editor.tsx`.
    2. Build a form using `Input` and `Button` to manage the list of `ComparisonItem`s.
    3. Allow adding new rows and deleting existing ones.
- [x] Task: Create `TradeoffsEditor` Component (g4h5i6j)
  - **How-to:**
    1. Create `frontend/components/calendar/tradeoffs-editor.tsx`.
    2. Build a form to manage three separate lists (Pros, Cons, Constraints) using a "tag input" or "list builder" style.
- [x] Task: Integrate Editors into Main Post Editor (k7l8m9n)
  - **How-to:**
    1. Locate the main post editing form (likely in `frontend/components/calendar/post-indicator.tsx`).
    2. When a section is of type "Comparison" or "Trade-offs" (or based on header detection), render the specialized editor instead of a standard `Textarea`.
- [ ] Task: Conductor - User Manual Verification 'Phase 4: Editor Integration' (Protocol in workflow.md)
