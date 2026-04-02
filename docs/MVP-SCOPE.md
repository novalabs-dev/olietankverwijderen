# MVP Scope — asbestvergelijken.nl

## Doel MVP

Een werkende site met voldoende content om organisch traffic te genereren en de eerste leads binnen te halen. Geen perfectie, wel functioneel en SEO-geoptimaliseerd.

**Tijdlijn:** 4 weken tot live
**Kernvraag:** Kan ik traffic en leads genereren in deze niche?

---

## v1 Features (Must Have)

### 1. Bedrijvenoverzicht
- Lijst van asbestverwijderingsbedrijven, filterbaar op provincie/stad
- Per bedrijf: naam, locatie, certificering(en), korte beschrijving, rating
- Sortering op: afstand (postcode), rating, naam
- Pagination

### 2. Bedrijfsprofiel pagina's
- Individuele pagina per bedrijf met:
  - Bedrijfsnaam, adres, contact
  - Certificeringen met badge (SC-530/SC-540)
  - Specialisaties
  - Werkgebied
  - Beschrijving
  - Reviews (indien beschikbaar)
  - CTA: "Vraag een offerte aan"
- Schema.org LocalBusiness structured data

### 3. Lokale landing pages (top 20 steden)
- "Asbestverwijdering [stad]" pagina's voor de 20 grootste steden
- Per pagina: intro, lokale bedrijven, prijsindicatie, gemeentelijke info
- Steden eerste batch:
  Amsterdam, Rotterdam, Den Haag, Utrecht, Eindhoven, Groningen, Tilburg, Almere, Breda, Nijmegen, Arnhem, Haarlem, Amersfoort, Apeldoorn, Zoetermeer, 's-Hertogenbosch, Zwolle, Leiden, Maastricht, Enschede

### 4. Offerte-aanvraagformulier
- Simpel formulier: naam, email, telefoon, postcode, type dienst, oppervlakte, toelichting
- Validatie (Zod)
- Opslag in Supabase leads tabel
- Bevestigingsmail naar aanvrager (Resend)
- Notificatie naar admin (Wouter)
- **Nog GEEN automatische doorstuur naar bedrijven** — eerst handmatig matchen

### 5. Kennisbank (5 pillar articles)
- "Wat kost asbest verwijderen?" — uitgebreide prijsgids
- "Asbestinventarisatie: alles wat je moet weten"
- "Asbest herkennen: complete gids"
- "Zelf asbest verwijderen: wanneer mag het?"
- "Risicoklassen asbest uitgelegd"
- MDX format, internal links naar bedrijven en lokale pagina's

### 6. Homepage
- Zoekfunctie (postcode of stad)
- Korte uitleg wat de site doet
- Featured bedrijven (premium listings later)
- Recente reviews
- Link naar kennisbank
- Link naar offerte-formulier

### 7. SEO Fundament
- Dynamische sitemap.xml
- robots.txt
- Schema.org structured data (LocalBusiness, FAQPage, BreadcrumbList)
- Meta titles en descriptions per pagina
- Canonical URLs
- Open Graph tags
- Breadcrumbs
- Internal linking strategie

### 8. Basis UI/UX
- Responsive design (mobile-first)
- Header met navigatie
- Footer met links
- Breadcrumbs
- 404 pagina
- Loading states

---

## v1 NIET (Nice to Have — later)

| Feature | Waarom later |
|---|---|
| Bedrijfsdashboard | Eerst handmatig claimen, dashboard als er 10+ claimed listings zijn |
| Betalingsintegratie (Mollie) | Eerst gratis leads aanbieden om bedrijven te overtuigen, dan pas factureren |
| Asbestwijzer tool | Mooi maar niet essentieel voor SEO/traffic |
| Reviews verzamelen | Eerst handmatig een paar reviews toevoegen, formulier later |
| Automatische lead-matching | Eerst handmatig matchen, patronen leren, dan automatiseren |
| n8n workflows | Eerst alles handmatig, dan automatiseren wat bewezen werkt |
| Premium listings | Eerst gratis waarde bewijzen, dan upsellen |
| Subsidie-checker | Content is voldoende, interactieve tool later |
| Blog/nieuws | Pillar content is genoeg voor v1 |
| Provinciepagina's | Steden eerst, provincies als tussenniveau later |

---

## Data voor Launch

### Bedrijven: minimaal 50, doel 100
- Bron: Ascert register
- Verrijkt met: KvK data, Google Maps (locatie, reviews), website
- AI-gegenereerde beschrijvingen (uniek per bedrijf!)
- Certificeringen geverifieerd tegen Ascert

### Content: 25 pagina's
- 20 stad-pagina's
- 5 kennisbank artikelen

### Reviews: 0 (eerlijk starten)
- Geen fake reviews
- Review-functionaliteit bouwen, reviews komen organisch

---

## Launch Checklist

- [ ] Domein asbestvergelijken.nl geregistreerd en DNS naar Netlify
- [ ] Supabase project aangemaakt, schema deployed
- [ ] 50+ bedrijven geïmporteerd en geverifieerd
- [ ] 20 stad-pagina's live met unieke content
- [ ] 5 kennisbank artikelen live
- [ ] Offerte-formulier werkt en slaat leads op
- [ ] Bevestigingsmail werkt
- [ ] Sitemap.xml gegenereerd
- [ ] Google Search Console gekoppeld
- [ ] Schema.org structured data gevalideerd
- [ ] Lighthouse score 90+ op alle categorieën
- [ ] Mobile responsive getest
- [ ] 404 pagina werkt
- [ ] Plausible/analytics actief
- [ ] Privacyverklaring pagina live
- [ ] Cookiebanner (als nodig)

---

## Success Metrics (eerste 3 maanden)

| Metric | Maand 1 | Maand 2 | Maand 3 |
|---|---|---|---|
| Pagina's geïndexeerd | 30+ | 50+ | 75+ |
| Organische impressies | 500 | 2.000 | 5.000 |
| Organische clicks | 25 | 150 | 500 |
| Leads | 1-3 | 5-10 | 15-25 |
| Omzet | €0 | €0-250 | €250-750 |

*SEO duurt 3-6 maanden. Realistische verwachtingen zijn belangrijk.*
