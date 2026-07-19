import React from 'react';
import { motion } from 'motion/react';
import { 
  Users, 
  TrendingUp, 
  DollarSign, 
  Award, 
  Leaf, 
  ClipboardList, 
  AlertTriangle, 
  Cpu 
} from 'lucide-react';

interface MetricCardsProps {
  totalSpectators: number;
  totalRevenue: number;
  ticketsRev: number;
  concessionsRev: number;
  suitesRev: number;
  merchandiseRev: number;
  carbonSaved: number;
  transitUse: number;
  plasticSaved: number;
  landfillDiversion: number;
  activeStewardsCount: number;
  stewardTasksCount: number;
  stewardHappiness: number;
  avgResolutionTime: number;
  activeAlerts: number;
  criticalSolved: number;
  ingressBottlenecks: number;
}

export const MetricCards: React.FC<MetricCardsProps> = ({
  totalSpectators,
  totalRevenue,
  ticketsRev,
  concessionsRev,
  suitesRev,
  merchandiseRev,
  carbonSaved,
  transitUse,
  plasticSaved,
  landfillDiversion,
  activeStewardsCount,
  stewardTasksCount,
  stewardHappiness,
  avgResolutionTime,
  activeAlerts,
  criticalSolved,
  ingressBottlenecks
}) => {
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.05 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 350, damping: 26 } }
  };

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
    >
      {/* CARD 1: ATTENDANCE ANALYTICS */}
      <motion.div 
        variants={itemVariants}
        whileHover={{ y: -5, borderColor: "rgba(6, 182, 212, 0.45)", boxShadow: "0 10px 30px -10px rgba(6, 182, 212, 0.15)" }}
        className="bg-void-850 border border-void-600/20 rounded-2xl p-6 relative overflow-hidden group transition-all duration-300"
      >
        <div className="absolute top-0 right-0 w-24 h-24 bg-neon-blue-500/5 rounded-full blur-2xl -mr-6 -mt-6" />
        <div className="flex justify-between items-start mb-4">
          <div className="p-2.5 rounded-xl bg-neon-blue-500/10 border border-neon-blue-500/20 text-neon-blue-400">
            <Users className="w-5 h-5" />
          </div>
          <span className="text-[10px] font-mono text-state-success-text flex items-center gap-1 bg-state-success-bg/10 px-2 py-0.5 rounded-full">
            <TrendingUp className="w-3 h-3" />
            Optimal Inflow
          </span>
        </div>
        
        <h3 className="text-void-400 text-xs font-mono uppercase tracking-wider">Attendance Matrix</h3>
        <div className="mt-1 flex items-baseline gap-2">
          <span className="text-3xl font-display font-extrabold text-white tracking-tight">
            {totalSpectators.toLocaleString()}
          </span>
          <span className="text-xs text-void-400 font-mono">/ 56,000 capacity</span>
        </div>

        <div className="h-12 mt-4 flex items-end gap-1">
          {[34, 45, 40, 52, 60, 55, 68, 75, 82, 85, 88, 86].map((h, i) => (
            <motion.div
              key={i}
              initial={{ height: 0 }}
              animate={{ height: `${h}%` }}
              transition={{ delay: 0.15 + i * 0.02, duration: 0.5, ease: "easeOut" }}
              className={`w-full rounded-sm ${
                i === 11 ? 'bg-neon-cyan-400 shadow-neon-glow-cyan' : 'bg-void-700 group-hover:bg-neon-blue-500/40 transition-colors duration-300'
              }`}
            />
          ))}
        </div>

        <div className="mt-4 pt-4 border-t border-void-600/10 grid grid-cols-2 gap-4 text-xs font-sans">
          <div>
            <span className="text-void-500 block">Occupancy Rate</span>
            <strong className="text-white text-sm font-semibold">{Math.round((totalSpectators / 56000) * 100)}%</strong>
          </div>
          <div>
            <span className="text-void-500 block">Premium VIPs</span>
            <strong className="text-white text-sm font-semibold">1,420 nodes</strong>
          </div>
        </div>
      </motion.div>

      {/* CARD 2: REVENUE FLOWS */}
      <motion.div 
        variants={itemVariants}
        whileHover={{ y: -5, borderColor: "rgba(168, 85, 247, 0.45)", boxShadow: "0 10px 30px -10px rgba(168, 85, 247, 0.15)" }}
        className="bg-void-850 border border-void-600/20 rounded-2xl p-6 relative overflow-hidden group transition-all duration-300"
      >
        <div className="absolute top-0 right-0 w-24 h-24 bg-neon-purple-500/5 rounded-full blur-2xl -mr-6 -mt-6" />
        <div className="flex justify-between items-start mb-4">
          <div className="p-2.5 rounded-xl bg-neon-purple-500/10 border border-neon-purple-500/20 text-neon-purple-400">
            <DollarSign className="w-5 h-5" />
          </div>
          <span className="text-[10px] font-mono text-neon-purple-400 flex items-center gap-1 bg-neon-purple-500/10 px-2 py-0.5 rounded-full">
            <Award className="w-3 h-3" />
            SLA Target +14%
          </span>
        </div>

        <h3 className="text-void-400 text-xs font-mono uppercase tracking-wider">Gross Revenue</h3>
        <div className="mt-1 flex items-baseline gap-2">
          <span className="text-3xl font-display font-extrabold text-white tracking-tight">
            ${totalRevenue.toLocaleString()}
          </span>
          <span className="text-xs text-void-500 font-mono">USD Net</span>
        </div>

        <div className="mt-6">
          <div className="h-2.5 w-full bg-void-850 rounded-full flex overflow-hidden border border-void-600/20">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${(ticketsRev / totalRevenue) * 100}%` }}
              transition={{ duration: 0.8, ease: "circOut" }}
              className="h-full bg-neon-purple-500" 
            />
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${(concessionsRev / totalRevenue) * 100}%` }}
              transition={{ duration: 0.8, ease: "circOut", delay: 0.08 }}
              className="h-full bg-neon-cyan-500" 
            />
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${(suitesRev / totalRevenue) * 100}%` }}
              transition={{ duration: 0.8, ease: "circOut", delay: 0.16 }}
              className="h-full bg-neon-blue-500" 
            />
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${(merchandiseRev / totalRevenue) * 100}%` }}
              transition={{ duration: 0.8, ease: "circOut", delay: 0.24 }}
              className="h-full bg-void-600" 
            />
          </div>
          <div className="mt-3 grid grid-cols-4 gap-1 text-[9px] font-mono text-void-400">
            <div className="truncate"><span className="inline-block w-1.5 h-1.5 bg-neon-purple-500 rounded-full mr-1" />Tkt: 60%</div>
            <div className="truncate"><span className="inline-block w-1.5 h-1.5 bg-neon-cyan-500 rounded-full mr-1" />F&B: 18%</div>
            <div className="truncate"><span className="inline-block w-1.5 h-1.5 bg-neon-blue-500 rounded-full mr-1" />VIP: 15%</div>
            <div className="truncate"><span className="inline-block w-1.5 h-1.5 bg-void-600 rounded-full mr-1" />Mch: 7%</div>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-void-600/10 grid grid-cols-2 gap-4 text-xs font-sans">
          <div>
            <span className="text-void-500 block">Concession Plaza</span>
            <strong className="text-white text-sm font-semibold">${concessionsRev.toLocaleString()}</strong>
          </div>
          <div>
            <span className="text-void-500 block">Luxury Suites</span>
            <strong className="text-white text-sm font-semibold">${suitesRev.toLocaleString()}</strong>
          </div>
        </div>
      </motion.div>

      {/* CARD 3: SUSTAINABILITY & CO2 */}
      <motion.div 
        variants={itemVariants}
        whileHover={{ y: -5, borderColor: "rgba(34, 211, 238, 0.45)", boxShadow: "0 10px 30px -10px rgba(34, 211, 238, 0.15)" }}
        className="bg-void-850 border border-void-600/20 rounded-2xl p-6 relative overflow-hidden group transition-all duration-300"
      >
        <div className="absolute top-0 right-0 w-24 h-24 bg-neon-cyan-500/5 rounded-full blur-2xl -mr-6 -mt-6" />
        <div className="flex justify-between items-start mb-4">
          <div className="p-2.5 rounded-xl bg-neon-cyan-500/10 border border-neon-cyan-500/20 text-neon-cyan-400">
            <Leaf className="w-5 h-5" />
          </div>
          <span className="text-[10px] font-mono text-state-success-text flex items-center gap-1 bg-state-success-bg/10 px-2 py-0.5 rounded-full">
            91% Diversion
          </span>
        </div>

        <h3 className="text-void-400 text-xs font-mono uppercase tracking-wider">Carbon Displaced today</h3>
        <div className="mt-1 flex items-baseline gap-2">
          <span className="text-3xl font-display font-extrabold text-white tracking-tight">
            {carbonSaved}
          </span>
          <span className="text-xs text-void-400 font-mono">Tons CO₂ Saved</span>
        </div>

        <div className="mt-5 space-y-2 text-xs">
          <div>
            <div className="flex justify-between text-[10px] font-mono text-void-400 mb-1">
              <span>METRO & SHUTTLE OFFSET</span>
              <span className="text-neon-cyan-400">{transitUse}%</span>
            </div>
            <div className="h-1.5 w-full bg-void-900 rounded-full overflow-hidden">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${transitUse}%` }}
                transition={{ duration: 1.0, ease: "circOut" }}
                className="h-full bg-neon-cyan-500" 
              />
            </div>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-void-600/10 grid grid-cols-2 gap-4 text-xs font-sans">
          <div>
            <span className="text-void-500 block">Water Refills Saved</span>
            <strong className="text-white text-sm font-semibold">{(plasticSaved).toLocaleString()} units</strong>
          </div>
          <div>
            <span className="text-void-500 block">Landfill Diversion</span>
            <strong className="text-white text-sm font-semibold">{landfillDiversion}%</strong>
          </div>
        </div>
      </motion.div>

      {/* CARD 4: VOLUNTEER MAINBOARD STATUS */}
      <motion.div 
        variants={itemVariants}
        whileHover={{ y: -5, borderColor: "rgba(59, 130, 246, 0.45)", boxShadow: "0 10px 30px -10px rgba(59, 130, 246, 0.15)" }}
        className="bg-void-850 border border-void-600/20 rounded-2xl p-6 relative overflow-hidden group transition-all duration-300"
      >
        <div className="absolute top-0 right-0 w-24 h-24 bg-neon-cyan-500/5 rounded-full blur-2xl -mr-6 -mt-6" />
        <div className="flex justify-between items-start mb-4">
          <div className="p-2.5 rounded-xl bg-neon-blue-500/10 border border-neon-blue-500/20 text-neon-blue-400">
            <ClipboardList className="w-5 h-5" />
          </div>
          <span className="text-[10px] font-mono text-neon-cyan-400 flex items-center gap-1 bg-neon-cyan-500/10 px-2 py-0.5 rounded-full">
            SLA Compliant
          </span>
        </div>

        <h3 className="text-void-400 text-xs font-mono uppercase tracking-wider">Active Stewards & Volunteers</h3>
        <div className="mt-1 flex items-baseline gap-2">
          <span className="text-3xl font-display font-extrabold text-white tracking-tight">
            {activeStewardsCount}
          </span>
          <span className="text-xs text-void-400 font-mono">operational nodes</span>
        </div>

        <div className="mt-5 space-y-1 bg-void-900/60 p-3 rounded-xl border border-void-600/10 text-xs">
          <div className="flex justify-between text-[11px] mb-1">
            <span className="text-void-400">Task Dispatch Count:</span>
            <span className="text-white font-bold font-mono">{stewardTasksCount} tickets</span>
          </div>
          <div className="flex justify-between text-[11px]">
            <span className="text-void-400">Steward Happiness Index:</span>
            <span className="text-state-success-text font-bold font-mono">{stewardHappiness}%</span>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-void-600/10 grid grid-cols-2 gap-4 text-xs font-sans">
          <div>
            <span className="text-void-500 block">Avg Response Speed</span>
            <strong className="text-white text-sm font-semibold">{avgResolutionTime} mins</strong>
          </div>
          <div>
            <span className="text-void-500 block">Active Clearances</span>
            <strong className="text-white text-sm font-semibold">100% Secure</strong>
          </div>
        </div>
      </motion.div>

      {/* CARD 5: INCIDENT ALARMS & SUMMARY */}
      <motion.div 
        variants={itemVariants}
        whileHover={{ y: -5, borderColor: "rgba(239, 68, 68, 0.45)", boxShadow: "0 10px 30px -10px rgba(239, 68, 68, 0.15)" }}
        className="bg-void-850 border border-void-600/20 rounded-2xl p-6 relative overflow-hidden group transition-all duration-300"
      >
        <div className="absolute top-0 right-0 w-24 h-24 bg-state-danger-bg/5 rounded-full blur-2xl -mr-6 -mt-6" />
        <div className="flex justify-between items-start mb-4">
          <div className="p-2.5 rounded-xl bg-state-danger-bg/10 border border-state-danger-text/20 text-state-danger-text">
            <AlertTriangle className="w-5 h-5 animate-pulse" />
          </div>
          <span className="text-[10px] font-mono text-state-success-text flex items-center gap-1 bg-state-success-bg/10 px-2 py-0.5 rounded-full">
            Stable Matrix
          </span>
        </div>

        <h3 className="text-void-400 text-xs font-mono uppercase tracking-wider">Critical Alarms & Risks</h3>
        <div className="mt-1 flex items-baseline gap-2">
          <span className="text-3xl font-display font-extrabold text-white tracking-tight">
            {activeAlerts}
          </span>
          <span className="text-xs text-state-danger-text font-mono uppercase font-semibold">active alarms</span>
        </div>

        <div className="mt-5 space-y-1 bg-void-900/60 p-3 rounded-xl border border-void-600/10 text-xs">
          <div className="flex justify-between text-[11px] mb-1">
            <span className="text-void-400">Critical Alerts Solved:</span>
            <span className="text-state-success-text font-bold font-mono">+{criticalSolved} handled</span>
          </div>
          <div className="flex justify-between text-[11px]">
            <span className="text-void-400">Active Gate Bottlenecks:</span>
            <span className="text-state-danger-text font-bold font-mono">{ingressBottlenecks} node</span>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-void-600/10 grid grid-cols-2 gap-4 text-xs font-sans">
          <div>
            <span className="text-void-500 block">Lens Fogging Level</span>
            <strong className="text-white text-sm font-semibold">Resolved</strong>
          </div>
          <div>
            <span className="text-void-500 block">Critical Response Rate</span>
            <strong className="text-white text-sm font-semibold">100% Dispatch</strong>
          </div>
        </div>
      </motion.div>

      {/* CARD 6: COGNITIVE OPERATING EFFICIENCY */}
      <motion.div 
        variants={itemVariants}
        whileHover={{ y: -5, borderColor: "rgba(6, 182, 212, 0.45)", boxShadow: "0 10px 30px -10px rgba(6, 182, 212, 0.15)" }}
        className="bg-void-850 border border-void-600/20 rounded-2xl p-6 relative overflow-hidden group transition-all duration-300"
      >
        <div className="absolute top-0 right-0 w-24 h-24 bg-neon-cyan-500/5 rounded-full blur-2xl -mr-6 -mt-6" />
        <div className="flex justify-between items-start mb-4">
          <div className="p-2.5 rounded-xl bg-neon-cyan-500/10 border border-neon-cyan-500/20 text-neon-cyan-400">
            <Cpu className="w-5 h-5 text-neon-cyan-400" />
          </div>
          <span className="text-[10px] font-mono text-neon-cyan-400 bg-neon-cyan-500/10 px-2 py-0.5 rounded-full">
            Efficiency: Excellent
          </span>
        </div>

        <h3 className="text-void-400 text-xs font-mono uppercase tracking-wider">Cognitive Index Efficiency</h3>
        <div className="mt-1 flex items-baseline gap-2">
          <span className="text-3xl font-display font-extrabold text-white tracking-tight">
            98.6%
          </span>
          <span className="text-xs text-void-500 font-mono">stadium flow index</span>
        </div>

        <div className="mt-6 flex items-center justify-between gap-3 text-xs bg-void-900/40 p-3 rounded-xl border border-void-600/10">
          <div className="text-void-400 font-mono text-[10px] leading-relaxed">
            Biometric scanners processing turnstile queue at **2.4s** per person average. Smart cooling algorithms saving **18% HVAC load**.
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-void-600/10 grid grid-cols-2 gap-4 text-xs font-sans">
          <div>
            <span className="text-void-500 block">Scanner Latency</span>
            <strong className="text-white text-sm font-semibold">2.4 sec</strong>
          </div>
          <div>
            <span className="text-void-500 block">AI Confidence Threshold</span>
            <strong className="text-white text-sm font-semibold">99.4%</strong>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};
