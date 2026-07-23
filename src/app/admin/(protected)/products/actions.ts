"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getSessionUsername } from "@/lib/session";

async function requireAdmin() {
  const username = await getSessionUsername();
  if (!username) {
    throw new Error("Not authenticated.");
  }
}

function readProductFields(formData: FormData) {
  const name = String(formData.get("name") ?? "").trim();
  const category = String(formData.get("category") ?? "").trim();
  const price = Number(formData.get("price"));
  const description = String(formData.get("description") ?? "").trim();
  const imageUrl = String(formData.get("imageUrl") ?? "").trim();
  const featured = formData.get("featured") === "on";

  if (!name || !category || !description || !imageUrl || Number.isNaN(price)) {
    throw new Error("All product fields are required and price must be a number.");
  }

  return { name, category, price, description, imageUrl, featured };
}

export async function createProduct(formData: FormData) {
  await requireAdmin();
  const data = readProductFields(formData);
  await prisma.product.create({ data });
  revalidatePath("/admin/products");
  revalidatePath("/gallery");
  revalidatePath("/");
  redirect("/admin/products");
}

export async function updateProduct(id: string, formData: FormData) {
  await requireAdmin();
  const data = readProductFields(formData);
  await prisma.product.update({ where: { id }, data });
  revalidatePath("/admin/products");
  revalidatePath("/gallery");
  revalidatePath("/");
  redirect("/admin/products");
}

export async function deleteProduct(id: string) {
  await requireAdmin();
  await prisma.product.delete({ where: { id } });
  revalidatePath("/admin/products");
  revalidatePath("/gallery");
  revalidatePath("/");
}

export async function toggleFeatured(id: string, featured: boolean) {
  await requireAdmin();
  await prisma.product.update({ where: { id }, data: { featured } });
  revalidatePath("/admin/products");
  revalidatePath("/");
}
