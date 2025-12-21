# Implementation Plan - Track 3: Newsroom Kanban

## Phase 1: Foundation & Library Setup
- [ ] **Install Drag-and-Drop Library:**
  - Install `@dnd-kit/core`, `@dnd-kit/sortable`, `@dnd-kit/utilities`.
- [ ] **Newsroom State Management:**
  - Extend `lib/store.ts` with a `useNewsroomStore`.
  - Define columns state: `proposed: [], selected: [], inDraft: [], published: []`.
  - Implement `moveCard` action to handle drag-and-drop updates.
  - Implement `addProposedCards` action for the "Generate Cycle" feature.

## Phase 2: UI Components
- [ ] **Kanban Card Component:**
  - Build the `KanbanCard` matching the reference (White background, shadow).
  - Implement hover effects (rotation/lift).
  - Integrate with `useSortable` from `@dnd-kit`.
- [ ] **Kanban Column Component:**
  - Build the `KanbanColumn` component.
  - Implement the column header with title and card count.
  - Integrate with `SortableContext`.

## Phase 3: Board Implementation
- [ ] **Newsroom Board Assembly:**
  - Assemble the 4 columns in a grid layout (`min-w-[1200px]` with horizontal scroll).
  - Implement the `DndContext` wrapper and interaction sensors.
- [ ] **Header & "Generate Cycle":**
  - Build the Newsroom header with "Today's Editorial Board" title.
  - Implement the "Generate Cycle" button with loading state and simulated API call.
- [ ] Task: Conductor - User Manual Verification 'Newsroom Board' (Protocol in workflow.md)

## Phase 4: Data Simulation & Polish
- [ ] **Mock Kanban API:**
  - Create `app/api/newsroom/route.ts` to provide initial board state and mock card generation.
- [ ] **Visual QA:**
  - Ensure fonts, colors, and spacing match `editorial-view/screen.png`.
- [ ] Task: Conductor - User Manual Verification 'Final Polish' (Protocol in workflow.md)
