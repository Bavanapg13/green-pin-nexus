import { useState, useEffect } from 'react';
import Card from '../components/Card';
import Badge from '../components/Badge';
import { History, ShieldAlert, CheckCircle, RefreshCw } from 'lucide-react';

export default function IncidentHistory() {
  const [responses, setResponses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchResponses = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/responses');
      if (res.ok) {
        const data = await res.json();
        setResponses(data);
      }
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchResponses();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-2">Simulated Containment & Incident History</h1>
          <p className="text-slate-400">Chronological log of automated containment and SOC analyst response actions.</p>
        </div>
        <button
          onClick={fetchResponses}
          className="flex items-center gap-2 px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-sm border border-slate-700 transition-colors"
        >
          <RefreshCw size={15} className={loading ? 'animate-spin' : ''} />
          Refresh Log
        </button>
      </div>

      <Card>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-slate-400 uppercase bg-slate-800/50">
              <tr>
                <th className="px-4 py-3">Timestamp</th>
                <th className="px-4 py-3">Event Ref</th>
                <th className="px-4 py-3">Action Executed</th>
                <th className="px-4 py-3">Containment Type</th>
                <th className="px-4 py-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {responses.map((item, idx) => (
                <tr key={item.id || idx} className="border-b border-slate-800/50 hover:bg-slate-800/20">
                  <td className="px-4 py-3 text-slate-400 whitespace-nowrap">
                    {new Date(item.timestamp).toLocaleString()}
                  </td>
                  <td className="px-4 py-3 font-mono text-slate-300">{item.event_id}</td>
                  <td className="px-4 py-3 font-semibold text-primary">{item.action}</td>
                  <td className="px-4 py-3 text-slate-400">
                    {item.action === 'HOLD_PAYMENT' ? 'Automated Transaction Hold' :
                     item.action === 'RESTRICT_SESSION' ? 'PAM Session Revocation' : 'SecOps Level 3 Escalation'}
                  </td>
                  <td className="px-4 py-3">
                    <span className="px-2.5 py-1 rounded text-xs bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-medium">
                      EXECUTED — SIMULATION
                    </span>
                  </td>
                </tr>
              ))}
              {responses.length === 0 && (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-slate-500 italic">
                    No simulated responses recorded yet. Take action on an alert in the Response Center.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
