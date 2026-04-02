-- ============================================================
-- asbestvergelijken.nl — Initial Database Schema
-- ============================================================

-- Enable UUID extension (usually already enabled in Supabase)
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================================
-- 1. Lookup tables
-- ============================================================

-- Certificering types (SC-530, SC-540, SC-560)
CREATE TABLE certificering_types (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT UNIQUE NOT NULL,
  naam TEXT NOT NULL,
  beschrijving TEXT,
  url TEXT
);

INSERT INTO certificering_types (code, naam, beschrijving) VALUES
  ('SC-530', 'Asbestverwijdering', 'Certificering voor het verwijderen van asbest'),
  ('SC-540', 'Asbestinventarisatie', 'Certificering voor het inventariseren van asbest'),
  ('SC-560', 'Asbestanalyse (laboratorium)', 'Certificering voor laboratoriumanalyse van asbest');

-- Specialisatie types
CREATE TABLE specialisatie_types (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  naam TEXT UNIQUE NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  beschrijving TEXT
);

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

-- Provincies
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

-- Steden
CREATE TABLE steden (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  naam TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  provincie_id UUID REFERENCES provincies(id),
  postcode_range TEXT,
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  inwoners INTEGER,
  heeft_landing_page BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_steden_provincie ON steden(provincie_id);
CREATE INDEX idx_steden_slug ON steden(slug);

-- ============================================================
-- 2. Core tables
-- ============================================================

-- Bedrijven
CREATE TABLE bedrijven (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Basisgegevens
  naam TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  kvk_nummer TEXT,
  beschrijving TEXT,
  korte_beschrijving TEXT,

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
  aantal_medewerkers TEXT,

  -- Scoring & Status
  gemiddelde_rating DECIMAL(2, 1) DEFAULT 0,
  aantal_reviews INTEGER DEFAULT 0,
  is_gecertificeerd BOOLEAN DEFAULT false,
  is_claimed BOOLEAN DEFAULT false,
  is_premium BOOLEAN DEFAULT false,
  is_published BOOLEAN DEFAULT false,

  -- Prijsindicatie
  prijs_vanaf DECIMAL(10, 2),
  prijs_indicatie TEXT,

  -- Media
  logo_url TEXT,
  header_image_url TEXT,

  -- Metadata
  bron TEXT,
  ascert_id TEXT,
  data_verified_at TIMESTAMPTZ,

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_bedrijven_slug ON bedrijven(slug);
CREATE INDEX idx_bedrijven_stad ON bedrijven(stad);
CREATE INDEX idx_bedrijven_provincie ON bedrijven(provincie);
CREATE INDEX idx_bedrijven_published ON bedrijven(is_published);
CREATE INDEX idx_bedrijven_rating ON bedrijven(gemiddelde_rating DESC);
CREATE INDEX idx_bedrijven_postcode ON bedrijven(postcode);

-- ============================================================
-- 3. Junction / relation tables
-- ============================================================

-- Bedrijf certificeringen
CREATE TABLE bedrijf_certificeringen (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  bedrijf_id UUID REFERENCES bedrijven(id) ON DELETE CASCADE,
  certificering_type_id UUID REFERENCES certificering_types(id),
  certificaat_nummer TEXT,
  geldig_tot DATE,
  verificatie_url TEXT,
  verified_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(bedrijf_id, certificering_type_id)
);

CREATE INDEX idx_cert_bedrijf ON bedrijf_certificeringen(bedrijf_id);

-- Bedrijf specialisaties
CREATE TABLE bedrijf_specialisaties (
  bedrijf_id UUID REFERENCES bedrijven(id) ON DELETE CASCADE,
  specialisatie_id UUID REFERENCES specialisatie_types(id),
  PRIMARY KEY (bedrijf_id, specialisatie_id)
);

-- Bedrijf werkgebieden
CREATE TABLE bedrijf_werkgebieden (
  bedrijf_id UUID REFERENCES bedrijven(id) ON DELETE CASCADE,
  stad_id UUID REFERENCES steden(id),
  PRIMARY KEY (bedrijf_id, stad_id)
);

CREATE INDEX idx_werkgebied_stad ON bedrijf_werkgebieden(stad_id);

-- ============================================================
-- 4. Reviews
-- ============================================================

CREATE TABLE reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  bedrijf_id UUID REFERENCES bedrijven(id) ON DELETE CASCADE,

  -- Reviewer
  reviewer_naam TEXT NOT NULL,
  reviewer_email TEXT,
  reviewer_stad TEXT,

  -- Review content
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  titel TEXT,
  tekst TEXT NOT NULL,
  type_opdracht TEXT,

  -- Status
  is_verified BOOLEAN DEFAULT false,
  is_published BOOLEAN DEFAULT false,

  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_reviews_bedrijf ON reviews(bedrijf_id);
CREATE INDEX idx_reviews_published ON reviews(is_published);

-- ============================================================
-- 5. Leads
-- ============================================================

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
  type_dienst TEXT NOT NULL,
  type_materiaal TEXT,
  oppervlakte_m2 TEXT,
  bouwjaar_pand TEXT,
  urgentie TEXT,
  toelichting TEXT,

  -- Matching & Status
  status TEXT DEFAULT 'nieuw',
  bron TEXT DEFAULT 'website',
  landing_page TEXT,
  utm_source TEXT,
  utm_medium TEXT,
  utm_campaign TEXT,

  -- Financieel
  geschatte_waarde DECIMAL(10, 2),
  lead_fee DECIMAL(10, 2),

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_leads_status ON leads(status);
CREATE INDEX idx_leads_postcode ON leads(postcode);
CREATE INDEX idx_leads_created ON leads(created_at DESC);

-- Lead toewijzingen
CREATE TABLE lead_toewijzingen (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id UUID REFERENCES leads(id) ON DELETE CASCADE,
  bedrijf_id UUID REFERENCES bedrijven(id),

  status TEXT DEFAULT 'verstuurd',
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

-- ============================================================
-- 6. Facturen
-- ============================================================

CREATE TABLE facturen (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  bedrijf_id UUID REFERENCES bedrijven(id),

  factuur_nummer TEXT UNIQUE NOT NULL,
  type TEXT NOT NULL,
  bedrag DECIMAL(10, 2) NOT NULL,
  btw_bedrag DECIMAL(10, 2),
  totaal DECIMAL(10, 2) NOT NULL,

  status TEXT DEFAULT 'concept',
  mollie_payment_id TEXT,

  periode_start DATE,
  periode_eind DATE,

  verstuurd_op TIMESTAMPTZ,
  betaald_op TIMESTAMPTZ,

  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_facturen_bedrijf ON facturen(bedrijf_id);
CREATE INDEX idx_facturen_status ON facturen(status);

-- ============================================================
-- 7. Pagina content
-- ============================================================

CREATE TABLE pagina_content (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  type TEXT NOT NULL,
  referentie_slug TEXT NOT NULL,

  meta_title TEXT,
  meta_description TEXT,
  h1_titel TEXT,
  intro_tekst TEXT,
  hoofd_content TEXT,

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

-- ============================================================
-- 8. Row Level Security (RLS)
-- ============================================================

-- Bedrijven: publiek leesbaar als gepubliceerd
ALTER TABLE bedrijven ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Publiek: lees gepubliceerde bedrijven" ON bedrijven
  FOR SELECT USING (is_published = true);

-- Reviews: publiek leesbaar als gepubliceerd
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Publiek: lees gepubliceerde reviews" ON reviews
  FOR SELECT USING (is_published = true);

-- Leads: alleen via service role (server-side)
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;

-- Lead toewijzingen: alleen via service role
ALTER TABLE lead_toewijzingen ENABLE ROW LEVEL SECURITY;

-- Facturen: alleen via service role
ALTER TABLE facturen ENABLE ROW LEVEL SECURITY;

-- Lookup tables: publiek leesbaar
ALTER TABLE certificering_types ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Publiek: lees certificering types" ON certificering_types
  FOR SELECT USING (true);

ALTER TABLE specialisatie_types ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Publiek: lees specialisatie types" ON specialisatie_types
  FOR SELECT USING (true);

ALTER TABLE provincies ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Publiek: lees provincies" ON provincies
  FOR SELECT USING (true);

ALTER TABLE steden ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Publiek: lees steden" ON steden
  FOR SELECT USING (true);

ALTER TABLE pagina_content ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Publiek: lees gepubliceerde content" ON pagina_content
  FOR SELECT USING (is_published = true);

ALTER TABLE bedrijf_certificeringen ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Publiek: lees bedrijf certificeringen" ON bedrijf_certificeringen
  FOR SELECT USING (true);

ALTER TABLE bedrijf_specialisaties ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Publiek: lees bedrijf specialisaties" ON bedrijf_specialisaties
  FOR SELECT USING (true);

ALTER TABLE bedrijf_werkgebieden ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Publiek: lees bedrijf werkgebieden" ON bedrijf_werkgebieden
  FOR SELECT USING (true);

-- ============================================================
-- 9. Updated_at trigger
-- ============================================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_updated_at_bedrijven
  BEFORE UPDATE ON bedrijven
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER set_updated_at_leads
  BEFORE UPDATE ON leads
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER set_updated_at_pagina_content
  BEFORE UPDATE ON pagina_content
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
