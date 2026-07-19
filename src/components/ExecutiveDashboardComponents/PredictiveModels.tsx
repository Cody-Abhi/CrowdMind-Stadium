import React from 'react';
import { Sliders } from 'lucide-react';

interface PredictiveModelsProps {
  sliderAttendance: number;
  setSliderAttendance: (val: number) => void;
  sliderTemp: number;
  setSliderTemp: (val: number) => void;
  sliderStewardRatio: number;
  setSliderStewardRatio: (val: number) => void;
  predictedTotalRevenue: number;
  predictedGateCongestion: number;
  recommendedStaff: number;
  predictedCoolingLoad: number;
}

export const PredictiveModels: React.FC<PredictiveModelsProps> = ({
  sliderAttendance,
  setSliderAttendance,
  sliderTemp,
  setSliderTemp,
  sliderStewardRatio,
  setSliderStewardRatio,
  predictedTotalRevenue,
  predictedGateCongestion,
  recommendedStaff,
  predictedCoolingLoad
}) => {
  return (
    <div className="bg-void-850 border border-void-600/20 rounded-2xl p-6 flex flex-col justify-between h-full">
      <div>
        <div className="flex items-center gap-2 mb-3">
          <Sliders className="w-5 h-5 text-neon-cyan-400" />
          <h3 className="font-display font-bold text-lg text-white">Dynamic Predictive Models</h3>
        </div>
        <p className="text-void-400 text-xs leading-relaxed mb-6">
          Interact with deep plant parameters to re-simulate mechanical yield, cooling thresholds, and grid energy demand instantly.
        </p>

        <div className="space-y-6 bg-void-900 border border-void-600/15 p-5 rounded-xl">
          {/* Slider 1: Attendance/Capacity */}
          <div>
            <div className="flex justify-between items-center mb-1.5 font-mono text-[10px]">
              <span className="text-void-300 uppercase tracking-wider">PROJECTED CAPACITY RATE</span>
              <span className="text-neon-cyan-400 font-bold text-xs">{(sliderAttendance).toLocaleString()} PAX/hr</span>
            </div>
            <input
              type="range"
              min="10000"
              max="80000"
              step="2000"
              value={sliderAttendance}
              onChange={(e) => setSliderAttendance(Number(e.target.value))}
              className="w-full accent-neon-cyan-500 h-1 bg-void-800 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[9px] text-void-500 mt-1 font-mono">
              <span>10K (Sparse Flow)</span>
              <span>56K (Full Load)</span>
              <span>80K (Overload State)</span>
            </div>
          </div>

          {/* Slider 2: Temperature */}
          <div>
            <div className="flex justify-between items-center mb-1.5 font-mono text-[10px]">
              <span className="text-void-300 uppercase tracking-wider">CORE OPERATING TEMPERATURE</span>
              <span className="text-neon-purple-400 font-bold text-xs">{sliderTemp}°C</span>
            </div>
            <input
              type="range"
              min="15"
              max="45"
              step="1"
              value={sliderTemp}
              onChange={(e) => setSliderTemp(Number(e.target.value))}
              className="w-full accent-neon-purple-500 h-1 bg-void-800 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[9px] text-void-500 mt-1 font-mono">
              <span>15°C (Cooling Active)</span>
              <span>24°C (Normal Load)</span>
              <span>45°C (Extreme Temperature)</span>
            </div>
          </div>

          {/* Slider 3: Volunteer Steward Ratio */}
          <div>
            <div className="flex justify-between items-center mb-1.5 font-mono text-[10px]">
              <span className="text-void-300 uppercase tracking-wider">COMPRESSOR STEAM PRESSURE</span>
              <span className="text-neon-blue-400 font-bold text-xs">{sliderStewardRatio} bar</span>
            </div>
            <input
              type="range"
              min="50"
              max="150"
              step="10"
              value={sliderStewardRatio}
              onChange={(e) => setSliderStewardRatio(Number(e.target.value))}
              className="w-full accent-neon-blue-500 h-1 bg-void-800 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[9px] text-void-500 mt-1 font-mono">
              <span>50 bar (Underpressured)</span>
              <span>100 bar (Nominal Pressure)</span>
              <span>150 bar (Critical Pressure)</span>
            </div>
          </div>
        </div>

        <div className="mt-6 space-y-3.5 pt-4 border-t border-void-600/10">
          <h4 className="text-xs font-mono text-void-400 uppercase tracking-wider">AI Predictive Projections</h4>
          
          <div className="grid grid-cols-2 gap-3.5">
            <div className="p-3 bg-void-900 border border-void-600/10 rounded-xl">
              <span className="text-[10px] text-void-500 block">EST. PLANT PERFORMANCE</span>
              <strong className="text-sm font-semibold text-white font-mono">{(predictedTotalRevenue / 100).toFixed(0)} KPI</strong>
            </div>
            
            <div className="p-3 bg-void-900 border border-void-600/10 rounded-xl">
              <span className="text-[10px] text-void-500 block">GRID FAULT COEFFICIENT</span>
              <strong className={`text-sm font-semibold font-mono ${predictedGateCongestion > 75 ? 'text-state-danger-text' : predictedGateCongestion > 45 ? 'text-neon-purple-400' : 'text-state-success-text'}`}>
                {(predictedGateCongestion / 100).toFixed(2)}
              </strong>
            </div>

            <div className="p-3 bg-void-900 border border-void-600/10 rounded-xl">
              <span className="text-[10px] text-void-500 block">RECOMMENDED COOLING UNITS</span>
              <strong className="text-sm font-semibold text-white font-mono">{Math.round(recommendedStaff / 10)} units</strong>
            </div>

            <div className="p-3 bg-void-900 border border-void-600/10 rounded-xl">
              <span className="text-[10px] text-void-500 block">TOTAL GRID AUX POWER</span>
              <strong className="text-sm font-semibold text-white font-mono">{predictedCoolingLoad.toLocaleString()} kW</strong>
            </div>
          </div>
        </div>
      </div>

  <div className="mt-6 p-3 bg-void-900/60 rounded-xl border border-void-600/15 text-center text-[10px] font-mono text-void-500 leading-relaxed">
    AI prediction models trained on historical plant log records.
  </div>
    </div>
  );
};
