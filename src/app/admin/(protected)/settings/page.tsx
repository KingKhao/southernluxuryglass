import { getSettings } from "@/lib/settings";
import SettingsForm from "@/components/admin/SettingsForm";

export const dynamic = "force-dynamic";

export default async function AdminSettingsPage() {
  const settings = await getSettings();

  return (
    <div>
      <h1 className="mb-2 font-serif text-2xl text-emerald">Homepage &amp; Content</h1>
      <p className="mb-6 max-w-xl text-sm text-charcoal/60">
        Edit the words and images visitors see on the homepage and About page, plus
        your social links. Changes go live as soon as you save.
      </p>
      <SettingsForm initialSettings={settings} />
    </div>
  );
}
