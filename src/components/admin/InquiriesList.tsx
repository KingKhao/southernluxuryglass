"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

type Status = "NEW" | "WORKING_LEAD" | "SERIOUS_BUYER";

type Inquiry = {
  id: string;
  productName: string;
  name: string;
  phone: string;
  email: string;
  message: string;
  status: Status;
  createdAt: string;
};

const STATUS_LABEL: Record<Status, string> = {
  NEW: "New",
  WORKING_LEAD: "Working Lead",
  SERIOUS_BUYER: "Serious Buyer",
};

const STATUS_BADGE: Record<Status, string> = {
  NEW: "bg-emerald/10 text-emerald",
  WORKING_LEAD: "bg-charcoal/10 text-charcoal/70",
  SERIOUS_BUYER: "bg-gold/20 text-gold-dark",
};

export default function InquiriesList({ inquiries }: { inquiries: Inquiry[] }) {
  const router = useRouter();
  const [confirmingId, setConfirmingId] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);

  const setStatus = async (id: string, status: Status) => {
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
                className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${STATUS_BADGE[iq.status]}`}
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
            {/* New → Working Lead or Serious Buyer; then free between those two.
                Never back to New. */}
            {iq.status !== "WORKING_LEAD" && (
              <button
                type="button"
                onClick={() => setStatus(iq.id, "WORKING_LEAD")}
                disabled={busyId === iq.id}
                className="rounded-full border border-charcoal/30 px-3 py-1 text-sm text-charcoal/70 hover:bg-charcoal/5 disabled:opacity-50"
              >
                Move to Working Lead
              </button>
            )}
            {iq.status !== "SERIOUS_BUYER" && (
              <button
                type="button"
                onClick={() => setStatus(iq.id, "SERIOUS_BUYER")}
                disabled={busyId === iq.id}
                className="rounded-full border border-gold px-3 py-1 text-sm text-gold-dark hover:bg-gold/10 disabled:opacity-50"
              >
                Move to Serious Buyer
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
