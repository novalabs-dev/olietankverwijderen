"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";

interface BedrijvenFiltersProps {
  provincies: string[];
}

const CERTIFICERINGEN = [
  { value: "", label: "Alle certificeringen" },
  { value: "BRL-7000", label: "BRL SIKB 7000 (Bodemsanering)" },
];

const RATING_OPTIONS = [
  { value: "", label: "Alle beoordelingen" },
  { value: "4", label: "4+ sterren" },
  { value: "3", label: "3+ sterren" },
];

export function BedrijvenFilters({ provincies }: BedrijvenFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const currentPostcode = searchParams.get("postcode") ?? "";
  const currentProvincie = searchParams.get("provincie") ?? "";
  const currentCertificering = searchParams.get("certificering") ?? "";
  const currentRating = searchParams.get("rating") ?? "";

  const updateFilter = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
      // Reset to page 1 when filters change
      params.delete("pagina");
      router.push(`/bedrijven?${params.toString()}`);
    },
    [router, searchParams],
  );

  const clearAllFilters = useCallback(() => {
    router.push("/bedrijven");
  }, [router]);

  const hasFilters = currentPostcode || currentProvincie || currentCertificering || currentRating;

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4">
      <div className="flex flex-wrap items-end gap-3">
        {/* Postcode */}
        <div className="w-full sm:w-auto">
          <label htmlFor="filter-postcode" className="block text-xs font-medium text-gray-500 mb-1">
            Postcode
          </label>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const input = (e.target as HTMLFormElement).elements.namedItem("postcode") as HTMLInputElement;
              updateFilter("postcode", input.value.trim());
            }}
            className="flex"
          >
            <input
              name="postcode"
              id="filter-postcode"
              type="text"
              defaultValue={currentPostcode}
              placeholder="1234 AB"
              className="w-28 rounded-l-md border border-r-0 border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              className="rounded-r-md border border-gray-300 bg-gray-50 px-3 py-2 text-sm text-gray-600 hover:bg-gray-100"
            >
              Zoek
            </button>
          </form>
        </div>

        {/* Provincie */}
        <div className="w-full sm:w-auto">
          <label htmlFor="filter-provincie" className="block text-xs font-medium text-gray-500 mb-1">
            Provincie
          </label>
          <select
            id="filter-provincie"
            value={currentProvincie}
            onChange={(e) => updateFilter("provincie", e.target.value)}
            className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 sm:w-44"
          >
            <option value="">Alle provincies</option>
            {provincies.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
        </div>

        {/* Certificering */}
        <div className="w-full sm:w-auto">
          <label htmlFor="filter-cert" className="block text-xs font-medium text-gray-500 mb-1">
            Certificering
          </label>
          <select
            id="filter-cert"
            value={currentCertificering}
            onChange={(e) => updateFilter("certificering", e.target.value)}
            className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 sm:w-52"
          >
            {CERTIFICERINGEN.map((c) => (
              <option key={c.value} value={c.value}>
                {c.label}
              </option>
            ))}
          </select>
        </div>

        {/* Rating */}
        <div className="w-full sm:w-auto">
          <label htmlFor="filter-rating" className="block text-xs font-medium text-gray-500 mb-1">
            Beoordeling
          </label>
          <select
            id="filter-rating"
            value={currentRating}
            onChange={(e) => updateFilter("rating", e.target.value)}
            className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 sm:w-44"
          >
            {RATING_OPTIONS.map((r) => (
              <option key={r.value} value={r.value}>
                {r.label}
              </option>
            ))}
          </select>
        </div>

        {/* Clear filters */}
        {hasFilters && (
          <button
            onClick={clearAllFilters}
            className="rounded-md px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50"
          >
            Wis filters
          </button>
        )}
      </div>
    </div>
  );
}
