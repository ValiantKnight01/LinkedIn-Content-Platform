# Technology Stack

## Frontend
- **Framework:** Next.js 16 (React 19)
- **Language:** TypeScript
- **Styling:** TailwindCSS v4
- **UI Components:** shadcn/ui
- **State Management:** Zustand / React Hooks
- **Drag & Drop:** @dnd-kit (Core, Sortable, Utilities)
- **Authentication:** NextAuth.js

## Backend
- **Framework:** LangGraph (Agent Orchestration)
- **LLM Providers:**
  - **Groq** (via `langchain-groq`)
  - **Anthropic** (via `langchain-anthropic`)
  - **Cloudflare AI Workers** (via `langchain-community`)
- **Language:** Python 3.12+
- **Web Scraping:** `beautifulsoup4`, `aiohttp`, `ddgs` (DuckDuckGo Search)
- **PDF Generation:** `playwright` (Chromium), `Jinja2`
- **Task Queue:** Redis (for post scheduling and background AI processing)
- **Runtime:** Managed via `uv`

## Database & Storage
- **Primary Database:** MongoDB
- **ORM/ODM:** Mongoengine
- **Caching:** Redis

## Infrastructure & DevOps
- **Containerization:** Docker & Docker Compose
- **Deployment:** (To be defined, likely container-based)
- **Version Control:** Git
