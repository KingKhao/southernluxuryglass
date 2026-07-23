import EventForm from "@/components/admin/EventForm";
import { createEvent } from "../actions";

export default function NewEventPage() {
  return (
    <div>
      <h1 className="mb-6 font-serif text-2xl text-emerald">Add Live Show</h1>
      <EventForm action={createEvent} submitLabel="Create Live Show" />
    </div>
  );
}
