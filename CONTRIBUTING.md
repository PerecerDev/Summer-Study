# Contributing to Summer Study

Thank you for your interest in Summer Study. This project is built to portfolio-grade standards for a real educational product.

---

## Before You Start

1. Read the [Constitution](.claude/doc/CONSTITUTION.md) — non-negotiable principles
2. Review [Development Workflow](.claude/doc/DEVELOPMENT_WORKFLOW.md)
3. Check [ROADMAP](docs/ROADMAP.md) and [BACKLOG](docs/BACKLOG.md) for open work
4. No implementation without an approved plan in `.claude/plans/`

---

## Git Workflow

| Branch | Purpose |
| ------ | ------- |
| `main` | Production (default branch) |
| `feature/*` | Feature branches |

1. Branch from `main`: `feature/your-feature-name`
2. Make small, coherent commits
3. Open a PR to `main`
4. Ensure CI passes
5. Merge to `main` deploys production on Vercel

---

## Commit Messages

Follow [Conventional Commits](https://www.conventionalcommits.org/):

```
feat: add round progress bar
fix: correct login validation message
docs: update API design for history endpoint
test: add exercise feedback component tests
chore: update dependencies
```

---

## Pull Request Checklist

- [ ] Linked to approved plan or issue
- [ ] Summary of changes
- [ ] Screenshots for UI (tablet viewport 768×1024)
- [ ] Tests for new behavior
- [ ] No lint or type errors
- [ ] All UI states: loading, empty, error, success
- [ ] Tablet-first layout verified

---

## Code Standards

- TypeScript strict — no `any`
- Feature-based folder structure (see [PROJECT_STRUCTURE](.claude/doc/PROJECT_STRUCTURE.md))
- Tailwind + design system primitives — no one-off styles
- TanStack Query for server data; Zustand for UI-only state
- Never call LLM from client code

---

## Documentation

Significant decisions require an ADR in `.claude/decisions/`.

Update SSOT docs if you change architecture, data model, or API contracts.

---

## Questions

Open a GitHub issue using the appropriate template.
