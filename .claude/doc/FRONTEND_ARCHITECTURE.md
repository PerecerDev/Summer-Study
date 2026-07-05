# Summer Study — Frontend Architecture

Version: 1.0  
Status: Active — design specification (no components until approved plan)

---

# Purpose

Defines frontend structure, routing, layouts, state management, forms, loading/error patterns, animations, and responsive strategy before implementation.

Precedence: `CONSTITUTION.md` > `TECH_ARCHITECTURE.md` > this document.

---

# Architecture Summary

| Concern | Choice |
| ------- | ------ |
| Framework | React 18+ (function components) |
| Build | Vite |
| Language | TypeScript strict |
| Routing | React Router v6+ |
| Server state | TanStack Query v5 |
| Client UI state | Zustand (minimal) |
| Forms | React Hook Form + Zod |
| Styling | Tailwind CSS + design tokens |
| Testing | Vitest + React Testing Library |

---

# Directory Structure

```
src/
├── app/
│   ├── App.tsx
│   ├── providers/
│   │   ├── QueryProvider.tsx
│   │   ├── AuthProvider.tsx
│   │   └── RouterProvider.tsx
│   ├── router/
│   │   ├── routes.tsx
│   │   ├── ProtectedRoute.tsx
│   │   └── ParentRoute.tsx
│   └── layouts/
│       ├── AppLayout.tsx          # Tab bar shell
│       ├── RoundLayout.tsx          # Immersive (no tabs)
│       └── ParentLayout.tsx
├── features/
│   ├── auth/
│   ├── home/
│   ├── rounds/
│   ├── exercises/
│   ├── results/
│   ├── history/
│   ├── progress/
│   ├── achievements/
│   ├── profile/
│   └── parent/
├── shared/
│   ├── components/ui/             # Design system primitives
│   ├── hooks/
│   ├── lib/
│   │   ├── api-client.ts
│   │   └── query-keys.ts
│   ├── types/
│   └── utils/
├── assets/
└── styles/
    ├── globals.css
    └── tokens.css                 # CSS variables from Tailwind
```

---

# Routing Map

| Path | Layout | Feature | Auth | Lazy |
| ---- | ------ | ------- | ---- | ---- |
| `/login` | None | auth | Public | Yes |
| `/` | AppLayout | home | Student | Yes |
| `/round/:roundId` | RoundLayout | exercises | Student | Yes |
| `/round/:roundId/results` | RoundLayout | results | Student | Yes |
| `/history` | AppLayout | history | Student | Yes |
| `/history/:roundId` | AppLayout | history | Student | Yes |
| `/progress` | AppLayout | progress | Student | Yes |
| `/achievements` | AppLayout | achievements | Student | Yes |
| `/profile` | AppLayout | profile | Student | Yes |
| `/parent` | ParentLayout | parent | Parent token | Yes |

**Default redirect:** `/` → login if unauthenticated.

---

# Layouts

## AppLayout

- Top bar: greeting (home only) or page title
- Main content area (max-width 720px centered)
- Bottom tab bar (5 tabs)
- Safe area padding for iPad

## RoundLayout

- Minimal header: back/salir, subject, progress bar
- Full-height exercise area
- No tab bar
- Modals for skip/defer

## ParentLayout

- Top bar with back + "Panel de padres"
- No tab bar
- Wider content area allowed (max 960px)

---

# Component Hierarchy (by feature)

## rounds + exercises

```
RoundPage
├── RoundHeader (progress, subject)
├── ExerciseView
│   ├── QuestionDisplay
│   ├── AnswerInput (polymorphic by type)
│   └── ExerciseActions (skip, defer)
├── FeedbackPanel
└── Modals (SkipConfirm, DeferConfirm)
```

## home

```
HomePage
├── GreetingBanner
├── ActiveRoundBanner (conditional)
└── SubjectGrid
    └── SubjectCard × 5
```

---

# State Management

## TanStack Query (server/async)

| Query key | Data |
| --------- | ---- |
| `['session']` | Current user |
| `['subjects']` | Subject list |
| `['round', 'active']` | In-progress round |
| `['round', roundId]` | Round detail |
| `['history', filters]` | Round list |
| `['progress']` | User progress |
| `['achievements']` | Badges |

**Mutations:**

- `login`, `logout`
- `generateRound`
- `submitAttempt`
- `completeRound`
- `abandonRound`

**Cache strategy:**

- `subjects`: staleTime 1h
- `history`: staleTime 5m, invalidate on round complete
- `progress`: invalidate on round complete

## Zustand (UI only)

```typescript
interface RoundUIStore {
  currentExerciseIndex: number;
  showFeedback: boolean;
  setExerciseIndex: (n: number) => void;
  // Reset on round exit
}
```

No server data in Zustand.

## Local state

- Form inputs (React Hook Form)
- Modal open/close
- Animation triggers

---

# API Client Layer

```
shared/lib/api-client.ts
  ├── base fetch with credentials
  ├── error parsing → ApiError
  └── typed methods per domain

features/*/services/
  └── thin wrappers calling api-client
```

Features never call `fetch` directly in components.

---

# Forms

| Form | Library | Schema |
| ---- | ------- | ------ |
| Login | RHF + Zod | `loginSchema` |
| Exercise answer | RHF or controlled | per exercise type |
| Parent password | RHF + Zod | `parentPasswordSchema` |

**Patterns:**

- `zodResolver` for validation
- Submit disabled while `isPending`
- Errors via `aria-describedby`
- Large inputs (`min-h-12`, `text-lg`)

---

# Loading States

| Context | Pattern |
| ------- | ------- |
| Page load | `LoadingSkeleton` matching layout |
| Round generation | Full-screen friendly message + spinner |
| Mutation | Button loading state |
| Background refetch | No blocking UI |

Never show blank screens.

---

# Error States

| Level | Handling |
| ----- | -------- |
| Query error | `ErrorBanner` with retry |
| Mutation error | Toast or inline message (Spanish) |
| 401 | Redirect to login |
| 503 generation | Modal with retry |

Global `ErrorBoundary` at app root for unexpected crashes.

---

# Animations

| Animation | Implementation |
| --------- | -------------- |
| Page transition | CSS opacity 200ms |
| Correct answer | Green pulse on card |
| Round complete | Brief scale on score |
| Tab switch | None (instant) |

**Rules:**

- CSS transforms only
- `prefers-reduced-motion: reduce` disables all
- No Framer Motion in v1 (bundle size)
- No Lottie in v1

---

# Responsive Strategy

**Tablet-first:** Design at 768×1024, then adapt.

| Breakpoint | Tailwind | Adaptation |
| ---------- | -------- | ---------- |
| < 640px | `sm` | Single column, maintain touch size |
| 768px | `md` | Reference tablet |
| 1024px | `lg` | Centered content |

No desktop-specific features. No hover-only interactions.

---

# Performance Guidelines

- Route-level code splitting (`React.lazy`)
- Memoize only when profiler shows need
- Virtualize history list only if > 100 items (future)
- Images: SVG icons, WebP if raster needed
- Prefetch next route on tab hover — **disabled** (no hover on iPad)

---

# Accessibility

- Semantic HTML (`main`, `nav`, `button`)
- Skip link (hidden, for keyboard)
- Focus management on route change and modals
- Live regions for feedback (`aria-live="polite"`)

---

# Mock Strategy (Pre-API)

`features/*/mocks/` implement same service interfaces as production.

MSW (Mock Service Worker) for integration tests and optional dev mode.

---

# Public Feature API

Each feature exports via `index.ts`:

```typescript
// features/rounds/index.ts
export { RoundPage } from './components/RoundPage';
export { useRound } from './hooks/useRound';
export type { Round } from './types/round.types';
```

No deep imports across features.
