# Specification: Add Prettier to Frontend

## Overview
Integrate Prettier into the frontend of the PostGenerator project to ensure consistent code formatting across TypeScript, TSX, and CSS files.

## Functional Requirements
1.  **Installation:** Install `prettier`, `eslint-config-prettier`, and `prettier-plugin-tailwindcss` (since Tailwind v4 is used) in the `frontend/` directory.
2.  **Configuration:** 
    - Create a `.prettierrc` file in the `frontend/` directory with standard default rules.
    - Create a `.prettierignore` file to exclude `node_modules`, `.next`, and other build artifacts.
3.  **ESLint Integration:** Update `frontend/eslint.config.mjs` to include `eslint-config-prettier` to disable conflicting formatting rules.
4.  **Scripts:** Add a `format` script to `frontend/package.json` to run Prettier and a `format:check` script for CI/verification.

## Non-Functional Requirements
- **Consistency:** Ensure all frontend developers use the same formatting rules.
- **Performance:** Prettier execution should be efficient and not significantly slow down development workflows.

## Acceptance Criteria
- [ ] Prettier is installed as a devDependency in `frontend/package.json`.
- [ ] `.prettierrc` and `.prettierignore` files exist in the `frontend/` directory.
- [ ] Running `npm run format` in the `frontend/` directory successfully formats the code.
- [ ] `npm run lint` runs without conflicts from formatting rules.
- [ ] Tailwind CSS classes are automatically sorted (via the Prettier plugin).

## Out of Scope
- Formatting for Python files in the `backend/` directory.
- Formatting for root-level configuration files (unless they are inside the `frontend/` directory).
- Setting up Git pre-commit hooks (Husky/lint-staged).
