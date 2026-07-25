import { NextRequest, NextResponse } from "next/server";
import { recordContactSubmission } from "@/lib/contacts";

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

  if (!name || !email || !phone) {
    return NextResponse.json(
      { error: "Please add your name, email, and phone." },
      { status: 400 }
    );
  }
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
    return NextResponse.json({ error: "Please enter a valid email address." }, { status: 400 });
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
