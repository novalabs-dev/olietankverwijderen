import type { Metadata } from "next";
import Link from "next/link";
import Breadcrumbs from "@/components/seo/Breadcrumbs";

export const metadata: Metadata = {
  title: "Privacyverklaring",
  description:
    "Lees hoe Olietankverwijderen.nl omgaat met je persoonsgegevens. Wij respecteren je privacy en verwerken gegevens alleen voor het aanvragen van offertes.",
  alternates: {
    canonical: "/privacy",
  },
};

export default function PrivacyPage() {
  const breadcrumbItems = [
    { label: "Home", href: "/" },
    { label: "Privacyverklaring" },
  ];

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-6">
        <Breadcrumbs items={breadcrumbItems} />
      </div>

      <h1 className="text-3xl font-bold tracking-tight text-gray-900">
        Privacyverklaring
      </h1>
      <p className="mt-3 text-sm text-gray-500">
        Laatst bijgewerkt: april 2026
      </p>

      <div className="prose prose-gray mt-8 max-w-none">
        <h2>1. Wie zijn wij?</h2>
        <p>
          Olietankverwijderen.nl is een vergelijkingsplatform dat huiseigenaren en
          bedrijven helpt om gecertificeerde olietankverwijderaars te vinden. Wij
          zijn verantwoordelijk voor de verwerking van je persoonsgegevens zoals
          beschreven in deze privacyverklaring.
        </p>

        <h2>2. Welke gegevens verzamelen wij?</h2>
        <p>Wij verzamelen alleen gegevens die je zelf aan ons verstrekt via het offerteformulier:</p>
        <ul>
          <li>Naam</li>
          <li>E-mailadres</li>
          <li>Telefoonnummer</li>
          <li>Adresgegevens (postcode, plaats)</li>
          <li>Informatie over je olietankverwijderingsvraag</li>
        </ul>

        <h2>3. Waarvoor gebruiken wij je gegevens?</h2>
        <p>Je gegevens worden uitsluitend gebruikt om:</p>
        <ul>
          <li>Je offerteaanvraag door te sturen naar relevante, gecertificeerde olietankverwijderaars in je regio</li>
          <li>Je een bevestiging te sturen van je aanvraag</li>
          <li>Contact met je op te nemen bij vragen over je aanvraag</li>
        </ul>

        <h2>4. Delen van gegevens</h2>
        <p>
          Je gegevens worden alleen gedeeld met de olietankverwijderingsbedrijven
          die relevant zijn voor je aanvraag. Wij verkopen je gegevens niet aan
          derden en gebruiken ze niet voor marketingdoeleinden.
        </p>

        <h2>5. Bewaartermijn</h2>
        <p>
          Wij bewaren je gegevens niet langer dan noodzakelijk voor het doel
          waarvoor ze zijn verzameld. Offerteaanvragen worden maximaal 12 maanden
          bewaard, tenzij er een lopende overeenkomst is.
        </p>

        <h2>6. Je rechten</h2>
        <p>Je hebt het recht om:</p>
        <ul>
          <li>Je gegevens in te zien</li>
          <li>Je gegevens te laten corrigeren of verwijderen</li>
          <li>Bezwaar te maken tegen de verwerking</li>
          <li>Een klacht in te dienen bij de Autoriteit Persoonsgegevens</li>
        </ul>

        <h2>7. Beveiliging</h2>
        <p>
          Wij nemen passende technische en organisatorische maatregelen om je
          persoonsgegevens te beschermen tegen ongeoorloofde toegang, verlies of
          misbruik. Onze website maakt gebruik van een beveiligde SSL-verbinding.
        </p>

        <h2>8. Cookies en analytics</h2>
        <p>
          Olietankverwijderen.nl plaatst <strong>geen tracking- of
          advertentiecookies</strong>. Voor bezoekersstatistieken gebruiken we
          Plausible Analytics, een privacyvriendelijke EU-gehoste analyse-tool
          die zonder cookies werkt en geen persoonsgegevens verwerkt. We meten
          alleen geaggregeerde cijfers (paginabezoeken, populaire pagina&apos;s,
          herkomstland). Volgens de Nederlandse Telecommunicatiewet (art. 11.7a)
          is hiervoor geen cookiebanner of toestemming vereist.
        </p>
        <p>
          De website kan een tijdelijke functionele sessie-cookie plaatsen om
          formulieren correct te laten werken. Daarvoor is op grond van de wet
          ook geen toestemming nodig.
        </p>

        <h2>9. Contact</h2>
        <p>
          Heb je vragen over deze privacyverklaring of over de verwerking van je
          gegevens? Neem dan{" "}
          <Link href="/contact" className="text-blue-600 hover:text-blue-800">
            contact
          </Link>{" "}
          met ons op.
        </p>
      </div>
    </div>
  );
}
