import React, { useState, useEffect } from 'react';
import { Users, Cpu, AlertTriangle, Play } from 'lucide-react';
import { db, collection, onSnapshot } from '../../firebase';
import { geminiService } from '../../services/geminiService';
import { StadiumGate } from '../../types';
import { 
  ResponsiveContainer, BarChart, Bar, Cell, XAxis, YAxis, Tooltip, CartesianGrid 
} from 'recharts';

export const CrowdAnalytics: React.FC = () => {
  const [gates, setGates] = useState<StadiumGate[]>([]);
  const [forecast, setForecast] = useState<string | null>(null);
  const [isGeneratingForecast, setIsGeneratingForecast] = useState(false);

  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'stadium_gates'), (snap) => {
      const list: StadiumGate[] = [];
      snap.forEach(d => list.push(d.data() as StadiumGate));
      setGates(list.sort((a, b) => a.order - b.order));
    });
    return unsub;
  }, []);

  const handleGenerateForecast = async () => {
    setIsGeneratingForecast(true);
    setForecast(null);
    try {
      const gateDetails = gates.map(g => `${g.name}: FlowRate=${g.flowRate}, WaitTime=${g.waitTime}, Occupancy=${g.occupancy}%`).join('\n');
      const response = await geminiService.generateContent(
        `Analyze the following plant inlets telemetry and write a short strategic inflow forecast and 2 recommendations: \n${gateDetails}`,
        "You are StadiumMind PS8 Predictive Inflow Analytics Engine. Formulate a short, futuristic inflow forecast with 2 specific recommendations. Use markdown lists and headings (### / ####)."
      );
      if (response.error) throw new Error(response.error);
      setForecast(response.text);
    } catch (err) {
      setForecast("### Forecast Failure\nPredictive analytics matrix failed. Check connectivity and retry.");
    } finally {
      setIsGeneratingForecast(false);
    }
  };

  const chartData = gates.map(g => ({
    name: g.name.substring(0, 6),
    paxRate: parseInt(g.flowRate) || 0,
    occupancy: g.occupancy || 0
  }));

  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 min-h-[500px]">
      <div className="xl:col-span-2 glass-card p-6 flex flex-col">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-3">
            <Users className="w-5 h-5 text-neon-blue-400" aria-hidden="true" />
            <h3 className="font-display font-bold text-lg text-white">Inflow Telemetry Analytics</h3>
          </div>
        </div>

        <div className="h-[300px] w-full mb-6">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.03)" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#4a5c9e', fontSize: 10, fontWeight: 700 }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fill: '#4a5c9e', fontSize: 10, fontWeight: 700 }} />
              <Tooltip 
                cursor={{ fill: 'rgba(255,255,255,0.02)' }}
                contentStyle={{ backgroundColor: '#040712', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}
              />
              <Bar dataKey="paxRate" name="Inflow Rate (m³/h)" radius={[4, 4, 0, 0]}>
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={index % 2 === 0 ? '#0066ff' : '#00f2ff'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {gates.map((g, i) => (
            <div key={i} className="p-3 bg-void-900 border border-void-700/30 rounded-xl font-mono">
              <span className="text-[8px] text-void-500 uppercase tracking-wider block font-bold">{g.name}</span>
              <strong className="text-sm font-bold text-white block mt-1">{g.flowRate}</strong>
              <span className="text-[9px] text-neon-cyan-500 font-bold block mt-0.5">Wait: {g.waitTime}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="glass-card p-6 flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-2.5 mb-4">
            <Cpu className="w-5 h-5 text-neon-purple-400 animate-pulse" aria-hidden="true" />
            <h3 className="font-display font-bold text-base text-white">AI Bottleneck Forecast</h3>
          </div>

          <div className="bg-void-900/60 border border-void-600/10 rounded-xl p-4 min-h-[220px] overflow-y-auto max-h-[300px] custom-scrollbar mb-4 text-xs font-mono text-void-200">
            {forecast ? (
              <div className="prose prose-invert prose-xs">
                {forecast.split('\n').map((line, idx) => {
                  if (line.startsWith('### ')) {
                    return <h3 key={idx} className="text-xs font-bold text-white mt-3 mb-1 uppercase">{line.replace('### ', '')}</h3>;
                  }
                  if (line.startsWith('* ') || line.startsWith('- ')) {
                    return <li key={idx} className="ml-3 list-disc text-void-300 py-0.5">{line.substring(2)}</li>;
                  }
                  return <p key={idx} className="py-0.5">{line}</p>;
                })}
              </div>
            ) : (
              <div className="py-16 flex flex-col items-center justify-center text-center text-void-600">
                <AlertTriangle className="w-8 h-8 opacity-20 mb-2" aria-hidden="true" />
                <span className="text-[10px] font-mono tracking-widest font-bold">Inference Matrix Standby</span>
              </div>
            )}
          </div>
        </div>

        <button
          onClick={handleGenerateForecast}
          disabled={isGeneratingForecast}
          className="w-full py-3 rounded-xl bg-neon-purple-500 hover:bg-neon-purple-400 text-white font-bold text-xs uppercase transition-all flex items-center justify-center gap-2 shadow-neon-glow-purple cursor-pointer disabled:opacity-50"
        >
          <Play className="w-4 h-4" aria-hidden="true" />
          Compile Bottleneck Forecast
        </button>
      </div>
    </div>
  );
};
