# Plan: Structured LinkedIn Post Synthesis

## Phase 1: Agent Logic
- [x] Task: Update `topic_researcher.py` Pydantic models. (f6f0f93)
    - *How To*: Define a new `ResearchSection(BaseModel)` with `header`, `content`, and `example_use_case`. Update the existing `ResearchSynthesis` model to include `day`, `title`, `hook`, `sections` (as `List[ResearchSection]`), `key_takeaways` (as `List[str]`), `call_to_action`, `hashtags` (as `List[str]`), and `sources`.
- [x] Task: Update `research_single_topic` signature. (d9ee03c)
    - *How To*: Update the function definition in `backend/src/agents/topic_researcher.py` to accept an additional `day: int` parameter.
- [ ] Task: Update the synthesis prompt.
    - *How To*: Modify the synthesis prompt within `research_single_topic` to include the new JSON structure. Add explicit instructions to: 1. Use ONLY plain text (no markdown and NO emojis), 2. Create a flexible number of sections based on topic depth, and 3. Ensure the hook is punchy and optimized for LinkedIn.
- [ ] Task: Conductor - User Manual Verification 'Agent Logic' (Protocol in workflow.md)

## Phase 2: Data Persistence
- [ ] Task: Update `Post` model in `backend/src/models/post.py`.
    - *How To*: Add the following fields to the `Post` document: `hook` (StringField), `sections` (ListField of DictField), `key_takeaways` (ListField of StringField), `call_to_action` (StringField), and `hashtags` (ListField of StringField). Ensure `DictField` is imported from `mongoengine`.
- [ ] Task: Update `research_post` route in `backend/src/routes/posts.py`.
    - *How To*: Update the call to `research_single_topic` to pass the `post.day` value. Then, update the `post.update()` call to map the new fields (`hook`, `sections`, `key_takeaways`, `call_to_action`, `hashtags`, `sources`) from the synthesis result to the database document.
- [ ] Task: Conductor - User Manual Verification 'Data Persistence' (Protocol in workflow.md)
