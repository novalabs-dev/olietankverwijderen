---
name: enrich-profile
description: Write or update a company profile description based on their website. Use when the user asks to write a profile, generate a description, enrich profile text, or update a company's beschrijving.
disable-model-invocation: true
allowed-tools: Bash(npx tsx scripts/enrich-profile.ts *), Bash(cat /tmp/beschrijving-*), WebFetch, Read, Grep, Glob, Write, Task
argument-hint: "<slug> [--website <url>] [--asbestpagina <url>]"
---

# Company Profile Enrichment

Schrijf een professionele, SEO-geoptimaliseerde bedrijfsbeschrijving voor een asbestverwijderingsbedrijf op asbestvergelijken.nl. De tekst wordt getoond op de bedrijfsprofielpagina onder "Over {bedrijfsnaam}".

## Doel

Een unieke, informatieve beschrijving per bedrijf die:
- Relevant is voor bezoekers die een asbestverwijderaar zoeken
- Goed scoort in Google (SEO)
- Niet leest als AI-gegenereerde tekst
- Specifieke informatie bevat over het bedrijf (geen generieke filler)

## Invoer

`$ARGUMENTS` bevat de slug van het bedrijf, en optioneel:
- `--website <url>` — website van het bedrijf (als niet in DB)
- `--asbestpagina <url>` — directe URL naar hun asbestpagina

## Stap 1: Bedrijfsdata ophalen

```bash
npx tsx scripts/enrich-profile.ts --get <slug>
```

Dit geeft een JSON object met:
- Bedrijfsnaam, locatie, KvK-nummer
- Huidige beschrijving en korte_beschrijving
- Certificeringen (SC-530, SC-540)
- Specialisaties
- Website URL

Sla de relevante data op voor gebruik in de volgende stappen.

## Stap 2: Website beschikbaarheid controleren

Bepaal de website URL uit (in volgorde van prioriteit):
1. `--website` argument
2. `website` veld uit de database
3. **E-maildomein afleiden:** als het bedrijf een `email` veld heeft (bijv. `info@bijlbouw.nl`), probeer dan `https://www.<domein>` (bijv. `https://www.bijlbouw.nl`). Negeer generieke domeinen als gmail.com, hotmail.com, outlook.com, live.nl, ziggo.nl, kpnmail.nl, xs4all.nl, hetnet.nl, casema.nl, home.nl, planet.nl, upcmail.nl, quicknet.nl, tele2.nl, online.nl.

**Als een website via het e-maildomein is afgeleid:**
- Gebruik WebFetch om de homepage op te halen
- Controleer of de bedrijfsnaam (of een herkenbare variant) op de pagina voorkomt
- Als het inderdaad hun website is, sla de URL op in de database:
  ```bash
  npx tsx scripts/enrich-profile.ts --set-website <slug> <url>
  ```
- Ga daarna verder met stap 3

**Als er GEEN website beschikbaar is** (ook niet via e-maildomein):
- Zet het bedrijf op unpublished:
  ```bash
  npx tsx scripts/enrich-profile.ts --unpublish <slug>
  ```
- Meld aan de gebruiker: "[Bedrijfsnaam] heeft geen website. Profiel op unpublished gezet."
- **Stop hier.** Ga niet verder met de overige stappen.

## Stap 3: Website research

Gebruik een sub-agent (Task tool, subagent_type: "general-purpose") om de website te onderzoeken. Geef de sub-agent de volgende opdracht:

**Sub-agent instructie:**

> Research the website of an asbestos removal company for writing a company profile. Fetch the following URLs and extract relevant information.
>
> IMPORTANT: Be respectful to the website. Fetch MAXIMUM 3 pages total. Do NOT crawl the entire site.
>
> Pages to fetch (in order of priority, stop after 3):
> 1. Homepage: {website_url}
> 2. Asbestos-specific page: {asbestpagina_url} (if provided)
>    If no specific asbestos page was provided, try ONE of these common paths: /asbest, /diensten/asbest, /asbestsanering, /diensten/asbestsanering, /asbestverwijdering, /diensten/asbestverwijdering
> 3. About page (if not enough info from above): /over-ons, /about, /over
>
> If a URL fails to load, note that and move on. Do NOT retry or try alternative URLs beyond the 3-page limit.
>
> Extract and return the following in a structured summary:
> - **Bedrijfsnaam en oprichtingsjaar** (indien vermeld)
> - **Kernactiviteiten** rondom asbest (verwijdering, inventarisatie, sanering)
> - **Werkwijze** (hoe ze te werk gaan, welke stappen)
> - **Certificeringen en kwaliteitsborging** (vermeld op de site)
> - **Werkgebied / regio's** waar ze actief zijn
> - **Specialisaties** (type gebouwen, materialen, sectoren)
> - **Onderscheidende kenmerken** (wat maakt ze uniek t.o.v. concurrenten)
> - **Ervaring** (jaren actief, referentieprojecten, aantallen)
> - **Extra diensten** naast asbest (sloop, bouw, renovatie, etc.)
>
> Return ONLY the factual findings. Do NOT write a profile text — just the raw facts.
> Keep the summary concise (max 500 words).

De sub-agent geeft een feitelijke samenvatting terug. Gebruik die als basis voor de profieltekst.

## Stap 4: Profieltekst schrijven

Schrijf op basis van de verzamelde data twee teksten:

### 4a. beschrijving (lang, 150-300 woorden)

**Richtlijnen:**
- Schrijf in de **derde persoon** ("Het bedrijf..." of direct met bedrijfsnaam)
- Begin met een krachtige openingszin die de kern van het bedrijf samenvat
- Vermeld specifieke feiten: oprichtingsjaar, locatie, type projecten, certificeringen
- Noem hun werkwijze of aanpak als die op de website staat
- Sluit af met wat hen onderscheidt of hun werkgebied
- Gebruik **natuurlijk Nederlands** — geen overdreven formeel of marketingtaal
- Verwerk relevante zoekwoorden op een natuurlijke manier: asbestverwijdering, asbestsanering, asbestinventarisatie, gecertificeerd, SC-530, SC-540
- **GEEN** opsommingstekens of bullet points — alleen vloeiende alinea's
- **GEEN** zinnen als "Neem contact op" of "Vraag een offerte aan" — dat staat al elders op de pagina
- **GEEN** superlatieven of overdrijvingen ("de beste", "toonaangevend", "marktleider") tenzij aantoonbaar
- **GEEN** mention van de website URL zelf
- **GEEN** emdashes (—) gebruiken in de tekst, gebruik gewone streepjes (-) of herformuleer de zin

### 4b. korte_beschrijving (max 160 tekens)

- Eén zin die het bedrijf samenvat
- Wordt gebruikt als meta description en op overzichtskaarten
- Bevat stad/regio en kernactiviteit
- Voorbeeld: "Gecertificeerd asbestverwijderingsbedrijf in Rotterdam, gespecialiseerd in asbestsanering voor particulier en zakelijk."

## Stap 5: Tekst opslaan

1. Schrijf de `beschrijving` naar een tijdelijk bestand:
   ```bash
   # Gebruik Write tool om de tekst naar /tmp/beschrijving-<slug>.txt te schrijven
   ```

2. Update het bedrijfsprofiel:
   ```bash
   npx tsx scripts/enrich-profile.ts --update <slug> --beschrijving /tmp/beschrijving-<slug>.txt --korte-beschrijving "<korte tekst>"
   ```

## Stap 6: Rapportage

Geef de gebruiker een samenvatting:
- Bedrijfsnaam en slug
- Bronnen gebruikt (welke URLs gefetcht)
- De geschreven beschrijving (volledig)
- De korte_beschrijving
- Bevestiging dat het profiel is bijgewerkt in de database

## Voorbeeldtekst (ter referentie)

> Van der Berg Asbestsanering is een in 2005 opgericht asbestverwijderingsbedrijf gevestigd in Amersfoort. Het bedrijf is SC-530 gecertificeerd en richt zich op de veilige verwijdering van asbesthoudende materialen bij zowel particuliere woningen als bedrijfspanden.
>
> Met een team van ervaren vakmensen voert Van der Berg projecten uit in de regio Midden-Nederland, van het verwijderen van asbestdaken en golfplaten tot het saneren van asbest in vloertegels en isolatiemateriaal. Elk project begint met een inventarisatie volgens het Type-A of Type-B protocol, waarna een gedetailleerd werkplan wordt opgesteld.
>
> Het bedrijf beschikt over eigen materieel voor containment en afvoer en werkt samen met erkende laboratoria voor luchtmetingen en vrijgavemonsters. Van der Berg verwerkt het afval via gecertificeerde verwerkingslocaties en levert bij oplevering een volledig dossier op met vrijgavecertificaat.

## Belangrijk

- **Geen verzinnen van feiten** — gebruik alleen wat je op de website hebt gevonden of wat in de database staat
- **Consistent met bestaande data** — controleer dat certificeringen in de tekst overeenkomen met de database
- **Behandel 1 bedrijf per keer** — deze skill verwerkt één bedrijf per aanroep
- **Respectvol websitegebruik** — maximaal 3 pagina's per website ophalen, geen agressief crawlen
