import type { Metadata } from "next";
import Link from "next/link";
import { PostcodeSearch } from "@/components/search/PostcodeSearch";
import JsonLd from "@/components/seo/JsonLd";
import { DEFAULT_OG_IMAGES } from "@/lib/seo/og";

const BASE_URL =
  process.env.NEXT_PUBLIC_BASE_URL ?? "https://olietankverwijderen.nl";

export const metadata: Metadata = {
  title:
    "Gecertificeerde Olietankverwijderaars in Nederland | Olietankverwijderen.nl",
  description:
    "Vergelijk gecertificeerde olietankverwijderaars in Nederland. Bekijk certificeringen en neem zelf contact op.",
  openGraph: {
    title: "Olietankverwijderen.nl — Vind gecertificeerde olietankverwijderaars",
    description:
      "Vergelijk gecertificeerde olietankverwijderaars in Nederland en neem zelf contact op.",
    url: BASE_URL,
    type: "website",
    images: DEFAULT_OG_IMAGES,
  },
  alternates: {
    canonical: "/",
  },
};

export default function Home() {
  const websiteJsonLd: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Olietankverwijderen.nl",
    url: BASE_URL,
    description:
      "Vergelijk gecertificeerde olietankverwijderaars in Nederland. Bekijk certificeringen en neem zelf contact op.",
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
            buurt en neem zelf contact op.
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
                href="/bedrijven"
                className="text-sm font-medium text-gray-600 hover:text-gray-900"
              >
                Of bekijk direct alle gecertificeerde bedrijven
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Neutraal blok: geen uitgelichte of betaalde selectie */}
      <section className="py-12 sm:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-gray-900">
            Bedrijven in het overzicht
          </h2>
          <p className="mt-3 max-w-2xl text-gray-600">
            We lichten geen bedrijven uit. Het overzicht staat op alfabetische
            volgorde van de bedrijfsnaam. Opname is gratis en niemand betaalt
            voor een hogere plek.
          </p>
          <div className="mt-6 flex flex-col items-start gap-4 sm:flex-row sm:items-center">
            <Link
              href="/bedrijven"
              className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-700"
            >
              Bekijk alle bedrijven
            </Link>
            <Link
              href="/hoe-werkt-de-vergelijking"
              className="text-sm font-medium text-blue-600 hover:text-blue-800"
            >
              Hoe werkt de vergelijking?
            </Link>
          </div>
        </div>
      </section>

      {/* Kennisbank sectie */}
      <section className="py-12 sm:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <h2 className="text-2xl font-bold text-gray-900">
              Alles over olietank verwijderen
            </h2>
            <Link
              href="/kennisbank"
              className="text-sm font-medium text-blue-600 hover:text-blue-800"
            >
              Bekijk alle artikelen &rarr;
            </Link>
          </div>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                href: "/kennisbank/kosten-olietank-verwijderen",
                title: "Wat kost olietank verwijderen?",
                desc: "Compleet prijsoverzicht per type tank en situatie.",
              },
              {
                href: "/kennisbank/olietank-herkennen",
                title: "Olietank herkennen",
                desc: "Hoe herken je een ondergrondse olietank op je perceel?",
              },
              {
                href: "/kennisbank/wet-regelgeving-olietank",
                title: "Wet- en regelgeving",
                desc: "De regels rondom olietanks en bodemsanering in Nederland.",
              },
              {
                href: "/kennisbank/zelf-olietank-verwijderen",
                title: "Zelf olietank verwijderen",
                desc: "Mag je zelf een olietank verwijderen? De regels uitgelegd.",
              },
            ].map((article) => (
              <Link
                key={article.href}
                href={article.href}
                className="block rounded-lg border border-gray-200 bg-white p-5 transition-shadow hover:shadow-md"
              >
                <h3 className="font-semibold text-gray-900">{article.title}</h3>
                <p className="mt-1 text-sm text-gray-600">{article.desc}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

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
                Bekijk specialisaties en contactgegevens. Maak een
                weloverwogen keuze.
              </p>
            </div>
            <div className="text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100">
                <span className="text-xl">&#128176;</span>
              </div>
              <h3 className="mt-4 text-lg font-semibold text-gray-900">
                Zelf vergelijken
              </h3>
              <p className="mt-2 text-sm text-gray-600">
                Bekijk welke gecertificeerde bedrijven actief zijn in jouw regio.
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
