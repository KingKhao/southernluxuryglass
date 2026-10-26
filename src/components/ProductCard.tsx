"use client";

import { useState } from "react";
import InquiryModal from "@/components/InquiryModal";
import ImageLightbox from "@/components/ImageLightbox";
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

// Whole-dollar prices read cleaner without a trailing ".00" ($119 vs
// $119.00); real cents still show ($119.50).
function formatPrice(price: number) {
  return Number.isInteger(price) ? `$${price}` : `$${price.toFixed(2)}`;
}

export default function ProductCard({ product }: { product: Product }) {
  const [open, setOpen] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [imageFailed, setImageFailed] = useState(false);
  const { isFavorite, toggleFavorite } = useFavorites();
  const cover = product.images[0];
  const extraCount = Math.max(0, product.images.length - 1);
  const isLong = product.description.length > 140;
  const status = product.status ?? "AVAILABLE";
  const saved = isFavorite(product.id);

  const details = [
    product.dimensions && { label: "Dimensions", value: product.dimensions },
    product.era && { label: "Era", value: product.era },
    product.condition && { label: "Condition", value: product.condition },
    product.maker && { label: "Maker", value: product.maker },
  ].filter((d): d is { label: string; value: string } => Boolean(d));

  return (
    <>
      <article className="slg-product flex flex-col overflow-hidden rounded-lg border border-emerald/15 bg-white/70 shadow-sm transition-shadow hover:shadow-md">
        {/* Tall portrait image — the star of the card */}
        <div className="relative aspect-[4/5] w-full overflow-hidden bg-ivory">
          {cover && !imageFailed ? (
            <button
              type="button"
              onClick={() => setLightboxOpen(true)}
              aria-label={
                extraCount > 0
                  ? `View all ${extraCount + 1} photos of ${product.name}`
                  : `View larger photo of ${product.name}`
              }
              className="block h-full w-full focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-emerald"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={cover}
                alt={product.name}
                loading="lazy"
                decoding="async"
                onError={() => setImageFailed(true)}
                className={`slg-product-image h-full w-full object-cover ${
                  status === "SOLD" ? "grayscale" : ""
                }`}
              />
            </button>
          ) : (
            <div className="flex h-full w-full flex-col items-center justify-center gap-2 text-emerald/40">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-10 w-10">
                <rect x="3" y="3" width="18" height="18" rx="2" />
                <circle cx="9" cy="9" r="2" />
                <path d="m21 15-5-5L5 21" />
              </svg>
              <span className="font-serif text-sm italic">{imageFailed ? "Photo unavailable" : "Photo coming soon"}</span>
              {imageFailed && <button type="button" onClick={() => setImageFailed(false)} className="min-h-[44px] px-4 text-sm text-emerald underline">Retry photo</button>}
            </div>
          )}

          <button
            type="button"
            onClick={() => toggleFavorite(product.id)}
            aria-label={saved ? `Remove ${product.name} from saved pieces` : `Save ${product.name}`}
            aria-pressed={saved}
            className="slg-save absolute left-2 top-2 flex h-11 w-11 items-center justify-center rounded-full bg-charcoal/70 text-white backdrop-blur-sm transition-colors hover:bg-charcoal/80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-light"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill={saved ? "currentColor" : "none"}
              stroke="currentColor"
              strokeWidth="1.75"
              className="h-5 w-5"
            >
              <path d="M12 21s-7.5-4.6-10-9.1C.5 8.6 2 5 5.5 5c2 0 3.5 1.2 4.5 2.7C11 6.2 12.5 5 14.5 5 18 5 19.5 8.6 22 11.9 14.5 16.4 12 21 12 21Z" />
            </svg>
          </button>

          {status !== "AVAILABLE" && (
            <span
              className={[
                "pointer-events-none absolute left-2 bottom-2 rounded-full px-3 py-1 text-xs font-medium uppercase tracking-wider",
                status === "SOLD" ? "bg-charcoal text-cream" : "bg-gold-deep text-cream",
              ].join(" ")}
            >
              {status === "SOLD" ? "Sold" : "Reserved"}
            </span>
          )}

          {extraCount > 0 && (
            <span className="pointer-events-none absolute bottom-2 right-2 rounded-full bg-charcoal/70 px-2 py-0.5 text-xs text-white">
              +{extraCount} more
            </span>
          )}
        </div>

        <div className="flex flex-1 flex-col gap-2 p-5">
          <h3 className="font-serif text-lg leading-snug text-emerald">{product.name}</h3>
          <p className="text-lg font-semibold text-gold-deep">{formatPrice(product.price)}</p>
          <span className="w-fit rounded-full bg-emerald/10 px-3 py-1 text-xs uppercase tracking-wider text-emerald">
            {product.category}
          </span>
          <div>
            <p
              className={`text-sm text-charcoal-muted ${
                isLong && !expanded ? "line-clamp-3" : ""
              }`}
            >
              {product.description}
            </p>
            {isLong && (
              <button
                type="button"
                onClick={() => setExpanded((v) => !v)}
                aria-expanded={expanded}
                className="mt-1 min-h-[44px] text-sm font-medium text-emerald hover:underline"
              >
                {expanded ? "Show less" : "Show more"}
              </button>
            )}
          </div>

          {details.length > 0 && (
            <dl className="grid grid-cols-2 gap-x-3 gap-y-1 border-t border-emerald/10 pt-2 text-xs text-charcoal-muted">
              {details.map((d) => (
                <div key={d.label}>
                  <dt className="inline font-medium text-emerald">{d.label}: </dt>
                  <dd className="inline">{d.value}</dd>
                </div>
              ))}
            </dl>
          )}

          <button
            type="button"
            onClick={() => setOpen(true)}
            disabled={status === "SOLD"}
            className="mt-auto min-h-[48px] w-full rounded-full border border-emerald px-4 py-2 text-center text-sm text-emerald transition-colors hover:bg-emerald hover:text-cream disabled:cursor-not-allowed disabled:border-charcoal/20 disabled:text-charcoal-muted disabled:hover:bg-transparent"
          >
            {status === "SOLD"
              ? "This Piece Has Sold"
              : status === "RESERVED"
              ? "Reserved — Inquire Anyway"
              : "Inquire About This Piece"}
          </button>
        </div>
      </article>

      {open && (
        <InquiryModal
          productName={product.name}
          productId={product.id}
          productPrice={product.price}
          productImage={cover}
          onClose={() => setOpen(false)}
        />
      )}

      {lightboxOpen && (
        <ImageLightbox
          images={product.images}
          initialIndex={0}
          alt={product.name}
          onClose={() => setLightboxOpen(false)}
        />
      )}
    </>
  );
}
