import React from 'react';
import { motion } from 'motion/react';
import { Sliders } from 'lucide-react';

interface RemoteConfigTabProps {
  remoteConfig: {
    ticketSaleDiscount: number;
    coolingHvacThreshold: number;
    biometricScanDelay: number;
    emergencyLockdown: boolean;
    gateAOverflowEnabled: boolean;
  };
  isConfigLoading: boolean;
  handleUpdateConfig: (key: string, value: any) => Promise<void>;
}

export const RemoteConfigTab: React.FC<RemoteConfigTabProps> = ({
  remoteConfig,
  isConfigLoading,
  handleUpdateConfig
}) => {
  if (isConfigLoading) {
    return (
      <div className="py-24 flex flex-col items-center justify-center space-y-4">
        <div className="w-8 h-8 border-2 border-neon-cyan-500/20 border-t-neon-cyan-500 rounded-full animate-spin" />
        <p className="text-xs font-mono text-void-500 animate-pulse">Synchronizing Global Variables...</p>
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }} 
      animate={{ opacity: 1, y: 0 }} 
      exit={{ opacity: 0, y: -10 }} 
      className="space-y-8"
    >
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h3 className="font-display font-bold text-xl text-white mb-2 flex items-center gap-2">
            <Sliders className="w-5 h-5 text-neon-cyan-400" />
            Remote Config Controller
          </h3>
          <p className="text-void-400 text-sm max-w-2xl leading-relaxed">
            Real-time variable injection for the Lusail Stadium mesh. Changes propagate to all edge nodes instantly via Firestore event listeners.
          </p>
        </div>
        <div className="bg-void-900/50 border border-void-600/20 rounded-lg px-3 py-1.5 flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-neon-cyan-500 animate-pulse" />
          <span className="text-[10px] font-mono text-void-400 uppercase tracking-widest">Live Sync Active</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Control 1: Ticket Discount % */}
        <div className="glass-panel p-6 space-y-4 group">
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <span className="text-[10px] font-mono font-bold text-neon-cyan-400 uppercase tracking-tighter">TICKET_PROMO_DISCOUNT</span>
              <h4 className="text-white font-semibold text-sm">Fan Incentive Scaling</h4>
            </div>
            <span className="text-xl font-display font-bold text-neon-cyan-400">{remoteConfig.ticketSaleDiscount}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="50"
            step="5"
            value={remoteConfig.ticketSaleDiscount}
            onChange={(e) => handleUpdateConfig('ticketSaleDiscount', Number(e.target.value))}
            className="w-full accent-neon-cyan-500 h-1.5 bg-void-800 rounded-lg cursor-pointer appearance-none"
          />
          <p className="text-[11px] text-void-500 leading-relaxed italic">
            Dynamically adjusts ticket pricing across all digital box offices.
          </p>
        </div>

        {/* Control 2: HVAC Base Threshold */}
        <div className="glass-panel p-6 space-y-4 group">
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <span className="text-[10px] font-mono font-bold text-neon-purple-400 uppercase tracking-tighter">COOLING_HVAC_THRESHOLD</span>
              <h4 className="text-white font-semibold text-sm">Climate Optimization</h4>
            </div>
            <span className="text-xl font-display font-bold text-neon-purple-400">{remoteConfig.coolingHvacThreshold}°C</span>
          </div>
          <input
            type="range"
            min="16"
            max="26"
            step="1"
            value={remoteConfig.coolingHvacThreshold}
            onChange={(e) => handleUpdateConfig('coolingHvacThreshold', Number(e.target.value))}
            className="w-full accent-neon-purple-500 h-1.5 bg-void-800 rounded-lg cursor-pointer appearance-none"
          />
          <p className="text-[11px] text-void-500 leading-relaxed italic">
            Sets the target temperature for the stadium's smart cooling system.
          </p>
        </div>

        {/* Control 3: Biometric Turnstile Scanner speed limit */}
        <div className="glass-panel p-6 space-y-4 group">
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <span className="text-[10px] font-mono font-bold text-neon-blue-400 uppercase tracking-tighter">BIOMETRIC_SCAN_DELAY_LIMIT</span>
              <h4 className="text-white font-semibold text-sm">Ingress Security Flux</h4>
            </div>
            <span className="text-xl font-display font-bold text-neon-blue-400">{remoteConfig.biometricScanDelay}s</span>
          </div>
          <input
            type="range"
            min="1.0"
            max="5.0"
            step="0.2"
            value={remoteConfig.biometricScanDelay}
            onChange={(e) => handleUpdateConfig('biometricScanDelay', Number(e.target.value))}
            className="w-full accent-neon-blue-500 h-1.5 bg-void-800 rounded-lg cursor-pointer appearance-none"
          />
          <p className="text-[11px] text-void-500 leading-relaxed italic">
            Balances security verification depth against entry speed bottlenecks.
          </p>
        </div>

        {/* Control 4: Emergency lockdown boolean */}
        <div className="glass-panel p-6 flex flex-col justify-between">
          <div className="flex justify-between items-start mb-6">
            <div className="space-y-1">
              <span className="text-[10px] font-mono font-bold text-state-danger-text uppercase tracking-tighter">EMERGENCY_LOCKDOWN_ENABLED</span>
              <h4 className="text-white font-semibold text-sm">Global Safety Override</h4>
            </div>
            <div className={`w-3 h-3 rounded-full ${remoteConfig.emergencyLockdown ? 'bg-state-danger-text shadow-state-danger-glow animate-pulse' : 'bg-void-700'}`} />
          </div>
          
          <button
            onClick={() => handleUpdateConfig('emergencyLockdown', !remoteConfig.emergencyLockdown)}
            className={`w-full py-3 rounded-xl text-xs font-bold uppercase tracking-widest transition-all duration-300 ${
              remoteConfig.emergencyLockdown 
                ? 'bg-state-danger-bg text-state-danger-text border border-state-danger-text/40 shadow-state-danger-glow hover:bg-state-danger-bg/80' 
                : 'bg-void-900/50 text-void-400 hover:text-white border border-void-600/30 hover:border-void-500'
            }`}
          >
            {remoteConfig.emergencyLockdown ? 'ABORT LOCKDOWN' : 'INITIATE LOCKDOWN'}
          </button>
        </div>
      </div>
    </motion.div>
  );
};
