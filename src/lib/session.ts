import { cookies } from "next/headers";
import { prisma } from "./prisma";
import bcrypt from "bcryptjs";
import { mintSessionToken, readSessionClaims, fingerprint, SESSION_COOKIE_NAME, SESSION_MAX_AGE_SECONDS } from "./session-token";
export { SESSION_COOKIE_NAME, SESSION_MAX_AGE_SECONDS } from "./session-token";
const PREFIX = "admin-session:";
export async function createSessionToken(username: string) {
  const admin = await prisma.admin.findUnique({ where: { username } }); if (!admin) throw new Error("Admin not found.");
  const nonce = crypto.randomUUID().replace(/-/g, ""); const expires = Date.now() + SESSION_MAX_AGE_SECONDS * 1000;
  await prisma.setting.create({ data: { key: PREFIX + nonce, value: { username, expires, credential: await fingerprint(admin.passwordHash) } } });
  await prisma.setting.deleteMany({ where: { key: { startsWith: PREFIX }, updatedAt: { lt: new Date(Date.now() - SESSION_MAX_AGE_SECONDS * 1000) } } });
  return mintSessionToken(username, nonce, expires);
}
export async function authenticatedUsername(token: string | undefined | null): Promise<string | null> {
  const claims = await readSessionClaims(token); if (!claims) return null;
  const [record, admin] = await Promise.all([prisma.setting.findUnique({ where: { key: PREFIX + claims.nonce } }), prisma.admin.findUnique({ where: { username: claims.username } })]);
  if (!record || !admin) return null;
  const value = record.value as { username?: string; expires?: number; credential?: string };
  return value.username === claims.username && value.expires === claims.expires && value.credential === await fingerprint(admin.passwordHash) ? claims.username : null;
}
export async function getSessionUsername(): Promise<string | null> { return authenticatedUsername((await cookies()).get(SESSION_COOKIE_NAME)?.value); }
export async function revokeCurrentSession() { return revokeSession((await cookies()).get(SESSION_COOKIE_NAME)?.value); }
export async function revokeSession(token: string | undefined | null) {
  const claims = await readSessionClaims(token);
  if (claims) await prisma.setting.deleteMany({ where: { key: PREFIX + claims.nonce } });
}
export async function requireAdminApi(req: { headers: Headers }): Promise<string | null> {
  const match = (req.headers.get("cookie") || "").match(new RegExp(`(?:^|;\\s*)${SESSION_COOKIE_NAME}=([^;]+)`));
  try { return authenticatedUsername(match ? decodeURIComponent(match[1]) : null); } catch { return null; }
}
export async function verifyAdminPassword(username: string, password: string): Promise<boolean> {
  const admin = await prisma.admin.findUnique({ where: { username } }); return !!admin && bcrypt.compare(password, admin.passwordHash);
}
export async function changeAdminPassword(username: string, currentPassword: string, newPassword: string) {
  if (!(await verifyAdminPassword(username, currentPassword))) return false;
  await prisma.admin.update({ where: { username }, data: { passwordHash: await bcrypt.hash(newPassword, 10) } });
  // Credential fingerprint mismatch immediately invalidates every old session.
  return true;
}
