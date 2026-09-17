"use client";

import { useRef, useState } from "react";
import { uploadImage } from "@/lib/uploadClient";

type ProductFormValues = {
  name: string;
  categoryId: string;
  price: number;
  cost?: number | null;
  description: string;
  images: string[];
  featured: boolean;
  status: "AVAILABLE" | "RESERVED" | "SOLD";
  dimensions?: string | null;
  era?: string | null;
  condition?: string | null;
  maker?: string | null;
};

type CategoryOption = { id: string; name: string };

const fieldClass =
  "mt-1 w-full rounded-md border border-emerald/30 bg-white/70 px-3 py-2 focus:border-emerald focus:outline-none";

export default function ProductForm({
  action,
  categories,
  initialValues,
  submitLabel,
}: {
  action: (formData: FormData) => void;
  categories: CategoryOption[];
  initialValues?: ProductFormValues;
  submitLabel: string;
}) {
  const [images, setImages] = useState<string[]>(initialValues?.images ?? []);
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const uploadFiles = async (files: FileList | File[] | null) => {
    if (!files) return;
    const list = Array.from(files);
    if (list.length === 0) return;
    setUploading(true);
    setError(null);
    try {
      const uploaded: string[] = [];
      for (const file of list) {
        if (!file.type.startsWith("image/")) {
          setError("Only image files can be uploaded.");
          continue;
        }
        try {
          const url = await uploadImage(file, "products");
          uploaded.push(url);
        } catch (err) {
          setError((err as Error).message || "Image upload failed.");
        }
      }
      if (uploaded.length > 0) setImages((prev) => [...prev, ...uploaded]);
    } finally {
      setUploading(false);
    }
  };

  const removeImage = (url: string) => setImages((prev) => prev.filter((i) => i !== url));

  const move = (index: number, delta: number) => {
    setImages((prev) => {
      const next = [...prev];
      const target = index + delta;
      if (target < 0 || target >= next.length) return prev;
      [next[index], next[target]] = [next[target], next[index]];
      return next;
    });
  };

  return (
    <form action={action} className="max-w-xl space-y-4">
      <div>
        <label className="block text-sm text-charcoal/70" htmlFor="name">
          Name
        </label>
        <input id="name" name="name" required defaultValue={initialValues?.name} className={fieldClass} />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm text-charcoal/70" htmlFor="categoryId">
            Category
          </label>
          <select
            id="categoryId"
            name="categoryId"
            required
            defaultValue={initialValues?.categoryId ?? categories[0]?.id ?? ""}
            className={fieldClass}
          >
            {categories.length === 0 && <option value="">No categories yet</option>}
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
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
            className={fieldClass}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm text-charcoal/70" htmlFor="cost">
            Your cost (admin-only)
          </label>
          <input
            id="cost"
            name="cost"
            type="number"
            step="0.01"
            min="0"
            defaultValue={initialValues?.cost ?? ""}
            placeholder="What you paid for this piece"
            className={fieldClass}
          />
          <p className="mt-1 text-xs text-charcoal/50">
            Only you see this — it never appears on the storefront.
          </p>
        </div>
        <div>
          <label className="block text-sm text-charcoal/70" htmlFor="status">
            Status
          </label>
          <select
            id="status"
            name="status"
            defaultValue={initialValues?.status ?? "AVAILABLE"}
            className={fieldClass}
          >
            <option value="AVAILABLE">Available</option>
            <option value="RESERVED">Reserved</option>
            <option value="SOLD">Sold</option>
          </select>
          <p className="mt-1 text-xs text-charcoal/50">
            Sold pieces stay visible with a Sold badge; the Inquire button turns off.
          </p>
        </div>
      </div>

      <div>
        <p className="block text-sm text-charcoal/70">Details (optional)</p>
        <p className="mb-2 text-xs text-charcoal/50">
          Shown on the piece only when filled in — leave any of these blank to omit them.
        </p>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs text-charcoal/70" htmlFor="dimensions">
              Dimensions
            </label>
            <input
              id="dimensions"
              name="dimensions"
              defaultValue={initialValues?.dimensions ?? ""}
              placeholder={'e.g. 8"H x 4"W'}
              className={fieldClass}
            />
          </div>
          <div>
            <label className="block text-xs text-charcoal/70" htmlFor="era">
              Era
            </label>
            <input
              id="era"
              name="era"
              defaultValue={initialValues?.era ?? ""}
              placeholder="e.g. 1930s"
              className={fieldClass}
            />
          </div>
          <div>
            <label className="block text-xs text-charcoal/70" htmlFor="condition">
              Condition
            </label>
            <input
              id="condition"
              name="condition"
              defaultValue={initialValues?.condition ?? ""}
              placeholder="e.g. Excellent, no chips"
              className={fieldClass}
            />
          </div>
          <div>
            <label className="block text-xs text-charcoal/70" htmlFor="maker">
              Maker
            </label>
            <input
              id="maker"
              name="maker"
              defaultValue={initialValues?.maker ?? ""}
              placeholder="e.g. Fenton"
              className={fieldClass}
            />
          </div>
        </div>
      </div>

      {/* Photos: drag-and-drop upload + thumbnails */}
      <div>
        <label className="block text-sm text-charcoal/70">Photos</label>
        <div
          onClick={() => fileInputRef.current?.click()}
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragOver(false);
            uploadFiles(e.dataTransfer.files);
          }}
          className={[
            "mt-1 flex cursor-pointer flex-col items-center justify-center rounded-md border-2 border-dashed px-4 py-8 text-center transition-colors",
            dragOver ? "border-emerald bg-emerald/10" : "border-emerald/30 bg-white/50 hover:bg-white/70",
          ].join(" ")}
        >
          <p className="text-sm text-charcoal/70">
            <span className="font-medium text-emerald">Click to upload</span> or drag &amp; drop
          </p>
          <p className="mt-1 text-xs text-charcoal/50">
            JPG, PNG, WebP or GIF up to 10MB — add as many as you like
          </p>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={(e) => {
              uploadFiles(e.target.files);
              e.target.value = "";
            }}
          />
        </div>
        {uploading && <p className="mt-2 text-xs text-charcoal/60">Uploading…</p>}

        {images.length > 0 && (
          <div className="mt-3 grid grid-cols-3 gap-3 sm:grid-cols-4">
            {images.map((url, index) => (
              <div
                key={url}
                className="group relative aspect-square overflow-hidden rounded-md border border-emerald/20 bg-white"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={url} alt="" className="h-full w-full object-cover" />
                {index === 0 && (
                  <span className="absolute left-1 top-1 rounded bg-emerald px-1.5 py-0.5 text-[10px] font-medium text-cream">
                    Cover
                  </span>
                )}
                <button
                  type="button"
                  onClick={() => removeImage(url)}
                  aria-label="Remove photo"
                  className="absolute right-1 top-1 rounded-full bg-charcoal/70 px-1.5 text-xs text-white opacity-0 transition-opacity group-hover:opacity-100"
                >
                  ✕
                </button>
                <div className="absolute inset-x-0 bottom-0 flex justify-between bg-charcoal/60 px-1 py-0.5 opacity-0 transition-opacity group-hover:opacity-100">
                  <button
                    type="button"
                    onClick={() => move(index, -1)}
                    disabled={index === 0}
                    aria-label="Move left"
                    className="text-xs text-white disabled:opacity-30"
                  >
                    ◀
                  </button>
                  <button
                    type="button"
                    onClick={() => move(index, 1)}
                    disabled={index === images.length - 1}
                    aria-label="Move right"
                    className="text-xs text-white disabled:opacity-30"
                  >
                    ▶
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
        <p className="mt-1 text-xs text-charcoal/50">
          The first photo is the cover shown on cards. Drag the arrows to reorder.
        </p>
        <input type="hidden" name="images" value={JSON.stringify(images)} />
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
          className={fieldClass}
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

      {error && <p className="text-sm text-red-700">{error}</p>}

      <button
        type="submit"
        disabled={uploading}
        className="rounded-full bg-emerald px-6 py-2 text-cream transition-colors hover:bg-emerald-dark disabled:opacity-50"
      >
        {submitLabel}
      </button>
    </form>
  );
}
