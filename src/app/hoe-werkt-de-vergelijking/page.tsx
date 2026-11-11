import type { Metadata } from "next";
import Link from "next/link";
import Breadcrumbs from "@/components/seo/Breadcrumbs";
import JsonLd from "@/components/seo/JsonLd";
import { DEFAULT_OG_IMAGES } from "@/lib/seo/og";

const BASE_URL =
  process.env.NEXT_PUBLIC_BASE_URL ?? "https://olietankverwijderen.nl";

const PATH = "/hoe-werkt-de-vergelijking";

const TITLE = "Hoe werkt de vergelijking";
const DESCRIPTION =
  "De bedrijvenlijst staat op alfabet. Niemand betaalt voor een plek. Lees waar de gegevens vandaan komen en waarom reviews tijdelijk niet getoond worden.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: `${BASE_URL}${PATH}`,
    type: "website",
    images: DEFAULT_OG_IMAGES,
  },
  alternates: {
    canonical: PATH,
  },
};

const breadcrumbItems = [
  { label: "Home", href: "/" },
  { label: "Hoe werkt de vergelijking" },
];

const REGISTER_URL =
  "https://loket.rijkswaterstaat.nl/zoeken/publicatie/erkenningen-zoeken";

export default function HoeWerktDeVergelijkingPage() {
  const webPageJsonLd: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: TITLE,
    description: DESCRIPTION,
    url: `${BASE_URL}${PATH}`,
    inLanguage: "nl-NL",
    isPartOf: {
      "@type": "WebSite",
      name: "Olietankverwijderen.nl",
      url: BASE_URL,
    },
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
      <JsonLd data={webPageJsonLd} />

      <div className="mb-6">
        <Breadcrumbs items={breadcrumbItems} />
      </div>

      <h1 className="text-3xl font-bold tracking-tight text-gray-900">
        Hoe werkt de vergelijking
      </h1>
      <p className="mt-3 text-lg text-gray-600">
        Olietankverwijderen.nl is een overzicht van olietanksaneringsbedrijven.
        Hier staat hoe de lijst tot stand komt.
      </p>

      <div className="prose prose-gray mt-8 max-w-none">
        <h2>Volgorde</h2>
        <p>
          De lijst op{" "}
          <Link href="/bedrijven">alle bedrijven</Link> en de lijsten op de
          stadspagina&apos;s staan op alfabetische volgorde van de bedrijfsnaam.
          Bij dezelfde naam is de volgorde vast, zodat pagina&apos;s niet
          verspringen. We sorteren niet op een score en niet op een betaalde
          positie.
        </p>

        <h2>Niemand betaalt voor een plek</h2>
        <p>
          Opname in het overzicht is gratis. Bedrijven betalen niet voor een
          vermelding en niet voor een hogere positie. Er is geen uitgelichte,
          gesponsorde of premiumselectie. De homepage toont daarom geen
          selectie van bedrijven.
        </p>

        <h2>Waar de gegevens vandaan komen</h2>
        <p>
          De bedrijfsgegevens komen uit het erkenningenregister van Bodem+
          (Rijkswaterstaat), het Kwalibo-register. Voor tanksanering gaat het om
          een erkenning voor BRL K902 of BRL K904. De laatste controle was op
          1 juli 2026. Sindsdien zijn de gegevens niet meer bijgewerkt. Ze
          worden niet automatisch ververst.
        </p>
        <p>
          Een vermelding betekent niet dat wij apart hebben vastgesteld dat het
          bedrijf op dit moment actief tanks saneert. Controleer de erkenning
          zelf in het{" "}
          <a href={REGISTER_URL} rel="noopener noreferrer" target="_blank">
            erkenningenregister van Rijkswaterstaat
          </a>
          .
        </p>

        <h2>Reviews</h2>
        <p>
          We tonen tijdelijk geen reviewscores en geen aantallen reviews.
          Eerdere scores waren overgenomen van Google, zonder bron en zonder
          peildatum op de pagina. Tot we bron en peildatum kunnen vermelden,
          laten we de scores weg. De volgorde hangt er daardoor niet van af.
        </p>

        <h2>Zelf vergelijken</h2>
        <p>
          Op elke bedrijfspagina staan de contactgegevens die we hebben. Je
          benadert een bedrijf zelf. Meer over de site staat op{" "}
          <Link href="/over-ons">Over ons</Link>. Vragen kun je sturen via{" "}
          <Link href="/contact">Contact</Link>. Achtergrond over de regels vind
          je in de{" "}
          <Link href="/kennisbank/wet-regelgeving-olietank">
            kennisbank over wet- en regelgeving
          </Link>
          .
        </p>
      </div>
    </div>
  );
}
