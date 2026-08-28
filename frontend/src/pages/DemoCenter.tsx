import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../components/Card';
import { api } from '../services/api';
import { Play, RotateCcw, AlertTriangle, ShieldCheck, Activity, ArrowRight, CheckCircle2, ShieldAlert } from 'lucide-react';

export default function DemoCenter() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [activeScenario, setActiveScenario] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleScenario = async (scenario: string) => {
    setLoading(true);
    setMessage('');
    try {
      await api.runDemo(scenario);
      setActiveScenario(scenario);
      setMessage(`Scenario '${scenario.toUpperCase()}' triggered and synchronized across all pipeline engines.`);
    } catch (err) {
      console.error(err);
      setMessage(`Failed to trigger scenario: ${err}`);
    }
    setLoading(false);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-10">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold tracking-tight mb-3 text-primary">Simulation & Demonstration Center</h1>
        <p className="text-slate-400 text-base">Control the live simulated privileged activity stream and evaluate multi-engine detection in real-time.</p>
      </div>

      {message && (
        <div className="bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 px-6 py-4 rounded-xl text-center font-medium flex items-center justify-center gap-3 shadow-lg animate-fade-in">
          <CheckCircle2 size={22} className="text-emerald-400 shrink-0" />
          <span>{message}</span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Normal Operations */}
        <Card className={`transition-all border-2 ${
          activeScenario === 'normal'
            ? 'border-emerald-500 bg-emerald-950/10 shadow-[0_0_15px_rgba(16,185,129,0.2)]'
            : 'hover:border-emerald-500/50 border-slate-800'
        }`}>
          <div className="h-full flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 bg-emerald-500/10 text-emerald-400 rounded-xl flex items-center justify-center mb-4 border border-emerald-500/20">
                <Activity size={24} />
              </div>
              <h3 className="text-lg font-bold text-slate-100 mb-2">1. Normal Operations</h3>
              <p className="text-xs text-slate-400 mb-4 leading-relaxed">
                Simulates standard employee operations: standard login hours, regular account reconciliation, and small recurring payments within median thresholds.
              </p>
            </div>
            
            <div className="space-y-2 mt-4">
              <button 
                onClick={() => handleScenario('normal')}
                disabled={loading}
                className="w-full bg-slate-800 hover:bg-emerald-600 hover:text-white text-slate-200 py-2.5 rounded-lg flex items-center justify-center gap-2 font-bold transition-all disabled:opacity-50 text-sm border border-slate-700"
              >
                <Play size={16} /> Run Normal Scenario
              </button>
            </div>
          </div>
        </Card>

        {/* Compromised Account */}
        <Card className={`transition-all border-2 ${
          activeScenario === 'compromised' || activeScenario === 'attack'
            ? 'border-red-500 bg-red-950/20 shadow-[0_0_20px_rgba(239,68,68,0.25)]'
            : 'hover:border-red-500/50 border-red-500/20'
        }`}>
          <div className="h-full flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 bg-red-500/10 text-red-400 rounded-xl flex items-center justify-center mb-4 border border-red-500/30">
                <AlertTriangle size={24} />
              </div>
              <h3 className="text-lg font-bold text-red-400 mb-2">2. Compromised Account</h3>
              <p className="text-xs text-slate-400 mb-4 leading-relaxed">
                Simulates a multi-step insider or credential attack chain: EMP-1042 modifies beneficiary, escalates limit from ₹50k to ₹10L, transfers ₹8.5L with missing dual custody.
              </p>
            </div>

            <div className="space-y-2 mt-4">
              <button 
                onClick={() => handleScenario('compromised')}
                disabled={loading}
                className="w-full bg-red-600 hover:bg-red-500 text-white py-2.5 rounded-lg flex items-center justify-center gap-2 font-bold transition-all shadow-[0_0_12px_rgba(239,68,68,0.3)] disabled:opacity-50 text-sm"
              >
                <Play size={16} /> Run Attack Scenario
              </button>
            </div>
          </div>
        </Card>

        {/* Legitimate Exception */}
        <Card className={`transition-all border-2 ${
          activeScenario === 'legitimate_exception' || activeScenario === 'emergency'
            ? 'border-amber-500 bg-amber-950/15 shadow-[0_0_15px_rgba(245,158,11,0.2)]'
            : 'hover:border-amber-500/50 border-slate-800'
        }`}>
          <div className="h-full flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 bg-amber-500/10 text-amber-400 rounded-xl flex items-center justify-center mb-4 border border-amber-500/20">
                <ShieldCheck size={24} />
              </div>
              <h3 className="text-lg font-bold text-amber-300 mb-2">3. Legitimate Exception</h3>
              <p className="text-xs text-slate-400 mb-4 leading-relaxed">
                Simulates off-hours high-privilege emergency maintenance by EMP-1098, validated against active Sev-1 Incident INC-1029 and approved Ticket TKT-5567.
              </p>
            </div>

            <div className="space-y-2 mt-4">
              <button 
                onClick={() => handleScenario('legitimate_exception')}
                disabled={loading}
                className="w-full bg-slate-800 hover:bg-amber-600 hover:text-darker text-slate-200 py-2.5 rounded-lg flex items-center justify-center gap-2 font-bold transition-all disabled:opacity-50 text-sm border border-slate-700"
              >
                <Play size={16} /> Run Exception Scenario
              </button>
            </div>
          </div>
        </Card>
      </div>

      {/* Post Scenario Action Links */}
      {activeScenario && (
        <Card className="bg-slate-900/90 border-slate-700 p-5 mt-6">
          <div className="text-sm font-semibold text-slate-200 mb-3 flex items-center gap-2">
            <ShieldAlert size={16} className="text-primary" />
            Inspect Scenario Results Across the Platform:
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <button
              onClick={() => navigate('/attack-timeline')}
              className="p-3 rounded-lg bg-slate-800/80 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-semibold flex items-center justify-between transition-colors"
            >
              <span>View Sequence Timeline</span>
              <ArrowRight size={14} className="text-primary" />
            </button>
            <button
              onClick={() => navigate('/relationship-graph')}
              className="p-3 rounded-lg bg-slate-800/80 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-semibold flex items-center justify-between transition-colors"
            >
              <span>Inspect Entity Graph</span>
              <ArrowRight size={14} className="text-primary" />
            </button>
            <button
              onClick={() => navigate('/response-center')}
              className="p-3 rounded-lg bg-slate-800/80 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-semibold flex items-center justify-between transition-colors"
            >
              <span>Simulate Containment</span>
              <ArrowRight size={14} className="text-primary" />
            </button>
          </div>
        </Card>
      )}

      <div className="mt-8 text-center">
        <button 
          onClick={() => handleScenario('reset')}
          disabled={loading}
          className="inline-flex items-center gap-2 text-slate-400 hover:text-slate-200 transition-colors py-2 px-5 rounded-lg hover:bg-slate-800 border border-transparent hover:border-slate-700 text-sm font-medium"
        >
          <RotateCcw size={16} />
          Reset Environment to Clean Baseline
        </button>
      </div>
    </div>
  );
}
