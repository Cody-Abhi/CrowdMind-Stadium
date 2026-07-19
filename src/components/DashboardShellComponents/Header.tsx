import React from 'react';
import { 
  Menu, 
  Bell, 
  Clock, 
  Bot, 
  LogOut, 
  Radio,
  Wifi,
  Cpu,
  X
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface HeaderProps {
  setIsMobileSidebarOpen: (open: boolean) => void;
  triggerRushSimulation: () => void;
  resetSimulation: () => void;
  isNotificationCenterOpen: boolean;
  setIsNotificationCenterOpen: (open: boolean) => void;
  notifications: any[];
  setNotifications: (notifs: any[]) => void;
  isAiPanelOpen: boolean;
  setIsAiPanelOpen: (open: boolean) => void;
  onBackToLanding: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  setIsMobileSidebarOpen,
  triggerRushSimulation,
  resetSimulation,
  isNotificationCenterOpen,
  setIsNotificationCenterOpen,
  notifications,
  setNotifications,
  isAiPanelOpen,
  setIsAiPanelOpen,
  onBackToLanding
}) => {
  const unreadCount = notifications.filter(n => !n.read).length;
  const [currentTime, setCurrentTime] = React.useState(new Date());

  React.useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <header className="sticky top-0 z-40 bg-void-950/60 border-b border-white/5 backdrop-blur-3xl px-6 py-4 flex justify-between items-center h-20 shadow-xl">
      <div className="flex items-center gap-6">
        <button 
          onClick={() => setIsMobileSidebarOpen(true)}
          className="md:hidden p-2.5 rounded-xl text-void-300 hover:text-white hover:bg-white/5 transition-all"
        >
          <Menu className="w-6 h-6" />
        </button>
        
        <div className="flex items-center gap-4">
          <div className="relative flex items-center justify-center">
            <span className="absolute inset-0 rounded-full bg-state-success animate-ping opacity-20" />
            <span className="relative w-2.5 h-2.5 rounded-full bg-state-success shadow-[0_0_10px_rgba(16,185,129,0.8)]" />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-2 mb-1">
              <span className="font-mono text-[9px] text-neon-cyan-500 uppercase tracking-[0.2em] font-bold leading-none">
                CORE_NODE_ACTIVE
              </span>
              <Wifi className="w-2.5 h-2.5 text-neon-blue-500" />
            </div>
            <span className="font-display font-bold text-sm text-void-100 hidden sm:inline tracking-tight">
              LUSAIL_CENTRAL_OS
            </span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-6">
        <div className="hidden xl:flex items-center gap-4 px-5 py-2.5 rounded-2xl bg-white/[0.03] border border-white/5 font-mono text-xs text-white shadow-inner group">
          <div className="flex items-center gap-2">
             <Clock className="w-4 h-4 text-neon-cyan-500 animate-[spin_20s_linear_infinite]" />
             <span className="tracking-[0.1em] font-bold text-neon-blue-400">{currentTime.toISOString().substring(11, 19)}</span>
          </div>
          <div className="w-[1px] h-3 bg-white/10" />
          <div className="flex items-center gap-2 opacity-60">
             <Cpu className="w-3.5 h-3.5 text-neon-purple-500" />
             <span className="text-[10px] font-bold">LATENCY: 12ms</span>
          </div>
        </div>

        <div className="hidden md:flex items-center gap-2">
          <button
            onClick={triggerRushSimulation}
            className="px-4 py-2 rounded-xl bg-void-900 border border-state-danger/30 text-state-danger hover:bg-state-danger/10 text-[10px] font-bold uppercase tracking-widest transition-all cursor-pointer hover:shadow-[0_0_15px_rgba(239,68,68,0.2)]"
          >
            RUSH_SIM
          </button>
          <button
            onClick={resetSimulation}
            className="px-4 py-2 rounded-xl bg-void-900 border border-white/5 text-void-400 hover:text-white hover:bg-white/5 text-[10px] font-bold uppercase tracking-widest transition-all cursor-pointer"
          >
            RESET
          </button>
        </div>

        <div className="h-8 w-[1px] bg-white/5 mx-2" />

        <div className="flex items-center gap-3">
          <div className="relative">
            <button
              onClick={() => setIsNotificationCenterOpen(!isNotificationCenterOpen)}
              className={`p-3 rounded-xl border transition-all relative group ${
                isNotificationCenterOpen 
                  ? 'bg-neon-blue-500/10 border-neon-blue-500/40 text-white shadow-neon-blue' 
                  : 'bg-void-900 border-white/5 text-void-400 hover:text-white hover:border-white/20 shadow-sm'
              }`}
            >
              <Bell className="w-5 h-5 group-hover:scale-110 transition-transform" />
              {unreadCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-neon-magenta-500 text-white font-bold text-[10px] font-mono rounded-full flex items-center justify-center animate-pulse border-2 border-void-950">
                  {unreadCount}
                </span>
              )}
            </button>

            <AnimatePresence>
              {isNotificationCenterOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setIsNotificationCenterOpen(false)} />
                  <motion.div
                    initial={{ opacity: 0, y: 15, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 15, scale: 0.98 }}
                    className="absolute right-0 mt-4 w-96 rounded-3xl bg-void-900/90 border border-white/10 p-6 shadow-[0_32px_64px_-12px_rgba(0,0,0,0.8)] z-50 backdrop-blur-3xl overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-neon-blue-500/5 to-transparent pointer-events-none" />
                    
                    <div className="flex justify-between items-center mb-6 relative z-10">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-neon-magenta-500/10 border border-neon-magenta-500/20 flex items-center justify-center">
                          <Radio className="w-4 h-4 text-neon-magenta-500 animate-pulse" />
                        </div>
                        <span className="font-display font-bold text-sm text-white uppercase tracking-tight">Security Logs</span>
                      </div>
                      <button 
                        onClick={() => setNotifications(notifications.map((n: any) => ({ ...n, read: true })))}
                        className="text-[10px] font-mono text-neon-cyan-500 hover:text-neon-cyan-300 uppercase font-bold tracking-widest"
                      >
                        PURGE_ALL
                      </button>
                    </div>

                    <div className="space-y-3 max-h-[350px] overflow-y-auto custom-scrollbar pr-2 relative z-10">
                      {notifications.length > 0 ? (
                        notifications.map((notif: any) => (
                          <motion.div 
                            key={notif.id}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            className={`p-4 rounded-2xl border transition-all ${
                              notif.read ? 'bg-void-950/50 border-white/5 opacity-60' : 'bg-white/[0.03] border-white/10 shadow-lg'
                            }`}
                          >
                            <div className="flex justify-between items-start gap-2 mb-2">
                              <span className={`px-2 py-0.5 rounded-md font-mono text-[9px] font-bold uppercase tracking-widest border ${
                                notif.type === 'critical' ? 'bg-state-danger/20 text-state-danger border-state-danger/30' :
                                notif.type === 'warning' ? 'bg-state-warning/20 text-state-warning border-state-warning/30' :
                                'bg-void-800 text-void-300 border-white/5'
                              }`}>
                                {notif.type}
                              </span>
                              <span className="text-[9px] text-void-500 font-mono font-bold">{notif.time}</span>
                            </div>
                            <p className="text-void-100 text-xs leading-relaxed font-medium">{notif.message}</p>
                          </motion.div>
                        ))
                      ) : (
                        <div className="py-12 flex flex-col items-center justify-center text-void-600 gap-4">
                          <div className="w-16 h-16 rounded-full bg-void-950 flex items-center justify-center border border-white/5 shadow-inner">
                            <Bell className="w-8 h-8 opacity-20" />
                          </div>
                          <span className="text-[10px] font-mono uppercase tracking-[0.3em] font-bold">SYSTEM_QUIET</span>
                        </div>
                      )}
                    </div>
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>

          <button
            onClick={() => setIsAiPanelOpen(!isAiPanelOpen)}
            className={`px-4 py-3 rounded-xl border transition-all text-[11px] font-bold uppercase tracking-[0.15em] flex items-center gap-3 group relative overflow-hidden ${
              isAiPanelOpen 
                ? 'bg-neon-blue-500/10 border-neon-blue-500/40 text-neon-cyan-400 shadow-neon-blue' 
                : 'bg-void-900 border-white/5 text-void-400 hover:border-white/20 hover:text-white shadow-sm'
            }`}
          >
            {isAiPanelOpen && (
              <motion.div 
                layoutId="ai-glow"
                className="absolute inset-0 bg-neon-blue-500/5 animate-pulse" 
              />
            )}
            <Bot className={`w-5 h-5 transition-transform duration-500 ${isAiPanelOpen ? 'scale-110' : 'group-hover:rotate-12'}`} />
            <span className="hidden lg:inline relative z-10">NEURAL_HUB</span>
          </button>

          <button
            onClick={onBackToLanding}
            className="p-3 rounded-xl bg-void-900 border border-white/5 hover:border-neon-purple-500/40 text-white hover:bg-neon-purple-500/5 transition-all group shadow-sm"
            title="Terminate Session"
          >
            <LogOut className="w-5 h-5 text-void-500 group-hover:text-neon-purple-400 transition-colors group-hover:translate-x-0.5" />
          </button>
        </div>
      </div>
    </header>
  );
};
