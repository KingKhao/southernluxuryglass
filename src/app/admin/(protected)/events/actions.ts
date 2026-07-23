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

function readEventFields(formData: FormData) {
  const title = String(formData.get("title") ?? "").trim();
  const dateValue = String(formData.get("date") ?? "");
  const platformName = String(formData.get("platformName") ?? "").trim();
  const platformLink = String(formData.get("platformLink") ?? "").trim();

  const date = new Date(dateValue);

  if (!title || !platformName || !platformLink || Number.isNaN(date.getTime())) {
    throw new Error("All event fields are required and date/time must be valid.");
  }

  return { title, date, platformName, platformLink };
}

export async function createEvent(formData: FormData) {
  await requireAdmin();
  const data = readEventFields(formData);
  await prisma.event.create({ data });
  revalidatePath("/admin/events");
  revalidatePath("/");
  redirect("/admin/events");
}

export async function updateEvent(id: string, formData: FormData) {
  await requireAdmin();
  const data = readEventFields(formData);
  await prisma.event.update({ where: { id }, data });
  revalidatePath("/admin/events");
  revalidatePath("/");
  redirect("/admin/events");
}

export async function deleteEvent(id: string) {
  await requireAdmin();
  await prisma.event.delete({ where: { id } });
  revalidatePath("/admin/events");
  revalidatePath("/");
}
