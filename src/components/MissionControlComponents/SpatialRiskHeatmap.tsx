import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Compass } from 'lucide-react';

interface Sector {
  id: string;
  name: string;
  occupancyPercent: number;
  capacity: number;
  stewardsOnDuty: number;
  riskIndex: "low" | "medium" | "elevated" | "extreme";
  details: string;
}

interface SpatialRiskHeatmapProps {
  sectors: Sector[];
  selectedSectorId: string | null;
  setSelectedSectorId: (id: string) => void;
  heatmapLayer: "density" | "inflow" | "risk";
  setHeatmapLayer: (layer: "density" | "inflow" | "risk") => void;
  handleSimulateNewAlert: () => void;
}

export const SpatialRiskHeatmap: React.FC<SpatialRiskHeatmapProps> = ({
  sectors,
  selectedSectorId,
  setSelectedSectorId,
  heatmapLayer,
  setHeatmapLayer,
  handleSimulateNewAlert
}) => {
  const getSectorHeatColor = (s: Sector) => {
    if (heatmapLayer === "risk") {
      switch (s.riskIndex) {
        case "extreme": return "fill-red-600/60 stroke-red-500/80";
        case "elevated": return "fill-orange-600/50 stroke-orange-500/70";
        case "medium": return "fill-yellow-600/40 stroke-yellow-500/60";
        default: return "fill-emerald-600/30 stroke-emerald-500/50";
      }
    }
    const occ = s.occupancyPercent;
    if (occ > 80) return "fill-red-600/60 stroke-red-500/80";
    if (occ > 60) return "fill-orange-600/50 stroke-orange-500/70";
    if (occ > 40) return "fill-yellow-600/40 stroke-yellow-500/60";
    return "fill-emerald-600/30 stroke-emerald-500/50";
  };

  const selectedSector = sectors.find(s => s.id === selectedSectorId);

  return (
    <div className="glass-panel overflow-hidden">
      <div className="p-4 border-b border-void-600/10 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Compass className="w-4 h-4 text-neon-blue-400" />
          <h2 className="font-display font-bold text-sm text-white uppercase tracking-wider">Spatial Risk Heatmap</h2>
        </div>
        <div className="flex gap-2">
          {(["density", "risk", "inflow"] as const).map(l => (
            <button 
              key={l}
              onClick={() => setHeatmapLayer(l)}
              className={`px-3 py-1 rounded-lg font-mono text-[9px] uppercase tracking-widest transition-all ${heatmapLayer === l ? "bg-neon-blue-500 text-white shadow-neon-glow-blue" : "text-void-400 hover:text-white"}`}
            >
              {l}
            </button>
          ))}
        </div>
      </div>
      
      <div className="p-8 bg-black/20 flex items-center justify-center min-h-[400px]">
        <svg viewBox="0 0 800 480" className="w-full max-w-3xl drop-shadow-[0_0_20px_rgba(0,163,255,0.1)]">
          <defs>
            <filter id="neon-glow">
              <feGaussianBlur stdDeviation="2.5" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
          
          <ellipse cx="400" cy="240" rx="350" ry="210" className="fill-void-950/50 stroke-void-600/20" strokeWidth="2" />
          
          <g className="cursor-pointer transition-opacity hover:opacity-90">
            {sectors.map(s => (
              <path 
                key={s.id}
                d={s.id === "sec-101" ? "M 180 240 A 240 140 0 0 1 400 100 L 400 160 A 160 90 0 0 0 240 240 Z" : 
                   s.id === "sec-108" ? "M 400 100 A 240 140 0 0 1 620 240 L 560 240 A 160 90 0 0 0 400 160 Z" :
                   s.id === "sec-106" ? "M 620 240 A 240 140 0 0 1 400 380 L 400 320 A 160 90 0 0 0 560 240 Z" :
                   s.id === "sec-104" ? "M 400 380 A 240 140 0 0 1 180 240 L 240 240 A 160 90 0 0 0 400 320 Z" : ""}
                className={`transition-all duration-500 ${getSectorHeatColor(s)} ${selectedSectorId === s.id ? "filter-[url(#neon-glow)]" : ""}`}
                onClick={() => setSelectedSectorId(s.id)}
              />
            ))}
            <circle 
              cx="670" cy="240" r="32" 
              className={`transition-all duration-500 ${getSectorHeatColor(sectors.find(s => s.id === "sec-ingress-b")!)}`}
              onClick={() => setSelectedSectorId("sec-ingress-b")}
            />
          </g>
          
          <ellipse cx="400" cy="240" rx="120" ry="70" className="fill-emerald-500/5 stroke-emerald-500/20" />
        </svg>
      </div>

      <AnimatePresence mode="wait">
        {selectedSector && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="p-6 bg-void-900/50 backdrop-blur-xl border-t border-void-600/10 grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            <div className="col-span-2">
              <div className="flex items-center gap-3 mb-2">
                <h3 className="font-display font-black text-lg text-white uppercase tracking-tight">{selectedSector.name}</h3>
                <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase ${selectedSector.riskIndex === 'extreme' ? 'bg-red-500 text-white animate-pulse' : 'bg-void-800 text-void-400'}`}>
                  {selectedSector.riskIndex} risk level
                </span>
              </div>
              <p className="text-void-400 text-sm">{selectedSector.details}</p>
            </div>
            <div className="space-y-4">
              <div className="flex justify-between items-end">
                <span className="font-mono text-[10px] text-void-500 uppercase font-bold tracking-widest">Occupancy</span>
                <span className="font-mono text-xl font-bold text-white">{selectedSector.occupancyPercent}%</span>
              </div>
              <div className="h-1.5 w-full bg-void-800 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${selectedSector.occupancyPercent}%` }}
                  className="h-full bg-neon-blue-500"
                />
              </div>
              <button 
                onClick={handleSimulateNewAlert}
                className="w-full py-2 glass-panel border-neon-cyan-500/30 hover:border-neon-cyan-500 text-neon-cyan-400 font-mono text-[10px] font-bold uppercase tracking-widest transition-all"
              >
                Trigger Sector Reinforcement
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
