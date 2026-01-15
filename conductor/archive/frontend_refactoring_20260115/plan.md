# Plan: Frontend Refactoring (Phase 1)

## Phase 1: Preparation & Logic Extraction [Checkpoint: 298500a]
- [x] Task: Create Hook File
  - Create `frontend/hooks/use-post-editor.ts`.
  - Define the `usePostEditor` hook signature.
- [x] Task: Extract Logic
  - Move state variables (`isResearching`, `isSaving`, `editData`, etc.) from `PostIndicator` to `usePostEditor`.
  - Move handler functions (`handleResearch`, `handleDownloadPDF`, `handleSave`) to the hook.
  - Implement standardized `NEXT_PUBLIC_API_URL` usage for the PDF download fetch call.
- [x] Task: Conductor - User Manual Verification 'Phase 1' (Protocol in workflow.md)

## Phase 2: UI Decomposition [Checkpoint: a97332e]
- [x] Task: Create Editor Sheet Component
  - Create `frontend/components/calendar/post-editor-sheet.tsx`.
  - Move the `SheetContent` and its children (Tabs, Forms, etc.) from `PostIndicator` to this new component.
  - Define props interface to accept state and handlers from the hook.
- [x] Task: Refactor PostIndicator
  - Update `frontend/components/calendar/post-indicator.tsx`.
  - Import and use `usePostEditor` hook.
  - Import and render `PostEditorSheet`, passing the necessary props.
  - Ensure the "Trigger" (the indicator badge) remains in `PostIndicator`.
- [x] Task: Conductor - User Manual Verification 'Phase 2' (Protocol in workflow.md)

## Phase 3: Final Verification & Cleanup
- [x] Task: Verify PDF Export
  - User to manually test the PDF export functionality to ensure the API URL refactor didn't break it.
- [x] Task: Verify Post Updates
  - User to manually test saving changes to a post.
- [x] Task: Verify Research Agent
  - User to manually test triggering the research agent from the editor.
- [x] Task: Conductor - User Manual Verification 'Phase 3' (Protocol in workflow.md)
