import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Megaphone, Send } from 'lucide-react';
import { db, collection, query, orderBy, onSnapshot, addDoc } from '../../firebase';
import { BroadcastAlert } from '../../types';

export const BroadcastCenter: React.FC = () => {
  const [broadcasts, setBroadcasts] = useState<BroadcastAlert[]>([]);
  const [message, setMessage] = useState('');
  const [urgency, setUrgency] = useState('medium');
  const [isSending, setIsSending] = useState(false);

  useEffect(() => {
    const q = query(collection(db, 'messaging_alerts'), orderBy('sentAt', 'desc'));
    const unsub = onSnapshot(q, (snap) => {
      const list: BroadcastAlert[] = [];
      snap.forEach(d => list.push({ id: d.id, ...d.data() } as BroadcastAlert));
      setBroadcasts(list);
    });
    return unsub;
  }, []);

  const handleSendBroadcast = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;
    setIsSending(true);
    try {
      // Add message to Firestore
      await addDoc(collection(db, 'messaging_alerts'), {
        text: message,
        urgency,
        sentAt: new Date().toISOString(),
        sender: 'Lusail Operations Center'
      });
      // Also add to safety_broadcasts
      await addDoc(collection(db, 'safety_broadcasts'), {
        text: `BEACON [${urgency.toUpperCase()}]: ${message}`,
        timestamp: new Date().toISOString()
      });
      setMessage('');
    } catch (err) {
      console.error('Error sending broadcast:', err);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 min-h-[500px]">
      <div className="glass-card p-6 flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-3 mb-6">
            <Megaphone className="w-5 h-5 text-neon-purple-400" aria-hidden="true" />
            <h3 className="font-display font-bold text-lg text-white">Broadcast Safety Beacon</h3>
          </div>

          <form onSubmit={handleSendBroadcast} className="space-y-4">
            <div>
              <label htmlFor="broadcast-message" className="block text-[10px] font-mono text-void-300 uppercase tracking-wider mb-1.5">Broadcast message</label>
              <textarea
                id="broadcast-message"
                required
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="e.g. Compressor C-204 bearing vibration high, dispatch technician..."
                rows={4}
                className="w-full bg-void-950 border border-void-600/40 rounded-xl px-4 py-3 text-xs text-white placeholder:text-void-600 focus:outline-none focus:border-neon-purple-500 transition-colors resize-none"
              />
            </div>

            <div>
              <label className="block text-[10px] font-mono text-void-300 uppercase tracking-wider mb-1.5">Beacon Urgency</label>
              <div className="grid grid-cols-3 gap-2" role="radiogroup" aria-label="Beacon urgency">
                {['low', 'medium', 'high'].map((level) => (
                  <button
                    key={level}
                    type="button"
                    onClick={() => setUrgency(level)}
                    className={`py-2 rounded-lg font-mono text-[10px] uppercase border transition-all cursor-pointer ${
                      urgency === level 
                        ? 'bg-neon-purple-500/20 text-neon-purple-400 border-neon-purple-500 shadow-neon-glow-purple' 
                        : 'bg-void-900 border-void-700/50 text-void-400 hover:border-void-600'
                    }`}
                    role="radio"
                    aria-checked={urgency === level}
                  >
                    {level}
                  </button>
                ))}
              </div>
            </div>

            <button
              type="submit"
              disabled={isSending}
              className="w-full py-3.5 rounded-xl bg-neon-purple-500 hover:bg-neon-purple-400 text-white font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-neon-glow-purple cursor-pointer disabled:opacity-50"
            >
              <Send className="w-3.5 h-3.5" aria-hidden="true" />
              Transmit Beacon
            </button>
          </form>
        </div>
      </div>

      <div className="xl:col-span-2 glass-card p-6 flex flex-col">
        <h3 className="font-display font-bold text-base text-white mb-4">Transmission Broadcast Feed</h3>
        
        <div className="space-y-3 flex-grow overflow-y-auto max-h-[400px] pr-2 custom-scrollbar">
          <AnimatePresence>
            {broadcasts.length > 0 ? (
              broadcasts.map((b) => (
                <motion.div
                  key={b.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="bg-void-900 border border-void-700/30 p-4 rounded-xl flex flex-col gap-2"
                >
                  <div className="flex justify-between items-center text-[9px] font-mono">
                    <span className={`px-2 py-0.5 rounded uppercase font-bold border ${
                      b.urgency === 'high' ? 'bg-state-danger-bg/20 text-state-danger-text border-state-danger-text/20' :
                      b.urgency === 'medium' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' :
                      'bg-void-850 text-void-400 border-void-700/30'
                    }`}>
                      {b.urgency} Beacon
                    </span>
                    <span className="text-void-500">{new Date(b.sentAt).toLocaleString()}</span>
                  </div>
                  <p className="text-xs text-white leading-relaxed font-sans font-medium">{b.text}</p>
                </motion.div>
              ))
            ) : (
              <div className="py-20 flex flex-col items-center justify-center text-void-600">
                <Megaphone className="w-12 h-12 opacity-25 mb-3" aria-hidden="true" />
                <p className="text-xs uppercase font-mono tracking-widest font-bold">No active beacons broadcasted</p>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};
