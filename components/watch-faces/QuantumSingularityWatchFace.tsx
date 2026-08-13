import React, { useRef, useEffect } from 'react';
import { useDimensions } from '../../hooks/useDimensions';

const QuantumSingularityWatchFace: React.FC<{ time: Date }> = ({ time }) => {
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
        ctx.scale(window.devicePixelRatio, window.devicePixelRatio);

        let animationFrameId: number;

        const render = (timestamp: number) => {
            ctx.fillStyle = '#000';
            ctx.fillRect(0, 0, width, height);

            const centerX = width / 2;
            const centerY = height / 2;
            const radius = Math.min(width, height) * 0.4;

            // Event Horizon Glow
            const gradient = ctx.createRadialGradient(centerX, centerY, radius * 0.5, centerX, centerY, radius * 1.2);
            gradient.addColorStop(0, 'rgba(0, 0, 0, 1)');
            gradient.addColorStop(0.5, 'rgba(20, 0, 40, 0.8)');
            gradient.addColorStop(0.8, 'rgba(100, 0, 255, 0.3)');
            gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');

            ctx.fillStyle = gradient;
            ctx.beginPath();
            ctx.arc(centerX, centerY, radius * 1.2, 0, Math.PI * 2);
            ctx.fill();

            // Accretion Disk
            const diskRotation = timestamp * 0.001;
            for (let i = 0; i < 100; i++) {
                const angle = (i / 100) * Math.PI * 2 + diskRotation;
                const dist = radius * (0.8 + Math.sin(timestamp * 0.002 + i) * 0.1);
                const x = centerX + Math.cos(angle) * dist;
                const y = centerY + Math.sin(angle) * dist * 0.3; // Flattened

                ctx.fillStyle = `hsla(${(timestamp * 0.05 + i * 2) % 360}, 100%, 70%, ${0.5 + Math.sin(i) * 0.3})`;
                ctx.beginPath();
                ctx.arc(x, y, 1.5, 0, Math.PI * 2);
                ctx.fill();
            }

            // Singularity Core
            ctx.fillStyle = '#000';
            ctx.beginPath();
            ctx.arc(centerX, centerY, radius * 0.6, 0, Math.PI * 2);
            ctx.fill();
            
            // Gravitational Lensing Ring
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.arc(centerX, centerY, radius * 0.65, 0, Math.PI * 2);
            ctx.stroke();

            // Time Display
            const currentTime = timeRef.current;
            const hours = String(currentTime.getHours()).padStart(2, '0');
            const minutes = String(currentTime.getMinutes()).padStart(2, '0');
            const seconds = String(currentTime.getSeconds()).padStart(2, '0');

            ctx.font = `bold ${radius * 0.25}px Orbitron`;
            ctx.fillStyle = '#fff';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.shadowColor = '#8b5cf6';
            ctx.shadowBlur = 10;
            ctx.fillText(`${hours}:${minutes}:${seconds}`, centerX, centerY);
            ctx.shadowBlur = 0;

            animationFrameId = requestAnimationFrame(render);
        };

        render(0);
        return () => cancelAnimationFrame(animationFrameId);
    }, [width, height]);

    return (
        <div ref={containerRef} className="w-full h-full bg-black rounded-full overflow-hidden">
            <canvas ref={canvasRef} />
        </div>
    );
};

export default QuantumSingularityWatchFace;
