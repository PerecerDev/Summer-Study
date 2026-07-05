# Summer Study

> Plataforma educativa moderna para practicar durante el verano con ejercicios generados por IA — alineados con el currículo español (4º Primaria).

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

**Estado:** Fase 0 completa — infraestructura lista. Siguiente paso: autenticación (Epic E2).

---

## ¿Qué es Summer Study?

Una aplicación web **tablet-first** (iPad Air 2) para que una niña de 10 años repase **Matemáticas, Lengua, Inglés, Valenciano y Medi** durante el verano.

- **Rondas de 20 ejercicios** generados por IA con currículo español
- **Feedback inmediato** y historial persistente
- **Motivación ligera** (estrellas, XP, rachas — extensible)
- **Panel para padres** con supervisión del progreso

No es un generador de quizzes aleatorio. Es una plataforma educativa diseñada para **motivar el aprendizaje diario** con calidad de ingeniería portfolio.

---

## Experiencia objetivo

Cuaderno Santillana + pequeña aventura + app moderna — sencilla, agradable, rápida. La niña debe entenderla **sin ayuda**.

---

## Stack

| Capa | Tecnología |
| ---- | ---------- |
| Frontend | React 18, TypeScript, Vite, Tailwind CSS |
| Estado | TanStack Query, Zustand |
| Backend | REST API (Vercel serverless) |
| Base de datos | Neon PostgreSQL + Drizzle ORM |
| IA | LLM server-side (prompts versionados) |
| Calidad | Vitest, ESLint, Prettier, Husky |
| Deploy | Vercel + GitHub Actions |

Decisiones documentadas en [ADRs](.claude/decisions/).

---

## Documentación

| Recurso | Descripción |
| ------- | ----------- |
| [docs/](docs/README.md) | Índice de documentación pública |
| [Constitución](.claude/doc/CONSTITUTION.md) | Visión, filosofía, reglas (SSOT) |
| [PRD](.claude/doc/PRODUCT_REQUIREMENTS.md) | Requisitos completos del producto |
| [UX Design](.claude/doc/UX_DESIGN.md) | Pantallas, flujos, navegación |
| [MVP](docs/MVP.md) | Definición del primer entregable |
| [Roadmap](docs/ROADMAP.md) | Plan por fases |
| [Backlog](docs/BACKLOG.md) | Historias priorizadas |
| [CONTRIBUTING](CONTRIBUTING.md) | Guía para contribuir |

---

## Git workflow

| Rama | Propósito |
| ---- | --------- |
| `main` | Producción (rama por defecto) |
| `feature/*` | Desarrollo de funcionalidades |

Flujo: `feature/*` → PR a `main` → deploy automático a producción en Vercel.

Commits: [Conventional Commits](https://www.conventionalcommits.org/) (`feat:`, `fix:`, `docs:`, etc.)

---

## Desarrollo local

```bash
cp .env.example .env
# Edita .env y añade DATABASE_URL (Neon PostgreSQL)

npm install
npm run db:migrate
npm run db:seed
npm run dev:all   # frontend :5173 + API :3001

# O por separado:
npm run dev
npm run dev:server
```

**Credenciales de desarrollo** (tras `db:seed`):

| Rol | Usuario | Contraseña |
| --- | ------- | ---------- |
| Estudiante | `estudiante` | `1234` |
| Padre (gate) | — | `parent123` |

---

## Principios

1. **Calidad sobre velocidad** — siempre
2. **Tablet-first** — iPad Air 2 como referencia
3. **Currículo primero** — IA alineada a 4º Primaria
4. **Simplicidad para la niña** — complejidad solo en arquitectura
5. **Mantenible años** — tipos, tests, documentación

---

## Licencia

[MIT](LICENSE) — Copyright (c) 2026 Summer Study Contributors

---

## Estado del proyecto

| Fase | Estado |
| ---- | ------ |
| Fase 0 — Documentación + infraestructura | ✅ Completa |
| Fase 1 — MVP | En curso (siguiente: auth) |
| Fase 2 — Motivación | Pendiente |

Ver [CHANGELOG](CHANGELOG.md) para historial de cambios.
