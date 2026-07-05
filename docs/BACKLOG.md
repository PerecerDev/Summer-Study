# Summer Study — Product Backlog

Version: 1.0  
Status: Active — prioritized for MVP and beyond

Priority: **P0** = MVP blocker | **P1** = next slice | **P2** = future

---

## Epic E1 — Infrastructure

| ID | Story | Priority | Status |
| -- | ----- | -------- | ------ |
| E1-01 | Scaffold Vite + React + TS + Tailwind | P0 | Done |
| E1-02 | Configure ESLint, Prettier, Husky, lint-staged | P0 | Done |
| E1-03 | Configure Vitest + RTL | P0 | Done |
| E1-04 | GitHub Actions CI (lint, test, build) | P0 | Done |
| E1-05 | Vercel project + env vars | P0 | Done |
| E1-06 | Neon project + dev database | P0 | Done |
| E1-07 | Branches `main` and `develop` + protection | P0 | Done (local) |
| E1-08 | `.env.example` and secrets documentation | P0 | Done |

---

## Epic E2 — Authentication

| ID | Story | Priority | Status |
| -- | ----- | -------- | ------ |
| E2-01 | DB schema: users, sessions, parents | P0 | Done |
| E2-02 | POST /auth/login, logout, session | P0 | Done |
| E2-03 | Login screen (all states) | P0 | Done |
| E2-04 | Protected routes | P0 | Done |
| E2-05 | Parent password verify endpoint | P0 | Done |
| E2-06 | ParentGate modal component | P0 | Done |

---

## Epic E3 — Home & Subjects

| ID | Story | Priority | Status |
| -- | ----- | -------- | ------ |
| E3-01 | Seed 5 subjects in DB | P0 | Done |
| E3-02 | GET /subjects | P0 | Done |
| E3-03 | Home page with SubjectGrid | P0 | Done |
| E3-04 | SubjectCard component | P0 | Done |
| E3-05 | Active round banner (resume) | P0 | Done |

---

## Epic E4 — AI & Round Engine

| ID | Story | Priority | Status |
| -- | ----- | -------- | ------ |
| E4-01 | Prompt templates v1.0.0 (math) | P0 | Done |
| E4-02 | Zod schema for generated exercises | P0 | Done |
| E4-03 | Generation service + retry logic | P0 | Done |
| E4-04 | POST /rounds/generate | P0 | Done |
| E4-05 | DB schema: rounds, exercises, attempts | P0 | Done |
| E4-06 | POST /rounds/:id/attempts | P0 | Done |
| E4-07 | POST /rounds/:id/complete | P0 | Done |
| E4-08 | POST /rounds/:id/abandon | P0 | Done |
| E4-09 | Round page + ExerciseView | P0 | Done |
| E4-10 | ProgressBar component | P0 | Done |
| E4-11 | Skip and defer modals | P0 | Done |
| E4-12 | Feedback panel (correct/incorrect) | P0 | Done |

---

## Epic E5 — Results & History

| ID | Story | Priority | Status |
| -- | ----- | -------- | ------ |
| E5-01 | Results screen | P0 | Done |
| E5-02 | GET /history/rounds | P0 | Done |
| E5-03 | GET /rounds/:id (detail) | P0 | Done |
| E5-04 | History list page | P0 | Done |
| E5-05 | Round detail page | P0 | Done |

---

## Epic E6 — Profile & Shell

| ID | Story | Priority | Status |
| -- | ----- | -------- | ------ |
| E6-01 | AppLayout with bottom tabs | P0 | Done |
| E6-02 | RoundLayout (immersive) | P0 | Done |
| E6-03 | Profile page + logout | P0 | Done |
| E6-04 | Splash / boot screen | P0 | Done |
| E6-05 | Error boundary + error states | P0 | Done |

---

## Epic E7 — Gamification (Phase 2)

| ID | Story | Priority | Status |
| -- | ----- | -------- | ------ |
| E7-01 | Reward calculation service | P1 | Done |
| E7-02 | Stars on results screen | P1 | Done |
| E7-03 | XP + level on profile | P1 | Done |
| E7-04 | Streak tracking | P1 | Done |
| E7-05 | Achievements page + badges | P1 | Done |

---

## Epic E8 — Additional Subjects (Phase 2)

| ID | Story | Priority | Status |
| -- | ----- | -------- | ------ |
| E8-01 | Prompt templates: Lengua | P1 | Done |
| E8-02 | Prompt templates: Inglés | P1 | Done |
| E8-03 | Prompt templates: Valenciano | P1 | Done |
| E8-04 | Prompt templates: Medi | P1 | Done |
| E8-05 | Parent review per subject | P1 | Done |

---

## Epic E9 — Parent Panel (Phase 2)

| ID | Story | Priority | Status |
| -- | ----- | -------- | ------ |
| E9-01 | GET /parent/overview | P1 | Done |
| E9-02 | Parent layout + overview page | P1 | Done |
| E9-03 | Progress by subject charts | P1 | Done |

---

## Epic E10 — Quality & Polish

| ID | Story | Priority | Status |
| -- | ----- | -------- | ------ |
| E10-01 | E2E: happy path Playwright | P0 | Done |
| E10-02 | Lighthouse CI | P1 | Done |
| E10-03 | Accessibility audit (core screens) | P0 | Done |
| E10-04 | iPad Air 2 performance pass | P0 | Done |

---

## Backlog Grooming Rules

1. P0 items block MVP release
2. New items require BA intake + plan before sprint
3. AI prompt changes require version bump
4. Quality over speed — never skip tests for P0 flows
