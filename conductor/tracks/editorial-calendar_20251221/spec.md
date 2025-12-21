# Track 2: Newsroom Dashboard (Syllabus)

**Goal:** Implement the primary "Syllabus" interface featuring a full Calendar View and Sidebar navigation.

## 1. Overview
This track builds the core dashboard of the application. It introduces the global sidebar layout and the "Syllabus" view, which contains a Calendar for content planning.

## 2. Functional Requirements

### 2.1 Global Application Shell
- **Sidebar Navigation:**
  - Implement a fixed left sidebar.
  - Navigation Items: "Syllabus" (Default/Active), "Newsroom", "Archives".
  - **Active Theme Widget:** A visual widget in the sidebar showing the current month's theme (Mock data: "RAG Architectures").
- **Main Content Area:**
  - Dynamic area that renders the selected view.

### 2.2 Calendar View (Syllabus)
- **Month Grid:** Render a standard monthly calendar grid (7 columns for days).
- **Navigation:** Buttons for "Previous Month" (< October) and "Next Month" (December >).
- **Header:** Display current month and year (e.g., "November Editorial Calendar") in Serif font.

### 2.3 Post Cards (Calendar Items)
- **Visual Representation:** Small pill/card indicators placed on specific dates.
- **Content:** Post Title/Topic (e.g., "Intro to Vectors").
- **Status Indicators:**
  - **Yellow Dot:** Draft/Idea
  - **Blue Dot:** In Progress/Writing
  - **Green Dot:** Scheduled/Ready
- **Interaction:** Clicking a post card should open a placeholder detail view (modal or log).

### 2.4 Data Simulation
- **Mock API:** Create Next.js 16 API Route Handlers (e.g., `app/api/posts/route.ts`) that return static JSON data.
- **Frontend Fetching:** The Calendar component must fetch this data asynchronously, treating it like a real backend source.

## 3. Non-Functional Requirements
- **Design:** Strict adherence to "Warm Editorial" theme.
  - Background: Cream Paper (`#fefae0`)
  - Accent: Warm Tan (`#d4a373`)
  - Fonts: Playfair Display (Headings), Inter (Body)
- **Tech Stack:** Next.js 16, Tailwind CSS v4, shadcn/ui, Zustand.
- **Responsiveness:** Desktop-first (as per reference).

## 4. Acceptance Criteria
- [ ] Sidebar is visible and "Syllabus" link is active by default.
- [ ] Calendar renders the current month correctly in the Syllabus view.
- [ ] "Previous" and "Next" buttons correctly change the displayed month.
- [ ] Mock posts are visible on the calendar with correct color-coded status dots.
- [ ] The UI matches the reference image (`frontend/references/calendar_view/screen.png`) closely.

## 5. Out of Scope
- Real database connection (Backend).
- Drag-and-drop rescheduling.
- Full implementation of "Newsroom" or "Archives" pages (just placeholders).
