/**
 * Helper script for the enrich-profile skill.
 *
 * Reads and updates company profile text (beschrijving, korte_beschrijving)
 * in Supabase. Designed to be called from the Claude skill, not standalone.
 *
 * Usage:
 *   npx tsx scripts/enrich-profile.ts --get <slug>
 *   npx tsx scripts/enrich-profile.ts --update <slug> --beschrijving <file> [--korte-beschrijving <text>]
 *   npx tsx scripts/enrich-profile.ts --set-website <slug> <url>
 *   npx tsx scripts/enrich-profile.ts --unpublish <slug>
 */

import { createClient } from "@supabase/supabase-js";
import { readFileSync } from "fs";
import { resolve } from "path";

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
// Supabase client
// ---------------------------------------------------------------------------

function getSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    console.error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
    process.exit(1);
  }
  return createClient(url, key, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}

// ---------------------------------------------------------------------------
// Commands
// ---------------------------------------------------------------------------

async function getCompany(slug: string) {
  const supabase = getSupabase();

  const { data, error } = await supabase
    .from("bedrijven")
    .select(
      `
      id, naam, slug, kvk_nummer,
      beschrijving, korte_beschrijving,
      email, telefoon, website,
      straat, huisnummer, postcode, stad, provincie,
      opgericht_jaar, aantal_medewerkers,
      is_published, is_gecertificeerd,
      bron, ascert_id,
      bedrijf_certificeringen(
        certificaat_nummer,
        geldig_tot,
        certificering_types(code, naam)
      ),
      bedrijf_specialisaties(
        specialisatie_types(naam, slug)
      )
    `,
    )
    .eq("slug", slug)
    .single();

  if (error) {
    console.error(`Error fetching company "${slug}":`, error.message);
    process.exit(1);
  }

  if (!data) {
    console.error(`Company with slug "${slug}" not found`);
    process.exit(1);
  }

  // Output as JSON for Claude to parse
  console.log(JSON.stringify(data, null, 2));
}

async function updateProfile(
  slug: string,
  beschrijvingFile: string | null,
  korteBeschrijving: string | null,
) {
  const supabase = getSupabase();

  const updates: Record<string, unknown> = {
    updated_at: new Date().toISOString(),
  };

  if (beschrijvingFile) {
    try {
      const content = readFileSync(beschrijvingFile, "utf-8").trim();
      if (!content) {
        console.error("Beschrijving file is empty");
        process.exit(1);
      }
      updates.beschrijving = content;
    } catch {
      console.error(`Could not read beschrijving file: ${beschrijvingFile}`);
      process.exit(1);
    }
  }

  if (korteBeschrijving) {
    if (korteBeschrijving.length > 160) {
      console.error(
        `korte_beschrijving is ${korteBeschrijving.length} chars (max 160)`,
      );
      process.exit(1);
    }
    updates.korte_beschrijving = korteBeschrijving;
  }

  if (Object.keys(updates).length <= 1) {
    console.error("No updates provided (need --beschrijving and/or --korte-beschrijving)");
    process.exit(1);
  }

  const { data, error } = await supabase
    .from("bedrijven")
    .update(updates)
    .eq("slug", slug)
    .select("id, naam, slug, beschrijving, korte_beschrijving")
    .single();

  if (error) {
    console.error(`Error updating "${slug}":`, error.message);
    process.exit(1);
  }

  console.log(`Updated profile for "${data.naam}" (${data.slug})`);
  console.log(`  beschrijving: ${data.beschrijving?.slice(0, 80)}...`);
  console.log(`  korte_beschrijving: ${data.korte_beschrijving}`);
}

async function setWebsite(slug: string, url: string) {
  const supabase = getSupabase();

  const { data, error } = await supabase
    .from("bedrijven")
    .update({ website: url, updated_at: new Date().toISOString() })
    .eq("slug", slug)
    .select("id, naam, slug, website")
    .single();

  if (error) {
    console.error(`Error setting website for "${slug}":`, error.message);
    process.exit(1);
  }

  console.log(`Set website for "${data.naam}" (${data.slug}) to ${data.website}`);
}

async function unpublish(slug: string) {
  const supabase = getSupabase();

  const { data, error } = await supabase
    .from("bedrijven")
    .update({ is_published: false, updated_at: new Date().toISOString() })
    .eq("slug", slug)
    .select("id, naam, slug, is_published")
    .single();

  if (error) {
    console.error(`Error unpublishing "${slug}":`, error.message);
    process.exit(1);
  }

  console.log(
    `Unpublished "${data.naam}" (${data.slug}) — is_published = ${data.is_published}`,
  );
}

// ---------------------------------------------------------------------------
// CLI
// ---------------------------------------------------------------------------

async function main() {
  const args = process.argv.slice(2);

  if (args.includes("--get")) {
    const slug = args[args.indexOf("--get") + 1];
    if (!slug) {
      console.error("Usage: --get <slug>");
      process.exit(1);
    }
    await getCompany(slug);
    return;
  }

  if (args.includes("--set-website")) {
    const slug = args[args.indexOf("--set-website") + 1];
    const url = args[args.indexOf("--set-website") + 2];
    if (!slug || !url) {
      console.error("Usage: --set-website <slug> <url>");
      process.exit(1);
    }
    await setWebsite(slug, url);
    return;
  }

  if (args.includes("--unpublish")) {
    const slug = args[args.indexOf("--unpublish") + 1];
    if (!slug) {
      console.error("Usage: --unpublish <slug>");
      process.exit(1);
    }
    await unpublish(slug);
    return;
  }

  if (args.includes("--update")) {
    const slug = args[args.indexOf("--update") + 1];
    if (!slug) {
      console.error("Usage: --update <slug> --beschrijving <file> [--korte-beschrijving <text>]");
      process.exit(1);
    }

    let beschrijvingFile: string | null = null;
    if (args.includes("--beschrijving")) {
      beschrijvingFile = args[args.indexOf("--beschrijving") + 1];
    }

    let korteBeschrijving: string | null = null;
    if (args.includes("--korte-beschrijving")) {
      korteBeschrijving = args[args.indexOf("--korte-beschrijving") + 1];
    }

    await updateProfile(slug, beschrijvingFile, korteBeschrijving);
    return;
  }

  console.error(
    "Usage:\n" +
      "  npx tsx scripts/enrich-profile.ts --get <slug>\n" +
      "  npx tsx scripts/enrich-profile.ts --update <slug> --beschrijving <file> [--korte-beschrijving <text>]\n" +
      "  npx tsx scripts/enrich-profile.ts --set-website <slug> <url>\n" +
      "  npx tsx scripts/enrich-profile.ts --unpublish <slug>",
  );
  process.exit(1);
}

main().catch((err) => {
  console.error("Unexpected error:", err);
  process.exit(1);
});
