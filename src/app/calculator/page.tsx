import type { Metadata } from "next";
import Link from "next/link";
import Breadcrumbs from "@/components/seo/Breadcrumbs";
import JsonLd from "@/components/seo/JsonLd";
import { OlietankCalculator } from "@/components/calculator/OlietankCalculator";
import { nicheConfig } from "@/lib/niche.config";
import { DEFAULT_OG_IMAGES } from "@/lib/seo/og";

const BASE_URL = nicheConfig.baseUrl;

export const metadata: Metadata = {
  title: "Wat kost olietank verwijderen? Bereken het zelf | Kostenberekening",
  description:
    "Bereken direct wat het verwijderen van een olietank kost. Vul het tanktype, volume en details in en ontvang een prijsindicatie. Inclusief bodemonderzoek en saneringskosten.",
  openGraph: {
    title: "Olietank verwijderen kostenberekening | Bereken het zelf",
    description:
      "Bereken direct wat het verwijderen van een olietank kost. Vul het tanktype en volume in en ontvang een prijsindicatie.",
    url: `${BASE_URL}/calculator`,
    type: "website",
    images: DEFAULT_OG_IMAGES,
  },
  alternates: {
    canonical: "/calculator",
  },
};

export default function CalculatorPage() {
  const breadcrumbItems = [
    { label: "Home", href: "/" },
    { label: "Kostenberekening" },
  ];

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "Wat kost het verwijderen van een olietank?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Het verwijderen van een bovengrondse olietank kost gemiddeld \u20AC800 tot \u20AC1.500. Een ondergrondse tank verwijderen kost \u20AC1.500 tot \u20AC3.500. Bij bodemverontreiniging kunnen de totale kosten oplopen tot \u20AC15.000 of meer, inclusief sanering.",
        },
      },
      {
        "@type": "Question",
        name: "Is bodemonderzoek verplicht bij het verwijderen van een olietank?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Ja, bij het verwijderen van een ondergrondse olietank is bodemonderzoek in de meeste gemeenten verplicht. Ook bij een bovengrondse tank wordt bodemonderzoek sterk aanbevolen om vast te stellen of er lekkage naar de bodem heeft plaatsgevonden. De kosten voor bodemonderzoek liggen tussen \u20AC850 en \u20AC1.400.",
        },
      },
      {
        "@type": "Question",
        name: "Wat kost bodemsanering na een olietankverwijdering?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Bodemsanering na olietankverwijdering kost gemiddeld \u20AC2.000 tot \u20AC11.500, afhankelijk van de mate van verontreiniging en de omvang van het vervuilde grondvolume. Bij ernstige verontreiniging kunnen de kosten oplopen tot \u20AC15.000 of meer.",
        },
      },
      {
        "@type": "Question",
        name: "Kan ik mijn olietank zelf verwijderen?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Nee, het verwijderen van een olietank mag niet zelf gedaan worden. Een gecertificeerd bedrijf moet de tank leeghalen, reinigen en afvoeren volgens de milieuvoorschriften. De tank en eventuele restvloeistoffen zijn chemisch afval en moeten op de juiste manier verwerkt worden.",
        },
      },
      {
        "@type": "Question",
        name: "Hoelang duurt het verwijderen van een olietank?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Het verwijderen van een bovengrondse olietank duurt meestal 1 dag. Een ondergrondse tank verwijderen duurt 1 tot 3 dagen, afhankelijk van de toegankelijkheid en het volume. Als er bodemsanering nodig is, kan het project meerdere weken duren.",
        },
      },
    ],
  };

  const webAppJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "Olietank Verwijderen Kostenberekening",
    url: `${BASE_URL}/calculator`,
    applicationCategory: "UtilityApplication",
    operatingSystem: "Web",
    description:
      "Bereken de geschatte kosten voor het verwijderen van een olietank op basis van tanktype, volume, toegankelijkheid en verwachte bodemverontreiniging.",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "EUR",
    },
    publisher: {
      "@type": "Organization",
      name: nicheConfig.siteNaam,
      url: BASE_URL,
    },
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <JsonLd data={faqJsonLd} />
      <JsonLd data={webAppJsonLd} />

      <div className="mb-6">
        <Breadcrumbs items={breadcrumbItems} />
      </div>

      {/* Two column layout: calculator + sidebar */}
      <div className="grid gap-8 lg:grid-cols-3">
        {/* Main: calculator */}
        <div className="lg:col-span-2">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            Wat kost olietank verwijderen?
          </h1>
          <p className="mt-3 max-w-2xl text-lg text-gray-600">
            Bereken in 4 stappen een indicatie van de kosten voor het
            verwijderen van uw olietank. Vul het tanktype, volume en
            enkele details in voor een schatting op maat.
          </p>

          <div className="mt-8">
            <OlietankCalculator />
          </div>
        </div>

        {/* Sidebar */}
        <aside className="space-y-6 lg:mt-16">
          {/* Quick facts */}
          <div className="rounded-lg border border-gray-200 bg-white p-6">
            <h2 className="text-base font-semibold text-gray-900">
              Richtprijzen per type
            </h2>
            <dl className="mt-4 space-y-3">
              {[
                { label: "Bovengronds (eenvoudig)", prijs: "\u20AC800 - \u20AC1.500" },
                { label: "Ondergronds (standaard)", prijs: "\u20AC1.500 - \u20AC3.500" },
                { label: "Ondergronds + sanering", prijs: "\u20AC3.500 - \u20AC15.000+" },
                { label: "Bodemonderzoek (extra)", prijs: "\u20AC850 - \u20AC1.400" },
              ].map((item) => (
                <div key={item.label} className="flex items-center justify-between text-sm">
                  <dt className="text-gray-600">{item.label}</dt>
                  <dd className="font-medium text-gray-900">{item.prijs}</dd>
                </div>
              ))}
            </dl>
            <p className="mt-4 text-xs text-gray-400">
              Prijzen incl. BTW. Bron: marktgemiddelden 2025-2026.
            </p>
          </div>

          {/* Tips */}
          <div className="rounded-lg border border-gray-200 bg-white p-6">
            <h2 className="text-base font-semibold text-gray-900">
              Tips om te besparen
            </h2>
            <ul className="mt-3 space-y-2 text-sm text-gray-600">
              <li className="flex items-start gap-2">
                <span className="mt-1 block h-1.5 w-1.5 flex-shrink-0 rounded-full bg-green-500" />
                Vraag meerdere offertes aan
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1 block h-1.5 w-1.5 flex-shrink-0 rounded-full bg-green-500" />
                Combineer tankverwijdering met bodemonderzoek
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1 block h-1.5 w-1.5 flex-shrink-0 rounded-full bg-green-500" />
                Plan buiten het bouwseizoen
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1 block h-1.5 w-1.5 flex-shrink-0 rounded-full bg-green-500" />
                Check of uw gemeente subsidie biedt
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1 block h-1.5 w-1.5 flex-shrink-0 rounded-full bg-green-500" />
                Laat de tank NIET zelf leeghalen
              </li>
            </ul>
          </div>

          {/* Related articles */}
          <div className="rounded-lg border border-gray-200 bg-white p-6">
            <h2 className="text-base font-semibold text-gray-900">
              Meer informatie
            </h2>
            <nav className="mt-3 space-y-2">
              {[
                { href: "/kennisbank/kosten-olietank-verwijderen", label: "Wat kost olietank verwijderen?" },
                { href: "/kennisbank/bodemsanering-na-olietank", label: "Bodemsanering na olietankverwijdering" },
                { href: "/kennisbank/olietank-herkennen", label: "Olietank herkennen" },
                { href: "/kennisbank/wet-regelgeving-olietank", label: "Wet- en regelgeving olietanks" },
                { href: "/kennisbank/zelf-olietank-verwijderen", label: "Zelf olietank verwijderen?" },
              ].map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="block text-sm text-blue-600 hover:text-blue-800 hover:underline"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* CTA */}
          <div className="rounded-lg bg-blue-600 p-6 text-white">
            <h2 className="text-base font-semibold">
              Direct offertes vergelijken?
            </h2>
            <p className="mt-2 text-sm text-blue-100">
              Ontvang binnen 2 werkdagen vrijblijvende offertes van
              gecertificeerde bedrijven bij jou in de buurt.
            </p>
            <Link
              href="/offerte"
              className="mt-4 inline-block rounded-lg bg-white px-5 py-2.5 text-sm font-medium text-blue-600 hover:bg-blue-50"
            >
              Gratis offerte aanvragen
            </Link>
          </div>
        </aside>
      </div>

      {/* SEO content below calculator */}
      <section className="mt-16 max-w-3xl">
        <h2 className="text-2xl font-bold text-gray-900">
          Hoe worden de kosten voor olietankverwijdering berekend?
        </h2>
        <div className="mt-4 space-y-4 text-sm leading-relaxed text-gray-600">
          <p>
            De kosten voor het verwijderen van een olietank worden bepaald door
            een combinatie van factoren. Het belangrijkste onderscheid is of de
            tank bovengronds of ondergronds staat. Een bovengrondse tank is
            relatief eenvoudig te verwijderen en kost tussen de {"\u20AC"}800 en
            {"\u20AC"}1.500. Bij een ondergrondse tank moet er gegraven worden,
            wat de kosten verhoogt naar {"\u20AC"}1.500 tot {"\u20AC"}3.500.
          </p>
          <p>
            Het volume van de tank speelt ook een rol. Tanks tot 1.000 liter
            zijn standaard. Bij grotere tanks (2.000 liter of meer) stijgen de
            kosten door het extra materiaal, de grotere graafwerkzaamheden en
            hogere afvoerkosten. Een tank van 3.000 liter of meer kan tot 50%
            duurder zijn dan een standaard tank.
          </p>
          <p>
            De toegankelijkheid is een vaak onderschatte kostenfactor. Als de
            tank vrij bereikbaar is in de tuin, blijven de kosten beperkt. Maar
            als de tank onder een gebouw ligt of in een kruipruimte zit, kunnen
            de kosten 30% tot 40% hoger uitvallen door het extra werk en de
            complexiteit.
          </p>
          <h3 className="pt-2 text-lg font-semibold text-gray-900">
            Bodemverontreiniging en sanering
          </h3>
          <p>
            De grootste onzekere kostenpost bij olietankverwijdering is mogelijke
            bodemverontreiniging. Als de tank heeft gelekt, moet de verontreinigde
            grond gesaneerd worden. Dit kan de totale kosten verhogen met
            {"\u20AC"}2.000 tot {"\u20AC"}11.500, afhankelijk van de omvang van de
            verontreiniging. Bij ernstige gevallen kan het bedrag zelfs oplopen
            tot boven de {"\u20AC"}15.000.
          </p>
          <p>
            Bodemonderzoek is daarom altijd aan te raden en in veel gemeenten
            verplicht bij het verwijderen van een ondergrondse olietank. De
            kosten voor een bodemonderzoek liggen tussen de {"\u20AC"}850 en
            {"\u20AC"}1.400. Dit geeft duidelijkheid over eventuele
            verontreiniging voordat je voor verrassingen komt te staan.
          </p>
          <h3 className="pt-2 text-lg font-semibold text-gray-900">
            Waarom meerdere offertes vergelijken?
          </h3>
          <p>
            Prijzen voor olietankverwijdering kunnen sterk verschillen tussen
            bedrijven, zelfs voor dezelfde opdracht. Door minimaal 3 offertes
            aan te vragen bij gecertificeerde bedrijven, krijg je een goed
            beeld van de marktprijs en voorkom je dat je te veel betaalt. Alle
            bedrijven op Olietankverwijderen.nl zijn gecertificeerd en werken
            volgens de geldende milieuwetgeving.
          </p>
        </div>
      </section>
    </div>
  );
}
