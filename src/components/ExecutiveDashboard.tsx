import React, { useState } from 'react';
import { 
  TrendingUp, 
  Users, 
  Zap, 
  ShieldCheck,
  ArrowUpRight,
  Target,
  Activity,
  Briefcase
} from 'lucide-react';
import { motion } from 'motion/react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell
} from 'recharts';

import { MetricCards } from './ExecutiveDashboardComponents/MetricCards';
import { PredictiveModels } from './ExecutiveDashboardComponents/PredictiveModels';
import { GeminiExecutiveBriefing } from './ExecutiveDashboardComponents/GeminiExecutiveBriefing';

const LIVE_DATA = [
  { time: '18:00', fans: 12000, risk: 10 },
  { time: '18:15', fans: 25000, risk: 15 },
  { time: '18:30', fans: 48000, risk: 35 },
  { time: '18:45', fans: 65000, risk: 55 },
  { time: '19:00', fans: 82000, risk: 42 },
  { time: '19:15', fans: 84500, risk: 28 },
];

const SECTOR_DISTRIBUTION = [
  { name: 'North', val: 22000, color: '#0066ff' },
  { name: 'South', val: 18500, color: '#3b82f6' },
  { name: 'East', val: 24000, color: '#00f2ff' },
  { name: 'West', val: 20000, color: '#8b5cf6' },
];

export const ExecutiveDashboard: React.FC<{ simulationActive: boolean }> = ({ simulationActive }) => {
  // Slider parameters
  const [sliderAttendance, setSliderAttendance] = useState(48210);
  const [sliderTemp, setSliderTemp] = useState(24);
  const [sliderStewardRatio, setSliderStewardRatio] = useState(100);

  // Gemini Briefing states
  const [selectedFocus, setSelectedFocus] = useState('General Operations');
  const [isReportGenerating, setIsReportGenerating] = useState(false);
  const [generatedReport, setGeneratedReport] = useState<string | null>(null);
  const [generationSteps, setGenerationSteps] = useState('');

  // 1. Math predictions
  const ticketsRev = sliderAttendance * 15;
  const concessionsRev = sliderAttendance * 0.1 * 45;
  const suitesRev = sliderAttendance * 0.05 * 120;
  const merchandiseRev = sliderAttendance * 0.08 * 30;
  const predictedTotalRevenue = ticketsRev + concessionsRev + suitesRev + merchandiseRev;

  const predictedGateCongestion = Math.min(
    100,
    Math.max(5, Math.round((sliderAttendance / 56000) * 60 + (100 - sliderStewardRatio) * 0.3))
  );
  const recommendedStaff = Math.round((sliderAttendance / 200) * (sliderStewardRatio / 100));
  const predictedCoolingLoad = Math.round(
    Math.max(100, (sliderTemp - 20) * 12500 + sliderAttendance * 0.12)
  );

  // 2. Metrics calculation for MetricCards
  const totalSpectators = simulationActive ? 84512 : sliderAttendance;
  const totalRevenue = predictedTotalRevenue;
  const carbonSaved = Math.round(sliderAttendance * 0.15);
  const transitUse = 68;
  const plasticSaved = Math.round(sliderAttendance * 1.8);
  const landfillDiversion = 91;
  const activeStewardsCount = recommendedStaff;
  const stewardTasksCount = Math.round(sliderAttendance / 2000);
  const stewardHappiness = Math.round(
    Math.max(40, Math.min(99, 100 - (100 - sliderStewardRatio) * 0.4))
  );
  const avgResolutionTime = Math.max(1, Math.round(12 * (100 / sliderStewardRatio)));
  const activeAlerts = simulationActive ? 5 : 2;
  const criticalSolved = 14;
  const ingressBottlenecks = simulationActive ? 2 : 1;

  const handleGenerateReport = async () => {
    setIsReportGenerating(true);
    setGenerationSteps("Accessing Neural Mesh...");
    await new Promise(r => setTimeout(r, 600));
    setGenerationSteps("Correlating Sensor Feeds...");
    await new Promise(r => setTimeout(r, 600));
    setGenerationSteps("Running Inference Matrix...");

    try {
      const response = await fetch('/api/gemini/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: `Compile a strategic briefing for the stadium C-suite. Focus perspective: ${selectedFocus}. Parameters: Spectators: ${sliderAttendance}, Temp: ${sliderTemp}°C, Steward Deployment: ${sliderStewardRatio}%. Simulation Active: ${simulationActive ? "YES" : "NO"}. Present 3 action items and list detailed metrics.`,
          systemInstruction: "You are StadiumMind C-Suite Analyst. Format response using Markdown headings (### and ####) and lists. Be futuristic, concise, and professional."
        })
      });
      const data = await response.json();
      if (data.error) throw new Error(data.error);
      setGeneratedReport(data.text);
    } catch (err) {
      console.error("Briefing Gen Error:", err);
      setGeneratedReport("### SYSTEM ERROR\nNeural synthesis failed. Check network link and retry.");
    } finally {
      setIsReportGenerating(false);
      setGenerationSteps("");
    }
  };

  const dynamicLiveData = LIVE_DATA.map(d => ({
    ...d,
    fans: Math.round(d.fans * (sliderAttendance / 82000))
  }));

  const dynamicSectorDistribution = SECTOR_DISTRIBUTION.map(s => ({
    ...s,
    val: Math.round(s.val * (sliderAttendance / 74500))
  }));

  return (
    <div className="space-y-6 animate-slide-up">
      {/* Dynamic Metric Cards */}
      <MetricCards
        totalSpectators={totalSpectators}
        totalRevenue={totalRevenue}
        ticketsRev={ticketsRev}
        concessionsRev={concessionsRev}
        suitesRev={suitesRev}
        merchandiseRev={merchandiseRev}
        carbonSaved={carbonSaved}
        transitUse={transitUse}
        plasticSaved={plasticSaved}
        landfillDiversion={landfillDiversion}
        activeStewardsCount={activeStewardsCount}
        stewardTasksCount={stewardTasksCount}
        stewardHappiness={stewardHappiness}
        avgResolutionTime={avgResolutionTime}
        activeAlerts={activeAlerts}
        criticalSolved={criticalSolved}
        ingressBottlenecks={ingressBottlenecks}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Ingress Chart */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className="lg:col-span-2 glass-card p-8"
        >
          <div className="flex justify-between items-center mb-8">
            <div>
              <h3 className="font-display font-bold text-lg text-white tracking-tight">Temporal Crowd Ingress</h3>
              <p className="text-[10px] font-mono text-void-500 font-bold uppercase tracking-widest mt-1">Real-time Node Telemetry</p>
            </div>
            <div className="flex gap-2">
              <button className="px-3 py-1.5 rounded-lg bg-void-900 border border-white/5 text-[9px] font-mono font-bold text-void-400 uppercase tracking-widest hover:text-white transition-colors">1H</button>
              <button className="px-3 py-1.5 rounded-lg bg-neon-blue-500/20 border border-neon-blue-500/40 text-[9px] font-mono font-bold text-neon-blue-400 uppercase tracking-widest">LIVE</button>
            </div>
          </div>
          
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={dynamicLiveData}>
                <defs>
                  <linearGradient id="colorFans" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0066ff" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#0066ff" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.03)" />
                <XAxis 
                  dataKey="time" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#4a5c9e', fontSize: 10, fontWeight: 700, fontStyle: 'mono' }} 
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#4a5c9e', fontSize: 10, fontWeight: 700, fontStyle: 'mono' }} 
                />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#040712', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', fontSize: '10px' }}
                  itemStyle={{ color: '#fff', fontWeight: 700 }}
                />
                <Area 
                  type="monotone" 
                  dataKey="fans" 
                  stroke="#0066ff" 
                  strokeWidth={3}
                  fillOpacity={1} 
                  fill="url(#colorFans)" 
                  animationDuration={2000}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Distribution & Performance */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="glass-card p-8 flex flex-col"
        >
          <div className="mb-8">
            <h3 className="font-display font-bold text-lg text-white tracking-tight">Sector Load Distribution</h3>
            <p className="text-[10px] font-mono text-void-500 font-bold uppercase tracking-widest mt-1">Geospatial Capacity Balance</p>
          </div>

          <div className="h-[240px] w-full mb-8">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dynamicSectorDistribution}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.03)" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#4a5c9e', fontSize: 10, fontWeight: 700 }} />
                <Tooltip 
                   cursor={{ fill: 'rgba(255,255,255,0.02)' }}
                   contentStyle={{ backgroundColor: '#040712', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}
                />
                <Bar dataKey="val" radius={[4, 4, 0, 0]}>
                  {dynamicSectorDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="space-y-4 flex-grow">
            {dynamicSectorDistribution.map((sector, i) => (
              <div key={i} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: sector.color }} />
                  <span className="text-xs font-bold text-void-200">{sector.name} Tier</span>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-24 h-1 bg-void-900 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${(sector.val / 25000) * 100}%` }}
                      className="h-full"
                      style={{ backgroundColor: sector.color }}
                    />
                  </div>
                  <span className="text-[10px] font-mono font-bold text-white">{(sector.val / 1000).toFixed(1)}K</span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Sliders & Gemini Synthesis Side by Side */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <PredictiveModels
          sliderAttendance={sliderAttendance}
          setSliderAttendance={setSliderAttendance}
          sliderTemp={sliderTemp}
          setSliderTemp={setSliderTemp}
          sliderStewardRatio={sliderStewardRatio}
          setSliderStewardRatio={setSliderStewardRatio}
          predictedTotalRevenue={predictedTotalRevenue}
          predictedGateCongestion={predictedGateCongestion}
          recommendedStaff={recommendedStaff}
          predictedCoolingLoad={predictedCoolingLoad}
        />
        <GeminiExecutiveBriefing
          selectedFocus={selectedFocus}
          setSelectedFocus={setSelectedFocus}
          isReportGenerating={isReportGenerating}
          generatedReport={generatedReport}
          generationSteps={generationSteps}
          handleGenerateReport={handleGenerateReport}
        />
      </div>
      
      {/* Bottom Insights */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="glass-card p-6 flex items-center gap-6 group hover:border-neon-cyan-500/20 transition-all">
          <div className="w-16 h-16 rounded-2xl bg-neon-cyan-500/10 border border-neon-cyan-500/20 flex items-center justify-center text-neon-cyan-400 group-hover:scale-110 transition-transform">
            <Target className="w-8 h-8" />
          </div>
          <div>
            <div className="text-[10px] font-mono font-bold text-neon-cyan-500 uppercase tracking-widest mb-1">Neural Prediction</div>
            <p className="text-sm font-semibold text-void-100 leading-snug">Expected peak load in <span className="text-white">14 minutes</span>. Recommend opening Reserve Gate 4-A for Sector South.</p>
          </div>
        </div>
        
        <div className="glass-card p-6 flex items-center gap-6 group hover:border-neon-purple-500/20 transition-all">
          <div className="w-16 h-16 rounded-2xl bg-neon-purple-500/10 border border-neon-purple-500/20 flex items-center justify-center text-neon-purple-400 group-hover:scale-110 transition-transform">
            <Briefcase className="w-8 h-8" />
          </div>
          <div>
            <div className="text-[10px] font-mono font-bold text-neon-purple-500 uppercase tracking-widest mb-1">Operational Health</div>
            <p className="text-sm font-semibold text-void-100 leading-snug">Hospitality staffing at <span className="text-white">{sliderStewardRatio}% capacity</span>. Mobile vendors deployed to Sector East bottleneck.</p>
          </div>
        </div>
      </div>
    </div>
  );
};
