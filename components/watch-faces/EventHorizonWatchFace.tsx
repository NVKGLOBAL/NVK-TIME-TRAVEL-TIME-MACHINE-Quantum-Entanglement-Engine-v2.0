import React, { useRef, useEffect } from 'react';
import { useDimensions } from '../../hooks/useDimensions';

interface WatchFaceProps {
    time: Date;
    modeName?: string;
}

const EventHorizonWatchFace: React.FC<WatchFaceProps> = ({ time, modeName = "Event Horizon" }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const { width, height } = useDimensions(containerRef);
    const timeRef = useRef(time);

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
            const currentTime = timeRef.current;
            ctx.clearRect(0, 0, width, height);

            const centerX = width / 2;
            const centerY = height / 2;
            const radius = Math.min(width, height) * 0.45;

            // Background
            ctx.fillStyle = '#000';
            ctx.fillRect(0, 0, width, height);

            // Event Horizon Glow
            const glowRadius = radius * 0.6;
            const grad = ctx.createRadialGradient(centerX, centerY, glowRadius * 0.8, centerX, centerY, glowRadius * 1.2);
            grad.addColorStop(0, 'rgba(255, 100, 0, 0.8)');
            grad.addColorStop(0.5, 'rgba(255, 50, 0, 0.4)');
            grad.addColorStop(1, 'transparent');
            ctx.fillStyle = grad;
            ctx.beginPath();
            ctx.arc(centerX, centerY, glowRadius * 1.2, 0, Math.PI * 2);
            ctx.fill();

            // Distorted Light
            ctx.strokeStyle = 'rgba(255, 150, 0, 0.2)';
            ctx.lineWidth = 1;
            for (let i = 0; i < 20; i++) {
                const angle = (i / 20) * Math.PI * 2 + timestamp * 0.0005;
                const r = glowRadius * (1.1 + Math.sin(timestamp * 0.001 + i) * 0.1);
                ctx.beginPath();
                ctx.moveTo(centerX + Math.cos(angle) * glowRadius, centerY + Math.sin(angle) * glowRadius);
                ctx.lineTo(centerX + Math.cos(angle) * r, centerY + Math.sin(angle) * r);
                ctx.stroke();
            }

            // Time Display
            const hours = String(currentTime.getHours() % 12 || 12).padStart(2, '0');
            const minutes = String(currentTime.getMinutes()).padStart(2, '0');
            const seconds = String(currentTime.getSeconds()).padStart(2, '0');

            ctx.font = `bold ${radius * 0.25}px Orbitron`;
            ctx.fillStyle = '#fff';
            ctx.shadowColor = 'orange';
            ctx.shadowBlur = 10;
            ctx.textAlign = 'center';
            ctx.fillText(`${hours}:${minutes}`, centerX, centerY - radius * 0.1);
            
            ctx.font = `${radius * 0.12}px Orbitron`;
            ctx.fillStyle = 'rgba(255, 150, 0, 0.8)';
            ctx.fillText(seconds, centerX, centerY + radius * 0.1);
            ctx.shadowBlur = 0;

            // Mode Name
            ctx.font = `${radius * 0.08}px Orbitron`;
            ctx.fillStyle = 'rgba(255, 150, 0, 0.4)';
            ctx.fillText(modeName.toUpperCase(), centerX, centerY + radius * 0.4);

            animationFrameId = requestAnimationFrame(render);
        };

        render(0);

        return () => cancelAnimationFrame(animationFrameId);
    }, [width, height, modeName]);

    return (
        <div ref={containerRef} className="w-full h-full bg-black rounded-full overflow-hidden flex items-center justify-center">
            <canvas ref={canvasRef} />
        </div>
    );
};

export default EventHorizonWatchFace;
