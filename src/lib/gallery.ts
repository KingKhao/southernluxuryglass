export type GalleryProduct = {
  id: string; name: string; category: string; price: number; description: string; images: string[];
  status?: "AVAILABLE" | "RESERVED" | "SOLD";
  dimensions?: string | null; era?: string | null; condition?: string | null; maker?: string | null;
};
export const SORT_OPTIONS = [
  { value: "newest", label: "Newest arrivals" },
  { value: "price-asc", label: "Price: low to high" },
  { value: "price-desc", label: "Price: high to low" },
  { value: "name", label: "Name: A–Z" },
] as const;
export type GallerySort = typeof SORT_OPTIONS[number]["value"];
export type GalleryFilters = { category: string; query: string; saved: boolean; available: boolean; sort: GallerySort };
export const DEFAULT_FILTERS: GalleryFilters = { category: "All", query: "", saved: false, available: false, sort: "newest" };
export function readGalleryFilters(params: URLSearchParams): GalleryFilters {
  const sort = params.get("sort");
  return { category: params.get("category") || "All", query: (params.get("q") || "").slice(0,150), saved: params.get("saved") === "1", available: params.get("available") === "1", sort: SORT_OPTIONS.some(option => option.value === sort) ? sort as GallerySort : "newest" };
}
export function filterGallery(products: GalleryProduct[], filters: GalleryFilters, favorites: string[]) {
  const terms = filters.query.trim().toLocaleLowerCase().split(/\s+/).filter(Boolean);
  const filtered = products.filter(product => {
    const text = [product.name, product.description, product.category, product.maker, product.era, product.condition].filter(Boolean).join(" ").toLocaleLowerCase();
    return (filters.category === "All" || product.category === filters.category) && terms.every(term => text.includes(term)) && (!filters.saved || favorites.includes(product.id)) && (!filters.available || (product.status ?? "AVAILABLE") === "AVAILABLE");
  });
  if (filters.sort === "price-asc") filtered.sort((a,b) => a.price-b.price);
  if (filters.sort === "price-desc") filtered.sort((a,b) => b.price-a.price);
  if (filters.sort === "name") filtered.sort((a,b) => a.name.localeCompare(b.name));
  return filtered;
}
export function galleryQuery(filters: GalleryFilters) {
  const params = new URLSearchParams();
  if (filters.category !== "All") params.set("category", filters.category);
  if (filters.query.trim()) params.set("q", filters.query);
  if (filters.saved) params.set("saved", "1");
  if (filters.available) params.set("available", "1");
  if (filters.sort !== "newest") params.set("sort", filters.sort);
  return params.toString();
}
