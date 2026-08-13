
import React, { useEffect, useRef, useState, useCallback } from 'react';
import type { ResonanceEffect } from '../types';

type ResonanceVisualizerPanelProps = {
  effects: ResonanceEffect[];
  isPlaying: boolean;
  onTogglePlay: () => void;
  onClearEffects: () => void;
  // onJumpToGlyph?: (glyphId: string) => void; // Optional, not implemented in this pass
};

interface VisualParticle {
  id: string;
  x: number;
  y: number;
  baseX: number;
  baseY: number;
  radius: number;
  color: string;
  opacity: number;
  angle: number;
  orbitRadius: number;
  rotationSpeed: number;
  pulseSpeed: number;
}

export const ResonanceVisualizerPanel: React.FC<ResonanceVisualizerPanelProps> = ({
  effects,
  isPlaying,
  onTogglePlay,
  onClearEffects,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [effectTypeFilter, setEffectTypeFilter] = useState<'ALL' | 'VISUAL' | 'MULTISENSORY'>('ALL');
  const [particles, setParticles] = useState<VisualParticle[]>([]);
  const [canvasSize, setCanvasSize] = useState({width: 0, height: 0});
  const resizeTimeoutRef = useRef<number | null>(null);

  // Effect to update canvas DOM width/height attributes when canvasSize state changes
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return; 

    if (canvasSize.width > 0 && canvas.width !== canvasSize.width) {
      canvas.width = canvasSize.width;
    }
    if (canvasSize.height > 0 && canvas.height !== canvasSize.height) {
      canvas.height = canvasSize.height;
    }
  }, [canvasSize]);

  // Canvas resizing logic: ResizeObserver updates React state (canvasSize) with debouncing
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resizeObserver = new ResizeObserver(entries => {
      if (resizeTimeoutRef.current) {
        clearTimeout(resizeTimeoutRef.current);
      }
      resizeTimeoutRef.current = window.setTimeout(() => {
        for (let entry of entries) {
          const { width, height } = entry.contentRect;
          
          const roundedWidth = Math.round(width);
          const roundedHeight = Math.round(height);
          
          setCanvasSize(prevSize => {
            if (roundedWidth > 0 && roundedHeight > 0) {
              if (prevSize.width !== roundedWidth || prevSize.height !== roundedHeight) {
                return { width: roundedWidth, height: roundedHeight };
              }
            }
            return prevSize; 
          });
        }
      }, 50); // Debounce time: 50ms
    });

    resizeObserver.observe(canvas);
    
    // Initial size set by observer firing once
    const initialRect = canvas.getBoundingClientRect();
    if(initialRect.width > 0 && initialRect.height > 0) {
        setCanvasSize({width: Math.round(initialRect.width), height: Math.round(initialRect.height)});
    }


    return () => {
      resizeObserver.unobserve(canvas);
      if (resizeTimeoutRef.current) {
        clearTimeout(resizeTimeoutRef.current);
      }
    };
  }, []); 


  // Initialize and update particles when effects, filter, or canvasSize change
  useEffect(() => {
    if (canvasSize.width === 0 || canvasSize.height === 0) {
        setParticles([]); 
        return;
    }

    const filteredEffects = effects.filter(
      (e) => effectTypeFilter === 'ALL' || e.effectType === effectTypeFilter
    );

    setParticles(
      filteredEffects.map((effect, index) => {
        const x = (canvasSize.width / (filteredEffects.length + 1)) * (index + 1) + (Math.random() - 0.5) * Math.min(20, canvasSize.width * 0.05);
        const y = canvasSize.height / 2 + (Math.random() - 0.5) * Math.min(canvasSize.height * 0.3, canvasSize.height / 2 - 20);
        return {
          id: effect.id,
          x: x,
          y: y,
          baseX: x,
          baseY: y,
          radius: 5 + effect.intensity * 10,
          color: effect.colorProfile,
          opacity: 0.6 + effect.intensity * 0.4,
          angle: Math.random() * Math.PI * 2,
          orbitRadius: 5 + Math.random() * 15,
          rotationSpeed: (Math.random() - 0.5) * 0.002, 
          pulseSpeed: 0.001 + Math.random() * 0.002, 
        };
      })
    );
  }, [effects, effectTypeFilter, canvasSize]);


  // Animation loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!isPlaying || !canvas || !canvas.getContext('2d') || canvasSize.width === 0 || canvasSize.height === 0) {
        if (canvas) {
            const ctx = canvas.getContext('2d');
            if (ctx) {
                ctx.clearRect(0,0, canvas.width, canvas.height);
            }
        }
        return;
    }
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return; 

    let animationFrameId: number;
    let lastTime = performance.now(); 

    const render = (currentTime: number) => {
      const currentCanvas = canvasRef.current;
      if (!currentCanvas) return;

      const deltaTime = currentTime - lastTime;
      lastTime = currentTime;

      ctx.clearRect(0, 0, currentCanvas.width, currentCanvas.height);

      particles.forEach((p) => {
        p.angle += p.rotationSpeed * deltaTime;
        const pulseFactor = 0.9 + Math.sin(p.angle * 2 + currentTime * p.pulseSpeed) * 0.1;

        const currentX = p.baseX + Math.cos(p.angle) * p.orbitRadius;
        const currentY = p.baseY + Math.sin(p.angle) * p.orbitRadius;
        const currentRadius = p.radius * pulseFactor;

        ctx.beginPath();
        ctx.arc(currentX, currentY, Math.max(2, currentRadius), 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.opacity;
        ctx.fill();

        ctx.beginPath();
        ctx.arc(currentX, currentY, Math.max(2, currentRadius) + 4, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.opacity * 0.25; 
        ctx.filter = 'blur(6px)';
        ctx.fill();
        
        ctx.globalAlpha = 1;
        ctx.filter = 'none';
      });

      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [particles, isPlaying, canvasSize]); 

  return (
    <div className="resonance-visualizer-panel bg-slate-900/80 backdrop-blur-sm border border-slate-700 rounded-lg p-6 h-[400px] flex flex-col">
      <div className="resonance-controls-panel flex items-center space-x-3 mb-4">
        <button
          onClick={onTogglePlay}
          className="rounded-button bg-slate-800 hover:bg-slate-700 text-slate-200 px-3 py-1.5 text-sm transition flex items-center whitespace-nowrap"
          aria-label={isPlaying ? 'Pause visualization' : 'Play visualization'}
          aria-pressed={isPlaying}
        >
          <i className={`ri-${isPlaying ? 'pause' : 'play'}-line mr-2`}></i>
          {isPlaying ? 'Pause' : 'Play'}
        </button>
        <button
          onClick={onClearEffects}
          className="rounded-button bg-slate-800 hover:bg-slate-700 text-slate-200 px-3 py-1.5 text-sm transition flex items-center whitespace-nowrap"
          aria-label="Clear all visualized effects"
        >
          <i className="ri-delete-bin-line mr-2"></i>Clear
        </button>
        <select
          value={effectTypeFilter}
          onChange={(e) => setEffectTypeFilter(e.target.value as 'ALL' | 'VISUAL' | 'MULTISENSORY')}
          className="rounded-button bg-slate-800 hover:bg-slate-700 text-slate-200 px-3 py-1.5 text-sm transition focus:ring-primary focus:border-primary appearance-none"
          aria-label="Filter effects by type"
        >
          <option value="ALL">All Types</option>
          <option value="VISUAL">Visual</option>
          <option value="MULTISENSORY">Multisensory</option>
        </select>
      </div>
      <canvas
        ref={canvasRef}
        className="resonance-visualizer-canvas w-full flex-1 bg-slate-800/50 rounded-md border border-slate-700/50 shadow-inner min-h-[200px]" 
        aria-label="Resonance effects visualization"
        role="img" 
      />
    </div>
  );
};
