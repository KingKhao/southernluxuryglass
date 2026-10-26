import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionUsername } from "@/lib/session";
import type { InquiryStatus } from "@prisma/client";

// An inquiry can only move TO Working Lead or Serious Buyer — never back to New.
const ALLOWED_TARGETS: InquiryStatus[] = ["WORKING_LEAD", "SERIOUS_BUYER"];

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!(await getSessionUsername())) {
    return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
  }
  let status = "";
  try {
    const body = await req.json();
    status = String(body.status ?? "");
  } catch {
    // no body
  }
  if (!ALLOWED_TARGETS.includes(status as InquiryStatus)) {
    return NextResponse.json(
      { error: "An inquiry can only move to Working Lead or Serious Buyer." },
      { status: 400 }
    );
  }
  await prisma.inquiry.update({
    where: { id: (await params).id },
    data: { status: status as InquiryStatus },
  });
  return NextResponse.json({ ok: true });
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!(await getSessionUsername())) {
    return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
  }
  await prisma.inquiry.delete({ where: { id: (await params).id } });
  return NextResponse.json({ ok: true });
}
