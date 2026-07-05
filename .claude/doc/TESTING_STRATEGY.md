# Summer Study — Testing Strategy

Version: 1.0  
Status: Active

---

# Purpose

Defines testing approach across unit, integration, component, and E2E layers before implementation begins.

Precedence: `CONSTITUTION.md` > `DEVELOPMENT_WORKFLOW.md` > this document.

---

# Testing Pyramid

```
        ┌─────────┐
        │   E2E   │  Few — critical paths only
        ├─────────┤
        │ Integr. │  API + round flow with mocks
        ├─────────┤
        │Component│  UI behavior, a11y, touch
        ├─────────┤
        │  Unit   │  Utils, validators, hooks
        └─────────┘
```

---

# Tools

| Layer | Tool |
| ----- | ---- |
| Unit / Integration | Vitest |
| Components | React Testing Library |
| API | Vitest + supertest (or fetch mock) |
| E2E | Playwright (Phase 1 infra setup) |
| Mock API | MSW |
| Coverage | Vitest v8 coverage (CI reporting) |

---

# What to Test

## Unit tests (high priority)

| Target | Examples |
| ------ | -------- |
| Zod schemas | Exercise validation, API DTOs |
| AI validators | Ambiguity checks, dedup |
| Pure utils | `formatScore`, `calculateXp`, `normalizeAnswer` |
| Hooks (isolated) | `useRoundProgress` with renderHook |

## Component tests (high priority)

| Component | Assertions |
| --------- | ---------- |
| `AnswerOption` | Selection, keyboard, touch size |
| `ProgressBar` | aria values, visual state |
| `ExerciseView` | Renders question, submits answer |
| `LoginForm` | Validation errors, submit disabled |
| Modals | Focus trap, confirm/cancel |

## Integration tests (medium priority)

| Flow | Scope |
| ---- | ----- |
| Round lifecycle | generate → answer × 20 → complete |
| Auth | login → session → protected route |
| History | complete round → appears in list |
| AI pipeline | mock LLM → validate → persist |

## E2E tests (selective)

| Scenario | Tool |
| -------- | ---- |
| Happy path: login → math round → results | Playwright |
| History review | Playwright |
| Parent gate | Playwright |

Run E2E on CI against preview deploy (nightly or on `develop` merge).

---

# What NOT to Test

- Implementation details (internal state variable names)
- Third-party library internals
- Pixel-perfect visual regression (v1)
- Real LLM API calls in CI

---

# Mocking Strategy

| Dependency | Mock |
| ---------- | ---- |
| LLM API | Fixture JSON responses |
| Database | Test DB (Neon branch) or in-memory SQLite for unit |
| Auth | MSW session cookie |
| Time | `vi.useFakeTimers()` for streak tests |

---

# Coverage Targets

| Area | Target |
| ---- | ------ |
| `server/services/` (AI, rounds) | ≥ 80% |
| `shared/utils/` | ≥ 90% |
| Critical UI flows | Behavior covered, not line % |
| Overall | Meaningful, not vanity 100% |

---

# CI Pipeline (see `.github/workflows/ci.yml`)

```
on: push, pull_request
jobs:
  lint → typecheck → unit+component → build → (e2e on develop)
```

PR merge blocked if any job fails.

---

# Test Data

- Seed script: 1 test user, 5 subjects, 3 sample rounds
- Fixtures in `server/__fixtures__/` and `src/shared/mocks/`
- No production data in tests

---

# Accessibility Testing

- `jest-axe` or `@axe-core/react` in component tests for critical screens
- Manual VoiceOver pass on iPad before release
- Touch target size assertions where feasible

---

# Performance Testing

- Lighthouse CI on PR (performance ≥ 80)
- Bundle size check (fail if > 500kb initial gzip — threshold TBD)

---

# Definition of Test Done (per feature)

- [ ] Unit tests for new pure logic
- [ ] Component tests for new UI with all states
- [ ] Integration test if feature crosses API boundary
- [ ] No regression in existing tests
- [ ] Mocks updated to match API contracts
