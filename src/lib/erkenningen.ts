/**
 * Public wording for the Kwalibo snapshot behind the company list.
 * Source system: erkenningenregister Bodem+ / Rijkswaterstaat.
 * The census date is a manual snapshot. Rijkswaterstaat updates the register
 * continuously; this site does not.
 */
export const ERKENNINGENREGISTER = {
  naam: "erkenningenregister van Bodem+ (Rijkswaterstaat)",
  url: "https://loket.rijkswaterstaat.nl/zoeken/publicatie/erkenningen-zoeken",
  peildatumLabel: "11 november 2026",
  certificaten: "BRL K902 of BRL K904",
  certificatenZin: "de BRL K902- of K904-erkenning",
  tankreiniging: "BRL K905",
} as const;

/** Codes stored on certificering_types for niche olietank. Not the asbestos codes. */
export const OLIETANK_CERTIFICERINGEN = [
  { code: "K902", label: "BRL K902 — tanksanering (HBO/diesel)" },
  { code: "K904", label: "BRL K904 — tanksanering (overige producten)" },
  { code: "K905", label: "BRL K905 — tankreiniging" },
] as const;

export type OlietankCertCode = (typeof OLIETANK_CERTIFICERINGEN)[number]["code"];

export function isOlietankCertCode(code: string): code is OlietankCertCode {
  return OLIETANK_CERTIFICERINGEN.some((item) => item.code === code);
}

export function isZichtbareOlietankErkenning(cert: {
  certificering_types: { code: string; niche?: string | null };
}): boolean {
  if (!isOlietankCertCode(cert.certificering_types.code)) return false;
  const niche = cert.certificering_types.niche;
  return niche == null || niche === "olietank";
}
