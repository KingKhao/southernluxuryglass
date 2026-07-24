"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import type { SettingsShape } from "@/lib/settings";
import { uploadImage } from "@/lib/uploadClient";

const fieldClass =
  "mt-1 w-full rounded-md border border-emerald/30 bg-white/70 px-3 py-2 text-sm focus:border-emerald focus:outline-none";
const labelClass = "block text-sm font-medium text-charcoal/80";

export default function SettingsForm({
  initialSettings,
}: {
  initialSettings: SettingsShape;
}) {
  const router = useRouter();
  const [settings, setSettings] = useState<SettingsShape>(initialSettings);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [status, setStatus] = useState<string | null>(null);

  const setHome = <K extends keyof SettingsShape["home"]>(
    key: K,
    value: SettingsShape["home"][K]
  ) => setSettings((s) => ({ ...s, home: { ...s.home, [key]: value } }));

  type LinkKey = "instagram" | "tiktok" | "pinterest" | "linkedin" | "whatnot";

  const setLink = (key: LinkKey, patch: Partial<{ url: string; enabled: boolean }>) =>
    setSettings((s) => ({
      ...s,
      social: { ...s.social, [key]: { ...s.social[key], ...patch } },
    }));

  const setEmail = (patch: Partial<{ address: string; enabled: boolean }>) =>
    setSettings((s) => ({
      ...s,
      social: { ...s.social, email: { ...s.social.email, ...patch } },
    }));

  const uploadAboutImage = async (file: File | undefined) => {
    if (!file) return;
    setUploading(true);
    setStatus(null);
    try {
      const url = await uploadImage(file, "about");
      setHome("aboutImageUrl", url);
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
        body: JSON.stringify(settings),
      });
      if (!res.ok) {
        const data = await res.json();
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
      {/* Hero */}
      <div className={section}>
        <h2 className="mb-3 font-serif text-lg text-emerald">Homepage Header</h2>
        <label className={labelClass}>Small heading (above the title)</label>
        <input
          className={fieldClass}
          value={settings.home.heroEyebrow}
          onChange={(e) => setHome("heroEyebrow", e.target.value)}
        />
        <label className={`${labelClass} mt-3`}>Main title</label>
        <input
          className={fieldClass}
          value={settings.home.heroTitle}
          onChange={(e) => setHome("heroTitle", e.target.value)}
        />
        <label className={`${labelClass} mt-3`}>Subtitle</label>
        <textarea
          className={fieldClass}
          rows={2}
          value={settings.home.heroSubtitle}
          onChange={(e) => setHome("heroSubtitle", e.target.value)}
        />
      </div>

      {/* Mission */}
      <div className={section}>
        <h2 className="mb-3 font-serif text-lg text-emerald">Mission Statement</h2>
        <textarea
          className={fieldClass}
          rows={3}
          value={settings.home.missionStatement}
          onChange={(e) => setHome("missionStatement", e.target.value)}
        />
      </div>

      {/* About Crystal */}
      <div className={section}>
        <h2 className="mb-3 font-serif text-lg text-emerald">About Crystal</h2>
        <label className={labelClass}>Heading</label>
        <input
          className={fieldClass}
          value={settings.home.aboutHeading}
          onChange={(e) => setHome("aboutHeading", e.target.value)}
        />
        <label className={`${labelClass} mt-3`}>Text</label>
        <textarea
          className={fieldClass}
          rows={4}
          value={settings.home.aboutText}
          onChange={(e) => setHome("aboutText", e.target.value)}
        />
        <label className={`${labelClass} mt-3`}>Photo</label>
        <div className="mt-1 flex items-center gap-4">
          {settings.home.aboutImageUrl && (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img
              src={settings.home.aboutImageUrl}
              alt="About Crystal"
              className="h-24 w-20 rounded-md border border-emerald/20 object-cover"
            />
          )}
          <label className="cursor-pointer rounded-full border border-emerald px-4 py-2 text-sm text-emerald hover:bg-emerald hover:text-cream">
            {uploading ? "Uploading…" : "Upload new photo"}
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => uploadAboutImage(e.target.files?.[0])}
            />
          </label>
        </div>
      </div>

      {/* Social links */}
      <div className={section}>
        <h2 className="mb-1 font-serif text-lg text-emerald">Social Links</h2>
        <p className="mb-3 text-xs text-charcoal/50">
          Paste the full URL to each profile, then tick the box to show it in the footer.
          Unticked links are hidden.
        </p>
        {(["instagram", "tiktok", "pinterest", "linkedin", "whatnot"] as const).map((key) => (
          <div key={key} className="mt-3">
            <label className="flex items-center gap-2 text-sm font-medium capitalize text-charcoal/80">
              <input
                type="checkbox"
                checked={settings.social[key].enabled}
                onChange={(e) => setLink(key, { enabled: e.target.checked })}
                className="h-4 w-4 rounded border-emerald/30"
              />
              {key}
            </label>
            <input
              className={fieldClass}
              placeholder="https://…"
              value={settings.social[key].url}
              onChange={(e) => setLink(key, { url: e.target.value })}
            />
          </div>
        ))}
        <div className="mt-3">
          <label className="flex items-center gap-2 text-sm font-medium text-charcoal/80">
            <input
              type="checkbox"
              checked={settings.social.email.enabled}
              onChange={(e) => setEmail({ enabled: e.target.checked })}
              className="h-4 w-4 rounded border-emerald/30"
            />
            Email
          </label>
          <input
            className={fieldClass}
            type="email"
            placeholder="hello@southernluxuryglass.com"
            value={settings.social.email.address}
            onChange={(e) => setEmail({ address: e.target.value })}
          />
        </div>
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
          <span
            className={
              status.startsWith("Saved") ? "text-sm text-emerald" : "text-sm text-red-700"
            }
          >
            {status}
          </span>
        )}
      </div>
    </div>
  );
}
