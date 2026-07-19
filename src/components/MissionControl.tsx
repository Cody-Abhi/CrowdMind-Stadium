import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useQuery } from "@tanstack/react-query";
import {
  Clock,
  CloudSun,
  Train,
  Cpu,
  BarChart
} from "lucide-react";

// Sub-component Imports
import { OperationalStats } from './MissionControlComponents/OperationalStats';
import { SpatialRiskHeatmap } from './MissionControlComponents/SpatialRiskHeatmap';
import { IncidentStream } from './MissionControlComponents/IncidentStream';
import { AIAdvisory } from './MissionControlComponents/AIAdvisory';

// Types for Incident Feed
export interface Incident {
  id: string;
  time: string;
  category: "security" | "medical" | "crowd" | "general";
  urgency: "critical" | "high" | "medium" | "low";
  location: string;
  description: string;
  status: "pending" | "dispatched" | "resolved";
  assignedTo?: string;
}

// Types for AI recommendations
export interface AIRecommendation {
  id: string;
  model: string;
  confidence: number;
  trigger: string;
  actionableText: string;
  impactLabel: string;
  status: "available" | "applied" | "ignored";
}

// Types for Stadium Sectors
export interface StadiumSector {
  id: string;
  name: string;
  occupancyPercent: number;
  capacity: number;
  stewardsOnDuty: number;
  riskIndex: "low" | "medium" | "elevated" | "extreme";
  details: string;
}

interface MissionControlProps {
  onAddAuditLog?: (tag: string, text: string) => void;
  onUpdateGeneralStats?: (spectators: number, waitTime: number, stewards: number, alerts: number) => void;
}

const useStadiumTelemetry = () => {
  return useQuery({
    queryKey: ['stadium-telemetry'],
    queryFn: async () => {
      return {
        totalSpectators: 48210 + Math.floor(Math.random() * 500),
        waitTime: 4.2 + (Math.random() * 0.5),
        activeStewards: 342,
        alerts: 3,
        temp: 24.2 + (Math.random() * 0.2),
        humidity: 62 + Math.floor(Math.random() * 2),
        gridLoad: 78.4 + (Math.random() * 1.2)
      };
    },
    refetchInterval: 5000,
  });
};

export default function MissionControl({
  onAddAuditLog = () => {},
  onUpdateGeneralStats = () => {}
}: MissionControlProps) {
  const { data: telemetry } = useStadiumTelemetry();
  const [currentUtcTime, setCurrentUtcTime] = useState("");
  const [isCrisisMode, setIsCrisisMode] = useState(false);
  const [heatmapLayer, setHeatmapLayer] = useState<"density" | "inflow" | "risk">("density");
  const [selectedSectorId, setSelectedSectorId] = useState<string | null>("sec-ingress-b");
  const [chartTicks, setChartTicks] = useState<number[]>(Array.from({ length: 24 }, () => Math.floor(Math.random() * 40) + 30));

  const [sectors, setSectors] = useState<StadiumSector[]>([
    { id: "sec-101", name: "Sector 101 (North)", occupancyPercent: 54, capacity: 6000, stewardsOnDuty: 42, riskIndex: "low", details: "Seamless flow." },
    { id: "sec-104", name: "Sector 104 (South)", occupancyPercent: 41, capacity: 7500, stewardsOnDuty: 38, riskIndex: "low", details: "Direct proximity to public taxi loop." },
    { id: "sec-106", name: "Sector 106 (South-East)", occupancyPercent: 68, capacity: 5500, stewardsOnDuty: 48, riskIndex: "medium", details: "Moderate seating congestion." },
    { id: "sec-108", name: "Sector 108 (East VIP)", occupancyPercent: 82, capacity: 4000, stewardsOnDuty: 65, riskIndex: "elevated", details: "High concentration of arrivals." },
    { id: "sec-112", name: "Sector 112 (West VIP)", occupancyPercent: 35, capacity: 4500, stewardsOnDuty: 50, riskIndex: "low", details: "Optimal capacity headroom." },
    { id: "sec-ingress-b", name: "Gate B (East Ingress)", occupancyPercent: 93, capacity: 8000, stewardsOnDuty: 99, riskIndex: "extreme", details: "Ingress bottleneck alert." }
  ]);

  const [incidents, setIncidents] = useState<Incident[]>([
    { id: "inc-101", time: "12:14:02 UTC", category: "crowd", urgency: "critical", location: "Gate B Outer Turnstiles", description: "Spectator queue back-up of 150+ people.", status: "pending" },
    { id: "inc-102", time: "12:15:45 UTC", category: "medical", urgency: "high", location: "Section 108, Row L", description: "Spectator requesting heat assistance.", status: "dispatched", assignedTo: "Squad Delta" },
    { id: "inc-103", time: "12:18:20 UTC", category: "security", urgency: "medium", location: "Sector D Corridor 2", description: "AI flagged tailgating entrance.", status: "pending" }
  ]);

  const [recommendations, setRecommendations] = useState<AIRecommendation[]>([
    { id: "rec-201", model: "Spatial Friction v4.12", confidence: 96.4, trigger: "Gate B Bottleneck", actionableText: "Reroute Gate B ingress to Gate C.", impactLabel: "Wait: -6.5m", status: "available" },
    { id: "rec-202", model: "Hydration Analytics", confidence: 88.1, trigger: "High Temp Index", actionableText: "Increase cooling fan ventilation.", impactLabel: "Comfort: +14%", status: "available" }
  ]);

  useEffect(() => {
    const updateTime = () => setCurrentUtcTime(new Date().toISOString().substring(11, 19) + " UTC");
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (telemetry) {
      onUpdateGeneralStats(telemetry.totalSpectators, telemetry.waitTime, telemetry.activeStewards, incidents.filter(i => i.status !== 'resolved').length);
    }
  }, [telemetry, incidents]);

  useEffect(() => {
    const interval = setInterval(() => setChartTicks(p => [...p.slice(1), Math.floor(Math.random() * 45) + 25]), 3000);
    return () => clearInterval(interval);
  }, []);

  const handleResolveIncident = (id: string, location: string) => {
    setIncidents(prev => prev.map(inc => inc.id === id ? { ...inc, status: "resolved" } : inc));
    onAddAuditLog("SYS", `Incident ${id} resolved at ${location}.`);
  };

  const handleDispatchIncident = (id: string, location: string, squadName: string) => {
    setIncidents(prev => prev.map(inc => inc.id === id ? { ...inc, status: "dispatched", assignedTo: squadName } : inc));
    onAddAuditLog("STWD", `${squadName} dispatched to ${location}.`);
  };

  const handleApplyRecommendation = (rec: AIRecommendation) => {
    setRecommendations(p => p.map(r => r.id === rec.id ? { ...r, status: "applied" } : r));
    if (rec.id === "rec-201") {
      setSectors(p => p.map(s => s.id === "sec-ingress-b" ? { ...s, occupancyPercent: 78, riskIndex: "medium", details: "Diverted successfully." } : s));
      setIncidents(p => p.map(inc => inc.id === "inc-101" ? { ...inc, status: "resolved" } : inc));
    }
    onAddAuditLog("FLOW", `Applied: ${rec.model}`);
  };

  const handleSimulateNewAlert = () => {
    const newInc: Incident = {
      id: `inc-${Date.now().toString().substring(9)}`,
      time: new Date().toISOString().substring(11, 19) + " UTC",
      category: "security",
      urgency: "high",
      location: "Gate A VIP Entry",
      description: "Heavy transit arrival pressure.",
      status: "pending"
    };
    setIncidents(p => [newInc, ...p]);
    onAddAuditLog("ALRT", `NEW ALERT: ${newInc.location}`);
  };

  return (
    <div className={`space-y-6 ${isCrisisMode ? "crisis-mode" : ""}`}>
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <div className="p-2 rounded-xl bg-neon-blue-500/10 border border-neon-blue-500/20">
              <Cpu className="w-5 h-5 text-neon-blue-400" />
            </div>
            <h1 className="font-display font-black text-2xl tracking-tight text-white uppercase italic">Neural Command Center</h1>
          </div>
          <p className="text-void-400 text-sm max-w-lg">Autonomous stadium operations grid providing real-time cognitive oversight.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="glass-panel px-4 py-2 flex items-center gap-3">
            <Clock className="w-4 h-4 text-neon-cyan-400" />
            <span className="font-mono text-sm font-bold text-white tracking-widest">{currentUtcTime}</span>
          </div>
          <button onClick={() => setIsCrisisMode(!isCrisisMode)} className={`px-4 py-2 rounded-xl font-mono text-[10px] font-bold uppercase tracking-widest transition-all ${isCrisisMode ? "bg-red-500 text-white shadow-neon-glow-red" : "bg-void-800 text-void-400 border border-void-600/30 hover:border-red-500/50"}`}>
            {isCrisisMode ? "Crisis Protocol Active" : "Normal Operations"}
          </button>
        </div>
      </div>

      <OperationalStats totalSpectators={telemetry?.totalSpectators || 0} waitTime={telemetry?.waitTime || 0} activeStewards={telemetry?.activeStewards || 0} activeAlerts={incidents.filter(i => i.status !== 'resolved').length} />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 space-y-6">
          <SpatialRiskHeatmap sectors={sectors} selectedSectorId={selectedSectorId} setSelectedSectorId={setSelectedSectorId} heatmapLayer={heatmapLayer} setHeatmapLayer={setHeatmapLayer} handleSimulateNewAlert={handleSimulateNewAlert} />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="glass-panel p-4">
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-2">
                  <BarChart className="w-4 h-4 text-neon-purple-400" />
                  <span className="font-mono text-[10px] font-bold text-void-300 uppercase tracking-widest">Ingress Velocity</span>
                </div>
              </div>
              <div className="h-32 flex items-end gap-1 px-2">
                {chartTicks.map((v, i) => (
                  <motion.div key={i} initial={{ height: 0 }} animate={{ height: `${v}%` }} className="flex-1 bg-neon-purple-500/20 border-t border-neon-purple-500/40 rounded-t-sm" />
                ))}
              </div>
            </div>
            <div className="glass-panel p-4 flex flex-col justify-center gap-6">
              <div className="flex items-center gap-3">
                <CloudSun className="w-8 h-8 text-amber-400" />
                <div>
                  <span className="font-mono text-[10px] text-void-500 uppercase font-bold tracking-widest">Climate Control</span>
                  <div className="flex items-baseline gap-2">
                    <span className="font-display font-bold text-2xl text-white">{telemetry?.temp.toFixed(1)}°C</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Train className="w-8 h-8 text-neon-cyan-400" />
                <div>
                  <span className="font-mono text-[10px] text-void-500 uppercase font-bold tracking-widest">Transit Grid</span>
                  <div className="flex items-baseline gap-2">
                    <span className="font-display font-bold text-2xl text-white">4m</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="lg:col-span-4 space-y-6">
          <AIAdvisory recommendations={recommendations} handleApplyRecommendation={handleApplyRecommendation} />
          <IncidentStream incidents={incidents} handleDispatchIncident={handleDispatchIncident} handleResolveIncident={handleResolveIncident} />
        </div>
      </div>
    </div>
  );
}
