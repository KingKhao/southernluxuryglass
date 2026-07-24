"use client";

import { useState } from "react";

const MAX_MESSAGE = 2000;

export default function InquiryModal({
  productName,
  productId,
  onClose,
}: {
  productName: string;
  productId?: string;
  onClose: () => void;
}) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState(
    `Hi Crystal, I'm interested in the "${productName}". Could you tell me more about it?`
  );
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch("/api/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productName, productId, name, phone, email, message }),
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
    "mt-1 w-full rounded-md border border-emerald/30 bg-white px-3 py-2 text-charcoal focus:border-emerald focus:outline-none";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-charcoal/50 p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-lg bg-cream p-6 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-start justify-between">
          <div>
            <h2 className="font-serif text-xl text-emerald">Inquire About This Piece</h2>
            <p className="text-sm text-charcoal/60">{productName}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="text-2xl leading-none text-charcoal/50 hover:text-charcoal"
          >
            ×
          </button>
        </div>

        {done ? (
          <div className="py-6 text-center">
            <p className="font-serif text-lg text-emerald">Thank you!</p>
            <p className="mt-2 text-sm text-charcoal/70">
              Your inquiry has been sent to Crystal. She&apos;ll be in touch soon.
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
            <div>
              <label className="block text-sm text-charcoal/70" htmlFor="iq-name">
                Name
              </label>
              <input id="iq-name" required value={name} onChange={(e) => setName(e.target.value)} className={field} />
            </div>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div>
                <label className="block text-sm text-charcoal/70" htmlFor="iq-phone">
                  Phone
                </label>
                <input
                  id="iq-phone"
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className={field}
                />
              </div>
              <div>
                <label className="block text-sm text-charcoal/70" htmlFor="iq-email">
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
              <label className="block text-sm text-charcoal/70" htmlFor="iq-message">
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
              <p className="mt-1 text-right text-xs text-charcoal/40">
                {message.length}/{MAX_MESSAGE}
              </p>
            </div>

            {error && <p className="text-sm text-red-700">{error}</p>}

            <button
              type="submit"
              disabled={submitting}
              className="w-full rounded-full bg-emerald px-6 py-2.5 text-cream transition-colors hover:bg-emerald-dark disabled:opacity-50"
            >
              {submitting ? "Sending…" : "Send Inquiry"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
