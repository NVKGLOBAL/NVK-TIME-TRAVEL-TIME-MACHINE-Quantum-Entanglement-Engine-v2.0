import React, { useRef, useEffect } from 'react';
import { useDimensions } from '../../hooks/useDimensions';

interface WatchFaceProps {
    time: Date;
    modeName?: string;
}

const TemporalPrismWatchFace: React.FC<WatchFaceProps> = ({ time, modeName = "Temporal Prism" }) => {
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
            ctx.clearRect(0, 0, width, height);

            const centerX = width / 2;
            const centerY = height / 2;
            const radius = Math.min(width, height) * 0.45;

            // Background
            ctx.fillStyle = '#000';
            ctx.fillRect(0, 0, width, height);

            // Prism Rays
            const colors = ['red', 'orange', 'yellow', 'green', 'blue', 'indigo', 'violet'];
            for (let i = 0; i < colors.length; i++) {
                const angle = (i / colors.length) * Math.PI * 2 + timestamp * 0.0005;
                const r = radius * 0.8;
                ctx.strokeStyle = `rgba(${i * 30 + 50}, ${255 - i * 30}, ${i * 20 + 100}, 0.3)`;
                ctx.lineWidth = 10;
                ctx.beginPath();
                ctx.moveTo(centerX, centerY);
                ctx.lineTo(centerX + Math.cos(angle) * r, centerY + Math.sin(angle) * r);
                ctx.stroke();
            }

            // Central Prism
            ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
            ctx.beginPath();
            ctx.moveTo(centerX, centerY - 20);
            ctx.lineTo(centerX + 17, centerY + 10);
            ctx.lineTo(centerX - 17, centerY + 10);
            ctx.closePath();
            ctx.fill();
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
            ctx.lineWidth = 1;
            ctx.stroke();

            // Time Display
            const currentTime = timeRef.current;
            const hours = String(currentTime.getHours() % 12 || 12).padStart(2, '0');
            const minutes = String(currentTime.getMinutes()).padStart(2, '0');
            const seconds = String(currentTime.getSeconds()).padStart(2, '0');

            ctx.font = `bold ${radius * 0.25}px Orbitron`;
            ctx.fillStyle = '#fff';
            ctx.shadowColor = 'white';
            ctx.shadowBlur = 10;
            ctx.textAlign = 'center';
            ctx.fillText(`${hours}:${minutes}`, centerX, centerY - radius * 0.1);
            
            ctx.font = `${radius * 0.12}px Orbitron`;
            ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
            ctx.fillText(seconds, centerX, centerY + radius * 0.1);
            ctx.shadowBlur = 0;

            // Mode Name
            ctx.font = `${radius * 0.08}px Orbitron`;
            ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
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

export default TemporalPrismWatchFace;
