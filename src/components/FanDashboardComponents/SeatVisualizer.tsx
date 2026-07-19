import React from 'react';
import { motion } from 'motion/react';
import { Eye } from 'lucide-react';

interface SeatVisualizerProps {
  selectedRow: string;
  setSelectedRow: (val: string) => void;
  selectedSeat: string;
  setSelectedSeat: (val: string) => void;
  seatArView: boolean;
  setSeatArView: (val: boolean) => void;
  t: any;
  speakAssistText: (text: string) => void;
}

export const SeatVisualizer: React.FC<SeatVisualizerProps> = ({
  selectedRow,
  setSelectedRow,
  selectedSeat,
  setSelectedSeat,
  seatArView,
  setSeatArView,
  t,
  speakAssistText
}) => {
  return (
    <div className="bg-void-850 border border-void-600/30 rounded-2xl p-5 flex flex-col justify-between h-full">
      <div className="space-y-4">
        <div className="flex justify-between items-start">
          <div>
            <span className="text-[9px] font-mono text-neon-cyan-400 uppercase tracking-widest block font-bold">
              📍 SEAT COORD DETECTOR
            </span>
            <h3 className="font-display font-bold text-lg text-white mt-1">{t.seatTitle}</h3>
            <p className="text-[10px] text-void-400 mt-0.5">{t.seatDesc}</p>
          </div>
          
          <button
            onClick={() => {
              setSeatArView(!seatArView);
              speakAssistText(`Seat perspectives toggled to ${!seatArView ? "Tactical Overlay view" : "Pure Pitch view"}`);
            }}
            className={`p-2 rounded-xl border transition-all ${seatArView ? "bg-neon-cyan-500/10 border-neon-cyan-500 text-neon-cyan-400" : "bg-void-900 border-void-600/20 text-void-400"}`}
            title="Toggle Tactical AR Overlay"
          >
            <Eye className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-2 gap-3 bg-void-900 p-2.5 rounded-xl border border-void-600/15">
          <div>
            <label className="block text-[8px] font-mono text-void-500 uppercase">Change Row</label>
            <select
              value={selectedRow}
              onChange={(e) => {
                setSelectedRow(e.target.value);
                speakAssistText(`Row updated to ${e.target.value}`);
              }}
              className="bg-transparent text-white font-mono text-xs focus:outline-none cursor-pointer mt-1 font-bold w-full"
            >
              <option value="Row L" className="bg-void-900 text-white">Row L</option>
              <option value="Row K" className="bg-void-900 text-white">Row K (Accessible)</option>
              <option value="Row VIP" className="bg-void-900 text-white">Row VIP</option>
            </select>
          </div>
          
          <div>
            <label className="block text-[8px] font-mono text-void-500 uppercase">Change Seat</label>
            <select
              value={selectedSeat}
              onChange={(e) => {
                setSelectedSeat(e.target.value);
                speakAssistText(`Seat updated to ${e.target.value}`);
              }}
              className="bg-transparent text-white font-mono text-xs focus:outline-none cursor-pointer mt-1 font-bold w-full"
            >
              <option value="14" className="bg-void-900 text-white">Seat 14</option>
              <option value="15" className="bg-void-900 text-white">Seat 15</option>
              <option value="16" className="bg-void-900 text-white">Seat 16</option>
            </select>
          </div>
        </div>

        <div className="aspect-[16/10] w-full bg-void-950 rounded-xl relative border border-void-600/30 overflow-hidden flex items-center justify-center shadow-inner">
          <div className="absolute inset-2 rounded-full border-4 border-green-700/20 bg-emerald-950/40 flex items-center justify-center">
            <div className="w-5/6 h-2/3 border border-emerald-500/20 relative flex items-center justify-center">
              <div className="w-1/2 h-full border-r border-emerald-500/10" />
              <div className="absolute w-12 h-12 rounded-full border border-emerald-500/15" />
              
              <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 2 }} className="absolute top-1/4 left-1/3 w-2.5 h-2.5 rounded-full bg-neon-cyan-400" />
              <motion.div animate={{ scale: [1, 1.1, 1] }} transition={{ repeat: Infinity, duration: 2.5, delay: 0.5 }} className="absolute bottom-1/3 right-1/4 w-2.5 h-2.5 rounded-full bg-neon-purple-400" />
            </div>
          </div>

          {seatArView && (
            <div className="absolute inset-0 bg-neon-cyan-500/5 flex flex-col justify-between p-3 font-mono text-[8px] text-neon-cyan-300">
              <div className="flex justify-between items-center">
                <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-neon-cyan-400 animate-pulse" /> TARGET: FIELD CENTRAL</span>
                <span>FOV: 84°</span>
              </div>
              
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-10 h-10 border border-dashed border-neon-cyan-500/30 rounded-full flex items-center justify-center">
                <span className="w-1 h-1 bg-neon-cyan-500 rounded-full" />
              </div>

              <div className="flex justify-between items-end">
                <span>PITCH ELEVATION: 12.4m</span>
                <span className="bg-void-950/80 px-1 py-0.5 border border-neon-cyan-500/20 rounded">CONCESSION DISTANCE: 42m</span>
              </div>
            </div>
          )}

          <div className="absolute bottom-0 inset-x-0 h-1/4 bg-gradient-to-t from-void-900 to-transparent pointer-events-none" />
          <span className="absolute bottom-2 font-mono text-[8px] text-void-500 uppercase tracking-widest">
            Eye View Simulator
          </span>
        </div>
      </div>

      <div className="text-[10px] font-mono text-void-500 text-center mt-3">
        Perspectives mapped via physical seat elevation models.
      </div>
    </div>
  );
};
