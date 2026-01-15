# Plan: Internal API Key Authorization

## Phase 1: Backend Implementation [Checkpoint: ]
- [x] Task: Create API Key Security Dependency 846a3dc
  - Create `backend/src/utils/security.py`.
  - Implement a `verify_api_key` function using FastAPI's `HTTPBearer` or `Security` dependencies.
  - This function should compare the incoming token with the `INTERNAL_API_KEY` environment variable.
- [ ] Task: Apply Security to Routers
  - Update `backend/src/main.py`.
  - Add the security dependency to the `themes` and `posts` routers globally so all their routes are protected.
  - Ensure `/`, `/health`, and `/docs` remain public.
- [ ] Task: Conductor - User Manual Verification 'Phase 1' (Protocol in workflow.md)

## Phase 2: Frontend Implementation [Checkpoint: ]
- [ ] Task: Update Frontend Environment
  - Ensure `INTERNAL_API_KEY` is added to `frontend/.env.local`.
- [ ] Task: Update Frontend Fetch Logic
  - Modify `frontend/lib/store.ts` (and any other fetch locations).
  - Inject the `Authorization: Bearer ${process.env.INTERNAL_API_KEY}` header into all requests to the backend.
- [ ] Task: Conductor - User Manual Verification 'Phase 2' (Protocol in workflow.md)

## Phase 3: Final Verification [Checkpoint: ]
- [ ] Task: Verification and Cleanup
  - Manually test accessing a protected endpoint (e.g., `/api/posts`) via `curl` without a key (expected: 403).
  - Manually test accessing with the key (expected: success).
  - Verify the frontend still functions correctly.
- [ ] Task: Conductor - User Manual Verification 'Phase 3' (Protocol in workflow.md)
