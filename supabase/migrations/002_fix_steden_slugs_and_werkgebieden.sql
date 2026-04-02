-- ============================================================
-- 002: Fix steden slugs and auto-populate werkgebieden
-- ============================================================
-- Fixes slug mismatches between steden table and frontend code.
-- Adds missing cities for province coverage.
-- Auto-populates bedrijf_werkgebieden based on bedrijven.stad field.
-- ============================================================

-- 1. Fix slug mismatches
UPDATE steden SET slug = 'groningen' WHERE slug = 'groningen-stad';
UPDATE steden SET slug = 'den-bosch' WHERE slug = 's-hertogenbosch';

-- 2. Add missing cities (only if they don't exist yet)
INSERT INTO steden (naam, slug, provincie_id, postcode_range, latitude, longitude, inwoners, heeft_landing_page)
SELECT 'Zaanstad', 'zaanstad', p.id, '1500-1599', 52.45000000, 4.82639000, 157000, true
FROM provincies p WHERE p.slug = 'noord-holland'
AND NOT EXISTS (SELECT 1 FROM steden WHERE slug = 'zaanstad');

INSERT INTO steden (naam, slug, provincie_id, postcode_range, latitude, longitude, inwoners, heeft_landing_page)
SELECT 'Haarlemmermeer', 'haarlemmermeer', p.id, '2130-2159', 52.30278000, 4.69722000, 157000, true
FROM provincies p WHERE p.slug = 'noord-holland'
AND NOT EXISTS (SELECT 1 FROM steden WHERE slug = 'haarlemmermeer');

INSERT INTO steden (naam, slug, provincie_id, postcode_range, latitude, longitude, inwoners, heeft_landing_page)
SELECT 'Dordrecht', 'dordrecht', p.id, '3300-3399', 51.81000000, 4.67361000, 119000, true
FROM provincies p WHERE p.slug = 'zuid-holland'
AND NOT EXISTS (SELECT 1 FROM steden WHERE slug = 'dordrecht');

INSERT INTO steden (naam, slug, provincie_id, postcode_range, latitude, longitude, inwoners, heeft_landing_page)
SELECT 'Leeuwarden', 'leeuwarden', p.id, '8900-8999', 53.20139000, 5.79917000, 124000, true
FROM provincies p WHERE p.slug = 'friesland'
AND NOT EXISTS (SELECT 1 FROM steden WHERE slug = 'leeuwarden');

INSERT INTO steden (naam, slug, provincie_id, postcode_range, latitude, longitude, inwoners, heeft_landing_page)
SELECT 'Middelburg', 'middelburg', p.id, '4330-4339', 51.50000000, 3.61389000, 49000, true
FROM provincies p WHERE p.slug = 'zeeland'
AND NOT EXISTS (SELECT 1 FROM steden WHERE slug = 'middelburg');

INSERT INTO steden (naam, slug, provincie_id, postcode_range, latitude, longitude, inwoners, heeft_landing_page)
SELECT 'Emmen', 'emmen', p.id, '7800-7899', 52.78611000, 6.89722000, 107000, true
FROM provincies p WHERE p.slug = 'drenthe'
AND NOT EXISTS (SELECT 1 FROM steden WHERE slug = 'emmen');

-- 3. Auto-populate werkgebieden from bedrijven.stad field
-- Links each published bedrijf to the stad matching its registered address.
-- Uses case-insensitive matching and skips duplicates.
INSERT INTO bedrijf_werkgebieden (bedrijf_id, stad_id)
SELECT b.id, s.id
FROM bedrijven b
JOIN steden s ON LOWER(b.stad) = LOWER(s.naam)
WHERE b.is_published = true
ON CONFLICT (bedrijf_id, stad_id) DO NOTHING;
