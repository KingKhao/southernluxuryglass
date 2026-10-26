import { redirect } from "next/navigation";
import { getSessionUsername } from "@/lib/session";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { createContact } from "./actions";
import type { ContactCategory, Prisma } from "@prisma/client";

export const dynamic = "force-dynamic";

const CATEGORY_STYLES: Record<string, string> = {
  NEW: "bg-emerald/10 text-emerald",
  FOLLOWER: "bg-gold/20 text-gold-dark",
  BUYER: "bg-emerald text-cream",
  B2B: "bg-charcoal/80 text-cream",
};

const TABS = [
  { key: "all", label: "All" },
  { key: "NEW", label: "New" },
  { key: "FOLLOWER", label: "Follower" },
  { key: "BUYER", label: "Buyer" },
  { key: "B2B", label: "B2B" },
] as const;

const fieldClass =
  "w-full rounded-md border border-emerald/30 bg-white/70 px-3 py-2 text-sm focus:border-emerald focus:outline-none";

const VALID_CATEGORIES = ["NEW", "FOLLOWER", "BUYER", "B2B"];

export default async function AdminContactsPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  if (!(await getSessionUsername())) redirect("/admin/login");
  const query = await searchParams;
  const category =
    query.category && VALID_CATEGORIES.includes(query.category)
      ? (query.category as ContactCategory)
      : "all";

  const where: Prisma.ContactWhereInput = category === "all" ? {} : { category };

  const rows = await prisma.contact.findMany({
    where,
    include: { _count: { select: { notes: true } } },
  });
  // Always alphabetical by name (case-insensitive), in every view/category.
  const contacts = rows.sort((a, b) =>
    a.name.localeCompare(b.name, undefined, { sensitivity: "base" })
  );

  return (
    <div>
      <div className="mb-2 flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-serif text-2xl text-emerald">Contacts</h1>
        <a
          href="/api/admin/contacts/export"
          className="rounded-full border border-emerald px-4 py-2 text-sm text-emerald hover:bg-emerald hover:text-cream"
        >
          Export Contacts to CSV
        </a>
      </div>
      <p className="mb-4 text-sm text-charcoal/60">
        Everyone who has reached out, plus anyone you add by hand. Sorted A–Z.
      </p>

      <div className="mb-6 flex flex-wrap gap-2">
        {TABS.map((tab) => {
          const active = category === tab.key || (tab.key === "all" && category === "all");
          return (
            <Link
              key={tab.key}
              href={tab.key === "all" ? "/admin/contacts" : `/admin/contacts?category=${tab.key}`}
              className={[
                "rounded-full border px-4 py-1.5 text-sm transition-colors",
                active
                  ? "border-emerald bg-emerald text-cream"
                  : "border-emerald/30 text-emerald hover:bg-emerald/10",
              ].join(" ")}
            >
              {tab.label}
            </Link>
          );
        })}
      </div>

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
              <th className="px-4 py-3">SMS OK?</th>
              <th className="px-4 py-3">Interested in</th>
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
                <td className="px-4 py-3">
                  {c.smsConsent ? (
                    <span className="rounded-full bg-emerald/10 px-2.5 py-0.5 text-xs font-medium text-emerald">
                      Yes
                    </span>
                  ) : (
                    <span className="text-xs text-charcoal/40">No</span>
                  )}
                </td>
                <td className="px-4 py-3 text-charcoal/70">{c.productOfInterest ?? "—"}</td>
              </tr>
            ))}
            {contacts.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-6 text-center text-charcoal/60">
                  No contacts in this view.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
