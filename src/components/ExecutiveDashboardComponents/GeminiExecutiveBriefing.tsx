import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Bot, ChevronRight, Sparkles, Cpu } from 'lucide-react';

interface GeminiExecutiveBriefingProps {
  selectedFocus: string;
  setSelectedFocus: (val: string) => void;
  isReportGenerating: boolean;
  generatedReport: string | null;
  generationSteps: string;
  handleGenerateReport: () => Promise<void>;
}

export const GeminiExecutiveBriefing: React.FC<GeminiExecutiveBriefingProps> = ({
  selectedFocus,
  setSelectedFocus,
  isReportGenerating,
  generatedReport,
  generationSteps,
  handleGenerateReport
}) => {
  const focusOptions = [
    { id: 'General Operations', label: 'General Operations', desc: 'Holistic stadium capacity and safety assessment.' },
    { id: 'Revenue & Yield Optimization', label: 'Revenue & Yield', desc: 'Ticketing, suite and concession monetization pathways.' },
    { id: 'Sustainability & Carbon Milestones', label: 'Sustainability & CO₂', desc: 'Zero-plastic targets, public transport offsets, smart cooling.' },
    { id: 'Steward Deployment & Volunteer Performance', label: 'Volunteer Efficacy', desc: 'Dispatch SLA tracking, morale indexes, and labor models.' },
  ];

  return (
    <div className="bg-void-850 border border-void-600/20 rounded-2xl p-6 flex flex-col justify-between h-full">
      <div>
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-2">
            <Bot className="w-5 h-5 text-neon-purple-400 animate-pulse" />
            <h3 className="font-display font-bold text-lg text-white">Gemini C-Suite Briefing Generator</h3>
          </div>
          <span className="px-2 py-0.5 rounded bg-neon-purple-500/10 border border-neon-purple-500/30 text-[9px] font-mono text-neon-purple-400 uppercase">
            Secure AI Model
          </span>
        </div>

        <p className="text-void-400 text-xs mb-5">
          Select an operations matrix focal perspective to compile a strategic executive briefing on stadium performance.
        </p>

        {/* Focus Options Pills */}
        <div className="grid grid-cols-2 gap-2 mb-6">
          {focusOptions.map((opt) => (
            <button
              key={opt.id}
              onClick={() => setSelectedFocus(opt.id)}
              className={`p-3.5 rounded-xl border transition-all text-left group ${
                selectedFocus === opt.id
                  ? 'bg-neon-purple-500/10 border-neon-purple-500 text-white'
                  : 'bg-void-900 border-void-600/20 hover:border-void-500 text-void-400'
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className={`text-xs font-bold leading-tight ${selectedFocus === opt.id ? 'text-neon-cyan-400' : 'text-white'}`}>
                  {opt.label}
                </span>
                <ChevronRight className={`w-3.5 h-3.5 transition-transform duration-300 ${selectedFocus === opt.id ? 'translate-x-0.5 text-neon-cyan-400' : 'text-void-500'}`} />
              </div>
              <p className="text-[10px] text-void-500 leading-relaxed truncate group-hover:text-void-400 transition-colors">{opt.desc}</p>
            </button>
          ))}
        </div>

        {/* Generated Briefing Display */}
        <div className="relative min-h-[280px] bg-void-900 border border-void-600/20 rounded-xl p-5 overflow-hidden">
          <AnimatePresence mode="wait">
            {isReportGenerating ? (
              <motion.div 
                key="generating-skeleton"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-void-950/80 backdrop-blur-xs p-5 flex flex-col justify-between z-10"
              >
                <motion.div 
                  initial={{ top: "0%" }}
                  animate={{ top: "100%" }}
                  transition={{ duration: 1.8, repeat: Infinity, ease: "linear" }}
                  className="absolute inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-neon-cyan-400 to-transparent shadow-neon-glow-cyan z-20 pointer-events-none"
                />
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded bg-void-850 animate-pulse" />
                    <div className="h-4 w-32 bg-void-800 rounded animate-pulse" />
                  </div>
                  <div className="space-y-2.5">
                    <div className="h-2.5 w-full bg-void-800/60 rounded animate-pulse" style={{ animationDelay: '100ms' }} />
                    <div className="h-2.5 w-5/6 bg-void-800/60 rounded animate-pulse" style={{ animationDelay: '200ms' }} />
                    <div className="h-2.5 w-11/12 bg-void-800/60 rounded animate-pulse" style={{ animationDelay: '300ms' }} />
                    <div className="h-2.5 w-4/5 bg-void-800/60 rounded animate-pulse" style={{ animationDelay: '400ms' }} />
                    <div className="h-2.5 w-2/3 bg-void-800/60 rounded animate-pulse" style={{ animationDelay: '500ms' }} />
                  </div>
                  
                  <div className="pt-2 flex gap-2">
                    <div className="h-2 w-16 bg-void-800 rounded animate-pulse" />
                    <div className="h-2 w-20 bg-void-800 rounded animate-pulse" />
                  </div>
                </div>

                <div className="border-t border-void-600/15 pt-3 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 rounded-full border border-neon-purple-500 border-t-transparent animate-spin" />
                    <span className="text-[10px] font-mono text-neon-purple-400 uppercase tracking-wider animate-pulse font-bold">
                      {generationSteps || "Synthesizing Core Data..."}
                    </span>
                  </div>
                  <span className="text-[9px] font-mono text-void-500 uppercase">Gemini Workspace Active</span>
                </div>
              </motion.div>
            ) : null}
          </AnimatePresence>

          {generatedReport ? (
            <div className="text-void-100 text-xs leading-relaxed space-y-4 max-h-[340px] overflow-y-auto custom-scrollbar pr-1">
              <div className="prose prose-invert prose-xs max-w-none">
                {generatedReport.split('\n').map((line, index) => {
                  if (line.startsWith('### ')) {
                    return <h3 key={index} className="text-sm font-bold text-white mt-4 mb-2 uppercase tracking-wide border-b border-void-600/10 pb-1 flex items-center gap-1.5"><Sparkles className="w-3.5 h-3.5 text-neon-cyan-400" /> {line.replace('### ', '')}</h3>;
                  }
                  if (line.startsWith('#### ')) {
                    return <h4 key={index} className="text-xs font-bold text-neon-cyan-400 mt-3 mb-1.5 uppercase tracking-wider">{line.replace('#### ', '')}</h4>;
                  }
                  if (line.startsWith('* ') || line.startsWith('- ')) {
                    return <li key={index} className="ml-4 list-disc text-void-300 py-0.5">{line.substring(2)}</li>;
                  }
                  if (line.trim() === '---') {
                    return <hr key={index} className="border-void-600/20 my-3" />;
                  }
                  if (line.trim() === '') {
                    return <div key={index} className="h-2" />;
                  }
                  return <p key={index} className="text-void-300 py-0.5">{line}</p>;
                })}
              </div>
            </div>
          ) : (
            <div className="py-16 flex flex-col items-center justify-center text-center">
              <Cpu className="w-10 h-10 text-void-600 mb-3" />
              <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-1">Briefing Mainframe Ready</h4>
              <p className="text-[11px] text-void-500 max-w-xs leading-normal">Configure perspective pill metrics and request an AI Synthesis run.</p>
            </div>
          )}
        </div>
      </div>

      <div className="mt-6 flex gap-3">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => handleGenerateReport()}
          disabled={isReportGenerating}
          className="flex-grow py-3 rounded-xl bg-neon-purple-500 hover:bg-neon-purple-400 text-white font-bold text-xs uppercase transition-all shadow-neon-glow-purple flex items-center justify-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
        >
          <Bot className="w-4 h-4" />
          Compile & Synthesize Executive Briefing
        </motion.button>
      </div>
    </div>
  );
};
