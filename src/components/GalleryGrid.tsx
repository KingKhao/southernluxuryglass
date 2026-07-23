"use client";

import { useMemo, useState } from "react";
import ProductCard from "@/components/ProductCard";

type Product = {
  id: string;
  name: string;
  category: string;
  price: number;
  description: string;
  imageUrl: string;
};

export default function GalleryGrid({ products }: { products: Product[] }) {
  const categories = useMemo(
    () => Array.from(new Set(products.map((p) => p.category))).sort(),
    [products]
  );

  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [search, setSearch] = useState("");

  const filtered = products.filter((product) => {
    const matchesCategory =
      activeCategory === "All" || product.category === activeCategory;
    const matchesSearch =
      search.trim() === "" ||
      product.name.toLowerCase().includes(search.toLowerCase()) ||
      product.description.toLowerCase().includes(search.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div>
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-2">
          {["All", ...categories].map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={[
                "rounded-full border px-4 py-1.5 text-sm transition-colors",
                activeCategory === category
                  ? "border-emerald bg-emerald text-cream"
                  : "border-emerald/30 text-emerald hover:bg-emerald/10",
              ].join(" ")}
            >
              {category}
            </button>
          ))}
        </div>

        <input
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search pieces..."
          className="w-full rounded-full border border-emerald/30 bg-white/70 px-4 py-1.5 text-sm text-charcoal placeholder:text-charcoal/40 focus:border-emerald focus:outline-none sm:w-64"
        />
      </div>

      {filtered.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <p className="py-12 text-center text-charcoal/60">
          No pieces match your search just yet — try a different category or
          search term.
        </p>
      )}
    </div>
  );
}
