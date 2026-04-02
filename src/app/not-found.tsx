import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Pagina niet gevonden",
  description:
    "De pagina die je zoekt bestaat niet of is verplaatst. Ga terug naar de homepage van Olietankverwijderen.nl.",
};

export default function NotFound() {
  return (
    <section className="flex flex-1 items-center justify-center px-4 py-24">
      <div className="text-center">
        <p className="text-sm font-semibold text-blue-600">404</p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
          Pagina niet gevonden
        </h1>
        <p className="mt-4 text-base text-gray-600">
          De pagina die je zoekt bestaat niet of is verplaatst.
        </p>
        <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
          <Link
            href="/"
            className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-700"
          >
            Naar de homepage
          </Link>
          <Link
            href="/bedrijven"
            className="rounded-lg border border-gray-300 bg-white px-5 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Bekijk bedrijven
          </Link>
        </div>
      </div>
    </section>
  );
}
