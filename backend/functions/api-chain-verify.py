"""
GET /api/chain/verify
Verifies entire audit chain and returns status
"""

from shared.supabase_client import get_supabase_client
from shared.hash_chain import compute_record_hash

async def handler(event, context):
    db = get_supabase_client()
    logs = db.client.table("approval_audit_log")\
      .select("*")\
      .order("created_at", asc=True)\
      .execute().data

    prev = ""
    for row in logs:
        computed = compute_record_hash(row, prev)
        if row.get("integrity_hash") != computed:
            return {"statusCode": 200, "body": {"valid": False}}

        prev = computed

    return {"statusCode": 200, "body": {"valid": True}}
