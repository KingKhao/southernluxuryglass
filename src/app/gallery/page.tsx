import { prisma } from "@/lib/prisma";
import GalleryGrid from "@/components/GalleryGrid";

// Cached and background-revalidated; product/category admin actions already
// call revalidatePath("/gallery") for an immediate refresh after an edit.
export const revalidate = 60;

export const metadata = {
  title: "Gallery | Southern Luxury Glass",
};

export default async function GalleryPage() {
  const [products, categories] = await Promise.all([
    prisma.product.findMany({
      orderBy: { createdAt: "desc" },
      include: { category: true },
    }),
    prisma.category.findMany({ orderBy: { sortOrder: "asc" } }),
  ]);

  return (
    <div className="mx-auto max-w-6xl px-6 py-16">
      <div className="mb-10 text-center">
        <h1 className="font-serif text-3xl text-emerald sm:text-4xl">
          The Gallery
        </h1>
        <p className="mx-auto mt-3 max-w-xl text-charcoal-muted">
          Every piece currently available, from delicate cordial glasses to
          statement vases. Fall in love, then reach out — nothing here can be
          purchased online yet, just inquired about.
        </p>
      </div>
      <GalleryGrid
        products={products.map((p) => ({
          id: p.id,
          name: p.name,
          category: p.category.name,
          price: p.price,
          description: p.description,
          images: p.images,
          status: p.status,
          dimensions: p.dimensions,
          era: p.era,
          condition: p.condition,
          maker: p.maker,
        }))}
        categoryOrder={categories.map((c) => c.name)}
      />
    </div>
  );
}
