type ProductFormValues = {
  name: string;
  category: string;
  price: number;
  description: string;
  imageUrl: string;
  featured: boolean;
};

export default function ProductForm({
  action,
  initialValues,
  submitLabel,
}: {
  action: (formData: FormData) => void;
  initialValues?: ProductFormValues;
  submitLabel: string;
}) {
  return (
    <form action={action} className="max-w-xl space-y-4">
      <div>
        <label className="block text-sm text-charcoal/70" htmlFor="name">
          Name
        </label>
        <input
          id="name"
          name="name"
          required
          defaultValue={initialValues?.name}
          className="mt-1 w-full rounded-md border border-emerald/30 bg-white/70 px-3 py-2 focus:border-emerald focus:outline-none"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm text-charcoal/70" htmlFor="category">
            Category
          </label>
          <input
            id="category"
            name="category"
            required
            defaultValue={initialValues?.category}
            placeholder="Vases, Glasses, Decor..."
            className="mt-1 w-full rounded-md border border-emerald/30 bg-white/70 px-3 py-2 focus:border-emerald focus:outline-none"
          />
        </div>
        <div>
          <label className="block text-sm text-charcoal/70" htmlFor="price">
            Price (USD)
          </label>
          <input
            id="price"
            name="price"
            type="number"
            step="0.01"
            min="0"
            required
            defaultValue={initialValues?.price}
            className="mt-1 w-full rounded-md border border-emerald/30 bg-white/70 px-3 py-2 focus:border-emerald focus:outline-none"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm text-charcoal/70" htmlFor="imageUrl">
          Image URL
        </label>
        <input
          id="imageUrl"
          name="imageUrl"
          type="url"
          required
          defaultValue={initialValues?.imageUrl}
          placeholder="https://..."
          className="mt-1 w-full rounded-md border border-emerald/30 bg-white/70 px-3 py-2 focus:border-emerald focus:outline-none"
        />
      </div>

      <div>
        <label className="block text-sm text-charcoal/70" htmlFor="description">
          Description
        </label>
        <textarea
          id="description"
          name="description"
          required
          rows={4}
          defaultValue={initialValues?.description}
          className="mt-1 w-full rounded-md border border-emerald/30 bg-white/70 px-3 py-2 focus:border-emerald focus:outline-none"
        />
      </div>

      <label className="flex items-center gap-2 text-sm text-charcoal/70">
        <input
          type="checkbox"
          name="featured"
          defaultChecked={initialValues?.featured}
          className="h-4 w-4 rounded border-emerald/30"
        />
        Feature on homepage hero (max 3 shown)
      </label>

      <button
        type="submit"
        className="rounded-full bg-emerald px-6 py-2 text-cream transition-colors hover:bg-emerald-dark"
      >
        {submitLabel}
      </button>
    </form>
  );
}
