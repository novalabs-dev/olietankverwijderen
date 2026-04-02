# asbestvergelijken.nl — Project Briefing

> **Dit document is de single source of truth voor de IDE + Claude.** Geef dit als context mee bij het starten van development.

## Wat is dit?

Een AI-driven directory website voor asbestverwijdering en asbestinventarisatie in Nederland. De site helpt consumenten de juiste gecertificeerde asbestverwijderaar te vinden en offertes aan te vragen.

## Eigenaar

- **Naam:** Wouter van Ackooij
- **Bedrijf:** AckNova
- **Domein:** asbestvergelijken.nl

## Doel

€10K/maand omzet via lead generation en premium listings. Eerste mijlpaal: €1.500-3.000/maand.

## Primair verdienmodel

1. **Lead generation** — Bezoekers vragen offertes aan → doorsturen naar gecertificeerde bedrijven → per-lead fee (€25-75)
2. **Claimed listings** — Bedrijven betalen €30-50/maand om hun profiel te beheren
3. **Premium listings** — Featured positie per regio (€50-100/maand)

## Markt

- ~500 gecertificeerde asbestverwijderingsbedrijven (SC-530) in NL
- ~200+ asbestinventarisatiebureaus (SC-540)
- Gemiddelde orderwaarde: €1.000-5.000+
- 13.000+ maandelijkse zoekopdrachten
- Wettelijk gereguleerd: verwijdering alleen door gecertificeerde bedrijven
- Databron: Ascert certificaatregister (openbaar, doorzoekbaar)

## Unieke waardepropositie

1. Certificeringsstatus (SC-530/SC-540) prominent per bedrijf, live uit Ascert register
2. Asbestwijzer tool — interactief: "Welk type onderzoek heb ik nodig?"
3. Transparante prijsvergelijking per type werk en regio
4. Echte reviews per bedrijf
5. Lokale content met diepgang — per stad: gemeentelijke regels, voorrijkosten, lokale subsidies
6. Regelgeving-uitleg — risicoklassen, verplichtingen, wanneer zelf doen
7. Subsidie-checker per gemeente/provincie

## Tech Stack

| Component | Keuze | Reden |
|---|---|---|
| Framework | **Next.js 15 (App Router)** | SSR + API routes + interactieve features (offerteformulieren, dashboards) |
| Styling | **Tailwind CSS** | Snel, consistent, goed voor AI-generatie |
| Hosting | **Netlify** | Auto-deploys vanuit GitHub, serverless functions |
| Database | **Supabase (Postgres)** | Listings, leads, reviews, auth |
| Repo | **GitHub** | Single source of truth |
| E-mail | **Resend** of Google Workspace | Transactionele mails (offerte-bevestigingen) |
| Betaling | **Mollie** | NL-first, iDEAL support |
| Analytics | **Plausible** of Netlify Analytics | Privacy-friendly, GDPR-compliant |
| CMS | Geen — content via MDX of Supabase | Pillar content als MDX, listings uit database |

## Gerelateerde documenten

- [[ARCHITECTURE]] — Technische architectuur en projectstructuur
- [[DATABASE]] — Supabase schema
- [[MVP-SCOPE]] — Features voor v1
- [[CONTENT-STRATEGY]] — Content planning
- [[SEO-STRATEGY]] — SEO aanpak
- [[Niche Research - Asbestverwijdering]] — Volledig niche onderzoek (in 05 - Marktonderzoek)

## Ontwikkelprincipes

1. **SEO-first** — Elke beslissing door de lens van: rankt dit in Google?
2. **Geleidelijk opbouwen** — Niet 500 pagina's dag 1, maar 50 kwalitatieve pagina's
3. **AI-driven maar menselijk gereviewed** — 80%+ AI, altijd review op kwaliteit
4. **Mobile-first** — Veel zoekverkeer is mobiel
5. **Performance** — Core Web Vitals moeten groen zijn, geen onnodige JS
6. **Data-integriteit** — Bedrijfsgegevens en certificeringen moeten kloppen
