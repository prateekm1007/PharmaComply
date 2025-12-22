#!/bin/bash
set -e

echo "$(date) running detectors" >> ~/detector.log

# run velocity anomaly RPC
vel=$(curl -s https://project-url.netlify.app/api/admin/fraud-metrics | jq '.velocity_anomalies')
if [[ $vel != "[]" ]]; then
  curl -s -X POST https://project-url.netlify.app/api/admin/alert/ack >/dev/null
fi

# run collusion RPC
col=$(curl -s https://project-url.netlify.app/api/admin/fraud-metrics | jq '.collusion_candidates')
if [[ $col != "[]" ]]; then
  curl -s -X POST https://project-url.netlify.app/api/admin/alert/ack >/dev/null
fi

echo "$(date) detector finished" >> ~/detector.log
