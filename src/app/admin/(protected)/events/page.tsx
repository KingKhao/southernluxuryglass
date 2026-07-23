import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { deleteEvent } from "./actions";

export const dynamic = "force-dynamic";

export default async function AdminEventsPage() {
  const events = await prisma.event.findMany({ orderBy: { date: "asc" } });

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-serif text-2xl text-emerald">Live Shows</h1>
        <Link
          href="/admin/events/new"
          className="rounded-full bg-emerald px-5 py-2 text-sm text-cream hover:bg-emerald-dark"
        >
          + Add Live Show
        </Link>
      </div>

      <div className="overflow-x-auto rounded-lg border border-emerald/15 bg-white/60">
        <table className="min-w-full text-left text-sm">
          <thead className="border-b border-emerald/15 text-charcoal/60">
            <tr>
              <th className="px-4 py-3">Title</th>
              <th className="px-4 py-3">Date &amp; Time</th>
              <th className="px-4 py-3">Platform</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {events.map((event) => (
              <tr key={event.id} className="border-b border-emerald/10 last:border-0">
                <td className="px-4 py-3 font-medium text-charcoal">{event.title}</td>
                <td className="px-4 py-3 text-charcoal/70">
                  {event.date.toLocaleString(undefined, {
                    dateStyle: "medium",
                    timeStyle: "short",
                  })}
                </td>
                <td className="px-4 py-3 text-charcoal/70">{event.platformName}</td>
                <td className="px-4 py-3">
                  <div className="flex justify-end gap-3">
                    <Link
                      href={`/admin/events/${event.id}`}
                      className="text-emerald hover:underline"
                    >
                      Edit
                    </Link>
                    <form action={deleteEvent.bind(null, event.id)}>
                      <button type="submit" className="text-red-700 hover:underline">
                        Delete
                      </button>
                    </form>
                  </div>
                </td>
              </tr>
            ))}
            {events.length === 0 && (
              <tr>
                <td colSpan={4} className="px-4 py-6 text-center text-charcoal/60">
                  No live shows scheduled yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
