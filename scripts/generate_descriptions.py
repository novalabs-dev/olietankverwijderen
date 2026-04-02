"""
Generate unique descriptions for all bedrijven in Supabase.
Uses Ascert data (certificaat type) + KVK data (medewerkers, locatie)
+ website scrape data (diensten, specialisaties, USPs) for richer descriptions.
"""

import os
import json
import random
import hashlib
from pathlib import Path

# Load .env
for env_path in [
    Path("/Users/woutervanackooij/Documents/Programming/AIOS/.env"),
    Path("/Users/woutervanackooij/Documents/Programming/AckNova/asbestvergelijken/.env"),
]:
    if env_path.exists():
        for line in env_path.read_text().splitlines():
            line = line.strip()
            if not line or line.startswith("#") or "=" not in line:
                continue
            key, _, value = line.partition("=")
            os.environ.setdefault(key.strip(), value.strip().strip("\"'"))

from supabase import create_client

SUPABASE_URL = os.environ['NEXT_PUBLIC_SUPABASE_URL']
SUPABASE_KEY = os.environ['SUPABASE_SERVICE_ROLE_KEY']

# Load website scrape results
SCRAPE_FILE = Path(__file__).parent / 'website_scrape_results.json'
WEBSITE_DATA = {}
if SCRAPE_FILE.exists():
    with open(SCRAPE_FILE) as f:
        WEBSITE_DATA = json.load(f)


def get_cert_type(ascert_id):
    """Extract certificate type from Ascert ID."""
    if not ascert_id:
        return None
    parts = ascert_id.split('-')
    if len(parts) >= 2 and len(parts[1]) > 0:
        return 'C' if parts[1][0] == 'C' else 'D'
    return None


def get_size_text(aantal):
    """Convert size category to descriptive text."""
    if not aantal:
        return None
    mapping = {
        '1-5': 'een compact en persoonlijk team',
        '5-10': 'een team van ervaren vakmensen',
        '10-25': 'een middelgroot bedrijf met een stevig team',
        '25-50': 'een groot bedrijf met uitgebreide capaciteit',
        '50+': 'een van de grotere spelers in de branche',
    }
    return mapping.get(aantal)


def get_size_short(aantal):
    """Short size description."""
    if not aantal:
        return None
    mapping = {
        '1-5': 'klein maar gespecialiseerd team',
        '5-10': 'team van 5 tot 10 specialisten',
        '10-25': 'team van 10 tot 25 medewerkers',
        '25-50': 'team van 25 tot 50 medewerkers',
        '50+': 'meer dan 50 medewerkers',
    }
    return mapping.get(aantal)


def detect_specialty(naam):
    """Detect specialties from company name."""
    naam_lower = naam.lower()
    specs = []
    if 'sloop' in naam_lower:
        specs.append('sloopwerk')
    if 'bouw' in naam_lower or 'aannemer' in naam_lower:
        specs.append('bouwwerk')
    if 'milieu' in naam_lower:
        specs.append('milieutechniek')
    if 'advies' in naam_lower or 'onderzoek' in naam_lower:
        specs.append('advies en onderzoek')
    if 'grond' in naam_lower:
        specs.append('grondwerk')
    if 'isolatie' in naam_lower or 'isoleer' in naam_lower:
        specs.append('isolatiewerk')
    if 'dak' in naam_lower:
        specs.append('dakwerk')
    if 'sanering' in naam_lower or 'saner' in naam_lower:
        specs.append('sanering')
    if 'techniek' in naam_lower or 'tech' in naam_lower:
        specs.append('technische dienstverlening')
    return specs


def extract_website_info(bedrijf_id):
    """Extract useful info from website scrape data."""
    info = {'services': [], 'usps': [], 'experience': None}
    scrape_entry = WEBSITE_DATA.get(bedrijf_id)
    if not scrape_entry:
        return info

    scrape = scrape_entry.get('scrape', {})
    text = scrape.get('text', '')
    if not text:
        return info

    text_lower = text.lower()

    # Detect services from website text
    service_keywords = {
        'sloopwerk': ['sloop', 'slopen', 'totaalsloop', 'renovatiesloop'],
        'asbestsanering': ['asbestsanering', 'asbest sanering', 'asbestverwijdering', 'asbest verwijder'],
        'asbestinventarisatie': ['asbestinventarisatie', 'asbestonderzoek', 'asbest inventarisatie'],
        'bodemsanering': ['bodemsanering', 'bodem sanering', 'grondverzet'],
        'grondwerk': ['grondwerk', 'grondverzet'],
        'boor- en zaagwerk': ['betonbor', 'diamantbor', 'zaagwerk', 'boor- en zaag'],
        'renovatie': ['renovatie', 'renovatiewerk'],
        'dakwerk': ['dakwerk', 'daksanering', 'dakrenovatie'],
        'isolatiewerk': ['isolatie', 'isolatiewerk'],
        'transport': ['transport', 'kraanwerk'],
        'circulair slopen': ['circulair slopen', 'circulair', 'hergebruik'],
    }

    for service, keywords in service_keywords.items():
        if any(kw in text_lower for kw in keywords):
            info['services'].append(service)

    # Detect USPs
    usp_patterns = {
        'familiebedrijf': ['familiebedrijf', 'familie bedrijf'],
        'ISO 9001 gecertificeerd': ['iso 9001'],
        'VCA gecertificeerd': ['vca'],
        'landelijke dekking': ['heel nederland', 'geheel nederland', 'door het hele land', 'landelijk'],
        'duurzaam en circulair': ['duurzaam', 'circulair', 'co2-reductie', 'co₂'],
    }

    for usp, patterns in usp_patterns.items():
        if any(p in text_lower for p in patterns):
            info['usps'].append(usp)

    # Detect years of experience
    import re
    year_matches = re.findall(r'(?:sinds|opgericht in|al sinds|meer dan)\s*(\d{4})', text_lower)
    if year_matches:
        earliest = min(int(y) for y in year_matches)
        years = 2026 - earliest
        if 5 <= years <= 200:
            info['experience'] = years

    exp_matches = re.findall(r'(\d+)\s*jaar\s*(?:ervaring|sloopervaring|expertise)', text_lower)
    if exp_matches and not info['experience']:
        years = max(int(y) for y in exp_matches)
        if 5 <= years <= 200:
            info['experience'] = years

    return info


def seeded_choice(choices, seed_str):
    """Deterministic random choice based on seed string."""
    h = int(hashlib.md5(seed_str.encode()).hexdigest(), 16)
    return choices[h % len(choices)]


def seeded_sample(choices, k, seed_str):
    """Deterministic random sample based on seed string."""
    rng = random.Random(hashlib.md5(seed_str.encode()).hexdigest())
    return rng.sample(choices, min(k, len(choices)))


def generate_description(bedrijf):
    """Generate a unique description for a company."""
    naam = bedrijf['naam']
    stad = bedrijf.get('stad', '')
    provincie = bedrijf.get('provincie', '')
    kvk = bedrijf.get('kvk_nummer')
    aantal = bedrijf.get('aantal_medewerkers')
    ascert_id = bedrijf.get('ascert_id', '')
    bedrijf_id = bedrijf.get('id', '')

    cert_type = get_cert_type(ascert_id)
    is_verwijdering = cert_type == 'C'
    is_inventarisatie = cert_type == 'D'

    size_text = get_size_text(aantal)
    specialties = detect_specialty(naam)
    has_kvk = kvk is not None and kvk != ''

    # Get website enrichment data
    web_info = extract_website_info(bedrijf_id)

    # Merge website services into specialties (deduplicate)
    for svc in web_info['services']:
        # Skip services that match the main cert type
        if is_verwijdering and svc in ('asbestsanering', 'asbestverwijdering'):
            continue
        if is_inventarisatie and svc == 'asbestinventarisatie':
            continue
        if svc not in specialties:
            specialties.append(svc)

    seed = naam  # Use company name as seed for deterministic variation

    # Determine cert label
    if is_verwijdering:
        cert_label = 'SC-530'
        cert_desc = 'asbestverwijdering'
        cert_activity = 'het verwijderen van asbesthoudende materialen'
    elif is_inventarisatie:
        cert_label = 'SC-540'
        cert_desc = 'asbestinventarisatie'
        cert_activity = 'het inventariseren van asbesthoudende materialen'
    else:
        cert_label = 'SC-530/SC-540'
        cert_desc = 'asbestverwijdering en -inventarisatie'
        cert_activity = 'asbestwerkzaamheden'

    # Build description parts
    parts = []

    # === OPENING (varied) ===
    if is_verwijdering:
        openings = [
            f"{naam} is een gecertificeerd asbestverwijderingsbedrijf in {stad}.",
            f"Gevestigd in {stad}, {provincie}, richt {naam} zich op professionele asbestverwijdering.",
            f"In {stad} vindt u {naam}, specialist in het veilig verwijderen van asbest.",
            f"{naam} uit {stad} is gespecialiseerd in de verwijdering van asbesthoudende materialen.",
            f"Voor asbestverwijdering in {stad} en omgeving is {naam} een betrouwbare keuze.",
            f"Vanuit {stad} verzorgt {naam} asbestsaneringen door heel {provincie}.",
            f"{naam}, actief vanuit {stad}, staat bekend om vakkundige asbestverwijdering.",
        ]
    else:
        openings = [
            f"{naam} is een gecertificeerd asbestinventarisatiebureau in {stad}.",
            f"Gevestigd in {stad}, {provincie}, voert {naam} professionele asbestonderzoeken uit.",
            f"In {stad} vindt u {naam}, specialist in asbestinventarisaties.",
            f"{naam} uit {stad} is gespecialiseerd in het opsporen van asbesthoudende materialen.",
            f"Voor een gedegen asbestonderzoek in {stad} kunt u terecht bij {naam}.",
            f"Vanuit {stad} voert {naam} asbestinventarisaties uit in de regio {provincie}.",
            f"{naam}, actief vanuit {stad}, brengt asbest in gebouwen deskundig in kaart.",
        ]

    parts.append(seeded_choice(openings, seed + 'opening'))

    # === CERTIFICATION (varied) ===
    cert_lines = [
        f"Het bedrijf beschikt over een {cert_label} certificering, de wettelijk vereiste erkenning voor {cert_activity}.",
        f"Met een {cert_label} procescertificaat voldoet het bedrijf aan alle eisen voor {cert_activity}.",
        f"De {cert_label} certificering garandeert dat alle werkzaamheden voldoen aan de strenge Nederlandse normen.",
        f"Dankzij de {cert_label} certificering is {naam} bevoegd voor {cert_activity} volgens de geldende regelgeving.",
    ]
    parts.append(seeded_choice(cert_lines, seed + 'cert'))

    # === SIZE / KVK INFO ===
    if size_text and has_kvk:
        size_lines = [
            f"Met {get_size_short(aantal)} heeft het bedrijf voldoende capaciteit voor zowel kleine als grotere projecten.",
            f"Het bedrijf telt {get_size_short(aantal)}, wat zorgt voor een goede balans tussen persoonlijke aandacht en slagkracht.",
            f"Als {size_text} kan {naam} projecten van uiteenlopende omvang aan.",
        ]
        parts.append(seeded_choice(size_lines, seed + 'size'))
    elif size_text:
        parts.append(f"Als {size_text} biedt {naam} persoonlijke service bij elk project.")

    # === SPECIALTIES ===
    if specialties:
        if len(specialties) == 1:
            spec_lines = [
                f"Naast {cert_desc} heeft het bedrijf ervaring met {specialties[0]}.",
                f"De expertise strekt zich ook uit tot {specialties[0]}, wat het dienstenaanbod versterkt.",
            ]
        else:
            spec_joined = ', '.join(specialties[:-1]) + f' en {specialties[-1]}'
            spec_lines = [
                f"Het bedrijf combineert {cert_desc} met expertise in {spec_joined}.",
                f"Naast {cert_desc} is er ruime ervaring met {spec_joined}.",
            ]
        parts.append(seeded_choice(spec_lines, seed + 'spec'))

    # === WERKWIJZE (varied) ===
    if is_verwijdering:
        werkwijze_lines = [
            "Elk project begint met een inventarisatie van de situatie, gevolgd door een veilige verwijdering volgens het werkplan.",
            "De werkzaamheden worden uitgevoerd door opgeleide vakmensen met DTA- en DAV-certificaten.",
            "Veiligheid staat voorop: alle saneringen worden uitgevoerd conform het Arbobesluit en de bijbehorende regelgeving.",
            "Van particuliere woningen tot bedrijfspanden, het team behandelt elk asbestproject met dezelfde zorgvuldigheid.",
            "Het saneringsproces verloopt stapsgewijs: inspectie, afzetting, verwijdering, meting en vrijgave.",
        ]
    else:
        werkwijze_lines = [
            "De inventarisatie omvat zowel visuele inspectie als materiaalanalyse door een geaccrediteerd laboratorium.",
            "Elk onderzoek resulteert in een officieel asbestinventarisatierapport dat voldoet aan de NEN 2991 norm.",
            "Het team werkt met gecertificeerde inspecteurs die asbest herkennen in alle mogelijke toepassingen.",
            "Van particuliere woningen tot utiliteitsgebouwen, elk object wordt grondig onderzocht op de aanwezigheid van asbest.",
            "De rapportages bevatten een duidelijk overzicht van aangetroffen materialen, risicoklasse en saneringsadvies.",
        ]

    parts.append(seeded_choice(werkwijze_lines, seed + 'werkwijze'))

    # === EXPERIENCE (from website) ===
    if web_info['experience']:
        years = web_info['experience']
        exp_lines = [
            f"Met meer dan {years} jaar ervaring heeft het bedrijf een stevige reputatie opgebouwd in de sector.",
            f"Het bedrijf is al meer dan {years} jaar actief en beschikt over uitgebreide praktijkervaring.",
            f"Dankzij ruim {years} jaar ervaring kent het team alle aspecten van het vak.",
        ]
        parts.append(seeded_choice(exp_lines, seed + 'experience'))

    # === USPs (from website) ===
    usps = web_info['usps']
    if usps:
        # Pick max 2 USPs
        selected_usps = seeded_sample(usps, 2, seed + 'usps')
        if len(selected_usps) == 1:
            usp_lines = [
                f"Een belangrijk kenmerk is dat het bedrijf {selected_usps[0].lower()} is.",
                f"Daarnaast is het bedrijf {selected_usps[0].lower()}, wat bijdraagt aan de betrouwbaarheid.",
            ]
        else:
            usp_lines = [
                f"Het bedrijf onderscheidt zich als {selected_usps[0].lower()} en is {selected_usps[1].lower()}.",
                f"Bijzonder is dat het bedrijf {selected_usps[0].lower()} is en daarnaast {selected_usps[1].lower()}.",
            ]
        parts.append(seeded_choice(usp_lines, seed + 'usp'))

    # === CLOSING (varied, location-based) ===
    closings = [
        f"Het werkgebied omvat {stad} en de wijdere regio {provincie}.",
        f"Opdrachtgevers in {stad} en omstreken kunnen rekenen op een professionele aanpak en heldere communicatie.",
        f"Neem contact op voor een vrijblijvende offerte voor uw asbestproject in de regio {stad}.",
        f"Het bedrijf is actief in heel {provincie} en staat klaar voor zowel particuliere als zakelijke opdrachten.",
        f"Voor een betrouwbare partner voor uw asbestproject in {stad} of omgeving is {naam} het aangewezen adres.",
    ]
    parts.append(seeded_choice(closings, seed + 'closing'))

    return ' '.join(parts)


def generate_short_description(bedrijf):
    """Generate a short description (1-2 sentences)."""
    naam = bedrijf['naam']
    stad = bedrijf.get('stad', '')
    ascert_id = bedrijf.get('ascert_id', '')
    cert_type = get_cert_type(ascert_id)
    aantal = bedrijf.get('aantal_medewerkers')

    seed = naam

    if cert_type == 'C':
        shorts = [
            f"Gecertificeerd asbestverwijderingsbedrijf (SC-530) in {stad}. Veilige en professionele asbestsanering.",
            f"SC-530 gecertificeerd voor asbestverwijdering in {stad}. Ervaren team, veilige werkwijze.",
            f"Asbestverwijdering in {stad} door {naam}. SC-530 gecertificeerd en volledig conform de wet.",
            f"Professionele asbestsanering in {stad}. {naam} is SC-530 gecertificeerd.",
        ]
    else:
        shorts = [
            f"Gecertificeerd asbestinventarisatiebureau (SC-540) in {stad}. Gedegen onderzoek en rapportage.",
            f"SC-540 gecertificeerd voor asbestinventarisatie in {stad}. Officieel erkend onderzoeksbureau.",
            f"Asbestonderzoek in {stad} door {naam}. SC-540 gecertificeerd en NEN 2991 conform.",
            f"Professioneel asbestonderzoek in {stad}. {naam} is SC-540 gecertificeerd.",
        ]

    short = seeded_choice(shorts, seed + 'short')

    # Add size info to some
    if aantal and seeded_choice([True, False], seed + 'addsize'):
        size_add = {
            '1-5': ' Persoonlijke aanpak door een compact team.',
            '5-10': ' Ervaren team van specialisten.',
            '10-25': ' Middelgroot bedrijf met ruime capaciteit.',
            '25-50': ' Groot team voor projecten van elke omvang.',
            '50+': ' Een van de grotere spelers in de sector.',
        }
        extra = size_add.get(aantal, '')
        short += extra

    return short


def main():
    client = create_client(SUPABASE_URL, SUPABASE_KEY)

    # Fetch all bedrijven (paginated - Supabase default limit is 1000)
    all_bedrijven = []
    offset = 0
    page_size = 500
    while True:
        result = client.table('bedrijven').select('*').range(offset, offset + page_size - 1).execute()
        all_bedrijven.extend(result.data)
        if len(result.data) < page_size:
            break
        offset += page_size

    bedrijven = all_bedrijven
    print(f"Fetched {len(bedrijven)} bedrijven")
    print(f"Website scrape data available for {len(WEBSITE_DATA)} bedrijven")

    # Track enrichment stats
    stats = {
        'total': len(bedrijven),
        'with_kvk': 0,
        'with_website_enrichment': 0,
        'with_experience': 0,
        'with_usps': 0,
        'with_extra_services': 0,
    }

    # Generate descriptions
    updates = []
    for b in bedrijven:
        if b.get('kvk_nummer'):
            stats['with_kvk'] += 1

        web_info = extract_website_info(b.get('id', ''))
        if web_info['services'] or web_info['usps'] or web_info['experience']:
            stats['with_website_enrichment'] += 1
        if web_info['experience']:
            stats['with_experience'] += 1
        if web_info['usps']:
            stats['with_usps'] += 1
        if web_info['services']:
            stats['with_extra_services'] += 1

        beschrijving = generate_description(b)
        korte = generate_short_description(b)
        updates.append({
            'id': b['id'],
            'naam': b['naam'],
            'beschrijving': beschrijving,
            'korte_beschrijving': korte,
        })

    # Preview a few
    print("\n=== PREVIEW ===")
    preview_indices = [0, 50, 100, 150, 200, 300]
    for i in preview_indices:
        if i < len(updates):
            u = updates[i]
            print(f"\n--- {u['naam']} ---")
            print(f"Beschrijving ({len(u['beschrijving'])} chars):")
            print(u['beschrijving'])
            print(f"\nKort: {u['korte_beschrijving']}")

    # Check for duplicates
    descs = [u['beschrijving'] for u in updates]
    unique_descs = set(descs)
    print(f"\n=== STATS ===")
    print(f"Total bedrijven: {stats['total']}")
    print(f"With KVK data: {stats['with_kvk']}")
    print(f"With website enrichment: {stats['with_website_enrichment']}")
    print(f"  - Extra services from website: {stats['with_extra_services']}")
    print(f"  - Experience years: {stats['with_experience']}")
    print(f"  - USPs: {stats['with_usps']}")
    print(f"Unique descriptions: {len(unique_descs)}")
    if len(descs) != len(unique_descs):
        print("WARNING: Some descriptions are duplicated!")
        from collections import Counter
        counts = Counter(descs)
        for desc, count in counts.most_common(5):
            if count > 1:
                names = [u['naam'] for u in updates if u['beschrijving'] == desc]
                print(f"  {count}x: {names[:3]}")

    # Update Supabase
    print(f"\nUpdating {len(updates)} bedrijven in Supabase...")
    success = 0
    errors = 0
    for u in updates:
        try:
            client.table('bedrijven').update({
                'beschrijving': u['beschrijving'],
                'korte_beschrijving': u['korte_beschrijving'],
            }).eq('id', u['id']).execute()
            success += 1
        except Exception as e:
            print(f"Error updating {u['naam']}: {e}")
            errors += 1

    print(f"\nDone! Updated: {success}, Errors: {errors}")

    # Return stats for Telegram summary
    stats['updated'] = success
    stats['errors'] = errors
    stats['unique_descriptions'] = len(unique_descs)
    return stats


if __name__ == '__main__':
    main()
