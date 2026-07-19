import React from 'react';
import { motion } from 'motion/react';
import { Database, Search, User } from 'lucide-react';

interface FirestoreTabProps {
  analyticsEvents: any[];
}

export const FirestoreTab: React.FC<FirestoreTabProps> = ({ analyticsEvents }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }} 
      animate={{ opacity: 1, y: 0 }} 
      exit={{ opacity: 0, y: -10 }} 
      className="space-y-6"
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h3 className="font-display font-bold text-xl text-white mb-1 flex items-center gap-2">
            <Database className="w-5 h-5 text-neon-cyan-400" />
            Live Firestore Collections
          </h3>
          <p className="text-void-400 text-sm">
            Operational telemetry stream from the `analytics_events` collection.
          </p>
        </div>
        <div className="relative group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-void-500 group-focus-within:text-neon-cyan-400 transition-colors" />
          <input 
            type="text" 
            placeholder="Filter by event..." 
            className="bg-void-900/50 border border-void-600/20 rounded-xl pl-9 pr-4 py-2 text-xs text-white focus:outline-none focus:border-neon-cyan-500/50 w-full md:w-64 transition-all"
          />
        </div>
      </div>

      <div className="glass-panel overflow-hidden border-void-600/10">
        <div className="bg-void-950/80 px-6 py-4 border-b border-void-600/20 grid grid-cols-12 gap-4 text-[10px] font-mono font-bold text-void-500 uppercase tracking-widest">
          <div className="col-span-3">Event Signature</div>
          <div className="col-span-2">Namespace</div>
          <div className="col-span-4">Execution Time</div>
          <div className="col-span-3 text-right">Originating Node</div>
        </div>

        <div className="max-h-[400px] overflow-y-auto custom-scrollbar divide-y divide-void-600/5">
          {analyticsEvents.length === 0 ? (
            <div className="py-24 flex flex-col items-center justify-center space-y-3 opacity-40">
              <Database className="w-10 h-10 text-void-500" />
              <p className="text-xs font-mono text-void-500 uppercase tracking-widest">No telemetry logs detected</p>
            </div>
          ) : (
            analyticsEvents.map((evt, idx) => (
              <motion.div 
                key={evt.id || idx} 
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.03 }}
                className="px-6 py-4 grid grid-cols-12 gap-4 text-xs items-center hover:bg-void-500/5 transition-colors group"
              >
                <div className="col-span-3 font-mono font-bold text-neon-cyan-400 group-hover:text-neon-cyan-300 transition-colors truncate">
                  {evt.eventName}
                </div>
                <div className="col-span-2">
                  <span className="px-2 py-0.5 rounded-md bg-void-800 text-void-400 text-[10px] font-mono border border-void-700">
                    {evt.category}
                  </span>
                </div>
                <div className="col-span-4 text-void-500 font-mono text-[11px]">
                  {evt.timestamp}
                </div>
                <div className="col-span-3 text-right flex items-center justify-end gap-2">
                  <span className="text-void-400 font-mono truncate max-w-[150px]">{evt.userEmail}</span>
                  <div className="w-6 h-6 rounded-full bg-void-800 flex items-center justify-center border border-void-700">
                    <User className="w-3 h-3 text-void-500" />
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </div>

      <div className="flex justify-between items-center text-[10px] font-mono text-void-500 uppercase tracking-widest px-2">
        <span>Displaying latest {analyticsEvents.length} events</span>
        <span className="text-neon-cyan-500/60">Auto-refreshing via Firestore Snapshots</span>
      </div>
    </motion.div>
  );
};
