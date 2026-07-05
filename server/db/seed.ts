import { config } from 'dotenv';
import { eq } from 'drizzle-orm';
import { closeDb, getDb } from './index.js';
import { parents, subjects, users } from './schema.js';
import { hashPassword } from '../services/authService.js';

config();

const SUBJECT_SEEDS = [
  { code: 'math', name: 'Matemáticas', icon: 'math', sortOrder: 1 },
  { code: 'language', name: 'Lengua', icon: 'language', sortOrder: 2 },
  { code: 'english', name: 'Inglés', icon: 'english', sortOrder: 3 },
  { code: 'valencian', name: 'Valenciano', icon: 'valencian', sortOrder: 4 },
  { code: 'medi', name: 'Medi', icon: 'medi', sortOrder: 5 },
] as const;

async function seedSubjects() {
  const db = getDb();

  for (const subject of SUBJECT_SEEDS) {
    const [existing] = await db
      .select()
      .from(subjects)
      .where(eq(subjects.code, subject.code))
      .limit(1);

    if (!existing) {
      await db.insert(subjects).values({
        code: subject.code,
        name: subject.name,
        icon: subject.icon,
        sortOrder: subject.sortOrder,
        isActive: subject.code === 'math',
      });
    }
  }
}

async function ensureUser(
  username: string,
  password: string,
  displayName: string,
  withParent?: string,
) {
  const db = getDb();

  const [existing] = await db.select().from(users).where(eq(users.username, username)).limit(1);

  if (existing) {
    console.log(`User "${username}" already exists — skipping.`);
    return;
  }

  const [user] = await db
    .insert(users)
    .values({
      username,
      passwordHash: await hashPassword(password),
      displayName,
    })
    .returning();

  if (!user) {
    throw new Error(`Failed to create user "${username}"`);
  }

  if (withParent) {
    await db.insert(parents).values({
      userId: user.id,
      passwordHash: await hashPassword(withParent),
    });
  }

  console.log(`Created user "${username}" (${displayName})`);
}

async function seed() {
  await seedSubjects();

  const studentUsername = process.env.SEED_STUDENT_USERNAME ?? 'estudiante';
  const studentPassword = process.env.SEED_STUDENT_PASSWORD ?? '1234';
  const studentDisplayName = process.env.SEED_STUDENT_DISPLAY_NAME ?? 'María';
  const parentPassword = process.env.SEED_PARENT_PASSWORD ?? 'parent123';
  const adminUsername = process.env.SEED_ADMIN_USERNAME ?? 'admin';
  const adminPassword = process.env.SEED_ADMIN_PASSWORD ?? 'admin';

  await ensureUser(studentUsername, studentPassword, studentDisplayName, parentPassword);
  await ensureUser(adminUsername, adminPassword, 'Administrador');

  console.log('Seed complete.');
  await closeDb();
}

seed().catch((error: unknown) => {
  console.error('Seed failed:', error);
  process.exit(1);
});
