# ADR-004: Session-Based Auth with httpOnly Cookies

**Status:** Accepted  
**Date:** 2026-07-05  
**Deciders:** Software Architect, Security Engineer

---

## Context

Summer Study needs simple authentication for a child (username + password) and a separate parent password gate. The app runs as a SPA on Vercel with same-origin API.

## Decision

Use **session-based authentication** with **httpOnly, Secure, SameSite=Lax** cookies. Parent admin uses a short-lived token after password verification.

## Alternatives Considered

| Option | Pros | Cons |
| ------ | ---- | ---- |
| **JWT in localStorage** | Stateless | XSS risk; not ideal for child app on shared device |
| **JWT in httpOnly cookie** | Stateless API | Refresh complexity; revocation harder |
| **Server session + cookie** | Secure, revocable | Requires session store (DB or signed cookie) |

## Decision Detail

- Session stored server-side (DB table `sessions`) or signed encrypted cookie
- `SESSION_SECRET` env var for signing
- Parent: `POST /auth/parent/verify` → `X-Parent-Token` header (15 min TTL)

## Consequences

**Positive:**

- Tokens not accessible to JavaScript (XSS mitigation)
- Simple logout (clear cookie)
- Appropriate for single-user family app

**Negative:**

- CSRF protection required on mutations
- Session storage adds DB table

## Security Requirements

- Password hashing: bcrypt or argon2
- Rate limit login attempts
- No credentials in URL or logs
