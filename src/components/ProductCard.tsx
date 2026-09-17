"use client";

import { useState } from "react";
import InquiryModal from "@/components/InquiryModal";
import ImageLightbox from "@/components/ImageLightbox";

type Product = {
  id: string;
  name: string;
  category: string;
  price: number;
  description: string;
  images: string[];
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
  const cover = product.images[0];
  const extraCount = Math.max(0, product.images.length - 1);
  const isLong = product.description.length > 140;

  return (
    <>
      <div className="flex flex-col overflow-hidden rounded-lg border border-emerald/15 bg-white/70 shadow-sm transition-shadow hover:shadow-md">
        {/* Tall portrait image — the star of the card */}
        <div className="relative aspect-[4/5] w-full overflow-hidden bg-ivory">
          {cover ? (
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
                className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
              />
            </button>
          ) : (
            <div className="flex h-full w-full flex-col items-center justify-center gap-2 text-emerald/40">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-10 w-10">
                <rect x="3" y="3" width="18" height="18" rx="2" />
                <circle cx="9" cy="9" r="2" />
                <path d="m21 15-5-5L5 21" />
              </svg>
              <span className="font-serif text-sm italic">Photo coming soon</span>
            </div>
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
                className="mt-1 text-sm font-medium text-emerald hover:underline"
              >
                {expanded ? "Show less" : "Show more"}
              </button>
            )}
          </div>
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="mt-auto w-full rounded-full border border-emerald px-4 py-2 text-center text-sm text-emerald transition-colors hover:bg-emerald hover:text-cream"
          >
            Inquire About This Piece
          </button>
        </div>
      </div>

      {open && (
        <InquiryModal
          productName={product.name}
          productId={product.id}
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
