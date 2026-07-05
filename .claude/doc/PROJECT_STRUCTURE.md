# Summer Study — Project Structure

Version: 1.0  
Status: Active

---

# Purpose

Defines repository layout, feature organization, naming conventions, and where code belongs.

---

# Core Principles

## Feature-Based Organization

Code is organized by **business domain** (rounds, exercises, auth, history, rewards), not by technical layer at the top level.

## Co-Locate Related Code

Keep components, hooks, services, types, and tests close to the feature that owns them.

## Shared vs Feature-Specific

| Location                 | Belongs here                                    |
| ------------------------ | ----------------------------------------------- |
| `src/features/<name>/`   | Domain-specific UI and logic                    |
| `src/shared/components/` | Design system primitives (Button, SubjectCard)  |
| `src/shared/hooks/`      | Generic hooks (useMediaQuery, useDebounce)      |
| `src/shared/lib/`        | Query client, API client, constants             |
| `src/app/`               | Router, providers, root layout                  |
| `server/`                | API routes, DB, AI services, prompts            |

## Clear Boundaries

Features must not import from sibling features' internals. Cross-feature needs go through `shared/` or public feature APIs (`features/rounds/index.ts`).

---

# Root Structure (Target)

```
summer-study/
├── .claude/                 # Agent network, plans, reports, decisions
├── .github/workflows/       # CI
├── docs/                    # Public documentation (roadmap, guides)
├── public/
├── src/
│   ├── app/
│   ├── features/
│   ├── shared/
│   ├── assets/
│   └── styles/
├── server/
│   ├── routes/
│   ├── services/
│   ├── db/
│   └── prompts/
├── index.html
├── package.json
├── vite.config.ts
├── tailwind.config.ts
├── tsconfig.json
├── eslint.config.js
└── README.md
```

---

# Feature Modules (Planned)

```
src/features/
├── auth/
├── home/
├── rounds/
├── exercises/
├── results/
├── history/
├── progress/
├── rewards/
└── parent/
```

---

# Feature Module Structure

```
src/features/rounds/
├── components/
│   ├── RoundStart.tsx
│   └── RoundProgress.tsx
├── hooks/
│   └── useRound.ts
├── services/
│   └── roundService.ts
├── types/
│   └── round.types.ts
├── __tests__/
│   └── RoundStart.test.tsx
└── index.ts               # Public exports only
```

---

# Naming Conventions

| Artifact   | Convention              | Example               |
| ---------- | ----------------------- | --------------------- |
| Components | PascalCase              | `ExerciseCard.tsx`    |
| Hooks      | camelCase, `use` prefix | `useRound.ts`         |
| Services   | camelCase + Service     | `roundService.ts`     |
| Types file | dot types               | `round.types.ts`      |
| Utils      | camelCase               | `formatScore.ts`      |
| Tests      | same name + `.test.tsx` | `ExerciseCard.test.tsx` |
| Routes     | kebab-case paths        | `/history/:roundId`   |
| Branches   | feature/kebab-case      | `feature/ai-generation` |

---

# Import Rules

1. Use path aliases (`@/features/...`, `@/shared/...`) — configure in `vite.config.ts` and `tsconfig`
2. Prefer named exports
3. Feature `index.ts` exports only public API
4. No deep imports into another feature's `components/` folder
5. Shared components must not import from features

---

# Where New Code Belongs

| Need                     | Location                                         |
| ------------------------ | ------------------------------------------------ |
| New exercise UI          | `features/exercises/components/`                 |
| Round API call           | `features/rounds/services/` or `server/routes/`  |
| AI prompt template       | `server/prompts/<subject>/`                        |
| Reusable button          | `shared/components/ui/`                          |
| App-wide auth provider   | `app/providers/`                                 |
| Route definition         | `app/router/`                                    |
| Zod schema               | colocate in feature or `server/schemas/`         |
| DB migration             | `server/db/migrations/`                          |
| Mock data                | `features/<f>/mocks/` or `shared/mocks/`         |

---

# Design System Location

```
src/shared/components/ui/
├── Button/
├── SubjectCard/
├── ExerciseCard/
├── AnswerOption/
├── ProgressBar/
└── ...
```

Each primitive: component + variants + optional test + export from barrel.

---

# State Location

| State type        | Location                                |
| ----------------- | --------------------------------------- |
| Server data       | TanStack Query in hooks                 |
| Round UI state    | Zustand or local state in feature       |
| Form              | React Hook Form local to form component |

---

# Documentation in Repo

- JSDoc for non-obvious public APIs only
- ADRs in `.claude/decisions/` for significant architecture choices
- Roadmap in `docs/ROADMAP.md`
- AI prompts documented in `server/prompts/README.md`
- No duplicate SSOT — link to `.claude/doc/` files in README and CLAUDE.md
