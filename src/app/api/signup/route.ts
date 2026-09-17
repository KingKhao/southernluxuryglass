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
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const name = String(body.name ?? "").trim();
  const email = String(body.email ?? "").trim();
  const phone = String(body.phone ?? "").trim();

  const missing = [!name && "name", !email && "email", !phone && "phone"].filter(
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
      contact: { OR: [{ email }, { phone }] },
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
  });

  return NextResponse.json({ ok: true });
}
