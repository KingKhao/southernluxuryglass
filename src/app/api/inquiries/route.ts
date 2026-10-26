import { readFormBody, field, allowPublicForm, PublicFormError } from "@/lib/public-forms";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { recordContactSubmission } from "@/lib/contacts";

const MAX_PER_WINDOW = 10;
const WINDOW_MS = 10 * 60 * 1000; // 10 minutes

export async function POST(req: NextRequest) {
  let body: Record<string, unknown>;
  try {
    if (!(await allowPublicForm(req))) return NextResponse.json({ error: "Too many requests. Please try again later." }, { status: 429 });
    body = await readFormBody(req);
  } catch (error) {
    return NextResponse.json({ error: error instanceof PublicFormError ? error.message : "Unable to accept the request. Please try again later." }, { status: error instanceof PublicFormError ? error.status : 503 });
  }

  // Honeypot: a hidden field real visitors never see or fill. A bot that
  // fills every field on the form trips it; report success without writing
  // anything, so the bot has no signal to learn from.
  if (String(body.companyWebsite ?? "").trim() !== "") {
    return NextResponse.json({ ok: true });
  }


  try {
    field(body, "name", 200); field(body, "email", 254); field(body, "phone", 40, true);
    field(body, "companyWebsite", 200, false);
    field(body, "message", 2000); field(body, "productName", 240, false); field(body, "productId", 120, false);
  } catch (error) { return NextResponse.json({ error: (error as Error).message }, { status: 400 }); }

  const name = (typeof body.name === "string" ? body.name.trim() : "");
  const phone = (typeof body.phone === "string" ? body.phone.trim() : "");
  const email = (typeof body.email === "string" ? body.email.trim() : "").toLowerCase();
  const message = (typeof body.message === "string" ? body.message.trim() : "");
  const productName = (typeof body.productName === "string" ? body.productName.trim() : "") || "General inquiry";
  const productId = body.productId ? String(body.productId) : null;

  const missing = [
    !name && "name",
    !phone && "phone",
    !email && "email",
    !message && "message",
  ].filter((f): f is string => Boolean(f));
  if (missing.length > 0) {
    return NextResponse.json(
      { error: `Please fill in your ${missing.join(", ")}.` },
      { status: 400 }
    );
  }
  if (message.length > 2000) {
    return NextResponse.json(
      { error: "Message must be 2000 characters or fewer." },
      { status: 400 }
    );
  }
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
    return NextResponse.json({ error: "Please enter a valid email address." }, { status: 400 });
  }

  // Spam guard: the same email OR phone may submit at most 10 times per 10 minutes.
  const since = new Date(Date.now() - WINDOW_MS);
  const recent = await prisma.inquiry.count({
    where: { createdAt: { gte: since }, OR: [{ email }, { phone }] },
  });
  if (recent >= MAX_PER_WINDOW) {
    return NextResponse.json(
      { error: "You've sent several inquiries recently — please wait a few minutes before sending more." },
      { status: 429 }
    );
  }

  await prisma.inquiry.create({
    data: { productId, productName, name, phone, email, message },
  });

  // Auto-merge into Contacts by email and append a permanent history entry.
  await recordContactSubmission({
    name,
    email,
    phone,
    source: productId ? "inquiry" : "contact-me",
    summary: productName,
    detail: message,
  });

  return NextResponse.json({ ok: true });
}
