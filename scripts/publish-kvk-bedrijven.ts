/**
 * Publish bedrijven with KVK match, keep those without KVK unpublished.
 *
 * Usage:
 *   npx tsx scripts/publish-kvk-bedrijven.ts
 *   npx tsx scripts/publish-kvk-bedrijven.ts --dry-run
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
  // 1. Count totals
  const { count: totalCount } = await supabase
    .from("bedrijven")
    .select("*", { count: "exact", head: true });

  console.log(`Total bedrijven in database: ${totalCount}`);

  // 2. Count bedrijven WITH kvk_nummer (to publish)
  const { data: withKvk, error: withKvkError } = await supabase
    .from("bedrijven")
    .select("id, naam, kvk_nummer, is_published, stad")
    .not("kvk_nummer", "is", null)
    .neq("kvk_nummer", "");

  if (withKvkError) {
    console.error("Error fetching bedrijven with KVK:", withKvkError);
    process.exit(1);
  }

  // 3. Count bedrijven WITHOUT kvk_nummer (keep unpublished)
  const { data: withoutKvk, error: withoutKvkError } = await supabase
    .from("bedrijven")
    .select("id, naam, kvk_nummer, is_published, stad")
    .or("kvk_nummer.is.null,kvk_nummer.eq.");

  if (withoutKvkError) {
    console.error("Error fetching bedrijven without KVK:", withoutKvkError);
    process.exit(1);
  }

  const toPublish = withKvk!.filter((b) => !b.is_published);
  const toUnpublish = withoutKvk!.filter((b) => b.is_published);

  console.log(`\nBedrijven WITH KVK-nummer: ${withKvk!.length}`);
  console.log(`  - Already published: ${withKvk!.length - toPublish.length}`);
  console.log(`  - To publish: ${toPublish.length}`);
  console.log(`\nBedrijven WITHOUT KVK-nummer: ${withoutKvk!.length}`);
  console.log(`  - Already unpublished: ${withoutKvk!.length - toUnpublish.length}`);
  console.log(`  - To unpublish: ${toUnpublish.length}`);

  if (withoutKvk!.length > 0) {
    console.log(`\nBedrijven zonder KVK (blijven unpublished):`);
    for (const b of withoutKvk!) {
      console.log(`  - ${b.naam} (${b.stad || "geen stad"})`);
    }
  }

  if (dryRun) {
    console.log("\n--- DRY RUN — no changes applied ---");
    return;
  }

  // 4. Publish all bedrijven WITH kvk_nummer
  if (toPublish.length > 0) {
    const ids = toPublish.map((b) => b.id);
    const { data, error } = await supabase
      .from("bedrijven")
      .update({ is_published: true })
      .in("id", ids)
      .select("id");

    if (error) {
      console.error("Error publishing bedrijven:", error);
      process.exit(1);
    }
    console.log(`\n✓ Published ${data.length} bedrijven with KVK-nummer`);
  } else {
    console.log("\n✓ No bedrijven to publish (all with KVK already published)");
  }

  // 5. Unpublish any bedrijven WITHOUT kvk_nummer that are somehow published
  if (toUnpublish.length > 0) {
    const ids = toUnpublish.map((b) => b.id);
    const { data, error } = await supabase
      .from("bedrijven")
      .update({ is_published: false })
      .in("id", ids)
      .select("id");

    if (error) {
      console.error("Error unpublishing bedrijven:", error);
      process.exit(1);
    }
    console.log(`✓ Unpublished ${data.length} bedrijven without KVK-nummer`);
  } else {
    console.log("✓ No bedrijven to unpublish (all without KVK already unpublished)");
  }

  // 6. Verify final state
  console.log("\n--- VERIFICATION ---");
  const { count: publishedCount } = await supabase
    .from("bedrijven")
    .select("*", { count: "exact", head: true })
    .eq("is_published", true);

  const { count: unpublishedCount } = await supabase
    .from("bedrijven")
    .select("*", { count: "exact", head: true })
    .eq("is_published", false);

  // Check no published bedrijven without KVK
  const { count: publishedWithoutKvk } = await supabase
    .from("bedrijven")
    .select("*", { count: "exact", head: true })
    .eq("is_published", true)
    .or("kvk_nummer.is.null,kvk_nummer.eq.");

  console.log(`Published: ${publishedCount}`);
  console.log(`Unpublished: ${unpublishedCount}`);
  console.log(`Published WITHOUT KVK (should be 0): ${publishedWithoutKvk}`);

  if (publishedWithoutKvk === 0) {
    console.log("\n✓ All good! Only bedrijven with KVK-nummer are published.");
  } else {
    console.error("\n✗ ERROR: Some published bedrijven have no KVK-nummer!");
  }
}

main();
