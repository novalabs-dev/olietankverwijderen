#!/usr/bin/env python3
"""
Enrich company descriptions by scraping their websites and using Claude AI
to generate better, more specific descriptions.

Targets the 101 companies that have a website URL in the database.
Uses Anthropic Claude API (Haiku for cost efficiency).

Usage:
  python scripts/enrich-from-websites.py              # run enrichment
  python scripts/enrich-from-websites.py --dry-run     # preview without saving
  python scripts/enrich-from-websites.py --limit 5     # process only 5 companies
"""

import os
import sys
import json
import time
import re
import argparse
from pathlib import Path
from urllib.parse import urlparse

# Load .env from AIOS root for API keys
aios_env = Path(__file__).resolve().parents[2] / ".." / "AIOS" / ".env"
# Also check the direct AIOS path
for env_path in [
    Path("/Users/woutervanackooij/Documents/Programming/AIOS/.env"),
    Path(__file__).resolve().parent.parent / ".env.local",
]:
    if env_path.exists():
        for line in env_path.read_text().splitlines():
            line = line.strip()
            if not line or line.startswith("#"):
                continue
            if "=" not in line:
                continue
            key, _, value = line.partition("=")
            key = key.strip()
            value = value.strip().strip("\"'")
            if key not in os.environ:
                os.environ[key] = value

# Verify required env vars
SUPABASE_URL = os.environ.get("NEXT_PUBLIC_SUPABASE_URL")
SUPABASE_KEY = os.environ.get("SUPABASE_SERVICE_ROLE_KEY")
ANTHROPIC_KEY = os.environ.get("ANTHROPIC_API_KEY")

if not all([SUPABASE_URL, SUPABASE_KEY, ANTHROPIC_KEY]):
    missing = []
    if not SUPABASE_URL: missing.append("NEXT_PUBLIC_SUPABASE_URL")
    if not SUPABASE_KEY: missing.append("SUPABASE_SERVICE_ROLE_KEY")
    if not ANTHROPIC_KEY: missing.append("ANTHROPIC_API_KEY")
    print(f"Missing env vars: {', '.join(missing)}")
    sys.exit(1)

try:
    import httpx
except ImportError:
    print("Installing httpx...")
    os.system(f"{sys.executable} -m pip install httpx -q")
    import httpx

try:
    from bs4 import BeautifulSoup
except ImportError:
    print("Installing beautifulsoup4...")
    os.system(f"{sys.executable} -m pip install beautifulsoup4 -q")
    from bs4 import BeautifulSoup


def fetch_companies(all_companies=False):
    """Fetch companies from Supabase. If all_companies=True, fetch all (not just with website)."""
    headers = {
        "apikey": SUPABASE_KEY,
        "Authorization": f"Bearer {SUPABASE_KEY}",
    }
    # Fetch companies including certs and specializations
    url = (
        f"{SUPABASE_URL}/rest/v1/bedrijven"
        f"?select=id,naam,slug,stad,provincie,website,aantal_medewerkers,"
        f"bedrijf_certificeringen(certificaat_nummer,geldig_tot,certificering_types(code,naam)),"
        f"bedrijf_specialisaties(specialisatie_types(naam,slug))"
        f"&order=naam"
    )
    if not all_companies:
        url += "&website=not.is.null"
    with httpx.Client(timeout=30) as client:
        resp = client.get(url, headers=headers)
        resp.raise_for_status()
        return resp.json()


def scrape_website(url: str) -> str | None:
    """Scrape a website and extract relevant text content."""
    # Normalize URL
    if not url.startswith("http"):
        url = "https://" + url

    try:
        with httpx.Client(timeout=15, follow_redirects=True, verify=False) as client:
            resp = client.get(url, headers={
                "User-Agent": "Mozilla/5.0 (compatible; AsbestVergelijken/1.0; +https://asbestvergelijken.nl)"
            })
            if resp.status_code != 200:
                return None

            soup = BeautifulSoup(resp.text, "html.parser")

            # Remove scripts, styles, nav, footer
            for tag in soup.find_all(["script", "style", "nav", "footer", "header", "iframe"]):
                tag.decompose()

            # Get text
            text = soup.get_text(separator="\n", strip=True)

            # Clean up excessive whitespace
            lines = [line.strip() for line in text.splitlines() if line.strip()]
            text = "\n".join(lines)

            # Limit to ~3000 chars to keep Claude context manageable
            if len(text) > 3000:
                text = text[:3000] + "..."

            return text if len(text) > 50 else None

    except Exception as e:
        print(f"  Scrape error for {url}: {e}")
        return None


def generate_description(company: dict, website_text: str | None) -> dict | None:
    """Use Claude to generate a description based on company data + website text."""
    certs = [c["certificering_types"]["code"] for c in company.get("bedrijf_certificeringen", []) if c.get("certificering_types")]
    specs = [s["specialisatie_types"]["naam"] for s in company.get("bedrijf_specialisaties", []) if s.get("specialisatie_types")]

    cert_str = ", ".join(certs) if certs else "onbekend"
    spec_str = ", ".join(specs) if specs else "geen specifieke specialisaties"
    stad = company.get("stad") or "onbekend"
    medewerkers = company.get("aantal_medewerkers") or "onbekend"

    website_section = ""
    if website_text:
        website_section = f"""

WEBSITE INFORMATIE (van {company['website']}):
{website_text}
"""

    prompt = f"""Je schrijft een bedrijfsprofiel voor een vergelijkingssite over asbestbedrijven. Het profiel moet lezen alsof een redacteur het heeft geschreven na een kort telefoongesprek met het bedrijf.

GEGEVENS:
- Naam: {company['naam']}
- Stad: {stad}, {company.get('provincie') or 'onbekend'}
- Certificeringen: {cert_str} (SC-530 = verwijdering, SC-540 = inventarisatie, SC-560 = lab)
- Specialisaties: {spec_str}
- Teamgrootte: {medewerkers}
{website_section}

SCHRIJFREGELS:
- 3-5 zinnen, derde persoon
- Begin NIET met "[Bedrijfsnaam] is een gecertificeerd..." - dat is te voorspelbaar. Wissel af: begin met de locatie, het werkgebied, een opvallend feit, of wat het bedrijf onderscheidt
- Vermijd deze AI-cliches: "staat bekend om", "professionele aanpak", "heldere communicatie", "met oog voor detail", "biedt een breed scala aan", "deskundig in kaart brengen", "ruime ervaring", "persoonlijke aanpak", "betrouwbare partner"
- Schrijf zoals een mens zou doen: korte zinnen afgewisseld met langere. Soms een bijzin, soms niet. Niet elke zin hoeft perfect parallel opgebouwd te zijn
- Noem certificeringen terloops, niet als het hoogtepunt van de tekst. Iedereen op deze site heeft certificeringen
- Als je website-info hebt: gebruik concrete details (oprichtingsjaar, specifieke diensten, werkgebied, bijzondere projecten). Dat maakt het verschil
- Als je GEEN website-info hebt: houd het kort (2-3 zinnen). Liever kort en eerlijk dan lang en vaag
- Geen emdashes (--)
- korte_beschrijving: max 160 tekens, pakkend en specifiek. Niet "Gecertificeerd bedrijf in [stad]" maar iets dat dit bedrijf onderscheidt

JSON:
{{"beschrijving": "...", "korte_beschrijving": "..."}}"""

    try:
        with httpx.Client(timeout=30) as client:
            resp = client.post(
                "https://api.anthropic.com/v1/messages",
                headers={
                    "x-api-key": ANTHROPIC_KEY,
                    "anthropic-version": "2023-06-01",
                    "content-type": "application/json",
                },
                json={
                    "model": "claude-haiku-4-5-20251001",
                    "max_tokens": 500,
                    "messages": [{"role": "user", "content": prompt}],
                },
            )
            resp.raise_for_status()
            result = resp.json()
            text = result["content"][0]["text"]

            # Extract JSON from response
            json_match = re.search(r'\{[^{}]*"beschrijving"[^{}]*\}', text, re.DOTALL)
            if json_match:
                parsed = json.loads(json_match.group())
                # Enforce korte_beschrijving limit
                if len(parsed.get("korte_beschrijving", "")) > 160:
                    parsed["korte_beschrijving"] = parsed["korte_beschrijving"][:157] + "..."
                return parsed

            return None

    except Exception as e:
        print(f"  Claude API error for {company['naam']}: {e}")
        return None


def update_company(company_id: str, beschrijving: str, korte_beschrijving: str):
    """Update company description in Supabase."""
    headers = {
        "apikey": SUPABASE_KEY,
        "Authorization": f"Bearer {SUPABASE_KEY}",
        "Content-Type": "application/json",
        "Prefer": "return=minimal",
    }
    url = f"{SUPABASE_URL}/rest/v1/bedrijven?id=eq.{company_id}"
    with httpx.Client(timeout=15) as client:
        resp = client.patch(url, headers=headers, json={
            "beschrijving": beschrijving,
            "korte_beschrijving": korte_beschrijving,
            "updated_at": time.strftime("%Y-%m-%dT%H:%M:%S+00:00"),
        })
        resp.raise_for_status()


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--dry-run", action="store_true")
    parser.add_argument("--limit", type=int, default=0)
    parser.add_argument("--all", action="store_true", help="Process all companies, not just those with websites")
    args = parser.parse_args()

    print("=== AI DESCRIPTION GENERATOR ===")
    print(f"Mode: {'DRY RUN' if args.dry_run else 'LIVE'}")
    print(f"Scope: {'ALL companies' if args.all else 'Companies with websites only'}")
    print()

    companies = fetch_companies(all_companies=args.all)
    print(f"Found {len(companies)} companies")

    if args.limit:
        companies = companies[:args.limit]
        print(f"Limited to {args.limit} companies")

    stats = {"total": len(companies), "scraped": 0, "generated": 0, "updated": 0, "errors": 0}

    for i, company in enumerate(companies):
        naam = company["naam"]
        website = company["website"]
        print(f"\n[{i+1}/{len(companies)}] {naam} ({website})")

        # Step 1: Scrape website (if available)
        website_text = scrape_website(website) if website else None
        if website_text:
            stats["scraped"] += 1
            print(f"  Scraped: {len(website_text)} chars")
        else:
            print(f"  No website content (will use DB data only)")

        # Step 2: Generate description with Claude
        result = generate_description(company, website_text)
        if not result:
            print(f"  ERROR: Failed to generate description")
            stats["errors"] += 1
            continue

        stats["generated"] += 1
        print(f"  Beschrijving: {result['beschrijving'][:100]}...")
        print(f"  Kort: {result['korte_beschrijving']}")

        # Step 3: Update in Supabase
        if not args.dry_run:
            try:
                update_company(company["id"], result["beschrijving"], result["korte_beschrijving"])
                stats["updated"] += 1
                print(f"  Updated in database")
            except Exception as e:
                print(f"  ERROR updating: {e}")
                stats["errors"] += 1
        else:
            stats["updated"] += 1

        # Rate limit: be nice to websites and Claude API
        time.sleep(1)

    print("\n=== RESULTS ===")
    print(f"Total companies: {stats['total']}")
    print(f"Websites scraped: {stats['scraped']}")
    print(f"Descriptions generated: {stats['generated']}")
    print(f"{'Would update' if args.dry_run else 'Updated'}: {stats['updated']}")
    print(f"Errors: {stats['errors']}")


if __name__ == "__main__":
    main()
