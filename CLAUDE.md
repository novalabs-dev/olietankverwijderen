# CLAUDE.md — Instructies voor Claude in IDE

> Dit bestand geeft Claude context over het project bij ontwikkeling in een IDE.

## Project

Je bouwt **olietankverwijderen.nl** — een directory website voor olietankverwijdering in Nederland. Het doel is lead generation: consumenten helpen het juiste olietankverwijderingsbedrijf te vinden.

## Tech Stack

- **Next.js 15** (App Router, TypeScript)
- **Tailwind CSS** (styling)
- **Supabase** (PostgreSQL database, auth, storage)
- **Netlify** (hosting, auto-deploys)
- **Resend** (transactionele e-mails)
- **Zod** (validatie)
- **MDX** (kennisbank content)
- **Playwright** (web scraping via Python)

## Python Venv (Scraping)

De `.venv/` directory bevat een Python virtual environment voor scraping scripts.

**Activeren:** `.venv/bin/python` of `source .venv/bin/activate`

**Geïnstalleerde packages:** playwright (1.58.0) + browsers (Chromium, Firefox, WebKit)

**Scraping scripts:** zie `scripts/` directory (bijv. `scrape-websites.py`, `enrich-from-websites.py`)

**Belangrijk:** Draai Python scraping scripts altijd via de venv:
```bash
.venv/bin/python scripts/scrape-websites.py
```

## Projectdocumenten

Lees deze bestanden voor volledige context:
- `PROJECT.md` — Projectoverzicht, verdienmodel, markt
- `ARCHITECTURE.md` — Technische architectuur, folder structuur, rendering strategie
- `DATABASE.md` — Supabase schema (alle tabellen + SQL)
- `MVP-SCOPE.md` — Features voor v1, launch checklist
- `CONTENT-STRATEGY.md` — Content types, templates, planning
- `SEO-STRATEGY.md` — SEO aanpak, keywords, technische SEO

## Codeerstijl

- **TypeScript** strict mode, geen `any`
- **Server Components** als default, `'use client'` alleen als interactiviteit nodig
- **Zod** voor alle form validatie en API input
- **Nederlandse content**, Engelse code (variabelen, functies, comments)
- **Tailwind** voor styling, geen CSS modules of styled-components
- Geen onnodige dependencies — gebruik wat Next.js biedt
- Korte, beschrijvende bestandsnamen in kebab-case

## Database

- Gebruik `@supabase/ssr` voor server-side Supabase calls
- Gebruik `@supabase/supabase-js` voor client-side
- Schema staat in `DATABASE.md` — volg het exact
- Altijd Row Level Security overwegen

## SEO Vereisten

Elke pagina MOET hebben:
- Unieke `<title>` en `<meta name="description">`
- Schema.org JSON-LD structured data
- Breadcrumbs
- H1 met target keyword
- Internal links (minimaal 3)
- Canonical URL
- Open Graph tags

## Belangrijk

- **Geen fake data in productie** — bedrijfsgegevens en certificeringen moeten kloppen
- **Geleidelijk publiceren** — niet 500 pagina's op dag 1
- **Mobile-first** — test altijd op mobiel
- **Performance** — Core Web Vitals moeten groen zijn
- **Privacy** — GDPR-compliant, geen onnodige cookies
