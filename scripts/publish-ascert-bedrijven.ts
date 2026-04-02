/**
 * Bulk-publish all Ascert-imported bedrijven in Supabase.
 *
 * Usage:
 *   npx tsx scripts/publish-ascert-bedrijven.ts
 *   npx tsx scripts/publish-ascert-bedrijven.ts --dry-run
 */

import { createClient } from "@supabase/supabase-js";
import { readFileSync } from "fs";
import { resolve } from "path";

// Parse .env.local without dotenv dependency
const envPath = resolve(__dirname, "../.env.local");
try {
  const envContent = readFileSync(envPath, "utf-8");
  for (const line of envContent.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eqIndex = trimmed.indexOf("=");
    if (eqIndex === -1) continue;
    const key = trimmed.slice(0, eqIndex).trim();
    const value = trimmed.slice(eqIndex + 1).trim().replace(/^["']|["']$/g, "");
    if (!process.env[key]) process.env[key] = value;
  }
} catch {
  console.error(`Could not read ${envPath}`);
}

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_KEY =
  process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.SUPABASE_SERVICE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  console.error(
    "Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local",
  );
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);
const dryRun = process.argv.includes("--dry-run");

async function main() {
  // Count unpublished Ascert bedrijven
  const { count, error: countError } = await supabase
    .from("bedrijven")
    .select("*", { count: "exact", head: true })
    .eq("bron", "ascert")
    .eq("is_published", false);

  if (countError) {
    console.error("Error counting bedrijven:", countError);
    process.exit(1);
  }

  console.log(`Found ${count} unpublished Ascert bedrijven`);

  if (dryRun) {
    console.log("Dry run — no changes applied");
    return;
  }

  if (count === 0) {
    console.log("Nothing to do");
    return;
  }

  // Bulk update
  const { data, error } = await supabase
    .from("bedrijven")
    .update({ is_published: true })
    .eq("bron", "ascert")
    .eq("is_published", false)
    .select("id");

  if (error) {
    console.error("Error publishing bedrijven:", error);
    process.exit(1);
  }

  console.log(`Published ${data.length} bedrijven`);
}

main();
