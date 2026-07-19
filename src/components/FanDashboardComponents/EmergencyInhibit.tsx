import React from 'react';
import { AlertOctagon } from 'lucide-react';
import { motion } from 'motion/react';

interface EmergencyInhibitProps {
  isActivating: boolean;
  progress: number;
  startActivation: () => void;
  cancelActivation: () => void;
}

export const EmergencyInhibit: React.FC<EmergencyInhibitProps> = ({
  isActivating,
  progress,
  startActivation,
  cancelActivation
}) => {
  return (
    <div className="glass-card p-6">
      <div className="flex items-center gap-2 mb-4">
        <AlertOctagon className="w-4 h-4 text-state-danger-text animate-pulse" aria-hidden="true" />
        <h4 className="font-display font-bold text-white text-sm">Emergency Safety Inhibit</h4>
      </div>
      <p className="text-void-400 text-xs leading-relaxed mb-6">
        Press and hold the button below to initiate manual nitrogen gas fire suppression agent dispatch.
      </p>
      
      <button
        onMouseDown={startActivation}
        onMouseUp={cancelActivation}
        onMouseLeave={cancelActivation}
        onTouchStart={startActivation}
        onTouchEnd={cancelActivation}
        className="w-full py-4 rounded-xl border border-state-danger-text/20 bg-state-danger-bg/10 hover:bg-state-danger-bg/20 text-state-danger-text text-xs uppercase font-bold tracking-wider relative overflow-hidden transition-colors cursor-pointer"
        aria-label="Hold to dispatch suppression"
      >
        <span className="relative z-10">Hold to Dispatch Suppression</span>
        {isActivating && (
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            className="absolute inset-y-0 left-0 bg-state-danger-text/20 z-0" 
          />
        )}
      </button>
    </div>
  );
};
export default EmergencyInhibit;
