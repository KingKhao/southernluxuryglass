"use client";

import { useState } from "react";
import InquiryModal from "@/components/InquiryModal";

export default function ContactSection({
  heading = "Contact Me",
  blurb = "Have a question, a special request, or just want to say hello? Send Crystal a note.",
}: {
  heading?: string;
  blurb?: string;
}) {
  const [open, setOpen] = useState(false);

  return (
    <section className="mt-16 border-t border-emerald/10 bg-ivory px-6 py-14 text-center">
      <h2 className="font-serif text-2xl text-emerald">{heading}</h2>
      <p className="mx-auto mt-3 max-w-xl text-charcoal/70">{blurb}</p>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="mt-6 inline-block rounded-full bg-emerald px-8 py-3 text-cream transition-colors hover:bg-emerald-dark"
      >
        Contact Me
      </button>

      {open && (
        <InquiryModal productName="General inquiry" general onClose={() => setOpen(false)} />
      )}
    </section>
  );
}
