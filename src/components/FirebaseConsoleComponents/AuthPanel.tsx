import React from 'react';
import { Lock, User, LogOut, Key, Mail, ShieldCheck } from 'lucide-react';

interface AuthPanelProps {
  currentUser: any;
  userProfile: any;
  logout: () => Promise<void>;
  authEmail: string;
  setAuthEmail: (val: string) => void;
  authPassword: string;
  setAuthPassword: (val: string) => void;
  authName: string;
  setAuthName: (val: string) => void;
  authRole: 'admin' | 'engineer' | 'technician' | 'auditor';
  setAuthRole: (val: any) => void;
  isRegisterMode: boolean;
  setIsRegisterMode: (val: boolean) => void;
  authError: string | null;
  handleAuthSubmit: (e: React.FormEvent) => Promise<void>;
}

export const AuthPanel: React.FC<AuthPanelProps> = ({
  currentUser,
  userProfile,
  logout,
  authEmail,
  setAuthEmail,
  authPassword,
  setAuthPassword,
  authName,
  setAuthName,
  authRole,
  setAuthRole,
  isRegisterMode,
  setIsRegisterMode,
  authError,
  handleAuthSubmit
}) => {
  return (
    <div className="glass-panel p-6 relative overflow-hidden group h-full">
      <div className="absolute -top-12 -right-12 w-32 h-32 bg-neon-blue-500/10 rounded-full blur-3xl group-hover:bg-neon-blue-500/20 transition-all duration-500" />
      
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-white font-display font-bold text-sm flex items-center gap-2">
          <Lock className="w-4 h-4 text-neon-blue-400" />
          Authentication Matrix
        </h3>
        {currentUser && (
          <span className="px-2 py-0.5 rounded-md text-[9px] bg-neon-blue-500/10 border border-neon-blue-500/30 font-mono font-bold text-neon-blue-400 uppercase tracking-widest animate-pulse">
            Verified Sessions
          </span>
        )}
      </div>

      {currentUser ? (
        <div className="space-y-6">
          <div className="bg-void-950/60 p-4 rounded-xl border border-void-600/20 space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-void-800 border border-void-600/30 flex items-center justify-center text-neon-blue-400 font-display font-bold">
                {currentUser.displayName?.[0] || 'O'}
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-bold text-white tracking-tight">{currentUser.displayName || 'Operations Node'}</span>
                <span className="text-[10px] text-void-500 font-mono truncate max-w-[150px]">{currentUser.email}</span>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-2">
              <div className="p-2 bg-void-900 rounded-lg border border-void-800 flex flex-col gap-0.5">
                <span className="text-[9px] font-mono font-bold text-void-600 uppercase">Clearance</span>
                <span className="text-[10px] font-mono font-bold text-neon-cyan-400 uppercase tracking-widest">{userProfile?.role || 'fan'}</span>
              </div>
              <div className="p-2 bg-void-900 rounded-lg border border-void-800 flex flex-col gap-0.5">
                <span className="text-[9px] font-mono font-bold text-void-600 uppercase">Encryption</span>
                <span className="text-[10px] font-mono font-bold text-void-300 uppercase tracking-widest">TLS 1.3</span>
              </div>
            </div>
          </div>
          
          <button
            onClick={() => logout()}
            className="w-full py-3 bg-void-900 hover:bg-state-danger-bg/20 text-void-400 hover:text-state-danger-text border border-void-700/50 hover:border-state-danger-text/30 rounded-xl text-[11px] font-bold transition-all uppercase tracking-widest flex items-center justify-center gap-2"
          >
            <LogOut className="w-3.5 h-3.5" />
            Terminate Session
          </button>
        </div>
      ) : (
        <form onSubmit={handleAuthSubmit} className="space-y-4">
          {authError && (
            <div className="p-3 bg-state-danger-bg/10 border border-state-danger-text/20 text-state-danger-text text-[10px] rounded-xl font-bold font-mono">
              ERR_AUTH: {authError}
            </div>
          )}
          
          <div className="space-y-3">
            {isRegisterMode && (
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-void-500" />
                <input
                  type="text"
                  placeholder="Personnel Name"
                  value={authName}
                  onChange={(e) => setAuthName(e.target.value)}
                  className="w-full bg-void-950/50 border border-void-600/30 rounded-xl pl-9 pr-4 py-2.5 text-xs text-white focus:outline-none focus:border-neon-blue-500 font-mono transition-all"
                />
              </div>
            )}
            
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-void-500" />
              <input
                type="email"
                placeholder="node_id@lusail.qa"
                value={authEmail}
                onChange={(e) => setAuthEmail(e.target.value)}
                className="w-full bg-void-950/50 border border-void-600/30 rounded-xl pl-9 pr-4 py-2.5 text-xs text-white focus:outline-none focus:border-neon-blue-500 font-mono transition-all"
              />
            </div>
            
            <div className="relative">
              <Key className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-void-500" />
              <input
                type="password"
                placeholder="Access Secret"
                value={authPassword}
                onChange={(e) => setAuthPassword(e.target.value)}
                className="w-full bg-void-950/50 border border-void-600/30 rounded-xl pl-9 pr-4 py-2.5 text-xs text-white focus:outline-none focus:border-neon-blue-500 font-mono transition-all"
              />
            </div>
          </div>

          {isRegisterMode && (
            <div className="space-y-2">
              <span className="text-[9px] font-mono font-bold text-void-600 uppercase tracking-widest px-1">Designated Role</span>
              <div className="flex gap-1 bg-void-950 p-1 rounded-lg border border-void-800">
                {(['admin', 'engineer', 'technician', 'auditor'] as const).map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setAuthRole(r)}
                    className={`flex-grow py-1.5 rounded-md uppercase font-bold text-[9px] tracking-tighter transition-all ${
                      authRole === r 
                        ? 'bg-neon-blue-500 text-white shadow-neon-glow-blue' 
                        : 'text-void-500 hover:text-void-300'
                    }`}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="flex gap-2 pt-2">
            <button
              type="submit"
              className="flex-grow py-3 bg-neon-blue-500 hover:bg-neon-blue-400 text-white font-bold text-xs uppercase tracking-widest rounded-xl transition-all shadow-neon-glow-blue"
            >
              {isRegisterMode ? 'Synthesize Node' : 'Initialize Link'}
            </button>
            <button
              type="button"
              onClick={() => setIsRegisterMode(!isRegisterMode)}
              className="px-4 bg-void-900 border border-void-700 text-void-400 hover:text-white rounded-xl text-[10px] transition-all uppercase font-bold font-mono tracking-tighter"
            >
              {isRegisterMode ? 'Sign In' : 'Sign Up'}
            </button>
          </div>
        </form>
      )}
    </div>
  );
};
