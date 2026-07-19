import React from 'react';
import { Wifi, WifiOff, RefreshCw, Database } from 'lucide-react';

interface OfflinePersistencePanelProps {
  isOnline: boolean;
  offlineStatusMsg: string;
  handleToggleOffline: () => Promise<void>;
}

export const OfflinePersistencePanel: React.FC<OfflinePersistencePanelProps> = ({
  isOnline,
  offlineStatusMsg,
  handleToggleOffline
}) => {
  return (
    <div className="glass-panel p-6 relative overflow-hidden group h-full">
      <div className="absolute -top-12 -right-12 w-32 h-32 bg-neon-cyan-500/10 rounded-full blur-3xl group-hover:bg-neon-cyan-500/20 transition-all duration-500" />
      
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-white font-display font-bold text-sm flex items-center gap-2">
          {isOnline ? <Wifi className="w-4 h-4 text-neon-cyan-400" /> : <WifiOff className="w-4 h-4 text-state-danger-text" />}
          Offline Core Persistence
        </h3>
        <span className={`px-2 py-0.5 rounded-md text-[9px] font-mono font-bold uppercase tracking-widest ${
          isOnline 
            ? 'bg-state-success-bg/10 text-state-success-text border border-state-success-text/30' 
            : 'bg-state-danger-bg/20 text-state-danger-text border border-state-danger-text/30'
        }`}>
          {isOnline ? 'Network_Synched' : 'Local_Cache_Active'}
        </span>
      </div>

      <div className="space-y-6">
        <p className="text-void-400 text-[11px] leading-relaxed font-sans pr-4">
          Lusail Stadium SDK automatically caches operations in local IndexedDB containers when field connectivity drops. Use this toggle to simulate extreme high-density network interference.
        </p>

        <div className="bg-void-950/60 border border-void-600/10 p-4 rounded-xl flex items-start gap-3">
          <Database className={`w-4 h-4 mt-0.5 ${isOnline ? 'text-void-600' : 'text-neon-cyan-400'}`} />
          <p className="text-[10px] text-void-300 font-mono leading-relaxed italic">
            "{offlineStatusMsg}"
          </p>
        </div>

        <button
          onClick={handleToggleOffline}
          className={`w-full py-3.5 rounded-xl font-bold text-[11px] uppercase tracking-widest transition-all duration-500 flex items-center justify-center gap-2 border ${
            isOnline 
              ? 'bg-void-900/50 hover:bg-void-800 text-void-400 hover:text-white border-void-700/50' 
              : 'bg-neon-cyan-500 text-white shadow-neon-glow-cyan border-neon-cyan-400/50'
          }`}
        >
          {isOnline ? (
            <>
              <WifiOff className="w-4 h-4" /> Sever Mainframe Uplink
            </>
          ) : (
            <>
              <RefreshCw className="w-4 h-4 animate-spin" /> Restoring Mesh Sync
            </>
          )}
        </button>
      </div>
    </div>
  );
};
