type EventFormValues = {
  title: string;
  date: string; // formatted for datetime-local input
  platformName: string;
  platformLink: string;
};

export default function EventForm({
  action,
  initialValues,
  submitLabel,
}: {
  action: (formData: FormData) => void;
  initialValues?: EventFormValues;
  submitLabel: string;
}) {
  return (
    <form action={action} className="max-w-xl space-y-4">
      <div>
        <label className="block text-sm text-charcoal/70" htmlFor="title">
          Title
        </label>
        <input
          id="title"
          name="title"
          required
          defaultValue={initialValues?.title}
          className="mt-1 w-full rounded-md border border-emerald/30 bg-white/70 px-3 py-2 focus:border-emerald focus:outline-none"
        />
      </div>

      <div>
        <label className="block text-sm text-charcoal/70" htmlFor="date">
          Date &amp; Time
        </label>
        <input
          id="date"
          name="date"
          type="datetime-local"
          required
          defaultValue={initialValues?.date}
          className="mt-1 w-full rounded-md border border-emerald/30 bg-white/70 px-3 py-2 focus:border-emerald focus:outline-none"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm text-charcoal/70" htmlFor="platformName">
            Platform Name
          </label>
          <input
            id="platformName"
            name="platformName"
            required
            placeholder="Whatnot, Instagram Live..."
            defaultValue={initialValues?.platformName}
            className="mt-1 w-full rounded-md border border-emerald/30 bg-white/70 px-3 py-2 focus:border-emerald focus:outline-none"
          />
        </div>
        <div>
          <label className="block text-sm text-charcoal/70" htmlFor="platformLink">
            Platform Link
          </label>
          <input
            id="platformLink"
            name="platformLink"
            type="url"
            required
            placeholder="https://..."
            defaultValue={initialValues?.platformLink}
            className="mt-1 w-full rounded-md border border-emerald/30 bg-white/70 px-3 py-2 focus:border-emerald focus:outline-none"
          />
        </div>
      </div>

      <button
        type="submit"
        className="rounded-full bg-emerald px-6 py-2 text-cream transition-colors hover:bg-emerald-dark"
      >
        {submitLabel}
      </button>
    </form>
  );
}
