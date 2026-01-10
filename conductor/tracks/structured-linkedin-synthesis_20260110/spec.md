# Specification: Structured LinkedIn Post Synthesis

## Overview
The goal of this track is to refactor the research synthesis phase in the `topic_researcher.py` agent. Currently, the agent generates a paragraph-based summary which is not optimal for LinkedIn. We will move to a structured JSON format that breaks the content down into a hook, modular sections, key takeaways, and a call to action. This structure is designed to be easily readable on LinkedIn and serves as a foundation for future "HTML to PDF" carousel generation.

## Functional Requirements

### 1. Updated Data Models (`backend/src/agents/topic_researcher.py`)
- Define a new `ResearchSection` Pydantic model:
    - `header`: string (Plain text)
    - `content`: string (Plain text)
    - `example_use_case`: string (Plain text)
- Update the `ResearchSynthesis` Pydantic model to include:
    - `day`: integer (The day of the curriculum)
    - `title`: string (Compelling title)
    - `hook`: string (Engaging opening)
    - `sections`: List of `ResearchSection` (Flexible count)
    - `key_takeaways`: List of strings (Plain text)
    - `call_to_action`: string (Engagement question/statement)
    - `hashtags`: List of strings
    - `sources`: List of strings (Source URLs)

### 2. Prompt Engineering
- Update the synthesis prompt in `research_single_topic` to instruct the LLM to generate content following the new structured format.
- Ensure the instruction explicitly requests "Plain Text" (no markdown and NO emojis) for all content fields.
- The prompt should encourage a flexible number of sections (typically 3-5, but at the AI's discretion) based on topic depth.
- **Boss Feedback / Critical Refinements:**
    - **HOOK RULES:** No marketing language ("revolutionize", "game-changing"). Start with relatable scenario, surprising fact, concrete question, or paradox.
    - **EXAMPLE RULES:** Must include company/product name and specific numbers/results. No vague "for instance".
    - **DATA REQUIREMENTS:** Minimum 3 concrete numbers per post (percentages, improvements). Source from search results.
    - **DIFFICULTY CALIBRATION:** Beginner (Days 1-10): Define technical terms, use analogies.
    - **STRUCTURE:** Problem, Solution, How it works, Real examples (3+), Impact (numbers), Takeaways.
    - **Round 2 Refinements:**
        - **TECHNICAL METRICS:** Explain metrics like MAE/RMSE in simple terms or convert to %.
        - **EXAMPLE DEPTH:** Company example must have feature name, specific usage details, impact, and "secret sauce". Min 50 words per example.
        - **BEFORE/AFTER:** Explicit comparison of metrics before/after attention, with time period and business impact.
        - **TRADE-OFFS:** Dedicated "Challenges" section with 3-4 downsides and real-world problems.
        - **NO GENERIC FILLER:** Banned phrases like "For instance...", "In a typical scenario...". Use specific company/action/result instead.
    - **Bug Fix (Validation Error):**
        - Make `example_use_case` optional in `ResearchSection` model to prevent crashes if the LLM adds sections like "Conclusion" without examples.
        - Update prompt to explicitly instruct LLM *not* to put "Key Takeaways" or "Conclusion" in the `sections` list.
    - **Round 3 Refinements (Distribute Examples):**
        - **ELIMINATE DEDICATED EXAMPLE SECTION:** Remove the "Real Examples" section from the required structure.
        - **DISTRIBUTE EXAMPLES:** Require that specific company examples be moved into the `example_use_case` field of the *relevant* sections (Problem, Solution, How it works, etc.).
        - **POPULATE EXAMPLE FIELDS:** Ensure `example_use_case` is populated for every section to provide context and "secret sauce" directly alongside the concept.

### 3. Backend Integration
- Update the return dictionary in `research_single_topic` to match the new `ResearchSynthesis` fields.
- Ensure the `day` field is passed correctly to the synthesis function (currently it is not in the signature of `research_single_topic`).

## Non-Functional Requirements
- **Performance**: The synthesis should remain fast (within standard LLM response times).
- **Format**: Strictly JSON output from the LLM via structured output.

## Acceptance Criteria
- [ ] The `ResearchSynthesis` model in `topic_researcher.py` includes all new fields.
- [ ] The LLM generates valid JSON matching the new schema.
- [ ] Content fields (hook, content, takeaways) are in plain text without markdown formatting.
- [ ] The `research_single_topic` function successfully returns the structured data to the caller.

## Out of Scope
- Implementation of the HTML-to-PDF/Carousel generator.
- Frontend UI updates to display the new structured format (this will be handled in a separate track).
