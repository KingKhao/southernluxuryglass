"use client";

import { useEffect, useState } from "react";
import SignupForm from "@/components/SignupForm";

const STORAGE_KEY = "slg_signup_dismissed";

export default function SignupPopup() {
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

    // Trigger 2: scrolling to the Upcoming Live Shows section.
    let observer: IntersectionObserver | null = null;
    const target = document.getElementById("live-shows");
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
  }, []);

  const persistDismissed = () => {
    if (typeof window !== "undefined") localStorage.setItem(STORAGE_KEY, "1");
  };
  const dismiss = () => {
    persistDismissed();
    setOpen(false);
  };

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") dismiss();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-charcoal/50 p-4"
      onClick={dismiss}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="relative w-full max-w-md rounded-lg bg-cream p-6 text-center shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={dismiss}
          aria-label="Close"
          className="absolute right-3 top-2 text-2xl leading-none text-charcoal/50 hover:text-charcoal"
        >
          ×
        </button>
        <h2 className="font-serif text-2xl text-emerald">
          Be the first to see new pieces
        </h2>
        <p className="mx-auto mt-2 max-w-sm text-sm text-charcoal/70">
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
