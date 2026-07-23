import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import EventForm from "@/components/admin/EventForm";
import { updateEvent } from "../actions";

function toDateTimeLocalValue(date: Date) {
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(
    date.getHours()
  )}:${pad(date.getMinutes())}`;
}

export default async function EditEventPage({
  params,
}: {
  params: { id: string };
}) {
  const event = await prisma.event.findUnique({ where: { id: params.id } });

  if (!event) {
    notFound();
  }

  const boundUpdate = updateEvent.bind(null, event.id);

  return (
    <div>
      <h1 className="mb-6 font-serif text-2xl text-emerald">Edit Live Show</h1>
      <EventForm
        action={boundUpdate}
        submitLabel="Save Changes"
        initialValues={{
          title: event.title,
          date: toDateTimeLocalValue(event.date),
          platformName: event.platformName,
          platformLink: event.platformLink,
        }}
      />
    </div>
  );
}
