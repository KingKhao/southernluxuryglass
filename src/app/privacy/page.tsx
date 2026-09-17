import Link from "next/link";
import { SITE_NAME, CURATOR_NAME } from "@/lib/site";
import { PRIVACY_POLICY_VERSION, LEGAL_LAST_UPDATED } from "@/lib/legal";

export const metadata = {
  title: "Privacy Policy | Southern Luxury Glass",
};

export default function PrivacyPolicyPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <div className="mb-8 rounded-lg border border-gold/40 bg-ivory p-4 text-sm text-charcoal-muted">
        <strong className="text-charcoal">DRAFT — attorney review required.</strong>{" "}
        This page describes this site&apos;s actual, current data practices as
        implemented in its code. It has not been reviewed by an attorney and
        has not been checked against the specific privacy laws of every state
        or country a visitor might be in (for example California&apos;s
        CCPA/CPRA or the EU/UK&apos;s GDPR). Have this reviewed by a qualified
        professional before relying on it.
      </div>

      <h1 className="font-serif text-3xl text-emerald sm:text-4xl">Privacy Policy</h1>
      <p className="mt-2 text-sm text-charcoal-muted">
        Version {PRIVACY_POLICY_VERSION} — Last updated {LEGAL_LAST_UPDATED}
      </p>

      <div className="mt-8 space-y-6 text-charcoal-muted">
        <section>
          <h2 className="font-serif text-xl text-emerald">Who we are</h2>
          <p className="mt-2">
            {SITE_NAME} is curated by {CURATOR_NAME}. This policy covers the{" "}
            {SITE_NAME} website only.
          </p>
        </section>

        <section>
          <h2 className="font-serif text-xl text-emerald">What we collect</h2>
          <p className="mt-2">
            We collect information you choose to give us, through two forms
            on this site:
          </p>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            <li>
              <strong className="text-charcoal">The &ldquo;Inquire About This Piece&rdquo; and
              &ldquo;Contact&rdquo; forms:</strong> your name, phone number,
              email address, and whatever message you write.
            </li>
            <li>
              <strong className="text-charcoal">The early-access signup form:</strong> your name,
              email address, and phone number, plus whether you checked the
              box agreeing to receive text messages about new inventory.
            </li>
          </ul>
          <p className="mt-2">
            We do not have visitor accounts or logins, so we do not collect a
            password or profile from you. We do not collect payment
            information — nothing on this site is purchased online; any sale
            is arranged directly with {CURATOR_NAME} after you inquire. We do
            not collect health, biometric, or precise location data.
          </p>
        </section>

        <section>
          <h2 className="font-serif text-xl text-emerald">Cookies &amp; tracking</h2>
          <p className="mt-2">
            This site uses one strictly-necessary cookie, used only to keep{" "}
            {CURATOR_NAME} signed in to the password-protected admin area she
            uses to manage the site. As of the date above, this site does not
            use advertising or analytics cookies, and does not run any
            advertising or analytics tracking pixels (Google, Meta, or
            otherwise). If that ever changes, we will update this policy —
            and where the law requires it, ask for your consent — before
            doing so.
          </p>
        </section>

        <section>
          <h2 className="font-serif text-xl text-emerald">How we use it</h2>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            <li>To respond to a question or inquiry you send us.</li>
            <li>
              To text or email you about new inventory — <strong className="text-charcoal">only</strong> if
              you opted in yourself via a checkbox on the signup form. We do
              not infer marketing consent just because you gave us a phone
              number to reply to an inquiry.
            </li>
            <li>To keep our own business and sales records.</li>
          </ul>
        </section>

        <section>
          <h2 className="font-serif text-xl text-emerald">Text messages</h2>
          <p className="mt-2">
            If you check the consent box on the signup form, we may send you
            text messages about new inventory. Message and data rates may
            apply. Message frequency varies. Reply STOP at any time to stop
            receiving texts, or HELP for help. Consent to receive texts is
            never a condition of any purchase.
          </p>
        </section>

        <section>
          <h2 className="font-serif text-xl text-emerald">Who we share it with</h2>
          <p className="mt-2">
            We do not sell your personal information, and we do not share it
            with advertisers. We use a small number of service providers to
            run this site, who process data on our behalf and are not
            permitted to use it for their own purposes:
          </p>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            <li>
              <strong className="text-charcoal">Vercel</strong> — hosts this website and stores
              uploaded photos.
            </li>
            <li>
              <strong className="text-charcoal">Neon</strong> — hosts the database that stores form
              submissions.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="font-serif text-xl text-emerald">How long we keep it</h2>
          <p className="mt-2">
            We keep inquiry and contact records for as long as reasonably
            needed to respond to you and to maintain our business and sales
            records, or until you ask us to delete them.
          </p>
        </section>

        <section>
          <h2 className="font-serif text-xl text-emerald">Your choices</h2>
          <p className="mt-2">
            You can ask us what we have on file for you, ask us to correct
            it, or ask us to delete it, by reaching out through the Contact
            form on this site. Because we&apos;re a small business without an
            automated self-service system, requests like this are handled by{" "}
            {CURATOR_NAME} personally. Depending on where you live, you may
            have additional legal rights (for example under California or
            European privacy law) that this site has not yet been formally
            reviewed against — an attorney should confirm what applies to
            your specific situation.
          </p>
        </section>

        <section>
          <h2 className="font-serif text-xl text-emerald">Children</h2>
          <p className="mt-2">
            This site is intended for a general adult audience and is not
            directed to children under 13. We do not knowingly collect
            personal information from children under 13.
          </p>
        </section>

        <section>
          <h2 className="font-serif text-xl text-emerald">Changes to this policy</h2>
          <p className="mt-2">
            If we make a material change to this policy, we&apos;ll update
            the version number and date above. If we materially change what
            the SMS consent checkbox means, we&apos;ll ask for your consent
            again rather than relying on an earlier answer.
          </p>
        </section>

        <section>
          <h2 className="font-serif text-xl text-emerald">Contact us</h2>
          <p className="mt-2">
            Questions about this policy, or a request about your data? Reach
            out through the{" "}
            <Link href="/about" className="text-emerald underline hover:text-emerald-dark">
              Contact form on this site
            </Link>
            .
          </p>
        </section>
      </div>
    </div>
  );
}
