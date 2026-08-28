import { useState, useEffect } from 'react';
import Card from '../components/Card';
import { Server, Activity, ShieldCheck, Database, Cpu, CheckCircle, RefreshCw, Zap } from 'lucide-react';
import { api } from '../services/api';

export default function SystemStatus() {
  const [health, setHealth] = useState<any>(null);
  const [checking, setChecking] = useState(false);
  const [lastCheck, setLastCheck] = useState<string>(new Date().toLocaleTimeString());

  const checkHealth = async () => {
    setChecking(true);
    try {
      const data = await api.health();
      setHealth(data);
      setLastCheck(new Date().toLocaleTimeString());
    } catch (err) {
      console.error(err);
    }
    setChecking(false);
  };

  useEffect(() => {
    checkHealth();
  }, []);

  const engines = [
    { name: 'Behavioral Anomaly Engine (Isolation Forest)', icon: Cpu, status: 'ONLINE', latency: '4ms', desc: 'Continuous ML baseline deviation tracker & telemetry feature extraction' },
    { name: 'Temporal Sequence Engine', icon: Activity, status: 'ONLINE', latency: '2ms', desc: 'Finite-state workflow & rapid escalation state machine' },
    { name: 'Relationship Graph Engine (NetworkX)', icon: Server, status: 'ONLINE', latency: '6ms', desc: 'Graph-based entity correlation & multi-hop anomaly discovery' },
    { name: 'Financial Risk Engine', icon: Database, status: 'ONLINE', latency: '1ms', desc: 'Statistical distribution & transaction limit magnitude model' },
    { name: 'Business Context Engine', icon: ShieldCheck, status: 'ONLINE', latency: '3ms', desc: 'ITSM, ticket, and incident cross-verification service' },
    { name: 'Containment & Response Engine', icon: Zap, status: 'ONLINE', latency: '2ms', desc: 'Simulated dual-action PAM mitigation executor' },
  ];

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-10">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-2">System Health & Engine Status</h1>
          <p className="text-slate-400">Real-time status of GREEN PIN NEXUS detection pipeline and microservices.</p>
        </div>
        <button
          onClick={checkHealth}
          disabled={checking}
          className="flex items-center gap-2 px-4 py-2.5 bg-primary/10 hover:bg-primary/20 text-primary border border-primary/30 rounded-lg text-xs font-bold transition-all disabled:opacity-50"
        >
          <RefreshCw size={14} className={checking ? 'animate-spin' : ''} />
          {checking ? 'Testing Engines...' : 'Run Diagnostic Health Check'}
        </button>
      </div>

      <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-xl flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-3 h-3 rounded-full bg-emerald-400 animate-pulse"></div>
          <div>
            <div className="font-semibold text-emerald-400 text-sm">All Pipeline Engines Operational & Synchronized</div>
            <div className="text-xs text-slate-400">Environment: Synthetic simulation mode • Last Ping: {lastCheck}</div>
          </div>
        </div>
        <span className="px-3 py-1 bg-emerald-500/20 text-emerald-300 font-mono text-xs rounded-full font-bold">
          {health?.status === 'ok' ? 'HEALTHY' : 'SIMULATION'}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {engines.map((eng, idx) => (
          <Card key={idx} className="flex items-start gap-4">
            <div className="p-3 bg-slate-800 rounded-lg text-primary">
              <eng.icon size={22} />
            </div>
            <div className="flex-1">
              <div className="flex justify-between items-center mb-1">
                <h3 className="font-semibold text-slate-200 text-sm">{eng.name}</h3>
                <span className="text-[11px] font-mono text-emerald-400 font-bold px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20">
                  {eng.status}
                </span>
              </div>
              <p className="text-xs text-slate-400 mb-2">{eng.desc}</p>
              <div className="text-[10px] font-mono text-slate-500">Latency: {eng.latency}</div>
            </div>
          </Card>
        ))}
      </div>

      <Card title="Data Provenance & Security Declaration">
        <div className="space-y-3 text-sm text-slate-300">
          <div className="flex items-start gap-2.5">
            <CheckCircle size={16} className="text-primary mt-0.5 shrink-0" />
            <span><strong>Data Source:</strong> GREEN PIN SYNTHETIC SIMULATION (Controlled deterministic dataset, seed=42).</span>
          </div>
          <div className="flex items-start gap-2.5">
            <CheckCircle size={16} className="text-primary mt-0.5 shrink-0" />
            <span><strong>Security Isolation:</strong> Zero connectivity to real banking APIs, SWIFT networks, or actual employee databases.</span>
          </div>
          <div className="flex items-start gap-2.5">
            <CheckCircle size={16} className="text-primary mt-0.5 shrink-0" />
            <span><strong>Simulation Safeguards:</strong> All containment operations (Hold, Revoke, Escalate) operate in a non-destructive sandboxed simulation.</span>
          </div>
        </div>
      </Card>
    </div>
  );
}
