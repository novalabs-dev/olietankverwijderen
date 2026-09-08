import type { Metadata } from "next";
import Link from "next/link";
import Breadcrumbs from "@/components/seo/Breadcrumbs";
import { nicheConfig } from "@/lib/niche.config";
import { DEFAULT_OG_IMAGES } from "@/lib/seo/og";

/**
 * De offertebemiddeling is op 8 september 2026 gestopt.
 *
 * Deze route blijft bestaan omdat er zoekresultaten en interne links naar
 * /offerte wijzen. Bezoekers krijgen hier een eerlijke uitleg en de weg naar de
 * bedrijven, in plaats van een formulier dat niemand meer verwerkt of een 404.
 */

const REGISTER = {
  certificaat: "de BRL K902- of K904-erkenning",
  naam: "het register van erkende bodemintermediairs van Bodem+",
  url: "https://www.bodemplus.nl/onderwerpen/bodem-ondergrond/kwalibo/erkende-bodemintermediairs/",
};

const TITEL = `Offerte aanvragen bij ${nicheConfig.siteNaam}`;
const BESCHRIJVING = `${nicheConfig.siteNaam} bemiddelt geen offerteaanvragen meer. Je vindt hier wel het overzicht van gecertificeerde ${nicheConfig.naamMeervoud} met hun gegevens, zodat je ze zelf rechtstreeks kunt benaderen.`;

export const metadata: Metadata = {
  title: TITEL,
  description: BESCHRIJVING,
  openGraph: {
    title: TITEL,
    description: BESCHRIJVING,
    url: `${nicheConfig.baseUrl}/offerte`,
    images: DEFAULT_OG_IMAGES,
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
  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-6">
        <Breadcrumbs items={breadcrumbItems} />
      </div>

      <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
        Offerte aanvragen
      </h1>

      <div className="mt-6 rounded-lg border border-amber-200 bg-amber-50 p-5">
        <p className="text-base text-gray-800">
          Sinds september 2026 sturen we aanvragen niet meer door naar bedrijven.
          Het offerteformulier is daarom weg. We vonden het eerlijker om ermee te
          stoppen dan om aanvragen aan te nemen die blijven liggen.
        </p>
        <p className="mt-3 text-base text-gray-800">
          Wat blijft: het overzicht van gecertificeerde {nicheConfig.naamMeervoud}
          op deze site. Je kunt ze zelf rechtstreeks benaderen, en dat gaat
          meestal sneller dan via een tussenpartij.
        </p>
      </div>

      <h2 className="mt-10 text-xl font-semibold text-gray-900">
        Zo vraag je zelf een offerte aan
      </h2>
      <ol className="mt-4 space-y-4">
        <li className="flex gap-4">
          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gray-900 text-sm font-medium text-white">
            1
          </span>
          <div>
            <p className="font-medium text-gray-900">Zoek bedrijven in jouw regio</p>
            <p className="mt-1 text-sm text-gray-600">
              Filter het overzicht op provincie of postcode. Op elke bedrijfspagina
              staan de contactgegevens.
            </p>
            <Link
              href="/bedrijven"
              className="mt-2 inline-block text-sm font-medium text-blue-600 hover:text-blue-800"
            >
              Bekijk alle gecertificeerde bedrijven &rarr;
            </Link>
          </div>
        </li>
        <li className="flex gap-4">
          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gray-900 text-sm font-medium text-white">
            2
          </span>
          <div>
            <p className="font-medium text-gray-900">Controleer het certificaat</p>
            <p className="mt-1 text-sm text-gray-600">
              Onze gegevens komen uit een officieel register, maar ze worden niet
              meer bijgewerkt. Controleer {REGISTER.certificaat} daarom zelf in{" "}
              <a
                href={REGISTER.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 underline hover:text-blue-800"
              >
                {REGISTER.naam}
              </a>{"."}
            </p>
          </div>
        </li>
        <li className="flex gap-4">
          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gray-900 text-sm font-medium text-white">
            3
          </span>
          <div>
            <p className="font-medium text-gray-900">Vraag twee of drie offertes op</p>
            <p className="mt-1 text-sm text-gray-600">
              Bel of mail zelf een paar bedrijven. Beschrijf wat er moet gebeuren
              en laat ze eerst langskomen voordat ze een prijs geven, dan kun je de
              offertes echt vergelijken.
            </p>
          </div>
        </li>
      </ol>

      <div className="mt-10 border-t border-gray-200 pt-6">
        <h2 className="text-lg font-semibold text-gray-900">Meer informatie</h2>
        <ul className="mt-3 space-y-2">
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
              href="/kennisbank"
              className="text-sm text-blue-600 hover:text-blue-800 hover:underline"
            >
              Kennisbank met veelgestelde vragen
            </Link>
          </li>
          <li>
            <Link
              href="/contact"
              className="text-sm text-blue-600 hover:text-blue-800 hover:underline"
            >
              Contact
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
}
