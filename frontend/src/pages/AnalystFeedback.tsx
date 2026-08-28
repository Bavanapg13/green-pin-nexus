import { useState, useEffect } from 'react';
import Card from '../components/Card';
import Badge from '../components/Badge';
import { MessageSquare, ThumbsUp, ThumbsDown, CheckCircle, RefreshCw } from 'lucide-react';

export default function AnalystFeedback() {
  const [feedbackList, setFeedbackList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchFeedback = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/feedback');
      if (res.ok) {
        const data = await res.json();
        setFeedbackList(data);
      }
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchFeedback();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-2">Analyst Feedback & Verdicts</h1>
          <p className="text-slate-400">Captured analyst feedback for future baseline and detection rule refinement.</p>
        </div>
        <button
          onClick={fetchFeedback}
          className="flex items-center gap-2 px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-sm border border-slate-700 transition-colors"
        >
          <RefreshCw size={15} className={loading ? 'animate-spin' : ''} />
          Refresh
        </button>
      </div>

      <div className="p-4 bg-primary/10 border border-primary/30 rounded-xl text-primary text-sm flex items-center gap-3">
        <CheckCircle size={18} className="shrink-0" />
        <div>
          <span className="font-semibold">Feedback Loop:</span> Feedback captured here is cataloged for offline calibration of peer-group baseline variance and Isolation Forest hyperparameters.
        </div>
      </div>

      <Card>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-slate-400 uppercase bg-slate-800/50">
              <tr>
                <th className="px-4 py-3">Timestamp</th>
                <th className="px-4 py-3">Event Ref</th>
                <th className="px-4 py-3">Target Identity</th>
                <th className="px-4 py-3">Analyst</th>
                <th className="px-4 py-3">Verdict</th>
                <th className="px-4 py-3">Notes</th>
              </tr>
            </thead>
            <tbody>
              {feedbackList.map((item, idx) => (
                <tr key={item.id || idx} className="border-b border-slate-800/50 hover:bg-slate-800/20">
                  <td className="px-4 py-3 text-slate-400 whitespace-nowrap">
                    {new Date(item.timestamp).toLocaleString()}
                  </td>
                  <td className="px-4 py-3 font-mono text-slate-300">{item.event_id}</td>
                  <td className="px-4 py-3 font-medium text-slate-200">{item.user_id}</td>
                  <td className="px-4 py-3 text-slate-400">{item.analyst || 'SOC Analyst'}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2.5 py-1 rounded text-xs font-semibold ${
                      item.verdict === 'TRUE_POSITIVE' || item.verdict === 'CONFIRMED'
                        ? 'bg-red-500/10 text-red-400 border border-red-500/30'
                        : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                    }`}>
                      {item.verdict}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-slate-400 italic">{item.notes || 'Recorded for model calibration'}</td>
                </tr>
              ))}
              {feedbackList.length === 0 && (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-slate-500 italic">
                    No analyst feedback submitted yet. Review an alert and submit feedback in the Response Center.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
