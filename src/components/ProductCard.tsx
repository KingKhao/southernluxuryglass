import { INQUIRY_EMAIL } from "@/lib/site";

type Product = {
  id: string;
  name: string;
  category: string;
  price: number;
  description: string;
  images: string[];
};

const PLACEHOLDER =
  "https://placehold.co/800x600/E9E3D5/2F4A3D?font=playfair-display&text=Photo+Coming+Soon";

export default function ProductCard({ product }: { product: Product }) {
  const cover = product.images[0] ?? PLACEHOLDER;
  const extraCount = Math.max(0, product.images.length - 1);

  const mailto = `mailto:${INQUIRY_EMAIL}?subject=${encodeURIComponent(
    `Inquiry about "${product.name}"`
  )}&body=${encodeURIComponent(
    `Hi Crystal,\n\nI'm interested in the "${product.name}" (${product.category}, $${product.price}). Could you tell me more about it?\n\nThanks!`
  )}`;

  return (
    <div className="flex flex-col overflow-hidden rounded-lg border border-emerald/15 bg-white/70 shadow-sm transition-shadow hover:shadow-md">
      <div className="relative">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={cover} alt={product.name} className="h-56 w-full object-cover" />
        {extraCount > 0 && (
          <span className="absolute bottom-2 right-2 rounded-full bg-charcoal/70 px-2 py-0.5 text-xs text-white">
            +{extraCount} more
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col gap-2 p-5">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-serif text-lg text-emerald">{product.name}</h3>
          <span className="whitespace-nowrap text-sm font-semibold text-gold">
            ${product.price.toFixed(2)}
          </span>
        </div>
        <span className="w-fit rounded-full bg-emerald/10 px-3 py-1 text-xs uppercase tracking-wider text-emerald">
          {product.category}
        </span>
        <p className="text-sm text-charcoal/70">{product.description}</p>
        <a
          href={mailto}
          className="mt-auto inline-block rounded-full border border-emerald px-4 py-2 text-center text-sm text-emerald transition-colors hover:bg-emerald hover:text-cream"
        >
          Inquire About This Piece
        </a>
      </div>
    </div>
  );
}
