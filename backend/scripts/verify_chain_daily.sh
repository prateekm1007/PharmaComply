#!/bin/bash
set -e

resp=$(curl -s https://project-url.netlify.app/api/chain/verify)
echo "$(date) - $resp" >> ~/chain_verify.log

# auto alert if invalid
if [[ $resp == *"false"* ]]; then
  echo "$(date) ALERT chain compromised" >> ~/chain_verify.log
fi
