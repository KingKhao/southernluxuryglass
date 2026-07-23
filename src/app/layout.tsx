import type { Metadata } from "next";
import { Playfair_Display, Lato } from "next/font/google";
import "./globals.css";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";

const display = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["500", "600", "700"],
});

const body = Lato({
  subsets: ["latin"],
  variable: "--font-body",
  weight: ["400", "700"],
});

export const metadata: Metadata = {
  title: "Southern Luxury Glass | Curated by Crystal Brisbois",
  description:
    "Curated antique and vintage glassware from Southern Luxury Glass — vases, dinnerware, glasses, décor, and serveware with history and character.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${display.variable} ${body.variable} font-sans antialiased flex min-h-screen flex-col`}>
        <Nav />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
