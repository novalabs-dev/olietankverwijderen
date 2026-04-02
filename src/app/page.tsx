import type { Metadata } from "next";
import Link from "next/link";
import { getBedrijven } from "@/lib/supabase/queries/bedrijven";
import { BedrijfCard } from "@/components/bedrijven/BedrijfCard";
import { PostcodeSearch } from "@/components/search/PostcodeSearch";
import JsonLd from "@/components/seo/JsonLd";

const BASE_URL =
  process.env.NEXT_PUBLIC_BASE_URL ?? "https://olietankverwijderen.nl";

export const metadata: Metadata = {
  title:
    "Olietankverwijderen.nl — Vind gecertificeerde olietankverwijderaars in Nederland",
  description:
    "Vergelijk gecertificeerde olietankverwijderaars in Nederland. Bekijk reviews, certificeringen en vraag gratis offertes aan.",
  openGraph: {
    title: "Olietankverwijderen.nl — Vind gecertificeerde olietankverwijderaars",
    description:
      "Vergelijk gecertificeerde olietankverwijderaars in Nederland. Bekijk reviews en vraag gratis offertes aan.",
    url: BASE_URL,
    type: "website",
  },
  alternates: {
    canonical: "/",
  },
};

export default async function Home() {
  const { bedrijven, total } = await getBedrijven(1, 3);
  const featuredBedrijven = bedrijven;

  const websiteJsonLd: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Olietankverwijderen.nl",
    url: BASE_URL,
    description:
      "Vergelijk gecertificeerde olietankverwijderaars in Nederland. Bekijk reviews, certificeringen en vraag gratis offertes aan.",
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${BASE_URL}/bedrijven?zoek={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };

  return (
    <>
      <JsonLd data={websiteJsonLd} />

      {/* Hero */}
      <section className="bg-gray-50 py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
            Vind gecertificeerde
            <br />
            <span className="text-blue-600">olietankverwijderaars</span>
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-600">
            Vergelijk gecertificeerde bedrijven bij jou in de
            buurt. Bekijk reviews en vraag gratis offertes aan.
          </p>
          <div className="mt-8 flex flex-col items-center gap-6">
            <PostcodeSearch size="lg" className="justify-center" />
            <div className="flex flex-col items-center gap-3 sm:flex-row">
              <Link
                href="/bedrijven"
                className="text-sm font-medium text-blue-600 hover:text-blue-800"
              >
                Bekijk alle bedrijven &rarr;
              </Link>
              <span className="hidden text-gray-300 sm:inline">|</span>
              <Link
                href="/offerte"
                className="text-sm font-medium text-gray-600 hover:text-gray-900"
              >
                Of vraag direct een gratis offerte aan
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Featured bedrijven */}
      {featuredBedrijven.length > 0 && (
        <section className="py-12 sm:py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <h2 className="text-2xl font-bold text-gray-900">
                Uitgelichte bedrijven
              </h2>
              <Link
                href="/bedrijven"
                className="text-sm font-medium text-blue-600 hover:text-blue-800"
              >
                Bekijk alle {total} bedrijven &rarr;
              </Link>
            </div>
            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {featuredBedrijven.map((bedrijf) => (
                <BedrijfCard key={bedrijf.id} bedrijf={bedrijf} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Info section */}
      <section className="border-t border-gray-200 bg-gray-50 py-12 sm:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-center text-2xl font-bold text-gray-900">
            Waarom Olietankverwijderen.nl?
          </h2>
          <div className="mt-8 grid gap-8 sm:grid-cols-3">
            <div className="text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100">
                <span className="text-xl">&#9989;</span>
              </div>
              <h3 className="mt-4 text-lg font-semibold text-gray-900">
                Gecertificeerd
              </h3>
              <p className="mt-2 text-sm text-gray-600">
                Alleen gecertificeerde bedrijven. Geverifieerd
                via het SIKB register.
              </p>
            </div>
            <div className="text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100">
                <span className="text-xl">&#128269;</span>
              </div>
              <h3 className="mt-4 text-lg font-semibold text-gray-900">
                Vergelijk
              </h3>
              <p className="mt-2 text-sm text-gray-600">
                Bekijk reviews, specialisaties en prijsindicaties. Maak een
                weloverwogen keuze.
              </p>
            </div>
            <div className="text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100">
                <span className="text-xl">&#128176;</span>
              </div>
              <h3 className="mt-4 text-lg font-semibold text-gray-900">
                Gratis offertes
              </h3>
              <p className="mt-2 text-sm text-gray-600">
                Vraag gratis en vrijblijvend offertes aan bij meerdere bedrijven
                in jouw regio.
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
