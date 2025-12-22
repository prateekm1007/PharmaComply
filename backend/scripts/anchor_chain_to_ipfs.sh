#!/bin/bash
set -e

DB_URL="$DATABASE_URL"

LATEST_HASH=$(psql "$DB_URL" -t -A -c \
  "SELECT integrity_hash FROM approval_audit_log ORDER BY created_at DESC LIMIT 1")

ipfs add -q <<< "$LATEST_HASH" >> ../ipfs_anchor.log

echo "$(date -u) anchored: $LATEST_HASH" >> ../ipfs_anchor.log
