import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Terminal, ShieldAlert, Cpu, ClipboardList, Send, Sparkles, 
  Trash2, Plus, CheckCircle2, Languages, Megaphone, Users, AlertTriangle, Play, Check 
} from 'lucide-react';
import { 
  db, collection, query, orderBy, limit, onSnapshot, addDoc, updateDoc, deleteDoc, doc 
} from '../firebase';
import { 
  ResponsiveContainer, BarChart, Bar, Cell, XAxis, YAxis, Tooltip, CartesianGrid 
} from 'recharts';

// ==========================================
// 1. VOLUNTEER STEWARDSHIP BOARD
// ==========================================
export const VolunteerBoard = () => {
  const [tasks, setTasks] = useState<any[]>([]);
  const [title, setTitle] = useState('');
  const [location, setLocation] = useState('Gate A (North Entrance)');
  const [urgency, setUrgency] = useState('medium');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const q = query(collection(db, 'volunteer_tasks'), orderBy('createdAt', 'desc'));
    const unsub = onSnapshot(q, (snap) => {
      const list: any[] = [];
      snap.forEach(d => list.push({ id: d.id, ...d.data() }));
      setTasks(list);
    });
    return unsub;
  }, []);

  const handleAddTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    setIsSubmitting(true);
    try {
      await addDoc(collection(db, 'volunteer_tasks'), {
        title,
        location,
        urgency,
        status: 'pending',
        createdAt: new Date().toISOString()
      });
      setTitle('');
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResolveTask = async (id: string) => {
    try {
      await updateDoc(doc(db, 'volunteer_tasks', id), { status: 'completed' });
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteTask = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'volunteer_tasks', id));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 h-full min-h-[600px]">
      <div className="xl:col-span-2 glass-card p-6 flex flex-col">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-3">
            <ClipboardList className="w-5 h-5 text-neon-blue-400" />
            <h3 className="font-display font-bold text-lg text-white">Active Steward Dispatch</h3>
          </div>
          <span className="px-2 py-0.5 rounded bg-neon-blue-500/10 border border-neon-blue-500/30 text-[9px] font-mono text-neon-blue-400 uppercase font-bold">
            Live Link Active
          </span>
        </div>

        <div className="space-y-4 flex-grow overflow-y-auto max-h-[500px] pr-2 custom-scrollbar">
          <AnimatePresence mode="popLayout">
            {tasks.length > 0 ? (
              tasks.map((task) => (
                <motion.div 
                  key={task.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -30 }}
                  className={`p-4 rounded-xl border transition-all ${
                    task.status === 'completed' 
                      ? 'bg-void-950/40 border-void-600/10 opacity-50' 
                      : 'bg-void-900 border-void-600/30 shadow-md hover:border-void-500'
                  }`}
                >
                  <div className="flex justify-between items-start gap-4">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <span className={`px-2 py-0.5 rounded text-[8px] font-mono font-bold uppercase tracking-wider ${
                          task.urgency === 'high' ? 'bg-state-danger/20 text-state-danger' :
                          task.urgency === 'medium' ? 'bg-state-warning/20 text-state-warning' :
                          'bg-void-800 text-void-400'
                        }`}>
                          {task.urgency} priority
                        </span>
                        <span className="text-[10px] text-void-500 font-mono">
                          {new Date(task.createdAt).toLocaleTimeString()}
                        </span>
                      </div>
                      <h4 className={`text-sm font-semibold ${task.status === 'completed' ? 'line-through text-void-500' : 'text-white'}`}>
                        {task.title}
                      </h4>
                      <p className="text-[11px] text-void-400 mt-1 font-mono">{task.location}</p>
                    </div>

                    <div className="flex items-center gap-2">
                      {task.status !== 'completed' && (
                        <button
                          onClick={() => handleResolveTask(task.id)}
                          className="p-2 rounded-lg bg-state-success/15 text-state-success hover:bg-state-success hover:text-white transition-all cursor-pointer"
                          title="Complete Task"
                        >
                          <Check className="w-4 h-4" />
                        </button>
                      )}
                      <button
                        onClick={() => handleDeleteTask(task.id)}
                        className="p-2 rounded-lg bg-red-500/15 text-red-400 hover:bg-red-500 hover:text-white transition-all cursor-pointer"
                        title="Delete Task"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="py-20 flex flex-col items-center justify-center text-void-600">
                <ClipboardList className="w-12 h-12 opacity-25 mb-3" />
                <p className="text-xs uppercase font-mono tracking-widest font-bold">No standby steward tasks</p>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <div className="glass-card p-6 flex flex-col justify-between">
        <div>
          <h3 className="font-display font-bold text-base text-white mb-4 flex items-center gap-2">
            <Plus className="w-4 h-4 text-neon-blue-400" />
            Dispatch New Unit
          </h3>
          
          <form onSubmit={handleAddTask} className="space-y-4">
            <div>
              <label className="block text-[10px] font-mono text-void-300 uppercase tracking-wider mb-1.5">Task Description</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Assist wheelchair spectator at Sec 108"
                className="w-full bg-void-950 border border-void-600/40 rounded-xl px-4 py-3 text-xs text-white placeholder:text-void-600 focus:outline-none focus:border-neon-blue-500 transition-colors"
              />
            </div>

            <div>
              <label className="block text-[10px] font-mono text-void-300 uppercase tracking-wider mb-1.5">Target Location</label>
              <select
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full bg-void-950 border border-void-600/40 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-neon-blue-500 transition-colors"
              >
                <option value="Gate A (North Entrance)">Gate A (North Entrance)</option>
                <option value="Gate B (East Concourse)">Gate B (East Concourse)</option>
                <option value="Gate C (South Main)">Gate C (South Main)</option>
                <option value="Section 108 VIP Tier">Section 108 VIP Tier</option>
                <option value="Section 114 Refreshment Bar">Section 114 Refreshment Bar</option>
              </select>
            </div>

            <div>
              <label className="block text-[10px] font-mono text-void-300 uppercase tracking-wider mb-1.5">Urgency Level</label>
              <div className="grid grid-cols-3 gap-2">
                {['low', 'medium', 'high'].map((level) => (
                  <button
                    key={level}
                    type="button"
                    onClick={() => setUrgency(level)}
                    className={`py-2 rounded-lg font-mono text-[10px] uppercase border transition-all ${
                      urgency === level 
                        ? 'bg-neon-blue-500/20 text-neon-blue-400 border-neon-blue-500' 
                        : 'bg-void-900 border-void-700/50 text-void-400'
                    }`}
                  >
                    {level}
                  </button>
                ))}
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 rounded-xl bg-neon-blue-600 hover:bg-neon-blue-500 text-white font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-neon-glow-blue cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
              Dispatch Task
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

// ==========================================
// 2. AI SIGNAGE BRIDGE (OCR & TRANSLATOR)
// ==========================================
const simulatedSigns = [
  { text: "خروج الطوارئ - قف وافتح الباب بالكامل عند الخطر", label: "Emergency Safety Exit Sign", arabicText: "خروج الطوارئ - قف وافتح الباب بالكامل عند الخطر" },
  { text: "بوابة كبار الشخصيات والدعوات الخاصة فقط", label: "VIP Portal Access Restriction Panel", arabicText: "بوابة كبار الشخصيات والدعوات الخاصة فقط" },
  { text: "منطقة المأكولات والمشروبات - يمنع إدخال القوارير الزجاجية", label: "Concession Regulations Signboard", arabicText: "منطقة المأكولات والمشروبات - يمنع إدخال القوارير الزجاجية" },
  { text: "الرجاء إبراز الباركود الخاص بالتذكرة بشكل واضح", label: "Scan bar instructions placard at outer Gate B", arabicText: "الرجاء إبراز الباركود الخاص بالتذكرة بشكل واضح" }
];

export const SignageTranslator = () => {
  const [selectedSign, setSelectedSign] = useState(simulatedSigns[0]);
  const [isTranslating, setIsTranslating] = useState(false);
  const [translationResult, setTranslationResult] = useState<string | null>(null);
  const [scanning, setScanning] = useState(false);

  const handleTranslate = async () => {
    setScanning(true);
    setIsTranslating(true);
    setTranslationResult(null);
    await new Promise(r => setTimeout(r, 1500)); // scan animation
    setScanning(false);

    try {
      const response = await fetch('/api/gemini/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: `Translate the following Arabic signage text to English and Spanish. Sign label: "${selectedSign.label}". Arabic text: "${selectedSign.arabicText}". Explain the stadium safety or entry instruction details.`,
          systemInstruction: "You are StadiumMind Signage translation system. Respond in a clean, formatted layout with English and Spanish translations, and a brief description of the instruction."
        })
      });
      const data = await response.json();
      if (data.error) throw new Error(data.error);
      setTranslationResult(data.text);
    } catch (err) {
      setTranslationResult("### SYSTEM LINK ERROR\nOCR Translation synthesis failed. Check endpoint parameters and try again.");
    } finally {
      setIsTranslating(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 min-h-[500px]">
      <div className="glass-card p-6 flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-3 mb-6">
            <Languages className="w-5 h-5 text-neon-cyan-400" />
            <h3 className="font-display font-bold text-lg text-white">AI Signage Translator</h3>
          </div>

          <p className="text-void-400 text-xs leading-relaxed mb-6">
            Select a physical placard signage scanned inside Lusail Stadium to simulate translation with OCR spatial awareness.
          </p>

          <div className="space-y-2.5 mb-6">
            {simulatedSigns.map((sign, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setSelectedSign(sign);
                  setTranslationResult(null);
                }}
                className={`w-full p-4 rounded-xl border text-left transition-all ${
                  selectedSign.text === sign.text
                    ? 'bg-neon-cyan-500/10 border-neon-cyan-500 text-white'
                    : 'bg-void-900 border-void-700/40 text-void-400 hover:border-void-600'
                }`}
              >
                <div className="text-[10px] font-mono text-neon-cyan-400 font-bold uppercase tracking-wider mb-1.5">{sign.label}</div>
                <div className="text-sm font-sans font-medium text-white text-right leading-relaxed" dir="rtl">{sign.text}</div>
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={handleTranslate}
          disabled={isTranslating}
          className="w-full py-3.5 rounded-xl bg-neon-cyan-500 hover:bg-neon-cyan-400 text-white font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-neon-glow-cyan cursor-pointer disabled:opacity-50"
        >
          <Cpu className="w-4 h-4 animate-spin" style={{ animationDuration: isTranslating ? '2s' : '0s' }} />
          Compile Translation Matrix
        </button>
      </div>

      <div className="glass-card p-6 flex flex-col justify-between relative overflow-hidden">
        {/* Scanning Sweep Overlay */}
        {scanning && (
          <motion.div 
            initial={{ top: "0%" }}
            animate={{ top: "100%" }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
            className="absolute inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-neon-cyan-400 to-transparent shadow-neon-glow-cyan z-20 pointer-events-none"
          />
        )}
        
        <div className="flex-grow flex flex-col justify-center">
          {translationResult ? (
            <div className="space-y-4 max-h-[420px] overflow-y-auto pr-1 custom-scrollbar">
              <div className="prose prose-invert prose-xs max-w-none text-xs leading-relaxed space-y-3 font-mono">
                {translationResult.split('\n').map((line, index) => {
                  if (line.startsWith('### ')) {
                    return <h3 key={index} className="text-xs font-bold text-white mt-4 mb-2 uppercase tracking-wide border-b border-void-600/10 pb-1 flex items-center gap-1.5"><Sparkles className="w-3.5 h-3.5 text-neon-cyan-400" /> {line.replace('### ', '')}</h3>;
                  }
                  if (line.startsWith('* ') || line.startsWith('- ')) {
                    return <li key={index} className="ml-4 list-disc text-void-300 py-0.5">{line.substring(2)}</li>;
                  }
                  if (line.trim() === '') return <div key={index} className="h-1" />;
                  return <p key={index} className="text-void-300 py-0.5">{line}</p>;
                })}
              </div>
            </div>
          ) : (
            <div className="py-20 flex flex-col items-center justify-center text-center text-void-600">
              <Languages className="w-12 h-12 opacity-25 mb-4 animate-pulse" />
              <h4 className="text-xs font-mono uppercase tracking-widest font-bold">Scanning Node Empty</h4>
              <p className="text-[10px] text-void-500 max-w-xs mt-2 leading-relaxed">Select a scanned signboard and click Translate to compile with OCR.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// ==========================================
// 3. SAFETY BEACON CONTROL (BROADCAST CENTER)
// ==========================================
export const BroadcastCenter = () => {
  const [broadcasts, setBroadcasts] = useState<any[]>([]);
  const [message, setMessage] = useState('');
  const [urgency, setUrgency] = useState('medium');
  const [isSending, setIsSending] = useState(false);

  useEffect(() => {
    const q = query(collection(db, 'messaging_alerts'), orderBy('sentAt', 'desc'));
    const unsub = onSnapshot(q, (snap) => {
      const list: any[] = [];
      snap.forEach(d => list.push({ id: d.id, ...d.data() }));
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
      console.error(err);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 min-h-[500px]">
      <div className="glass-card p-6 flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-3 mb-6">
            <Megaphone className="w-5 h-5 text-neon-purple-400" />
            <h3 className="font-display font-bold text-lg text-white">Broadcast Safety Beacon</h3>
          </div>

          <form onSubmit={handleSendBroadcast} className="space-y-4">
            <div>
              <label className="block text-[10px] font-mono text-void-300 uppercase tracking-wider mb-1.5">Broadcast message</label>
              <textarea
                required
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="e.g. Gate B congestion rerouted to Gate C walkway..."
                rows={4}
                className="w-full bg-void-950 border border-void-600/40 rounded-xl px-4 py-3 text-xs text-white placeholder:text-void-600 focus:outline-none focus:border-neon-purple-500 transition-colors resize-none"
              />
            </div>

            <div>
              <label className="block text-[10px] font-mono text-void-300 uppercase tracking-wider mb-1.5">Beacon Urgency</label>
              <div className="grid grid-cols-3 gap-2">
                {['low', 'medium', 'high'].map((level) => (
                  <button
                    key={level}
                    type="button"
                    onClick={() => setUrgency(level)}
                    className={`py-2 rounded-lg font-mono text-[10px] uppercase border transition-all ${
                      urgency === level 
                        ? 'bg-neon-purple-500/20 text-neon-purple-400 border-neon-purple-500' 
                        : 'bg-void-900 border-void-700/50 text-void-400'
                    }`}
                  >
                    {level}
                  </button>
                ))}
              </div>
            </div>

            <button
              type="submit"
              disabled={isSending}
              className="w-full py-3.5 rounded-xl bg-neon-purple-500 hover:bg-neon-purple-400 text-white font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-neon-glow-purple cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
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
                    <span className={`px-2 py-0.5 rounded uppercase font-bold ${
                      b.urgency === 'high' ? 'bg-state-danger/20 text-state-danger' :
                      b.urgency === 'medium' ? 'bg-state-warning/20 text-state-warning' :
                      'bg-void-850 text-void-400'
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
                <Megaphone className="w-12 h-12 opacity-25 mb-3" />
                <p className="text-xs uppercase font-mono tracking-widest font-bold">No active beacons broadcasted</p>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

// ==========================================
// 4. IMMUTABLE AUDIT LOGS (TERMINAL CONSOLE)
// ==========================================
export const AuditLogs = () => {
  const [logs, setLogs] = useState<any[]>([]);
  const [filterCategory, setFilterCategory] = useState('all');
  const terminalEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const q = query(collection(db, 'analytics_events'), orderBy('timestamp', 'asc'));
    const unsub = onSnapshot(q, (snap) => {
      const list: any[] = [];
      snap.forEach(d => list.push({ id: d.id, ...d.data() }));
      setLogs(list);
    });
    return unsub;
  }, []);

  useEffect(() => {
    if (terminalEndRef.current) {
      terminalEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [logs]);

  const filteredLogs = filterCategory === 'all' 
    ? logs 
    : logs.filter(l => l.category === filterCategory);

  const categories = ['all', 'Authentication', 'Firebase System', 'Remote Config', 'Security Rules', 'Cloud Storage'];

  return (
    <div className="glass-card p-6 flex flex-col h-[600px] font-mono border-neon-cyan-500/10">
      <div className="flex flex-wrap justify-between items-center gap-4 mb-6 border-b border-void-700/40 pb-4">
        <div className="flex items-center gap-3">
          <Terminal className="w-5 h-5 text-neon-cyan-400 animate-pulse" />
          <div>
            <h3 className="font-display font-bold text-base text-white tracking-tight uppercase">Immutable Event Ledger</h3>
            <div className="text-[9px] text-neon-cyan-500 font-bold uppercase mt-0.5 tracking-wider">stadium_audit_core v4.0</div>
          </div>
        </div>

        <div className="flex flex-wrap gap-1.5 bg-void-950 p-1 rounded-lg border border-void-600/20">
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setFilterCategory(c)}
              className={`px-2.5 py-1 rounded text-[8px] font-bold uppercase transition-all ${
                filterCategory === c 
                  ? 'bg-neon-cyan-500/10 text-neon-cyan-400 border border-neon-cyan-500/30' 
                  : 'text-void-500 hover:text-white border border-transparent'
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* Terminal View Screen */}
      <div className="flex-grow bg-void-950/80 border border-void-700/40 rounded-2xl p-5 overflow-y-auto custom-scrollbar relative">
        <div className="absolute inset-0 cyber-grid-overlay opacity-5 pointer-events-none" />
        <div className="space-y-2 text-[10px] text-neon-cyan-400/90 leading-relaxed font-bold">
          {filteredLogs.map((log) => (
            <div key={log.id} className="flex flex-wrap gap-2 hover:bg-void-900/50 p-1.5 rounded transition-all">
              <span className="text-void-600 font-semibold">[{new Date(log.timestamp).toISOString()}]</span>
              <span className="text-neon-purple-400 font-semibold">&lt;{log.category}&gt;</span>
              <span className="text-white font-medium">{log.eventName}</span>
              <span className="text-void-500 font-semibold font-mono font-medium">({log.userEmail})</span>
            </div>
          ))}
          <div ref={terminalEndRef} />
        </div>
      </div>

      <div className="flex justify-between items-center text-[9px] text-void-600 mt-4 uppercase">
        <span>Ledger Node: Lusail-Mainframe-01</span>
        <span>Secure Session Verified ✓</span>
      </div>
    </div>
  );
};

// ==========================================
// 5. SPATIAL FLOW MATRIX (CROWD ANALYTICS)
// ==========================================
export const CrowdAnalytics = () => {
  const [gates, setGates] = useState<any[]>([]);
  const [forecast, setForecast] = useState<string | null>(null);
  const [isGeneratingForecast, setIsGeneratingForecast] = useState(false);

  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'stadium_gates'), (snap) => {
      const list: any[] = [];
      snap.forEach(d => list.push(d.data()));
      setGates(list.sort((a, b) => a.order - b.order));
    });
    return unsub;
  }, []);

  const handleGenerateForecast = async () => {
    setIsGeneratingForecast(true);
    setForecast(null);
    try {
      const gateDetails = gates.map(g => `${g.name}: FlowRate=${g.flowRate}, WaitTime=${g.waitTime}, Occupancy=${g.occupancy}%`).join('\n');
      const response = await fetch('/api/gemini/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: `Analyze the following stadium gates telemetry and write a short strategic ingress forecast and 2 tactical recommendations: \n${gateDetails}`,
          systemInstruction: "You are StadiumMind Predictive Crowd Analytics Engine. Formulate a short, futuristic ingress forecast with 2 specific recommendations. Use markdown lists and headings (### / ####)."
        })
      });
      const data = await response.json();
      if (data.error) throw new Error(data.error);
      setForecast(data.text);
    } catch (err) {
      setForecast("### Forecast Failure\nPredictive analytics matrix failed. Check connectivity and retry.");
    } finally {
      setIsGeneratingForecast(false);
    }
  };

  const chartData = gates.map(g => ({
    name: g.name.substring(0, 6),
    paxRate: parseInt(g.flowRate) || 0,
    occupancy: g.occupancy || 0
  }));

  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 min-h-[500px]">
      <div className="xl:col-span-2 glass-card p-6 flex flex-col">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-3">
            <Users className="w-5 h-5 text-neon-blue-400" />
            <h3 className="font-display font-bold text-lg text-white">Ingress Flow Analytics</h3>
          </div>
        </div>

        <div className="h-[300px] w-full mb-6">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.03)" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#4a5c9e', fontSize: 10, fontWeight: 700 }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fill: '#4a5c9e', fontSize: 10, fontWeight: 700 }} />
              <Tooltip 
                cursor={{ fill: 'rgba(255,255,255,0.02)' }}
                contentStyle={{ backgroundColor: '#040712', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}
              />
              <Bar dataKey="paxRate" name="Flow (PAX/min)" radius={[4, 4, 0, 0]}>
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={index % 2 === 0 ? '#0066ff' : '#00f2ff'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {gates.map((g, i) => (
            <div key={i} className="p-3 bg-void-900 border border-void-700/30 rounded-xl font-mono">
              <span className="text-[8px] text-void-500 uppercase tracking-wider block font-bold">{g.name}</span>
              <strong className="text-sm font-bold text-white block mt-1">{g.flowRate}</strong>
              <span className="text-[9px] text-neon-cyan-500 font-bold block mt-0.5">Wait: {g.waitTime}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="glass-card p-6 flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-2.5 mb-4">
            <Cpu className="w-5 h-5 text-neon-purple-400 animate-pulse" />
            <h3 className="font-display font-bold text-base text-white">AI Bottleneck Forecast</h3>
          </div>

          <div className="bg-void-900/60 border border-void-600/10 rounded-xl p-4 min-h-[220px] overflow-y-auto max-h-[300px] custom-scrollbar mb-4 text-xs font-mono text-void-200">
            {forecast ? (
              <div className="prose prose-invert prose-xs">
                {forecast.split('\n').map((line, idx) => {
                  if (line.startsWith('### ')) {
                    return <h3 key={idx} className="text-xs font-bold text-white mt-3 mb-1 uppercase">{line.replace('### ', '')}</h3>;
                  }
                  if (line.startsWith('* ') || line.startsWith('- ')) {
                    return <li key={idx} className="ml-3 list-disc text-void-300 py-0.5">{line.substring(2)}</li>;
                  }
                  return <p key={idx} className="py-0.5">{line}</p>;
                })}
              </div>
            ) : (
              <div className="py-16 flex flex-col items-center justify-center text-center text-void-600">
                <AlertTriangle className="w-8 h-8 opacity-20 mb-2" />
                <span className="text-[10px] font-mono tracking-widest font-bold">Inference Matrix Standby</span>
              </div>
            )}
          </div>
        </div>

        <button
          onClick={handleGenerateForecast}
          disabled={isGeneratingForecast}
          className="w-full py-3 rounded-xl bg-neon-purple-500 hover:bg-neon-purple-400 text-white font-bold text-xs uppercase transition-all flex items-center justify-center gap-2 shadow-neon-glow-purple cursor-pointer"
        >
          <Play className="w-4 h-4" />
          Compile Bottleneck Forecast
        </button>
      </div>
    </div>
  );
};
