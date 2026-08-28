import { useState, useEffect } from 'react';
import Card from '../components/Card';
import { api } from '../services/api';
import { ShieldCheck, Calendar, User, Info, RefreshCw } from 'lucide-react';

export default function AuditLog() {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchLogs = () => {
    setLoading(true);
    api.getAuditLogs()
      .then((data) => {
        setLogs(data || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  const formatTimestamp = (isoString: string) => {
    try {
      const d = new Date(isoString);
      return d.toLocaleTimeString() + ' | ' + d.toLocaleDateString();
    } catch {
      return isoString;
    }
  };

  const getActionColor = (action: string) => {
    switch (action) {
      case 'LOGIN_SUCCESS': return 'text-emerald-400 font-bold bg-emerald-500/10 border-emerald-500/20';
      case 'LOGIN_FAILURE': return 'text-red-400 font-bold bg-red-500/10 border-red-500/20';
      case 'SESSION_EXPIRED': return 'text-orange-400 font-semibold bg-orange-500/10 border-orange-500/20';
      case 'LOGOUT': return 'text-slate-400 font-medium bg-slate-500/10 border-slate-500/20';
      case 'SIMULATED_RESPONSE': return 'text-red-400 font-bold bg-red-500/10 border-red-500/20';
      case 'SUPERVISOR_DECISION': return 'text-primary font-bold bg-primary/10 border-primary/20';
      default: return 'text-blue-400 font-medium bg-blue-500/10 border-blue-500/20';
    }
  };

  return (
    <div className="space-y-6 pb-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-2">Platform Audit Trail</h1>
          <p className="text-slate-400">
            Cryptographically integrity-checked audit logs recording supervisor and containment events.
          </p>
        </div>
        <button
          onClick={fetchLogs}
          className="flex items-center gap-1.5 px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-medium border border-slate-700 transition-colors"
        >
          <RefreshCw size={13} className={loading ? 'animate-spin' : ''} /> Refresh Logs
        </button>
      </div>

      {/* Audit Log Table */}
      <Card className="overflow-hidden border-slate-800">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-900/30 text-xs font-semibold uppercase tracking-wider text-slate-400">
                <th className="py-4 px-5">Timestamp</th>
                <th className="py-4 px-5">Supervisor</th>
                <th className="py-4 px-5">Event Action</th>
                <th className="py-4 px-5">Target Entity</th>
                <th className="py-4 px-5">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80 text-sm font-mono">
              {loading ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-slate-500">
                    Retrieving audit trail...
                  </td>
                </tr>
              ) : logs.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-slate-500 italic">
                    No audit log entries recorded in this session.
                  </td>
                </tr>
              ) : (
                logs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-850/40 transition-colors">
                    <td className="py-3.5 px-5 text-slate-400 text-xs flex items-center gap-2 whitespace-nowrap">
                      <Calendar size={13} className="text-slate-600 shrink-0" />
                      {formatTimestamp(log.timestamp)}
                    </td>
                    <td className="py-3.5 px-5 text-slate-300 text-xs font-semibold">
                      <span className="flex items-center gap-1.5">
                        <User size={13} className="text-slate-600 shrink-0" />
                        {log.supervisor_id}
                      </span>
                    </td>
                    <td className="py-3.5 px-5">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded border text-[10px] font-bold ${getActionColor(log.action)}`}>
                        {log.action}
                      </span>
                    </td>
                    <td className="py-3.5 px-5 text-xs text-slate-300 font-bold">
                      {log.target || 'N/A'}
                    </td>
                    <td className="py-3.5 px-5 text-xs text-slate-400 max-w-xs md:max-w-md truncate">
                      <span className="flex items-center gap-1.5">
                        <Info size={13} className="text-slate-700 shrink-0" />
                        {log.details || 'No additional details.'}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Security Info */}
      <div className="flex items-center gap-2 text-xs text-slate-500 font-mono">
        <ShieldCheck size={14} className="text-emerald-500 shrink-0" />
        <span>AUDIT TRAIL SECURED: Passwords, transaction payloads, and customer authentication hashes are strictly excluded from logs.</span>
      </div>
    </div>
  );
}
