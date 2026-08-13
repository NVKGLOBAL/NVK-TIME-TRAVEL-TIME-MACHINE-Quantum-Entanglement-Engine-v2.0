
import React, { useState } from 'react';
import type { Axiom } from '../types';
import { CornerDecoration } from './CornerDecoration';

interface AxiomCardProps {
  axiom: Axiom;
  onClick: () => void;
}

const layerStyles: Record<Axiom['layer'], { numeral: string; glow: string; bg: string }> = {
  'I': { numeral: 'I', glow: 'text-cyan-300', bg: 'border-cyan-700/50' },
  'II': { numeral: 'II', glow: 'text-amber-300', bg: 'border-amber-700/50' },
  'III': { numeral: 'III', glow: 'text-violet-300', bg: 'border-violet-700/50' },
  'IV': { numeral: 'IV', glow: 'text-rose-300', bg: 'border-rose-700/50' },
  'V': { numeral: 'V', glow: 'text-fuchsia-400', bg: 'border-fuchsia-700/50' }, // New layer style
  'Ω': { numeral: 'Ω', glow: 'text-lime-400', bg: 'border-lime-700/50' }, // Adjusted Omega color for consistency
};


export const AxiomCard: React.FC<AxiomCardProps> = ({ axiom, onClick }) => {
  const [isHovered, setIsHovered] = useState(false);
  
  const styles = layerStyles[axiom.layer] || layerStyles['I']; // Fallback to 'I' if layer is unexpected

  return (
    <div
      className={`axiom-card relative p-6 rounded-lg transition-all duration-300 ease-in-out cursor-pointer bg-slate-900/90 ${styles.bg} ${isHovered ? 'translate-y-[-4px] shadow-[0_10px_25px_rgba(0,0,0,0.4)]' : 'shadow-none'}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
      role="button"
      tabIndex={0}
      aria-label={`Axiom ${styles.numeral}: ${axiom.title}`}
    >
      <CornerDecoration position="tl" glowClass={styles.glow} />
      <CornerDecoration position="tr" glowClass={styles.glow} />
      <CornerDecoration position="bl" glowClass={styles.glow} />
      <CornerDecoration position="br" glowClass={styles.glow} />
      
      <div className="relative z-10"> {/* Ensure content is above pseudo-element */}
        <div className={`axiom-numeral text-center text-3xl mb-2 font-['Cinzel'] font-bold ${styles.glow}`}>{styles.numeral}</div>
        <h2 className={`axiom-title text-center text-xl mb-4 font-['Cinzel'] tracking-wider ${styles.glow}`}>{axiom.title}</h2>
        <div className="axiom-content text-center text-slate-200 font-['Cormorant'] text-lg leading-relaxed whitespace-pre-line">
          {axiom.content}
        </div>
      </div>
    </div>
  );
};
