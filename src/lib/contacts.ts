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
  // TCPA SMS-marketing consent — only ever passed by the signup form's own
  // checkbox. Left undefined by every other caller (inquiries, manual admin
  // entries) so this function never touches consent fields on their behalf;
  // see the upsert below for why that distinction matters.
  smsConsent?: boolean;
  smsConsentVersion?: string | null;
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

  // Only the signup form ever sets this key at all (always to a real
  // true/false, never leaves it undefined) — inquiries and manual entries
  // omit it entirely. That's the signal used below: a caller that didn't
  // address SMS consent must never grant, and must never silently revoke,
  // whatever consent state already exists on the contact. Consent is only
  // ever *granted* here (set true + re-stamped); an unchecked box on some
  // later, unrelated submission is not treated as a revocation — a real
  // opt-out needs its own explicit action once outbound texting exists.
  const grantingSmsConsent = input.smsConsent === true;

  const contact = await prisma.contact.upsert({
    where: { email },
    create: {
      name: name || "(no name)",
      email,
      phone,
      productOfInterest: input.summary,
      category: input.categoryOnCreate ?? "NEW",
      ...(grantingSmsConsent
        ? { smsConsent: true, smsConsentVersion: input.smsConsentVersion ?? null, smsConsentAt: new Date() }
        : {}),
    },
    update: {
      ...(phone ? { phone } : {}),
      ...(grantingSmsConsent
        ? { smsConsent: true, smsConsentVersion: input.smsConsentVersion ?? null, smsConsentAt: new Date() }
        : {}),
    },
  });

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
