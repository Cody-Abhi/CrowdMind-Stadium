import React, { useState, useEffect, useRef } from 'react';
import { Terminal } from 'lucide-react';
import { db, collection, query, orderBy, onSnapshot } from '../../firebase';
import { AnalyticsEvent } from '../../types';

export const AuditLogs: React.FC = () => {
  const [logs, setLogs] = useState<AnalyticsEvent[]>([]);
  const [filterCategory, setFilterCategory] = useState('all');
  const terminalEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const q = query(collection(db, 'analytics_events'), orderBy('timestamp', 'asc'));
    const unsub = onSnapshot(q, (snap) => {
      const list: AnalyticsEvent[] = [];
      snap.forEach(d => list.push({ id: d.id, ...d.data() } as AnalyticsEvent));
      setLogs(list);
    });
    return unsub;
  }, []);

  useEffect(() => {
    if (terminalEndRef.current) {
      terminalEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [logs]);

  const filteredLogs = filterCategory === 'all' 
    ? logs 
    : logs.filter(l => l.category === filterCategory);

  const categories = ['all', 'Authentication', 'Firebase System', 'Remote Config', 'Security Rules', 'Cloud Storage'];

  return (
    <div className="glass-card p-6 flex flex-col h-[600px] font-mono border-neon-cyan-500/10">
      <div className="flex flex-wrap justify-between items-center gap-4 mb-6 border-b border-void-700/40 pb-4">
        <div className="flex items-center gap-3">
          <Terminal className="w-5 h-5 text-neon-cyan-400 animate-pulse" aria-hidden="true" />
          <div>
            <h3 className="font-display font-bold text-base text-white tracking-tight uppercase">Immutable Event Ledger</h3>
            <div className="text-[9px] text-neon-cyan-500 font-bold uppercase mt-0.5 tracking-wider">plant_audit_ledger v2.0</div>
          </div>
        </div>

        <div className="flex flex-wrap gap-1.5 bg-void-950 p-1 rounded-lg border border-void-600/20" role="toolbar" aria-label="Filter ledger category">
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setFilterCategory(c)}
              className={`px-2.5 py-1 rounded text-[8px] font-bold uppercase transition-all cursor-pointer ${
                filterCategory === c 
                  ? 'bg-neon-cyan-500/10 text-neon-cyan-400 border border-neon-cyan-500/30' 
                  : 'text-void-500 hover:text-white border border-transparent'
              }`}
              aria-pressed={filterCategory === c}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* Terminal View Screen */}
      <div className="flex-grow bg-void-950/80 border border-void-700/40 rounded-2xl p-5 overflow-y-auto custom-scrollbar relative" role="log" aria-label="Terminal ledger logs">
        <div className="absolute inset-0 cyber-grid-overlay opacity-5 pointer-events-none" aria-hidden="true" />
        <div className="space-y-2 text-[10px] text-neon-cyan-400/90 leading-relaxed font-bold">
          {filteredLogs.map((log) => (
            <div key={log.id} className="flex flex-wrap gap-2 hover:bg-void-900/50 p-1.5 rounded transition-all">
              <span className="text-void-600 font-semibold">[{new Date(log.timestamp).toISOString()}]</span>
              <span className="text-neon-purple-400 font-semibold">&lt;{log.category}&gt;</span>
              <span className="text-white font-medium">{log.eventName}</span>
              <span className="text-void-500 font-semibold font-mono font-medium">({log.userEmail})</span>
            </div>
          ))}
          <div ref={terminalEndRef} />
        </div>
      </div>

      <div className="flex justify-between items-center text-[9px] text-void-600 mt-4 uppercase">
        <span>Ledger Node: Lusail-Mainframe-01</span>
        <span>Secure Session Verified ✓</span>
      </div>
    </div>
  );
};
