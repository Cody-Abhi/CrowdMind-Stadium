import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShieldAlert } from 'lucide-react';
import { Incident } from '../MissionControl';

interface IncidentStreamProps {
  incidents: Incident[];
  handleDispatchIncident: (id: string, location: string, squad: string) => void;
  handleResolveIncident: (id: string, location: string) => void;
}

export const IncidentStream: React.FC<IncidentStreamProps> = ({
  incidents,
  handleDispatchIncident,
  handleResolveIncident
}) => {
  return (
    <div className="glass-panel p-5 space-y-4 flex flex-col h-[500px]">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ShieldAlert className="w-5 h-5 text-red-400" />
          <h2 className="font-display font-bold text-sm text-white uppercase tracking-wider">Ops Incident Stream</h2>
        </div>
        <span className="font-mono text-[10px] text-void-500 animate-pulse uppercase tracking-widest">Live</span>
      </div>

      <div className="flex-1 overflow-y-auto space-y-3 pr-2 custom-scrollbar">
        <AnimatePresence initial={false}>
          {incidents.map(inc => (
            <motion.div 
              key={inc.id}
              layout
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className={`p-4 rounded-2xl border transition-all ${inc.status === 'resolved' ? 'bg-void-900/40 border-void-800 opacity-50' : inc.urgency === 'critical' ? 'bg-red-500/5 border-red-500/30' : 'bg-void-800/50 border-void-700'}`}
            >
              <div className="flex justify-between items-start mb-2">
                <span className="font-mono text-[9px] font-bold text-void-400 uppercase">{inc.time}</span>
                <span className={`px-2 py-0.5 rounded text-[8px] font-mono font-bold uppercase ${inc.urgency === 'critical' ? 'bg-red-500 text-white' : 'bg-void-700 text-void-300'}`}>
                  {inc.urgency}
                </span>
              </div>
              <p className="text-xs font-bold text-white mb-1 uppercase tracking-tight">{inc.location}</p>
              <p className="text-[11px] text-void-400 mb-3">{inc.description}</p>
              
              {inc.status !== 'resolved' && (
                <div className="flex gap-2">
                  <button 
                    onClick={() => handleDispatchIncident(inc.id, inc.location, "Squad Delta")}
                    className="flex-1 py-1.5 bg-neon-blue-600 hover:bg-neon-blue-500 text-white font-mono text-[9px] font-bold uppercase tracking-widest rounded-lg transition-all"
                  >
                    Dispatch
                  </button>
                  <button 
                    onClick={() => handleResolveIncident(inc.id, inc.location)}
                    className="px-3 py-1.5 bg-void-700 hover:bg-void-600 text-void-300 font-mono text-[9px] font-bold uppercase tracking-widest rounded-lg transition-all"
                  >
                    Clear
                  </button>
                </div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};
