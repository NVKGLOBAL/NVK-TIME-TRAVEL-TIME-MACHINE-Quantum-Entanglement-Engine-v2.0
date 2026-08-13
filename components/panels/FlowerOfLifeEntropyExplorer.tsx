
import React, { useRef, useEffect, useMemo, useCallback } from 'react';
import type { FlowerOfLifeEntropyExplorerProps } from '../../types'; // Import updated props
import { GeometricExplorerMode } from '../../types'; // Import the new enum
import { GEOMETRIC_EXPLORER_MODES } from '../../constants'; // Import mode names for display

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const clamp = (val: number, min: number, max: number) => Math.min(Math.max(val, min), max);


const getFruitOfLifePoints = (centerX: number, centerY: number, R_distance: number): { x: number; y: number; id: string }[] => {
    const points: { x: number; y: number; id: string }[] = [];
    points.push({ x: centerX, y: centerY, id: 'center_0' });
    for (let i = 0; i < 6; i++) {
        const angle = (i * Math.PI) / 3;
        points.push({
            x: centerX + R_distance * Math.cos(angle),
            y: centerY + R_distance * Math.sin(angle),
            id: `inner_${i}`
        });
    }
    for (let i = 0; i < 6; i++) {
        const angle = (i * Math.PI) / 3;
        points.push({
            x: centerX + 2 * R_distance * Math.cos(angle),
            y: centerY + 2 * R_distance * Math.sin(angle),
            id: `outer_${i}`
        });
    }
    return points;
};

interface Particle {
  x: number; y: number;
  vx: number; vy: number;
  size: number; opacity: number;
  color: string; life: number;
}

interface FlowerOfLifeEntropyExplorerPropsWithClick extends FlowerOfLifeEntropyExplorerProps {
  onClick?: () => void;
}

const FlowerOfLifeEntropyExplorer: React.FC<FlowerOfLifeEntropyExplorerPropsWithClick> = ({
  currentEntropy,
  width,
  height,
  currentMode, 
  onClick,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameIdRef = useRef<number | null>(null);
  const particlesRef = useRef<Particle[]>([]); 

  const baseRadiusForCircles = useMemo(() => Math.min(width, height) * 0.15, [width, height]);

  const fruitOfLifePoints = useMemo(() => {
    if (width === 0 || height === 0) return [];
    return getFruitOfLifePoints(width / 2, height / 2, baseRadiusForCircles);
  }, [width, height, baseRadiusForCircles]);

  const drawRecursivePolygons = useCallback(( 
    ctx: CanvasRenderingContext2D, 
    x: number, y: number, 
    radius: number, sides: number, 
    angleOffset: number, depth: number, maxDepth: number, 
    entropy: number
  ) => {
    if (depth > maxDepth || radius < 2) return;

    const t = clamp(entropy, 0, 1);
    const points = [];
    for (let i = 0; i < sides; i++) {
      const angle = (i / sides) * Math.PI * 2 + angleOffset;
      let currentX = x + Math.cos(angle) * radius;
      let currentY = y + Math.sin(angle) * radius;
      if (t > 0.6) { 
        currentX += (Math.random() - 0.5) * radius * t * 0.2;
        currentY += (Math.random() - 0.5) * radius * t * 0.2;
      }
      points.push({ x: currentX, y: currentY });
    }

    ctx.beginPath();
    ctx.moveTo(points[points.length - 1].x, points[points.length - 1].y);
    points.forEach(p => ctx.lineTo(p.x, p.y));
    ctx.closePath();

    const hue = lerp(200 - depth * 20, 300 + depth * 10 - t * 60, t);
    const saturation = lerp(60 + depth * 5, 80 - t * 30, t);
    const lightness = lerp(50 - depth * 4, 30 + t * 20, t);
    const alpha = lerp(0.5 - depth * 0.1, 0.1 + t * 0.2, t) * (1 - depth / (maxDepth + 1));

    ctx.strokeStyle = `hsla(${hue}, ${saturation}%, ${lightness}%, ${clamp(alpha, 0.05, 0.8)})`;
    ctx.lineWidth = Math.max(0.5, (2 - depth * 0.3) * (1 - t * 0.5));
    ctx.stroke();

    if (t > 0.8 && Math.random() < t * 0.1 * depth) return; 

    const newSides = Math.max(3, sides - (t > 0.5 ? 1 : 0));
    const newRadius = radius * (0.5 + (1-t)*0.2); 
    const newAngleOffsetFactor = 0.1 + t * 0.3;

    points.forEach((p, i) => {
      drawRecursivePolygons(ctx, p.x, p.y, newRadius, newSides, angleOffset + i * newAngleOffsetFactor, depth + 1, maxDepth, entropy);
    });

  }, []);

  // Initialize particles for Aetheric Flow
  useEffect(() => {
    if (currentMode === GeometricExplorerMode.AethericFlow && width > 0 && height > 0) {
        const numParticles = 150 + Math.floor(currentEntropy * 100);
        particlesRef.current = Array.from({ length: numParticles }, () => ({
            x: Math.random() * width,
            y: Math.random() * height,
            vx: (Math.random() - 0.5) * (1 + currentEntropy * 2),
            vy: (Math.random() - 0.5) * (1 + currentEntropy * 2),
            size: Math.random() * 2 + 1,
            opacity: Math.random() * 0.3 + 0.2,
            color: `hsla(${180 + Math.random() * 60}, 70%, 60%, 1)`,
            life: 100 + Math.random() * 100,
        }));
    } else {
        particlesRef.current = [];
    }
  }, [width, height, currentMode, currentEntropy]);


  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || width === 0 || height === 0) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = width;
    canvas.height = height;
    
    let frameCount = 0;

    const drawBackground = (entropy: number, mode: GeometricExplorerMode) => {
      const t = clamp(entropy, 0, 1);
      const grad = ctx.createRadialGradient(width / 2, height / 2, 0, width / 2, height / 2, Math.max(width,height)/1.5);
      let baseHue: number;
      switch(mode) {
        case GeometricExplorerMode.FractalCascade:
        case GeometricExplorerMode.BioFractalPulse:
        case GeometricExplorerMode.RecursiveGrowth:
          baseHue = lerp(30, 330, t); break;
        case GeometricExplorerMode.AethericFlow:
           baseHue = lerp(200, 240, t); break;
        case GeometricExplorerMode.HypercubeEcho:
            baseHue = lerp(260, 300, t); break;
        case GeometricExplorerMode.PhaseResonanceRings:
            baseHue = lerp(160, 120, t); break;
        default: // FlowerOfLife and related
          baseHue = lerp(220, 300, t); break;
      }
      grad.addColorStop(0, `hsla(${baseHue}, 50%, ${lerp(10, 5, t)}%, 1)`);
      grad.addColorStop(1, `hsla(${(baseHue + 40)%360}, 60%, ${lerp(20,10,t)}%, 1)`);
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, width, height);
    };

    const drawFlowerCircles = (points: {x: number, y: number}[], R_circle: number, entropy: number) => {
      const t = clamp(entropy, 0, 1);
      points.forEach((point) => { 
        ctx.beginPath();
        const circleRadius = R_circle * (1 - t * 0.1); 
        const lineW = lerp(1.5, 0.5 + Math.random() * 2, t); 
        const alpha = lerp(0.6, 0.2 + Math.random() * 0.5, t); 
        
        let x = point.x;
        let y = point.y;
        if (entropy > 0.6) { 
            x += (Math.random() - 0.5) * entropy * 5;
            y += (Math.random() - 0.5) * entropy * 5;
        }

        ctx.arc(x, y, circleRadius, 0, Math.PI * 2);
        
        const hue = lerp(180, 30 + Math.random()*60, t); 
        const saturation = lerp(70, 90, t);
        const lightness = lerp(60, 50 + Math.random()*10, t);
        
        ctx.strokeStyle = `hsla(${hue}, ${saturation}%, ${lightness}%, ${alpha})`;
        ctx.lineWidth = lineW;
        
        if (entropy > 0.8 && Math.random() < 0.1 * entropy) { 
             ctx.setLineDash([5 + Math.random()*10, 5 + Math.random()*10]);
             ctx.stroke();
             ctx.setLineDash([]);
        } else {
            ctx.stroke();
        }
      });
    };

    const drawMetatronLines = (points: {x: number, y: number}[], entropy: number) => {
        const t = clamp(entropy, 0, 1);
        if (t < 0.15) return; 

        const alpha = lerp(0.1, 0.8, (t - 0.15) / 0.85); 
        const lineW = lerp(0.5, 2.5, t);

        for (let i = 0; i < points.length; i++) {
            for (let j = i + 1; j < points.length; j++) {
                ctx.beginPath();
                let x1 = points[i].x;
                let y1 = points[i].y;
                let x2 = points[j].x;
                let y2 = points[j].y;

                const hue = lerp(60, 0 + Math.random() * 40, t); 
                const saturation = 100;
                const lightness = lerp(70, 55 + Math.random() * 10, t);
                
                ctx.strokeStyle = `hsla(${hue}, ${saturation}%, ${lightness}%, ${alpha * (0.5 + Math.random()*0.5)})`;
                ctx.lineWidth = lineW * (0.7 + Math.random() * 0.6);

                if (entropy > 0.75) { 
                    const segments = 5;
                    ctx.moveTo(x1, y1);
                    for (let k = 1; k <= segments; k++) {
                        const prog = k / segments;
                        const currentX = lerp(x1, x2, prog);
                        const currentY = lerp(y1, y2, prog);
                        if (Math.random() > entropy * 0.8) { 
                            ctx.stroke(); ctx.beginPath(); ctx.moveTo(currentX + (Math.random()-0.5)*5*entropy, currentY + (Math.random()-0.5)*5*entropy);
                        } else {
                             ctx.lineTo(currentX + (Math.random()-0.5)*2*entropy, currentY + (Math.random()-0.5)*2*entropy);
                        }
                    }
                    ctx.stroke();

                } else {
                    ctx.moveTo(x1, y1);
                    ctx.lineTo(x2, y2);
                    ctx.stroke();
                }
            }
        }
    };

    const drawAethericFlow = (particles: Particle[], entropy: number) => {
        const t = clamp(entropy, 0, 1);
        particles.forEach(p => {
            p.x += p.vx * (1 + t * 2);
            p.y += p.vy * (1 + t * 2);
            p.life -= (1 + t);

            if (p.x < 0 || p.x > width || p.y < 0 || p.y > height || p.life <=0) {
                p.x = Math.random() * width;
                p.y = Math.random() * height;
                p.vx = (Math.random() - 0.5) * (1 + t * 2);
                p.vy = (Math.random() - 0.5) * (1 + t * 2);
                p.life = 100 + Math.random() * 100;
                p.opacity = Math.random() * 0.3 + 0.2 * (1-t);
            }
            const hue = lerp(180, 240 + t*60, t); // Blues to Purples
            ctx.fillStyle = `hsla(${hue}, 70%, ${60 + p.life/5}%, ${p.opacity * (p.life / (100 + Math.random() * 100))})`;
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size * (1 + t), 0, Math.PI * 2);
            ctx.fill();
        });
    };

    const drawHypercube = (entropy: number, frame: number) => {
        const t = clamp(entropy, 0, 1);
        const size = Math.min(width, height) * 0.25 * (1 - t * 0.2);
        const rotationSpeed = 0.002 + t * 0.005;
        const angle = frame * rotationSpeed;

        const points3D = [
          [-1,-1,-1], [1,-1,-1], [1,1,-1], [-1,1,-1],
          [-1,-1,1], [1,-1,1], [1,1,1], [-1,1,1]
        ];

        const projectedPoints = points3D.map(p3d => {
            // Rotate in 4D (simplified to two 2D rotations for projection)
            const x = p3d[0]; const y = p3d[1]; const z = p3d[2]; const w = 1; // Assume w for 4th dim
            
            // XY rotation
            let rX = x * Math.cos(angle) - y * Math.sin(angle);
            let rY = x * Math.sin(angle) + y * Math.cos(angle);
            // ZW rotation (conceptual, affects perspective)
            let rZ = z * Math.cos(angle*0.7) - w * Math.sin(angle*0.7);
            // let rW = z * Math.sin(angle*0.7) + w * Math.cos(angle*0.7); // rW influences perspective depth

            // Perspective projection
            const perspective = 150 / (150 + rZ + t * 50);
            return {
              x: width / 2 + rX * size * perspective + (Math.random()-0.5)*t*5,
              y: height / 2 + rY * size * perspective + (Math.random()-0.5)*t*5,
            };
        });
        
        const edges = [
            [0,1], [1,2], [2,3], [3,0], [4,5], [5,6], [6,7], [7,4], // Outer cube
            [0,4], [1,5], [2,6], [3,7] // Connecting edges
        ];

        const hue = lerp(240, 300 + t*60, t);
        ctx.strokeStyle = `hsla(${hue}, 80%, 70%, ${lerp(0.7, 0.3, t)})`;
        ctx.lineWidth = lerp(1.5, 0.5 + t*2, t);
        if (t > 0.7) ctx.setLineDash([3+t*3, 2+t*2]);

        edges.forEach(edge => {
            ctx.beginPath();
            ctx.moveTo(projectedPoints[edge[0]].x, projectedPoints[edge[0]].y);
            ctx.lineTo(projectedPoints[edge[1]].x, projectedPoints[edge[1]].y);
            ctx.stroke();
        });
        ctx.setLineDash([]);
    };
    
    const drawPhaseResonanceRings = (entropy:number, frame: number) => {
        const t = clamp(entropy,0,1);
        const numRings = 3 + Math.floor((1-t)*5); // More rings at low entropy
        const maxRadius = Math.min(width,height) * 0.4;

        for(let i=0; i<numRings; i++) {
            const radius = maxRadius * ((i+1)/(numRings+1)) * (1 - t*0.15);
            const hue = (180 + i*20 + frame*0.1 + t*60)%360;
            const lightness = 50 + (1-t)*20;
            const alpha = (0.2 + (1-t)*0.5) * (1 - i/numRings);
            const lineWidth = (1 + (1-t)*2) * (1 - i/(numRings*1.5));

            ctx.beginPath();
            ctx.arc(width/2, height/2, radius, 0, Math.PI*2);
            ctx.strokeStyle = `hsla(${hue}, 70%, ${lightness}%, ${alpha})`;
            ctx.lineWidth = lineWidth;
            
            if(t > 0.6 && Math.random() < t*0.2) { // Ring fragmentation
                const startAngle = Math.random()*Math.PI*2;
                const arcLength = Math.PI * (0.5 + Math.random()*1.0);
                ctx.arc(width/2, height/2, radius, startAngle, startAngle + arcLength);
            }
            ctx.stroke();

            // Energy particles on rings
            if(Math.random() < 0.1 * (1-t)) {
                const particleAngle = Math.random()*Math.PI*2;
                const px = width/2 + Math.cos(particleAngle)*radius;
                const py = height/2 + Math.sin(particleAngle)*radius;
                ctx.fillStyle = `hsla(${hue+30}, 80%, ${lightness+10}%, ${alpha*1.5})`;
                ctx.beginPath();
                ctx.arc(px,py, lineWidth*1.2, 0, Math.PI*2);
                ctx.fill();
            }
        }
    };


    const render = () => {
      frameCount++;
      ctx.clearRect(0, 0, width, height);
      drawBackground(currentEntropy, currentMode);

      switch(currentMode) {
        case GeometricExplorerMode.FlowerOfLife:
        case GeometricExplorerMode.SacredLattice:
        case GeometricExplorerMode.AxiomaticOverlay:
        case GeometricExplorerMode.GlyphicResonance:
        case GeometricExplorerMode.NexusPoint:
        case GeometricExplorerMode.TemporalWeave:
        case GeometricExplorerMode.StellarThreadLattice: 
        case GeometricExplorerMode.MythicReflection:
        case GeometricExplorerMode.MirrorLoop:
        case GeometricExplorerMode.MirrorShatter:
          if (fruitOfLifePoints.length > 0) {
            drawFlowerCircles(fruitOfLifePoints, baseRadiusForCircles, currentEntropy);
            drawMetatronLines(fruitOfLifePoints, currentEntropy);
          }
          break;
        case GeometricExplorerMode.FractalCascade:
        case GeometricExplorerMode.RecursiveGrowth:
        case GeometricExplorerMode.BioFractalPulse: 
        case GeometricExplorerMode.GlyphDNAHelix: // Mapped to fractal
        case GeometricExplorerMode.CrystalLogic: // Mapped to fractal
          const maxDepth = 2 + Math.floor(currentEntropy * 4); 
          const initialRadius = Math.min(width, height) * (0.3 - currentEntropy * 0.1);
          const initialSides = 3 + Math.floor(currentEntropy * 4); 
          const rotationSpeed = 0.0005 + currentEntropy * 0.001;
          drawRecursivePolygons(ctx, width/2, height/2, initialRadius, initialSides, frameCount * rotationSpeed, 0, maxDepth, currentEntropy);
          break;
        case GeometricExplorerMode.AethericFlow:
        case GeometricExplorerMode.EntropyPulse: 
        case GeometricExplorerMode.OracleWhisperField: // Mapped to aetheric
        case GeometricExplorerMode.VortexSingularity: // Mapped to aetheric
        case GeometricExplorerMode.SoulVectorField: // Mapped to aetheric
        case GeometricExplorerMode.AshfallCycle: // Mapped to aetheric
          drawAethericFlow(particlesRef.current, currentEntropy);
          break;
        case GeometricExplorerMode.HypercubeEcho:
        case GeometricExplorerMode.DimensionalBloom: 
        case GeometricExplorerMode.HypersphereField: // Mapped to hypercube
          drawHypercube(currentEntropy, frameCount);
          break;
        case GeometricExplorerMode.PhaseResonanceRings:
        case GeometricExplorerMode.SymphonicPulse: 
        case GeometricExplorerMode.StarlightConductor: // Mapped to phase rings
        case GeometricExplorerMode.QuantumBloom: // Mapped to phase rings
          drawPhaseResonanceRings(currentEntropy, frameCount);
          break;
        case GeometricExplorerMode.VoidEcho:
        case GeometricExplorerMode.NullShell:
        case GeometricExplorerMode.ShieldedChaos:
             // Simple void visualization
             ctx.fillStyle = `rgba(10,10,25, ${0.8 + currentEntropy * 0.2})`;
             ctx.fillRect(0,0,width,height);
             if(currentEntropy > 0.5) { // Add some chaotic sparks
                 for(let i=0; i<currentEntropy*20; i++){
                     ctx.fillStyle = `hsla(${(frameCount*2 + i*10)%360}, 70%, 60%, ${0.3 + Math.random()*0.5})`;
                     ctx.beginPath();
                     ctx.arc(Math.random()*width, Math.random()*height, Math.random()*2+0.5, 0, Math.PI*2);
                     ctx.fill();
                 }
             }
            break;
        // Default for any unhandled modes, can be FlowerOfLife or a placeholder text
        default:
            if (fruitOfLifePoints.length > 0) {
                drawFlowerCircles(fruitOfLifePoints, baseRadiusForCircles, currentEntropy);
            } else {
                ctx.fillStyle = "grey";
                ctx.font = "16px Cinzel, serif";
                ctx.textAlign = "center";
                ctx.fillText(`Mode: ${GEOMETRIC_EXPLORER_MODES.find(m=>m.id === currentMode)?.name || currentMode}`, width/2, height/2);
            }
            break;
      }
      
      animationFrameIdRef.current = requestAnimationFrame(render);
    };

    animationFrameIdRef.current = requestAnimationFrame(render);

    return () => {
      if (animationFrameIdRef.current) {
        cancelAnimationFrame(animationFrameIdRef.current);
      }
    };
  }, [width, height, currentEntropy, fruitOfLifePoints, baseRadiusForCircles, currentMode, drawRecursivePolygons]);


  const currentModeName = GEOMETRIC_EXPLORER_MODES.find(m => m.id === currentMode)?.name || currentMode;

  return (
    <div 
        className="flower-of-life-explorer bg-slate-950/80 backdrop-blur-md border border-cyan-500/30 rounded-xl shadow-2xl p-6 my-8 text-slate-100 cursor-pointer"
        onClick={onClick}
    >
      <h2 className="text-2xl font-['Cinzel'] font-bold mb-4 text-center text-cyan-200 drop-shadow-[0_1px_1px_rgba(200,255,255,0.4)]">
        Geometric Entropy Explorer
      </h2>
      <div className="relative mx-auto" style={{ width: `${width}px`, height: `${height}px` }}>
        <canvas
          ref={canvasRef}
          className="rounded-lg border border-slate-700/30"
          aria-label={`Geometric visualization in ${currentModeName} mode, reacting to entropy.`}
          role="img"
        />
      </div>
       <div className="mt-3 text-center text-xs text-slate-400 font-mono">
        Mode: {currentModeName} | Entropy: {currentEntropy.toFixed(3)}δ
      </div>
    </div>
  );
};

export default FlowerOfLifeEntropyExplorer;