"use client";

import Link from "next/link";

export default function GalleryError({ reset }: { reset: () => void }) {
  return <section className="mx-auto max-w-2xl px-6 py-20 text-center"><h1 className="font-serif text-3xl text-emerald">The gallery needs a moment</h1><p className="mt-4 text-charcoal-muted">The collection couldn’t load this time. Try again, or return to the home page to get in touch with Crystal.</p><div className="mt-8 flex flex-wrap justify-center gap-4"><button type="button" onClick={reset} className="min-h-[48px] rounded-full bg-emerald px-7 py-3 text-cream">Try the gallery again</button><Link href="/" className="inline-flex min-h-[48px] items-center rounded-full border border-emerald px-7 py-3 text-emerald">Back to the home page</Link></div></section>;
}
