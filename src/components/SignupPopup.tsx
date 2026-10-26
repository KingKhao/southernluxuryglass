"use client";

import { useCallback, useEffect, useState } from "react";
import SignupForm from "@/components/SignupForm";
import { useModalA11y } from "@/hooks/useModalA11y";

const STORAGE_KEY = "slg_signup_dismissed";
export default function SignupPopup({ hasLiveShows = true }: { hasLiveShows?: boolean }) {
  const [invited, setInvited] = useState(false);
  const [open, setOpen] = useState(false);
  const persistDismissed = useCallback(() => {try {localStorage.setItem(STORAGE_KEY,"1");} catch { /* Dismissal still works for this page visit. */ }}, []);
  const dismiss = useCallback(() => {persistDismissed();setOpen(false);setInvited(false);}, [persistDismissed]);
  const containerRef = useModalA11y(open, dismiss);
  useEffect(() => {
    try {if(localStorage.getItem(STORAGE_KEY))return;} catch { /* Storage is optional. */ }
    let shown=false;
    const show = () => {if(!shown){shown=true;setInvited(true);}};
    const timer=window.setTimeout(show,15000);
    const target=hasLiveShows?document.getElementById("live-shows"):null;
    const observer=target && "IntersectionObserver" in window ? new IntersectionObserver(entries=>{if(entries.some(entry=>entry.isIntersecting))show();},{threshold:.2}):null;
    if(target)observer?.observe(target);
    return ()=>{window.clearTimeout(timer);observer?.disconnect();};
  },[hasLiveShows]);

  if(!invited && !open)return null;
  if(!open)return <aside aria-label="New pieces invitation" className="slg-invitation fixed bottom-4 right-4 z-40 max-w-[calc(100%_-_2rem)] rounded-lg border border-emerald/20 bg-cream p-5 pr-14 shadow-lg sm:max-w-sm"><button type="button" onClick={dismiss} aria-label="Dismiss new pieces invitation" className="absolute right-1 top-1 h-11 w-11 text-2xl text-emerald">×</button><h2 className="font-serif text-xl text-emerald">A first look at new pieces</h2><p className="mt-2 text-sm text-charcoal-muted">Join Crystal’s list when you’re ready.</p><button type="button" onClick={()=>setOpen(true)} className="mt-4 min-h-[44px] rounded-full bg-emerald px-6 py-2 text-sm text-cream">Get early access</button></aside>;
  return <div className="slg-overlay fixed inset-0 z-50 flex items-center justify-center bg-charcoal/50 p-4" onClick={dismiss} role="dialog" aria-modal="true" aria-labelledby="signup-popup-title"><div ref={containerRef} className="slg-dialog relative max-h-[90dvh] w-full max-w-md overflow-y-auto rounded-lg bg-cream p-6 text-center shadow-xl" onClick={event=>event.stopPropagation()}><button type="button" onClick={dismiss} aria-label="Close" data-modal-close className="absolute right-1 top-1 flex h-11 w-11 items-center justify-center text-2xl text-charcoal-muted">×</button><h2 id="signup-popup-title" className="pr-6 font-serif text-2xl text-emerald">Be the first to see new pieces</h2><p className="mx-auto mt-2 max-w-sm text-sm text-charcoal-muted">Sign up for early access to new inventory before it hits the site.</p><div className="mt-5"><SignupForm compact onDone={persistDismissed}/></div></div></div>;
}
