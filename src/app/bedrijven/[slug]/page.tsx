import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import {
  getBedrijfBySlug,
  getBedrijfSlugs,
} from "@/lib/supabase/queries/bedrijven";
import { CertificeringBadge } from "@/components/bedrijven/CertificeringBadge";
import { StarRating } from "@/components/ui/StarRating";
import Breadcrumbs from "@/components/seo/Breadcrumbs";
import JsonLd from "@/components/seo/JsonLd";
import type { BedrijfMetRelaties, Review } from "@/lib/types";
import { DEFAULT_OG_IMAGES } from "@/lib/seo/og";

const BASE_URL =
  process.env.NEXT_PUBLIC_BASE_URL ?? "https://olietankverwijderen.nl";

interface BedrijfPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const slugs = await getBedrijfSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: BedrijfPageProps): Promise<Metadata> {
  const { slug } = await params;
  const bedrijf = await getBedrijfBySlug(slug);

  if (!bedrijf) {
    return { title: "Bedrijf niet gevonden" };
  }

  const title = `${bedrijf.naam} — Olietankverwijdering ${bedrijf.stad}`;
  const description =
    bedrijf.korte_beschrijving ??
    `${bedrijf.naam} is een gecertificeerd olietankverwijderingsbedrijf in ${bedrijf.stad}. Bekijk reviews, certificeringen en vraag een offerte aan.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `${BASE_URL}/bedrijven/${bedrijf.slug}`,
      type: "website",
      images: bedrijf.logo_url ? [{ url: bedrijf.logo_url }] : DEFAULT_OG_IMAGES,
    },
    alternates: {
      canonical: `/bedrijven/${bedrijf.slug}`,
    },
  };
}

function buildLocalBusinessJsonLd(
  bedrijf: BedrijfMetRelaties,
  publishedReviews: Review[],
): Record<string, unknown> {
  const jsonLd: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: bedrijf.naam,
    description:
      bedrijf.korte_beschrijving ??
      `${bedrijf.naam} is een gecertificeerd olietankverwijderingsbedrijf in ${bedrijf.stad}.`,
    url: `${BASE_URL}/bedrijven/${bedrijf.slug}`,
    ...(bedrijf.telefoon ? { telephone: bedrijf.telefoon } : {}),
    ...(bedrijf.email ? { email: bedrijf.email } : {}),
    ...(bedrijf.website ? { sameAs: bedrijf.website } : {}),
    ...(bedrijf.logo_url ? { image: bedrijf.logo_url } : {}),
    ...(bedrijf.prijs_vanaf
      ? {
          priceRange: `Vanaf \u20AC${Number(bedrijf.prijs_vanaf).toLocaleString("nl-NL")}`,
        }
      : {}),
  };

  // Address
  if (bedrijf.straat || bedrijf.postcode || bedrijf.stad) {
    jsonLd.address = {
      "@type": "PostalAddress",
      ...(bedrijf.straat
        ? { streetAddress: `${bedrijf.straat} ${bedrijf.huisnummer ?? ""}`.trim() }
        : {}),
      addressLocality: bedrijf.stad,
      ...(bedrijf.postcode ? { postalCode: bedrijf.postcode } : {}),
      addressRegion: bedrijf.provincie,
      addressCountry: "NL",
    };
  }

  // Geo coordinates
  if (bedrijf.latitude && bedrijf.longitude) {
    jsonLd.geo = {
      "@type": "GeoCoordinates",
      latitude: bedrijf.latitude,
      longitude: bedrijf.longitude,
    };
  }

  // Aggregate rating
  if (bedrijf.gemiddelde_rating > 0 && bedrijf.aantal_reviews > 0) {
    jsonLd.aggregateRating = {
      "@type": "AggregateRating",
      ratingValue: Number(bedrijf.gemiddelde_rating).toFixed(1),
      reviewCount: bedrijf.aantal_reviews,
      bestRating: 5,
      worstRating: 1,
    };
  }

  // Individual reviews
  if (publishedReviews.length > 0) {
    jsonLd.review = publishedReviews.map((review) => ({
      "@type": "Review",
      author: {
        "@type": "Person",
        name: review.reviewer_naam,
      },
      reviewRating: {
        "@type": "Rating",
        ratingValue: review.rating,
        bestRating: 5,
        worstRating: 1,
      },
      datePublished: review.created_at.split("T")[0],
      reviewBody: review.tekst,
      ...(review.titel ? { name: review.titel } : {}),
    }));
  }

  return jsonLd;
}

export default async function BedrijfPage({ params }: BedrijfPageProps) {
  const { slug } = await params;
  const bedrijf = await getBedrijfBySlug(slug);

  if (!bedrijf) {
    notFound();
  }

  const publishedReviews = bedrijf.reviews.filter((r) => r.is_published);

  const breadcrumbItems = [
    { label: "Home", href: "/" },
    { label: "Bedrijven", href: "/bedrijven" },
    { label: bedrijf.naam },
  ];

  const localBusinessJsonLd = buildLocalBusinessJsonLd(
    bedrijf,
    publishedReviews,
  );

  return (
    <div className="mx-auto max-w-7xl overflow-hidden px-4 py-8 sm:px-6 lg:px-8">
      <JsonLd data={localBusinessJsonLd} />

      {/* Breadcrumbs */}
      <div className="mb-6">
        <Breadcrumbs items={breadcrumbItems} />
      </div>

      {/* Verified banner */}
      {bedrijf.is_gecertificeerd && (
        <div className="mb-6 flex items-center gap-2 rounded-lg border border-green-200 bg-green-50 px-4 py-3">
          <svg className="h-5 w-5 shrink-0 text-green-600" viewBox="0 0 20 20" fill="currentColor">
            <path
              fillRule="evenodd"
              d="M16.403 12.652a3 3 0 010-5.304 3 3 0 00-3.75-3.751 3 3 0 00-5.305 0 3 3 0 00-3.751 3.75 3 3 0 000 5.305 3 3 0 003.75 3.751 3 3 0 005.305 0 3 3 0 003.751-3.75zm-2.546-4.46a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
              clipRule="evenodd"
            />
          </svg>
          <p className="text-sm text-green-800">
            <span className="font-medium">Geverifieerd bedrijf</span> — Certificeringen gecontroleerd via het BRL SIKB 7000 register
          </p>
        </div>
      )}

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Main content */}
        <div className="lg:col-span-2">
          <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
            {bedrijf.naam}
          </h1>

          <div className="mt-2 flex flex-wrap items-center gap-3">
            <p className="text-gray-600">
              {bedrijf.stad}, {bedrijf.provincie}
            </p>
            {bedrijf.gemiddelde_rating > 0 && (
              <div className="flex items-center gap-1.5">
                <StarRating rating={bedrijf.gemiddelde_rating} />
                <span className="text-sm text-gray-500">
                  {Number(bedrijf.gemiddelde_rating).toFixed(1)} (
                  {bedrijf.aantal_reviews} reviews)
                </span>
              </div>
            )}
            {bedrijf.opgericht_jaar && (
              <span className="text-sm text-gray-500">
                Actief sinds {bedrijf.opgericht_jaar}
              </span>
            )}
          </div>

          {/* Certificeringen */}
          {bedrijf.bedrijf_certificeringen.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {bedrijf.bedrijf_certificeringen.map((cert) => (
                <CertificeringBadge key={cert.id} certificering={cert} />
              ))}
            </div>
          )}

          {/* Beschrijving */}
          {bedrijf.beschrijving && (
            <div className="mt-6">
              <h2 className="text-xl font-semibold text-gray-900">
                Over {bedrijf.naam}
              </h2>
              <p className="mt-2 leading-relaxed text-gray-700 whitespace-pre-line break-words">
                {bedrijf.beschrijving}
              </p>
            </div>
          )}

          {/* Specialisaties */}
          {bedrijf.bedrijf_specialisaties.length > 0 && (
            <div className="mt-6">
              <h2 className="text-xl font-semibold text-gray-900">
                Specialisaties
              </h2>
              <ul className="mt-2 grid grid-cols-2 gap-2">
                {bedrijf.bedrijf_specialisaties.map((spec) => (
                  <li
                    key={spec.specialisatie_id}
                    className="flex items-center gap-2 text-sm text-gray-700"
                  >
                    <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-blue-600" />
                    {spec.specialisatie_types.naam}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Werkgebieden */}
          {bedrijf.bedrijf_werkgebieden.length > 0 && (
            <div className="mt-6">
              <h2 className="text-xl font-semibold text-gray-900">
                Werkgebied
              </h2>
              <div className="mt-2 flex flex-wrap gap-2">
                {bedrijf.bedrijf_werkgebieden.map((wg) => (
                  <span
                    key={wg.stad_id}
                    className="rounded-full bg-gray-100 px-3 py-1 text-sm text-gray-700"
                  >
                    {wg.steden.naam}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Reviews */}
          {publishedReviews.length > 0 && (
            <div className="mt-8">
              <h2 className="text-xl font-semibold text-gray-900">
                Reviews ({publishedReviews.length})
              </h2>
              <div className="mt-4 space-y-4">
                {publishedReviews.map((review) => (
                  <div
                    key={review.id}
                    className="rounded-lg border border-gray-200 p-4"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-900">
                          {review.reviewer_naam}
                        </p>
                        {review.reviewer_stad && (
                          <p className="text-sm text-gray-500">
                            {review.reviewer_stad}
                          </p>
                        )}
                      </div>
                      <StarRating rating={review.rating} />
                    </div>
                    {review.titel && (
                      <p className="mt-2 font-medium text-gray-900">
                        {review.titel}
                      </p>
                    )}
                    <p className="mt-1 text-sm leading-relaxed text-gray-700">
                      {review.tekst}
                    </p>
                    <p className="mt-2 text-xs text-gray-400">
                      {new Date(review.created_at).toLocaleDateString("nl-NL", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <aside className="lg:col-span-1">
          <div className="sticky top-8 rounded-lg border border-gray-200 bg-white p-6">
            <h3 className="text-lg font-semibold text-gray-900">
              Offerte aanvragen
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              Vraag gratis en vrijblijvend een offerte aan bij {bedrijf.naam}.
            </p>
            <Link
              href="/offerte"
              className="mt-4 block rounded-lg bg-blue-600 px-4 py-3 text-center text-sm font-medium text-white hover:bg-blue-700"
            >
              Gratis offerte aanvragen
            </Link>

            {/* Bedrijfsgegevens */}
            <div className="mt-6 space-y-3 border-t border-gray-200 pt-6">
              {bedrijf.telefoon && (
                <div className="flex items-start gap-3">
                  <span className="text-sm font-medium text-gray-500">
                    Telefoon
                  </span>
                  <span className="text-sm text-gray-900">
                    {bedrijf.telefoon}
                  </span>
                </div>
              )}
              {bedrijf.email && (
                <div className="flex items-start gap-3">
                  <span className="text-sm font-medium text-gray-500">
                    E-mail
                  </span>
                  <span className="text-sm text-gray-900 break-all">{bedrijf.email}</span>
                </div>
              )}
              {bedrijf.website && (
                <div className="flex items-start gap-3">
                  <span className="text-sm font-medium text-gray-500">
                    Website
                  </span>
                  <a
                    href={bedrijf.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-blue-600 hover:underline break-all"
                  >
                    {bedrijf.website.replace(/^https?:\/\/(www\.)?/, "")}
                  </a>
                </div>
              )}
              {bedrijf.postcode && (
                <div className="flex items-start gap-3">
                  <span className="text-sm font-medium text-gray-500">
                    Adres
                  </span>
                  <span className="text-sm text-gray-900">
                    {bedrijf.straat} {bedrijf.huisnummer}, {bedrijf.postcode}{" "}
                    {bedrijf.stad}
                  </span>
                </div>
              )}
              {bedrijf.opgericht_jaar && (
                <div className="flex items-start gap-3">
                  <span className="text-sm font-medium text-gray-500">
                    Opgericht
                  </span>
                  <span className="text-sm text-gray-900">
                    {bedrijf.opgericht_jaar}
                  </span>
                </div>
              )}
              {bedrijf.aantal_medewerkers && (
                <div className="flex items-start gap-3">
                  <span className="text-sm font-medium text-gray-500">
                    Medewerkers
                  </span>
                  <span className="text-sm text-gray-900">
                    {bedrijf.aantal_medewerkers}
                  </span>
                </div>
              )}
              {bedrijf.prijs_vanaf && (
                <div className="flex items-start gap-3">
                  <span className="text-sm font-medium text-gray-500">
                    Vanaf prijs
                  </span>
                  <span className="text-sm font-semibold text-gray-900">
                    &euro;
                    {Number(bedrijf.prijs_vanaf).toLocaleString("nl-NL")}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Link naar stadpagina */}
          {bedrijf.stad && bedrijf.provincie && (
            <div className="mt-6 rounded-lg border border-gray-200 bg-white p-6">
              <Link
                href={`/${bedrijf.provincie.toLowerCase().replace(/\s+/g, "-")}/${bedrijf.stad.toLowerCase().replace(/\s+/g, "-")}`}
                className="text-sm text-blue-600 hover:text-blue-800 hover:underline"
              >
                Meer olietankverwijderaars in {bedrijf.stad} &rarr;
              </Link>
            </div>
          )}

          {/* Kennisbank links */}
          <div className="mt-6 rounded-lg border border-gray-200 bg-white p-6">
            <h3 className="text-sm font-semibold text-gray-900">
              Meer weten over olietank verwijderen?
            </h3>
            <ul className="mt-3 space-y-2">
              <li>
                <Link href="/kennisbank/kosten-olietank-verwijderen" className="text-sm text-blue-600 hover:text-blue-800 hover:underline">
                  Wat kost olietank verwijderen?
                </Link>
              </li>
              <li>
                <Link href="/kennisbank/wet-regelgeving-olietank" className="text-sm text-blue-600 hover:text-blue-800 hover:underline">
                  Wet- en regelgeving
                </Link>
              </li>
              <li>
                <Link href="/kennisbank/bodemsanering-na-olietank" className="text-sm text-blue-600 hover:text-blue-800 hover:underline">
                  Bodemsanering na verwijdering
                </Link>
              </li>
            </ul>
          </div>
        </aside>
      </div>
    </div>
  );
}
