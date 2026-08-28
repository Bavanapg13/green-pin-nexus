import { NavLink } from 'react-router-dom';
import { 
  Shield, Activity, Users, Clock, GitCommit, 
  FileSearch, ShieldAlert, History, 
  Cpu, Server, ShieldCheck, AlertTriangle
} from 'lucide-react';

const links = [
  { to: '/overview', icon: Shield, label: 'Overview' },
  { to: '/officers', icon: Users, label: 'Privileged Officers' },
  { to: '/live-activity', icon: Activity, label: 'Live Activity' },
  { to: '/alerts', icon: AlertTriangle, label: 'Risk Alerts' },
  { to: '/attack-timeline', icon: Clock, label: 'Attack Timeline' },
  { to: '/relationship-graph', icon: GitCommit, label: 'Relationship Graph' },
  { to: '/context-investigation', icon: FileSearch, label: 'Context Investigation' },
  { to: '/response-center', icon: ShieldAlert, label: 'Response Center' },
  { to: '/incident-history', icon: History, label: 'Incident History' },
  { to: '/audit', icon: ShieldCheck, label: 'Audit Log' },
  { to: '/model-explanation', icon: Cpu, label: 'Model Explanation' },
  { to: '/system-status', icon: Server, label: 'System Status' },
];

export default function Sidebar() {
  return (
    <aside className="w-64 bg-panel border-r border-slate-800 flex flex-col h-screen sticky top-0 shrink-0">
      {/* Brand Header */}
      <div className="p-5 border-b border-slate-800 flex items-center gap-3">
        <div className="w-9 h-9 rounded-lg bg-primary/20 border border-primary/40 flex items-center justify-center text-primary shadow-[0_0_12px_rgba(16,185,129,0.3)]">
          <Shield size={22} className="text-primary" />
        </div>
        <div>
          <div className="font-bold tracking-wider text-slate-100 text-sm flex items-center gap-1.5 font-mono">
            <span>GREEN PIN NEXUS</span>
          </div>
          <div className="text-[10px] text-slate-400 font-mono tracking-tight uppercase">Privileged Intelligence</div>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto custom-scrollbar">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3.5 py-2.5 rounded-lg transition-all text-sm font-medium ${
                isActive
                  ? 'bg-primary/15 text-primary border border-primary/30 shadow-[0_0_10px_rgba(16,185,129,0.15)] font-semibold'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`
            }
          >
            <link.icon size={18} className="shrink-0" />
            <span className="truncate">{link.label}</span>
          </NavLink>
        ))}
      </nav>

      {/* Tagline & Simulation Badge */}
      <div className="p-4 border-t border-slate-800 bg-darker/60 space-y-2">
        <div className="text-[11px] text-slate-400 italic text-center font-medium">
          "Detect the chain, not just the event."
        </div>
        <div className="px-2.5 py-1.5 rounded bg-slate-900 border border-slate-700/60 text-[10px] text-slate-400 flex items-center justify-between">
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></span>
            ENV
          </span>
          <span className="font-mono text-slate-300 font-semibold text-[9px] uppercase tracking-wider">SIMULATION</span>
        </div>
      </div>
    </aside>
  );
}
