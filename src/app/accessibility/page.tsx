import Link from "next/link";
import { SITE_NAME } from "@/lib/site";
import { LEGAL_LAST_UPDATED } from "@/lib/legal";

export const metadata = {
  title: "Accessibility Statement | Southern Luxury Glass",
};

export default function AccessibilityPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <h1 className="font-serif text-3xl text-emerald sm:text-4xl">Accessibility Statement</h1>
      <p className="mt-2 text-sm text-charcoal-muted">Last updated {LEGAL_LAST_UPDATED}</p>

      <div className="mt-8 space-y-6 text-charcoal-muted">
        <section>
          <p>
            {SITE_NAME} wants this site to be usable by everyone, including
            visitors using a keyboard, a screen reader, or who need higher
            color contrast or reduced motion. We aim to meet the Web Content
            Accessibility Guidelines (WCAG) 2.1 at Level AA.
          </p>
        </section>

        <section>
          <h2 className="font-serif text-xl text-emerald">What we&apos;ve done</h2>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            <li>Checked and corrected text/background color combinations for sufficient contrast.</li>
            <li>A visible focus outline on every interactive element when navigating by keyboard.</li>
            <li>
              Pop-up dialogs (the inquiry and signup forms) can be closed with the Escape key,
              keep keyboard focus contained while open, and return focus to where you were when
              closed.
            </li>
            <li>Labels on form fields, and status/error messages announced to screen readers.</li>
            <li>Respect for your device&apos;s reduced-motion setting.</li>
            <li>Touch targets sized for comfortable use on a phone.</li>
          </ul>
        </section>

        <section>
          <h2 className="font-serif text-xl text-emerald">What we haven&apos;t independently verified</h2>
          <p className="mt-2">
            The work above was done carefully, but this site has not yet
            been tested with real screen-reader software or reviewed by an
            independent accessibility auditor. We&apos;re describing what we
            believe to be true, not claiming full WCAG conformance.
          </p>
        </section>

        <section>
          <h2 className="font-serif text-xl text-emerald">Let us know</h2>
          <p className="mt-2">
            If you run into something on this site that&apos;s hard to use
            because of a disability, please tell us through the{" "}
            <Link href="/about" className="text-emerald underline hover:text-emerald-dark">
              Contact form on this site
            </Link>{" "}
            — we&apos;ll do our best to fix it.
          </p>
        </section>
      </div>
    </div>
  );
}
