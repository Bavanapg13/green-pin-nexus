import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../components/Card';
import Badge from '../components/Badge';
import { api } from '../services/api';
import { AlertOctagon, CheckCircle2, ShieldAlert, Zap, History, MessageSquare, Play } from 'lucide-react';

export default function ResponseCenter() {
  const [criticalEvent, setCriticalEvent] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);
  const navigate = useNavigate();

  const fetchCritical = async () => {
    try {
      const data = await api.getEvents();
      const critical = (data.events || []).find((e: any) => (e.risk === 'CRITICAL' || e.risk === 'HIGH') && e.status !== 'DENIED');
      if (critical) {
        setCriticalEvent(critical);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchCritical();
  }, []);

  const handleSimulateAttack = async () => {
    setLoading(true);
    try {
      await api.runDemo('attack');
      setCriticalEvent({
        id: 'EVT-C1-04',
        userId: 'EMP-1042',
        role: 'Senior Payment Administrator',
        action: 'PAYMENT_INITIATED',
        amount: 850000,
        risk: 'CRITICAL',
        riskScore: 96,
        status: 'HELD',
        timestamp: new Date().toISOString()
      });
      setFeedback('Attack scenario triggered: High-risk incident loaded for containment.');
      setTimeout(() => setFeedback(null), 4000);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  const handleAction = async (action: string) => {
    if (!criticalEvent) return;
    setLoading(true);
    try {
      await api.respond(action, criticalEvent.id, criticalEvent.userId);
      setFeedback(`Containment Action '${action}' successfully executed on ${criticalEvent.userId}. Recorded to Incident History.`);
      setCriticalEvent(null);
      setTimeout(() => setFeedback(null), 5000);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  const handleFeedback = async (type: string) => {
    if (!criticalEvent) return;
    setLoading(true);
    try {
      await api.feedback(criticalEvent.id, type);
      setFeedback(`Analyst feedback '${type}' successfully submitted. Cataloged for ML baseline refinement.`);
      setCriticalEvent(null);
      setTimeout(() => setFeedback(null), 5000);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-2">Simulated Containment & Response Center</h1>
          <p className="text-slate-400">Execute rapid containment actions and provide ML calibration verdicts on privileged threats.</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate('/incident-history')}
            className="flex items-center gap-1.5 px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium rounded-lg border border-slate-700 transition-colors"
          >
            <History size={14} /> Incident History
          </button>
          <button
            onClick={() => navigate('/analyst-feedback')}
            className="flex items-center gap-1.5 px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium rounded-lg border border-slate-700 transition-colors"
          >
            <MessageSquare size={14} /> Analyst Feedback
          </button>
        </div>
      </div>

      {feedback && (
        <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 px-5 py-3.5 rounded-lg flex items-center gap-3 shadow-lg animate-fade-in">
          <CheckCircle2 size={20} className="shrink-0" />
          <span className="font-medium text-sm">{feedback}</span>
        </div>
      )}

      {!criticalEvent ? (
        <Card className="text-center py-14">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-emerald-500/10 text-emerald-400 rounded-full flex items-center justify-center border border-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.15)]">
              <CheckCircle2 size={32} />
            </div>
          </div>
          <h2 className="text-xl font-bold text-slate-100 mb-2">No Active Threat Waiting in Queue</h2>
          <p className="text-slate-400 max-w-md mx-auto text-sm mb-6">
            All current privileged sessions are within normal parameters. To test and verify response and containment actions, load a high-risk simulation alert below.
          </p>
          <button
            onClick={handleSimulateAttack}
            disabled={loading}
            className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-500 text-white px-6 py-3 rounded-lg font-bold transition-all shadow-[0_0_15px_rgba(239,68,68,0.3)] disabled:opacity-50 text-sm"
          >
            <Zap size={18} />
            {loading ? 'Triggering Incident...' : '⚡ Load Critical PAM Incident (EMP-1042)'}
          </button>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="border-red-500/40 bg-red-950/10">
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-800">
              <div className="w-11 h-11 bg-red-500/20 text-red-400 rounded-lg flex items-center justify-center border border-red-500/30">
                <AlertOctagon size={26} />
              </div>
              <div>
                <h2 className="text-xl font-bold text-red-400">Immediate Containment Required</h2>
                <p className="text-xs text-slate-400">Critical privileged access chain violation detected.</p>
              </div>
            </div>

            <div className="space-y-3.5 mb-6 text-sm">
              <div className="flex justify-between py-2 border-b border-slate-800/60">
                <span className="text-slate-400">Event Reference</span>
                <span className="font-mono text-slate-200 font-semibold">{criticalEvent.id}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-800/60">
                <span className="text-slate-400">Target Privileged User</span>
                <span className="font-mono font-bold text-slate-100">{criticalEvent.userId}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-800/60">
                <span className="text-slate-400">Flagged Privileged Action</span>
                <span className="font-semibold text-slate-200">{criticalEvent.action}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-800/60">
                <span className="text-slate-400">Evaluated Risk Level</span>
                <Badge level={criticalEvent.risk} />
              </div>
              {criticalEvent.amount && (
                <div className="flex justify-between py-2 border-b border-slate-800/60">
                  <span className="text-slate-400">Transaction Value</span>
                  <span className="font-mono font-bold text-red-400 text-base">₹{criticalEvent.amount.toLocaleString()}</span>
                </div>
              )}
            </div>

            <div className="bg-slate-900/80 p-4 rounded-lg border border-slate-700/80">
              <h4 className="font-semibold text-slate-200 text-sm mb-1.5 flex items-center gap-2">
                <ShieldAlert size={16} className="text-amber-400" />
                Response Engine Recommendation
              </h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                System recommends immediate transaction hold and session restriction due to abnormal payment velocity, unverified offshore beneficiary, and missing dual custody approval.
              </p>
            </div>
          </Card>

          <div className="space-y-6">
            <Card title="Simulated PAM Containment Actions">
              <p className="text-xs text-slate-400 mb-4">
                Execute simulated mitigation workflows across the core banking PAM gateway:
              </p>
              <div className="space-y-3">
                <button 
                  onClick={() => handleAction('HOLD_PAYMENT')}
                  disabled={loading}
                  className="w-full bg-slate-800 hover:bg-slate-700 border border-slate-600 hover:border-primary text-slate-100 py-3 rounded-lg font-bold transition-all disabled:opacity-50 text-sm flex items-center justify-center gap-2"
                >
                  🛑 Hold Payment & Freeze Transaction
                </button>
                <button 
                  onClick={() => handleAction('RESTRICT_SESSION')}
                  disabled={loading}
                  className="w-full bg-red-600/80 hover:bg-red-600 text-white py-3 rounded-lg font-bold transition-all disabled:opacity-50 text-sm flex items-center justify-center gap-2 shadow-lg"
                >
                  🔒 Revoke Session & Lock Privileged Credentials
                </button>
                <button 
                  onClick={() => handleAction('ESCALATE')}
                  disabled={loading}
                  className="w-full bg-slate-800 hover:bg-slate-700 border border-slate-600 text-slate-200 py-3 rounded-lg font-semibold transition-all disabled:opacity-50 text-sm flex items-center justify-center gap-2"
                >
                  🚨 Escalate Alert to SOC Incident Response Team
                </button>
              </div>
            </Card>

            <Card title="Analyst Feedback Loop">
              <p className="text-xs text-slate-400 mb-4">
                Calibrate Isolation Forest and sequence detection engine by submitting ground truth verdict:
              </p>
              <div className="flex gap-3">
                <button 
                  onClick={() => handleFeedback('TRUE_POSITIVE')}
                  disabled={loading}
                  className="flex-1 bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-400 border border-emerald-500/40 py-2.5 rounded-lg font-bold transition-all disabled:opacity-50 text-xs flex items-center justify-center gap-1.5"
                >
                  <CheckCircle2 size={15} /> Confirm True Positive
                </button>
                <button 
                  onClick={() => handleFeedback('FALSE_POSITIVE')}
                  disabled={loading}
                  className="flex-1 bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 py-2.5 rounded-lg font-bold transition-all disabled:opacity-50 text-xs"
                >
                  Mark False Positive
                </button>
              </div>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}
