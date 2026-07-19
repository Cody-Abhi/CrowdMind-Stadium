import React, { useState, FormEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useAuth, UserRole } from '../contexts/AuthContext';
import { 
  X, 
  Mail, 
  Lock, 
  User, 
  Sparkles, 
  ShieldCheck, 
  Users, 
  UserPlus, 
  LockKeyhole,
  Compass,
  Award,
  Settings,
  AlertCircle
} from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const { loginWithEmail, registerWithEmail, loginWithGoogle, error: authError } = useAuth();
  const [isSignUp, setIsSignUp] = useState(false);
  
  // Form fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [selectedRole, setSelectedRole] = useState<UserRole>('fan');
  const [loading, setLoading] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleAuthSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLocalError(null);
    setLoading(true);

    try {
      if (isSignUp) {
        if (!name.trim()) {
          throw new Error('Name is required for registration');
        }
        await registerWithEmail(email, password, name, selectedRole);
      } else {
        await loginWithEmail(email, password);
      }
      onClose();
    } catch (err: any) {
      setLocalError(err.message || 'Authentication operation failed');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setLocalError(null);
    setLoading(true);
    try {
      await loginWithGoogle(selectedRole);
      onClose();
    } catch (err: any) {
      setLocalError(err.message || 'Google sign-in failed');
    } finally {
      setLoading(false);
    }
  };

  const roles = [
    { id: 'fan' as UserRole, label: 'Fan Guide', icon: Compass, description: 'Spatial Assistant & Wayfinding' },
    { id: 'volunteer' as UserRole, label: 'Volunteer', icon: Award, description: 'Spectator Guidance Tasks' },
    { id: 'ops' as UserRole, label: 'Operations', icon: Settings, description: 'Live Crowd Monitoring & Safety' },
    { id: 'admin' as UserRole, label: 'Admin Panel', icon: ShieldCheck, description: 'Global Venue Settings' }
  ];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-labelledby="auth-modal-title">
        {/* Backdrop overlay */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-void-950/80 backdrop-blur-md"
          aria-hidden="true"
        />

        {/* Modal body */}
        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: 15 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 15 }}
          transition={{ type: 'spring', damping: 25, stiffness: 350 }}
          className="glass-card w-full max-w-lg rounded-2xl overflow-hidden relative border border-void-600/40 shadow-elevation-high p-6 sm:p-8 z-10 bg-void-850/90"
        >
          {/* Close trigger button */}
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-lg text-void-400 hover:text-white hover:bg-void-750 transition-colors"
            aria-label="Close authentication dialog"
          >
            <X className="w-4 h-4" aria-hidden="true" />
          </button>

          <div className="mb-6 text-center">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-neon-blue-500/10 border border-neon-blue-500/30 text-[10px] font-mono text-neon-cyan-400 uppercase tracking-wider mb-3">
              <Sparkles className="w-3.5 h-3.5 text-neon-cyan-500" />
              FIFA World Cup 2026 Core Gateway
            </div>
            <h2 id="auth-modal-title" className="font-display font-bold text-white text-2xl tracking-tight">
              {isSignUp ? 'Register Security Key' : 'Initiate Secure Session'}
            </h2>
            <p className="text-void-400 text-xs mt-1">
              {isSignUp ? 'Create credentials to synchronize spatial parameters' : 'Authenticate to gain event-role clearance levels'}
            </p>
          </div>

          <form onSubmit={handleAuthSubmit} className="space-y-4" noValidate>
            {isSignUp && (
              <div>
                <label htmlFor="auth-name" className="block text-[11px] font-mono text-void-300 uppercase tracking-wider mb-1.5">Full Name</label>
                <div className="relative">
                  <User className="absolute left-3.5 top-3 w-4 h-4 text-void-400" />
                  <input
                    id="auth-name"
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter full name"
                    autoComplete="name"
                    className="w-full bg-void-900 border border-void-600/40 rounded-xl pl-11 pr-4 py-2.5 text-xs text-white focus:outline-none focus:border-neon-blue-500 transition-colors placeholder:text-void-500"
                  />
                </div>
              </div>
            )}

            <div>
              <label htmlFor="auth-email" className="block text-[11px] font-mono text-void-300 uppercase tracking-wider mb-1.5">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-3 w-4 h-4 text-void-400" />
                <input
                  id="auth-email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@domain.com"
                  autoComplete="email"
                  className="w-full bg-void-900 border border-void-600/40 rounded-xl pl-11 pr-4 py-2.5 text-xs text-white focus:outline-none focus:border-neon-blue-500 transition-colors placeholder:text-void-500"
                />
              </div>
            </div>

            <div>
              <label htmlFor="auth-password" className="block text-[11px] font-mono text-void-300 uppercase tracking-wider mb-1.5">Security Password</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-3 w-4 h-4 text-void-400" />
                <input
                  id="auth-password"
                  type="password"
                  required
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  autoComplete={isSignUp ? 'new-password' : 'current-password'}
                  className="w-full bg-void-900 border border-void-600/40 rounded-xl pl-11 pr-4 py-2.5 text-xs text-white focus:outline-none focus:border-neon-blue-500 transition-colors placeholder:text-void-500"
                />
              </div>
            </div>

            {/* Role selection section */}
            <div className="pt-2">
              <label className="block text-[11px] font-mono text-void-300 uppercase tracking-wider mb-2">
                Select Platform Security Clearence ({isSignUp ? 'Assigned' : 'Google Preferred'})
              </label>
              <div className="grid grid-cols-2 gap-2" role="radiogroup" aria-label="Select security clearance role">
                {roles.map((role) => {
                  const RoleIcon = role.icon;
                  const isSelected = selectedRole === role.id;
                  return (
                    <button
                      key={role.id}
                      type="button"
                      onClick={() => setSelectedRole(role.id)}
                      className={`p-2.5 rounded-xl border text-left transition-all ${isSelected ? 'bg-neon-blue-500/10 border-neon-blue-500 shadow-neon-glow-blue' : 'bg-void-900 border-void-600/30 hover:border-void-600'}`}
                      role="radio"
                      aria-checked={isSelected}
                      aria-label={`${role.label}: ${role.description}`}
                    >
                      <div className="flex items-center gap-2">
                        <RoleIcon className={`w-4 h-4 ${isSelected ? 'text-neon-cyan-400' : 'text-void-400'}`} />
                        <span className="text-[11px] font-bold text-white">{role.label}</span>
                      </div>
                      <p className="text-[9px] text-void-400 truncate mt-0.5">{role.description}</p>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Error alerts */}
            {(localError || authError) && (
              <div className="p-3 rounded-lg bg-state-danger-bg border border-state-danger-text/30 text-[11px] text-state-danger-text flex items-center gap-2 font-mono" role="alert" aria-live="assertive">
                <AlertCircle className="w-4 h-4 text-state-danger-text flex-shrink-0" aria-hidden="true" />
                <span>{localError || authError}</span>
              </div>
            )}

            {/* Action buttons */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-neon-blue-500 to-neon-purple-500 hover:from-neon-blue-400 hover:to-neon-purple-400 text-white font-semibold text-xs tracking-wider uppercase transition-all flex items-center justify-center gap-2 shadow-neon-glow-blue"
            >
              {loading ? (
                <>
                  <span className="w-3 h-3 rounded-full border-2 border-t-transparent border-white animate-spin" />
                  Synchronizing Credentials...
                </>
              ) : (
                <>
                  {isSignUp ? <UserPlus className="w-4 h-4" /> : <LockKeyhole className="w-4 h-4" />}
                  {isSignUp ? 'Register Profile' : 'Declassify Access'}
                </>
              )}
            </button>
          </form>

          {/* Spacer divider */}
          <div className="relative my-5">
            <div className="absolute inset-0 flex items-center"><div className="w-full h-[1px] bg-void-600/30" /></div>
            <div className="relative flex justify-center text-[10px] uppercase font-mono"><span className="bg-void-850 px-3 text-void-500">Secured Federated Node</span></div>
          </div>

          {/* Social Auth Option */}
          <button
            type="button"
            disabled={loading}
            onClick={handleGoogleSignIn}
            className="w-full py-2.5 rounded-xl bg-void-800 border border-void-600/40 hover:border-neon-cyan-500 text-xs font-bold text-void-100 transition-all flex items-center justify-center gap-2 hover:bg-void-750"
          >
            <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12.24 10.285V14.4h6.887c-.648 2.41-2.519 4.114-5.136 4.114-3.478 0-6.3-2.822-6.3-6.3s2.822-6.3 6.3-6.3c1.55 0 2.96.56 4.06 1.48l3.153-3.153C19.117 2.222 15.932 1 12.24 1 5.48 1 0 6.48 0 13.24s5.48 12.24 12.24 12.24c6.76 0 11.76-4.75 11.76-11.76 0-.616-.065-1.11-.148-1.435H12.24z"/>
            </svg>
            Sign In with Google Account
          </button>

          {/* Swap signup / login triggers */}
          <div className="mt-5 text-center">
            <button
              onClick={() => setIsSignUp(!isSignUp)}
              className="text-[11px] font-mono text-neon-cyan-400 hover:text-neon-cyan-300 transition-all uppercase tracking-wide"
            >
              {isSignUp ? 'Existing Clearance? Sign In Instead' : 'Need New Spatial Node? Register Here'}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
