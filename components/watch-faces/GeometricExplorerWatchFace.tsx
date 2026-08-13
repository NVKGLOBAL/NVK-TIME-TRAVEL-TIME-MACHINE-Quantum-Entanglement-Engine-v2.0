import React, { useRef, useEffect, useMemo, useCallback } from 'react';
import { GeometricExplorerMode } from '../../types';
import { useDimensions } from '../../hooks/useDimensions';

interface GeometricExplorerWatchFaceProps {
    time: Date;
    mode: GeometricExplorerMode;
}

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
  life: number;
}


const GeometricExplorerWatchFace: React.FC<GeometricExplorerWatchFaceProps> = ({ time, mode }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const particlesRef = useRef<Particle[]>([]); 
    const { width, height } = useDimensions(containerRef);
    const timeRef = useRef(time);

    useEffect(() => {
        timeRef.current = time;
    }, [time]);

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

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas || width === 0 || height === 0) return;
        
        let animationFrameId: number;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        canvas.width = width * window.devicePixelRatio;
        canvas.height = height * window.devicePixelRatio;
        canvas.style.width = `${width}px`;
        canvas.style.height = `${height}px`;
        ctx.scale(window.devicePixelRatio, window.devicePixelRatio);

        const modesWithParticles = [
            GeometricExplorerMode.AethericFlow,
            GeometricExplorerMode.EntropyPulse,
            GeometricExplorerMode.OracleWhisperField,
            GeometricExplorerMode.VortexSingularity,
            GeometricExplorerMode.SoulVectorField,
            GeometricExplorerMode.AshfallCycle,
            GeometricExplorerMode.QuantumBloom
        ];

        if (modesWithParticles.includes(mode)) {
            const currentTime = timeRef.current;
            const t = clamp((currentTime.getSeconds() + currentTime.getMilliseconds() / 1000) / 60, 0, 1);
            const numParticles = 150 + Math.floor(t * 100);
            particlesRef.current = Array.from({ length: numParticles }, () => ({
                x: Math.random() * width,
                y: Math.random() * height,
                vx: (Math.random() - 0.5) * (1 + t * 2),
                vy: (Math.random() - 0.5) * (1 + t * 2),
                size: Math.random() * 2 + 1,
                opacity: Math.random() * 0.3 + 0.2,
                life: 100 + Math.random() * 100,
            }));
        } else {
            particlesRef.current = [];
        }

        const render = (timestamp: number) => {
            if (!canvasRef.current) return;
            const currentTime = timeRef.current;
            const t = clamp((currentTime.getSeconds() + currentTime.getMilliseconds() / 1000) / 60, 0, 1);
            
            // Background
            const bgGrad = ctx.createRadialGradient(width/2, height/2, 0, width/2, height/2, Math.max(width, height));
            const baseHue = 220;
            bgGrad.addColorStop(0, `hsl(${baseHue - t*30}, 50%, ${lerp(10,5,t)}%)`);
            bgGrad.addColorStop(1, `hsl(${baseHue + t*30}, 60%, ${lerp(20,10,t)}%)`);
            ctx.fillStyle = bgGrad;
            ctx.fillRect(0,0,width,height);

            // Subtle Scanning Line
            const scanLineY = (timestamp * 0.1) % height;
            ctx.fillStyle = 'rgba(0, 255, 255, 0.03)';
            ctx.fillRect(0, scanLineY, width, 2);

            // Occasional Glitch
            if (Math.random() > 0.98) {
                ctx.fillStyle = 'rgba(0, 255, 255, 0.05)';
                ctx.fillRect(Math.random() * width, Math.random() * height, Math.random() * 50, 2);
            }

            const effectiveMode = mode;

            switch(effectiveMode) {
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
                    const baseRadius = Math.min(width,height) * 0.15;
                    const points = getFruitOfLifePoints(width/2, height/2, baseRadius);
                    drawFlowerCircles(ctx, points, baseRadius, t);
                    drawMetatronLines(ctx, points, t);
                    break;
                case GeometricExplorerMode.FractalCascade:
                case GeometricExplorerMode.RecursiveGrowth:
                case GeometricExplorerMode.BioFractalPulse: 
                case GeometricExplorerMode.GlyphDNAHelix:
                case GeometricExplorerMode.CrystalLogic:
                    const maxDepth = 2 + Math.floor(t * 4); 
                    const initialRadius = Math.min(width, height) * (0.3 - t * 0.1);
                    const initialSides = 3 + Math.floor(t * 4); 
                    const rotationSpeed = 0.0005 + t * 0.001;
                    drawRecursivePolygons(ctx, width/2, height/2, initialRadius, initialSides, timestamp * rotationSpeed, 0, maxDepth, t);
                    break;
                case GeometricExplorerMode.AethericFlow:
                case GeometricExplorerMode.EntropyPulse: 
                case GeometricExplorerMode.OracleWhisperField:
                case GeometricExplorerMode.VortexSingularity:
                case GeometricExplorerMode.SoulVectorField:
                case GeometricExplorerMode.AshfallCycle:
                case GeometricExplorerMode.QuantumBloom:
                    drawAethericFlow(ctx, particlesRef.current, width, height, t);
                    break;
                case GeometricExplorerMode.HypercubeEcho:
                case GeometricExplorerMode.DimensionalBloom: 
                case GeometricExplorerMode.HypersphereField:
                case GeometricExplorerMode.ShieldedChaos:
                    drawHypercube(ctx, width, height, t, timestamp);
                    break;
                case GeometricExplorerMode.PhaseResonanceRings:
                case GeometricExplorerMode.SymphonicPulse: 
                case GeometricExplorerMode.StarlightConductor:
                case GeometricExplorerMode.NullShell:
                    drawPhaseRings(ctx, width, height, t, timestamp);
                    break;
                case GeometricExplorerMode.VoidEcho:
                     ctx.fillStyle = `rgba(10,10,25, ${0.8 + t * 0.2})`;
                     ctx.fillRect(0,0,width,height);
                     if(t > 0.5) {
                         for(let i=0; i<t*20; i++){
                             ctx.fillStyle = `hsla(${(timestamp*0.1 + i*10)%360}, 70%, 60%, ${0.3 + Math.random()*0.5})`;
                             ctx.beginPath();
                             ctx.arc(Math.random()*width, Math.random()*height, Math.random()*2+0.5, 0, Math.PI*2);
                             ctx.fill();
                         }
                     }
                    break;
                default:
                    const defaultPoints = getFruitOfLifePoints(width/2, height/2, Math.min(width,height) * 0.15);
                    drawFlowerCircles(ctx, defaultPoints, Math.min(width,height) * 0.15, t);
                    break;
            }

            // High Contrast Time Display Capsule
            let h = currentTime.getHours();
            const isPm = h >= 12;
            h = h % 12 || 12;
            const hours = String(h).padStart(2, '0');
            const minutes = String(currentTime.getMinutes()).padStart(2, '0');
            const seconds = String(currentTime.getSeconds()).padStart(2, '0');
            
            ctx.save();
            const pillW = Math.min(width, height) * 0.65;
            const pillH = Math.min(width, height) * 0.22;
            const pillX = width / 2 - pillW / 2;
            const pillY = height / 2 - pillH / 2;
            const cornerR = Math.min(pillH / 2, pillW / 2);

            ctx.fillStyle = 'rgba(2, 6, 23, 0.85)';
            ctx.strokeStyle = '#06b6d4';
            ctx.lineWidth = 2;
            ctx.shadowColor = '#06b6d4';
            ctx.shadowBlur = 12;

            ctx.beginPath();
            ctx.moveTo(pillX + cornerR, pillY);
            ctx.arcTo(pillX + pillW, pillY, pillX + pillW, pillY + pillH, cornerR);
            ctx.arcTo(pillX + pillW, pillY + pillH, pillX, pillY + pillH, cornerR);
            ctx.arcTo(pillX, pillY + pillH, pillX, pillY, cornerR);
            ctx.arcTo(pillX, pillY, pillX + pillW, pillY, cornerR);
            ctx.closePath();
            ctx.fill();
            ctx.stroke();

            ctx.font = `bold ${Math.min(width, height) * 0.11}px "Orbitron", sans-serif`;
            ctx.fillStyle = '#38bdf8';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.shadowColor = '#0284c7';
            ctx.shadowBlur = 10;
            ctx.fillText(`${hours}:${minutes}:${seconds}`, width / 2, height / 2 - pillH * 0.1);

            ctx.font = `bold ${Math.min(width, height) * 0.05}px "Orbitron", sans-serif`;
            ctx.fillStyle = '#fbbf24';
            ctx.shadowColor = '#f59e0b';
            ctx.shadowBlur = 6;
            ctx.fillText(`${isPm ? 'PM' : 'AM'} • ${mode.toUpperCase().replace('_', ' ')}`, width / 2, height / 2 + pillH * 0.28);

            ctx.restore();
            
            animationFrameId = requestAnimationFrame(render);
        };

        const drawFlowerCircles = (ctx: CanvasRenderingContext2D, points: {x: number, y: number}[], R_circle: number, t: number) => {
            points.forEach((point) => { 
              ctx.beginPath();
              const circleRadius = R_circle * (1 - t * 0.1); 
              const lineW = lerp(1.5, 0.5 + Math.random() * 2, t); 
              const alpha = lerp(0.6, 0.2 + Math.random() * 0.5, t); 
              let x = point.x + (Math.random() - 0.5) * t * 5;
              let y = point.y + (Math.random() - 0.5) * t * 5;
              ctx.arc(x, y, circleRadius, 0, Math.PI * 2);
              const hue = lerp(180, 30 + Math.random()*60, t); 
              ctx.strokeStyle = `hsla(${hue}, 70%, 60%, ${alpha})`;
              ctx.lineWidth = lineW;
              if (t > 0.8) ctx.setLineDash([5 + Math.random()*10, 5 + Math.random()*10]);
              ctx.stroke();
              ctx.setLineDash([]);
            });
        };

        const drawMetatronLines = (ctx: CanvasRenderingContext2D, points: {x: number, y: number}[], t: number) => {
            if (t < 0.15) return; 
            const alpha = lerp(0.1, 0.8, (t - 0.15) / 0.85); 
            const lineW = lerp(0.5, 2.5, t);
            for (let i = 0; i < points.length; i++) {
                for (let j = i + 1; j < points.length; j++) {
                    ctx.beginPath();
                    ctx.moveTo(points[i].x, points[i].y);
                    ctx.lineTo(points[j].x, points[j].y);
                    const hue = lerp(60, 0 + Math.random() * 40, t); 
                    ctx.strokeStyle = `hsla(${hue}, 100%, 70%, ${alpha * (0.5 + Math.random()*0.5)})`;
                    ctx.lineWidth = lineW * (0.7 + Math.random() * 0.6);
                    ctx.stroke();
                }
            }
        };

        const drawAethericFlow = (ctx: CanvasRenderingContext2D, particles: Particle[], w: number, h: number, t: number) => {
            particles.forEach(p => {
                p.x += p.vx; p.y += p.vy; p.life--;
                if (p.x < 0 || p.x > w || p.y < 0 || p.y > h || p.life <=0) {
                    p.x = Math.random() * w; p.y = Math.random() * h;
                    p.vx = (Math.random() - 0.5) * (1 + t * 2);
                    p.vy = (Math.random() - 0.5) * (1 + t * 2);
                    p.life = 100 + Math.random() * 100;
                }
                const hue = lerp(180, 240 + t*60, t);
                ctx.fillStyle = `hsla(${hue}, 70%, 60%, ${p.opacity * (p.life / 150)})`;
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.size * (1 + t), 0, Math.PI * 2);
                ctx.fill();
            });
        };

        const drawHypercube = (ctx: CanvasRenderingContext2D, w: number, h: number, t: number, timestamp: number) => {
            const size = Math.min(w,h) * 0.25 * (1 - t * 0.2);
            const angle = timestamp * (0.0002 + t * 0.0005);
            const points3D = [[-1,-1,-1], [1,-1,-1], [1,1,-1], [-1,1,-1],[-1,-1,1], [1,-1,1], [1,1,1], [-1,1,1]];
            const projected = points3D.map(p => {
                const rX = p[0]*Math.cos(angle) - p[2]*Math.sin(angle);
                const rZ = p[0]*Math.sin(angle) + p[2]*Math.cos(angle);
                const perspective = 150 / (150 + rZ + t*50);
                return { x: w/2 + rX * size * perspective, y: h/2 + p[1] * size * perspective };
            });
            const edges = [[0,1],[1,2],[2,3],[3,0],[4,5],[5,6],[6,7],[7,4],[0,4],[1,5],[2,6],[3,7]];
            const hue = lerp(240, 300 + t*60, t);
            ctx.strokeStyle = `hsla(${hue}, 80%, 70%, ${lerp(0.7, 0.3, t)})`;
            ctx.lineWidth = lerp(1.5, 0.5 + t*2, t);
            if(t > 0.7) ctx.setLineDash([3+t*3, 2+t*2]);
            edges.forEach(edge => {
                ctx.beginPath();
                ctx.moveTo(projected[edge[0]].x, projected[edge[0]].y);
                ctx.lineTo(projected[edge[1]].x, projected[edge[1]].y);
                ctx.stroke();
            });
            ctx.setLineDash([]);
        };
        
        const drawPhaseRings = (ctx: CanvasRenderingContext2D, w: number, h: number, t: number, timestamp: number) => {
            const numRings = 3 + Math.floor((1-t)*5);
            for(let i=0; i<numRings; i++) {
                ctx.beginPath();
                const radius = (Math.min(w,h)/2.2) * ((i+1)/(numRings+1));
                const angleOffset = timestamp * (0.0001 + t*0.0002) * (i%2===0 ? 1: -1);
                ctx.arc(w/2, h/2, radius, 0 + angleOffset, Math.PI * 1.8 + angleOffset);
                const hue = (160 + i*20 + t*60)%360;
                ctx.strokeStyle = `hsla(${hue}, 70%, 60%, ${lerp(0.5, 0.2, t)})`;
                ctx.lineWidth = lerp(3, 1, t);
                ctx.stroke();
            }
        };
        
        render(0);

        return () => {
            if (animationFrameId) cancelAnimationFrame(animationFrameId);
        };
    }, [mode, drawRecursivePolygons, width, height]);

    return (
        <div ref={containerRef} className="w-full h-full rounded-full overflow-hidden bg-black">
            <canvas ref={canvasRef} />
        </div>
    );
};

export default GeometricExplorerWatchFace;