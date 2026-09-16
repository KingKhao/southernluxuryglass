import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionUsername } from "@/lib/session";

// REST counterpart to the images field of the products/actions.ts Server
// Action, for admin tooling that can't drive a Server Action directly
// (e.g. scripted photo backfills). Same session-cookie admin guard as every
// other /api/admin/* route — no separate auth mechanism.
export async function POST(req: NextRequest) {
  const username = await getSessionUsername();
  if (!username) {
    return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
  }

  let body: { id?: unknown; name?: unknown; images?: unknown };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON." }, { status: 400 });
  }

  const id = typeof body.id === "string" ? body.id.trim() : "";
  const name = typeof body.name === "string" ? body.name.trim() : "";
  const images = Array.isArray(body.images)
    ? body.images.filter((i): i is string => typeof i === "string" && i.trim() !== "")
    : [];

  if ((!id && !name) || images.length === 0) {
    return NextResponse.json({ error: "id or name, plus a non-empty images array, are required." }, { status: 400 });
  }

  const result = id
    ? await prisma.product.updateMany({ where: { id }, data: { images } })
    : await prisma.product.updateMany({ where: { name }, data: { images } });

  return NextResponse.json({ updated: result.count });
}
