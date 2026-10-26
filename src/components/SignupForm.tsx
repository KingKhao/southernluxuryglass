"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { SMS_CONSENT_VERSION } from "@/lib/legal";
import SmsConsentModal from "@/components/SmsConsentModal";

const ASKED_KEY = "slg_sms_consent_asked";
const VALUE_KEY = "slg_sms_consent_value";

export default function SignupForm({
  onDone,
  compact = false,
  onDark = false,
}: {
  onDone?: () => void;
  compact?: boolean;
  /** True when this form sits directly on a solid-emerald background (the
   * homepage signup section) rather than inside a cream/white modal card —
   * secondary text needs light-on-dark colors there instead of the usual
   * dark-on-light ones. */
  onDark?: boolean;
}) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [smsConsent, setSmsConsent] = useState(false);
  const [consentDecided, setConsentDecided] = useState(false);
  const [showConsentModal, setShowConsentModal] = useState(false);
  const [companyWebsite, setCompanyWebsite] = useState(""); // honeypot — real visitors never see or fill this
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  // The consent popup should only ever interrupt a visitor once, ever — read
  // their prior answer (if any) so a returning visitor sees their existing
  // choice instead of being asked again.
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const asked = window.localStorage.getItem(ASKED_KEY) === "1";
      if (asked) {
        setConsentDecided(true);
        setSmsConsent(window.localStorage.getItem(VALUE_KEY) === "true");
      }
    } catch {
      // Private browsing / storage disabled — fall back to asking once per page load.
    }
  }, []);

  const decideConsent = (value: boolean) => {
    setSmsConsent(value);
    setConsentDecided(true);
    setShowConsentModal(false);
    try {
      window.localStorage.setItem(ASKED_KEY, "1");
      window.localStorage.setItem(VALUE_KEY, value ? "true" : "false");
    } catch {
      // Fine if this doesn't persist — the in-memory state still governs this submission.
    }
  };

  const onPhoneBlur = () => {
    if (!consentDecided && phone.replace(/\D/g, "").length >= 7) {
      setShowConsentModal(true);
    }
  };

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
  const mutedText = onDark ? "text-cream/80" : "text-charcoal-muted";
  const linkText = onDark ? "text-cream/80 hover:text-cream" : "text-charcoal-muted hover:text-charcoal";
  const errorText = onDark ? "text-error-light" : "text-error";

  if (done) {
    return (
      <p className="font-serif text-lg text-emerald" role="status">
        Your signup is saved. Crystal manages announcements personally; this form does not send a message.
      </p>
    );
  }

  return (
    <>
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
          placeholder="Your name" aria-label="Your name" maxLength={200}
          value={name}
          onChange={(e) => setName(e.target.value)}
          className={field}
        />
        <input
          required
          type="email"
          placeholder="Email address" aria-label="Email address" maxLength={254}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={field}
        />
        <input
          type="tel"
          placeholder="Phone number (optional)" aria-label="Phone number (optional)" maxLength={40}
          aria-describedby="signup-phone-hint"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          onBlur={onPhoneBlur}
          className={field}
        />
        <p id="signup-phone-hint" className={`text-xs ${mutedText}`}>
          {consentDecided ? (
            <>
              {smsConsent ? "✓ Text preference saved. Text delivery is not enabled yet." : "Texting is off."}{" "}
              <button
                type="button"
                onClick={() => setShowConsentModal(true)}
                className="underline"
              >
                Change
              </button>
            </>
          ) : (
            "Phone is optional. If provided, it is saved with your signup; texting requires your separate choice."
          )}
        </p>

        {error && (
          <p className={`text-sm ${errorText}`} role="alert">
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
        <p className={`text-center text-xs ${mutedText}`}>
          By submitting, you agree to our{" "}
          <Link href="/terms" className={`underline ${linkText}`}>
            Terms
          </Link>{" "}
          and{" "}
          <Link href="/privacy" className={`underline ${linkText}`}>
            Privacy Policy
          </Link>
          .
        </p>
      </form>

      {showConsentModal && (
        <SmsConsentModal onAgree={() => decideConsent(true)} onDecline={() => decideConsent(false)} />
      )}
    </>
  );
}
