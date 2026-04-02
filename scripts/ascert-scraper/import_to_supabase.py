#!/usr/bin/env python3
"""
Import & Sync Ascert scraped data with Supabase.
==================================================
Reads the raw JSON output from scrape_ascert.py and imports/syncs it with
the bedrijven and bedrijf_certificeringen tables.

Modes:
    --import     Initial import or add new records (default)
    --sync       Compare Ascert data with Supabase, report + apply changes
    --dry-run    Preview without writing (works with both import and sync)

Usage:
    python import_to_supabase.py                          # Import new records
    python import_to_supabase.py --sync                   # Sync: detect & apply changes
    python import_to_supabase.py --sync --dry-run         # Preview sync changes
    python import_to_supabase.py --sync --report-only     # Only generate diff report

Environment variables (or .env file):
    SUPABASE_URL       - Your Supabase project URL
    SUPABASE_SERVICE_KEY - Service role key (bypasses RLS)
"""

import argparse
import json
import logging
import os
import sys
from datetime import datetime, timezone
from pathlib import Path

from dotenv import load_dotenv

# Add parent directory to path for imports
sys.path.insert(0, str(Path(__file__).parent))

from scrape_ascert import clean_record, DATA_DIR, RAW_JSON_PATH

# ---------------------------------------------------------------------------
# Configuration
# ---------------------------------------------------------------------------

# Try local .env first, then project root .env.local
_project_root = Path(__file__).resolve().parent.parent.parent
load_dotenv()
load_dotenv(_project_root / ".env.local", override=True)

SUPABASE_URL = os.getenv("SUPABASE_URL") or os.getenv("NEXT_PUBLIC_SUPABASE_URL")
SUPABASE_SERVICE_KEY = os.getenv("SUPABASE_SERVICE_KEY") or os.getenv("SUPABASE_SERVICE_ROLE_KEY")

SYNC_REPORT_PATH = DATA_DIR / "sync_report.json"

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(message)s",
)
logger = logging.getLogger(__name__)

# Fields we compare when syncing. Maps clean_record keys → bedrijven columns.
# We skip slug (never overwritten), is_published (manual), bron (static).
SYNC_FIELDS_BEDRIJVEN = [
    "naam",
    "kvk_nummer",
    "email",
    "telefoon",
    "straat",
    "huisnummer",
    "postcode",
    "stad",
    "provincie",
    "is_gecertificeerd",
]

SYNC_FIELDS_CERTIFICERING = [
    "certificaat_nummer",
    "geldig_tot",
]

# ---------------------------------------------------------------------------
# Supabase client
# ---------------------------------------------------------------------------


def get_supabase_client():
    """Create a Supabase client using the service role key."""
    if not SUPABASE_URL or not SUPABASE_SERVICE_KEY:
        logger.error(
            "Missing SUPABASE_URL or SUPABASE_SERVICE_KEY environment variables. "
            "Set them in a .env file or as environment variables."
        )
        sys.exit(1)

    from supabase import create_client

    return create_client(SUPABASE_URL, SUPABASE_SERVICE_KEY)


# ---------------------------------------------------------------------------
# Data loading
# ---------------------------------------------------------------------------


def load_raw_data(file_path: Path) -> dict:
    """Load the raw JSON data from the scraper."""
    if not file_path.exists():
        logger.error("Raw data file not found: %s", file_path)
        logger.error("Run scrape_ascert.py first to generate the data.")
        sys.exit(1)

    with open(file_path, "r", encoding="utf-8") as f:
        return json.load(f)


def ensure_certificate_types(supabase) -> dict[str, str]:
    """Ensure certificering_types exist and return a code→id mapping."""
    types = [
        {"code": "SC-530", "naam": "Asbestverwijdering", "beschrijving": "Certificering voor het verwijderen van asbest"},
        {"code": "SC-540", "naam": "Asbestinventarisatie", "beschrijving": "Certificering voor het inventariseren van asbest"},
        {"code": "SC-560", "naam": "Asbestanalyse (laboratorium)", "beschrijving": "Certificering voor laboratoriumanalyse van asbest"},
    ]

    code_to_id = {}
    for cert_type in types:
        result = (
            supabase.table("certificering_types")
            .select("id, code")
            .eq("code", cert_type["code"])
            .execute()
        )
        if result.data:
            code_to_id[cert_type["code"]] = result.data[0]["id"]
        else:
            result = (
                supabase.table("certificering_types")
                .insert(cert_type)
                .execute()
            )
            code_to_id[cert_type["code"]] = result.data[0]["id"]
            logger.info("Created certificering_type: %s", cert_type["code"])

    return code_to_id


# ---------------------------------------------------------------------------
# Change detection
# ---------------------------------------------------------------------------


def normalize_value(value) -> str:
    """Normalize a value for comparison (handle None, whitespace, booleans)."""
    if value is None:
        return ""
    if isinstance(value, bool):
        return str(value).lower()
    return str(value).strip()


def detect_field_changes(
    ascert_data: dict, supabase_data: dict, fields: list[str]
) -> dict[str, tuple[str, str]]:
    """Compare fields between Ascert and Supabase data.

    Returns dict of {field: (old_value, new_value)} for changed fields.
    """
    changes = {}
    for field in fields:
        ascert_val = normalize_value(ascert_data.get(field))
        supa_val = normalize_value(supabase_data.get(field))
        if ascert_val != supa_val:
            changes[field] = (supa_val, ascert_val)
    return changes


# ---------------------------------------------------------------------------
# Import logic (initial + upsert)
# ---------------------------------------------------------------------------


def import_records(raw_data: dict, dry_run: bool = False) -> dict:
    """Import cleaned records into Supabase. Returns stats dict."""
    if dry_run:
        logger.info("=== DRY RUN MODE — no data will be written ===")
        supabase = None
        cert_type_ids = {"SC-530": "dry-run-id", "SC-540": "dry-run-id", "SC-560": "dry-run-id"}
    else:
        supabase = get_supabase_client()
        cert_type_ids = ensure_certificate_types(supabase)

    stats = {
        "total": 0,
        "skipped_invalid": 0,
        "skipped_no_name": 0,
        "created": 0,
        "updated": 0,
        "cert_created": 0,
        "cert_updated": 0,
        "errors": 0,
    }

    records = list(raw_data.values())
    stats["total"] = len(records)

    for i, raw in enumerate(records, 1):
        if raw.get("status", "").lower() != "geldig":
            stats["skipped_invalid"] += 1
            continue

        if not raw.get("naam"):
            stats["skipped_no_name"] += 1
            continue

        clean = clean_record(raw)

        if i % 50 == 0:
            logger.info(
                "Processing %d/%d (created: %d, updated: %d, errors: %d)",
                i, len(records), stats["created"], stats["updated"], stats["errors"],
            )

        if dry_run:
            stats["created"] += 1
            continue

        try:
            existing = (
                supabase.table("bedrijven")
                .select("id, ascert_id")
                .eq("ascert_id", clean["ascert_id"])
                .execute()
            )

            bedrijf_data = {
                "naam": clean["naam"],
                "slug": clean["slug"],
                "kvk_nummer": clean["kvk_nummer"],
                "email": clean["email"],
                "telefoon": clean["telefoon"],
                "straat": clean["straat"],
                "huisnummer": clean["huisnummer"],
                "postcode": clean["postcode"],
                "stad": clean["stad"],
                "provincie": clean["provincie"],
                "is_gecertificeerd": clean["is_gecertificeerd"],
                "is_published": False,
                "bron": "ascert",
                "ascert_id": clean["ascert_id"],
                "data_verified_at": "now()",
            }

            if existing.data:
                bedrijf_id = existing.data[0]["id"]
                del bedrijf_data["slug"]
                del bedrijf_data["is_published"]  # preserve existing publish status on update
                supabase.table("bedrijven").update(bedrijf_data).eq(
                    "id", bedrijf_id
                ).execute()
                stats["updated"] += 1
            else:
                slug = clean["slug"]
                slug_check = (
                    supabase.table("bedrijven")
                    .select("id")
                    .eq("slug", slug)
                    .execute()
                )
                if slug_check.data:
                    suffix = clean["certificaat_nummer"].replace(".", "-").replace(" ", "")
                    bedrijf_data["slug"] = f"{slug}-{suffix}"

                result = (
                    supabase.table("bedrijven").insert(bedrijf_data).execute()
                )
                bedrijf_id = result.data[0]["id"]
                stats["created"] += 1

            cert_type_code = clean["certificaat_type_code"]
            if cert_type_code and cert_type_code in cert_type_ids:
                cert_type_id = cert_type_ids[cert_type_code]

                existing_cert = (
                    supabase.table("bedrijf_certificeringen")
                    .select("id")
                    .eq("bedrijf_id", bedrijf_id)
                    .eq("certificering_type_id", cert_type_id)
                    .execute()
                )

                cert_data = {
                    "bedrijf_id": bedrijf_id,
                    "certificering_type_id": cert_type_id,
                    "certificaat_nummer": clean["certificaat_nummer"],
                    "geldig_tot": clean["geldig_tot"],
                    "verificatie_url": clean["verificatie_url"],
                    "verified_at": "now()",
                }

                if existing_cert.data:
                    supabase.table("bedrijf_certificeringen").update(cert_data).eq(
                        "id", existing_cert.data[0]["id"]
                    ).execute()
                    stats["cert_updated"] += 1
                else:
                    supabase.table("bedrijf_certificeringen").insert(
                        cert_data
                    ).execute()
                    stats["cert_created"] += 1

        except Exception as e:
            logger.error("Error importing %s: %s", clean.get("naam", "unknown"), e)
            stats["errors"] += 1

    _log_stats("IMPORT", stats, dry_run)
    return stats


# ---------------------------------------------------------------------------
# Sync logic (change detection + selective update)
# ---------------------------------------------------------------------------


def fetch_all_supabase_companies(supabase) -> dict[str, dict]:
    """Fetch all Ascert-sourced companies from Supabase, keyed by ascert_id."""
    companies = {}
    # Supabase paginates at 1000 by default; fetch all
    offset = 0
    page_size = 1000
    while True:
        result = (
            supabase.table("bedrijven")
            .select("*")
            .eq("bron", "ascert")
            .range(offset, offset + page_size - 1)
            .execute()
        )
        if not result.data:
            break
        for row in result.data:
            if row.get("ascert_id"):
                companies[row["ascert_id"]] = row
        if len(result.data) < page_size:
            break
        offset += page_size

    return companies


def fetch_all_supabase_certs(supabase) -> dict[str, dict]:
    """Fetch all certifications, keyed by bedrijf_id + certificering_type_id."""
    certs = {}
    offset = 0
    page_size = 1000
    while True:
        result = (
            supabase.table("bedrijf_certificeringen")
            .select("*")
            .range(offset, offset + page_size - 1)
            .execute()
        )
        if not result.data:
            break
        for row in result.data:
            key = f"{row['bedrijf_id']}_{row['certificering_type_id']}"
            certs[key] = row
        if len(result.data) < page_size:
            break
        offset += page_size

    return certs


def sync_records(
    raw_data: dict, dry_run: bool = False, report_only: bool = False
) -> dict:
    """
    Compare Ascert data with Supabase and apply changes.

    Detects:
    - New companies in Ascert not yet in Supabase
    - Changed fields (address, phone, email, etc.)
    - Expired/revoked certificates (in Supabase but not in Ascert as 'geldig')
    - Updated certificate validity dates

    Returns a sync report dict.
    """
    supabase = get_supabase_client()
    cert_type_ids = ensure_certificate_types(supabase)

    logger.info("Fetching current Supabase data...")
    supa_companies = fetch_all_supabase_companies(supabase)
    supa_certs = fetch_all_supabase_certs(supabase)
    logger.info(
        "Found %d companies and %d certifications in Supabase",
        len(supa_companies),
        len(supa_certs),
    )

    # Build clean Ascert dataset (only valid)
    ascert_clean = {}
    for raw in raw_data.values():
        if raw.get("status", "").lower() != "geldig" or not raw.get("naam"):
            continue
        clean = clean_record(raw)
        ascert_clean[clean["ascert_id"]] = clean

    logger.info("Ascert dataset: %d valid companies", len(ascert_clean))

    # --- Build sync report ---
    report = {
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "ascert_total": len(ascert_clean),
        "supabase_total": len(supa_companies),
        "new_companies": [],        # In Ascert, not in Supabase
        "updated_companies": [],    # In both, fields differ
        "unchanged_companies": [],  # In both, no differences
        "revoked_companies": [],    # In Supabase, not in Ascert (as geldig)
        "new_certifications": [],
        "updated_certifications": [],
        "errors": [],
    }

    # 1. Check each Ascert company against Supabase
    for ascert_id, ascert in ascert_clean.items():
        supa = supa_companies.get(ascert_id)

        if not supa:
            report["new_companies"].append({
                "ascert_id": ascert_id,
                "naam": ascert["naam"],
                "stad": ascert["stad"],
                "certificaat_type": ascert["certificaat_type_code"],
            })
            continue

        # Compare fields
        changes = detect_field_changes(ascert, supa, SYNC_FIELDS_BEDRIJVEN)
        if changes:
            report["updated_companies"].append({
                "ascert_id": ascert_id,
                "naam": ascert["naam"],
                "bedrijf_id": supa["id"],
                "changes": {
                    field: {"old": old, "new": new}
                    for field, (old, new) in changes.items()
                },
            })
        else:
            report["unchanged_companies"].append(ascert_id)

    # 2. Check for companies in Supabase that are no longer valid in Ascert
    all_ascert_ids_valid = set(ascert_clean.keys())
    # Also include non-valid ones from raw data to distinguish "revoked" from "unknown"
    all_ascert_ids_seen = set()
    for raw in raw_data.values():
        cert_num = raw.get("certificaat_nummer", "").strip()
        if cert_num:
            all_ascert_ids_seen.add(cert_num)

    for ascert_id, supa in supa_companies.items():
        if ascert_id not in all_ascert_ids_valid:
            reason = "niet meer geldig" if ascert_id in all_ascert_ids_seen else "niet gevonden in Ascert"
            report["revoked_companies"].append({
                "ascert_id": ascert_id,
                "naam": supa.get("naam", ""),
                "bedrijf_id": supa["id"],
                "is_gecertificeerd": supa.get("is_gecertificeerd", False),
                "reason": reason,
            })

    # --- Apply changes ---
    applied_stats = {
        "new_created": 0,
        "fields_updated": 0,
        "certs_revoked": 0,
        "errors": 0,
    }

    if report_only:
        logger.info("=== REPORT ONLY — no changes applied ===")
    elif dry_run:
        logger.info("=== DRY RUN — no changes applied ===")
    else:
        # Apply new companies
        for new_co in report["new_companies"]:
            ascert_id = new_co["ascert_id"]
            ascert = ascert_clean[ascert_id]
            try:
                bedrijf_data = {
                    "naam": ascert["naam"],
                    "slug": ascert["slug"],
                    "kvk_nummer": ascert["kvk_nummer"],
                    "email": ascert["email"],
                    "telefoon": ascert["telefoon"],
                    "straat": ascert["straat"],
                    "huisnummer": ascert["huisnummer"],
                    "postcode": ascert["postcode"],
                    "stad": ascert["stad"],
                    "provincie": ascert["provincie"],
                    "is_gecertificeerd": True,
                    "is_published": False,
                    "bron": "ascert",
                    "ascert_id": ascert_id,
                    "data_verified_at": "now()",
                }

                # Handle slug uniqueness
                slug_check = (
                    supabase.table("bedrijven")
                    .select("id")
                    .eq("slug", ascert["slug"])
                    .execute()
                )
                if slug_check.data:
                    suffix = ascert["certificaat_nummer"].replace(".", "-").replace(" ", "")
                    bedrijf_data["slug"] = f"{ascert['slug']}-{suffix}"

                result = supabase.table("bedrijven").insert(bedrijf_data).execute()
                bedrijf_id = result.data[0]["id"]

                # Add certification
                cert_type_code = ascert["certificaat_type_code"]
                if cert_type_code and cert_type_code in cert_type_ids:
                    supabase.table("bedrijf_certificeringen").insert({
                        "bedrijf_id": bedrijf_id,
                        "certificering_type_id": cert_type_ids[cert_type_code],
                        "certificaat_nummer": ascert["certificaat_nummer"],
                        "geldig_tot": ascert["geldig_tot"],
                        "verificatie_url": ascert["verificatie_url"],
                        "verified_at": "now()",
                    }).execute()

                applied_stats["new_created"] += 1
            except Exception as e:
                logger.error("Error creating %s: %s", ascert["naam"], e)
                report["errors"].append({"ascert_id": ascert_id, "error": str(e)})
                applied_stats["errors"] += 1

        # Apply field updates
        for update in report["updated_companies"]:
            try:
                ascert = ascert_clean[update["ascert_id"]]
                update_data = {}
                for field in update["changes"]:
                    update_data[field] = ascert[field]
                update_data["data_verified_at"] = "now()"

                supabase.table("bedrijven").update(update_data).eq(
                    "id", update["bedrijf_id"]
                ).execute()

                # Also update certification geldig_tot if changed
                cert_type_code = ascert["certificaat_type_code"]
                if cert_type_code and cert_type_code in cert_type_ids:
                    cert_type_id = cert_type_ids[cert_type_code]
                    existing_cert = (
                        supabase.table("bedrijf_certificeringen")
                        .select("id, geldig_tot")
                        .eq("bedrijf_id", update["bedrijf_id"])
                        .eq("certificering_type_id", cert_type_id)
                        .execute()
                    )
                    if existing_cert.data:
                        old_geldig_tot = existing_cert.data[0].get("geldig_tot")
                        if normalize_value(old_geldig_tot) != normalize_value(ascert["geldig_tot"]):
                            supabase.table("bedrijf_certificeringen").update({
                                "geldig_tot": ascert["geldig_tot"],
                                "certificaat_nummer": ascert["certificaat_nummer"],
                                "verified_at": "now()",
                            }).eq("id", existing_cert.data[0]["id"]).execute()
                    else:
                        # Certification record missing, create it
                        supabase.table("bedrijf_certificeringen").insert({
                            "bedrijf_id": update["bedrijf_id"],
                            "certificering_type_id": cert_type_id,
                            "certificaat_nummer": ascert["certificaat_nummer"],
                            "geldig_tot": ascert["geldig_tot"],
                            "verificatie_url": ascert["verificatie_url"],
                            "verified_at": "now()",
                        }).execute()

                applied_stats["fields_updated"] += 1
            except Exception as e:
                logger.error("Error updating %s: %s", update["naam"], e)
                report["errors"].append({"ascert_id": update["ascert_id"], "error": str(e)})
                applied_stats["errors"] += 1

        # Mark revoked companies as not certified (but don't delete)
        for revoked in report["revoked_companies"]:
            if revoked["is_gecertificeerd"]:
                try:
                    supabase.table("bedrijven").update({
                        "is_gecertificeerd": False,
                        "data_verified_at": "now()",
                    }).eq("id", revoked["bedrijf_id"]).execute()
                    applied_stats["certs_revoked"] += 1
                except Exception as e:
                    logger.error("Error revoking %s: %s", revoked["naam"], e)
                    applied_stats["errors"] += 1

        # Update data_verified_at for unchanged companies
        unchanged_ids = [
            supa_companies[aid]["id"]
            for aid in report["unchanged_companies"]
            if aid in supa_companies
        ]
        # Batch update in groups of 50
        for batch_start in range(0, len(unchanged_ids), 50):
            batch = unchanged_ids[batch_start:batch_start + 50]
            for bid in batch:
                try:
                    supabase.table("bedrijven").update({
                        "data_verified_at": "now()",
                    }).eq("id", bid).execute()
                except Exception:
                    pass  # Non-critical: just a timestamp update

    report["applied"] = applied_stats

    # Save report
    DATA_DIR.mkdir(parents=True, exist_ok=True)
    with open(SYNC_REPORT_PATH, "w", encoding="utf-8") as f:
        json.dump(report, f, ensure_ascii=False, indent=2, default=str)

    # Log summary
    logger.info("=" * 60)
    logger.info("SYNC REPORT%s", " (DRY RUN)" if dry_run else (" (REPORT ONLY)" if report_only else ""))
    logger.info("Ascert companies (valid): %d", report["ascert_total"])
    logger.info("Supabase companies (ascert source): %d", report["supabase_total"])
    logger.info("  New (in Ascert, not in Supabase): %d", len(report["new_companies"]))
    logger.info("  Updated (fields changed): %d", len(report["updated_companies"]))
    logger.info("  Unchanged: %d", len(report["unchanged_companies"]))
    logger.info("  Revoked/expired (in Supabase, not valid in Ascert): %d", len(report["revoked_companies"]))
    if not report_only and not dry_run:
        logger.info("Applied: %d created, %d updated, %d revoked, %d errors",
                     applied_stats["new_created"], applied_stats["fields_updated"],
                     applied_stats["certs_revoked"], applied_stats["errors"])
    logger.info("Full report saved to: %s", SYNC_REPORT_PATH)
    logger.info("=" * 60)

    # Log changed fields detail
    if report["updated_companies"]:
        logger.info("")
        logger.info("Changed fields detail (first 20):")
        for update in report["updated_companies"][:20]:
            changes_str = ", ".join(
                f"{f}: '{c['old']}' → '{c['new']}'"
                for f, c in update["changes"].items()
            )
            logger.info("  %s: %s", update["naam"], changes_str)
        if len(report["updated_companies"]) > 20:
            logger.info("  ... and %d more (see full report)", len(report["updated_companies"]) - 20)

    if report["revoked_companies"]:
        logger.info("")
        logger.info("Revoked/expired (first 10):")
        for rev in report["revoked_companies"][:10]:
            logger.info("  %s — %s", rev["naam"], rev["reason"])

    return report


# ---------------------------------------------------------------------------
# Logging helper
# ---------------------------------------------------------------------------


def _log_stats(mode: str, stats: dict, dry_run: bool) -> None:
    logger.info("=" * 60)
    logger.info("%s COMPLETE%s", mode, " (DRY RUN)" if dry_run else "")
    logger.info("Total records: %d", stats["total"])
    logger.info("  Skipped (invalid status): %d", stats["skipped_invalid"])
    logger.info("  Skipped (no name): %d", stats["skipped_no_name"])
    logger.info("  Companies created: %d", stats["created"])
    logger.info("  Companies updated: %d", stats["updated"])
    logger.info("  Certifications created: %d", stats["cert_created"])
    logger.info("  Certifications updated: %d", stats["cert_updated"])
    logger.info("  Errors: %d", stats["errors"])
    logger.info("=" * 60)


# ---------------------------------------------------------------------------
# CLI
# ---------------------------------------------------------------------------


def main():
    parser = argparse.ArgumentParser(
        description="Import/sync Ascert scraped data with Supabase"
    )
    parser.add_argument(
        "--file",
        type=str,
        default=str(RAW_JSON_PATH),
        help="Path to the raw JSON file (default: data/ascert_raw.json)",
    )
    parser.add_argument(
        "--sync",
        action="store_true",
        help="Sync mode: compare with Supabase and apply changes selectively",
    )
    parser.add_argument(
        "--report-only",
        action="store_true",
        help="Only generate a diff report, don't apply any changes (implies --sync)",
    )
    parser.add_argument(
        "--dry-run",
        action="store_true",
        help="Preview without writing to Supabase",
    )
    args = parser.parse_args()

    raw_data = load_raw_data(Path(args.file))

    if args.report_only or args.sync:
        sync_records(raw_data, dry_run=args.dry_run, report_only=args.report_only)
    else:
        import_records(raw_data, dry_run=args.dry_run)


if __name__ == "__main__":
    main()
