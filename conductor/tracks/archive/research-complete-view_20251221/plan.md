# Plan: Research Complete View

## Phase 1: Next.js API Routes & Data Model
- [x] Task: Update Mock Data Structure
    - Define extended `KanbanCard` type with `research_status`, `angle`, `read_time`, `description`, etc.
    - Update `frontend/app/api/newsroom/route.ts` (GET) to return cards with these new fields.
- [x] Task: Create/Update API Routes
    - Create `frontend/app/api/newsroom/[id]/route.ts` to handle:
        - `PATCH`: Update card details (Title, Angle) and status (for Approval).
        - `DELETE`: Handle "Discard Idea".
    - Ensure these routes simulate the logic (updating in-memory mock data) and return appropriate responses.

## Phase 2: Frontend State & Types
- [x] Task: Update Frontend Types
    - Update `KanbanCard` interface in `frontend/lib/store.ts` to match the API response structure.
- [x] Task: Update Store Actions
    - Add `approveCard(id, data)`: Calls `PATCH /api/newsroom/[id]` with `status: 'inDraft'`.
    - Add `discardCard(id)`: Calls `DELETE /api/newsroom/[id]`.
    - Add `updateCardDetails(id, data)`: Calls `PATCH /api/newsroom/[id]`.

## Phase 3: UI Implementation
- [x] Task: Implement Research Complete Sheet Component
    - Create `frontend/components/newsroom/research-complete-sheet.tsx`.
    - Implement the layout based on `frontend/references/editorial-view-research-complete/code.html`.
    - Integrate `shadcn/ui` Sheet, Input, and Select (Dropdown) components.
- [x] Task: Update Kanban Card Component
    - Add visual indicator for `researchStatus` in `kanban-card.tsx` (only for 'selected' column).
    - Add click handler: If `status === 'selected'` and `researchStatus === 'complete'`, open the Sheet.
- [x] Task: Integration
    - Connect Sheet "Approve" button to `approveCard`.
    - Connect Sheet "Discard" button to `discardCard`.
    - Connect Input/Select changes to local state, then save on "Approve" (or auto-save via `updateCardDetails` if preferred, but "Approve" action usually commits the move).

## Phase 4: Verification & Polish
- [x] Task: Manual Verification
    - Verify data is fetched correctly from the Next.js API.
    - Verify "Approve" triggers the API and updates the UI (moves to Draft).
    - Verify "Discard" triggers the API and removes the card.
    - Check strictly against "Digital Newsroom" design guidelines.
- [ ] Task: Conductor - User Manual Verification 'Phase 4: Verification & Polish' (Protocol in workflow.md)
