import React, { useRef, useEffect } from 'react';
import { useDimensions } from '../../hooks/useDimensions';

interface WatchFaceProps {
    time: Date;
}

const QuantumFractalWatchFace: React.FC<WatchFaceProps> = ({ time }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const { width, height } = useDimensions(containerRef);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas || width === 0 || height === 0) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        
        let animationFrameId: number;
        
        canvas.width = width;
        canvas.height = height;

        const render = () => {
            if (!canvasRef.current) return;
            const w = canvasRef.current.width;
            const h = canvasRef.current.height;
            const centerX = w / 2;
            const centerY = h / 2;

            const now = new Date();
            const seconds = now.getSeconds() + now.getMilliseconds() / 1000;
            const minutes = now.getMinutes() + seconds / 60;
            const hours = (now.getHours() % 12) + minutes / 60;

            ctx.clearRect(0, 0, w, h);
            ctx.fillStyle = 'rgba(15, 23, 42, 0.5)';
            ctx.fillRect(0,0,w,h);

            // Seconds fractal/pulse - multi-shockwave
            for (let i = 0; i < 3; i++) {
                const progress = (seconds % 1 + i / 3) % 1;
                const pulseRadius = progress * (w / 2);
                ctx.strokeStyle = `rgba(248, 113, 113, ${1 - progress})`; // red-400
                ctx.lineWidth = 1 + (1 - progress) * 2;
                ctx.beginPath();
                ctx.arc(centerX, centerY, pulseRadius, 0, Math.PI * 2);
                ctx.stroke();
            }

            // Minutes arms - with wave
            const minutesAngle = (minutes / 60) * Math.PI * 2 - Math.PI / 2;
            for (let i = 0; i < 3; i++) {
                const angle = minutesAngle + (i - 1) * 0.2;
                const len = w/2 * 0.8;
                const timeWave = Math.sin(Date.now() * 0.005 + i * 2);
                const waveAmplitude = len * 0.03;

                ctx.beginPath();
                ctx.moveTo(centerX, centerY);
                const endX = centerX + Math.cos(angle) * len;
                const endY = centerY + Math.sin(angle) * len;
                const midX = centerX + Math.cos(angle) * len * 0.5;
                const midY = centerY + Math.sin(angle) * len * 0.5;
                const controlX = midX + Math.cos(angle + Math.PI / 2) * waveAmplitude * timeWave;
                const controlY = midY + Math.sin(angle + Math.PI / 2) * waveAmplitude * timeWave;

                ctx.quadraticCurveTo(controlX, controlY, endX, endY);
                ctx.strokeStyle = `rgba(107, 114, 128, ${0.5 - i*0.1})`;
                ctx.lineWidth = 3;
                ctx.stroke();
            }

            // Hours structure - with pulse
            const hoursAngle = (hours / 12) * Math.PI * 2 - Math.PI / 2;
            const pulse = Math.sin(Date.now() * 0.002) * 0.05 + 1;
            const len = w/2 * 0.5 * pulse;
            const p1x = centerX + Math.cos(hoursAngle) * len;
            const p1y = centerY + Math.sin(hoursAngle) * len;
            const p2x = centerX + Math.cos(hoursAngle + Math.PI * 2/3) * len * 0.5;
            const p2y = centerY + Math.sin(hoursAngle + Math.PI * 2/3) * len * 0.5;
            const p3x = centerX + Math.cos(hoursAngle - Math.PI * 2/3) * len * 0.5;
            const p3y = centerY + Math.sin(hoursAngle - Math.PI * 2/3) * len * 0.5;

            ctx.beginPath();
            ctx.moveTo(p1x, p1y);
            ctx.lineTo(p2x, p2y);
            ctx.lineTo(p3x, p3y);
            ctx.closePath();
            ctx.strokeStyle = 'rgba(14, 165, 233, 0.8)'; // sky-500
            ctx.fillStyle = 'rgba(14, 165, 233, 0.2)';
            ctx.lineWidth = 2;
            ctx.stroke();
            ctx.fill();

            animationFrameId = requestAnimationFrame(render);
        };
        
        render();

        return () => {
            cancelAnimationFrame(animationFrameId);
        };
    }, [width, height]);

    return <div ref={containerRef} className="w-full h-full rounded-full overflow-hidden"><canvas ref={canvasRef} /></div>;
};

export default QuantumFractalWatchFace;