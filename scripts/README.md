# Scripts

Utility scripts for development, database, and deployment.

## Planned scripts

| Script | Purpose |
| ------ | ------- |
| `db:migrate` | Run Drizzle migrations |
| `db:seed` | Seed dev data (subjects, test user) |
| `db:studio` | Drizzle Studio (dev) |
| `prompts:validate` | Validate prompt templates against schema |

Scripts will be defined in `package.json` when the project is scaffolded.

## Conventions

- Node.js / TypeScript scripts in `scripts/`
- Executable via `npm run <script>`
- No secrets in scripts — use env vars
- Document each script in this README when added
