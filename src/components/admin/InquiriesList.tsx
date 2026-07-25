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
  status: "NEW" | "SERIOUS_BUYER";
  createdAt: string;
};

const STATUS_LABEL: Record<Inquiry["status"], string> = {
  NEW: "New",
  SERIOUS_BUYER: "Serious Buyer",
};

export default function InquiriesList({ inquiries }: { inquiries: Inquiry[] }) {
  const router = useRouter();
  const [confirmingId, setConfirmingId] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);

  const setStatus = async (id: string, status: Inquiry["status"]) => {
    setBusyId(id);
    try {
      await fetch(`/api/admin/inquiries/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      router.refresh();
    } finally {
      setBusyId(null);
    }
  };

  const remove = async (id: string) => {
    setBusyId(id);
    try {
      const res = await fetch(`/api/admin/inquiries/${id}`, { method: "DELETE" });
      if (res.ok) {
        setConfirmingId(null);
        router.refresh();
      }
    } finally {
      setBusyId(null);
    }
  };

  if (inquiries.length === 0) {
    return (
      <p className="rounded-lg border border-emerald/15 bg-white/60 px-4 py-6 text-center text-charcoal/60">
        No inquiries here yet.
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
            <div className="flex items-center gap-2">
              <span
                className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                  iq.status === "SERIOUS_BUYER"
                    ? "bg-gold/20 text-gold-dark"
                    : "bg-emerald/10 text-emerald"
                }`}
              >
                {STATUS_LABEL[iq.status]}
              </span>
              <span className="text-xs text-charcoal/40">
                {new Date(iq.createdAt).toLocaleString()}
              </span>
            </div>
          </div>

          <p className="mt-3 whitespace-pre-wrap text-sm text-charcoal/80">{iq.message}</p>

          <div className="mt-3 flex flex-wrap items-center gap-2">
            {iq.status === "NEW" ? (
              <button
                type="button"
                onClick={() => setStatus(iq.id, "SERIOUS_BUYER")}
                disabled={busyId === iq.id}
                className="rounded-full border border-gold px-3 py-1 text-sm text-gold-dark hover:bg-gold/10 disabled:opacity-50"
              >
                Mark as Serious Buyer
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setStatus(iq.id, "NEW")}
                disabled={busyId === iq.id}
                className="rounded-full border border-emerald/40 px-3 py-1 text-sm text-emerald hover:bg-emerald/10 disabled:opacity-50"
              >
                Move back to New
              </button>
            )}

            <span className="mx-1 text-charcoal/20">|</span>

            {confirmingId === iq.id ? (
              <>
                <span className="text-sm text-charcoal/70">Delete this inquiry?</span>
                <button
                  type="button"
                  onClick={() => remove(iq.id)}
                  disabled={busyId === iq.id}
                  className="rounded-full bg-red-700 px-3 py-1 text-sm text-white disabled:opacity-50"
                >
                  {busyId === iq.id ? "Deleting…" : "Yes, delete"}
                </button>
                <button
                  type="button"
                  onClick={() => setConfirmingId(null)}
                  className="text-sm text-charcoal/60 hover:underline"
                >
                  Cancel
                </button>
              </>
            ) : (
              <button
                type="button"
                onClick={() => setConfirmingId(iq.id)}
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
