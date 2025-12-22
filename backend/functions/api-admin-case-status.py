"""
POST /api/admin/case/:id/status
Fields:
  - status: investigating | resolved
"""

import json
from shared.supabase_client import get_supabase_client
from shared.auth import require_role

@require_role("admin")
async def handler(event, context):
    body = json.loads(event.get("body") or "{}")
    new_status = body.get("status")
    case_id = event["path"].split("/")[-2]

    if new_status not in ("investigating", "resolved"):
        return {"statusCode": 400, "body": json.dumps({"error": "invalid_status"})}

    db = get_supabase_client()
    user = event["verified_user"]

    # update status
    db.client.table("incident_cases")\
        .update({"status": new_status})\
        .eq("id", case_id)\
        .execute()

    # append timeline event
    db.client.table("incident_case_timeline")\
        .insert({
            "case_id": case_id,
            "actor_id": user["user_id"],
            "event": f"status_changed_to_{new_status}"
        }).execute()

    return {
        "statusCode": 200,
        "body": json.dumps({"status": "ok"})
    }
