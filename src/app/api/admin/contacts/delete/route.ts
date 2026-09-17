import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionUsername } from "@/lib/session";

// REST counterpart to contacts/actions.ts's deleteContact Server Action, for
// admin tooling that can't drive a Server Action directly. Same
// session-cookie admin guard as every other /api/admin/* route.
export async function POST(req: NextRequest) {
  const username = await getSessionUsername();
  if (!username) {
    return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
  }

  let body: { id?: unknown; email?: unknown };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON." }, { status: 400 });
  }

  const id = typeof body.id === "string" ? body.id.trim() : "";
  const email = typeof body.email === "string" ? body.email.trim() : "";
  if (!id && !email) {
    return NextResponse.json({ error: "id or email is required." }, { status: 400 });
  }

  const result = id
    ? await prisma.contact.deleteMany({ where: { id } })
    : await prisma.contact.deleteMany({ where: { email } });

  return NextResponse.json({ deleted: result.count });
}
