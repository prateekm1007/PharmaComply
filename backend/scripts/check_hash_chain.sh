#!/bin/bash
set -e

DB_URL="$DATABASE_URL"

SQL="
SELECT id, previous_hash, integrity_hash
FROM approval_audit_log
ORDER BY id ASC;
"

prev=""

while read -r id prev_hash integrity_hash; do
  if [ -n "$prev" ] && [ "$prev" != "$prev_hash" ]; then
    echo "❌ Hash chain broken at audit id $id"
    exit 1
  fi
  prev="$integrity_hash"
done < <(psql "$DB_URL" -t -A -F' ' -c "$SQL")

echo \"✔ Hash chain verified OK\"
