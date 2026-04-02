import Link from "next/link";
import type { BedrijfCardData } from "@/lib/types";
import { CertificeringBadge } from "./CertificeringBadge";
import { StarRating } from "@/components/ui/StarRating";

interface BedrijfCardProps {
  bedrijf: BedrijfCardData;
}

export function BedrijfCard({ bedrijf }: BedrijfCardProps) {
  const currentYear = new Date().getFullYear();
  const jarenActief = bedrijf.opgericht_jaar
    ? currentYear - bedrijf.opgericht_jaar
    : null;

  return (
    <Link
      href={`/bedrijven/${bedrijf.slug}`}
      className="block rounded-lg border border-gray-200 bg-white p-6 transition-shadow hover:shadow-md"
    >
      {/* Header: name + verified badge */}
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="text-lg font-semibold text-gray-900">
              {bedrijf.naam}
            </h2>
            {bedrijf.is_gecertificeerd && (
              <span
                className="inline-flex shrink-0 items-center gap-0.5 rounded-full bg-green-50 px-2 py-0.5 text-xs font-medium text-green-700"
                title="Gecertificeerd via SIKB register"
              >
                <svg className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                  <path
                    fillRule="evenodd"
                    d="M16.403 12.652a3 3 0 010-5.304 3 3 0 00-3.75-3.751 3 3 0 00-5.305 0 3 3 0 00-3.751 3.75 3 3 0 000 5.305 3 3 0 003.75 3.751 3 3 0 005.305 0 3 3 0 003.751-3.75zm-2.546-4.46a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
                    clipRule="evenodd"
                  />
                </svg>
                Gecertificeerd
              </span>
            )}
          </div>
          <p className="mt-1 text-sm text-gray-500">
            {bedrijf.stad}, {bedrijf.provincie}
          </p>
        </div>
        {bedrijf.prijs_vanaf && (
          <div className="text-right shrink-0">
            <p className="text-sm text-gray-500">Vanaf</p>
            <p className="font-semibold text-gray-900">
              &euro;{Number(bedrijf.prijs_vanaf).toLocaleString("nl-NL")}
            </p>
          </div>
        )}
      </div>

      {/* Certification badges */}
      {bedrijf.bedrijf_certificeringen.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-2">
          {bedrijf.bedrijf_certificeringen.map((cert) => (
            <CertificeringBadge
              key={cert.id}
              certificering={cert}
              size="sm"
            />
          ))}
        </div>
      )}

      {/* Description */}
      {bedrijf.korte_beschrijving && (
        <p className="mt-3 line-clamp-2 text-sm text-gray-600">
          {bedrijf.korte_beschrijving}
        </p>
      )}

      {/* Trust signals row */}
      <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-gray-500">
        {jarenActief !== null && jarenActief > 0 && (
          <span className="flex items-center gap-1">
            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {jarenActief}+ jaar ervaring
          </span>
        )}
        {bedrijf.aantal_medewerkers && (
          <span className="flex items-center gap-1">
            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128H9m6 0a5.972 5.972 0 00-.786-3.07M9 19.128v-.003c0-1.113.285-2.16.786-3.07m0 0a5.97 5.97 0 00-.786-3.07M9 16.058v-.003c0-1.113-.285-2.16-.786-3.07m0 0A5.963 5.963 0 009 9.128m0 3.86V9.128" />
            </svg>
            {bedrijf.aantal_medewerkers} medewerkers
          </span>
        )}
      </div>

      {/* Rating + CTA */}
      <div className="mt-4 flex items-center justify-between border-t border-gray-100 pt-3">
        <div className="flex items-center gap-2">
          {bedrijf.gemiddelde_rating > 0 ? (
            <>
              <StarRating rating={bedrijf.gemiddelde_rating} />
              <span className="text-sm font-medium text-gray-700">
                {Number(bedrijf.gemiddelde_rating).toFixed(1)}
              </span>
              <span className="text-sm text-gray-500">
                ({bedrijf.aantal_reviews} {bedrijf.aantal_reviews === 1 ? "review" : "reviews"})
              </span>
            </>
          ) : (
            <span className="text-sm text-gray-400">Nog geen reviews</span>
          )}
        </div>
        <span className="text-sm font-medium text-blue-600">
          Bekijk &rarr;
        </span>
      </div>
    </Link>
  );
}
