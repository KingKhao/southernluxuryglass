import { prisma } from "./prisma";
// Explicit subject-erasure path: remove the separate Inquiry copies, then the Contact's
// cascading history/notes. This is not the ordinary "delete one inquiry" action.
export async function eraseContact(id: string, db = prisma): Promise<number> {
  return db.$transaction(async tx => {
    const contact = await tx.contact.findUnique({ where: { id }, select: { id: true, email: true } });
    if (!contact) return 0;
    await tx.inquiry.deleteMany({ where: { email: { equals: contact.email, mode: "insensitive" } } });
    await tx.contact.delete({ where: { id } });
    return 1;
  });
}
