import { createClient } from "@/lib/supabase/server";
import type { BedrijfCardData } from "@/lib/types";

/**
 * Get published companies that serve a given city.
 *
 * Strategy (in order of specificity):
 * 1. Companies linked via bedrijf_werkgebieden junction table
 * 2. Companies whose registered `stad` field matches the city name
 * 3. Fallback: companies in the same province
 */
export async function getBedrijvenByStad(
  stadSlug: string,
  provincieNaam: string,
  stadNaam?: string,
  limit = 12,
): Promise<{ bedrijven: BedrijfCardData[]; total: number; isFallback: boolean }> {
  const supabase = await createClient();
  if (!supabase) {
    return { bedrijven: [], total: 0, isFallback: false };
  }

  const selectFields = `
    *,
    bedrijf_certificeringen(
      *,
      certificering_types(*)
    )
  `;

  // Step 1: try werkgebieden junction table
  const { data: werkgebiedBedrijven, error: wgError } = await supabase
    .from("bedrijf_werkgebieden")
    .select(
      `
      bedrijf_id,
      steden!inner(slug)
    `,
    )
    .eq("steden.slug", stadSlug);

  if (!wgError && werkgebiedBedrijven && werkgebiedBedrijven.length > 0) {
    const bedrijfIds = werkgebiedBedrijven.map((w) => w.bedrijf_id);

    const { data, count } = await supabase
      .from("bedrijven")
      .select(selectFields, { count: "exact" })
      .eq("is_published", true)
      .eq("niche", "olietank")
      .in("id", bedrijfIds)
      .order("is_premium", { ascending: false })
      .order("gemiddelde_rating", { ascending: false })
      .limit(limit);

    if (data && data.length > 0) {
      return {
        bedrijven: data as BedrijfCardData[],
        total: count ?? data.length,
        isFallback: false,
      };
    }
  }

  // Step 2: match on bedrijven.stad field directly (case-insensitive)
  if (stadNaam) {
    const { data: stadBedrijven, count: stadCount } = await supabase
      .from("bedrijven")
      .select(selectFields, { count: "exact" })
      .eq("is_published", true)
      .eq("niche", "olietank")
      .ilike("stad", stadNaam)
      .order("is_premium", { ascending: false })
      .order("gemiddelde_rating", { ascending: false })
      .limit(limit);

    if (stadBedrijven && stadBedrijven.length > 0) {
      return {
        bedrijven: stadBedrijven as BedrijfCardData[],
        total: stadCount ?? stadBedrijven.length,
        isFallback: false,
      };
    }
  }

  // Step 3: fallback to companies in the same province
  const { data: provincieBedrijven, count: provincieCount } = await supabase
    .from("bedrijven")
    .select(selectFields, { count: "exact" })
    .eq("is_published", true)
    .eq("niche", "olietank")
    .eq("provincie", provincieNaam)
    .order("is_premium", { ascending: false })
    .order("gemiddelde_rating", { ascending: false })
    .limit(limit);

  return {
    bedrijven: (provincieBedrijven as BedrijfCardData[]) ?? [],
    total: provincieCount ?? 0,
    isFallback: true,
  };
}
