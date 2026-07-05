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

async function seed() {
  const db = getDb();

  await seedSubjects();

  const studentUsername = process.env.SEED_STUDENT_USERNAME ?? 'estudiante';
  const studentPassword = process.env.SEED_STUDENT_PASSWORD ?? '1234';
  const studentDisplayName = process.env.SEED_STUDENT_DISPLAY_NAME ?? 'María';
  const parentPassword = process.env.SEED_PARENT_PASSWORD ?? 'parent123';

  const [existing] = await db
    .select()
    .from(users)
    .where(eq(users.username, studentUsername))
    .limit(1);

  if (existing) {
    console.log(`User "${studentUsername}" already exists — skipping user seed.`);
    await closeDb();
    return;
  }

  const [user] = await db
    .insert(users)
    .values({
      username: studentUsername,
      passwordHash: await hashPassword(studentPassword),
      displayName: studentDisplayName,
    })
    .returning();

  if (!user) {
    throw new Error('Failed to create seed user');
  }

  await db.insert(parents).values({
    userId: user.id,
    passwordHash: await hashPassword(parentPassword),
  });

  console.log('Seed complete:');
  console.log(`  Student username: ${studentUsername}`);
  console.log(`  Student password: ${studentPassword}`);
  console.log(`  Parent password:  ${parentPassword}`);

  await closeDb();
}

seed().catch((error: unknown) => {
  console.error('Seed failed:', error);
  process.exit(1);
});
