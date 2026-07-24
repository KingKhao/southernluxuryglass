import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const MAX_PER_WINDOW = 10;
const WINDOW_MS = 10 * 60 * 1000; // 10 minutes

export async function POST(req: NextRequest) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const name = String(body.name ?? "").trim();
  const phone = String(body.phone ?? "").trim();
  const email = String(body.email ?? "").trim();
  const message = String(body.message ?? "").trim();
  const productName = String(body.productName ?? "").trim() || "General inquiry";
  const productId = body.productId ? String(body.productId) : null;

  if (!name || !phone || !email || !message) {
    return NextResponse.json(
      { error: "Please fill in your name, phone, email, and a message." },
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

  return NextResponse.json({ ok: true });
}
