import type { Metadata } from "next";
import { Suspense } from "react";
import Link from "next/link";
import {
  getBedrijven,
  getProvinciesMetBedrijven,
  type BedrijvenFilters,
} from "@/lib/supabase/queries/bedrijven";
import { getProvincieFromPostcode } from "@/lib/postcode";
import { BedrijfCard } from "@/components/bedrijven/BedrijfCard";
import { BedrijvenFilters as FilterBar } from "@/components/search/BedrijvenFilters";
import { Pagination } from "@/components/ui/Pagination";
import Breadcrumbs from "@/components/seo/Breadcrumbs";
import JsonLd from "@/components/seo/JsonLd";
import { DEFAULT_OG_IMAGES } from "@/lib/seo/og";

const BASE_URL =
  process.env.NEXT_PUBLIC_BASE_URL ?? "https://olietankverwijderen.nl";

export const metadata: Metadata = {
  title: "Gecertificeerde olietankverwijderingsbedrijven in Nederland",
  description:
    "Vergelijk gecertificeerde olietankverwijderaars en saneringsbedrijven. Bekijk reviews, certificeringen en vraag direct een offerte aan.",
  openGraph: {
    title: "Gecertificeerde olietankverwijderingsbedrijven in Nederland",
    description:
      "Vergelijk gecertificeerde olietankverwijderaars en saneringsbedrijven. Bekijk reviews, certificeringen en vraag direct een offerte aan.",
    url: `${BASE_URL}/bedrijven`,
    type: "website",
    images: DEFAULT_OG_IMAGES,
  },
  alternates: {
    canonical: "/bedrijven",
  },
};

const breadcrumbItems = [
  { label: "Home", href: "/" },
  { label: "Bedrijven" },
];

interface BedrijvenPageProps {
  searchParams: Promise<{
    pagina?: string;
    postcode?: string;
    provincie?: string;
    certificering?: string;
    rating?: string;
  }>;
}

export default async function BedrijvenPage({
  searchParams,
}: BedrijvenPageProps) {
  const params = await searchParams;
  const page = Math.max(1, Number(params.pagina) || 1);

  // Build filters from search params
  const filters: BedrijvenFilters = {};
  if (params.postcode) {
    // If postcode is given, derive province for broader matching
    const provincie = getProvincieFromPostcode(params.postcode);
    if (provincie) {
      filters.provincie = provincie;
    }
  }
  if (params.provincie) {
    filters.provincie = params.provincie;
  }
  if (params.certificering) {
    filters.certificering = params.certificering;
  }
  if (params.rating) {
    filters.minRating = Number(params.rating) || undefined;
  }

  const [{ bedrijven, total, totalPages }, provincies] = await Promise.all([
    getBedrijven(page, 24, filters),
    getProvinciesMetBedrijven(),
  ]);

  const hasFilters = params.postcode || params.provincie || params.certificering || params.rating;

  const itemListJsonLd: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Gecertificeerde olietankverwijderingsbedrijven in Nederland",
    description: `Overzicht van ${total} gecertificeerde olietankverwijderingsbedrijven`,
    numberOfItems: total,
    itemListElement: bedrijven.map((bedrijf, index) => ({
      "@type": "ListItem",
      position: (page - 1) * bedrijven.length + index + 1,
      name: bedrijf.naam,
      url: `${BASE_URL}/bedrijven/${bedrijf.slug}`,
    })),
  };

  // Build pagination basePath with current filters
  const paginationParams = new URLSearchParams();
  if (params.postcode) paginationParams.set("postcode", params.postcode);
  if (params.provincie) paginationParams.set("provincie", params.provincie);
  if (params.certificering) paginationParams.set("certificering", params.certificering);
  if (params.rating) paginationParams.set("rating", params.rating);
  const filterQuery = paginationParams.toString();
  const paginationBase = filterQuery
    ? `/bedrijven?${filterQuery}`
    : "/bedrijven";

  return (
    <div className="mx-auto max-w-7xl overflow-hidden px-4 py-8 sm:px-6 lg:px-8">
      <JsonLd data={itemListJsonLd} />

      <div className="mb-6">
        <Breadcrumbs items={breadcrumbItems} />
      </div>

      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">
          Olietankverwijderingsbedrijven
        </h1>
        <p className="mt-2 text-lg text-gray-600">
          {hasFilters
            ? `${total} bedrijven gevonden`
            : `Vergelijk ${total} gecertificeerde bedrijven in Nederland`}
        </p>
      </div>

      {/* Filters */}
      <div className="mb-6">
        <Suspense fallback={null}>
          <FilterBar provincies={provincies} />
        </Suspense>
      </div>

      {bedrijven.length === 0 ? (
        <div className="rounded-lg border border-gray-200 bg-gray-50 p-8 text-center">
          <p className="text-gray-600">
            Geen bedrijven gevonden met deze filters.
          </p>
          <Link
            href="/bedrijven"
            className="mt-3 inline-block text-sm font-medium text-blue-600 hover:text-blue-800"
          >
            Bekijk alle bedrijven &rarr;
          </Link>
        </div>
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {bedrijven.map((bedrijf) => (
              <BedrijfCard key={bedrijf.id} bedrijf={bedrijf} />
            ))}
          </div>

          <Pagination
            currentPage={page}
            totalPages={totalPages}
            basePath={paginationBase}
          />
        </>
      )}
    </div>
  );
}
