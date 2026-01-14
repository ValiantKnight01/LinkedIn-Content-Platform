# Track Specification: Frontend Monthly Syllabus View

## Overview
This track implements the "Monthly Syllabus" user interface, a chronological list of editorial themes. It integrates with the previously created FastAPI backend to fetch, create, and manage monthly themes.

## Functional Requirements
- **Routing**:
    - Implement a new page at `/monthly-themes`.
    - Update navigation (if necessary) to allow access to this page, though it won't be explicitly highlighted in the sidebar to avoid conflict with existing items.
- **Syllabus List View**:
    - Display a vertical list of months/themes in a chronological layout.
    - Each theme card should display:
        - Month Name (e.g., "January").
        - Theme Title (e.g., "Intro to Language Models").
        - Theme Description (e.g., "History, core concepts...").
    - Implement a placeholder state for months without an assigned theme ("Assign Educational Theme...").
- **Theme Management**:
    - **Add Theme**: A button at the top that opens a Dialog modal with a form to create a new theme.
    - **Form Fields**: Title, Category (optional), Month, Year, Description.
    - **Edit/Delete**: Provide simple actions on each card to modify or remove themes.
- **State Management**:
    - Create `useSyllabusStore` in `frontend/lib/store.ts`.
    - Handle async actions for `fetchThemes`, `addTheme`, `updateTheme`, and `deleteTheme`.
    - Ensure the "Active Theme" in the Sidebar reflects the theme for the current month by fetching data from the backend.

## UI/UX Design (Digital Newsroom)
- **Aesthetic**: Warm editorial palette, Serif headings (`Playfair Display`), Sans-serif body (`Inter`).
- **Layout**: Clean vertical list with consistent spacing.
- **Components**: `shadcn/ui` Dialog, Button, Input, Textarea, and custom Theme cards.

## Acceptance Criteria
- [ ] Navigating to `/monthly-themes` displays the syllabus list.
- [ ] Themes are correctly fetched from the FastAPI backend and displayed.
- [ ] Clicking "Add Theme" opens a dialog and successfully persists a new theme to MongoDB.
- [ ] The Sidebar "Active Theme" card dynamically updates based on the current month's theme in the database.
- [ ] Responsive design works across screen sizes.

## Out of Scope
- Categorized grouping headers (themes will be listed chronologically for now).
- Sidebar item highlighting for the new route.
