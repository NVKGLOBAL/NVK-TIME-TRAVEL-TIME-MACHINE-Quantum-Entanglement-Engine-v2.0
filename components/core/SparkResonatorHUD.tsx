
import React from 'react';
import type { ResonanceEffect } from '../../types';

type Props = {
  effects: ResonanceEffect[];
  currentEntropy: number; // Renamed from implicit usage to explicit prop
};

const SparkResonatorHUD = ({ effects, currentEntropy }: Props) => {
  return (
    <div className="spark-resonator-hud fixed top-4 left-1/2 transform -translate-x-1/2 z-50 pointer-events-none" aria-live="polite" aria-atomic="true">
      <div className="relative w-48 h-48">
        {effects.slice(0, 5).map((effect, i) => { 
          const intensity = Math.min(Math.max(effect.intensity, 0.1), 1); 
          // Pulse size and opacity now also influenced by currentEntropy
          const entropyFactor = Math.min(1, Math.max(0, currentEntropy)) * 0.5 + 0.75; // Scale entropy effect: 0.75 to 1.25
          const pulseSize = (40 + intensity * 80) * entropyFactor;
          const opacity = (0.2 + intensity * 0.6) * Math.min(1, 1.5 - currentEntropy); // Higher entropy can reduce spark opacity slightly
          const color = effect.colorProfile || 'rgba(0, 200, 255, 0.5)'; 
          
          const animationDelay = `${i * 0.2}s`; 
          const animationDurationFactor = Math.max(0.5, 2 - currentEntropy * 1.5); // Faster pulse at high entropy

          return (
            <div
              key={effect.id}
              className="absolute rounded-full border-2 animate-ping-slow" 
              style={{
                width: `${pulseSize}px`,
                height: `${pulseSize}px`,
                left: `calc(50% - ${pulseSize / 2}px)`,
                top: `calc(50% - ${pulseSize / 2}px)`,
                borderColor: color,
                opacity,
                animationDelay, 
                animationDuration: `${2.5 * animationDurationFactor}s`, // Adjust base duration
                boxShadow: `0 0 ${10 + currentEntropy * 10}px ${color}, 0 0 ${15 + currentEntropy * 15}px ${color}`, // Glow stronger with entropy
              }}
              role="presentation"
            />
          );
        })}
        <div 
          className="absolute inset-0 rounded-full bg-gradient-to-tr from-indigo-800/30 via-sky-600/30 to-purple-700/30 blur-2xl opacity-30 animate-pulse-fast" 
          style={{ animationDuration: `${1 + currentEntropy * 2}s` }} // Core pulse speed affected by entropy
          role="presentation" 
        />
        <div className="absolute inset-1 rounded-full border-2 border-slate-600/50 blur-sm" role="presentation" />
      </div>
    </div>
  );
};

export default SparkResonatorHUD;
