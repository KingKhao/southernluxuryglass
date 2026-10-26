"use client";

import { useEffect, useMemo, useState } from "react";
import ProductCard from "@/components/ProductCard";
import { useFavorites } from "@/hooks/useFavorites";
import { DEFAULT_FILTERS, SORT_OPTIONS, filterGallery, galleryQuery, readGalleryFilters, type GalleryFilters, type GalleryProduct } from "@/lib/gallery";

export default function GalleryGrid({ products, categoryOrder }: { products: GalleryProduct[]; categoryOrder?: string[] }) {
  const categories = useMemo(() => {
    const present = new Set(products.map(product => product.category));
    const ordered = (categoryOrder || []).filter(name => present.has(name));
    return [...ordered, ...Array.from(present).filter(name => !ordered.includes(name)).sort()];
  }, [products, categoryOrder]);
  const [filters, setFilters] = useState<GalleryFilters>(DEFAULT_FILTERS);
  const [hydrated, setHydrated] = useState(false);
  const [copied, setCopied] = useState(false);
  const [refinementsOpen, setRefinementsOpen] = useState(false);
  const { favorites, ready } = useFavorites();

  useEffect(() => {
    const read = () => { setFilters(readGalleryFilters(new URLSearchParams(window.location.search))); setHydrated(true); };
    read();
    window.addEventListener("popstate", read);
    return () => window.removeEventListener("popstate", read);
  }, []);

  const change = (patch: Partial<GalleryFilters>) => {
    const next = { ...filters, ...patch };
    setFilters(next); setCopied(false);
    const query = galleryQuery(next);
    window.history.replaceState(window.history.state, "", `${window.location.pathname}${query ? `?${query}` : ""}`);
  };
  const filtered = useMemo(() => filterGallery(products, filters, favorites), [products, filters, favorites]);
  const active = filters.category !== "All" || !!filters.query || filters.saved || filters.available || filters.sort !== "newest";
  const button = "min-h-[44px] rounded-full border px-4 py-2 text-sm transition-colors";
  const selected = "border-emerald bg-emerald text-cream";
  const unselected = "border-emerald/60 text-emerald hover:bg-emerald/10";

  async function copyCollection() {
    try { await navigator.clipboard.writeText(window.location.href); setCopied(true); }
    catch { window.prompt("Copy this gallery link (saved pieces stay on your device):", window.location.href); }
  }

  return <div className="gallery-experience">
    <div className="gallery-controls rounded-lg border border-emerald/15 bg-white/60 p-4 sm:p-6">
      <label htmlFor="gallery-search" className="mb-2 block text-sm text-emerald">Find your next piece</label>
      <div className="relative"><input id="gallery-search" type="search" value={filters.query} maxLength={150} onChange={event => change({ query: event.target.value })} placeholder="Search a piece, maker, era…" className="min-h-[48px] w-full rounded-full border border-emerald/60 bg-cream px-5 pr-12 text-base placeholder:text-charcoal-muted" />{filters.query && <button type="button" onClick={() => {change({ query: "" }); document.getElementById("gallery-search")?.focus();}} className="absolute right-1 top-0 h-12 w-11 text-xl text-emerald" aria-label="Clear search">×</button>}</div>
      <button type="button" aria-controls="gallery-refinements" aria-expanded={refinementsOpen} onClick={()=>setRefinementsOpen(value=>!value)} className="mt-3 flex min-h-[44px] w-full items-center justify-between text-sm text-emerald sm:hidden">Refine the collection <span aria-hidden="true">{refinementsOpen ? "−" : "+"}</span></button>
      <div id="gallery-refinements" className={refinementsOpen ? "mt-4" : "mt-4 hidden sm:block"}>
        <div className="flex flex-wrap gap-2" role="group" aria-label="Filter by category">{["All", ...categories].map(category => <button key={category} type="button" aria-pressed={filters.category === category} onClick={() => change({ category })} className={`${button} ${filters.category === category ? selected : unselected}`}>{category}</button>)}</div>
        <div className="mt-4 flex flex-wrap items-end gap-3">
          <div className="w-full sm:w-auto"><label htmlFor="gallery-sort" className="mb-2 block text-sm text-emerald">Arrange the gallery</label><select id="gallery-sort" value={filters.sort} onChange={event => change({ sort: event.target.value as GalleryFilters["sort"] })} className="min-h-[48px] w-full rounded-full border border-emerald/60 bg-cream px-4 text-base sm:min-w-[205px]">{SORT_OPTIONS.map(option => <option key={option.value} value={option.value}>{option.label}</option>)}</select></div>
          <button type="button" aria-pressed={filters.available} onClick={() => change({ available: !filters.available })} className={`${button} ${filters.available ? selected : unselected}`}>Available only</button>
          <button type="button" aria-pressed={filters.saved} onClick={() => change({ saved: !filters.saved })} className={`${button} ${filters.saved ? selected : unselected}`}>Saved pieces{ready ? ` (${favorites.length})` : ""}</button>
        </div>
      </div>
      {active && <button type="button" className="mt-3 min-h-[44px] px-2 text-sm text-emerald underline underline-offset-4" onClick={() => change(DEFAULT_FILTERS)}>Reset filters</button>}
    </div>
    <div className="my-6 flex flex-wrap items-center justify-between gap-3 text-sm text-charcoal-muted">
      <p role="status" aria-live="polite" aria-atomic="true">{!hydrated ? `${products.length} pieces in the gallery` : `${filtered.length} ${filtered.length === 1 ? "piece" : "pieces"} ${filters.saved ? "saved on this device" : "to discover"}`}</p>
      <button type="button" onClick={copyCollection} className="min-h-[44px] text-emerald underline underline-offset-4">{copied ? "Link copied" : "Copy gallery link"}</button>
    </div>
    {filters.saved && <p className="mb-6 text-sm text-charcoal-muted">Your saved pieces stay in this browser. Sharing a gallery link shares the filters, not your personal saved list.</p>}
    {filtered.length ? <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3" aria-label="Glassware collection">{filtered.map(product => <ProductCard key={product.id} product={product} />)}</div> : <div className="rounded-lg border border-emerald/15 bg-white/60 px-6 py-14 text-center"><h2 className="font-serif text-2xl text-emerald">{filters.saved && !favorites.length ? "A place for your favorites" : "Let’s look a little wider"}</h2><p className="mx-auto mt-3 max-w-md text-charcoal-muted">{filters.saved && !favorites.length ? "Tap the heart on any piece to keep it here. No account needed." : "No pieces match this combination. Clear the filters to see the collection again."}</p><button type="button" onClick={() => change(DEFAULT_FILTERS)} className="mt-6 min-h-[48px] rounded-full bg-emerald px-7 py-3 text-cream">Browse all pieces</button></div>}
  </div>;
}
