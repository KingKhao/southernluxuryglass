"use client";

import { useCallback, useState } from "react";
import Link from "next/link";
import { useModalA11y } from "@/hooks/useModalA11y";

const MAX_MESSAGE = 2000;

export default function InquiryModal({
  productName,
  productId,
  general = false,
  onClose,
}: {
  productName: string;
  productId?: string;
  general?: boolean;
  onClose: () => void;
}) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState(
    general
      ? "Hi Crystal, I'd love to get in touch about "
      : `Hi Crystal, I'm interested in the "${productName}". Could you tell me more about it?`
  );
  const [companyWebsite, setCompanyWebsite] = useState(""); // honeypot — real visitors never see or fill this
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  const close = useCallback(() => onClose(), [onClose]);
  const containerRef = useModalA11y(true, close);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch("/api/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productName, productId, name, phone, email, message, companyWebsite }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Something went wrong. Please try again.");
        return;
      }
      setDone(true);
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const field =
    "mt-1 w-full rounded-md border border-emerald/60 bg-white px-3 py-2 text-charcoal focus:border-emerald focus:outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-charcoal/50 p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="iq-title"
    >
      <div
        ref={containerRef}
        className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-lg bg-cream p-6 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-start justify-between">
          <div>
            <h2 id="iq-title" className="font-serif text-xl text-emerald">
              {general ? "Contact Crystal" : "Inquire About This Piece"}
            </h2>
            {!general && <p className="text-sm text-charcoal-muted">{productName}</p>}
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            data-modal-close
            className="flex h-11 w-11 shrink-0 items-center justify-center text-2xl leading-none text-charcoal-muted hover:text-charcoal focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald"
          >
            ×
          </button>
        </div>

        {done ? (
          <div className="py-6 text-center" role="status">
            <p className="font-serif text-lg text-emerald">Thank you!</p>
            <p className="mt-2 text-sm text-charcoal-muted">
              {general
                ? "Your message has been sent to Crystal. She reads every message herself and can't wait to connect with you."
                : "Your inquiry has been sent to Crystal. She reads every message herself and would love to share more about this piece with you."}
            </p>
            <button
              type="button"
              onClick={onClose}
              className="mt-5 rounded-full bg-emerald px-6 py-2 text-cream hover:bg-emerald-dark"
            >
              Close
            </button>
          </div>
        ) : (
          <form onSubmit={submit} className="space-y-3">
            {/* Honeypot: invisible to real visitors, irresistible to simple bots. */}
            <div className="absolute left-[-9999px] h-px w-px overflow-hidden" aria-hidden="true">
              <label htmlFor="iq-company-website">Leave this field empty</label>
              <input
                id="iq-company-website"
                name="company_website"
                type="text"
                tabIndex={-1}
                autoComplete="off"
                value={companyWebsite}
                onChange={(e) => setCompanyWebsite(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm text-charcoal-muted" htmlFor="iq-name">
                Name
              </label>
              <input id="iq-name" required value={name} onChange={(e) => setName(e.target.value)} className={field} />
            </div>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div>
                <label className="block text-sm text-charcoal-muted" htmlFor="iq-phone">
                  Phone
                </label>
                <input
                  id="iq-phone"
                  type="tel"
                  required
                  aria-describedby="iq-phone-hint"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className={field}
                />
                <p id="iq-phone-hint" className="mt-1 text-xs text-charcoal-muted">
                  So Crystal can text you a couple of extra photos or details.
                </p>
              </div>
              <div>
                <label className="block text-sm text-charcoal-muted" htmlFor="iq-email">
                  Email
                </label>
                <input
                  id="iq-email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={field}
                />
              </div>
            </div>
            <div>
              <label className="block text-sm text-charcoal-muted" htmlFor="iq-message">
                Message
              </label>
              <textarea
                id="iq-message"
                required
                rows={5}
                maxLength={MAX_MESSAGE}
                value={message}
                onChange={(e) => setMessage(e.target.value.slice(0, MAX_MESSAGE))}
                className={field}
              />
              <p className="mt-1 text-right text-xs text-charcoal-muted">
                {message.length}/{MAX_MESSAGE}
              </p>
            </div>

            {error && (
              <p className="text-sm text-error" role="alert">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="w-full rounded-full bg-emerald px-6 py-2.5 text-cream transition-colors hover:bg-emerald-dark disabled:opacity-50"
            >
              {submitting ? "Sending…" : "Send Inquiry"}
            </button>
            <p className="text-center text-xs text-charcoal-muted">
              By submitting, you agree to our{" "}
              <Link href="/terms" className="underline hover:text-charcoal">
                Terms
              </Link>{" "}
              and{" "}
              <Link href="/privacy" className="underline hover:text-charcoal">
                Privacy Policy
              </Link>
              .
            </p>
          </form>
        )}
      </div>
    </div>
  );
}
