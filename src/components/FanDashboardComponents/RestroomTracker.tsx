import React from 'react';
import { motion } from 'motion/react';
import { Compass, Clock, MapPin, Bell } from 'lucide-react';

interface RestroomTrackerProps {
  restrooms: any[];
  notifiedRestroom: string | null;
  setNotifiedRestroom: (val: string | null) => void;
  t: any;
  speakAssistText: (text: string) => void;
}

export const RestroomTracker: React.FC<RestroomTrackerProps> = ({
  restrooms,
  notifiedRestroom,
  setNotifiedRestroom,
  t,
  speakAssistText
}) => {
  return (
    <div className="bg-void-850 border border-void-600/30 rounded-2xl p-6 h-full flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <div>
          <span className="text-[9px] font-mono text-neon-cyan-400 uppercase tracking-widest block font-bold">
            ⚡ QUEUE TELEMETRY
          </span>
          <h3 className="font-display font-bold text-xl text-white mt-1">{t.restroomTitle}</h3>
        </div>
        <Compass className="w-5 h-5 text-void-500" />
      </div>

      <div className="space-y-4 flex-grow">
        {restrooms.map((rr, idx) => (
          <div key={idx} className="p-4 bg-void-900 border border-void-700/50 rounded-xl flex items-center justify-between group hover:border-neon-cyan-500/30 transition-all">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg ${rr.status === 'crowded' ? 'bg-state-danger-bg/20 text-state-danger-text' : 'bg-state-success-bg/15 text-state-success-text'}`}>
                <MapPin className="w-4 h-4" />
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-bold text-white tracking-tight">{rr.block}</span>
                <span className={`text-[10px] font-mono font-bold uppercase ${rr.status === 'crowded' ? 'text-state-danger-text' : 'text-void-500'}`}>
                  {rr.size} Traffic
                </span>
              </div>
            </div>

            <div className="text-right">
              <div className="flex items-center gap-1.5 text-void-200 font-mono text-sm font-bold justify-end">
                <Clock className="w-3.5 h-3.5 opacity-50" />
                {rr.wait} MIN
              </div>
              {rr.status === 'crowded' && (
                <button
                  onClick={() => {
                    setNotifiedRestroom(rr.block);
                    speakAssistText(`Queue alert enabled for ${rr.block}. We'll notify you when wait time drops.`);
                  }}
                  className={`text-[9px] font-bold uppercase tracking-widest mt-1.5 transition-colors ${
                    notifiedRestroom === rr.block ? 'text-state-success-text' : 'text-neon-cyan-400 hover:text-neon-cyan-300'
                  }`}
                >
                  {notifiedRestroom === rr.block ? 'Watching ✓' : 'Notify Me'}
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 p-4 bg-void-950/50 rounded-xl border border-void-600/10 flex items-start gap-3">
        <Bell className="w-4 h-4 text-neon-cyan-400 mt-0.5" />
        <p className="text-[10px] text-void-500 font-mono leading-relaxed italic">
          {t.queueCleared}
        </p>
      </div>
    </div>
  );
};
