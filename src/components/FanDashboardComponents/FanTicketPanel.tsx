import React from 'react';
import { motion } from 'motion/react';
import { Ticket, CreditCard } from 'lucide-react';

interface FanTicketPanelProps {
  isTicketFlipped: boolean;
  setIsTicketFlipped: (val: boolean) => void;
  isAddedToWallet: boolean;
  setIsAddedToWallet: (val: boolean) => void;
  selectedRow: string;
  selectedSeat: string;
  t: any;
  speakAssistText: (text: string) => void;
}

export const FanTicketPanel: React.FC<FanTicketPanelProps> = ({
  isTicketFlipped,
  setIsTicketFlipped,
  isAddedToWallet,
  setIsAddedToWallet,
  selectedRow,
  selectedSeat,
  t,
  speakAssistText
}) => {
  return (
    <div className="space-y-6">
      <span className="text-[10px] font-mono text-void-400 uppercase tracking-wider block mb-2 font-bold">
        🎟️ My digital Pass Deck
      </span>

      <motion.div
        whileHover={{ y: -4 }}
        className="perspective-1000 relative w-full h-[380px] rounded-3xl cursor-pointer group"
      >
        <motion.div
          animate={{ rotateY: isTicketFlipped ? 180 : 0 }}
          transition={{ duration: 0.6, type: "spring", stiffness: 200, damping: 20 }}
          className="w-full h-full transform-style-3d relative"
          onClick={() => setIsTicketFlipped(!isTicketFlipped)}
        >
          {/* FRONT VIEW */}
          <div className="absolute inset-0 backface-hidden bg-gradient-to-br from-indigo-950 via-slate-900 to-indigo-900 border border-indigo-500/30 rounded-3xl p-6 flex flex-col justify-between shadow-2xl overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent rotate-12 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
            
            <div className="flex justify-between items-center border-b border-indigo-500/20 pb-4">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded bg-indigo-500/20 flex items-center justify-center text-indigo-300 border border-indigo-500/40">
                  <Ticket className="w-4 h-4" />
                </div>
                <div>
                  <span className="font-display font-bold text-xs text-white">LUSAIL ROYAL PASS</span>
                  <span className="text-[8px] font-mono text-indigo-400 block -mt-0.5">EL CLÁSICO VIP ED.</span>
                </div>
              </div>
              
              <div className="text-right">
                <span className="text-[9px] font-mono text-indigo-400 block">TIER</span>
                <span className="text-[11px] font-bold text-yellow-400 font-mono tracking-widest uppercase">PLATINUM</span>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2 border-b border-indigo-500/10 py-4 font-mono">
              <div>
                <span className="text-[8px] text-indigo-400 block">SECTION</span>
                <span className="text-base font-bold text-white tracking-tight">108</span>
              </div>
              <div>
                <span className="text-[8px] text-indigo-400 block">ROW</span>
                <span className="text-base font-bold text-white tracking-tight">{selectedRow}</span>
              </div>
              <div>
                <span className="text-[8px] text-indigo-400 block">SEAT</span>
                <span className="text-base font-bold text-white tracking-tight">{selectedSeat}</span>
              </div>
            </div>

            <div className="relative my-1">
              <div className="absolute -left-8 -top-2 w-4 h-4 rounded-full bg-void-900 border-r border-indigo-500/20 z-10" />
              <div className="border-t border-dashed border-indigo-500/30 w-full h-[1px]" />
              <div className="absolute -right-8 -top-2 w-4 h-4 rounded-full bg-void-900 border-l border-indigo-500/20 z-10" />
            </div>

            <div className="flex flex-col items-center justify-center pt-2 gap-2">
              <div className="relative bg-white/95 p-3 rounded-lg w-full flex flex-col items-center shadow-lg">
                <div className="absolute inset-x-0 top-1/2 h-[1px] bg-red-500 animate-[bounce_2s_infinite]" />
                <div className="w-full h-8 bg-repeat-x bg-[linear-gradient(to_right,#000_2px,transparent_2px,#000_5px,transparent_5px,#000_8px,transparent_8px,#000_12px,transparent_12px)] opacity-90" />
                <span className="text-[8px] font-mono text-slate-600 mt-1 tracking-[6px] font-bold uppercase">LSL2026ELCLASICOVIP</span>
              </div>
              
              <span className="text-[8px] font-mono text-indigo-400 uppercase tracking-widest mt-1">
                {t.flipCard}
              </span>
            </div>
          </div>

          {/* BACK VIEW */}
          <div className="absolute inset-0 backface-hidden bg-slate-900 border border-indigo-500/40 rounded-3xl p-6 flex flex-col justify-between shadow-2xl rotate-y-180">
            <div>
              <h4 className="font-display font-bold text-xs text-white border-b border-indigo-500/20 pb-2 mb-3">
                LUSAIL ROYAL GROUND CODE
              </h4>
              
              <ul className="space-y-2.5 font-sans text-[10px] text-slate-300 list-disc pl-4 leading-normal">
                <li>Bag Policy: Small clutches and clear bags only (max 12"x6"x12").</li>
                <li>Security check: Facial biometric scan active at Gate B entrance.</li>
                <li>Re-entry: Exit scanning required at all physical gates.</li>
                <li>Food: Certified Halal food available at Concourse West.</li>
                <li>Emergency: In case of evacuations, look up at the dynamic neon exit paths.</li>
              </ul>
            </div>

            <div className="p-3 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-center">
              <span className="text-[9px] font-mono text-indigo-300 font-bold block">GATEWAY KEY</span>
              <p className="text-[10px] text-white font-mono mt-0.5">GATE B WEST ENTRY CORRIDOR</p>
            </div>
          </div>
        </motion.div>
      </motion.div>

      <button
        onClick={() => {
          setIsAddedToWallet(true);
          speakAssistText("Access pass synchronized to Apple Wallet.");
          setTimeout(() => setIsAddedToWallet(false), 3000);
        }}
        className="w-full py-3.5 rounded-2xl bg-black border border-slate-700/60 hover:bg-slate-950 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2.5 transition-all shadow-elevation-medium cursor-pointer"
      >
        <CreditCard className="w-4 h-4 text-white" />
        {isAddedToWallet ? t.addedWallet : t.addWallet}
      </button>
    </div>
  );
};
