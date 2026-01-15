# Plan: Authorized LinkedIn Login Whitelist

## Phase 1: Authentication Logic [Checkpoint: ]
- [x] Task: Implement Whitelist Check in next-auth Callback e3799bf
  - Modify `frontend/lib/auth.ts`.
  - Update the `signIn` callback to check if `user.email` is included in `process.env.ALLOWED_LINKEDIN_EMAILS`.
  - If unauthorized, return `false` or redirect with an error code.
- [ ] Task: Conductor - User Manual Verification 'Phase 1' (Protocol in workflow.md)

## Phase 2: Login UI Feedback [Checkpoint: ]
- [ ] Task: Display Error Message on Login Page
  - Update `frontend/app/login/page.tsx`.
  - Detect authentication errors from URL query parameters.
  - Display the specific message: "This is a personal project not for other usage" in a styled alert/toast.
- [ ] Task: Conductor - User Manual Verification 'Phase 2' (Protocol in workflow.md)

## Phase 3: Final Verification [Checkpoint: ]
- [ ] Task: End-to-End Whitelist Test
  - Verify that an allowed email (configured in `.env.local`) can log in successfully.
  - Update `.env.local` to remove your email from the whitelist, restart the dev server, and verify you are blocked with the correct error message.
- [ ] Task: Conductor - User Manual Verification 'Phase 3' (Protocol in workflow.md)
