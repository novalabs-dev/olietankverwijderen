import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BedrijfCard } from "@/components/bedrijven/BedrijfCard";
import Breadcrumbs from "@/components/seo/Breadcrumbs";
import JsonLd from "@/components/seo/JsonLd";
import { getBedrijvenByStad } from "@/lib/supabase/queries/steden";
import {
  STEDEN,
  getStadBySlug,
  getNabijSteden,
  getStedenByProvincie,
} from "@/lib/data/steden";
import { DEFAULT_OG_IMAGES } from "@/lib/seo/og";

const BASE_URL =
  process.env.NEXT_PUBLIC_BASE_URL ?? "https://olietankverwijderen.nl";

interface StadPageProps {
  params: Promise<{ provincie: string; stad: string }>;
}

/** Pre-render all city pages at build time */
export function generateStaticParams(): { provincie: string; stad: string }[] {
  return STEDEN.map((stad) => ({
    provincie: stad.provincieSlug,
    stad: stad.slug,
  }));
}

export async function generateMetadata({
  params,
}: StadPageProps): Promise<Metadata> {
  const { stad: stadSlug } = await params;
  const stad = getStadBySlug(stadSlug);
  if (!stad) return {};

  const url = `${BASE_URL}/${stad.provincieSlug}/${stad.slug}`;

  return {
    title: stad.metaTitle,
    description: stad.metaDescription,
    openGraph: {
      title: stad.metaTitle,
      description: stad.metaDescription,
      url,
      type: "website",
      images: DEFAULT_OG_IMAGES,
    },
    alternates: {
      canonical: `/${stad.provincieSlug}/${stad.slug}`,
    },
  };
}

export default async function StadPage({ params }: StadPageProps) {
  const { stad: stadSlug, provincie: provincieSlug } = await params;
  const stad = getStadBySlug(stadSlug);

  if (!stad || stad.provincieSlug !== provincieSlug) {
    notFound();
  }

  const { bedrijven, total, isFallback } = await getBedrijvenByStad(
    stad.slug,
    stad.provincieNaam,
    stad.naam,
  );

  const nabijSteden = getNabijSteden(stad.slug);
  const provincieStedenLinks = getStedenByProvincie(stad.provincieSlug).filter(
    (s) => s.slug !== stad.slug,
  );

  // Schema.org ItemList for the companies shown
  const itemListJsonLd: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: `Olietankverwijderingsbedrijven in ${stad.naam}`,
    description: `Overzicht van gecertificeerde olietankverwijderaars in ${stad.naam}, ${stad.provincieNaam}`,
    numberOfItems: total,
    itemListElement: bedrijven.map((bedrijf, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: bedrijf.naam,
      url: `${BASE_URL}/bedrijven/${bedrijf.slug}`,
    })),
  };

  // Schema.org FAQPage for the FAQ section
  const faqJsonLd: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: stad.faq.map((item) => ({
      "@type": "Question",
      name: item.vraag,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.antwoord,
      },
    })),
  };

  const breadcrumbItems = [
    { label: "Home", href: "/" },
    { label: stad.provincieNaam, href: `/${stad.provincieSlug}` },
    { label: stad.naam },
  ];

  return (
    <>
      <JsonLd data={itemListJsonLd} />
      <JsonLd data={faqJsonLd} />

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Breadcrumbs */}
        <div className="mb-6">
          <Breadcrumbs items={breadcrumbItems} />
        </div>

        {/* Hero section */}
        <div className="mb-10">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            {stad.h1}
          </h1>
          <p className="mt-3 max-w-3xl text-lg text-gray-600">{stad.intro}</p>
        </div>

        {/* CTA bar */}
        <div className="mb-10 flex flex-col gap-4 rounded-lg border border-blue-200 bg-blue-50 p-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="font-semibold text-gray-900">
              Offerte nodig voor olietankverwijdering in {stad.naam}?
            </p>
            <p className="mt-1 text-sm text-gray-600">
              Vergelijk gratis en vrijblijvend meerdere offertes van
              gecertificeerde bedrijven.
            </p>
          </div>
          <Link
            href="/offerte"
            className="shrink-0 rounded-lg bg-blue-600 px-6 py-3 text-center text-sm font-medium text-white hover:bg-blue-700"
          >
            Gratis offerte aanvragen
          </Link>
        </div>

        {/* Companies grid */}
        <section className="mb-12">
          <h2 className="mb-1 text-2xl font-bold text-gray-900">
            {isFallback
              ? `Olietankverwijderaars in ${stad.provincieNaam}`
              : `Olietankverwijderaars in ${stad.naam}`}
          </h2>
          <p className="mb-6 text-sm text-gray-500">
            {isFallback
              ? `Er zijn nog geen bedrijven specifiek voor ${stad.naam} geregistreerd. Hieronder vind je bedrijven actief in ${stad.provincieNaam}.`
              : `${total} gecertificeerde ${total === 1 ? "bedrijf" : "bedrijven"} actief in ${stad.naam} en omgeving`}
          </p>

          {bedrijven.length > 0 ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {bedrijven.map((bedrijf) => (
                <BedrijfCard key={bedrijf.id} bedrijf={bedrijf} />
              ))}
            </div>
          ) : (
            <div className="rounded-lg border border-gray-200 bg-white p-8 text-center">
              <p className="text-gray-500">
                Er zijn momenteel geen bedrijven gevonden in deze regio.
              </p>
              <Link
                href="/bedrijven"
                className="mt-4 inline-block text-sm font-medium text-blue-600 hover:text-blue-800"
              >
                Bekijk alle bedrijven in Nederland
              </Link>
            </div>
          )}

          {total > bedrijven.length && (
            <div className="mt-6 text-center">
              <Link
                href="/bedrijven"
                className="text-sm font-medium text-blue-600 hover:text-blue-800"
              >
                Bekijk alle {total} bedrijven &rarr;
              </Link>
            </div>
          )}
        </section>

        {/* Two-column layout: local content + sidebar */}
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Main content */}
          <div className="lg:col-span-2 space-y-10">
            {/* Local context */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900">
                Olietanks in {stad.naam}
              </h2>
              <p className="mt-3 text-gray-600 leading-relaxed">
                {stad.lokaleContext}
              </p>
            </section>

            {/* Municipality info */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900">
                Gemeente en regelgeving
              </h2>
              <p className="mt-3 text-gray-600 leading-relaxed">
                {stad.gemeenteInfo}
              </p>
            </section>

            {/* FAQ */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900">
                Veelgestelde vragen over olietankverwijdering in {stad.naam}
              </h2>
              <div className="mt-4 divide-y divide-gray-200 rounded-lg border border-gray-200">
                {stad.faq.map((item, index) => (
                  <details key={index} className="group p-4">
                    <summary className="cursor-pointer font-medium text-gray-900 group-open:mb-2">
                      {item.vraag}
                    </summary>
                    <p className="text-sm leading-relaxed text-gray-600">
                      {item.antwoord}
                    </p>
                  </details>
                ))}
              </div>
            </section>

            {/* General info block for SEO depth */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900">
                Waarom een gecertificeerd olietankverwijderingsbedrijf kiezen?
              </h2>
              <div className="mt-3 space-y-3 text-gray-600 leading-relaxed">
                <p>
                  Olietankverwijdering is in Nederland streng gereguleerd. Alleen
                  bedrijven met een BRL SIKB 7000 certificering mogen olietanks
                  verwijderen en de bodem saneren. Deze certificering garandeert
                  dat het bedrijf voldoet aan alle veiligheids- en milieueisen
                  voor tankverwijdering en bodemsanering.
                </p>
                <p>
                  Het is verboden om zelf een olietank te verwijderen. Een
                  ondergrondse olietank moet altijd door een gecertificeerd
                  bedrijf worden verwijderd, inclusief bodemonderzoek. Bij twijfel
                  is het altijd verstandig om een{" "}
                  <Link
                    href="/kennisbank"
                    className="text-blue-600 hover:text-blue-800 hover:underline"
                  >
                    bodemonderzoek
                  </Link>{" "}
                  te laten uitvoeren.
                </p>
              </div>
            </section>
          </div>

          {/* Sidebar */}
          <aside className="lg:col-span-1">
            <div className="sticky top-8 space-y-6">
              {/* Quick offerte CTA */}
              <div className="rounded-lg border border-blue-200 bg-blue-50 p-6">
                <h3 className="font-semibold text-gray-900">
                  Offerte aanvragen
                </h3>
                <p className="mt-2 text-sm text-gray-600">
                  Gratis en vrijblijvend offertes vergelijken van gecertificeerde
                  bedrijven in {stad.naam}.
                </p>
                <Link
                  href="/offerte"
                  className="mt-4 block rounded-lg bg-blue-600 px-4 py-2 text-center text-sm font-medium text-white hover:bg-blue-700"
                >
                  Vraag offerte aan
                </Link>
              </div>

              {/* Nearby cities */}
              {nabijSteden.length > 0 && (
                <div className="rounded-lg border border-gray-200 bg-white p-6">
                  <h3 className="font-semibold text-gray-900">
                    Olietankverwijdering in de buurt
                  </h3>
                  <ul className="mt-3 space-y-2">
                    {nabijSteden.map((nabijStad) => (
                      <li key={nabijStad.slug}>
                        <Link
                          href={`/${nabijStad.provincieSlug}/${nabijStad.slug}`}
                          className="text-sm text-blue-600 hover:text-blue-800 hover:underline"
                        >
                          Olietankverwijdering {nabijStad.naam}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Province cities */}
              {provincieStedenLinks.length > 0 && (
                <div className="rounded-lg border border-gray-200 bg-white p-6">
                  <h3 className="font-semibold text-gray-900">
                    Meer in {stad.provincieNaam}
                  </h3>
                  <ul className="mt-3 space-y-2">
                    {provincieStedenLinks.map((provStad) => (
                      <li key={provStad.slug}>
                        <Link
                          href={`/${provStad.provincieSlug}/${provStad.slug}`}
                          className="text-sm text-blue-600 hover:text-blue-800 hover:underline"
                        >
                          {provStad.naam}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Useful links */}
              <div className="rounded-lg border border-gray-200 bg-white p-6">
                <h3 className="font-semibold text-gray-900">
                  Meer informatie
                </h3>
                <ul className="mt-3 space-y-2">
                  <li>
                    <Link
                      href="/kennisbank"
                      className="text-sm text-blue-600 hover:text-blue-800 hover:underline"
                    >
                      Kennisbank olietankverwijdering
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/bedrijven"
                      className="text-sm text-blue-600 hover:text-blue-800 hover:underline"
                    >
                      Alle gecertificeerde bedrijven
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/offerte"
                      className="text-sm text-blue-600 hover:text-blue-800 hover:underline"
                    >
                      Gratis offerte aanvragen
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </>
  );
}
