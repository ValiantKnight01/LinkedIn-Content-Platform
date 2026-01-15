# Specification: Internal API Key Authorization

## Overview
This track implements a secure communication channel between the frontend and backend using a shared "Internal API Key". This ensures that only authorized clients (primarily our own frontend) can interact with the backend API endpoints, providing a foundational security layer for this personal project.

## Functional Requirements
1. **Shared Secret Configuration**:
    - Backend: Use environment variable `INTERNAL_API_KEY`.
    - Frontend: Use environment variable `INTERNAL_API_KEY`.
2. **Backend Middleware Authorization**:
    - Implement a FastAPI middleware or dependency to intercept incoming requests.
    - Extract the API key from the `Authorization` header (Format: `Bearer <API_KEY>`).
    - Verify the extracted key against the `INTERNAL_API_KEY` environment variable.
3. **Frontend Request Injection**:
    - Update all frontend API calls to include the `Authorization: Bearer <API_KEY>` header.
4. **Access Control**:
    - **Protected Endpoints**: All routes within `themes` and `posts` routers.
    - **Public Endpoints**: `/`, `/health`, `/docs`, `/redoc`, and `/openapi.json`.
5. **Unauthorized Handling**:
    - If the API key is missing or invalid, return a `403 Forbidden` status code with the message: `{"detail": "Invalid or missing Internal API Key"}`.

## Non-Functional Requirements
- **Security**: Prevent unauthorized access to data-modifying or data-retrieving endpoints.
- **Simplicity**: Use a straightforward shared-secret mechanism suitable for a single-user personal tool.

## Acceptance Criteria
- [ ] Backend returns `403 Forbidden` when accessing `/posts` or `/themes` without a valid key.
- [ ] Backend returns `200 OK` (or appropriate status) when accessing `/posts` or `/themes` with a valid key.
- [ ] Backend continues to serve `/health` and `/docs` without requiring an API key.
- [ ] Frontend successfully fetches data from protected endpoints after adding the header.

## Out of Scope
- Full OAuth2 or JWT-based user-level authorization.
- Multi-key management or key rotation logic.
