import React from 'react';
import { FileText } from 'lucide-react';

export const DocumentList: React.FC = () => {
  const documents = [
    { tag: "C-204", file: "C-204 Compressor OEM Spec", type: "Manual", size: "14.2 MB" },
    { tag: "P-101", file: "P-101 Pump Inspection Logbook", type: "Log", size: "3.5 MB" },
    { tag: "E-105", file: "E-105 Heat Exchanger Clean SOP", type: "SOP", size: "1.2 MB" }
  ];

  return (
    <div className="glass-card p-6">
      <div className="flex items-center gap-2 mb-4">
        <FileText className="w-4 h-4 text-neon-cyan-400" aria-hidden="true" />
        <h4 className="font-display font-bold text-white text-sm">Ingested Plant Documents</h4>
      </div>
      <div className="space-y-2.5 max-h-[220px] overflow-y-auto pr-1 custom-scrollbar" role="list">
        {documents.map((doc, i) => (
          <div 
            key={i} 
            className="flex justify-between items-center p-2.5 bg-void-900 border border-void-600/10 rounded-xl hover:border-void-500 transition-colors"
            role="listitem"
          >
            <div className="min-w-0 flex-1 pr-3">
              <span className="text-[10px] font-bold text-white block truncate" title={doc.file}>{doc.file}</span>
              <span className="text-[9px] font-mono text-void-500 uppercase">{doc.type} • {doc.size}</span>
            </div>
            <span className="px-2 py-0.5 rounded bg-neon-cyan-500/10 border border-neon-cyan-500/30 text-[8px] font-mono text-neon-cyan-400 flex-shrink-0">
              {doc.tag}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
export default DocumentList;
