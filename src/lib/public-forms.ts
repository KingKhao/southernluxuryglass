import { NextRequest } from "next/server";
import { prisma } from "./prisma";
import { fingerprint } from "./session-token";
export class PublicFormError extends Error { constructor(message: string, public status = 400) { super(message); } }
export const MAX_BODY_BYTES = 8192;
export async function readFormBody(req: NextRequest): Promise<Record<string, unknown>> {
  const reader = req.body?.getReader(); if (!reader) throw new PublicFormError("Invalid request.");
  const chunks: Uint8Array[] = []; let total = 0;
  try { while (true) { const { value, done } = await reader.read(); if (done) break; total += value.byteLength; if (total > MAX_BODY_BYTES) { await reader.cancel(); throw new PublicFormError("Request is too large.", 413); } chunks.push(value); } } finally { reader.releaseLock(); }
  const bytes = new Uint8Array(total); let offset=0; for (const chunk of chunks) { bytes.set(chunk,offset); offset+=chunk.length; }
  let value: unknown; try { value = JSON.parse(new TextDecoder().decode(bytes)); } catch { throw new PublicFormError("Invalid request."); }
  if (!value || typeof value !== "object" || Array.isArray(value)) throw new PublicFormError("Invalid request.");
  return value as Record<string, unknown>;
}
export function field(body: Record<string, unknown>, key: string, max: number, required = true) {
  const raw = body[key]; if (raw !== undefined && typeof raw !== "string") throw new PublicFormError(`Invalid ${key}.`);
  const value = (typeof raw === "string" ? raw : "").trim();
  if ((required && !value) || value.length > max) throw new PublicFormError(`Please check your ${key}.`);
  return value;
}
export async function allowPublicForm(req: NextRequest): Promise<boolean> {
  // Only trust proxy headers behind Vercel; local/unrecognized hosts share a conservative bucket.
  const ip = process.env.VERCEL === "1" ? (req.headers.get("x-vercel-forwarded-for") || req.headers.get("x-forwarded-for") || "unknown").split(",")[0].trim() : "local";
  const key = "public-form:" + await fingerprint(`${process.env.SESSION_SECRET || "local"}:${ip}`);
  const since = new Date(Date.now() - 10 * 60 * 1000);
  for (let attempt = 0; attempt < 3; attempt++) {
    try { return await prisma.$transaction(async tx => {
      const [personal, global] = await Promise.all([tx.loginAttempt.count({ where: { ipHash: key, createdAt: { gte: since } } }),tx.loginAttempt.count({ where: { ipHash: "public-form:global", createdAt: { gte: since } } })]);
      if (personal >= 20 || global >= 500) return false;
      await tx.loginAttempt.createMany({ data: [{ ipHash: key }, { ipHash: "public-form:global" }] });
      await tx.loginAttempt.deleteMany({ where: { ipHash: { startsWith: "public-form:" }, createdAt: { lt: new Date(Date.now() - 86400000) } } });
      return true;
    }, { isolationLevel: "Serializable" }); } catch (error) { if ((error as { code?: string }).code !== "P2034" || attempt === 2) throw error; }
  }
  return false;
}
