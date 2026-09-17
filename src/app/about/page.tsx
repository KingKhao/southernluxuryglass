import { CURATOR_NAME } from "@/lib/site";
import { getSettings } from "@/lib/settings";
import ContactSection from "@/components/ContactSection";

// Cached and background-revalidated; /api/admin/settings already calls
// revalidatePath("/about") for an immediate refresh after an edit.
export const revalidate = 60;

export const metadata = {
  title: "About Crystal | Southern Luxury Glass",
};

export default async function AboutPage() {
  const { about } = await getSettings();
  const paragraphs = about.intro.split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean);

  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <p className="text-center font-serif italic text-gold-deep">About the Curator</p>
      <h1 className="mt-2 text-center font-serif text-3xl text-emerald sm:text-4xl">
        {CURATOR_NAME}
      </h1>

      <div className="mt-10 flex justify-center">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={about.imageUrl}
          alt={CURATOR_NAME}
          width={320}
          height={400}
          className="rounded-lg object-cover shadow-md"
        />
      </div>

      <div className="mt-10 space-y-6 text-charcoal-muted">
        {paragraphs.map((p, i) => (
          <p key={i}>{p}</p>
        ))}

        <h2 className="font-serif text-2xl text-emerald">My Mission</h2>
        <p className="font-serif text-xl italic text-charcoal-muted">
          &ldquo;{about.mission}&rdquo;
        </p>

        <p className="font-serif text-lg text-emerald">
          With Southern Grace,
          <br />
          Crystal ♡
        </p>
      </div>

      <ContactSection heading="Contact Crystal" />
    </div>
  );
}
