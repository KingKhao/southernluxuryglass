import { cookies } from "next/headers";

const COOKIE_NAME = "admin_session";
const SESSION_LENGTH_MS = 1000 * 60 * 60 * 12; // 12 hours

function getSecret() {
  const secret = process.env.SESSION_SECRET;
  if (!secret) {
    throw new Error("SESSION_SECRET is not set in the environment.");
  }
  return secret;
}

function toHex(buffer: ArrayBuffer) {
  return Array.from(new Uint8Array(buffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

async function sign(payload: string) {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(getSecret()),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const signature = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(payload));
  return toHex(signature);
}

export async function createSessionToken(username: string) {
  const expires = Date.now() + SESSION_LENGTH_MS;
  const payload = `${username}.${expires}`;
  const signature = await sign(payload);
  return `${payload}.${signature}`;
}

function timingSafeEqual(a: string, b: string) {
  if (a.length !== b.length) return false;
  let mismatch = 0;
  for (let i = 0; i < a.length; i++) {
    mismatch |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return mismatch === 0;
}

export async function verifySessionToken(token: string | undefined | null): Promise<string | null> {
  if (!token) return null;
  const parts = token.split(".");
  if (parts.length !== 3) return null;
  const [username, expiresStr, signature] = parts;
  const payload = `${username}.${expiresStr}`;
  const expected = await sign(payload);

  if (!timingSafeEqual(signature, expected)) return null;

  const expires = Number(expiresStr);
  if (Number.isNaN(expires) || Date.now() > expires) return null;

  return username;
}

export async function getSessionUsername(): Promise<string | null> {
  const token = cookies().get(COOKIE_NAME)?.value;
  return verifySessionToken(token);
}

export const SESSION_COOKIE_NAME = COOKIE_NAME;
export const SESSION_MAX_AGE_SECONDS = SESSION_LENGTH_MS / 1000;
