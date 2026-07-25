import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionUsername } from "@/lib/session";
import type { InquiryStatus } from "@prisma/client";

const STATUSES: InquiryStatus[] = ["NEW", "SERIOUS_BUYER"];

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
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
  if (!STATUSES.includes(status as InquiryStatus)) {
    return NextResponse.json({ error: "Invalid status." }, { status: 400 });
  }
  await prisma.inquiry.update({
    where: { id: params.id },
    data: { status: status as InquiryStatus },
  });
  return NextResponse.json({ ok: true });
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  if (!(await getSessionUsername())) {
    return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
  }
  await prisma.inquiry.delete({ where: { id: params.id } });
  return NextResponse.json({ ok: true });
}
