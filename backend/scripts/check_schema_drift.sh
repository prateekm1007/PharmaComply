#!/bin/bash
set -euo pipefail

EXPECTED="./backend/schema.sql"
OUTPUT="./backend/tmp_schema_dump.sql"

pg_dump --schema-only --no-owner "$DATABASE_URL" > "$OUTPUT"

sort "$EXPECTED" > ./backend/schema.expected.sorted
sort "$OUTPUT" > ./backend/schema.live.sorted

DIFF=$(diff ./backend/schema.expected.sorted ./backend/schema.live.sorted || true)

if [ -n "$DIFF" ]; then
  echo "❌ Schema drift detected"
  echo "$DIFF"
  exit 1
else
  echo "✔ Schema matches"
fi
