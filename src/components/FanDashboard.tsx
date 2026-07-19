import React, { useState, useEffect, useRef, lazy, Suspense } from "react";
import { motion, AnimatePresence } from "motion/react";

// Lucide Icons
import {
  Sparkles,
  Languages,
  Volume2,
  VolumeX,
  Accessibility,
  Wifi,
} from "lucide-react";

// Sub-component Imports
import { FanTicketPanel } from "./FanDashboardComponents/FanTicketPanel";
import { LiveMatchStatus } from "./FanDashboardComponents/LiveMatchStatus";
import { SeatVisualizer } from "./FanDashboardComponents/SeatVisualizer";
import { ParkingManager } from "./FanDashboardComponents/ParkingManager";
import { ConcessionsPanel } from "./FanDashboardComponents/ConcessionsPanel";
import { RestroomTracker } from "./FanDashboardComponents/RestroomTracker";
import { AIGeminiConcierge } from "./FanDashboardComponents/AIGeminiConcierge";
import { EmergencySOS } from "./FanDashboardComponents/EmergencySOS";

const InteractiveStadiumMap = lazy(() => import("./InteractiveStadiumMap"));

// Translations mapping
const translations = {
  en: {
    dashboardTitle: "Premium Fan Hub",
    dashboardDesc: "Lusail Stadium VIP Spectator Experience",
    dynamicIslandLabel: "Dynamic Island Active",
    aiAssistant: "StadiumMind AI Assistant",
    aiPlaceholder: "Ask about concessions, restrooms, gates...",
    liveMatch: "El Clásico - Match Live",
    matchDetails: "65th Minute • Spectator Decibel Meter",
    ticketTitle: "Spectator Pass",
    seatTitle: "Tactical Seat Simulator",
    seatDesc: "Live pitch perspective from Section 108",
    navigationTitle: "Stadium Access Wayfinding",
    parkingTitle: "VIP Parking Allocator",
    foodTitle: "Concession Bites Finder",
    restroomTitle: "Restroom Queue-Buster",
    emergencyTitle: "Emergency Steward Dispatch",
    accessibilityTitle: "Accessibility Panel",
    languageSwitch: "Switch Language",
    addWallet: "Add to Apple Wallet",
    addedWallet: "Added to Wallet ✓",
    flipCard: "Tap to view Policies",
    reserveParking: "Reserve Spot & Get Pass",
    parkingPassTitle: "Digital Parking Pass",
    orderFood: "Proceed to Checkout",
    queueCleared: "We will notify you when the queue drops below 3 min.",
    emergencyBtn: "Hold 3s to Dispatch Help",
    emergencyTriggered: "Steward Dispatch Activated!",
    cheerBtn: "Stadium Crowd Cheer (+5 dB)",
    soundSpeak: "Toggle Assistive Audio Voiceover",
  },
  ar: {
    dashboardTitle: "البوابة الرقمية للمشجعين",
    dashboardDesc: "تجربة كبار الشخصيات في استاد لوسيل",
    dynamicIslandLabel: "الجزيرة التفاعلية نشطة",
    aiAssistant: "مساعد الذكاء الاصطناعي",
    aiPlaceholder: "اسأل عن المطاعم، دورات المياه، البوابات...",
    liveMatch: "الكلاسيكو - مباشر",
    matchDetails: "الدقيقة 65 • مقياس صخب الجمهور",
    ticketTitle: "تذكرة المشجع",
    seatTitle: "محاكي المقعد التكتيكي",
    seatDesc: "منظور حي للملعب من القسم 108",
    navigationTitle: "التوجيه والوصول إلى الاستاد",
    parkingTitle: "مخصص مواقف كبار الشخصيات",
    foodTitle: "باحث منافذ الأطعمة والمشروبات",
    restroomTitle: "مراقب طوابير دورات المياه",
    emergencyTitle: "استدعاء طاقم التنظيم العاجل",
    accessibilityTitle: "لوحة تسهيل الوصول",
    languageSwitch: "تغيير اللغة",
    addWallet: "إضافة إلى محفظة آبل",
    addedWallet: "تمت الإضافة ✓",
    flipCard: "انقر لعرض السياسات",
    reserveParking: "حجز موقف والحصول على التصريح",
    parkingPassTitle: "تصريح مواقف رقمي",
    orderFood: "إتمام عملية الطلب والشرء",
    queueCleared: "سنقوم بتنبيهك عندما يقل وقت الانتظار عن 3 دقائق.",
    emergencyBtn: "اضغط 3 ثوانٍ لطلب المساعدة",
    emergencyTriggered: "تم تفعيل استدعاء المنظمين!",
    cheerBtn: "هتاف الجمهور (+5 ديسيبل)",
    soundSpeak: "تفعيل التوجيه الصوتي المساعد",
  },
  es: {
    dashboardTitle: "Portal Fan Premium",
    dashboardDesc: "Experiencia VIP del Espectador en Lusail",
    dynamicIslandLabel: "Dynamic Island Activo",
    aiAssistant: "Asistente AI StadiumMind",
    aiPlaceholder: "Pregunta sobre comida, baños, accesos...",
    liveMatch: "El Clásico - Partido en Vivo",
    matchDetails: "Minuto 65 • Decibelímetro del Estadio",
    ticketTitle: "Pase de Espectador",
    seatTitle: "Simulador de Asiento Táctico",
    seatDesc: "Perspectiva de campo en vivo desde la Sec. 108",
    navigationTitle: "Navegación de Accesos",
    parkingTitle: "Localizador de Estacionamiento VIP",
    foodTitle: "Buscador de Concesiones",
    restroomTitle: "Control de Colas de Baño",
    emergencyTitle: "Despacho de Emergencia de Auxiliares",
    accessibilityTitle: "Panel de Accesibilidad",
    languageSwitch: "Cambiar Idioma",
    addWallet: "Añadir a Apple Wallet",
    addedWallet: "Añadido a Wallet ✓",
    flipCard: "Toque para ver políticas de seguridad",
    reserveParking: "Reservar plaza y obtener pase",
    parkingPassTitle: "Pase Digital de Parking",
    orderFood: "Proceder al Pago",
    queueCleared: "Le notificaremos cuando la fila baje de 3 min.",
    emergencyBtn: "Mantenga 3s para Solicitar Ayuda",
    emergencyTriggered: "¡Despacho de Auxiliares Activado!",
    cheerBtn: "Animar al equipo (+5 dB)",
    soundSpeak: "Activar descripción de audio asistida",
  }
};

interface FanDashboardProps {
  onAddStewardTask: (task: { title: string; zone: string; urgency: string }) => void;
  broadcastHistory: string[];
}

export default function FanDashboard({ onAddStewardTask, broadcastHistory }: FanDashboardProps) {
  // Config & Localization
  const [lang, setLang] = useState<"en" | "ar" | "es">("en");
  const t = translations[lang];

  // Active view tab state
  const [activeFanView, setActiveFanView] = useState<"services" | "map">("services");

  // Global Accessibility States
  const [isHighContrast, setIsHighContrast] = useState(false);
  const [isAudioEnabled, setIsAudioEnabled] = useState(false);
  const [lastSpeechText, setLastSpeechText] = useState<string>("");

  // Dynamic Island States
  const [dynamicIslandState, setDynamicIslandState] = useState<"compact" | "expanded" | "emergency" | "order" | "match">("compact");
  const [islandText, setIslandText] = useState("65' • RM 1 - 0 BAR");
  const [islandSubtext, setIslandSubtext] = useState("Stadium Atmosphere is Electrifying");

  // Wallet Cards States
  const [isTicketFlipped, setIsTicketFlipped] = useState(false);
  const [isAddedToWallet, setIsAddedToWallet] = useState(false);
  const [isParkingReserved, setIsParkingReserved] = useState(false);
  const [selectedLot, setSelectedLot] = useState("Lot C");
  const [parkingSpacesLeft, setParkingSpacesLeft] = useState({ "Lot A": 4, "Lot B": 18, "Lot C": 12 });

  // Match Decibel Meter State
  const [decibelLevel, setDecibelLevel] = useState(94);
  const [isCheering, setIsCheering] = useState(false);

  // Seat Card States
  const [selectedRow, setSelectedRow] = useState("Row L");
  const [selectedSeat, setSelectedSeat] = useState("14");
  const [seatArView, setSeatArView] = useState(false);

  // Concessions Food Order State
  const [foodCategory, setFoodCategory] = useState<"all" | "halal" | "vegan" | "drinks">("all");
  const [cart, setCart] = useState<{ [key: string]: number }>({});
  const [orderStatus, setOrderStatus] = useState<"none" | "paying" | "preparing" | "ready">("none");
  const [orderId, setOrderId] = useState("");

  const foodItems = [
    { id: "burger", name: "Stadium Deluxe Burger", price: 12.0, tag: "halal", desc: "Premium certified Halal Angus beef" },
    { id: "veggie", name: "Plant-Powered Burger", price: 11.5, tag: "vegan", desc: "100% plant protein, dairy-free bun" },
    { id: "hydration", name: "Tactical Hydration Shake", price: 6.0, tag: "vegan", desc: "Electrolyte rich citrus fusion" },
    { id: "coffee", name: "Lusail Signature Coffee", price: 4.5, tag: "halal", desc: "Cardamom-infused dark roast" },
  ];

  // Restroom Queue States
  const [restrooms, setRestrooms] = useState([
    { block: "Block 102 (Men)", wait: 12, size: "High", status: "crowded" },
    { block: "Block 104 (Accessible/Family)", wait: 0, size: "None", status: "empty" },
    { block: "Block 108 (Women)", wait: 1, size: "Low", status: "empty" },
    { block: "Block 110 (All-Gender/Family)", wait: 2, size: "Low", status: "empty" },
  ]);
  const [notifiedRestroom, setNotifiedRestroom] = useState<string | null>(null);

  // AI Concierge Chatbot States
  const [aiInput, setAiInput] = useState("");
  const [aiChat, setAiChat] = useState([
    { sender: "assistant", text: "Hello! I am StadiumMind AI, your smart premium match concierge. Ask me anything about Section 108 amenities, concessions, or rapid restroom routes!" }
  ]);
  const [isAiThinking, setIsAiThinking] = useState(false);

  // Emergency SOS dispatch States
  const [emergencyType, setEmergencyType] = useState("Medical Incident");
  const [sosProgress, setSosProgress] = useState(0);
  const [isSosPressing, setIsSosPressing] = useState(false);
  const [isSosActive, setIsSosActive] = useState(false);
  const sosTimerRef = useRef<NodeJS.Timeout | null>(null);

  const speakAssistText = (text: string) => {
    if (!isAudioEnabled) return;
    try {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = lang === "ar" ? "ar-SA" : lang === "es" ? "es-ES" : "en-US";
      window.speechSynthesis.speak(utterance);
      setLastSpeechText(text);
    } catch (e) {
      console.warn("Speech synthesis error", e);
    }
  };

  useEffect(() => {
    if (broadcastHistory && broadcastHistory.length > 0) {
      const latestAnn = broadcastHistory[0];
      setDynamicIslandState("emergency");
      setIslandText("CRITICAL ADVISORY");
      setIslandSubtext(latestAnn);
      speakAssistText(`Critical advisory: ${latestAnn}`);
    }
  }, [broadcastHistory]);

  useEffect(() => {
    const interval = setInterval(() => {
      setDecibelLevel(prev => {
        const base = isCheering ? 104 : 92;
        const jitter = Math.floor(Math.random() * 5) - 2;
        return Math.max(80, Math.min(120, base + jitter));
      });
    }, 2000);
    return () => clearInterval(interval);
  }, [isCheering]);

  const handleCheerPress = () => {
    setIsCheering(true);
    setDecibelLevel(115);
    speakAssistText("Stadium cheer activated! Crowd volume rising!");
    setDynamicIslandState("match");
    setIslandText("⚡ STADIUM DECIBELS MAXED");
    setIslandSubtext("Crowd activity recorded at 115 dB!");
    setTimeout(() => {
      setIsCheering(false);
      setDynamicIslandState("compact");
    }, 4000);
  };

  const handleAiSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiInput.trim()) return;

    const userMsg = aiInput;
    setAiInput("");
    setAiChat(prev => [...prev, { sender: "user", text: userMsg }]);
    setIsAiThinking(true);
    speakAssistText(`Querying stadium assistant for ${userMsg}`);

    try {
      const response = await fetch("/api/gemini/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: userMsg,
          language: lang,
          context: {
            userSeat: `Sec 108, Row L, Seat 14`,
            userRole: "VIP Fan",
            currentMatch: "Real Madrid vs FC Barcelona",
            activeLot: selectedLot,
            currentOrderStatus: orderStatus
          }
        })
      });

      const data = await response.json();
      setAiChat(prev => [...prev, { sender: "assistant", text: data.response }]);
      speakAssistText(data.response);
    } catch (err) {
      setAiChat(prev => [...prev, { sender: "assistant", text: "I encountered a minor network handshake issue, but according to local caching: Section 108 has dedicated accessible pathways." }]);
    } finally {
      setIsAiThinking(false);
    }
  };

  const startSosPress = () => {
    setIsSosPressing(true);
    setSosProgress(0);
    speakAssistText("Initiating emergency steward call. Keep pressing.");
    
    let count = 0;
    sosTimerRef.current = setInterval(() => {
      count += 10;
      setSosProgress(count);
      if (count >= 100) {
        clearInterval(sosTimerRef.current!);
        triggerSosEmergency();
      }
    }, 300);
  };

  const cancelSosPress = () => {
    if (sosTimerRef.current) clearInterval(sosTimerRef.current);
    if (!isSosActive && isSosPressing) {
      setIsSosPressing(false);
      setSosProgress(0);
      speakAssistText("Emergency call cancelled.");
    }
  };

  const triggerSosEmergency = () => {
    setIsSosActive(true);
    setIsSosPressing(false);
    onAddStewardTask({
      title: `🚨 EMERGENCY: VIP Fan dispatch trigger (${emergencyType})`,
      zone: `Section 108, Row L, Seat 14`,
      urgency: "high"
    });
    setDynamicIslandState("emergency");
    setIslandText("SOS ALERT ACTIVE");
    setIslandSubtext(`Stewards dispatched to Sec 108!`);
    speakAssistText(`Emergency steward dispatch activated. Help is on the way to Section 108.`);
  };

  const resetSosEmergency = () => {
    setIsSosActive(false);
    setSosProgress(0);
    setDynamicIslandState("compact");
    speakAssistText("Emergency cleared. Returning to default telemetry.");
  };

  const handleFoodCheckout = () => {
    const totalQty = (Object.values(cart) as number[]).reduce((a, b) => a + b, 0);
    if (totalQty === 0) return;

    setOrderStatus("paying");
    speakAssistText("Processing secure digital crowd payment.");

    setTimeout(() => {
      const randId = `LSL-${Math.floor(Math.random() * 9000) + 1000}`;
      setOrderId(randId);
      setOrderStatus("preparing");
      setDynamicIslandState("order");
      setIslandText(`PREPARING ORDER: ${randId}`);
      setIslandSubtext("Your food is being crafted in concession Sector B!");
      speakAssistText(`Payment complete! Order ${randId} is preparing.`);
      setTimeout(() => {
        setOrderStatus("ready");
        setDynamicIslandState("order");
        setIslandText(`ORDER READY: ${randId}`);
        setIslandSubtext("Collect instantly from Sector B (FAST-PASS QR code active)");
        speakAssistText(`Order ${randId} is ready for pick up!`);
      }, 8000);
    }, 2000);
  };

  const modifyCart = (itemId: string, val: number) => {
    setCart(prev => {
      const current = prev[itemId] || 0;
      const next = Math.max(0, current + val);
      return { ...prev, [itemId]: next };
    });
  };

  const getCartTotal = () => {
    return (Object.entries(cart) as [string, number][]).reduce((total, [id, qty]) => {
      const item = foodItems.find(f => f.id === id);
      return total + (item ? item.price * qty : 0);
    }, 0);
  };

  const handleReserveParking = () => {
    setIsParkingReserved(true);
    setParkingSpacesLeft(prev => ({
      ...prev,
      [selectedLot]: Math.max(0, prev[selectedLot as keyof typeof prev] - 1)
    }));
    setDynamicIslandState("match");
    setIslandText(`PARKING SECURED: ${selectedLot}`);
    setIslandSubtext(`Digital barcode active for fast-pass gate entry`);
    speakAssistText(`Parking slot secured at ${selectedLot}. Pass added to your digital ticket stack.`);
  };

  return (
    <div className={`space-y-6 ${isHighContrast ? "contrast-125" : ""}`} id="fanDashboardRoot">
      {/* 1. DYNAMIC ISLAND INTEGRATION */}
      <div className="flex justify-center w-full sticky top-0 z-50 py-2">
        <motion.div
          layout
          initial={{ borderRadius: 30 }}
          animate={{
            width: dynamicIslandState === "compact" ? "240px" : "96%",
            height: dynamicIslandState === "compact" ? "42px" : "130px",
            backgroundColor: dynamicIslandState === "emergency" ? "#991b1b" : "#020205",
            border: dynamicIslandState === "emergency" ? "1px solid #ef4444" : "1px solid #1e293b",
          }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
          className="relative text-white flex flex-col justify-between overflow-hidden shadow-2xl cursor-pointer group hover:scale-[1.01]"
          onClick={() => setDynamicIslandState(dynamicIslandState === "compact" ? "match" : "compact")}
        >
          <div className="p-3.5 h-full flex flex-col justify-between">
            <div className="flex justify-between items-center w-full">
              <div className="flex items-center gap-2.5">
                <div className="w-5 h-5 rounded-full bg-neon-blue-500/20 border border-neon-blue-500/40 flex items-center justify-center">
                  <span className={`w-2 h-2 rounded-full ${dynamicIslandState === "emergency" ? "bg-red-400 animate-ping" : "bg-neon-cyan-400 animate-pulse"}`} />
                </div>
                <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-void-300">
                  {t.dynamicIslandLabel}
                </span>
              </div>
              <div className="flex items-center gap-1.5 font-mono text-[10px] text-neon-cyan-300">
                <Wifi className="w-3.5 h-3.5" />
                <span>STADIUM_5G</span>
              </div>
            </div>

            {dynamicIslandState !== "compact" && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center mt-2 border-t border-void-600/10 pt-2">
                <div>
                  <h4 className="text-sm font-display font-bold tracking-tight text-white">{islandText}</h4>
                  <p className="text-[10px] text-void-400 font-mono mt-0.5 truncate">{islandSubtext}</p>
                </div>
                <div className="flex justify-end gap-2">
                  <button onClick={(e) => { e.stopPropagation(); setDynamicIslandState("compact"); }} className="px-2.5 py-1 rounded bg-void-800 text-[10px] text-void-300 uppercase">Minimize</button>
                  {dynamicIslandState === "emergency" && <button onClick={(e) => { e.stopPropagation(); resetSosEmergency(); }} className="px-2.5 py-1 rounded bg-red-600 text-[10px] text-white uppercase font-bold">Clear Alarm</button>}
                </div>
              </motion.div>
            )}
          </div>
        </motion.div>
      </div>

      {/* HEADER CONTROLS */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-void-600/15 pb-4">
        <div>
          <h2 className="font-display font-bold text-2xl tracking-tight text-white flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-neon-cyan-400" />
            {t.dashboardTitle}
          </h2>
          <p className="text-void-400 text-xs mt-1">{t.dashboardDesc}</p>
        </div>

        <div className="flex flex-wrap gap-2.5">
          <div className="flex items-center gap-1.5 bg-void-850 border border-void-600/30 rounded-xl px-2.5 py-1.5">
            <Languages className="w-3.5 h-3.5 text-neon-blue-400" />
            <select value={lang} onChange={(e) => setLang(e.target.value as any)} className="bg-transparent text-white text-xs focus:outline-none cursor-pointer">
              <option value="en" className="bg-void-900">English (EN)</option>
              <option value="ar" className="bg-void-900">العربية (AR)</option>
              <option value="es" className="bg-void-900">Español (ES)</option>
            </select>
          </div>
          <button onClick={() => setIsAudioEnabled(!isAudioEnabled)} className={`p-2 rounded-xl border transition-all ${isAudioEnabled ? "bg-neon-cyan-500/10 border-neon-cyan-500 text-neon-cyan-400" : "bg-void-850 border-void-600/30 text-void-400"}`}>
            {isAudioEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>
          <button onClick={() => setIsHighContrast(!isHighContrast)} className={`p-2 rounded-xl border transition-all ${isHighContrast ? "bg-neon-purple-500/10 border-neon-purple-500 text-neon-purple-400" : "bg-void-850 border-void-600/30 text-void-400"}`}>
            <Accessibility className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* VIEW TABS */}
      <div className="flex border-b border-void-600/10 mb-6 gap-6">
        <button onClick={() => setActiveFanView("services")} className={`pb-3 text-sm font-display font-bold border-b-2 transition-all ${activeFanView === "services" ? "border-neon-cyan-500 text-white" : "border-transparent text-void-400"}`}>🎟️ Services</button>
        <button onClick={() => setActiveFanView("map")} className={`pb-3 text-sm font-display font-bold border-b-2 transition-all ${activeFanView === "map" ? "border-neon-cyan-500 text-white" : "border-transparent text-void-400"}`}>🗺️ Stadium Map</button>
      </div>

      <AnimatePresence mode="wait">
        {activeFanView === "services" ? (
          <motion.div key="services" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -15 }} className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start w-full">
            <div className="lg:col-span-4 space-y-6">
              <FanTicketPanel isTicketFlipped={isTicketFlipped} setIsTicketFlipped={setIsTicketFlipped} isAddedToWallet={isAddedToWallet} setIsAddedToWallet={setIsAddedToWallet} selectedRow={selectedRow} selectedSeat={selectedSeat} t={t} speakAssistText={speakAssistText} />
              <LiveMatchStatus decibelLevel={decibelLevel} isCheering={isCheering} handleCheerPress={handleCheerPress} t={t} />
            </div>
            <div className="lg:col-span-8 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <SeatVisualizer selectedRow={selectedRow} setSelectedRow={setSelectedRow} selectedSeat={selectedSeat} setSelectedSeat={setSelectedSeat} seatArView={seatArView} setSeatArView={setSeatArView} t={t} speakAssistText={speakAssistText} />
                <ParkingManager isParkingReserved={isParkingReserved} selectedLot={selectedLot} setSelectedLot={setSelectedLot} parkingSpacesLeft={parkingSpacesLeft} handleReserveParking={handleReserveParking} t={t} />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <ConcessionsPanel foodCategory={foodCategory} setFoodCategory={setFoodCategory} cart={cart} modifyCart={modifyCart} getCartTotal={getCartTotal} orderStatus={orderStatus} orderId={orderId} foodItems={foodItems} t={t} handleFoodCheckout={handleFoodCheckout} />
                <RestroomTracker restrooms={restrooms} notifiedRestroom={notifiedRestroom} setNotifiedRestroom={setNotifiedRestroom} t={t} speakAssistText={speakAssistText} />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <AIGeminiConcierge aiInput={aiInput} setAiInput={setAiInput} aiChat={aiChat} isAiThinking={isAiThinking} handleAiSubmit={handleAiSubmit} t={t} />
                <EmergencySOS emergencyType={emergencyType} setEmergencyType={setEmergencyType} sosProgress={sosProgress} isSosPressing={isSosPressing} isSosActive={isSosActive} startSosPress={startSosPress} cancelSosPress={cancelSosPress} resetSosEmergency={resetSosEmergency} t={t} />
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div key="map" initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.98 }} className="w-full">
            <Suspense fallback={<div className="h-[600px] bg-void-900 animate-pulse rounded-3xl" />}>
              <InteractiveStadiumMap userSeat={`${selectedRow}, Seat ${selectedSeat}`} selectedLot={selectedLot} />
            </Suspense>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
