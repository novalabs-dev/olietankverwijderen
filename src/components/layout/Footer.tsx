import Link from "next/link";
import { STEDEN } from "@/lib/data/steden";

/** Group cities by province for the footer */
function getProvinciesMetSteden() {
  const grouped = new Map<string, { naam: string; slug: string; steden: { naam: string; slug: string }[] }>();

  for (const stad of STEDEN) {
    if (!grouped.has(stad.provincieSlug)) {
      grouped.set(stad.provincieSlug, {
        naam: stad.provincieNaam,
        slug: stad.provincieSlug,
        steden: [],
      });
    }
    grouped.get(stad.provincieSlug)!.steden.push({ naam: stad.naam, slug: stad.slug });
  }

  // Sort provinces alphabetically, cities within each province too
  return Array.from(grouped.values())
    .sort((a, b) => a.naam.localeCompare(b.naam))
    .map((p) => ({ ...p, steden: p.steden.sort((a, b) => a.naam.localeCompare(b.naam)) }));
}

const provincies = getProvinciesMetSteden();

export function Footer() {
  return (
    <footer className="border-t border-gray-200 bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Region links — Werkspot-style */}
        <div className="mb-10">
          <h3 className="text-sm font-semibold text-gray-900 mb-4">
            Olietank verwijderen per regio
          </h3>
          <div className="grid grid-cols-2 gap-x-6 gap-y-4 sm:grid-cols-3 lg:grid-cols-4">
            {provincies.map((provincie) => (
              <div key={provincie.slug}>
                <Link
                  href={`/${provincie.slug}`}
                  className="text-sm font-medium text-gray-700 hover:text-blue-600"
                >
                  {provincie.naam}
                </Link>
                <ul className="mt-1 space-y-0.5">
                  {provincie.steden.map((stad) => (
                    <li key={stad.slug}>
                      <Link
                        href={`/${provincie.slug}/${stad.slug}`}
                        className="text-xs text-gray-500 hover:text-blue-600"
                      >
                        {stad.naam}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="border-t border-gray-200 pt-8 grid grid-cols-1 gap-8 sm:grid-cols-3">
          <div>
            <h3 className="text-sm font-semibold text-gray-900">
              Olietankverwijderen.nl
            </h3>
            <p className="mt-2 text-sm text-gray-500">
              Vind gecertificeerde olietankverwijderaars bij jou in de buurt.
              Vergelijk bedrijven en vraag gratis offertes aan.
            </p>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-900">Navigatie</h3>
            <ul className="mt-2 space-y-2">
              <li>
                <Link
                  href="/bedrijven"
                  className="text-sm text-gray-500 hover:text-gray-900"
                >
                  Bedrijven
                </Link>
              </li>
              <li>
                <Link
                  href="/kennisbank"
                  className="text-sm text-gray-500 hover:text-gray-900"
                >
                  Kennisbank
                </Link>
              </li>
              <li>
                <Link
                  href="/offerte"
                  className="text-sm text-gray-500 hover:text-gray-900"
                >
                  Offerte aanvragen
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-900">Contact</h3>
            <ul className="mt-2 space-y-2">
              <li>
                <Link
                  href="/contact"
                  className="text-sm text-gray-500 hover:text-gray-900"
                >
                  Contact
                </Link>
              </li>
              <li>
                <Link
                  href="/over-ons"
                  className="text-sm text-gray-500 hover:text-gray-900"
                >
                  Over ons
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-8 border-t border-gray-200 pt-8 text-center text-sm text-gray-400">
          &copy; {new Date().getFullYear()} Olietankverwijderen.nl — Alle rechten
          voorbehouden
        </div>
      </div>
    </footer>
  );
}
