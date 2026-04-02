#!/usr/bin/env python3
"""
Ascert Certificate Register Scraper
====================================
Scrapes the Ascert certificate register (https://www.ascert.nl/zoek-een-certificaat)
for certified asbestos removal (SC-530) and asbestos inventory (SC-540) companies.

Usage:
    python scrape_ascert.py                           # Full scrape, postcode mode (default, complete coverage)
    python scrape_ascert.py --search-mode city         # Legacy mode: search by gemeente names
    python scrape_ascert.py --city Amsterdam           # Single city (for testing)
    python scrape_ascert.py --resume                   # Resume from last checkpoint
    python scrape_ascert.py --detail-only              # Only fetch details for known certificates

Search modes:
    postcode (default): Iterates all 4-digit Dutch postcodes (1000-9999).
        Complete coverage — no companies missed regardless of place name vs gemeente name.
        Takes ~2.5 hours. Best for monthly syncs (overnight).
    city: Searches by gemeente/city names (358 entries). Faster (~15 min) but may miss
        companies in small villages where the plaatsnaam differs from the gemeentenaam.

Output:
    data/ascert_raw.json      - Raw scraped data (backup)
    data/ascert_clean.csv     - Cleaned data for review

Source: Ascert (https://www.ascert.nl) - Data used with source attribution.
"""

import argparse
import csv
import json
import logging
import os
import re
import sys
import time
from datetime import datetime
from pathlib import Path
from urllib.parse import urlencode

import requests
from bs4 import BeautifulSoup

from cities import DUTCH_CITIES

# ---------------------------------------------------------------------------
# Configuration
# ---------------------------------------------------------------------------

BASE_URL = "https://www.ascert.nl/zoek-een-certificaat"
REQUEST_DELAY = 2.5  # seconds between requests (be respectful)
MAX_RETRIES = 3
RETRY_DELAY = 10  # seconds before retry after failure
REQUEST_TIMEOUT = 30  # seconds

HEADERS = {
    "User-Agent": "AsbestvergelijkenBot/1.0 (+https://asbestvergelijken.nl; data-acquisitie)",
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
    "Accept-Language": "nl-NL,nl;q=0.9,en;q=0.5",
}

DATA_DIR = Path(__file__).parent / "data"
RAW_JSON_PATH = DATA_DIR / "ascert_raw.json"
CLEAN_CSV_PATH = DATA_DIR / "ascert_clean.csv"
CHECKPOINT_PATH = DATA_DIR / "checkpoint.json"

# ---------------------------------------------------------------------------
# Logging
# ---------------------------------------------------------------------------

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(message)s",
    handlers=[
        logging.StreamHandler(sys.stdout),
        logging.FileHandler(DATA_DIR / "scraper.log", encoding="utf-8"),
    ],
)
logger = logging.getLogger(__name__)

# ---------------------------------------------------------------------------
# HTTP helpers
# ---------------------------------------------------------------------------

session = requests.Session()
session.headers.update(HEADERS)


FAST_REQUEST_DELAY = 1.0  # shorter delay for high-volume postcode searches


def fetch_page(url: str, params: dict | None = None, fast: bool = False) -> BeautifulSoup | None:
    """Fetch a page with retries and delay."""
    delay = FAST_REQUEST_DELAY if fast else REQUEST_DELAY
    for attempt in range(1, MAX_RETRIES + 1):
        try:
            time.sleep(delay)
            resp = session.get(url, params=params, timeout=REQUEST_TIMEOUT)
            resp.raise_for_status()
            return BeautifulSoup(resp.text, "html.parser")
        except requests.RequestException as e:
            logger.warning(
                "Request failed (attempt %d/%d): %s — %s",
                attempt,
                MAX_RETRIES,
                url,
                e,
            )
            if attempt < MAX_RETRIES:
                time.sleep(RETRY_DELAY)
    logger.error("All retries exhausted for: %s", url)
    return None


# ---------------------------------------------------------------------------
# Search results parsing
# ---------------------------------------------------------------------------


def _parse_search_results(soup: BeautifulSoup) -> list[dict]:
    """Extract certificate numbers from a search results page."""
    results = []
    for link in soup.find_all("a", href=True):
        href = link.get("href", "")
        if "page=detail" not in href or "certificatenumber=" not in href:
            continue

        cert_match = re.search(r"certificatenumber=([^&]+)", href)
        if not cert_match:
            continue

        cert_number = cert_match.group(1)
        text = link.get_text(separator=" | ", strip=True)

        results.append(
            {
                "certificaat_nummer": cert_number,
                "link_tekst": text,
            }
        )
    return results


def search_city(city: str) -> list[dict]:
    """Search Ascert for all certificates in a given city."""
    params = {
        "type": "processcertificate",
        "city": city,
        "postalcode": "",
        "company": "",
        "certificatenumber": "",
    }
    soup = fetch_page(BASE_URL, params)
    if soup is None:
        return []

    results = _parse_search_results(soup)
    for r in results:
        r["zoek_stad"] = city

    logger.info("City '%s': found %d certificate(s)", city, len(results))
    return results


def search_postcode(postcode: str) -> list[dict]:
    """Search Ascert for all certificates matching a 4-digit postcode."""
    params = {
        "type": "processcertificate",
        "city": "",
        "postalcode": postcode,
        "company": "",
        "certificatenumber": "",
    }
    soup = fetch_page(BASE_URL, params, fast=True)
    if soup is None:
        return []

    results = _parse_search_results(soup)
    for r in results:
        r["zoek_postcode"] = postcode

    if results:
        logger.info("Postcode '%s': found %d certificate(s)", postcode, len(results))
    return results


# ---------------------------------------------------------------------------
# Detail page parsing
# ---------------------------------------------------------------------------

# Expected fields on a detail page (label → key mapping)
DETAIL_FIELD_MAP = {
    "status": "status",
    "certificaatnummer": "certificaat_nummer",
    "uitgegeven door": "uitgegeven_door",
    "naam bedrijf": "naam",
    "kvk-inschrijving": "kvk_nummer",
    "contactpersoon": "contactpersoon",
    "adres": "adres",
    "postcode": "postcode",
    "plaats": "plaats",
    "e-mailadres": "email",
    "telefoon": "telefoon",
    "eerste uitgifte": "eerste_uitgifte",
    "certificaatdatum": "certificaat_datum",
    "verloopdatum": "verloopdatum",
    "certificaatsoort": "certificaat_soort",
}


def parse_detail_page(cert_number: str) -> dict | None:
    """Fetch and parse a certificate detail page."""
    params = {
        "page": "detail",
        "type": "processcertificate",
        "certificatenumber": cert_number,
    }
    soup = fetch_page(BASE_URL, params)
    if soup is None:
        return None

    detail: dict[str, str] = {"certificaat_nummer": cert_number}

    # The detail page uses a key-value structure. We look for common patterns:
    # 1. <dt>/<dd> pairs
    # 2. <th>/<td> pairs
    # 3. <strong>Label:</strong> Value patterns
    # 4. <div class="label">Label</div><div class="value">Value</div>

    # Strategy 1: Try <dt>/<dd> or table rows
    for dt in soup.find_all(["dt", "th"]):
        label = dt.get_text(strip=True).lower().rstrip(":")
        dd = dt.find_next_sibling(["dd", "td"])
        if dd:
            value = dd.get_text(strip=True)
            if label in DETAIL_FIELD_MAP and value:
                detail[DETAIL_FIELD_MAP[label]] = value

    # Strategy 2: Try <strong>Label:</strong> text patterns
    if len(detail) <= 1:
        for strong in soup.find_all("strong"):
            label = strong.get_text(strip=True).lower().rstrip(":")
            if label in DETAIL_FIELD_MAP:
                # Get the next sibling text or the parent's remaining text
                next_text = strong.next_sibling
                if next_text and isinstance(next_text, str):
                    value = next_text.strip().lstrip(":").strip()
                    if value:
                        detail[DETAIL_FIELD_MAP[label]] = value

    # Strategy 3: Look for any elements containing label text
    if len(detail) <= 1:
        page_text = soup.get_text()
        for label, key in DETAIL_FIELD_MAP.items():
            # Search for "Label: Value" or "Label Value" patterns in text
            pattern = re.compile(
                rf"{re.escape(label)}\s*:?\s*(.+?)(?:\n|$)", re.IGNORECASE
            )
            match = pattern.search(page_text)
            if match:
                value = match.group(1).strip()
                # Clean up: stop at the next label
                for other_label in DETAIL_FIELD_MAP:
                    idx = value.lower().find(other_label)
                    if idx > 0:
                        value = value[:idx].strip()
                        break
                if value and key not in detail:
                    detail[key] = value

    if len(detail) <= 1:
        logger.warning("Could not parse detail page for certificate: %s", cert_number)
        return None

    return detail


# ---------------------------------------------------------------------------
# Data cleaning
# ---------------------------------------------------------------------------


def parse_date(date_str: str) -> str | None:
    """Parse Dutch date format (dd-mm-yyyy) to ISO format (yyyy-mm-dd)."""
    if not date_str:
        return None
    try:
        dt = datetime.strptime(date_str.strip(), "%d-%m-%Y")
        return dt.strftime("%Y-%m-%d")
    except ValueError:
        return None


def generate_slug(name: str) -> str:
    """Generate a URL-friendly slug from a company name."""
    slug = name.lower().strip()
    # Replace common Dutch characters
    replacements = {
        "ë": "e",
        "é": "e",
        "è": "e",
        "ê": "e",
        "ü": "u",
        "ú": "u",
        "ù": "u",
        "û": "u",
        "ä": "a",
        "á": "a",
        "à": "a",
        "â": "a",
        "ö": "o",
        "ó": "o",
        "ò": "o",
        "ô": "o",
        "ï": "i",
        "í": "i",
        "ì": "i",
        "î": "i",
    }
    for char, replacement in replacements.items():
        slug = slug.replace(char, replacement)
    # Replace non-alphanumeric with hyphens
    slug = re.sub(r"[^a-z0-9]+", "-", slug)
    # Remove leading/trailing hyphens and collapse multiples
    slug = re.sub(r"-+", "-", slug).strip("-")
    return slug


def split_address(adres: str) -> tuple[str, str]:
    """Split a Dutch address into street and house number.

    Handles Dutch house numbers like '62', '4C', '62 E', '184'.
    """
    if not adres:
        return ("", "")
    # Pattern: street name followed by number with optional letter/addition (e.g. "62 E", "4C")
    match = re.match(r"^(.+?)\s+(\d+(?:\s*[A-Za-z])?\S*)$", adres.strip())
    if match:
        return (match.group(1).strip(), match.group(2).strip())
    return (adres.strip(), "")


def determine_certificate_type(soort: str) -> str | None:
    """Map certificate type text to our schema codes."""
    if not soort:
        return None
    soort_lower = soort.lower()
    if "verwijdering" in soort_lower:
        return "SC-530"
    elif "inventarisatie" in soort_lower:
        return "SC-540"
    elif "analyse" in soort_lower or "laboratorium" in soort_lower:
        return "SC-560"
    return None


# Postcode → province mapping (first 2 digits)
POSTCODE_PROVINCE = {
    "10": "Noord-Holland", "11": "Noord-Holland", "12": "Noord-Holland",
    "13": "Noord-Holland", "14": "Noord-Holland", "15": "Noord-Holland",
    "16": "Flevoland", "17": "Noord-Holland", "18": "Noord-Holland",
    "19": "Noord-Holland", "20": "Zuid-Holland", "21": "Zuid-Holland",
    "22": "Zuid-Holland", "23": "Zuid-Holland", "24": "Zuid-Holland",
    "25": "Zuid-Holland", "26": "Zuid-Holland", "27": "Zuid-Holland",
    "28": "Zuid-Holland", "29": "Zuid-Holland", "30": "Utrecht",
    "31": "Utrecht", "32": "Flevoland", "33": "Overijssel",
    "34": "Utrecht", "35": "Utrecht", "36": "Utrecht",
    "37": "Utrecht", "38": "Gelderland", "39": "Gelderland",
    "40": "Gelderland", "41": "Gelderland", "42": "Gelderland",
    "43": "Gelderland", "44": "Zeeland", "45": "Zeeland",
    "46": "Noord-Brabant", "47": "Noord-Brabant", "48": "Noord-Brabant",
    "49": "Noord-Brabant", "50": "Noord-Brabant", "51": "Noord-Brabant",
    "52": "Noord-Brabant", "53": "Noord-Brabant", "54": "Noord-Brabant",
    "55": "Noord-Brabant", "56": "Noord-Brabant", "57": "Limburg",
    "58": "Limburg", "59": "Limburg", "60": "Limburg",
    "61": "Limburg", "62": "Limburg", "63": "Limburg",
    "64": "Gelderland", "65": "Gelderland", "66": "Gelderland",
    "67": "Gelderland", "68": "Gelderland", "69": "Gelderland",
    "70": "Overijssel", "71": "Overijssel", "72": "Overijssel",
    "73": "Overijssel", "74": "Overijssel", "75": "Overijssel",
    "76": "Overijssel", "77": "Drenthe", "78": "Drenthe",
    "79": "Drenthe", "80": "Overijssel", "81": "Overijssel",
    "82": "Flevoland", "83": "Flevoland", "84": "Friesland",
    "85": "Friesland", "86": "Friesland", "87": "Friesland",
    "88": "Friesland", "89": "Friesland", "90": "Groningen",
    "91": "Groningen", "92": "Groningen", "93": "Groningen",
    "94": "Groningen", "95": "Groningen", "96": "Groningen",
    "97": "Drenthe", "98": "Drenthe", "99": "Drenthe",
}


def province_from_postcode(postcode: str) -> str:
    """Derive province from the first 2 digits of a Dutch postcode."""
    if not postcode:
        return ""
    digits = re.sub(r"[^0-9]", "", postcode)
    if len(digits) >= 2:
        prefix = digits[:2]
        return POSTCODE_PROVINCE.get(prefix, "")
    return ""


def clean_record(raw: dict) -> dict:
    """Transform a raw scraped record into a clean record matching our DB schema."""
    straat, huisnummer = split_address(raw.get("adres", ""))
    postcode = raw.get("postcode", "").strip()
    naam = raw.get("naam", "").strip()

    return {
        # bedrijven table
        "naam": naam,
        "slug": generate_slug(naam),
        "kvk_nummer": raw.get("kvk_nummer", "").strip() or None,
        "email": raw.get("email", "").strip() or None,
        "telefoon": raw.get("telefoon", "").strip() or None,
        "straat": straat or None,
        "huisnummer": huisnummer or None,
        "postcode": postcode or None,
        "stad": raw.get("plaats", "").strip() or None,
        "provincie": province_from_postcode(postcode) or None,
        "is_gecertificeerd": raw.get("status", "").lower() == "geldig",
        "is_published": False,
        "bron": "ascert",
        "ascert_id": raw.get("certificaat_nummer", "").strip() or None,
        # bedrijf_certificeringen table
        "certificaat_nummer": raw.get("certificaat_nummer", "").strip() or None,
        "certificaat_type_code": determine_certificate_type(
            raw.get("certificaat_soort", "")
        ),
        "geldig_tot": parse_date(raw.get("verloopdatum", "")),
        "eerste_uitgifte": parse_date(raw.get("eerste_uitgifte", "")),
        "certificaat_datum": parse_date(raw.get("certificaat_datum", "")),
        # Extra metadata
        "contactpersoon": raw.get("contactpersoon", "").strip() or None,
        "uitgegeven_door": raw.get("uitgegeven_door", "").strip() or None,
        "status_ascert": raw.get("status", "").strip() or None,
        "verificatie_url": (
            f"{BASE_URL}?page=detail&type=processcertificate"
            f"&certificatenumber={raw.get('certificaat_nummer', '')}"
        ),
    }


# ---------------------------------------------------------------------------
# Checkpoint management (for resume support)
# ---------------------------------------------------------------------------


def load_checkpoint() -> dict:
    """Load the checkpoint file if it exists."""
    if CHECKPOINT_PATH.exists():
        with open(CHECKPOINT_PATH, "r", encoding="utf-8") as f:
            return json.load(f)
    return {"completed_cities": [], "certificates": {}}


def save_checkpoint(checkpoint: dict) -> None:
    """Save the checkpoint file."""
    with open(CHECKPOINT_PATH, "w", encoding="utf-8") as f:
        json.dump(checkpoint, f, ensure_ascii=False, indent=2)


# ---------------------------------------------------------------------------
# Output
# ---------------------------------------------------------------------------


def save_raw_json(records: dict) -> None:
    """Save raw scraped data as JSON."""
    DATA_DIR.mkdir(parents=True, exist_ok=True)
    with open(RAW_JSON_PATH, "w", encoding="utf-8") as f:
        json.dump(records, f, ensure_ascii=False, indent=2)
    logger.info("Saved %d raw records to %s", len(records), RAW_JSON_PATH)


def save_clean_csv(records: dict) -> None:
    """Save cleaned data as CSV."""
    if not records:
        logger.warning("No records to save as CSV")
        return

    # Clean all records
    clean_records = []
    for cert_num, raw in records.items():
        if raw.get("status", "").lower() != "geldig":
            continue
        clean = clean_record(raw)
        clean_records.append(clean)

    if not clean_records:
        logger.warning("No valid records after cleaning")
        return

    fieldnames = list(clean_records[0].keys())
    DATA_DIR.mkdir(parents=True, exist_ok=True)
    with open(CLEAN_CSV_PATH, "w", encoding="utf-8", newline="") as f:
        writer = csv.DictWriter(f, fieldnames=fieldnames)
        writer.writeheader()
        writer.writerows(clean_records)

    logger.info("Saved %d clean records to %s", len(clean_records), CLEAN_CSV_PATH)


# ---------------------------------------------------------------------------
# Main scraping logic
# ---------------------------------------------------------------------------


def scrape_all(
    cities: list[str] | None = None,
    resume: bool = False,
    detail_only: bool = False,
    force_refresh: bool = False,
    search_mode: str = "postcode",
) -> dict:
    """
    Main scraping function.

    1. Search to discover certificate numbers (by city or postcode)
    2. Fetch detail pages for each unique certificate
    3. Deduplicate on certificate number

    search_mode: "city" (old, searches by gemeente names) or
                 "postcode" (new default, iterates all 4-digit postcodes for complete coverage)

    If force_refresh=True, re-fetches ALL detail pages even if already cached.
    Use this for periodic syncs to detect changed company data.
    """
    checkpoint_key = "completed_cities" if search_mode == "city" else "completed_postcodes"
    checkpoint = load_checkpoint() if resume else {checkpoint_key: [], "certificates": {}}
    all_certificates: dict[str, dict] = checkpoint.get("certificates", {})
    completed_keys: list[str] = checkpoint.get(checkpoint_key, [])

    if not detail_only:
        if search_mode == "postcode":
            # Phase 1: Search by all 4-digit postcodes (1000-9999) for complete coverage
            all_postcodes = [str(pc) for pc in range(1000, 10000)]
            logger.info(
                "=== Phase 1: Searching %d postcodes for certificates ===",
                len(all_postcodes),
            )
            skipped = 0
            found_new = 0
            for i, postcode in enumerate(all_postcodes, 1):
                if postcode in completed_keys:
                    skipped += 1
                    continue

                results = search_postcode(postcode)

                for result in results:
                    cert_num = result["certificaat_nummer"]
                    if cert_num not in all_certificates:
                        all_certificates[cert_num] = {"certificaat_nummer": cert_num}
                        found_new += 1

                completed_keys.append(postcode)

                # Save checkpoint every 100 postcodes
                if i % 100 == 0:
                    save_checkpoint(
                        {
                            checkpoint_key: completed_keys,
                            "certificates": all_certificates,
                        }
                    )
                    logger.info(
                        "Checkpoint saved: %d/%d postcodes done, %d unique certificates found (+%d new)",
                        len(completed_keys),
                        len(all_postcodes),
                        len(all_certificates),
                        found_new,
                    )

                # Log progress every 500 postcodes
                if i % 500 == 0:
                    logger.info(
                        "Progress: %d/%d postcodes (%.0f%%), %d certificates",
                        i, len(all_postcodes), i / len(all_postcodes) * 100,
                        len(all_certificates),
                    )

            if skipped > 0:
                logger.info("Skipped %d already-completed postcodes (resume mode)", skipped)

        else:
            # Phase 1 (legacy): Search by city/gemeente names
            target_cities = cities or DUTCH_CITIES
            logger.info(
                "=== Phase 1: Searching %d cities for certificates ===",
                len(target_cities),
            )
            skipped = 0
            for i, city in enumerate(target_cities, 1):
                if city in completed_keys:
                    skipped += 1
                    continue

                logger.info("Searching city %d/%d: %s", i, len(target_cities), city)
                results = search_city(city)

                for result in results:
                    cert_num = result["certificaat_nummer"]
                    if cert_num not in all_certificates:
                        all_certificates[cert_num] = {"certificaat_nummer": cert_num}

                completed_keys.append(city)

                # Save checkpoint every 10 cities
                if i % 10 == 0:
                    save_checkpoint(
                        {
                            checkpoint_key: completed_keys,
                            "certificates": all_certificates,
                        }
                    )
                    logger.info(
                        "Checkpoint saved: %d cities done, %d unique certificates found",
                        len(completed_keys),
                        len(all_certificates),
                    )

            if skipped > 0:
                logger.info("Skipped %d already-completed cities (resume mode)", skipped)

        logger.info(
            "Phase 1 complete: %d unique certificates discovered", len(all_certificates)
        )

    # Phase 2: Fetch detail pages for certificates without full data
    # With force_refresh, re-fetch ALL detail pages to detect changes
    if force_refresh:
        certs_needing_detail = dict(all_certificates)
        logger.info("Force refresh: will re-fetch all %d detail pages", len(certs_needing_detail))
    else:
        certs_needing_detail = {
            num: data
            for num, data in all_certificates.items()
            if "naam" not in data  # No company name means we haven't fetched details yet
        }

    if certs_needing_detail:
        logger.info(
            "=== Phase 2: Fetching details for %d certificates ===",
            len(certs_needing_detail),
        )

        for i, cert_num in enumerate(certs_needing_detail, 1):
            logger.info(
                "Fetching detail %d/%d: %s",
                i,
                len(certs_needing_detail),
                cert_num,
            )
            detail = parse_detail_page(cert_num)
            if detail:
                all_certificates[cert_num] = detail

            # Save checkpoint every 25 detail pages
            if i % 25 == 0:
                save_checkpoint(
                    {
                        checkpoint_key: completed_keys,
                        "certificates": all_certificates,
                    }
                )
                logger.info("Checkpoint saved: %d/%d details fetched", i, len(certs_needing_detail))
    else:
        logger.info("All certificates already have detail data")

    # Final save
    save_checkpoint(
        {checkpoint_key: completed_keys, "certificates": all_certificates}
    )
    save_raw_json(all_certificates)
    save_clean_csv(all_certificates)

    # Summary
    total = len(all_certificates)
    valid = sum(
        1
        for c in all_certificates.values()
        if c.get("status", "").lower() == "geldig"
    )
    removal = sum(
        1
        for c in all_certificates.values()
        if "verwijdering" in c.get("certificaat_soort", "").lower()
    )
    inventory = sum(
        1
        for c in all_certificates.values()
        if "inventarisatie" in c.get("certificaat_soort", "").lower()
    )

    logger.info("=" * 60)
    logger.info("SCRAPE COMPLETE")
    logger.info("Total certificates found: %d", total)
    logger.info("  Valid (geldig): %d", valid)
    logger.info("  Asbestverwijdering (SC-530): %d", removal)
    logger.info("  Asbestinventarisatie (SC-540): %d", inventory)
    logger.info("  Other/unknown: %d", total - removal - inventory)
    logger.info("Output: %s, %s", RAW_JSON_PATH, CLEAN_CSV_PATH)
    logger.info("=" * 60)

    return all_certificates


# ---------------------------------------------------------------------------
# CLI
# ---------------------------------------------------------------------------


def main():
    parser = argparse.ArgumentParser(
        description="Scrape the Ascert certificate register for asbestos companies"
    )
    parser.add_argument(
        "--city",
        type=str,
        help="Scrape a single city (for testing, forces city mode)",
    )
    parser.add_argument(
        "--search-mode",
        choices=["city", "postcode"],
        default="postcode",
        help="Search strategy: 'postcode' (default, complete coverage via all 4-digit postcodes) "
             "or 'city' (legacy, searches by gemeente names — may miss small villages)",
    )
    parser.add_argument(
        "--resume",
        action="store_true",
        help="Resume from the last checkpoint",
    )
    parser.add_argument(
        "--detail-only",
        action="store_true",
        help="Only fetch details for already-discovered certificates",
    )
    parser.add_argument(
        "--force-refresh",
        action="store_true",
        help="Re-fetch all detail pages even if already cached (for sync)",
    )
    args = parser.parse_args()

    DATA_DIR.mkdir(parents=True, exist_ok=True)

    # --city flag forces city mode for single-city testing
    cities = [args.city] if args.city else None
    mode = "city" if args.city else args.search_mode

    scrape_all(
        cities=cities,
        resume=args.resume,
        detail_only=args.detail_only,
        force_refresh=args.force_refresh,
        search_mode=mode,
    )


if __name__ == "__main__":
    main()
