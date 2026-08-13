import React, { useRef, useEffect } from 'react';
import { useDimensions } from '../../hooks/useDimensions';

const NebulaDriftWatchFace: React.FC<{ time: Date }> = ({ time }) => {
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

        const render = (timestamp: number) => {
            ctx.fillStyle = '#000';
            ctx.fillRect(0, 0, effectiveW, effectiveH);

            const centerX = effectiveW / 2;
            const centerY = effectiveH / 2;
            const radius = Math.max(10, Math.min(effectiveW, effectiveH) * 0.45);

            // Nebula Clouds
            const cloudCount = 10;
            for (let i = 0; i < cloudCount; i++) {
                const angle = (i / cloudCount) * Math.PI * 2 + timestamp * 0.0001;
                const dist = radius * (0.5 + Math.sin(timestamp * 0.0005 + i) * 0.2);
                const x = centerX + Math.cos(angle) * dist;
                const y = centerY + Math.sin(angle) * dist;

                const gradR = Math.max(1, radius * 0.6);
                const gradient = ctx.createRadialGradient(x, y, 0, x, y, gradR);
                const hue = (timestamp * 0.01 + i * 36) % 360;
                gradient.addColorStop(0, `hsla(${hue}, 100%, 50%, 0.2)`);
                gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');

                ctx.fillStyle = gradient;
                ctx.beginPath();
                ctx.arc(x, y, gradR, 0, Math.PI * 2);
                ctx.fill();
            }

            // Stars
            for (let i = 0; i < 50; i++) {
                const x = (Math.sin(i * 123.45) * 0.5 + 0.5) * effectiveW;
                const y = (Math.cos(i * 543.21) * 0.5 + 0.5) * effectiveH;
                const size = Math.random() * 1.5;
                const opacity = 0.5 + Math.sin(timestamp * 0.002 + i) * 0.5;

                ctx.fillStyle = `rgba(255, 255, 255, ${opacity})`;
                ctx.beginPath();
                ctx.arc(x, y, size, 0, Math.PI * 2);
                ctx.fill();
            }

            // Time Display Capsule
            const currentTime = timeRef.current;
            let h = currentTime.getHours();
            const isPm = h >= 12;
            h = h % 12 || 12;
            const hours = String(h).padStart(2, '0');
            const minutes = String(currentTime.getMinutes()).padStart(2, '0');
            const seconds = String(currentTime.getSeconds()).padStart(2, '0');

            ctx.save();
            const pillW = radius * 0.95;
            const pillH = radius * 0.35;
            const pillX = centerX - pillW / 2;
            const pillY = centerY - pillH / 2;
            const cornerR = Math.min(pillH / 2, pillW / 2);

            ctx.fillStyle = 'rgba(2, 6, 23, 0.85)';
            ctx.strokeStyle = '#38bdf8';
            ctx.lineWidth = 2;
            ctx.shadowColor = '#38bdf8';
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
            ctx.fillStyle = '#ffffff';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.shadowColor = '#38bdf8';
            ctx.shadowBlur = 10;
            ctx.fillText(`${hours}:${minutes}:${seconds}`, centerX, centerY - pillH * 0.08);

            ctx.font = `bold ${radius * 0.08}px Orbitron`;
            ctx.fillStyle = '#f43f5e';
            ctx.shadowColor = '#f43f5e';
            ctx.shadowBlur = 6;
            ctx.fillText(`${isPm ? 'PM' : 'AM'} • NEBULA DRIFT`, centerX, centerY + pillH * 0.28);
            ctx.restore();

            animationFrameId = requestAnimationFrame(render);
        };

        render(0);
        return () => cancelAnimationFrame(animationFrameId);
    }, [width, height]);

    return (
        <div ref={containerRef} className="w-full h-full bg-black rounded-full overflow-hidden border border-white/10">
            <canvas ref={canvasRef} />
        </div>
    );
};

export default NebulaDriftWatchFace;
