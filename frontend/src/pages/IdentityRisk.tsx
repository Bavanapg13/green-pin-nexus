import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import Card from '../components/Card';
import Badge from '../components/Badge';
import { Search, UserCheck, ShieldAlert, Cpu, Sparkles } from 'lucide-react';
import { api } from '../services/api';

export default function IdentityRisk() {
  const [searchParams, setSearchParams] = useSearchParams();
  const queryUserId = searchParams.get('userId') || 'EMP-1042';

  const [userId, setUserId] = useState(queryUserId);
  const [riskData, setRiskData] = useState<any>(null);
  const [usersList, setUsersList] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchRiskForUser = async (id: string) => {
    if (!id.trim()) return;
    setLoading(true);
    setUserId(id);
    setSearchParams({ userId: id });
    try {
      const data = await api.getRisk(id);
      setRiskData(data);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  useEffect(() => {
    // Load users and analyze initial default user
    api.getUsers().then(users => {
      setUsersList(users || []);
    });
    fetchRiskForUser(queryUserId);
  }, [queryUserId]);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    fetchRiskForUser(userId);
  };

  const sampleUsers = [
    { id: 'EMP-1042', name: 'Arun Kumar', role: 'Sr Payment Admin', risk: 'CRITICAL', color: 'border-red-500/60 bg-red-500/10 text-red-400' },
    { id: 'EMP-1098', name: 'Priya Sharma', role: 'Database Admin', risk: 'MODERATE', color: 'border-amber-500/60 bg-amber-500/10 text-amber-400' },
    { id: 'EMP-1002', name: 'Karan Verma', role: 'Payment Analyst', risk: 'LOW', color: 'border-emerald-500/60 bg-emerald-500/10 text-emerald-400' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight mb-2">Identity & Privilege Risk Analysis</h1>
        <p className="text-slate-400">Deep-dive into individual user behavioral baselines, privilege levels, and anomaly factors.</p>
      </div>

      {/* Quick Select Buttons */}
      <Card className="p-4">
        <div className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-2">
          <Sparkles size={14} className="text-primary" />
          Quick Select Privileged Identities:
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {sampleUsers.map((u) => (
            <button
              key={u.id}
              onClick={() => fetchRiskForUser(u.id)}
              className={`p-3 rounded-lg border text-left transition-all flex flex-col justify-between ${
                userId === u.id
                  ? `${u.color} shadow-[0_0_12px_rgba(16,185,129,0.15)] ring-2 ring-primary/40`
                  : 'bg-darker hover:bg-slate-800/80 border-slate-700/60 text-slate-300'
              }`}
            >
              <div className="flex justify-between items-center mb-1">
                <span className="font-mono text-xs font-bold text-slate-200">{u.id}</span>
                <Badge level={u.risk} />
              </div>
              <div className="font-semibold text-sm text-slate-100">{u.name}</div>
              <div className="text-xs text-slate-400">{u.role}</div>
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
              placeholder="Enter or select User ID (e.g. EMP-1042, EMP-1098, EMP-1002)"
              className="w-full bg-darker border border-slate-700 rounded-lg pl-10 pr-4 py-2.5 focus:outline-none focus:border-primary text-slate-200 text-sm font-mono"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
            />
          </div>
          <button
            type="submit"
            className="bg-primary hover:bg-primaryDark text-darker font-bold px-6 py-2.5 rounded-lg transition-colors text-sm flex items-center gap-2"
            disabled={loading}
          >
            {loading ? <Cpu className="animate-spin" size={16} /> : <UserCheck size={16} />}
            {loading ? 'Evaluating...' : 'Analyze Identity'}
          </button>
        </form>
      </Card>

      {riskData && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card title={`Risk Profile — ${userId}`}>
            <div className="flex items-center justify-center py-6">
              <div className="text-center">
                <div className={`text-6xl font-bold font-mono mb-2 ${
                  riskData.score > 80 ? 'text-red-500' :
                  riskData.score > 50 ? 'text-orange-500' :
                  riskData.score > 20 ? 'text-amber-500' : 'text-emerald-500'
                }`}>
                  {riskData.score}
                </div>
                <div className="text-slate-400 uppercase tracking-widest text-xs font-semibold">
                  Aggregated Risk Score ({riskData.category})
                </div>
              </div>
            </div>
            
            <div className="space-y-3 mt-4">
              <h4 className="font-semibold text-slate-300 text-sm flex items-center gap-2">
                <ShieldAlert size={16} className="text-primary" />
                Detection Factor Explanations
              </h4>
              <ul className="space-y-2">
                {riskData.factors?.map((factor: string, i: number) => (
                  <li key={i} className="flex items-start gap-2.5 text-sm text-slate-300 bg-slate-800/50 p-3 rounded-lg border border-slate-700/50">
                    <span className="text-danger font-bold mt-0.5">•</span>
                    <span>{factor}</span>
                  </li>
                ))}
                {(!riskData.factors || riskData.factors.length === 0) && (
                  <li className="text-slate-500 italic text-sm">No anomalous risk factors detected for this user.</li>
                )}
              </ul>
            </div>
          </Card>

          <Card title="Behavioral & Sequence Deviations">
            <div className="space-y-5">
              <div>
                <div className="flex justify-between text-sm mb-1.5">
                  <span className="text-slate-400">Behavioral Anomaly Index (ML)</span>
                  <span className="text-slate-200 font-mono font-medium">{riskData.details?.geoRisk || 0}/100</span>
                </div>
                <div className="w-full bg-slate-800 rounded-full h-2.5 overflow-hidden">
                  <div className="bg-amber-500 h-2.5 rounded-full transition-all duration-500" style={{ width: `${riskData.details?.geoRisk || 0}%` }}></div>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between text-sm mb-1.5">
                  <span className="text-slate-400">Temporal & Time-of-Day Deviation</span>
                  <span className="text-slate-200 font-mono font-medium">{riskData.details?.timeRisk || 0}/100</span>
                </div>
                <div className="w-full bg-slate-800 rounded-full h-2.5 overflow-hidden">
                  <div className="bg-primary h-2.5 rounded-full transition-all duration-500" style={{ width: `${riskData.details?.timeRisk || 0}%` }}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-sm mb-1.5">
                  <span className="text-slate-400">Sequence / Step Escalation Risk</span>
                  <span className="text-slate-200 font-mono font-medium">{riskData.details?.actionRisk || 0}/100</span>
                </div>
                <div className="w-full bg-slate-800 rounded-full h-2.5 overflow-hidden">
                  <div className="bg-danger h-2.5 rounded-full transition-all duration-500" style={{ width: `${riskData.details?.actionRisk || 0}%` }}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-sm mb-1.5">
                  <span className="text-slate-400">Financial Magnitude Deviation</span>
                  <span className="text-slate-200 font-mono font-medium">{riskData.details?.financialRisk || 10}/100</span>
                </div>
                <div className="w-full bg-slate-800 rounded-full h-2.5 overflow-hidden">
                  <div className="bg-purple-500 h-2.5 rounded-full transition-all duration-500" style={{ width: `${riskData.details?.financialRisk || 10}%` }}></div>
                </div>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
