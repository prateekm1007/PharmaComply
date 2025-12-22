"""
POST /api/admin/alert/ack
Body: { alert_id }
"""

from shared.supabase_client import get_supabase_client
from shared.auth import require_role

@require_role("admin")
async def handler(event, context):
    db = get_supabase_client()

    body = event.get("body") or {}
    alert_id = body.get("alert_id")

    db.client.table("fraud_alerts")\
       .update({"acknowledged": True})\
       .eq("id", alert_id)\
       .execute()

    return {"statusCode": 200, "body": "acknowledged"}
