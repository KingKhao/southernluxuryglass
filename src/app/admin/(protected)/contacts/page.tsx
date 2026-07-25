import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { createContact } from "./actions";

export const dynamic = "force-dynamic";

const CATEGORY_STYLES: Record<string, string> = {
  NEW: "bg-emerald/10 text-emerald",
  FOLLOWER: "bg-gold/20 text-gold-dark",
  BUYER: "bg-emerald text-cream",
  B2B: "bg-charcoal/80 text-cream",
};

const fieldClass =
  "w-full rounded-md border border-emerald/30 bg-white/70 px-3 py-2 text-sm focus:border-emerald focus:outline-none";

export default async function AdminContactsPage() {
  const contacts = await prisma.contact.findMany({
    orderBy: { createdAt: "desc" },
    include: { _count: { select: { notes: true } } },
  });

  return (
    <div>
      <h1 className="mb-2 font-serif text-2xl text-emerald">Contacts</h1>
      <p className="mb-6 text-sm text-charcoal/60">
        Everyone who has reached out, plus anyone you add by hand. Inquiries create a
        contact automatically.
      </p>

      <details className="mb-6 rounded-lg border border-emerald/15 bg-white/60 p-4">
        <summary className="cursor-pointer text-sm font-medium text-emerald">
          + Add a contact manually
        </summary>
        <form action={createContact} className="mt-4 grid gap-3 sm:grid-cols-2">
          <input name="name" required placeholder="Name" className={fieldClass} />
          <input name="email" type="email" placeholder="Email" className={fieldClass} />
          <input name="phone" placeholder="Phone" className={fieldClass} />
          <input name="productOfInterest" placeholder="Product / interest (optional)" className={fieldClass} />
          <div className="sm:col-span-2">
            <button
              type="submit"
              className="rounded-full bg-emerald px-5 py-2 text-sm text-cream hover:bg-emerald-dark"
            >
              Add Contact
            </button>
          </div>
        </form>
      </details>

      <div className="overflow-x-auto rounded-lg border border-emerald/15 bg-white/60">
        <table className="min-w-full text-left text-sm">
          <thead className="border-b border-emerald/15 text-charcoal/60">
            <tr>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Category</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Phone</th>
              <th className="px-4 py-3">Interested in</th>
              <th className="px-4 py-3">Added</th>
            </tr>
          </thead>
          <tbody>
            {contacts.map((c) => (
              <tr key={c.id} className="border-b border-emerald/10 last:border-0 hover:bg-emerald/5">
                <td className="px-4 py-3 font-medium text-charcoal">
                  <Link href={`/admin/contacts/${c.id}`} className="hover:text-emerald hover:underline">
                    {c.name}
                    {c._count.notes > 0 && (
                      <span className="ml-2 text-xs text-charcoal/40">({c._count.notes} notes)</span>
                    )}
                  </Link>
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                      CATEGORY_STYLES[c.category] ?? "bg-charcoal/10 text-charcoal"
                    }`}
                  >
                    {c.category}
                  </span>
                </td>
                <td className="px-4 py-3 text-charcoal/70">{c.email || "—"}</td>
                <td className="px-4 py-3 text-charcoal/70">{c.phone || "—"}</td>
                <td className="px-4 py-3 text-charcoal/70">{c.productOfInterest ?? "—"}</td>
                <td className="px-4 py-3 text-charcoal/40">
                  {c.createdAt.toLocaleDateString()}
                </td>
              </tr>
            ))}
            {contacts.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-6 text-center text-charcoal/60">
                  No contacts yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
