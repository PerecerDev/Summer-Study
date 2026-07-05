# Summer Study — Technical Architecture

Version: 1.0  
Status: Active

---

# Purpose

Technical source of truth for stack, boundaries, patterns, persistence, AI integration, and engineering principles.

Precedence: `CONSTITUTION.md` > this document > implementation details.

---

# Architecture Principles

## Feature-Based Architecture

Organize by **domain feature** (rounds, exercises, auth, history, rewards), not by technical type at the root level.

Each feature owns: components, hooks, services, types, utils, and tests — colocated where practical.

## Separation of Concerns

| Layer                      | Responsibility                                         |
| -------------------------- | ------------------------------------------------------ |
| **UI components**          | Presentation, composition, local UI state              |
| **Features**               | Domain UI flows and feature-specific logic             |
| **Hooks**                  | Reusable stateful logic                                |
| **Services / API**         | HTTP calls, DTO mapping                                |
| **Server / API routes**    | Auth, AI generation, persistence, business rules       |
| **Stores (Zustand)**       | Global UI state only (theme, session UI, modals)       |
| **Query (TanStack Query)** | Server/async data, cache, mutations                    |
| **Types / DTOs**           | Domain and API contracts                               |
| **Utils**                  | Pure helpers                                           |

## Global State Only When Necessary

- **TanStack Query:** rounds, history, progress, user profile (async data)
- **Zustand:** ephemeral UI (modals, round in-progress UI chrome)
- **React Context:** providers (auth, query client) — not for high-churn data
- **Local state:** form inputs, current exercise index, animations

## Composition Over Inheritance

Prefer small composable components and hooks over class hierarchies or mega-components.

## API-First Persistence

All data flows through a typed API layer. UI never accesses the database directly. Neon PostgreSQL via server-side connection.

## AI on the Server

Exercise generation runs **server-side only**. LLM API keys never ship to the client. Prompts are versioned and auditable.

---

# Technology Stack

## Core (Frontend)

| Category     | Technology            | Notes                                      |
| ------------ | --------------------- | ------------------------------------------ |
| Framework    | React 18+             | Function components, hooks                 |
| Language     | TypeScript (strict)   |                                            |
| Build        | Vite                  | Fast dev, optimized production bundle      |
| Routing      | React Router          | Lazy-loaded routes                         |
| Server state | TanStack Query        | Cache, mutations, optimistic where safe    |
| Client state | Zustand               | UI-only global state                       |
| Styling      | Tailwind CSS          | Design tokens for child-friendly UI        |
| Forms        | React Hook Form + Zod | Exercise answers, auth forms               |

**Framework note:** React + Vite is the default choice for iPad Air 2 performance (small bundle, fast load). Next.js remains an option for a future ADR if SSR or unified API routes are preferred. Any change requires human approval and an ADR in `.claude/decisions/`.

## Backend / Persistence

| Category     | Technology            | Notes                                      |
| ------------ | --------------------- | ------------------------------------------ |
| Database     | Neon PostgreSQL       | Serverless Postgres, connection pooling    |
| ORM / Query  | TBD (Drizzle or Prisma)| ADR required before implementation        |
| API          | REST or tRPC          | Typed contracts shared with frontend       |
| Auth         | TBD                   | Session-based; parent password gate        |
| AI           | LLM API (server-side) | OpenAI or equivalent; prompts versioned    |

## Quality

| Tool                  | Purpose                |
| --------------------- | ---------------------- |
| ESLint                | Linting                |
| Prettier              | Formatting             |
| Husky + lint-staged   | Pre-commit checks      |
| Vitest                | Unit/integration tests |
| React Testing Library | Component tests        |

## Deployment & Tooling

| Tool           | Purpose         |
| -------------- | --------------- |
| Vercel         | Frontend hosting + serverless API (if applicable) |
| Neon           | PostgreSQL      |
| GitHub Actions | CI              |
| Git / GitHub   | Version control (public repo) |

---

# Application Structure (Target)

```
summer-study/
├── .claude/                 # Agent network, plans, reports, decisions
├── .github/workflows/       # CI
├── public/
├── src/
│   ├── app/                 # Bootstrap, providers, router
│   ├── features/            # auth, rounds, exercises, history, rewards, …
│   ├── shared/              # Cross-feature UI, hooks, utils
│   ├── assets/
│   └── styles/
├── server/                  # API layer (or api/ if Vercel functions)
│   ├── routes/
│   ├── services/            # AI generation, persistence
│   ├── db/                  # Schema, migrations
│   └── prompts/             # Versioned AI prompt templates
├── index.html
├── package.json
├── vite.config.ts
├── tailwind.config.ts
└── README.md
```

See `PROJECT_STRUCTURE.md` for detailed rules.

---

# Routing

- React Router with lazy-loaded route modules
- Protected routes for authenticated areas
- Parent admin routes behind additional password gate
- Route-level code splitting

---

# Data Flow

```
UI → hook → TanStack Query → API service → server route → DB / LLM
                ↓
         cache invalidation → UI update
```

Round generation:

```
Student selects subject → API requests round → server builds prompt → LLM generates 20 exercises → validated → stored → returned to client
```

---

# AI Exercise Generation

| Concern            | Approach                                                |
| ------------------ | ------------------------------------------------------- |
| Prompt design      | Versioned templates per subject; documented in `server/prompts/` |
| Validation         | Zod schema for generated exercise shape before storage  |
| Curriculum guard   | System prompt enforces 4º Primaria / Spanish curriculum |
| Retry              | Regenerate on validation failure (max attempts)         |
| Caching            | Store generated rounds; avoid regeneration on replay    |
| Cost control       | Rate limits, token budgets per request                  |

Never expose API keys or raw prompts to the client.

---

# Security

- No secrets in client bundle
- LLM and DB credentials server-side only (env vars)
- Parent admin actions behind password (hashed server-side)
- Input sanitization on all user answers
- CSRF protection on mutations
- Dependency audit in CI
- Rate limiting on AI generation endpoints

---

# Performance (iPad Air 2 Priority)

| Target                    | Guideline                                      |
| ------------------------- | ---------------------------------------------- |
| Initial load              | < 3s on throttled 3G + iPad-class CPU          |
| Round start               | Perceived instant; skeleton while loading      |
| Bundle                    | Route-based code splitting; tree-shaking       |
| Re-renders                | Minimal; memoize only when measured necessary  |
| Network                   | Batch where possible; cache completed rounds   |
| Animations                | CSS transforms; respect `prefers-reduced-motion` |
| Images                    | Optimized assets; SVG icons preferred          |

Targets: LCP < 2.5s, INP < 200ms, CLS < 0.1 on reference tablet viewport.

---

# Testing Strategy

- **Unit:** utils, hooks, pure functions, prompt validators
- **Component:** RTL for UI behavior, touch targets, accessibility
- **Integration:** round flow with mocked API and AI
- **API:** server route tests with test database
- Critical paths: auth, round start, exercise answer, round complete, history retrieve

---

# Git Workflow

| Branch      | Purpose                              |
| ----------- | ------------------------------------ |
| `main`      | Production-ready                     |
| `develop`   | Integration branch                   |
| `feature/*` | Feature development (e.g. `feature/round-engine`) |

Small, coherent commits. Conventional commit messages. PR required for merge to `develop` or `main`.

---

# Prohibited Patterns

- Business logic inside presentational components
- Fetch calls directly in components (use services + query)
- LLM calls from the client
- Duplicated types across features (align with `DATA_MODEL.md`)
- Prop drilling > 3 levels without context or composition
- `any` without ADR exception
- CSS-in-JS libraries (use Tailwind + design tokens)
- Heavy animation libraries that bloat the bundle
- Storing secrets or API keys in source code

---

# Future Considerations

- PWA / offline round replay
- Content maps per subject (structured curriculum JSON)
- Adaptive difficulty based on weakness detection
- Multi-student / multi-family support
