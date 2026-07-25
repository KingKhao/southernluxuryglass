import { getSettings } from "@/lib/settings";
import AboutForm from "@/components/admin/AboutForm";

export const dynamic = "force-dynamic";

export default async function AdminAboutPage() {
  const settings = await getSettings();

  return (
    <div>
      <h1 className="mb-2 font-serif text-2xl text-emerald">About Crystal</h1>
      <p className="mb-6 max-w-xl text-sm text-charcoal/60">
        Edit the photo and words on your public About Crystal page. Changes go live as
        soon as you save.
      </p>
      <AboutForm initialAbout={settings.about} />
    </div>
  );
}
