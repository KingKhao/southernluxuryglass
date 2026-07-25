"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import type { AboutSetting } from "@/lib/settings";
import { uploadImage } from "@/lib/uploadClient";

const fieldClass =
  "mt-1 w-full rounded-md border border-emerald/30 bg-white/70 px-3 py-2 text-sm focus:border-emerald focus:outline-none";

export default function AboutForm({ initialAbout }: { initialAbout: AboutSetting }) {
  const router = useRouter();
  const [about, setAbout] = useState<AboutSetting>(initialAbout);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [status, setStatus] = useState<string | null>(null);

  const set = <K extends keyof AboutSetting>(key: K, value: AboutSetting[K]) =>
    setAbout((a) => ({ ...a, [key]: value }));

  const uploadHero = async (file: File | undefined) => {
    if (!file) return;
    setUploading(true);
    setStatus(null);
    try {
      const url = await uploadImage(file, "about");
      set("imageUrl", url);
    } catch (err) {
      setStatus((err as Error).message || "Image upload failed.");
    } finally {
      setUploading(false);
    }
  };

  const save = async () => {
    setSaving(true);
    setStatus(null);
    try {
      const res = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ about }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setStatus(data.error || "Failed to save.");
        return;
      }
      setStatus("Saved! Your changes are live.");
      router.refresh();
    } finally {
      setSaving(false);
    }
  };

  const section = "rounded-lg border border-emerald/15 bg-white/60 p-5";

  return (
    <div className="max-w-2xl space-y-6">
      <div className={section}>
        <h2 className="mb-3 font-serif text-lg text-emerald">Hero Photo</h2>
        <div className="flex items-center gap-4">
          {about.imageUrl && (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img
              src={about.imageUrl}
              alt="About Crystal"
              className="h-28 w-24 rounded-md border border-emerald/20 object-cover"
            />
          )}
          <label className="cursor-pointer rounded-full border border-emerald px-4 py-2 text-sm text-emerald hover:bg-emerald hover:text-cream">
            {uploading ? "Uploading…" : "Upload new photo"}
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => uploadHero(e.target.files?.[0])}
            />
          </label>
        </div>
      </div>

      <div className={section}>
        <h2 className="mb-3 font-serif text-lg text-emerald">Intro</h2>
        <p className="mb-2 text-xs text-charcoal/50">
          Your story. Leave a blank line between paragraphs.
        </p>
        <textarea
          className={fieldClass}
          rows={10}
          value={about.intro}
          onChange={(e) => set("intro", e.target.value)}
        />
      </div>

      <div className={section}>
        <h2 className="mb-3 font-serif text-lg text-emerald">My Mission</h2>
        <textarea
          className={fieldClass}
          rows={3}
          value={about.mission}
          onChange={(e) => set("mission", e.target.value)}
        />
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={save}
          disabled={saving || uploading}
          className="rounded-full bg-emerald px-6 py-2 text-cream transition-colors hover:bg-emerald-dark disabled:opacity-50"
        >
          {saving ? "Saving…" : "Save Changes"}
        </button>
        {status && (
          <span className={status.startsWith("Saved") ? "text-sm text-emerald" : "text-sm text-red-700"}>
            {status}
          </span>
        )}
      </div>
    </div>
  );
}
