import { useState, useEffect, useCallback } from 'react';
import ReactFlow, { Background, Controls, Edge, Node, applyNodeChanges, applyEdgeChanges, NodeChange, EdgeChange } from 'reactflow';
import 'reactflow/dist/style.css';
import Card from '../components/Card';
import { api } from '../services/api';
import { AlertTriangle, ShieldCheck, Activity } from 'lucide-react';

export default function RelationshipGraph() {
  const [scenario, setScenario] = useState<string>('compromised');
  const [nodes, setNodes] = useState<Node[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchGraph = async (sc: string) => {
    setLoading(true);
    try {
      const data = await api.getGraph(sc);
      if (data.nodes) {
        setNodes(data.nodes);
        setEdges(data.edges);
      }
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchGraph(scenario);
  }, [scenario]);

  const onNodesChange = useCallback(
    (changes: NodeChange[]) => setNodes((nds) => applyNodeChanges(changes, nds)),
    []
  );
  
  const onEdgesChange = useCallback(
    (changes: EdgeChange[]) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    []
  );

  return (
    <div className="space-y-6 h-full flex flex-col pb-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-2">Relationship Graph Intelligence</h1>
          <p className="text-slate-400">Discover multi-hop entity linkages between privileged identities, modified entities, and unauthorized executions.</p>
        </div>
      </div>

      {/* Scenario Filter Buttons */}
      <Card className="p-3">
        <div className="flex flex-wrap items-center gap-3">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 mr-2">Graph Scenario:</span>
          
          <button
            onClick={() => setScenario('compromised')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              scenario === 'compromised' || scenario === 'attack'
                ? 'bg-red-500/20 text-red-400 border border-red-500/50 shadow-[0_0_12px_rgba(239,68,68,0.2)]'
                : 'bg-slate-800/80 hover:bg-slate-700 text-slate-300 border border-slate-700'
            }`}
          >
            <AlertTriangle size={16} className="text-red-500" />
            Attack Linkage Chain (EMP-1042)
          </button>

          <button
            onClick={() => setScenario('emergency')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              scenario === 'emergency' || scenario === 'legitimate_exception'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/50 shadow-[0_0_12px_rgba(245,158,11,0.2)]'
                : 'bg-slate-800/80 hover:bg-slate-700 text-slate-300 border border-slate-700'
            }`}
          >
            <ShieldCheck size={16} className="text-amber-400" />
            Legitimate ITSM Correlation (EMP-1098)
          </button>

          <button
            onClick={() => setScenario('normal')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              scenario === 'normal'
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/50 shadow-[0_0_12px_rgba(16,185,129,0.2)]'
                : 'bg-slate-800/80 hover:bg-slate-700 text-slate-300 border border-slate-700'
            }`}
          >
            <Activity size={16} className="text-emerald-400" />
            Baseline Relationship Graph (EMP-1002)
          </button>
        </div>
      </Card>

      <Card className="flex-1 min-h-[580px] p-0 overflow-hidden relative">
        {loading ? (
          <div className="h-full flex items-center justify-center p-12 text-slate-400 animate-pulse">
            Loading graph topology...
          </div>
        ) : nodes.length === 0 ? (
          <div className="h-full flex items-center justify-center p-12 text-slate-500 text-center">
            No graph data available. Click one of the scenario buttons above.
          </div>
        ) : (
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            fitView
            className="bg-darker"
          >
            <Background color="#334155" gap={16} />
            <Controls className="bg-panel border border-slate-700 text-slate-300" />
          </ReactFlow>
        )}
      </Card>
    </div>
  );
}
