# Track Specification: Backend Foundation & Monthly Themes API

## Overview
This track involves initializing the backend services for PostGenerator. We will set up a Python-based FastAPI server using the `uv` toolchain, integrate it with MongoDB using `mongoengine` (ODM), and implement the core API for managing "Monthly Themes" as seen in the Syllabus view.

## Functional Requirements
- **Backend Infrastructure**:
    - Initialize a Python 3.12+ project using `uv` in the `backend/` directory.
    - Set up FastAPI with a structure compatible with Google ADK patterns.
    - Configure MongoDB connection using `mongoengine` (connecting to `localhost:27017`).
- **Themes API**:
    - Define a `Theme` data model (MongoEngine Document):
        - `title`: Name of the theme (e.g., "Prompt Engineering").
        - `description`: Brief overview of the theme focus.
        - `month`: Integer (1-12).
        - `year`: Integer (e.g., 2025).
        - `category`: Grouping header (e.g., "LLM Fundamentals").
    - Implement endpoints:
        - `POST /themes`: Create a new monthly theme.
        - `GET /themes`: List all themes.
        - `GET /themes/{year}/{month}`: Retrieve the active theme for a specific month.
        - `PATCH /themes/{id}`: Update an existing theme.
        - `DELETE /themes/{id}`: Remove a theme.

## Non-Functional Requirements
- **Type Safety**: Use Pydantic for request/response validation.
- **Environment**: Use `.env` for MongoDB connection strings.
- **Sync/Async**: Manage `mongoengine` synchronous calls within FastAPI appropriately.

## Acceptance Criteria
- [ ] User is able to successfully run the app.
- [ ] MongoDB connection is established and verified via a health-check endpoint.
- [ ] All Theme CRUD endpoints are functional (verified via `/docs`).
- [ ] Data is persisted correctly in MongoDB.

## Out of Scope
- AI-based theme generation (deferred).
- Frontend integration.
- Dockerizing the backend (until production/deployment track).
