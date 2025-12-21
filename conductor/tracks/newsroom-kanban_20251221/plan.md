# Implementation Plan - Track 3: Newsroom Kanban (Checkpoint: 4a9983b)

## Phase 1: Foundation & Library Setup
- [x] **Install Drag-and-Drop Library:**
  - Install `@dnd-kit/core`, `@dnd-kit/sortable`, `@dnd-kit/utilities`.
- [x] **Newsroom State Management:**
  - Extend `lib/store.ts` with a `useNewsroomStore`.
  - Define columns state: `proposed: [], selected: [], inDraft: [], scheduled: []`.
  - Implement `moveCard` action to handle drag-and-drop updates.
  - Implement `addProposedCards` action for the "Generate Cycle" feature.

## Phase 2: UI Components
- [x] **Kanban Card Component:**
  - Build the `KanbanCard` matching the reference.
  - Implement hover effects (rotation/lift).
  - Integrate with `useSortable` from `@dnd-kit`.
- [x] **Kanban Column Component:**
  - Build the `KanbanColumn` component.
  - Implement the column header with title and card count.
  - Integrate with `SortableContext`.
  - Add Tooltip for "Proposed Pool" description.

## Phase 3: Board Implementation
- [x] **Newsroom Board Assembly:**
  - Assemble the 4 columns in a grid layout (`min-w-[1200px]` with horizontal scroll).
  - Implement the `DndContext` wrapper and interaction sensors.
  - Distribute columns (`justify-between`) to align with header.
- [x] **Header & "Generate Cycle":**
  - Build the Newsroom header with "Editorial Board" title.
  - Implement the "Generate Cycle" button with loading state and simulated API call.
- [x] **Move Confirmation & Drop Restrictions:**
  - Implement shadcn/ui `AlertDialog` for cross-column moves.
  - Disable drop functionality for the "Scheduled" column.
  - Implement Optimistic UI with rollback on cancel.
- [x] Task: Conductor - User Manual Verification 'Newsroom Board' (Protocol in workflow.md)

## Phase 4: Data Simulation & Polish
- [x] **Mock Kanban API:**
  - Create `app/api/newsroom/route.ts` to provide initial board state and mock card generation.
- [x] **Visual QA:**
  - Ensure fonts, colors, and spacing match `editorial-view/screen.png`.
  - Increase border width to 2px.
- [x] Task: Conductor - User Manual Verification 'Final Polish' (Protocol in workflow.md)