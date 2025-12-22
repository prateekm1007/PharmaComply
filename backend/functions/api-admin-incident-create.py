"""
POST /api/admin/incident/create
Body: { alert_id }
"""

from shared.supabase_client import get_supabase_client
from shared.auth import require_role

@require_role("admin")
async def handler(event, context):
    db = get_supabase_client()

    body = event.get("body") or {}
    alert_id = body.get("alert_id")

    case = (
      db.client.table("incident_cases")
      .insert({"source_alert_id": alert_id, "status": "open"})
      .execute()
      .data
    )[0]

    (
      db.client.table("fraud_alerts")
      .update({"incident_case_id": case["id"]})
      .eq("id", alert_id)
      .execute()
    )

    return {"statusCode": 200, "body": {"case": case}}
