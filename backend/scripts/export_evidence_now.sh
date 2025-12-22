#!/bin/bash
curl -o evidence_$(date +%s).zip \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  https://project-url.netlify.app/api/admin/export/evidence.zip
