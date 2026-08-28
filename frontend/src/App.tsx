import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Overview from './pages/Overview';
import LiveActivity from './pages/LiveActivity';
import IdentityRisk from './pages/IdentityRisk';
import AttackTimeline from './pages/AttackTimeline';
import RelationshipGraph from './pages/RelationshipGraph';
import ContextInvestigation from './pages/ContextInvestigation';
import ResponseCenter from './pages/ResponseCenter';
import IncidentHistory from './pages/IncidentHistory';
import AnalystFeedback from './pages/AnalystFeedback';
import ModelExplanation from './pages/ModelExplanation';
import DemoCenter from './pages/DemoCenter';
import SystemStatus from './pages/SystemStatus';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Navigate to="/overview" replace />} />
        <Route path="overview" element={<Overview />} />
        <Route path="live-activity" element={<LiveActivity />} />
        <Route path="identity-risk" element={<IdentityRisk />} />
        <Route path="attack-timeline" element={<AttackTimeline />} />
        <Route path="relationship-graph" element={<RelationshipGraph />} />
        <Route path="context-investigation" element={<ContextInvestigation />} />
        <Route path="response-center" element={<ResponseCenter />} />
        <Route path="incident-history" element={<IncidentHistory />} />
        <Route path="analyst-feedback" element={<AnalystFeedback />} />
        <Route path="model-explanation" element={<ModelExplanation />} />
        <Route path="demo-center" element={<DemoCenter />} />
        <Route path="system-status" element={<SystemStatus />} />
      </Route>
    </Routes>
  );
}

export default App;
