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

import Login from './pages/Login';
import ProtectedRoute from './components/ProtectedRoute';
import PrivilegedOfficers from './pages/PrivilegedOfficers';
import RiskAlerts from './pages/RiskAlerts';
import AuditLog from './pages/AuditLog';

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
        <Route index element={<Navigate to="/overview" replace />} />
        <Route path="overview" element={<Overview />} />
        <Route path="officers" element={<PrivilegedOfficers />} />
        <Route path="live-activity" element={<LiveActivity />} />
        <Route path="identity-risk" element={<IdentityRisk />} />
        <Route path="alerts" element={<RiskAlerts />} />
        <Route path="attack-timeline" element={<AttackTimeline />} />
        <Route path="relationship-graph" element={<RelationshipGraph />} />
        <Route path="context-investigation" element={<ContextInvestigation />} />
        <Route path="response-center" element={<ResponseCenter />} />
        <Route path="incident-history" element={<IncidentHistory />} />
        <Route path="analyst-feedback" element={<AnalystFeedback />} />
        <Route path="model-explanation" element={<ModelExplanation />} />
        <Route path="demo-center" element={<DemoCenter />} />
        <Route path="system-status" element={<SystemStatus />} />
        <Route path="audit" element={<AuditLog />} />
      </Route>
    </Routes>
  );
}

export default App;
