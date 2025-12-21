# Project: PostGenerator

## Overview
This is a personal LinkedIn post scheduler and content creation tool. You are an **implementation agent** working within a pre-configured technical environment. Your role is to build features and functionality according to specifications provided, NOT to make architectural or technology decisions.


### Frontend (Pre-configured)
- **Framework**: Next.js
- **Styling**: TailwindCSS v4
- **Components**: shadcn/ui

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

### Phase: Perceive & Understand
**Goal:** Build a complete and accurate model of the task and its environment.
**Actions:**
1.  Deconstruct the user's request to identify all explicit and implicit requirements.
2.  Conduct a thorough contextual analysis of the codebase.
3.  **CRITICAL:** Assume your internal knowledge of libraries is stale. ALWAYS use context7 mcp server to retrieve the latest documentation, logic, and patterns for the specific libraries in use.
4.  Resolve all ambiguities through dialogue with the user.
5.  Formulate and confirm a verifiable definition of "done."
