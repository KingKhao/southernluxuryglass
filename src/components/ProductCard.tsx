"use client";

import { useState } from "react";
import InquiryModal from "@/components/InquiryModal";

type Product = {
  id: string;
  name: string;
  category: string;
  price: number;
  description: string;
  images: string[];
};

const PLACEHOLDER =
  "https://placehold.co/800x1000/E9E3D5/2F4A3D?font=playfair-display&text=Photo+Coming+Soon";

export default function ProductCard({ product }: { product: Product }) {
  const [open, setOpen] = useState(false);
  const cover = product.images[0] ?? PLACEHOLDER;
  const extraCount = Math.max(0, product.images.length - 1);

  return (
    <>
      <div className="flex flex-col overflow-hidden rounded-lg border border-emerald/15 bg-white/70 shadow-sm transition-shadow hover:shadow-md">
        {/* Tall portrait image — the star of the card */}
        <div className="relative aspect-[4/5] w-full overflow-hidden bg-ivory">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={cover}
            alt={product.name}
            className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
          />
          {extraCount > 0 && (
            <span className="absolute bottom-2 right-2 rounded-full bg-charcoal/70 px-2 py-0.5 text-xs text-white">
              +{extraCount} more
            </span>
          )}
        </div>

        <div className="flex flex-1 flex-col gap-2 p-5">
          <h3 className="font-serif text-lg leading-snug text-emerald">{product.name}</h3>
          <p className="text-lg font-semibold text-gold">${product.price.toFixed(2)}</p>
          <span className="w-fit rounded-full bg-emerald/10 px-3 py-1 text-xs uppercase tracking-wider text-emerald">
            {product.category}
          </span>
          <p className="line-clamp-3 text-sm text-charcoal/70">{product.description}</p>
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
    </>
  );
}
