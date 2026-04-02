/**
 * Generate professional Dutch descriptions for companies without one.
 *
 * Uses template variations (no AI API) based on certifications, location,
 * and specializations.
 *
 * Usage:
 *   npx tsx scripts/generate-descriptions.ts --dry-run   # preview without saving
 *   npx tsx scripts/generate-descriptions.ts              # generate and save
 */

import { createClient } from "@supabase/supabase-js";
import { readFileSync } from "fs";
import { resolve } from "path";

// ---------------------------------------------------------------------------
// .env.local loader
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

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_KEY =
  process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.SUPABASE_SERVICE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  console.error(
    "Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local",
  );
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
});

const dryRun = process.argv.includes("--dry-run");

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface Company {
  id: string;
  naam: string;
  stad: string | null;
  provincie: string | null;
  bedrijf_certificeringen: {
    certificaat_nummer: string;
    geldig_tot: string;
    certificering_types: { code: string; naam: string };
  }[];
  bedrijf_specialisaties: {
    specialisatie_types: { naam: string; slug: string };
  }[];
}

type CertProfile = "SC-530" | "SC-540" | "SC-560" | "SC-530+SC-540" | "none";

// ---------------------------------------------------------------------------
// Template definitions
// ---------------------------------------------------------------------------

function getCertProfile(company: Company): CertProfile {
  const codes = company.bedrijf_certificeringen.map(
    (c) => c.certificering_types.code,
  );
  const has530 = codes.includes("SC-530");
  const has540 = codes.includes("SC-540");
  const has560 = codes.includes("SC-560");

  if (has530 && has540) return "SC-530+SC-540";
  if (has530) return "SC-530";
  if (has540) return "SC-540";
  if (has560) return "SC-560";
  return "none";
}

function getSpecNames(company: Company): string[] {
  return company.bedrijf_specialisaties.map((s) => s.specialisatie_types.naam);
}

function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

// Location string helper
function locatie(company: Company): string {
  if (company.stad && company.provincie) {
    return `${company.stad}, ${company.provincie}`;
  }
  if (company.stad) return company.stad;
  if (company.provincie) return company.provincie;
  return "Nederland";
}

function locatieKort(company: Company): string {
  return company.stad ?? company.provincie ?? "Nederland";
}

// Format specialisaties as readable text
function formatSpecs(specs: string[]): string {
  if (specs.length === 0) return "";
  if (specs.length === 1) return specs[0].toLowerCase();
  const last = specs[specs.length - 1].toLowerCase();
  const rest = specs
    .slice(0, -1)
    .map((s) => s.toLowerCase())
    .join(", ");
  return `${rest} en ${last}`;
}

// ---------------------------------------------------------------------------
// Description templates per cert profile
// ---------------------------------------------------------------------------

type TemplateFunc = (
  naam: string,
  loc: string,
  locK: string,
  specText: string,
) => { beschrijving: string; korte_beschrijving: string };

const templates530: TemplateFunc[] = [
  (naam, loc, locK, specText) => ({
    beschrijving:
      `${naam} is een gecertificeerd asbestverwijderingsbedrijf gevestigd in ${loc}. ` +
      `Het bedrijf beschikt over een SC-530 certificering voor het veilig verwijderen van asbesthoudende materialen. ` +
      (specText
        ? `${naam} is gespecialiseerd in ${specText}. `
        : `${naam} voert werkzaamheden uit conform de geldende wet- en regelgeving. `),
    korte_beschrijving: `Gecertificeerd asbestverwijderingsbedrijf in ${locK}. SC-530 certificering voor veilige asbestverwijdering.`,
  }),
  (naam, loc, locK, specText) => ({
    beschrijving:
      `${naam} uit ${loc} is gecertificeerd voor asbestverwijdering (SC-530). ` +
      `Het bedrijf verwijdert asbesthoudende materialen op een veilige en verantwoorde manier, conform alle geldende regelgeving. ` +
      (specText
        ? `Tot de specialisaties behoren ${specText}.`
        : `Alle werkzaamheden worden uitgevoerd door gekwalificeerd personeel.`),
    korte_beschrijving: `SC-530 gecertificeerd asbestverwijderingsbedrijf in ${locK}. Veilige en vakkundige asbestverwijdering.`,
  }),
  (naam, loc, locK, specText) => ({
    beschrijving:
      `Als SC-530 gecertificeerd bedrijf verzorgt ${naam} professionele asbestverwijdering in de regio ${loc}. ` +
      (specText
        ? `Het bedrijf richt zich onder meer op ${specText}. `
        : `Het bedrijf beschikt over de juiste certificeringen en kennis voor het veilig saneren van asbest. `) +
      `Alle werkzaamheden vinden plaats volgens de strenge Nederlandse veiligheidsnormen.`,
    korte_beschrijving: `SC-530 gecertificeerd voor asbestverwijdering in ${locK}. Professionele asbestsanering.`,
  }),
  (naam, loc, locK, specText) => ({
    beschrijving:
      `${naam}, gevestigd in ${loc}, is een erkend asbestverwijderingsbedrijf met SC-530 certificering. ` +
      `Het bedrijf voert asbestsaneringen uit volgens de geldende normen en veiligheidsvoorschriften. ` +
      (specText
        ? `Specialisaties zijn onder andere ${specText}.`
        : `Van inventarisatie tot verwijdering, alle werkzaamheden worden zorgvuldig uitgevoerd.`),
    korte_beschrijving: `Erkend asbestverwijderingsbedrijf in ${locK} met SC-530 certificering. Veilige asbestsanering.`,
  }),
  (naam, loc, locK, specText) => ({
    beschrijving:
      `Voor professionele asbestverwijdering in ${loc} kunt u terecht bij ${naam}. ` +
      `Dit SC-530 gecertificeerde bedrijf verwijdert asbest op een veilige en deskundige wijze. ` +
      (specText
        ? `Het bedrijf heeft ervaring met ${specText}.`
        : `Alle projecten worden uitgevoerd conform de wettelijke vereisten.`),
    korte_beschrijving: `${naam} in ${locK}: SC-530 gecertificeerd voor professionele asbestverwijdering.`,
  }),
  (naam, loc, locK, specText) => ({
    beschrijving:
      `${naam} is actief in ${loc} als gecertificeerd asbestverwijderingsbedrijf. ` +
      `Met de SC-530 certificering is het bedrijf bevoegd om asbesthoudende materialen veilig te verwijderen en af te voeren. ` +
      (specText
        ? `Het werkgebied omvat onder meer ${specText}.`
        : `De werkzaamheden worden uitgevoerd door ervaren vakmensen.`),
    korte_beschrijving: `Gecertificeerd (SC-530) asbestverwijderingsbedrijf in ${locK}. Veilige verwijdering en afvoer.`,
  }),
];

const templates540: TemplateFunc[] = [
  (naam, loc, locK, specText) => ({
    beschrijving:
      `${naam} is een gecertificeerd asbestinventarisatiebureau gevestigd in ${loc}. ` +
      `Het bedrijf beschikt over een SC-540 certificering voor het uitvoeren van asbestinventarisaties. ` +
      (specText
        ? `${naam} is gespecialiseerd in ${specText}.`
        : `${naam} brengt asbesthoudende materialen in kaart conform de geldende richtlijnen.`),
    korte_beschrijving: `Gecertificeerd asbestinventarisatiebureau in ${locK}. SC-540 certificering voor asbestonderzoek.`,
  }),
  (naam, loc, locK, specText) => ({
    beschrijving:
      `${naam} uit ${loc} voert professionele asbestinventarisaties uit. ` +
      `Met de SC-540 certificering is het bedrijf bevoegd om asbestonderzoek te doen en rapportages op te stellen. ` +
      (specText
        ? `Het bureau is gespecialiseerd in ${specText}.`
        : `De inventarisaties worden uitgevoerd door gecertificeerde inspecteurs.`),
    korte_beschrijving: `SC-540 gecertificeerd asbestinventarisatiebureau in ${locK}. Professioneel asbestonderzoek.`,
  }),
  (naam, loc, locK, specText) => ({
    beschrijving:
      `Als SC-540 gecertificeerd bureau verzorgt ${naam} asbestinventarisaties in de regio ${loc}. ` +
      (specText
        ? `Het bureau richt zich onder meer op ${specText}. `
        : `Het bureau brengt de aanwezigheid van asbest in gebouwen nauwkeurig in kaart. `) +
      `Alle onderzoeken resulteren in een officieel asbestinventarisatierapport.`,
    korte_beschrijving: `SC-540 gecertificeerd voor asbestinventarisatie in ${locK}. Officieel asbestonderzoek.`,
  }),
  (naam, loc, locK, specText) => ({
    beschrijving:
      `${naam}, gevestigd in ${loc}, is een erkend asbestinventarisatiebureau met SC-540 certificering. ` +
      `Het bureau voert asbestonderzoeken uit en stelt inventarisatierapporten op conform de wettelijke eisen. ` +
      (specText
        ? `Specialisaties zijn onder andere ${specText}.`
        : `Zowel type A als type B inventarisaties behoren tot het dienstenpakket.`),
    korte_beschrijving: `Erkend asbestinventarisatiebureau in ${locK} met SC-540 certificering.`,
  }),
  (naam, loc, locK, specText) => ({
    beschrijving:
      `Voor een professionele asbestinventarisatie in ${loc} kunt u terecht bij ${naam}. ` +
      `Dit SC-540 gecertificeerde bureau onderzoekt gebouwen op de aanwezigheid van asbesthoudende materialen. ` +
      (specText
        ? `Het bureau heeft ervaring met ${specText}.`
        : `De rapportages voldoen aan alle geldende normen en voorschriften.`),
    korte_beschrijving: `${naam} in ${locK}: SC-540 gecertificeerd voor professioneel asbestonderzoek.`,
  }),
  (naam, loc, locK, specText) => ({
    beschrijving:
      `${naam} is actief in ${loc} als gecertificeerd asbestinventarisatiebureau. ` +
      `Met de SC-540 certificering stelt het bureau betrouwbare asbestinventarisatierapporten op. ` +
      (specText
        ? `Het werkgebied omvat onder meer ${specText}.`
        : `Het bureau werkt met ervaren en gediplomeerde asbestinspecteurs.`),
    korte_beschrijving: `Gecertificeerd (SC-540) asbestinventarisatiebureau in ${locK}. Betrouwbaar asbestonderzoek.`,
  }),
];

const templatesBoth: TemplateFunc[] = [
  (naam, loc, locK, specText) => ({
    beschrijving:
      `${naam} is een gecertificeerd asbestbedrijf gevestigd in ${loc} dat zowel asbestinventarisaties als asbestverwijdering verzorgt. ` +
      `Het bedrijf beschikt over de SC-530 (verwijdering) en SC-540 (inventarisatie) certificeringen. ` +
      (specText
        ? `${naam} is gespecialiseerd in ${specText}.`
        : `Hiermee biedt ${naam} een complete dienstverlening op het gebied van asbest.`),
    korte_beschrijving: `Gecertificeerd asbestbedrijf in ${locK} met SC-530 en SC-540 certificering. Inventarisatie en verwijdering.`,
  }),
  (naam, loc, locK, specText) => ({
    beschrijving:
      `${naam} uit ${loc} biedt een compleet pakket asbestdiensten, van inventarisatie tot verwijdering. ` +
      `Het bedrijf is zowel SC-530 als SC-540 gecertificeerd en werkt conform alle geldende veiligheidsvoorschriften. ` +
      (specText
        ? `Tot de specialisaties behoren ${specText}.`
        : `Alle werkzaamheden worden uitgevoerd door gekwalificeerd en gecertificeerd personeel.`),
    korte_beschrijving: `SC-530 en SC-540 gecertificeerd in ${locK}. Complete asbestdienstverlening van onderzoek tot sanering.`,
  }),
  (naam, loc, locK, specText) => ({
    beschrijving:
      `Als dubbelcertificeerd asbestbedrijf (SC-530 en SC-540) verzorgt ${naam} in ${loc} zowel de inventarisatie als de verwijdering van asbest. ` +
      (specText
        ? `Het bedrijf richt zich onder meer op ${specText}. `
        : `Dit maakt het bedrijf een all-in-one partner voor asbestzaken. `) +
      `Alle werkzaamheden voldoen aan de Nederlandse veiligheidsnormen.`,
    korte_beschrijving: `Dubbelcertificeerd asbestbedrijf in ${locK} (SC-530 + SC-540). Inventarisatie en verwijdering.`,
  }),
  (naam, loc, locK, specText) => ({
    beschrijving:
      `${naam}, gevestigd in ${loc}, is gecertificeerd voor zowel asbestinventarisatie (SC-540) als asbestverwijdering (SC-530). ` +
      `Het bedrijf kan daardoor het volledige traject van onderzoek tot sanering verzorgen. ` +
      (specText
        ? `Specialisaties zijn onder andere ${specText}.`
        : `Opdrachtgevers profiteren van een gestroomlijnd proces met een enkel aanspreekpunt.`),
    korte_beschrijving: `${naam} in ${locK}: gecertificeerd voor asbestinventarisatie (SC-540) en verwijdering (SC-530).`,
  }),
  (naam, loc, locK, specText) => ({
    beschrijving:
      `Voor een complete asbestaanpak in ${loc} kunt u terecht bij ${naam}. ` +
      `Dit bedrijf combineert SC-540 (inventarisatie) en SC-530 (verwijdering) certificeringen en begeleidt projecten van begin tot eind. ` +
      (specText
        ? `Het bedrijf heeft ervaring met ${specText}.`
        : `Alle fasen worden conform de wettelijke eisen uitgevoerd.`),
    korte_beschrijving: `Volledig gecertificeerd asbestbedrijf in ${locK}. SC-530 en SC-540 voor onderzoek en verwijdering.`,
  }),
  (naam, loc, locK, specText) => ({
    beschrijving:
      `${naam} is een veelzijdig asbestbedrijf in ${loc} met certificeringen voor zowel inventarisatie (SC-540) als verwijdering (SC-530). ` +
      `Het bedrijf biedt hiermee een totaaloplossing voor asbestproblematiek. ` +
      (specText
        ? `Het werkgebied omvat onder meer ${specText}.`
        : `Klanten kunnen rekenen op deskundige begeleiding bij elk asbestproject.`),
    korte_beschrijving: `Gecertificeerd voor inventarisatie en verwijdering in ${locK}. SC-530 en SC-540 certificering.`,
  }),
];

const templates560: TemplateFunc[] = [
  (naam, loc, locK) => ({
    beschrijving:
      `${naam} is een gecertificeerd laboratorium voor asbestanalyse gevestigd in ${loc}. ` +
      `Het laboratorium beschikt over een SC-560 certificering voor het analyseren van asbesthoudende materialen. ` +
      `Alle analyses worden uitgevoerd conform de geldende normen en richtlijnen.`,
    korte_beschrijving: `Gecertificeerd asbestlaboratorium in ${locK}. SC-560 certificering voor asbestanalyse.`,
  }),
  (naam, loc, locK) => ({
    beschrijving:
      `${naam} uit ${loc} is SC-560 gecertificeerd voor het uitvoeren van laboratoriumanalyses op asbesthoudende materialen. ` +
      `Het laboratorium levert betrouwbare analyseresultaten die voldoen aan alle wettelijke eisen. ` +
      `Monsters worden zorgvuldig onderzocht door gekwalificeerde analisten.`,
    korte_beschrijving: `SC-560 gecertificeerd laboratorium in ${locK}. Professionele asbestanalyse en rapportage.`,
  }),
  (naam, loc, locK) => ({
    beschrijving:
      `Als SC-560 gecertificeerd laboratorium analyseert ${naam} in ${loc} materiaalmonsters op de aanwezigheid van asbest. ` +
      `De analyses worden uitgevoerd met geaccrediteerde methoden en resulteren in officieel erkende rapportages.`,
    korte_beschrijving: `${naam} in ${locK}: SC-560 gecertificeerd laboratorium voor asbestanalyse.`,
  }),
];

const templatesNone: TemplateFunc[] = [
  (naam, loc, locK) => ({
    beschrijving:
      `${naam} is een asbestgerelateerd bedrijf gevestigd in ${loc}. ` +
      `Neem contact op met ${naam} voor meer informatie over hun dienstverlening op het gebied van asbest.`,
    korte_beschrijving: `Asbestbedrijf in ${locK}. Neem contact op voor informatie over dienstverlening.`,
  }),
  (naam, loc, locK) => ({
    beschrijving:
      `${naam} uit ${loc} is actief in de asbestbranche. ` +
      `Voor meer informatie over de beschikbare diensten en certificeringen kunt u contact opnemen met het bedrijf.`,
    korte_beschrijving: `${naam} in ${locK}, actief in de asbestbranche. Neem contact op voor meer informatie.`,
  }),
];

// ---------------------------------------------------------------------------
// Generate descriptions
// ---------------------------------------------------------------------------

function generateDescription(company: Company): {
  beschrijving: string;
  korte_beschrijving: string;
} {
  const profile = getCertProfile(company);
  const specs = getSpecNames(company);
  const specText = formatSpecs(specs);
  const loc = locatie(company);
  const locK = locatieKort(company);
  const naam = company.naam;

  let templates: TemplateFunc[];
  switch (profile) {
    case "SC-530":
      templates = templates530;
      break;
    case "SC-540":
      templates = templates540;
      break;
    case "SC-530+SC-540":
      templates = templatesBoth;
      break;
    case "SC-560":
      templates = templates560;
      break;
    default:
      templates = templatesNone;
  }

  const result = pickRandom(templates)(naam, loc, locK, specText);

  // Ensure korte_beschrijving is max 160 chars
  if (result.korte_beschrijving.length > 160) {
    result.korte_beschrijving = result.korte_beschrijving.slice(0, 157) + "...";
  }

  return result;
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main() {
  console.log(dryRun ? "=== DRY RUN ===" : "=== GENERATING DESCRIPTIONS ===");
  console.log();

  // Fetch all companies without beschrijving
  const { data: companies, error } = await supabase
    .from("bedrijven")
    .select(
      `
      id, naam, stad, provincie,
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
    .is("beschrijving", null)
    .order("naam");

  if (error) {
    console.error("Error fetching companies:", error.message);
    process.exit(1);
  }

  if (!companies || companies.length === 0) {
    console.log("No companies without descriptions found.");
    return;
  }

  console.log(`Found ${companies.length} companies without descriptions.`);
  console.log();

  // Stats
  const stats = { total: companies.length, updated: 0, errors: 0 };
  const profileCounts: Record<string, number> = {};

  for (let i = 0; i < companies.length; i++) {
    const company = companies[i] as unknown as Company;
    const profile = getCertProfile(company);
    profileCounts[profile] = (profileCounts[profile] ?? 0) + 1;

    const { beschrijving, korte_beschrijving } =
      generateDescription(company);

    // Show first 5 examples always, plus every 50th
    if (i < 5 || i % 50 === 0) {
      console.log(`[${i + 1}/${companies.length}] ${company.naam}`);
      console.log(`  Profile: ${profile}`);
      console.log(`  Beschrijving: ${beschrijving}`);
      console.log(`  Kort: ${korte_beschrijving} (${korte_beschrijving.length} chars)`);
      console.log();
    }

    if (!dryRun) {
      const { error: updateError } = await supabase
        .from("bedrijven")
        .update({
          beschrijving,
          korte_beschrijving,
          updated_at: new Date().toISOString(),
        })
        .eq("id", company.id);

      if (updateError) {
        console.error(`  ERROR updating ${company.naam}:`, updateError.message);
        stats.errors++;
      } else {
        stats.updated++;
      }
    } else {
      stats.updated++;
    }
  }

  // Report
  console.log("=== RESULTS ===");
  console.log(`Total companies: ${stats.total}`);
  console.log(`${dryRun ? "Would update" : "Updated"}: ${stats.updated}`);
  console.log(`Errors: ${stats.errors}`);
  console.log();
  console.log("By certification profile:");
  for (const [profile, count] of Object.entries(profileCounts).sort()) {
    console.log(`  ${profile}: ${count}`);
  }
}

main().catch((err) => {
  console.error("Unexpected error:", err);
  process.exit(1);
});
