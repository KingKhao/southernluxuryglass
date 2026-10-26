"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { SITE_NAME } from "@/lib/site";
import { useFavorites } from "@/hooks/useFavorites";

const links = [
  { href: "/", label: "Home" },
  { href: "/gallery", label: "Gallery" },
  { href: "/about", label: "About Crystal" },
];

export default function Nav() {
  const pathname = usePathname();
  const { favorites, ready } = useFavorites();

  return (
    <header className="border-b border-emerald/10 bg-cream/95 backdrop-blur sticky top-0 z-30">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-3 px-6 py-4 sm:flex-row sm:justify-between sm:py-5">
        <Link href="/" className="whitespace-nowrap font-serif text-lg tracking-wide text-emerald sm:text-xl">
          {SITE_NAME}
        </Link>
        <nav aria-label="Main navigation" className="flex max-w-full flex-wrap items-center justify-center gap-x-4 gap-y-1 text-xs uppercase tracking-wider text-charcoal sm:gap-8 sm:text-sm">
          {links.map((link) => {
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                aria-current={active ? "page" : undefined}
                className={[
                  "inline-flex min-h-[44px] items-center transition-colors hover:text-gold-deep",
                  active ? "text-gold-deep" : "",
                ].join(" ")}
              >
                {link.label}
              </Link>
            );
          })}
          {ready && (
            <Link
              href="/gallery?saved=1"
              onClick={(event) => {
                if (pathname !== "/gallery" || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
                event.preventDefault();
                window.history.pushState(window.history.state, "", "/gallery?saved=1");
                window.dispatchEvent(new PopStateEvent("popstate", { state: window.history.state }));
              }}
              className="inline-flex min-h-[44px] items-center gap-1 text-charcoal transition-colors hover:text-gold-deep"
              aria-label={`View ${favorites.length} saved piece${favorites.length === 1 ? "" : "s"}`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
                <path d="M12 21s-7.5-4.6-10-9.1C.5 8.6 2 5 5.5 5c2 0 3.5 1.2 4.5 2.7C11 6.2 12.5 5 14.5 5 18 5 19.5 8.6 22 11.9 14.5 16.4 12 21 12 21Z" />
              </svg>
              {favorites.length}
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
