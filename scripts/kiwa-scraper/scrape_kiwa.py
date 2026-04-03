#!/usr/bin/env python3
"""
Kiwa Certificaatzoeker Scraper
===============================
Scrapes the Kiwa certificate search (https://www.kiwa.com/nl/nl/certificaatzoeker/)
for BRL K902 (HBO/diesel tank sanitation) and BRL K904 (other product tank sanitation)
certified companies.

Uses Playwright (headless Chromium) because the Kiwa site is a JavaScript SPA
that requires browser rendering.

Usage:
    python scrape_kiwa.py                    # Scrape K902 + K904
    python scrape_kiwa.py --norm K902        # Only K902
    python scrape_kiwa.py --norm K904        # Only K904
    python scrape_kiwa.py --resume           # Resume from checkpoint

Output:
    data/kiwa_raw.json       - Raw scraped data
    data/kiwa_clean.csv      - Cleaned data for review
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

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(message)s",
)
logger = logging.getLogger(__name__)

# ---------------------------------------------------------------------------
# Configuration
# ---------------------------------------------------------------------------

BASE_URL = "https://www.kiwa.com/nl/nl/certificaatzoeker/"
NORMS = ["K902", "K904"]

# Search by alphabet letters to get all results
SEARCH_LETTERS = list("abcdefghijklmnopqrstuvwxyz")

DATA_DIR = Path(__file__).parent / "data"
RAW_JSON_PATH = DATA_DIR / "kiwa_raw.json"
CLEAN_CSV_PATH = DATA_DIR / "kiwa_clean.csv"
CHECKPOINT_PATH = DATA_DIR / "kiwa_checkpoint.json"

# Rate limiting
PAGE_DELAY = 2.0  # seconds between page loads
SEARCH_DELAY = 3.0  # seconds between searches


def scrape_kiwa(norms=None, resume=False):
    """Main scraping function using Playwright."""
    from playwright.sync_api import sync_playwright

    norms = norms or NORMS
    DATA_DIR.mkdir(parents=True, exist_ok=True)

    # Load existing data / checkpoint
    all_companies = {}
    if resume and RAW_JSON_PATH.exists():
        with open(RAW_JSON_PATH) as f:
            existing = json.load(f)
            for c in existing:
                key = c.get("certificaat_nummer") or c.get("naam", "")
                all_companies[key] = c
        logger.info(f"Resumed with {len(all_companies)} existing companies")

    completed_searches = set()
    if resume and CHECKPOINT_PATH.exists():
        with open(CHECKPOINT_PATH) as f:
            cp = json.load(f)
            completed_searches = set(cp.get("completed", []))

    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context(
            user_agent="Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
            viewport={"width": 1280, "height": 800},
        )
        page = context.new_page()

        for norm in norms:
            logger.info(f"=== Scraping norm: {norm} ===")

            for letter in SEARCH_LETTERS:
                search_key = f"{norm}_{letter}"
                if search_key in completed_searches:
                    logger.info(f"Skipping {search_key} (already done)")
                    continue

                try:
                    companies = search_kiwa(page, norm, letter)
                    for c in companies:
                        key = c.get("certificaat_nummer") or c.get("naam", "")
                        c["norm"] = norm
                        all_companies[key] = c

                    completed_searches.add(search_key)
                    save_checkpoint(completed_searches)
                    logger.info(f"[{norm}/{letter}] Found {len(companies)} results (total: {len(all_companies)})")

                except Exception as e:
                    logger.error(f"Error scraping {norm}/{letter}: {e}")
                    # Save progress and continue
                    save_raw(list(all_companies.values()))
                    time.sleep(5)

                time.sleep(SEARCH_DELAY)

        browser.close()

    # Save final results
    companies_list = list(all_companies.values())
    save_raw(companies_list)
    save_csv(companies_list)

    logger.info(f"Done! Total unique companies: {len(companies_list)}")
    return companies_list


def search_kiwa(page, norm, company_prefix):
    """Search Kiwa certificaatzoeker for a specific norm and company name prefix."""
    url = f"{BASE_URL}?page=1&CompanyName={company_prefix}&TranslatedServiceNames={norm}"
    page.goto(url, wait_until="networkidle", timeout=30000)

    # Wait for results or "no results" message
    time.sleep(PAGE_DELAY)

    # Try to accept cookie consent if present
    try:
        cookie_btn = page.query_selector('[data-testid="cookie-accept"], .cookie-accept, #onetrust-accept-btn-handler')
        if cookie_btn:
            cookie_btn.click()
            time.sleep(0.5)
    except Exception:
        pass

    # Wait for search results to load
    try:
        page.wait_for_selector('.certificate, .no-results, [class*="certificate"]', timeout=10000)
    except Exception:
        # Page might not have results or use different selectors
        pass

    companies = []

    # Try to load all results (click "Meer laden" button)
    max_load_more = 20
    for _ in range(max_load_more):
        try:
            load_more = page.query_selector('button:has-text("Meer laden"), button:has-text("Load more"), [class*="load-more"]')
            if load_more and load_more.is_visible():
                load_more.click()
                time.sleep(PAGE_DELAY)
            else:
                break
        except Exception:
            break

    # Extract certificate entries
    certificates = page.query_selector_all('.certificate, [class*="certificate-item"], [class*="search-result"]')

    if not certificates:
        # Try alternative: extract from page content directly
        content = page.content()
        companies = parse_from_html(content, norm)
        return companies

    for cert in certificates:
        try:
            company = extract_certificate(cert)
            if company and company.get("naam"):
                companies.append(company)
        except Exception as e:
            logger.warning(f"Error extracting certificate: {e}")

    return companies


def extract_certificate(element):
    """Extract company data from a certificate element."""
    data = {}

    # Try various selectors for the data fields
    selectors = {
        "naam": ['.certificate__header', '.company-name', 'h3', 'h4', '[class*="name"]'],
        "norm_text": ['.certificate__norm', '[class*="norm"]', '[class*="standard"]'],
        "scope": ['.certificate__scope', '[class*="scope"]', '[class*="description"]'],
        "status": ['.certificate__status', '[class*="status"]'],
        "certificaat_nummer": ['.certificate__number', '[class*="number"]', '[class*="certificate-id"]'],
        "locatie": ['.certificate__location', '[class*="location"]', '[class*="city"]'],
    }

    for field, sel_list in selectors.items():
        for sel in sel_list:
            try:
                el = element.query_selector(sel)
                if el:
                    text = el.inner_text().strip()
                    if text:
                        data[field] = text
                        break
            except Exception:
                continue

    # Also try to get all text content if specific selectors fail
    if not data.get("naam"):
        try:
            all_text = element.inner_text().strip()
            lines = [l.strip() for l in all_text.split("\n") if l.strip()]
            if lines:
                data["naam"] = lines[0]
                if len(lines) > 1:
                    data["details_raw"] = lines[1:]
        except Exception:
            pass

    # Try to get link to certificate detail page
    try:
        link = element.query_selector('a[href*="certificaat"], a[href*="certificate"]')
        if link:
            data["detail_url"] = link.get_attribute("href")
    except Exception:
        pass

    return data


def parse_from_html(html_content, norm):
    """Fallback: parse company data from raw HTML content."""
    from bs4 import BeautifulSoup
    soup = BeautifulSoup(html_content, "html.parser")
    companies = []

    # Look for certificate-related elements
    for el in soup.find_all(class_=re.compile(r"certificate|search-result|result-item")):
        company = {}
        # Extract text content
        text = el.get_text(separator="\n", strip=True)
        lines = [l for l in text.split("\n") if l.strip()]
        if lines:
            company["naam"] = lines[0]
            company["details_raw"] = lines[1:] if len(lines) > 1 else []
            company["norm"] = norm
            companies.append(company)

    return companies


def save_checkpoint(completed):
    """Save scraping checkpoint."""
    with open(CHECKPOINT_PATH, "w") as f:
        json.dump({"completed": list(completed), "timestamp": datetime.now().isoformat()}, f)


def save_raw(companies):
    """Save raw JSON data."""
    with open(RAW_JSON_PATH, "w") as f:
        json.dump(companies, f, indent=2, ensure_ascii=False, default=str)
    logger.info(f"Saved {len(companies)} companies to {RAW_JSON_PATH}")


def save_csv(companies):
    """Save cleaned CSV for review."""
    if not companies:
        return

    fieldnames = ["naam", "certificaat_nummer", "norm", "locatie", "scope", "status", "detail_url"]
    with open(CLEAN_CSV_PATH, "w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=fieldnames, extrasaction="ignore")
        writer.writeheader()
        for c in companies:
            writer.writerow(c)
    logger.info(f"Saved CSV to {CLEAN_CSV_PATH}")


# ---------------------------------------------------------------------------
# Network interception approach (more reliable)
# ---------------------------------------------------------------------------

def scrape_kiwa_via_network(norms=None):
    """
    Alternative approach: intercept network requests to find the actual API.
    Navigates to the page and captures XHR/fetch responses.
    """
    from playwright.sync_api import sync_playwright

    norms = norms or NORMS
    DATA_DIR.mkdir(parents=True, exist_ok=True)
    api_responses = []

    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context(
            user_agent="Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36",
        )
        page = context.new_page()

        # Intercept all network responses to find the API
        def handle_response(response):
            url = response.url
            if any(kw in url.lower() for kw in ["certificate", "search", "api", "certificaat"]):
                try:
                    body = response.text()
                    api_responses.append({
                        "url": url,
                        "status": response.status,
                        "content_type": response.headers.get("content-type", ""),
                        "body_preview": body[:500] if body else "",
                    })
                    logger.info(f"Captured API call: {url} (status {response.status})")
                except Exception:
                    pass

        page.on("response", handle_response)

        # Navigate and trigger search
        for norm in norms:
            logger.info(f"Discovering API for norm: {norm}")
            url = f"{BASE_URL}?page=1&CompanyName=tank&TranslatedServiceNames={norm}"
            page.goto(url, wait_until="networkidle", timeout=30000)
            time.sleep(3)

            # Also try typing in search box to trigger API
            try:
                search_input = page.query_selector('input[type="text"], input[type="search"], [class*="search"] input')
                if search_input:
                    search_input.fill("tank")
                    time.sleep(3)
            except Exception:
                pass

        browser.close()

    # Report findings
    if api_responses:
        logger.info(f"\n=== Discovered {len(api_responses)} API calls ===")
        for r in api_responses:
            logger.info(f"  URL: {r['url']}")
            logger.info(f"  Status: {r['status']}, Type: {r['content_type']}")
            logger.info(f"  Preview: {r['body_preview'][:200]}")
            logger.info("---")

        # Save for analysis
        with open(DATA_DIR / "api_discovery.json", "w") as f:
            json.dump(api_responses, f, indent=2, ensure_ascii=False)
    else:
        logger.warning("No API calls captured!")

    return api_responses


# ---------------------------------------------------------------------------
# Main
# ---------------------------------------------------------------------------

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Scrape Kiwa Certificaatzoeker")
    parser.add_argument("--norm", choices=["K902", "K904"], help="Specific norm to scrape")
    parser.add_argument("--resume", action="store_true", help="Resume from checkpoint")
    parser.add_argument("--discover-api", action="store_true", help="Only discover API endpoints (debug)")
    args = parser.parse_args()

    norms = [args.norm] if args.norm else None

    if args.discover_api:
        scrape_kiwa_via_network(norms)
    else:
        scrape_kiwa(norms, resume=args.resume)
