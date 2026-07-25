import { prisma } from "./prisma";
import type { ContactCategory } from "@prisma/client";

export type ContactSubmission = {
  name: string;
  email: string;
  phone: string;
  source: "inquiry" | "signup" | "contact-me" | "manual";
  summary: string; // product name, or e.g. "Early-access signup"
  detail?: string | null; // the message, if any
  categoryOnCreate?: ContactCategory; // default NEW
  upgradeNewToFollower?: boolean; // signups: promote an untouched NEW contact to FOLLOWER
};

// Single source of truth for adding a contact from any form. Auto-merges by
// email (case-insensitive, whitespace-trimmed): never creates a duplicate when
// the email already exists — instead updates the phone if it changed and appends
// a permanent history entry. Returns the contact id.
export async function recordContactSubmission(input: ContactSubmission): Promise<string> {
  const email = input.email.trim().toLowerCase();
  const name = input.name.trim();
  const phone = input.phone.trim();

  const existing = await prisma.contact.findFirst({
    where: { email: { equals: email, mode: "insensitive" } },
  });

  if (existing) {
    const data: { phone?: string; category?: ContactCategory } = {};
    if (phone && phone !== existing.phone) data.phone = phone;
    if (input.upgradeNewToFollower && existing.category === "NEW") {
      data.category = "FOLLOWER";
    }
    if (Object.keys(data).length > 0) {
      await prisma.contact.update({ where: { id: existing.id }, data });
    }
    await prisma.contactHistory.create({
      data: {
        contactId: existing.id,
        source: input.source,
        summary: input.summary,
        detail: input.detail ?? null,
      },
    });
    return existing.id;
  }

  const created = await prisma.contact.create({
    data: {
      name: name || "(no name)",
      email,
      phone,
      productOfInterest: input.summary,
      category: input.categoryOnCreate ?? "NEW",
      history: {
        create: {
          source: input.source,
          summary: input.summary,
          detail: input.detail ?? null,
        },
      },
    },
  });
  return created.id;
}
