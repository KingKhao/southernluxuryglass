import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionUsername } from "@/lib/session";

// REST counterpart to products/actions.ts's updateProduct Server Action, for
// admin tooling that can't drive a Server Action directly (e.g. scripted
// content/photo fixes). Same session-cookie admin guard as every other
// /api/admin/* route — no separate auth mechanism. Matches the product to
// edit by its CURRENT name or id, then applies only the fields provided.
export async function POST(req: NextRequest) {
  const username = await getSessionUsername();
  if (!username) {
    return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
  }

  let body: {
    id?: unknown;
    matchName?: unknown;
    name?: unknown;
    categoryName?: unknown;
    description?: unknown;
    images?: unknown;
  };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON." }, { status: 400 });
  }

  const id = typeof body.id === "string" ? body.id.trim() : "";
  const matchName = typeof body.matchName === "string" ? body.matchName.trim() : "";
  if (!id && !matchName) {
    return NextResponse.json({ error: "id or matchName is required to find the product." }, { status: 400 });
  }

  const data: { name?: string; categoryId?: string; description?: string; images?: string[] } = {};

  if (typeof body.name === "string" && body.name.trim() !== "") {
    data.name = body.name.trim();
  }
  if (typeof body.description === "string" && body.description.trim() !== "") {
    data.description = body.description.trim();
  }
  if (typeof body.categoryName === "string" && body.categoryName.trim() !== "") {
    const category = await prisma.category.findUnique({ where: { name: body.categoryName.trim() } });
    if (!category) {
      return NextResponse.json({ error: `No category named "${body.categoryName}".` }, { status: 400 });
    }
    data.categoryId = category.id;
  }
  if (Array.isArray(body.images)) {
    const images = body.images.filter((i): i is string => typeof i === "string" && i.trim() !== "");
    if (images.length > 0) data.images = images;
  }

  if (Object.keys(data).length === 0) {
    return NextResponse.json({ error: "No fields to update were provided." }, { status: 400 });
  }

  const result = id
    ? await prisma.product.updateMany({ where: { id }, data })
    : await prisma.product.updateMany({ where: { name: matchName }, data });

  return NextResponse.json({ updated: result.count });
}
