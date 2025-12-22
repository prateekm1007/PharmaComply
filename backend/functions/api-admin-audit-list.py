"""
GET /api/admin/audit?page=1&limit=50
"""

import json
from shared.supabase_client import get_supabase_client
from shared.auth import require_role

@require_role("admin")
async def handler(event, context):
    qs = event.get("queryStringParameters") or {}
    page = int(qs.get("page", 1))
    limit = int(qs.get("limit", 50))
    offset = (page - 1) * limit

    db = get_supabase_client()
    result = db.client.table("approval_audit_log")\
        .select("*")\
        .order("created_at", desc=True)\
        .range(offset, offset + limit - 1)\
        .execute()

    return {
        "statusCode": 200,
        "headers": { "Content-Type": "application/json" },
        "body": json.dumps({"data": result.data, "page": page})
    }
