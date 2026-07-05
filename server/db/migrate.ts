import { readFileSync } from 'node:fs';
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
  const migrationPath = join(__dirname, 'migrations', '0000_init.sql');
  const migrationSql = readFileSync(migrationPath, 'utf-8');

  await sql.unsafe(migrationSql);
  await sql.end();

  console.log('Migration 0000_init applied successfully.');
}

migrate().catch((error: unknown) => {
  console.error('Migration failed:', error);
  process.exit(1);
});
