# Summer Study — Design System

Version: 1.0  
Status: Active

---

# Purpose

Visual and UX source of truth: layout, typography, color, components, patterns, and anti-patterns.

Design references: **Duolingo Kids** (motivation), **Khan Academy Kids** (clarity), **Santillana digital** (educational trust), **modern iOS apps** (polish) — adapted for tablet-first, child-friendly UX.

---

# Design Principles

1. **Motivation over decoration** — every visual element supports learning or encouragement
2. **Few elements, big targets** — reduce cognitive load for a 10-year-old
3. **Tablet-first** — iPad Air 2 is the reference device; then responsive
4. **Performance never sacrificed** — smooth but lightweight animations only
5. **Accessible by default** — contrast, focus, touch size, motion preferences
6. **Consistent patterns** — same flows for every subject and exercise type
7. **Complete states** — loading, empty, error, success always designed

---

# Target Device

**Primary:** iPad Air 2 (768×1024 portrait, 1024×768 landscape)  
**Touch targets:** Minimum 48×48px (prefer 56×56px for primary actions)  
**Typography:** Minimum 18px body text; 24px+ for questions

---

# Layout

- **App shell:** Simple top bar + main content area (no complex sidebars for child views)
- **Max content width:** ~720px centered on larger screens
- **Spacing scale:** 4px base (Tailwind default); generous padding on touch areas
- **Navigation:** Bottom tab bar or large top buttons — max 4–5 primary destinations

---

# Typography

| Role           | Style                                      |
| -------------- | ------------------------------------------ |
| Font family    | Nunito, Poppins, or similar rounded sans   |
| Question text  | text-xl / text-2xl / font-semibold         |
| Body           | text-lg (min 18px)                         |
| Button label   | text-lg / font-bold                        |
| Meta / caption | text-base, muted color                     |
| Numbers        | Tabular figures for scores                 |

Avoid thin font weights. Prioritize legibility over style.

---

# Spacing Scale

Base unit: **4px** (Tailwind default).

| Token | Value | Usage |
| ----- | ----- | ----- |
| `space-1` | 4px | Tight gaps |
| `space-2` | 8px | Icon-text gap |
| `space-4` | 16px | Card padding (min) |
| `space-6` | 24px | Section spacing |
| `space-8` | 32px | Page padding (tablet) |
| `space-12` | 48px | Large section breaks |

Touch areas: minimum **48px** height; primary buttons **56px**.

---

# Border Radius

| Token | Value | Usage |
| ----- | ----- | ----- |
| `rounded-lg` | 8px | Inputs, chips |
| `rounded-xl` | 12px | Cards |
| `rounded-2xl` | 16px | Subject cards, modals |
| `rounded-full` | 50% | Avatars, badges |

---

# Elevation / Shadows

Light shadows only — no heavy Material elevation.

| Level | Usage |
| ----- | ----- |
| `shadow-sm` | Cards at rest |
| `shadow-md` | Modals, floating elements |
| None | Buttons (use color contrast instead) |

---

# Iconography

- Style: Rounded, friendly line icons (Lucide or Heroicons)
- Size: 24px default; 32px for subject cards; 20px for meta
- Always paired with text label for primary navigation
- Subject icons: distinct silhouette per materia

---

Warm, inviting palette — not corporate, not neon overload.

| Token            | Usage                              |
| ---------------- | ---------------------------------- |
| `background`     | Soft off-white or light cream      |
| `surface`        | Cards, exercise panels             |
| `primary`        | Main actions, subject accents      |
| `success`        | Correct answers — green, gentle    |
| `correction`     | Wrong answers — soft orange/amber  |
| `text-primary`   | Dark, high contrast                |
| `text-muted`     | Secondary hints                    |
| `reward-gold`    | Stars, coins (future)              |

Subject accent colors (distinct but harmonious):

| Subject    | Accent suggestion |
| ---------- | ----------------- |
| Matemáticas| Blue              |
| Lengua     | Red/coral         |
| Inglés     | Purple            |
| Valenciano | Orange            |
| Medi       | Green             |

Contrast ratio ≥ 4.5:1 for body text (WCAG AA).

---

# Components (Foundational)

| Component          | Notes                                           |
| ------------------ | ----------------------------------------------- |
| `Button`           | Large, rounded, clear label; primary/secondary  |
| `SubjectCard`      | Icon + name + progress indicator                |
| `ExerciseCard`     | Question area + answer area                     |
| `AnswerOption`     | Large tappable chips for multiple choice        |
| `ProgressBar`      | Round progress (e.g. 7/20)                      |
| `ScoreSummary`     | Results screen with stars/score                 |
| `RewardBadge`      | Extensible for future rewards                   |
| `Modal`            | Skip, defer, parent gate — focus trap           |
| `Badge`            | Small status/count labels                       |
| `Input`            | Large text field for answers and login          |
| `EmptyState`       | Friendly illustration + CTA                     |
| `LoadingSkeleton`  | Lightweight, no heavy spinners                  |
| `ParentGate`       | Password modal for admin actions                |

---

# Motion

- Duration: 150–300ms for UI transitions
- Prefer CSS transforms (opacity, translate) over layout-triggering animations
- Respect `prefers-reduced-motion`
- Celebration animations (correct answer, round complete): brief, optional
- No particle effects or Lottie-heavy assets in v1

---

# Exercise UI Patterns

## Multiple choice

- 2–4 large option buttons, vertical stack
- Selected state clearly visible
- Submit or auto-advance after selection (TBD in UX design)

## True/False

- Two large buttons: Verdadero / Falso

## Fill blank

- Large input field with clear placeholder

## Feedback

- Immediate after answer
- Correct: green highlight + brief praise
- Wrong: gentle correction color + show correct answer + optional explanation

---

# Responsive Breakpoints

| Breakpoint | Target                | Adaptation                          |
| ---------- | --------------------- | ----------------------------------- |
| `< 768px`  | Mobile (secondary)    | Stack layout, maintain touch size   |
| `768–1024` | Tablet (primary)      | Reference design                    |
| `> 1024`   | Desktop (secondary)   | Center content, optional side info  |

---

# Anti-Patterns

- Small text or buttons (< 44px touch)
- Dense information tables
- Dark mode as default (defer unless designed for children)
- SaaS sidebar navigation
- Command palette or keyboard shortcuts as primary UX
- Stock photo clutter
- Animations that block interaction
- Red error screens that feel punitive

---

# Parent Panel (Secondary UI)

- Cleaner, more information-dense than child UI
- Still accessible and readable
- No gamification visuals required — focus on data clarity
