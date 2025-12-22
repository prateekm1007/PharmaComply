from shared.supabase_client import get_supabase_client

def create_alert(event_type, severity, metadata=None):
    db = get_supabase_client()
    payload = {
        "event_type": event_type,
        "severity": severity,
        "metadata": metadata or {},
        "acknowledged": False
    }
    return db.client.table("fraud_alerts").insert(payload).execute()

def maybe_alert_velocity(anomalies):
    if anomalies:
        create_alert("velocity_anomaly_detected", "high", anomalies)

def maybe_alert_collusion(candidates):
    if candidates:
        create_alert("collusion_detected", "critical", candidates)
