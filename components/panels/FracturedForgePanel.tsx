
import React from 'react';
import type { GlyphMutationNode, HistoricalGlyphFracturedEvent } from '../../types';
import { AgentName } from '../../types'; // For potential future use, not directly used in this display panel

interface FracturedForgePanelProps {
  lastFractureDetails: HistoricalGlyphFracturedEvent['data'] | null;
  glyphMutationNodes: GlyphMutationNode[];
  fractureEntropyCost: number;
}

const GlyphDetailCard: React.FC<{ title: string; glyph: GlyphMutationNode | undefined; titleColorClass?: string }> = ({ title, glyph, titleColorClass = "text-slate-300" }) => {
  if (!glyph) {
    return (
      <div className="p-4 bg-slate-800/60 rounded-lg border border-slate-700/50 shadow-md">
        <h4 className={`text-md font-cinzel font-semibold mb-2 ${titleColorClass}`}>{title}</h4>
        <p className="text-xs text-slate-500 italic">No data available.</p>
      </div>
    );
  }
  return (
    <div className="p-3 md:p-4 bg-slate-800/70 rounded-lg border border-slate-600/70 shadow-lg text-xs">
      <h4 className={`text-sm md:text-md font-cinzel font-semibold mb-2 ${titleColorClass} border-b border-current/30 pb-1`}>{title}</h4>
      <p><strong className="text-slate-400">ID:</strong> <span className="text-slate-200 break-all">{glyph.glyphId}</span></p>
      <p><strong className="text-slate-400">Label:</strong> <span className="text-slate-200">{glyph.label || 'N/A'}</span></p>
      <p><strong className="text-slate-400">Entropy:</strong> <span className="text-slate-200">{glyph.entropyLevel.toFixed(3)}δ</span></p>
      <p className="mt-1"><strong className="text-slate-400">Traits:</strong></p>
      {glyph.traits.length > 0 ? (
        <ul className="list-disc list-inside ml-3 text-slate-300 text-[11px] leading-tight">
          {glyph.traits.map((trait, i) => <li key={i}>{trait}</li>)}
        </ul>
      ) : (
        <p className="text-slate-500 italic text-[11px] ml-3">None</p>
      )}
    </div>
  );
};


const FracturedForgePanel: React.FC<FracturedForgePanelProps> = ({
  lastFractureDetails,
  glyphMutationNodes,
  fractureEntropyCost,
}) => {
  const parentGlyph = lastFractureDetails ? glyphMutationNodes.find(g => g.id === lastFractureDetails.parentGlyphId) : undefined;
  const alphaShard = lastFractureDetails ? glyphMutationNodes.find(g => g.id === lastFractureDetails.newGlyphIdAlpha) : undefined;
  const omegaShard = lastFractureDetails ? glyphMutationNodes.find(g => g.id === lastFractureDetails.newGlyphIdOmega) : undefined;

  return (
    <div className="fractured-forge-panel bg-slate-950/80 backdrop-blur-xl border-2 border-orange-600/60 rounded-xl shadow-2xl p-4 md:p-6 text-slate-100 font-['Cormorant']">
      <h2 className="text-2xl md:text-3xl font-['Cinzel'] font-bold text-orange-400 mb-6 text-center tracking-wider drop-shadow-[0_1px_2px_rgba(255,180,100,0.5)]">
        <i className="ri-sword-fill mr-3 text-orange-500 transform -rotate-45"></i>
        Fractured Forge
        <i className="ri-sword-fill ml-3 text-orange-500 transform rotate-45 scale-x-[-1]"></i>
      </h2>

      {!lastFractureDetails ? (
        <div className="text-center text-slate-400 italic p-6 bg-slate-800/50 rounded-lg border border-slate-700">
          <i className="ri-hourglass-line text-3xl mb-2 text-orange-500/70"></i>
          <p>The Forge slumbers, awaiting a glyph to reforge.</p>
          <p className="text-xs mt-1">Invoke from the Header System Menu.</p>
        </div>
      ) : (
        <div className="space-y-4 md:space-y-6">
          <GlyphDetailCard title="Parent Glyph Forged" glyph={parentGlyph} titleColorClass="text-orange-300" />
          
          <div className="grid md:grid-cols-2 gap-4 md:gap-6 mt-3">
            <GlyphDetailCard title="Alpha Shard (Chaos)" glyph={alphaShard} titleColorClass="text-red-400" />
            <GlyphDetailCard title="Omega Shard (Order)" glyph={omegaShard} titleColorClass="text-sky-400" />
          </div>

          <div className="mt-4 p-3 bg-slate-800/70 rounded-lg border border-slate-700/50 text-center">
            <p className="text-sm font-semibold text-slate-300">
              Projected Entropy Shift: 
              <span className="font-mono text-orange-400 ml-1.5">+{fractureEntropyCost.toFixed(3)}δ</span>
              <span className="text-xs text-slate-400 ml-1">(Transformative Instability)</span>
            </p>
          </div>
        </div>
      )}
       <p className="text-center text-xs text-slate-500 mt-6 font-mono">
        <em className="text-orange-500/80">"From unity, duality. From fracture, new potential."</em><br/>― Codex Fragment, Forge Inscription
      </p>
    </div>
  );
};

export default FracturedForgePanel;

