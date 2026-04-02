# Content Strategie — asbestvergelijken.nl

## Content Principes

1. **Elke pagina beantwoordt een specifieke zoekvraag** — geen content zonder doel
2. **Unieke waarde per pagina** — geen duplicate content, elke listing/stad anders
3. **EAT (Expertise, Authority, Trust)** — feitelijk correct, bronvermelding, certificeringsinfo
4. **Conversie-gericht** — elke pagina heeft een CTA naar offerte-aanvraag
5. **Geleidelijk opbouwen** — kwaliteit boven kwantiteit, Google vertrouwt nieuwe domeinen niet direct

---

## Content Types

### 1. Bedrijfsprofiel pagina's (~500 pagina's uiteindelijk)

**URL:** `/bedrijven/[bedrijf-slug]`
**Zoekintent:** "[bedrijfsnaam] asbest" of via interne navigatie
**Doel:** Informeren + lead genereren

Per profiel uniek maken door:
- Certificeringen en nummers (uit Ascert)
- Specialisaties en werkgebied
- Oprichtingsjaar en bedrijfsomvang
- AI-gegenereerde beschrijving op basis van specialisaties, locatie, werkgebied
- Reviews (wanneer beschikbaar)
- Prijsindicatie (wanneer bekend)

**Template structuur:**
```
H1: [Bedrijfsnaam] — Gecertificeerd Asbestverwijderingsbedrijf in [Stad]
- Certificeringen blok (badges)
- Beschrijving (uniek, 150-300 woorden)
- Specialisaties
- Werkgebied
- Contactgegevens
- Reviews
- CTA: Offerte aanvragen
- FAQ (2-3 vragen specifiek voor dit type bedrijf)
- Gerelateerde bedrijven in dezelfde regio
```

### 2. Lokale landing pages (~40 steden)

**URL:** `/[provincie]/[stad]` bijv. `/noord-holland/amsterdam`
**Zoekintent:** "asbestverwijdering [stad]" (140 vol/mnd per grote stad)
**Doel:** Ranken op lokale zoektermen + lead genereren

**Uniek maken per stad door:**
- Gemeentelijke regelgeving (meldingsplicht, vergunningen)
- Lokale subsidies/regelingen
- Voorrijkosten indicatie voor die regio
- Afvalpunten voor (kleine hoeveelheden) asbest
- Aantal gecertificeerde bedrijven in de regio
- Prijsindicatie specifiek voor de regio

**Template structuur:**
```
H1: Asbestverwijdering in [Stad] — Vergelijk Gecertificeerde Bedrijven
- Intro (uniek per stad, 200-300 woorden)
- Overzicht bedrijven in [Stad] (cards met rating, certificering)
- Kosten asbestverwijdering in [Stad] (prijstabel)
- Regelgeving gemeente [Stad]
- Subsidies in [Stad/Provincie]
- Veelgestelde vragen over asbestverwijdering in [Stad]
- CTA: Offerte aanvragen
```

**Prioriteit steden (batch 1 — 20 steden):**
Amsterdam, Rotterdam, Den Haag, Utrecht, Eindhoven, Groningen, Tilburg, Almere, Breda, Nijmegen, Arnhem, Haarlem, Amersfoort, Apeldoorn, Zoetermeer, 's-Hertogenbosch, Zwolle, Leiden, Maastricht, Enschede

**Batch 2 (20 steden):**
Overige provinciehoofdsteden + steden met zoekvolume uit keyword data (Friesland cluster, etc.)

### 3. Kennisbank / Pillar Content (~15 artikelen)

**URL:** `/kennisbank/[slug]`
**Zoekintent:** Informatieve zoekvragen (hoge volume, lage PD)
**Doel:** Traffic + autoriteit + internal links naar bedrijven/steden

**Artikelen geprioriteerd op zoekvolume en PD:**

| # | Titel | Target keyword | Volume | PD | Prioriteit |
|---|---|---|---|---|---|
| 1 | Wat kost asbest verwijderen? Compleet prijsoverzicht 2026 | asbest verwijderen kosten | 2.400 | 71 | MVP |
| 2 | Asbestinventarisatie: alles wat je moet weten | asbestinventarisatie | 1.600 | 69 | MVP |
| 3 | Zelf asbest verwijderen: wanneer mag het en hoe? | asbest verwijderen zelf | 1.000 | 8 | MVP |
| 4 | Asbest herkennen: complete gids met foto's | asbest herkennen | ~500 | laag | MVP |
| 5 | Risicoklassen asbest: wat betekenen ze? | asbest verwijderen verplicht | 210 | 8 | MVP |
| 6 | Asbestdak verwijderen: kosten, regels en subsidies | asbest verwijderen dak kosten | 320 | 73 | v1.1 |
| 7 | Subsidie asbestverwijdering 2026: actueel overzicht | subsidie asbest verwijderen | 90 | 35 | v1.1 |
| 8 | Asbestinventarisatierapport: wat staat erin? | asbestinventarisatierapport | 590 | 78 | v1.1 |
| 9 | Asbest in vloerzeil herkennen en verwijderen | asbest vloerzeil | ~200 | laag | v1.1 |
| 10 | Asbest in dakbeschot: kosten en aanpak | asbest verwijderen dakbeschot | 170 | 71 | v1.2 |
| 11 | Asbestverwijdering bij huurwoning: wie betaalt? | — | — | — | v1.2 |
| 12 | Asbest verwijderen: is het aftrekbaar? | asbest verwijderen kosten aftrekbaar | 210 | 10 | v1.2 |
| 13 | Vergunning asbestverwijdering: wanneer nodig? | asbest verwijderen vergunning | 50 | 13 | v1.2 |
| 14 | Asbest verwijderen als particulier: complete gids | asbest verwijderen particulier | 390 | 62 | v1.2 |
| 15 | Gezondheidsrisico's van asbest | — | — | — | v1.2 |

### 4. FAQ Content

Geïntegreerd in pagina's via FAQ-secties + Schema.org FAQPage markup.

**Bronnen voor vragen:**
- People Also Ask uit keyword research
- "Mag ik zelf asbest verwijderen?"
- "Wat kost asbest verwijderen per m2?"
- "Is asbest verwijderen verplicht?"
- "Hoe lang duurt asbestverwijdering?"
- "Wanneer is een asbestinventarisatie verplicht?"
- "Wat zijn de gezondheidsrisico's van asbest?"

---

## Internal Linking Strategie

```
Homepage
├── /bedrijven (overzicht)
│   └── /bedrijven/[slug] (profiel)
├── /[provincie]/[stad] (lokale pagina's)
│   ├── → linkt naar bedrijven in die stad
│   ├── → linkt naar relevante kennisbank artikelen
│   └── → linkt naar offerte-formulier
├── /kennisbank (overzicht)
│   └── /kennisbank/[slug] (artikelen)
│       ├── → linkt naar bedrijven met die specialisatie
│       ├── → linkt naar relevante steden
│       └── → linkt naar offerte-formulier
└── /offerte (lead capture)
```

**Regels:**
- Elke pagina linkt naar minimaal 3 andere interne pagina's
- Kennisbank artikelen linken naar relevante bedrijven en steden
- Stad-pagina's linken naar kennisbank artikelen en bedrijfsprofielen
- Bedrijfsprofielen linken naar stad-pagina en relevante kennisbank content
- Offerte-formulier is bereikbaar vanaf elke pagina (CTA)

---

## Content Productie Workflow

### AI-gegenereerde content (80%)
1. Claude genereert draft op basis van template + data
2. Uniekheid check: geen twee pagina's die hetzelfde klinken
3. Feitelijke check: certificeringen, prijzen, regelgeving kloppen
4. SEO check: keyword in H1, meta title, meta description, alt tags

### Menselijke review (20%)
1. Wouter reviewt alle content voor publicatie
2. Focus op: tone of voice, feitelijke juistheid, uniekheid
3. Toevoegen van eigen inzichten, lokale kennis waar mogelijk
4. Goedkeuring → publicatie

---

## Content Kalender (eerste 8 weken)

| Week | Content | Aantal pagina's |
|---|---|---|
| 1-2 | Basis site + 10 bedrijfsprofielen (handmatig gecureerd) | 12 |
| 3 | 40 bedrijfsprofielen + 2 kennisbank artikelen | 42 |
| 4 | 20 stad-pagina's + 3 kennisbank artikelen | 23 |
| 5 | 50 bedrijfsprofielen + homepage optimalisatie | 51 |
| 6 | 10 stad-pagina's + 2 kennisbank artikelen | 12 |
| 7 | 50 bedrijfsprofielen + FAQ content | 50 |
| 8 | Optimalisatie bestaande content + 2 kennisbank artikelen | 2 |
| **Totaal** | | **~192 pagina's** |

*Geleidelijke groei: niet alles op dag 1 publiceren. Spreek het over 8 weken.*
