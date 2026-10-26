"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useModalA11y } from "@/hooks/useModalA11y";

export default function ImageLightbox({ images, initialIndex, alt, onClose }: { images: string[]; initialIndex: number; alt: string; onClose: () => void }) {
  const [index, setIndex] = useState(Math.min(Math.max(initialIndex, 0), Math.max(0, images.length - 1)));
  const [zoomed, setZoomed] = useState(false);
  const [failed, setFailed] = useState(false);
  const touch = useRef<{ id: number; x: number; y: number } | null>(null);
  const suppressClick = useRef(false);
  const close = useCallback(() => onClose(), [onClose]);
  const containerRef = useModalA11y(true, close);
  const select = useCallback((value: number) => { setIndex((value + images.length) % images.length); setZoomed(false); setFailed(false); }, [images.length]);
  const prev = useCallback(() => select(index - 1), [index, select]);
  const next = useCallback(() => select(index + 1), [index, select]);
  useEffect(() => {
    const clearTouch = () => {touch.current=null;};
    const keydown = (event: KeyboardEvent) => {
      if (images.length <= 1) return;
      if (event.key === "ArrowLeft") {event.preventDefault(); prev();}
      if (event.key === "ArrowRight") {event.preventDefault(); next();}
    };
    window.addEventListener("keydown", keydown);
    window.addEventListener("blur", clearTouch);
    return () => {window.removeEventListener("keydown", keydown);window.removeEventListener("blur",clearTouch);};
  }, [images.length, prev, next]);

  return <div className="slg-overlay fixed inset-0 z-[60] bg-charcoal/95 p-3 sm:p-6" onClick={onClose} role="dialog" aria-modal="true" aria-label={`${alt} — photo ${index + 1} of ${images.length}`}>
    <div ref={containerRef} className="slg-lightbox relative mx-auto flex h-full max-h-[94dvh] max-w-5xl flex-col rounded-lg bg-charcoal text-cream" onClick={event => event.stopPropagation()}>
      <div className="flex shrink-0 items-center justify-between gap-4 border-b border-cream/15 px-3 py-2 sm:px-5"><div className="min-w-0"><h2 className="font-serif text-base sm:text-xl">{alt}</h2><p className="mt-1 text-sm text-cream/80">Photo {index+1} of {images.length} · {zoomed ? "Scroll to inspect the details" : images.length > 1 ? "Swipe or use the arrows to explore" : "A closer look at the details"}</p></div><button type="button" onClick={onClose} aria-label="Close photo viewer" data-modal-close className="h-11 w-11 shrink-0 rounded-full text-2xl hover:bg-cream/10">×</button></div>
      <div className={`relative min-h-0 flex-1 ${zoomed ? "overflow-auto" : "overflow-hidden"}`}
        onPointerDown={event => {if(!event.isPrimary){touch.current=null;return;} if(event.pointerType === "touch" && !zoomed){suppressClick.current=false;touch.current={id:event.pointerId,x:event.clientX,y:event.clientY};}}}
        onPointerCancel={() => {touch.current=null;}}
        onLostPointerCapture={() => {touch.current=null;}}
        onPointerUp={event => {const start=touch.current;touch.current=null;if(!start || start.id!==event.pointerId || zoomed || images.length<2)return;const dx=event.clientX-start.x,dy=event.clientY-start.y;if(Math.abs(dx)>55 && Math.abs(dx)>Math.abs(dy)*1.5){suppressClick.current=true;if(dx<0)next();else prev();}}}
        style={{touchAction: zoomed ? "auto" : "pan-y pinch-zoom"}}>
        {failed ? <div className="flex h-full flex-col items-center justify-center gap-4 px-8 text-center"><p>This photo couldn’t load. You can try it again or browse another view.</p><button type="button" className="min-h-[44px] rounded-full border border-cream px-5" onClick={() => setFailed(false)}>Retry photo</button></div> : <button type="button" aria-label={zoomed ? "Zoom out photo" : "Zoom in photo"} aria-pressed={zoomed} onClick={() => {if(suppressClick.current){suppressClick.current=false;return;}setZoomed(value=>!value);}} className={`block ${zoomed ? "min-h-full min-w-full cursor-zoom-out" : "h-full w-full cursor-zoom-in"}`}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={images[index]} alt={`${alt} — photo ${index+1} of ${images.length}`} onError={() => setFailed(true)} className={zoomed ? "mx-auto block w-auto max-w-none" : "mx-auto h-full max-h-full w-full object-contain"} draggable={false}/>
        </button>}
      </div>
      <div className="flex shrink-0 items-center justify-center gap-3 border-t border-cream/15 p-3">
        {images.length > 1 && <button type="button" onClick={prev} aria-label="Previous photo" className="h-11 w-11 shrink-0 rounded-full border border-cream/40 text-2xl">‹</button>}
        <button type="button" onClick={() => setZoomed(value=>!value)} disabled={failed} className="min-h-[44px] shrink-0 rounded-full border border-cream/40 px-5 text-sm">{zoomed ? "Fit photo" : "Zoom in"}</button>
        {images.length > 1 && <button type="button" onClick={next} aria-label="Next photo" className="h-11 w-11 shrink-0 rounded-full border border-cream/40 text-2xl">›</button>}
      </div>
      {images.length > 1 && <div className="flex shrink-0 justify-start gap-2 overflow-x-auto px-4 pb-4" aria-label="Choose a photo">{images.map((image,i)=><button key={`${image}-${i}`} type="button" onClick={() => select(i)} aria-label={`Show photo ${i+1}`} aria-pressed={i===index} className={`h-14 w-14 shrink-0 overflow-hidden rounded border-2 ${i===index ? "border-gold-light" : "border-transparent opacity-60"}`}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={image} alt="" className="h-full w-full object-cover"/>
      </button>)}</div>}
    </div>
  </div>;
}
