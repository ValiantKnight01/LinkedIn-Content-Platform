# Track Specification: Structured Section Content

## 1. Overview
Current post sections for "Before vs After" and "Trade-offs" are unstructured text blocks. This track aims to convert these specific section types into structured JSON objects to enable richer, more readable UI components (e.g., comparison tables, pros/cons lists).

## 2. Functional Requirements

### 2.1 Backend Schema Updates
- **Models:** Update `Post` and `Section` models (Pydantic & MongoEngine) to support `structured_content`.
- **Comparison Structure (Before/After):**
  ```json
  {
    "type": "comparison",
    "items": [
      { "dimension": "Performance", "before": "...", "after": "..." }
    ],
    "summary": "..."
  }
  ```
- **Trade-offs Structure:**
  ```json
  {
    "type": "tradeoffs",
    "pros": ["..."],
    "cons": ["..."],
    "constraints": ["..."],
    "real_world_context": "..."
  }
  ```

### 2.2 AI Agent Updates
- **Prompt Engineering:** Update the topic researcher/post generator prompts to output these specific JSON structures.
- **Parsing:** Ensure the agent response parser correctly handles these nested objects.

### 2.3 Frontend Rendering
- **Component Updates:** Create or update section rendering components.
- **Comparison View:** Render as a structured comparison table/list.
- **Trade-offs View:** Render with distinct visual groupings for Pros, Cons, and Constraints.

### 2.4 Frontend Editor Integration
- **Comparison Editor:** A form component to add/edit/remove comparison rows (Dimension, Before, After) and the summary.
- **Trade-offs Editor:** A form component to manage lists of Pros, Cons, and Constraints (add/remove items).
- **Post Editor Update:** Integrate these specific section editors into the main Post Editor flow, allowing users to switch between "Text" mode and "Structured" mode (or auto-detect).

## 3. Non-Functional Requirements
- **Validation:** Strict backend validation for structure integrity.
- **Aesthetic:** UI components must use existing Tailwind tokens and shadcn/ui patterns.

## 4. Acceptance Criteria
- [ ] Database stores "Before vs After" and "Trade-offs" sections with defined schemas.
- [ ] AI agent consistently generates valid JSON for both types.
- [ ] Frontend renders "Before vs After" in a structured layout.
- [ ] Frontend renders "Trade-offs" with visual separation.

## 5. Out of Scope
- Data migration for existing posts (Database will be cleared).
- "How-to" / "How it Works" sections (remain as text for now).
