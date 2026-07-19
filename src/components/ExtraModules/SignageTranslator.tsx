import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Languages, Cpu, Sparkles } from 'lucide-react';
import { geminiService } from '../../services/geminiService';

const simulatedSigns = [
  { text: "دليل الصيانة الوقائية - يجب فحص ضغط الزيت في الضاغط C-204 كل 24 ساعة", label: "OEM Manual Section 4.2 - C-204 Compressor Lubrication", arabicText: "دليل الصيانة الوقائية - يجب فحص ضغط الزيت في الضاغط C-204 كل 24 ساعة" },
  { text: "تحذير: منطقة ضغط عالي - لا تفتح الصمام اليدوي V-42 دون إيقاف تشغيل المضخة P-101", label: "P-101 Pump Egress Safety Instruction Signboard", arabicText: "تحذير: منطقة ضغط عالي - لا تفتح الصمام اليدوي V-42 دون إيقاف تشغيل المضخة P-101" },
  { text: "إجراءات غسيل المبادل الحراري E-105 بالمواد الكيميائية", label: "Exchanger E-105 Tube Chemical Flush SOP Procedure", arabicText: "إجراءات غسيل المبادل الحراري E-105 بالمواد الكيميائية" }
];

export const SignageTranslator: React.FC = () => {
  const [selectedSign, setSelectedSign] = useState(simulatedSigns[0]);
  const [isTranslating, setIsTranslating] = useState(false);
  const [translationResult, setTranslationResult] = useState<string | null>(null);
  const [scanning, setScanning] = useState(false);

  const handleTranslate = async () => {
    setScanning(true);
    setIsTranslating(true);
    setTranslationResult(null);
    await new Promise(r => setTimeout(r, 1500)); // scan animation
    setScanning(false);

    try {
      const response = await geminiService.generateContent(
        `Translate the following Arabic OEM manual text to English and Spanish. Page label: "${selectedSign.label}". Arabic text: "${selectedSign.arabicText}". Explain the safety or maintenance implications.`,
        "You are StadiumMind PS8 Doc OCR Translation system. Respond in a clean, formatted layout with English and Spanish translations, and a brief description of the technical instructions."
      );
      if (response.error) throw new Error(response.error);
      setTranslationResult(response.text);
    } catch (err) {
      setTranslationResult("### SYSTEM LINK ERROR\nOCR Translation synthesis failed. Check endpoint parameters and try again.");
    } finally {
      setIsTranslating(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 min-h-[500px]">
      <div className="glass-card p-6 flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-3 mb-6">
            <Languages className="w-5 h-5 text-neon-cyan-400" aria-hidden="true" />
            <h3 className="font-display font-bold text-lg text-white">AI Signage Translator</h3>
          </div>

          <p className="text-void-400 text-xs leading-relaxed mb-6">
            Select a physical placard signage scanned inside Lusail Stadium to simulate translation with OCR spatial awareness.
          </p>

          <div className="space-y-2.5 mb-6" role="group" aria-label="Select signboard to translate">
            {simulatedSigns.map((sign, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setSelectedSign(sign);
                  setTranslationResult(null);
                }}
                className={`w-full p-4 rounded-xl border text-left transition-all cursor-pointer ${
                  selectedSign.text === sign.text
                    ? 'bg-neon-cyan-500/10 border-neon-cyan-500 text-white shadow-neon-glow-cyan'
                    : 'bg-void-900 border-void-700/40 text-void-400 hover:border-void-600'
                }`}
                aria-pressed={selectedSign.text === sign.text}
              >
                <div className="text-[10px] font-mono text-neon-cyan-400 font-bold uppercase tracking-wider mb-1.5">{sign.label}</div>
                <div className="text-sm font-sans font-medium text-white text-right leading-relaxed" dir="rtl">{sign.text}</div>
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={handleTranslate}
          disabled={isTranslating}
          className="w-full py-3.5 rounded-xl bg-neon-cyan-500 hover:bg-neon-cyan-400 text-white font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-neon-glow-cyan cursor-pointer disabled:opacity-50"
        >
          <Cpu className="w-4 h-4 animate-spin" style={{ animationDuration: isTranslating ? '2s' : '0s' }} aria-hidden="true" />
          Compile Translation Matrix
        </button>
      </div>

      <div className="glass-card p-6 flex flex-col justify-center relative overflow-hidden">
        {/* Scanning Sweep Overlay */}
        {scanning && (
          <motion.div 
            initial={{ top: "0%" }}
            animate={{ top: "100%" }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
            className="absolute inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-neon-cyan-400 to-transparent shadow-neon-glow-cyan z-20 pointer-events-none"
          />
        )}
        
        <div className="flex-grow flex flex-col justify-center">
          {translationResult ? (
            <div className="space-y-4 max-h-[420px] overflow-y-auto pr-1 custom-scrollbar">
              <div className="prose prose-invert prose-xs max-w-none text-xs leading-relaxed space-y-3 font-mono">
                {translationResult.split('\n').map((line, index) => {
                  if (line.startsWith('### ')) {
                    return <h3 key={index} className="text-xs font-bold text-white mt-4 mb-2 uppercase tracking-wide border-b border-void-600/10 pb-1 flex items-center gap-1.5"><Sparkles className="w-3.5 h-3.5 text-neon-cyan-400" aria-hidden="true" /> {line.replace('### ', '')}</h3>;
                  }
                  if (line.startsWith('* ') || line.startsWith('- ')) {
                    return <li key={index} className="ml-4 list-disc text-void-300 py-0.5">{line.substring(2)}</li>;
                  }
                  if (line.trim() === '') return <div key={index} className="h-1" />;
                  return <p key={index} className="text-void-300 py-0.5">{line}</p>;
                })}
              </div>
            </div>
          ) : (
            <div className="py-20 flex flex-col items-center justify-center text-center text-void-600">
              <Languages className="w-12 h-12 opacity-25 mb-4 animate-pulse" aria-hidden="true" />
              <h4 className="text-xs font-mono uppercase tracking-widest font-bold">Scanning Node Empty</h4>
              <p className="text-[10px] text-void-500 max-w-xs mt-2 leading-relaxed">Select a scanned signboard and click Translate to compile with OCR.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
