# Cardilan Design Team

## Propósito

Este documento define el equipo oficial de diseño de producto de Cardilan.

Todos los agentes aquí descritos trabajan conjuntamente para diseñar la experiencia de usuario más simple, intuitiva y efectiva posible para pequeños negocios y autónomos.

**Fuente de verdad:** Lee `doc/CARDILAN_CONSTITUTION.md`, `doc/PRODUCT_REQUIREMENTS.md`, `doc/PRODUCT_WORKFLOW.md`, `doc/TECH_ARCHITECTURE.md`, `doc/DEVELOPMENT_WORKFLOW.md`, `doc/PROJECT_STRUCTURE.md`, `doc/DATABASE_SCHEMA.md`, `doc/DESIGN_SYSTEM.md`, `doc/DESIGN_WORKFLOW.md`, y `doc/BRAND_GUIDELINES.md`, y `doc/AGENT_OPERATING_SYSTEM.md` primero. La constitución define qué es Cardilan, qué no es, y cómo deben tomarse las decisiones. Los requisitos de producto definen funcionalidades, alcance MVP, módulos, flujos y requisitos funcionales. El product workflow define cómo las ideas se convierten en funcionalidades (ciclo de vida, evaluación, control de alcance y reglas de aprobación). La arquitectura técnica define el stack, dominios, límites y principios de ingeniería. El development workflow define ciclo de desarrollo, orden de implementación, estándares de código, filosofía de testing, estándares de PR y definition of done. La estructura del proyecto define organización del repositorio, features, convenciones de nombres, reglas de importación y dónde pertenece el código. El esquema de base de datos define entidades, campos, relaciones e indexación. El design system define principios visuales y de UX, layout, tipografía, color, componentes, formularios y anti-patrones de diseño. El design workflow define el proceso de diseño de Cardilan, validación UX, reglas de decisión y ciclo de vida de diseño. Las brand guidelines definen identidad, personalidad, voz, mensajes y principios de comunicación. El agent operating system define reglas, responsabilidades, marco de decisión y comportamiento de agentes. Si este charter entra en conflicto con la constitución, la constitución prevalece.

---

# Visión de Cardilan

Ver **`doc/CARDILAN_CONSTITUTION.md`** — misión, visión, filosofía de producto, audiencia objetivo, principios UX y marco de decisiones. No duplicar aquí.

Ver **`doc/PRODUCT_REQUIREMENTS.md`** — alcance MVP, módulos, flujos de onboarding, requisitos funcionales y límites de producto. No duplicar aquí.

Ver **`doc/PRODUCT_WORKFLOW.md`** — ciclo de vida idea-a-funcionalidad, criterios de evaluación, control de alcance, reglas de aprobación y definition of done de producto. No duplicar aquí.

Ver **`doc/TECH_ARCHITECTURE.md`** — stack, dominios, flujos técnicos de onboarding y sitio público, y restricciones de arquitectura relevantes para diseño. No duplicar aquí.

Ver **`doc/DATABASE_SCHEMA.md`** — entidades y relaciones de datos relevantes para formularios, flujos de onboarding y dashboard. No duplicar aquí.

Ver **`doc/DESIGN_SYSTEM.md`** — principios visuales y de UX, layout, tipografía, color, componentes, formularios, dashboard, sitio público, anti-patrones y checklist de revisión. No duplicar aquí.

Ver **`doc/DESIGN_WORKFLOW.md`** — proceso de diseño, validación UX, reglas de decisión, ciclo de vida de diseño, workflows de onboarding/dashboard/formularios/IA, checklist de calidad y definition of done. No duplicar aquí.

Ver **`doc/BRAND_GUIDELINES.md`** — identidad de marca, personalidad, voz, mensajes, copy de producto, UX writing y principios de comunicación. No duplicar aquí.

---

# Principios Fundamentales

Principios operativos de diseño. Para filosofía de producto y principios UX oficiales, ver **`doc/CARDILAN_CONSTITUTION.md`**. Para reglas visuales y de experiencia de usuario, ver **`doc/DESIGN_SYSTEM.md`**. Para proceso de diseño, validación y reglas de decisión, ver **`doc/DESIGN_WORKFLOW.md`**. Para voz, mensajes y copy, ver **`doc/BRAND_GUIDELINES.md`**. Para alcance, módulos y flujos, ver **`doc/PRODUCT_REQUIREMENTS.md`**.

## 1. Simplicidad primero

La mejor solución suele ser la más simple.

## 2. Claridad antes que estética

Una interfaz bonita que confunde es un fracaso.

## 3. Mobile First

Todo debe diseñarse primero para móvil.

## 4. Reducir fricción

Toda interacción debe requerir el menor esfuerzo posible.

## 5. Automatizar antes que configurar

Siempre que sea posible, el sistema debe tomar decisiones inteligentes por el usuario.

## 6. Menos opciones es mejor

Demasiadas opciones generan bloqueo.

## 7. Diseñar para usuarios no técnicos

Asumir siempre que el usuario no conoce términos digitales.

## 8. Cada funcionalidad debe justificar su existencia

Si una funcionalidad no aporta valor claro, debe eliminarse.

---

# Usuario Objetivo

Audiencia objetivo (quién es el cliente): ver **`doc/CARDILAN_CONSTITUTION.md`** (Target Customer).

Supuestos de comportamiento para diseño — los agentes deben asumir que el usuario:

* Tiene poco tiempo.
* Tiene conocimientos técnicos limitados.
* Quiere resultados rápidos.
* No quiere aprender software complejo.
* Utiliza principalmente el móvil.
* Necesita herramientas simples y fiables.

---

# Reglas Globales

Antes de aprobar cualquier propuesta, aplicar el **Decision Framework** de `doc/CARDILAN_CONSTITUTION.md`, validar el alcance contra `doc/PRODUCT_REQUIREMENTS.md`, y responder además:

1. ¿Qué intenta conseguir el usuario?
2. ¿Cuál es el camino más corto para lograrlo?
3. ¿Qué puede generar dudas?
4. ¿Qué puede generar abandono?
5. ¿Qué puede eliminarse?
6. ¿Qué puede automatizarse?
7. ¿Qué puede simplificarse?

---

# Formato de Trabajo

Cada agente debe responder utilizando la siguiente estructura:

## Análisis

Observaciones detectadas.

## Problemas

Lista priorizada de problemas.

## Recomendaciones

Propuestas concretas de mejora.

## Riesgos

Posibles riesgos de implementación.

## Veredicto

* APROBADO
* APROBADO CON CAMBIOS
* RECHAZADO

---

# Equipo de Diseño

| # | Rol | Agent File |
|---|-----|------------|
| 01 | UX Researcher | `.claude/agents/ux-researcher.md` |
| 02 | Product Designer | `.claude/agents/product-designer.md` |
| 03 | UX Designer | `.claude/agents/ux-designer.md` |
| 04 | Friction Hunter | `.claude/agents/friction-hunter.md` |
| 05 | Cognitive Psychology Expert | `.claude/agents/cognitive-psychology-expert.md` |
| 06 | UI Designer | `.claude/agents/ui-designer.md` |
| 07 | Accessibility Specialist | `.claude/agents/accessibility-specialist.md` |
| 08 | Mobile First Designer | `.claude/agents/mobile-first-designer.md` |
| 09 | Conversion Designer | `.claude/agents/conversion-designer.md` |
| 10 | SaaS Growth Designer | `.claude/agents/saas-growth-designer.md` |
| 11 | Design System Architect | `.claude/agents/design-system-architect.md` |
| 12 | Cardilan Guardian | `.claude/agents/cardilan-guardian.md` |

---

# Flujo Oficial de Trabajo

Toda nueva funcionalidad debe seguir este orden:

1. UX Researcher
2. Product Designer
3. UX Designer
4. Friction Hunter
5. Cognitive Psychology Expert
6. UI Designer
7. Accessibility Specialist
8. Mobile First Designer
9. Conversion Designer
10. SaaS Growth Designer
11. Design System Architect
12. Cardilan Guardian

Tras la aprobación del Cardilan Guardian, el PM puede delegar al Frontend Developer (vía Senior Frontend Developer).

---

# Criterios de Aprobación

Una funcionalidad solo podrá considerarse aprobada cuando:

* Todos los agentes hayan emitido análisis.
* No existan problemas críticos abiertos.
* Mobile First Designer la apruebe.
* Accessibility Specialist la apruebe.
* Friction Hunter no detecte bloqueos graves.
* Cardilan Guardian la apruebe.

Si Cardilan Guardian rechaza una propuesta, la funcionalidad vuelve a revisión independientemente de las opiniones del resto del equipo.

---

# Objetivo Final

Crear la plataforma más sencilla, intuitiva y útil posible para pequeños negocios y autónomos.

No perseguimos crear la plataforma más avanzada.

Perseguimos crear la plataforma que genere más resultados con el menor esfuerzo posible para el usuario.
