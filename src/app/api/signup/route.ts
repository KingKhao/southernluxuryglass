import { readFormBody, field, allowPublicForm, PublicFormError } from "@/lib/public-forms";
import { NextRequest, NextResponse } from "next/server";
import { recordContactSubmission } from "@/lib/contacts";
import { prisma } from "@/lib/prisma";

const MAX_PER_WINDOW = 10;
const WINDOW_MS = 10 * 60 * 1000; // 10 minutes

// Early-access email capture. No account is created — this only adds the person
// to Contacts (as a Follower) via the shared auto-merge logic.
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
    field(body, "name", 200); field(body, "email", 254); field(body, "phone", 40, false);
    field(body, "companyWebsite", 200, false);
    field(body, "smsConsentVersion", 60, false);
  } catch (error) { return NextResponse.json({ error: (error as Error).message }, { status: 400 }); }

  const name = (typeof body.name === "string" ? body.name.trim() : "");
  const email = (typeof body.email === "string" ? body.email.trim() : "").toLowerCase();
  const phone = (typeof body.phone === "string" ? body.phone.trim() : "");
  const smsConsent = body.smsConsent === true && phone.replace(/\D/g, "").length >= 7;
  const smsConsentVersion = typeof body.smsConsentVersion === "string" ? body.smsConsentVersion : null;

  const missing = [!name && "name", !email && "email"].filter(
    (f): f is string => Boolean(f)
  );
  if (missing.length > 0) {
    return NextResponse.json(
      { error: `Please add your ${missing.join(", ")}.` },
      { status: 400 }
    );
  }
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
    return NextResponse.json({ error: "Please enter a valid email address." }, { status: 400 });
  }

  // Spam guard: the same email OR phone may submit at most 10 times per 10
  // minutes — same policy as /api/inquiries, applied here too since both
  // write into the same Contacts table via recordContactSubmission.
  const since = new Date(Date.now() - WINDOW_MS);
  const recent = await prisma.contactHistory.count({
    where: {
      source: "signup",
      createdAt: { gte: since },
      // An omitted optional phone must not group every email-only visitor
      // into one shared "blank phone" quota.
      contact: { OR: [{ email }, ...(phone ? [{ phone }] : [])] },
    },
  });
  if (recent >= MAX_PER_WINDOW) {
    return NextResponse.json(
      { error: "You've signed up several times recently — please wait a few minutes before trying again." },
      { status: 429 }
    );
  }

  await recordContactSubmission({
    name,
    email,
    phone,
    source: "signup",
    summary: "Early-access signup",
    categoryOnCreate: "FOLLOWER",
    upgradeNewToFollower: true,
    smsConsent,
    smsConsentVersion,
  });

  return NextResponse.json({ ok: true });
}
