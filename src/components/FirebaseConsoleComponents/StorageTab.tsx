import React from 'react';
import { motion } from 'motion/react';
import { HardDrive, Upload, Download, FileText, RefreshCw, Plus } from 'lucide-react';
import { StorageItem } from '../../types';

interface StorageTabProps {
  storageItems: StorageItem[];
  newFileName: string;
  setNewFileName: (val: string) => void;
  newFileSize: string;
  setNewFileSize: (val: string) => void;
  newFileCategory: string;
  setNewFileCategory: (val: string) => void;
  isUploading: boolean;
  handleSimulatedUpload: (e: React.FormEvent) => Promise<void>;
}

export const StorageTab: React.FC<StorageTabProps> = ({
  storageItems,
  newFileName,
  setNewFileName,
  newFileSize,
  setNewFileSize,
  newFileCategory,
  isUploading,
  setNewFileCategory,
  handleSimulatedUpload
}) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }} 
      animate={{ opacity: 1, y: 0 }} 
      exit={{ opacity: 0, y: -10 }} 
      className="space-y-8"
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Upload simulated file panel */}
        <div className="lg:col-span-4 space-y-6">
          <div className="glass-panel p-6 border-neon-cyan-500/10">
            <h4 className="text-white font-bold text-sm uppercase tracking-wider mb-6 flex items-center gap-2">
              <Plus className="w-4 h-4 text-neon-cyan-400" /> 
              Ingest Diagnostic Asset
            </h4>
            
            <form onSubmit={handleSimulatedUpload} className="space-y-5">
              <div className="space-y-2">
                <label className="text-[10px] text-void-500 font-mono font-bold uppercase tracking-widest">Resource Identifier</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. system_audit_log.env"
                  value={newFileName}
                  onChange={(e) => setNewFileName(e.target.value)}
                  className="w-full bg-void-950/50 border border-void-600/30 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-neon-cyan-500 font-mono transition-all"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] text-void-500 font-mono font-bold uppercase tracking-widest">Payload Size</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 1.2 MB"
                    value={newFileSize}
                    onChange={(e) => setNewFileSize(e.target.value)}
                    className="w-full bg-void-950/50 border border-void-600/30 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-neon-cyan-500 font-mono transition-all"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] text-void-500 font-mono font-bold uppercase tracking-widest">Matrix Tier</label>
                  <select
                    value={newFileCategory}
                    onChange={(e) => setNewFileCategory(e.target.value)}
                    className="w-full bg-void-950/50 border border-void-600/30 rounded-xl px-2 py-3 text-xs text-white focus:outline-none focus:border-neon-cyan-500 font-mono transition-all appearance-none cursor-pointer"
                  >
                    <option value="General Logs">General Logs</option>
                    <option value="RAG Ingest Logs">RAG Ingest Logs</option>
                    <option value="P&ID Blueprints">P&ID Blueprints</option>
                    <option value="OEM Manuals">OEM Manuals</option>
                  </select>
                </div>
              </div>

              <button
                type="submit"
                disabled={isUploading}
                className="w-full py-4 bg-neon-cyan-500 hover:bg-neon-cyan-400 text-white font-bold text-xs uppercase tracking-widest rounded-xl transition-all disabled:opacity-50 flex items-center justify-center gap-2 shadow-neon-glow-cyan"
              >
                {isUploading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" /> Stream Transferring...
                  </>
                ) : (
                  <>
                    <Upload className="w-4 h-4" /> Push to Cloud Bucket
                  </>
                )}
              </button>
            </form>
          </div>

          <div className="p-4 bg-void-950/30 rounded-xl border border-void-600/10">
            <p className="text-[10px] text-void-500 font-mono leading-relaxed italic">
              * Simulated storage handler. Operations are mirrored in the `cloud_storage_metadata` collection for structural persistence tests.
            </p>
          </div>
        </div>

        {/* List file assets */}
        <div className="lg:col-span-8 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="font-display font-bold text-xl text-white flex items-center gap-2">
              <HardDrive className="w-5 h-5 text-neon-cyan-400" />
              Cloud Storage Manifest
            </h3>
            <span className="text-[10px] font-mono text-void-500 uppercase tracking-widest">
              {storageItems.length} Objects Tracked
            </span>
          </div>

          <div className="glass-panel overflow-hidden">
            <div className="bg-void-950/80 px-6 py-4 border-b border-void-600/20 grid grid-cols-12 gap-4 text-[10px] font-mono font-bold text-void-500 uppercase tracking-widest">
              <div className="col-span-5">Object Name</div>
              <div className="col-span-2">Payload</div>
              <div className="col-span-3">Tier</div>
              <div className="col-span-2 text-right">Interaction</div>
            </div>

            <div className="max-h-[450px] overflow-y-auto custom-scrollbar divide-y divide-void-600/5">
              {storageItems.length === 0 ? (
                <div className="py-32 flex flex-col items-center justify-center space-y-3 opacity-30">
                  <HardDrive className="w-12 h-12 text-void-500" />
                  <p className="text-xs font-mono text-void-500 uppercase tracking-widest">Storage bucket is empty</p>
                </div>
              ) : (
                storageItems.map((item, idx) => (
                  <motion.div 
                    key={item.id || idx} 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className="px-6 py-4 grid grid-cols-12 gap-4 text-xs items-center hover:bg-void-500/5 transition-colors group"
                  >
                    <div className="col-span-5 font-bold text-white truncate flex items-center gap-3">
                      <div className="p-2 bg-void-800 rounded-lg group-hover:bg-neon-blue-500/10 transition-colors">
                        <FileText className="w-4 h-4 text-neon-blue-400" />
                      </div>
                      <span className="truncate">{item.name}</span>
                    </div>
                    <div className="col-span-2 text-void-500 font-mono">{item.size}</div>
                    <div className="col-span-3">
                      <span className="text-neon-cyan-400 font-mono text-[10px] uppercase">{item.category || 'General Logs'}</span>
                    </div>
                    <div className="col-span-2 text-right">
                      <a
                        href={item.downloadUrl}
                        download
                        className="p-2 bg-void-800 hover:bg-neon-cyan-500 text-void-400 hover:text-white rounded-lg transition-all inline-flex items-center gap-1.5 group/btn border border-void-700"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span className="text-[10px] font-bold uppercase tracking-tighter">Fetch</span>
                      </a>
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
