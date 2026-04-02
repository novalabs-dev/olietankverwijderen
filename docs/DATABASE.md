# Database Schema — asbestvergelijken.nl

## Platform: Supabase (PostgreSQL)

## ER Diagram (conceptueel)

```
bedrijven 1──∞ bedrijf_certificeringen ∞──1 certificering_types
bedrijven 1──∞ bedrijf_werkgebieden ∞──1 steden
bedrijven 1──∞ reviews
bedrijven 1──∞ leads
bedrijven 1──∞ bedrijf_specialisaties ∞──1 specialisatie_types
steden ∞──1 provincies
leads ∞──1 steden
```

## Tabellen

### bedrijven
Het hart van de directory. Elk gecertificeerd asbestverwijderingsbedrijf of inventarisatiebureau.

```sql
CREATE TABLE bedrijven (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Basisgegevens
  naam TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  kvk_nummer TEXT,
  beschrijving TEXT,
  korte_beschrijving TEXT,          -- Max 160 tekens, voor cards en meta
  
  -- Contact
  email TEXT,
  telefoon TEXT,
  website TEXT,
  
  -- Adres
  straat TEXT,
  huisnummer TEXT,
  postcode TEXT,
  stad TEXT NOT NULL,
  provincie TEXT NOT NULL,
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  
  -- Bedrijfsinfo
  opgericht_jaar INTEGER,
  aantal_medewerkers TEXT,          -- '1-5', '5-10', '10-25', '25-50', '50+'
  
  -- Scoring & Status
  gemiddelde_rating DECIMAL(2, 1) DEFAULT 0,
  aantal_reviews INTEGER DEFAULT 0,
  is_gecertificeerd BOOLEAN DEFAULT false,
  is_claimed BOOLEAN DEFAULT false,         -- Bedrijf beheert eigen profiel
  is_premium BOOLEAN DEFAULT false,         -- Betaald premium listing
  is_published BOOLEAN DEFAULT false,       -- Zichtbaar op site
  
  -- Prijsindicatie
  prijs_vanaf DECIMAL(10, 2),               -- Vanaf-prijs voor simpele opdracht
  prijs_indicatie TEXT,                      -- 'budget', 'midden', 'premium'
  
  -- Media
  logo_url TEXT,
  header_image_url TEXT,
  
  -- Metadata
  bron TEXT,                                 -- 'ascert', 'kvk', 'handmatig'
  ascert_id TEXT,                            -- ID in Ascert register
  data_verified_at TIMESTAMPTZ,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_bedrijven_slug ON bedrijven(slug);
CREATE INDEX idx_bedrijven_stad ON bedrijven(stad);
CREATE INDEX idx_bedrijven_provincie ON bedrijven(provincie);
CREATE INDEX idx_bedrijven_published ON bedrijven(is_published);
CREATE INDEX idx_bedrijven_rating ON bedrijven(gemiddelde_rating DESC);
CREATE INDEX idx_bedrijven_postcode ON bedrijven(postcode);
```

### certificering_types
Lookup tabel voor type certificeringen.

```sql
CREATE TABLE certificering_types (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT UNIQUE NOT NULL,              -- 'SC-530', 'SC-540', 'SC-560'
  naam TEXT NOT NULL,                     -- 'Asbestverwijdering', 'Asbestinventarisatie'
  beschrijving TEXT,
  url TEXT                                -- Link naar officiële info
);

-- Seed data
INSERT INTO certificering_types (code, naam, beschrijving) VALUES
  ('SC-530', 'Asbestverwijdering', 'Certificering voor het verwijderen van asbest'),
  ('SC-540', 'Asbestinventarisatie', 'Certificering voor het inventariseren van asbest'),
  ('SC-560', 'Asbestanalyse (laboratorium)', 'Certificering voor laboratoriumanalyse van asbest');
```

### bedrijf_certificeringen
Koppeltabel: welk bedrijf heeft welke certificeringen.

```sql
CREATE TABLE bedrijf_certificeringen (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  bedrijf_id UUID REFERENCES bedrijven(id) ON DELETE CASCADE,
  certificering_type_id UUID REFERENCES certificering_types(id),
  certificaat_nummer TEXT,
  geldig_tot DATE,
  verificatie_url TEXT,                   -- Link naar Ascert verificatie
  verified_at TIMESTAMPTZ,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(bedrijf_id, certificering_type_id)
);

CREATE INDEX idx_cert_bedrijf ON bedrijf_certificeringen(bedrijf_id);
```

### specialisatie_types
Lookup tabel voor specialisaties.

```sql
CREATE TABLE specialisatie_types (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  naam TEXT UNIQUE NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  beschrijving TEXT
);

-- Seed data
INSERT INTO specialisatie_types (naam, slug) VALUES
  ('Asbestdak verwijderen', 'asbestdak-verwijderen'),
  ('Asbest vloertegels', 'asbest-vloertegels'),
  ('Asbest dakbeschot', 'asbest-dakbeschot'),
  ('Asbest golfplaten', 'asbest-golfplaten'),
  ('Asbest isolatie', 'asbest-isolatie'),
  ('Asbest in cv-leidingen', 'asbest-cv-leidingen'),
  ('Asbestinventarisatie type A', 'inventarisatie-type-a'),
  ('Asbestinventarisatie type B', 'inventarisatie-type-b'),
  ('Spoedopdrachten', 'spoedopdrachten'),
  ('Particulier', 'particulier'),
  ('Zakelijk', 'zakelijk'),
  ('Overheid / VvE', 'overheid-vve');
```

### bedrijf_specialisaties

```sql
CREATE TABLE bedrijf_specialisaties (
  bedrijf_id UUID REFERENCES bedrijven(id) ON DELETE CASCADE,
  specialisatie_id UUID REFERENCES specialisatie_types(id),
  PRIMARY KEY (bedrijf_id, specialisatie_id)
);
```

### provincies

```sql
CREATE TABLE provincies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  naam TEXT UNIQUE NOT NULL,
  slug TEXT UNIQUE NOT NULL
);

INSERT INTO provincies (naam, slug) VALUES
  ('Drenthe', 'drenthe'),
  ('Flevoland', 'flevoland'),
  ('Friesland', 'friesland'),
  ('Gelderland', 'gelderland'),
  ('Groningen', 'groningen'),
  ('Limburg', 'limburg'),
  ('Noord-Brabant', 'noord-brabant'),
  ('Noord-Holland', 'noord-holland'),
  ('Overijssel', 'overijssel'),
  ('Utrecht', 'utrecht'),
  ('Zeeland', 'zeeland'),
  ('Zuid-Holland', 'zuid-holland');
```

### steden
Steden met zoekvolume (voor lokale landing pages).

```sql
CREATE TABLE steden (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  naam TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  provincie_id UUID REFERENCES provincies(id),
  postcode_range TEXT,                    -- '1000-1099' voor filtering
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  inwoners INTEGER,
  heeft_landing_page BOOLEAN DEFAULT false,
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_steden_provincie ON steden(provincie_id);
CREATE INDEX idx_steden_slug ON steden(slug);
```

### bedrijf_werkgebieden
In welke steden/regio's werkt een bedrijf.

```sql
CREATE TABLE bedrijf_werkgebieden (
  bedrijf_id UUID REFERENCES bedrijven(id) ON DELETE CASCADE,
  stad_id UUID REFERENCES steden(id),
  PRIMARY KEY (bedrijf_id, stad_id)
);

CREATE INDEX idx_werkgebied_stad ON bedrijf_werkgebieden(stad_id);
```

### reviews

```sql
CREATE TABLE reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  bedrijf_id UUID REFERENCES bedrijven(id) ON DELETE CASCADE,
  
  -- Reviewer
  reviewer_naam TEXT NOT NULL,
  reviewer_email TEXT,                    -- Niet publiek, voor verificatie
  reviewer_stad TEXT,
  
  -- Review content
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  titel TEXT,
  tekst TEXT NOT NULL,
  type_opdracht TEXT,                     -- 'verwijdering', 'inventarisatie'
  
  -- Status
  is_verified BOOLEAN DEFAULT false,
  is_published BOOLEAN DEFAULT false,
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_reviews_bedrijf ON reviews(bedrijf_id);
CREATE INDEX idx_reviews_published ON reviews(is_published);
```

### leads
Kern van het verdienmodel.

```sql
CREATE TABLE leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Aanvrager
  naam TEXT NOT NULL,
  email TEXT NOT NULL,
  telefoon TEXT,
  
  -- Locatie
  postcode TEXT NOT NULL,
  stad TEXT,
  stad_id UUID REFERENCES steden(id),
  
  -- Opdracht
  type_dienst TEXT NOT NULL,              -- 'verwijdering', 'inventarisatie', 'beide'
  type_materiaal TEXT,                    -- 'dak', 'vloer', 'isolatie', 'onbekend'
  oppervlakte_m2 TEXT,                    -- '0-10', '10-25', '25-50', '50-100', '100+'
  bouwjaar_pand TEXT,                     -- 'voor-1980', '1980-1994', 'onbekend'
  urgentie TEXT,                          -- 'direct', 'binnen-maand', 'binnen-3-maanden', 'orienterend'
  toelichting TEXT,
  
  -- Matching & Status
  status TEXT DEFAULT 'nieuw',            -- 'nieuw', 'toegewezen', 'verstuurd', 'geaccepteerd', 'afgewezen', 'verlopen'
  bron TEXT DEFAULT 'website',            -- 'website', 'telefoon', 'email'
  landing_page TEXT,                      -- Welke pagina leidde tot de lead
  utm_source TEXT,
  utm_medium TEXT,
  utm_campaign TEXT,
  
  -- Financieel
  geschatte_waarde DECIMAL(10, 2),        -- Geschatte opdracht-waarde
  lead_fee DECIMAL(10, 2),                -- Wat we per lead factureren
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_leads_status ON leads(status);
CREATE INDEX idx_leads_postcode ON leads(postcode);
CREATE INDEX idx_leads_created ON leads(created_at DESC);
```

### lead_toewijzingen
Welke leads zijn naar welke bedrijven gestuurd.

```sql
CREATE TABLE lead_toewijzingen (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id UUID REFERENCES leads(id) ON DELETE CASCADE,
  bedrijf_id UUID REFERENCES bedrijven(id),
  
  status TEXT DEFAULT 'verstuurd',        -- 'verstuurd', 'bekeken', 'geaccepteerd', 'afgewezen'
  verstuurd_op TIMESTAMPTZ DEFAULT NOW(),
  bekeken_op TIMESTAMPTZ,
  reactie_op TIMESTAMPTZ,
  
  -- Facturatie
  is_gefactureerd BOOLEAN DEFAULT false,
  factuur_id UUID,
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_toewijzing_lead ON lead_toewijzingen(lead_id);
CREATE INDEX idx_toewijzing_bedrijf ON lead_toewijzingen(bedrijf_id);
```

### facturen

```sql
CREATE TABLE facturen (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  bedrijf_id UUID REFERENCES bedrijven(id),
  
  factuur_nummer TEXT UNIQUE NOT NULL,    -- 'AV-2026-001'
  type TEXT NOT NULL,                     -- 'lead', 'premium', 'claimed'
  bedrag DECIMAL(10, 2) NOT NULL,
  btw_bedrag DECIMAL(10, 2),
  totaal DECIMAL(10, 2) NOT NULL,
  
  status TEXT DEFAULT 'concept',          -- 'concept', 'verstuurd', 'betaald', 'verlopen'
  mollie_payment_id TEXT,
  
  periode_start DATE,
  periode_eind DATE,
  
  verstuurd_op TIMESTAMPTZ,
  betaald_op TIMESTAMPTZ,
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_facturen_bedrijf ON facturen(bedrijf_id);
CREATE INDEX idx_facturen_status ON facturen(status);
```

### pagina_content
Voor dynamische content die niet in MDX staat (bijv. stad-specifieke info).

```sql
CREATE TABLE pagina_content (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  type TEXT NOT NULL,                     -- 'stad', 'provincie', 'specialisatie'
  referentie_slug TEXT NOT NULL,          -- 'amsterdam', 'noord-holland', etc.
  
  meta_title TEXT,
  meta_description TEXT,
  h1_titel TEXT,
  intro_tekst TEXT,
  hoofd_content TEXT,                     -- Markdown
  
  -- Lokale data (voor stad-pagina's)
  gemeente_regels TEXT,
  afvalpunt_info TEXT,
  lokale_subsidies TEXT,
  voorrijkosten_indicatie TEXT,
  
  is_published BOOLEAN DEFAULT true,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(type, referentie_slug)
);

CREATE INDEX idx_content_type_slug ON pagina_content(type, referentie_slug);
```

## Row Level Security (RLS)

```sql
-- Publieke read access voor gepubliceerde bedrijven
ALTER TABLE bedrijven ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Publiek: lees gepubliceerde bedrijven" ON bedrijven
  FOR SELECT USING (is_published = true);

-- Bedrijven mogen eigen profiel bewerken (via claimed listings)
CREATE POLICY "Bedrijf: bewerk eigen profiel" ON bedrijven
  FOR UPDATE USING (auth.uid() = claimed_by_user_id);

-- Leads alleen zichtbaar voor admin en toegewezen bedrijf
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admin: alle leads" ON leads
  FOR ALL USING (auth.jwt() ->> 'role' = 'admin');

-- Reviews publiek leesbaar als gepubliceerd
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Publiek: lees gepubliceerde reviews" ON reviews
  FOR SELECT USING (is_published = true);
```

## Supabase Functions (Edge Functions)

### match-leads
Automatisch leads matchen met bedrijven op basis van postcode en werkgebied.

### send-lead-notification
E-mail naar bedrijf sturen bij nieuwe lead.

### update-rating
Herbereken gemiddelde rating na nieuwe review.

## Data Migratie Plan

1. **Fase 1:** Schema aanmaken + seed data (provincies, steden, certificering types, specialisaties)
2. **Fase 2:** Ascert register importeren → bedrijven tabel vullen
3. **Fase 3:** KvK/Google Maps verrijking → contactgegevens, reviews, locatie
4. **Fase 4:** AI verrijking → beschrijvingen, categorisering
