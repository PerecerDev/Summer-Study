# Summer Study — UX Design

Version: 1.0  
Status: Active — design specification (no implementation until Design Guardian approval)

---

# Purpose

Defines the complete user experience: information architecture, navigation, screens, interaction states, and flows before any UI implementation.

Precedence: `CONSTITUTION.md` > `PRODUCT_REQUIREMENTS.md` > this document > `DESIGN_SYSTEM.md`.

---

# Design Goals

| Goal | Measure |
| ---- | ------- |
| Autonomy | Child completes a round without adult help |
| Clarity | Max 2 taps to start a round from home |
| Motivation | Visible progress and encouragement at every step |
| Safety | Parent gate for sensitive actions only |
| Performance | Perceived instant transitions; skeletons while loading |

---

# Information Architecture

```
App
├── Auth (unauthenticated)
│   └── Login
├── Student (authenticated)
│   ├── Home
│   ├── Round (in-progress)
│   │   ├── Exercise
│   │   ├── Skip confirmation (modal)
│   │   └── Defer confirmation (modal)
│   ├── Results
│   ├── History
│   │   └── Round detail
│   ├── Progress
│   ├── Achievements
│   └── Profile
└── Parent (password gate)
    └── Parent panel
```

---

# Navigation Model

## Student — Bottom Tab Bar (tablet-first)

| Tab | Icon | Route | Priority |
| --- | ---- | ----- | -------- |
| Inicio | Home | `/` | P0 |
| Historial | Clock/list | `/history` | P0 |
| Progreso | Chart/star | `/progress` | P1 |
| Logros | Trophy | `/achievements` | P1 |
| Perfil | Avatar | `/profile` | P0 |

**Rules:**

- Max 5 tabs; large touch targets (56px min)
- Active tab clearly indicated (color + label)
- No hamburger menu for child views
- Round flow hides tab bar (immersive mode)

## Parent

- Accessed via Profile → "Zona de papá/mamá" → password modal
- Separate layout: simpler top bar, back to student app
- No bottom tab bar in parent views

---

# Screen Specifications

## 1. Pantalla inicial (Splash / Boot)

**Purpose:** Brand moment + app load.

| State | Behavior |
| ----- | -------- |
| Loading | Logo + soft animation (< 2s target) |
| Error | Friendly retry message |
| Success | Auto-redirect to Login or Home (if session valid) |

**Notes:** No interaction required. Respect `prefers-reduced-motion`.

---

## 2. Login

**Purpose:** Simple student authentication.

**Elements:**

- App logo / mascot (light, optional)
- Username field (large input)
- PIN/password field (numeric keyboard friendly)
- "Entrar" primary button
- Optional "¿Olvidaste tu contraseña?" → parent help text (no self-service reset in v1)

| State | UI |
| ----- | -- |
| Empty | Disabled submit |
| Loading | Button spinner, fields disabled |
| Error | Inline message: "Usuario o contraseña incorrectos" |
| Success | Redirect to Home |

**Constraints:** No social login. No email verification. One primary student account in v1.

---

## 3. Home (Selección de materia)

**Purpose:** Choose subject and start practice.

**Elements:**

- Greeting: "¡Hola, {nombre}!" + daily motivation line
- Streak/XP summary chip (P1 — placeholder space in P0)
- Subject cards grid (2 columns on tablet portrait)
  - Icon, name, mini progress (rounds completed / accuracy)
  - Tap → confirm start or direct start (TBD: direct start for fewer taps)
- Optional: "Continuar ronda" if abandoned round exists

| State | UI |
| ----- | -- |
| Loading | Skeleton cards |
| Empty | "Elige una materia para empezar" |
| Error | Retry banner |
| In-progress round | Banner: "Tienes una ronda sin terminar" + CTA |

**Subject cards:** Matemáticas, Lengua, Inglés, Valenciano, Medi — each with distinct accent color.

---

## 4. Inicio de ronda

**Purpose:** Transition into exercise flow; set expectations.

**Flow option A (recommended — fewer steps):** Home tap → loading skeleton → Exercise 1  
**Flow option B:** Brief intro screen ("20 ejercicios de Matemáticas") → "¡Empezar!"

**Elements (if intro screen used):**

- Subject icon + title
- "20 ejercicios" + estimated time (~15 min)
- Progress preview bar at 0/20
- Primary: "¡Empezar!"
- Secondary: "Volver"

| State | UI |
| ----- | -- |
| Generating | "Preparando tus ejercicios…" + animation |
| Error | "No hemos podido crear la ronda. Inténtalo de nuevo." |
| Ready | Exercise screen |

---

## 5. Ejercicio (core screen)

**Purpose:** Present one exercise; collect answer; give feedback.

**Layout (tablet portrait):**

```
┌─────────────────────────────────┐
│  [← Salir]    Materia    7/20   │  ← header + progress
├─────────────────────────────────┤
│                                 │
│     Pregunta (text-xl/2xl)      │
│                                 │
│     [Opciones / Input]          │
│                                 │
├─────────────────────────────────┤
│  [Dejar para después]  [Saltar]│  ← secondary actions
└─────────────────────────────────┘
```

**Exercise types:** multiple choice, true/false, fill blank, short answer (MVP subset per subject).

**After answer:**

- Correct: green highlight + brief praise + "Siguiente" (auto-advance optional after 1.5s)
- Wrong: soft amber + show correct answer + optional explanation + "Siguiente"

| State | UI |
| ----- | -- |
| Unanswered | Submit disabled until valid input |
| Answering | Brief lock to prevent double-tap |
| Feedback | Result overlay inline (not full-screen modal) |
| Last exercise | "Finalizar ronda" instead of "Siguiente" |

---

## 6. Barra de progreso

**Component:** `ProgressBar` in round header.

- Format: "7 / 20" + visual bar fill
- Updates on each completed exercise
- Accessible: `aria-valuenow`, `aria-valuemax`

---

## 7. Dejar para después

**Trigger:** Secondary button on exercise screen.

**Modal:**

- Title: "¿Dejar esta ronda para después?"
- Body: "Podrás continuar donde lo dejaste."
- Actions: "Seguir practicando" (primary) | "Salir" (secondary)

**Behavior:** Round status → `in_progress`; resume from Home banner.

---

## 8. Confirmación para saltar ejercicio

**Trigger:** "Saltar" on exercise screen.

**Modal:**

- Title: "¿Saltar este ejercicio?"
- Body: "Se contará como incorrecto."
- Actions: "Seguir con este" (primary) | "Saltar" (destructive secondary)

**Behavior:** Record attempt as incorrect; advance to next exercise.

---

## 9. Pantalla de resultados

**Purpose:** Celebrate completion; summarize performance.

**Elements:**

- Celebration header (brief animation)
- Score: "¡Has acertado 16 de 20!"
- Stars earned (P1)
- XP gained (P1)
- Subject badge
- Breakdown list (optional expand): exercises wrong with correct answers
- Primary: "Volver al inicio"
- Secondary: "Ver en historial"

| State | UI |
| ----- | -- |
| Loading | Skeleton |
| Success | Full summary |
| Error saving | "Ronda completada" + warning that sync failed + retry |

---

## 10. Historial

**Purpose:** Browse past rounds.

**List view:**

- Filter chips: Todas | por materia
- Cards: date, subject, score, duration
- Tap → round detail

**Round detail:**

- Summary header (score, date, subject)
- Scrollable exercise list with user answer vs correct
- Color-coded correct/incorrect

| State | UI |
| ----- | -- |
| Loading | Skeleton list |
| Empty | "Aún no has completado ninguna ronda. ¡Empieza una!" |
| Error | Retry |

---

## 11. Progreso

**Purpose:** Overall advancement (P1 in MVP slice; architecture in P0).

**Elements:**

- Total rounds, accuracy %, streak
- Per-subject breakdown (simple bars, not tables)
- Weekly activity dots (future)

---

## 12. Logros

**Purpose:** Badges and achievements (P1).

**Elements:**

- Grid of badge cards (locked/unlocked states)
- Progress toward next badge

---

## 13. Perfil

**Purpose:** Student identity and settings.

**Elements:**

- Avatar + display name
- Level / XP bar (P1)
- Stats summary
- "Zona de papá/mamá" → parent gate
- Logout

---

## 14. Parent panel

**Purpose:** Supervision without child UX complexity.

**Elements:**

- Progress overview (subjects, accuracy, streak)
- Recent rounds list
- Link to full history
- Settings (future): difficulty, subjects enabled

**Design:** Cleaner, more data-dense than child UI; still readable; no gamification visuals.

---

# User Flows (Detailed)

## F1 — First visit

```
Splash → Login → Home → Select subject → Generate round → Exercise 1…20 → Results → Home
```

## F2 — Daily return

```
Splash → Home (session) → Select subject → Round → Results
```

## F3 — Resume abandoned round

```
Home → "Continuar ronda" banner → Exercise N → … → Results
```

## F4 — Review history

```
Historial tab → List → Round detail → Back
```

## F5 — Parent check

```
Perfil → Zona padres → Password modal → Parent panel → Back
```

---

# Interaction Principles (iPad Air 2)

- No hover-dependent UI
- Minimum 48×48px touch targets (56px primary)
- No tiny links; use buttons
- No data tables; use cards and simple bars
- Swipe gestures optional (not required for core flows)
- Animations: CSS only, < 300ms, `prefers-reduced-motion` respected

---

# Accessibility (UX Level)

- Focus order follows visual order
- All interactive elements have accessible names
- Color never sole indicator of state (icon + text)
- Error messages linked to fields via `aria-describedby`
- Modals trap focus; Escape closes (parent gate)

---

# Open Design Decisions (for Design Pipeline)

| ID | Question | Recommendation |
| -- | -------- | -------------- |
| D1 | Auto-advance after correct answer? | Yes, after 1.5s with manual "Siguiente" always visible |
| D2 | Intro screen before round? | Skip in MVP (direct to exercise) |
| D3 | Tab bar during round? | Hidden (immersive) |

---

# Handoff to UI Designer

Deliverables for hi-fi specs:

- Wireframes per screen (tablet 768×1024)
- All states: loading, empty, error, success
- Component mapping to `DESIGN_SYSTEM.md`
- Motion specs for celebrations
