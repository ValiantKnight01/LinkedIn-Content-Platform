# Specification: Authorized LinkedIn Login Whitelist

## Overview
This track implements an authorization layer on top of the existing LinkedIn authentication. Since this is a personal project, access should be restricted only to specific authorized users (the owner) to prevent unauthorized access even if someone has a valid LinkedIn account.

## Functional Requirements
1. **Environment-Based Whitelist**: Use an environment variable `ALLOWED_LINKEDIN_EMAILS` to store a comma-separated list of authorized email addresses.
2. **SignIn Callback Verification**: Implement the authorization check within the `next-auth` `signIn` callback. This ensures that a session is never created for unauthorized users.
3. **Access Denial Messaging**: If a user's email is not in the whitelist:
    - Block the sign-in process.
    - Redirect the user back to the login page.
    - Display the error message: "This is a personal project not for other usage."

## Non-Functional Requirements
- **Security**: Access is denied at the earliest possible stage in the authentication flow.
- **Maintainability**: The authorized list can be updated via environment variables without requiring code changes or deployments (depending on the hosting environment).

## Acceptance Criteria
- [ ] Users whose LinkedIn email is present in `ALLOWED_LINKEDIN_EMAILS` can log in successfully.
- [ ] Users whose LinkedIn email is NOT present in `ALLOWED_LINKEDIN_EMAILS` are blocked from logging in.
- [ ] Blocked users are redirected to `/login` with the specific error message displayed.
- [ ] The system correctly handles a single email or multiple comma-separated emails in the environment variable.

## Out of Scope
- Database-backed user management or roles.
- Self-service registration or access request flow.
