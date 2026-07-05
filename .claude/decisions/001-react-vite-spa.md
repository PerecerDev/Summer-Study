# ADR-001: React + Vite SPA (not Next.js)

**Status:** Accepted  
**Date:** 2026-07-05  
**Deciders:** Software Architect, PM

---

## Context

Summer Study is a tablet-first educational SPA for a single primary user (initially). The app needs fast load on iPad Air 2, simple deployment to Vercel, and a clear separation between frontend and API.

## Decision

Use **React 18+ with Vite** as a single-page application. API routes deployed as Vercel serverless functions alongside the static build.

## Alternatives Considered

| Option | Pros | Cons |
| ------ | ---- | ---- |
| **Next.js (App Router)** | Unified full-stack, SSR | Larger bundle; SSR unnecessary for authenticated SPA; complexity for iPad perf |
| **Remix** | Good data loading | Smaller ecosystem fit; team familiarity |
| **Vite SPA + serverless API** | Small bundle, fast HMR, simple mental model | Separate API routing setup |

## Consequences

**Positive:**

- Optimal bundle size for iPad Air 2
- Fast dev experience with Vite
- Clear feature-based frontend structure
- Vercel static + functions is well-documented

**Negative:**

- No built-in SSR (not needed for v1)
- API routing requires explicit setup (`/api` folder or proxy)
- SEO irrelevant for authenticated child app

## Compliance

Aligns with `CONSTITUTION.md` performance and quality principles.
