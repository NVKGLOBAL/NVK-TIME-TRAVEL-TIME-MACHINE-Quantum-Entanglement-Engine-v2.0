import React, { useEffect, useRef } from 'react';

interface NegentropicCoreProps {
  entropy: number;
  ritualState: 'dormant' | 'active' | 'cascade';
  width?: number;
  height?: number;
  isTardisModeActive?: boolean; // New prop for TARDIS mode
  isStabilizing?: boolean;
  onClick?: () => void;
}

const NegentropicCore: React.FC<NegentropicCoreProps> = ({ 
  entropy, 
  ritualState, 
  width = 200, 
  height = 200,
  isTardisModeActive = false,
  isStabilizing = false,
  onClick,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stabilizationProgress = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = width;
    canvas.height = height;

    if (isStabilizing) {
      stabilizationProgress.current = 0;
    }

    const drawCore = () => {
      ctx.clearRect(0, 0, width, height);

      const centerX = width / 2;
      const centerY = height / 2;

      if (isStabilizing && stabilizationProgress.current < 1) {
        stabilizationProgress.current += 0.02; // Control animation speed
      }
      const t = Math.min(1, stabilizationProgress.current); // Easing can be applied here

      const displayEntropy = isStabilizing ? Math.max(0.01, entropy * (1 - t)) : (isTardisModeActive ? 0.025 : entropy);
      const clampedEntropy = Math.min(1, Math.max(0, displayEntropy));
      
      const baseRadius = (width / 2) * 0.3 + (1 - clampedEntropy) * (width / 2) * 0.6; 

      // Core fill
      let fillStyle: string;
      let shadowColor: string;

      if (isStabilizing) {
        const stabilizationColor = `rgba(200, 230, 255, ${0.5 + t * 0.5})`;
        fillStyle = stabilizationColor;
        shadowColor = `rgba(220, 240, 255, ${0.8 + t * 0.2})`;
      } else if (isTardisModeActive) {
        fillStyle = 'rgba(255, 215, 100, 0.5)';
        shadowColor = 'rgba(255, 215, 0, 0.8)';
      } else if (ritualState === 'active') {
        fillStyle = 'rgba(100, 255, 255, 0.4)';
        shadowColor = 'rgba(100, 255, 255, 1)';
      } else if (ritualState === 'cascade') {
        fillStyle = `rgba(255, 100, 150, ${0.3 + clampedEntropy * 0.3})`; 
        shadowColor = `rgba(255, 100, 150, 1)`;
      } else {
        fillStyle = 'rgba(180, 220, 255, 0.2)';
        shadowColor = 'rgba(180, 220, 255, 1)';
      }
      
      ctx.beginPath();
      ctx.arc(centerX, centerY, baseRadius, 0, 2 * Math.PI);
      ctx.fillStyle = fillStyle;
      ctx.shadowColor = shadowColor;
      ctx.shadowBlur = isStabilizing ? 10 + 40 * t : (isTardisModeActive ? 30 : (10 + (1-clampedEntropy) * 20));
      ctx.fill();
      ctx.shadowColor = 'transparent';
      ctx.shadowBlur = 0;

      // Crystalline structure overlay
      const spikes = isStabilizing ? 12 : (isTardisModeActive ? 12 : Math.floor(6 + (1 - clampedEntropy) * 12)); 
      const spikeLengthFactor = isStabilizing ? 1.4 * (1 - t * 0.5) : (isTardisModeActive ? 1.4 : (1.2 + (1 - clampedEntropy) * 0.5)); 
      const rotationSpeedFactor = isStabilizing ? 0.00001 : (isTardisModeActive ? 0.00002 : (0.00005 * (1 + clampedEntropy * 2)));

      for (let i = 0; i < spikes; i++) {
        const angle = (i / spikes) * 2 * Math.PI + (Date.now() * rotationSpeedFactor);
        const lengthVariation = isTardisModeActive ? 0.95 : (0.8 + Math.random() * 0.4); 
        
        const startRadius = baseRadius * (isStabilizing ? 0.8 * (1 - t * 0.3) : (isTardisModeActive ? 0.6 : 0.5));
        const endRadiusOuter = baseRadius * spikeLengthFactor * lengthVariation;
        
        const startX = centerX + Math.cos(angle) * startRadius;
        const startY = centerY + Math.sin(angle) * startRadius;
        const endX = centerX + Math.cos(angle) * endRadiusOuter;
        const endY = centerY + Math.sin(angle) * endRadiusOuter;
        
        ctx.beginPath();
        ctx.moveTo(startX, startY);
        ctx.lineTo(endX, endY);
        
        const spikeOpacity = isStabilizing ? 0.8 * t + 0.2 : (isTardisModeActive ? 0.8 : (0.3 + 0.5 * (1 - clampedEntropy) * (ritualState === 'cascade' ? 0.7 : 1)));
        const hue = isStabilizing ? 200 : (isTardisModeActive ? 45 : (ritualState === 'cascade' ? (300 + clampedEntropy * 60) % 360 : 200)); 
        const lightness = isStabilizing ? 80 : (isTardisModeActive ? 75 : (70 + (1-clampedEntropy)*20));
        ctx.strokeStyle = `hsla(${hue}, 80%, ${lightness}%, ${spikeOpacity})`;
        ctx.lineWidth = Math.max(0.5, (isStabilizing ? 2.5 * (1-t) + 1 : (isTardisModeActive ? 2 : (1 + (1 - clampedEntropy) * 1.5))));
        ctx.stroke();

        if (isStabilizing || isTardisModeActive || (ritualState !== 'cascade' || Math.random() > clampedEntropy * 0.5)) {
          ctx.beginPath();
          ctx.arc(endX, endY, ctx.lineWidth * (isTardisModeActive ? 1 : 0.8), 0, 2 * Math.PI);
          ctx.fillStyle = ctx.strokeStyle;
          ctx.fill();
        }
      }
    };
    
    let animationFrameId: number;
    const renderLoop = () => {
        drawCore();
        animationFrameId = requestAnimationFrame(renderLoop);
    }
    renderLoop();

    return () => {
        cancelAnimationFrame(animationFrameId);
    }

  }, [entropy, ritualState, width, height, isTardisModeActive, isStabilizing]);

  return (
    <div onClick={onClick} className="cursor-pointer">
      <canvas 
        ref={canvasRef} 
        className="rounded-full shadow-lg" 
        aria-label={`Negentropic Core visualization. Current state: ${isTardisModeActive ? 'TARDIS Sync Active' : ritualState}, Entropy level: ${entropy.toFixed(2)}`}
        role="img"
      />
    </div>
  );
};

export default NegentropicCore;