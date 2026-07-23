import Link from "next/link";
import { SITE_NAME, SOCIAL_LINKS } from "@/lib/site";

export default function Footer() {
  return (
    <footer className="border-t border-emerald/10 bg-emerald text-cream">
      <div className="mx-auto max-w-6xl px-6 py-12">
        <div className="flex flex-col gap-8 md:flex-row md:items-start md:justify-between">
          <div>
            <p className="font-serif text-lg">{SITE_NAME}</p>
            <p className="mt-2 max-w-sm text-sm text-cream/70">
              Curated antique &amp; vintage glassware, sold with care and a
              little bit of Southern charm.
            </p>
          </div>

          <div>
            <p className="text-xs uppercase tracking-wider text-cream/50">
              Follow &amp; Watch Live
            </p>
            <ul className="mt-3 space-y-2 text-sm">
              {SOCIAL_LINKS.map((social) => (
                <li key={social.name}>
                  <Link
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-gold-light"
                  >
                    {social.name}
                  </Link>
                  <span className="ml-2 text-xs italic text-cream/40">
                    ({social.note})
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <p className="mt-10 text-xs text-cream/40">
          &copy; {new Date().getFullYear()} {SITE_NAME}. All rights reserved.
          This is an alpha test build — content and links are placeholders.
        </p>
      </div>
    </footer>
  );
}
