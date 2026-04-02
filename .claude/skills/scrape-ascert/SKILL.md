---
name: scrape-ascert
description: Scrape the Ascert certificate register for certified asbestos companies (SC-530/SC-540) and import/sync with Supabase. Use when the user asks to scrape Ascert, update company data, refresh certificates, sync data, or import asbestos companies.
disable-model-invocation: true
allowed-tools: Bash(python *), Bash(source *), Bash(pip *), Bash(ls *), Bash(wc *), Bash(cat *), Read, Grep, Glob
argument-hint: "[city|--all|--sync|--resume|--import|--dry-run]"
---

# Ascert Register Scraper & Sync

Scrape het Ascert certificaatregister (https://www.ascert.nl/zoek-een-certificaat) voor gecertificeerde asbestverwijderings- (SC-530) en inventarisatiebedrijven (SC-540), en synchroniseer met Supabase.

**Bron: Ascert** — Hergebruik conform Ascert disclaimer met bronvermelding.

## Scripts

Alle scripts staan in `scripts/ascert-scraper/`:
- `scrape_ascert.py` — Hoofdscript voor het scrapen
- `import_to_supabase.py` — Import én sync van JSON naar Supabase
- `cities.py` — Lijst van ~350 Nederlandse gemeenten
- `requirements.txt` — Python dependencies

Lees deze bestanden voor context als je het gedrag wilt begrijpen:
- [scrape_ascert.py](scripts/ascert-scraper/scrape_ascert.py)
- [import_to_supabase.py](scripts/ascert-scraper/import_to_supabase.py)

## Uitvoering

### Stap 1: Environment setup

```bash
cd scripts/ascert-scraper
source venv/bin/activate 2>/dev/null || (python3 -m venv venv && source venv/bin/activate && pip install -q -r requirements.txt)
```

### Stap 2: Bepaal de actie op basis van $ARGUMENTS

Interpreteer de argumenten als volgt:

| Argument | Actie |
|----------|-------|
| `<stadnaam>` (bijv. "Amsterdam") | Scrape alleen die stad |
| `--all` of geen argument | Volledige scrape van alle ~350 steden |
| `--resume` | Hervat een eerder afgebroken scrape |
| `--import` | Eerste import: schrijf alle data naar Supabase |
| `--sync` | Periodieke sync: vergelijk Ascert met Supabase, pas wijzigingen toe |
| `--report-only` | Alleen diff-rapport genereren, niets aanpassen |
| `--dry-run` | Preview import/sync zonder te schrijven naar Supabase |
| `--detail-only` | Haal alleen detailpagina's op voor al ontdekte certificaten |
| `--force-refresh` | Herlaad alle detailpagina's (ook al gecachte) voor sync |

Combinaties zijn mogelijk, bijv.:
- `Amsterdam --import` → scrape Amsterdam en importeer daarna
- `--sync` → volledige scrape + sync (update gewijzigde records)
- `--sync --dry-run` → volledige scrape + preview van wijzigingen
- `--report-only` → volledige scrape + diff-rapport zonder wijzigingen

### Stap 3: Scrapen

Als er gescrapet moet worden (niet alleen `--import` of `--sync` zonder nieuwe data):

```bash
# Enkele stad
python scrape_ascert.py --city "$CITY"

# Alle steden (eerste keer)
python scrape_ascert.py

# Hervatten na onderbreking
python scrape_ascert.py --resume

# Periodieke refresh: alle steden + alle details opnieuw ophalen
python scrape_ascert.py --force-refresh

# Alleen details ophalen voor al ontdekte certificaten
python scrape_ascert.py --detail-only
```

Na het scrapen, controleer de output:
1. Toon het aantal gevonden bedrijven uit de log output
2. Toon een sample van 3-5 bedrijven uit `data/ascert_raw.json`
3. Controleer of `data/ascert_clean.csv` is aangemaakt

### Stap 4a: Eerste import naar Supabase

Alleen als `--import` is meegegeven. Gebruik dit voor de **eerste keer** dat de data naar Supabase wordt geschreven:

```bash
# Dry run eerst (altijd aanbevolen)
python import_to_supabase.py --dry-run

# Echte import
python import_to_supabase.py
```

### Stap 4b: Periodieke sync met Supabase

Alleen als `--sync` of `--report-only` is meegegeven. Gebruik dit voor **alle volgende keren** om bestaande data bij te werken:

```bash
# Stap 1: Scrape Ascert opnieuw met --force-refresh (alle details vers ophalen)
python scrape_ascert.py --force-refresh

# Stap 2: Genereer eerst een rapport om te zien wat er veranderd is
python import_to_supabase.py --report-only

# Stap 3: Toon het rapport aan de gebruiker
# Lees data/sync_report.json en vat samen:
# - Nieuwe bedrijven
# - Gewijzigde velden (per bedrijf)
# - Verlopen/ingetrokken certificaten
# - Ongewijzigde bedrijven

# Stap 4: Na goedkeuring, pas wijzigingen toe
python import_to_supabase.py --sync
```

### Stap 5: Rapportage

Na afloop, geef de gebruiker een samenvatting:

**Bij scrape:**
- Totaal aantal gevonden certificaten
- Verdeling SC-530 (verwijdering) vs SC-540 (inventarisatie)
- Aantal geldige vs ongeldige certificaten
- Locatie van de output bestanden

**Bij import:**
- Aantal created/updated/errors
- Locatie van de output bestanden

**Bij sync:**
- Nieuwe bedrijven gevonden
- Bedrijven met gewijzigde gegevens (welke velden, oude → nieuwe waarde)
- Verlopen/ingetrokken certificaten
- Ongewijzigde bedrijven
- Aantal toegepaste wijzigingen
- Volledige rapport locatie (`data/sync_report.json`)

## Sync-strategie

Ascert heeft **geen "laatst bijgewerkt" timestamp**. Daarom werkt de sync als volgt:

### Hoe veranderingen worden gedetecteerd
1. **Scrape Ascert opnieuw** met `--force-refresh` zodat alle detailpagina's vers worden opgehaald
2. **Vergelijk veld-voor-veld** met de Supabase data: naam, KvK, email, telefoon, adres, postcode, stad, provincie, certificeringsstatus
3. **Genereer een diff-rapport** (`data/sync_report.json`) met alle gevonden verschillen

### Wat de sync doet
- **Nieuwe bedrijven**: aanmaken in Supabase met `is_published=false`
- **Gewijzigde velden**: alleen de gewijzigde velden updaten (slug wordt nooit overschreven)
- **Verlopen certificaten**: `is_gecertificeerd` op `false` zetten (bedrijf wordt niet verwijderd)
- **Ongewijzigde bedrijven**: alleen `data_verified_at` timestamp bijwerken
- **Certificaat verloopdatum**: altijd bijwerken als deze gewijzigd is

### Wat de sync NIET doet
- Slug overschrijven (zou URLs breken)
- `is_published` wijzigen (handmatige review)
- Bedrijven verwijderen (alleen markeren als niet-gecertificeerd)
- Handmatig toegevoegde data overschrijven (alleen ascert-velden)

### Aanbevolen frequentie
- **Maandelijks**: volledige sync draaien (`--force-refresh` + `--sync`)
- **Wekelijks**: alleen `--report-only` om te checken of er veel verandert
- **Ad-hoc**: na signalen dat een bedrijf gewijzigd/geschorst is

### Timestamps in Supabase
- `data_verified_at` op `bedrijven` → wanneer we het laatst geverifieerd hebben tegen Ascert
- `verified_at` op `bedrijf_certificeringen` → wanneer de certificering laatst geverifieerd is
- Deze timestamps worden bij elke sync bijgewerkt, ook als er niets veranderd is

## Environment variabelen

Vereist een `.env` bestand in `scripts/ascert-scraper/` voor Supabase-operaties:
```
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_KEY=your-service-role-key
```

## Waarschuwingen

- **Volledige scrape duurt lang**: ~350 steden × 2.5 sec delay = minimaal 15 min voor fase 1, plus detailpagina's
- **Force-refresh duurt extra lang**: alle detailpagina's worden opnieuw opgehaald
- **Respectvol scrapen**: verander de delays NIET naar lagere waarden
- **is_published = false**: alle geïmporteerde bedrijven staan op unpublished voor handmatige review
- **Bronvermelding**: bij gebruik van de data altijd "Bron: Ascert" vermelden
- **Altijd eerst --report-only of --dry-run**: bij sync altijd eerst bekijken wat er gaat veranderen

## Database schema referentie

De data wordt gemapped naar de tabellen beschreven in `docs/DATABASE.md`:
- `bedrijven` — Hoofdtabel met bedrijfsgegevens (incl. `data_verified_at`)
- `bedrijf_certificeringen` — Koppeltabel voor certificeringen (incl. `verified_at`)
- `certificering_types` — Lookup tabel (SC-530, SC-540, SC-560)
