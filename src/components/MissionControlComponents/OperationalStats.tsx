import React from 'react';
import { motion } from 'motion/react';
import { Users, Clock, Shield, AlertTriangle } from 'lucide-react';

interface OperationalStatsProps {
  totalSpectators: number;
  waitTime: number;
  activeStewards: number;
  activeAlerts: number;
}

export const OperationalStats: React.FC<OperationalStatsProps> = ({
  totalSpectators,
  waitTime,
  activeStewards,
  activeAlerts
}) => {
  const stats = [
    { label: "Occupancy", value: totalSpectators.toLocaleString(), sub: "Live Spectators", icon: Users, color: "text-neon-blue-400", trend: "+2.4%" },
    { label: "Ingress Friction", value: `${waitTime.toFixed(1)}m`, sub: "Avg. Queue Time", icon: Clock, color: "text-neon-cyan-400", trend: "-0.8m" },
    { label: "Response Squads", value: activeStewards, sub: "Active Stewards", icon: Shield, color: "text-neon-purple-400", trend: "100% Ready" },
    { label: "Active Alerts", value: activeAlerts, sub: "Critical Incidents", icon: AlertTriangle, color: "text-red-400", trend: "Risk: Elevated" }
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((m, i) => (
        <div key={i} className="glass-card p-4 relative overflow-hidden group">
          <div className={`absolute top-0 right-0 w-24 h-24 bg-current opacity-5 rounded-full -mr-8 -mt-8 transition-transform group-hover:scale-110`} />
          <div className="flex justify-between items-start mb-3">
            <span className="font-mono text-[10px] font-bold text-void-400 uppercase tracking-widest">{m.label}</span>
            <m.icon className={`w-4 h-4 ${m.color}`} />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="font-display font-black text-3xl text-white">{m.value}</span>
            <span className={`font-mono text-[10px] ${m.color}`}>{m.trend}</span>
          </div>
          <p className="text-[10px] text-void-500 mt-1 uppercase font-bold tracking-wider">{m.sub}</p>
        </div>
      ))}
    </div>
  );
};
