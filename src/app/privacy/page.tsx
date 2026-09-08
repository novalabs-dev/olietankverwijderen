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
        Laatst bijgewerkt: september 2026
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
        <p>
          Sinds september 2026 staat er geen offerteformulier meer op deze site.
          We vragen en bewaren daarom geen naam, e-mailadres, telefoonnummer of
          aanvraaggegevens meer. De persoonsgegevens uit eerdere aanvragen zijn
          verwijderd.
        </p>
        <p>
          Wat we nog wel vastleggen zijn technische loggegevens (IP-adres,
          browsertype, bezochte pagina&apos;s) voor beveiliging, en cookieloze
          bezoekersstatistieken via Plausible waarin geen persoonsgegevens staan.
        </p>

        <h2>3. Waarvoor gebruiken wij je gegevens?</h2>
        <p>
          De technische loggegevens gebruiken we om de site bereikbaar en veilig
          te houden. De grondslag daarvoor is ons gerechtvaardigd belang
          (artikel 6 lid 1 sub f AVG). Aanvraaggegevens verwerken we niet meer,
          omdat we geen aanvragen meer aannemen.
        </p>

        <h2>4. Delen van gegevens</h2>
        <p>
          We delen geen persoonsgegevens met bedrijven. Tot september 2026
          stuurden we offerteaanvragen door naar gecertificeerde bedrijven, maar
          die dienst is gestopt. We verkopen geen gegevens aan derden en
          gebruiken ze niet voor marketing.
        </p>
        <p>
          We werken met de volgende subverwerkers voor hosting, opslag en
          statistiek:
        </p>
        <h2>5. Bewaartermijn</h2>
        <p>
          De persoonsgegevens uit eerdere offerteaanvragen zijn in september 2026
          verwijderd. Technische loggegevens bewaren we maximaal 6 maanden.
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
          Sinds het offerteformulier weg is, staan er op deze site helemaal geen
          formulieren meer, en worden er dus ook geen functionele cookies meer
          geplaatst.
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
