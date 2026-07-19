import React from 'react';
import { motion } from 'motion/react';
import { Shield, FileCode, CheckCircle, AlertTriangle, Layers, Zap } from 'lucide-react';

interface SecurityTabProps {
  rawSecurityRules: string;
  deployRulesSuccess: boolean;
  handleDeployRules: () => void;
  compoundIndexes: any[];
}

export const SecurityTab: React.FC<SecurityTabProps> = ({
  rawSecurityRules,
  deployRulesSuccess,
  handleDeployRules,
  compoundIndexes
}) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }} 
      animate={{ opacity: 1, y: 0 }} 
      exit={{ opacity: 0, y: -10 }} 
      className="space-y-8"
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Rules Viewer */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <h3 className="font-display font-bold text-xl text-white flex items-center gap-2">
              <Shield className="w-5 h-5 text-neon-cyan-400" />
              Firestore Security Matrix
            </h3>
            <button
              onClick={handleDeployRules}
              className={`px-4 py-2 rounded-xl text-[11px] font-bold uppercase tracking-widest transition-all duration-300 flex items-center gap-2 ${
                deployRulesSuccess 
                  ? 'bg-state-success-bg/20 text-state-success-text border border-state-success-text/40 shadow-state-success-glow' 
                  : 'bg-neon-cyan-500 hover:bg-neon-cyan-400 text-white shadow-neon-glow-cyan'
              }`}
            >
              {deployRulesSuccess ? (
                <>
                  <CheckCircle className="w-3.5 h-3.5" /> Deployment Success
                </>
              ) : (
                <>
                  <Zap className="w-3.5 h-3.5" /> Deploy Cloud Rules
                </>
              )}
            </button>
          </div>

          <div className="glass-panel relative overflow-hidden group">
            <div className="absolute top-4 right-6 text-[10px] font-mono text-void-600 group-hover:text-void-400 transition-colors uppercase tracking-widest font-bold">
              firestore.rules
            </div>
            <div className="bg-void-950/80 p-6 font-mono text-[11px] text-void-300 leading-relaxed max-h-[400px] overflow-y-auto custom-scrollbar border-b border-void-600/10">
              <pre className="text-neon-cyan-500/80">
                {rawSecurityRules}
              </pre>
            </div>
            <div className="p-4 bg-void-900/50 flex items-center gap-3">
              <FileCode className="w-4 h-4 text-void-500" />
              <span className="text-[10px] font-mono text-void-500 uppercase tracking-widest">
                Compiler: Production v2 (LXS-Shield)
              </span>
            </div>
          </div>

          <div className="p-4 bg-void-950/30 rounded-xl border border-void-600/10 flex items-start gap-3">
            <AlertTriangle className="w-4 h-4 text-state-warning-text flex-shrink-0 mt-0.5" />
            <p className="text-[10px] text-void-500 font-mono leading-relaxed">
              Rules strictly enforce Role-Based Access Control (RBAC). Modifications require high-level clearance and affect all active spectator sessions instantly.
            </p>
          </div>
        </div>

        {/* Composite Indexes */}
        <div className="lg:col-span-5 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="font-display font-bold text-xl text-white flex items-center gap-2">
              <Layers className="w-5 h-5 text-neon-purple-400" />
              Advanced Data Mesh
            </h3>
            <span className="text-[10px] font-mono text-void-500 uppercase tracking-widest">Status: Balanced</span>
          </div>

          <div className="space-y-4">
            <h4 className="text-[10px] font-mono font-bold text-void-400 uppercase tracking-widest px-1">Active Compound Indexes</h4>
            {compoundIndexes.map((idx, i) => (
              <motion.div 
                key={i} 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className="glass-panel p-5 space-y-3 group hover:border-neon-purple-500/30 transition-all"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-neon-purple-400">{idx.name}</span>
                  <div className="w-2 h-2 rounded-full bg-state-success-text" />
                </div>
                
                <div className="bg-void-950/80 p-3 rounded-lg border border-void-600/10 font-mono text-[10px] text-void-400 leading-normal">
                  <span className="text-void-600 block mb-1 font-bold">QUERY_PATH:</span>
                  {idx.fields}
                </div>
                
                <p className="text-[11px] text-void-500 font-sans leading-snug pr-2 italic">
                  "{idx.usage}"
                </p>
              </motion.div>
            ))}
          </div>

          <div className="glass-panel p-5 border-void-600/10 bg-void-950/20">
            <div className="flex items-start gap-4">
              <div className="p-2 bg-void-900 rounded-lg">
                <Shield className="w-5 h-5 text-neon-cyan-500" />
              </div>
              <div className="space-y-1">
                <h5 className="text-xs font-bold text-white uppercase tracking-wider">App Check Protection</h5>
                <p className="text-[10px] text-void-400 leading-relaxed">
                  Verified reCAPTCHA Enterprise attestation active. All API requests must present a valid hardware attestation token.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
