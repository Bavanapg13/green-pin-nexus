export const api = {
  health: async () => {
    try {
      const res = await fetch('/api/health');
      if (!res.ok) throw new Error('Health check failed');
      return await res.json();
    } catch {
      return { status: 'offline' };
    }
  },
  getDashboard: async () => {
    try {
      const res = await fetch('/api/dashboard');
      if (!res.ok) throw new Error('Dashboard fetch failed');
      return await res.json();
    } catch (err) {
      console.error(err);
      return {
        overview_kpis: { total_users: 100, total_events: 5420, active_alerts: 5, critical_incidents: 1 },
        risk_distribution: { LOW: 85, MODERATE: 10, HIGH: 4, CRITICAL: 1 },
        system_status: "Operational",
        recentEvents: []
      };
    }
  },
  getEvents: async () => {
    try {
      const res = await fetch('/api/events');
      if (!res.ok) throw new Error('Events fetch failed');
      return await res.json();
    } catch (err) {
      console.error(err);
      return { events: [] };
    }
  },
  getUsers: async () => {
    try {
      const res = await fetch('/api/users');
      if (!res.ok) throw new Error('Users fetch failed');
      return await res.json();
    } catch (err) {
      console.error(err);
      return [];
    }
  },
  getRisk: async (userId: string) => {
    try {
      const res = await fetch(`/api/risk/${encodeURIComponent(userId)}`);
      if (!res.ok) throw new Error('Risk fetch failed');
      return await res.json();
    } catch (err) {
      console.error(err);
      return {
        userId,
        score: 15,
        category: 'LOW',
        factors: ['Standard behavior pattern'],
        details: { geoRisk: 10, timeRisk: 5, actionRisk: 15 }
      };
    }
  },
  getTimeline: async (scenario: string) => {
    try {
      const res = await fetch(`/api/timeline/${encodeURIComponent(scenario)}`);
      if (!res.ok) throw new Error('Timeline fetch failed');
      return await res.json();
    } catch (err) {
      console.error(err);
      return { events: [] };
    }
  },
  getGraph: async (scenario: string) => {
    try {
      const res = await fetch(`/api/graph/${encodeURIComponent(scenario)}`);
      if (!res.ok) throw new Error('Graph fetch failed');
      return await res.json();
    } catch (err) {
      console.error(err);
      return { nodes: [], edges: [] };
    }
  },
  getContext: async (eventId: string) => {
    try {
      const res = await fetch(`/api/context/${encodeURIComponent(eventId)}`);
      if (!res.ok) throw new Error('Context fetch failed');
      return await res.json();
    } catch (err) {
      console.error(err);
      return null;
    }
  },
  runDemo: async (scenario: string) => {
    const res = await fetch('/api/demo', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ scenario })
    });
    if (!res.ok) throw new Error(`Scenario error: ${res.statusText}`);
    return await res.json();
  },
  respond: async (action: string, eventId: string, userId: string) => {
    const res = await fetch('/api/respond', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action, eventId, userId })
    });
    if (!res.ok) throw new Error(`Response action error: ${res.statusText}`);
    return await res.json();
  },
  feedback: async (eventId: string, type: string) => {
    const res = await fetch('/api/feedback', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ eventId, type })
    });
    if (!res.ok) throw new Error(`Feedback error: ${res.statusText}`);
    return await res.json();
  }
};
