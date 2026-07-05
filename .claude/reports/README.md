# Task Reports

Agents write JSON task reports here after completing work.

## Schema

```json
{
  "agent": "agent-name",
  "task": "Brief task description",
  "status": "completed | blocked | partial",
  "verdict": "APROBADO | APROBADO CON CAMBIOS | RECHAZADO | N/A",
  "summary": "What was done",
  "persisted_data": {},
  "blockers": [],
  "next_steps": []
}
```

## Rules

- PM reads `persisted_data` before next delegation
- Never store secrets, API keys, or passwords
- Clean up reports after feature delivery (keep this README)
