
import React from 'react';
import type { CelticKnotStrand, KnotSystemState } from '../../types';

interface CelticKnotPanelProps {
  knotSystemState: KnotSystemState;
  celticKnotStrands: CelticKnotStrand[];
  width?: number;
  height?: number;
}

const STRAND_COLORS = {
  negentropic: { stroke: '#34D399', glow: 'shadow-[0_0_8px_#34D399]' }, // emerald-500
  harmonized: { stroke: '#60A5FA', glow: 'shadow-[0_0_8px_#60A5FA]' },   // blue-400
  chaotic: { stroke: '#F87171', glow: 'shadow-[0_0_8px_#F87171]' },     // rose-400
};

const getNegentropyRingColor = (negentropy: number): string => {
  if (negentropy >= 0.7) return '#FCD34D'; // gold-400
  if (negentropy >= 0.3) return '#34D399'; // emerald-500
  return '#D1D5DB'; // silver/gray-300
};

export const CelticKnotPanel: React.FC<CelticKnotPanelProps> = ({
  knotSystemState,
  celticKnotStrands,
  width = 300,
  height = 300,
}) => {
  const viewBoxSize = 100; // SVG internal coordinate system size
  const centerX = viewBoxSize / 2;
  const centerY = viewBoxSize / 2;
  const knotRadius = viewBoxSize * 0.35;

  // Simplified knot paths - these are basic overlapping loops for visual effect
  const strandPaths = [
    `M ${centerX - knotRadius} ${centerY} A ${knotRadius} ${knotRadius*0.7} 0 1 0 ${centerX + knotRadius} ${centerY} A ${knotRadius} ${knotRadius*0.7} 0 1 0 ${centerX - knotRadius} ${centerY}`, // Outer loop (horizontal ellipse)
    `M ${centerX} ${centerY - knotRadius*0.7} A ${knotRadius*0.7} ${knotRadius} 0 1 0 ${centerX} ${centerY + knotRadius*0.7} A ${knotRadius*0.7} ${knotRadius} 0 1 0 ${centerX} ${centerY - knotRadius*0.7}`, // Inner loop (vertical ellipse)
    `M ${centerX - knotRadius*0.8} ${centerY - knotRadius*0.2} Q ${centerX} ${centerY - knotRadius*1.2}, ${centerX + knotRadius*0.8} ${centerY - knotRadius*0.2}`, // Top curve
    `M ${centerX - knotRadius*0.8} ${centerY + knotRadius*0.2} Q ${centerX} ${centerY + knotRadius*1.2}, ${centerX + knotRadius*0.8} ${centerY + knotRadius*0.2}`, // Bottom curve
  ];

  const ringColor = getNegentropyRingColor(knotSystemState.negentropy);
  const ringOpacity = 0.3 + knotSystemState.negentropy * 0.7;

  return (
    <div 
        className="celtic-knot-panel bg-slate-900/80 backdrop-blur-sm border border-slate-700 rounded-lg p-6 shadow-xl"
        aria-label="Celtic Infinity Knot Panel visualizing system connections"
    >
      <h3 className="text-xl font-cinzel text-slate-100 mb-4 text-center">🌀 Celtic Infinity Knot</h3>
      <div style={{ width: `${width}px`, height: `${height}px` }} className="mx-auto">
        <svg viewBox={`0 0 ${viewBoxSize} ${viewBoxSize}`} width="100%" height="100%">
          <defs>
            <filter id="knot-glow-filter" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="1.5" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>
          
          {/* Negentropy Pulse Ring */}
          <circle
            cx={centerX}
            cy={centerY}
            r={knotRadius * 1.15}
            fill="none"
            stroke={ringColor}
            strokeWidth="3"
            strokeOpacity={ringOpacity * 0.5}
            className="animate-negentropic-pulse"
            style={{ animationDuration: `${2.5 - knotSystemState.negentropy * 1.5}s`}}
          />
          <circle
            cx={centerX}
            cy={centerY}
            r={knotRadius * 1.25}
            fill="none"
            stroke={ringColor}
            strokeWidth="1.5"
            strokeOpacity={ringOpacity * 0.3}
             className="animate-negentropic-pulse"
             style={{ animationDelay: '0.5s', animationDuration: `${3 - knotSystemState.negentropy * 1.5}s` }}
          />

          {/* Knot Strands */}
          {celticKnotStrands.slice(0, strandPaths.length).map((strand, index) => {
            const strandStyle = STRAND_COLORS[strand.orderType] || STRAND_COLORS.harmonized;
            const pathData = strandPaths[index % strandPaths.length];
            const strokeWidth = strand.orderType === 'negentropic' ? 3 : strand.orderType === 'chaotic' ? 1.5 : 2;
            const opacity = 0.6 + strand.harmonyLevel * 0.4;
            const strokeDasharray = strand.orderType === 'chaotic' ? "3, 3" : "none";

            return (
              <path
                key={strand.id}
                d={pathData}
                fill="none"
                stroke={strandStyle.stroke}
                strokeWidth={strokeWidth + knotSystemState.negentropy * 1 - knotSystemState.entropy * 1} // Dynamic thickness
                strokeOpacity={opacity * (0.5 + (1-knotSystemState.entropy)*0.5)}
                strokeLinecap="round"
                strokeDasharray={strokeDasharray}
                className="transition-all duration-500 ease-in-out"
                style={{ filter: `drop-shadow(0 0 3px ${strandStyle.stroke})` }}
                // filter="url(#knot-glow-filter)" // Glow filter can be intensive
              />
            );
          })}
        </svg>
      </div>
      <div className="text-center mt-4 text-xs text-slate-400 font-mono">
        <p>Entropy: {knotSystemState.entropy.toFixed(3)}δ | Negentropy: {knotSystemState.negentropy.toFixed(3)}ν</p>
        <p className="mt-1">Strands Active: {celticKnotStrands.length}</p>
      </div>
    </div>
  );
};

export default CelticKnotPanel;
