# Summer Study — API Design

Version: 1.0  
Status: Active — design specification (no implementation until approved plan)

---

# Purpose

Defines REST API endpoints, request/response contracts, validation, errors, auth, and versioning before backend implementation.

Precedence: `CONSTITUTION.md` > `DATA_MODEL.md` > this document.

---

# API Principles

- REST over HTTPS
- JSON request/response bodies
- Typed contracts shared with frontend (`shared/types/api/`)
- Zod validation on all inputs
- Consistent error envelope
- Server-side auth on all protected routes
- Version prefix: `/api/v1/`

---

# Base URL

| Environment | URL |
| ----------- | --- |
| Development | `http://localhost:5173/api/v1` (Vite proxy) or dedicated port |
| Production | `https://<vercel-domain>/api/v1` |

---

# Authentication

## Model

Session-based with httpOnly secure cookie (`ss_session`).

| Endpoint | Auth |
| -------- | ---- |
| Public | `POST /auth/login` |
| Student | Cookie required |
| Parent | Cookie + `X-Parent-Token` header (short-lived, issued after password verify) |

## Flow

```
POST /auth/login { username, password }
  → Set-Cookie: ss_session=...
  → 200 { user: UserDTO }

POST /auth/parent/verify { password }
  → 200 { parentToken, expiresAt }

POST /auth/logout
  → Clear cookie
```

## Authorization matrix

| Resource | Student | Parent |
| -------- | ------- | ------ |
| Own rounds | CRUD (no delete) | Read |
| Own progress | Read | Read |
| Generate round | Create | — |
| Settings | Read | Update |

---

# Error Envelope

```typescript
interface ApiError {
  error: {
    code: string;       // machine-readable, e.g. ROUND_NOT_FOUND
    message: string;    // user-safe Spanish for client display
    details?: unknown;  // validation errors (dev only in non-prod)
  };
}
```

## HTTP status codes

| Code | Usage |
| ---- | ----- |
| 200 | Success |
| 201 | Created |
| 400 | Validation error |
| 401 | Not authenticated |
| 403 | Not authorized (parent gate) |
| 404 | Resource not found |
| 409 | Conflict (e.g. round already in progress) |
| 429 | Rate limit (AI generation) |
| 500 | Internal error |
| 503 | AI generation failed after retries |

## Error codes (catalog)

| Code | HTTP | Message (ES) |
| ---- | ---- | ------------ |
| `VALIDATION_ERROR` | 400 | Datos no válidos |
| `UNAUTHORIZED` | 401 | Inicia sesión para continuar |
| `FORBIDDEN` | 403 | No tienes permiso |
| `NOT_FOUND` | 404 | No encontrado |
| `ROUND_IN_PROGRESS` | 409 | Ya tienes una ronda en curso |
| `GENERATION_RATE_LIMIT` | 429 | Has creado muchas rondas hoy. Inténtalo mañana. |
| `GENERATION_FAILED` | 503 | No hemos podido crear la ronda. Inténtalo de nuevo. |

---

# Endpoints

## Auth

### `POST /auth/login`

**Body:**

```json
{ "username": "string", "password": "string" }
```

**Response 200:**

```json
{ "user": { "id": "uuid", "displayName": "string", "username": "string" } }
```

**Validation:** username 3–32 chars; password 4–64 chars.

---

### `POST /auth/logout`

**Response 204**

---

### `GET /auth/session`

**Response 200:**

```json
{ "user": UserDTO, "isAuthenticated": true }
```

**Response 401:** not logged in.

---

### `POST /auth/parent/verify`

**Body:** `{ "password": "string" }`

**Response 200:** `{ "parentToken": "string", "expiresAt": "ISO8601" }`

---

## Subjects

### `GET /subjects`

**Response 200:**

```json
{ "subjects": [{ "id": "uuid", "code": "math", "name": "Matemáticas", "icon": "string", "sortOrder": 1 }] }
```

---

## Rounds

### `POST /rounds/generate`

Generate AI round and persist.

**Body:**

```json
{
  "subjectCode": "math",
  "exerciseCount": 20,
  "difficulty": "mixed"
}
```

**Response 201:**

```json
{
  "roundId": "uuid",
  "exercises": [GeneratedExerciseDTO],
  "promptVersion": "1.0.0"
}
```

**Errors:** `ROUND_IN_PROGRESS`, `GENERATION_RATE_LIMIT`, `GENERATION_FAILED`

---

### `GET /rounds/active`

Current in-progress round for user, if any.

**Response 200:** `RoundWithExercisesDTO | null`

---

### `GET /rounds/:roundId`

Round detail with exercises and attempts.

**Response 200:** `RoundDetailDTO`

---

### `POST /rounds/:roundId/attempts`

Submit answer for exercise.

**Body:**

```json
{
  "exerciseId": "uuid",
  "userAnswer": "string | string[]",
  "timeSpentSeconds": 45,
  "skipped": false
}
```

**Response 200:**

```json
{
  "isCorrect": true,
  "correctAnswer": "string",
  "explanation": "string?",
  "roundProgress": { "answered": 7, "total": 20 }
}
```

---

### `POST /rounds/:roundId/complete`

Finalize round; compute score; emit rewards.

**Response 200:**

```json
{
  "roundId": "uuid",
  "correctCount": 16,
  "scorePercent": 80,
  "durationSeconds": 720,
  "rewards": [{ "type": "star", "amount": 3 }]
}
```

---

### `POST /rounds/:roundId/abandon`

Mark round abandoned (defer).

**Response 200:** `{ "status": "abandoned" }`

---

## History

### `GET /history/rounds`

**Query:** `?subjectCode=math&limit=20&offset=0`

**Response 200:**

```json
{
  "rounds": [RoundSummaryDTO],
  "total": 42
}
```

---

## Progress

### `GET /progress`

**Response 200:** `UserProgressDTO`

---

### `GET /progress/subjects/:subjectCode`

**Response 200:** `SubjectStatDTO`

---

## Rewards (P1)

### `GET /rewards`

**Response 200:** `{ "events": RewardEventDTO[], "totals": { "stars": 0, "xp": 0, "coins": 0 } }`

---

### `GET /achievements`

**Response 200:** `{ "badges": BadgeWithProgressDTO[] }`

---

## Parent (requires parent token)

### `GET /parent/overview`

**Response 200:** `ParentOverviewDTO`

---

### `GET /parent/history/rounds`

Same as history with extended stats.

---

# Validation Rules (Summary)

| Field | Rule |
| ----- | ---- |
| UUIDs | RFC 4122 format |
| subjectCode | enum: math, language, english, valencian, medi |
| exerciseCount | 1–20, default 20 |
| userAnswer | max 500 chars; sanitized |
| pagination limit | max 50 |

---

# Versioning Strategy

- URL prefix `/api/v1/`
- Breaking changes → `/api/v2/` with 6-month deprecation notice
- Non-breaking additions (new optional fields) allowed in v1
- `Accept-Version` header optional (future)

---

# Rate Limiting

| Endpoint | Limit |
| -------- | ----- |
| `POST /rounds/generate` | 10/day/user |
| `POST /auth/login` | 5/min/IP |
| General API | 100/min/user |

---

# CORS

- Production: frontend origin only
- Development: localhost origins

---

# OpenAPI

Generate OpenAPI 3.1 spec from Zod schemas when implementation begins (`server/openapi/`).
