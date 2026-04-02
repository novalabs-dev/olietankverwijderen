import type { Metadata } from "next";
import Link from "next/link";
import Breadcrumbs from "@/components/seo/Breadcrumbs";
import { OfferteForm } from "@/components/forms/OfferteForm";

export const metadata: Metadata = {
  title: "Gratis offerte aanvragen — Olietank verwijderen",
  description:
    "Vraag gratis en vrijblijvend offertes aan bij gecertificeerde olietankverwijderaars in jouw regio. Vergelijk prijzen en bespaar op olietankverwijdering.",
  openGraph: {
    title: "Gratis offerte aanvragen — Olietank verwijderen",
    description:
      "Vraag gratis en vrijblijvend offertes aan bij gecertificeerde olietankverwijderaars in jouw regio.",
  },
  alternates: {
    canonical: "/offerte",
  },
};

const breadcrumbItems = [
  { label: "Home", href: "/" },
  { label: "Offerte aanvragen" },
];

export default function OffertePage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "Gratis offerte aanvragen — Olietank verwijderen",
    description:
      "Vraag gratis en vrijblijvend offertes aan bij gecertificeerde olietankverwijderaars.",
    url: `${process.env.NEXT_PUBLIC_BASE_URL ?? "https://olietankverwijderen.nl"}/offerte`,
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Schema.org structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Breadcrumbs */}
      <div className="mb-6">
        <Breadcrumbs items={breadcrumbItems} />
      </div>

      {/* Page header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
          Gratis offerte aanvragen
        </h1>
        <p className="mt-3 max-w-2xl text-lg text-gray-600">
          Vul het formulier in en ontvang binnen 2 werkdagen vrijblijvende
          offertes van gecertificeerde olietankverwijderaars in jouw regio.
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Form — takes up 2 columns on large screens */}
        <div className="lg:col-span-2">
          <OfferteForm />
        </div>

        {/* Sidebar */}
        <aside className="lg:col-span-1">
          <div className="sticky top-8 space-y-6">
            {/* Why us */}
            <div className="rounded-lg border border-gray-200 bg-white p-6">
              <h2 className="text-lg font-semibold text-gray-900">
                Waarom via ons?
              </h2>
              <ul className="mt-4 space-y-3">
                <li className="flex items-start gap-3">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-100 text-xs text-blue-600">
                    1
                  </span>
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      100% gratis en vrijblijvend
                    </p>
                    <p className="text-sm text-gray-500">
                      Je zit nergens aan vast en betaalt nooit voor offertes.
                    </p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-100 text-xs text-blue-600">
                    2
                  </span>
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      Alleen gecertificeerde bedrijven
                    </p>
                    <p className="text-sm text-gray-500">
                      Alle bedrijven zijn BRL SIKB 7000 gecertificeerd voor
                      bodemsanering en tankverwijdering.
                    </p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-100 text-xs text-blue-600">
                    3
                  </span>
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      Vergelijk en bespaar
                    </p>
                    <p className="text-sm text-gray-500">
                      Ontvang meerdere offertes en kies het bedrijf dat bij je
                      past.
                    </p>
                  </div>
                </li>
              </ul>
            </div>

            {/* Quick links */}
            <div className="rounded-lg border border-gray-200 bg-white p-6">
              <h2 className="text-lg font-semibold text-gray-900">
                Meer informatie
              </h2>
              <ul className="mt-3 space-y-2">
                <li>
                  <Link
                    href="/bedrijven"
                    className="text-sm text-blue-600 hover:text-blue-800 hover:underline"
                  >
                    Bekijk alle gecertificeerde bedrijven
                  </Link>
                </li>
                <li>
                  <Link
                    href="/kennisbank"
                    className="text-sm text-blue-600 hover:text-blue-800 hover:underline"
                  >
                    Veelgestelde vragen over olietanks
                  </Link>
                </li>
                <li>
                  <Link
                    href="/contact"
                    className="text-sm text-blue-600 hover:text-blue-800 hover:underline"
                  >
                    Neem contact met ons op
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
