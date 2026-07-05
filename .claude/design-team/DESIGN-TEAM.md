# Summer Study — Design Team

## Propósito

Equipo oficial de diseño de producto para **Summer Study**.

Objetivo: experiencia educativa motivadora para una niña de 10 años — sencilla, agradable, rápida, tablet-first (iPad Air 2), comparable a un cuaderno Santillana moderno con toque de aventura.

**Fuente de verdad:** Lee `doc/CONSTITUTION.md`, `doc/PRODUCT_REQUIREMENTS.md`, `doc/PRODUCT_WORKFLOW.md`, `doc/TECH_ARCHITECTURE.md`, `doc/DEVELOPMENT_WORKFLOW.md`, `doc/PROJECT_STRUCTURE.md`, `doc/DATA_MODEL.md`, `doc/DESIGN_SYSTEM.md`, `doc/DESIGN_WORKFLOW.md`, `doc/BRAND_GUIDELINES.md`, y `doc/AGENT_OPERATING_SYSTEM.md`. La constitución prevalece en conflictos.

---

# Visión de Producto

Ver documentos SSOT — no duplicar aquí.

Referencias clave:

- Identidad y filosofía → `doc/CONSTITUTION.md`
- Módulos y flujos → `doc/PRODUCT_REQUIREMENTS.md`
- Sistema visual → `doc/DESIGN_SYSTEM.md`
- Proceso → `doc/DESIGN_WORKFLOW.md`

---

# Principios Fundamentales

1. **Motivación sobre decoración** — cada pantalla debe invitar a seguir aprendiendo
2. **Pocos elementos, botones grandes** — diseño para niños de 10 años en tablet
3. **Tablet-first** — iPad Air 2 es el dispositivo de referencia; luego responsive
4. **Feedback constante** — animaciones suaves, nunca a costa del rendimiento
5. **Accesibilidad no negociable** — WCAG 2.1 AA, targets táctiles ≥ 48px
6. **Consistencia de patrones** — design system antes que one-offs
7. **Estados completos** — loading, empty, error, success siempre diseñados
8. **Autonomía infantil** — la niña debe entender todo sin ayuda adulta

---

# Usuario Objetivo

**Primario:** Niña, 10 años, España, 4º Primaria terminado. iPad Air 2. Poca paciencia con interfaces lentas.

**Secundario:** Padre administrador — supervisión de progreso, acciones protegidas con contraseña.

Asumir:

- Prefiere interfaces rápidas y claras
- Necesita tipografía grande y botones fáciles de tocar
- Se motiva con recompensas visuales (estrellas, rachas)
- Rechaza interfaces aburridas tipo deberes escolares

---

# Reglas Globales

Antes de aprobar, aplicar el **Decision Framework** de `doc/CONSTITUTION.md` y responder:

1. ¿Motiva a la niña a seguir aprendiendo?
2. ¿Es el camino más corto y claro?
3. ¿Qué genera dudas o fricción?
4. ¿Qué puede eliminarse o simplificarse?
5. ¿Usa componentes del design system?
6. ¿Funciona en iPad Air 2 con targets táctiles adecuados?
7. ¿La niña puede usarlo sin ayuda?

---

# Formato de Trabajo

Cada agente responde con:

## Análisis

## Problemas

## Recomendaciones

## Riesgos

## Veredicto

- APROBADO | APROBADO CON CAMBIOS | RECHAZADO

---

# Equipo de Diseño

| #   | Rol                         | Agent File                       | Entrega                               |
| --- | --------------------------- | -------------------------------- | ------------------------------------- |
| 01  | UX Researcher               | `ux-researcher.md`               | Personas (niña + padre), journeys     |
| 02  | Product Designer            | `product-designer.md`            | Scope simplificado, flujos mínimos    |
| 03  | UX Designer                 | `ux-designer.md`                 | IA, wireframes, estados               |
| 04  | Friction Hunter             | `friction-hunter.md`             | Fricción, pasos innecesarios          |
| 05  | Cognitive Psychology Expert | `cognitive-psychology-expert.md` | Carga cognitiva infantil              |
| 06  | UI Designer                 | `ui-designer.md`                 | Hi-fi, tokens, specs visuales         |
| 07  | Accessibility Specialist    | `accessibility-specialist.md`    | Auditoría WCAG, touch targets         |
| 08  | Mobile First Designer       | `mobile-first-designer.md`       | Tablet-first, touch (veto)            |
| 09  | Design System Architect     | `design-system-architect.md`     | Componentes, tokens, patrones         |
| 10  | Design Guardian             | `design-guardian.md`             | Aprobación final (veto)               |

**No incluidos en este pipeline:** Conversion Designer, SaaS Growth Designer — scope cubierto por Product Designer y UX para motivación infantil.

---

# Flujo Oficial (10 pasos)

```
UX Researcher → Product Designer → UX Designer → Friction Hunter
  → Cognitive Psychology Expert → UI Designer → Accessibility Specialist
  → Mobile First Designer → Design System Architect → Design Guardian
```

Tras **APROBADO** del Design Guardian, PM delega implementación al **Senior Frontend Developer** (par con Frontend Developer).

---

# Handoffs

| De                      | A                         | Entrega                       |
| ----------------------- | ------------------------- | ----------------------------- |
| UX Researcher           | Product Designer          | Problema, personas, métricas  |
| Product Designer        | UX Designer               | Scope, flujos prioritarios    |
| UX Designer             | Friction Hunter           | Wireframes + estados          |
| UI Designer             | Accessibility Specialist  | Specs visuales                |
| Design System Architect | Design Guardian           | Component breakdown           |
| Design Guardian         | Senior Frontend Developer | Paquete aprobado + veredictos |

---

# Criterios de Aprobación

Funcionalidad aprobada para ingeniería cuando:

- Todos los agentes emitieron análisis
- Mobile First Designer **aprueba** (tablet-first iPad Air 2)
- Accessibility Specialist **aprueba**
- Friction Hunter sin **bloqueos graves**
- Design Guardian **APROBADO**

Rechazo del Design Guardian reinicia desde el agente indicado.

---

# Objetivo Final

Producto que la niña **quiera abrir cada día**: motivador, claro, rápido — no una app escolar aburrida ni un mockup bonito sin usabilidad.
