# Specification: PDF Export for LinkedIn Carousels

## Overview
Implement a backend-driven PDF export functionality that converts a structured post into a high-fidelity LinkedIn PDF carousel. This feature leverages the "Warm Editorial" visual style defined in the provided HTML reference (`frontend/references/pdf-export/code.html`). The backend will use `playwright` (Python) to render the HTML template to PDF to ensure pixel-perfect fidelity with modern CSS features (gradients, shadows, grid/flex).

## Functional Requirements

### 1. Backend Service (PDF Generation)
- **Engine:** Use `playwright` (Python) to launch a headless Chromium instance for rendering.
- **Templating:** Adapt the provided `code.html` into a Jinja2 template.
- **API Endpoint:** Create a new endpoint (e.g., `GET /api/posts/{post_id}/export/pdf`) that:
    1.  Fetches the post data.
    2.  Renders the HTML template with the data.
    3.  Generates a PDF buffer using Playwright's `page.pdf()`.
    4.  Returns the binary PDF file with appropriate headers (`Content-Type: application/pdf`, `Content-Disposition: attachment`).

### 2. Carousel Logic & Content Mapping
- **Slide 1 (Title):** Map Post "Title" and "Hook" fields. Inject Author name/handle.
- **Content Slides (2-4+):** 
    - Map post body sections to content slides.
    - **Color Rotation:** Automatically cycle background styles (Cream -> Beige -> Sage) for sequential sections to maintain visual variety.
- **Quote Slide (Feature):** If a section is identified as a blockquote or emphatic statement, use the "Slide 6" dark/quote layout.
- **Last Slide (Takeaways/CTA):** Map the "Takeaways" or "CTA" field to the final slide style (Slide 5).
- **Slide Numbers:** Automatically generate "X/Y" numbering for all slides.

### 3. Frontend Integration
- **UI Location:** Integrate into the existing Post Sheet View.
- **Tabs:** Add an "Export" tab (or equivalent control) alongside the existing "Research", "Edit", and "Preview" tabs in `frontend/components/calendar/post-indicator.tsx`.
- **Functionality:** Within this view, provide the "Download PDF" action that triggers the API generation and handles the file download.

## Non-Functional Requirements
- **Visual Fidelity:** The generated PDF MUST visually match the provided `code.html` reference (shadows, gradients, typography).
- **Performance:** Browser context management should be efficient (reuse context if possible, or ensure clean startup/shutdown) to minimize latency.
- **CSS Support:** Must support CSS Grid, Flexbox, and `aspect-ratio` as used in the reference.

## Technical Constraints
- **Library:** `playwright` (Python) for rendering.
- **Template:** Jinja2 for HTML generation.
