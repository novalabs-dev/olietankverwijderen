import type { Metadata } from "next";
import Link from "next/link";
import Breadcrumbs from "@/components/seo/Breadcrumbs";

export const metadata: Metadata = {
  title: "Over ons",
  description:
    "Leer meer over Olietankverwijderen.nl. Wij helpen huiseigenaren en bedrijven om gecertificeerde olietankverwijderaars te vinden en te vergelijken.",
  alternates: {
    canonical: "/over-ons",
  },
};

export default function OverOnsPage() {
  const breadcrumbItems = [
    { label: "Home", href: "/" },
    { label: "Over ons" },
  ];

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-6">
        <Breadcrumbs items={breadcrumbItems} />
      </div>

      <h1 className="text-3xl font-bold tracking-tight text-gray-900">
        Over Olietankverwijderen.nl
      </h1>

      <div className="prose prose-gray mt-8 max-w-none">
        <p>
          Olietankverwijderen.nl is het onafhankelijke vergelijkingsplatform voor
          olietankverwijdering in Nederland. Wij helpen huiseigenaren en bedrijven
          om snel en eenvoudig de juiste gecertificeerde olietankverwijderaar te
          vinden.
        </p>

        <h2>Onze missie</h2>
        <p>
          Een olietank verwijderen is specialistisch werk dat alleen door
          gecertificeerde bedrijven mag worden uitgevoerd. Toch is het voor
          particulieren vaak lastig om het juiste bedrijf te vinden en prijzen te
          vergelijken. Wij maken dit proces eenvoudig en transparant.
        </p>

        <h2>Wat wij doen</h2>
        <ul>
          <li>
            <strong>Vergelijken:</strong> Wij tonen uitsluitend BRL SIKB 7000
            gecertificeerde bedrijven, zodat je zeker weet dat je met een erkend
            bedrijf werkt.
          </li>
          <li>
            <strong>Offertes aanvragen:</strong> Via ons platform kun je gratis
            en vrijblijvend offertes aanvragen bij meerdere bedrijven in je
            regio.
          </li>
          <li>
            <strong>Informeren:</strong> In onze{" "}
            <Link href="/kennisbank">kennisbank</Link> vind je praktische
            informatie over olietanks, regelgeving en het verwijderingsproces.
          </li>
        </ul>

        <h2>Alleen gecertificeerde bedrijven</h2>
        <p>
          Alle bedrijven op ons platform beschikken over de vereiste BRL SIKB
          7000 certificering voor bodemsanering en tankverwijdering, en voldoen
          aan de strenge eisen van de Nederlandse wetgeving.
        </p>
      </div>

      <div className="mt-12 rounded-lg bg-blue-50 p-8 text-center">
        <h2 className="text-xl font-semibold text-gray-900">
          Hulp nodig bij olietankverwijdering?
        </h2>
        <p className="mt-2 text-gray-600">
          Vraag gratis en vrijblijvend offertes aan bij gecertificeerde
          olietankverwijderaars bij jou in de buurt.
        </p>
        <Link
          href="/offerte"
          className="mt-4 inline-block rounded-lg bg-blue-600 px-6 py-3 text-sm font-medium text-white hover:bg-blue-700"
        >
          Gratis offerte aanvragen
        </Link>
      </div>
    </div>
  );
}
