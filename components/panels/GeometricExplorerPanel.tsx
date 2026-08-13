import React, { useRef, useEffect, useState, useMemo, useCallback } from 'react';
import { GeometricExplorerMode } from '../../types';
import { GEOMETRIC_EXPLORER_MODES } from '../../constants';

interface GeometricExplorerPanelProps {
  currentEntropy: number;
  width: number;
  height: number;
}

interface Particle {
  x: number; y: number;
  vx: number; vy: number;
  size: number; opacity: number;
  life: number;
}

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const clamp = (val: number, min: number, max: number) => Math.min(Math.max(val, min), max);

const GeometricExplorerPanel: React.FC<GeometricExplorerPanelProps> = ({
  currentEntropy,
  width,
  height,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [currentMode, setCurrentMode] = useState<GeometricExplorerMode>(GeometricExplorerMode.FlowerOfLife);
  const particlesRef = useRef<Particle[]>([]);
  const animationFrameIdRef = useRef<number | null>(null);

  const modeMapping: Record<GeometricExplorerMode, GeometricExplorerMode> = useMemo(() => ({
    ...Object.fromEntries(GEOMETRIC_EXPLORER_MODES.map(m => [m.id, m.id])) as Record<GeometricExplorerMode, GeometricExplorerMode>,
    [GeometricExplorerMode.SacredLattice]: GeometricExplorerMode.FlowerOfLife,
    [GeometricExplorerMode.AxiomaticOverlay]: GeometricExplorerMode.FlowerOfLife,
    [GeometricExplorerMode.TemporalWeave]: GeometricExplorerMode.FlowerOfLife,
    [GeometricExplorerMode.RecursiveGrowth]: GeometricExplorerMode.FractalCascade,
    [GeometricExplorerMode.BioFractalPulse]: GeometricExplorerMode.FractalCascade,
    [GeometricExplorerMode.GlyphDNAHelix]: GeometricExplorerMode.FractalCascade,
    [GeometricExplorerMode.CrystalLogic]: GeometricExplorerMode.FractalCascade,
    [GeometricExplorerMode.VortexSingularity]: GeometricExplorerMode.AethericFlow,
    [GeometricExplorerMode.EntropyPulse]: GeometricExplorerMode.AethericFlow,
    [GeometricExplorerMode.VoidEcho]: GeometricExplorerMode.AethericFlow,
    [GeometricExplorerMode.DimensionalBloom]: GeometricExplorerMode.HypercubeEcho,
    [GeometricExplorerMode.HypersphereField]: GeometricExplorerMode.HypercubeEcho,
    [GeometricExplorerMode.SymphonicPulse]: GeometricExplorerMode.PhaseResonanceRings,
    [GeometricExplorerMode.GlyphicResonance]: GeometricExplorerMode.PhaseResonanceRings,
    [GeometricExplorerMode.StarlightConductor]: GeometricExplorerMode.PhaseResonanceRings,
    [GeometricExplorerMode.NexusPoint]: GeometricExplorerMode.FlowerOfLife,
    [GeometricExplorerMode.NullShell]: GeometricExplorerMode.PhaseResonanceRings,
    [GeometricExplorerMode.OracleWhisperField]: GeometricExplorerMode.AethericFlow,
    [GeometricExplorerMode.ShieldedChaos]: GeometricExplorerMode.HypercubeEcho,
    [GeometricExplorerMode.MythicReflection]: GeometricExplorerMode.FlowerOfLife,
    [GeometricExplorerMode.MirrorLoop]: GeometricExplorerMode.PhaseResonanceRings,
    [GeometricExplorerMode.MirrorShatter]: GeometricExplorerMode.FractalCascade,
    [GeometricExplorerMode.QuantumBloom]: GeometricExplorerMode.AethericFlow,
    [GeometricExplorerMode.SoulVectorField]: GeometricExplorerMode.AethericFlow,
    [GeometricExplorerMode.AshfallCycle]: GeometricExplorerMode.AethericFlow,
    [GeometricExplorerMode.StellarThreadLattice]: GeometricExplorerMode.FlowerOfLife,
  }), []);


  // Initialize particles for Aetheric Flow
  useEffect(() => {
    if (modeMapping[currentMode] === GeometricExplorerMode.AethericFlow && width > 0 && height > 0) {
        const numParticles = 150 + Math.floor(currentEntropy * 200);
        particlesRef.current = Array.from({ length: numParticles }, () => ({
            x: Math.random() * width,
            y: Math.random() * height,
            vx: (Math.random() - 0.5) * (1 + currentEntropy * 2),
            vy: (Math.random() - 0.5) * (1 + currentEntropy * 2),
            size: Math.random() * 2 + 1,
            opacity: Math.random() * 0.3 + 0.2,
            life: 100 + Math.random() * 100,
        }));
    } else {
        particlesRef.current = [];
    }
  }, [width, height, currentMode, currentEntropy, modeMapping]);


  // Main animation loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || width === 0 || height === 0) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = width;
    canvas.height = height;
    let frameCount = 0;

    const render = () => {
      frameCount++;
      ctx.clearRect(0, 0, width, height);
      const t = clamp(currentEntropy, 0, 1);
      
      // Background
      const bgGrad = ctx.createRadialGradient(width/2, height/2, 0, width/2, height/2, Math.max(width, height));
      const baseHue = 220;
      bgGrad.addColorStop(0, `hsl(${baseHue - t*30}, 50%, ${lerp(10,5,t)}%)`);
      bgGrad.addColorStop(1, `hsl(${baseHue + t*30}, 60%, ${lerp(20,10,t)}%)`);
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0,0,width,height);

      const effectiveMode = modeMapping[currentMode];

      switch(effectiveMode) {
        case GeometricExplorerMode.FlowerOfLife:
          drawFlowerOfLife(ctx, width, height, t, frameCount);
          break;
        case GeometricExplorerMode.FractalCascade:
          drawFractal(ctx, width, height, t, frameCount);
          break;
        case GeometricExplorerMode.AethericFlow:
          drawAethericFlow(ctx, width, height, t, frameCount);
          break;
        case GeometricExplorerMode.HypercubeEcho:
          drawHypercube(ctx, width, height, t, frameCount);
          break;
        case GeometricExplorerMode.PhaseResonanceRings:
          drawPhaseRings(ctx, width, height, t, frameCount);
          break;
      }
      animationFrameIdRef.current = requestAnimationFrame(render);
    };
    
    render();

    return () => {
      if (animationFrameIdRef.current) {
        cancelAnimationFrame(animationFrameIdRef.current);
      }
    };

  }, [currentEntropy, width, height, currentMode, modeMapping]);

  const drawFlowerOfLife = (ctx: CanvasRenderingContext2D, w: number, h: number, t: number, frame: number) => {
    const R = Math.min(w,h) * 0.15;
    const points = [{x: w/2, y: h/2}];
    for(let i=0; i<6; i++) {
        const angle = i * Math.PI / 3;
        points.push({ x: w/2 + R * Math.cos(angle), y: h/2 + R * Math.sin(angle) });
        points.push({ x: w/2 + 2*R * Math.cos(angle), y: h/2 + 2*R * Math.sin(angle) });
    }
    points.forEach(p => {
        ctx.beginPath();
        const radius = R * (1 - t*0.2 + Math.sin(frame*0.01 + p.y)*0.05*t);
        ctx.arc(p.x,p.y, radius, 0, Math.PI * 2);
        const hue = lerp(180, 40, t);
        ctx.strokeStyle = `hsla(${hue}, 80%, 70%, ${lerp(0.6, 0.3, t)})`;
        ctx.lineWidth = lerp(1.5, 0.5 + Math.random()*2, t);
        if(t > 0.7) ctx.setLineDash([2+t*5, 2+t*3]);
        ctx.stroke();
        ctx.setLineDash([]);
    });
  };

  const drawFractal = (ctx: CanvasRenderingContext2D, w: number, h: number, t: number, frame: number) => {
    const drawBranch = (x:number, y:number, len:number, angle:number, depth:number) => {
        if(depth > 4 + (1-t)*4 || len < 2) return;
        ctx.beginPath();
        ctx.moveTo(x,y);
        const endX = x + Math.cos(angle) * len;
        const endY = y + Math.sin(angle) * len;
        ctx.lineTo(endX, endY);
        const hue = lerp(120, 280, t);
        ctx.strokeStyle = `hsla(${hue + depth*10}, 80%, ${70 - depth*5}%, ${1 - depth*0.1})`;
        ctx.lineWidth = Math.max(0.5, len * 0.1);
        ctx.stroke();
        
        const angleOffset = 0.5 + t * 0.4 + Math.sin(frame*0.01 + depth)*0.1*t;
        const lenFactor = 0.7 + (1-t)*0.1;

        drawBranch(endX, endY, len * lenFactor, angle - angleOffset, depth+1);
        drawBranch(endX, endY, len * lenFactor, angle + angleOffset, depth+1);
    };
    drawBranch(w/2, h, h * 0.3, -Math.PI/2, 0);
  };
  
  const drawAethericFlow = (ctx: CanvasRenderingContext2D, w: number, h: number, t: number, frame: number) => {
    particlesRef.current.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        p.life--;
        
        const angle = Math.atan2(p.y - h/2, p.x-w/2);
        const force = 0.02 * t;
        p.vx -= Math.cos(angle) * force;
        p.vy -= Math.sin(angle) * force;

        if(p.life <= 0 || p.x < 0 || p.x > w || p.y < 0 || p.y > h){
            p.x = w/2 + (Math.random()-0.5)*10;
            p.y = h/2 + (Math.random()-0.5)*10;
            p.vx = (Math.random()-0.5)*(2+t*3);
            p.vy = (Math.random()-0.5)*(2+t*3);
            p.life = 100 + Math.random()*50;
        }

        const hue = lerp(200, 260, t);
        ctx.fillStyle = `hsla(${hue}, 80%, 70%, ${p.opacity * (p.life / 150)})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
    });
  };

  const drawHypercube = (ctx: CanvasRenderingContext2D, w: number, h: number, t: number, frame: number) => {
    const size = Math.min(w,h) * 0.3;
    const angle = frame * (0.002 + t * 0.003);
    const points3D = [
        [-1,-1,-1], [1,-1,-1], [1,1,-1], [-1,1,-1],
        [-1,-1,1], [1,-1,1], [1,1,1], [-1,1,1]
    ];
    const projected = points3D.map(p => {
        const rX = p[0]*Math.cos(angle) - p[2]*Math.sin(angle);
        const rZ = p[0]*Math.sin(angle) + p[2]*Math.cos(angle);
        const rY = p[1];
        
        const perspective = 150 / (150 + rZ + t*30);
        return {
            x: w/2 + rX * size * perspective + (Math.random()-0.5)*t*8,
            y: h/2 + rY * size * perspective + (Math.random()-0.5)*t*8
        };
    });
    const edges = [[0,1],[1,2],[2,3],[3,0],[4,5],[5,6],[6,7],[7,4],[0,4],[1,5],[2,6],[3,7]];
    const hue = lerp(240, 320, t);
    ctx.strokeStyle = `hsla(${hue}, 80%, 70%, ${lerp(0.7,0.4,t)})`;
    ctx.lineWidth = lerp(2, 1, t);
    if(t > 0.6) ctx.setLineDash([4+t*4, 3+t*2]);
    edges.forEach(edge => {
        ctx.beginPath();
        ctx.moveTo(projected[edge[0]].x, projected[edge[0]].y);
        ctx.lineTo(projected[edge[1]].x, projected[edge[1]].y);
        ctx.stroke();
    });
    ctx.setLineDash([]);
  };

  const drawPhaseRings = (ctx: CanvasRenderingContext2D, w: number, h: number, t: number, frame: number) => {
    const numRings = 4 + Math.floor((1-t)*6);
    for(let i=0; i<numRings; i++){
        ctx.beginPath();
        const radius = (Math.min(w,h)/2) * ( (i+1)/(numRings+1) ) * (1 - t*0.1);
        const angleOffset = frame * (0.001 + t*0.002) * (i%2===0 ? 1: -1);
        ctx.arc(w/2,h/2, radius, 0 + angleOffset, Math.PI*1.8 + angleOffset);
        const hue = (160 + i*15 + t*40)%360;
        ctx.strokeStyle = `hsla(${hue}, 80%, 70%, ${lerp(0.5, 0.2, t)})`;
        ctx.lineWidth = lerp(3, 1, t);
        ctx.stroke();
    }
  };

  return (
    <div className="space-y-4">
        <h2 className="text-2xl font-bold text-cyan-400 font-orbitron">Quantum System Visualizer</h2>
        
        <div className="flex items-center gap-4">
            <label htmlFor="mode-select" className="text-gray-300">Visualization Mode:</label>
            <select
              id="mode-select"
              value={currentMode}
              onChange={(e) => setCurrentMode(e.target.value as GeometricExplorerMode)}
              className="bg-gray-800 text-white rounded-lg px-4 py-2 border border-gray-600 focus:border-cyan-500 outline-none"
            >
              {GEOMETRIC_EXPLORER_MODES.map(mode => (
                <option key={mode.id} value={mode.id}>{mode.name}</option>
              ))}
            </select>
        </div>

        <div className="relative mx-auto bg-black rounded-lg border border-cyan-700/50 shadow-inner" style={{ width: `${width}px`, height: `${height}px` }}>
            <canvas ref={canvasRef} aria-label="Geometric visualization reacting to entropy." />
        </div>
        <div className="text-center text-sm text-gray-400 font-mono">
            Current Mode: {GEOMETRIC_EXPLORER_MODES.find(m => m.id === currentMode)?.name} | Entropy: {currentEntropy.toFixed(3)}δ
        </div>
    </div>
  );
};

export default GeometricExplorerPanel;