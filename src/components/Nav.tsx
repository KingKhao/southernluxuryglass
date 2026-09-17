"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { SITE_NAME } from "@/lib/site";

const links = [
  { href: "/", label: "Home" },
  { href: "/gallery", label: "Gallery" },
  { href: "/about", label: "About Crystal" },
];

export default function Nav() {
  const pathname = usePathname();

  return (
    <header className="border-b border-emerald/10 bg-cream/95 backdrop-blur sticky top-0 z-30">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-3 px-6 py-4 sm:flex-row sm:justify-between sm:py-5">
        <Link href="/" className="whitespace-nowrap font-serif text-lg tracking-wide text-emerald sm:text-xl">
          {SITE_NAME}
        </Link>
        <nav className="flex items-center gap-5 text-xs uppercase tracking-wider text-charcoal sm:gap-8 sm:text-sm">
          {links.map((link) => {
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                aria-current={active ? "page" : undefined}
                className={[
                  "transition-colors hover:text-gold-deep",
                  active ? "text-gold-deep" : "",
                ].join(" ")}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
