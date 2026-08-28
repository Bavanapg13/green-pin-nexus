import { useState, useEffect } from 'react';
import Card from '../components/Card';
import Badge from '../components/Badge';
import { api } from '../services/api';
import { Event } from '../types';

export default function LiveActivity() {
  const [events, setEvents] = useState<Event[]>([]);

  useEffect(() => {
    api.getEvents().then((data) => setEvents(data.events || [])).catch(console.error);
    
    // Polling simulation
    const interval = setInterval(() => {
      api.getEvents().then((data) => setEvents(data.events || [])).catch(console.error);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight mb-2">Live Activity</h1>
        <p className="text-slate-400">Real-time stream of authorization and access events.</p>
      </div>

      <Card>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-slate-400 uppercase bg-slate-800/50">
              <tr>
                <th className="px-4 py-3">Timestamp</th>
                <th className="px-4 py-3">User ID</th>
                <th className="px-4 py-3">Action</th>
                <th className="px-4 py-3">Amount</th>
                <th className="px-4 py-3">Risk Score</th>
                <th className="px-4 py-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {events.map((event) => (
                <tr key={event.id} className="border-b border-slate-800/50 hover:bg-slate-800/20">
                  <td className="px-4 py-3 text-slate-400 whitespace-nowrap">
                    {new Date(event.timestamp).toLocaleString()}
                  </td>
                  <td className="px-4 py-3 font-medium text-slate-300">{event.userId}</td>
                  <td className="px-4 py-3">{event.action}</td>
                  <td className="px-4 py-3 text-slate-400">
                    {event.amount ? `$${event.amount.toLocaleString()}` : '-'}
                  </td>
                  <td className="px-4 py-3"><Badge level={event.risk} /></td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded text-xs ${
                      event.status === 'ALLOWED' ? 'bg-emerald-500/10 text-emerald-500' :
                      event.status === 'DENIED' ? 'bg-red-500/10 text-red-500' :
                      'bg-amber-500/10 text-amber-500'
                    }`}>
                      {event.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {events.length === 0 && (
            <div className="p-8 text-center text-slate-500">
              No events found. Start a scenario in the Demo Center.
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
