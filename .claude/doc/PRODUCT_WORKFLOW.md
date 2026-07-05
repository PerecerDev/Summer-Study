# Summer Study — Product Workflow

Version: 1.0  
Status: Active

---

# Purpose

Defines how ideas become features: lifecycle, evaluation, scope control, and approval rules.

---

# Idea-to-Feature Lifecycle

```
1. Intake (client request)
2. Business Analysis (BA)
3. Scoping (Technical Product Owner)
4. Technical Plan (Software Architect)
5. Client plan approval ← GATE
6. Design pipeline (10 steps)
7. Design Guardian approval ← GATE
8. Engineering pipeline (14 steps)
9. Engineering Guardian + QA ← GATE
10. Delivery to client
```

---

# Evaluation Criteria

Before adding a feature, score against:

| Criterion       | Question                                                  |
| --------------- | --------------------------------------------------------- |
| Child value     | Does it motivate learning or improve practice?            |
| Parent value    | Does it help supervision without complicating child UX?   |
| Quality cost    | Can it be built to portfolio standard without shortcuts?  |
| Complexity cost | Is the maintenance cost justified?                        |
| Consistency     | Does it fit existing patterns and design language?        |
| Performance     | Will it stay fast on iPad Air 2?                          |
| Scope           | Can it ship in the current slice without blocking others? |

Reject features that fail child value or add disproportionate complexity.

---

# Feature Types

| Type               | Example                  | Approval                 |
| ------------------ | ------------------------ | ------------------------ |
| Core learning      | Round engine             | Plan + design + eng gates |
| Motivation         | Streaks, badges          | Plan + design gate       |
| Infrastructure     | Database, CI             | Architect + client       |
| AI / prompts       | Exercise generation      | AI Systems + client      |
| Parent admin       | Progress panel           | Plan + design gate       |
| Polish             | Animations, illustrations | Design Guardian         |

---

# Scope Control

- One approved plan per feature slice in `.claude/plans/<feature>.md`
- No scope expansion during implementation without PM + client approval
- Rewards and stats can ship incrementally if architecture supports them
- AI prompts changes require version bump and documentation

---

# Priority Rules

When prioritizing:

1. Child can complete a round end-to-end (core loop)
2. Exercises are curricularly correct (AI quality)
3. History persists reliably
4. Performance on iPad Air 2
5. Motivation features (rewards, streaks)
6. Parent panel and advanced statistics

Quality over speed — always.

---

# Approval Gates Summary

| Gate                    | Authority              |
| ----------------------- | ---------------------- |
| Plan                    | Client + PM            |
| Design                  | Design Guardian        |
| Engineering             | Engineering Guardian   |
| AI prompts / curriculum | AI Systems Engineer + PM |
| Architecture change     | Software Architect + client |
| Release                 | QA + PM                |
