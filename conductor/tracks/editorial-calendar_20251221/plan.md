# Implementation Plan - Track 2: Newsroom Dashboard (Syllabus) (Checkpoint: 06a3b12)

## Phase 1: Shared Application Layout
- [x] **Sidebar Component:**
  - Implement navigation sidebar with "Syllabus", "Newsroom", "Archives".
  - Add "Active Theme" widget (mock data).
- [x] **Main Layout Structure:**
  - Create a layout wrapper for Sidebar + Content.
  - Ensure routing defaults to "Syllabus".
- [x] **Route Navigation:**
  - Set up pages for `/syllabus`, `/newsroom`, `/archives`.
- [~] Task: Conductor - User Manual Verification 'Layout Implementation' (Protocol in workflow.md)

## Phase 2: State & Data Simulation
- [x] **Zustand Store Setup:**
  - Install `zustand`.
  - Create `useCalendarStore` to manage:
    - `currentDate` (Month/Year)
    - `posts` (List of posts)
    - Actions: `nextMonth`, `prevMonth`, `setPosts`.
- [x] **Mock Post API:**
  - Create `app/api/posts/route.ts` (Next.js 16).
  - Return JSON data for sample posts.
- [x] **Data Fetching Integration:**
  - Update `useCalendarStore` to fetch posts from the API when the month changes or on init.
- [x] Task: Conductor - User Manual Verification 'Data Simulation' (Protocol in workflow.md)

## Phase 3: Syllabus (Calendar View)
- [x] **Calendar Logic:**
  - Implement date generation grid based on `useCalendarStore.currentDate`.
- [x] **Post Indicator Component:**
  - Create pill component with status dots.
- [x] **Calendar Assembly:**
  - Build the full Calendar UI.
  - Connect "Previous" and "Next" buttons to Zustand actions.
  - Render Post Indicators from Zustand `posts` state.
- [x] Task: Conductor - User Manual Verification 'Syllabus Implementation' (Protocol in workflow.md)

## Phase 4: Final Polishing
- [x] **Visual QA:**
  - Verify match with `screen.png`.
- [x] **Placeholder Views:**
  - Add "Under Construction" content for Newsroom/Archives.
- [x] Task: Conductor - User Manual Verification 'Final Polish' (Protocol in workflow.md)
