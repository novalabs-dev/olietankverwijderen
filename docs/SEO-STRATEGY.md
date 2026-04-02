# SEO Strategie — asbestvergelijken.nl

## Kerncijfers

- **Totaal zoekvolume niche:** 13.000+/maand
- **Primair keyword:** "asbest verwijderen" (3.600/mnd)
- **Secundair keyword:** "asbestinventarisatie" (1.600/mnd)
- **Gemiddelde CPC:** €3-10+ (hoge commerciële waarde)
- **Domein autoriteit bij start:** 0 (nieuw domein)

## Strategie in 3 fases

### Fase 1: Quick Wins (maand 1-2)
**Focus:** Long-tail keywords met lage concurrentie

Target keywords met lage PD waar we snel kunnen ranken:

| Keyword | Volume | PD | Strategie |
|---|---|---|---|
| asbest verwijderen zelf | 1.000 | 8 | Kennisbank artikel |
| asbest verwijderen verplicht | 210 | 8 | Kennisbank artikel |
| asbest verwijderen kosten aftrekbaar | 210 | 10 | Kennisbank artikel |
| asbest verwijderen vergunning | 50 | 13 | Kennisbank artikel |
| asbestinventarisatierapport verplicht | 70 | 49 | FAQ sectie |
| subsidie asbest verwijderen 2026 | 90 | 35 | Kennisbank artikel |

**Verwachting:** Top 20 posities binnen 4-8 weken voor deze keywords.

### Fase 2: Lokale SEO (maand 2-4)
**Focus:** Stad-specifieke keywords

"Asbestverwijdering [stad]" keywords hebben elk 50-140 vol/mnd maar weinig niche-concurrentie:

| Stad | Volume | CPC | Prioriteit |
|---|---|---|---|
| Amsterdam | 140 | €10,59 | Hoog |
| Utrecht | 140 | €8,50 | Hoog |
| Den Haag | 140 | — | Hoog |
| Groningen | 140 | €4,95 | Hoog |
| Amersfoort | 110 | €5,36 | Hoog |
| Zoetermeer | 70 | — | Medium |
| Apeldoorn | 50 | €5,28 | Medium |

**Aanpak per stad-pagina:**
- Unieke intro (niet dezelfde tekst met andere stadsnaam)
- Lokale bedrijven uit database
- Gemeentelijke regelgeving (handmatig of AI-geresearched)
- Prijsindicatie voor de regio
- FAQ specifiek voor die stad
- Schema.org LocalBusiness + BreadcrumbList

### Fase 3: Autoriteit & Hoog Volume (maand 4-6+)
**Focus:** Competitieve hoofd-keywords

Pas als het domein autoriteit heeft opgebouwd:

| Keyword | Volume | PD | Benodigde DA |
|---|---|---|---|
| asbest verwijderen | 3.600 | 70 | 20+ |
| asbest verwijderen kosten | 2.400 | 71 | 20+ |
| asbestinventarisatie | 1.600 | 69 | 20+ |
| asbestinventarisatierapport | 590 | 78 | 25+ |

**Strategie:** De kennisbank artikelen en stad-pagina's bouwen interne autoriteit op. Naarmate deze ranken en backlinks genereren, stijgt het hele domein.

---

## On-Page SEO Checklist

### Elke pagina moet hebben:

- [ ] **Meta title** — Max 60 tekens, keyword vooraan. Format: "[Keyword] — Asbestvergelijken.nl"
- [ ] **Meta description** — Max 155 tekens, keyword + CTA. Uniek per pagina.
- [ ] **H1** — Eén per pagina, bevat primair keyword
- [ ] **H2/H3** — Logische hiërarchie met secundaire keywords
- [ ] **Internal links** — Minimaal 3 naar relevante pagina's
- [ ] **Breadcrumbs** — Home > Categorie > Pagina
- [ ] **Schema.org** — Relevant type per pagina-type (zie onder)
- [ ] **Canonical URL** — Voorkom duplicate content
- [ ] **Open Graph** — Voor social sharing
- [ ] **Alt tags** — Op alle afbeeldingen met beschrijvende tekst
- [ ] **URL structuur** — Kort, beschrijvend, Nederlands, geen underscores

### Schema.org per pagina-type

| Pagina | Schema type |
|---|---|
| Bedrijfsprofiel | LocalBusiness + AggregateRating + Review |
| Stad-pagina | ItemList (lijst bedrijven) + BreadcrumbList |
| Kennisbank | Article + FAQPage |
| Homepage | WebSite + SearchAction |
| Offerte-pagina | WebPage |

---

## Technische SEO

### Sitemap
- Dynamisch gegenereerd via Next.js (`app/sitemap.ts`)
- Gescheiden per type: bedrijven, steden, kennisbank
- Automatisch bijgewerkt bij nieuwe content
- Submitted bij Google Search Console

### Robots.txt
```
User-agent: *
Allow: /
Disallow: /api/
Disallow: /dashboard/
Sitemap: https://asbestvergelijken.nl/sitemap.xml
```

### URL Structuur
```
/                                        → Homepage
/bedrijven                               → Overzicht bedrijven
/bedrijven/[bedrijf-slug]                → Bedrijfsprofiel
/[provincie-slug]/[stad-slug]            → Lokale landing page
/kennisbank                              → Overzicht artikelen
/kennisbank/[artikel-slug]               → Kennisbank artikel
/offerte                                 → Offerte-aanvraag
/over-ons                                → Over ons
/privacyverklaring                       → Privacy
```

### Redirects
- www → non-www (of andersom, consistent)
- HTTP → HTTPS
- Trailing slash consistent

### Performance
- Server components waar mogelijk (minder client JS)
- Image optimization via Next.js Image component
- Lazy loading voor afbeeldingen below the fold
- Font optimization (next/font)
- Minimal third-party scripts

---

## Link Building Strategie

### Passief (content-driven)
- Kennisbank artikelen als bron voor andere sites
- Prijsoverzichten die journalisten/bloggers citeren
- Lokale content die gemeentesites kunnen linken

### Actief (outreach)
- Brancheverenigingen vragen om listing
- Lokale bedrijvengidsen
- Relevante blogs over verbouwing/verduurzaming
- Persberichten bij launch ("Nieuw platform vergelijkt asbestverwijderaars")

### Niet doen
- Gekochte links
- PBN's (Private Blog Networks)
- Spammy directory submissions
- Comment spam

---

## Google Search Console Monitoring

### Wekelijks checken:
- Impressies en clicks trend
- Top queries en posities
- Pagina's die geïndexeerd zijn
- Crawl errors
- Core Web Vitals

### Maandelijks optimaliseren:
- Pagina's met hoge impressies maar lage CTR → meta title/description verbeteren
- Keywords op positie 5-15 → content uitbreiden en optimaliseren
- Pagina's zonder impressies → checken of ze geïndexeerd zijn
- Zoektermen die we missen → nieuwe content schrijven

---

## KPI's

| KPI | Maand 1 | Maand 3 | Maand 6 |
|---|---|---|---|
| Pagina's geïndexeerd | 30 | 75 | 200 |
| Organische impressies/mnd | 500 | 5.000 | 20.000 |
| Organische clicks/mnd | 25 | 500 | 2.000 |
| Gemiddelde positie (top queries) | 30+ | 15 | 8 |
| Keywords in top 10 | 2 | 10 | 30 |
| Domain Authority (Moz) | 0 | 5 | 10-15 |
| Backlinks | 0 | 5 | 20 |
