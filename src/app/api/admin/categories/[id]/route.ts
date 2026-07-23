import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionUsername } from "@/lib/session";

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  if (!(await getSessionUsername())) {
    return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
  }
  const { id } = params;
  const body = await req.json();

  const data: { name?: string; sortOrder?: number } = {};
  if (body.name != null) {
    const name = String(body.name).trim();
    if (!name) {
      return NextResponse.json({ error: "Category name cannot be empty." }, { status: 400 });
    }
    const clash = await prisma.category.findFirst({ where: { name, NOT: { id } } });
    if (clash) {
      return NextResponse.json({ error: "Another category already has that name." }, { status: 400 });
    }
    data.name = name;
  }
  if (body.sortOrder != null) data.sortOrder = Number(body.sortOrder);

  const category = await prisma.category.update({ where: { id }, data });
  return NextResponse.json(category);
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  if (!(await getSessionUsername())) {
    return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
  }
  const { id } = params;

  const productCount = await prisma.product.count({ where: { categoryId: id } });
  if (productCount > 0) {
    return NextResponse.json(
      { error: `Move or delete its ${productCount} product(s) before deleting this category.` },
      { status: 400 }
    );
  }

  await prisma.category.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
