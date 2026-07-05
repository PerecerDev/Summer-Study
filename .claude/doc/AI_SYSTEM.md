# Summer Study — AI Exercise Generation System

Version: 1.0  
Status: Active — design specification (no prompts in production until approved)

---

# Purpose

Defines how AI generates, validates, versions, and evolves curricular exercises. Server-side only.

Precedence: `CONSTITUTION.md` > `PRODUCT_REQUIREMENTS.md` > this document.

---

# System Overview

```
Client                    Server                           External
  │                         │                                 │
  │ POST /rounds/generate   │                                 │
  ├────────────────────────►│ Build prompt (versioned)        │
  │                         ├────────────────────────────────►│ LLM API
  │                         │◄────────────────────────────────┤
  │                         │ Parse + Zod validate            │
  │                         │ Retry if invalid (max 3)        │
  │                         │ Persist Round + Exercises       │
  │◄────────────────────────┤ Return roundId + exercises      │
```

---

# Generation Pipeline

## Step 1 — Request validation

Input: `userId`, `subjectCode`, optional `exerciseCount` (default 20), optional `difficulty`.

Reject if: user not authenticated, subject inactive, rate limit exceeded, concurrent generation in progress.

## Step 2 — Prompt assembly

Components:

| Layer | Content |
| ----- | ------- |
| System prompt | Role, curriculum rules, output format, safety |
| Subject template | Subject-specific topics and exercise type mix |
| User context | Grade level, recent weak topics (future) |
| Output schema | JSON structure matching `GeneratedExerciseDTO` |

Prompt version ID recorded on `Round.promptVersion`.

## Step 3 — LLM call

- Model: TBD (ADR required; recommend cost-efficient model with JSON mode)
- Temperature: 0.7 (variety) with schema constraint
- Max tokens: budget per round (e.g. 8k output cap)
- Timeout: 60s with single retry on timeout

## Step 4 — Parse and validate

1. Parse JSON response
2. Validate with Zod schema (`GenerateRoundResponseSchema`)
3. Per-exercise checks (see Validation Rules)
4. Deduplication: no duplicate questions within round (normalized text compare)

## Step 5 — Retry policy

| Failure | Action |
| ------- | ------ |
| JSON parse error | Retry with "respond only valid JSON" reminder |
| Zod validation fail | Retry with specific field errors |
| Duplicate questions | Retry with "all questions must be unique" |
| Curriculum flag | Retry with stricter system prompt |
| Max retries (3) | Return 503 + log for review |

## Step 6 — Persist

Transaction: create `Round` (in_progress) + 20 `Exercise` rows. Return to client.

---

# Curriculum and Level Control

## Fixed constraints (non-negotiable)

| Rule | Implementation |
| ---- | -------------- |
| Grade | 4º Primaria completed (Spain) |
| Curriculum | LOMLOE-aligned topics per subject |
| Language | Child-friendly Spanish (except English/Valenciano subject content) |
| No off-curriculum | System prompt lists allowed topic areas |
| No trick questions | Validator rejects double-interpretation patterns |

## Subject topic maps (v1 pilot: Matemáticas)

Stored in `server/prompts/subjects/math/topics.json`:

- Números naturales y operaciones
- Fracciones básicas
- Geometría plana
- Medidas (longitud, masa, capacidad)
- Problemas de lógica aritmética

Other subjects: placeholder maps; enabled in Phase 2.

## Difficulty within round

Default mix per round:

- 40% easy
- 40% medium
- 20% hard

Hard = challenging within 4º level, never above.

---

# Exercise Format Control

## Supported types (MVP)

| Type | Schema fields | Validation |
| ---- | ------------- | ---------- |
| `multiple_choice` | question, options[2-4], correctAnswer | correctAnswer ∈ options |
| `true_false` | question, correctAnswer: "true"\|"false" | — |
| `fill_blank` | question with `___`, correctAnswer | single blank, single answer |
| `short_answer` | question, correctAnswer | normalized string match |

## Format rules

- Question length: 10–200 characters
- Options: 2–4 items, each 1–80 characters
- No images in v1 (text only)
- No LaTeX in v1 (plain text math: "3/4", "2 × 5")
- `orderIndex`: 0–19, unique within round

---

# Ambiguity Prevention

## Prompt instructions

- "Each exercise has exactly one correct answer"
- "Avoid questions where multiple options could be argued correct"
- "Use concrete numbers and unambiguous wording"
- "For fill_blank, only one blank per question"

## Post-generation validators

| Check | Method |
| ----- | ------ |
| Single correct MC answer | `correctAnswer` must match exactly one option |
| No empty strings | Zod min length |
| No duplicate options | Set size === array length |
| Answer in question leak | correctAnswer not substring of question (MC) |
| Profanity / inappropriate | Blocklist filter (Spanish) |
| Hallucination guard | Topic tag must be in subject topic map |

Failed checks → retry or reject exercise.

---

# Prompt Versioning

## Directory structure

```
server/prompts/
├── README.md
├── versions/
│   └── v1.0.0/
│       ├── system.md
│       ├── math.md
│       ├── language.md
│       ├── english.md
│       ├── valencian.md
│       └── medi.md
└── schemas/
    └── exercise-response.schema.ts
```

## Version format

Semantic: `MAJOR.MINOR.PATCH`

| Bump | When |
| ---- | ---- |
| MAJOR | Output schema breaking change |
| MINOR | New subject or significant prompt change |
| PATCH | Wording fix, typo, minor constraint |

## Storage

- `prompt_versions` table: id, version, subjectCode, hash, createdAt, changelog
- Each `Round` stores `promptVersion` used

## Evolution process

1. Propose change in `.claude/plans/prompt-<subject>-vX.md`
2. AI Systems Engineer drafts new template
3. PM + parent review sample outputs (20+ exercises)
4. Version bump + migration note
5. Old rounds retain original version (no regeneration)

---

# Prompt Reuse

| Pattern | Reuse |
| ------- | ----- |
| System prompt | Shared across all subjects |
| Subject template | Per subject, parameterized |
| Topic selection | Random sample from topic map per exercise |
| Exercise type mix | Config per subject in template metadata |

Templates use placeholders: `{{subject}}`, `{{topic}}`, `{{exerciseType}}`, `{{exerciseIndex}}`.

---

# Cost and Rate Control

| Limit | Value |
| ----- | ----- |
| Generations per user per day | 10 (configurable) |
| Concurrent generations per user | 1 |
| Token budget per request | 12,000 total |
| CI / tests | Mock LLM only — never real API |

---

# Observability

Log (server-side, no PII in prompts to client):

- `roundId`, `promptVersion`, `model`, `latencyMs`, `retryCount`, `validationErrors`
- Failed generations → review queue (future)

---

# Testing Strategy (AI)

| Test type | Scope |
| --------- | ----- |
| Unit | Zod schemas, validators, dedup logic |
| Snapshot | Prompt template assembly (no API) |
| Integration | Mock LLM returns → full pipeline |
| Manual QA | Parent reviews 50 exercises per subject before enable |

---

# Security

- API keys in env vars only (`LLM_API_KEY`)
- No prompt content sent to client
- No user-generated content in prompts (v1)
- Sanitize all LLM output before storage

---

# Future Extensions

- Weakness-weighted topic selection
- Structured curriculum JSON per region
- Human-reviewed exercise bank as fallback
- A/B testing prompt versions
- Image/diagram generation (out of scope v1)
