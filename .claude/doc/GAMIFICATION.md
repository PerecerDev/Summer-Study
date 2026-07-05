# Summer Study — Gamification System

Version: 1.0  
Status: Active — design specification (incremental implementation)

---

# Purpose

Defines a motivation system that supports learning without turning the app into a video game.

Precedence: `CONSTITUTION.md` > `PRODUCT_REQUIREMENTS.md` > this document.

---

# Design Philosophy

| Principle | Application |
| --------- | ----------- |
| Learning first | Rewards follow completed practice, not random clicks |
| Light touch | Subtle celebration, not overwhelming effects |
| Extensible | Data model supports future mechanics without migration |
| Optional depth | Child can ignore logros; core loop works without them |
| No punishment | Wrong answers don't remove stars or break streaks harshly |

---

# Currency and Metrics

## Stars (P1 — first reward)

| Event | Stars |
| ----- | ----- |
| Complete round | 1–3 based on score (≤50%: 1, 51–79%: 2, ≥80%: 3) |
| Perfect round (20/20) | +2 bonus |

**Display:** Gold star icon in results and profile.

## XP (Experience) (P1)

| Event | XP |
| ----- | -- |
| Per correct answer | +10 XP |
| Complete round | +50 XP |
| Daily first round | +25 XP bonus |

**Level formula:** `level = floor(sqrt(totalXp / 100)) + 1`

Levels unlock cosmetic titles only (no gameplay advantage).

## Coins (P2)

Reserved for future shop/collectibles. Architecture in place; no UI in v1.

---

# Streaks (P1)

**Definition:** Consecutive calendar days with at least one completed round.

| Rule | Detail |
| ---- | ------ |
| Timezone | Europe/Madrid |
| Grace | None in v1 (strict daily) |
| Display | Flame icon + count on Home |
| Break | Resets to 0; gentle message, no shame |

---

# Badges / Insignias (P2)

Predefined achievements with clear criteria.

| Badge code | Name | Criteria |
| ---------- | ---- | -------- |
| `first_round` | Primera ronda | Complete 1 round |
| `math_5` | Matemático | 5 math rounds |
| `streak_3` | Constante | 3-day streak |
| `perfect` | Perfecto | Score 100% on any round |
| `all_subjects` | Explorador | 1 round per subject |

**Storage:** `badges` catalog + `user_badges` join table.

---

# Missions (P3 — future)

Daily/weekly goals: "Completa 2 rondas de Lengua esta semana."

Architecture: `missions` table with progress tracking. Not in MVP.

---

# Collectibles (P3 — future)

Cosmetic items earned with coins. No pay-to-win. Deferred.

---

# UI Integration Points

| Screen | Gamification elements |
| ------ | --------------------- |
| Home | Streak chip, XP bar (P1) |
| Results | Stars earned, XP gained, level-up animation (P1) |
| Profile | Level, total stars, XP bar |
| Achievements | Badge grid |
| Exercise | None (focus on learning) |
| Parent panel | Factual stats only — no game visuals |

---

# Reward Event Pipeline

```
Round complete
  → Server calculates rewards
  → Persist RewardEvent rows
  → Update UserProgress aggregate
  → Check badge criteria
  → Return rewards in API response
  → Client shows celebration
```

All reward logic **server-side** to prevent manipulation.

---

# Data Model (see DATA_MODEL.md)

- `RewardEvent` — immutable log of earned rewards
- `UserProgress` — denormalized aggregates for fast reads
- `Badge` + `UserBadge` — achievement catalog and unlocks

---

# Anti-Patterns

- Loot boxes or random rewards
- Losing progress on wrong answers
- Leaderboards comparing to other children (v1)
- Notifications pushing guilt ("¡Te echamos de menos!")
- Rewards for opening app without completing exercises

---

# MVP Scope

| Element | MVP (Phase 1) | Phase 2 |
| ------- | ------------- | ------- |
| Data model | ✅ Architecture | — |
| Stars | — | ✅ |
| XP + levels | — | ✅ |
| Streaks | — | ✅ |
| Badges | — | Partial |
| Coins | — | — |
| Missions | — | — |

Phase 1 implements **results score only**; reward hooks return empty array until Phase 2.

---

# Success Metrics

- Streak retention: child practices 3+ consecutive days
- Round completion rate > 80% (started → finished)
- Parent reports motivation without distraction from learning
