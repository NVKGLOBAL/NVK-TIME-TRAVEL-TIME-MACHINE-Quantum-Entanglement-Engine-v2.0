import React, { useRef, useEffect } from 'react';
import { useDimensions } from '../../hooks/useDimensions';

interface WatchFaceProps {
    time: Date;
    modeName?: string;
}

const VoidNavigatorWatchFace: React.FC<WatchFaceProps> = ({ time, modeName = "Void Navigator" }) => {
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

            // Starfield
            for (let i = 0; i < 50; i++) {
                const x = (Math.sin(i * 123) * 0.5 + 0.5) * width;
                const y = (Math.cos(i * 456) * 0.5 + 0.5) * height;
                const opacity = 0.1 + Math.sin(timestamp * 0.001 + i) * 0.1;
                ctx.fillStyle = `rgba(255, 255, 255, ${opacity})`;
                ctx.beginPath();
                ctx.arc(x, y, 1, 0, Math.PI * 2);
                ctx.fill();
            }

            // Navigation Compass
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.arc(centerX, centerY, radius * 0.8, 0, Math.PI * 2);
            ctx.stroke();

            const needleAngle = timestamp * 0.0002;
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.6)';
            ctx.beginPath();
            ctx.moveTo(centerX - Math.cos(needleAngle) * radius * 0.6, centerY - Math.sin(needleAngle) * radius * 0.6);
            ctx.lineTo(centerX + Math.cos(needleAngle) * radius * 0.6, centerY + Math.sin(needleAngle) * radius * 0.6);
            ctx.stroke();

            // Time Display
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

export default VoidNavigatorWatchFace;
