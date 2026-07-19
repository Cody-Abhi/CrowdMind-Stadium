import React, { useState, Suspense, lazy } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sidebar } from './DashboardShellComponents/Sidebar';
import { Header } from './DashboardShellComponents/Header';
import { AIPanel } from './DashboardShellComponents/AIPanel';
import { StadiumMap } from './DashboardShellComponents/StadiumMap';
import { ExecutiveDashboard } from './ExecutiveDashboard';
import { useAuth } from '../contexts/AuthContext';

const FanDashboard = lazy(() => import('./FanDashboard'));
const MissionControl = lazy(() => import('./MissionControl'));
const FirebaseConsole = lazy(() => import('./FirebaseConsole'));

import { VolunteerBoard, SignageTranslator, BroadcastCenter, AuditLogs, CrowdAnalytics } from './ExtraModules';

interface DashboardShellProps {
  onBackToLanding: () => void;
}

export const DashboardShell: React.FC<DashboardShellProps> = ({ onBackToLanding }) => {
  const { userProfile, updateUserRole } = useAuth();
  const [activeMenuTab, setActiveMenuTab] = useState('executive');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isAiPanelOpen, setIsAiPanelOpen] = useState(false);
  const [isNotificationCenterOpen, setIsNotificationCenterOpen] = useState(false);
  const [simulationActive, setSimulationActive] = useState(false);
  const [notifications, setNotifications] = useState([
    { id: '1', type: 'critical', message: 'Gate D ingress threshold exceeded (4,200 PAX/min)', time: '2 mins ago', read: false },
    { id: '2', type: 'warning', message: 'Linguistic model update required for Sector North East', time: '10 mins ago', read: false },
    { id: '3', type: 'info', message: 'Shift change protocol initiated for Volunteer Unit 7', time: '1 hour ago', read: true },
  ]);

  const [aiChat, setAiChat] = useState([
    { sender: 'ai', text: 'Stadium Operating System v4.0 Online. Intelligence Mesh ready for command.' }
  ]);
  const [aiInput, setAiInput] = useState('');
  const [isAiThinking, setIsAiThinking] = useState(false);

  const triggerRushSimulation = () => {
    setSimulationActive(true);
    setNotifications(prev => [
      { id: Date.now().toString(), type: 'critical', message: 'SIMULATION: Extreme crowd pressure detected at Metro Entrance A', time: 'Just now', read: false },
      ...prev
    ]);
  };

  const resetSimulation = () => {
    setSimulationActive(false);
    setNotifications([]);
  };

  const handleAiSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiInput.trim()) return;
    
    const userMsg = aiInput;
    setAiChat(p => [...p, { sender: 'user', text: userMsg }]);
    setAiInput('');
    setIsAiThinking(true);

    try {
      const response = await fetch('/api/gemini/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          message: userMsg,
          history: aiChat.map(m => ({ 
            role: m.sender === 'user' ? 'user' : 'model',
            parts: [{ text: m.text }]
          })),
          context: {
            role: userProfile?.role || 'fan',
            alertsCount: notifications.filter(n => !n.read).length,
            time: new Date().toISOString()
          }
        })
      });
      
      const data = await response.json();
      if (data.error) throw new Error(data.error);
      
      setAiChat(p => [...p, { sender: 'ai', text: data.text }]);
    } catch (err) {
      console.error("AI Error:", err);
      setAiChat(p => [...p, { sender: 'ai', text: "Neural link interrupted. Retrying spatial sync..." }]);
    } finally {
      setIsAiThinking(false);
    }
  };

  const renderActivePanel = () => {
    switch (activeMenuTab) {
      case 'executive': return <ExecutiveDashboard simulationActive={simulationActive} />;
      case 'fan-hub': return <Suspense fallback={<PanelSkeleton />}><FanDashboard /></Suspense>;
      case 'overview': return (
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 h-full min-h-[700px]">
           <div className="xl:col-span-2">
              <StadiumMap simulationActive={simulationActive} />
           </div>
           <div>
              <Suspense fallback={<PanelSkeleton />}><MissionControl simulationActive={simulationActive} /></Suspense>
           </div>
        </div>
      );
      case 'firebase': return <Suspense fallback={<PanelSkeleton />}><FirebaseConsole /></Suspense>;
      case 'volunteers': return <VolunteerBoard />;
      case 'translations': return <SignageTranslator />;
      case 'broadcast': return <BroadcastCenter />;
      case 'crowds': return <CrowdAnalytics />;
      case 'logs': return <AuditLogs />;
      default: return <PanelSkeleton />;
    }
  };

  return (
    <div className="flex h-screen bg-void-950 text-void-50 overflow-hidden font-sans selection:bg-neon-blue-500/30">
      <Sidebar 
        isSidebarCollapsed={isSidebarCollapsed}
        setIsSidebarCollapsed={setIsSidebarCollapsed}
        activeMenuTab={activeMenuTab}
        setActiveMenuTab={setActiveMenuTab}
        userProfile={userProfile}
        updateUserRole={updateUserRole}
      />

      <div className="flex-grow flex flex-col min-w-0 relative">
        <Header 
          setIsMobileSidebarOpen={setIsMobileSidebarOpen}
          triggerRushSimulation={triggerRushSimulation}
          resetSimulation={resetSimulation}
          isNotificationCenterOpen={isNotificationCenterOpen}
          setIsNotificationCenterOpen={setIsNotificationCenterOpen}
          notifications={notifications}
          setNotifications={setNotifications}
          isAiPanelOpen={isAiPanelOpen}
          setIsAiPanelOpen={setIsAiPanelOpen}
          onBackToLanding={onBackToLanding}
        />

        <main className="flex-grow overflow-y-auto p-6 lg:p-8 custom-scrollbar bg-void-950 relative">
          {/* Subtle Ambient Glow */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-neon-blue-500/[0.03] blur-[120px] pointer-events-none" />
          
          <div className="max-w-[1600px] mx-auto h-full relative z-10">
            {renderActivePanel()}
          </div>
        </main>

        <AIPanel 
          aiChat={aiChat}
          aiInput={aiInput}
          setAiInput={setAiInput}
          isAiThinking={isAiThinking}
          handleAiSend={handleAiSend}
          isOpen={isAiPanelOpen}
          setIsOpen={setIsAiPanelOpen}
        />
      </div>
    </div>
  );
};

const PanelSkeleton = () => (
  <div className="w-full h-full animate-pulse space-y-6">
    <div className="h-12 bg-white/5 rounded-2xl w-1/4" />
    <div className="grid grid-cols-3 gap-6">
      <div className="h-48 bg-white/5 rounded-2xl" />
      <div className="h-48 bg-white/5 rounded-2xl" />
      <div className="h-48 bg-white/5 rounded-2xl" />
    </div>
    <div className="h-96 bg-white/5 rounded-2xl w-full" />
  </div>
);

export default DashboardShell;
