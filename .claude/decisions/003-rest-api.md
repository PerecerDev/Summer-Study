# ADR-003: REST API with Version Prefix

**Status:** Accepted  
**Date:** 2026-07-05  
**Deciders:** Software Architect

---

## Context

The frontend needs typed, predictable contracts for rounds, auth, history, and AI generation. The team must choose between REST, tRPC, or GraphQL.

## Decision

Implement a **REST API** under `/api/v1/` with JSON bodies. Shared Zod schemas for validation and TypeScript types.

## Alternatives Considered

| Option | Pros | Cons |
| ------ | ---- | ---- |
| **tRPC** | End-to-end type safety | Couples FE/BE; harder for future mobile clients |
| **GraphQL** | Flexible queries | Overkill for simple CRUD; learning curve |
| **REST + Zod** | Universal, simple, cacheable | Manual type sharing (mitigated by shared package) |

## Consequences

**Positive:**

- Standard HTTP semantics; easy to test with curl/Postman
- TanStack Query integrates naturally
- OpenAPI generation possible from Zod
- Future clients (PWA, native) can consume same API

**Negative:**

- Some duplication between request/response types and routes
- No automatic type inference across network boundary (unlike tRPC)

## Reference

See `API_DESIGN.md` for full endpoint catalog.
