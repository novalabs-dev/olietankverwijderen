import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Breadcrumbs from "@/components/seo/Breadcrumbs";
import JsonLd from "@/components/seo/JsonLd";
import {
  getProvincies,
  getStedenByProvincie,
} from "@/lib/data/steden";

const BASE_URL =
  process.env.NEXT_PUBLIC_BASE_URL ?? "https://olietankverwijderen.nl";

interface ProvinciePageProps {
  params: Promise<{ provincie: string }>;
}

/** Pre-render all province pages at build time */
export function generateStaticParams(): { provincie: string }[] {
  return getProvincies().map((p) => ({ provincie: p.slug }));
}

export async function generateMetadata({
  params,
}: ProvinciePageProps): Promise<Metadata> {
  const { provincie: provincieSlug } = await params;
  const steden = getStedenByProvincie(provincieSlug);
  if (steden.length === 0) return {};

  const provincieNaam = steden[0].provincieNaam;
  const title = `Olietankverwijdering ${provincieNaam} - Vind bedrijven per stad`;
  const description = `Vergelijk gecertificeerde olietankverwijderaars in ${provincieNaam}. Kies je stad en vind bedrijven bij jou in de buurt.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `${BASE_URL}/${provincieSlug}`,
      type: "website",
    },
    alternates: {
      canonical: `/${provincieSlug}`,
    },
  };
}

export default async function ProvinciePage({ params }: ProvinciePageProps) {
  const { provincie: provincieSlug } = await params;
  const steden = getStedenByProvincie(provincieSlug);

  if (steden.length === 0) {
    notFound();
  }

  const provincieNaam = steden[0].provincieNaam;

  const breadcrumbItems = [
    { label: "Home", href: "/" },
    { label: provincieNaam },
  ];

  const itemListJsonLd: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: `Olietankverwijdering in ${provincieNaam}`,
    description: `Steden in ${provincieNaam} met gecertificeerde olietankverwijderaars`,
    numberOfItems: steden.length,
    itemListElement: steden.map((stad, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: `Olietankverwijdering ${stad.naam}`,
      url: `${BASE_URL}/${stad.provincieSlug}/${stad.slug}`,
    })),
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <JsonLd data={itemListJsonLd} />

      <div className="mb-6">
        <Breadcrumbs items={breadcrumbItems} />
      </div>

      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
          Olietankverwijdering in {provincieNaam}
        </h1>
        <p className="mt-3 max-w-3xl text-lg text-gray-600">
          Vind gecertificeerde olietankverwijderaars in {provincieNaam}. Kies
          hieronder een stad om bedrijven bij jou in de buurt te vergelijken.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {steden
          .sort((a, b) => b.inwoners - a.inwoners)
          .map((stad) => (
            <Link
              key={stad.slug}
              href={`/${stad.provincieSlug}/${stad.slug}`}
              className="block rounded-lg border border-gray-200 bg-white p-6 transition-shadow hover:shadow-md"
            >
              <h2 className="text-lg font-semibold text-gray-900">
                {stad.naam}
              </h2>
              <p className="mt-1 text-sm text-gray-500">
                {stad.inwoners.toLocaleString("nl-NL")} inwoners
              </p>
              <span className="mt-3 inline-block text-sm font-medium text-blue-600">
                Bekijk olietankverwijderaars &rarr;
              </span>
            </Link>
          ))}
      </div>

      {/* CTA */}
      <div className="mt-12 rounded-lg border border-blue-200 bg-blue-50 p-6 text-center">
        <h2 className="text-xl font-bold text-gray-900">
          Offerte nodig voor olietankverwijdering in {provincieNaam}?
        </h2>
        <p className="mx-auto mt-2 max-w-2xl text-sm text-gray-600">
          Vraag gratis en vrijblijvend offertes aan bij gecertificeerde
          bedrijven in jouw regio.
        </p>
        <Link
          href="/offerte"
          className="mt-4 inline-block rounded-lg bg-blue-600 px-6 py-3 text-sm font-medium text-white hover:bg-blue-700"
        >
          Gratis offerte aanvragen
        </Link>
      </div>

      {/* Internal links */}
      <div className="mt-12">
        <h2 className="text-xl font-bold text-gray-900">
          Meer informatie
        </h2>
        <ul className="mt-4 space-y-2">
          <li>
            <Link
              href="/bedrijven"
              className="text-sm text-blue-600 hover:text-blue-800 hover:underline"
            >
              Alle gecertificeerde olietankverwijderaars in Nederland
            </Link>
          </li>
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
              href="/offerte"
              className="text-sm text-blue-600 hover:text-blue-800 hover:underline"
            >
              Gratis offerte aanvragen
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
}
