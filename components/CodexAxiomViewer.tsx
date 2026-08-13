
import React from 'react';
import type { Axiom } from '../types';

type Props = {
  axioms: Axiom[];
};

const CodexAxiomViewer: React.FC<Props> = ({ axioms }) => {
  return (
    <div className="codex-axiom-viewer p-4 space-y-6 overflow-y-auto max-h-[80vh] bg-gradient-to-b from-slate-800/90 to-slate-950/90 text-slate-100 rounded-lg shadow-inner border border-slate-700/50">
      {axioms.map((a) => (
        <div key={a.id} className="p-4 border border-slate-600/70 rounded-md bg-slate-900/70 shadow-lg backdrop-blur-sm">
          <div className="flex justify-between items-center mb-2">
            <div className="text-xs uppercase tracking-widest text-indigo-300 font-['Cinzel']">{`Layer: ${a.layer}`}</div>
            <div className={`font-['Cinzel'] text-2xl ${
                a.layer === 'I' ? 'text-cyan-300' : 
                a.layer === 'II' ? 'text-amber-300' : 
                a.layer === 'III' ? 'text-violet-300' : 
                a.layer === 'IV' ? 'text-rose-300' : 
                a.layer === 'Ω' ? 'text-lime-400' : // Adjusted Omega color for variety
                'text-indigo-300' // Fallback
            }`}>{a.layer === 'Ω' ? 'Ω' : a.layer}</div>
          </div>
          <h3 className="text-xl font-semibold text-slate-100 font-['Cinzel'] mb-2 border-b border-slate-700 pb-2">{a.title}</h3>
          <p className="mt-2 text-sm text-slate-200 whitespace-pre-line leading-relaxed font-['Cormorant']">{a.content}</p>
        </div>
      ))}
    </div>
  );
};

export default CodexAxiomViewer;