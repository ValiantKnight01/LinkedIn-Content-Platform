# Plan: PDF Export for LinkedIn Carousels

This plan outlines the implementation of a backend-driven PDF export feature, enabling users to download high-fidelity LinkedIn carousels based on the "Warm Editorial" style.

## Phase 1: Backend Infrastructure & Templating [a6943f9]
- [x] Task: Add `playwright` and `jinja2` dependencies to the backend. (31de093)
    - *How To:* Add `playwright` and `jinja2` to `backend/requirements.txt`. Run `uv pip install -r requirements.txt` and `uv pip freeze > requirements.txt`.
- [x] Task: Initialize Playwright browsers in the backend environment. (N/A - Environment setup)
    - *How To:* Run `playwright install chromium` (Note: In some Linux server environments, `playwright install-deps` may also be required for system libraries).
- [x] Task: Create a Jinja2 HTML template for the carousel. (d77ee95)
    - *How To:* Create `backend/src/utils/pdf_templates/carousel_template.html` using the provided `code.html` as the base. Parameterize the fields for Title, Hook, Sections, Author, and CTAs.
- [x] Task: Implement Content-to-Slide mapping logic. (490578b)
    - *How To:* Create a utility `backend/src/utils/pdf_generator.py`. Implement logic to distribute post sections into slides, applying the color rotation (Cream, Beige, Sage) and selecting the "Quote Style" for appropriate sections.
- [x] Task: Conductor - User Manual Verification 'Phase 1: Backend Infrastructure & Templating' (Protocol in workflow.md) (c2943fc)

## Phase 2: PDF Export API [c2943fc]
- [x] Task: Implement the PDF generation utility. (490578b)
- [x] Task: Create the PDF Export API endpoint. (9c40264)
- [ ] Task: Conductor - User Manual Verification 'Phase 2: PDF Export API' (Protocol in workflow.md)

## Phase 3: Frontend Integration
- [x] Task: Add "Export" tab to the Post Sheet View. (b112fdd)
- [x] Task: Create the Export Tab View. (b112fdd)
- [x] Task: Implement PDF Download Action. (b112fdd)
- [x] Task: Conductor - User Manual Verification 'Phase 3: Frontend Integration' (Protocol in workflow.md) (a861273)

## Bug Fixes & Refinements
- [x] Fix: Handle None content in PDF sections. (48a6810)
- [x] Fix: Resolve 'builtin_function_or_method' error by renaming 'items' to 'takeaway_points'. (a861273)
- [x] Fix: Correct API port to 8001 in frontend. (Manual Edit)
