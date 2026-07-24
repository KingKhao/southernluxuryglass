import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionUsername } from "@/lib/session";

const DEFAULT_PIN = "7777";

async function getDeletePin(): Promise<string> {
  const row = await prisma.setting.findUnique({ where: { key: "deletePin" } });
  const value = row?.value as { pin?: string } | null;
  return value?.pin ? String(value.pin) : DEFAULT_PIN;
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  if (!(await getSessionUsername())) {
    return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
  }

  let pin = "";
  try {
    const body = await req.json();
    pin = String(body.pin ?? "");
  } catch {
    // no body
  }

  const expected = await getDeletePin();
  if (pin !== expected) {
    return NextResponse.json({ error: "Incorrect PIN." }, { status: 403 });
  }

  await prisma.inquiry.delete({ where: { id: params.id } });
  return NextResponse.json({ ok: true });
}
