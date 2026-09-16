import Link from "next/link";
import { SITE_NAME } from "@/lib/site";
import { getSettings } from "@/lib/settings";

const PLATFORMS: { key: "instagram" | "tiktok" | "pinterest" | "linkedin" | "whatnot"; label: string }[] = [
  { key: "instagram", label: "Instagram" },
  { key: "tiktok", label: "TikTok" },
  { key: "pinterest", label: "Pinterest" },
  { key: "linkedin", label: "LinkedIn" },
  { key: "whatnot", label: "Whatnot" },
];

export default async function Footer() {
  const { social } = await getSettings();

  const activeLinks = PLATFORMS.filter((p) => social[p.key].enabled && social[p.key].url.trim() !== "");
  const showEmail = social.email.enabled && social.email.address.trim() !== "";
  const hasAny = activeLinks.length > 0 || showEmail;

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
            <p className="text-xs uppercase tracking-wider text-cream/80">
              Follow &amp; Watch Live
            </p>
            <ul className="mt-3 space-y-2 text-sm">
              {activeLinks.map((platform) => (
                <li key={platform.key}>
                  <Link
                    href={social[platform.key].url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-gold-light"
                  >
                    {platform.label}
                  </Link>
                </li>
              ))}
              {showEmail && (
                <li>
                  <a href={`mailto:${social.email.address}`} className="hover:text-gold-light">
                    Email
                  </a>
                </li>
              )}
              {!hasAny && (
                <li className="text-xs italic text-cream/70">Links coming soon</li>
              )}
            </ul>
          </div>
        </div>

        <p className="mt-10 text-xs text-cream/70">
          &copy; {new Date().getFullYear()} {SITE_NAME}. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
