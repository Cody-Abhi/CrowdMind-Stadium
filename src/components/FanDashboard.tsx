import React, { useState, useEffect } from "react";
import { Languages, Volume2, VolumeX, Accessibility, Wifi } from "lucide-react";

// Hooks
import { useRagChat } from "../hooks/useRagChat";
import { useEmergencyInhibit } from "../hooks/useEmergencyInhibit";
import { useAssetTelemetry } from "../hooks/useAssetTelemetry";

// Sub-components
import { CopilotChat } from "./FanDashboardComponents/CopilotChat";
import { AssetRegistry } from "./FanDashboardComponents/AssetRegistry";
import { KnowledgeGraphView } from "./FanDashboardComponents/KnowledgeGraphView";
import { EmergencyInhibit } from "./FanDashboardComponents/EmergencyInhibit";
import { DocumentList } from "./FanDashboardComponents/DocumentList";

interface FanDashboardProps {
  onAddStewardTask: (task: { title: string; zone: string; urgency: string }) => void;
  broadcastHistory: string[];
}

export const FanDashboard: React.FC<FanDashboardProps> = ({ 
  onAddStewardTask 
}) => {
  const [activeTab, setActiveTab] = useState<"copilot" | "assets">("copilot");
  const [lang, setLang] = useState<"en" | "ar" | "es">("en");
  const [voiceActive, setVoiceActive] = useState(false);
  const [offlineMode, setOfflineMode] = useState(false);

  // Custom Hooks
  const {
    chatLog,
    chatInput,
    setChatInput,
    isAiThinking,
    handleSendQuery
  } = useRagChat();

  const {
    selectedAsset,
    setSelectedAsset,
    assetHistory,
    loadingHistory,
    error: assetError
  } = useAssetTelemetry();

  const handleTriggerEmergency = () => {
    onAddStewardTask({
      title: "🚨 PLANT SHUTDOWN ALERT: Core manual sequence initiated from Sector E.",
      zone: "Sector E Compressor Pad",
      urgency: "high"
    });
  };

  const {
    isActivating,
    progress,
    startActivation,
    cancelActivation
  } = useEmergencyInhibit({ onTrigger: handleTriggerEmergency });

  // Sync language / direction attributes to HTML root (Accessibility & Multilingual Support)
  useEffect(() => {
    const root = document.documentElement;
    root.setAttribute('lang', lang);
    if (lang === 'ar') {
      root.setAttribute('dir', 'rtl');
    } else {
      root.setAttribute('dir', 'ltr');
    }
  }, [lang]);

  const onSendQuerySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSendQuery();
  };

  return (
    <div className="space-y-6">
      {/* Top Options Panel */}
      <div className="flex flex-wrap justify-between items-center bg-void-850/80 border border-void-600/20 p-4 rounded-2xl gap-4">
        <div className="flex gap-2" role="tablist" aria-label="Explorer tabs">
          <button
            role="tab"
            aria-selected={activeTab === "copilot"}
            onClick={() => setActiveTab("copilot")}
            className={`px-4 py-2 rounded-xl text-xs font-bold uppercase transition-all cursor-pointer ${
              activeTab === "copilot" 
                ? "bg-neon-blue-600 text-white shadow-neon-glow-blue" 
                : "text-void-400 hover:text-white"
            }`}
          >
            Ask Copilot (RAG)
          </button>
          <button
            role="tab"
            aria-selected={activeTab === "assets"}
            onClick={() => setActiveTab("assets")}
            className={`px-4 py-2 rounded-xl text-xs font-bold uppercase transition-all cursor-pointer ${
              activeTab === "assets" 
                ? "bg-neon-cyan-600 text-white shadow-neon-glow-cyan" 
                : "text-void-400 hover:text-white"
            }`}
          >
            Asset explorer
          </button>
        </div>

        {/* Global toggles */}
        <div className="flex items-center gap-4 text-xs font-mono">
          <button
            onClick={() => setOfflineMode(!offlineMode)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border transition-colors cursor-pointer ${
              offlineMode 
                ? 'bg-state-danger-bg/20 border-state-danger-text/40 text-state-danger-text' 
                : 'bg-void-900 border-void-600/30 text-void-400 hover:border-void-500'
            }`}
            aria-label={`Toggle offline storage mode. Current status: ${offlineMode ? 'offline' : 'online'}`}
          >
            <Wifi className="w-3.5 h-3.5" aria-hidden="true" />
            <span>{offlineMode ? 'OFFLINE LOCAL STORAGE' : 'ONLINE MESH'}</span>
          </button>
          
          <button
            onClick={() => setVoiceActive(!voiceActive)}
            className={`p-2 rounded-lg border transition-colors cursor-pointer ${
              voiceActive 
                ? 'bg-neon-cyan-500/20 border-neon-cyan-500/40 text-neon-cyan-400 shadow-neon-glow-cyan' 
                : 'bg-void-900 border-void-600/30 text-void-400 hover:border-void-500'
            }`}
            title="Toggle assist audio voice"
            aria-label={`Toggle assist audio voice. Status: ${voiceActive ? 'active' : 'inactive'}`}
            aria-pressed={voiceActive}
          >
            {voiceActive ? <Volume2 className="w-4 h-4" aria-hidden="true" /> : <VolumeX className="w-4 h-4" aria-hidden="true" />}
          </button>

          <div className="flex items-center gap-1.5">
            <Languages className="w-4 h-4 text-void-400" aria-hidden="true" />
            <select
              value={lang}
              onChange={(e) => setLang(e.target.value as "en" | "ar" | "es")}
              className="bg-void-900 border border-void-600/30 rounded-lg px-2.5 py-1 text-white focus:outline-none focus:border-neon-blue-500 text-xs cursor-pointer"
              aria-label="Select interface language"
            >
              <option value="en">English</option>
              <option value="ar">العربية (Arabic)</option>
              <option value="es">Español</option>
            </select>
          </div>
        </div>
      </div>

      {activeTab === "copilot" ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <CopilotChat 
            chatLog={chatLog}
            chatInput={chatInput}
            setChatInput={setChatInput}
            isAiThinking={isAiThinking}
            onSendQuery={onSendQuerySubmit}
          />

          <div className="space-y-6">
            <EmergencyInhibit 
              isActivating={isActivating}
              progress={progress}
              startActivation={startActivation}
              cancelActivation={cancelActivation}
            />
            <DocumentList />
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <AssetRegistry 
            selectedAsset={selectedAsset}
            setSelectedAsset={setSelectedAsset}
            assetHistory={assetHistory}
            loadingHistory={loadingHistory}
            error={assetError}
          />
          <KnowledgeGraphView selectedAsset={selectedAsset} />
        </div>
      )}
    </div>
  );
};

export default FanDashboard;
