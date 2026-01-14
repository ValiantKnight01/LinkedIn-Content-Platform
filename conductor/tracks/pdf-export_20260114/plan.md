# Plan: PDF Export for LinkedIn Carousels

This plan outlines the implementation of a backend-driven PDF export feature, enabling users to download high-fidelity LinkedIn carousels based on the "Warm Editorial" style.

## Phase 1: Backend Infrastructure & Templating
- [x] Task: Add `playwright` and `jinja2` dependencies to the backend. (31de093)
    - *How To:* Add `playwright` and `jinja2` to `backend/requirements.txt`. Run `uv pip install -r requirements.txt` and `uv pip freeze > requirements.txt`.
- [ ] Task: Initialize Playwright browsers in the backend environment.
    - *How To:* Run `playwright install chromium` (Note: In some Linux server environments, `playwright install-deps` may also be required for system libraries).
- [ ] Task: Create a Jinja2 HTML template for the carousel.
    - *How To:* Create `backend/src/utils/pdf_templates/carousel_template.html` using the provided `code.html` as the base. Parameterize the fields for Title, Hook, Sections, Author, and CTAs.
- [ ] Task: Implement Content-to-Slide mapping logic.
    - *How To:* Create a utility `backend/src/utils/pdf_generator.py`. Implement logic to distribute post sections into slides, applying the color rotation (Cream, Beige, Sage) and selecting the "Quote Style" for appropriate sections.
- [ ] Task: Conductor - User Manual Verification 'Phase 1: Backend Infrastructure & Templating' (Protocol in workflow.md)

## Phase 2: PDF Export API
- [ ] Task: Implement the PDF generation utility.
    - *How To:* In `backend/src/utils/pdf_generator.py`, use Playwright to launch a headless browser, set the viewport to the carousel aspect ratio (e.g., 1080x1080 or 1350x1080), render the Jinja2 template, and generate a PDF buffer using `page.pdf()`.
- [ ] Task: Create the PDF Export API endpoint.
    - *How To:* In `backend/src/routes/posts.py`, add a `GET /api/posts/{post_id}/export/pdf` endpoint. It should fetch the post, invoke the PDF generator, and return the result as a file download.
- [ ] Task: Conductor - User Manual Verification 'Phase 2: PDF Export API' (Protocol in workflow.md)

## Phase 3: Frontend Integration
- [ ] Task: Add "Export" tab to the Post Sheet View.
    - *How To:* Update `frontend/components/calendar/post-indicator.tsx`. Add a `TabsTrigger` for "Export" and a corresponding `TabsContent`.
- [ ] Task: Create the Export Tab View.
    - *How To:* Implement a simple view within the "Export" tab that shows a preview of what will be exported (or just a descriptive card) and a "Download PDF" button.
- [ ] Task: Implement PDF Download Action.
    - *How To:* Add a function to handle the download. Use `fetch` to call the backend endpoint, receive the blob, and use `window.URL.createObjectURL` to trigger the browser download.
- [ ] Task: Conductor - User Manual Verification 'Phase 3: Frontend Integration' (Protocol in workflow.md)
