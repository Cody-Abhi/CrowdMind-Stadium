import React from 'react';
import { motion } from 'motion/react';
import { Sparkles, ArrowRight, Bot, Users, AlertTriangle } from 'lucide-react';

interface HeroProps {
  onLaunchDashboard: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onLaunchDashboard }) => {
  return (
    <section id="hero" className="w-full max-w-7xl mx-auto px-6 pt-24 pb-20 flex flex-col lg:flex-row items-center justify-between gap-16 relative">
      {/* Decorative Neural Network Background */}
      <div className="absolute top-0 right-0 w-full h-full pointer-events-none z-0 overflow-hidden opacity-40">
        <div className="absolute top-1/4 right-[-10%] w-[800px] h-[800px] bg-neon-blue-500/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 left-[-10%] w-[600px] h-[600px] bg-neon-purple-500/10 rounded-full blur-[100px]" />
      </div>

      <div className="flex-1 max-w-3xl text-left z-20 relative">
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-white/[0.03] border border-white/10 text-[11px] font-mono font-bold text-neon-cyan-400 mb-8 shadow-xl backdrop-blur-md"
        >
          <div className="flex gap-1">
            <span className="w-1 h-1 rounded-full bg-neon-cyan-500 animate-pulse" />
            <span className="w-1 h-1 rounded-full bg-neon-cyan-500 animate-pulse [animation-delay:0.2s]" />
            <span className="w-1 h-1 rounded-full bg-neon-cyan-500 animate-pulse [animation-delay:0.4s]" />
          </div>
          <Sparkles className="w-3.5 h-3.5" />
          NEURAL STADIUM OS v4.0 PLATFORM
        </motion.div>

        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.8, ease: "easeOut" }}
          className="font-display font-bold tracking-[-0.03em] text-white mb-8 leading-[1.05] text-6xl sm:text-7xl lg:text-8xl xl:text-[92px]"
        >
          Engineered for{' '}
          <span className="relative inline-block">
            <span className="relative z-10 bg-gradient-to-r from-neon-blue-400 via-neon-cyan-400 to-neon-purple-400 bg-clip-text text-transparent">
              Mass Cognitive
            </span>
            <motion.span 
              initial={{ width: 0 }}
              animate={{ width: "100%" }}
              transition={{ delay: 1, duration: 1 }}
              className="absolute bottom-4 left-0 h-[2px] bg-gradient-to-r from-neon-blue-500/40 via-neon-cyan-500/40 to-transparent" 
            />
          </span>{' '}
          Flow.
        </motion.h1>

        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.8 }}
          className="text-void-200 text-xl mb-10 leading-relaxed max-w-2xl font-medium opacity-80"
        >
          Transform massive physical venues into intelligent, reactive organisms. CrowdMind integrates generative spatial inference with millisecond-latency crowd metrics.
        </motion.p>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="flex flex-wrap gap-5"
        >
          <button
            onClick={onLaunchDashboard}
            className="px-8 py-4 rounded-2xl bg-gradient-to-r from-neon-blue-600 to-neon-blue-500 text-white text-sm font-bold tracking-widest uppercase shadow-[0_0_40px_-10px_rgba(0,102,255,0.6)] hover:scale-[1.02] active:scale-95 transition-all flex items-center gap-3 cursor-pointer group"
          >
            Initialize Workspace
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
          <a
            href="#sandbox"
            className="px-8 py-4 rounded-2xl bg-void-900 border border-white/10 hover:border-white/20 text-white text-sm font-bold tracking-widest uppercase transition-all backdrop-blur-md flex items-center gap-2 group"
          >
            Live Simulation
            <div className="w-2 h-2 rounded-full bg-state-success animate-pulse" />
          </a>
        </motion.div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-10 pt-16 border-t border-white/5 mt-20">
          {[
            { val: "85K+", label: "Node Ingress" },
            { val: "45+", label: "Lang Models" },
            { val: "12ms", label: "Latency" },
            { val: "ISO", label: "Security" }
          ].map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 + (i * 0.1) }}
            >
              <div className="font-display text-3xl font-bold text-white tracking-tight">{stat.val}</div>
              <div className="text-[10px] text-void-500 font-mono font-bold uppercase tracking-[0.2em] mt-2">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Visual Component - Abstract Neural Orb */}
      <div className="flex-1 flex justify-center items-center relative min-h-[500px] w-full max-w-2xl z-20">
        <div className="relative w-full h-full flex items-center justify-center">
          {/* Layered Glows */}
          <div className="absolute w-[450px] h-[450px] bg-neon-blue-600/20 rounded-full blur-[80px] animate-pulse" />
          <div className="absolute w-[350px] h-[350px] bg-neon-purple-600/20 rounded-full blur-[60px] animate-pulse [animation-delay:1s]" />
          
          {/* Main Visual */}
          <motion.div 
            animate={{ 
              rotate: 360,
              y: [0, -20, 0]
            }}
            transition={{ 
              rotate: { duration: 20, repeat: Infinity, ease: "linear" },
              y: { duration: 6, repeat: Infinity, ease: "easeInOut" }
            }}
            className="w-[300px] h-[300px] sm:w-[400px] sm:h-[400px] rounded-full border border-white/5 relative flex items-center justify-center p-8 backdrop-blur-sm"
          >
            {/* Spinning Rings */}
            <div className="absolute inset-0 rounded-full border-t border-neon-cyan-500/20 animate-[spin_10s_linear_infinite]" />
            <div className="absolute inset-4 rounded-full border-b border-neon-blue-500/20 animate-[spin_15s_linear_infinite_reverse]" />
            <div className="absolute inset-8 rounded-full border-r border-neon-purple-500/20 animate-[spin_8s_linear_infinite]" />
            
            {/* Central Bot Icon */}
            <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-3xl bg-void-950 border border-white/10 flex items-center justify-center relative shadow-2xl overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-br from-neon-blue-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-16 h-16 rounded-full bg-neon-blue-500/20 blur-xl animate-pulse" />
              </div>
              <Bot className="w-12 h-12 sm:w-16 sm:h-16 text-neon-cyan-400 relative z-10 drop-shadow-neon-cyan" />
            </div>

            {/* Floating Telemetry Tags */}
            <motion.div 
              animate={{ y: [-5, 5, -5] }}
              transition={{ duration: 4, repeat: Infinity }}
              className="absolute -top-4 -right-4 px-4 py-2 rounded-xl bg-void-900 border border-white/10 shadow-2xl backdrop-blur-md flex items-center gap-2"
            >
              <div className="w-2 h-2 rounded-full bg-state-success" />
              <span className="text-[10px] font-mono font-bold text-white uppercase">Grid: Stable</span>
            </motion.div>
            
            <motion.div 
              animate={{ y: [5, -5, 5] }}
              transition={{ duration: 5, repeat: Infinity, delay: 1 }}
              className="absolute -bottom-6 -left-8 px-4 py-2 rounded-xl bg-void-900 border border-white/10 shadow-2xl backdrop-blur-md flex items-center gap-3"
            >
              <Users className="w-3.5 h-3.5 text-neon-blue-400" />
              <span className="text-[10px] font-mono font-bold text-white uppercase">82,410 Ingest</span>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

