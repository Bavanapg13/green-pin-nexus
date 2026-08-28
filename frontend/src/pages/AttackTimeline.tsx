import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../components/Card';
import Badge from '../components/Badge';
import { api } from '../services/api';
import { ArrowDown, AlertTriangle, ShieldCheck, Activity, Play } from 'lucide-react';

export default function AttackTimeline() {
  const [scenario, setScenario] = useState<string>('compromised');
  const [timeline, setTimeline] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const fetchTimeline = async (sc: string) => {
    setLoading(true);
    try {
      const data = await api.getTimeline(sc);
      setTimeline(data.events || []);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchTimeline(scenario);
  }, [scenario]);

  const handleTriggerDemo = async (sc: string) => {
    setScenario(sc);
    await api.runDemo(sc);
    await fetchTimeline(sc);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-2">Sequence & Attack Timeline</h1>
          <p className="text-slate-400">Visualizing how sequential authorized actions accumulate multi-dimensional risk.</p>
        </div>
        <button
          onClick={() => navigate('/demo-center')}
          className="flex items-center gap-2 px-4 py-2 bg-primary/20 hover:bg-primary/30 text-primary border border-primary/40 rounded-lg text-sm font-medium transition-colors"
        >
          <Play size={16} /> Open Demo Center
        </button>
      </div>

      {/* Scenario Filter Buttons */}
      <Card className="p-3">
        <div className="flex flex-wrap items-center gap-3">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 mr-2">Select Scenario:</span>
          
          <button
            onClick={() => handleTriggerDemo('compromised')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              scenario === 'compromised' || scenario === 'attack'
                ? 'bg-red-500/20 text-red-400 border border-red-500/50 shadow-[0_0_12px_rgba(239,68,68,0.2)]'
                : 'bg-slate-800/80 hover:bg-slate-700 text-slate-300 border border-slate-700'
            }`}
          >
            <AlertTriangle size={16} className="text-red-500" />
            1. Compromised Account (Attack Chain)
          </button>

          <button
            onClick={() => handleTriggerDemo('emergency')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              scenario === 'emergency' || scenario === 'legitimate_exception'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/50 shadow-[0_0_12px_rgba(245,158,11,0.2)]'
                : 'bg-slate-800/80 hover:bg-slate-700 text-slate-300 border border-slate-700'
            }`}
          >
            <ShieldCheck size={16} className="text-amber-400" />
            2. Legitimate Exception (Emergency DB Failover)
          </button>

          <button
            onClick={() => handleTriggerDemo('normal')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              scenario === 'normal'
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/50 shadow-[0_0_12px_rgba(16,185,129,0.2)]'
                : 'bg-slate-800/80 hover:bg-slate-700 text-slate-300 border border-slate-700'
            }`}
          >
            <Activity size={16} className="text-emerald-400" />
            3. Normal Operations Baseline
          </button>
        </div>
      </Card>

      <div className="max-w-3xl mx-auto">
        {loading ? (
          <div className="p-12 text-center text-slate-400 animate-pulse">Loading timeline events...</div>
        ) : timeline.length === 0 ? (
          <Card className="text-center p-12 text-slate-500">
            No active events for this scenario. Click one of the scenario buttons above to run.
          </Card>
        ) : (
          <div className="space-y-4">
            {timeline.map((event, index) => (
              <div key={event.id} className="relative">
                <Card className={`border-l-4 ${
                  event.risk === 'CRITICAL' ? 'border-l-red-500 bg-red-950/10' :
                  event.risk === 'HIGH' ? 'border-l-orange-500 bg-orange-950/10' :
                  event.risk === 'MODERATE' ? 'border-l-amber-500 bg-amber-950/10' : 'border-l-emerald-500 bg-emerald-950/10'
                }`}>
                  <div className="flex justify-between items-start">
                    <div className="space-y-1">
                      <div className="flex items-center gap-3 mb-1">
                        <span className="text-xs font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">
                          Step #{index + 1}
                        </span>
                        <Badge level={event.risk} />
                        <span className="text-slate-400 text-xs font-mono">{new Date(event.timestamp).toLocaleTimeString()}</span>
                      </div>
                      <h3 className="text-lg font-semibold text-slate-200">{event.action}</h3>
                      <p className="text-slate-400 text-sm">
                        Identity: <span className="text-slate-200 font-medium font-mono">{event.userId}</span>
                      </p>
                      {event.amount && (
                        <p className="text-slate-400 text-sm">
                          Amount: <span className="text-red-400 font-semibold font-mono">₹{event.amount.toLocaleString()}</span>
                        </p>
                      )}
                    </div>
                    
                    <div className="text-right">
                      <div className="text-xs text-slate-400 mb-1">Cumulative Risk</div>
                      <div className={`text-2xl font-bold font-mono ${
                        event.risk === 'CRITICAL' ? 'text-red-500' :
                        event.risk === 'HIGH' ? 'text-orange-500' :
                        event.risk === 'MODERATE' ? 'text-amber-500' : 'text-emerald-500'
                      }`}>
                        {event.cumulativeScore || 0}<span className="text-xs font-normal text-slate-500">/100</span>
                      </div>
                    </div>
                  </div>
                  
                  {event.context && (
                    <div className="mt-3 p-3 bg-darker rounded-lg border border-slate-800 text-sm text-slate-300">
                      <span className="font-semibold text-slate-400 mr-1.5">Context Analysis:</span>
                      {event.context}
                    </div>
                  )}
                </Card>
                
                {index < timeline.length - 1 && (
                  <div className="flex justify-center my-2 text-slate-600">
                    <ArrowDown size={20} />
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
