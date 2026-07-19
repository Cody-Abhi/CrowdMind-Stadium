import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  db, 
  collection, 
  doc, 
  onSnapshot, 
  addDoc, 
  updateDoc, 
  query, 
  orderBy, 
  limit 
} from '../firebase';
import { disableNetwork, enableNetwork } from 'firebase/firestore';
import { useAuth } from '../contexts/AuthContext';
import { seedInitialStadiumData } from '../lib/firebaseSeeder';

// Icon Imports
import { 
  Flame, 
  Database, 
  Shield, 
  HardDrive, 
  Terminal, 
  Bell, 
  Sliders, 
  RefreshCw, 
  CheckCircle2, 
  LayoutDashboard
} from 'lucide-react';

// Sub-component Imports
import { RemoteConfigTab } from './FirebaseConsoleComponents/RemoteConfigTab';
import { FirestoreTab } from './FirebaseConsoleComponents/FirestoreTab';
import { StorageTab } from './FirebaseConsoleComponents/StorageTab';
import { FunctionsTab } from './FirebaseConsoleComponents/FunctionsTab';
import { MessagingTab } from './FirebaseConsoleComponents/MessagingTab';
import { SecurityTab } from './FirebaseConsoleComponents/SecurityTab';
import { AuthPanel } from './FirebaseConsoleComponents/AuthPanel';
import { OfflinePersistencePanel } from './FirebaseConsoleComponents/OfflinePersistencePanel';
import { SecurityStatusPanel } from './FirebaseConsoleComponents/SecurityStatusPanel';

export default function FirebaseConsole() {
  const { currentUser, userProfile, loginWithEmail, registerWithEmail, logout } = useAuth();

  // --- SUB-TABS STATE ---
  const [activeConsoleTab, setActiveConsoleTab] = useState<'firestore' | 'storage' | 'functions' | 'messaging' | 'remote_config' | 'security'>('remote_config');

  // --- REMOTE CONFIG STATE ---
  const [remoteConfig, setRemoteConfig] = useState({
    ticketSaleDiscount: 0,
    coolingHvacThreshold: 22,
    biometricScanDelay: 2.4,
    emergencyLockdown: false,
    gateAOverflowEnabled: false
  });
  const [isConfigLoading, setIsConfigLoading] = useState(true);

  // --- OFFLINE PERSISTENCE STATE ---
  const [isOnline, setIsOnline] = useState(true);
  const [offlineStatusMsg, setOfflineStatusMsg] = useState('Fully operational - Firestore syncing to Cloud mainframes.');

  // --- CLOUD STORAGE STATE ---
  const [storageItems, setStorageItems] = useState<any[]>([]);
  const [newFileName, setNewFileName] = useState('');
  const [newFileSize, setNewFileSize] = useState('2.4 MB');
  const [newFileCategory, setNewFileCategory] = useState('General Logs');
  const [isUploading, setIsUploading] = useState(false);

  // --- CLOUD FUNCTIONS STATE ---
  const [functionsLogs, setFunctionsLogs] = useState<any[]>([]);
  const [isExecutingFunction, setIsExecutingFunction] = useState<string | null>(null);

  // --- CLOUD MESSAGING STATE ---
  const [messagingAlerts, setMessagingAlerts] = useState<any[]>([]);
  const [newMessageText, setNewMessageText] = useState('');
  const [newMessageUrgency, setNewMessageUrgency] = useState('medium');

  // --- ANALYTICS EVENT LOG STATE ---
  const [analyticsEvents, setAnalyticsEvents] = useState<any[]>([]);

  // --- SEED STATUS ---
  const [seedingInProgress, setSeedingInProgress] = useState(false);
  const [seedSuccessMsg, setSeedSuccessMsg] = useState('');

  // --- AUTH FORM STATE ---
  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [authName, setAuthName] = useState('');
  const [authRole, setAuthRole] = useState<'admin' | 'engineer' | 'technician' | 'auditor'>('technician');
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  // --- DEPLOY RULES STATUS ---
  const [deployRulesSuccess, setDeployRulesSuccess] = useState(false);

  // Security Rules & Indexes (Constants)
  const rawSecurityRules = `rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read, write: if request.auth != null;
    }
    match /stadium_gates/{gateId} {
      allow read: if true;
      allow write: if request.auth != null && get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role in ['ops', 'admin'];
    }
    match /volunteer_tasks/{taskId} {
      allow read: if true;
      allow create, update: if request.auth != null;
      allow delete: if request.auth != null && get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
    match /safety_broadcasts/{broadcastId} {
      allow read: if true;
      allow write: if request.auth != null && get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role in ['ops', 'admin'];
    }
    match /remote_config/{configId} {
      allow read: if true;
      allow write: if request.auth != null && get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
  }
}`;

  const compoundIndexes = [
    { name: 'volunteer_tasks_composite', fields: 'urgency ASC, createdAt DESC', usage: 'Renders priority stewarding queues dynamically.' },
    { name: 'analytics_events_composite', fields: 'category ASC, timestamp DESC', usage: 'Filters real-time terminal audit output logs.' },
    { name: 'cloud_storage_composite', fields: 'category ASC, uploadedAt DESC', usage: 'Powers structured files sorting within segments.' }
  ];

  // --- LIVE LISTENERS ---
  useEffect(() => {
    const configDocRef = doc(db, 'remote_config', 'stadium_settings');
    const unsubConfig = onSnapshot(configDocRef, (snapshot) => {
      if (snapshot.exists()) setRemoteConfig(snapshot.data() as any);
      setIsConfigLoading(false);
    }, () => setIsConfigLoading(false));

    const unsubStorage = onSnapshot(query(collection(db, 'cloud_storage_metadata'), orderBy('name', 'asc')), (snapshot) => {
      const items: any[] = [];
      snapshot.forEach((d) => items.push({ id: d.id, ...d.data() }));
      setStorageItems(items);
    });

    const unsubMessaging = onSnapshot(query(collection(db, 'messaging_alerts'), orderBy('sentAt', 'desc'), limit(15)), (snapshot) => {
      const msgs: any[] = [];
      snapshot.forEach((d) => msgs.push({ id: d.id, ...d.data() }));
      setMessagingAlerts(msgs);
    });

    const unsubAnalytics = onSnapshot(query(collection(db, 'analytics_events'), orderBy('timestamp', 'desc'), limit(25)), (snapshot) => {
      const evts: any[] = [];
      snapshot.forEach((d) => evts.push({ id: d.id, ...d.data() }));
      setAnalyticsEvents(evts);
    });

    const unsubFunctions = onSnapshot(query(collection(db, 'cloud_functions_log'), orderBy('executedAt', 'desc'), limit(15)), (snapshot) => {
      const logs: any[] = [];
      snapshot.forEach((d) => logs.push({ id: d.id, ...d.data() }));
      setFunctionsLogs(logs);
    });

    seedInitialStadiumData();

    return () => {
      unsubConfig();
      unsubStorage();
      unsubMessaging();
      unsubAnalytics();
      unsubFunctions();
    };
  }, []);

  // --- HELPERS ---
  const logAnalyticsEvent = async (eventName: string, category: string) => {
    try {
      await addDoc(collection(db, 'analytics_events'), {
        eventName,
        category,
        timestamp: new Date().toISOString(),
        userEmail: currentUser?.email || 'anonymous@lusail.qa'
      });
    } catch (err) {
      console.warn('Analytics logging bypassed:', err);
    }
  };

  const handleToggleOffline = async () => {
    try {
      if (isOnline) {
        await disableNetwork(db);
        setIsOnline(false);
        setOfflineStatusMsg('Offline Mode Activated. Operations cached in IndexedDB.');
        logAnalyticsEvent('offline_persistence_enabled', 'Firebase System');
      } else {
        await enableNetwork(db);
        setIsOnline(true);
        setOfflineStatusMsg('Back online. Resynchronized localized changes.');
        logAnalyticsEvent('offline_persistence_synchronized', 'Firebase System');
      }
    } catch (err) {
      console.error('Failed to adjust networking state:', err);
    }
  };

  const handleUpdateConfig = async (key: string, value: any) => {
    try {
      const configDocRef = doc(db, 'remote_config', 'stadium_settings');
      await updateDoc(configDocRef, { [key]: value, lastUpdated: new Date().toISOString() });
      logAnalyticsEvent(`remote_config_${key}_altered`, 'Remote Config');
    } catch (err) {
      setRemoteConfig(prev => ({ ...prev, [key]: value }));
    }
  };

  const handleSimulatedUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFileName.trim()) return;
    setIsUploading(true);
    await new Promise(r => setTimeout(r, 1200));
    try {
      await addDoc(collection(db, 'cloud_storage_metadata'), {
        name: newFileName,
        size: newFileSize,
        category: newFileCategory,
        uploadedBy: currentUser?.displayName || currentUser?.email || 'Anonymous Operator',
        uploadedAt: new Date().toISOString(),
        downloadUrl: 'https://firebasestorage.googleapis.com/v0/b/gen-lang-client-0043247146.firebasestorage.app/o/simulated'
      });
      logAnalyticsEvent(`storage_upload_${newFileName}`, 'Cloud Storage');
      setNewFileName('');
      setIsUploading(false);
    } catch (err) {
      setIsUploading(false);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessageText.trim()) return;
    try {
      await addDoc(collection(db, 'messaging_alerts'), {
        text: newMessageText,
        urgency: newMessageUrgency,
        sentAt: new Date().toISOString(),
        sender: currentUser?.email || 'Operations Admin'
      });
      logAnalyticsEvent(`push_alert_broadcasted`, 'Cloud Messaging');
      setNewMessageText('');
    } catch (err) {
      console.error('Failed sending push alert:', err);
    }
  };

  const handleTriggerCloudFunction = async (funcId: string, funcName: string) => {
    setIsExecutingFunction(funcId);
    await new Promise(r => setTimeout(r, 1400));
    try {
      let result = 'Execution successful.';
      if (funcId === 'ocr-opt') result = 'OCR Translation latency optimized by 28%.';
      else if (funcId === 'predictive-hvac') result = `HVAC loads correlated. Cooling standard: ${remoteConfig.coolingHvacThreshold}°C.`;
      else if (funcId === 'steward-sla') result = 'Triggered dispatch notifications to standby nodes.';

      await addDoc(collection(db, 'cloud_functions_log'), {
        functionName: funcName,
        status: 'OK 200',
        executedAt: new Date().toISOString(),
        durationMs: Math.floor(Math.random() * 240) + 120,
        memoryUsedMb: Math.floor(Math.random() * 64) + 128,
        output: result,
        triggeredBy: currentUser?.email || 'SaaS Mainframe Client'
      });
    } finally {
      setIsExecutingFunction(null);
    }
  };

  const handleManualReSeed = async () => {
    setSeedingInProgress(true);
    await seedInitialStadiumData();
    setSeedingInProgress(false);
    setSeedSuccessMsg('Mainframe database re-synchronized.');
    logAnalyticsEvent('database_manually_reseeded', 'Firebase System');
    setTimeout(() => setSeedSuccessMsg(''), 5000);
  };

  const handleDeployRules = () => {
    setDeployRulesSuccess(true);
    logAnalyticsEvent('security_rules_deployed', 'Security Rules');
    setTimeout(() => setDeployRulesSuccess(false), 5000);
  };

  const handleDestructiveReset = async () => {
    if (!window.confirm('Wipe and re-seed all collections?')) return;
    setSeedingInProgress(true);
    await seedInitialStadiumData();
    setSeedingInProgress(false);
  };

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    try {
      if (isRegisterMode) {
        await registerWithEmail(authEmail, authPassword, authName, authRole);
        logAnalyticsEvent('user_register', 'Authentication');
      } else {
        await loginWithEmail(authEmail, authPassword);
        logAnalyticsEvent('user_login', 'Authentication');
      }
    } catch (err: any) {
      setAuthError(err.message || 'Authentication error.');
    }
  };

  return (
    <div className="space-y-12 pb-24">
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 border-b border-void-600/10 pb-10">
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-neon-cyan-500/10 border border-neon-cyan-500/20 rounded-xl">
              <Flame className="w-5 h-5 text-neon-cyan-400 fill-neon-cyan-400/20 animate-pulse" />
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] font-mono font-bold text-neon-cyan-500 uppercase tracking-[0.2em]">Enterprise Core</span>
              <h1 className="text-4xl font-display font-bold text-white tracking-tight">Cloud Architecture Matrix</h1>
            </div>
          </div>
          <p className="text-void-400 text-sm max-w-xl leading-relaxed">
            Centralized orchestration for Lusail Stadium's Firebase infrastructure. Manage global state, real-time telemetry, and secure edge node authentication.
          </p>
        </div>

        <div className="flex flex-wrap gap-4">
          <button
            onClick={handleManualReSeed}
            disabled={seedingInProgress}
            className="px-5 py-3 glass-panel hover:border-neon-cyan-500/50 text-xs font-bold text-white transition-all flex items-center gap-3 disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 text-neon-cyan-400 ${seedingInProgress ? 'animate-spin' : ''}`} />
            SYNCHRONIZE MAINFRAME
          </button>
          
          <button
            onClick={handleDestructiveReset}
            className="px-5 py-3 bg-state-danger-bg/10 hover:bg-state-danger-bg/20 border border-state-danger-text/20 text-state-danger-text font-bold text-xs uppercase transition-all rounded-xl"
          >
            DESTRUCTIVE RESET
          </button>
        </div>
      </div>

      {seedSuccessMsg && (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="p-4 rounded-xl bg-state-success-bg/10 border border-state-success-text/20 text-state-success-text text-sm font-bold flex items-center gap-3">
          <CheckCircle2 className="w-5 h-5" />
          {seedSuccessMsg}
        </motion.div>
      )}

      {/* Top Panels Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <OfflinePersistencePanel 
          isOnline={isOnline} 
          offlineStatusMsg={offlineStatusMsg} 
          handleToggleOffline={handleToggleOffline} 
        />
        <AuthPanel 
          currentUser={currentUser}
          userProfile={userProfile}
          logout={logout}
          authEmail={authEmail}
          setAuthEmail={setAuthEmail}
          authPassword={authPassword}
          setAuthPassword={setAuthPassword}
          authName={authName}
          setAuthName={setAuthName}
          authRole={authRole}
          setAuthRole={setAuthRole}
          isRegisterMode={isRegisterMode}
          setIsRegisterMode={setIsRegisterMode}
          authError={authError}
          handleAuthSubmit={handleAuthSubmit}
        />
        <SecurityStatusPanel />
      </div>

      {/* Main Console Operations */}
      <div className="glass-panel overflow-hidden border-void-600/10 shadow-2xl">
        {/* Sub-navigation Tabs */}
        <div className="bg-void-950/80 px-8 py-5 border-b border-void-600/15 flex flex-wrap justify-between items-center gap-6">
          <div className="flex items-center gap-3">
             <div className="p-1.5 bg-void-900 border border-void-700 rounded-lg">
              <Database className="w-4 h-4 text-neon-cyan-500" />
            </div>
            <span className="text-[11px] font-mono font-bold text-void-500 tracking-widest uppercase">Console_Kernel_v4.2</span>
          </div>

          <div className="flex flex-wrap gap-2 p-1 bg-void-900/50 rounded-2xl border border-void-700/30 overflow-x-auto max-w-full">
            {[
              { id: 'remote_config', label: 'Remote Config', icon: Sliders },
              { id: 'firestore', label: 'Firestore', icon: Database },
              { id: 'storage', label: 'Storage', icon: HardDrive },
              { id: 'functions', label: 'Functions', icon: Terminal },
              { id: 'messaging', label: 'Messaging', icon: Bell },
              { id: 'security', label: 'Security', icon: Shield }
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeConsoleTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveConsoleTab(tab.id as any)}
                  className={`px-4 py-2.5 rounded-xl text-[11px] font-bold uppercase transition-all flex items-center gap-2.5 flex-shrink-0 ${
                    isActive 
                      ? 'bg-void-800 text-white border border-void-600/50 shadow-lg' 
                      : 'text-void-500 hover:text-void-300'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-neon-cyan-400' : 'text-void-600'}`} />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Tab Viewports */}
        <div className="p-8 min-h-[500px] bg-void-900/20">
          <AnimatePresence mode="wait">
            {activeConsoleTab === 'remote_config' && (
              <RemoteConfigTab 
                remoteConfig={remoteConfig} 
                isConfigLoading={isConfigLoading} 
                handleUpdateConfig={handleUpdateConfig} 
              />
            )}
            {activeConsoleTab === 'firestore' && (
              <FirestoreTab analyticsEvents={analyticsEvents} />
            )}
            {activeConsoleTab === 'storage' && (
              <StorageTab 
                storageItems={storageItems}
                newFileName={newFileName}
                setNewFileName={setNewFileName}
                newFileSize={newFileSize}
                setNewFileSize={setNewFileSize}
                newFileCategory={newFileCategory}
                setNewFileCategory={setNewFileCategory}
                isUploading={isUploading}
                handleSimulatedUpload={handleSimulatedUpload}
              />
            )}
            {activeConsoleTab === 'functions' && (
              <FunctionsTab 
                functionsLogs={functionsLogs}
                isExecutingFunction={isExecutingFunction}
                handleTriggerCloudFunction={handleTriggerCloudFunction}
              />
            )}
            {activeConsoleTab === 'messaging' && (
              <MessagingTab 
                messagingAlerts={messagingAlerts}
                newMessageText={newMessageText}
                setNewMessageText={setNewMessageText}
                newMessageUrgency={newMessageUrgency}
                setNewMessageUrgency={setNewMessageUrgency}
                handleSendMessage={handleSendMessage}
              />
            )}
            {activeConsoleTab === 'security' && (
              <SecurityTab 
                rawSecurityRules={rawSecurityRules}
                deployRulesSuccess={deployRulesSuccess}
                handleDeployRules={handleDeployRules}
                compoundIndexes={compoundIndexes}
              />
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
