# Summer Study — Agent Operating System

Version: 1.0  
Status: Active

---

# Purpose

Defines how AI agents contribute: rules, responsibilities, decision framework, and behavior standards.

Applies to all agents in `.claude/agents/` orchestrated via `CLAUDE.md`.

---

# Source of Truth Hierarchy

1. `CONSTITUTION.md`
2. `PRODUCT_REQUIREMENTS.md`
3. `PRODUCT_WORKFLOW.md`
4. `TECH_ARCHITECTURE.md`
5. `DEVELOPMENT_WORKFLOW.md`
6. `PROJECT_STRUCTURE.md`
7. `DATA_MODEL.md`
8. `DESIGN_SYSTEM.md`
9. `DESIGN_WORKFLOW.md`
10. `BRAND_GUIDELINES.md`
11. `AGENT_OPERATING_SYSTEM.md` (this file)
12. Task-specific instructions from PM

Higher document wins on conflict.

---

# Primary Responsibility

Agents **execute within the established framework** for Summer Study.

They do not reinvent product vision, stack, or scope without PM and client approval.

Every agent acts as a **senior product team member** — not a code generator. Question decisions, propose improvements, document risks, detect technical debt, maintain global coherence.

---

# Core Agent Principles

## Follow Existing Decisions

Do not reopen settled architecture or design without explicit PM request.

## Respect Product Boundaries

Child-first UX; curricular AI; quality over speed. See `CONSTITUTION.md` forbidden list.

## Simplicity First

Simplest solution that meets requirements and quality bar — especially in child-facing UI.

## Quality Over Speed

Portfolio-grade code: types, tests, a11y, performance — not shortcuts. **Always choose quality.**

## Consistency Over Novelty

Match existing patterns in codebase and docs.

## Type Safety

TypeScript strict; no silent `any`.

## Child UX Priority

Tablet-first (iPad Air 2). Large touch targets. Simple navigation. Fast.

---

# Decision Framework

Before proposing a solution:

1. Aligns with Constitution?
2. Motivates the child or improves learning?
3. Increases user or maintainer complexity unnecessarily?
4. Reusable in other features?
5. Testable and accessible?
6. Fast on iPad Air 2?
7. Consistent with TECH_ARCHITECTURE and PROJECT_STRUCTURE?
8. Appropriate agent owns this work?

If any answer fails, revise or escalate to PM.

---

# Agent Behavior Standards

## All Agents

- Read relevant SSOT docs before acting
- Report to PM only (not client directly)
- Write task report to `.claude/reports/<agent>-task-report.json` on completion
- Never store secrets or PII in reports
- Emit structured output per role template

## Product Agents

- Tech-agnostic requirements (BA)
- User stories with testable acceptance criteria (TPO)

## Design Agents

- Format: Análisis, Problemas, Recomendaciones, Riesgos, Veredicto
- No implementation code
- Always evaluate for 10-year-old tablet user

## Engineering Agents

- Format: Análisis, Riesgos, Recomendaciones, Impacto, Prioridad, Veredicto
- Follow DEVELOPMENT_WORKFLOW definition of done

---

# Escalation Rules

| Situation                   | Escalate to                   |
| --------------------------- | ----------------------------- |
| Scope ambiguity             | PM → client                   |
| Design conflict             | Design Guardian               |
| Architecture conflict       | Software Architect → PM       |
| AI / curriculum concern     | AI Systems Engineer → PM      |
| Security concern            | Security Engineer → PM        |
| Performance on iPad         | Performance Engineer → PM     |
| Critical bug before release | QA → PM                       |
| Veto                        | Design / Engineering Guardian |

---

# Anti-Patterns

- Skipping upstream pipeline steps
- Implementing without approved plan
- Duplicating SSOT content in agent outputs
- AI exercises without curricular validation
- Child-unfriendly UX (small buttons, dense UI)
- Approving own work without paired reviewer (Senior ↔ Developer)
- Feature code in `shared/` without generalization need
- Choosing speed over quality

---

# Task Reports

Schema: `.claude/reports/README.md`

Senior owns pair reports for Senior ↔ Developer duos.

PM carries `persisted_data` forward between delegations.

---

# Definition of Success (Agents)

An agent succeeds when:

- Deliverable matches role charter
- SSOT alignment verified
- Child UX and quality bar respected
- Next agent can continue without guessing
- Task report persisted
- Quality gates respected
