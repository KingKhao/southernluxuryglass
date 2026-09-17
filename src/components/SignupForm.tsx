"use client";

import { useState } from "react";
import Link from "next/link";
import { SMS_CONSENT_VERSION } from "@/lib/legal";

export default function SignupForm({
  onDone,
  compact = false,
}: {
  onDone?: () => void;
  compact?: boolean;
}) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [smsConsent, setSmsConsent] = useState(false);
  const [companyWebsite, setCompanyWebsite] = useState(""); // honeypot — real visitors never see or fill this
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch("/api/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          phone,
          smsConsent,
          smsConsentVersion: SMS_CONSENT_VERSION,
          companyWebsite,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Something went wrong. Please try again.");
        return;
      }
      setDone(true);
      onDone?.();
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const field =
    "w-full rounded-md border border-emerald/60 bg-white px-3 py-2 text-charcoal placeholder:text-charcoal-muted focus:border-emerald focus:outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald";

  if (done) {
    return (
      <p className="font-serif text-lg text-emerald" role="status">
        You&apos;re on the list! You&apos;ll be first to see new pieces. ✨
      </p>
    );
  }

  return (
    <form onSubmit={submit} className={`mx-auto ${compact ? "max-w-sm" : "max-w-md"} space-y-3`}>
      {/* Honeypot: invisible to real visitors, irresistible to simple bots. */}
      <div className="absolute left-[-9999px] h-px w-px overflow-hidden" aria-hidden="true">
        <label htmlFor="signup-company-website">Leave this field empty</label>
        <input
          id="signup-company-website"
          name="company_website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          value={companyWebsite}
          onChange={(e) => setCompanyWebsite(e.target.value)}
        />
      </div>

      <input
        required
        placeholder="Your name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className={field}
      />
      <input
        required
        type="email"
        placeholder="Email address"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className={field}
      />
      <input
        required
        type="tel"
        placeholder="Phone number"
        aria-describedby="signup-phone-hint"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        className={field}
      />
      <p id="signup-phone-hint" className="text-xs text-charcoal-muted">
        Your phone number is only used if you check the box below.
      </p>

      <label className="flex items-start gap-2 text-xs text-charcoal-muted">
        <input
          type="checkbox"
          checked={smsConsent}
          onChange={(e) => setSmsConsent(e.target.checked)}
          className="mt-0.5 h-4 w-4 rounded border-emerald/60"
        />
        <span>
          I agree to receive text messages about new inventory from Southern
          Luxury Glass. Message &amp; data rates may apply. Message frequency
          varies. Reply STOP to cancel, HELP for help. Consent isn&apos;t a
          condition of any purchase.
        </span>
      </label>

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
        {submitting ? "Signing you up…" : "Get Early Access"}
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
  );
}
