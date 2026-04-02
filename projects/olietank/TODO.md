# Olietankverwijderen.nl - Productie TODO

## Status: Preview klaar (2 april 2026)

Build succesvol, 78 pagina's, alle content olietank-specifiek.

---

## Nog nodig voor productie

### 1. Supabase opzetten
- [ ] Supabase project aanmaken voor olietank
- [ ] Database schema migreren (leads tabel met nieuwe velden: type_tank, inhoud_tank i.p.v. type_materiaal, oppervlakte_m2, bouwjaar_pand)
- [ ] Bedrijven tabel vullen met olietankverwijderingsbedrijven
- [ ] Certificering types aanpassen (BRL SIKB 7000 i.p.v. SC-530/SC-540)
- [ ] RLS policies instellen
- [ ] .env.local vullen met NEXT_PUBLIC_SUPABASE_URL en SUPABASE_SERVICE_ROLE_KEY

### 2. Netlify deployment
- [ ] Netlify site aanmaken
- [ ] GitHub repo koppelen (of handmatig deployen)
- [ ] Environment variables instellen (Supabase, SMTP, etc.)
- [ ] Build command: `npm run build`
- [ ] Publish directory: `.next`

### 3. Domein koppeling
- [ ] Domein olietankverwijderen.nl registreren (of bestaand domein bij Versio)
- [ ] DNS A/CNAME records naar Netlify
- [ ] SSL certificaat (automatisch via Netlify)
- [ ] NEXT_PUBLIC_BASE_URL updaten in .env

### 4. Email configuratie
- [ ] SMTP credentials instellen voor olietankverwijderen.nl
- [ ] info@olietankverwijderen.nl mailbox aanmaken
- [ ] NOTIFICATION_EMAIL instellen voor lead notificaties
- [ ] Test emails versturen

### 5. Google Analytics
- [ ] Nieuw GA4 property aanmaken (of bestaand ID G-JLXC17PSPT valideren)
- [ ] GA4 tracking verifiëren na deployment

### 6. Content verrijking (optioneel)
- [ ] Bedrijven data scrapen/invoeren
- [ ] Reviews systeem activeren
- [ ] Extra kennisbank artikelen
- [ ] Stadspagina's uitbreiden met meer lokale context

---

## Wat al werkt
- Homepage met hero, postcode zoek, en uitgelichte bedrijven
- 5 kennisbank artikelen (kosten, herkennen, bodemsanering, regelgeving, zelf verwijderen)
- 48 stadspagina's met lokale SEO content en FAQ's
- Offerte formulier met olietank-specifieke velden (type tank, inhoud, type dienst)
- Bedrijvenpagina met filters
- SEO: meta tags, OG tags, JSON-LD structured data, sitemap.xml, robots.txt
- Responsive design met sticky CTA
- Privacy pagina en contact pagina
