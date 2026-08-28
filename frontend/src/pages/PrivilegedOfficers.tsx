import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../components/Card';
import Badge from '../components/Badge';
import { api } from '../services/api';
import { Search, UserCheck, ShieldAlert, ChevronRight, Sparkles } from 'lucide-react';

export default function PrivilegedOfficers() {
  const [users, setUsers] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterLevel, setFilterLevel] = useState('ALL');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    api.getUsers().then((data) => {
      setUsers(data || []);
      setLoading(false);
    }).catch(err => {
      console.error(err);
      setLoading(false);
    });
  }, []);

  const getRiskColor = (score: number) => {
    if (score >= 80) return 'text-red-500 font-bold';
    if (score >= 60) return 'text-orange-500 font-semibold';
    if (score >= 30) return 'text-amber-500 font-semibold';
    return 'text-emerald-500';
  };

  const getSyntheticLastActivity = (userId: string) => {
    if (userId === 'EMP-1042') return '2026-08-28 11:51:00';
    if (userId === 'EMP-1098') return '2026-08-28 02:25:00';
    if (userId === 'EMP-1002') return '2026-08-28 11:00:00';
    // Deterministic synthetic time based on hash of userId
    const lastDigits = parseInt(userId.replace(/\D/g, '')) || 0;
    const hour = (9 + (lastDigits % 8)).toString().padStart(2, '0');
    const min = (lastDigits % 60).toString().padStart(2, '0');
    return `2026-08-28 ${hour}:${min}:12`;
  };

  const getSyntheticStatus = (userId: string, category: string) => {
    if (userId === 'EMP-1042') return 'SUSPENDED (SIMULATED)';
    if (userId === 'EMP-1098') return 'UNDER REVIEW';
    if (category === 'CRITICAL' || category === 'HIGH') return 'INVESTIGATING';
    return 'MONITORED';
  };

  const filteredUsers = users.filter((u) => {
    const matchesSearch = 
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      u.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.role.toLowerCase().includes(searchQuery.toLowerCase());
      
    const matchesLevel = filterLevel === 'ALL' || u.category === filterLevel;
    
    return matchesSearch && matchesLevel;
  });

  const handleInvestigate = (userId: string) => {
    // Record audit log
    api.recordAudit('INVESTIGATION_OPENED', userId, `Opened detailed investigation for officer ${userId}`);
    // Route to identity risk analysis page
    navigate(`/identity-risk?userId=${encodeURIComponent(userId)}`);
  };

  return (
    <div className="space-y-6 pb-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight mb-2">Privileged Officers Monitoring</h1>
        <p className="text-slate-400 font-normal">
          Real-time inventory and risk-assessment profiles of privileged bank personnel.
        </p>
      </div>

      {/* Filters and Search */}
      <Card className="p-4 bg-slate-900/40 border-slate-800 flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input
            type="text"
            placeholder="Search by ID, name, or role..."
            className="w-full bg-darker border border-slate-700/80 rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:border-primary text-slate-200 text-sm"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <div className="flex gap-2 w-full md:w-auto">
          {['ALL', 'CRITICAL', 'HIGH', 'MODERATE', 'LOW'].map((lvl) => (
            <button
              key={lvl}
              onClick={() => setFilterLevel(lvl)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wider border transition-colors flex-1 md:flex-none ${
                filterLevel === lvl
                  ? 'bg-primary/20 text-primary border-primary/40'
                  : 'bg-darker text-slate-400 border-slate-700/60 hover:text-slate-200'
              }`}
            >
              {lvl}
            </button>
          ))}
        </div>
      </Card>

      {/* Officers Table */}
      <Card className="overflow-hidden border-slate-800">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-900/30 text-xs font-semibold uppercase tracking-wider text-slate-400">
                <th className="py-4 px-5">Officer ID</th>
                <th className="py-4 px-5">Officer Name</th>
                <th className="py-4 px-5">Role</th>
                <th className="py-4 px-5">Department</th>
                <th className="py-4 px-5 text-center">Risk Score</th>
                <th className="py-4 px-5">Risk Level</th>
                <th className="py-4 px-5">Last Activity</th>
                <th className="py-4 px-5">Status</th>
                <th className="py-4 px-5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80 text-sm">
              {loading ? (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-slate-500">
                    Retrieving monitored officers data...
                  </td>
                </tr>
              ) : filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-slate-500 italic">
                    No matching officers found in the simulation database.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((u) => {
                  const activityTime = getSyntheticLastActivity(u.id);
                  const status = getSyntheticStatus(u.id, u.category);
                  return (
                    <tr 
                      key={u.id} 
                      className="hover:bg-slate-850/40 transition-colors group cursor-pointer"
                      onClick={() => handleInvestigate(u.id)}
                    >
                      <td className="py-4 px-5 font-mono text-xs font-bold text-slate-300 group-hover:text-primary transition-colors">
                        {u.id}
                      </td>
                      <td className="py-4 px-5 font-semibold text-slate-100">{u.name}</td>
                      <td className="py-4 px-5 text-slate-300">{u.role}</td>
                      <td className="py-4 px-5 text-slate-400">{u.department}</td>
                      <td className="py-4 px-5 text-center font-mono font-bold">
                        <span className={getRiskColor(u.riskScore)}>
                          {Math.round(u.riskScore)}
                        </span>
                      </td>
                      <td className="py-4 px-5">
                        <Badge level={u.category} />
                      </td>
                      <td className="py-4 px-5 text-xs text-slate-400 font-mono">{activityTime}</td>
                      <td className="py-4 px-5">
                        <span className={`inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase px-2 py-0.5 rounded border ${
                          status.includes('SUSPENDED') 
                            ? 'bg-red-500/10 border-red-500/30 text-red-400' 
                            : status === 'UNDER REVIEW' 
                            ? 'bg-amber-500/10 border-amber-500/30 text-amber-400' 
                            : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                        }`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${
                            status.includes('SUSPENDED') ? 'bg-red-500 animate-pulse' : status === 'UNDER REVIEW' ? 'bg-amber-500' : 'bg-emerald-500'
                          }`}></span>
                          {status}
                        </span>
                      </td>
                      <td className="py-4 px-5 text-right" onClick={(e) => e.stopPropagation()}>
                        <button
                          onClick={() => handleInvestigate(u.id)}
                          className="px-3 py-1 bg-slate-800 hover:bg-slate-700 hover:text-slate-100 text-slate-300 rounded border border-slate-700 text-xs font-bold transition-all flex items-center gap-1 ml-auto"
                        >
                          Investigate
                          <ChevronRight size={12} />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </Card>
      
      {/* Simulation Info */}
      <div className="flex items-center gap-2 text-xs text-slate-500 font-mono">
        <Sparkles size={13} className="text-primary" />
        <span>SIMULATED ENVIRONMENT: Monitored data represents 100% synthetic identities configured for simulation purposes.</span>
      </div>
    </div>
  );
}
