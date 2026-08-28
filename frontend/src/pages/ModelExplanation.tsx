import Card from '../components/Card';
import { Cpu, Layers, GitBranch, DollarSign, Shield, FileCheck, ArrowRight, CheckCircle2 } from 'lucide-react';

export default function ModelExplanation() {
  const components = [
    { name: 'Behavioral Anomaly Model', weight: '20%', icon: Cpu, color: 'text-emerald-400', desc: 'Isolation Forest trained on normal telemetry (device familiarity, hours, burst frequency).' },
    { name: 'Temporal Sequence Engine', weight: '25%', icon: Layers, color: 'text-amber-400', desc: 'State-machine detecting unexpected ordering (e.g. Beneficiary Modified → Limit Raised → Payment with no approval).' },
    { name: 'Relationship Intelligence', weight: '15%', icon: GitBranch, color: 'text-blue-400', desc: 'NetworkX graph tracking multi-hop linkages between users, novel beneficiaries, and privileged accounts.' },
    { name: 'Financial Risk Engine', weight: '15%', icon: DollarSign, color: 'text-red-400', desc: 'Evaluates transaction magnitude against historical median/deviation (e.g. ₹8.5L vs ₹5k–₹50k standard range).' },
    { name: 'Privilege Risk Engine', weight: '10%', icon: Shield, color: 'text-purple-400', desc: 'Sensitive operational escalation weighting (dual custody bypass, root permission elevation).' },
    { name: 'Business Context Engine', weight: '10%', icon: FileCheck, color: 'text-cyan-400', desc: 'Cross-verifies Jira tickets, ServiceNow change requests, maintenance windows, and active incidents.' },
    { name: 'Historical Baseline Factor', weight: '5%', icon: CheckCircle2, color: 'text-slate-400', desc: 'Long-term peer group adherence index.' },
  ];

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-10">
      <div>
        <h1 className="text-3xl font-bold tracking-tight mb-2">How GREEN PIN NEXUS Calculates Risk</h1>
        <p className="text-slate-400">Explainable, multi-dimensional risk scoring combining ML, sequence logic, and business context.</p>
      </div>

      {/* Formula Architecture Visual */}
      <Card title="Weighted Risk Aggregation Architecture">
        <div className="p-4 bg-slate-900/60 rounded-xl border border-slate-800 mb-6 text-center">
          <div className="text-xs uppercase font-mono tracking-widest text-slate-400 mb-2">Core Scoring Formula</div>
          <div className="font-mono text-sm sm:text-base text-slate-200 font-semibold bg-darker p-3 rounded-lg border border-slate-700/60 overflow-x-auto">
            Risk = (0.20 × Behavior) + (0.25 × Sequence) + (0.15 × Relationship) + (0.15 × Financial) + (0.10 × Privilege) + (0.10 × Context) + (0.05 × Historical)
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {components.map((comp, idx) => (
            <div key={idx} className="p-4 rounded-xl bg-slate-800/40 border border-slate-700/60 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <comp.icon size={22} className={comp.color} />
                  <span className="text-xs font-bold font-mono px-2.5 py-1 rounded bg-slate-900 border border-slate-700 text-slate-200">
                    Weight: {comp.weight}
                  </span>
                </div>
                <h3 className="font-semibold text-slate-200 text-sm mb-1">{comp.name}</h3>
                <p className="text-xs text-slate-400 leading-relaxed">{comp.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Threshold Classification */}
      <Card title="Prototype Risk Thresholds">
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-center">
          <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
            <div className="text-2xl font-bold text-emerald-400 font-mono">0 – 29</div>
            <div className="text-sm font-semibold text-emerald-300 mt-1">LOW</div>
            <div className="text-xs text-slate-400 mt-2">Standard Automated Monitoring</div>
          </div>
          <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20">
            <div className="text-2xl font-bold text-amber-400 font-mono">30 – 59</div>
            <div className="text-sm font-semibold text-amber-300 mt-1">MODERATE</div>
            <div className="text-xs text-slate-400 mt-2">Additional Verification Required</div>
          </div>
          <div className="p-4 rounded-xl bg-orange-500/10 border border-orange-500/20">
            <div className="text-2xl font-bold text-orange-400 font-mono">60 – 79</div>
            <div className="text-sm font-semibold text-orange-300 mt-1">HIGH</div>
            <div className="text-xs text-slate-400 mt-2">Restrict Risky Operation</div>
          </div>
          <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20">
            <div className="text-2xl font-bold text-red-500 font-mono">80 – 100</div>
            <div className="text-sm font-semibold text-red-400 mt-1">CRITICAL</div>
            <div className="text-xs text-slate-400 mt-2">Hold Payment & Restrict Session</div>
          </div>
        </div>
        <p className="text-xs text-slate-500 mt-4 italic text-center">
          *Note: These are prototype risk thresholds calibrated for the demonstration simulation environment.
        </p>
      </Card>
    </div>
  );
}
