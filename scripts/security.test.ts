import test from "node:test";
import assert from "node:assert/strict";
process.env.SESSION_SECRET = "synthetic-test-secret-not-a-live-credential";
Object.assign(process.env, { NODE_ENV: "test" });
let credential = "synthetic-bcrypt-fingerprint";
let adminExists = true;
const records = new Map<string, { key: string; value: unknown; updatedAt: Date }>();
const fake = {
  admin: { findUnique: async () => adminExists ? { username: "fixtureadmin", passwordHash: credential } : null },
  setting: {
    create: async ({ data }: { data: { key: string; value: unknown } }) => { records.set(data.key, { ...data, updatedAt: new Date() }); return data; },
    findUnique: async ({ where }: { where: { key: string } }) => records.get(where.key) ?? null,
    deleteMany: async ({ where }: { where: { key?: string | object } }) => { if (typeof where.key === "string") records.delete(where.key); return { count: 1 }; },
  },
};
// Only in this test process: no database, cookies, API keys or network connection.
(globalThis as unknown as { prisma: unknown }).prisma = fake;
test("admin sessions enforce tamper, expiry, logout and credential boundaries", async t => {
 const { createSessionToken, authenticatedUsername, revokeSession } = await import("../src/lib/session");
 const { verifySessionToken, mintSessionToken } = await import("../src/lib/session-token");
 await t.test("fresh session works and forged legacy/signature cookies fail", async () => {
  const token = await createSessionToken("fixtureadmin");
  assert.equal(await authenticatedUsername(token), "fixtureadmin");
  assert.equal(await verifySessionToken(token + "bad"), null);
  assert.equal(await authenticatedUsername("fixtureadmin.9999999999999.fake"), null);
 });
 await t.test("logout invalidates a copied cookie, not just browser cookie storage", async () => {
  const token = await createSessionToken("fixtureadmin"); await revokeSession(token);
  assert.equal(await authenticatedUsername(token), null);
 });
 await t.test("password changes invalidate old sessions", async () => {
  const token = await createSessionToken("fixtureadmin"); credential = "a-different-synthetic-hash";
  assert.equal(await authenticatedUsername(token), null);
 });
 await t.test("deleted admin and deleted session cannot access protected data", async () => {
  const token = await createSessionToken("fixtureadmin"); adminExists = false;
  assert.equal(await authenticatedUsername(token), null); adminExists = true;
  records.clear(); assert.equal(await authenticatedUsername(token), null);
 });
 await t.test("expired and non-finite expiry tokens fail closed", async () => {
  assert.equal(await verifySessionToken(await mintSessionToken("fixtureadmin", "a".repeat(32), Date.now()-1)), null);
  assert.equal(await verifySessionToken(await mintSessionToken("fixtureadmin", "a".repeat(32), Infinity)), null);
 });
});

test("public form parsing bounds bytes and rejects array/object field abuse", async () => {
 const { readFormBody, field, PublicFormError } = await import("../src/lib/public-forms");
 const { NextRequest } = await import("next/server");
 const req = (body: string) => new NextRequest("https://fixture.invalid/form", { method: "POST", body });
 await assert.rejects(readFormBody(req("a".repeat(8193))), (e: unknown) => e instanceof PublicFormError && e.status === 413);
 await assert.rejects(readFormBody(req("[]")), PublicFormError);
 assert.throws(() => field({ name: { unexpected: true } }, "name", 200), PublicFormError);
 assert.throws(() => field({ name: "x".repeat(201) }, "name", 200), PublicFormError);
 assert.equal(field({ phone: "" }, "phone", 40, false), "");
 assert.deepEqual(await readFormBody(req('{"name":"Synthetic"}')), { name: "Synthetic" });
});
test("subject erasure handles separate inquiry copies inside one transaction", async () => {
 const { eraseContact } = await import("../src/lib/erase-contact"); const calls: string[] = [];
 const tx = { contact: { findUnique: async () => ({ id: "fixture", email: "sample@example.invalid" }), delete: async () => { calls.push("contact/history/notes"); } }, inquiry: { deleteMany: async ({ where }: { where: unknown }) => { assert.deepEqual(where, { email: { equals: "sample@example.invalid", mode: "insensitive" } }); calls.push("inquiry"); } } };
 const db = { $transaction: async (fn: (arg: typeof tx) => Promise<number>) => { calls.push("transaction"); return fn(tx); } };
 assert.equal(await eraseContact("fixture", db as unknown as Parameters<typeof eraseContact>[1]), 1);
 assert.deepEqual(calls, ["transaction", "inquiry", "contact/history/notes"]);
});
