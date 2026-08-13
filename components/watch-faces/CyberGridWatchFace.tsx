import React, { useRef, useEffect } from 'react';
import { useDimensions } from '../../hooks/useDimensions';

interface CyberGridWatchFaceProps {
    time: Date;
    modeName: string;
}

const CyberGridWatchFace: React.FC<CyberGridWatchFaceProps> = ({ time, modeName }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const { width, height } = useDimensions(containerRef);
    const timeRef = useRef(time);

    useEffect(() => {
        timeRef.current = time;
    }, [time]);

    useEffect(() => {
        const canvas = canvasRef.current;
        const container = containerRef.current;
        if (!canvas) return;

        const effectiveW = width || (container ? container.clientWidth : 350) || 350;
        const effectiveH = height || (container ? container.clientHeight : 350) || 350;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        canvas.width = effectiveW * window.devicePixelRatio;
        canvas.height = effectiveH * window.devicePixelRatio;
        canvas.style.width = `${effectiveW}px`;
        canvas.style.height = `${effectiveH}px`;
        ctx.scale(window.devicePixelRatio, window.devicePixelRatio);

        let animationFrameId: number;

        const render = (timestamp: number) => {
            ctx.clearRect(0, 0, effectiveW, effectiveH);

            const centerX = effectiveW / 2;
            const centerY = effectiveH / 2;
            const radius = Math.max(10, Math.min(effectiveW, effectiveH) * 0.45);

            // Background
            const bgGrad = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, radius * 1.5);
            bgGrad.addColorStop(0, '#001a1a');
            bgGrad.addColorStop(1, '#000000');
            ctx.fillStyle = bgGrad;
            ctx.fillRect(0, 0, effectiveW, effectiveH);

            // Cyber Grid (Perspective Grid)
            ctx.strokeStyle = 'rgba(0, 255, 255, 0.1)';
            ctx.lineWidth = 1;
            const numLines = 20;
            for (let i = 0; i < numLines; i++) {
                const x = (i / numLines) * effectiveW;
                ctx.beginPath();
                ctx.moveTo(x, effectiveH);
                ctx.lineTo(centerX, centerY);
                ctx.stroke();
            }
            for (let i = 0; i < 10; i++) {
                const y = centerY + (i / 10) * (effectiveH - centerY);
                const w = (i / 10) * effectiveW;
                ctx.beginPath();
                ctx.moveTo(centerX - w / 2, y);
                ctx.lineTo(centerX + w / 2, y);
                ctx.stroke();
            }

            // Time Display HUD Capsule
            const currentTime = timeRef.current;
            const hours = String(currentTime.getHours() % 12 || 12).padStart(2, '0');
            const minutes = String(currentTime.getMinutes()).padStart(2, '0');
            const seconds = String(currentTime.getSeconds()).padStart(2, '0');
            const isPm = currentTime.getHours() >= 12;

            ctx.save();
            const pillW = radius * 0.95;
            const pillH = radius * 0.35;
            const pillX = centerX - pillW / 2;
            const pillY = centerY - pillH / 2;
            const cornerR = Math.min(pillH / 2, pillW / 2);

            ctx.fillStyle = 'rgba(2, 6, 23, 0.9)';
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

            ctx.font = `bold ${radius * 0.22}px Orbitron`;
            ctx.fillStyle = '#38bdf8';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.shadowColor = '#0284c7';
            ctx.shadowBlur = 10;
            ctx.fillText(`${hours}:${minutes}:${seconds}`, centerX, centerY - pillH * 0.08);

            ctx.font = `bold ${radius * 0.08}px Orbitron`;
            ctx.fillStyle = '#fbbf24';
            ctx.shadowColor = '#f59e0b';
            ctx.shadowBlur = 6;
            ctx.fillText(`${isPm ? 'PM' : 'AM'} • ${(modeName || "CYBER GRID").toUpperCase()}`, centerX, centerY + pillH * 0.28);
            ctx.restore();

            animationFrameId = requestAnimationFrame(render);
        };

        render(0);

        return () => cancelAnimationFrame(animationFrameId);
    }, [width, height, modeName]);

    return (
        <div ref={containerRef} className="w-full h-full bg-black rounded-full overflow-hidden">
            <canvas ref={canvasRef} />
        </div>
    );
};

export default CyberGridWatchFace;
