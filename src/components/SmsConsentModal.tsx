"use client";

import { useModalA11y } from "@/hooks/useModalA11y";

export default function SmsConsentModal({
  onAgree,
  onDecline,
}: {
  onAgree: () => void;
  onDecline: () => void;
}) {
  const containerRef = useModalA11y(true, onDecline);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-charcoal/50 p-4"
      onClick={onDecline}
      role="dialog"
      aria-modal="true"
      aria-labelledby="sms-consent-title"
    >
      <div
        ref={containerRef}
        className="w-full max-w-sm rounded-lg bg-cream p-6 text-center shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 id="sms-consent-title" className="font-serif text-xl text-emerald">
          Want a text when something new comes in?
        </h2>
        <p className="mt-3 text-sm text-charcoal-muted">
          I agree to receive text messages about new inventory from Southern
          Luxury Glass. Message &amp; data rates may apply. Message frequency
          varies. Reply STOP to cancel, HELP for help. Consent isn&apos;t a
          condition of any purchase.
        </p>
        <div className="mt-5 flex flex-col gap-2">
          <button
            type="button"
            onClick={onAgree}
            className="w-full rounded-full bg-emerald px-6 py-2.5 text-cream transition-colors hover:bg-emerald-dark"
          >
            Yes, text me
          </button>
          <button
            type="button"
            onClick={onDecline}
            className="w-full rounded-full border border-emerald/60 px-6 py-2.5 text-emerald transition-colors hover:bg-emerald/10"
          >
            No thanks
          </button>
        </div>
      </div>
    </div>
  );
}
