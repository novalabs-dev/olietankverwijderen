/**
 * Enrich bedrijven with data from the KVK Handelsregister API.
 *
 * Uses two KVK APIs:
 *   - Zoeken API (free)      — find KvK numbers by company name
 *   - Basisprofiel API (€0.02/call) — get full company data
 *
 * Enriches: kvk_nummer, straat, huisnummer, postcode, stad, latitude,
 * longitude, website, and aantal_medewerkers.
 *
 * Safe to run repeatedly — only updates fields when data has changed.
 * Skips companies verified in the last 30 days (override with --force).
 *
 * Usage:
 *   npx tsx scripts/enrich-kvk.ts                # enrich all bedrijven
 *   npx tsx scripts/enrich-kvk.ts --dry-run      # preview without writing
 *   npx tsx scripts/enrich-kvk.ts --limit 1      # enrich only N bedrijven
 *   npx tsx scripts/enrich-kvk.ts --force         # re-enrich even if recently verified
 *   npx tsx scripts/enrich-kvk.ts --id <uuid>    # enrich a specific bedrijf by ID
 *   npx tsx scripts/enrich-kvk.ts --test          # use KVK test environment
 */

import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { readFileSync } from "fs";
import { resolve } from "path";

// ---------------------------------------------------------------------------
// Config
// ---------------------------------------------------------------------------

const KVK_PROD_BASE = "https://api.kvk.nl/api";
const KVK_TEST_BASE = "https://api.kvk.nl/test/api";
const KVK_TEST_KEY = "l7xx1f2691f2520d487b902f4e0b57a0b197";

const RATE_LIMIT_MS = 300; // delay between API calls
const STALE_AFTER_DAYS = 30; // re-enrich after this many days

// ---------------------------------------------------------------------------
// .env.local loader (no dotenv dependency)
// ---------------------------------------------------------------------------

const envPath = resolve(__dirname, "../.env.local");
try {
  const envContent = readFileSync(envPath, "utf-8");
  for (const line of envContent.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eqIndex = trimmed.indexOf("=");
    if (eqIndex === -1) continue;
    const key = trimmed.slice(0, eqIndex).trim();
    const value = trimmed
      .slice(eqIndex + 1)
      .trim()
      .replace(/^["']|["']$/g, "");
    if (!process.env[key]) process.env[key] = value;
  }
} catch {
  console.error(`Could not read ${envPath}`);
}

// ---------------------------------------------------------------------------
// CLI args
// ---------------------------------------------------------------------------

const args = process.argv.slice(2);
const dryRun = args.includes("--dry-run");
const force = args.includes("--force");
const useTestEnv = args.includes("--test");

function getArgValue(flag: string): string | undefined {
  const idx = args.indexOf(flag);
  if (idx === -1 || idx + 1 >= args.length) return undefined;
  return args[idx + 1];
}

const limitArg = getArgValue("--limit");
const limit = limitArg ? parseInt(limitArg, 10) : undefined;
const specificId = getArgValue("--id");

// ---------------------------------------------------------------------------
// Validate env
// ---------------------------------------------------------------------------

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_KEY =
  process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.SUPABASE_SERVICE_KEY;

const KVK_BASE = useTestEnv ? KVK_TEST_BASE : KVK_PROD_BASE;
const KVK_API_KEY = useTestEnv
  ? KVK_TEST_KEY
  : process.env.KVK_API_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  console.error(
    "Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local",
  );
  process.exit(1);
}

if (!KVK_API_KEY) {
  console.error(
    "Missing KVK_API_KEY in .env.local (or use --test for the test environment)",
  );
  process.exit(1);
}

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface BedrijfRow {
  id: string;
  naam: string;
  kvk_nummer: string | null;
  website: string | null;
  straat: string | null;
  huisnummer: string | null;
  postcode: string | null;
  stad: string;
  provincie: string;
  latitude: number | null;
  longitude: number | null;
  aantal_medewerkers: string | null;
  data_verified_at: string | null;
}

interface KvkZoekenResultaat {
  kvkNummer: string;
  vestigingsnummer?: string;
  naam: string;
  adres?: {
    binnenlandsAdres?: {
      type?: string;
      straatnaam?: string;
      plaats?: string;
    };
  };
  type?: string;
  actief?: string;
  links?: Array<{ rel: string; href: string }>;
}

interface KvkZoekenResponse {
  pagina: number;
  totaal: number;
  resultaten?: KvkZoekenResultaat[];
}

interface KvkAdres {
  type?: string;
  indAfgeschermd?: string;
  straatnaam?: string;
  huisnummer?: number;
  huisletter?: string;
  huisnummerToevoeging?: string;
  postcode?: string;
  plaats?: string;
  land?: string;
  geoData?: {
    gpsLatitude?: number;
    gpsLongitude?: number;
  };
}

interface KvkHoofdvestiging {
  vestigingsnummer?: string;
  eersteHandelsnaam?: string;
  totaalWerkzamePersonen?: number;
  adressen?: KvkAdres[];
  websites?: string[];
}

interface KvkBasisprofielResponse {
  kvkNummer: string;
  naam: string;
  totaalWerkzamePersonen?: number;
  _embedded?: {
    hoofdvestiging?: KvkHoofdvestiging;
  };
}

interface EnrichmentResult {
  bedrijfId: string;
  bedrijfNaam: string;
  status: "updated" | "skipped" | "not_found" | "error";
  kvkMatch?: string;
  changes?: Record<string, { old: unknown; new: unknown }>;
  error?: string;
  apiCalls: { zoeken: number; basisprofiel: number };
}

// ---------------------------------------------------------------------------
// API helpers
// ---------------------------------------------------------------------------

const totalApiCalls = { zoeken: 0, basisprofiel: 0 };

class KvkNotFoundError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "KvkNotFoundError";
  }
}

async function kvkFetch<T>(url: string): Promise<T> {
  const response = await fetch(url, {
    headers: {
      apikey: KVK_API_KEY!,
      Accept: "application/json",
    },
  });

  if (response.status === 404 || response.status === 400) {
    throw new KvkNotFoundError("Not found in KVK register");
  }

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`KVK API ${response.status}: ${text}`);
  }

  return response.json() as Promise<T>;
}

async function kvkZoeken(
  params: Record<string, string>,
): Promise<KvkZoekenResultaat[]> {
  const url = new URL(`${KVK_BASE}/v2/zoeken`);
  for (const [key, value] of Object.entries(params)) {
    url.searchParams.set(key, value);
  }

  totalApiCalls.zoeken++;
  const data = await kvkFetch<KvkZoekenResponse>(url.toString());
  return data.resultaten ?? [];
}

async function kvkBasisprofiel(
  kvkNummer: string,
): Promise<KvkBasisprofielResponse> {
  totalApiCalls.basisprofiel++;
  return kvkFetch<KvkBasisprofielResponse>(
    `${KVK_BASE}/v1/basisprofielen/${kvkNummer}?geoData=true`,
  );
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// ---------------------------------------------------------------------------
// Lookup logic
// ---------------------------------------------------------------------------

async function findKvkNummer(
  bedrijf: BedrijfRow,
  callCount: { zoeken: number; basisprofiel: number },
): Promise<string | null> {
  if (bedrijf.kvk_nummer) return bedrijf.kvk_nummer;

  // Search by name, prefer hoofdvestiging
  const results = await kvkZoeken({
    naam: bedrijf.naam,
    type: "hoofdvestiging",
    resultatenPerPagina: "5",
  });
  callCount.zoeken++;

  if (results.length === 0) return null;

  // Try to find the best match
  const normalise = (s: string) =>
    s
      .toLowerCase()
      .replace(/[^a-z0-9]/g, " ")
      .replace(/\s+/g, " ")
      .trim();

  const target = normalise(bedrijf.naam);
  let bestMatch: KvkZoekenResultaat | null = null;
  let bestScore = 0;

  for (const result of results) {
    const name = normalise(result.naam);
    let score = 0;

    if (name === target) {
      score = 1.0;
    } else if (name.includes(target) || target.includes(name)) {
      score = 0.8;
    } else {
      const targetWords = target.split(" ");
      const nameWords = name.split(" ");
      const overlap = targetWords.filter((w) => nameWords.includes(w));
      score = (overlap.length / Math.max(targetWords.length, 1)) * 0.6;
    }

    if (score > bestScore) {
      bestScore = score;
      bestMatch = result;
    }

    if (score === 1.0) break;
  }

  if (bestScore < 0.5 || !bestMatch) return null;

  return bestMatch.kvkNummer;
}

// ---------------------------------------------------------------------------
// Enrichment logic
// ---------------------------------------------------------------------------

function medewerkersBucket(count: number): string {
  if (count <= 5) return "1-5";
  if (count <= 10) return "5-10";
  if (count <= 25) return "10-25";
  if (count <= 50) return "25-50";
  return "50+";
}

function buildUpdatePayload(
  bedrijf: BedrijfRow,
  profiel: KvkBasisprofielResponse,
): Record<string, unknown> {
  const updates: Record<string, unknown> = {};
  const hoofdvestiging = profiel._embedded?.hoofdvestiging;

  // KvK nummer
  if (profiel.kvkNummer && bedrijf.kvk_nummer !== profiel.kvkNummer) {
    updates.kvk_nummer = profiel.kvkNummer;
  }

  // Website (from hoofdvestiging)
  if (hoofdvestiging?.websites && hoofdvestiging.websites.length > 0) {
    const website = hoofdvestiging.websites[0];
    if (website && bedrijf.website !== website) {
      updates.website = website;
    }
  }

  // Address from bezoekadres
  const bezoekadres = hoofdvestiging?.adressen?.find(
    (a) => a.type === "bezoekadres" && a.indAfgeschermd !== "Ja",
  );

  if (bezoekadres) {
    if (bezoekadres.straatnaam && bedrijf.straat !== bezoekadres.straatnaam) {
      updates.straat = bezoekadres.straatnaam;
    }

    if (bezoekadres.huisnummer != null) {
      const huisnummerStr = String(bezoekadres.huisnummer);
      const toevoeging = bezoekadres.huisnummerToevoeging ?? bezoekadres.huisletter ?? "";
      const full = toevoeging ? `${huisnummerStr}${toevoeging}` : huisnummerStr;
      if (bedrijf.huisnummer !== full) {
        updates.huisnummer = full;
      }
    }

    if (bezoekadres.postcode && bedrijf.postcode !== bezoekadres.postcode) {
      updates.postcode = bezoekadres.postcode;
    }

    if (bezoekadres.plaats && bedrijf.stad !== bezoekadres.plaats) {
      updates.stad = bezoekadres.plaats;
    }

    // GPS coordinates
    if (bezoekadres.geoData) {
      const lat = bezoekadres.geoData.gpsLatitude;
      const lon = bezoekadres.geoData.gpsLongitude;
      // Skip zero coordinates (no data)
      if (lat && lat !== 0 && bedrijf.latitude !== lat) {
        updates.latitude = lat;
      }
      if (lon && lon !== 0 && bedrijf.longitude !== lon) {
        updates.longitude = lon;
      }
    }
  }

  // Aantal medewerkers
  const totalPersonen =
    hoofdvestiging?.totaalWerkzamePersonen ??
    profiel.totaalWerkzamePersonen;
  if (totalPersonen != null && totalPersonen > 0) {
    const bucket = medewerkersBucket(totalPersonen);
    if (bedrijf.aantal_medewerkers !== bucket) {
      updates.aantal_medewerkers = bucket;
    }
  }

  // Always update verification timestamp
  updates.data_verified_at = new Date().toISOString();
  updates.updated_at = new Date().toISOString();

  return updates;
}

function describeChanges(
  bedrijf: BedrijfRow,
  updates: Record<string, unknown>,
): Record<string, { old: unknown; new: unknown }> {
  const changes: Record<string, { old: unknown; new: unknown }> = {};

  for (const [key, newValue] of Object.entries(updates)) {
    if (key === "data_verified_at" || key === "updated_at") continue;
    const oldValue = (bedrijf as Record<string, unknown>)[key];
    if (oldValue !== newValue) {
      changes[key] = { old: oldValue, new: newValue };
    }
  }

  return changes;
}

async function enrichBedrijf(
  supabase: SupabaseClient,
  bedrijf: BedrijfRow,
): Promise<EnrichmentResult> {
  const callCount = { zoeken: 0, basisprofiel: 0 };
  const result: EnrichmentResult = {
    bedrijfId: bedrijf.id,
    bedrijfNaam: bedrijf.naam,
    status: "skipped",
    apiCalls: callCount,
  };

  try {
    // Step 1: Try to get basisprofiel by KvK number
    let profiel: KvkBasisprofielResponse | null = null;

    if (bedrijf.kvk_nummer) {
      try {
        profiel = await kvkBasisprofiel(bedrijf.kvk_nummer);
        callCount.basisprofiel++;
      } catch (err) {
        if (!(err instanceof KvkNotFoundError)) throw err;
        // KvK number invalid/not found — fall through to name search
      }
    }

    // Step 2: Fall back to name search if needed
    if (!profiel) {
      await sleep(RATE_LIMIT_MS);
      const kvkNummer = await findKvkNummer(
        { ...bedrijf, kvk_nummer: null },
        callCount,
      );

      if (!kvkNummer) {
        result.status = "not_found";
        return result;
      }

      await sleep(RATE_LIMIT_MS);

      try {
        profiel = await kvkBasisprofiel(kvkNummer);
        callCount.basisprofiel++;
      } catch (err) {
        if (err instanceof KvkNotFoundError) {
          result.status = "not_found";
          return result;
        }
        throw err;
      }
    }

    result.kvkMatch = `${profiel.naam} (${profiel.kvkNummer})`;

    // Step 3: Build and apply updates
    const updates = buildUpdatePayload(bedrijf, profiel);
    const changes = describeChanges(bedrijf, updates);
    result.changes = changes;

    if (dryRun) {
      result.status = Object.keys(changes).length > 0 ? "updated" : "skipped";
      return result;
    }

    const { error } = await supabase
      .from("bedrijven")
      .update(updates)
      .eq("id", bedrijf.id);

    if (error) {
      result.status = "error";
      result.error = error.message;
      return result;
    }

    result.status = Object.keys(changes).length > 0 ? "updated" : "skipped";
    return result;
  } catch (err) {
    if (err instanceof KvkNotFoundError) {
      result.status = "not_found";
      return result;
    }
    result.status = "error";
    result.error = err instanceof Error ? err.message : String(err);
    return result;
  }
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main() {
  console.log("=== KVK Enrichment Script ===");
  console.log(`Environment: ${useTestEnv ? "TEST" : "PRODUCTION"}`);
  if (dryRun) console.log("Mode: dry run (no changes will be written)");
  if (force) console.log("Mode: force (re-enriching all companies)");
  console.log();

  const supabase = createClient(SUPABASE_URL!, SUPABASE_SERVICE_KEY!);

  // Build query for bedrijven to enrich
  let query = supabase
    .from("bedrijven")
    .select(
      "id, naam, kvk_nummer, website, straat, huisnummer, postcode, stad, provincie, latitude, longitude, aantal_medewerkers, data_verified_at",
    )
    .order("naam");

  if (specificId) {
    query = query.eq("id", specificId);
  }

  if (!force && !specificId) {
    const staleDate = new Date();
    staleDate.setDate(staleDate.getDate() - STALE_AFTER_DAYS);
    query = query.or(
      `data_verified_at.is.null,data_verified_at.lt.${staleDate.toISOString()}`,
    );
  }

  if (limit) {
    query = query.limit(limit);
  }

  const { data: bedrijven, error } = await query;

  if (error) {
    console.error("Error fetching bedrijven:", error);
    process.exit(1);
  }

  if (!bedrijven || bedrijven.length === 0) {
    console.log("No bedrijven to enrich.");
    return;
  }

  console.log(`Found ${bedrijven.length} bedrijven to enrich\n`);

  let updated = 0;
  let skipped = 0;
  let notFound = 0;
  let errors = 0;

  for (let i = 0; i < bedrijven.length; i++) {
    const bedrijf = bedrijven[i] as BedrijfRow;
    const progress = `[${i + 1}/${bedrijven.length}]`;

    const result = await enrichBedrijf(supabase, bedrijf);

    switch (result.status) {
      case "updated": {
        updated++;
        const changeKeys = Object.keys(result.changes ?? {});
        console.log(
          `${progress} ✓ ${bedrijf.naam} — updated: ${changeKeys.join(", ")}`,
        );
        if (result.kvkMatch) {
          console.log(`        matched: ${result.kvkMatch}`);
        }
        for (const [field, { old: oldVal, new: newVal }] of Object.entries(
          result.changes ?? {},
        )) {
          console.log(`        ${field}: "${oldVal ?? ""}" → "${newVal}"`);
        }
        break;
      }
      case "skipped":
        skipped++;
        console.log(
          `${progress} - ${bedrijf.naam} — no changes${result.kvkMatch ? ` (${result.kvkMatch})` : ""}`,
        );
        break;
      case "not_found":
        notFound++;
        console.log(`${progress} ? ${bedrijf.naam} — not found in KVK`);
        break;
      case "error":
        errors++;
        console.log(
          `${progress} ✗ ${bedrijf.naam} — error: ${result.error}`,
        );
        break;
    }

    if (i < bedrijven.length - 1) {
      await sleep(RATE_LIMIT_MS);
    }
  }

  // Summary
  const basisprofielKosten = totalApiCalls.basisprofiel * 0.02;
  console.log("\n=== Summary ===");
  console.log(`Total:          ${bedrijven.length}`);
  console.log(`Updated:        ${updated}`);
  console.log(`No change:      ${skipped}`);
  console.log(`Not found:      ${notFound}`);
  console.log(`Errors:         ${errors}`);
  console.log(`API calls:      ${totalApiCalls.zoeken} zoeken (free) + ${totalApiCalls.basisprofiel} basisprofiel`);
  console.log(`Estimated cost: €${basisprofielKosten.toFixed(2)}`);
  if (dryRun) console.log("\n(dry run — no changes were written)");
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
