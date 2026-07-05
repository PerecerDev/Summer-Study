# Summer Study Documentation

## What is Summer Study?

**Read [`CONSTITUTION.md`](./CONSTITUTION.md) first.** SSOT for product identity, philosophy, decision framework, and boundaries.

Summer Study is a modern educational web application for a 10-year-old student in Spain to practice during the summer through AI-generated exercises aligned with the Spanish curriculum (4º Primaria).

## Document Index

### Product

| Document                                                   | Purpose                                         |
| ---------------------------------------------------------- | ----------------------------------------------- |
| [`CONSTITUTION.md`](./CONSTITUTION.md)                     | Mission, vision, philosophy, decision framework |
| [`PRODUCT_REQUIREMENTS.md`](./PRODUCT_REQUIREMENTS.md)     | PRD: problem, users, stories, scope, MVP        |
| [`PRODUCT_WORKFLOW.md`](./PRODUCT_WORKFLOW.md)             | Idea-to-feature lifecycle and approvals         |
| [`UX_DESIGN.md`](./UX_DESIGN.md)                           | Screens, flows, navigation (pre-implementation) |

### Design

| Document                                                   | Purpose                                         |
| ---------------------------------------------------------- | ----------------------------------------------- |
| [`DESIGN_SYSTEM.md`](./DESIGN_SYSTEM.md)                   | Child-friendly visual system, components        |
| [`DESIGN_WORKFLOW.md`](./DESIGN_WORKFLOW.md)               | Design process and handoff                      |
| [`BRAND_GUIDELINES.md`](./BRAND_GUIDELINES.md)             | Voice, terminology, UX writing                  |
| [`GAMIFICATION.md`](./GAMIFICATION.md)                      | Rewards, XP, streaks, badges architecture       |

### Engineering

| Document                                                   | Purpose                                         |
| ---------------------------------------------------------- | ----------------------------------------------- |
| [`TECH_ARCHITECTURE.md`](./TECH_ARCHITECTURE.md)           | Stack, architecture, performance principles     |
| [`FRONTEND_ARCHITECTURE.md`](./FRONTEND_ARCHITECTURE.md)    | Routing, state, layouts, components map         |
| [`API_DESIGN.md`](./API_DESIGN.md)                         | REST endpoints, auth, errors                    |
| [`AI_SYSTEM.md`](./AI_SYSTEM.md)                           | Exercise generation, prompts, validation        |
| [`DATA_MODEL.md`](./DATA_MODEL.md)                         | Entities, types, DTOs, persistence              |
| [`TESTING_STRATEGY.md`](./TESTING_STRATEGY.md)             | Unit, integration, component, E2E               |
| [`DEPLOYMENT.md`](./DEPLOYMENT.md)                         | Vercel, Neon, CI/CD, env vars                   |
| [`DEVELOPMENT_WORKFLOW.md`](./DEVELOPMENT_WORKFLOW.md)     | Coding standards, PRs, Git flow, DoD            |
| [`PROJECT_STRUCTURE.md`](./PROJECT_STRUCTURE.md)           | Folder layout, naming, imports                  |
| [`AGENT_OPERATING_SYSTEM.md`](./AGENT_OPERATING_SYSTEM.md) | Agent rules and behavior                        |

If documents conflict, **`CONSTITUTION.md` takes precedence**.

## Public Docs

Contributor-facing index: [`../../docs/README.md`](../../docs/README.md)

## Agent Network

| Resource                                                                                          | Purpose                         |
| ------------------------------------------------------------------------------------------------- | ------------------------------- |
| [`../../CLAUDE.md`](../../CLAUDE.md)                                                              | Project Manager orchestration   |
| [`.claude/design-team/DESIGN-TEAM.md`](../design-team/DESIGN-TEAM.md)                             | Design pipeline (10 steps)      |
| [`.claude/engineering-team/ENGINEERING-TEAM.md`](../engineering-team/ENGINEERING-TEAM.md)         | Engineering pipeline (14 steps) |
| [`.claude/agents/`](../agents/)                                                                   | Agent role definitions          |
| [`.claude/plans/`](../plans/)                                                                     | Approved feature plans          |
| [`.claude/decisions/`](../decisions/)                                                             | Architecture decision records   |

## Legacy Note

This agent network was adapted from prior projects (AI Task Manager, Cardilan). Cardilan-specific documents are superseded by the files above.

Do not duplicate SSOT content elsewhere — link to these documents.
