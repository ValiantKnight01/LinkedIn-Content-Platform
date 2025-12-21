# Track 1: Foundation & Identity

**Goal:** Establish the visual core and secure access control.

## Task 1: The "Warm Editorial" Theme Engine
**Objective:** Implement the product's visual identity using strict Tailwind v4 CSS variables.
- [ ] **Define Global Variables:**
  - Update `app/globals.css` with the specific **Hex values** from `product-guidelines.md` (Cream Paper `#fefae0`, Warm Tan `#d4a373`, etc.).
  - Map these to shadcn standard variables (`--background`, `--primary`, `--foreground`).
- [ ] **Typography Setup:**
  - Configure `next/font` in `app/layout.tsx` with **Playfair Display** (Headings) and **Inter** (Body).
  - Bind them to CSS variables (`--font-serif`, `--font-sans`).
- [ ] **Verification:**
  - Ensure a simple `<div class="bg-primary text-primary-foreground">Test</div>` renders with the correct Warm Tan background and Light Cream text.

## Task 2: Secure Access & Personalization
**Objective:** Protect the application and personalize the entry point.
- [ ] **Middleware Implementation:**
  - Create `middleware.ts` at the project root.
  - logic: Redirect all unauthenticated users to `/login`.
  - Exclude public assets and API routes: `['/((?!api|_next/static|_next/image|favicon.ico|login).*)']`.
- [ ] **Personalized Greeting:**
  - Update `app/page.tsx` (Server Component).
  - Retrieve the session using `getServerSession`.
  - Render a clear `<h1>Welcome, {session.user.name}</h1>` using the user's name from the LinkedIn profile.
- [ ] **Login Redirect:**
  - Ensure the "Connect with LinkedIn" button properly redirects to `/` upon success.
