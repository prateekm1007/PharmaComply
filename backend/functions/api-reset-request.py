"""
POST /api/reset/submit

Creates a reset request entry for usage_resets table.
Server applies cooldown + velocity checks later when approvals happen.
"""

import json
from shared.supabase_client import get_supabase_client
from shared.auth import require_role

@require_role("org_admin")
async def handler(event, context):
    body = json.loads(event.get("body", "{}"))
    
    user_id = event["verified_user"]["user_id"]
    amount = body.get("amount")
    reason = body.get("reason")
    org_id = body.get("organization_id")

    if not amount or not reason or not org_id:
        return {"statusCode": 400, "body": json.dumps({"error": "Missing fields"})}
    
    db = get_supabase_client()

    insert = db.client.table("usage_resets").insert({
        "organization_id": org_id,
        "admin_id": user_id,
        "reset_amount": amount,
        "reset_percentage": amount, 
        "reason": reason,
        "status": "pending"
    }).execute()

    return {
        "statusCode": 200,
        "body": json.dumps({
            "message": "Request submitted",
            "request_id": insert.data[0]["id"]
        })
    }
