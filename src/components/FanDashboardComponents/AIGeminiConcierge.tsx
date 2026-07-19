import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Bot, Send, Sparkles, User, Zap } from 'lucide-react';

interface AIGeminiConciergeProps {
  aiInput: string;
  setAiInput: (val: string) => void;
  aiChat: any[];
  isAiThinking: boolean;
  handleAiSubmit: (e: React.FormEvent) => Promise<void>;
  t: any;
}

export const AIGeminiConcierge: React.FC<AIGeminiConciergeProps> = ({
  aiInput,
  setAiInput,
  aiChat,
  isAiThinking,
  handleAiSubmit,
  t
}) => {
  const chatEndRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [aiChat]);

  return (
    <div className="bg-void-850 border border-void-600/30 rounded-2xl p-6 h-full flex flex-col min-h-[500px]">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-3">
          <div className="relative">
            <Bot className="w-6 h-6 text-neon-purple-400" />
            <span className="absolute -top-1 -right-1 w-2 h-2 bg-state-success-text rounded-full animate-pulse" />
          </div>
          <div>
            <h3 className="font-display font-bold text-lg text-white">{t.aiAssistant}</h3>
            <span className="text-[9px] font-mono text-neon-purple-400 uppercase tracking-widest font-bold">Quantum Core Active</span>
          </div>
        </div>
        <Zap className="w-5 h-5 text-void-500" />
      </div>

      <div className="flex-grow space-y-4 overflow-y-auto mb-6 pr-2 custom-scrollbar bg-void-900/40 rounded-xl p-4 border border-void-700/30 shadow-inner">
        <AnimatePresence mode="popLayout">
          {aiChat.map((chat, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              className={`flex ${chat.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`flex items-start gap-3 max-w-[85%] ${chat.sender === 'user' ? 'flex-row-reverse' : ''}`}>
                <div className={`p-2 rounded-lg shrink-0 ${chat.sender === 'user' ? 'bg-void-700 text-void-300' : 'bg-neon-purple-500/10 text-neon-purple-400 border border-neon-purple-500/20'}`}>
                  {chat.sender === 'user' ? <User className="w-3.5 h-3.5" /> : <Sparkles className="w-3.5 h-3.5" />}
                </div>
                <div className={`p-3 rounded-2xl text-xs leading-relaxed ${
                  chat.sender === 'user' 
                    ? 'bg-void-800 text-void-100 rounded-tr-none' 
                    : 'bg-void-950 text-void-200 border border-void-700 rounded-tl-none shadow-elevation-low'
                }`}>
                  {chat.text}
                </div>
              </div>
            </motion.div>
          ))}
          {isAiThinking && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
              <div className="bg-void-950 border border-void-700 p-3 rounded-2xl rounded-tl-none flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-neon-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-1.5 h-1.5 bg-neon-purple-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-1.5 h-1.5 bg-neon-purple-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </motion.div>
          )}
          <div ref={chatEndRef} />
        </AnimatePresence>
      </div>

      <form onSubmit={handleAiSubmit} className="relative">
        <input
          type="text"
          value={aiInput}
          onChange={(e) => setAiInput(e.target.value)}
          placeholder={t.aiPlaceholder}
          className="w-full bg-void-900 border border-void-700 rounded-xl py-3.5 pl-4 pr-12 text-xs text-white placeholder:text-void-500 focus:outline-none focus:border-neon-purple-500/50 focus:ring-1 focus:ring-neon-purple-500/20 transition-all shadow-elevation-medium"
        />
        <button
          type="submit"
          disabled={isAiThinking || !aiInput.trim()}
          className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-lg bg-neon-purple-500 text-white hover:bg-neon-purple-400 transition-all disabled:opacity-30 disabled:bg-void-700"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
      
      <div className="mt-3 flex justify-center gap-4 text-[9px] font-mono text-void-500 uppercase tracking-widest">
        <span>SLA: 1.2s response</span>
        <span className="text-void-700">|</span>
        <span>Model: Gemini 2.0 Flash</span>
      </div>
    </div>
  );
};
