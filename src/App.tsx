import React, { useState, useEffect, lazy, Suspense } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useAuth, UserRole } from './contexts/AuthContext';
import AuthModal from './components/AuthModal';
import { useAccessibility } from './contexts/AccessibilityContext';

// Components
import { Hero } from './components/LandingPageComponents/Hero';
import { LiveSandbox } from './components/LandingPageComponents/LiveSandbox';

// Lazy loaded Dashboard
const DashboardShell = lazy(() => import('./components/DashboardShell'));

// Lucide Icons
import {
  Bot,
  Zap,
  User,
  LogOut,
  Lock,
  Clock,
  Check,
  ChevronDown
} from 'lucide-react';

export default function App() {
  const { currentUser, userProfile, logout, updateUserRole } = useAuth();
  const { 
    highContrast, toggleHighContrast, 
    textScale, setTextScale, 
    reducedMotion, toggleReducedMotion 
  } = useAccessibility();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'landing' | 'dashboard'>('landing');
  const [showRoleDropdown, setShowRoleDropdown] = useState(false);
  const [currentUtcTime, setCurrentUtcTime] = useState('');

  // Clock Sync
  useEffect(() => {
    const update = () => setCurrentUtcTime(new Date().toISOString().substring(11, 19) + ' UTC');
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, []);

  if (viewMode === 'dashboard') {
    return (
      <Suspense fallback={
        <div className="min-h-screen bg-void-950 flex flex-col items-center justify-center p-6" role="status" aria-label="Loading dashboard">
          <div className="w-16 h-16 rounded-xl bg-void-900 border border-void-600/30 flex items-center justify-center mb-6 relative overflow-hidden shadow-neon-glow-blue">
            <div className="absolute inset-0 bg-gradient-to-tr from-neon-blue-500/20 via-transparent to-neon-cyan-500/20 animate-pulse" />
            <Bot className="w-8 h-8 text-neon-cyan-500 animate-spin" aria-hidden="true" />
          </div>
          <div className="space-y-2 text-center">
            <div className="font-bold text-white tracking-widest uppercase">PLANT LUSAIL BRAIN</div>
            <div className="text-[10px] text-neon-cyan-400 animate-pulse uppercase tracking-widest" aria-live="polite">Loading Nodes...</div>
          </div>
        </div>
      }>
        <DashboardShell onBackToLanding={() => setViewMode('landing')} />
      </Suspense>
    );
  }

  return (
    <div className="min-h-screen bg-void-900 cyber-grid relative custom-scrollbar flex flex-col">
      {/* Skip Navigation Link */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-0 focus:left-0 focus:z-[100] focus:bg-neon-blue-500 focus:text-white focus:px-4 focus:py-2 focus:text-sm"
      >
        Skip to main content
      </a>

      {/* Scanline Overlay */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-10" aria-hidden="true">
        <div className="w-full h-2 bg-gradient-to-b from-transparent via-neon-blue-500/5 to-transparent animate-cyber-scan" />
      </div>

      {/* Global Status Bar */}
      <div className="w-full bg-void-950/90 border-b border-void-600/30 glass-blur-md px-6 py-2 flex justify-between items-center text-[10px] font-mono text-void-500 z-50" role="banner" aria-label="System status bar">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5 text-neon-blue-500" role="status" aria-label="Live mesh connection active">
            <span className="w-1.5 h-1.5 rounded-full bg-neon-blue-500 animate-pulse" aria-hidden="true" />
            LIVE BRAIN GRID
          </span>
          <span aria-label="Event name">PLANT LUSAIL OPERATIONS</span>
        </div>
        <div className="flex items-center gap-4">
          {/* Accessibility controls */}
          <div className="flex items-center gap-2 border-r border-void-600/30 pr-4" role="toolbar" aria-label="Accessibility settings">
            <button 
              onClick={toggleHighContrast}
              className={`hover:text-white px-1.5 py-0.5 rounded cursor-pointer transition-colors ${highContrast ? 'bg-neon-cyan-500/20 text-neon-cyan-400 font-bold' : 'text-void-500'}`}
              title="Toggle High Contrast Mode"
              aria-pressed={highContrast}
              aria-label={`High contrast mode: ${highContrast ? 'enabled' : 'disabled'}`}
            >
              CONTRAST
            </button>
            <button 
              onClick={() => {
                const nextScale = textScale === 'normal' ? 'large' : textScale === 'large' ? 'extra-large' : 'normal';
                setTextScale(nextScale);
              }}
              className="hover:text-white px-1.5 py-0.5 rounded cursor-pointer font-bold text-void-500 transition-colors"
              title="Change Text Scale Size"
              aria-label={`Text scale: ${textScale}. Click to change.`}
            >
              TEXT: {textScale.toUpperCase()}
            </button>
            <button 
              onClick={toggleReducedMotion}
              className={`hover:text-white px-1.5 py-0.5 rounded cursor-pointer transition-colors ${reducedMotion ? 'bg-neon-blue-500/20 text-neon-blue-400 font-bold' : 'text-void-500'}`}
              title="Toggle Reduced Motion Mode"
              aria-pressed={reducedMotion}
              aria-label={`Reduced motion: ${reducedMotion ? 'enabled' : 'disabled'}`}
            >
              MOTION: {reducedMotion ? 'REDUCED' : 'NORMAL'}
            </button>
          </div>
          <div className="flex items-center gap-2 text-void-500" aria-label="Current time">
            <Clock className="w-3 h-3" aria-hidden="true" />
            <time>{currentUtcTime}</time>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <header className="w-full bg-void-900/80 border-b border-void-600/20 glass-blur-md px-6 py-4 sticky top-0 z-40" role="navigation" aria-label="Main navigation">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-neon-blue-500 to-neon-cyan-500 p-[1px] shadow-neon-glow-blue flex items-center justify-center" aria-hidden="true">
              <div className="w-full h-full bg-void-900 rounded-[11px] flex items-center justify-center">
                <Bot className="w-5 h-5 text-neon-cyan-500" />
              </div>
            </div>
            <span className="font-display text-lg font-bold tracking-tight text-white uppercase">CROWDMIND</span>
          </div>

          <nav className="flex items-center gap-4" aria-label="User actions">
            <button
              onClick={() => setViewMode('dashboard')}
              className="px-4 py-2 rounded-xl bg-neon-blue-500/10 border border-neon-blue-500/30 text-neon-cyan-400 text-xs font-bold uppercase transition-all hover:bg-neon-blue-500 hover:text-white flex items-center gap-2"
              aria-label="Open stadium operations dashboard"
            >
              <Zap className="w-3.5 h-3.5" aria-hidden="true" />
              Dashboard
            </button>

            {currentUser ? (
              <div className="relative">
                <button
                  onClick={() => setShowRoleDropdown(!showRoleDropdown)}
                  className="flex items-center gap-2 px-3 py-2 rounded-xl bg-void-800 border border-void-600/40 hover:border-neon-blue-500 text-xs text-white font-bold transition-all"
                  aria-expanded={showRoleDropdown}
                  aria-haspopup="listbox"
                  aria-label={`Current role: ${userProfile?.role || 'Fan'}. Click to change role.`}
                >
                  <User className="w-4 h-4 text-neon-cyan-500" aria-hidden="true" />
                  <span className="capitalize">{userProfile?.role || 'Technician'}</span>
                  <ChevronDown className="w-3 h-3" aria-hidden="true" />
                </button>

                <AnimatePresence>
                  {showRoleDropdown && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute right-0 mt-2 w-48 rounded-xl bg-void-850 border border-void-600/40 p-2 shadow-elevation-high z-50"
                      role="listbox"
                      aria-label="Select user role"
                    >
                      {(['admin', 'engineer', 'technician', 'auditor'] as UserRole[]).map((r) => (
                        <button
                          key={r}
                          onClick={() => {
                            updateUserRole(r);
                            setShowRoleDropdown(false);
                          }}
                          className={`w-full text-left px-3 py-2 rounded-lg text-xs flex items-center justify-between transition-colors ${userProfile?.role === r ? 'bg-neon-blue-500/10 text-neon-cyan-400 font-bold' : 'hover:bg-void-800 text-void-300'}`}
                          role="option"
                          aria-selected={userProfile?.role === r}
                        >
                          <span className="capitalize">{r}</span>
                          {userProfile?.role === r && <Check className="w-3 h-3" aria-hidden="true" />}
                        </button>
                      ))}
                      <div className="border-t border-void-600/20 mt-2 pt-2">
                        <button
                          onClick={() => logout()}
                          className="w-full text-left px-3 py-2 rounded-lg text-xs text-red-400 hover:bg-red-500/10 flex items-center gap-2 transition-colors font-bold"
                          aria-label="Sign out of your account"
                        >
                          <LogOut className="w-3 h-3" aria-hidden="true" />
                          Sign Out
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <button
                onClick={() => setIsAuthModalOpen(true)}
                className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-neon-blue-500 to-neon-purple-500 text-white text-xs font-bold uppercase transition-all shadow-neon-glow-blue flex items-center gap-2"
                aria-label="Sign in to access the stadium gateway"
              >
                <Lock className="w-3.5 h-3.5" aria-hidden="true" />
                Access Gateway
              </button>
            )}
          </nav>
        </div>
      </header>

      <main id="main-content" className="flex-grow" role="main">
        <Hero onLaunchDashboard={() => setViewMode('dashboard')} />
        <LiveSandbox />
        
        {/* Features Section */}
        <section id="features" className="py-20 px-6 max-w-7xl mx-auto" aria-labelledby="features-heading">
          <h2 id="features-heading" className="sr-only">Platform Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { title: 'Unified RAG Search', desc: 'Hybrid dense + graph traversal semantic queries over manuals.' },
              { title: 'Knowledge Graph Ontology', desc: 'Entity-relationship mapping (HAS_COMPONENT, COMPLIANT_WITH).' },
              { title: 'Multi-Agent Incident RCA', desc: 'Failure Mode & Symptom Reasoning agent for root cause analysis.' }
            ].map((f, i) => (
              <article key={i} className="glass-panel p-8 space-y-4" aria-labelledby={`feature-${i}`}>
                <div className="w-12 h-12 rounded-xl bg-void-800 border border-void-600/30 flex items-center justify-center" aria-hidden="true">
                  <Bot className="w-6 h-6 text-neon-blue-400" />
                </div>
                <h3 id={`feature-${i}`} className="text-lg font-display font-bold text-white">{f.title}</h3>
                <p className="text-sm text-void-400 leading-relaxed">{f.desc}</p>
              </article>
            ))}
          </div>
        </section>
      </main>

      <footer className="w-full py-12 px-6 border-t border-void-600/20 bg-void-950/50" role="contentinfo">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-3">
            <Bot className="w-6 h-6 text-neon-cyan-500" aria-hidden="true" />
            <span className="font-display font-bold text-white">CROWDMIND PS8</span>
          </div>
          <div className="text-xs font-mono text-void-500 uppercase tracking-widest">
            © 2026 Plant Lusail • Industrial Intelligence Grid
          </div>
        </div>
      </footer>

      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
    </div>
  );
}
