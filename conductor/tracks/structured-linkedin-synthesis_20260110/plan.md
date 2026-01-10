# Plan: Structured LinkedIn Post Synthesis

## Phase 1: Agent Logic
- [x] Task: Update `topic_researcher.py` Pydantic models. (f6f0f93)
    - *How To*: Define a new `ResearchSection(BaseModel)` with `header`, `content`, and `example_use_case`. Update the existing `ResearchSynthesis` model to include `day`, `title`, `hook`, `sections` (as `List[ResearchSection]`), `key_takeaways` (as `List[str]`), `call_to_action`, `hashtags` (as `List[str]`), and `sources`.
- [x] Task: Update `research_single_topic` signature. (d9ee03c)
    - *How To*: Update the function definition in `backend/src/agents/topic_researcher.py` to accept an additional `day: int` parameter.
- [x] Task: Update the synthesis prompt. (f8e55e5)
    - *How To*: Modify the synthesis prompt within `research_single_topic` to include the new JSON structure. Add explicit instructions to: 1. Use ONLY plain text (no markdown and NO emojis), 2. Create a flexible number of sections based on topic depth, and 3. Ensure the hook is punchy and optimized for LinkedIn.
- [ ] Task: Conductor - User Manual Verification 'Agent Logic' (Protocol in workflow.md)

## Phase 2: Data Persistence
- [x] Task: Update `Post` model in `backend/src/models/post.py`. (4d3cf46)
    - *How To*: Add the following fields to the `Post` document: `hook` (StringField), `sections` (ListField of DictField), `key_takeaways` (ListField of StringField), `call_to_action` (StringField), and `hashtags` (ListField of StringField). Ensure `DictField` is imported from `mongoengine`.
- [x] Task: Update `research_post` route in `backend/src/routes/posts.py`. (c88a5f6)
    - *How To*: Update the call to `research_single_topic` to pass the `post.day` value. Then, update the `post.update()` call to map the new fields (`hook`, `sections`, `key_takeaways`, `call_to_action`, `hashtags`, `sources`) from the synthesis result to the database document.
- [ ] Task: Conductor - User Manual Verification 'Data Persistence' (Protocol in workflow.md)

## Phase 3: Frontend Integration
- [x] Task: Update `Post` interface in `frontend/lib/store.ts`. (93f839c)
    - *How To*: Add `hook`, `sections`, `key_takeaways`, `call_to_action`, and `hashtags` to the `Post` interface. `sections` should be an array of objects with `header`, `content`, and `example_use_case`.
- [x] Task: Update `PostIndicator` component to display structured data. (6a2b011)
    - *How To*: Modify `frontend/components/calendar/post-indicator.tsx` to render the new fields. Use a simple vertical stack: Hook, then map through sections, then Takeaways, then CTA, then Hashtags.
- [ ] Task: Conductor - User Manual Verification 'Frontend Integration' (Protocol in workflow.md)

## Phase 4: Refinement (Boss Feedback)
- [x] Task: Refine synthesis prompt in `topic_researcher.py`. (34cd0f8)
    - *How To*: Update the prompt in `research_single_topic` to strictly enforce the new Hook, Example, Data, Difficulty, and Structure rules.
