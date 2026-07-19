import React from 'react';
import { Shield, ShieldAlert, ShieldCheck, Zap, Server } from 'lucide-react';

export const SecurityStatusPanel: React.FC = () => {
  return (
    <div className="glass-panel p-6 relative overflow-hidden group h-full">
      <div className="absolute -top-12 -right-12 w-32 h-32 bg-neon-purple-500/10 rounded-full blur-3xl group-hover:bg-neon-purple-500/20 transition-all duration-500" />
      
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-white font-display font-bold text-sm flex items-center gap-2">
          <Shield className="w-4 h-4 text-neon-purple-400" />
          Security Governance
        </h3>
        <span className="px-2 py-0.5 rounded-md bg-state-success-bg/15 text-state-success-text text-[9px] font-mono font-bold tracking-widest uppercase border border-state-success-text/20">
          Shield_Active
        </span>
      </div>

      <div className="space-y-6">
        <p className="text-void-400 text-[11px] leading-relaxed font-sans pr-4">
          Stadium APIs are protected by Google Cloud Armor and Firebase App Check. reCAPTCHA Enterprise attestation tokens are required for all non-read operations.
        </p>

        <div className="space-y-3">
          <div className="bg-void-950/60 border border-void-600/10 p-3.5 rounded-xl flex flex-col gap-2.5">
             <div className="flex justify-between items-center text-[10px] font-mono">
              <span className="text-void-500 uppercase tracking-tighter">Security_Provider</span>
              <span className="text-white font-bold">reCAPTCHA Enterprise</span>
            </div>
             <div className="flex justify-between items-center text-[10px] font-mono">
              <span className="text-void-500 uppercase tracking-tighter">Attestation_Tier</span>
              <span className="text-neon-purple-400 font-bold uppercase tracking-widest">Hardware_Verified</span>
            </div>
            <div className="flex justify-between items-center text-[10px] font-mono">
              <span className="text-void-500 uppercase tracking-tighter">Traffic_SLA</span>
              <span className="text-white font-bold">100% Filtered</span>
            </div>
          </div>

          <div className="flex gap-2">
            <div className="flex-grow p-3 bg-void-900 border border-void-800 rounded-lg flex items-center gap-2.5">
              <Zap className="w-3.5 h-3.5 text-neon-purple-400" />
              <div className="flex flex-col">
                <span className="text-[9px] font-mono font-bold text-void-600 uppercase leading-none">DDOS Defense</span>
                <span className="text-[10px] text-void-300 font-bold">Automatic</span>
              </div>
            </div>
            <div className="flex-grow p-3 bg-void-900 border border-void-800 rounded-lg flex items-center gap-2.5">
              <Server className="w-3.5 h-3.5 text-neon-blue-400" />
              <div className="flex flex-col">
                <span className="text-[9px] font-mono font-bold text-void-600 uppercase leading-none">Region</span>
                <span className="text-[10px] text-void-300 font-bold">Multi-Cloud</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
