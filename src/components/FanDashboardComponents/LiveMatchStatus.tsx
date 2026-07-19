import React from 'react';
import { motion } from 'motion/react';
import { Flame } from 'lucide-react';

interface LiveMatchStatusProps {
  decibelLevel: number;
  isCheering: boolean;
  handleCheerPress: () => void;
  t: any;
}

export const LiveMatchStatus: React.FC<LiveMatchStatusProps> = ({
  decibelLevel,
  isCheering,
  handleCheerPress,
  t
}) => {
  return (
    <div className="bg-void-850 border border-void-600/30 rounded-2xl p-5 space-y-4">
      <div className="flex justify-between items-center border-b border-void-600/10 pb-3">
        <div>
          <span className="px-2 py-0.5 rounded bg-red-500/15 border border-red-500/30 text-[9px] font-mono text-red-400 font-bold uppercase animate-pulse">
            {t.liveMatch}
          </span>
          <p className="text-[10px] text-void-400 font-mono mt-1">{t.matchDetails}</p>
        </div>
        
        <div className="flex items-center gap-1.5 font-mono text-xs text-white">
          <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping" />
          <span className="font-bold">65:12</span>
        </div>
      </div>

      <div className="flex justify-between items-center py-2 px-3 bg-void-900 rounded-xl border border-void-600/15">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center font-bold text-xs text-white">RM</div>
          <span className="text-xs font-bold text-white">Real Madrid</span>
        </div>
        <span className="text-xl font-display font-black text-neon-cyan-400 font-mono">1</span>
        <span className="text-xs text-void-500 font-mono font-bold">vs</span>
        <span className="text-xl font-display font-black text-neon-purple-400 font-mono">0</span>
        <div className="flex items-center gap-2 text-right">
          <span className="text-xs font-bold text-white">FC Barcelona</span>
          <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center font-bold text-xs text-white">BAR</div>
        </div>
      </div>

      <div className="space-y-1.5 font-mono">
        <div className="flex justify-between items-center text-[10px] text-void-400">
          <span>Live Stadium Decibels:</span>
          <span className={decibelLevel >= 100 ? "text-red-400 font-bold animate-pulse" : "text-neon-cyan-400 font-bold"}>
            {decibelLevel} dB {decibelLevel >= 100 ? "🔥 EAR DEFENDERS ADVISE" : "OPTIMAL"}
          </span>
        </div>

        <div className="h-3 bg-void-950 rounded-full overflow-hidden relative border border-void-600/10">
          <motion.div
            animate={{ width: `${Math.min(100, (decibelLevel / 120) * 100)}%` }}
            transition={{ type: "spring", stiffness: 100 }}
            className={`h-full rounded-full ${decibelLevel >= 100 ? "bg-gradient-to-r from-red-500 to-yellow-500" : "bg-gradient-to-r from-neon-blue-500 to-neon-cyan-500"}`}
          />
        </div>
      </div>

      <button
        onClick={handleCheerPress}
        className="w-full py-2 rounded-xl bg-neon-blue-500/10 hover:bg-neon-blue-500/20 text-neon-cyan-400 border border-neon-blue-500/30 text-xs font-bold uppercase transition-all flex items-center justify-center gap-2"
      >
        <Flame className={`w-4 h-4 ${isCheering ? "animate-bounce text-yellow-400" : ""}`} />
        {t.cheerBtn}
      </button>
    </div>
  );
};
