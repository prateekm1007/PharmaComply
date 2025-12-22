#!/bin/bash
set -euo pipefail

MIGRATIONS_DIR="./backend/migrations"
LOGFILE="./backend/migrations.log"

touch "$LOGFILE"

for migration in $(ls "$MIGRATIONS_DIR"/*.sql 2>/dev/null | sort); do
  if ! grep -q "$(basename $migration)" "$LOGFILE"; then
    echo "Applying: $migration"
    psql "$DATABASE_URL" -f "$migration"
    echo "$(basename $migration)" >> "$LOGFILE"
  fi
done

echo "All migrations applied."
