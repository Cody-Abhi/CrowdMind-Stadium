import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { AlertOctagon, ShieldAlert, Heart, X } from 'lucide-react';

interface EmergencySOSProps {
  emergencyType: string;
  setEmergencyType: (val: string) => void;
  sosProgress: number;
  isSosPressing: boolean;
  isSosActive: boolean;
  startSosPress: () => void;
  cancelSosPress: () => void;
  resetSosEmergency: () => void;
  t: any;
}

export const EmergencySOS: React.FC<EmergencySOSProps> = ({
  emergencyType,
  setEmergencyType,
  sosProgress,
  isSosPressing,
  isSosActive,
  startSosPress,
  cancelSosPress,
  resetSosEmergency,
  t
}) => {
  const emergencies = [
    { id: 'Medical Incident', icon: Heart, color: 'text-red-400' },
    { id: 'Security Concern', icon: ShieldAlert, color: 'text-orange-400' },
    { id: 'Accessibility Help', icon: AlertOctagon, color: 'text-neon-cyan-400' },
  ];

  return (
    <div className="bg-void-850 border border-void-600/30 rounded-2xl p-6 h-full flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <div>
          <span className="text-[9px] font-mono text-state-danger-text uppercase tracking-widest block font-bold">
            🚨 CRITICAL DISPATCH
          </span>
          <h3 className="font-display font-bold text-xl text-white mt-1">{t.emergencyTitle}</h3>
        </div>
        <AlertOctagon className="w-5 h-5 text-state-danger-text animate-pulse" />
      </div>

      <div className="flex-grow space-y-6">
        <p className="text-xs text-void-400 leading-relaxed">
          Request immediate physical assistance to your seat. Use only in genuine emergencies.
        </p>

        {!isSosActive ? (
          <div className="space-y-6">
            <div className="grid grid-cols-1 gap-3">
              {emergencies.map((type) => (
                <button
                  key={type.id}
                  onClick={() => setEmergencyType(type.id)}
                  className={`p-3 rounded-xl border transition-all flex items-center gap-3 ${
                    emergencyType === type.id 
                      ? 'bg-state-danger-bg/10 border-state-danger-text text-white' 
                      : 'bg-void-900 border-void-700/50 text-void-500 hover:text-void-300'
                  }`}
                >
                  <type.icon className={`w-4 h-4 ${emergencyType === type.id ? type.color : ''}`} />
                  <span className="text-xs font-bold">{type.id}</span>
                </button>
              ))}
            </div>

            <div className="relative pt-8 flex flex-col items-center">
              {/* SOS BUTTON */}
              <motion.button
                onMouseDown={startSosPress}
                onMouseUp={cancelSosPress}
                onMouseLeave={cancelSosPress}
                onTouchStart={startSosPress}
                onTouchEnd={cancelSosPress}
                whileTap={{ scale: 0.95 }}
                className={`relative w-28 h-28 rounded-full flex flex-col items-center justify-center gap-1 transition-all z-10 shadow-2xl overflow-hidden ${
                  isSosPressing ? 'scale-105' : ''
                }`}
              >
                <div className="absolute inset-0 bg-state-danger-bg animate-pulse" />
                <div className="absolute inset-0 bg-state-danger-text opacity-20" />
                
                {/* Progress Ring */}
                <svg className="absolute inset-0 w-full h-full -rotate-90">
                  <circle
                    cx="56"
                    cy="56"
                    r="52"
                    stroke="currentColor"
                    strokeWidth="8"
                    fill="transparent"
                    className="text-white/10"
                  />
                  <motion.circle
                    cx="56"
                    cy="56"
                    r="52"
                    stroke="currentColor"
                    strokeWidth="8"
                    fill="transparent"
                    strokeDasharray="326.7"
                    strokeDashoffset={326.7 - (326.7 * sosProgress) / 100}
                    className="text-white"
                  />
                </svg>

                <span className="text-white font-black text-2xl tracking-tighter z-20">SOS</span>
                <span className="text-[8px] text-white font-bold uppercase z-20 tracking-widest">Hold</span>
              </motion.button>
              
              <div className="absolute top-0 w-40 h-40 bg-state-danger-text/5 blur-3xl rounded-full" />
              
              <p className="text-[10px] text-void-500 font-mono mt-6 text-center">
                {isSosPressing ? 'HOLDING... DO NOT RELEASE' : t.emergencyBtn}
              </p>
            </div>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex-grow flex flex-col items-center justify-center text-center p-6 bg-state-danger-bg/10 border border-state-danger-text/20 rounded-2xl"
          >
            <div className="w-16 h-16 bg-state-danger-bg rounded-full flex items-center justify-center mb-4 shadow-neon-glow-red">
              <ShieldAlert className="w-8 h-8 text-state-danger-text animate-bounce" />
            </div>
            <h4 className="text-white font-bold text-base mb-1">{t.emergencyTriggered}</h4>
            <p className="text-[10px] text-void-300 font-mono mb-6 leading-relaxed uppercase tracking-wide">
              Steward team is en route to Section 108, Row L, Seat 14. Arrival estimated: 90s.
            </p>
            
            <button
              onClick={resetSosEmergency}
              className="px-4 py-2 rounded-lg bg-void-900 border border-void-700 text-void-400 hover:text-white transition-all flex items-center gap-2 text-[10px] font-bold uppercase"
            >
              <X className="w-3.5 h-3.5" />
              Cancel Dispatch
            </button>
          </motion.div>
        )}
      </div>

      <div className="mt-6 pt-4 border-t border-void-600/10 grid grid-cols-2 gap-4">
        <div className="bg-void-900 p-2 rounded-lg border border-void-700/30">
          <span className="text-[8px] text-void-500 block uppercase font-mono">Current Logic</span>
          <span className="text-[10px] text-white font-bold font-mono">Priority Alpha</span>
        </div>
        <div className="bg-void-900 p-2 rounded-lg border border-void-700/30">
          <span className="text-[8px] text-void-500 block uppercase font-mono">Channel</span>
          <span className="text-[10px] text-white font-bold font-mono">SEC_01_EMER</span>
        </div>
      </div>
    </div>
  );
};
