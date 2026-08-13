import React, { useRef, useEffect, useState } from 'react';
import { useDimensions } from '../../hooks/useDimensions';
import { 
  Sun, Moon, Orbit, Activity, Settings, Sparkles, Droplets, Flame, Dna, Compass 
} from 'lucide-react';

interface TemporalEngineProps {
  time: Date;
  modeName?: string;
}

type TemporalMode = 'solar' | 'lunar' | 'orbital' | 'pulse' | 'mechanical' | 'cosmic' | 'flow' | 'entropy' | 'life' | 'journey';

interface ModeConfig {
  id: TemporalMode;
  name: string;
  icon: React.ReactNode;
  color: string;
  secondaryColor: string;
  description: string;
}

const MODES: ModeConfig[] = [
  { id: 'solar', name: 'Solar', icon: <Sun className="w-3.5 h-3.5" />, color: '#ffaa00', secondaryColor: '#ff4400', description: 'Solar Arc & Daylight Gradient' },
  { id: 'lunar', name: 'Lunar', icon: <Moon className="w-3.5 h-3.5" />, color: '#00f3ff', secondaryColor: '#8800ff', description: 'Lunar Phase Progression' },
  { id: 'orbital', name: 'Orbital', icon: <Orbit className="w-3.5 h-3.5" />, color: '#00ff88', secondaryColor: '#0055ff', description: 'Planetary Orbit Alignment' },
  { id: 'pulse', name: 'Pulse', icon: <Activity className="w-3.5 h-3.5" />, color: '#ff0055', secondaryColor: '#ff00aa', description: 'Temporal Breathing & Heartbeat' },
  { id: 'mechanical', name: 'Mechanical', icon: <Settings className="w-3.5 h-3.5" />, color: '#ffcc00', secondaryColor: '#ff6600', description: 'Interconnected Gear System' },
  { id: 'cosmic', name: 'Cosmic', icon: <Sparkles className="w-3.5 h-3.5" />, color: '#aa00ff', secondaryColor: '#00ffff', description: 'Starfield & Galaxy Rotation' },
  { id: 'flow', name: 'Flow', icon: <Droplets className="w-3.5 h-3.5" />, color: '#00aeff', secondaryColor: '#00ffcc', description: 'Hourglass Particle Stream' },
  { id: 'entropy', name: 'Entropy', icon: <Flame className="w-3.5 h-3.5" />, color: '#ff3300', secondaryColor: '#ffaa00', description: 'Energy Depletion & Flame' },
  { id: 'life', name: 'Life', icon: <Dna className="w-3.5 h-3.5" />, color: '#00ffaa', secondaryColor: '#00aa55', description: 'Biological Spiral & Growth' },
  { id: 'journey', name: 'Journey', icon: <Compass className="w-3.5 h-3.5" />, color: '#ffffff', secondaryColor: '#00f3ff', description: 'Timeline Horizon (Past → Future)' },
];

export const TemporalEngineWatchFace: React.FC<TemporalEngineProps> = ({ time }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { width, height } = useDimensions(containerRef);
  const timeRef = useRef(time);
  const [activeMode, setActiveMode] = useState<TemporalMode>('solar');

  useEffect(() => {
    timeRef.current = time;
  }, [time]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || width === 0 || height === 0) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = width * window.devicePixelRatio;
    canvas.height = height * window.devicePixelRatio;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio);

    let animationFrameId: number;

    const render = (timestamp: number) => {
      const curr = timeRef.current;
      ctx.clearRect(0, 0, width, height);

      const centerX = width / 2;
      const centerY = height / 2;
      const baseRadius = Math.min(width, height) * 0.44;

      const sec = curr.getSeconds() + curr.getMilliseconds() / 1000;
      const min = curr.getMinutes() + sec / 60;
      const hour = (curr.getHours() % 12) + min / 60;
      const dayOfYear = Math.floor((curr.getTime() - new Date(curr.getFullYear(), 0, 0).getTime()) / 86400000);
      const yearProgress = dayOfYear / 365;
      const dayProgress = (curr.getHours() * 3600 + curr.getMinutes() * 60 + sec) / 86400;

      const currentConfig = MODES.find((m) => m.id === activeMode) || MODES[0];
      const primary = currentConfig.color;
      const secondary = currentConfig.secondaryColor;

      // Background Atmosphere
      const bgGrad = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, baseRadius * 1.6);
      bgGrad.addColorStop(0, '#040812');
      bgGrad.addColorStop(0.6, '#020308');
      bgGrad.addColorStop(1, '#000000');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, width, height);

      // --- LAYER 1: OUTER RING (Year / Month progression) ---
      const outerRadius = baseRadius * 0.96;
      ctx.beginPath();
      ctx.arc(centerX, centerY, outerRadius, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Year progress arc
      ctx.beginPath();
      ctx.arc(centerX, centerY, outerRadius, -Math.PI / 2, -Math.PI / 2 + yearProgress * Math.PI * 2);
      ctx.strokeStyle = primary;
      ctx.lineWidth = 3;
      ctx.shadowColor = primary;
      ctx.shadowBlur = 8;
      ctx.stroke();
      ctx.shadowBlur = 0;

      // Outer ticks for months / year segments
      for (let i = 0; i < 12; i++) {
        const angle = (i / 12) * Math.PI * 2 - Math.PI / 2;
        const x1 = centerX + Math.cos(angle) * (outerRadius - 6);
        const y1 = centerY + Math.sin(angle) * (outerRadius - 6);
        const x2 = centerX + Math.cos(angle) * (outerRadius + 4);
        const y2 = centerY + Math.sin(angle) * (outerRadius + 4);

        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.strokeStyle = i === Math.floor(yearProgress * 12) ? secondary : 'rgba(255, 255, 255, 0.3)';
        ctx.lineWidth = i === Math.floor(yearProgress * 12) ? 2.5 : 1;
        ctx.stroke();
      }

      // --- LAYER 2: MIDDLE RING (Day progression & mode rings) ---
      const midRadius = baseRadius * 0.74;
      ctx.beginPath();
      ctx.arc(centerX, centerY, midRadius, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Day progress arc
      ctx.beginPath();
      ctx.arc(centerX, centerY, midRadius, -Math.PI / 2, -Math.PI / 2 + dayProgress * Math.PI * 2);
      ctx.strokeStyle = secondary;
      ctx.lineWidth = 2;
      ctx.stroke();

      // 24 Hour ticks or minute markers
      for (let i = 0; i < 24; i++) {
        const angle = (i / 24) * Math.PI * 2 - Math.PI / 2;
        const x1 = centerX + Math.cos(angle) * (midRadius - 4);
        const y1 = centerY + Math.sin(angle) * (midRadius - 4);
        const x2 = centerX + Math.cos(angle) * (midRadius + 4);
        const y2 = centerY + Math.sin(angle) * (midRadius + 4);

        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.strokeStyle = i === curr.getHours() ? primary : 'rgba(255, 255, 255, 0.2)';
        ctx.lineWidth = i === curr.getHours() ? 2 : 1;
        ctx.stroke();
      }

      // --- LAYER 3: INNER ORB (Current moment living temporal engine) ---
      const innerRadius = baseRadius * 0.52;
      
      ctx.save();
      ctx.beginPath();
      ctx.arc(centerX, centerY, innerRadius, 0, Math.PI * 2);
      const orbGrad = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, innerRadius);
      orbGrad.addColorStop(0, '#0a1024');
      orbGrad.addColorStop(0.7, '#02050c');
      orbGrad.addColorStop(1, '#000000');
      ctx.fillStyle = orbGrad;
      ctx.fill();
      ctx.strokeStyle = primary;
      ctx.lineWidth = 2;
      ctx.shadowColor = primary;
      ctx.shadowBlur = 15;
      ctx.stroke();
      ctx.restore();

      // RENDER MODE-SPECIFIC LIVING TIME SYSTEM INSIDE INNER ORB
      const t = timestamp * 0.001;

      if (activeMode === 'solar') {
        const sunAngle = dayProgress * Math.PI * 2 - Math.PI / 2;
        const sunX = centerX + Math.cos(sunAngle) * (innerRadius * 0.65);
        const sunY = centerY + Math.sin(sunAngle) * (innerRadius * 0.65);

        ctx.beginPath();
        ctx.arc(sunX, sunY, 10, 0, Math.PI * 2);
        ctx.fillStyle = '#ffaa00';
        ctx.shadowColor = '#ffaa00';
        ctx.shadowBlur = 20;
        ctx.fill();
        ctx.shadowBlur = 0;

        for (let i = 0; i < 8; i++) {
          const rayAngle = t * 2 + (i / 8) * Math.PI * 2;
          ctx.beginPath();
          ctx.moveTo(sunX + Math.cos(rayAngle) * 12, sunY + Math.sin(rayAngle) * 12);
          ctx.lineTo(sunX + Math.cos(rayAngle) * 20, sunY + Math.sin(rayAngle) * 20);
          ctx.strokeStyle = '#ffdd66';
          ctx.lineWidth = 2;
          ctx.stroke();
        }

        ctx.beginPath();
        ctx.moveTo(centerX - innerRadius * 0.7, centerY);
        ctx.lineTo(centerX + innerRadius * 0.7, centerY);
        ctx.strokeStyle = 'rgba(255, 170, 0, 0.4)';
        ctx.lineWidth = 1;
        ctx.stroke();

      } else if (activeMode === 'lunar') {
        const moonPhase = (yearProgress * 29.5) % 1;
        const moonX = centerX;
        const moonY = centerY;
        const moonRad = innerRadius * 0.38;

        ctx.beginPath();
        ctx.arc(moonX, moonY, moonRad, 0, Math.PI * 2);
        ctx.fillStyle = '#111827';
        ctx.strokeStyle = '#00f3ff';
        ctx.lineWidth = 2;
        ctx.shadowColor = '#00f3ff';
        ctx.shadowBlur = 10;
        ctx.fill();
        ctx.stroke();
        ctx.shadowBlur = 0;

        ctx.save();
        ctx.beginPath();
        ctx.arc(moonX, moonY, moonRad, 0, Math.PI * 2);
        ctx.clip();

        const shadowOffset = Math.cos(moonPhase * Math.PI * 2) * moonRad;
        ctx.beginPath();
        ctx.arc(moonX + shadowOffset, moonY, moonRad, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(0, 243, 255, 0.25)';
        ctx.fill();
        ctx.restore();

      } else if (activeMode === 'orbital') {
        for (let orbit = 1; orbit <= 3; orbit++) {
          const orbitRad = innerRadius * (0.22 + orbit * 0.15);
          ctx.beginPath();
          ctx.arc(centerX, centerY, orbitRad, 0, Math.PI * 2);
          ctx.strokeStyle = orbit === 1 ? '#00ff88' : orbit === 2 ? '#00f3ff' : '#8800ff';
          ctx.lineWidth = 1;
          ctx.stroke();

          const planetAngle = t * (0.5 / orbit) + orbit * 2;
          const px = centerX + Math.cos(planetAngle) * orbitRad;
          const py = centerY + Math.sin(planetAngle) * orbitRad;

          ctx.beginPath();
          ctx.arc(px, py, 4, 0, Math.PI * 2);
          ctx.fillStyle = ctx.strokeStyle;
          ctx.shadowColor = ctx.strokeStyle;
          ctx.shadowBlur = 10;
          ctx.fill();
          ctx.shadowBlur = 0;
        }

      } else if (activeMode === 'pulse') {
        const pulseVal = Math.sin(t * 4) * 0.15 + 1;
        const ringRad = innerRadius * 0.45 * pulseVal;

        ctx.beginPath();
        ctx.arc(centerX, centerY, ringRad, 0, Math.PI * 2);
        ctx.strokeStyle = primary;
        ctx.lineWidth = 2.5;
        ctx.shadowColor = primary;
        ctx.shadowBlur = 20;
        ctx.stroke();
        ctx.shadowBlur = 0;

        ctx.beginPath();
        for (let x = -innerRadius * 0.5; x <= innerRadius * 0.5; x += 3) {
          const y = centerY + Math.sin(x * 0.08 + t * 6) * 14 * Math.sin(t * 2);
          if (x === -innerRadius * 0.5) ctx.moveTo(centerX + x, y);
          else ctx.lineTo(centerX + x, y);
        }
        ctx.strokeStyle = secondary;
        ctx.lineWidth = 2;
        ctx.stroke();

      } else if (activeMode === 'mechanical') {
        const gearRot = t * 0.8;
        
        ctx.save();
        ctx.translate(centerX, centerY);
        ctx.rotate(gearRot);
        ctx.strokeStyle = primary;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(0, 0, innerRadius * 0.28, 0, Math.PI * 2);
        ctx.stroke();
        for (let g = 0; g < 8; g++) {
          const ang = (g / 8) * Math.PI * 2;
          ctx.beginPath();
          ctx.moveTo(Math.cos(ang) * (innerRadius * 0.22), Math.sin(ang) * (innerRadius * 0.22));
          ctx.lineTo(Math.cos(ang) * (innerRadius * 0.35), Math.sin(ang) * (innerRadius * 0.35));
          ctx.stroke();
        }
        ctx.restore();

        const gear2X = centerX + Math.cos(gearRot * 0.5) * (innerRadius * 0.35);
        const gear2Y = centerY + Math.sin(gearRot * 0.5) * (innerRadius * 0.35);
        ctx.save();
        ctx.translate(gear2X, gear2Y);
        ctx.rotate(-gearRot * 1.5);
        ctx.strokeStyle = secondary;
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.arc(0, 0, innerRadius * 0.16, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();

      } else if (activeMode === 'cosmic') {
        const numStars = 32;
        for (let s = 0; s < numStars; s++) {
          const starAng = (s / numStars) * Math.PI * 2 + t * 0.2 * (s % 2 === 0 ? 1 : -1);
          const starDist = innerRadius * (0.1 + ((s * 37) % 80) * 0.01);
          const sx = centerX + Math.cos(starAng) * starDist;
          const sy = centerY + Math.sin(starAng) * starDist;

          ctx.beginPath();
          ctx.arc(sx, sy, (s % 3) + 1, 0, Math.PI * 2);
          ctx.fillStyle = s % 2 === 0 ? primary : secondary;
          ctx.shadowColor = ctx.fillStyle;
          ctx.shadowBlur = 6;
          ctx.fill();
          ctx.shadowBlur = 0;
        }

      } else if (activeMode === 'flow') {
        const numParticles = 24;
        for (let p = 0; p < numParticles; p++) {
          const pProgress = ((t * 0.8 + p * 0.1) % 1);
          const px = centerX + (Math.sin(p * 15 + t) * innerRadius * 0.3);
          const py = centerY - innerRadius * 0.4 + pProgress * (innerRadius * 0.8);

          ctx.beginPath();
          ctx.arc(px, py, 2.5, 0, Math.PI * 2);
          ctx.fillStyle = primary;
          ctx.shadowColor = primary;
          ctx.shadowBlur = 8;
          ctx.fill();
          ctx.shadowBlur = 0;
        }

      } else if (activeMode === 'entropy') {
        const flameHeight = innerRadius * 0.4 * (1 - dayProgress * 0.2);
        const fx = centerX;
        const fy = centerY + innerRadius * 0.2;

        ctx.beginPath();
        ctx.moveTo(fx - 8, fy);
        ctx.quadraticCurveTo(fx - 15 + Math.sin(t * 8) * 4, fy - flameHeight * 0.6, fx + Math.sin(t * 12) * 6, fy - flameHeight);
        ctx.quadraticCurveTo(fx + 15 + Math.cos(t * 8) * 4, fy - flameHeight * 0.6, fx + 8, fy);
        ctx.closePath();
        ctx.fillStyle = primary;
        ctx.shadowColor = secondary;
        ctx.shadowBlur = 18;
        ctx.fill();
        ctx.shadowBlur = 0;

      } else if (activeMode === 'life') {
        ctx.beginPath();
        for (let a = 0; a < Math.PI * 6; a += 0.1) {
          const r = (a / (Math.PI * 6)) * (innerRadius * 0.45);
          const sx = centerX + Math.cos(a + t * 0.5) * r;
          const sy = centerY + Math.sin(a + t * 0.5) * r;
          if (a === 0) ctx.moveTo(sx, sy);
          else ctx.lineTo(sx, sy);
        }
        ctx.strokeStyle = primary;
        ctx.lineWidth = 1.8;
        ctx.shadowColor = primary;
        ctx.shadowBlur = 10;
        ctx.stroke();
        ctx.shadowBlur = 0;

      } else if (activeMode === 'journey') {
        ctx.beginPath();
        ctx.moveTo(centerX - innerRadius * 0.6, centerY + innerRadius * 0.2);
        ctx.lineTo(centerX + innerRadius * 0.6, centerY + innerRadius * 0.2);
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
        ctx.lineWidth = 2;
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(centerX, centerY + innerRadius * 0.2, 6, 0, Math.PI * 2);
        ctx.fillStyle = primary;
        ctx.shadowColor = primary;
        ctx.shadowBlur = 12;
        ctx.fill();
        ctx.shadowBlur = 0;

        for (let i = 1; i <= 3; i++) {
          const pos = ((t * 0.5 + i * 0.3) % 1);
          const px = centerX + (pos - 0.5) * (innerRadius * 1.2);
          ctx.beginPath();
          ctx.arc(px, centerY + innerRadius * 0.2, 3, 0, Math.PI * 2);
          ctx.fillStyle = secondary;
          ctx.fill();
        }
      }

      // --- CENTRAL TIME DISPLAY & TEMPORAL COORDINATES ---
      const hours = String(curr.getHours() % 12 || 12).padStart(2, '0');
      const minutes = String(curr.getMinutes()).padStart(2, '0');
      const seconds = String(curr.getSeconds()).padStart(2, '0');

      ctx.font = `bold ${baseRadius * 0.15}px Orbitron, monospace`;
      ctx.fillStyle = '#ffffff';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.shadowColor = primary;
      ctx.shadowBlur = 10;
      ctx.fillText(`${hours}:${minutes}:${seconds}`, centerX, centerY - baseRadius * 0.05);
      ctx.shadowBlur = 0;

      ctx.font = `bold ${baseRadius * 0.06}px Orbitron, monospace`;
      ctx.fillStyle = primary;
      ctx.fillText(`DAY ${dayOfYear} · CYCLE ${Math.floor(dayProgress * 4) + 1} · ${Math.floor(dayProgress * 100)}%`, centerX, centerY + baseRadius * 0.12);

      ctx.font = `bold ${baseRadius * 0.055}px Orbitron, sans-serif`;
      ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
      ctx.fillText(`NVK TIME™ // ${currentConfig.name.toUpperCase()}`, centerX, -baseRadius * 0.95 + centerY);

      animationFrameId = requestAnimationFrame(render);
    };

    render(0);

    return () => cancelAnimationFrame(animationFrameId);
  }, [width, height, activeMode]);

  return (
    <div ref={containerRef} className="w-full h-full bg-slate-950 rounded-full overflow-hidden flex flex-col items-center justify-center relative shadow-2xl">
      <canvas ref={canvasRef} className="absolute inset-0" />

      {/* Floating Mode Selector Bar */}
      <div className="absolute bottom-6 z-20 flex items-center gap-1 bg-slate-900/90 backdrop-blur-md px-3 py-1.5 rounded-full border border-slate-700 shadow-xl max-w-[90%] overflow-x-auto custom-scrollbar">
        {MODES.map((m) => {
          const isActive = activeMode === m.id;
          return (
            <button
              key={m.id}
              onClick={() => setActiveMode(m.id)}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium transition-all whitespace-nowrap ${
                isActive
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/50 shadow-md'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60 border border-transparent'
              }`}
              title={m.description}
            >
              {m.icon}
              <span className="hidden sm:inline">{m.name}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default TemporalEngineWatchFace;
