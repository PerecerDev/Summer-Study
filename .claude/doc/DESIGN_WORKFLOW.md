# Summer Study — Design Workflow

Version: 1.0  
Status: Active

---

# Purpose

Defines the design process, validation steps, decision rules, and design lifecycle.

Implements design pipeline in `.claude/design-team/DESIGN-TEAM.md`.

---

# Design Process

```
Research → Product scope → UX flows → Friction review → Cognitive review
  → Visual design → A11y review → Tablet review → Design system alignment → Guardian
```

Each step produces a structured deliverable: **Análisis, Problemas, Recomendaciones, Riesgos, Veredicto**.

---

# Phase Deliverables

| Phase     | Owner                       | Output                                |
| --------- | --------------------------- | ------------------------------------- |
| Research  | UX Researcher               | Child persona, parent persona, journeys |
| Scope     | Product Designer            | Feature scope, simplified flows       |
| UX        | UX Designer                 | IA, wireframes, all states            |
| Friction  | Friction Hunter             | Blockers, unnecessary steps           |
| Cognitive | Cognitive Psychology Expert | Load reduction for 10-year-old        |
| Visual    | UI Designer                 | Hi-fi specs, child-friendly tokens    |
| A11y      | Accessibility Specialist    | WCAG audit, touch targets             |
| Tablet    | Mobile First Designer       | iPad Air 2, touch, responsive (veto)  |
| System    | Design System Architect     | Component specs, tokens               |
| Final     | Design Guardian             | Approve / reject                      |

---

# UX Validation Rules

1. Every screen has wireframes for: default, loading, empty, error
2. Primary action obvious within 3 seconds (child squint test)
3. Maximum 4–5 primary nav items for child UI
4. Touch targets ≥ 48px (prefer 56px)
5. Body text ≥ 18px; questions ≥ 20px
6. No screen requires adult help to understand

---

# Decision Rules

When two designs are valid, prefer:

1. Fewer taps/clicks
2. Fewer concepts to learn
3. Existing design system component
4. Faster perceived performance
5. More encouraging feedback

Escalate to Design Guardian on unresolved trade-offs.

---

# Handoff to Engineering

UI Designer + Design System Architect provide:

- Component breakdown aligned with `PROJECT_STRUCTURE.md`
- Spacing, typography, color token references
- Interaction notes (touch, focus, disabled)
- Tablet-first breakpoints behavior (iPad Air 2 reference)

Senior Frontend Developer confirms feasibility before implementation starts.

---

# Design Quality Checklist

- [ ] Aligns with `CONSTITUTION.md` and `PRODUCT_REQUIREMENTS.md`
- [ ] All states specified
- [ ] Mobile First Designer approved (tablet-first)
- [ ] Accessibility Specialist approved
- [ ] No Friction Hunter bloqueos graves
- [ ] Child can navigate without adult help
- [ ] Design Guardian APROBADO

---

# Definition of Done (Design)

Design phase complete when Design Guardian issues **APROBADO** or **APROBADO CON CAMBIOS** with all changes applied.
