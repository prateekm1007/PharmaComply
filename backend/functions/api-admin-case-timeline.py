"""
GET /api/admin/case/:id/timeline
"""

import json
from shared.supabase_client import get_supabase_client
from shared.auth import require_role

@require_role("admin")
async def handler(event, context):
    case_id = event["path"].split("/")[-2]
    db = get_supabase_client()

    rows = db.client.table("incident_case_timeline")\
        .select("*")\
        .eq("case_id", case_id)\
        .order("created_at", desc=True)\
        .execute().data

    return {
        "statusCode": 200,
        "body": json.dumps(rows)
    }
