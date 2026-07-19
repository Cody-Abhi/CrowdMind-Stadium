import React from 'react';
import { motion } from 'motion/react';
import { Terminal, Play, RefreshCw, Cpu, Activity, Clock } from 'lucide-react';
import { FunctionLog } from '../../types';

interface FunctionsTabProps {
  functionsLogs: FunctionLog[];
  isExecutingFunction: string | null;
  handleTriggerCloudFunction: (funcId: string, funcName: string) => Promise<void>;
}

export const FunctionsTab: React.FC<FunctionsTabProps> = ({
  functionsLogs,
  isExecutingFunction,
  handleTriggerCloudFunction
}) => {
  const availableFunctions = [
    { id: 'ocr-opt', name: 'optimizeArabicOCRTranslation', desc: 'Pre-compiles sign cache layers to cut Arabic translation processing times.', icon: Cpu },
    { id: 'predictive-hvac', name: 'recalculateStadiumClimateHVACLoad', desc: 'Correlates ambient sensors to establish smart climate cooling metrics.', icon: Activity },
    { id: 'steward-sla', name: 'enforceStewardResponseSLA', desc: 'Checks tickets wait times and dispatches push alerts to standby stewards.', icon: Terminal }
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }} 
      animate={{ opacity: 1, y: 0 }} 
      exit={{ opacity: 0, y: -10 }} 
      className="space-y-8"
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Actions Column */}
        <div className="lg:col-span-5 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="font-display font-bold text-xl text-white flex items-center gap-2">
              <Terminal className="w-5 h-5 text-neon-purple-400" />
              Serverless Triggers
            </h3>
            <span className="text-[10px] font-mono text-void-500 uppercase tracking-widest">Active Runtime: v2</span>
          </div>
          
          <div className="space-y-4">
            {availableFunctions.map((func) => (
              <div key={func.id} className="glass-panel p-5 group flex flex-col justify-between min-h-[160px]">
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <div className="p-1.5 bg-void-950 rounded-lg group-hover:bg-neon-purple-500/10 transition-colors border border-void-600/10">
                      <func.icon className="w-4 h-4 text-neon-purple-400" />
                    </div>
                    <strong className="text-xs font-mono font-bold text-white group-hover:text-neon-purple-400 transition-colors">{func.name}</strong>
                  </div>
                  <p className="text-[11px] text-void-400 leading-relaxed font-sans pr-4">{func.desc}</p>
                </div>
                
                <button
                  onClick={() => handleTriggerCloudFunction(func.id, func.name)}
                  disabled={isExecutingFunction !== null}
                  className="mt-6 w-full py-2.5 bg-void-900 hover:bg-neon-purple-500 text-white font-mono font-bold text-[10px] rounded-lg uppercase tracking-wider transition-all border border-void-700 flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {isExecutingFunction === func.id ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin text-white" />
                      Invocating...
                    </>
                  ) : (
                    <>
                      <Play className="w-3 h-3 fill-current" />
                      Invoke Node.js Runtime
                    </>
                  )}
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Functions Exec Log Column */}
        <div className="lg:col-span-7 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="font-display font-bold text-xl text-white flex items-center gap-2">
              <Activity className="w-5 h-5 text-neon-cyan-400" />
              Runtime Audit Stream
            </h3>
            <span className="text-[10px] font-mono text-void-500 uppercase tracking-widest">Latency Filter: All</span>
          </div>

          <div className="glass-panel overflow-hidden border-void-600/10">
            <div className="bg-void-950/80 px-6 py-4 border-b border-void-600/20 grid grid-cols-12 gap-4 text-[10px] font-mono font-bold text-void-500 uppercase tracking-widest">
              <div className="col-span-6">Function Signature</div>
              <div className="col-span-2">Status</div>
              <div className="col-span-2">Delay</div>
              <div className="col-span-2 text-right">Timestamp</div>
            </div>

            <div className="max-h-[500px] overflow-y-auto custom-scrollbar divide-y divide-void-600/5">
              {functionsLogs.length === 0 ? (
                <div className="py-32 flex flex-col items-center justify-center space-y-3 opacity-30">
                  <Terminal className="w-12 h-12 text-void-500" />
                  <p className="text-xs font-mono text-void-500 uppercase tracking-widest">No runtime logs detected</p>
                </div>
              ) : (
                functionsLogs.map((log, idx) => (
                  <motion.div 
                    key={log.id || idx} 
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="px-6 py-4 space-y-3 hover:bg-void-500/5 transition-colors"
                  >
                    <div className="grid grid-cols-12 gap-4 items-center">
                      <div className="col-span-6 font-bold text-white truncate font-mono text-xs">{log.functionName}</div>
                      <div className="col-span-2">
                        <span className="px-2 py-0.5 rounded bg-state-success-bg/10 text-state-success-text text-[9px] font-bold border border-state-success-text/20 uppercase tracking-tighter">
                          {log.status}
                        </span>
                      </div>
                      <div className="col-span-2 text-void-400 font-mono text-[10px] flex items-center gap-1">
                        <Clock className="w-3 h-3" /> {log.durationMs}ms
                      </div>
                      <div className="col-span-2 text-right text-void-500 font-mono text-[10px]">
                        {log.executedAt.substring(11, 19)}
                      </div>
                    </div>
                    
                    <div className="p-3 bg-void-950/50 rounded-lg border border-void-600/10 font-mono text-[11px] text-void-400 flex flex-col gap-1.5">
                      <div className="flex items-center gap-2">
                        <span className="text-neon-purple-500 font-bold tracking-tighter uppercase text-[9px]">Output_Payload:</span>
                        <span className="text-void-300 italic">"{log.output}"</span>
                      </div>
                      <div className="flex items-center gap-4 text-[10px]">
                        <span>Memory: <strong className="text-void-200">{log.memoryUsedMb}MB</strong></span>
                        <span>Node: <strong className="text-void-200">GCP-EUW1</strong></span>
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
