import React, { useRef, useEffect } from 'react';
import { useDimensions } from '../../hooks/useDimensions';

const ClockworkHeartWatchFace: React.FC<{ time: Date }> = ({ time }) => {
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
        ctx.scale(window.devicePixelRatio, window.devicePixelRatio);

        let animationFrameId: number;

        const drawGear = (x: number, y: number, radius: number, teeth: number, rotation: number, color: string) => {
            ctx.save();
            ctx.translate(x, y);
            ctx.rotate(rotation);
            ctx.fillStyle = color;
            ctx.strokeStyle = '#000';
            ctx.lineWidth = 1;

            ctx.beginPath();
            for (let i = 0; i < teeth * 2; i++) {
                const angle = (i / (teeth * 2)) * Math.PI * 2;
                const r = i % 2 === 0 ? radius : radius * 0.8;
                const px = Math.cos(angle) * r;
                const py = Math.sin(angle) * r;
                if (i === 0) ctx.moveTo(px, py);
                else ctx.lineTo(px, py);
            }
            ctx.closePath();
            ctx.fill();
            ctx.stroke();

            // Inner hole
            ctx.fillStyle = '#111';
            ctx.beginPath();
            ctx.arc(0, 0, radius * 0.3, 0, Math.PI * 2);
            ctx.fill();
            ctx.stroke();

            ctx.restore();
        };

        const render = (timestamp: number) => {
            ctx.fillStyle = '#221a10';
            ctx.fillRect(0, 0, effectiveW, effectiveH);

            const centerX = effectiveW / 2;
            const centerY = effectiveH / 2;
            const radius = Math.max(10, Math.min(effectiveW, effectiveH) * 0.45);

            // Background Gears
            const gearRotation = timestamp * 0.001;
            drawGear(centerX - radius * 0.5, centerY - radius * 0.5, radius * 0.4, 12, gearRotation, '#8b4513');
            drawGear(centerX + radius * 0.5, centerY + radius * 0.5, radius * 0.3, 8, -gearRotation * 1.5, '#cd853f');
            drawGear(centerX - radius * 0.4, centerY + radius * 0.6, radius * 0.25, 10, gearRotation * 0.8, '#a0522d');
            drawGear(centerX + radius * 0.6, centerY - radius * 0.4, radius * 0.35, 14, -gearRotation * 1.2, '#d2691e');

            // Central Pulsing Heart
            const heartScale = 1 + Math.sin(timestamp * 0.005) * 0.05;
            ctx.save();
            ctx.translate(centerX, centerY);
            ctx.scale(heartScale, heartScale);
            
            // Heart Shape
            ctx.fillStyle = '#800000';
            ctx.beginPath();
            ctx.moveTo(0, radius * 0.2);
            ctx.bezierCurveTo(-radius * 0.5, -radius * 0.3, -radius * 0.8, radius * 0.3, 0, radius * 0.8);
            ctx.bezierCurveTo(radius * 0.8, radius * 0.3, radius * 0.5, -radius * 0.3, 0, radius * 0.2);
            ctx.fill();
            ctx.strokeStyle = '#ff0000';
            ctx.lineWidth = 2;
            ctx.stroke();
            
            ctx.restore();

            // Time Display Capsule
            const currentTime = timeRef.current;
            const hours = String(currentTime.getHours() % 12 || 12).padStart(2, '0');
            const minutes = String(currentTime.getMinutes()).padStart(2, '0');
            const seconds = String(currentTime.getSeconds()).padStart(2, '0');
            const isPm = currentTime.getHours() >= 12;

            ctx.save();
            ctx.fillStyle = 'rgba(15, 10, 5, 0.9)';
            ctx.strokeStyle = '#d97706';
            ctx.lineWidth = 1.5;
            const pillW = radius * 0.9;
            const pillH = radius * 0.32;
            const pillX = centerX - pillW / 2;
            const pillY = centerY - pillH / 2;
            const cornerR = Math.min(pillH / 2, pillW / 2);
            
            ctx.beginPath();
            ctx.moveTo(pillX + cornerR, pillY);
            ctx.arcTo(pillX + pillW, pillY, pillX + pillW, pillY + pillH, cornerR);
            ctx.arcTo(pillX + pillW, pillY + pillH, pillX, pillY + pillH, cornerR);
            ctx.arcTo(pillX, pillY + pillH, pillX, pillY, cornerR);
            ctx.arcTo(pillX, pillY, pillX + pillW, pillY, cornerR);
            ctx.closePath();
            ctx.fill();
            ctx.stroke();

            ctx.font = `bold ${radius * 0.2}px "Orbitron", monospace`;
            ctx.fillStyle = '#fef08a';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.shadowColor = '#d97706';
            ctx.shadowBlur = 10;
            ctx.fillText(`${hours}:${minutes}:${seconds} ${isPm ? 'PM' : 'AM'}`, centerX, centerY);
            ctx.shadowBlur = 0;
            ctx.restore();

            animationFrameId = requestAnimationFrame(render);
        };

        render(0);
        return () => cancelAnimationFrame(animationFrameId);
    }, [width, height]);

    return (
        <div ref={containerRef} className="w-full h-full bg-[#1a130a] rounded-full overflow-hidden border-4 border-[#3d2b1f]">
            <canvas ref={canvasRef} />
        </div>
    );
};

export default ClockworkHeartWatchFace;
