"use client";

import { useMemo, useState } from "react";
import ProductCard from "@/components/ProductCard";
import { useFavorites } from "@/hooks/useFavorites";

type Product = {
  id: string;
  name: string;
  category: string;
  price: number;
  description: string;
  images: string[];
  status?: "AVAILABLE" | "RESERVED" | "SOLD";
  dimensions?: string | null;
  era?: string | null;
  condition?: string | null;
  maker?: string | null;
};

export default function GalleryGrid({
  products,
  categoryOrder,
}: {
  products: Product[];
  categoryOrder?: string[];
}) {
  const categories = useMemo(() => {
    const present = new Set(products.map((p) => p.category));
    if (categoryOrder && categoryOrder.length > 0) {
      // Follow the admin-defined order; only show categories that have products.
      return categoryOrder.filter((name) => present.has(name));
    }
    return Array.from(present).sort();
  }, [products, categoryOrder]);

  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [search, setSearch] = useState("");
  const [savedOnly, setSavedOnly] = useState(false);
  const { favorites, ready: favoritesReady } = useFavorites();

  const filtered = useMemo(
    () =>
      products.filter((product) => {
        const matchesCategory =
          activeCategory === "All" || product.category === activeCategory;
        const matchesSearch =
          search.trim() === "" ||
          product.name.toLowerCase().includes(search.toLowerCase()) ||
          product.description.toLowerCase().includes(search.toLowerCase());
        const matchesSaved = !savedOnly || favorites.includes(product.id);
        return matchesCategory && matchesSearch && matchesSaved;
      }),
    [products, activeCategory, search, savedOnly, favorites]
  );

  return (
    <div>
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-2">
          {["All", ...categories].map((category) => (
            <button
              key={category}
              type="button"
              onClick={() => setActiveCategory(category)}
              aria-pressed={activeCategory === category}
              className={[
                "min-h-[44px] rounded-full border px-4 py-2 text-sm transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald",
                activeCategory === category
                  ? "border-emerald bg-emerald text-cream"
                  : "border-emerald/60 text-emerald hover:bg-emerald/10",
              ].join(" ")}
            >
              {category}
            </button>
          ))}
          {favoritesReady && favorites.length > 0 && (
            <button
              type="button"
              onClick={() => setSavedOnly((v) => !v)}
              aria-pressed={savedOnly}
              className={[
                "min-h-[44px] rounded-full border px-4 py-2 text-sm transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald",
                savedOnly
                  ? "border-emerald bg-emerald text-cream"
                  : "border-emerald/60 text-emerald hover:bg-emerald/10",
              ].join(" ")}
            >
              ♥ Saved ({favorites.length})
            </button>
          )}
        </div>

        <label htmlFor="gallery-search" className="sr-only">
          Search pieces
        </label>
        <input
          id="gallery-search"
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search pieces..."
          className="w-full rounded-full border border-emerald/60 bg-white/70 px-4 py-2 text-sm text-charcoal placeholder:text-charcoal-muted focus:border-emerald focus:outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald sm:w-64"
        />
      </div>

      {filtered.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <p className="py-12 text-center text-charcoal-muted">
          {savedOnly
            ? "You haven't saved any pieces in this category yet — tap the heart on a piece you love."
            : "No pieces match your search just yet — try a different category or search term."}
        </p>
      )}
    </div>
  );
}
