"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { eraseContact } from "@/lib/erase-contact";
import { prisma } from "@/lib/prisma";
import { getSessionUsername } from "@/lib/session";
import type { ContactCategory } from "@prisma/client";

async function requireAdmin() {
  if (!(await getSessionUsername())) {
    throw new Error("Not authenticated.");
  }
}

const CATEGORIES: ContactCategory[] = ["NEW", "FOLLOWER", "BUYER", "B2B"];

export async function createContact(formData: FormData) {
  await requireAdmin();
  const name = String(formData.get("name") ?? "").trim();
  const phone = String(formData.get("phone") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const productOfInterest = String(formData.get("productOfInterest") ?? "").trim() || null;

  if (!name) {
    throw new Error("A name is required.");
  }

  await prisma.contact.create({
    data: { name, phone, email, productOfInterest },
  });
  revalidatePath("/admin/contacts");
  redirect("/admin/contacts");
}

export async function updateContactCategory(id: string, formData: FormData) {
  await requireAdmin();
  const raw = String(formData.get("category") ?? "");
  const category = CATEGORIES.includes(raw as ContactCategory)
    ? (raw as ContactCategory)
    : "NEW";
  await prisma.contact.update({ where: { id }, data: { category } });
  revalidatePath(`/admin/contacts/${id}`);
  revalidatePath("/admin/contacts");
}

export async function addContactNote(id: string, formData: FormData) {
  await requireAdmin();
  const body = String(formData.get("body") ?? "").trim();
  if (!body) return;
  await prisma.contactNote.create({ data: { contactId: id, body } });
  revalidatePath(`/admin/contacts/${id}`);
}

export async function deleteContact(id: string) {
  await requireAdmin();
  await eraseContact(id);
  revalidatePath("/admin/contacts");
  redirect("/admin/contacts");
}
