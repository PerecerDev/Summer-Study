# Server

API layer, database, AI services, and versioned prompts.

## Structure (planned)

```
server/
├── routes/          # REST handlers (/api/v1)
├── services/        # Business logic, AI generation
├── db/
│   ├── schema.ts    # Drizzle schema
│   └── migrations/
├── prompts/         # Versioned AI prompt templates
└── schemas/         # Zod validation
```

Implementation begins in Epic E2 (auth) and E4 (rounds).

See `.claude/doc/API_DESIGN.md` and `.claude/doc/AI_SYSTEM.md`.
