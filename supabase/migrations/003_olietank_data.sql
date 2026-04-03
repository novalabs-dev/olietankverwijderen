-- ============================================================
-- olietankverwijderen.nl — Niche-specifieke data
-- ============================================================
-- Vervangt asbest-specifieke certificeringen en specialisaties
-- met olietank-relevante data (BRL K902, K904, SIKB 7000)

-- ============================================================
-- 1. Certificering types vervangen
-- ============================================================

DELETE FROM certificering_types;

INSERT INTO certificering_types (code, naam, beschrijving) VALUES
  ('K902', 'BRL K902 - Tanksanering HBO/diesel', 'Certificering voor sanering van ondergrondse en bovengrondse HBO/diesel opslagtanks'),
  ('K904', 'BRL K904 - Tanksanering overige producten', 'Certificering voor sanering van tanks met overige producten (niet HBO/diesel)'),
  ('SIKB-7000', 'BRL SIKB 7000 - Bodemsanering', 'Certificering voor uitvoering van land- en waterbodemsaneringen'),
  ('SIKB-7005', 'BRL SIKB 7005 - Graven en saneren', 'Certificering voor graven in de bodem en saneren (conventionele methoden)'),
  ('SIKB-7006', 'BRL SIKB 7006 - In-situ sanering', 'Certificering voor in situ technieken en grondwatersaneringen');

-- ============================================================
-- 2. Specialisatie types vervangen
-- ============================================================

DELETE FROM specialisatie_types;

INSERT INTO specialisatie_types (naam, slug) VALUES
  ('Ondergrondse tank verwijderen', 'ondergrondse-tank-verwijderen'),
  ('Bovengrondse tank verwijderen', 'bovengrondse-tank-verwijderen'),
  ('Olietank saneren', 'olietank-saneren'),
  ('Bodemsanering na tankverwijdering', 'bodemsanering-na-tankverwijdering'),
  ('Bodemonderzoek', 'bodemonderzoek'),
  ('Tankreiniging', 'tankreiniging'),
  ('Grondwatersanering', 'grondwatersanering'),
  ('Particulier', 'particulier'),
  ('Zakelijk', 'zakelijk'),
  ('Spoedopdrachten', 'spoedopdrachten');

-- ============================================================
-- 3. Bedrijven tabel: ascert_id hernoemen naar bron_id
-- ============================================================

-- Voeg bron_id kolom toe (generiek, niet ascert-specifiek)
ALTER TABLE bedrijven ADD COLUMN IF NOT EXISTS bron_id TEXT;
-- Kopieer bestaande ascert_id data als die er is
UPDATE bedrijven SET bron_id = ascert_id WHERE ascert_id IS NOT NULL AND bron_id IS NULL;

-- ============================================================
-- 4. Leads tabel: olietank-specifieke velden
-- ============================================================

-- type_materiaal hergebruiken voor tank_type
-- oppervlakte_m2 hergebruiken voor tank_inhoud
-- Voeg extra velden toe
ALTER TABLE leads ADD COLUMN IF NOT EXISTS tank_type TEXT;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS tank_inhoud TEXT;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS tank_locatie TEXT;
