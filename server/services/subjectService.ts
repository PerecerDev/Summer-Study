import { and, asc, eq } from 'drizzle-orm';
import { getDb } from '../db/index.js';
import { subjects, userSubjectAccess } from '../db/schema.js';
import { ApiError } from '../lib/errors.js';

export interface SubjectDto {
  id: string;
  code: string;
  name: string;
  icon?: string;
  sortOrder: number;
}

export interface ParentSubjectDto extends SubjectDto {
  isActive: boolean;
  parentApproved: boolean;
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

const DEFAULT_APPROVED_CODES = new Set(['math']);

export async function ensureDefaultSubjectAccess(userId: string) {
  const db = getDb();
  const allSubjects = await db.select().from(subjects).orderBy(asc(subjects.sortOrder));

  for (const subject of allSubjects) {
    const [existing] = await db
      .select()
      .from(userSubjectAccess)
      .where(and(eq(userSubjectAccess.userId, userId), eq(userSubjectAccess.subjectId, subject.id)))
      .limit(1);

    if (existing) continue;

    const approved = DEFAULT_APPROVED_CODES.has(subject.code);

    await db.insert(userSubjectAccess).values({
      userId,
      subjectId: subject.id,
      parentApproved: approved,
      approvedAt: approved ? new Date() : null,
    });
  }
}

async function getAccessMap(userId: string) {
  const db = getDb();
  const rows = await db
    .select()
    .from(userSubjectAccess)
    .where(eq(userSubjectAccess.userId, userId));

  return new Map(rows.map((row) => [row.subjectId, row]));
}

export async function listSubjectsForUser(userId: string): Promise<SubjectDto[]> {
  await ensureDefaultSubjectAccess(userId);
  const db = getDb();
  const accessMap = await getAccessMap(userId);

  const rows = await db
    .select()
    .from(subjects)
    .where(eq(subjects.isActive, true))
    .orderBy(asc(subjects.sortOrder));

  return rows
    .filter((subject) => accessMap.get(subject.id)?.parentApproved === true)
    .map(toSubjectDto);
}

export async function listSubjectsForParent(userId: string): Promise<ParentSubjectDto[]> {
  await ensureDefaultSubjectAccess(userId);
  const db = getDb();
  const accessMap = await getAccessMap(userId);

  const rows = await db.select().from(subjects).orderBy(asc(subjects.sortOrder));

  return rows.map((subject) => ({
    ...toSubjectDto(subject),
    isActive: subject.isActive,
    parentApproved: accessMap.get(subject.id)?.parentApproved ?? false,
  }));
}

export async function setSubjectApproval(
  userId: string,
  subjectCode: string,
  approved: boolean,
): Promise<ParentSubjectDto> {
  const db = getDb();
  const [subject] = await db.select().from(subjects).where(eq(subjects.code, subjectCode)).limit(1);

  if (!subject) {
    throw new ApiError('NOT_FOUND', 404, 'Materia no encontrada');
  }

  if (!subject.isActive) {
    throw new ApiError('SUBJECT_UNAVAILABLE', 400, 'Esta materia aún no está disponible');
  }

  await ensureDefaultSubjectAccess(userId);

  const now = new Date();
  await db
    .insert(userSubjectAccess)
    .values({
      userId,
      subjectId: subject.id,
      parentApproved: approved,
      approvedAt: approved ? now : null,
      updatedAt: now,
    })
    .onConflictDoUpdate({
      target: [userSubjectAccess.userId, userSubjectAccess.subjectId],
      set: {
        parentApproved: approved,
        approvedAt: approved ? now : null,
        updatedAt: now,
      },
    });

  return {
    ...toSubjectDto(subject),
    isActive: subject.isActive,
    parentApproved: approved,
  };
}

export async function getSubjectByCode(code: string) {
  const db = getDb();
  const [row] = await db.select().from(subjects).where(eq(subjects.code, code)).limit(1);
  return row ?? null;
}

export async function isSubjectAvailableForUser(userId: string, subjectCode: string): Promise<boolean> {
  const available = await listSubjectsForUser(userId);
  return available.some((subject) => subject.code === subjectCode);
}

// Backwards-compatible alias used during migration
export async function listActiveSubjects(): Promise<SubjectDto[]> {
  const db = getDb();
  const rows = await db
    .select()
    .from(subjects)
    .where(eq(subjects.isActive, true))
    .orderBy(asc(subjects.sortOrder));

  return rows.map(toSubjectDto);
}
