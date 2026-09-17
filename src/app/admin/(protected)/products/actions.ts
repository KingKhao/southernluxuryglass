"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getSessionUsername } from "@/lib/session";
import type { ProductStatus } from "@prisma/client";

const PRODUCT_STATUSES: ProductStatus[] = ["AVAILABLE", "RESERVED", "SOLD"];

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
  const rawCost = String(formData.get("cost") ?? "").trim();
  const cost = rawCost === "" ? null : Number(rawCost);
  const description = String(formData.get("description") ?? "").trim();
  const featured = formData.get("featured") === "on";
  const rawStatus = String(formData.get("status") ?? "AVAILABLE");
  const status: ProductStatus = PRODUCT_STATUSES.includes(rawStatus as ProductStatus)
    ? (rawStatus as ProductStatus)
    : "AVAILABLE";
  const dimensions = String(formData.get("dimensions") ?? "").trim() || null;
  const era = String(formData.get("era") ?? "").trim() || null;
  const condition = String(formData.get("condition") ?? "").trim() || null;
  const maker = String(formData.get("maker") ?? "").trim() || null;

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
  if (cost !== null && Number.isNaN(cost)) {
    throw new Error("Cost must be a number.");
  }
  if (images.length === 0) {
    throw new Error("Please add at least one product photo.");
  }

  return { name, categoryId, price, cost, description, images, featured, status, dimensions, era, condition, maker };
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
