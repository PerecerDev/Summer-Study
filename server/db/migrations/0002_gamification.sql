CREATE TABLE IF NOT EXISTS "user_progress" (
  "user_id" uuid PRIMARY KEY REFERENCES "users"("id") ON DELETE CASCADE,
  "total_rounds_completed" integer DEFAULT 0 NOT NULL,
  "total_correct" integer DEFAULT 0 NOT NULL,
  "accuracy_percent" integer DEFAULT 0 NOT NULL,
  "current_streak" integer DEFAULT 0 NOT NULL,
  "longest_streak" integer DEFAULT 0 NOT NULL,
  "total_stars" integer DEFAULT 0 NOT NULL,
  "total_coins" integer DEFAULT 0 NOT NULL,
  "total_xp" integer DEFAULT 0 NOT NULL,
  "level" integer DEFAULT 1 NOT NULL,
  "last_practice_date" date,
  "subject_stats" jsonb DEFAULT '[]'::jsonb NOT NULL,
  "updated_at" timestamp with time zone DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS "reward_events" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "user_id" uuid NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
  "type" varchar(32) NOT NULL,
  "amount" integer,
  "badge_code" varchar(64),
  "metadata" jsonb,
  "source_round_id" uuid REFERENCES "rounds"("id") ON DELETE SET NULL,
  "earned_at" timestamp with time zone DEFAULT now() NOT NULL
);

CREATE INDEX IF NOT EXISTS "reward_events_user_id_idx" ON "reward_events" ("user_id");
CREATE INDEX IF NOT EXISTS "reward_events_earned_at_idx" ON "reward_events" ("earned_at");

CREATE TABLE IF NOT EXISTS "badges" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "code" varchar(64) NOT NULL UNIQUE,
  "name" varchar(64) NOT NULL,
  "description" text NOT NULL,
  "icon" varchar(16) NOT NULL DEFAULT '🏅'
);

CREATE TABLE IF NOT EXISTS "user_badges" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "user_id" uuid NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
  "badge_id" uuid NOT NULL REFERENCES "badges"("id") ON DELETE CASCADE,
  "unlocked_at" timestamp with time zone DEFAULT now() NOT NULL,
  CONSTRAINT "user_badges_user_badge_unique" UNIQUE ("user_id", "badge_id")
);

INSERT INTO "badges" ("code", "name", "description", "icon")
VALUES
  ('first_round', 'Primera ronda', 'Completa tu primera ronda', '🎯'),
  ('math_5', 'Matemático', 'Completa 5 rondas de Matemáticas', '🔢'),
  ('streak_3', 'Constante', 'Practica 3 días seguidos', '🔥'),
  ('perfect', 'Perfecto', 'Consigue 100% en una ronda', '💯'),
  ('all_subjects', 'Explorador', 'Completa 1 ronda en cada materia', '🧭')
ON CONFLICT ("code") DO NOTHING;
