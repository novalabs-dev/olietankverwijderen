import { createClient } from "@/lib/supabase/server";
import type { BedrijfCardData, BedrijfMetRelaties } from "@/lib/types";

const PAGE_SIZE = 24;

export interface BedrijvenFilters {
  provincie?: string;
  certificering?: string;
  minRating?: number;
  postcode?: string;
}

export interface BedrijvenResult {
  bedrijven: BedrijfCardData[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export async function getBedrijven(
  page = 1,
  pageSize = PAGE_SIZE,
  filters?: BedrijvenFilters,
): Promise<BedrijvenResult> {
  const supabase = await createClient();
  if (!supabase) {
    return { bedrijven: [], total: 0, page, pageSize, totalPages: 0 };
  }
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  // If filtering by certification, we need to get matching bedrijf IDs first
  let certFilterIds: string[] | null = null;
  if (filters?.certificering) {
    const { data: certData } = await supabase
      .from("bedrijf_certificeringen")
      .select("bedrijf_id, certificering_types!inner(code)")
      .eq("certificering_types.code", filters.certificering);

    if (certData && certData.length > 0) {
      certFilterIds = certData.map((c) => c.bedrijf_id);
    } else {
      return { bedrijven: [], total: 0, page, pageSize, totalPages: 0 };
    }
  }

  let query = supabase
    .from("bedrijven")
    .select(
      `
      *,
      bedrijf_certificeringen(
        *,
        certificering_types(*)
      )
    `,
      { count: "exact" },
    )
    .eq("is_published", true);

  // Apply filters
  if (filters?.provincie) {
    query = query.eq("provincie", filters.provincie);
  }

  if (filters?.minRating && filters.minRating > 0) {
    query = query.gte("gemiddelde_rating", filters.minRating);
  }

  if (filters?.postcode) {
    // Match on first 4 digits of postcode for area proximity
    const area = filters.postcode.replace(/\s/g, "").slice(0, 4);
    if (/^\d{4}$/.test(area)) {
      query = query.like("postcode", `${area}%`);
    }
  }

  if (certFilterIds) {
    query = query.in("id", certFilterIds);
  }

  const { data, error, count } = await query
    .order("gemiddelde_rating", { ascending: false })
    .range(from, to);

  if (error) {
    console.error("Error fetching bedrijven:", error);
    return { bedrijven: [], total: 0, page, pageSize, totalPages: 0 };
  }

  const total = count ?? 0;

  return {
    bedrijven: data as BedrijfCardData[],
    total,
    page,
    pageSize,
    totalPages: Math.ceil(total / pageSize),
  };
}

/**
 * Get distinct provinces that have published companies.
 */
export async function getProvinciesMetBedrijven(): Promise<string[]> {
  const supabase = await createClient();
  if (!supabase) return [];

  const { data } = await supabase
    .from("bedrijven")
    .select("provincie")
    .eq("is_published", true);

  if (!data) return [];

  const provincies = [...new Set(data.map((b) => b.provincie))].sort();
  return provincies;
}

export async function getBedrijfBySlug(
  slug: string,
): Promise<BedrijfMetRelaties | null> {
  const supabase = await createClient();
  if (!supabase) return null;

  const { data, error } = await supabase
    .from("bedrijven")
    .select(
      `
      *,
      bedrijf_certificeringen(
        *,
        certificering_types(*)
      ),
      bedrijf_specialisaties(
        *,
        specialisatie_types(*)
      ),
      bedrijf_werkgebieden(
        *,
        steden(*)
      ),
      reviews(*)
    `,
    )
    .eq("slug", slug)
    .eq("is_published", true)
    .single();

  if (error) {
    console.error("Error fetching bedrijf:", error);
    return null;
  }

  return data as BedrijfMetRelaties;
}

// Uses admin client — safe to call outside request scope (generateStaticParams)
export async function getBedrijfSlugs(): Promise<string[]> {
  const { createAdminClient } = await import("@/lib/supabase/admin");
  const supabase = createAdminClient();

  if (!supabase) {
    console.warn("Supabase not configured — skipping bedrijf slug generation");
    return [];
  }

  const { data, error } = await supabase
    .from("bedrijven")
    .select("slug")
    .eq("is_published", true);

  if (error) {
    console.error("Error fetching slugs:", error);
    return [];
  }

  return data.map((b) => b.slug);
}
