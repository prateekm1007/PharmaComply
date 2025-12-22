"""
GET /api/admin/cases/overdue-count
"""
import json
from shared.supabase_client import get_supabase_client
from shared.auth import require_role

@require_role("admin")
async def handler(event, context):
    db = get_supabase_client()

    rows = (
        db.client
        .from_("incident_cases_overdue")
        .select("id", count="exact")
        .eq("overdue", True)
        .execute()
    )

    return {
        "statusCode": 200,
        "body": json.dumps({"overdue_count": rows.count})
    }
