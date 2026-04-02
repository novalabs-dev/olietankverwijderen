# Ascert Register Scraper

Scrapes the [Ascert certificate register](https://www.ascert.nl/zoek-een-certificaat) for certified asbestos removal (SC-530) and asbestos inventory (SC-540) companies in the Netherlands.

**Bron: Ascert** — Data wordt gebruikt met bronvermelding conform de Ascert disclaimer.

## Setup

```bash
cd scripts/ascert-scraper
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

## Usage

### 1. Scrape the register

```bash
# Full scrape (all Dutch cities, takes several hours)
python scrape_ascert.py

# Test with a single city first
python scrape_ascert.py --city Amsterdam

# Resume after interruption
python scrape_ascert.py --resume

# Only fetch detail pages for already-discovered certificates
python scrape_ascert.py --detail-only
```

Output:
- `data/ascert_raw.json` — Raw scraped data (backup)
- `data/ascert_clean.csv` — Cleaned data, only valid certificates
- `data/checkpoint.json` — Progress checkpoint for resume support
- `data/scraper.log` — Log file

### 2. Import into Supabase

```bash
# Preview what would be imported
python import_to_supabase.py --dry-run

# Import for real (requires env vars)
python import_to_supabase.py
```

Environment variables (create a `.env` file):
```
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_KEY=your-service-role-key
```

## How it works

1. **Phase 1 — Discovery**: Searches the Ascert register by city name for all ~350 Dutch municipalities. Each search returns a list of certificate numbers.
2. **Phase 2 — Detail fetching**: For each unique certificate number, fetches the detail page to get full company information (name, address, KvK, contact, dates).
3. **Deduplication**: Companies appear in multiple cities. Deduplication happens on certificate number — each certificate is fetched exactly once.
4. **Cleaning**: Raw data is cleaned and mapped to the Supabase schema (address splitting, slug generation, province derivation, date parsing).
5. **Import**: Cleaned records are upserted into `bedrijven` and `bedrijf_certificeringen` tables. Existing records are updated, new records are created.

## Respectful scraping

- 2.5 second delay between requests
- Custom User-Agent identifying the bot
- Retries with exponential backoff
- Checkpoint system to avoid re-fetching on resume
- No parallel requests

## Data mapping

| Ascert field | Supabase column | Table |
|---|---|---|
| Naam bedrijf | naam | bedrijven |
| Adres | straat + huisnummer | bedrijven |
| Postcode | postcode | bedrijven |
| Plaats | stad | bedrijven |
| KvK-inschrijving | kvk_nummer | bedrijven |
| E-mailadres | email | bedrijven |
| Telefoon | telefoon | bedrijven |
| Status | is_gecertificeerd | bedrijven |
| Certificaatnummer | ascert_id | bedrijven |
| Certificaatnummer | certificaat_nummer | bedrijf_certificeringen |
| Certificaatsoort | → certificering_type_id | bedrijf_certificeringen |
| Verloopdatum | geldig_tot | bedrijf_certificeringen |

Derived fields:
- `slug`: generated from company name (kebab-case)
- `provincie`: derived from postcode
- `bron`: always "ascert"
- `is_published`: always false (manual review first)
