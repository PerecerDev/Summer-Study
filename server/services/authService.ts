import { eq, lt } from 'drizzle-orm';
import { getDb } from '../db';
import { parentTokens, parents, sessions, users } from '../db/schema';
import {
  generateToken,
  hashPassword,
  hashToken,
  verifyPassword,
} from '../lib/crypto';
import { ApiError, PARENT_TOKEN_TTL_MS, SESSION_TTL_MS } from '../lib/errors';

export interface UserDto {
  id: string;
  username: string;
  displayName: string;
  avatarUrl?: string;
  gradeLevel: string;
  locale: string;
}

function toUserDto(user: typeof users.$inferSelect): UserDto {
  return {
    id: user.id,
    username: user.username,
    displayName: user.displayName,
    avatarUrl: user.avatarUrl ?? undefined,
    gradeLevel: user.gradeLevel,
    locale: user.locale,
  };
}

export async function login(
  username: string,
  password: string,
  userAgent?: string,
): Promise<{ user: UserDto; sessionToken: string }> {
  const db = getDb();

  const [user] = await db.select().from(users).where(eq(users.username, username)).limit(1);

  if (!user) {
    throw new ApiError('UNAUTHORIZED', 401, 'Usuario o contraseña incorrectos');
  }

  const valid = await verifyPassword(password, user.passwordHash);

  if (!valid) {
    throw new ApiError('UNAUTHORIZED', 401, 'Usuario o contraseña incorrectos');
  }

  const sessionToken = generateToken();
  const tokenHash = hashToken(sessionToken);
  const expiresAt = new Date(Date.now() + SESSION_TTL_MS);

  await db.insert(sessions).values({
    userId: user.id,
    tokenHash,
    expiresAt,
    userAgent,
  });

  return { user: toUserDto(user), sessionToken };
}

export async function logout(sessionToken: string | undefined): Promise<void> {
  if (!sessionToken) return;

  const db = getDb();
  const tokenHash = hashToken(sessionToken);

  await db.delete(sessions).where(eq(sessions.tokenHash, tokenHash));
}

export async function getSessionUser(sessionToken: string | undefined): Promise<UserDto | null> {
  if (!sessionToken) return null;

  const db = getDb();
  const tokenHash = hashToken(sessionToken);
  const now = new Date();

  const [session] = await db
    .select()
    .from(sessions)
    .where(eq(sessions.tokenHash, tokenHash))
    .limit(1);

  if (!session || session.expiresAt < now) {
    if (session) {
      await db.delete(sessions).where(eq(sessions.id, session.id));
    }
    return null;
  }

  const [user] = await db.select().from(users).where(eq(users.id, session.userId)).limit(1);

  if (!user) return null;

  await db
    .update(sessions)
    .set({ lastActiveAt: now })
    .where(eq(sessions.id, session.id));

  return toUserDto(user);
}

export async function verifyParentPassword(
  userId: string,
  password: string,
): Promise<{ parentToken: string; expiresAt: string }> {
  const db = getDb();

  const [parent] = await db.select().from(parents).where(eq(parents.userId, userId)).limit(1);

  if (!parent) {
    throw new ApiError('FORBIDDEN', 403, 'No tienes permiso');
  }

  const valid = await verifyPassword(password, parent.passwordHash);

  if (!valid) {
    throw new ApiError('UNAUTHORIZED', 401, 'Contraseña incorrecta');
  }

  const parentToken = generateToken();
  const tokenHash = hashToken(parentToken);
  const expiresAt = new Date(Date.now() + PARENT_TOKEN_TTL_MS);

  await db.insert(parentTokens).values({
    userId,
    tokenHash,
    expiresAt,
  });

  return { parentToken, expiresAt: expiresAt.toISOString() };
}

export async function validateParentToken(
  userId: string,
  parentToken: string | undefined,
): Promise<boolean> {
  if (!parentToken) return false;

  const db = getDb();
  const tokenHash = hashToken(parentToken);
  const now = new Date();

  const [token] = await db
    .select()
    .from(parentTokens)
    .where(eq(parentTokens.tokenHash, tokenHash))
    .limit(1);

  if (!token || token.userId !== userId || token.expiresAt < now) {
    return false;
  }

  return true;
}

export async function cleanupExpiredSessions(): Promise<void> {
  const db = getDb();
  const now = new Date();

  await db.delete(sessions).where(lt(sessions.expiresAt, now));
  await db.delete(parentTokens).where(lt(parentTokens.expiresAt, now));
}

export { hashPassword, toUserDto };
