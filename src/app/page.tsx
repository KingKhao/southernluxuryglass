import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/prisma";
import ProductCard from "@/components/ProductCard";
import EventSchedule from "@/components/EventSchedule";
import { CURATOR_NAME, MISSION_STATEMENT, SITE_NAME } from "@/lib/site";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [featuredProducts, upcomingEvents] = await Promise.all([
    prisma.product.findMany({
      where: { featured: true },
      take: 3,
      orderBy: { createdAt: "desc" },
    }),
    prisma.event.findMany({
      where: { date: { gte: new Date() } },
      orderBy: { date: "asc" },
      take: 5,
    }),
  ]);

  return (
    <div>
      <section className="bg-ivory px-6 py-20 text-center">
        <p className="font-serif text-sm uppercase tracking-[0.3em] text-gold">
          {SITE_NAME}
        </p>
        <h1 className="mx-auto mt-4 max-w-2xl font-serif text-4xl leading-tight text-emerald sm:text-5xl">
          Antique &amp; Vintage Glassware, Rediscovered
        </h1>
        <p className="mx-auto mt-5 max-w-xl text-charcoal/70">
          One-of-a-kind pieces with history, character, and Southern charm —
          handpicked and lovingly restored to their rightful shine.
        </p>
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
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <p className="text-center text-charcoal/60">
            Featured pieces are coming soon — check the full gallery in the
            meantime.
          </p>
        )}
      </section>

      <section className="bg-ivory px-6 py-16">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="font-serif text-2xl text-emerald">Our Mission</h2>
          <p className="mt-4 font-serif text-xl italic text-charcoal/80">
            &ldquo;{MISSION_STATEMENT}&rdquo;
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-6 py-16">
        <div className="grid items-center gap-10 sm:grid-cols-2">
          <div className="flex justify-center sm:order-2">
            <Image
              src="/crystal-home.png"
              alt={CURATOR_NAME}
              width={360}
              height={480}
              className="rounded-lg object-cover shadow-md"
            />
          </div>
          <div className="text-center sm:order-1 sm:text-left">
            <h2 className="font-serif text-2xl text-emerald">
              About {CURATOR_NAME}
            </h2>
            <p className="mt-4 text-charcoal/70">
              My love for beautiful things started long before Southern
              Luxury Glass became a reality. I believe every piece tells a
              story — and my mission is to help you find the pieces that
              become part of yours.
            </p>
            <Link
              href="/about"
              className="mt-4 inline-block text-emerald underline decoration-gold decoration-2 underline-offset-4 hover:text-emerald-dark"
            >
              Read Crystal&apos;s full story
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-16">
        <h2 className="mb-8 text-center font-serif text-2xl text-emerald">
          Upcoming Live Shows
        </h2>
        <EventSchedule events={upcomingEvents} />
      </section>
    </div>
  );
}
