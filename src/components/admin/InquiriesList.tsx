"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

type Inquiry = {
  id: string;
  productName: string;
  name: string;
  phone: string;
  email: string;
  message: string;
  createdAt: string;
};

export default function InquiriesList({ inquiries }: { inquiries: Inquiry[] }) {
  const router = useRouter();
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [pin, setPin] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const confirmDelete = async (id: string) => {
    setBusy(true);
    setError(null);
    try {
      const res = await fetch(`/api/admin/inquiries/${id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pin }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error || "Failed to delete.");
        return;
      }
      setDeletingId(null);
      setPin("");
      router.refresh();
    } finally {
      setBusy(false);
    }
  };

  if (inquiries.length === 0) {
    return (
      <p className="rounded-lg border border-emerald/15 bg-white/60 px-4 py-6 text-center text-charcoal/60">
        No inquiries yet.
      </p>
    );
  }

  return (
    <div className="space-y-4">
      {inquiries.map((iq) => (
        <div key={iq.id} className="rounded-lg border border-emerald/15 bg-white/70 p-4">
          <div className="flex flex-wrap items-start justify-between gap-2">
            <div>
              <p className="font-medium text-charcoal">
                {iq.name}{" "}
                <span className="text-sm font-normal text-charcoal/50">
                  · about {iq.productName}
                </span>
              </p>
              <p className="text-sm text-charcoal/70">
                <a href={`mailto:${iq.email}`} className="text-emerald hover:underline">
                  {iq.email}
                </a>{" "}
                ·{" "}
                <a href={`tel:${iq.phone}`} className="text-emerald hover:underline">
                  {iq.phone}
                </a>
              </p>
            </div>
            <span className="text-xs text-charcoal/40">
              {new Date(iq.createdAt).toLocaleString()}
            </span>
          </div>
          <p className="mt-3 whitespace-pre-wrap text-sm text-charcoal/80">{iq.message}</p>

          <div className="mt-3 flex items-center gap-2">
            {deletingId === iq.id ? (
              <>
                <input
                  type="password"
                  inputMode="numeric"
                  placeholder="4-digit PIN"
                  value={pin}
                  onChange={(e) => setPin(e.target.value)}
                  className="w-28 rounded-md border border-emerald/30 bg-white px-2 py-1 text-sm"
                />
                <button
                  type="button"
                  onClick={() => confirmDelete(iq.id)}
                  disabled={busy}
                  className="rounded-full bg-red-700 px-3 py-1 text-sm text-white disabled:opacity-50"
                >
                  {busy ? "Deleting…" : "Confirm delete"}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setDeletingId(null);
                    setPin("");
                    setError(null);
                  }}
                  className="text-sm text-charcoal/60 hover:underline"
                >
                  Cancel
                </button>
                {error && <span className="text-sm text-red-700">{error}</span>}
              </>
            ) : (
              <button
                type="button"
                onClick={() => {
                  setDeletingId(iq.id);
                  setError(null);
                }}
                className="text-sm text-red-700 hover:underline"
              >
                Delete
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
