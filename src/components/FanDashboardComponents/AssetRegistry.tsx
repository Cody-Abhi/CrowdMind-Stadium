import React from 'react';
import { Cpu, RefreshCw } from 'lucide-react';
import { AssetData } from '../../types';
import { formatDate } from '../../utils/format';

interface AssetRegistryProps {
  selectedAsset: string;
  setSelectedAsset: (tag: string) => void;
  assetHistory: AssetData | null;
  loadingHistory: boolean;
  error: string | null;
}

export const AssetRegistry: React.FC<AssetRegistryProps> = ({
  selectedAsset,
  setSelectedAsset,
  assetHistory,
  loadingHistory,
  error
}) => {
  return (
    <div className="lg:col-span-2 glass-card p-6 flex flex-col h-[520px]">
      <div className="flex justify-between items-center mb-6 pb-4 border-b border-void-600/10">
        <div className="flex items-center gap-2">
          <Cpu className="w-4 h-4 text-neon-cyan-400" aria-hidden="true" />
          <h3 className="font-display font-bold text-white text-sm">Asset Operational Registry</h3>
        </div>
        <div className="flex gap-2" role="radiogroup" aria-label="Select asset tag filter">
          {["C-204", "P-101", "E-105"].map(tag => (
            <button
              key={tag}
              onClick={() => setSelectedAsset(tag)}
              className={`px-3 py-1 rounded-lg font-mono text-[10px] font-bold uppercase transition-all cursor-pointer ${
                selectedAsset === tag 
                  ? 'bg-neon-cyan-500/20 text-neon-cyan-400 border border-neon-cyan-500/40 shadow-neon-glow-cyan' 
                  : 'bg-void-900 text-void-500 border border-transparent hover:border-void-700'
              }`}
              role="radio"
              aria-checked={selectedAsset === tag}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      {loadingHistory ? (
        <div className="flex-grow flex items-center justify-center font-mono text-xs text-void-500" role="status">
          <RefreshCw className="w-5 h-5 animate-spin mr-2 text-neon-cyan-500" aria-hidden="true" />
          Loading history timeline...
        </div>
      ) : error ? (
        <div className="flex-grow flex items-center justify-center font-mono text-xs text-state-danger-text" role="alert">
          {error}
        </div>
      ) : assetHistory ? (
        <div className="flex-grow flex flex-col min-h-0">
          <div className="mb-4">
            <h4 className="text-sm font-bold text-white mb-1">{assetHistory.name}</h4>
            <span className="text-[10px] font-mono text-void-400 uppercase">
              Sector: {assetHistory.location} • Status:{' '}
              <strong className="text-state-success-text">{assetHistory.status}</strong>
            </span>
          </div>
          
          <h5 className="text-[10px] font-mono text-void-500 uppercase tracking-widest mb-3">Maintenance Timeline</h5>
          <div className="flex-grow overflow-y-auto space-y-3 pr-1 custom-scrollbar" role="feed" aria-label="Asset maintenance log feed">
            {assetHistory.history.map((log, idx) => (
              <article 
                key={idx} 
                className="p-3 bg-void-900 border border-void-600/10 rounded-xl relative pl-12 group hover:border-void-500 transition-colors"
                aria-label={`Log entry: ${log.title}`}
              >
                <div className="absolute left-4 top-4 w-4 h-4 rounded-full border border-void-700 bg-void-950 flex items-center justify-center">
                  <div className="w-1.5 h-1.5 rounded-full bg-neon-cyan-400" />
                </div>
                <div className="flex justify-between items-start gap-4 mb-1">
                  <span className="text-[10px] font-bold text-white">{log.title}</span>
                  <span className="text-[9px] font-mono text-void-500">{formatDate(log.date)}</span>
                </div>
                <p className="text-[10px] text-void-400 leading-normal">{log.findings}</p>
              </article>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
};
export default AssetRegistry;
