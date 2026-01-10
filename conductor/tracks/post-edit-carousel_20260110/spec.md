# Spec: Post Edit & LinkedIn Carousel Preview

## Overview
Enhance the post detail sheet (within the `PostIndicator` component) to support interactive editing, a high-fidelity LinkedIn carousel preview, and a quick-copy utility. The sheet will transition from a static research viewer to a multi-mode workspace.

## Functional Requirements

### 1. Enhanced Sheet UI
- **Responsive Width:** The `SheetContent` must occupy 50% (`max-w-[50vw]`) of the viewport width on desktop and 100% on mobile.
- **Tabbed Navigation:** Implement a `Tabs` interface with three modes:
    - **Research:** The current synthesis view.
    - **Edit:** A form-based interface for modifying all post fields.
    - **Preview:** A live-updating carousel simulation.

### 2. Edit Mode
- **Fields:** Title, Hook, Learning Objective, Difficulty, Status, Hashtags, and Sources.
- **Structured Fields:** Dynamic fields for "Sections" (Header, Content, Example) and "Key Takeaways".
- **Backend Sync:** Implement a "Save" mechanism that updates the `Post` document in MongoDB.

### 3. Preview Mode (LinkedIn Carousel)
- **Visual Style:** Implement a "Warm Editorial" theme based on `preview_screen.html`.
    - Palette: Cream Paper (`#fefae0`), Warm Tan (`#d4a373`), Sage Green (`#e9edc9`), Dark Brown (`#3D2B1F`).
- **Carousel Mechanics:** A horizontal scroll or slide-based view simulating a multi-slide LinkedIn carousel.
- **Dynamic Content:** Live-binding to reflect changes made in the Edit tab.

### 4. Copy Utility
- **Action:** A "Copy" button available in the Research or Preview view.
- **Payload:** Aggregates the synthesized content (Hook, Sections, Takeaways, CTA, Hashtags) into a single text block optimized for LinkedIn.

### 5. Backend Updates
- **Endpoint:** Add a `PATCH /posts/{id}` endpoint to the FastAPI backend to handle updates for all post fields.

## Non-Functional Requirements
- **Digital Newsroom Aesthetic:** Maintain the serif typography and warm color palette.
- **Performance:** Preview should update reactively without noticeable lag.

## Acceptance Criteria
- [ ] Sheet width is exactly 50vw on screens > 1024px.
- [ ] User can switch between Research, Edit, and Preview tabs.
- [ ] Changes in Edit mode are persisted to the database and reflected in the Preview.
- [ ] Carousel visuals match the provided `preview_screen.html` reference.
- [ ] "Copy to Clipboard" successfully copies the formatted post.
