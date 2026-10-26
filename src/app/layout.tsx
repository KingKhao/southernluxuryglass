export const dynamic = "force-dynamic";
import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "./globals.css";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import StorefrontMotion from "@/components/StorefrontMotion";

const display = localFont({
  src: "./fonts/playfair-display-latin.woff2",
  variable: "--font-display",
  weight: "500 700",
  display: "swap",
});

const body = localFont({
  src: [
    { path: "./fonts/lato-regular-latin.woff2", weight: "400" },
    { path: "./fonts/lato-bold-latin.woff2", weight: "700" },
  ],
  variable: "--font-body",
  display: "swap",
});

const TITLE = "Southern Luxury Glass | Curated by Crystal Brisbois";
const DESCRIPTION =
  "Curated antique and vintage glassware from Southern Luxury Glass — vases, dinnerware, glasses, décor, and serveware with history and character.";

export const viewport: Viewport = { width: "device-width", initialScale: 1, viewportFit: "cover", themeColor: "#FAF6EE" };

export const metadata: Metadata = {
  metadataBase: new URL("https://southernluxuryglass.vercel.app"),
  title: TITLE,
  description: DESCRIPTION,
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    type: "website",
    images: [{ url: "/crystal-bio-card.png", width: 1536, height: 1024, alt: "Crystal Brisbois, curator of Southern Luxury Glass" }],
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
    images: ["/crystal-bio-card.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${display.variable} ${body.variable} font-sans antialiased flex min-h-screen flex-col`}>
        <a href="#main-content" className="slg-skip">Skip to content</a>
        <Nav />
        <main id="main-content" tabIndex={-1} className="flex-1">{children}</main>
        <Footer />
        <StorefrontMotion />
      </body>
    </html>
  );
}
