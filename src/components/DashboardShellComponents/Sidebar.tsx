import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Bot, 
  ChevronLeft, 
  BarChart3, 
  Flame, 
  Sparkles, 
  Activity, 
  Users, 
  ClipboardList, 
  Languages, 
  Megaphone, 
  Terminal,
  User
} from 'lucide-react';
import { UserRole } from '../../contexts/AuthContext';

interface SidebarProps {
  isSidebarCollapsed: boolean;
  setIsSidebarCollapsed: (val: boolean) => void;
  activeMenuTab: string;
  setActiveMenuTab: (tab: any) => void;
  userProfile: any;
  updateUserRole: (role: UserRole) => void;
}

const menuItems = [
  { id: 'executive', label: 'Executive Board', icon: BarChart3, description: 'C-Suite intelligence' },
  { id: 'firebase', label: 'Firebase Cloud', icon: Flame, description: 'Spatial database' },
  { id: 'fan-hub', label: 'Fan Experience', icon: Sparkles, description: 'Premium Spectator' },
  { id: 'overview', label: 'Mission Control', icon: Activity, description: 'Operational State' },
  { id: 'crowds', label: 'Ingress Engine', icon: Users, description: 'Bottleneck Analytics' },
  { id: 'volunteers', label: 'Steward Board', icon: ClipboardList, description: 'Service Dispatch' },
  { id: 'translations', label: 'Signage AI', icon: Languages, description: 'Linguistic Models' },
  { id: 'broadcast', label: 'Safety Beacon', icon: Megaphone, description: 'Localized Alerts' },
  { id: 'logs', label: 'Audit Terminal', icon: Terminal, description: 'Secured Event Logs' },
];

export const Sidebar: React.FC<SidebarProps> = ({
  isSidebarCollapsed,
  setIsSidebarCollapsed,
  activeMenuTab,
  setActiveMenuTab,
  userProfile,
  updateUserRole
}) => {
  return (
    <motion.aside 
      initial={{ width: isSidebarCollapsed ? 80 : 280 }}
      animate={{ width: isSidebarCollapsed ? 80 : 280 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className="hidden md:flex flex-col border-r border-white/5 bg-void-950/40 backdrop-blur-3xl flex-shrink-0 relative z-30 h-full overflow-hidden shadow-2xl"
    >
      <div className="absolute -left-20 -top-20 w-64 h-64 bg-neon-blue-500/5 blur-[100px] pointer-events-none" />
      
      <div className="p-6 flex items-center justify-between border-b border-white/5 min-h-[88px]">
        <AnimatePresence initial={false} mode="wait">
          {!isSidebarCollapsed ? (
            <motion.div 
              key="full-brand"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              className="flex items-center gap-3.5"
            >
              <div className="relative group">
                <div className="absolute -inset-1.5 bg-gradient-to-br from-neon-blue-500 to-neon-cyan-500 rounded-xl blur opacity-20 group-hover:opacity-40 transition-opacity" />
                <div className="relative w-10 h-10 rounded-xl bg-void-900 border border-white/10 flex items-center justify-center p-[1px]">
                   <Bot className="w-5 h-5 text-neon-cyan-400" />
                </div>
              </div>
              <div>
                <span className="font-display font-bold text-lg tracking-tight text-white leading-none block uppercase">CROWDMIND</span>
                <span className="text-[10px] text-neon-blue-400 block font-mono font-bold uppercase tracking-[0.2em] mt-1 opacity-80">OS 4.0 ALPHA</span>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="collapsed-brand"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="mx-auto"
            >
              <div className="w-10 h-10 rounded-xl bg-void-900/50 border border-white/10 flex items-center justify-center hover:border-neon-cyan-500/40 transition-all cursor-pointer group">
                <Bot className="w-5 h-5 text-neon-cyan-500 group-hover:scale-110 transition-transform" />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      
      <nav className="flex-grow overflow-y-auto custom-scrollbar p-4 space-y-1.5">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeMenuTab === item.id;
          return (
            <motion.button
              key={item.id}
              whileHover={{ x: 4 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setActiveMenuTab(item.id)}
              className={`w-full flex items-center gap-3.5 p-3.5 rounded-xl transition-all relative group cursor-pointer ${
                isActive 
                  ? 'bg-white/5 text-white border border-white/10 shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)]' 
                  : 'text-void-400 hover:text-white hover:bg-white/[0.02]'
              }`}
            >
              {isActive && (
                <motion.div 
                  layoutId="active-indicator"
                  className="absolute left-0 top-3 bottom-3 w-1 bg-neon-blue-500 rounded-full shadow-[0_0_15px_rgba(0,102,255,0.8)]" 
                />
              )}
              
              <div className={`flex-shrink-0 w-5 h-5 flex items-center justify-center transition-colors ${isActive ? 'text-neon-cyan-400' : 'text-void-500 group-hover:text-void-300'}`}>
                <Icon className="w-full h-full stroke-[1.5]" />
              </div>
              
              <AnimatePresence initial={false}>
                {!isSidebarCollapsed && (
                  <motion.div 
                    initial={{ opacity: 0, x: -5 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -5 }}
                    className="text-left flex-grow"
                  >
                    <div className="text-sm font-semibold tracking-tight">{item.label}</div>
                    <div className="text-[10px] text-void-500 font-medium truncate max-w-[150px] uppercase tracking-wider mt-0.5 opacity-60 group-hover:opacity-100 transition-opacity">
                      {item.description}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {isSidebarCollapsed && (
                <div className="absolute left-full ml-4 px-3 py-2 rounded-lg bg-void-800 border border-white/10 text-xs text-white opacity-0 group-hover:opacity-100 pointer-events-none transition-all -translate-x-2 group-hover:translate-x-0 whitespace-nowrap z-50 font-bold shadow-xl">
                  {item.label}
                </div>
              )}
            </motion.button>
          );
        })}
      </nav>
      
      <div className="p-4 border-t border-white/5">
        <AnimatePresence mode="wait">
          {!isSidebarCollapsed ? (
            <motion.div 
              key="user-full"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="p-4 rounded-2xl bg-white/[0.03] border border-white/5 relative overflow-hidden group"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-neon-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              
              <div className="flex items-center gap-3 mb-4 relative z-10">
                <div className="relative">
                  <div className="w-11 h-11 rounded-xl bg-void-800 border border-white/10 flex items-center justify-center overflow-hidden shadow-inner">
                    <User className="w-5 h-5 text-void-400" />
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full bg-state-success border-4 border-void-950 shadow-sm" />
                </div>
                <div className="overflow-hidden">
                  <span className="font-bold text-sm block text-white truncate">{userProfile?.name || 'Operator 732'}</span>
                  <span className="text-[10px] font-mono font-bold text-neon-blue-400 uppercase tracking-widest mt-0.5">{userProfile?.role || 'Guest'}</span>
                </div>
              </div>

              <div className="grid grid-cols-4 gap-1.5 relative z-10">
                {(['fan', 'ops', 'volunteer', 'admin'] as UserRole[]).map((r) => (
                  <button
                    key={r}
                    onClick={() => updateUserRole(r)}
                    className={`h-7 rounded-lg font-mono text-[9px] uppercase border transition-all cursor-pointer flex items-center justify-center ${
                      userProfile?.role === r 
                        ? 'bg-neon-blue-500/20 text-neon-blue-400 border-neon-blue-500/40 shadow-neon-blue' 
                        : 'bg-void-950/50 border-white/5 text-void-500 hover:border-white/20 hover:text-void-300'
                    }`}
                    title={`Switch to ${r}`}
                  >
                    {r.charAt(0)}
                  </button>
                ))}
              </div>
            </motion.div>
          ) : (
            <button 
              onClick={() => setIsSidebarCollapsed(false)}
              className="w-full flex justify-center p-2 rounded-xl text-void-500 hover:text-white hover:bg-white/5 transition-colors"
            >
              <User className="w-5 h-5" />
            </button>
          )}
        </AnimatePresence>
      </div>
      
      <button 
        onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 w-6 h-12 bg-void-900 border border-white/10 rounded-l-md flex items-center justify-center text-void-500 hover:text-white transition-all cursor-pointer opacity-0 hover:opacity-100 z-50 group shadow-xl"
      >
        <ChevronLeft className={`w-4 h-4 transition-transform duration-300 ${isSidebarCollapsed ? 'rotate-180' : ''}`} />
      </button>
    </motion.aside>
  );
};
