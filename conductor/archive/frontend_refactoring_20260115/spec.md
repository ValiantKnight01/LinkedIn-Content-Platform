# Specification: Frontend Refactoring (Phase 1)

## Overview
The goal of this track is to improve the maintainability and organization of the frontend codebase by refactoring large components and extracting complex logic into custom hooks. The primary target is `frontend/components/calendar/post-indicator.tsx`, which currently acts as a monolithic "Post Editor" component. Additionally, we will standardize API base URL usage across the application.

## Functional Requirements

### 1. Extract Logic to Custom Hook
- Create `frontend/hooks/use-post-editor.ts`.
- Extract all state management and business logic from `PostIndicator` into this hook, including:
  - Editing state (`editData`).
  - Loading states (`isResearching`, `isSaving`, `isDownloading`).
  - Interaction handlers (`handleResearch`, `handleDownloadPDF`, `handleSave`).
  - Utility states (`copied`, `isOpen`).
- Use `useCalendarStore` within the hook.

### 2. Standardize API Base URL
- Ensure that all API calls (specifically in the new hook and existing components) use a centralized configuration or environment variable for the backend base URL.
- Remove hardcoded fallbacks like `'http://localhost:8001'` from component logic. Use `process.env.NEXT_PUBLIC_API_URL` consistently.

### 3. Split `PostIndicator` UI into Sub-components
- Refactor `PostIndicator` to be a lightweight trigger and container.
- Create `frontend/components/calendar/post-editor-sheet.tsx` to house the `SheetContent` and the main editor UI.
- (Optional but recommended) Further split the editor UI into logical sections like `PostEditorTabs`, `PostMetadataForm`, etc., if they remain large.

### 4. Maintain Functionality
- Ensure that post editing, research (AI synthesis), and PDF export continue to work seamlessly.
- Maintain the "Digital Newsroom" aesthetic throughout the refactoring.

## Non-Functional Requirements
- **Modularity:** Clear separation of concerns between UI (components) and logic (hooks).
- **Readability:** Reduce the line count of `PostIndicator.tsx` significantly.
- **Type Safety:** Ensure all props and hook return values are properly typed.

## Acceptance Criteria
- `frontend/hooks/use-post-editor.ts` is created and functional.
- `PostIndicator.tsx` is simplified and uses the new hook.
- `post-editor-sheet.tsx` is created to contain the editor's modal UI.
- API calls consistently use the configured base URL.
- All post management features (Save, Research, Download) are verified manually.
- No regression in UI appearance or behavior.

## Out of Scope
- Refactoring `frontend/components/ui/sidebar.tsx`.
- Major architectural changes to `lib/store.ts`.
