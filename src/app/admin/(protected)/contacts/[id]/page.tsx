import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import {
  addContactNote,
  deleteContact,
  updateContactCategory,
} from "../actions";

export const dynamic = "force-dynamic";

const CATEGORIES = ["NEW", "FOLLOWER", "BUYER", "B2B"] as const;

export default async function ContactDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const contact = await prisma.contact.findUnique({
    where: { id: params.id },
    include: {
      notes: { orderBy: { createdAt: "desc" } },
      history: { orderBy: { createdAt: "desc" } },
    },
  });

  if (!contact) notFound();

  const setCategory = updateContactCategory.bind(null, contact.id);
  const addNote = addContactNote.bind(null, contact.id);
  const remove = deleteContact.bind(null, contact.id);

  return (
    <div className="max-w-2xl">
      <Link href="/admin/contacts" className="text-sm text-emerald hover:underline">
        ← Back to contacts
      </Link>

      <h1 className="mt-3 font-serif text-2xl text-emerald">{contact.name}</h1>
      <div className="mt-2 space-y-1 text-sm text-charcoal/70">
        {contact.email && (
          <p>
            <a href={`mailto:${contact.email}`} className="text-emerald hover:underline">
              {contact.email}
            </a>
          </p>
        )}
        {contact.phone && (
          <p>
            <a href={`tel:${contact.phone}`} className="text-emerald hover:underline">
              {contact.phone}
            </a>
          </p>
        )}
        {contact.productOfInterest && <p>Interested in: {contact.productOfInterest}</p>}
        <p className="text-charcoal/40">Added {contact.createdAt.toLocaleString()}</p>
      </div>

      {/* Category */}
      <div className="mt-6 rounded-lg border border-emerald/15 bg-white/60 p-4">
        <p className="mb-2 text-sm font-medium text-charcoal/80">Category</p>
        <form action={setCategory} className="flex items-center gap-2">
          <select
            name="category"
            defaultValue={contact.category}
            className="rounded-md border border-emerald/30 bg-white px-3 py-2 text-sm"
          >
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
          <button
            type="submit"
            className="rounded-full bg-emerald px-4 py-2 text-sm text-cream hover:bg-emerald-dark"
          >
            Save
          </button>
        </form>
      </div>

      {/* Inquiry history — permanent record, never removed by deleting an inquiry */}
      <div className="mt-6 rounded-lg border border-emerald/15 bg-white/60 p-4">
        <p className="mb-3 text-sm font-medium text-charcoal/80">
          Inquiry history{" "}
          <span className="font-normal text-charcoal/40">
            (permanent — kept even if an inquiry is deleted)
          </span>
        </p>
        <ul className="space-y-3">
          {contact.history.length === 0 && (
            <li className="text-sm text-charcoal/50">No history yet.</li>
          )}
          {contact.history.map((h) => (
            <li key={h.id} className="rounded-md border border-emerald/10 bg-white/70 p-3">
              <div className="flex items-center justify-between gap-2">
                <p className="text-sm font-medium text-charcoal/80">{h.summary}</p>
                <span className="rounded-full bg-charcoal/5 px-2 py-0.5 text-[10px] uppercase tracking-wide text-charcoal/40">
                  {h.source}
                </span>
              </div>
              {h.detail && (
                <p className="mt-1 whitespace-pre-wrap text-sm text-charcoal/70">{h.detail}</p>
              )}
              <p className="mt-1 text-xs text-charcoal/40">{h.createdAt.toLocaleString()}</p>
            </li>
          ))}
        </ul>
      </div>

      {/* Notes */}
      <div className="mt-6 rounded-lg border border-emerald/15 bg-white/60 p-4">
        <p className="mb-3 text-sm font-medium text-charcoal/80">Notes</p>
        <form action={addNote} className="flex flex-col gap-2">
          <textarea
            name="body"
            required
            rows={3}
            placeholder="Add a note…"
            className="w-full rounded-md border border-emerald/30 bg-white px-3 py-2 text-sm focus:border-emerald focus:outline-none"
          />
          <button
            type="submit"
            className="self-start rounded-full bg-emerald px-4 py-2 text-sm text-cream hover:bg-emerald-dark"
          >
            Add Note
          </button>
        </form>

        <ul className="mt-4 space-y-3">
          {contact.notes.length === 0 && (
            <li className="text-sm text-charcoal/50">No notes yet.</li>
          )}
          {contact.notes.map((note) => (
            <li key={note.id} className="rounded-md border border-emerald/10 bg-white/70 p-3">
              <p className="whitespace-pre-wrap text-sm text-charcoal/80">{note.body}</p>
              <p className="mt-1 text-xs text-charcoal/40">
                {note.createdAt.toLocaleString()}
              </p>
            </li>
          ))}
        </ul>
      </div>

      {/* Delete */}
      <form action={remove} className="mt-6">
        <button
          type="submit"
          className="text-sm text-red-700 hover:underline"
        >
          Delete this contact
        </button>
      </form>
    </div>
  );
}
