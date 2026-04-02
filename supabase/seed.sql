-- ============================================================
-- asbestvergelijken.nl — Seed Data (testbedrijven)
-- ============================================================
-- Dit script voegt testdata toe voor lokale ontwikkeling.
-- Draai dit NA de migratie (001_initial_schema.sql).
--
-- Let op: de migratie bevat al seed data voor:
--   - certificering_types (SC-530, SC-540, SC-560)
--   - specialisatie_types (12 stuks)
--   - provincies (12 stuks)
--
-- Dit script voegt toe:
--   - 20 steden (top 20 voor landing pages)
--   - 6 testbedrijven met certificeringen, specialisaties, werkgebieden
--   - Een paar reviews
-- ============================================================

-- ============================================================
-- 1. Steden (top 20 uit MVP-SCOPE.md)
-- ============================================================

INSERT INTO steden (naam, slug, provincie_id, postcode_range, latitude, longitude, inwoners, heeft_landing_page) VALUES
  ('Amsterdam', 'amsterdam',
    (SELECT id FROM provincies WHERE slug = 'noord-holland'),
    '1000-1099', 52.37403000, 4.88969500, 921402, true),
  ('Rotterdam', 'rotterdam',
    (SELECT id FROM provincies WHERE slug = 'zuid-holland'),
    '3000-3099', 51.92442000, 4.47773000, 656050, true),
  ('Den Haag', 'den-haag',
    (SELECT id FROM provincies WHERE slug = 'zuid-holland'),
    '2500-2599', 52.07667000, 4.29861000, 548320, true),
  ('Utrecht', 'utrecht',
    (SELECT id FROM provincies WHERE slug = 'utrecht'),
    '3500-3599', 52.09074000, 5.12142000, 361924, true),
  ('Eindhoven', 'eindhoven',
    (SELECT id FROM provincies WHERE slug = 'noord-brabant'),
    '5600-5699', 51.44164000, 5.46972000, 238478, true),
  ('Groningen', 'groningen',
    (SELECT id FROM provincies WHERE slug = 'groningen'),
    '9700-9799', 53.21917000, 6.56667000, 234649, true),
  ('Tilburg', 'tilburg',
    (SELECT id FROM provincies WHERE slug = 'noord-brabant'),
    '5000-5099', 51.55551000, 5.09130000, 224702, true),
  ('Almere', 'almere',
    (SELECT id FROM provincies WHERE slug = 'flevoland'),
    '1300-1399', 52.35079000, 5.26442000, 218096, true),
  ('Breda', 'breda',
    (SELECT id FROM provincies WHERE slug = 'noord-brabant'),
    '4800-4899', 51.58656000, 4.77596000, 184716, true),
  ('Nijmegen', 'nijmegen',
    (SELECT id FROM provincies WHERE slug = 'gelderland'),
    '6500-6599', 51.84260000, 5.85278000, 179073, true),
  ('Arnhem', 'arnhem',
    (SELECT id FROM provincies WHERE slug = 'gelderland'),
    '6800-6899', 51.98500000, 5.89806000, 164096, true),
  ('Haarlem', 'haarlem',
    (SELECT id FROM provincies WHERE slug = 'noord-holland'),
    '2000-2099', 52.38084000, 4.63683000, 162898, true),
  ('Amersfoort', 'amersfoort',
    (SELECT id FROM provincies WHERE slug = 'utrecht'),
    '3800-3899', 52.15517000, 5.38750000, 157276, true),
  ('Apeldoorn', 'apeldoorn',
    (SELECT id FROM provincies WHERE slug = 'gelderland'),
    '7300-7399', 52.21000000, 5.96944000, 165000, true),
  ('Zoetermeer', 'zoetermeer',
    (SELECT id FROM provincies WHERE slug = 'zuid-holland'),
    '2700-2799', 52.05750000, 4.49306000, 125567, true),
  ('''s-Hertogenbosch', 'den-bosch',
    (SELECT id FROM provincies WHERE slug = 'noord-brabant'),
    '5200-5299', 51.69917000, 5.30417000, 155827, true),
  ('Zwolle', 'zwolle',
    (SELECT id FROM provincies WHERE slug = 'overijssel'),
    '8000-8099', 52.51667000, 6.08333000, 131592, true),
  ('Leiden', 'leiden',
    (SELECT id FROM provincies WHERE slug = 'zuid-holland'),
    '2300-2399', 52.16000000, 4.49306000, 124899, true),
  ('Maastricht', 'maastricht',
    (SELECT id FROM provincies WHERE slug = 'limburg'),
    '6200-6299', 50.85167000, 5.69083000, 121151, true),
  ('Enschede', 'enschede',
    (SELECT id FROM provincies WHERE slug = 'overijssel'),
    '7500-7599', 52.22000000, 6.89583000, 160995, true),
  ('Zaanstad', 'zaanstad',
    (SELECT id FROM provincies WHERE slug = 'noord-holland'),
    '1500-1599', 52.45000000, 4.82639000, 157000, true),
  ('Haarlemmermeer', 'haarlemmermeer',
    (SELECT id FROM provincies WHERE slug = 'noord-holland'),
    '2130-2159', 52.30278000, 4.69722000, 157000, true),
  ('Dordrecht', 'dordrecht',
    (SELECT id FROM provincies WHERE slug = 'zuid-holland'),
    '3300-3399', 51.81000000, 4.67361000, 119000, true),
  ('Leeuwarden', 'leeuwarden',
    (SELECT id FROM provincies WHERE slug = 'friesland'),
    '8900-8999', 53.20139000, 5.79917000, 124000, true),
  ('Middelburg', 'middelburg',
    (SELECT id FROM provincies WHERE slug = 'zeeland'),
    '4330-4339', 51.50000000, 3.61389000, 49000, true),
  ('Emmen', 'emmen',
    (SELECT id FROM provincies WHERE slug = 'drenthe'),
    '7800-7899', 52.78611000, 6.89722000, 107000, true);

-- ============================================================
-- 2. Testbedrijven
-- ============================================================

INSERT INTO bedrijven (naam, slug, kvk_nummer, beschrijving, korte_beschrijving, email, telefoon, website, straat, huisnummer, postcode, stad, provincie, latitude, longitude, opgericht_jaar, aantal_medewerkers, gemiddelde_rating, aantal_reviews, is_gecertificeerd, is_published, prijs_vanaf, prijs_indicatie, bron) VALUES

-- Bedrijf 1: Amsterdam, verwijdering
('SafeClean Asbestverwijdering', 'safeclean-asbestverwijdering',
  '12345678',
  'SafeClean is gespecialiseerd in veilige asbestverwijdering voor particulieren en bedrijven in de regio Amsterdam. Met meer dan 15 jaar ervaring en SC-530 certificering garanderen wij een professionele en veilige aanpak. Wij verzorgen het volledige traject: van inventarisatie tot verwijdering en afvoer.',
  'Gecertificeerde asbestverwijdering in Amsterdam en omgeving. Meer dan 15 jaar ervaring.',
  'info@testbedrijf-safeclean.nl', '020-1234567', 'https://www.testbedrijf-safeclean.nl',
  'Herengracht', '100', '1015 BS', 'Amsterdam', 'Noord-Holland',
  52.37403000, 4.88969500, 2008, '10-25',
  4.5, 12, true, true, 850.00, 'midden', 'handmatig'),

-- Bedrijf 2: Rotterdam, verwijdering + inventarisatie
('Asbestvrij Zuid-Holland', 'asbestvrij-zuid-holland',
  '23456789',
  'Asbestvrij Zuid-Holland biedt complete asbestdiensten: van inventarisatie tot verwijdering. Wij zijn zowel SC-530 als SC-540 gecertificeerd en werken door heel Zuid-Holland. Onze ervaren teams werken snel, veilig en netjes.',
  'Complete asbestdiensten in Zuid-Holland. SC-530 en SC-540 gecertificeerd.',
  'info@testbedrijf-asbestvrij-zh.nl', '010-2345678', 'https://www.testbedrijf-asbestvrij-zh.nl',
  'Coolsingel', '50', '3011 AD', 'Rotterdam', 'Zuid-Holland',
  51.92442000, 4.47773000, 2012, '25-50',
  4.2, 8, true, true, 650.00, 'budget', 'handmatig'),

-- Bedrijf 3: Utrecht, inventarisatie
('Van der Berg Asbestinventarisatie', 'van-der-berg-asbestinventarisatie',
  '34567890',
  'Van der Berg is een onafhankelijk asbestinventarisatiebureau gevestigd in Utrecht. Met SC-540 certificering voeren wij Type A en Type B inventarisaties uit voor particulieren, woningcorporaties en overheden in Midden-Nederland.',
  'Onafhankelijk asbestinventarisatiebureau in Utrecht. SC-540 gecertificeerd.',
  'info@testbedrijf-vdberg.nl', '030-3456789', 'https://www.testbedrijf-vdberg.nl',
  'Oudegracht', '200', '3511 NR', 'Utrecht', 'Utrecht',
  52.09074000, 5.12142000, 2015, '5-10',
  4.8, 15, true, true, 350.00, 'midden', 'handmatig'),

-- Bedrijf 4: Eindhoven, verwijdering
('Brabant Asbest Services', 'brabant-asbest-services',
  '45678901',
  'Brabant Asbest Services is uw partner voor asbestverwijdering in Noord-Brabant. Van asbestdaken tot vloertegels: wij verwijderen alle soorten asbest veilig en vakkundig. SC-530 gecertificeerd en gespecialiseerd in spoedopdrachten.',
  'Asbestverwijdering in heel Noord-Brabant. Gespecialiseerd in spoedopdrachten.',
  'info@testbedrijf-brabant-asbest.nl', '040-4567890', 'https://www.testbedrijf-brabant-asbest.nl',
  'Stratumseind', '10', '5611 EN', 'Eindhoven', 'Noord-Brabant',
  51.44164000, 5.46972000, 2005, '10-25',
  3.9, 5, true, true, 750.00, 'midden', 'handmatig'),

-- Bedrijf 5: Groningen, klein bedrijf
('Noord Asbest Oplossingen', 'noord-asbest-oplossingen',
  '56789012',
  'Noord Asbest Oplossingen is een klein maar ervaren asbestverwijderingsbedrijf in Groningen. Wij richten ons op particuliere klanten en bieden persoonlijke service bij het verwijderen van asbest uit woningen.',
  'Persoonlijke asbestverwijdering voor particulieren in Groningen.',
  'info@testbedrijf-noord-asbest.nl', '050-5678901', 'https://www.testbedrijf-noord-asbest.nl',
  'Grote Markt', '5', '9712 HN', 'Groningen', 'Groningen',
  53.21917000, 6.56667000, 2018, '1-5',
  4.7, 3, true, true, 500.00, 'budget', 'handmatig'),

-- Bedrijf 6: Den Haag, premium, verwijdering + inventarisatie
('ProAsbest Nederland', 'proasbest-nederland',
  '67890123',
  'ProAsbest Nederland is een landelijk opererend asbestbedrijf met hoofdkantoor in Den Haag. Wij beschikken over zowel SC-530 als SC-540 certificering en bedienen zowel particuliere als zakelijke klanten. Met een team van 50+ medewerkers zijn wij een van de grotere asbestbedrijven van Nederland.',
  'Landelijk opererend asbestbedrijf. SC-530 en SC-540 gecertificeerd, 50+ medewerkers.',
  'info@testbedrijf-proasbest.nl', '070-6789012', 'https://www.testbedrijf-proasbest.nl',
  'Lange Voorhout', '1', '2514 EA', 'Den Haag', 'Zuid-Holland',
  52.07667000, 4.29861000, 2000, '50+',
  4.1, 22, true, true, 1200.00, 'premium', 'handmatig');

-- ============================================================
-- 3. Certificeringen koppelen
-- ============================================================

-- SafeClean: SC-530
INSERT INTO bedrijf_certificeringen (bedrijf_id, certificering_type_id, certificaat_nummer, geldig_tot) VALUES
  ((SELECT id FROM bedrijven WHERE slug = 'safeclean-asbestverwijdering'),
   (SELECT id FROM certificering_types WHERE code = 'SC-530'),
   'TEST-530-001', '2027-12-31');

-- Asbestvrij ZH: SC-530 + SC-540
INSERT INTO bedrijf_certificeringen (bedrijf_id, certificering_type_id, certificaat_nummer, geldig_tot) VALUES
  ((SELECT id FROM bedrijven WHERE slug = 'asbestvrij-zuid-holland'),
   (SELECT id FROM certificering_types WHERE code = 'SC-530'),
   'TEST-530-002', '2027-06-30'),
  ((SELECT id FROM bedrijven WHERE slug = 'asbestvrij-zuid-holland'),
   (SELECT id FROM certificering_types WHERE code = 'SC-540'),
   'TEST-540-001', '2027-06-30');

-- Van der Berg: SC-540
INSERT INTO bedrijf_certificeringen (bedrijf_id, certificering_type_id, certificaat_nummer, geldig_tot) VALUES
  ((SELECT id FROM bedrijven WHERE slug = 'van-der-berg-asbestinventarisatie'),
   (SELECT id FROM certificering_types WHERE code = 'SC-540'),
   'TEST-540-002', '2027-09-30');

-- Brabant Asbest: SC-530
INSERT INTO bedrijf_certificeringen (bedrijf_id, certificering_type_id, certificaat_nummer, geldig_tot) VALUES
  ((SELECT id FROM bedrijven WHERE slug = 'brabant-asbest-services'),
   (SELECT id FROM certificering_types WHERE code = 'SC-530'),
   'TEST-530-003', '2026-12-31');

-- Noord Asbest: SC-530
INSERT INTO bedrijf_certificeringen (bedrijf_id, certificering_type_id, certificaat_nummer, geldig_tot) VALUES
  ((SELECT id FROM bedrijven WHERE slug = 'noord-asbest-oplossingen'),
   (SELECT id FROM certificering_types WHERE code = 'SC-530'),
   'TEST-530-004', '2027-03-31');

-- ProAsbest: SC-530 + SC-540
INSERT INTO bedrijf_certificeringen (bedrijf_id, certificering_type_id, certificaat_nummer, geldig_tot) VALUES
  ((SELECT id FROM bedrijven WHERE slug = 'proasbest-nederland'),
   (SELECT id FROM certificering_types WHERE code = 'SC-530'),
   'TEST-530-005', '2027-12-31'),
  ((SELECT id FROM bedrijven WHERE slug = 'proasbest-nederland'),
   (SELECT id FROM certificering_types WHERE code = 'SC-540'),
   'TEST-540-003', '2027-12-31');

-- ============================================================
-- 4. Specialisaties koppelen
-- ============================================================

-- SafeClean: dak, golfplaten, particulier
INSERT INTO bedrijf_specialisaties (bedrijf_id, specialisatie_id) VALUES
  ((SELECT id FROM bedrijven WHERE slug = 'safeclean-asbestverwijdering'),
   (SELECT id FROM specialisatie_types WHERE slug = 'asbestdak-verwijderen')),
  ((SELECT id FROM bedrijven WHERE slug = 'safeclean-asbestverwijdering'),
   (SELECT id FROM specialisatie_types WHERE slug = 'asbest-golfplaten')),
  ((SELECT id FROM bedrijven WHERE slug = 'safeclean-asbestverwijdering'),
   (SELECT id FROM specialisatie_types WHERE slug = 'particulier'));

-- Asbestvrij ZH: dak, vloertegels, zakelijk, particulier
INSERT INTO bedrijf_specialisaties (bedrijf_id, specialisatie_id) VALUES
  ((SELECT id FROM bedrijven WHERE slug = 'asbestvrij-zuid-holland'),
   (SELECT id FROM specialisatie_types WHERE slug = 'asbestdak-verwijderen')),
  ((SELECT id FROM bedrijven WHERE slug = 'asbestvrij-zuid-holland'),
   (SELECT id FROM specialisatie_types WHERE slug = 'asbest-vloertegels')),
  ((SELECT id FROM bedrijven WHERE slug = 'asbestvrij-zuid-holland'),
   (SELECT id FROM specialisatie_types WHERE slug = 'zakelijk')),
  ((SELECT id FROM bedrijven WHERE slug = 'asbestvrij-zuid-holland'),
   (SELECT id FROM specialisatie_types WHERE slug = 'particulier'));

-- Van der Berg: inventarisatie type A + B, overheid
INSERT INTO bedrijf_specialisaties (bedrijf_id, specialisatie_id) VALUES
  ((SELECT id FROM bedrijven WHERE slug = 'van-der-berg-asbestinventarisatie'),
   (SELECT id FROM specialisatie_types WHERE slug = 'inventarisatie-type-a')),
  ((SELECT id FROM bedrijven WHERE slug = 'van-der-berg-asbestinventarisatie'),
   (SELECT id FROM specialisatie_types WHERE slug = 'inventarisatie-type-b')),
  ((SELECT id FROM bedrijven WHERE slug = 'van-der-berg-asbestinventarisatie'),
   (SELECT id FROM specialisatie_types WHERE slug = 'overheid-vve'));

-- Brabant Asbest: dak, isolatie, spoedopdrachten
INSERT INTO bedrijf_specialisaties (bedrijf_id, specialisatie_id) VALUES
  ((SELECT id FROM bedrijven WHERE slug = 'brabant-asbest-services'),
   (SELECT id FROM specialisatie_types WHERE slug = 'asbestdak-verwijderen')),
  ((SELECT id FROM bedrijven WHERE slug = 'brabant-asbest-services'),
   (SELECT id FROM specialisatie_types WHERE slug = 'asbest-isolatie')),
  ((SELECT id FROM bedrijven WHERE slug = 'brabant-asbest-services'),
   (SELECT id FROM specialisatie_types WHERE slug = 'spoedopdrachten'));

-- Noord Asbest: golfplaten, dakbeschot, particulier
INSERT INTO bedrijf_specialisaties (bedrijf_id, specialisatie_id) VALUES
  ((SELECT id FROM bedrijven WHERE slug = 'noord-asbest-oplossingen'),
   (SELECT id FROM specialisatie_types WHERE slug = 'asbest-golfplaten')),
  ((SELECT id FROM bedrijven WHERE slug = 'noord-asbest-oplossingen'),
   (SELECT id FROM specialisatie_types WHERE slug = 'asbest-dakbeschot')),
  ((SELECT id FROM bedrijven WHERE slug = 'noord-asbest-oplossingen'),
   (SELECT id FROM specialisatie_types WHERE slug = 'particulier'));

-- ProAsbest: alles behalve lab
INSERT INTO bedrijf_specialisaties (bedrijf_id, specialisatie_id) VALUES
  ((SELECT id FROM bedrijven WHERE slug = 'proasbest-nederland'),
   (SELECT id FROM specialisatie_types WHERE slug = 'asbestdak-verwijderen')),
  ((SELECT id FROM bedrijven WHERE slug = 'proasbest-nederland'),
   (SELECT id FROM specialisatie_types WHERE slug = 'asbest-vloertegels')),
  ((SELECT id FROM bedrijven WHERE slug = 'proasbest-nederland'),
   (SELECT id FROM specialisatie_types WHERE slug = 'asbest-isolatie')),
  ((SELECT id FROM bedrijven WHERE slug = 'proasbest-nederland'),
   (SELECT id FROM specialisatie_types WHERE slug = 'asbest-cv-leidingen')),
  ((SELECT id FROM bedrijven WHERE slug = 'proasbest-nederland'),
   (SELECT id FROM specialisatie_types WHERE slug = 'zakelijk')),
  ((SELECT id FROM bedrijven WHERE slug = 'proasbest-nederland'),
   (SELECT id FROM specialisatie_types WHERE slug = 'particulier')),
  ((SELECT id FROM bedrijven WHERE slug = 'proasbest-nederland'),
   (SELECT id FROM specialisatie_types WHERE slug = 'overheid-vve'));

-- ============================================================
-- 5. Werkgebieden koppelen
-- ============================================================

-- SafeClean: Amsterdam, Haarlem, Almere
INSERT INTO bedrijf_werkgebieden (bedrijf_id, stad_id) VALUES
  ((SELECT id FROM bedrijven WHERE slug = 'safeclean-asbestverwijdering'),
   (SELECT id FROM steden WHERE slug = 'amsterdam')),
  ((SELECT id FROM bedrijven WHERE slug = 'safeclean-asbestverwijdering'),
   (SELECT id FROM steden WHERE slug = 'haarlem')),
  ((SELECT id FROM bedrijven WHERE slug = 'safeclean-asbestverwijdering'),
   (SELECT id FROM steden WHERE slug = 'almere'));

-- Asbestvrij ZH: Rotterdam, Den Haag, Leiden, Zoetermeer
INSERT INTO bedrijf_werkgebieden (bedrijf_id, stad_id) VALUES
  ((SELECT id FROM bedrijven WHERE slug = 'asbestvrij-zuid-holland'),
   (SELECT id FROM steden WHERE slug = 'rotterdam')),
  ((SELECT id FROM bedrijven WHERE slug = 'asbestvrij-zuid-holland'),
   (SELECT id FROM steden WHERE slug = 'den-haag')),
  ((SELECT id FROM bedrijven WHERE slug = 'asbestvrij-zuid-holland'),
   (SELECT id FROM steden WHERE slug = 'leiden')),
  ((SELECT id FROM bedrijven WHERE slug = 'asbestvrij-zuid-holland'),
   (SELECT id FROM steden WHERE slug = 'zoetermeer'));

-- Van der Berg: Utrecht, Amersfoort
INSERT INTO bedrijf_werkgebieden (bedrijf_id, stad_id) VALUES
  ((SELECT id FROM bedrijven WHERE slug = 'van-der-berg-asbestinventarisatie'),
   (SELECT id FROM steden WHERE slug = 'utrecht')),
  ((SELECT id FROM bedrijven WHERE slug = 'van-der-berg-asbestinventarisatie'),
   (SELECT id FROM steden WHERE slug = 'amersfoort'));

-- Brabant Asbest: Eindhoven, Tilburg, Breda, 's-Hertogenbosch
INSERT INTO bedrijf_werkgebieden (bedrijf_id, stad_id) VALUES
  ((SELECT id FROM bedrijven WHERE slug = 'brabant-asbest-services'),
   (SELECT id FROM steden WHERE slug = 'eindhoven')),
  ((SELECT id FROM bedrijven WHERE slug = 'brabant-asbest-services'),
   (SELECT id FROM steden WHERE slug = 'tilburg')),
  ((SELECT id FROM bedrijven WHERE slug = 'brabant-asbest-services'),
   (SELECT id FROM steden WHERE slug = 'breda')),
  ((SELECT id FROM bedrijven WHERE slug = 'brabant-asbest-services'),
   (SELECT id FROM steden WHERE slug = 'den-bosch'));

-- Noord Asbest: Groningen, Zwolle
INSERT INTO bedrijf_werkgebieden (bedrijf_id, stad_id) VALUES
  ((SELECT id FROM bedrijven WHERE slug = 'noord-asbest-oplossingen'),
   (SELECT id FROM steden WHERE slug = 'groningen')),
  ((SELECT id FROM bedrijven WHERE slug = 'noord-asbest-oplossingen'),
   (SELECT id FROM steden WHERE slug = 'zwolle'));

-- ProAsbest: landelijke dekking (alle 20 steden)
INSERT INTO bedrijf_werkgebieden (bedrijf_id, stad_id)
  SELECT
    (SELECT id FROM bedrijven WHERE slug = 'proasbest-nederland'),
    id
  FROM steden;

-- ============================================================
-- 6. Test reviews
-- ============================================================

INSERT INTO reviews (bedrijf_id, reviewer_naam, reviewer_stad, rating, titel, tekst, type_opdracht, is_verified, is_published) VALUES

  ((SELECT id FROM bedrijven WHERE slug = 'safeclean-asbestverwijdering'),
   'Jan de Vries', 'Amsterdam', 5,
   'Zeer tevreden over de snelle service',
   'SafeClean heeft het asbestdak van onze schuur snel en netjes verwijderd. Goede communicatie vooraf en alles keurig opgeruimd achtergelaten. Aanrader!',
   'verwijdering', true, true),

  ((SELECT id FROM bedrijven WHERE slug = 'safeclean-asbestverwijdering'),
   'Maria Bakker', 'Haarlem', 4,
   'Goed werk, iets duurder dan verwacht',
   'De verwijdering van de golfplaten is goed verlopen. Prijs viel iets hoger uit dan de offerte, maar het werk was vakkundig gedaan.',
   'verwijdering', true, true),

  ((SELECT id FROM bedrijven WHERE slug = 'van-der-berg-asbestinventarisatie'),
   'Peter Jansen', 'Utrecht', 5,
   'Grondig en professioneel rapport',
   'Van der Berg heeft een zeer grondige inventarisatie gedaan van ons pand uit 1975. Het rapport was helder en compleet, inclusief duidelijke foto''s en advies over de vervolgstappen.',
   'inventarisatie', true, true),

  ((SELECT id FROM bedrijven WHERE slug = 'asbestvrij-zuid-holland'),
   'Karin Smit', 'Rotterdam', 4,
   'Goede prijs-kwaliteitverhouding',
   'Asbest vloertegels laten verwijderen in onze keuken. Het team was vriendelijk en heeft netjes gewerkt. Wel moesten we iets langer wachten op een datum dan verwacht.',
   'verwijdering', true, true),

  ((SELECT id FROM bedrijven WHERE slug = 'noord-asbest-oplossingen'),
   'Henk Mulder', 'Groningen', 5,
   'Persoonlijke aanpak, top!',
   'Klein bedrijf maar zeer persoonlijke service. De eigenaar kwam zelf langs voor de inspectie en alles werd duidelijk uitgelegd. Het asbestdakbeschot is vakkundig verwijderd.',
   'verwijdering', true, true);
