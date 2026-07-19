import React from 'react';
import { motion } from 'motion/react';
import { Map, Info, AlertTriangle, Users } from 'lucide-react';

interface StadiumMapProps {
  simulationActive: boolean;
}

const GATES = [
  { id: 'A', x: 200, y: 50, status: 'normal', load: 1200 },
  { id: 'B', x: 350, y: 150, status: 'warning', load: 4500 },
  { id: 'C', x: 300, y: 300, status: 'normal', load: 2100 },
  { id: 'D', x: 100, y: 250, status: 'critical', load: 6800 },
  { id: 'E', x: 50, y: 120, status: 'normal', load: 800 },
];

export const StadiumMap: React.FC<StadiumMapProps> = ({ simulationActive }) => {
  return (
    <div className="w-full h-full glass-card relative overflow-hidden group">
      <div className="absolute inset-0 cyber-grid-overlay opacity-20 pointer-events-none" />
      
      <div className="absolute top-6 left-6 z-10">
        <div className="flex items-center gap-3 mb-1">
          <div className="w-2 h-2 rounded-full bg-neon-blue-500 shadow-neon-blue" />
          <h3 className="font-display font-bold text-white uppercase tracking-widest text-xs">Spatial Intelligence Mesh</h3>
        </div>
        <p className="text-[10px] font-mono text-void-500 font-bold uppercase tracking-widest ml-5">Lusail Node 73-Delta</p>
      </div>

      <div className="absolute top-6 right-6 z-10 flex gap-2">
        <div className="px-3 py-1.5 rounded-lg bg-void-950/80 border border-white/5 backdrop-blur-md flex items-center gap-2">
          <Users className="w-3.5 h-3.5 text-neon-blue-400" />
          <span className="text-[10px] font-mono font-bold text-white uppercase">{simulationActive ? '85,410' : '2,142'}</span>
        </div>
        <div className="px-3 py-1.5 rounded-lg bg-void-950/80 border border-white/5 backdrop-blur-md flex items-center gap-2">
          <Map className="w-3.5 h-3.5 text-neon-cyan-400" />
          <span className="text-[10px] font-mono font-bold text-white uppercase">Sector 4</span>
        </div>
      </div>

      {/* SVG Map Container */}
      <div className="w-full h-full flex items-center justify-center p-12">
        <svg viewBox="0 0 400 350" className="w-full h-full max-w-2xl drop-shadow-2xl">
          {/* Stadium Outer Ring */}
          <motion.ellipse 
            cx="200" cy="175" rx="180" ry="150" 
            className="fill-void-950/40 stroke-void-700/30"
            strokeWidth="1"
          />
          <motion.ellipse 
            cx="200" cy="175" rx="170" ry="140" 
            className="fill-none stroke-white/5"
            strokeWidth="0.5"
            strokeDasharray="4 4"
          />

          {/* Heatmap Zones (Conceptual) */}
          <motion.circle 
            cx="100" cy="250" r={simulationActive ? 60 : 20} 
            className="fill-state-danger/10 animate-pulse"
          />
          <motion.circle 
            cx="350" cy="150" r={simulationActive ? 45 : 15} 
            className="fill-state-warning/10 animate-pulse [animation-delay:1s]"
          />

          {/* Inner Field */}
          <motion.ellipse 
            cx="200" cy="175" rx="100" ry="80" 
            className="fill-void-900/60 stroke-void-600/40"
            strokeWidth="2"
          />
          
          {/* Pitch Lines */}
          <rect x="140" y="135" width="120" height="80" className="fill-neon-blue-500/5 stroke-white/5" />
          <line x1="200" y1="135" x2="200" y2="215" className="stroke-white/10" />
          <circle cx="200" cy="175" r="20" className="fill-none stroke-white/10" />

          {/* Gate Nodes */}
          {GATES.map((gate) => (
            <motion.g 
              key={gate.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              whileHover={{ scale: 1.1 }}
              className="cursor-pointer group/node"
            >
              {/* Connection Line to Center */}
              <motion.line 
                x1="200" y1="175" x2={gate.x} y2={gate.y}
                className={`stroke-void-700/20 ${simulationActive ? 'stroke-void-500/40' : ''}`}
                strokeWidth="1"
                strokeDasharray="2 2"
              />
              
              {/* Outer Glow */}
              <circle 
                cx={gate.x} cy={gate.y} r="12" 
                className={`${
                  gate.status === 'critical' ? 'fill-state-danger/20' : 
                  gate.status === 'warning' ? 'fill-state-warning/20' : 
                  'fill-neon-blue-500/10'
                } ${simulationActive ? 'animate-ping' : ''}`} 
              />
              
              {/* Main Node */}
              <circle 
                cx={gate.x} cy={gate.y} r="6" 
                className={`${
                  gate.status === 'critical' ? 'fill-state-danger' : 
                  gate.status === 'warning' ? 'fill-state-warning' : 
                  'fill-neon-blue-500'
                } shadow-2xl`}
              />
              
              {/* Label */}
              <text 
                x={gate.x + 10} y={gate.y + 5} 
                className="fill-void-200 text-[8px] font-mono font-bold uppercase tracking-widest"
              >
                GATE {gate.id}
              </text>

              {/* Tooltip (Hover) */}
              <g className="opacity-0 group-hover/node:opacity-100 transition-opacity">
                <rect x={gate.x - 40} y={gate.y - 45} width="80" height="35" rx="4" className="fill-void-950 stroke-white/10 shadow-2xl" />
                <text x={gate.x - 35} y={gate.y - 32} className="fill-void-400 text-[6px] font-mono font-bold uppercase">Load Level</text>
                <text x={gate.x - 35} y={gate.y - 20} className="fill-white text-[9px] font-bold font-display">{gate.load} PAX</text>
              </g>
            </motion.g>
          ))}
        </svg>
      </div>

      {/* Legend & Stats Overlay */}
      <div className="absolute bottom-6 left-6 right-6 flex justify-between items-end pointer-events-none">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
             <div className="w-2.5 h-2.5 rounded-full bg-state-danger" />
             <span className="text-[10px] font-mono font-bold text-void-400 uppercase tracking-widest">CRITICAL_CONGESTION</span>
          </div>
          <div className="flex items-center gap-3">
             <div className="w-2.5 h-2.5 rounded-full bg-state-warning" />
             <span className="text-[10px] font-mono font-bold text-void-400 uppercase tracking-widest">BUFFER_WARNING</span>
          </div>
          <div className="flex items-center gap-3">
             <div className="w-2.5 h-2.5 rounded-full bg-neon-blue-500" />
             <span className="text-[10px] font-mono font-bold text-void-400 uppercase tracking-widest">OPTIMAL_FLOW</span>
          </div>
        </div>

        <div className="text-right">
           <div className="text-xs font-mono font-bold text-neon-cyan-500 mb-1">98.2% ACCURACY</div>
           <div className="text-[9px] font-mono text-void-600 font-bold uppercase tracking-widest">Neural Spatial Inference</div>
        </div>
      </div>
    </div>
  );
};
