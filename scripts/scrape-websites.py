#!/usr/bin/env python3
"""
Step 4: Scrape website content for all companies with a website URL.
Saves scraped text to JSON so step 5 can use it for description generation.
"""

import os
import sys
import json
import time
from pathlib import Path
from datetime import datetime

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

SUPABASE_URL = os.environ["NEXT_PUBLIC_SUPABASE_URL"]
SUPABASE_KEY = os.environ["SUPABASE_SERVICE_ROLE_KEY"]

try:
    import httpx
except ImportError:
    os.system(f"{sys.executable} -m pip install httpx -q")
    import httpx

try:
    from bs4 import BeautifulSoup
except ImportError:
    os.system(f"{sys.executable} -m pip install beautifulsoup4 -q")
    from bs4 import BeautifulSoup


def fetch_companies():
    """Fetch all companies with a website URL."""
    headers = {
        "apikey": SUPABASE_KEY,
        "Authorization": f"Bearer {SUPABASE_KEY}",
    }
    all_companies = []
    offset = 0
    batch_size = 500
    while True:
        url = (
            f"{SUPABASE_URL}/rest/v1/bedrijven"
            f"?select=id,naam,slug,stad,provincie,website,aantal_medewerkers,"
            f"bedrijf_certificeringen(certificaat_nummer,geldig_tot,certificering_types(code,naam)),"
            f"bedrijf_specialisaties(specialisatie_types(naam,slug))"
            f"&website=not.is.null"
            f"&order=naam"
            f"&offset={offset}&limit={batch_size}"
        )
        with httpx.Client(timeout=30) as client:
            resp = client.get(url, headers=headers)
            resp.raise_for_status()
            batch = resp.json()
        if not batch:
            break
        all_companies.extend(batch)
        if len(batch) < batch_size:
            break
        offset += batch_size
    return all_companies


def scrape_website(url: str) -> dict:
    """Scrape a website and extract text content + metadata."""
    if not url.startswith("http"):
        url = "https://" + url

    result = {"url": url, "text": None, "title": None, "meta_description": None, "error": None}

    try:
        with httpx.Client(timeout=15, follow_redirects=True, verify=False) as client:
            resp = client.get(url, headers={
                "User-Agent": "Mozilla/5.0 (compatible; AsbestVergelijken/1.0; +https://asbestvergelijken.nl)"
            })
            if resp.status_code != 200:
                result["error"] = f"HTTP {resp.status_code}"
                return result

            soup = BeautifulSoup(resp.text, "html.parser")

            # Title
            title_tag = soup.find("title")
            result["title"] = title_tag.get_text(strip=True) if title_tag else None

            # Meta description
            meta = soup.find("meta", attrs={"name": "description"})
            result["meta_description"] = meta.get("content", "").strip() if meta else None

            # Remove non-content elements
            for tag in soup.find_all(["script", "style", "nav", "footer", "header", "iframe", "noscript"]):
                tag.decompose()

            # Extract text
            text = soup.get_text(separator="\n", strip=True)
            lines = [line.strip() for line in text.splitlines() if line.strip()]
            text = "\n".join(lines)

            # Limit to ~4000 chars
            if len(text) > 4000:
                text = text[:4000]

            result["text"] = text if len(text) > 50 else None

    except Exception as e:
        result["error"] = str(e)[:200]

    return result


def main():
    print("=== WEBSITE SCRAPER (Step 4) ===")
    print(f"Started: {datetime.now().isoformat()}")

    companies = fetch_companies()
    print(f"Found {len(companies)} companies with website URLs")

    output = {}
    stats = {"total": len(companies), "scraped": 0, "failed": 0, "no_content": 0}

    for i, company in enumerate(companies):
        naam = company["naam"]
        website = company.get("website", "")
        if not website or not website.strip():
            continue

        print(f"[{i+1}/{len(companies)}] {naam} ({website})", end=" ")

        scrape_result = scrape_website(website)

        if scrape_result["error"]:
            print(f"ERROR: {scrape_result['error']}")
            stats["failed"] += 1
        elif scrape_result["text"]:
            print(f"OK ({len(scrape_result['text'])} chars)")
            stats["scraped"] += 1
        else:
            print("no useful content")
            stats["no_content"] += 1

        # Store result keyed by company ID
        output[company["id"]] = {
            "naam": naam,
            "website": website,
            "stad": company.get("stad"),
            "provincie": company.get("provincie"),
            "aantal_medewerkers": company.get("aantal_medewerkers"),
            "certificeringen": [
                c["certificering_types"]["code"]
                for c in company.get("bedrijf_certificeringen", [])
                if c.get("certificering_types")
            ],
            "specialisaties": [
                s["specialisatie_types"]["naam"]
                for s in company.get("bedrijf_specialisaties", [])
                if s.get("specialisatie_types")
            ],
            "scrape": scrape_result,
        }

        # Rate limit
        time.sleep(0.5)

    # Save results
    output_path = Path(__file__).parent / "website_scrape_results.json"
    with open(output_path, "w") as f:
        json.dump(output, f, indent=2, ensure_ascii=False)

    print(f"\n=== RESULTS ===")
    print(f"Total: {stats['total']}")
    print(f"Scraped successfully: {stats['scraped']}")
    print(f"Failed: {stats['failed']}")
    print(f"No useful content: {stats['no_content']}")
    print(f"Results saved to: {output_path}")

    # Return stats for caller
    return stats


if __name__ == "__main__":
    stats = main()
