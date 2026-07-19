import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Activity, Bot, Sliders, Languages, ClipboardList, ShieldAlert, Send } from 'lucide-react';

export const LiveSandbox: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'copilot' | 'telemetry' | 'translator' | 'work_orders' | 'admin'>('copilot');
  const [chatMessages, setChatMessages] = useState([
    { sender: 'assistant', text: 'Welcome to Plant Lusail! I am StadiumMind PS8.', timestamp: '12:04 PM' }
  ]);
  const [userQuery, setUserQuery] = useState('');

  const handleChatSubmit = (query: string) => {
    if (!query.trim()) return;
    setChatMessages([...chatMessages, { sender: 'user', text: query, timestamp: 'Now' }]);
    setUserQuery('');
    setTimeout(() => {
      setChatMessages(prev => [...prev, { sender: 'assistant', text: 'Searching OEM manuals... C-204 lube oil specifications require ISO VG 32 synthetic fluid.', timestamp: 'Now' }]);
    }, 1000);
  };

  return (
    <section id="sandbox" className="w-full bg-void-950/40 border-y border-void-600/20 py-20 px-6 relative">
      <div className="max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-void-800 border border-void-600/30 text-[11px] font-mono text-neon-cyan-400 uppercase tracking-wider mb-4">
            <Activity className="w-3.5 h-3.5" />
            Live Operational Simulator
          </div>
          <h2 className="font-display font-bold text-void-50 mb-4 tracking-tight text-3xl sm:text-4xl">
            Experience the Control Dashboard
          </h2>
          <p className="text-void-400 text-sm">
            Interact with the sandbox modules below to see how our AI engine responds to real-time events.
          </p>
        </div>

        <div className="w-full bg-void-850/80 border border-void-600/40 rounded-2xl overflow-hidden shadow-elevation-high flex flex-col">
          <div className="bg-void-950 border-b border-void-600/40 px-6 py-4 flex flex-wrap justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="flex gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500/40" />
                <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/40" />
                <span className="w-2.5 h-2.5 rounded-full bg-green-500/40" />
              </div>
              <span className="text-[10px] font-mono text-void-500 ml-3">plant_brain_sim.sh</span>
            </div>

            <div className="flex items-center gap-1 bg-void-900 p-1 rounded-xl border border-void-600/30">
              {(['copilot', 'telemetry', 'translator', 'work_orders', 'admin'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase transition-all ${activeTab === tab ? 'bg-void-800 text-white' : 'text-void-500 hover:text-white'}`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          <div className="min-h-[400px] bg-void-900/50 p-6">
            {activeTab === 'copilot' && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="space-y-4 h-[350px] flex flex-col">
                  <div className="flex-grow overflow-y-auto space-y-4 pr-2 custom-scrollbar">
                    {chatMessages.map((msg, i) => (
                      <div key={i} className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}>
                        <div className={`p-3 rounded-xl text-xs ${msg.sender === 'user' ? 'bg-neon-blue-600' : 'bg-void-800 border border-void-600/30'}`}>
                          {msg.text}
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <input 
                      type="text" 
                      value={userQuery}
                      onChange={(e) => setUserQuery(e.target.value)}
                      className="flex-grow bg-void-950 border border-void-600/30 rounded-xl px-4 py-2 text-xs text-white focus:outline-none"
                      placeholder="Ask plant copilot..."
                    />
                    <button 
                      onClick={() => handleChatSubmit(userQuery)}
                      className="p-2 bg-neon-blue-600 rounded-xl"
                    >
                      <Send className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <div className="bg-void-950 rounded-2xl border border-void-600/30 p-8 flex items-center justify-center relative overflow-hidden">
                   <div className="absolute inset-0 bg-void-900/20 cyber-grid opacity-20" />
                   <div className="w-48 h-48 rounded-full border-2 border-void-600/40 relative flex items-center justify-center">
                      <div className="absolute inset-0 rounded-full border border-neon-blue-500/10 animate-ping" />
                      <div className="w-12 h-12 rounded-lg bg-void-800 border border-void-700 flex items-center justify-center">
                        <Bot className="w-6 h-6 text-neon-cyan-500" />
                      </div>
                   </div>
                </div>
              </div>
            )}
            {activeTab !== 'copilot' && (
              <div className="flex items-center justify-center h-[350px] text-void-500 font-mono text-xs uppercase tracking-widest">
                Simulation Module: {activeTab} is currently in restricted mode for demo.
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
