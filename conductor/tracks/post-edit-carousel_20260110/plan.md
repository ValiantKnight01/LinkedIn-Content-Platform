# Plan: Post Edit & LinkedIn Carousel Preview

## Phase 1: Backend Implementation [38e953d]
Add support for updating post details in the database.

- [x] Task: Implement `PATCH /posts/{id}` endpoint in `backend/src/routes/posts.py`. c1b47cd
    - *How To:* Create a Pydantic schema `PostUpdate` with optional fields for all editable attributes (title, hook, sections, etc.). In the route, fetch the post by ID, apply updates using `post.update(**update_data)`, reload the document, and return the formatted post.
- [x] Task: Ensure the `Post` model supports updates for all fields (Sections, Takeaways, CTA, etc.). c1b47cd
    - *How To:* Verify `backend/src/models/post.py` already has the necessary fields. If `sections` is a `ListField(DictField())`, ensure the update logic in the route handles full replacement of this list correctly.
- [x] Task: Conductor - User Manual Verification 'Phase 1: Backend Implementation' (Protocol in workflow.md) 38e953d

## Phase 2: Store & Foundation
Update the frontend state management and base UI components.

- [~] Task: Add `updatePost` action to `useCalendarStore` in `frontend/lib/store.ts`.
    - *How To:* Define `updatePost: (id: string, updates: Partial<Post>) => Promise<void>` in the store interface. Implement the function to call `PATCH /api/posts/{id}` and optimistically update the `posts` array in the state.
- [ ] Task: Adjust `SheetContent` in `PostIndicator` for 50vw width on desktop and 100% on mobile.
    - *How To:* In `frontend/components/calendar/post-indicator.tsx`, modify the `SheetContent` `className`. Change `sm:max-w-xl` to `sm:max-w-[50vw] w-full`. Ensure the mobile view retains `w-full`.
- [ ] Task: Integrate shadcn/ui `Tabs` component into the `PostIndicator` sheet.
    - *How To:* Import `Tabs, TabsList, TabsTrigger, TabsContent` from `@/components/ui/tabs`. Wrap the sheet's main content area in a `Tabs` provider. Create triggers for "Research", "Edit", and "Preview".
- [ ] Task: Conductor - User Manual Verification 'Phase 2: Store & Foundation' (Protocol in workflow.md)

## Phase 3: Edit Mode
Build the interactive form for modifying post content.

- [ ] Task: Implement "Edit" tab with inputs for all standard fields (Title, Hook, etc.).
    - *How To:* In the `TabsContent value="edit"`, create a form layout. Use `Input` for single-line text (Title, Hook) and `Textarea` for longer content (Learning Objective). Bind these to a local state initialized from the `post` prop.
- [ ] Task: Implement dynamic field management for "Sections" and "Key Takeaways".
    - *How To:* Create sub-components for list management (e.g., `SectionEditor`). Use a simple array map to render inputs for each item, with "Add" and "Remove" buttons. For "Sections", provide inputs for `header`, `content`, and `example_use_case` for each item.
- [ ] Task: Implement "Save" logic with loading states and optimistic updates.
    - *How To:* Add a "Save Changes" button. On click, call `updatePost` from the store with the local form state. Show a loading spinner during the request and a success toast/badge upon completion.
- [ ] Task: Conductor - User Manual Verification 'Phase 3: Edit Mode' (Protocol in workflow.md)

## Phase 4: Carousel Preview
Create the high-fidelity LinkedIn carousel simulation.

- [ ] Task: Create `CarouselPreview` component using the "Warm Editorial" palette from `preview_screen.html`.
    - *How To:* Create `frontend/components/calendar/carousel-preview.tsx`. Port the CSS variables and styles from `preview_screen.html` into a CSS module or Tailwind classes. Define the color palette (Cream Paper, Warm Tan, Sage Green, etc.).
- [ ] Task: Implement horizontal scroll/swipe logic for carousel slides.
    - *How To:* Use a flex container with `overflow-x-auto` and `snap-x` for the carousel track. Each slide should be a `div` with `snap-center`.
- [ ] Task: Bind `CarouselPreview` to the live store state for real-time updates during editing.
    - *How To:* Pass the `post` object (or the local editing state) to `CarouselPreview`. Map the `post` data to the slide templates:
        - Slide 1: Title, Hook, Author (Hardcoded for now or from user profile).
        - Slide 2-4: Map `post.sections` to content slides, cycling through background colors.
        - Slide 5: `post.key_takeaways` and `post.call_to_action`.
- [ ] Task: Conductor - User Manual Verification 'Phase 4: Carousel Preview' (Protocol in workflow.md)

## Phase 5: Copy Utility & Polish
Final features and UI refinements.

- [ ] Task: Implement "Copy to Clipboard" button that formats the post for LinkedIn.
    - *How To:* Create a helper function `formatPostForLinkedIn(post: Post): string`. Concatenate the hook, sections, takeaways, and hashtags into a plain text string with appropriate spacing. Use `navigator.clipboard.writeText()` to copy it. Place the button in the sheet header or footer.
- [ ] Task: Refine transitions between tabs and overall "Digital Newsroom" aesthetic.
    - *How To:* Ensure smooth tab switching. Check typography (Serif for headings) and colors against the design tokens. Add tooltips for clarity if needed.
- [ ] Task: Final verification of responsive behavior and data persistence.
    - *How To:* Test on mobile view (chrome dev tools) to ensure full width. Test on desktop for 50% width. refresh the page after editing to verify MongoDB persistence.
- [ ] Task: Conductor - User Manual Verification 'Phase 5: Copy Utility & Polish' (Protocol in workflow.md)
