# Summer Study — Constitution

## Single Source of Truth (SSOT)

Version: 1.0  
Status: Active  
Project: Summer Study (nombre provisional)

---

# Purpose

This document defines what Summer Study is, what it is not, and how decisions must be made across the project.

All agents, contributors, and documentation must treat this file as the primary source of truth.

If any task, proposal, feature, design, or technical decision conflicts with this document, **this document takes precedence**.

---

# Document Hierarchy

| Document                          | Role                                                                                          |
| --------------------------------- | --------------------------------------------------------------------------------------------- |
| **`CONSTITUTION.md`** (this file) | Product identity, philosophy, decision framework, and non-negotiable boundaries               |
| **`PRODUCT_REQUIREMENTS.md`**     | Features, scope, modules, flows, and functional requirements                                  |
| **`PRODUCT_WORKFLOW.md`**         | Idea-to-feature lifecycle, evaluation criteria, scope control, and approval rules             |
| **`TECH_ARCHITECTURE.md`**        | Stack, architecture, API, persistence, AI, security, and performance principles               |
| **`DEVELOPMENT_WORKFLOW.md`**     | Development lifecycle, coding standards, testing philosophy, PR standards, definition of done |
| **`PROJECT_STRUCTURE.md`**        | Repository layout, feature organization, naming conventions, and import rules                 |
| **`DATA_MODEL.md`**               | Domain entities, types, DTOs, relationships, and persistence conventions                        |
| **`UX_DESIGN.md`**                | Screens, flows, navigation — pre-implementation UX specification                              |
| **`DESIGN_SYSTEM.md`**            | Visual and UX principles, layout, typography, color, components, and anti-patterns            |
| **`GAMIFICATION.md`**             | Rewards, XP, streaks, badges — motivation system design                                         |
| **`AI_SYSTEM.md`**                | Exercise generation pipeline, prompts, validation, versioning                                   |
| **`API_DESIGN.md`**               | REST endpoints, auth, errors, versioning                                                        |
| **`FRONTEND_ARCHITECTURE.md`**    | Routing, layouts, state, forms, loading/error patterns                                        |
| **`TESTING_STRATEGY.md`**         | Test pyramid, tools, coverage, CI integration                                                 |
| **`DEPLOYMENT.md`**               | Vercel, Neon, environments, CI/CD                                                             |
| **`DESIGN_WORKFLOW.md`**          | Design process, UX validation, decision rules, and design lifecycle                           |
| **`BRAND_GUIDELINES.md`**         | Product voice, messaging, UX writing, and communication principles                            |
| **`AGENT_OPERATING_SYSTEM.md`**   | How AI agents contribute — rules, responsibilities, and behavior standards                    |

Use all documents together. For **what the product is** and **how to decide**, follow this constitution. For **what to build**, follow `PRODUCT_REQUIREMENTS.md`. For **how to build it**, follow `TECH_ARCHITECTURE.md`, `DEVELOPMENT_WORKFLOW.md`, and `PROJECT_STRUCTURE.md`.

---

# Mission

Build a modern educational web application that helps a 10-year-old student in Spain practice during the summer through AI-generated exercises — motivating daily learning without frustration.

---

# Vision

A platform that feels like a blend of a Santillana workbook, a small adventure, a modern app, and a well-designed educational product. The girl should **want** to open it every day.

---

# Core Belief

Learning happens when practice is **motivating, clear, and appropriately challenging**.

Complexity belongs in architecture and AI orchestration — never in the child's experience.

---

# What Summer Study Is

Summer Study is a **modern educational web application** for primary-school students (initially: 4º Primaria completed, Spain).

It is:

- A **React + TypeScript** application (Vite-based SPA; stack details in `TECH_ARCHITECTURE.md`)
- A **portfolio-grade product** built with professional engineering practices
- An **AI-powered exercise platform** aligned with the Spanish curriculum
- A **motivation-first experience** with rounds, progress, history, and an extensible rewards architecture
- **Tablet-first** — optimized for iPad Air 2, then responsive to other devices
- A **full-stack application** with persistent storage (Neon PostgreSQL planned)

The primary value proposition is **daily motivated practice** — with engineering quality and child UX as first-class goals.

---

# What Summer Study Is Not

Summer Study is not:

- A boring school homework app
- A random quiz generator without curricular alignment
- A rush MVP with shortcuts that compromise code quality
- A visual-only prototype without tests, types, or architecture
- An enterprise admin dashboard disguised as a kids' app
- A product that sacrifices performance or simplicity for visual effects
- An app that requires adult help to understand basic navigation

---

# Target Users

**Primary:** Girl, 10 years old, Spain, just finished 4º Primaria. Uses an iPad Air 2. Low patience for slow interfaces. Must understand the app without help.

**Secondary:** Parent (administrator). Supervises progress. Unlocks certain actions via password.

Design and engineering decisions must serve **the child's autonomy and motivation** first, then the parent's oversight needs.

---

# Product Philosophy

## 1. Quality over speed — always

In any conflict between speed and quality, choose quality. No exceptions.

## 2. Motivate, teach, review, detect weaknesses

Every feature should support: motivation, teaching, content review, weakness detection, sustained interest, and frustration avoidance.

## 3. Simplicity in the interface

Large buttons, legible typography, few elements, very simple navigation, constant feedback, smooth animations — never at the cost of performance.

## 4. Architecture that scales for years

Designed for one user now, multiple users later. History and progress storage must support long-term evolution.

## 5. Type safety and testability

TypeScript strict mode, explicit contracts, tests for behavior that matters.

## 6. Accessibility by default

WCAG 2.1 AA. Touch targets sized for children. Clear contrast. Readable text.

## 7. AI with curricular discipline

AI generates exercises — never random content. Always: Spanish curriculum, 4º Primaria level, appropriate difficulty, variety, child-friendly language, clear unambiguous answers.

## 8. Performance as UX

On iPad Air 2, the app must feel extremely fast: minimal requests, minimal re-renders, fast load, small bundle, sensible caching.

---

# Decision Framework

Before approving any feature, design, or implementation, answer:

1. Does it align with the mission and vision?
2. Does it motivate the child or improve learning?
3. Does it increase unnecessary complexity for users or maintainers?
4. Is it consistent with the tech stack and architecture?
5. Can it be built with reusable patterns already in the codebase?
6. Does it work on iPad Air 2 (tablet-first)?
7. Is it testable and type-safe?
8. Would a senior engineer reviewing the repo recognize professional discipline?
9. Does it respect curricular boundaries for AI-generated content?

**Reject** proposals that add scope without learning or motivation value, duplicate existing patterns, or sacrifice quality for speed.

---

# Allowed vs Forbidden

## Allowed

- Feature-based folders and colocated code
- Neon PostgreSQL for persistent storage (when approved in plan)
- Server-side AI generation (API keys never in client)
- Rewards architecture (stars, coins, XP, badges, streaks — incremental implementation)
- Parent password gate for admin actions
- Incremental delivery of modules (auth → subjects → rounds → history → rewards → stats)
- Git flow: `main`, `develop`, `feature/*` branches

## Forbidden

- Implementing features outside approved plans
- AI exercises outside Spanish curriculum / 4º Primaria level (unless explicitly configured later)
- Ambiguous exercise wording or answers
- Exposing LLM API keys in the client bundle
- Inline styles or one-off components when design-system primitives exist
- `any` in TypeScript without documented exception
- Shipping UI without loading, empty, and error states
- Skipping tablet layout or accessibility "for later"
- Heavy animations or effects that hurt performance on iPad Air 2
- Large disordered commits

---

# Non-Negotiable Engineering Standards

- React 18+ with TypeScript (strict)
- Vite, Tailwind CSS
- TanStack Query for server/async state; Zustand for global UI state where needed
- React Hook Form + Zod for forms
- Vitest + React Testing Library for tests
- ESLint, Prettier, Husky, lint-staged
- Deployment: Vercel (frontend); Neon PostgreSQL (persistence)
- Clean Code, SOLID (where applicable), DRY, KISS, composition over inheritance
- Conventional commits; small, coherent commits

---

# Authority

| Domain                              | Authority                                |
| ----------------------------------- | ---------------------------------------- |
| Product scope                       | Technical Product Owner + human client   |
| Design approval                     | Design Guardian (final gate)             |
| Engineering approval                | Engineering Guardian (final gate)        |
| Architecture                        | Software Architect (within constitution) |
| AI prompt and curriculum alignment  | AI Systems Engineer + PM review          |
| Critical scope/architecture changes | Human client explicit approval           |

---

# Success Criteria

The project succeeds when:

- The child wants to use the app daily without being asked
- Exercises feel appropriate, varied, and curricularly correct
- The app feels fast on iPad Air 2
- Progress and history are stored reliably for long-term use
- The codebase demonstrates scalable, maintainable architecture
- Tests, types, and documentation support confident change
- The repo is public GitHub portfolio quality
- Features deliver value without architectural debt that blocks future work
