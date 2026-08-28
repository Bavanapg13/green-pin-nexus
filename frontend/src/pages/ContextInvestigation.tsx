import { useState, useEffect } from 'react';
import Card from '../components/Card';
import Badge from '../components/Badge';
import { api } from '../services/api';
import { Search, AlertCircle, FileText, CheckCircle, Sparkles, Cpu } from 'lucide-react';

export default function ContextInvestigation() {
  const [eventId, setEventId] = useState('EVT-C1-04');
  const [context, setContext] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const fetchContext = async (id: string) => {
    if (!id) return;
    setLoading(true);
    setEventId(id);
    try {
      const data = await api.getContext(id);
      setContext(data);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  useEffect(() => {
    // Initial fetch for key critical attack event
    fetchContext('EVT-C1-04');
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (eventId) fetchContext(eventId);
  };

  const sampleEvents = [
    { id: 'EVT-C1-04', title: 'High-Value Payment to Novel Beneficiary', user: 'EMP-1042', risk: 'CRITICAL', color: 'border-red-500/60 bg-red-500/10 text-red-400' },
    { id: 'EVT-C2-04', title: 'Off-Hours Permission Change (Failover)', user: 'EMP-1098', risk: 'MODERATE', color: 'border-amber-500/60 bg-amber-500/10 text-amber-400' },
    { id: 'EVT-C1-02', title: 'Unverified Beneficiary Modification', user: 'EMP-1042', risk: 'HIGH', color: 'border-orange-500/60 bg-orange-500/10 text-orange-400' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight mb-2">Context Investigation & Explainability</h1>
        <p className="text-slate-400">Deep-dive into multi-source evidence and AI reasoning behind flagged privileged actions.</p>
      </div>

      {/* Quick Select Events */}
      <Card className="p-4">
        <div className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-2">
          <Sparkles size={14} className="text-primary" />
          Quick Inspect Key Security Events:
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {sampleEvents.map((evt) => (
            <button
              key={evt.id}
              onClick={() => fetchContext(evt.id)}
              className={`p-3 rounded-lg border text-left transition-all flex flex-col justify-between ${
                eventId === evt.id
                  ? `${evt.color} shadow-[0_0_12px_rgba(16,185,129,0.15)] ring-2 ring-primary/40`
                  : 'bg-darker hover:bg-slate-800/80 border-slate-700/60 text-slate-300'
              }`}
            >
              <div className="flex justify-between items-center mb-1">
                <span className="font-mono text-xs font-bold text-slate-200">{evt.id}</span>
                <Badge level={evt.risk} />
              </div>
              <div className="font-semibold text-sm text-slate-100">{evt.title}</div>
              <div className="text-xs text-slate-400 mt-1">User: <span className="font-mono text-slate-300">{evt.user}</span></div>
            </button>
          ))}
        </div>
      </Card>

      {/* Search Input Bar */}
      <Card>
        <form onSubmit={handleSearch} className="flex gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            <input
              type="text"
              placeholder="Enter Event ID (e.g. EVT-C1-04, EVT-C2-04, EVT-C1-02)"
              className="w-full bg-darker border border-slate-700 rounded-lg pl-10 pr-4 py-2.5 focus:outline-none focus:border-primary text-slate-200 text-sm font-mono"
              value={eventId}
              onChange={(e) => setEventId(e.target.value)}
            />
          </div>
          <button
            type="submit"
            className="bg-primary hover:bg-primaryDark text-darker font-bold px-6 py-2.5 rounded-lg transition-colors text-sm flex items-center gap-2"
            disabled={loading}
          >
            {loading ? <Cpu className="animate-spin" size={16} /> : <FileText size={16} />}
            {loading ? 'Analyzing...' : 'Analyze Event Context'}
          </button>
        </form>
      </Card>

      {context && context.event && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card title="Event Telemetry" className="lg:col-span-1">
            <div className="space-y-4">
              <div>
                <div className="text-xs text-slate-400 uppercase font-semibold mb-1">Risk Classification</div>
                <Badge level={context.event.risk} />
              </div>
              <div>
                <div className="text-xs text-slate-400 uppercase font-semibold mb-1">Event Identifier</div>
                <div className="font-mono font-medium text-slate-200 text-sm">{context.event.id}</div>
              </div>
              <div>
                <div className="text-xs text-slate-400 uppercase font-semibold mb-1">Privileged User ID</div>
                <div className="font-mono font-medium text-primary text-sm">{context.event.userId}</div>
              </div>
              <div>
                <div className="text-xs text-slate-400 uppercase font-semibold mb-1">Privileged Action</div>
                <div className="font-semibold text-slate-200">{context.event.action}</div>
              </div>
              {context.event.amount && (
                <div>
                  <div className="text-xs text-slate-400 uppercase font-semibold mb-1">Transaction Value</div>
                  <div className="font-mono font-bold text-red-400 text-lg">₹{context.event.amount.toLocaleString()}</div>
                </div>
              )}
              <div>
                <div className="text-xs text-slate-400 uppercase font-semibold mb-1">Logged Timestamp</div>
                <div className="text-slate-300 font-mono text-xs">{new Date(context.event.timestamp).toLocaleString()}</div>
              </div>
            </div>
          </Card>

          <Card title="Explainable AI Reasoning" className="lg:col-span-2">
            <div className="flex items-start gap-3.5 p-4 bg-slate-800/60 rounded-lg border border-slate-700/80 mb-6">
              <AlertCircle className="text-amber-400 shrink-0 mt-0.5" size={20} />
              <div>
                <h4 className="font-semibold text-slate-200 text-sm mb-1.5">Decision Rationale</h4>
                <p className="text-slate-300 leading-relaxed text-sm">
                  {context.explanation}
                </p>
              </div>
            </div>

            <h4 className="font-semibold text-slate-300 text-sm mb-3">Correlated Multi-Engine Evidence</h4>
            <div className="space-y-2.5">
              {context.evidence?.map((item: string, i: number) => (
                <div key={i} className="flex items-start gap-3 p-3 bg-darker rounded-lg border border-slate-800/80 text-slate-200 text-sm">
                  <FileText size={16} className="text-primary shrink-0 mt-0.5" />
                  <span>{item}</span>
                </div>
              ))}
              {(!context.evidence || context.evidence.length === 0) && (
                <div className="text-slate-500 italic text-sm">No correlated evidence available.</div>
              )}
            </div>
            
            {context.isLegitimateException && (
              <div className="mt-6 flex items-start gap-3.5 p-4 bg-emerald-500/10 rounded-lg border border-emerald-500/30">
                <CheckCircle className="text-emerald-400 shrink-0 mt-0.5" size={20} />
                <div>
                  <h4 className="font-semibold text-emerald-400 text-sm mb-1">Legitimate Exception Verified</h4>
                  <p className="text-slate-300 text-sm">
                    {context.exceptionReason || "System correlated this activity with an active ITSM ticket, Sev-1 incident, and authorized change window."}
                  </p>
                </div>
              </div>
            )}
          </Card>
        </div>
      )}
    </div>
  );
}
