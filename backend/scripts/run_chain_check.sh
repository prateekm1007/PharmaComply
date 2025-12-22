#!/usr/bin/env bash
set -euo pipefail

curl -X POST \
  -H "Content-Type: application/json" \
  "$BACKEND_URL/api/admin/check-chain" \
  --fail
