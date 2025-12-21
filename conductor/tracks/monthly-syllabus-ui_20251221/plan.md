# Implementation Plan: Frontend Monthly Syllabus View

## Phase 1: State Management & Types
- [x] Task: Define `Theme` types and create `useSyllabusStore` in `frontend/lib/store.ts`. (8c9b300)
- [x] Task: Implement async actions for CRUD operations against the FastAPI backend (running on `:8001`). (8c9b300)
- [ ] Task: Conductor - User Manual Verification 'State Management' (Protocol in workflow.md)

## Phase 2: Page & Component Creation
- [ ] Task: Create the `/monthly-themes` page at `frontend/app/(dashboard)/monthly-themes/page.tsx`.
- [ ] Task: Implement the `AddThemeDialog` component using `shadcn/ui` dialog and forms.
- [ ] Task: Build the `ThemeCard` component with "Digital Newsroom" styling.
- [ ] Task: Conductor - User Manual Verification 'Page & Component Creation' (Protocol in workflow.md)

## Phase 3: Sidebar Integration
- [ ] Task: Update `AppSidebar` to fetch the current month's theme from the `useSyllabusStore`.
- [ ] Task: Update navigation items to include "Monthly Themes" (without highlighting conflicts).
- [ ] Task: Conductor - User Manual Verification 'Sidebar Integration' (Protocol in workflow.md)

## Phase 4: Final Verification
- [ ] Task: Test the full flow: Add Theme -> View in List -> See in Sidebar.
- [ ] Task: Verify responsive layout and error handling for failed API calls.
- [ ] Task: Conductor - User Manual Verification 'Final Verification' (Protocol in workflow.md)
