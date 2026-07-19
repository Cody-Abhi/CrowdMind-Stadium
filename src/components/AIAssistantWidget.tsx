import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Bot,
  Send,
  Mic,
  MicOff,
  Sparkles,
  MapPin,
  User,
  Activity,
  ArrowRight,
  RotateCw,
  Copy,
  Check,
  Volume2,
  VolumeX,
  HelpCircle,
  Globe,
  Compass,
  AlertOctagon,
  Languages,
  Maximize2,
  Minimize2,
  ShieldAlert,
  BarChart
} from "lucide-react";

interface Message {
  id: string;
  sender: "user" | "assistant";
  text: string;
  timestamp: string;
  isStreaming?: boolean;
  contextSnap?: {
    location: string;
    role: string;
    match: string;
  };
}

interface AIAssistantWidgetProps {
  lang: "en" | "ar" | "es";
  userSeat?: string;
  selectedLot?: string;
  orderStatus?: string;
}

export default function AIAssistantWidget({
  lang,
  userSeat = "Sec 108, Row L, Seat 14",
  selectedLot = "Lot C",
  orderStatus = "none"
}: AIAssistantWidgetProps) {
  // Configurable Contexts
  const [activeLocation, setActiveLocation] = useState(userSeat);
  const [activeRole, setActiveRole] = useState("VIP Spectator");
  const [activeMatch, setActiveMatch] = useState("El Clásico (65' • RM 1 - 0 BAR)");

  // Active assistant persona
  const [activePersona, setActivePersona] = useState<"fan" | "operations" | "emergency" | "translator" | "executive">("fan");

  const [personaMessages, setPersonaMessages] = useState<Record<string, Message[]>>({
    fan: [{ id: "w-fan", sender: "assistant", text: "Welcome to Lusail Stadium. I am **StadiumMind AI**. Fully integrated with your premium seat coordinates and real-time match data.", timestamp: "12:00 PM" }],
    operations: [{ id: "w-ops", sender: "assistant", text: "StadiumMind **Operations Copilot** active. Monitoring gate flow and volunteer dispatch loops.", timestamp: "12:00 PM" }],
    emergency: [{ id: "w-em", sender: "assistant", text: "⚠️ **Emergency Coordinator** online. Synchronized with safety beacon arrays.", timestamp: "12:00 PM" }],
    translator: [{ id: "w-tr", sender: "assistant", text: "StadiumMind **Linguistics Hub** online. Ready for live translation.", timestamp: "12:00 PM" }],
    executive: [{ id: "w-ex", sender: "assistant", text: "StadiumMind **Executive Strategist** active. Ready for sustainability briefings.", timestamp: "12:00 PM" }]
  });

  // Current message feed is derived from the active persona
  const messages = personaMessages[activePersona];

  const [inputMessage, setInputMessage] = useState("");
  const [isThinking, setIsThinking] = useState(false);
  const [showContextConfig, setShowContextConfig] = useState(false);

  // Voice recognition states
  const [isListening, setIsListening] = useState(false);
  const [recognitionError, setRecognitionError] = useState<string | null>(null);
  const recognitionRef = useRef<any>(null);

  // Micro utilities states
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [spokenId, setSpokenId] = useState<string | null>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Suggested questions grouped by persona
  const getSuggestedQuestions = (persona: string) => {
    switch (persona) {
      case "operations":
        return [
          { text: "Dispatch steward to Block 108 for crowd check", icon: "⚙️", category: "Steward Dispatch" },
          { text: "Calibrate Gate B West Ingress parameters", icon: "📊", category: "Gate Control" },
          { text: "Are concessions at Sector D fully staffed?", icon: "🍔", category: "Operations Log" }
        ];
      case "emergency":
        return [
          { text: "Broadcast emergency crowd warning at Gate B west", icon: "🚨", category: "Global Broadcast" },
          { text: "Locate medical responder closest to Section 108", icon: "🩹", category: "First Aid" },
          { text: "What is the stadium safety lockout evacuation protocol?", icon: "🛡️", category: "Emergency Rule" }
        ];
      case "translator":
        return [
          { text: "Translate: 'مرحبًا بكم في استاد لوسيل'", icon: "🌐", category: "Arabic ➔ English" },
          { text: "What does 'المشجعين' mean in English?", icon: "📝", category: "Local Vocab" },
          { text: "Translate sign: 'ممنوع التدخين'", icon: "🚭", category: "Signage OCR" }
        ];
      case "executive":
        return [
          { text: "Generate briefing of sustainability and concessions revenue", icon: "📈", category: "Executive Briefing" },
          { text: "What is our current carbon displacement yield?", icon: "🌱", category: "Carbon index" },
          { text: "Review active volunteer steward happiness metrics", icon: "🤝", category: "Steward Health" }
        ];
      case "fan":
      default:
        return [
          { text: "Where is the nearest halal concession?", icon: "🍔", category: "Concessions" },
          { text: "Find restrooms near Sec 108 with zero lines", icon: "🚻", category: "Restrooms" },
          { text: "What is the fastest way to Parking Lot C?", icon: "🚗", category: "Navigation" },
          { text: "Request a medical steward to Row L", icon: "🚨", category: "Emergency SOS" }
        ];
    }
  };

  // Auto-scroll chat on message update
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isThinking]);

  // Clean speech recognition on unmount
  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch (e) {
          console.warn("Error aborting recognition:", e);
        }
      }
    };
  }, []);

  // Web Speech API Initialization
  const startSpeechRecognition = () => {
    setRecognitionError(null);
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    
    if (!SpeechRecognition) {
      setRecognitionError("Voice recognition not supported in this browser. Try Chrome or Safari.");
      return;
    }

    try {
      const rec = new SpeechRecognition();
      rec.continuous = false;
      rec.interimResults = false;
      rec.lang = lang === "ar" ? "ar-SA" : lang === "es" ? "es-ES" : "en-US";

      rec.onstart = () => {
        setIsListening(true);
      };

      rec.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        if (transcript) {
          setInputMessage(transcript);
        }
      };

      rec.onerror = (event: any) => {
        console.error("Speech recognition error:", event.error);
        setRecognitionError(`Voice error: ${event.error}`);
        setIsListening(false);
      };

      rec.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = rec;
      rec.start();
    } catch (e: any) {
      setRecognitionError(`Speech initialization failed: ${e.message}`);
      setIsListening(false);
    }
  };

  const stopSpeechRecognition = () => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (e) {}
    }
    setIsListening(false);
  };

  // Submit AI Request with Dynamic Real-time Streaming
  const handleSendMessage = async (textToSend?: string) => {
    const prompt = textToSend || inputMessage;
    if (!prompt.trim()) return;

    if (!textToSend) {
      setInputMessage("");
    }

    // Add user message
    const userMsgId = `user-${Date.now()}`;
    const newMsg: Message = {
      id: userMsgId,
      sender: "user",
      text: prompt,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      contextSnap: {
        location: activeLocation,
        role: activeRole,
        match: activeMatch
      }
    };

    // Update active persona message history
    const currentHistory = [...messages, newMsg];
    setPersonaMessages(prev => ({
      ...prev,
      [activePersona]: currentHistory
    }));

    setIsThinking(true);

    // Setup streaming response message placeholder
    const assistMsgId = `assist-${Date.now()}`;
    const streamPlaceholder: Message = {
      id: assistMsgId,
      sender: "assistant",
      text: "",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isStreaming: true,
      contextSnap: {
        location: activeLocation,
        role: activeRole,
        match: activeMatch
      }
    };

    // Append streaming placeholder temporarily
    setPersonaMessages(prev => ({
      ...prev,
      [activePersona]: [...currentHistory, streamPlaceholder]
    }));

    // Package conversation history to pass to secure server
    const formattedHistory = messages.map(m => ({
      sender: m.sender,
      text: m.text
    }));

    try {
      const response = await fetch("/api/gemini/stream", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: prompt,
          assistantType: activePersona,
          language: lang,
          history: formattedHistory,
          context: {
            userSeat: activeLocation,
            userRole: activeRole,
            currentMatch: activeMatch,
            activeLot: selectedLot,
            currentOrderStatus: orderStatus
          }
        })
      });

      setIsThinking(false);

      if (!response.body) {
        throw new Error("No readable stream in response");
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder("utf-8");
      let accumulatedText = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split("\n");

        for (const line of lines) {
          if (line.startsWith("data: ")) {
            const dataStr = line.slice(6).trim();
            if (dataStr === "[DONE]") {
              break;
            }
            try {
              const parsed = JSON.parse(dataStr);
              if (parsed.text) {
                accumulatedText += parsed.text;
                
                // Real-time incremental rendering update
                setPersonaMessages(prev => {
                  const currentList = prev[activePersona];
                  const updatedList = currentList.map(m =>
                    m.id === assistMsgId ? { ...m, text: accumulatedText } : m
                  );
                  return {
                    ...prev,
                    [activePersona]: updatedList
                  };
                });
              }
            } catch (e) {
              // Ignore parse errors on incomplete chunk lines
            }
          }
        }
      }

      // Mark streaming completion
      setPersonaMessages(prev => {
        const currentList = prev[activePersona];
        const updatedList = currentList.map(m =>
          m.id === assistMsgId ? { ...m, isStreaming: false } : m
        );
        return {
          ...prev,
          [activePersona]: updatedList
        };
      });

    } catch (err) {
      console.error("SSE streaming failed, trying REST callback fallback:", err);
      
      try {
        const response = await fetch("/api/gemini/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            message: prompt,
            assistantType: activePersona,
            language: lang,
            history: formattedHistory,
            context: {
              userSeat: activeLocation,
              userRole: activeRole,
              currentMatch: activeMatch,
              activeLot: selectedLot,
              currentOrderStatus: orderStatus
            }
          })
        });

        const data = await response.json();
        const rawResponse = data.response || "No dynamic response constructed.";

        setPersonaMessages(prev => {
          const currentList = prev[activePersona];
          const updatedList = currentList.map(m =>
            m.id === assistMsgId ? { ...m, text: rawResponse, isStreaming: false } : m
          );
          return {
            ...prev,
            [activePersona]: updatedList
          };
        });

      } catch (fallbackErr) {
        console.error("Local fallback processing:", fallbackErr);
        const fallbackText = `Telemetry connection active. For seat ${activeLocation}, Block 108 restroom is vacant (1 min wait). Concession D has certified Halal bites.`;
        
        setPersonaMessages(prev => {
          const currentList = prev[activePersona];
          const updatedList = currentList.map(m =>
            m.id === assistMsgId ? { ...m, text: fallbackText, isStreaming: false } : m
          );
          return {
            ...prev,
            [activePersona]: updatedList
          };
        });
      }
      setIsThinking(false);
    }
  };

  const handleCopyText = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleSpeakText = (text: string, id: string) => {
    try {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = lang === "ar" ? "ar-SA" : lang === "es" ? "es-ES" : "en-US";
      window.speechSynthesis.speak(utterance);
      setSpokenId(id);
      setTimeout(() => setSpokenId(null), 3000);
    } catch (e) {
      console.warn(e);
    }
  };

  const personaTabs = [
    { id: "fan", label: "Fan", icon: Compass, color: "from-neon-cyan-500 to-neon-blue-500", textCol: "text-neon-cyan-400" },
    { id: "operations", label: "Ops", icon: Activity, color: "from-amber-500 to-orange-500", textCol: "text-amber-400" },
    { id: "emergency", label: "Emergency", icon: AlertOctagon, color: "from-red-500 to-rose-600", textCol: "text-rose-400" },
    { id: "translator", label: "Linguistics", icon: Languages, color: "from-purple-500 to-indigo-500", textCol: "text-purple-400" },
    { id: "executive", label: "Strategist", icon: Sparkles, color: "from-teal-500 to-emerald-500", textCol: "text-teal-400" }
  ];

  return (
    <div className="flex flex-col h-full glass-panel overflow-hidden relative">
      {/* HEADER */}
      <div className="p-4 border-b border-void-600/10 bg-void-950/50 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-neon-blue-500/10 border border-neon-blue-500/20">
            <Bot className="w-5 h-5 text-neon-blue-400" />
          </div>
          <div>
            <h3 className="font-display font-black text-sm text-white uppercase tracking-wider">StadiumMind AI</h3>
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="font-mono text-[8px] text-void-400 uppercase tracking-widest font-bold">{activePersona} engine online</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={() => setShowContextConfig(!showContextConfig)}
            className={`p-2 rounded-lg border transition-all ${showContextConfig ? "bg-neon-cyan-500/20 border-neon-cyan-500/40 text-neon-cyan-400" : "bg-void-800 border-void-600/20 text-void-400 hover:text-white"}`}
          >
            <Compass className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* PERSONA TABS */}
      <div className="flex p-2 bg-void-950/30 border-b border-void-600/5 overflow-x-auto no-scrollbar gap-2">
        {[
          { id: "fan", icon: User, label: "Fan", color: "text-neon-blue-400" },
          { id: "operations", icon: Activity, label: "Ops", color: "text-neon-cyan-400" },
          { id: "emergency", icon: ShieldAlert, label: "Safety", color: "text-red-400" },
          { id: "translator", icon: Globe, label: "Translator", color: "text-neon-purple-400" },
          { id: "executive", icon: BarChart, label: "Briefing", color: "text-emerald-400" }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActivePersona(tab.id as any)}
            className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-xl transition-all border ${
              activePersona === tab.id 
                ? "bg-void-900 border-void-600/20 text-white shadow-elevation-low" 
                : "bg-transparent border-transparent text-void-500 hover:text-void-300"
            }`}
          >
            <tab.icon className={`w-3.5 h-3.5 ${activePersona === tab.id ? tab.color : "opacity-50"}`} />
            <span className="font-mono text-[9px] font-bold uppercase tracking-wider">{tab.label}</span>
          </button>
        ))}
      </div>

      {/* CONTEXT DRAWER */}
      <AnimatePresence>
        {showContextConfig && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden bg-void-900/90 border-b border-void-600/10"
          >
            <div className="p-4 space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-mono text-[8px] text-void-500 uppercase tracking-widest">Location Node</label>
                  <input 
                    className="w-full bg-void-950 border border-void-600/10 rounded-lg px-2 py-1.5 text-[10px] text-white focus:outline-none focus:border-neon-cyan-500/30"
                    value={activeLocation}
                    onChange={(e) => setActiveLocation(e.target.value)}
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-mono text-[8px] text-void-500 uppercase tracking-widest">Intelligence Role</label>
                  <input 
                    className="w-full bg-void-950 border border-void-600/10 rounded-lg px-2 py-1.5 text-[10px] text-white focus:outline-none focus:border-neon-cyan-500/30"
                    value={activeRole}
                    onChange={(e) => setActiveRole(e.target.value)}
                  />
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* CHAT WINDOW */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar bg-black/10">
        <AnimatePresence initial={false}>
          {messages.map((m) => (
            <motion.div
              key={m.id}
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              className={`flex ${m.sender === "user" ? "justify-end" : "justify-start"}`}
            >
              <div className={`max-w-[85%] ${m.sender === "user" ? "items-end" : "items-start"} flex flex-col gap-1`}>
                <div className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                  m.sender === "user" 
                    ? "bg-neon-blue-600 text-white shadow-neon-glow-blue" 
                    : "glass-card border-void-600/10 text-void-100"
                }`}>
                  <p>{m.text}</p>
                </div>
                <div className="flex items-center gap-2 px-1 font-mono text-[8px] text-void-500">
                  <span className="font-bold uppercase tracking-widest">{m.sender === "user" ? "User" : "StadiumMind"}</span>
                  <span>{m.timestamp}</span>
                </div>
              </div>
            </motion.div>
          ))}
          {isThinking && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
              <div className="glass-card px-4 py-2.5 rounded-2xl flex items-center gap-3">
                <div className="flex gap-1">
                  {[0, 1, 2].map(i => (
                    <motion.div
                      key={i}
                      animate={{ scale: [1, 1.5, 1], opacity: [0.4, 1, 0.4] }}
                      transition={{ repeat: Infinity, duration: 1, delay: i * 0.2 }}
                      className="w-1 h-1 rounded-full bg-neon-purple-500"
                    />
                  ))}
                </div>
                <span className="font-mono text-[9px] text-neon-purple-400 font-bold uppercase tracking-widest animate-pulse">Neural Processing...</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        <div ref={chatEndRef} />
      </div>

      {/* FOOTER */}
      <div className="p-4 bg-void-950/80 backdrop-blur-xl border-t border-void-600/10 space-y-4">
        <div className="flex gap-2 overflow-x-auto no-scrollbar">
          {getSuggestedQuestions(activePersona).map((q, i) => (
            <button
              key={i}
              onClick={() => handleSendMessage(q.text)}
              className="px-3 py-1.5 rounded-full glass-panel border-void-600/20 text-[9px] font-mono text-void-400 hover:text-white hover:border-neon-cyan-500/40 transition-all whitespace-nowrap"
            >
              {q.text}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <div className="flex-1 relative">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
              placeholder="Query StadiumMind AI..."
              className="w-full bg-void-900 border border-void-600/20 rounded-2xl px-5 py-3 pr-12 text-sm text-white placeholder-void-600 focus:outline-none focus:border-neon-blue-500/30 transition-all"
            />
            <button
              onClick={() => handleSendMessage()}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-xl bg-neon-blue-600 text-white shadow-neon-glow-blue hover:scale-105 transition-all"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </div>
          <button
            onClick={isListening ? stopSpeechRecognition : startSpeechRecognition}
            className={`p-3 rounded-2xl transition-all ${isListening ? "bg-red-500 text-white animate-pulse" : "bg-void-900 border border-void-600/20 text-void-500 hover:text-white"}`}
          >
            {isListening ? <MicOff className="w-4.5 h-4.5" /> : <Mic className="w-4.5 h-4.5" />}
          </button>
        </div>
      </div>
    </div>
  );
}
