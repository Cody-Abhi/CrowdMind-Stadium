import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Sparkles, Languages, Volume2, VolumeX, Accessibility, Wifi, Send, 
  Layers, Search, FileText, Cpu, AlertOctagon, RefreshCw, Network
} from "lucide-react";
import { db, collection, addDoc } from "../firebase";

interface FanDashboardProps {
  onAddStewardTask: (task: { title: string; zone: string; urgency: string }) => void;
  broadcastHistory: string[];
}

export default function FanDashboard({ onAddStewardTask, broadcastHistory }: FanDashboardProps) {
  const [activeTab, setActiveTab] = useState<"copilot" | "assets">("copilot");
  const [lang, setLang] = useState<"en" | "ar" | "es">("en");
  const [voiceActive, setVoiceActive] = useState(false);
  const [offlineMode, setOfflineMode] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState<string>("C-204");

  // RAG Chat States
  const [chatLog, setChatLog] = useState<Array<{ sender: "user" | "ai"; text: string; confidence?: number; citations?: Array<any> }>>([
    { sender: "ai", text: "Unified Asset & Operations Brain online. System clearance: ENGINEER. Ingestion nodes verified.", confidence: 0.99 }
  ]);
  const [chatInput, setChatInput] = useState("");
  const [isAiThinking, setIsAiThinking] = useState(false);

  // Asset mock state loaded from API
  const [assetHistory, setAssetHistory] = useState<any>(null);
  const [loadingHistory, setLoadingHistory] = useState(false);

  // Load Asset History from server API
  useEffect(() => {
    setLoadingHistory(true);
    fetch(`/api/v1/equipment/${selectedAsset}/history`)
      .then(res => res.json())
      .then(res => {
        if (res.success) {
          setAssetHistory(res.data);
        }
      })
      .catch(err => console.error(err))
      .finally(() => setLoadingHistory(false));
  }, [selectedAsset]);

  // Handle RAG AI Query
  const handleSendQuery = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!chatInput.trim() || isAiThinking) return;

    const userText = chatInput;
    setChatLog(prev => [...prev, { sender: "user", text: userText }]);
    setChatInput("");
    setIsAiThinking(true);

    try {
      const response = await fetch('/api/v1/ai/query', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userText })
      });
      const res = await response.json();
      if (res.success) {
        setChatLog(prev => [...prev, {
          sender: "ai",
          text: res.data.answer,
          citations: res.data.citations,
          confidence: res.data.confidence_score
        }]);
      } else {
        throw new Error(res.message);
      }
    } catch (err: any) {
      setChatLog(prev => [...prev, {
        sender: "ai",
        text: "Error synchronizing with local RAG node. Fallback active: " + err.message,
        confidence: 0.1
      }]);
    } finally {
      setIsAiThinking(false);
    }
  };

  // Emergency safety shutdown trigger
  const [isShuttingDown, setIsShuttingDown] = useState(false);
  const [shutdownProgress, setShutdownProgress] = useState(0);
  const shutdownTimer = useRef<any>(null);

  const handleShutdownStart = () => {
    setIsShuttingDown(true);
    shutdownTimer.current = setInterval(() => {
      setShutdownProgress(prev => {
        if (prev >= 100) {
          clearInterval(shutdownTimer.current);
          onAddStewardTask({
            title: "🚨 PLANT SHUTDOWN ALERT: Core manual sequence initiated from Sector E.",
            zone: "Sector E Compressor Pad",
            urgency: "high"
          });
          return 100;
        }
        return prev + 5;
      });
    }, 100);
  };

  const handleShutdownCancel = () => {
    if (shutdownTimer.current) clearInterval(shutdownTimer.current);
    setIsShuttingDown(false);
    setShutdownProgress(0);
  };

  return (
    <div className="space-y-6">
      {/* Top Options Panel */}
      <div className="flex flex-wrap justify-between items-center bg-void-850/80 border border-void-600/20 p-4 rounded-2xl gap-4">
        <div className="flex gap-2">
          <button
            onClick={() => setActiveTab("copilot")}
            className={`px-4 py-2 rounded-xl text-xs font-bold uppercase transition-all ${activeTab === "copilot" ? "bg-neon-blue-600 text-white shadow-neon-glow-blue" : "text-void-400 hover:text-white"}`}
          >
            Ask Copilot (RAG)
          </button>
          <button
            onClick={() => setActiveTab("assets")}
            className={`px-4 py-2 rounded-xl text-xs font-bold uppercase transition-all ${activeTab === "assets" ? "bg-neon-cyan-600 text-white shadow-neon-glow-cyan" : "text-void-400 hover:text-white"}`}
          >
            Asset explorer
          </button>
        </div>

        {/* Global toggles */}
        <div className="flex items-center gap-4 text-xs font-mono">
          <button
            onClick={() => setOfflineMode(!offlineMode)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border transition-colors ${offlineMode ? 'bg-state-danger-bg/20 border-state-danger-text/40 text-state-danger-text' : 'bg-void-900 border-void-600/30 text-void-400'}`}
          >
            <Wifi className="w-3.5 h-3.5" />
            <span>{offlineMode ? 'OFFLINE LOCAL STORAGE' : 'ONLINE MESH'}</span>
          </button>
          
          <button
            onClick={() => setVoiceActive(!voiceActive)}
            className={`p-2 rounded-lg border transition-colors ${voiceActive ? 'bg-neon-cyan-500/20 border-neon-cyan-500/40 text-neon-cyan-400' : 'bg-void-900 border-void-600/30 text-void-400'}`}
            title="Toggle assist audio voice"
          >
            {voiceActive ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>

          <select
            value={lang}
            onChange={(e) => setLang(e.target.value as any)}
            className="bg-void-900 border border-void-600/30 rounded-lg px-2.5 py-1 text-white focus:outline-none"
          >
            <option value="en">English</option>
            <option value="ar">العربية (Arabic)</option>
            <option value="es">Español</option>
          </select>
        </div>
      </div>

      {activeTab === "copilot" ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Chat Window */}
          <div className="lg:col-span-2 glass-card p-6 flex flex-col h-[520px]">
            <div className="flex justify-between items-center mb-4 pb-4 border-b border-void-600/10">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-neon-purple-400 animate-pulse" />
                <h3 className="font-display font-bold text-white">Ask Copilot (RAG Ingestion Node)</h3>
              </div>
              <span className="text-[9px] font-mono text-neon-blue-400 uppercase tracking-widest">Clearance: Engineer</span>
            </div>

            {/* Chat list */}
            <div className="flex-grow overflow-y-auto space-y-4 mb-4 pr-1 custom-scrollbar">
              {chatLog.map((msg, i) => (
                <div key={i} className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}>
                  <div className={`max-w-[85%] p-3.5 rounded-2xl text-xs leading-relaxed ${
                    msg.sender === 'user' 
                      ? 'bg-neon-blue-600 text-white shadow-md' 
                      : 'bg-void-900 border border-void-600/20 text-void-100'
                  }`}>
                    {msg.text}
                    {msg.sender === 'ai' && msg.confidence !== undefined && (
                      <div className="mt-2 pt-2 border-t border-void-600/10 flex flex-wrap justify-between items-center gap-2 text-[9px] font-mono text-void-500">
                        <span className={msg.confidence < 0.65 ? 'text-state-danger-text' : 'text-neon-cyan-400'}>
                          Confidence: {(msg.confidence * 100).toFixed(0)}%
                        </span>
                        {msg.citations && msg.citations.length > 0 && (
                          <div className="flex gap-1">
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
                <div className="flex items-center gap-2 text-void-500 font-mono text-[10px] animate-pulse">
                  <RefreshCw className="w-3.5 h-3.5 animate-spin text-neon-cyan-500" />
                  <span>Traversing Knowledge Graph & Vector database...</span>
                </div>
              )}
            </div>

            {/* Input form */}
            <form onSubmit={handleSendQuery} className="flex gap-2 relative">
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder="Ask about Compressor C-204 limits, thermal sensors, or P-101 logs..."
                className="flex-grow bg-void-900 border border-void-600/30 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-neon-blue-500 placeholder:text-void-600"
              />
              <button
                type="submit"
                disabled={isAiThinking}
                className="p-3 bg-neon-blue-600 hover:bg-neon-blue-500 text-white rounded-xl shadow-neon-glow-blue transition-colors flex items-center justify-center cursor-pointer"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>

          {/* Sidebar Tools (Shutoff & Documents checklist) */}
          <div className="space-y-6">
            {/* Quick Actions (Emergency Shutoff) */}
            <div className="glass-card p-6">
              <div className="flex items-center gap-2 mb-4">
                <AlertOctagon className="w-4 h-4 text-state-danger-text animate-pulse" />
                <h4 className="font-display font-bold text-white text-sm">Emergency Safety Inhibit</h4>
              </div>
              <p className="text-void-400 text-xs leading-relaxed mb-6">
                Press and hold the button below to initiate manual nitrogen gas fire suppression agent dispatch.
              </p>
              
              <button
                onMouseDown={handleShutdownStart}
                onMouseUp={handleShutdownCancel}
                onMouseLeave={handleShutdownCancel}
                onTouchStart={handleShutdownStart}
                onTouchEnd={handleShutdownCancel}
                className="w-full py-4 rounded-xl border border-state-danger-text/20 bg-state-danger-bg/10 hover:bg-state-danger-bg/20 text-state-danger-text text-xs uppercase font-bold tracking-wider relative overflow-hidden transition-colors cursor-pointer"
              >
                <span className="relative z-10">Hold to Dispatch Suppression</span>
                {isShuttingDown && (
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${shutdownProgress}%` }}
                    className="absolute inset-y-0 left-0 bg-state-danger-text/20 z-0" 
                  />
                )}
              </button>
            </div>

            {/* Ingested Documents List */}
            <div className="glass-card p-6">
              <div className="flex items-center gap-2 mb-4">
                <FileText className="w-4 h-4 text-neon-cyan-400" />
                <h4 className="font-display font-bold text-white text-sm">Ingested Plant Documents</h4>
              </div>
              <div className="space-y-2.5 max-h-[220px] overflow-y-auto pr-1 custom-scrollbar">
                {[
                  { tag: "C-204", file: "C-204 Compressor OEM Spec", type: "Manual", size: "14.2 MB" },
                  { tag: "P-101", file: "P-101 Pump Inspection Logbook", type: "Log", size: "3.5 MB" },
                  { tag: "E-105", file: "E-105 Heat Exchanger Clean SOP", type: "SOP", size: "1.2 MB" }
                ].map((doc, i) => (
                  <div key={i} className="flex justify-between items-center p-2.5 bg-void-900 border border-void-600/10 rounded-xl hover:border-void-500 transition-colors">
                    <div>
                      <span className="text-[10px] font-bold text-white block truncate max-w-[150px]">{doc.file}</span>
                      <span className="text-[9px] font-mono text-void-500 uppercase">{doc.type} • {doc.size}</span>
                    </div>
                    <span className="px-2 py-0.5 rounded bg-neon-cyan-500/10 border border-neon-cyan-500/30 text-[8px] font-mono text-neon-cyan-400">
                      {doc.tag}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Asset Telemetry & History */}
          <div className="lg:col-span-2 glass-card p-6 flex flex-col h-[520px]">
            <div className="flex justify-between items-center mb-6 pb-4 border-b border-void-600/10">
              <div className="flex items-center gap-2">
                <Cpu className="w-4 h-4 text-neon-cyan-400" />
                <h3 className="font-display font-bold text-white">Asset Operational Registry</h3>
              </div>
              <div className="flex gap-2">
                {["C-204", "P-101", "E-105"].map(tag => (
                  <button
                    key={tag}
                    onClick={() => setSelectedAsset(tag)}
                    className={`px-3 py-1 rounded-lg font-mono text-[10px] font-bold uppercase transition-all ${selectedAsset === tag ? 'bg-neon-cyan-500/20 text-neon-cyan-400 border border-neon-cyan-500/40' : 'bg-void-900 text-void-500'}`}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>

            {loadingHistory ? (
              <div className="flex-grow flex items-center justify-center font-mono text-xs text-void-500">
                <RefreshCw className="w-5 h-5 animate-spin mr-2 text-neon-cyan-500" />
                Loading history timeline...
              </div>
            ) : assetHistory ? (
              <div className="flex-grow flex flex-col min-h-0">
                <div className="mb-4">
                  <h4 className="text-sm font-bold text-white mb-1">{assetHistory.name}</h4>
                  <span className="text-[10px] font-mono text-void-400 uppercase">Sector: {assetHistory.location} • Status: <strong className="text-state-success-text">{assetHistory.status}</strong></span>
                </div>
                
                <h5 className="text-[10px] font-mono text-void-500 uppercase tracking-widest mb-3">Maintenance Timeline</h5>
                <div className="flex-grow overflow-y-auto space-y-3 pr-1 custom-scrollbar">
                  {assetHistory.history.map((log: any, idx: number) => (
                    <div key={idx} className="p-3 bg-void-900 border border-void-600/10 rounded-xl relative pl-12 group hover:border-void-500 transition-colors">
                      <div className="absolute left-4 top-4 w-4 h-4 rounded-full border border-void-700 bg-void-950 flex items-center justify-center">
                        <div className="w-1.5 h-1.5 rounded-full bg-neon-cyan-400" />
                      </div>
                      <div className="flex justify-between items-start gap-4 mb-1">
                        <span className="text-[10px] font-bold text-white">{log.title}</span>
                        <span className="text-[9px] font-mono text-void-500">{log.date}</span>
                      </div>
                      <p className="text-[10px] text-void-400 leading-normal">{log.findings}</p>
                    </div>
                  ))}
                </div>
              </div>
            ) : null}
          </div>

          {/* Knowledge Graph Neighborhood Visualizer */}
          <div className="glass-card p-6 flex flex-col h-[520px]">
            <div className="flex items-center gap-2 mb-4 pb-4 border-b border-void-600/10">
              <Network className="w-4 h-4 text-neon-cyan-400" />
              <h3 className="font-display font-bold text-white text-sm">Knowledge Graph Node</h3>
            </div>
            
            <p className="text-void-400 text-xs leading-normal mb-6">
              Visualizes Adjacent semantic relationships (procedures, manual chapters, previous logs) grounded in Neo4j index schema.
            </p>

            <div className="flex-grow bg-void-900/40 rounded-xl border border-void-600/10 relative flex items-center justify-center p-4 overflow-hidden">
              {/* Mock Knowledge Graph SVG */}
              <svg className="w-full h-full min-h-[220px]" viewBox="0 0 200 200">
                {/* Connection lines */}
                <line x1="100" y1="100" x2="40" y2="60" stroke="rgba(0, 242, 255, 0.4)" strokeWidth="1" />
                <line x1="100" y1="100" x2="160" y2="60" stroke="rgba(0, 242, 255, 0.4)" strokeWidth="1" />
                <line x1="100" y1="100" x2="40" y2="140" stroke="rgba(139, 92, 246, 0.4)" strokeWidth="1" />
                <line x1="100" y1="100" x2="160" y2="140" stroke="rgba(34, 197, 94, 0.4)" strokeWidth="1" />

                {/* Central Asset node */}
                <circle cx="100" cy="100" r="16" fill="#040712" stroke="#00f2ff" strokeWidth="1.5" />
                <text x="100" y="103" textAnchor="middle" fill="#fff" fontSize="8" fontWeight="bold" fontFamily="monospace">{selectedAsset}</text>

                {/* Satellite nodes */}
                {/* Node 1: OEM Manual */}
                <circle cx="40" cy="60" r="10" fill="#040712" stroke="#0066ff" strokeWidth="1.2" />
                <text x="40" y="63" textAnchor="middle" fill="#0066ff" fontSize="6" fontWeight="bold" fontFamily="sans-serif">MAN</text>
                <text x="40" y="47" textAnchor="middle" fill="#4a5c9e" fontSize="5" fontWeight="bold" fontFamily="monospace">OEM Manual</text>

                {/* Node 2: Emergency SOP */}
                <circle cx="160" cy="60" r="10" fill="#040712" stroke="#00f2ff" strokeWidth="1.2" />
                <text x="160" y="63" textAnchor="middle" fill="#00f2ff" fontSize="6" fontWeight="bold" fontFamily="sans-serif">SOP</text>
                <text x="160" y="47" textAnchor="middle" fill="#4a5c9e" fontSize="5" fontWeight="bold" fontFamily="monospace">Safety SOP</text>

                {/* Node 3: Work Order */}
                <circle cx="40" cy="140" r="10" fill="#040712" stroke="#8b5cf6" strokeWidth="1.2" />
                <text x="40" y="143" textAnchor="middle" fill="#8b5cf6" fontSize="6" fontWeight="bold" fontFamily="sans-serif">WO</text>
                <text x="40" y="157" textAnchor="middle" fill="#4a5c9e" fontSize="5" fontWeight="bold" fontFamily="monospace">Lube Change WO</text>

                {/* Node 4: Inspection */}
                <circle cx="160" cy="140" r="10" fill="#040712" stroke="#22c55e" strokeWidth="1.2" />
                <text x="160" y="143" textAnchor="middle" fill="#22c55e" fontSize="6" fontWeight="bold" fontFamily="sans-serif">INS</text>
                <text x="160" y="157" textAnchor="middle" fill="#4a5c9e" fontSize="5" fontWeight="bold" fontFamily="monospace">Vibration Rec</text>
              </svg>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
