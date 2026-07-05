CREATE TABLE IF NOT EXISTS "user_subject_access" (
  "user_id" uuid NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
  "subject_id" uuid NOT NULL REFERENCES "subjects"("id") ON DELETE CASCADE,
  "parent_approved" boolean DEFAULT false NOT NULL,
  "approved_at" timestamp with time zone,
  "updated_at" timestamp with time zone DEFAULT now() NOT NULL,
  PRIMARY KEY ("user_id", "subject_id")
);

-- Activate all subjects globally (prompts available in v1.0.0)
UPDATE "subjects" SET "is_active" = true;
