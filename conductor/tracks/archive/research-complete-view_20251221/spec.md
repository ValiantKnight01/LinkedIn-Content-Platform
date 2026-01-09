# Track: Research Complete View (Approval Editor)

**Goal:** Implement the "Research Complete View" (Approval Editor) as a slide-over sheet for cards in the "Selected" column that have completed their research phase.

## 1. Overview
This track introduces a new detail view for "Selected" cards in the Newsroom Kanban. When a card in the "Selected" column reaches the "Research Complete" state, clicking it opens a slide-over sheet. This sheet displays the AI-generated research (Title, Read Time, Description, Angle, Data Points) and allows the user to approve the idea for drafting or discard it.

## 2. Functional Requirements

### 2.1 Trigger & Entry Point
- **Context:** Applies ONLY to cards in the **Selected** column.
- **Sub-states:** The "Selected" column now has three internal sub-states:
  1.  `queued` (Waiting for research)
  2.  `researching` (AI processing - visual indicator only for this track)
  3.  `complete` (Research ready for review)
- **Interaction:** Clicking a card in the `complete` state opens the "Research Complete View".
- **Visual Cue:** Cards in the `complete` state should have a distinct visual indicator (e.g., a "Research Ready" badge or icon) to differentiate them from `queued` or `researching` cards.

### 2.2 Research Complete View (Sheet)
- **Component:** Use `shadcn/ui` Sheet component.
- **Position:** Slide-over from the right.
- **Content:** Matches the reference design (`frontend/references/editorial-view-research-complete/code.html`).

#### 2.2.1 Data Fields & Editable State
| Field | Source | Editable? | Notes |
| :--- | :--- | :--- | :--- |
| **Title** | `card.title` | **YES** | Text input |
| **Est. Read Time** | `card.readTime` | No | Display only (e.g., "Est. 5 min read") |
| **Description** ("Why this matters?") | `card.description` | No | Display only |
| **Proposed Angle** | `card.angle` | **YES** | **Dropdown** (Options: Contrarian, Educational, Personal Story, etc. from AI) |
| **Key Data Points** | `card.dataPoints` | No | List of strings. Display only. |
| **Tags/Categories** | `card.tags` | No | Display only |
| **Target Audience** | `card.audience` | No | Display only |
| **Source URL** | `card.sourceUrl` | No | Display only |

### 2.3 User Actions
- **Approve & Draft:**
  - **Action:** Moves the card to the **In Draft** column.
  - **State Change:** Updates status to `inDraft`.
  - **Feedback:** Sheet closes, toast notification "Moved to Drafts".
- **Discard Idea:**
  - **Action:** Removes the card from the board.
  - **Feedback:** Sheet closes, toast notification "Idea Discarded".

### 2.4 State Management
- Update `KanbanCard` type in `store.ts` to include:
  - `researchStatus`: `'queued' | 'researching' | 'complete'` (Optional, likely only for 'selected' cards).
  - New content fields: `description`, `angle`, `readTime`, `dataPoints`, `tags`, `audience`, `sourceUrl`.
- **API Handling:** All data updates (Approve, Discard, Edit) MUST be handled via Next.js API routes. Mock data should be served and managed within these routes.

## 3. Non-Functional Requirements
- **Design:** Strict adherence to the "Digital Newsroom" aesthetic (fonts, colors) as seen in the reference HTML.
- **Responsive:** The Sheet should handle overflow content gracefully (scrollable body).

##  acceptance Criteria
- [ ] Clicking a "Selected" card (in `complete` state) opens the Research Complete Sheet.
- [ ] Sheet displays all required fields (Title, Angle, Read Time, Description, Data Points, Tags, Audience, Source).
- [ ] Title is editable.
- [ ] Angle is editable via a Dropdown.
- [ ] Other fields are read-only.
- [ ] "Approve & Draft" moves card to "In Draft" column via API.
- [ ] "Discard Idea" deletes the card via API.
- [ ] UI matches the reference design (typography, colors).

## 4. Out of Scope
- Real AI generation of the research content (mock data will be used).
- "Queued" and "Researching" state logic/timers (just the states existence and the 'complete' trigger are in scope).
