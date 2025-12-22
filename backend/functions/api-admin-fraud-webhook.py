"""
Supabase webhook target:
Triggers on INSERT INTO fraud_alerts
Dispatches Slack + email notification.
"""

import json, os
import requests
from shared.auth import internal_auth_required

SLACK_WEBHOOK = os.getenv("SLACK_WEBHOOK_URL")
ALERT_EMAIL = os.getenv("SECOPS_EMAIL")
MAIL_API = os.getenv("MAIL_API_ENDPOINT")
MAIL_KEY = os.getenv("MAIL_API_KEY")

@internal_auth_required
async def handler(event, context):
    rec = json.loads(event["body"])["record"]

    msg = f"""
🚨 FRAUD ALERT
Severity: {rec['severity']}
Actor: {rec.get('actor_email')}
Event: {rec['event_type']}
Time: {rec['created_at']}
"""

    # Slack dispatch
    if SLACK_WEBHOOK:
        try:
            requests.post(SLACK_WEBHOOK, json={"text": msg}, timeout=5)
        except Exception:
            pass

    # Email dispatch
    if MAIL_API and ALERT_EMAIL:
        try:
            requests.post(
              MAIL_API,
              headers={"Authorization": f"Bearer {MAIL_KEY}"},
              json={"to": ALERT_EMAIL, "subject": "Fraud Alert", "text": msg},
              timeout=5
            )
        except Exception:
            pass

    return {
      "statusCode": 200,
      "body": json.dumps({"ok": True})
    }
