import { prisma } from "@/lib/prisma";
import GalleryGrid from "@/components/GalleryGrid";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Gallery | Southern Luxury Glass",
};

export default async function GalleryPage() {
  const products = await prisma.product.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="mx-auto max-w-6xl px-6 py-16">
      <div className="mb-10 text-center">
        <h1 className="font-serif text-3xl text-emerald sm:text-4xl">
          The Gallery
        </h1>
        <p className="mx-auto mt-3 max-w-xl text-charcoal/70">
          Every piece currently available, from delicate cordial glasses to
          statement vases. Fall in love, then reach out — nothing here can be
          purchased online yet, just inquired about.
        </p>
      </div>
      <GalleryGrid products={products} />
    </div>
  );
}
