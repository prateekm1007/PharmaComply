"""
POST /api/admin/hash/append
Body: { audit_log_id }
Appends new audit hash based on latest link
"""

from shared.supabase_client import get_supabase_client
from shared.auth import require_role
from shared.hash_chain import compute_record_hash

@require_role("admin")
async def handler(event, context):
    db = get_supabase_client()
    body = event.get("body") or "{}"
    audit_id = body.get("audit_log_id")

    # fetch target
    r = (
      db.client.table("approval_audit_log")
      .select("*")
      .eq("id", audit_id)
      .single()
      .execute()
      .data
    )

    # get previous hash
    prev = (
      db.client.table("approval_audit_log")
      .select("integrity_hash")
      .order("created_at", desc=True)
      .limit(1)
      .execute()
      .data
    )
    prev_hash = prev[0]["integrity_hash"] if prev else ""

    new_hash = compute_record_hash(r, prev_hash)

    db.client.table("approval_audit_log").update(
       {"integrity_hash": new_hash}
    ).eq("id", audit_id).execute()

    return {"statusCode": 200, "body": {"hash": new_hash}}
