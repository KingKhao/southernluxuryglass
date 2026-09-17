"use client";

import { useCallback, useEffect, useState } from "react";
import { useModalA11y } from "@/hooks/useModalA11y";

export default function ImageLightbox({
  images,
  initialIndex,
  alt,
  onClose,
}: {
  images: string[];
  initialIndex: number;
  alt: string;
  onClose: () => void;
}) {
  const [index, setIndex] = useState(initialIndex);
  const close = useCallback(() => onClose(), [onClose]);
  const containerRef = useModalA11y(true, close);

  const prev = useCallback(() => setIndex((i) => (i - 1 + images.length) % images.length), [images.length]);
  const next = useCallback(() => setIndex((i) => (i + 1) % images.length), [images.length]);

  // Arrow-key browsing, on top of the Escape/Tab handling useModalA11y
  // already provides.
  useEffect(() => {
    if (images.length <= 1) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") prev();
      else if (e.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [images.length, prev, next]);

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-charcoal/90 p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={`${alt} — photo ${index + 1} of ${images.length}`}
    >
      <div ref={containerRef} className="relative flex max-h-[90vh] w-full max-w-3xl items-center justify-center" onClick={(e) => e.stopPropagation()}>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          data-modal-close
          className="absolute right-0 top-0 z-10 flex h-11 w-11 items-center justify-center text-2xl leading-none text-cream/80 hover:text-cream focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-light"
        >
          ×
        </button>

        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={images[index]}
          alt={`${alt} — photo ${index + 1} of ${images.length}`}
          className="max-h-[80vh] w-auto rounded-md object-contain"
        />

        {images.length > 1 && (
          <>
            <button
              type="button"
              onClick={prev}
              aria-label="Previous photo"
              className="absolute left-2 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-charcoal/60 text-2xl text-cream hover:bg-charcoal/80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-light"
            >
              ‹
            </button>
            <button
              type="button"
              onClick={next}
              aria-label="Next photo"
              className="absolute right-2 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-charcoal/60 text-2xl text-cream hover:bg-charcoal/80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-light"
            >
              ›
            </button>
            <p className="absolute bottom-2 left-1/2 -translate-x-1/2 rounded-full bg-charcoal/60 px-3 py-1 text-xs text-cream">
              {index + 1} / {images.length}
            </p>
          </>
        )}
      </div>
    </div>
  );
}
