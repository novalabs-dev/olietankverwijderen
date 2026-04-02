import type { Metadata } from "next";
import Link from "next/link";
import Breadcrumbs from "@/components/seo/Breadcrumbs";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Neem contact op met Olietankverwijderen.nl. Heb je vragen over olietankverwijdering of over ons platform? Wij helpen je graag.",
  alternates: {
    canonical: "/contact",
  },
};

export default function ContactPage() {
  const breadcrumbItems = [
    { label: "Home", href: "/" },
    { label: "Contact" },
  ];

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-6">
        <Breadcrumbs items={breadcrumbItems} />
      </div>

      <h1 className="text-3xl font-bold tracking-tight text-gray-900">
        Contact
      </h1>
      <p className="mt-3 max-w-2xl text-lg text-gray-600">
        Heb je vragen over olietankverwijdering, ons platform, of wil je je
        bedrijf aanmelden? Neem gerust contact met ons op.
      </p>

      <div className="mt-8 grid gap-8 sm:grid-cols-2">
        <div className="rounded-lg border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900">
            Voor huiseigenaren
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Wil je een offerte aanvragen voor olietankverwijdering? Gebruik ons
            gratis offerteformulier.
          </p>
          <Link
            href="/offerte"
            className="mt-4 inline-block rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-700"
          >
            Offerte aanvragen
          </Link>
        </div>

        <div className="rounded-lg border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900">
            Voor bedrijven
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Wil je je olietankverwijderingsbedrijf aanmelden op ons platform? Neem
            contact met ons op via e-mail.
          </p>
          <a
            href="mailto:info@olietankverwijderen.nl"
            className="mt-4 inline-block rounded-lg border border-gray-300 bg-white px-5 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            info@olietankverwijderen.nl
          </a>
        </div>
      </div>

      <div className="mt-8 rounded-lg bg-gray-50 p-6">
        <h2 className="text-lg font-semibold text-gray-900">
          Overige vragen
        </h2>
        <p className="mt-2 text-sm text-gray-600">
          Voor overige vragen over het platform, samenwerkingen, of feedback kun
          je ons bereiken via:
        </p>
        <p className="mt-3 text-sm text-gray-700">
          <strong>E-mail:</strong>{" "}
          <a
            href="mailto:info@olietankverwijderen.nl"
            className="text-blue-600 hover:text-blue-800"
          >
            info@olietankverwijderen.nl
          </a>
        </p>
      </div>
    </div>
  );
}
