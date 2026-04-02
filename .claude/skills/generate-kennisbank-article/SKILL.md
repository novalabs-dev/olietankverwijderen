---
name: generate-kennisbank-article
description: Generate a complete kennisbank (knowledge base) article as MDX for asbestvergelijken.nl. Use when the user asks to write a kennisbank article, create content for the knowledge base, or generate an article about asbestos topics.
disable-model-invocation: true
allowed-tools: WebSearch, WebFetch, Read, Grep, Glob, Write, Task
argument-hint: "<slug> [--title <titel>] [--keyword <target-keyword>]"
---

# Kennisbank Article Generator

Genereer een compleet, SEO-geoptimaliseerd kennisbank artikel als MDX-bestand voor asbestvergelijken.nl. Het artikel wordt opgeslagen in `src/content/kennisbank/` en automatisch beschikbaar op `/kennisbank/[slug]`.

## Doel

Een informatief, feitelijk correct artikel dat:
- Rankt in Google op het target keyword
- Waarde biedt aan lezers (huiseigenaren, bedrijven)
- Interne links bevat naar bedrijven, steden en offerte-pagina
- Niet leest als AI-gegenereerde tekst
- Actuele Nederlandse informatie bevat (prijzen, regelgeving 2026)

## Invoer

`$ARGUMENTS` bevat de slug van het artikel (bijv. `wat-kost-asbest-verwijderen`), en optioneel:
- `--title <titel>` — gewenste titel van het artikel
- `--keyword <keyword>` — target keyword voor SEO

## Stap 1: Context ophalen

Lees de content strategy voor informatie over het artikel:

```
Read docs/CONTENT-STRATEGY.md
```

Zoek in de tabel naar het artikel dat bij de opgegeven slug past. Noteer:
- Geplande titel
- Target keyword
- Zoekvolume
- Prioriteit

Als `--title` of `--keyword` is meegegeven, gebruik die in plaats van de tabelwaarden.

## Stap 2: Research

Gebruik een sub-agent (Task tool, subagent_type: "general-purpose") voor web research. Geef de sub-agent de volgende opdracht:

**Sub-agent instructie:**

> Research the following topic for a Dutch article about asbestos removal on asbestvergelijken.nl.
>
> **Topic:** {title}
> **Target keyword:** {target keyword}
>
> Search for CURRENT Dutch information (2026) about this topic. Focus on:
> 1. Current prices/costs in the Netherlands (if relevant to the topic)
> 2. Current Dutch regulations and laws (Asbestverwijderingsbesluit 2005, Arbobesluit)
> 3. Certification requirements (SC-530 for removal, SC-540 for inventory)
> 4. Practical tips and common questions from homeowners
> 5. Risk classes (1, 2, 2A, 3) if relevant
> 6. Any subsidies or financial support available in 2026
>
> Search in Dutch. Use queries like:
> - "{target keyword} 2026"
> - "kosten asbestverwijdering per m2"
> - "asbestverwijdering regelgeving nederland"
> - Related queries based on the topic
>
> Fetch at most 3 relevant Dutch source pages for detailed information.
>
> Return a structured summary with:
> - **Key facts and figures** (with sources)
> - **Current prices** (ranges, per m2 where applicable)
> - **Regulations** (what's required by law)
> - **Common questions** people ask about this topic (for FAQ section)
> - **Source URLs** for reference
>
> Keep the summary factual and concise (max 800 words).

## Stap 3: Artikel schrijven

Schrijf het MDX-bestand met de volgende structuur:

### Frontmatter

```yaml
---
title: "[Titel met target keyword]"
description: "[Meta description, max 155 tekens, bevat target keyword]"
keywords: ["keyword1", "keyword2", "keyword3", ...]
publishedAt: "[vandaag, YYYY-MM-DD format]"
readingTime: "[X min leestijd]"
targetKeyword: "[target keyword]"
searchVolume: [zoekvolume als getal]
---
```

### Content structuur

1. **Inleiding** (100-150 woorden)
   - Beantwoord direct de zoekvraag
   - Geef een preview van wat het artikel behandelt
   - Bevat het target keyword in de eerste alinea

2. **Hoofdsecties** (H2 koppen, 3-5 secties)
   - Elke H2 bevat een relevant (secundair) keyword
   - Gebruik H3 voor subsecties waar nodig
   - Concrete informatie: cijfers, feiten, voorbeelden
   - Tabellen voor prijsvergelijkingen of overzichten
   - Opsommingen voor lijsten van factoren/stappen

3. **FAQ sectie** (H2: "Veelgestelde vragen")
   - 4-6 vragen als H3
   - Korte, directe antwoorden
   - Baseer vragen op "People Also Ask" en research

4. **Conclusie/samenvatting** (50-100 woorden)
   - Kort samenvatten van de belangrijkste punten
   - Subtiele CTA naar offerte-pagina

### Interne links (minimaal 3)

Verwerk de volgende links natuurlijk in de tekst:
- `/offerte` — naar het offerte-formulier (bijv. "Vraag [gratis offertes aan](/offerte) bij gecertificeerde bedrijven.")
- `/bedrijven` — naar het bedrijvenoverzicht (bijv. "Bekijk [gecertificeerde asbestverwijderaars](/bedrijven) bij jou in de buurt.")
- `/kennisbank/[ander-artikel]` — naar een gerelateerd kennisbank artikel (als dat bestaat)

Gebruik Glob om te checken welke andere artikelen al bestaan:
```
Glob src/content/kennisbank/*.mdx
```

### Schrijfstijl

- **Natuurlijk Nederlands** — geen formele of academische toon
- **Direct en praktisch** — beantwoord vragen concreet
- **Geen AI-cliches** — vermijd "het is belangrijk om", "in de huidige tijd", "het spreekt voor zich"
- **Geen overdrijvingen** — geen superlatieven tenzij aantoonbaar
- **Actieve schrijfstijl** — "U betaalt gemiddeld..." niet "Er wordt gemiddeld betaald..."
- **Derde persoon of u-vorm** — consistent door heel het artikel
- **Geen emdashes (—)** — gebruik gewone streepjes (-) of herformuleer
- **Lengte:** 1500-2500 woorden

### Tabellen

Gebruik Markdown tabellen voor prijsoverzichten, vergelijkingen of factoren. Voorbeeld:

```markdown
| Type werk | Prijs per m² | Bijzonderheden |
|---|---|---|
| Dakplaten | €15-25 | Inclusief afvoer |
| Vloertegels | €25-40 | Hechtgebonden, complexer |
```

## Stap 4: Bestand opslaan

Sla het MDX-bestand op:

```
Write src/content/kennisbank/{slug}.mdx
```

## Stap 5: Rapportage

Geef de gebruiker een samenvatting:
- Titel en slug van het artikel
- Target keyword en zoekvolume
- Aantal woorden (schatting)
- Gebruikte bronnen
- Bestandslocatie
- Tip: bekijk het artikel op `/kennisbank/{slug}` na `npm run dev`

## Belangrijk

- **Geen verzonnen feiten** — gebruik alleen informatie uit de research of algemeen bekende feiten
- **Actuele informatie** — prijzen en regelgeving moeten van 2026 zijn, of duidelijk aangeven als het om oudere data gaat
- **Consistentie met de site** — verwijs naar certificeringen als SC-530 en SC-540, gebruik dezelfde terminologie als de rest van de site
- **Geen duplicate content** — controleer bestaande artikelen en zorg dat er geen overlap is
- **Eén artikel per keer** — deze skill verwerkt één artikel per aanroep
