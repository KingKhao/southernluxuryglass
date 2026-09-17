"use client";

import { useEffect, useState } from "react";
import SignupForm from "@/components/SignupForm";
import { useModalA11y } from "@/hooks/useModalA11y";

const STORAGE_KEY = "slg_signup_dismissed";

export default function SignupPopup({ hasLiveShows = true }: { hasLiveShows?: boolean }) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    // Already dismissed or signed up on a previous visit? Never show again.
    if (typeof window === "undefined") return;
    if (localStorage.getItem(STORAGE_KEY)) return;

    let shown = false;
    const show = () => {
      if (shown) return;
      shown = true;
      setOpen(true);
      cleanup();
    };

    // Trigger 1: 15 seconds after load.
    const timer = window.setTimeout(show, 15000);

    // Trigger 2: scrolling to the Upcoming Live Shows section — skipped when
    // there are no upcoming shows, so the signup ask doesn't land right on
    // top of an empty "check back soon" state.
    let observer: IntersectionObserver | null = null;
    const target = hasLiveShows ? document.getElementById("live-shows") : null;
    if (target && "IntersectionObserver" in window) {
      observer = new IntersectionObserver(
        (entries) => {
          if (entries.some((e) => e.isIntersecting)) show();
        },
        { threshold: 0.2 }
      );
      observer.observe(target);
    }

    function cleanup() {
      window.clearTimeout(timer);
      observer?.disconnect();
    }
    return cleanup;
  }, [hasLiveShows]);

  const persistDismissed = () => {
    if (typeof window !== "undefined") localStorage.setItem(STORAGE_KEY, "1");
  };
  const dismiss = () => {
    persistDismissed();
    setOpen(false);
  };

  const containerRef = useModalA11y(open, dismiss);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-charcoal/50 p-4"
      onClick={dismiss}
      role="dialog"
      aria-modal="true"
      aria-labelledby="signup-popup-title"
    >
      <div
        ref={containerRef}
        className="relative w-full max-w-md rounded-lg bg-cream p-6 text-center shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={dismiss}
          aria-label="Close"
          data-modal-close
          className="absolute right-1 top-1 flex h-11 w-11 items-center justify-center text-2xl leading-none text-charcoal-muted hover:text-charcoal focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald"
        >
          ×
        </button>
        <h2 id="signup-popup-title" className="font-serif text-2xl text-emerald">
          Be the first to see new pieces
        </h2>
        <p className="mx-auto mt-2 max-w-sm text-sm text-charcoal-muted">
          Sign up for early access to new inventory before it hits the site.
        </p>
        <div className="mt-5">
          {/* Submitting marks it dismissed so it never reopens, but the popup
              stays to show the confirmation until the visitor closes it. */}
          <SignupForm compact onDone={persistDismissed} />
        </div>
      </div>
    </div>
  );
}
