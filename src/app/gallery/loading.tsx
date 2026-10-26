export default function GalleryLoading() {
  return <div className="mx-auto max-w-6xl px-6 py-16" role="status" aria-live="polite" aria-busy="true"><p className="font-serif text-2xl text-emerald">Opening the gallery…</p><p className="mt-3 text-charcoal-muted">Making room for the collection.</p><div className="mt-10 grid gap-6 sm:grid-cols-3" aria-hidden="true">{[0,1,2].map(index=><div key={index} className="aspect-[4/5] animate-pulse rounded-lg bg-emerald/10"/>)}</div></div>;
}
