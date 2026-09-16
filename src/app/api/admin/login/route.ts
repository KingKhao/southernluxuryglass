import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import {
  createSessionToken,
  SESSION_COOKIE_NAME,
  SESSION_MAX_AGE_SECONDS,
} from "@/lib/session";

const MAX_FAILED_ATTEMPTS = 8;
const WINDOW_MS = 15 * 60 * 1000; // 15 minutes
const PRUNE_AGE_MS = 24 * 60 * 60 * 1000; // drop attempt rows older than this

function toHex(buffer: ArrayBuffer) {
  return Array.from(new Uint8Array(buffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

// Salted so the stored value can't be reversed to the requester's real IP,
// and so it can't be correlated with the same IP's hash elsewhere in the app.
async function hashIp(ip: string) {
  const secret = process.env.SESSION_SECRET;
  if (!secret) throw new Error("SESSION_SECRET is not set in the environment.");
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const signature = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(`login:${ip}`));
  return toHex(signature);
}

function getClientIp(request: NextRequest): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  return request.headers.get("x-real-ip") ?? "unknown";
}

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);
  const username = typeof body?.username === "string" ? body.username : "";
  const password = typeof body?.password === "string" ? body.password : "";

  if (!username || !password) {
    return NextResponse.json(
      { error: "Username and password are required." },
      { status: 400 }
    );
  }

  const ipHash = await hashIp(getClientIp(request));
  const since = new Date(Date.now() - WINDOW_MS);
  const recentFailures = await prisma.loginAttempt.count({
    where: { ipHash, createdAt: { gte: since } },
  });
  if (recentFailures >= MAX_FAILED_ATTEMPTS) {
    return NextResponse.json(
      { error: "Too many failed login attempts. Please wait a few minutes and try again." },
      { status: 429 }
    );
  }

  const admin = await prisma.admin.findUnique({ where: { username } });
  const isValid = admin ? await bcrypt.compare(password, admin.passwordHash) : false;

  if (!admin || !isValid) {
    // Best-effort: record this failure and prune stale rows so the table
    // doesn't grow unbounded. Never let a logging hiccup block the response.
    await Promise.allSettled([
      prisma.loginAttempt.create({ data: { ipHash } }),
      prisma.loginAttempt.deleteMany({ where: { createdAt: { lt: new Date(Date.now() - PRUNE_AGE_MS) } } }),
    ]);
    return NextResponse.json(
      { error: "Invalid username or password." },
      { status: 401 }
    );
  }

  const token = await createSessionToken(admin.username);
  const response = NextResponse.json({ ok: true });
  response.cookies.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_MAX_AGE_SECONDS,
  });
  return response;
}
