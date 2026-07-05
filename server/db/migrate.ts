import { readdirSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { config } from 'dotenv';
import postgres from 'postgres';

config();

const __dirname = dirname(fileURLToPath(import.meta.url));

async function migrate() {
  const databaseUrl = process.env.DATABASE_URL;

  if (!databaseUrl) {
    throw new Error('DATABASE_URL is required to run migrations');
  }

  const sql = postgres(databaseUrl, { max: 1 });

  await sql`
    CREATE TABLE IF NOT EXISTS schema_migrations (
      id serial PRIMARY KEY,
      filename varchar(255) NOT NULL UNIQUE,
      applied_at timestamp with time zone DEFAULT now() NOT NULL
    )
  `;

  await sql`CREATE EXTENSION IF NOT EXISTS "pgcrypto"`;

  const migrationsDir = join(__dirname, 'migrations');
  const files = readdirSync(migrationsDir)
    .filter((file) => file.endsWith('.sql'))
    .sort();

  for (const file of files) {
    const [existing] = await sql`
      SELECT filename FROM schema_migrations WHERE filename = ${file}
    `;

    if (existing) {
      console.log(`Skipping ${file} (already applied)`);
      continue;
    }

    if (file === '0000_init.sql') {
      const [check] = await sql`SELECT to_regclass('public.users') AS table_name`;
      if (check?.table_name) {
        await sql`INSERT INTO schema_migrations (filename) VALUES (${file})`;
        console.log(`Skipping ${file} (schema already exists)`);
        continue;
      }
    }

    const migrationSql = readFileSync(join(migrationsDir, file), 'utf-8');
    await sql.unsafe(migrationSql);
    await sql`INSERT INTO schema_migrations (filename) VALUES (${file})`;
    console.log(`Applied ${file}`);
  }

  await sql.end();
  console.log('Migrations complete.');
}

migrate().catch((error: unknown) => {
  console.error('Migration failed:', error);
  process.exit(1);
});
