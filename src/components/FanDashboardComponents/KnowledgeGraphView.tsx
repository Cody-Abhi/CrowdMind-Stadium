import React from 'react';
import { Network } from 'lucide-react';

interface KnowledgeGraphViewProps {
  selectedAsset: string;
}

export const KnowledgeGraphView: React.FC<KnowledgeGraphViewProps> = ({ selectedAsset }) => {
  return (
    <div className="glass-card p-6 flex flex-col h-[520px]">
      <div className="flex items-center gap-2 mb-4 pb-4 border-b border-void-600/10">
        <Network className="w-4 h-4 text-neon-cyan-400" aria-hidden="true" />
        <h3 className="font-display font-bold text-white text-sm">Knowledge Graph Node</h3>
      </div>
      
      <p className="text-void-400 text-xs leading-normal mb-6">
        Visualizes Adjacent semantic relationships (procedures, manual chapters, previous logs) grounded in Neo4j index schema.
      </p>

      <div className="flex-grow bg-void-900/40 rounded-xl border border-void-600/10 relative flex items-center justify-center p-4 overflow-hidden">
        {/* Mock Knowledge Graph SVG */}
        <svg className="w-full h-full min-h-[220px]" viewBox="0 0 200 200" aria-label={`Knowledge Graph diagram for asset ${selectedAsset}`}>
          {/* Connection lines */}
          <line x1="100" y1="100" x2="40" y2="60" stroke="rgba(0, 242, 255, 0.4)" strokeWidth="1" />
          <line x1="100" y1="100" x2="160" y2="60" stroke="rgba(0, 242, 255, 0.4)" strokeWidth="1" />
          <line x1="100" y1="100" x2="40" y2="140" stroke="rgba(139, 92, 246, 0.4)" strokeWidth="1" />
          <line x1="100" y1="100" x2="160" y2="140" stroke="rgba(34, 197, 94, 0.4)" strokeWidth="1" />

          {/* Central Asset node */}
          <circle cx="100" cy="100" r="16" fill="#040712" stroke="#00f2ff" strokeWidth="1.5" />
          <text x="100" y="103" textAnchor="middle" fill="#fff" fontSize="8" fontWeight="bold" fontFamily="monospace">{selectedAsset}</text>

          {/* Satellite nodes */}
          {/* Node 1: OEM Manual */}
          <circle cx="40" cy="60" r="10" fill="#040712" stroke="#0066ff" strokeWidth="1.2" />
          <text x="40" y="63" textAnchor="middle" fill="#0066ff" fontSize="6" fontWeight="bold" fontFamily="sans-serif">MAN</text>
          <text x="40" y="47" textAnchor="middle" fill="#4a5c9e" fontSize="5" fontWeight="bold" fontFamily="monospace">OEM Manual</text>

          {/* Node 2: Emergency SOP */}
          <circle cx="160" cy="60" r="10" fill="#040712" stroke="#00f2ff" strokeWidth="1.2" />
          <text x="160" y="63" textAnchor="middle" fill="#00f2ff" fontSize="6" fontWeight="bold" fontFamily="sans-serif">SOP</text>
          <text x="160" y="47" textAnchor="middle" fill="#4a5c9e" fontSize="5" fontWeight="bold" fontFamily="monospace">Safety SOP</text>

          {/* Node 3: Work Order */}
          <circle cx="40" cy="140" r="10" fill="#040712" stroke="#8b5cf6" strokeWidth="1.2" />
          <text x="40" y="143" textAnchor="middle" fill="#8b5cf6" fontSize="6" fontWeight="bold" fontFamily="sans-serif">WO</text>
          <text x="40" y="157" textAnchor="middle" fill="#4a5c9e" fontSize="5" fontWeight="bold" fontFamily="monospace">Lube Change WO</text>

          {/* Node 4: Inspection */}
          <circle cx="160" cy="140" r="10" fill="#040712" stroke="#22c55e" strokeWidth="1.2" />
          <text x="160" y="143" textAnchor="middle" fill="#22c55e" fontSize="6" fontWeight="bold" fontFamily="sans-serif">INS</text>
          <text x="160" y="157" textAnchor="middle" fill="#4a5c9e" fontSize="5" fontWeight="bold" fontFamily="monospace">Vibration Rec</text>
        </svg>
      </div>
    </div>
  );
};
export default KnowledgeGraphView;
