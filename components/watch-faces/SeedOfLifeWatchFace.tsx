import React, { useRef, useEffect } from 'react';
import { useDimensions } from '../../hooks/useDimensions';

interface WatchFaceProps {
    time: Date;
}

const SeedOfLifeWatchFace: React.FC<WatchFaceProps> = ({ time }) => {
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
            const radius = Math.min(width, height) / 6;

            ctx.clearRect(0, 0, width, height);
            ctx.fillStyle = '#0a1005';
            ctx.fillRect(0, 0, width, height);

            const pulse = Math.sin(timestamp * 0.001) * 0.05 + 1;
            const rotation = timestamp * 0.0003;

            ctx.save();
            ctx.translate(centerX, centerY);
            ctx.rotate(rotation);

            ctx.lineWidth = 1.5;
            ctx.strokeStyle = 'rgba(100, 255, 100, 0.6)';
            ctx.shadowColor = 'lime';
            ctx.shadowBlur = 10;

            // Center circle
            ctx.beginPath();
            ctx.arc(0, 0, radius * pulse, 0, Math.PI * 2);
            ctx.stroke();

            // 6 surrounding circles
            for (let i = 0; i < 6; i++) {
                const angle = (i * Math.PI) / 3;
                ctx.beginPath();
                ctx.arc(radius * Math.cos(angle), radius * Math.sin(angle), radius * pulse, 0, Math.PI * 2);
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
            ctx.shadowColor = 'lime';
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

export default SeedOfLifeWatchFace;
