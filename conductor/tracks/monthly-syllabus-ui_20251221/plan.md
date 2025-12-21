# Implementation Plan: Frontend Monthly Syllabus View

## Phase 1: State Management & Types (9a23080)
- [x] Task: Define `Theme` types and create `useSyllabusStore` in `frontend/lib/store.ts`. (8c9b300)
- [x] Task: Implement async actions for CRUD operations against the FastAPI backend (running on `:8001`). (8c9b300)
- [x] Task: Conductor - User Manual Verification 'State Management' (Protocol in workflow.md) (9a23080)

## Phase 2: Page & Component Creation
- [x] Task: Create the `/monthly-themes` page at `frontend/app/(dashboard)/monthly-themes/page.tsx`. (f2a1b3c)
- [x] Task: Implement the `AddThemeDialog` component using `shadcn/ui` dialog and forms. (f2a1b3c)
- [x] Task: Build the `ThemeCard` component with "Digital Newsroom" styling. (f2a1b3c)
- [x] Task: Conductor - User Manual Verification 'Page & Component Creation' (Protocol in workflow.md) (f2a1b3c)

## Phase 3: Sidebar Integration
- [x] Task: Update `AppSidebar` to fetch the current month's theme from the `useSyllabusStore`. (e4d2f1a)
- [x] Task: Update navigation items to include "Monthly Themes" (without highlighting conflicts). (e4d2f1a)
- [x] Task: Conductor - User Manual Verification 'Sidebar Integration' (Protocol in workflow.md) (e4d2f1a)

## Phase 4: Final Verification
- [x] Task: Test the full flow: Add Theme -> View in List -> See in Sidebar. (f3d2a1b)
- [x] Task: Verify responsive layout and error handling for failed API calls. (f3d2a1b)
- [x] Task: Conductor - User Manual Verification 'Final Verification' (Protocol in workflow.md) (f3d2a1b)
