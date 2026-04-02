---
name: enrich-kvk
description: Enrich company data (address, GPS, website, employees) from the KVK Handelsregister API. Use when the user asks to enrich companies, update KvK data, refresh company details, or sync with the Handelsregister.
disable-model-invocation: true
allowed-tools: Bash(npx tsx scripts/enrich-kvk.ts *), Read, Grep, Glob
argument-hint: "[--dry-run|--force|--limit N|--id UUID|--test]"
---

# KVK Handelsregister Enrichment

Verrijk bedrijven in Supabase met data uit de KVK Handelsregister API (developers.kvk.nl).

## Wat wordt verrijkt

| Veld | Bron |
|------|------|
| `kvk_nummer` | KVK Basisprofiel |
| `straat`, `huisnummer`, `postcode`, `stad` | Bezoekadres hoofdvestiging |
| `latitude`, `longitude` | GPS geoData uit bezoekadres |
| `website` | Websites array hoofdvestiging |
| `aantal_medewerkers` | Werkzame personen → bucket (1-5, 5-10, etc.) |
| `data_verified_at` | Timestamp van laatste verificatie |

**Niet beschikbaar via KVK:** telefoon, e-mail.

## Script

Het script staat in `scripts/enrich-kvk.ts`.

Lees dit bestand voor context als je het gedrag wilt begrijpen:
- [enrich-kvk.ts](scripts/enrich-kvk.ts)

## Uitvoering

### Stap 1: Bepaal de actie op basis van $ARGUMENTS

| Argument | Actie |
|----------|-------|
| Geen argument | Verrijk alle bedrijven die niet recent geverifieerd zijn |
| `--dry-run` | Preview zonder te schrijven naar Supabase |
| `--limit N` | Verrijk alleen de eerste N bedrijven |
| `--id <uuid>` | Verrijk een specifiek bedrijf |
| `--force` | Herverrijk alles, ook recent geverifieerde bedrijven |
| `--test` | Gebruik de KVK test-omgeving (fictieve data, gratis) |

Combinaties zijn mogelijk, bijv.:
- `--dry-run --limit 5` → preview van de eerste 5 bedrijven
- `--force --limit 10` → herverrijk de eerste 10, ook als recent gecheckt
- `--test --dry-run` → test de flow met de KVK test-omgeving

### Stap 2: Voer het script uit

```bash
npx tsx scripts/enrich-kvk.ts $ARGUMENTS
```

**Aanbevolen volgorde bij periodieke sync:**

1. Eerst dry-run om te zien wat er verandert:
   ```bash
   npx tsx scripts/enrich-kvk.ts --dry-run
   ```

2. Toon de resultaten aan de gebruiker en vraag om goedkeuring

3. Na goedkeuring, voer de echte enrichment uit:
   ```bash
   npx tsx scripts/enrich-kvk.ts
   ```

### Stap 3: Rapportage

Na afloop, geef de gebruiker een samenvatting:
- Aantal verrijkte bedrijven (updated)
- Aantal zonder wijzigingen (no change)
- Aantal niet gevonden in KVK (not found)
- Aantal fouten (errors)
- Totale API kosten (aantal basisprofiel calls × €0,02)
- Welke velden er per bedrijf gewijzigd zijn

## Hoe het script werkt

### Lookup-strategie
1. **KvK-nummer bekend** → direct basisprofiel ophalen
2. **KvK-nummer ongeldig (404/400)** → terugvallen op naam-zoeken
3. **Naam-zoeken** → Zoeken API (gratis), best match selecteren op naamsovereenkomst
4. **Basisprofiel ophalen** → €0,02 per call, inclusief geoData

### Wat het script doet
- Vergelijkt KVK-data veld-voor-veld met Supabase
- Update alleen gewijzigde velden
- Zet `data_verified_at` op het huidige tijdstip
- Skipt bedrijven die < 30 dagen geleden geverifieerd zijn (tenzij `--force`)

### Wat het script NIET doet
- Telefoon of e-mail ophalen (niet beschikbaar via KVK API)
- Bedrijven verwijderen
- `is_published` of andere status-velden wijzigen
- `slug` overschrijven

## Environment variabelen

Vereist in `.env.local` (root van het project):
```
KVK_API_KEY=your-api-key-from-developers-kvk-nl
```

Niet nodig als je `--test` gebruikt (test-omgeving heeft een ingebouwde test-key).

API key aanvragen via: https://developers.kvk.nl

## Kosten

| API | Kosten per call |
|-----|-----------------|
| Zoeken | Gratis (€0) |
| Basisprofiel | €0,02 |

Plus €6,40/maand abonnement op developers.kvk.nl.

## Waarschuwingen

- **Altijd eerst --dry-run** bij periodieke sync
- **Rate limiting**: het script wacht 300ms tussen API calls
- **Fictieve bedrijven**: bedrijven met verzonnen namen worden niet gevonden in KVK
- **GPS 0,0 wordt genegeerd**: als KVK geen geoData heeft, worden coordinaten niet overschreven
- **Afgeschermde adressen**: worden overgeslagen (indAfgeschermd = "Ja")

## Database schema referentie

De data wordt gemapped naar de `bedrijven` tabel beschreven in `docs/DATABASE.md`.
Het veld `data_verified_at` wordt bij elke run bijgewerkt, ook als er niets veranderd is.
