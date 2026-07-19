import React from 'react';
import { motion } from 'motion/react';
import { Bell, Send, User, Clock, AlertTriangle } from 'lucide-react';

interface MessagingTabProps {
  messagingAlerts: any[];
  newMessageText: string;
  setNewMessageText: (val: string) => void;
  newMessageUrgency: string;
  setNewMessageUrgency: (val: string) => void;
  handleSendMessage: (e: React.FormEvent) => Promise<void>;
}

export const MessagingTab: React.FC<MessagingTabProps> = ({
  messagingAlerts,
  newMessageText,
  setNewMessageText,
  newMessageUrgency,
  setNewMessageUrgency,
  handleSendMessage
}) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }} 
      animate={{ opacity: 1, y: 0 }} 
      exit={{ opacity: 0, y: -10 }} 
      className="space-y-8"
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Send payload panel */}
        <div className="lg:col-span-5 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="font-display font-bold text-xl text-white flex items-center gap-2">
              <Bell className="w-5 h-5 text-neon-blue-400 animate-pulse" />
              Messaging Beacon
            </h3>
            <span className="text-[10px] font-mono text-void-500 uppercase tracking-widest">Protocol: FCM</span>
          </div>

          <div className="glass-panel p-6 border-neon-blue-500/10">
            <h4 className="text-white font-bold text-xs uppercase tracking-widest mb-6 font-mono">Draft Notification Payload</h4>
            
            <form onSubmit={handleSendMessage} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] text-void-500 font-mono font-bold uppercase tracking-widest">Broadcast Content</label>
                <textarea
                  rows={4}
                  required
                  value={newMessageText}
                  onChange={(e) => setNewMessageText(e.target.value)}
                  placeholder="e.g. VIP Evacuation Protocol Alpha initiated. All security nodes to Rally Point 4."
                  className="w-full bg-void-950/50 border border-void-600/30 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-neon-blue-500 font-sans resize-none placeholder:text-void-600 transition-all"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] text-void-500 font-mono font-bold uppercase tracking-widest">Priority Urgency Matrix</label>
                <div className="flex gap-3">
                  {['low', 'medium', 'high'].map((urg) => (
                    <button
                      key={urg}
                      type="button"
                      onClick={() => setNewMessageUrgency(urg)}
                      className={`flex-grow py-2.5 rounded-lg text-[10px] font-bold font-mono uppercase border transition-all duration-300 ${
                        newMessageUrgency === urg 
                          ? urg === 'high' 
                            ? 'bg-state-danger-bg text-state-danger-text border-state-danger-text shadow-state-danger-glow' 
                            : 'bg-neon-blue-500 text-white border-neon-blue-500 shadow-neon-glow-blue'
                          : 'bg-void-900 text-void-500 border-void-700/50 hover:border-void-600'
                      }`}
                    >
                      {urg}
                    </button>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-4 bg-neon-blue-500 hover:bg-neon-blue-400 text-white font-bold text-xs uppercase tracking-widest rounded-xl transition-all shadow-neon-glow-blue flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4" /> 
                Broadcast Message
              </button>
            </form>
          </div>

          <div className="p-4 bg-void-950/30 rounded-xl border border-void-600/10 flex items-start gap-3">
            <AlertTriangle className="w-4 h-4 text-state-warning-text flex-shrink-0 mt-0.5" />
            <p className="text-[10px] text-void-500 font-mono leading-relaxed">
              Global broadcasts are permanent and archived in the messaging logs. Ensure payload accuracy before dispatching to edge clients.
            </p>
          </div>
        </div>

        {/* Messaging logs list */}
        <div className="lg:col-span-7 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="font-display font-bold text-xl text-white flex items-center gap-2">
              <Clock className="w-5 h-5 text-void-500" />
              Dispatch History
            </h3>
            <span className="text-[10px] font-mono text-void-500 uppercase tracking-widest">Archive: Live</span>
          </div>

          <div className="glass-panel overflow-hidden border-void-600/10">
            <div className="bg-void-950/80 px-6 py-4 border-b border-void-600/20 grid grid-cols-12 gap-4 text-[10px] font-mono font-bold text-void-500 uppercase tracking-widest">
              <div className="col-span-8">Notification Payload</div>
              <div className="col-span-2">Urgency</div>
              <div className="col-span-2 text-right">Time</div>
            </div>

            <div className="max-h-[500px] overflow-y-auto custom-scrollbar divide-y divide-void-600/5">
              {messagingAlerts.length === 0 ? (
                <div className="py-32 flex flex-col items-center justify-center space-y-3 opacity-30">
                  <Bell className="w-12 h-12 text-void-500" />
                  <p className="text-xs font-mono text-void-500 uppercase tracking-widest">No dispatch history</p>
                </div>
              ) : (
                messagingAlerts.map((msg, idx) => (
                  <motion.div 
                    key={msg.id || idx} 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.04 }}
                    className="px-6 py-5 grid grid-cols-12 gap-4 items-start hover:bg-void-500/5 transition-colors group"
                  >
                    <div className="col-span-8 flex flex-col gap-2">
                      <p className="text-xs text-void-200 font-sans leading-relaxed pr-4">{msg.text}</p>
                      <div className="flex items-center gap-3">
                         <div className="flex items-center gap-1.5 text-[9px] font-mono text-void-500 uppercase">
                          <User className="w-3 h-3" /> {msg.sender || 'System Operator'}
                        </div>
                      </div>
                    </div>
                    <div className="col-span-2">
                      <span className={`px-2 py-1 rounded text-[9px] font-mono font-bold uppercase tracking-wider ${
                        msg.urgency === 'high' 
                          ? 'bg-state-danger-bg/20 text-state-danger-text border border-state-danger-text/30' 
                          : 'bg-void-800 text-void-400 border border-void-700'
                      }`}>
                        {msg.urgency}
                      </span>
                    </div>
                    <div className="col-span-2 text-right text-void-500 font-mono text-[10px]">
                      {msg.sentAt ? msg.sentAt.substring(11, 16) : ''}
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
