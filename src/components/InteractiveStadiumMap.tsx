import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  ZoomIn,
  ZoomOut,
  Compass,
  MapPin,
  Layers,
  X,
  Search,
  Plus,
  Minus,
  RefreshCw,
  Utensils,
  Car,
  Clock,
  ShieldAlert,
  Info,
  Navigation,
  Sparkles,
  Award,
  AlertTriangle,
  Locate,
  Accessibility,
  Flame,
  UserCheck,
  CheckCircle2
} from "lucide-react";

// Points of Interest Types
export interface MapPOI {
  id: string;
  name: string;
  category: "food" | "toilet" | "medical" | "parking" | "gate" | "seat";
  icon: string;
  x: number; // coordinate x inside 1000x600 viewBox
  y: number; // coordinate y inside 1000x600 viewBox
  crowdLevel: "low" | "medium" | "high" | "peak";
  waitMinutes?: number;
  description: string;
  details: {
    statusText: string;
    metrics: string;
    photoUrl?: string;
    amenities?: string[];
  };
}

interface InteractiveStadiumMapProps {
  userSeat?: string; // e.g. "Sec 108, Row L, Seat 14"
  selectedLot?: string;
  onSeatSelect?: (row: string, seat: string) => void;
}

export default function InteractiveStadiumMap({
  userSeat = "Sec 108, Row L, Seat 14",
  selectedLot = "Lot C",
  onSeatSelect
}: InteractiveStadiumMapProps) {
  // Map Interactions & Layers
  const [zoom, setZoom] = useState<number>(1.1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  
  // Layers State
  const [activeLayer, setActiveLayer] = useState<"blueprint" | "heatmap" | "density" | "routes">("blueprint");
  const [selectedFilter, setSelectedFilter] = useState<string>("all"); // 'all', 'food', 'toilet', 'medical', 'parking', 'gate', 'seat'
  
  // Selected POI in Focus (Google Maps style card)
  const [selectedPOI, setSelectedPOI] = useState<MapPOI | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeRouteId, setActiveRouteId] = useState<string | null>(null);

  // Seat Highlighting Coordination
  const [highlightedRow, setHighlightedRow] = useState("Row L");
  const [highlightedSeat, setHighlightedSeat] = useState("14");
  const [isSeatPulseActive, setIsSeatPulseActive] = useState(true);

  // Live Simulation state
  const [crowdMultiplier, setCrowdMultiplier] = useState(1.0);
  const [isSimulatingRush, setIsSimulatingRush] = useState(false);
  const [lastTelemetryUpdate, setLastTelemetryUpdate] = useState<string>("Just now");

  // Map container reference for event capturing
  const mapContainerRef = useRef<HTMLDivElement>(null);

  // Points of Interest Data List
  const [pois, setPois] = useState<MapPOI[]>([
    // Gates
    {
      id: "gate-a",
      name: "Gate A (North Entrance)",
      category: "gate",
      icon: "🚧",
      x: 500,
      y: 60,
      crowdLevel: "low",
      waitMinutes: 3,
      description: "Direct walkway to Sectors 101-104. Seamless biometric scanning active.",
      details: {
        statusText: "Optimal Inflow Rate",
        metrics: "124 spectators/min • 98.6% match speed",
        amenities: ["Self-Service Kiosks", "Priority Lane", "Bag Deposit"]
      }
    },
    {
      id: "gate-b",
      name: "Gate B (East Concourse)",
      category: "gate",
      icon: "🚧",
      x: 880,
      y: 300,
      crowdLevel: "high",
      waitMinutes: 12,
      description: "Primary entrance gateway from transit loop. High current spectator inflow.",
      details: {
        statusText: "Minor Queue Bottleneck",
        metrics: "280 spectators/min • CrowdMind AI suggests rerouting to Gate C",
        amenities: ["Volunteers Station", "Fast-Track Pass", "Face Scanner"]
      }
    },
    {
      id: "gate-c",
      name: "Gate C (South Main)",
      category: "gate",
      icon: "🚧",
      x: 500,
      y: 540,
      crowdLevel: "medium",
      waitMinutes: 5,
      description: "General admission Gate South with direct taxi/rideshare lane drop-off.",
      details: {
        statusText: "Steady Operations",
        metrics: "155 spectators/min • Zero scanning latency",
        amenities: ["Security Kiosk", "Taxi Hub Link", "Accessible Ramp"]
      }
    },
    {
      id: "gate-d",
      name: "Gate D (VIP & Media)",
      category: "gate",
      icon: "🌟",
      x: 120,
      y: 300,
      crowdLevel: "low",
      waitMinutes: 1,
      description: "Exclusive portal for Platinum tickets, media credentials, and club members.",
      details: {
        statusText: "Instant Clearance",
        metrics: "18 spectators/min • Elite air-conditioned lounge access",
        amenities: ["Valet Service", "Concierge Butler", "Refreshments bar"]
      }
    },

    // Food Concessions
    {
      id: "food-halal-burgers",
      name: "Sector B Halal Grill",
      category: "food",
      icon: "🍔",
      x: 720,
      y: 180,
      crowdLevel: "medium",
      waitMinutes: 8,
      description: "Home of the signature Lusail Double-Stack Angus Burger. 100% Halal certified.",
      details: {
        statusText: "Moderate queue line",
        metrics: "Average ticket turnaround: 4 min • Online mobile pickup active",
        amenities: ["Mobile Order-ahead", "Vegan options", "Contactless Pay"]
      }
    },
    {
      id: "food-pizza-veg",
      name: "Sector D Stonefire Pizza",
      category: "food",
      icon: "🍕",
      x: 280,
      y: 420,
      crowdLevel: "low",
      waitMinutes: 2,
      description: "Freshly-stretched Neapolitan thin-crust slices and vegetarian specialty bakes.",
      details: {
        statusText: "Zero wait lines",
        metrics: "Fresh pies pulled every 6 minutes • Seat delivery available",
        amenities: ["Vegetarian Selection", "Gluten-Free Crust", "Beverage Dispenser"]
      }
    },
    {
      id: "food-shawarma",
      name: "Concourse West Shawarma Kiosk",
      category: "food",
      icon: "🌯",
      x: 320,
      y: 160,
      crowdLevel: "high",
      waitMinutes: 14,
      description: "Slow-roasted spiced chicken and premium beef wraps with traditional garlic toum.",
      details: {
        statusText: "High Congestion",
        metrics: "Highly popular during match intervals • Mobile ordering recommended",
        amenities: ["Traditional Spices", "Cold Draft Drinks", "Express Pick-up"]
      }
    },

    // Toilets / Restrooms
    {
      id: "toilet-sec-108",
      name: "Sector B Premium Restrooms",
      category: "toilet",
      icon: "🚻",
      x: 760,
      y: 280,
      crowdLevel: "low",
      waitMinutes: 1,
      description: "Sleek touchless restrooms located immediately behind Section 108 corridor.",
      details: {
        statusText: "Clean & Free",
        metrics: "Locker room standard • 12 fully functional vanity modules",
        amenities: ["Accessible Cubicles", "Infant Changing Deck", "Sanitizer Stations"]
      }
    },
    {
      id: "toilet-sec-112",
      name: "Section 112 Restroom Suite",
      category: "toilet",
      icon: "🚻",
      x: 240,
      y: 300,
      crowdLevel: "high",
      waitMinutes: 11,
      description: "Restroom cluster with high spectator traffic. Wait times elevated.",
      details: {
        statusText: "Heavy Line",
        metrics: "StadiumMind AI suggests visiting Section 108 Restrooms",
        amenities: ["Touchless Valves", "Accessible Sinks", "Exit Path Airflow"]
      }
    },

    // Medical
    {
      id: "medical-108",
      name: "Section 108 Emergency Post",
      category: "medical",
      icon: "🚨",
      x: 640,
      y: 200,
      crowdLevel: "low",
      waitMinutes: 0,
      description: "Fully staffed first-aid clinic with advanced life support resources.",
      details: {
        statusText: "Fully Prepared",
        metrics: "3 Paramedics on active duty • Automated Defibrillator deployed",
        amenities: ["Oxygen Therapy", "Stretcher Dispatch", "Cardiac telemetry"]
      }
    },
    {
      id: "medical-main",
      name: "Sector C Stadium Clinical Ward",
      category: "medical",
      icon: "🏥",
      x: 420,
      y: 480,
      crowdLevel: "low",
      waitMinutes: 0,
      description: "Primary diagnostic emergency center with direct ambulance transit bay link.",
      details: {
        statusText: "Standby Secure",
        metrics: "Physician-supervised • Direct emergency response link to Doha General",
        amenities: ["Trauma Bay", "Pediatric triage", "Ambulance dock"]
      }
    },

    // Parking Lots
    {
      id: "parking-lot-c",
      name: "VIP East Deck Parking Lot C",
      category: "parking",
      icon: "🚗",
      x: 840,
      y: 480,
      crowdLevel: "medium",
      waitMinutes: 4,
      description: "Premium secure outdoor multi-level garage with direct escalator access.",
      details: {
        statusText: "142 Spaces Vacant",
        metrics: "Equipped with automatic license plate readers • 22 EV rapid Chargers",
        amenities: ["EV Fast Charging", "Wheelchair accessible ramps", "License recognition"]
      }
    },
    {
      id: "parking-lot-a",
      name: "General Parking Deck Lot A",
      category: "parking",
      icon: "🚗",
      x: 180,
      y: 120,
      crowdLevel: "peak",
      waitMinutes: 25,
      description: "Main spectator parking sector located on the North Ring perimeter.",
      details: {
        statusText: "98% Capacity Reached",
        metrics: "Extreme traffic inflow • Rerouting to Overflow Zone West",
        amenities: ["Shuttle Bus to Gate A", "Bicycle Lockers", "Lost-car assistance"]
      }
    },

    // Fan Seating Highlight POI
    {
      id: "fan-seat-108",
      name: "Your Assigned VIP Seat",
      category: "seat",
      icon: "🎟️",
      x: 690,
      y: 300,
      crowdLevel: "low",
      waitMinutes: 0,
      description: "Sec 108, Row L, Seat 14. Platinum high-elevation hospitality suite.",
      details: {
        statusText: "Access Pass Confirmed",
        metrics: "Cushioned stadium armchair • Multi-view replay screen integrated",
        amenities: ["USB Charger", "Replay Screen", "Cup Heater"]
      }
    }
  ]);

  // Handle Zoom buttons
  const handleZoomIn = () => setZoom(prev => Math.min(3.5, prev + 0.25));
  const handleZoomOut = () => setZoom(prev => Math.max(0.6, prev - 0.25));
  const handleReset = () => {
    setZoom(1.1);
    setPan({ x: 0, y: 0 });
    setActiveRouteId(null);
  };

  // Recenter on user's seat coordinates
  const handleRecenterOnSeat = () => {
    const seatPoi = pois.find(p => p.category === "seat");
    if (seatPoi) {
      setZoom(1.8);
      // Map center is 500x300, so relative pan is needed to center on seat coordinates (690, 300)
      setPan({
        x: (500 - seatPoi.x) * 1.8,
        y: (300 - seatPoi.y) * 1.8
      });
      setSelectedPOI(seatPoi);
      setIsSeatPulseActive(true);
    }
  };

  // Pan Mouse Handlers (Click and Drag feel like Google Maps)
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setPan({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y
    });
  };

  const handleMouseUpOrLeave = () => {
    setIsDragging(false);
  };

  // Touch Handlers for mobile precision
  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      setIsDragging(true);
      setDragStart({
        x: e.touches[0].clientX - pan.x,
        y: e.touches[0].clientY - pan.y
      });
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || e.touches.length !== 1) return;
    setPan({
      x: e.touches[0].clientX - dragStart.x,
      y: e.touches[0].clientY - dragStart.y
    });
  };

  // Live Simulation logic
  useEffect(() => {
    const interval = setInterval(() => {
      // Fluctuate wait times and vacancy indices slightly to represent live stadium pulse
      setPois(prev => prev.map(p => {
        if (p.category === "seat" || p.category === "medical") return p;
        
        const delta = Math.random() > 0.5 ? 1 : -1;
        const currentWait = p.waitMinutes || 0;
        const nextWait = Math.max(1, currentWait + (Math.random() > 0.7 ? delta : 0));
        
        return {
          ...p,
          waitMinutes: nextWait
        };
      }));

      // Update telemetry tag
      const now = new Date();
      setLastTelemetryUpdate(`Synced at ${now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" })}`);
    }, 4500);

    return () => clearInterval(interval);
  }, []);

  // Set active route wayfinding based on selected POI
  const selectRouteToPOI = (poi: MapPOI) => {
    setActiveRouteId(poi.id);
    // Auto-expand/draw route
    try {
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
        const utter = new SpeechSynthesisUtterance(`Calculating optimal route from Section 108 to ${poi.name}. Est. walk: ${Math.round(poi.waitMinutes ? poi.waitMinutes * 0.7 : 3)} minutes.`);
        utter.volume = 0.5;
        window.speechSynthesis.speak(utter);
      }
    } catch(e){}
  };

  // Filter items matching search bar OR categories
  const filteredPOIs = pois.filter(p => {
    const matchCategory = selectedFilter === "all" || p.category === selectedFilter;
    const matchSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                        p.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCategory && matchSearch;
  });

  // Crowd Density color mapping helpers
  const getDensityColor = (level: "low" | "medium" | "high" | "peak") => {
    switch (level) {
      case "low": return "fill-emerald-500/25 stroke-emerald-400/50";
      case "medium": return "fill-yellow-500/30 stroke-yellow-400/50";
      case "high": return "fill-orange-600/40 stroke-orange-500/60";
      case "peak": return "fill-red-600/55 stroke-red-500/80 animate-pulse";
    }
  };

  // Trigger simulated Peak Rush hour
  const handleToggleRush = () => {
    setIsSimulatingRush(!isSimulatingRush);
    if (!isSimulatingRush) {
      setCrowdMultiplier(1.8);
      setPois(prev => prev.map(p => {
        if (p.id === "gate-b" || p.id === "gate-a") {
          return { ...p, crowdLevel: "peak", waitMinutes: 28 };
        }
        if (p.category === "food" || p.id === "toilet-sec-112") {
          return { ...p, crowdLevel: "high", waitMinutes: (p.waitMinutes || 5) + 8 };
        }
        return p;
      }));
    } else {
      setCrowdMultiplier(1.0);
      setPois(prev => prev.map(p => {
        if (p.id === "gate-b") return { ...p, crowdLevel: "high", waitMinutes: 12 };
        if (p.id === "gate-a") return { ...p, crowdLevel: "low", waitMinutes: 3 };
        if (p.category === "food" || p.id === "toilet-sec-112") {
          return { ...p, crowdLevel: "medium", waitMinutes: Math.max(2, (p.waitMinutes || 10) - 8) };
        }
        return p;
      }));
    }
  };

  return (
    <div className="bg-void-850 border border-void-600/35 rounded-3xl overflow-hidden shadow-2xl flex flex-col h-[680px] lg:h-[720px] relative font-sans" id="interactiveStadiumMapWidget">
      
      {/* MAP CONTROLS & HEADER SEARCH ROW */}
      <div className="p-4 bg-void-900 border-b border-void-600/20 flex flex-col gap-3 relative z-20">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1 rounded bg-neon-cyan-500/10 border border-neon-cyan-500/30">
                <Compass className="w-4 h-4 text-neon-cyan-400 animate-spin-slow" />
              </span>
              <h3 className="font-display font-black text-base text-white tracking-wide">LUSAIL NEURAL WAYFINDER</h3>
            </div>
            <p className="text-[10px] font-mono text-void-400 flex items-center gap-1.5 mt-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Google Maps standard zooming & pan • {lastTelemetryUpdate}
            </p>
          </div>

          {/* Simulated rush toggle controller */}
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={handleToggleRush}
              className={`px-3 py-1.5 rounded-lg border text-[10px] font-mono uppercase tracking-wider flex items-center gap-1.5 transition-all w-full justify-center sm:w-auto ${isSimulatingRush ? "bg-red-500/15 border-red-500 text-red-400 font-bold shadow-neon-glow-purple" : "bg-void-800 border-void-600/20 text-void-400 hover:text-white"}`}
            >
              <Flame className={`w-3.5 h-3.5 ${isSimulatingRush ? "animate-bounce" : ""}`} />
              {isSimulatingRush ? "Peak Rush Active (1.8x)" : "Simulate Peak Rush"}
            </button>
          </div>
        </div>

        {/* Categories chips and Search input row */}
        <div className="flex flex-col md:flex-row gap-2 items-center">
          {/* Search bar inside map */}
          <div className="relative w-full md:w-72">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search concessions, toilets, gates..."
              className="w-full bg-void-950 border border-void-600/35 rounded-xl pl-8 pr-8 py-1.5 text-xs text-white placeholder:text-void-500 focus:outline-none focus:border-neon-cyan-500 transition-all font-sans"
            />
            <Search className="w-3.5 h-3.5 text-void-500 absolute left-2.5 top-1/2 transform -translate-y-1/2" />
            {searchQuery && (
              <button onClick={() => setSearchQuery("")} className="absolute right-2.5 top-1/2 transform -translate-y-1/2 text-void-400 hover:text-white">
                <X className="w-3 h-3" />
              </button>
            )}
          </div>

          {/* Scrollable Filter Chips */}
          <div className="overflow-x-auto scrollbar-none flex gap-1.5 w-full pb-1">
            {[
              { id: "all", label: "All POIs", icon: "🌐" },
              { id: "food", label: "Concessions", icon: "🍔" },
              { id: "toilet", label: "Restrooms", icon: "🚻" },
              { id: "medical", label: "Medical Stations", icon: "🚨" },
              { id: "parking", label: "Parking Lots", icon: "🚗" },
              { id: "gate", label: "Stadium Gates", icon: "🚧" },
              { id: "seat", label: "My Seat", icon: "🎟️" }
            ].map(chip => (
              <button
                key={chip.id}
                onClick={() => {
                  setSelectedFilter(chip.id);
                  if (chip.id === "seat") {
                    handleRecenterOnSeat();
                  }
                }}
                className={`flex-shrink-0 px-2.5 py-1 rounded-full text-[10px] font-mono flex items-center gap-1 transition-all border cursor-pointer ${selectedFilter === chip.id ? "bg-neon-cyan-500/10 border-neon-cyan-500 text-neon-cyan-300 font-bold" : "bg-void-950 border-void-600/15 text-void-400 hover:text-white hover:border-void-600"}`}
              >
                <span>{chip.icon}</span>
                <span>{chip.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* RENDER VIEWPORT MAP STAGE */}
      <div 
        ref={mapContainerRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUpOrLeave}
        onMouseLeave={handleMouseUpOrLeave}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleMouseUpOrLeave}
        className={`flex-grow relative bg-void-950 overflow-hidden select-none select-none z-10 cursor-grab ${isDragging ? "cursor-grabbing" : ""}`}
      >
        {/* Subtle Cyber Grid styling backing the map */}
        <div className="absolute inset-0 bg-cyber-grid opacity-10 pointer-events-none" />

        {/* SVG Stadium Map */}
        <svg
          viewBox="0 0 1000 600"
          className="w-full h-full"
        >
          {/* Zoom/Pan applied to this G group */}
          <g 
            style={{ 
              transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
              transformOrigin: "500px 300px" 
            }}
            className="transition-transform duration-200 ease-out"
          >
            {/* outer landscape green area */}
            <rect x="50" y="30" width="900" height="540" rx="30" className="fill-void-900/50 stroke-void-600/10" strokeWidth="2" />
            
            {/* STADIUM RING BACKGROUND */}
            <ellipse cx="500" cy="300" rx="420" ry="250" className="fill-void-900 stroke-void-600/35" strokeWidth="3" />
            <ellipse cx="500" cy="300" rx="390" ry="220" className="fill-void-950 stroke-void-600/20" strokeWidth="1.5" />

            {/* SEATING TIERS LAYOUT STRUCTURE (Ring split into segments) */}
            {/* We will draw bounding paths representing sectors for the Heatmap / Density views */}
            <g className="opacity-95">
              {/* Sector 1: West VIP Seating (Left) */}
              <path 
                d="M 220 300 A 280 180 0 0 1 500 120 L 500 200 A 200 120 0 0 0 300 300 Z" 
                className={`transition-colors duration-300 ${activeLayer === "heatmap" ? getDensityColor("medium") : activeLayer === "density" ? "fill-neon-blue-500/10 stroke-neon-blue-500/30" : "fill-void-850 stroke-void-600/15"}`} 
              />
              {/* Sector 2: North Seating (Top) */}
              <path 
                d="M 500 120 A 280 180 0 0 1 780 300 L 700 300 A 200 120 0 0 0 500 200 Z" 
                className={`transition-colors duration-300 ${activeLayer === "heatmap" ? getDensityColor("peak") : activeLayer === "density" ? "fill-neon-cyan-500/10 stroke-neon-cyan-500/30" : "fill-void-850 stroke-void-600/15"}`} 
              />
              {/* Sector 3: East Seating (Right - Near Section 108!) */}
              <path 
                d="M 780 300 A 280 180 0 0 1 500 480 L 500 400 A 200 120 0 0 0 700 300 Z" 
                className={`transition-colors duration-300 ${activeLayer === "heatmap" ? getDensityColor("high") : activeLayer === "density" ? "fill-neon-purple-500/10 stroke-neon-purple-500/30" : "fill-void-800/80 stroke-neon-cyan-500/45"}`} 
                strokeWidth={activeLayer === "blueprint" ? 2.5 : 1}
              />
              {/* Sector 4: South Seating (Bottom) */}
              <path 
                d="M 500 480 A 280 180 0 0 1 220 300 L 300 300 A 200 120 0 0 0 500 400 Z" 
                className={`transition-colors duration-300 ${activeLayer === "heatmap" ? getDensityColor("low") : activeLayer === "density" ? "fill-neon-blue-500/10 stroke-neon-blue-500/30" : "fill-void-850 stroke-void-600/15"}`} 
              />
            </g>

            {/* FIELD / PITCH (GREEN CENTERFIELD) */}
            <ellipse cx="500" cy="300" rx="140" ry="85" className="fill-emerald-950/60 stroke-emerald-500/30" strokeWidth="2.5" />
            <ellipse cx="500" cy="300" rx="110" ry="65" className="fill-emerald-950/20 stroke-emerald-500/15" />
            <line x1="500" y1="215" x2="500" y2="385" className="stroke-emerald-500/30" strokeWidth="1.5" />
            <ellipse cx="500" cy="300" rx="20" ry="20" className="fill-none stroke-emerald-500/25" strokeWidth="1.5" />

            {/* SECTORS LABELS (101 to 112 around the stand) */}
            <g className="pointer-events-none select-none font-mono text-[9px] fill-void-400 font-bold" textAnchor="middle">
              <text x="320" y="220">SEC 112</text>
              <text x="500" y="165">SEC 101</text>
              <text x="680" y="220" className="fill-neon-cyan-300 font-black text-[10px]">SEC 108 🎟️</text>
              <text x="680" y="390">SEC 106</text>
              <text x="500" y="445">SEC 104</text>
              <text x="320" y="390">SEC 102</text>
            </g>

            {/* WAYFINDING / ANIMATED ROUTES LAYOUT */}
            {/* These neon path lines represent walking paths from gates to seat and other locations */}
            <g className="pointer-events-none">
              {/* Route 1: Gate B to Seating 108 (Active when selected) */}
              <path
                id="route-gateb-to-seat"
                d="M 880 300 Q 820 280 760 280 T 690 300"
                className={`fill-none transition-all duration-300 ${
                  activeRouteId === "food-halal-burgers" || activeRouteId === "fan-seat-108" || activeLayer === "routes"
                    ? "stroke-neon-cyan-400 stroke-[4.5px] opacity-100" 
                    : "stroke-void-600/10 stroke-1 opacity-20"
                }`}
                strokeDasharray="8 6"
              >
                {/* SVG neon crawling flow animations */}
                {(activeRouteId === "food-halal-burgers" || activeRouteId === "fan-seat-108" || activeLayer === "routes") && (
                  <animate attributeName="stroke-dashoffset" values="50;0" dur="2s" repeatCount="indefinite" />
                )}
              </path>

              {/* Route 2: Seat to Concession Stonefire pizza (Active when selected) */}
              <path
                id="route-seat-to-pizza"
                d="M 690 300 C 600 320, 450 360, 280 420"
                className={`fill-none transition-all duration-300 ${
                  activeRouteId === "food-pizza-veg"
                    ? "stroke-neon-purple-400 stroke-[4.5px] opacity-100" 
                    : "stroke-void-600/10 stroke-1 opacity-20"
                }`}
                strokeDasharray="10 6"
              >
                {activeRouteId === "food-pizza-veg" && (
                  <animate attributeName="stroke-dashoffset" values="60;0" dur="1.8s" repeatCount="indefinite" />
                )}
              </path>

              {/* Route 3: Seat to Medical station */}
              <path
                id="route-seat-to-med"
                d="M 690 300 Q 660 250 640 200"
                className={`fill-none transition-all duration-300 ${
                  activeRouteId === "medical-108"
                    ? "stroke-red-400 stroke-[5px] opacity-100" 
                    : "stroke-void-600/10 stroke-1 opacity-20"
                }`}
                strokeDasharray="6 4"
              >
                {activeRouteId === "medical-108" && (
                  <animate attributeName="stroke-dashoffset" values="40;0" dur="1.2s" repeatCount="indefinite" />
                )}
              </path>

              {/* Route 4: Seat to Parking Lot C */}
              <path
                id="route-seat-to-parking"
                d="M 690 300 Q 750 400 840 480"
                className={`fill-none transition-all duration-300 ${
                  activeRouteId === "parking-lot-c"
                    ? "stroke-neon-blue-400 stroke-[4.5px] opacity-100" 
                    : "stroke-void-600/10 stroke-1 opacity-20"
                }`}
                strokeDasharray="8 6"
              >
                {activeRouteId === "parking-lot-c" && (
                  <animate attributeName="stroke-dashoffset" values="50;0" dur="2s" repeatCount="indefinite" />
                )}
              </path>
            </g>

            {/* SEAT COORDINATE HIGHLIGHT SPOT */}
            {/* Radiant glowing halo over the user's coordinates (Sec 108, Row L, Seat 14) */}
            <g transform="translate(690, 300)">
              {isSeatPulseActive && (
                <>
                  <ellipse cx="0" cy="0" rx="35" ry="20" className="fill-none stroke-neon-cyan-500/30 stroke-2 animate-ping" />
                  <ellipse cx="0" cy="0" rx="20" ry="12" className="fill-none stroke-neon-cyan-400/40 stroke-2" />
                  <ellipse cx="0" cy="0" rx="10" ry="6" className="fill-neon-cyan-500/25 stroke-neon-cyan-300 stroke-1" />
                </>
              )}
            </g>

            {/* RENDER POIs (Interactive Pins) */}
            {filteredPOIs.map((poi) => {
              const isSelected = selectedPOI?.id === poi.id;
              const isFilterHighlighted = selectedFilter === "all" || selectedFilter === poi.category;
              
              // Define color theme based on category
              let colorClasses = "fill-void-950 stroke-void-600 text-void-400";
              let ringColor = "stroke-void-600";
              if (poi.category === "food") {
                colorClasses = isSelected ? "fill-amber-500 stroke-white text-white" : "fill-void-900 stroke-amber-500/60 text-amber-400";
                ringColor = "stroke-amber-500/20";
              } else if (poi.category === "toilet") {
                colorClasses = isSelected ? "fill-neon-blue-500 stroke-white text-white" : "fill-void-900 stroke-neon-blue-500/50 text-neon-blue-400";
                ringColor = "stroke-neon-blue-500/10";
              } else if (poi.category === "medical") {
                colorClasses = isSelected ? "fill-red-500 stroke-white text-white" : "fill-void-900 stroke-red-500/50 text-red-400";
                ringColor = "stroke-red-500/20";
              } else if (poi.category === "parking") {
                colorClasses = isSelected ? "fill-neon-purple-500 stroke-white text-white" : "fill-void-900 stroke-neon-purple-500/50 text-neon-purple-400";
                ringColor = "stroke-neon-purple-500/15";
              } else if (poi.category === "gate") {
                colorClasses = isSelected ? "fill-neon-cyan-500 stroke-white text-void-950" : "fill-void-900 stroke-neon-cyan-500/50 text-neon-cyan-400";
                ringColor = "stroke-neon-cyan-500/20";
              } else if (poi.category === "seat") {
                colorClasses = "fill-void-900 stroke-neon-cyan-400 text-neon-cyan-300 animate-pulse";
                ringColor = "stroke-neon-cyan-500/30";
              }

              return (
                <motion.g 
                  key={poi.id}
                  initial={{ opacity: 0, scale: 0.4 }}
                  animate={{ 
                    opacity: isFilterHighlighted ? 1 : 0.3, 
                    scale: isFilterHighlighted ? (isSelected ? 1.15 : 1) : 0.9 
                  }}
                  whileHover={{ scale: isFilterHighlighted ? 1.25 : 0.95 }}
                  transition={{ type: "spring", stiffness: 350, damping: 20 }}
                  transform={`translate(${poi.x}, ${poi.y})`}
                  className="cursor-pointer"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedPOI(poi);
                    setIsSeatPulseActive(poi.category === "seat");
                    selectRouteToPOI(poi);
                  }}
                >
                  {/* Outer breathing background circle for clicks */}
                  <circle r={isSelected ? 26 : 20} className="fill-void-950/80 stroke-none" />
                  <circle r={isSelected ? 24 : 16} className={`fill-none ${ringColor} stroke-2`} />
                  
                  {/* Pin Circle */}
                  <circle 
                    r={isSelected ? 18 : 13} 
                    className={`${colorClasses} stroke-2 transition-all duration-200`} 
                  />

                  {/* Icon text centered */}
                  <text 
                    y="4" 
                    textAnchor="middle" 
                    className={`font-sans text-xs select-none pointer-events-none ${isSelected ? "scale-125" : ""}`}
                  >
                    {poi.icon}
                  </text>

                  {/* Micro label above pin on hover/selected */}
                  {isSelected && (
                    <motion.g 
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.2 }}
                      transform="translate(0, -25)"
                    >
                      <rect x="-60" y="-12" width="120" height="18" rx="4" className="fill-void-900/95 stroke-neon-cyan-500/40 stroke-[1px]" />
                      <text className="fill-white font-mono text-[8px] font-bold" textAnchor="middle" y="0">
                        {poi.name.substring(0, 20)}
                      </text>
                    </motion.g>
                  )}
                </motion.g>
              );
            })}
          </g>
        </svg>

        {/* GOOGLE MAPS COOP FLOATING FLOOD OVERLAYS */}
        
        {/* 1. MAP VIEW LAYERS toggler (Top Right) */}
        <div className="absolute top-3 right-3 z-20 flex flex-col gap-1.5">
          <div className="bg-void-900/95 border border-void-600/35 p-1.5 rounded-xl shadow-2xl flex flex-col gap-1">
            <span className="text-[7px] font-mono font-bold text-void-500 px-1 uppercase tracking-wider">Map Layers</span>
            
            <button
              onClick={() => setActiveLayer("blueprint")}
              className={`px-2 py-1 rounded text-[9px] font-mono text-left flex items-center gap-1 transition-all ${activeLayer === "blueprint" ? "bg-void-800 text-neon-cyan-400 font-bold" : "text-void-400 hover:text-white"}`}
            >
              <Layers className="w-3 h-3" />
              Blueprint
            </button>
            
            <button
              onClick={() => setActiveLayer("heatmap")}
              className={`px-2 py-1 rounded text-[9px] font-mono text-left flex items-center gap-1 transition-all ${activeLayer === "heatmap" ? "bg-orange-950/40 border border-orange-500/20 text-orange-400 font-bold" : "text-void-400 hover:text-white"}`}
            >
              <span className="w-2 h-2 rounded-full bg-orange-500" />
              Heatmap Overlay
            </button>

            <button
              onClick={() => setActiveLayer("density")}
              className={`px-2 py-1 rounded text-[9px] font-mono text-left flex items-center gap-1 transition-all ${activeLayer === "density" ? "bg-neon-blue-500/10 text-neon-cyan-400 font-bold" : "text-void-400 hover:text-white"}`}
            >
              <span className="w-2 h-2 rounded-full bg-neon-blue-500 animate-pulse" />
              Density Zones
            </button>

            <button
              onClick={() => setActiveLayer("routes")}
              className={`px-2 py-1 rounded text-[9px] font-mono text-left flex items-center gap-1 transition-all ${activeLayer === "routes" ? "bg-neon-purple-500/10 text-neon-purple-300 font-bold" : "text-void-400 hover:text-white"}`}
            >
              <Navigation className="w-3 h-3 animate-pulse" />
              Access Flow
            </button>
          </div>

          {/* Quick Compass re-center */}
          <button
            onClick={handleReset}
            className="p-2.5 bg-void-900/90 border border-void-600/35 rounded-xl text-void-400 hover:text-white transition-all flex items-center justify-center shadow-xl cursor-pointer"
            title="Reset to stadium center"
          >
            <Compass className="w-4 h-4 text-neon-cyan-400" />
          </button>
        </div>

        {/* 2. ZOOM CONTROLS (+ / -) & LOCATION LOCATOR (Bottom Right) */}
        <div className="absolute bottom-3 right-3 z-20 flex flex-col gap-1">
          <button
            onClick={handleRecenterOnSeat}
            className="p-2.5 bg-neon-blue-500 text-white rounded-xl hover:bg-neon-blue-400 transition-all flex items-center justify-center shadow-lg cursor-pointer mb-2 animate-bounce"
            title="Recenter on my ticket seat location"
          >
            <Locate className="w-4 h-4" />
          </button>

          <div className="bg-void-900/95 border border-void-600/35 rounded-xl shadow-2xl flex flex-col divide-y divide-void-600/20 overflow-hidden">
            <button
              onClick={handleZoomIn}
              className="p-2.5 text-void-300 hover:text-white transition-all hover:bg-void-800 flex items-center justify-center"
              title="Zoom In"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
            <button
              onClick={handleZoomOut}
              className="p-2.5 text-void-300 hover:text-white transition-all hover:bg-void-800 flex items-center justify-center"
              title="Zoom Out"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* 3. HEATMAP SUMMARY PANEL Overlay (Bottom Left when layer active) */}
        {activeLayer === "heatmap" && (
          <div className="absolute bottom-3 left-3 z-20 bg-void-900/95 border border-void-600/30 p-3 rounded-xl max-w-xs shadow-2xl font-mono text-[9px] space-y-1.5 animate-fade-in">
            <span className="text-[10px] font-bold text-orange-400 block uppercase">🔥 STADIUM DENSITY METRICS</span>
            <p className="text-void-400 leading-normal">
              Heatmap shows active concentration coordinates tracked from turnstile infrared scanners and overhead CCTV sensors.
            </p>
            <div className="flex items-center gap-3 pt-1">
              <span className="flex items-center gap-1 text-emerald-400"><span className="w-2 h-2 rounded-full bg-emerald-500" /> Low</span>
              <span className="flex items-center gap-1 text-yellow-400"><span className="w-2 h-2 rounded-full bg-yellow-500" /> Med</span>
              <span className="flex items-center gap-1 text-orange-400"><span className="w-2 h-2 rounded-full bg-orange-500" /> High</span>
              <span className="flex items-center gap-1 text-red-400"><span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" /> Peak</span>
            </div>
          </div>
        )}

        {/* 4. SEAT HIGHLIGHT MAP LEGEND OVERLAY */}
        {selectedFilter === "seat" && (
          <div className="absolute bottom-3 left-3 z-20 bg-void-900/95 border border-neon-cyan-500/25 p-3 rounded-xl max-w-xs shadow-2xl font-mono text-[9px] space-y-1.5">
            <span className="text-[10px] font-bold text-neon-cyan-400 block uppercase flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5" /> SEAT POSITION RECENTRED
            </span>
            <p className="text-white leading-normal">
              Your coordinate: <span className="text-neon-cyan-300 font-bold">{userSeat}</span>.<br />
              Nearest concession: <span className="text-amber-300">Sector B Halal Grill (42m away)</span>.<br />
              Nearest washroom queue: <span className="text-neon-blue-300 font-bold">1 min</span>.
            </p>
          </div>
        )}
      </div>

      {/* GOOGLE MAPS STYLE BOTTOM SLIDEOUT INFO DETAIL SHEET */}
      <AnimatePresence>
        {selectedPOI && (
          <motion.div
            initial={{ y: 80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 80, opacity: 0 }}
            className="absolute bottom-0 inset-x-0 bg-void-900 border-t border-void-600/40 p-4 rounded-t-3xl shadow-elevation-high z-30 space-y-3 font-sans relative"
          >
            {/* Close handler */}
            <button 
              onClick={() => {
                setSelectedPOI(null);
                setActiveRouteId(null);
              }} 
              className="absolute right-4 top-4 p-1 rounded-full bg-void-950 text-void-400 hover:text-white transition-all border border-void-600/10 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Title block */}
            <div className="flex gap-3 items-start pr-8">
              {/* Colored category badge */}
              <div className="w-12 h-12 rounded-2xl bg-void-950 border border-void-600/20 flex items-center justify-center text-xl flex-shrink-0">
                {selectedPOI.icon}
              </div>

              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h4 className="font-display font-bold text-sm text-white">{selectedPOI.name}</h4>
                  <span className={`px-2 py-0.5 rounded text-[8px] font-mono font-bold uppercase ${
                    selectedPOI.crowdLevel === "low" ? "bg-emerald-500/15 text-emerald-400" :
                    selectedPOI.crowdLevel === "medium" ? "bg-yellow-500/15 text-yellow-400" :
                    selectedPOI.crowdLevel === "high" ? "bg-orange-500/15 text-orange-400" :
                    "bg-red-500/15 text-red-400 animate-pulse"
                  }`}>
                    {selectedPOI.crowdLevel.toUpperCase()} DENSITY
                  </span>
                </div>

                <p className="text-[10px] text-void-400 font-mono flex items-center gap-1.5 mt-1">
                  <span className="capitalize">{selectedPOI.category} point</span>
                  {selectedPOI.waitMinutes !== undefined && (
                    <>
                      <span>•</span>
                      <span className="text-neon-cyan-400 font-bold">Est. Queue: {selectedPOI.waitMinutes} min</span>
                    </>
                  )}
                </p>
              </div>
            </div>

            {/* Description */}
            <p className="text-xs text-void-200 leading-relaxed font-sans">
              {selectedPOI.description}
            </p>

            {/* Telemetry metadata section */}
            <div className="p-3 bg-void-950 border border-void-600/15 rounded-xl space-y-2">
              <div className="flex justify-between items-center text-[9px] font-mono">
                <span className="text-void-400 uppercase">Live Sensor Telemetry:</span>
                <span className="text-neon-cyan-300 font-bold">{selectedPOI.details.statusText}</span>
              </div>
              <p className="text-[10px] text-white leading-relaxed font-sans">
                {selectedPOI.details.metrics}
              </p>

              {/* Amenity tags */}
              {selectedPOI.details.amenities && (
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {selectedPOI.details.amenities.map(am => (
                    <span key={am} className="px-2 py-0.5 rounded bg-void-900 border border-void-600/10 text-[8px] font-mono text-void-300">
                      ✓ {am}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Actions Panel */}
            <div className="flex gap-2.5 pt-1">
              <button
                onClick={() => selectRouteToPOI(selectedPOI)}
                className="flex-1 bg-neon-blue-500 hover:bg-neon-blue-400 text-white font-bold text-xs py-2.5 px-4 rounded-xl transition-all shadow-neon-glow-blue flex items-center justify-center gap-2 cursor-pointer"
              >
                <Navigation className="w-3.5 h-3.5 animate-pulse" />
                Route From My Seat
              </button>

              <button
                onClick={() => {
                  try {
                    if (window.speechSynthesis) {
                      window.speechSynthesis.cancel();
                      window.speechSynthesis.speak(new SpeechSynthesisUtterance(`Emergency support requested at ${selectedPOI.name}. Stewards have been notified.`));
                    }
                  } catch(e){}
                  alert(`Emergency alert triggered for ${selectedPOI.name}! Dynamic stewards dispatched.`);
                }}
                className="px-3 bg-void-950 border border-void-600/25 text-void-400 hover:text-white rounded-xl text-xs transition-colors cursor-pointer"
                title="Report incident/issue here"
              >
                🚨 Alert Steward
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* FOOTER QUICK LEGEND MAP LEGENDS */}
      <div className="p-3 bg-void-950/95 border-t border-void-600/25 flex flex-wrap justify-between items-center gap-2 text-[9px] font-mono text-void-500 relative z-10">
        <div className="flex items-center gap-3">
          <span>LEGEND:</span>
          <span className="flex items-center gap-1"><span className="text-xs">🍔</span> Concessions</span>
          <span className="flex items-center gap-1"><span className="text-xs">🚻</span> Toilets</span>
          <span className="flex items-center gap-1"><span className="text-xs">🚨</span> Medical</span>
          <span className="flex items-center gap-1"><span className="text-xs">🚗</span> Parking</span>
          <span className="flex items-center gap-1"><span className="text-xs">🚧</span> Gates</span>
        </div>

        <div className="flex items-center gap-1 text-neon-cyan-500 font-bold">
          <CheckCircle2 className="w-3 h-3 text-emerald-500" />
          ACTIVE LUSAIL CAD MAP FEED
        </div>
      </div>
    </div>
  );
}
