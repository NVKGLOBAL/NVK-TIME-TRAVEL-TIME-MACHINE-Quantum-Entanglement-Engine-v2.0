import React, { useRef, useEffect } from 'react';
import { useDimensions } from '../../hooks/useDimensions';

interface WatchFaceProps {
    time: Date;
}

const TorusWatchFace: React.FC<WatchFaceProps> = ({ time }) => {
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

        let animationFrameId: number;

        canvas.width = width * window.devicePixelRatio;
        canvas.height = height * window.devicePixelRatio;
        canvas.style.width = `${width}px`;
        canvas.style.height = `${height}px`;
        ctx.scale(window.devicePixelRatio, window.devicePixelRatio);

        const draw = (timestamp: number) => {
            const centerX = width / 2;
            const centerY = height / 2;
            const radius = Math.min(width, height) / 3;

            ctx.clearRect(0, 0, width, height);
            ctx.fillStyle = '#051010';
            ctx.fillRect(0, 0, width, height);

            const rotation = timestamp * 0.0002;
            const pulse = Math.sin(timestamp * 0.001) * 0.1 + 1;

            ctx.save();
            ctx.translate(centerX, centerY);
            ctx.rotate(rotation);

            ctx.lineWidth = 1;
            ctx.strokeStyle = 'rgba(0, 255, 200, 0.4)';
            ctx.shadowColor = 'cyan';
            ctx.shadowBlur = 5;

            // Draw Torus (simplified as nested circles with varying offsets)
            for (let i = 0; i < 24; i++) {
                const angle = (i * Math.PI * 2) / 24;
                const x = Math.cos(angle) * (radius / 3);
                const y = Math.sin(angle) * (radius / 3);
                
                ctx.beginPath();
                ctx.arc(x, y, radius * pulse, 0, Math.PI * 2);
                ctx.stroke();
            }

            ctx.restore();

            // Time Display
            const currentTime = timeRef.current;
            const h = currentTime.getHours() % 12 || 12;
            const m = String(currentTime.getMinutes()).padStart(2, '0');
            const s = String(currentTime.getSeconds()).padStart(2, '0');

            ctx.font = `bold ${Math.min(width, height) * 0.12}px Orbitron`;
            ctx.fillStyle = 'white';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.shadowColor = 'cyan';
            ctx.shadowBlur = 15;
            ctx.fillText(`${h}:${m}:${s}`, centerX, centerY);
        };

        const render = (timestamp: number) => {
            draw(timestamp);
            animationFrameId = requestAnimationFrame(render);
        };

        render(0);
        return () => cancelAnimationFrame(animationFrameId);
    }, [width, height]);

    return (
        <div ref={containerRef} className="w-full h-full rounded-full overflow-hidden">
            <canvas ref={canvasRef} />
        </div>
    );
};

export default TorusWatchFace;
