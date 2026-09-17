import Link from "next/link";
import { SITE_NAME, CURATOR_NAME } from "@/lib/site";
import { TERMS_VERSION, LEGAL_LAST_UPDATED } from "@/lib/legal";

export const metadata = {
  title: "Terms of Service | Southern Luxury Glass",
};

export default function TermsPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <div className="mb-8 rounded-lg border border-gold/40 bg-ivory p-4 text-sm text-charcoal-muted">
        <strong className="text-charcoal">DRAFT — attorney review required.</strong>{" "}
        These terms have not been reviewed by an attorney. Governing law,
        dispute resolution, and liability terms below use general placeholder
        language and should be confirmed for your state before this site
        handles real transactions.
      </div>

      <h1 className="font-serif text-3xl text-emerald sm:text-4xl">Terms of Service</h1>
      <p className="mt-2 text-sm text-charcoal-muted">
        Version {TERMS_VERSION} — Last updated {LEGAL_LAST_UPDATED}
      </p>

      <div className="mt-8 space-y-6 text-charcoal-muted">
        <section>
          <h2 className="font-serif text-xl text-emerald">About this site</h2>
          <p className="mt-2">
            {SITE_NAME} ({CURATOR_NAME}) operates this website as an online
            catalog of curated antique and vintage glassware. By using this
            site, you agree to these terms.
          </p>
        </section>

        <section>
          <h2 className="font-serif text-xl text-emerald">Inquiry only — no online purchases</h2>
          <p className="mt-2">
            Nothing on this site can be bought directly through it. Every
            piece shown is available by inquiry only: you send a message
            through the &ldquo;Inquire About This Piece&rdquo; form, and{" "}
            {CURATOR_NAME} follows up personally to discuss the piece,
            answer questions, and — if you both agree to proceed — arrange
            payment and delivery entirely outside of this website. Submitting
            an inquiry is not an offer, an order, or a reservation, and does
            not guarantee the piece is still available.
          </p>
        </section>

        <section>
          <h2 className="font-serif text-xl text-emerald">One-of-a-kind availability</h2>
          <p className="mt-2">
            Most pieces are one-of-a-kind antiques or vintage items. A piece
            may sell, become reserved, or be taken off the market at any
            time, including while your inquiry is pending.
          </p>
        </section>

        <section>
          <h2 className="font-serif text-xl text-emerald">Descriptions, condition &amp; pricing</h2>
          <p className="mt-2">
            We do our best to accurately describe each piece, including its
            condition, but antique and vintage items may have age-appropriate
            wear that isn&apos;t called out in every listing. Ask{" "}
            {CURATOR_NAME} any condition questions before agreeing to a sale.
            Prices shown are believed accurate at the time they&apos;re
            posted but may contain errors or change; we&apos;ll let you know
            before completing any sale if a price needs correcting.
          </p>
        </section>

        <section>
          <h2 className="font-serif text-xl text-emerald">Using this site</h2>
          <p className="mt-2">
            Please use the inquiry and signup forms honestly — don&apos;t
            submit false contact information, spam them, or use them to
            harass or abuse. We may decline to respond to, or may block,
            submissions that misuse these forms.
          </p>
        </section>

        <section>
          <h2 className="font-serif text-xl text-emerald">Intellectual property</h2>
          <p className="mt-2">
            The text, design, and photography on this site that belong to{" "}
            {SITE_NAME} may not be copied or reused without permission.
          </p>
        </section>

        <section>
          <h2 className="font-serif text-xl text-emerald">No warranty; limitation of liability</h2>
          <p className="mt-2">
            This site and the information on it are provided &ldquo;as
            is,&rdquo; without warranties of any kind, to the fullest extent
            the law allows. {SITE_NAME} is not liable for indirect,
            incidental, or consequential damages arising from your use of
            this site, to the fullest extent the law allows. (Placeholder —
            an attorney should confirm this section is enforceable and
            appropriately scoped for your state.)
          </p>
        </section>

        <section>
          <h2 className="font-serif text-xl text-emerald">Governing law</h2>
          <p className="mt-2">
            These terms are governed by the laws of [STATE — to be confirmed],
            without regard to conflict-of-law principles. (Placeholder —
            fill in once your business&apos;s home state is confirmed.)
          </p>
        </section>

        <section>
          <h2 className="font-serif text-xl text-emerald">Changes to these terms</h2>
          <p className="mt-2">
            If we make a material change to these terms, we&apos;ll update
            the version number and date above.
          </p>
        </section>

        <section>
          <h2 className="font-serif text-xl text-emerald">Contact us</h2>
          <p className="mt-2">
            Questions about these terms? Reach out through the{" "}
            <Link href="/about" className="text-emerald underline hover:text-emerald-dark">
              Contact form on this site
            </Link>
            . See also our{" "}
            <Link href="/privacy" className="text-emerald underline hover:text-emerald-dark">
              Privacy Policy
            </Link>
            .
          </p>
        </section>
      </div>
    </div>
  );
}
