CREATE TABLE IF NOT EXISTS "subjects" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "code" varchar(32) NOT NULL,
  "name" varchar(64) NOT NULL,
  "icon" varchar(32),
  "sort_order" integer NOT NULL,
  "is_active" boolean DEFAULT true NOT NULL,
  CONSTRAINT "subjects_code_unique" UNIQUE("code")
);

CREATE TABLE IF NOT EXISTS "rounds" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "user_id" uuid NOT NULL,
  "subject_id" uuid NOT NULL,
  "subject_code" varchar(32) NOT NULL,
  "status" varchar(20) DEFAULT 'in_progress' NOT NULL,
  "exercise_count" integer DEFAULT 20 NOT NULL,
  "correct_count" integer DEFAULT 0 NOT NULL,
  "score_percent" integer DEFAULT 0 NOT NULL,
  "started_at" timestamp with time zone DEFAULT now() NOT NULL,
  "completed_at" timestamp with time zone,
  "duration_seconds" integer,
  "prompt_version" varchar(20),
  "created_at" timestamp with time zone DEFAULT now() NOT NULL,
  "updated_at" timestamp with time zone DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS "exercises" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "round_id" uuid NOT NULL,
  "order_index" integer NOT NULL,
  "type" varchar(32) NOT NULL,
  "question" text NOT NULL,
  "options" jsonb,
  "correct_answer" jsonb NOT NULL,
  "explanation" text,
  "subject_code" varchar(32) NOT NULL,
  "topic_tag" varchar(64),
  "difficulty" varchar(16) NOT NULL,
  "created_at" timestamp with time zone DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS "exercise_attempts" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "exercise_id" uuid NOT NULL,
  "round_id" uuid NOT NULL,
  "user_id" uuid NOT NULL,
  "user_answer" jsonb,
  "is_correct" boolean NOT NULL,
  "skipped" boolean DEFAULT false NOT NULL,
  "answered_at" timestamp with time zone DEFAULT now() NOT NULL,
  "time_spent_seconds" integer
);

ALTER TABLE "rounds" ADD CONSTRAINT "rounds_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
ALTER TABLE "rounds" ADD CONSTRAINT "rounds_subject_id_subjects_id_fk" FOREIGN KEY ("subject_id") REFERENCES "public"."subjects"("id") ON DELETE no action ON UPDATE no action;
ALTER TABLE "exercises" ADD CONSTRAINT "exercises_round_id_rounds_id_fk" FOREIGN KEY ("round_id") REFERENCES "public"."rounds"("id") ON DELETE cascade ON UPDATE no action;
ALTER TABLE "exercise_attempts" ADD CONSTRAINT "exercise_attempts_exercise_id_exercises_id_fk" FOREIGN KEY ("exercise_id") REFERENCES "public"."exercises"("id") ON DELETE cascade ON UPDATE no action;
ALTER TABLE "exercise_attempts" ADD CONSTRAINT "exercise_attempts_round_id_rounds_id_fk" FOREIGN KEY ("round_id") REFERENCES "public"."rounds"("id") ON DELETE cascade ON UPDATE no action;
ALTER TABLE "exercise_attempts" ADD CONSTRAINT "exercise_attempts_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;

CREATE UNIQUE INDEX IF NOT EXISTS "exercises_round_order_idx" ON "exercises" USING btree ("round_id","order_index");
