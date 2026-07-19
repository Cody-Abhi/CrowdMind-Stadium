import React from 'react';
import { Sparkles, Send, RefreshCw } from 'lucide-react';
import { ChatMessage } from '../../types';
import { formatConfidence } from '../../utils/format';

interface CopilotChatProps {
  chatLog: ChatMessage[];
  chatInput: string;
  setChatInput: (value: string) => void;
  isAiThinking: boolean;
  onSendQuery: (e: React.FormEvent) => void;
}

export const CopilotChat: React.FC<CopilotChatProps> = ({
  chatLog,
  chatInput,
  setChatInput,
  isAiThinking,
  onSendQuery
}) => {
  return (
    <div className="lg:col-span-2 glass-card p-6 flex flex-col h-[520px]">
      <div className="flex justify-between items-center mb-4 pb-4 border-b border-void-600/10">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-neon-purple-400 animate-pulse" aria-hidden="true" />
          <h3 className="font-display font-bold text-white text-sm">Ask Copilot (RAG Ingestion Node)</h3>
        </div>
        <span className="text-[9px] font-mono text-neon-blue-400 uppercase tracking-widest">Clearance: Engineer</span>
      </div>

      {/* Chat list */}
      <div className="flex-grow overflow-y-auto space-y-4 mb-4 pr-1 custom-scrollbar" role="log" aria-label="Copilot chat history">
        {chatLog.map((msg, i) => (
          <div key={i} className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}>
            <div 
              className={`max-w-[85%] p-3.5 rounded-2xl text-xs leading-relaxed ${
                msg.sender === 'user' 
                  ? 'bg-neon-blue-600 text-white shadow-md' 
                  : 'bg-void-900 border border-void-600/20 text-void-100'
              }`}
            >
              {msg.text}
              {msg.sender === 'ai' && msg.confidence !== undefined && (
                <div className="mt-2 pt-2 border-t border-void-600/10 flex flex-wrap justify-between items-center gap-2 text-[9px] font-mono text-void-500">
                  <span className={msg.confidence < 0.65 ? 'text-state-danger-text font-bold' : 'text-neon-cyan-400 font-bold'}>
                    Confidence: {formatConfidence(msg.confidence)}
                  </span>
                  {msg.citations && msg.citations.length > 0 && (
                    <div className="flex gap-1" aria-label="Citations">
                      {msg.citations.map((cit, ci) => (
                        <span key={ci} className="bg-void-850 border border-void-600/30 px-1.5 py-0.5 rounded text-void-400 font-bold">
                          [{cit.document} p.{cit.page}]
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        ))}
        {isAiThinking && (
          <div className="flex items-center gap-2 text-void-500 font-mono text-[10px] animate-pulse" role="status">
            <RefreshCw className="w-3.5 h-3.5 animate-spin text-neon-cyan-500" aria-hidden="true" />
            <span>Traversing Knowledge Graph & Vector database...</span>
          </div>
        )}
      </div>

      {/* Input form */}
      <form onSubmit={onSendQuery} className="flex gap-2 relative">
        <label htmlFor="rag-query-input" className="sr-only">Ask StadiumMind RAG query</label>
        <input
          id="rag-query-input"
          type="text"
          value={chatInput}
          onChange={(e) => setChatInput(e.target.value)}
          placeholder="Ask about Compressor C-204 limits, thermal sensors, or P-101 logs..."
          className="flex-grow bg-void-900 border border-void-600/30 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-neon-blue-500 placeholder:text-void-600"
          aria-required="true"
        />
        <button
          type="submit"
          disabled={isAiThinking}
          className="p-3 bg-neon-blue-600 hover:bg-neon-blue-500 text-white rounded-xl shadow-neon-glow-blue transition-colors flex items-center justify-center cursor-pointer disabled:opacity-50"
          aria-label="Send RAG query"
        >
          <Send className="w-4 h-4" aria-hidden="true" />
        </button>
      </form>
    </div>
  );
};
export default CopilotChat;
