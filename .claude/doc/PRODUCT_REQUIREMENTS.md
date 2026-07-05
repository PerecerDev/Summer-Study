# Summer Study — Product Requirements Document (PRD)

Version: 1.1  
Status: Active

---

# Purpose

Defines **what** Summer Study builds: problem, users, features, use cases, user stories, flows, boundaries, and success criteria.

For **why** and **how to decide**, see `CONSTITUTION.md`. For **how to build**, see `TECH_ARCHITECTURE.md`. For **UX screens**, see `UX_DESIGN.md`.

---

# Problem Statement

Durante el verano, muchos alumnos de Primaria pierden ritmo de estudio. Los cuadernos de vacaciones son útiles pero poco motivadores; las apps genéricas de quiz no están alineadas con el currículo español ni adaptadas a una niña de 10 años.

**Dolor actual:**

- Práctica repetitiva sin feedback inmediato ni variedad
- Falta de seguimiento del progreso a lo largo del verano
- Contenido desalineado del nivel curricular (4º Primaria)
- Interfaces pensadas para adultos o demasiado infantiles sin rigor educativo
- Dependencia del adulto para corregir ejercicios

**Oportunidad:**

Una plataforma web tablet-first que genere ejercicios personalizados con IA, alineados con el currículo, con rondas estructuradas, historial persistente y motivación ligera — para que la niña practique de forma autónoma y el padre supervise sin fricción.

---

# Objective

Construir una aplicación educativa de calidad portfolio que permita a una niña de 10 años (4º Primaria completado, España) practicar **Matemáticas, Lengua, Inglés, Valenciano y Medi** durante el verano mediante rondas de 20 ejercicios generados por IA, con historial, progreso y recompensas extensibles.

**Objetivos medibles:**

1. La niña completa una ronda sin ayuda adulta
2. Retorno voluntario en días consecutivos
3. Ejercicios curricularmente apropiados (validación parental)
4. Rendimiento fluido en iPad Air 2
5. Código mantenible y público en GitHub durante años

---

# Product Summary

Summer Study is a web educational application for a 10-year-old student in Spain to practice Matemáticas, Lengua, Inglés, Valenciano, and Medi during the summer. Exercises are generated dynamically by AI, aligned with the Spanish curriculum (4º Primaria completed). The experience combines workbook practice, light adventure, and modern app UX — designed to motivate daily learning.

---

# Users

## User Types

| User              | Description                                                                 |
| ----------------- | --------------------------------------------------------------------------- |
| **Student**       | Primary user. Completes rounds, earns rewards, views progress               |
| **Parent (Admin)**| Secondary user. Supervises progress; unlocks admin actions via password     |

## Primary Persona — Estudiante

| Atributo | Detalle |
| -------- | ------- |
| Nombre | (estudiante del proyecto) |
| Edad | 10 años |
| Contexto | Acaba de terminar 4º Primaria en España |
| Dispositivo | iPad Air 2 (principal) |
| Motivación | Le gusta aprender pero se aburre con lo repetitivo |
| Frustraciones | Apps lentas, texto pequeño, ejercicios demasiado difíciles o sin sentido |
| Objetivo | Practicar en verano sin que parezca "deberes aburridos" |

## Secondary Persona — Padre/Madre

| Atributo | Detalle |
| -------- | ------- |
| Rol | Supervisor y configurador |
| Motivación | Que la niña repase sin perder el hábito de estudio |
| Necesidades | Ver progreso, comprobar que el contenido es adecuado |
| Frustraciones | Apps que requieren configuración constante o no muestran datos claros |

---

# Use Cases

| ID | Actor | Caso de uso | Prioridad |
| -- | ----- | ----------- | --------- |
| UC-01 | Estudiante | Iniciar sesión con credenciales simples | P0 |
| UC-02 | Estudiante | Seleccionar materia y comenzar ronda de 20 ejercicios | P0 |
| UC-03 | Estudiante | Responder ejercicio y recibir feedback inmediato | P0 |
| UC-04 | Estudiante | Saltar ejercicio (con confirmación) | P0 |
| UC-05 | Estudiante | Dejar ronda para después y retomarla | P0 |
| UC-06 | Estudiante | Ver resultados al completar ronda | P0 |
| UC-07 | Estudiante | Consultar historial de rondas pasadas | P0 |
| UC-08 | Estudiante | Ver detalle de una ronda (respuestas, aciertos) | P0 |
| UC-09 | Estudiante | Ver progreso general y por materia | P1 |
| UC-10 | Estudiante | Ver logros e insignias | P1 |
| UC-11 | Estudiante | Gestionar perfil y cerrar sesión | P0 |
| UC-12 | Padre | Acceder a panel protegido por contraseña | P1 |
| UC-13 | Padre | Revisar progreso y estadísticas de la niña | P1 |
| UC-14 | Sistema | Generar ejercicios IA alineados al currículo | P0 |
| UC-15 | Sistema | Persistir rondas e intentos en base de datos | P0 |
| UC-16 | Sistema | Otorgar recompensas al completar ronda | P1 |

---

# User Stories

## Autenticación y acceso

| ID | Historia | Criterios de aceptación |
| -- | -------- | ---------------------- |
| US-01 | Como estudiante quiero iniciar sesión con usuario y contraseña para acceder a mi espacio | Login funcional; error claro si credenciales incorrectas; sesión persistente |
| US-02 | Como estudiante quiero cerrar sesión para proteger mi cuenta en el iPad compartido | Logout limpia sesión y redirige a login |

## Rondas y ejercicios

| ID | Historia | Criterios de aceptación |
| -- | -------- | ---------------------- |
| US-03 | Como estudiante quiero elegir una materia para practicar lo que necesito repasar | 5 materias visibles; tap inicia ronda |
| US-04 | Como estudiante quiero hacer 20 ejercicios variados en una ronda para no aburrirme | 20 ejercicios únicos; tipos mixtos; barra de progreso |
| US-05 | Como estudiante quiero saber si acerté inmediatamente para aprender en el momento | Feedback tras cada respuesta; explicación opcional |
| US-06 | Como estudiante quiero saltar un ejercicio difícil sabiendo que contará como fallo | Modal de confirmación; registro como incorrecto |
| US-07 | Como estudiante quiero dejar una ronda a medias y continuar después | Estado in_progress; banner en home para retomar |

## Resultados e historial

| ID | Historia | Criterios de aceptación |
| -- | -------- | ---------------------- |
| US-08 | Como estudiante quiero ver mi puntuación al terminar para sentir logro | Pantalla resultados con aciertos/total |
| US-09 | Como estudiante quiero ver mis rondas pasadas para repasar lo que hice | Listado por fecha; filtro por materia |
| US-10 | Como estudiante quiero abrir una ronda antigua y ver cada ejercicio | Detalle con respuesta dada vs correcta |

## Progreso y motivación

| ID | Historia | Criterios de aceptación |
| -- | -------- | ---------------------- |
| US-11 | Como estudiante quiero ver mi progreso general para saber cuánto he avanzado | Totales, % acierto, por materia |
| US-12 | Como estudiante quiero ganar estrellas al completar rondas para sentirme motivada | Estrellas según puntuación (P1) |
| US-13 | Como estudiante quiero mantener una racha de días practicando | Contador de racha visible (P1) |

## Padre

| ID | Historia | Criterios de aceptación |
| -- | -------- | ---------------------- |
| US-14 | Como padre quiero acceder a un panel con contraseña para supervisar sin molestar a la niña | Gate de contraseña; panel con datos claros |
| US-15 | Como padre quiero ver el progreso por materia para identificar áreas débiles | Desglose por materia; sin gamificación infantil |

## Sistema / IA

| ID | Historia | Criterios de aceptación |
| -- | -------- | ---------------------- |
| US-16 | Como sistema debo generar ejercicios de 4º Primaria alineados al currículo | Validación Zod; prompts versionados; ver `AI_SYSTEM.md` |
| US-17 | Como sistema debo almacenar todo el historial de forma fiable durante años | PostgreSQL; migraciones versionadas |

---

# Restricciones

| Tipo | Restricción |
| ---- | ----------- |
| Dispositivo | iPad Air 2 como referencia principal |
| Currículo | LOMLOE, 4º Primaria, España |
| Idioma UI | Castellano (ejercicios en idioma de la materia) |
| Privacidad | Datos de menor; sin analytics invasivos en v1 |
| Coste IA | Límites de generación por día |
| Legal | Repo público; sin secretos en código |
| Accesibilidad | WCAG 2.1 AA |
| Rendimiento | Carga < 3s percibida en tablet de referencia |

---

# Subjects (Initial)

| Subject    | Code       | Notes                                      |
| ---------- | ---------- | ------------------------------------------ |
| Matemáticas| `math`     | Content map to be defined per subject      |
| Lengua     | `language` | Castellano                                 |
| Inglés     | `english`  |                                            |
| Valenciano | `valencian`|                                            |
| Medi       | `medi`     | Conocimiento del medio / ciencias sociales |

Each subject will have its own content map in future iterations.

---

# Planned Modules (Architecture Scope)

These modules define the **target architecture**. They are **not** all implemented in phase 1. Each feature requires an approved plan before implementation.

| Module              | Description                                              | Priority |
| ------------------- | -------------------------------------------------------- | -------- |
| **Auth**            | Student login; parent admin access                       | P0       |
| **Home / Dashboard**| Welcome, subject selection, daily motivation             | P0       |
| **Round Engine**    | 20 distinct exercises per round; subject + level         | P0       |
| **AI Generation**   | Server-side exercise generation with curricular prompts  | P0       |
| **Exercise UI**     | Question display, answer input, feedback, navigation     | P0       |
| **Results**         | Round summary, score, review of answers                  | P0       |
| **History**         | All completed rounds retrievable                         | P0       |
| **Progress**        | Overall advancement, subject breakdown                   | P1       |
| **Statistics**      | Accuracy %, times, favorites, evolution                  | P1       |
| **Rewards**         | Stars, coins, XP, levels, badges, streaks (extensible)   | P1       |
| **Parent Panel**    | Progress overview, password-protected settings           | P1       |
| **Content Maps**    | Per-subject curriculum mapping for AI                    | P2       |
| **Weakness Detection** | Identify and reinforce weak areas                   | P2       |

---

# Round Specification

Each round consists of:

- **20 distinct exercises** — no duplicates within the round
- **Subject** — one of the five initial subjects
- **Level** — 4º Primaria (completed), Spanish curriculum
- **AI-generated** — adapted difficulty, child-friendly language
- **Persisted** — recoverable from history with full detail
- **Timed optionally** — architecture should support response times

---

# AI Generation Requirements

The AI must **always** follow:

| Requirement        | Detail                                                    |
| ------------------ | --------------------------------------------------------- |
| Curriculum         | Spanish national / regional (Valenciano) alignment        |
| Level              | 4º Primaria completed — no content above level unless configured |
| Difficulty         | Appropriate, progressive within the round                 |
| Variety            | Mixed exercise types within subject constraints           |
| Language           | Child-friendly, clear, age-appropriate                    |
| Answers            | Unambiguous, single correct answer (or clearly defined)   |
| No hallucination   | No invented facts outside curricular scope                |

Prompts must be designed, versioned, and documented (see `.claude/doc/` and future `prompts/` directory).

---

# Core User Flows

## Flow 1 — Student starts a round

1. Student logs in (simple credentials)
2. Selects a subject from home
3. Round begins — 20 exercises load (generated or cached)
4. Student answers each exercise with immediate feedback
5. Round completes → results screen with score and rewards
6. Round saved to history

## Flow 2 — Review history

1. Student opens history
2. Browses past rounds by date or subject
3. Opens a round to review exercises, answers, and results

## Flow 3 — View progress

1. Student sees overall progress (subjects, streaks, rewards)
2. Motivational elements encourage return

## Flow 4 — Parent supervision

1. Parent accesses admin area (password required)
2. Views child's progress, statistics, and history
3. May configure or unlock certain actions

---

# Rewards System (Architecture)

Not all elements ship in v1, but architecture must support:

- Stars
- Coins
- Experience (XP)
- Levels
- Badges
- Streaks (daily practice)
- Achievements
- Visual prizes

Implement incrementally; data model must not require breaking changes.

---

# Functional Requirements (Cross-Cutting)

- **Tablet-first:** Optimized for iPad Air 2; then tablets, laptop, desktop, mobile
- **Accessible:** WCAG 2.1 AA; large touch targets; readable typography
- **States:** Every view handles loading, empty, error, and success
- **Performance:** Minimal bundle, fast load, few network requests, sensible caching
- **Type-safe:** Domain types aligned with `DATA_MODEL.md`
- **Persistent:** History and progress stored for years (Neon PostgreSQL)
- **Scalable:** Multi-user architecture from the start

---

# Explicitly In Scope

- Full-stack web application (React + API + PostgreSQL)
- AI exercise generation (server-side)
- Feature-based architecture
- Reusable component library (child-friendly design system)
- Unit and integration tests for critical paths
- CI via GitHub Actions; deploy via Vercel
- Git flow: `main`, `develop`, `feature/*`
- AI agent workflow for development (this repository's agent network)
- Public GitHub repository

---

# Explicitly Out of Scope (Unless Approved)

- Native mobile apps (iOS/Android)
- Multi-school / classroom management
- Real-time multiplayer
- Payment / subscription
- Content outside Spanish primary curriculum
- Offline-first PWA (future consideration)

---

# MVP Definition (First Delivery Slice)

When implementation begins, the first approved slice is expected to include:

1. App shell (layout, routing, tablet-first design)
2. Auth (student login + basic parent gate)
3. Home with subject selection
4. Round engine (20 exercises, one subject)
5. AI generation integration (server-side, one subject pilot)
6. Exercise UI with feedback
7. Results screen
8. History (list + round detail)
9. Foundational design system (child-friendly components)
10. Database schema + basic persistence

Rewards, statistics, parent panel, and remaining subjects follow in subsequent planned slices.

---

# Success Metrics (Product)

- Child completes a round without adult help
- Round feels fast on iPad Air 2 (< 3s perceived load for round start)
- Exercises are curricularly appropriate (parent review pass)
- Child returns voluntarily on consecutive days (streak potential)
- Lighthouse performance score ≥ 80 on reference iPad viewport
- History accurately stores and retrieves all completed rounds
