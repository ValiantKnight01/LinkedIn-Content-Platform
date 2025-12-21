# Project: PostGenerator

## Overview
This is a personal LinkedIn post scheduler and content creation tool. You are an **implementation agent** working within a pre-configured technical environment. Your role is to build features and functionality according to specifications provided, NOT to make architectural or technology decisions.


### Frontend (Pre-configured)
- **Framework**: Next.js 16
- **Styling**: TailwindCSS v4
- **Components**: shadcn/ui, @dnd-kit
- **State Management**: Zustand

### Backend (Pre-configured)
- **Runtime**: Python (via `uv` toolchain)
- **Framework**: Google ADK (Agent Development Kit)

### Infrastructure (Pre-configured)
- **Containerization**: Docker
- **Services**: Redis (MQ), Databases (as needed via Docker)

## Operational Guidelines
- **Server Management**: Do NOT attempt to start or stop servers (frontend or backend). These are managed by the user.
- **Hot Reloading**: The backend environment supports hot-reloading. Changes propagate automatically.
- **Verification**: Verify implementation by checking expected behavior, not by analyzing process output unless debugging.
- **Track-by-Track Development**:
  - Do NOT plan the entire project upfront.
  - Work on one "Track" (Phase) at a time.
  - Only define detailed specs for the *active* track.
  - Defer decisions for future tracks until that track begins.

## Active Track
- **Track 2: Newsroom Dashboard (Syllabus)**
  - Goal: Implement the primary "Syllabus" interface featuring a full Calendar View and Sidebar navigation.
  - Status: Initializing

## Domain Definitions
- **Syllabus:** The central content calendar and planning interface. This is where the "Editorial Calendar" view lives.
- **Newsroom:** The primary dashboard/landing view (currently distinct from the calendar).
  - **Research Complete View:** A slide-over sheet for "Selected" cards that have completed the research phase. Allows users to review AI-generated insights (Title, Angle, Data Points) and "Approve & Draft" or "Discard".
- **Archives:** A repository view for past/published content.
- **Active Theme:** A monthly editorial focus (e.g., "RAG Architectures") displayed in the sidebar.

## Completed Tracks
- **Track 1: Foundation & Identity:** Set up the Next.js project with Tailwind CSS v4 and the "Digital Newsroom" aesthetic.
- **Track 2: Newsroom Dashboard (Syllabus):** Implemented the Calendar View and Sidebar.
- **Track 3: Newsroom Kanban:** Implemented the Drag-and-Drop Kanban board.
- **Track 4: Research Complete View:** Implemented the Approval Editor for researching cards.

## Active Track
- **None:** Awaiting next instruction.

### Phase: Perceive & Understand
**Goal:** Build a complete and accurate model of the task and its environment.
**Actions:**
1.  Deconstruct the user's request to identify all explicit and implicit requirements.
2.  Conduct a thorough contextual analysis of the codebase.
3.  **CRITICAL:** Assume your internal knowledge of libraries is stale. ALWAYS use context7 mcp server to retrieve the latest documentation, logic, and patterns for the specific libraries in use.
4.  Resolve all ambiguities through dialogue with the user.
5.  Formulate and confirm a verifiable definition of "done."
