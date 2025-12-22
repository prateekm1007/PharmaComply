"""
GET /api/admin/export/evidence.zip
Generates auditable bundle:
- approval_audit_log
- chain_anchor_events
- fraud_alerts
- manifest.json (signed)
Returns .zip
"""

import json, os, io, hashlib, zipfile
from datetime import datetime
from shared.supabase_client import get_supabase_client
from shared.auth import require_role

@require_role("super_admin")
async def handler(event, context):
    db = get_supabase_client()

    # fetch audit tables
    logs = db.client.table("approval_audit_log").select("*").execute().data
    chain = db.client.table("chain_anchor_events").select("*").execute().data
    alerts = db.client.table("fraud_alerts").select("*").execute().data

    # manifest + signature
    manifest = {
        "generated_at": datetime.utcnow().isoformat(),
        "rows": {
            "audit_logs": len(logs),
            "chain_anchors": len(chain),
            "fraud_alerts": len(alerts),
        }
    }
    payload = json.dumps(manifest, sort_keys=True).encode()
    sig = hashlib.sha256(payload).hexdigest()

    mem = io.BytesIO()
    with zipfile.ZipFile(mem,"w",zipfile.ZIP_DEFLATED) as z:
        z.writestr("audit_logs.json", json.dumps(logs, default=str))
        z.writestr("anchor_chain.json", json.dumps(chain, default=str))
        z.writestr("fraud_alerts.json", json.dumps(alerts, default=str))
        z.writestr("manifest.json", json.dumps(manifest, indent=2))
        z.writestr("signature.sha256", sig)

    mem.seek(0)

    return {
        "statusCode": 200,
        "headers": {
            "Content-Type": "application/zip",
            "Content-Disposition": "attachment; filename=evidence_bundle.zip",
        },
        "body": mem.getvalue(),
        "isBase64Encoded": True,
    }
