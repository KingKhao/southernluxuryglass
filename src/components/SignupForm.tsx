"use client";

import { useState } from "react";

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
        body: JSON.stringify({ name, email, phone }),
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
    "w-full rounded-md border border-emerald/30 bg-white px-3 py-2 text-charcoal placeholder:text-charcoal-muted focus:border-emerald focus:outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald";

  if (done) {
    return (
      <p className="font-serif text-lg text-emerald">
        You&apos;re on the list! You&apos;ll be first to see new pieces. ✨
      </p>
    );
  }

  return (
    <form onSubmit={submit} className={`mx-auto ${compact ? "max-w-sm" : "max-w-md"} space-y-3`}>
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
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        className={field}
      />
      {error && <p className="text-sm text-red-700">{error}</p>}
      <button
        type="submit"
        disabled={submitting}
        className="w-full rounded-full bg-emerald px-6 py-2.5 text-cream transition-colors hover:bg-emerald-dark disabled:opacity-50"
      >
        {submitting ? "Signing you up…" : "Get Early Access"}
      </button>
    </form>
  );
}
