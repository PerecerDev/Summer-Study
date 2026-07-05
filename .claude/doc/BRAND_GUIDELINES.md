# Summer Study — Brand Guidelines

Version: 1.0  
Status: Active

---

# Purpose

Product voice, messaging, UX writing, and communication principles for a child audience (primary) and parent audience (secondary).

---

# Brand Identity

**Name:** Summer Study (provisional)  
**Positioning:** Modern educational practice platform — motivating, curricular, child-friendly  
**Personality:** Warm, encouraging, clear, adventurous — never childish-patronizing, never corporate-cold

**Experience blend:**

- Cuaderno Santillana (structured practice)
- Pequeña aventura (light gamification, discovery)
- App moderna (fast, polished, responsive)
- Plataforma educativa (trustworthy, curricular)

---

# Voice Principles

| Do                              | Don't                                      |
| ------------------------------- | ------------------------------------------ |
| Use simple, direct Spanish      | Complex sentences or adult jargon          |
| Be encouraging and positive     | Punitive or discouraging language          |
| Celebrate effort and progress   | Shame wrong answers                        |
| Use short labels and instructions | Long paragraphs in UI                  |
| Friendly but respectful         | Baby talk or overly silly tone             |
| Clear error/help messages       | Blame the child ("Te has equivocado otra vez") |

---

# Terminology (Canonical)

| Term (ES)    | Usage                                           |
| ------------ | ----------------------------------------------- |
| Ronda        | A session of 20 exercises                       |
| Ejercicio    | Single question/task within a round             |
| Materia      | Subject (Matemáticas, Lengua, etc.)             |
| Historial    | Past completed rounds                           |
| Progreso     | Overall advancement                             |
| Estrellas    | Reward currency (when implemented)              |
| Racha        | Consecutive days of practice                    |
| Insignia     | Badge / achievement                             |

Use consistent terminology across UI, docs, and agent outputs.

---

# Messaging Hierarchy

1. **Primary (child):** "¡Sigue aprendiendo! Cada ronda te acerca a tu meta."
2. **Secondary (child):** Feedback during exercises — brief, encouraging
3. **Parent:** Clear, factual progress summaries — no gamification overload

---

# UX Writing Rules

## Instructions

- Maximum one short sentence per instruction
- Action verbs first: "Elige la respuesta correcta", "Toca para continuar"
- No more than 2 lines of helper text visible at once

## Feedback

| Result  | Tone example                                      |
| ------- | ------------------------------------------------- |
| Correct | "¡Muy bien! Has acertado."                        |
| Wrong   | "Casi. La respuesta correcta es…" + explanation   |
| Round end | "¡Ronda completada! Has hecho X de 20."         |

Never use red aggressively for wrong answers — use gentle correction colors (see `DESIGN_SYSTEM.md`).

## Empty States

- Friendly, actionable: "Aún no has hecho ninguna ronda de Matemáticas. ¿Empezamos?"

## Errors

- Reassuring, not technical: "No hemos podido cargar la ronda. Inténtalo de nuevo."

---

# Parent Communication

- Factual progress: percentages, subjects, streaks
- No childish icons or gamification language in parent panel
- Password prompts: clear purpose ("Introduce la contraseña de papá/mamá")

---

# Language

- **UI default:** Spanish (Castellano)
- **Valenciano subject:** Exercises in Valenciano; UI chrome remains Spanish unless specified
- **Inglés subject:** Exercises in English; UI chrome remains Spanish

---

# Anti-Patterns

- School exam anxiety language ("Suspenso", "Has fallado")
- Excessive exclamation marks
- English UI labels mixed into Spanish chrome
- Adult productivity jargon (dashboard, workflow, kanban)
- Overly long mascot monologues
