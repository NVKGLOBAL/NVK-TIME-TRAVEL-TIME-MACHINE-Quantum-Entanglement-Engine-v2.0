import React, { useRef, useEffect } from 'react';
import { useDimensions } from '../../hooks/useDimensions';

interface WatchFaceProps {
    time: Date;
}

const MetatronsCubeWatchFace: React.FC<WatchFaceProps> = ({ time }) => {
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
            const radius = Math.min(width, height) / 8;

            ctx.clearRect(0, 0, width, height);
            ctx.fillStyle = '#050510';
            ctx.fillRect(0, 0, width, height);

            // Pulse effect
            const pulse = Math.sin(timestamp * 0.001) * 0.05 + 1;
            const rotation = timestamp * 0.0002;

            ctx.save();
            ctx.translate(centerX, centerY);
            ctx.rotate(rotation);

            // 13 circles of Metatron's Cube
            const points: { x: number, y: number }[] = [{ x: 0, y: 0 }];
            
            // Inner 6
            for (let i = 0; i < 6; i++) {
                const angle = (i * Math.PI) / 3;
                points.push({
                    x: radius * 2 * Math.cos(angle),
                    y: radius * 2 * Math.sin(angle)
                });
            }

            // Outer 6
            for (let i = 0; i < 6; i++) {
                const angle = (i * Math.PI) / 3;
                points.push({
                    x: radius * 4 * Math.cos(angle),
                    y: radius * 4 * Math.sin(angle)
                });
            }

            // Draw lines between all points
            ctx.lineWidth = 0.5;
            ctx.strokeStyle = 'rgba(0, 255, 255, 0.3)';
            for (let i = 0; i < points.length; i++) {
                for (let j = i + 1; j < points.length; j++) {
                    ctx.beginPath();
                    ctx.moveTo(points[i].x, points[i].y);
                    ctx.lineTo(points[j].x, points[j].y);
                    ctx.stroke();
                }
            }

            // Draw circles
            ctx.lineWidth = 1.5;
            ctx.strokeStyle = 'rgba(0, 255, 255, 0.6)';
            points.forEach(p => {
                ctx.beginPath();
                ctx.arc(p.x, p.y, radius * pulse, 0, Math.PI * 2);
                ctx.stroke();
            });

            ctx.restore();

            // Time Display
            const currentTime = timeRef.current;
            const h = currentTime.getHours() % 12 || 12;
            const m = String(currentTime.getMinutes()).padStart(2, '0');
            const s = String(currentTime.getSeconds()).padStart(2, '0');

            ctx.font = `bold ${Math.min(width, height) * 0.1}px Orbitron`;
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

export default MetatronsCubeWatchFace;
