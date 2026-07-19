import React from 'react';
import { motion } from 'motion/react';
import { Sparkles, Bot } from 'lucide-react';
import { AIRecommendation } from '../MissionControl';

interface AIAdvisoryProps {
  recommendations: AIRecommendation[];
  handleApplyRecommendation: (rec: AIRecommendation) => void;
}

export const AIAdvisory: React.FC<AIAdvisoryProps> = ({
  recommendations,
  handleApplyRecommendation
}) => {
  return (
    <div className="glass-panel p-5 space-y-4 border-neon-purple-500/20">
      <div className="flex items-center gap-2">
        <Sparkles className="w-5 h-5 text-neon-purple-400" />
        <h2 className="font-display font-bold text-sm text-white uppercase tracking-wider">Predictive AI Advisory</h2>
      </div>
      
      <div className="space-y-3">
        {recommendations.filter(r => r.status === 'available').map(rec => (
          <motion.div 
            key={rec.id}
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className="bg-neon-purple-500/5 border border-neon-purple-500/20 rounded-2xl p-4 space-y-3"
          >
            <div className="flex justify-between items-start">
              <span className="font-mono text-[9px] font-bold text-neon-purple-400 uppercase tracking-widest">Confidence: {rec.confidence}%</span>
              <Bot className="w-3.5 h-3.5 text-neon-purple-400" />
            </div>
            <p className="text-xs text-white leading-relaxed font-medium">{rec.actionableText}</p>
            <button 
              onClick={() => handleApplyRecommendation(rec)}
              className="w-full py-2 bg-neon-purple-600 hover:bg-neon-purple-500 text-white font-mono text-[10px] font-bold uppercase tracking-widest transition-all rounded-xl shadow-neon-glow-purple"
            >
              Execute Protocol
            </button>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
