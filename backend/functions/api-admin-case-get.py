"""
GET /api/admin/case/:id
Fetch case + linked audit entries
"""

import json
from shared.supabase_client import get_supabase_client
from shared.auth import require_role

@require_role("admin")
async def handler(event, context):
    db = get_supabase_client()
    case_id = event["path"].split("/")[-1]

    case = db.client.table("incident_cases")\
        .select("*")\
        .eq("id", case_id)\
        .single()\
        .execute().data

    if not case:
        return {"statusCode": 404, "body": json.dumps({"error": "case_not_found"})}

    linked = db.client.table("incident_case_links")\
        .select("*")\
        .eq("case_id", case_id)\
        .execute().data

    return {
        "statusCode": 200,
        "body": json.dumps({
            "case": case,
            "linked_audit": linked,
        })
    }
