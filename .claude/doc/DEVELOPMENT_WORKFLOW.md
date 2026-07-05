# Summer Study — Development Workflow

Version: 1.0  
Status: Active

---

# Purpose

Defines how software is developed: lifecycle, standards, testing, PRs, Git flow, and definition of done.

---

# Development Lifecycle

```
Request → BA Analysis → Plan Approval → Design Pipeline → Engineering Pipeline → QA → Delivery
```

No implementation without an approved plan in `.claude/plans/`.

---

# Git Workflow

| Branch      | Purpose                                           |
| ----------- | ------------------------------------------------- |
| `main`      | Production-ready releases                         |
| `develop`   | Integration branch for completed features         |
| `feature/*` | Feature branches (e.g. `feature/round-engine`)    |

Rules:

- Branch from `develop` for new features
- Merge to `develop` via PR after review and CI pass
- Merge `develop` → `main` for releases
- Small, coherent commits — never large disordered commits
- Conventional commits: `feat:`, `fix:`, `refactor:`, `test:`, `docs:`, `chore:`

---

# Implementation Order (Within a Feature)

1. Types and data model alignment (`DATA_MODEL.md`)
2. Database schema / migration (if persistence involved)
3. Server API route + service layer
4. AI prompt template (if generation involved)
5. TanStack Query hooks
6. Shared UI primitives (if new)
7. Feature components (all states)
8. Route integration
9. Tests (unit + component + API + critical integration)
10. Tablet-first responsive pass (iPad Air 2 reference)
11. Performance check
12. Documentation updates if patterns changed

---

# Coding Standards

## TypeScript

- `strict: true`
- Prefer `interface` for object shapes; `type` for unions/intersections
- No `any`; use `unknown` + narrowing
- Explicit return types on public APIs

## React

- Function components only
- One primary component per file
- Extract hooks when logic exceeds ~15 lines or is reused
- Keys on lists; no index keys for dynamic reorderable lists

## Styling

- Tailwind utility classes; extract patterns to components when repeated 3+ times
- Design tokens via Tailwind config (colors, spacing, typography)
- Tablet-first breakpoints

## Forms

- React Hook Form + Zod resolver
- Accessible labels, errors linked with `aria-describedby`
- Large touch-friendly inputs
- Disable submit during pending mutation

---

# PR Standards

Every PR includes:

- Summary of change and link to plan
- Screenshots/video for UI changes (tablet viewport required)
- Test coverage for new behavior
- No eslint/prettier violations
- Self-review checklist (a11y, tablet layout, states, performance)

---

# Testing Philosophy

- Test behavior, not implementation details
- Prioritize: round flow, exercise feedback, auth, history retrieval, AI validation
- Mock services and LLM in tests — never call real AI in CI
- Coverage target: meaningful coverage on features, not 100% vanity

---

# Pre-Commit (Husky + lint-staged)

- ESLint on staged TS/TSX
- Prettier format
- Typecheck on CI

---

# AI-Assisted Development

- PM orchestrates via agent network (see `CLAUDE.md`)
- Agents read SSOT docs before acting
- Task reports in `.claude/reports/` for session memory
- Human approval for architecture, scope, schema, and prompt changes

---

# Definition of Done

A feature is done when:

- [ ] Acceptance criteria from plan met
- [ ] All UI states implemented (loading, empty, error, success)
- [ ] Tablet-first on iPad Air 2 reference viewport
- [ ] Responsive on mobile and desktop (secondary)
- [ ] WCAG 2.1 AA checks passed (Design + a11y review)
- [ ] Tests written and passing
- [ ] No new lint/type errors
- [ ] Performance acceptable on throttled tablet profile
- [ ] Design Guardian + Engineering Guardian approved
- [ ] QA sign-off

---

# Local Development (When Code Exists)

```bash
npm install
npm run dev      # Vite dev server
npm run test     # Vitest
npm run lint
npm run build
```

Deploy preview via Vercel on PR.
