# Project Workflow

## Guiding Principles

1. **The Plan is the Source of Truth:** All work must be tracked in `plan.md`
2. **The Tech Stack is Deliberate:** Changes to the tech stack must be documented in `tech-stack.md` *before* implementation
3. **No Test Overhead:** This is a hobby project; automated tests and TDD are not required (Coverage target: 0%)
4. **User Experience First:** Every decision should prioritize user experience and the "Digital Newsroom" aesthetic
5. **Non-Interactive & CI-Aware:** Prefer non-interactive commands.

## Task Workflow

All tasks follow a strict lifecycle:

### Standard Task Workflow

1. **Select Task:** Choose the next available task from `plan.md` in sequential order

2. **Mark In Progress:** Before beginning work, edit `plan.md` and change the task from `[ ]` to `[~]`

3. **Implementation:**
   - Write the code necessary to fulfill the task requirements.
   - Follow the project's code style guidelines.

4. **Manual Verification:**
   - Verify the changes manually (e.g., check the UI, test the API endpoint).
   - Ensure it matches the "Digital Newsroom" design guidelines.

5. **Document Deviations:** If implementation differs from tech stack:
   - **STOP** implementation
   - Update `tech-stack.md` with new design
   - Add dated note explaining the change
   - Resume implementation

6. **Commit Code Changes:**
   - Stage all code changes related to the task.
   - **Task Summary in Commit:** Include a detailed summary of the task in the commit message body. This includes what was changed, why, and a list of modified files.
   - **Format:**
     ```
     <type>(<scope>): <short description>

     Task Summary:
     - <detailed point 1>
     - <detailed point 2>
     - Files modified: <file1>, <file2>
     ```
   - Perform the commit.

7. **Record Task Commit SHA:**
    - **Update Plan:** Read `plan.md`, find the line for the completed task, update its status from `[~]` to `[x]`, and append the first 7 characters of the commit hash.
    - Write the updated content back to `plan.md`.

8. **Commit Plan Update:**
    - Stage the modified `plan.md` file.
    - Commit this change (e.g., `conductor(plan): Mark task 'Create user model' as complete`).

### Phase Completion Verification and Checkpointing Protocol

**Trigger:** This protocol is executed immediately after a task is completed that also concludes a phase in `plan.md`.

1.  **Announce Protocol Start:** Inform the user that the phase is complete and the verification and checkpointing protocol has begun.

2.  **Propose a Detailed, Actionable Manual Verification Plan:**
    - Generate a step-by-step plan that walks the user through the verification process.
    - Await explicit user feedback. Do not proceed without an explicit "yes" or confirmation.

3.  **Create Checkpoint Commit:**
    - Stage all changes.
    - Perform a checkpoint commit: `conductor(checkpoint): Checkpoint end of Phase <Name>`. Include a summary of the phase's achievements in the body.

4.  **Record Phase Checkpoint SHA:**
    - Update `plan.md` with the checkpoint SHA for the phase heading.
    - Commit the `plan.md` update.

5.  **Announce Completion:** Inform the user that the phase is complete and the checkpoint has been created.

## Quality Gates

Before marking any task complete, verify:

- [ ] Functionality works as intended
- [ ] UI matches "Digital Newsroom" aesthetic (Warm Editorial palette, Serif headings, Bento modules)
- [ ] Code follows project's code style guidelines
- [ ] Implementation notes added to `plan.md`
- [ ] Changes committed with proper message summary

## Commit Guidelines

### Message Format
```
<type>(<scope>): <description>

Task Summary:
- <details>
```

### Types
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation only
- `style`: Formatting, UI/CSS changes
- `refactor`: Code change that neither fixes a bug nor adds a feature
- `chore`: Maintenance tasks

## Definition of Done

A task is complete when:

1. All code implemented to specification
2. Manually verified and matches design goals
3. Code follows style guidelines
4. Implementation notes and SHA added to `plan.md`
5. Changes committed with detailed summary in message