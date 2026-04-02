# Ascert Data Acquisitie — Prompt voor IDE

> Kopieer onderstaande prompt en plak deze in je IDE (Antigravity/Claude Code) om de Ascert data acquisitie skill te bouwen.

---

## Prompt

```
Ik wil een skill bouwen die data ophaalt uit het Ascert certificaatregister (https://www.ascert.nl/zoek-een-certificaat). Dit register bevat alle gecertificeerde asbestverwijderingsbedrijven (SC-530) en asbestinventarisatiebureaus (SC-540) in Nederland.

## Context

Dit is voor mijn directory website asbestvergelijken.nl — een lead generation platform voor asbestverwijdering. Ik heb een Supabase database met een schema dat klaarstaat om deze data te ontvangen. De relevante tabellen zijn: bedrijven, bedrijf_certificeringen, en certificering_types.

## Stap 1: Terms of Service checken

Ga EERST naar https://www.ascert.nl en zoek hun disclaimer, privacy verklaring, en/of terms of service (er staat een link "Disclaimer en privacy verklaring" in de footer). Lees deze door en geef me een samenvatting van:
- Mogen we de data uit het register gebruiken voor ons platform?
- Zijn er beperkingen op geautomatiseerd ophalen van data?
- Zijn er beperkingen op het hergebruik/tonen van de data?
- Welke voorzorgsmaatregelen moeten we nemen?

## Stap 2: Skill bouwen voor data-acquisitie

Als er geen expliciete blokkade is, bouw dan een skill (Python script) die het volgende doet:

### Wat het Ascert register biedt per bedrijf (detailpagina):
- Bedrijfsnaam
- Status (geldig/geschorst/ingetrokken)
- Certificaatnummer (bijv. "15-C202058.01")
- Uitgegeven door (certificerende instelling)
- KvK-nummer
- Contactpersoon
- Adres, postcode, plaats
- E-mailadres
- Telefoonnummer
- Datum eerste uitgifte, datum certificaat, verloopdatum
- Certificaatsoort (Asbestverwijdering of Asbestinventarisatie)

### Hoe de zoekinterface werkt:
- URL: https://www.ascert.nl/zoek-een-certificaat
- Zoeken via query parameters: ?type=processcertificate&city=Amsterdam&postalcode=&company=&certificatenumber=
- Je moet minimaal één veld invullen (stad, postcode, bedrijfsnaam, of certificaatnummer)
- Resultaten zijn server-side gerenderde HTML (geen API)
- Detailpagina URL: ?page=detail&type=processcertificate&certificatenumber=[nummer]
- Er is geen paginering zichtbaar — alle resultaten per stad worden op één pagina getoond

### Vereisten voor het script:
1. **Respectvol scrapen**: minimaal 2 seconden pauze tussen requests, User-Agent header instellen
2. **Itereer per stad**: gebruik een lijst van alle Nederlandse steden/plaatsen, of itereer per postcode-prefix (1000-9999)
3. **Deduplicatie**: bedrijven kunnen in meerdere steden voorkomen, dedupliceer op certificaatnummer
4. **Beide certificaattypen**: haal zowel Asbestverwijdering als Asbestinventarisatie op
5. **Foutafhandeling**: retries bij timeouts, logging van mislukte requests
6. **Output**: sla resultaten op als JSON en/of CSV bestand
7. **Optioneel**: direct importeren in Supabase als de environment variables beschikbaar zijn

### Structuur van de skill:
`
scripts/ascert-scraper/
├── README.md            # Uitleg, gebruik, configuratie
├── scrape_ascert.py     # Hoofdscript
├── requirements.txt     # Dependencies (requests, beautifulsoup4, supabase)
├── import_to_supabase.py  # Apart script om JSON naar Supabase te importeren
├── data/                # Output directory
│   ├── ascert_raw.json  # Ruwe scrape data
│   └── ascert_clean.csv # Opgeschoonde data
└── cities.py            # Lijst van Nederlandse steden om te itereren
`

### Data mapping naar mijn Supabase schema:

Ascert veld → Supabase kolom (bedrijven tabel):
- Bedrijfsnaam → naam
- Adres → straat + huisnummer (splits op)
- Postcode → postcode
- Plaats → stad
- KvK-nummer → kvk_nummer
- E-mailadres → email
- Telefoonnummer → telefoon
- Contactpersoon → (bewaar als metadata)
- Status → is_gecertificeerd (true als "geldig")
- Certificaatnummer → ascert_id + gaat naar bedrijf_certificeringen tabel
- Certificaatsoort → koppeling naar certificering_types (SC-530 of SC-540)
- Verloopdatum → geldig_tot in bedrijf_certificeringen

Extra afgeleide velden:
- slug: genereer uit bedrijfsnaam (lowercase, kebab-case)
- provincie: afleiden uit postcode of stad
- bron: 'ascert'
- is_published: false (handmatige review eerst)

## Belangrijk
- Maak het script idempotent: als je het opnieuw draait, updatet het bestaande records in plaats van duplicaten te maken
- Log duidelijk hoeveel bedrijven gevonden/geïmporteerd/geskipt
- Bewaar de ruwe data altijd als backup (JSON)
- Filter op status "geldig" — geschorste/ingetrokken bedrijven niet importeren
```

---

## Na het draaien

Als het script klaar is en de data opgehaald:
1. Review de data in het JSON/CSV bestand
2. Check steekproefsgewijs of de data klopt (vergelijk met Ascert website)
3. Draai het import script om de data in Supabase te laden
4. Update PROGRESSIE.md: vink "Ascert register" taken af
