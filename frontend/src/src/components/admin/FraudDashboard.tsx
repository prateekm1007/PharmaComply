import React, { useState } from 'react';
import { useFraudMetrics } from '@/hooks/useFraudMetrics';
import { AlertAcknowledgeModal } from './shared/AlertAcknowledgeModal';
import { ShieldAlert, TrendingUp, Users, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export function FraudDashboard() {
  const { data, isLoading, acknowledgeAlert } = useFraudMetrics();
  const [selectedAlertId, setSelectedAlertId] = useState<string | null>(null);

  if (isLoading || !data) {
    return <div className="p-8 text-center text-gray-500">Loading security intelligence...</div>;
  }

  return (
    <div className="p-6 space-y-8 bg-gray-50/50 min-h-screen">
      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Security Intelligence</h1>
          <p className="text-gray-500">Insider threat detection and anomaly monitoring</p>
        </div>
        <div className="text-xs text-gray-400">
          Last updated: {new Date(data.meta.generated_at).toLocaleTimeString()}
        </div>
      </header>

      {/* ALERT SUMMARY */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <SummaryCard 
          label="Critical Alerts" 
          count={data.alerts_summary.critical} 
          color="bg-red-50 text-red-700 border-red-200" 
        />
        <SummaryCard 
          label="High Priority" 
          count={data.alerts_summary.high} 
          color="bg-orange-50 text-orange-700 border-orange-200" 
        />
        <SummaryCard 
          label="Medium Priority" 
          count={data.alerts_summary.medium} 
          color="bg-yellow-50 text-yellow-700 border-yellow-200" 
        />
        <SummaryCard 
          label="Low Priority" 
          count={data.alerts_summary.low} 
          color="bg-blue-50 text-blue-700 border-blue-200" 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* VELOCITY ANOMALIES */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-indigo-600" />
              Velocity Anomalies
            </CardTitle>
          </CardHeader>
          <CardContent>
            {data.velocity_anomalies.length === 0 ? (
              <EmptyState message="No velocity outliers detected" />
            ) : (
              <div className="space-y-4">
                {data.velocity_anomalies.map((a) => (
                  <div key={a.admin_id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg border">
                    <div>
                      <p className="font-medium text-sm">{a.email}</p>
                      <p className="text-xs text-gray-500">{a.approval_count} approvals / 24h</p>
                    </div>
                    <div className="text-right">
                      <span className="text-red-600 font-mono font-bold text-sm">
                        {Number(a.z_score).toFixed(2)}σ
                      </span>
                      <p className="text-[10px] text-gray-400">Deviation</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* COLLUSION DETECTION */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5 text-purple-600" />
              Collusion Patterns
            </CardTitle>
          </CardHeader>
          <CardContent>
            {data.collusion_candidates.length === 0 ? (
              <EmptyState message="No suspicious reciprocal pairs found" />
            ) : (
              <div className="space-y-4">
                {data.collusion_candidates.map((c, i) => (
                  <div key={i} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg border">
                    <div className="flex items-center gap-3">
                      <div className="text-xs">
                        <p>{c.admin_a_email}</p>
                        <div className="text-center text-gray-400 my-1">↕</div>
                        <p>{c.admin_b_email}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-amber-600 font-bold">{c.pair_count}</span>
                      <p className="text-[10px] text-gray-400">Reciprocals</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* RECENT ALERTS LIST */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-gray-700" />
            Recent Alerts
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y">
            {data.recent_alerts.map((alert) => (
              <div key={alert.id} className="p-4 flex items-center justify-between hover:bg-gray-50 transition">
                <div className="flex items-center gap-3">
                  <div className={`w-2 h-2 rounded-full ${
                    alert.severity === 'critical' ? 'bg-red-500' : 
                    alert.severity === 'high' ? 'bg-orange-500' : 'bg-blue-500'
                  }`} />
                  <div>
                    <p className="font-medium text-sm text-gray-900">{alert.event_type}</p>
                    <p className="text-xs text-gray-500">{new Date(alert.created_at).toLocaleString()}</p>
                  </div>
                </div>
                
                {alert.acknowledged ? (
                  <span className="flex items-center text-xs text-green-600 bg-green-50 px-2 py-1 rounded">
                    <CheckCircle className="w-3 h-3 mr-1" /> Resolved
                  </span>
                ) : (
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="h-8"
                    onClick={() => setSelectedAlertId(alert.id)}
                  >
                    Resolve
                  </Button>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* ACKNOWLEDGE MODAL */}
      <AlertAcknowledgeModal
        alertId={selectedAlertId}
        isOpen={!!selectedAlertId}
        onClose={() => setSelectedAlertId(null)}
        onConfirm={async (payload) => {
          if (selectedAlertId) {
            await acknowledgeAlert({ alertId: selectedAlertId, ...payload });
          }
        }}
      />
    </div>
  );
}

function SummaryCard({ label, count, color }: any) {
  return (
    <div className={`p-4 rounded-lg border ${color}`}>
      <div className="text-3xl font-bold">{count}</div>
      <div className="text-sm font-medium opacity-80">{label}</div>
    </div>
  );
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-8 text-gray-400">
      <ShieldCheck className="w-8 h-8 mb-2 opacity-20" />
      <p className="text-sm">{message}</p>
    </div>
  );
}
// Icon import needed for empty state fallback
import { ShieldCheck } from 'lucide-react';
