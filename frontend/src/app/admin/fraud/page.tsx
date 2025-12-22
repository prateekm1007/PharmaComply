import { fetchFraudAlerts } from "@/src/lib/fetchFraudAlerts";

export default async function FraudAlertsPage() {
  const alerts = await fetchFraudAlerts();

  return (
    <div>
      <h1 className="text-xl font-bold mb-4">Fraud Alerts</h1>

      {alerts.length === 0 && (
        <p className="text-gray-500">No fraud alerts detected.</p>
      )}

      <ul className="space-y-3">
        {alerts.map((a: any) => (
          <li key={a.id} className="border p-3 rounded">
            <div className="font-semibold">{a.actor_email}</div>
            <div>risk score: {a.risk_score}</div>
            <div>{a.reason}</div>
            <div className="text-xs text-gray-500">{a.timestamp}</div>
          </li>
        ))}
      </ul>
    </div>
  );
}
