import Link from "next/link";
import { prisma } from "@/lib/prisma";
import ProductCard from "@/components/ProductCard";
import EventSchedule from "@/components/EventSchedule";
import ContactSection from "@/components/ContactSection";
import SignupSection from "@/components/SignupSection";
import SignupPopup from "@/components/SignupPopup";
import { getSettings } from "@/lib/settings";

// Cached and background-revalidated instead of rebuilt from the DB on every
// request; admin edits (products/events/settings) already call
// revalidatePath("/") for an immediate refresh, so this is a safe fallback
// cache window, not a staleness risk.
export const revalidate = 60;

export default async function HomePage() {
  const [featuredProducts, upcomingEvents, settings] = await Promise.all([
    prisma.product.findMany({
      where: { featured: true },
      take: 3,
      orderBy: { createdAt: "desc" },
      include: { category: true },
    }),
    prisma.event.findMany({
      where: { date: { gte: new Date() } },
      orderBy: { date: "asc" },
      take: 5,
    }),
    getSettings(),
  ]);

  const { home } = settings;

  return (
    <div>
      <section className="bg-ivory px-6 py-20 text-center">
        <p className="font-serif text-sm uppercase tracking-[0.3em] text-gold-deep">
          {home.heroEyebrow}
        </p>
        <h1 className="mx-auto mt-4 max-w-2xl font-serif text-4xl leading-tight text-emerald sm:text-5xl">
          {home.heroTitle}
        </h1>
        <p className="mx-auto mt-5 max-w-xl text-charcoal-muted">{home.heroSubtitle}</p>
        <Link
          href="/gallery"
          className="mt-8 inline-block rounded-full bg-emerald px-8 py-3 text-cream transition-colors hover:bg-emerald-dark"
        >
          Browse the Gallery
        </Link>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-16">
        <h2 className="mb-8 text-center font-serif text-2xl text-emerald">
          Featured Pieces
        </h2>
        {featuredProducts.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featuredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={{
                  id: product.id,
                  name: product.name,
                  category: product.category.name,
                  price: product.price,
                  description: product.description,
                  images: product.images,
                }}
              />
            ))}
          </div>
        ) : (
          <p className="text-center text-charcoal-muted">
            Featured pieces are coming soon — check the full gallery in the
            meantime.
          </p>
        )}
      </section>

      <section id="live-shows" className="mx-auto max-w-6xl px-6 py-16">
        <h2 className="mb-8 text-center font-serif text-2xl text-emerald">
          Upcoming Live Shows
        </h2>
        <EventSchedule events={upcomingEvents} />
      </section>

      {/* The mission statement lives on the About page (about.mission) as
          Crystal's own words in her own voice — this section used to repeat
          the identical sentence here too (home.missionStatement), which read
          as duplicated content between two pages a visitor might read back
          to back. Removed rather than reworded, since inventing a different
          sentence just to avoid the repeat would be adding copy, not fixing
          it. home.missionStatement is left as-is in Settings in case it's
          wanted back for something else later. */}

      <section className="mx-auto max-w-5xl px-6 py-16">
        <div className="grid items-center gap-10 sm:grid-cols-2">
          <div className="flex justify-center sm:order-2">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={home.aboutImageUrl}
              alt={home.aboutHeading}
              width={360}
              height={480}
              loading="lazy"
              decoding="async"
              className="rounded-lg object-cover shadow-md"
            />
          </div>
          <div className="text-center sm:order-1 sm:text-left">
            <h2 className="font-serif text-2xl text-emerald">{home.aboutHeading}</h2>
            <p className="mt-4 text-charcoal-muted">{home.aboutText}</p>
            <Link
              href="/about"
              className="mt-4 inline-block text-emerald underline decoration-gold decoration-2 underline-offset-4 hover:text-emerald-dark"
            >
              Read Crystal&apos;s full story
            </Link>
          </div>
        </div>
      </section>

      <ContactSection />

      <SignupSection />

      <SignupPopup hasLiveShows={upcomingEvents.length > 0} />
    </div>
  );
}
