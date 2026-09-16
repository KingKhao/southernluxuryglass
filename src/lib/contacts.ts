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
// email (whitespace-trimmed, always stored lowercase): never creates a
// duplicate when the email already exists — instead updates the phone if it
// changed and appends a permanent history entry. Returns the contact id.
//
// The create-vs-update decision is done as a single upsert keyed on the
// unique `email` column, so it's atomic at the database level — two
// concurrent submissions for the same address can't both slip past a
// check-then-act read and both end up creating a row (they used to, since
// this was previously a findFirst followed by a separate create/update).
export async function recordContactSubmission(input: ContactSubmission): Promise<string> {
  const email = input.email.trim().toLowerCase();
  const name = input.name.trim();
  const phone = input.phone.trim();

  const contact = await prisma.contact.upsert({
    where: { email },
    create: {
      name: name || "(no name)",
      email,
      phone,
      productOfInterest: input.summary,
      category: input.categoryOnCreate ?? "NEW",
    },
    update: phone ? { phone } : {},
  });

  // A NEW contact gets promoted to FOLLOWER on repeat contact, but must
  // never downgrade an existing BUYER/B2B/FOLLOWER back to FOLLOWER — so
  // this is its own conditional update (`WHERE category = 'NEW'`), which
  // Postgres executes atomically. If two of these race for the same
  // contact, only the first has any effect; the second's WHERE matches
  // zero rows once the first has already flipped the category.
  if (input.upgradeNewToFollower) {
    await prisma.contact.updateMany({
      where: { id: contact.id, category: "NEW" },
      data: { category: "FOLLOWER" },
    });
  }

  await prisma.contactHistory.create({
    data: {
      contactId: contact.id,
      source: input.source,
      summary: input.summary,
      detail: input.detail ?? null,
    },
  });
  return contact.id;
}
