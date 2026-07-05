import { asc, eq } from 'drizzle-orm';
import { getDb } from '../db/index.js';
import { subjects } from '../db/schema.js';

export interface SubjectDto {
  id: string;
  code: string;
  name: string;
  icon?: string;
  sortOrder: number;
}

function toSubjectDto(row: typeof subjects.$inferSelect): SubjectDto {
  return {
    id: row.id,
    code: row.code,
    name: row.name,
    icon: row.icon ?? undefined,
    sortOrder: row.sortOrder,
  };
}

export async function listActiveSubjects(): Promise<SubjectDto[]> {
  const db = getDb();
  const rows = await db
    .select()
    .from(subjects)
    .where(eq(subjects.isActive, true))
    .orderBy(asc(subjects.sortOrder));

  return rows.map(toSubjectDto);
}

export async function getSubjectByCode(code: string) {
  const db = getDb();
  const [row] = await db.select().from(subjects).where(eq(subjects.code, code)).limit(1);
  return row ?? null;
}
