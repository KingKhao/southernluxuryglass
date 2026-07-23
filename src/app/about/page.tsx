import { CURATOR_NAME } from "@/lib/site";
import { getSettings } from "@/lib/settings";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "About Crystal | Southern Luxury Glass",
};

export default async function AboutPage() {
  const { home } = await getSettings();

  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <p className="text-center font-serif italic text-gold">About the Curator</p>
      <h1 className="mt-2 text-center font-serif text-3xl text-emerald sm:text-4xl">
        {CURATOR_NAME}
      </h1>

      <div className="mt-10 flex justify-center">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={home.aboutImageUrl}
          alt={CURATOR_NAME}
          width={320}
          height={400}
          className="rounded-lg object-cover shadow-md"
        />
      </div>

      <div className="mt-10 space-y-6 text-charcoal/80">
        <p>
          My love for beautiful things started long before Southern Luxury
          Glass became a reality. Growing up in the South, I was surrounded
          by tradition, hospitality, and a deep appreciation for the details
          that make a house a home.
        </p>

        <p>
          Over the years, my passion for fine glassware and timeless design
          only grew. I believe that every piece tells a story — and my
          mission is to help you find the pieces that become part of yours.
        </p>

        <p>
          At Southern Luxury Glass, I carefully curate each item with an eye
          for quality, elegance, and charm. Whether you&apos;re setting a
          table for a special occasion or adding a little beauty to your
          everyday, I&apos;m honored to be a part of your journey.
        </p>

        <h2 className="font-serif text-2xl text-emerald">My Mission</h2>
        <p className="font-serif text-xl italic text-charcoal/80">
          &ldquo;{home.missionStatement}&rdquo;
        </p>

        <p className="font-serif text-lg text-emerald">
          With Southern Grace,
          <br />
          Crystal ♡
        </p>
      </div>

      <div className="mt-12 rounded-lg border border-gold/40 bg-gold/10 px-5 py-3 text-center text-sm text-charcoal/70">
        This page uses Crystal&apos;s own words from her curator bio. If
        there&apos;s more of the story you&apos;d like to add — how you got
        started, favorite finds, behind-the-scenes details — just let me know
        and we&apos;ll expand this page.
      </div>
    </div>
  );
}
