# Changelog

All notable changes to Summer Study are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [Unreleased]

### Added

- **Authentication (Epic E2):** session cookies, login/logout, protected routes, parent gate
- Drizzle schema: users, parents, sessions, parent_tokens
- Hono API (`/api/v1/auth/*`) + dev server on port 3001
- Login page, Profile with logout, ParentGate modal
- UI primitives: Button, Input, Modal
- DB migrate/seed scripts

### Changed

- Phase 0 documentation marked complete; ADRs 001–005 accepted
- README updated with local dev instructions

---

## [0.1.0] - 2026-07-05

### Added

- Initial project constitution and SSOT document set
- Roadmap draft
- README with project overview

[Unreleased]: https://github.com/your-org/summer-study/compare/v0.1.0...HEAD
[0.1.0]: https://github.com/your-org/summer-study/releases/tag/v0.1.0
