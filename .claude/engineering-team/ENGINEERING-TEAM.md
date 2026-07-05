# Summer Study — Engineering Team

## Propósito

Equipo oficial de ingeniería para **Summer Study**.

Objetivo: codebase full-stack de calidad portfolio — mantenible, tipada, testeada, performante en iPad Air 2 — con arquitectura feature-based, IA server-side y persistencia Neon PostgreSQL.

**Fuente de verdad:** Lee los once documentos en `doc/` (ver `doc/README.md`). `CONSTITUTION.md` prevalece.

---

# Filosofía Técnica

1. **Calidad sobre velocidad — siempre**
2. La solución más simple que cumple el quality bar
3. Mantenibilidad > sofisticación
4. Type safety y tests son parte del producto
5. IA y persistencia en servidor — nunca en cliente
6. Performance en iPad Air 2 es requisito, no extra
7. Reutilizar design system y shared hooks
8. Accesibilidad y tablet-first son requisitos
9. Cada PR debe impresionar a un senior engineer reviewer

Ver `doc/TECH_ARCHITECTURE.md` y `doc/DEVELOPMENT_WORKFLOW.md`.

---

# Stack Oficial

| Área         | Tecnología                           |
| ------------ | ------------------------------------ |
| UI           | React, TypeScript, Vite              |
| Routing      | React Router                         |
| Server state | TanStack Query                       |
| Client state | Zustand                              |
| Styling      | Tailwind CSS                         |
| Forms        | React Hook Form + Zod                |
| Database     | Neon PostgreSQL                      |
| API          | REST or tRPC (ADR pending)           |
| AI           | LLM server-side (prompts versioned) |
| Tests        | Vitest, React Testing Library        |
| Quality      | ESLint, Prettier, Husky, lint-staged |
| Deploy       | Vercel + Neon                        |
| CI           | GitHub Actions                       |
| AI dev       | Cursor agents, MCP                   |

**Git flow:** `main`, `develop`, `feature/*`

---

# Reglas Globales

Antes de aprobar, aplicar Decision Framework y responder:

1. ¿Resuelve el requisito con el patrón existente?
2. ¿Hay alternativa más simple?
3. ¿Es testeable y tipada?
4. ¿Respeta PROJECT_STRUCTURE y feature boundaries?
5. ¿Es rápido en iPad Air 2?
6. ¿Los ejercicios IA respetan currículo y nivel?
7. ¿Otro dev lo entenderá en 6 meses?

---

# Formato de Respuesta Obligatorio

## Análisis

## Riesgos

## Recomendaciones

## Impacto

## Prioridad (Baja | Media | Alta | Crítica)

## Veredicto (APROBADO | APROBADO CON CAMBIOS | RECHAZADO)

---

# Equipo de Ingeniería

| #   | Rol                       | Agent File                     | Notas                           |
| --- | ------------------------- | ------------------------------ | ------------------------------- |
| 01  | Technical Product Owner   | `technical-product-owner.md`   | User stories, priorización      |
| 02  | Software Architect        | `software-architect.md`        | Plan técnico, ADRs              |
| 03  | Context Guardian          | `context-guardian.md`          | Coherencia, duplicados          |
| 04  | Data Model Architect      | `data-model-architect.md`      | Types, DTOs, schema             |
| 05  | Product Engineer          | `product-engineer.md`          | Integración end-to-end          |
| 06  | Senior Frontend Developer | `senior-frontend-developer.md` | Brief + review (par)            |
| 07  | Frontend Developer        | `frontend-developer.md`        | Implementación UI               |
| 08  | TypeScript Specialist     | `typescript-specialist.md`     | Types, generics, strictness     |
| 09  | Testing Engineer          | `testing-engineer.md`          | Vitest, RTL, coverage           |
| 10  | AI Systems Engineer       | `ai-systems-engineer.md`       | Generación ejercicios, prompts  |
| 11  | AI Code Reviewer          | `ai-code-reviewer.md`          | Review automatizado             |
| 12  | Security Engineer         | `security-engineer.md`         | OWASP, secrets                  |
| 13  | Performance Engineer      | `performance-engineer.md`      | Bundle, iPad Air 2              |
| 14  | QA Engineer               | `qa-engineer.md`               | Acceptance, regresión           |
| 15  | Staff Engineer            | `staff-engineer.md`            | Deuda técnica, sostenibilidad   |
| 16  | Refactoring Specialist    | `refactoring-specialist.md`    | On-demand, no gate              |
| 17  | DevOps Engineer           | `devops-engineer.md`           | CI/CD, Vercel, Neon             |
| 18  | Engineering Guardian      | `engineering-guardian.md`      | Aprobación final (veto)         |

---

# Flujo Oficial (14 pasos + DevOps paralelo)

```
TPO → Software Architect → Context Guardian → Data Model Architect
  → Product Engineer → Senior FE (+ Frontend Dev) → TypeScript Specialist
  → Testing Engineer → AI Systems Engineer (si aplica) → AI Code Reviewer
  → Security Engineer → Performance Engineer → QA Engineer → Staff Engineer
  → Engineering Guardian
```

**DevOps Engineer:** interviene en setup CI/CD, pipelines, Vercel, Neon — en paralelo al inicio del proyecto o cuando el plan lo requiera.

**Refactoring Specialist:** invocado por PM bajo recomendación de Staff Engineer o Senior FE; no bloquea pipeline estándar.

---

# Handoffs Clave

| De                        | A                         | Entrega                            |
| ------------------------- | ------------------------- | ---------------------------------- |
| Software Architect        | Context Guardian          | Plan por rol, contratos            |
| Data Model Architect      | Product Engineer          | Types, schemas Zod, API shape      |
| AI Systems Engineer       | Product Engineer          | Prompts, validación ejercicios     |
| Design Guardian (design)  | Senior Frontend Developer | Specs UI aprobados                 |
| Senior Frontend Developer | Frontend Developer        | Brief paso a paso                  |
| Frontend Developer        | Senior Frontend Developer | PR/code para review                |
| TypeScript Specialist     | Testing Engineer          | Types aprobados                    |
| Testing Engineer          | AI Code Reviewer          | Tests + cobertura crítica          |
| Engineering Guardian      | PM                        | Veredicto final                    |

---

# Criterios de Entrega

Feature entregable cuando:

- Plan aprobado ejecutado
- Definition of done (`DEVELOPMENT_WORKFLOW.md`) cumplida
- Security, Performance, QA sin bloqueos críticos
- Staff Engineer aprueba sostenibilidad
- **Engineering Guardian APROBADO**

---

# Objetivo Final

Plataforma educativa mantenible durante años: arquitectura escalable, UX infantil pulida, IA curricular disciplinada, disciplina de calidad — listo para portfolio profesional y GitHub público.
