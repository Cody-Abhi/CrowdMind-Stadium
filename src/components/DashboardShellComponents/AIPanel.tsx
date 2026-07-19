import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Bot, Send, Sparkles, X } from 'lucide-react';

interface AIPanelProps {
  aiChat: any[];
  aiInput: string;
  setAiInput: (val: string) => void;
  isAiThinking: boolean;
  handleAiSend: (e: React.FormEvent) => void;
  isOpen: boolean;
  setIsOpen: (val: boolean) => void;
}

export const AIPanel: React.FC<AIPanelProps> = ({
  aiChat,
  aiInput,
  setAiInput,
  isAiThinking,
  handleAiSend,
  isOpen,
  setIsOpen
}) => {
  const scrollRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [aiChat, isAiThinking]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ x: 400, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: 400, opacity: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 32 }}
          className="fixed top-24 right-6 bottom-6 w-80 sm:w-[400px] bg-void-950/80 backdrop-blur-3xl border border-white/10 rounded-3xl shadow-[0_32px_64px_-12px_rgba(0,0,0,0.8)] z-50 flex flex-col overflow-hidden"
        >
          {/* Header */}
          <div className="p-6 border-b border-white/5 bg-white/[0.02] flex justify-between items-center">
            <div className="flex items-center gap-4">
              <div className="relative group">
                <div className="absolute -inset-1 bg-neon-blue-500 rounded-lg blur opacity-20 group-hover:opacity-40 transition-opacity" />
                <div className="relative w-10 h-10 rounded-xl bg-void-900 border border-white/10 flex items-center justify-center overflow-hidden">
                   <div className="absolute inset-0 bg-gradient-to-tr from-neon-blue-500/10 to-transparent" />
                   <Bot className="w-5 h-5 text-neon-cyan-400 animate-pulse" />
                </div>
              </div>
              <div>
                <h3 className="text-sm font-display font-bold text-white uppercase tracking-tight">Neural Core Copilot</h3>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-state-success animate-pulse" />
                  <span className="text-[9px] font-mono text-void-500 font-bold uppercase tracking-widest">Active Inference Mode</span>
                </div>
              </div>
            </div>
            <button 
              onClick={() => setIsOpen(false)}
              className="p-2 rounded-xl text-void-500 hover:text-white hover:bg-white/5 transition-all"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Chat Feed */}
          <div 
            ref={scrollRef}
            className="flex-grow overflow-y-auto p-6 space-y-6 custom-scrollbar bg-black/20"
          >
            {aiChat.map((msg: any, idx: number) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 10, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div className="flex items-center gap-2 mb-1.5 px-1">
                  <span className="text-[9px] font-mono font-bold text-void-500 uppercase tracking-widest">
                    {msg.sender === 'user' ? 'Operator' : 'StadiumMind AI'}
                  </span>
                </div>
                <div className={`max-w-[90%] p-4 rounded-2xl text-xs leading-relaxed font-medium shadow-sm ${
                  msg.sender === 'user' 
                    ? 'bg-neon-blue-600 text-white rounded-tr-none' 
                    : 'bg-void-800 border border-white/5 text-void-100 rounded-tl-none backdrop-blur-md'
                }`}>
                  {msg.text}
                </div>
              </motion.div>
            ))}
            {isAiThinking && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex items-center gap-3 text-[10px] font-mono text-neon-cyan-400 bg-void-800/30 p-3 rounded-xl border border-white/5 backdrop-blur-md"
              >
                <div className="flex gap-1">
                  <span className="w-1 h-1 rounded-full bg-neon-cyan-500 animate-bounce" />
                  <span className="w-1 h-1 rounded-full bg-neon-cyan-500 animate-bounce [animation-delay:0.2s]" />
                  <span className="w-1 h-1 rounded-full bg-neon-cyan-500 animate-bounce [animation-delay:0.4s]" />
                </div>
                Quantum Contextualizing...
              </motion.div>
            )}
          </div>

          {/* Input Area */}
          <form onSubmit={handleAiSend} className="p-6 border-t border-white/5 bg-void-950/80">
            <div className="relative group">
              <input 
                type="text"
                value={aiInput}
                onChange={(e) => setAiInput(e.target.value)}
                placeholder="Query neural network..."
                className="w-full bg-void-900 border border-white/5 rounded-2xl py-4 pl-5 pr-14 text-xs text-white focus:outline-none focus:border-neon-blue-500/50 transition-all placeholder:text-void-600 font-medium"
              />
              <button 
                type="submit"
                disabled={!aiInput.trim() || isAiThinking}
                className="absolute right-2 top-2 bottom-2 px-4 bg-neon-blue-600 text-white rounded-xl hover:bg-neon-blue-500 transition-all disabled:opacity-50 disabled:grayscale flex items-center justify-center shadow-lg active:scale-95"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
            <div className="flex justify-between items-center mt-4 px-1">
              <p className="text-[8px] text-void-600 uppercase font-mono font-bold tracking-widest">
                Gemini 1.5 Flash • Context: 128K
              </p>
              <div className="flex gap-1">
                <Sparkles className="w-3 h-3 text-neon-cyan-500 opacity-40" />
                <Bot className="w-3 h-3 text-neon-blue-500 opacity-40" />
              </div>
            </div>
          </form>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

