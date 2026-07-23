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
  const categoryId = String(formData.get("categoryId") ?? "").trim();
  const price = Number(formData.get("price"));
  const description = String(formData.get("description") ?? "").trim();
  const featured = formData.get("featured") === "on";

  let images: string[] = [];
  const rawImages = formData.get("images");
  if (typeof rawImages === "string" && rawImages.trim() !== "") {
    try {
      const parsed = JSON.parse(rawImages);
      if (Array.isArray(parsed)) {
        images = parsed.filter((i): i is string => typeof i === "string" && i.trim() !== "");
      }
    } catch {
      images = [];
    }
  }

  if (!name || !categoryId || !description || Number.isNaN(price)) {
    throw new Error("Name, category, description and a numeric price are required.");
  }
  if (images.length === 0) {
    throw new Error("Please add at least one product photo.");
  }

  return { name, categoryId, price, description, images, featured };
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
