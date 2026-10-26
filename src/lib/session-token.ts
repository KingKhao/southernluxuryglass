export const SESSION_COOKIE_NAME = "admin_session";
export const SESSION_MAX_AGE_SECONDS = 60 * 60 * 12;
export type SessionClaims = { username: string; expires: number; nonce: string };
const encoder = new TextEncoder();
function secret() { const value = process.env.SESSION_SECRET; if (!value) throw new Error("SESSION_SECRET is not set."); return value; }
function hex(buffer: ArrayBuffer) { return Array.from(new Uint8Array(buffer), b => b.toString(16).padStart(2, "0")).join(""); }
async function sign(payload: string) { const key = await crypto.subtle.importKey("raw", encoder.encode(secret()), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]); return hex(await crypto.subtle.sign("HMAC", key, encoder.encode(payload))); }
export async function fingerprint(value: string) { return hex(await crypto.subtle.digest("SHA-256", encoder.encode(value))); }
export async function mintSessionToken(username: string, nonce: string, expires: number) {
  if (!/^[a-zA-Z0-9_-]{1,80}$/.test(username) || !/^[a-f0-9]{32}$/.test(nonce)) throw new Error("Invalid session identity.");
  const payload = `${username}.${expires}.${nonce}`; return `${payload}.${await sign(payload)}`;
}
export async function readSessionClaims(token: string | undefined | null): Promise<SessionClaims | null> {
  if (!token || token.length > 400) return null;
  const parts = token.split("."); if (parts.length !== 4) return null;
  const [username, expiry, nonce, signature] = parts; const expires = Number(expiry);
  if (!/^[a-zA-Z0-9_-]{1,80}$/.test(username) || !/^[a-f0-9]{32}$/.test(nonce) || !/^[a-f0-9]{64}$/.test(signature) || !Number.isFinite(expires) || expires <= Date.now()) return null;
  const expected = await sign(`${username}.${expiry}.${nonce}`);
  let mismatch = 0; for (let i = 0; i < expected.length; i++) mismatch |= expected.charCodeAt(i) ^ signature.charCodeAt(i);
  return mismatch ? null : { username, expires, nonce };
}
// Edge middleware checks only the signature; all protected data/page handlers must use session.ts.
export async function verifySessionToken(token: string | undefined | null): Promise<string | null> { return (await readSessionClaims(token))?.username ?? null; }
