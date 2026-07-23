import Link from "next/link";
import { SITE_NAME } from "@/lib/site";
import { getSettings } from "@/lib/settings";

const PLATFORMS: { key: "instagram" | "linkedin" | "pinterest" | "whatnot"; label: string }[] = [
  { key: "instagram", label: "Instagram" },
  { key: "linkedin", label: "LinkedIn" },
  { key: "pinterest", label: "Pinterest" },
  { key: "whatnot", label: "Whatnot" },
];

export default async function Footer() {
  const { social } = await getSettings();

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
              {PLATFORMS.map((platform) => {
                const href = social[platform.key]?.trim();
                return (
                  <li key={platform.key}>
                    {href ? (
                      <Link
                        href={href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-gold-light"
                      >
                        {platform.label}
                      </Link>
                    ) : (
                      <span className="text-cream/70">
                        {platform.label}
                        <span className="ml-2 text-xs italic text-cream/40">
                          (coming soon)
                        </span>
                      </span>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>
        </div>

        <p className="mt-10 text-xs text-cream/40">
          &copy; {new Date().getFullYear()} {SITE_NAME}. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
