import Link from "next/link";
import { prisma } from "@/lib/prisma";
import ProductCard from "@/components/ProductCard";
import EventSchedule from "@/components/EventSchedule";
import ContactSection from "@/components/ContactSection";
import SignupSection from "@/components/SignupSection";
import SignupPopup from "@/components/SignupPopup";
import HowItWorksSection from "@/components/HowItWorksSection";
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
      {/* Full-bleed hero: a real photo of Crystal in her actual showroom
          (previously buried as a small thumbnail lower on this page), with
          a dark scrim so the hero copy stays legible over it. Same copy,
          same CTA — staged at the scale the rest of the brand already
          implies instead of sitting in a flat text-only box. */}
      <section className="relative flex min-h-[75svh] items-center overflow-hidden sm:min-h-[85svh]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={home.heroImageUrl}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 h-full w-full object-cover"
          style={{ objectPosition: "68% 22%" }}
        />
        {/* Kept deliberately dark and broad rather than fading precisely to
            the photo's brightest spots — safer for text contrast without a
            way to preview the exact render here; worth a visual check and
            fine-tune once you can see it live. */}
        <div className="absolute inset-0 bg-charcoal/60" />
        <div className="absolute inset-0 bg-gradient-to-t from-charcoal/95 via-charcoal/70 to-charcoal/40 sm:bg-gradient-to-r sm:from-charcoal/95 sm:via-charcoal/75 sm:to-charcoal/20" />

        <div data-storefront-reveal className="relative z-10 mx-auto w-full max-w-6xl px-6 py-20 text-center sm:text-left">
          <p className="font-serif text-sm uppercase tracking-[0.3em] text-gold-light">
            {home.heroEyebrow}
          </p>
          <h1 className="mx-auto mt-4 max-w-2xl font-serif text-5xl leading-[0.95] tracking-tight text-cream sm:mx-0 sm:text-7xl lg:text-8xl">
            {home.heroTitle}
          </h1>
          <p className="mx-auto mt-6 max-w-md text-cream/85 sm:mx-0 sm:text-lg">
            {home.heroSubtitle}
          </p>
          <Link
            href="/gallery"
            className="mt-8 inline-block rounded-full bg-emerald px-10 py-4 text-base text-cream transition-colors hover:bg-emerald-dark"
          >
            Browse the Gallery
          </Link>
          <p className="mt-4 text-sm text-cream/85">Save a favorite. Ask Crystal. Arrange your purchase personally.</p>
        </div>
      </section>

      <section data-storefront-reveal className="mx-auto max-w-6xl px-6 py-16">
        <h2 className="mb-8 text-center font-serif text-3xl text-emerald sm:text-4xl">
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
                  status: product.status,
                  dimensions: product.dimensions,
                  era: product.era,
                  condition: product.condition,
                  maker: product.maker,
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
        <div className="mt-10 text-center"><Link href="/gallery" className="inline-flex min-h-[48px] items-center rounded-full border border-emerald px-7 py-3 text-emerald transition-colors hover:bg-emerald hover:text-cream">Explore the full collection</Link></div>
      </section>

      <section data-storefront-reveal id="live-shows" className="mx-auto max-w-6xl px-6 py-16">
        <h2 className="mb-8 text-center font-serif text-3xl text-emerald sm:text-4xl">
          Upcoming Live Shows
        </h2>
        <EventSchedule events={upcomingEvents} />
      </section>

      {/* The one deliberate color break in the scroll: solid emerald instead
          of the cream/ivory used everywhere else, reserved for the site's
          most personal moment. Same copy, same link, same photo family
          (crystal-about.png — the seated portrait, since crystal-home.png
          now leads the hero above). */}
      <section data-storefront-reveal className="bg-emerald px-6 py-16 text-cream">
        <div className="mx-auto grid max-w-5xl items-center gap-10 sm:grid-cols-2">
          <div className="flex justify-center sm:order-2">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={home.aboutImageUrl}
              alt={home.aboutHeading}
              width={360}
              height={480}
              loading="lazy"
              decoding="async"
              className="rounded-lg object-cover shadow-xl"
            />
          </div>
          <div className="text-center sm:order-1 sm:text-left">
            <h2 className="font-serif text-3xl sm:text-4xl">{home.aboutHeading}</h2>
            <p className="mt-4 text-cream/85">{home.aboutText}</p>
            <Link
              href="/about"
              className="mt-4 inline-block text-cream underline decoration-gold-light decoration-2 underline-offset-4 hover:text-gold-light"
            >
              Read Crystal&apos;s full story
            </Link>
          </div>
        </div>
      </section>

      <HowItWorksSection />

      <ContactSection />

      <SignupSection />

      <SignupPopup hasLiveShows={upcomingEvents.length > 0} />
    </div>
  );
}
