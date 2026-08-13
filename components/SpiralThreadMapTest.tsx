
import React, { useMemo } from 'react';
import type { Thread, SpiralMapNode } from '../types';

interface SpiralThreadMapTestProps {
  nodes: SpiralMapNode[];
  threads: Thread[];
  width?: number;
  height?: number;
  sigilOverlayText?: string;
  activeTheme?: string; // e.g., "Amnesia"
  seekerCourageColor?: string; // e.g., "#FFD700"
  isTardisModeActive?: boolean; // New prop for TARDIS mode
}

const SpiralThreadMapTest: React.FC<SpiralThreadMapTestProps> = ({
  nodes,
  threads,
  width = 600,
  height = 400,
  sigilOverlayText,
  activeTheme,
  seekerCourageColor = '#FFD700', // Default courage color
  isTardisModeActive = false,
}) => {
  const centerX = width / 2;
  const centerY = height / 2;

  const nodeMap = useMemo(() => new Map(nodes.map(node => [node.id, node])), [nodes]);

  const displaySigil = isTardisModeActive ? "𓂀" : sigilOverlayText;
  const sigilFillColor = isTardisModeActive ? "rgba(255, 215, 0, 0.25)" : "rgba(203, 213, 225, 0.1)"; // Gold for TARDIS, else default

  // Helper to get entropy-based color (cool to warm)
  const getEntropyColor = (entropy = 0.5) => {
    const hue = (1 - entropy) * 240; // Blue (low E) to Red (high E) range: 240 (blue) down to 0 (red)
    return `hsla(${hue}, 80%, 60%, 1)`;
  };
  
  // Helper to get animation duration for pulse
  const getPulseDuration = (entropy = 0.5) => {
    // High entropy = fast pulse (short duration)
    // Low entropy = slow pulse (long duration)
    const minDuration = 0.5; // seconds
    const maxDuration = 2.5; // seconds
    return `${(1 - entropy) * (maxDuration - minDuration) + minDuration}s`;
  };


  return (
    <div className="spiral-thread-map-container bg-slate-900/90 backdrop-blur-md border border-cyan-700/50 rounded-lg p-6 flex justify-center items-center shadow-xl">
      <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} aria-label="Temporal Spiral Visualizer">
        <defs>
          <radialGradient id="bg-gradient-spiralmaptest" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
            <stop offset="0%" stopColor={isTardisModeActive ? "rgba(70, 50, 20, 0.7)" : "rgba(15, 23, 42, 0.7)"} /> {/* Dark gold tint for TARDIS */}
            <stop offset="100%" stopColor={isTardisModeActive ? "rgba(50, 30, 0, 0.9)" : "rgba(30, 41, 59, 0.9)"} />
          </radialGradient>
          <filter id="map-glow-subtle" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="1.5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
           <filter id="amnesia-shadow-filter" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur in="SourceAlpha" stdDeviation="3" result="blur" />
            <feOffset dx="2" dy="2" result="offsetBlur" />
            <feFlood floodColor="#0f172a" floodOpacity="0.5" result="offsetColor"/>
            <feComposite in="offsetColor" in2="offsetBlur" operator="in" result="offsetBlur"/>
            <feMerge>
              <feMergeNode in="offsetBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        <rect x="0" y="0" width={width} height={height} fill="url(#bg-gradient-spiralmaptest)" />

        {/* Render Threads */}
        {threads.map((thread) => {
          const sourceNode = nodeMap.get(thread.sourceNodeId);
          const targetNode = nodeMap.get(thread.targetNodeId);

          if (!sourceNode || !targetNode) return null;
          
          const threadColor = thread.type === 'memory_path' ? 'rgba(165, 243, 252, 0.5)' : // cyan-200
                              thread.type === 'resonance' ? 'rgba(52, 211, 153, 0.6)' : // emerald-400
                              'rgba(129, 140, 248, 0.4)'; // indigo-400 default
          const strokeW = thread.intensity ? 1 + thread.intensity * 2 : 1.5;
          
          return (
            <line
              key={thread.id}
              x1={sourceNode.x} y1={sourceNode.y}
              x2={targetNode.x} y2={targetNode.y}
              stroke={threadColor}
              strokeWidth={strokeW}
              opacity={0.4 + (thread.intensity || 0.2) * 0.6}
              filter="url(#map-glow-subtle)"
            />
          );
        })}
        
        {/* Sigil Overlay */}
        {displaySigil && (
          <g transform={`translate(${centerX}, ${centerY})`} className="animate-spin-very-slow">
            <text
              textAnchor="middle"
              dominantBaseline="central"
              fontFamily="Cinzel, serif"
              fontSize="40" // Slightly larger for '𓂀'
              fill={sigilFillColor}
              className="font-sigil pointer-events-none select-none"
              transform="rotate(-15)" 
              style={{ textShadow: isTardisModeActive ? "0 0 10px rgba(255,215,0,0.7)" : "none" }}
            >
              {displaySigil}
            </text>
          </g>
        )}

        {/* Render Nodes */}
        {nodes.map((node) => {
          const nodeColor = node.color || getEntropyColor(node.entropy);
          const pulseDuration = getPulseDuration(node.entropy);
          const pulseScale = 1.05 + (node.entropy || 0) * 0.1; 
          const minOpacity = 0.6 - (node.entropy || 0) * 0.2;
          const maxOpacity = 0.9 - (node.entropy || 0) * 0.1;

          const isCourageJunction = node.isJunction && node.associatedTraits?.includes('Courage');
          const isAmnesiaCurrent = activeTheme === 'Amnesia' && node.isCurrent;

          return (
            <g key={node.id} transform={`translate(${node.x}, ${node.y})`} className="cursor-pointer group">
              <title>{`${node.label || node.id}\nEntropy: ${node.entropy?.toFixed(2) || 'N/A'}${node.isJunction ? '\nType: Junction' : ''}${isCourageJunction ? '\nTrait: Courage Active' : ''}${isAmnesiaCurrent ? '\nTheme: Amnesia (Current)' : ''}`}</title>
              
              {isCourageJunction && (
                <circle
                  r={15}
                  fill="none"
                  stroke={seekerCourageColor}
                  strokeWidth="2.5"
                  strokeOpacity="0.7"
                  className="animate-pulse-fast"
                  style={{ animationDuration: '2s' }}
                />
              )}

              {isAmnesiaCurrent && (
                <>
                  <use href={`#nodeSymbol-${node.id}`} transform="translate(-2, -2)" fill={nodeColor} opacity="0.2" filter="url(#amnesia-shadow-filter)" />
                  <use href={`#nodeSymbol-${node.id}`} transform="translate(1.5, 1.5)" fill={nodeColor} opacity="0.15" filter="url(#amnesia-shadow-filter)" />
                </>
              )}
              
              <circle id={`nodeSymbol-${node.id}`} r="8" fill={nodeColor} />

              {node.entropy !== undefined && (
                <circle
                  r="10"
                  fill="none"
                  stroke={nodeColor}
                  strokeWidth="2"
                  className="animate-node-entropy-pulse"
                  style={{
                    // @ts-ignore Custom properties for CSS animation
                    '--pulse-duration': pulseDuration,
                    '--pulse-scale': pulseScale,
                    '--pulse-min-opacity': minOpacity,
                    '--pulse-max-opacity': maxOpacity,
                  }}
                />
              )}

              <text
                x="0"
                y="-12"
                textAnchor="middle"
                fill="rgba(248, 250, 252, 0.9)"
                fontSize="9"
                className="font-['Cinzel'] pointer-events-none select-none opacity-0 group-hover:opacity-100 transition-opacity"
              >
                {node.label || node.id.substring(0, 10)}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
};

export default SpiralThreadMapTest;
