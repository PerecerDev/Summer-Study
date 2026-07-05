# MVP Definition — Summer Study

Version: 1.0  
Status: Pending client approval

---

## Goal

Deliver the **core learning loop** end-to-end: login → select subject → complete 20 AI-generated exercises → view results → browse history.

Gamification (stars, XP, streaks) and additional subjects ship in Phase 2. Architecture supports them from day one.

---

## MVP Scope (In)

| # | Capability | Acceptance |
| - | ---------- | ---------- |
| 1 | App shell | Tablet-first layout, routing, tab navigation |
| 2 | Auth | Student login/logout; session persistence |
| 3 | Parent gate | Password modal (verify only; full panel P1) |
| 4 | Home | 5 subject cards; start round |
| 5 | Round engine | 20 exercises; progress bar; skip/defer modals |
| 6 | AI generation | Matemáticas pilot; server-side; validated |
| 7 | Exercise UI | MC, true/false, fill blank; immediate feedback |
| 8 | Results | Score summary; save to DB |
| 9 | History | List + round detail |
| 10 | Design system | Button, SubjectCard, ProgressBar, modals, skeletons |
| 11 | Database | Schema + migrations; Neon connected |
| 12 | API | Auth, rounds, history endpoints per `API_DESIGN.md` |
| 13 | Tests | Auth, round flow, history — critical paths |
| 14 | CI | Lint, typecheck, test, build on PR |
| 15 | Deploy | Vercel preview + production on `main` |

---

## MVP Scope (Out)

| Item | Phase |
| ---- | ----- |
| Stars, XP, levels, streaks | Phase 2 |
| Badges / logros UI | Phase 2 |
| Parent panel (full) | Phase 2 |
| Subjects beyond Matemáticas (AI) | Phase 2 |
| Progress dashboard | Phase 2 |
| Adaptive difficulty | Phase 3 |
| PWA / offline | Phase 4 |

---

## Technical MVP Stack

| Layer | Choice |
| ----- | ------ |
| Frontend | React, TypeScript, Vite, Tailwind |
| State | TanStack Query, Zustand |
| Backend | Vercel serverless + REST `/api/v1` |
| Database | Neon PostgreSQL + Drizzle |
| AI | LLM server-side, prompts v1.0.0 (math) |
| Quality | ESLint, Prettier, Husky, Vitest |

See ADRs in `.claude/decisions/`.

---

## MVP Success Criteria

- [ ] Child completes a math round without adult help on iPad Air 2
- [ ] Round loads in < 3s perceived time (after first generation)
- [ ] 20 exercises are unique and curricularly appropriate (parent review)
- [ ] History shows all completed rounds with correct detail
- [ ] Lighthouse performance ≥ 80 on tablet viewport
- [ ] CI green on all PRs to `main`
- [ ] No secrets in repository
- [ ] WCAG 2.1 AA on core screens

---

## Implementation Order

Per project charter:

1. Infrastructure (scaffold, CI, quality tooling)
2. Authentication
3. Data model + migrations
4. Backend API
5. Frontend base (shell, routing, design system)
6. AI system (math pilot)
7. Round engine
8. History
9. Gamification hooks (empty rewards array)
10. Optimization
11. Testing pass
12. Production deploy

---

## Approval

- [ ] Client approval
- [ ] Design Guardian (after design pipeline)
- [ ] Engineering Guardian (after engineering pipeline)
