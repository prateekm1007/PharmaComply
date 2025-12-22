"""
GET /api/admin/audit/export?reset_id=UUID

Exports audit chain + verification status in JSON.
"""

import json
from datetime import datetime

from shared.supabase_client import get_supabase_client
from shared.auth import require_role
from shared.verify_chain import verify_chain

@require_role("super_admin")
async def handler(event, context):
    params = event.get("queryStringParameters") or {}
    reset_id = params.get("reset_id")

    if not reset_id:
        return {"statusCode": 400, "body": json.dumps({"error": "reset_id required"})}

    db = get_supabase_client()

    result = db.client.rpc("get_audit_chain", {"p_reset_id": reset_id}).execute()
    records = result.data or []

    ok, index = verify_chain(records)

    return {
        "statusCode": 200,
        "headers": {"Content-Type": "application/json"},
        "body": json.dumps(
            {
                "reset_id": reset_id,
                "generated_at": datetime.utcnow().isoformat(),
                "valid_chain": ok,
                "invalid_index": index,
                "audit_chain": records,
            },
            default=str,
        ),
    }
