"""
POST /api/admin/case/open
Creates case + optional audit link assignments
"""

import json
from shared.supabase_client import get_supabase_client
from shared.auth import require_role

@require_role("admin")
async def handler(event, context):
    user = event["verified_user"]
    body = json.loads(event.get("body") or "{}")
    severity = body.get("severity")
    audit_ids = body.get("audit_ids", [])

    if not severity:
        return {"statusCode": 400, "body": json.dumps({"error": "severity_required"})}

    db = get_supabase_client()

    case = db.client.table("incident_cases").insert({
        "created_by": user["user_id"],
        "severity": severity,
        "metadata": body.get("metadata"),
    }).execute().data[0]

    if audit_ids:
        link_rows = [{"case_id": case["id"], "audit_id": aid} for aid in audit_ids]
        db.client.table("incident_case_links").insert(link_rows).execute()

    return {
        "statusCode": 200,
        "body": json.dumps({"case": case})
    }
