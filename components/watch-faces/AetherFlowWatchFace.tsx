import React, { useRef, useEffect } from 'react';
import { useDimensions } from '../../hooks/useDimensions';

const AetherFlowWatchFace: React.FC<{ time: Date }> = ({ time }) => {
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
            ctx.fillStyle = '#0a0a20';
            ctx.fillRect(0, 0, effectiveW, effectiveH);

            const centerX = effectiveW / 2;
            const centerY = effectiveH / 2;
            const radius = Math.max(10, Math.min(effectiveW, effectiveH) * 0.45);

            // Aether Flow Lines
            ctx.lineWidth = 2;
            const lineCount = 12;
            for (let i = 0; i < lineCount; i++) {
                const angle = (i / lineCount) * Math.PI * 2 + timestamp * 0.0002;
                const hue = (timestamp * 0.05 + i * 30) % 360;
                ctx.strokeStyle = `hsla(${hue}, 100%, 60%, 0.3)`;
                
                ctx.beginPath();
                ctx.moveTo(centerX, centerY);
                for (let j = 0; j < 20; j++) {
                    const r = (j / 20) * radius * 1.2;
                    const a = angle + Math.sin(timestamp * 0.001 + j * 0.5) * 0.5;
                    const x = centerX + Math.cos(a) * r;
                    const y = centerY + Math.sin(a) * r;
                    ctx.lineTo(x, y);
                }
                ctx.stroke();
            }

            // Central Energy Core
            const corePulse = 1 + Math.sin(timestamp * 0.003) * 0.1;
            const coreR = Math.max(1, radius * 0.3 * corePulse);
            const coreGradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, coreR);
            coreGradient.addColorStop(0, '#fff');
            coreGradient.addColorStop(0.5, '#00ffff');
            coreGradient.addColorStop(1, 'rgba(0, 255, 255, 0)');
            ctx.fillStyle = coreGradient;
            ctx.beginPath();
            ctx.arc(centerX, centerY, coreR, 0, Math.PI * 2);
            ctx.fill();

            // Time Display Capsule
            const currentTime = timeRef.current;
            const hours = String(currentTime.getHours() % 12 || 12).padStart(2, '0');
            const minutes = String(currentTime.getMinutes()).padStart(2, '0');
            const seconds = String(currentTime.getSeconds()).padStart(2, '0');
            const isPm = currentTime.getHours() >= 12;

            ctx.save();
            const pillW = radius * 0.92;
            const pillH = radius * 0.34;
            const pillX = centerX - pillW / 2;
            const pillY = centerY - pillH / 2;
            const cornerR = Math.min(pillH / 2, pillW / 2);

            ctx.fillStyle = 'rgba(2, 6, 23, 0.9)';
            ctx.strokeStyle = '#22d3ee';
            ctx.lineWidth = 2;
            ctx.shadowColor = '#22d3ee';
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
            ctx.shadowColor = '#22d3ee';
            ctx.shadowBlur = 10;
            ctx.fillText(`${hours}:${minutes}:${seconds}`, centerX, centerY - pillH * 0.08);

            ctx.font = `bold ${radius * 0.08}px Orbitron`;
            ctx.fillStyle = '#f43f5e';
            ctx.shadowColor = '#f43f5e';
            ctx.shadowBlur = 6;
            ctx.fillText(`${isPm ? 'PM' : 'AM'} • AETHER FLOW`, centerX, centerY + pillH * 0.28);
            ctx.restore();

            animationFrameId = requestAnimationFrame(render);
        };

        render(0);
        return () => cancelAnimationFrame(animationFrameId);
    }, [width, height]);

    return (
        <div ref={containerRef} className="w-full h-full bg-black rounded-full overflow-hidden border border-cyan-500/20">
            <canvas ref={canvasRef} />
        </div>
    );
};

export default AetherFlowWatchFace;
