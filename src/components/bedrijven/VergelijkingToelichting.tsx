import Link from "next/link";

/** Short note above every company list: order and that position is not for sale. */
export function VergelijkingToelichting() {
  return (
    <p className="mb-4 text-sm text-gray-600">
      Bedrijven staan op alfabetische volgorde. Plaatsing is gratis en de
      positie is niet te koop.{" "}
      <Link
        href="/hoe-werkt-de-vergelijking"
        className="font-medium text-blue-600 hover:text-blue-800"
      >
        Hoe werkt de vergelijking?
      </Link>
    </p>
  );
}
