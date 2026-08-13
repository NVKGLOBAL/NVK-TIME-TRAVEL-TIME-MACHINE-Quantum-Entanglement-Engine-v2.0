import React, { useRef, useEffect } from 'react';
import { useDimensions } from '../../hooks/useDimensions';

interface SacredGeometryProps {
    time: Date;
    palette: [string, string];
}

const SacredGeometryWatchFace: React.FC<SacredGeometryProps> = ({ time, palette }) => {
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

        const drawFlowerOfLife = (timestamp: number) => {
            const centerX = width / 2;
            const centerY = height / 2;
            const radius = Math.min(width, height) / 7;

            ctx.clearRect(0, 0, width, height);
            ctx.fillStyle = '#000510';
            ctx.fillRect(0, 0, width, height);

            // Background Starfield
            ctx.save();
            for (let i = 0; i < 40; i++) {
                const x = (Math.sin(i * 123.45) * 0.5 + 0.5) * width;
                const y = (Math.cos(i * 543.21) * 0.5 + 0.5) * height;
                const size = Math.random() * 1.2;
                const opacity = 0.3 + Math.sin(timestamp * 0.001 + i) * 0.3;
                ctx.fillStyle = `rgba(255, 255, 255, ${opacity})`;
                ctx.beginPath();
                ctx.arc(x, y, size, 0, Math.PI * 2);
                ctx.fill();
            }
            ctx.restore();
            
            ctx.save();
            ctx.beginPath();
            ctx.arc(centerX, centerY, Math.min(width,height) / 2, 0, Math.PI * 2);
            ctx.clip();
            
            ctx.globalCompositeOperation = 'lighter';
            
            const pulse = Math.sin(timestamp * 0.001) * 0.1 + 0.95;

            const drawCircle = (x: number, y: number) => {
                ctx.beginPath();
                ctx.arc(x, y, radius * pulse, 0, Math.PI * 2);
                ctx.stroke();
            };

            const points = [{x: centerX, y: centerY}];
            for (let i = 0; i < 6; i++) {
                const angle = (i * Math.PI) / 3;
                points.push({ x: centerX + radius * Math.cos(angle), y: centerY + radius * Math.sin(angle) });
                points.push({ x: centerX + 2 * radius * Math.cos(angle), y: centerY + 2 * radius * Math.sin(angle) });
            }
            // Add points for a more complete pattern
            for (let i = 0; i < 6; i++) {
                const angle1 = (i * Math.PI) / 3;
                const angle2 = ((i + 1) % 6 * Math.PI) / 3;
                points.push({
                    x: centerX + radius * (Math.cos(angle1) + Math.cos(angle2)),
                    y: centerY + radius * (Math.sin(angle1) + Math.sin(angle2)),
                });
            }

            ctx.lineWidth = 1.2 * pulse;
            ctx.strokeStyle = palette[0];
            ctx.shadowColor = palette[0];
            ctx.shadowBlur = 10;
            points.forEach(p => drawCircle(p.x, p.y));
            
            ctx.lineWidth = 0.5 * pulse;
            ctx.strokeStyle = palette[1];
            ctx.shadowColor = palette[1];
            ctx.shadowBlur = 5;
            points.forEach(p => drawCircle(p.x, p.y));

            ctx.restore();

            // Time Display
            const currentTime = timeRef.current;
            let h = currentTime.getHours();
            h = h % 12;
            h = h ? h : 12; // the hour '0' should be '12'
            const hours = String(h).padStart(2, '0');
            const minutes = String(currentTime.getMinutes()).padStart(2, '0');
            
            ctx.font = `bold ${Math.min(width,height) * 0.12}px Orbitron`;
            ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.shadowColor = 'white';
            ctx.shadowBlur = 10;
            ctx.fillText(`${hours}:${minutes}`, width / 2, height / 2);
            ctx.shadowBlur = 0;
        };

        const render = (timestamp: number) => {
            if (canvasRef.current) {
                drawFlowerOfLife(timestamp);
                animationFrameId = requestAnimationFrame(render);
            }
        };
        
        render(0);

        return () => {
            cancelAnimationFrame(animationFrameId);
        };
    }, [width, height, palette]);

    return (
        <div ref={containerRef} className="w-full h-full rounded-full overflow-hidden">
            <canvas ref={canvasRef} />
        </div>
    );
};

export default SacredGeometryWatchFace;