import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { StickyCTA } from "@/components/layout/StickyCTA";
import { Plausible } from "@/components/analytics/Plausible";
import "./globals.css";
import { DEFAULT_OG_IMAGES } from "@/lib/seo/og";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  title: {
    default: "Olietankverwijderen.nl — Vind gecertificeerde olietankverwijderaars",
    template: "%s | Olietankverwijderen.nl",
  },
  description:
    "Vergelijk gecertificeerde olietankverwijderingsbedrijven in Nederland. Vraag gratis offertes aan en vind de beste specialist bij jou in de buurt.",
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_BASE_URL ?? "https://olietankverwijderen.nl",
  ),
  openGraph: {
    type: "website",
    locale: "nl_NL",
    siteName: "Olietankverwijderen.nl",
    images: DEFAULT_OG_IMAGES,
  },
  alternates: {
    canonical: "/",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="nl">
      <body
        className={`${geistSans.variable} ${geistMono.variable} flex min-h-screen flex-col antialiased`}
      >
        <Header />
        <main className="flex-1 overflow-x-clip pb-16 sm:pb-0">{children}</main>
        <Footer />
        <StickyCTA />
        <Plausible />
      </body>
    </html>
  );
}
