# Summer Study — Roadmap

Version: 1.0  
Status: Active — pending client approval on MVP scope

---

## Visión por fases

```
Fase 0 ──► Fase 1 (MVP) ──► Fase 2 ──► Fase 3 ──► Fase 4
Docs        Core loop       Motivación    Evolución     Escala
```

---

## Fase 0 — Fundamentos ✅

- [x] Constitución y documentación SSOT
- [x] PRD completo (problema, personas, casos de uso, historias)
- [x] UX design (pantallas, flujos, navegación)
- [x] Design system (tokens, componentes)
- [x] Modelo de datos
- [x] Diseño API REST
- [x] Arquitectura frontend
- [x] Sistema IA (generación, validación, versionado)
- [x] Gamificación v1 (diseño)
- [x] Estrategia testing y despliegue
- [x] ADRs (stack, ORM, API, auth, Neon)
- [x] Repositorio: LICENSE, CONTRIBUTING, CHANGELOG, templates GitHub
- [x] Backlog inicial y definición MVP
- [x] Aprobación cliente de Fase 0
- [x] Scaffold del proyecto (Vite + React + TS + Tailwind)
- [x] CI/CD GitHub Actions (activo)
- [x] Branches `main` y `develop` (local)
- [ ] Neon PostgreSQL — proyecto y schema inicial
- [ ] Vercel — proyecto conectado al repo

---

## Fase 1 — MVP (core loop)

**Objetivo:** La niña completa una ronda de Matemáticas sin ayuda.

- [ ] Auth (estudiante + gate padre)
- [ ] Home con selección de materia
- [ ] Motor de rondas (20 ejercicios)
- [ ] Generación IA (piloto: Matemáticas)
- [ ] UI de ejercicios con feedback
- [ ] Pantalla de resultados
- [ ] Historial (listado + detalle)
- [ ] Design system (componentes base)
- [ ] Tests críticos (auth, ronda, historial)
- [ ] Deploy producción en Vercel

Detalle: [MVP.md](./MVP.md) | Backlog: [BACKLOG.md](./BACKLOG.md)

---

## Fase 2 — Motivación y materias

- [ ] Sistema de recompensas v1 (estrellas, XP)
- [ ] Rachas diarias
- [ ] Materias restantes (Lengua, Inglés, Valenciano, Medi)
- [ ] Progreso por materia
- [ ] Panel padre (estadísticas básicas)
- [ ] Pantalla de logros

---

## Fase 3 — Evolución

- [ ] Mapas de contenidos por materia
- [ ] Detección de puntos débiles
- [ ] Insignias y logros avanzados
- [ ] Estadísticas y evolución temporal
- [ ] Dificultad adaptativa

---

## Fase 4 — Escala

- [ ] Multi-usuario / multi-familia
- [ ] Configuración de nivel curricular
- [ ] PWA / offline (evaluación)
- [ ] Internacionalización (si aplica)

---

## Versiones previstas

| Versión | Contenido | Fase |
| ------- | --------- | ---- |
| **0.1.0** | Documentación y estructura repo | Fase 0 |
| **1.0.0** | MVP — core loop Matemáticas | Fase 1 |
| **1.1.0** | 5 materias + recompensas básicas | Fase 2 |
| **1.2.0** | Panel padre + progreso | Fase 2 |
| **2.0.0** | Contenidos estructurados + adaptación | Fase 3 |

---

## Principio rector

En cualquier conflicto entre rapidez y calidad: **siempre calidad**.

---

## Orden de implementación (post-aprobación)

1. Infraestructura del proyecto
2. Autenticación
3. Modelo de datos
4. Backend
5. Frontend base
6. Sistema de IA
7. Motor de rondas
8. Historial
9. Gamificación (hooks)
10. Optimización
11. Testing
12. Despliegue
