from shared.supabase_client import get_supabase_client

async def raise_fraud_alert(event_type, severity, actor_id=None, actor_email=None, evidence=None):
    db = get_supabase_client()
    return db.client.table("fraud_alerts").insert({
        "severity": severity,
        "actor_id": actor_id,
        "actor_email": actor_email,
        "event_type": event_type,
        "evidence": evidence or {}
    }).execute()
