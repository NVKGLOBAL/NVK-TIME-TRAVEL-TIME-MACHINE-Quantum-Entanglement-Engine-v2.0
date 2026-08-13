import React, { useRef, useEffect } from 'react';
import { useDimensions } from '../../hooks/useDimensions';

interface WatchFaceProps {
    time: Date;
    modeName?: string;
}

const SingularityCoreWatchFace: React.FC<WatchFaceProps> = ({ time, modeName = "Singularity Core" }) => {
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

            // Singularity Core
            const corePulse = 0.8 + Math.sin(timestamp * 0.005) * 0.2;
            const grad = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, radius * 0.4 * corePulse);
            grad.addColorStop(0, '#fff');
            grad.addColorStop(0.2, '#0ff');
            grad.addColorStop(0.5, '#00f');
            grad.addColorStop(1, 'transparent');
            ctx.fillStyle = grad;
            ctx.beginPath();
            ctx.arc(centerX, centerY, radius * 0.4 * corePulse, 0, Math.PI * 2);
            ctx.fill();

            // Accretion Disk
            ctx.strokeStyle = 'rgba(0, 255, 255, 0.2)';
            ctx.lineWidth = 2;
            for (let i = 0; i < 5; i++) {
                const r = radius * (0.5 + i * 0.1);
                const angle = timestamp * 0.001 + i;
                ctx.beginPath();
                ctx.ellipse(centerX, centerY, r, r * 0.3, angle, 0, Math.PI * 2);
                ctx.stroke();
            }

            // Time Display
            const hours = String(currentTime.getHours() % 12 || 12).padStart(2, '0');
            const minutes = String(currentTime.getMinutes()).padStart(2, '0');
            const seconds = String(currentTime.getSeconds()).padStart(2, '0');

            ctx.font = `bold ${radius * 0.25}px Orbitron`;
            ctx.fillStyle = '#fff';
            ctx.shadowColor = 'cyan';
            ctx.shadowBlur = 10;
            ctx.textAlign = 'center';
            ctx.fillText(`${hours}:${minutes}`, centerX, centerY - radius * 0.1);
            
            ctx.font = `${radius * 0.12}px Orbitron`;
            ctx.fillStyle = 'rgba(0, 255, 255, 0.8)';
            ctx.fillText(seconds, centerX, centerY + radius * 0.1);
            ctx.shadowBlur = 0;

            // Mode Name
            ctx.font = `${radius * 0.08}px Orbitron`;
            ctx.fillStyle = 'rgba(0, 255, 255, 0.4)';
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

export default SingularityCoreWatchFace;
