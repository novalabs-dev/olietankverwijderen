#!/bin/bash
# Full Ascert Pipeline: waits for scraper, then runs import, KVK enrichment, descriptions, publish
# Usage: nohup bash run_full_pipeline.sh &

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(cd "$SCRIPT_DIR/../.." && pwd)"
LOG_FILE="$SCRIPT_DIR/data/pipeline.log"
SCRAPER_PID=11588

log() {
    echo "$(date '+%Y-%m-%d %H:%M:%S') [PIPELINE] $*" | tee -a "$LOG_FILE"
}

log "=== Full Ascert Pipeline Started ==="
log "Waiting for scraper PID $SCRAPER_PID to finish..."

# Step 0: Wait for scraper to finish
while kill -0 "$SCRAPER_PID" 2>/dev/null; do
    sleep 60
done
log "Scraper finished!"

# Count results
CERT_COUNT=$(tail -1 "$SCRIPT_DIR/data/ascert_clean.csv" | wc -l)
TOTAL_LINES=$(wc -l < "$SCRIPT_DIR/data/ascert_clean.csv")
log "Scraper output: $((TOTAL_LINES - 1)) companies in ascert_clean.csv"

# Step 1: Sync to Supabase
log "=== Step 1: Syncing to Supabase ==="
cd "$SCRIPT_DIR"
source venv/bin/activate
python import_to_supabase.py --sync 2>&1 | tee -a "$LOG_FILE"
log "Sync complete"

# Step 2: Publish new companies
log "=== Step 2: Publishing new companies ==="
cd "$PROJECT_DIR"
npx tsx scripts/publish-ascert-bedrijven.ts 2>&1 | tee -a "$LOG_FILE"
log "Publish complete"

# Step 3: KVK enrichment
log "=== Step 3: KVK Enrichment ==="
npx tsx scripts/enrich-kvk.ts 2>&1 | tee -a "$LOG_FILE"
log "KVK enrichment complete"

# Step 4: Scrape websites for description data
log "=== Step 4: Scraping company websites ==="
cd "$PROJECT_DIR/scripts"
python scrape-websites.py 2>&1 | tee -a "$LOG_FILE"
log "Website scraping complete"

# Step 5: Generate descriptions
log "=== Step 5: Generating descriptions ==="
cd "$PROJECT_DIR"
npx tsx scripts/generate-descriptions.ts 2>&1 | tee -a "$LOG_FILE"
log "Description generation complete"

log "=== Full Pipeline Complete ==="

# Send Telegram notification
AIOS_DIR="/Users/woutervanackooij/Documents/Programming/AIOS"
TELEGRAM_SCRIPT="$AIOS_DIR/.claude/skills/telegram/scripts/telegram_send.py"
if [ -f "$TELEGRAM_SCRIPT" ]; then
    TOTAL_AFTER=$(wc -l < "$SCRIPT_DIR/data/ascert_clean.csv")
    COMPANIES=$((TOTAL_AFTER - 1))

    cd "$AIOS_DIR"
    source .venv/bin/activate 2>/dev/null || true
    python "$TELEGRAM_SCRIPT" --chat-id 100875830 --message "Asbest Vergelijken pipeline voltooid:
- Ascert scrape: $COMPANIES bedrijven gevonden (volledige postcode-scan)
- Supabase sync: uitgevoerd
- KVK verrijking: uitgevoerd
- Beschrijvingen: gegenereerd
- Publicatie: uitgevoerd

Alle bedrijven inclusief kleine dorpen zijn nu opgenomen." 2>&1 | tee -a "$LOG_FILE"
fi
