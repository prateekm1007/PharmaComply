import { ackAlert, createIncident } from "../../services/api/alert";

export default function AlertsPage() {
  const [alerts, setAlerts] = useState([]);

  useEffect(() => {
    fetch("/api/admin/fraud-metrics")
      .then(r => r.json())
      .then(d => setAlerts(d.recent_alerts));
  }, []);

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-xl font-bold">Security Alerts</h1>
      {alerts.map((a) => (
        <div key={a.id} className="border rounded p-3 flex justify-between">
          <div>
            <div>{a.event_type}</div>
            <div className="text-xs text-gray-500">{a.severity}</div>
          </div>
          <div className="space-x-2">
            <button onClick={() => ackAlert(a.id)}>Ack</button>
            <button onClick={() => createIncident(a.id)}>Open Case</button>
          </div>
        </div>
      ))}
    </div>
  );
}
