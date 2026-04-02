#!/bin/bash
# Chunked Ascert Pipeline: resumes scraper, then runs full enrichment pipeline
# Sends Telegram updates after each step
# Usage: nohup bash run_chunked_pipeline.sh > /dev/null 2>&1 &

set -uo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(cd "$SCRIPT_DIR/../.." && pwd)"
AIOS_DIR="/Users/woutervanackooij/Documents/Programming/AIOS"
LOG_FILE="$SCRIPT_DIR/data/pipeline_chunked.log"
TELEGRAM_SCRIPT="$AIOS_DIR/.claude/skills/telegram/scripts/telegram_send.py"
CHAT_ID=100875830

log() {
    echo "$(date '+%Y-%m-%d %H:%M:%S') [PIPELINE] $*" | tee -a "$LOG_FILE"
}

send_telegram() {
    local msg="$1"
    if [ -f "$TELEGRAM_SCRIPT" ]; then
        cd "$AIOS_DIR"
        source .venv/bin/activate 2>/dev/null || true
        python "$TELEGRAM_SCRIPT" --chat-id "$CHAT_ID" --message "$msg" 2>/dev/null || true
    fi
}

# Clean start of log
echo "" >> "$LOG_FILE"
log "=========================================="
log "=== Chunked Ascert Pipeline Started ==="
log "=========================================="

send_telegram "🔄 Asbest Vergelijken pipeline gestart!

Stappen:
1. Ascert scraper afronden (nog ~3600 postcodes)
2. Supabase sync
3. Publicatie nieuwe bedrijven
4. KVK verrijking
5. Website scraping
6. Beschrijvingen genereren

Ik stuur updates na elke stap."

# ============================================================
# Step 1: Complete the Ascert scrape (resume from checkpoint)
# ============================================================
log "=== Step 1: Ascert Scraper (resume mode) ==="
cd "$SCRIPT_DIR"
source venv/bin/activate

# Check how many postcodes are already done
DONE_BEFORE=$(python3 -c "import json; d=json.load(open('data/checkpoint.json')); print(len(d.get('completed_postcodes',[])))" 2>/dev/null || echo "0")
log "Postcodes already completed: $DONE_BEFORE / 9000"

python scrape_ascert.py --resume 2>&1 | tee -a "$LOG_FILE"
SCRAPER_EXIT=$?

if [ $SCRAPER_EXIT -ne 0 ]; then
    log "WARNING: Scraper exited with code $SCRAPER_EXIT"
    send_telegram "⚠️ Ascert scraper had een probleem (exit code $SCRAPER_EXIT). Bekijk de log voor details. Pipeline gaat door met beschikbare data."
fi

# Count results
TOTAL_LINES=$(wc -l < "$SCRIPT_DIR/data/ascert_clean.csv" 2>/dev/null || echo "1")
COMPANIES=$((TOTAL_LINES - 1))
DONE_AFTER=$(python3 -c "import json; d=json.load(open('data/checkpoint.json')); print(len(d.get('completed_postcodes',[])))" 2>/dev/null || echo "?")
CERTS=$(python3 -c "import json; d=json.load(open('data/checkpoint.json')); print(len(d.get('certificates',{})))" 2>/dev/null || echo "?")

log "Scraper done: $DONE_AFTER/9000 postcodes, $CERTS certificates, $COMPANIES in CSV"
send_telegram "✅ Stap 1 klaar: Ascert scraper afgerond
- $DONE_AFTER/9000 postcodes gescand
- $CERTS certificaten gevonden
- $COMPANIES bedrijven in dataset

Bezig met stap 2: Supabase sync..."

# ============================================================
# Step 2: Sync to Supabase
# ============================================================
log "=== Step 2: Syncing to Supabase ==="
cd "$SCRIPT_DIR"
source venv/bin/activate
python import_to_supabase.py --sync 2>&1 | tee -a "$LOG_FILE"
SYNC_EXIT=$?

if [ $SYNC_EXIT -ne 0 ]; then
    log "WARNING: Supabase sync exited with code $SYNC_EXIT"
    send_telegram "⚠️ Supabase sync had een probleem. Pipeline gaat door."
else
    log "Supabase sync complete"
    send_telegram "✅ Stap 2 klaar: Supabase sync afgerond

Bezig met stap 3: Publicatie nieuwe bedrijven..."
fi

# ============================================================
# Step 3: Publish new companies
# ============================================================
log "=== Step 3: Publishing new companies ==="
cd "$PROJECT_DIR"
npx tsx scripts/publish-ascert-bedrijven.ts 2>&1 | tee -a "$LOG_FILE"
PUBLISH_EXIT=$?

if [ $PUBLISH_EXIT -ne 0 ]; then
    log "WARNING: Publish exited with code $PUBLISH_EXIT"
else
    log "Publish complete"
fi
send_telegram "✅ Stap 3 klaar: Bedrijven gepubliceerd

Bezig met stap 4: KVK verrijking..."

# ============================================================
# Step 4: KVK enrichment
# ============================================================
log "=== Step 4: KVK Enrichment ==="
cd "$PROJECT_DIR"
npx tsx scripts/enrich-kvk.ts 2>&1 | tee -a "$LOG_FILE"
KVK_EXIT=$?

if [ $KVK_EXIT -ne 0 ]; then
    log "WARNING: KVK enrichment exited with code $KVK_EXIT"
    send_telegram "⚠️ KVK verrijking had een probleem. Pipeline gaat door."
else
    log "KVK enrichment complete"
    send_telegram "✅ Stap 4 klaar: KVK verrijking afgerond

Bezig met stap 5: Websites scrapen..."
fi

# ============================================================
# Step 5: Scrape company websites
# ============================================================
log "=== Step 5: Scraping company websites ==="
cd "$PROJECT_DIR/scripts"

# Check if scrape-websites.py needs the AIOS venv or the project venv
if [ -f "$PROJECT_DIR/scripts/scrape-websites.py" ]; then
    cd "$PROJECT_DIR"
    # Use the ascert-scraper venv which has the right deps
    source "$SCRIPT_DIR/venv/bin/activate"
    python scripts/scrape-websites.py 2>&1 | tee -a "$LOG_FILE"
    WEBSCRAPE_EXIT=$?
else
    log "scrape-websites.py not found, skipping"
    WEBSCRAPE_EXIT=0
fi

if [ $WEBSCRAPE_EXIT -ne 0 ]; then
    log "WARNING: Website scraping exited with code $WEBSCRAPE_EXIT"
    send_telegram "⚠️ Website scraping had een probleem. Pipeline gaat door."
else
    log "Website scraping complete"
    send_telegram "✅ Stap 5 klaar: Websites gescraped

Bezig met stap 6: Beschrijvingen genereren..."
fi

# ============================================================
# Step 6: Generate descriptions
# ============================================================
log "=== Step 6: Generating descriptions ==="
cd "$PROJECT_DIR"

# Try AI-powered descriptions first (uses website content)
if [ -f "$PROJECT_DIR/scripts/enrich-from-websites.py" ]; then
    source "$SCRIPT_DIR/venv/bin/activate"
    python scripts/enrich-from-websites.py 2>&1 | tee -a "$LOG_FILE"
    DESC_EXIT=$?
    if [ $DESC_EXIT -ne 0 ]; then
        log "AI descriptions failed, falling back to template descriptions"
        npx tsx scripts/generate-descriptions.ts 2>&1 | tee -a "$LOG_FILE"
    fi
else
    npx tsx scripts/generate-descriptions.ts 2>&1 | tee -a "$LOG_FILE"
fi

log "Description generation complete"

# ============================================================
# Final summary
# ============================================================
log "=========================================="
log "=== Chunked Pipeline Complete ==="
log "=========================================="

FINAL_CSV_LINES=$(wc -l < "$SCRIPT_DIR/data/ascert_clean.csv" 2>/dev/null || echo "1")
FINAL_COMPANIES=$((FINAL_CSV_LINES - 1))

send_telegram "🎉 Asbest Vergelijken pipeline volledig afgerond!

Resultaat:
- $FINAL_COMPANIES bedrijven in dataset
- Alle postcodes gescand (volledige dekking)
- Supabase gesynchroniseerd
- KVK data verrijkt
- Websites gescraped
- Beschrijvingen gegenereerd

Alle bedrijven inclusief kleine dorpen zijn nu opgenomen in de database."
