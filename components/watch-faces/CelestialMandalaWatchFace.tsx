import React, { useRef, useEffect } from 'react';
import { useDimensions } from '../../hooks/useDimensions';

interface CelestialMandalaProps {
    time: Date;
    seed: number;
    palette: [string, string, string];
}

interface Particle {
    x: number; y: number;
    vx: number; vy: number;
    size: number; opacity: number;
    color: string;
}

const CelestialMandalaWatchFace: React.FC<CelestialMandalaProps> = ({ time, seed, palette }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const particlesRef = useRef<Particle[]>([]);
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

        const numParticles = 30 + (seed % 30);
        particlesRef.current = [];
        for(let i=0; i<numParticles; i++) {
            particlesRef.current.push({
                x: Math.random() * width, y: Math.random() * height,
                vx: (Math.random() - 0.5) * 0.5, vy: (Math.random() - 0.5) * 0.5,
                size: Math.random() * 1.5 + 0.5,
                opacity: Math.random() * 0.5 + 0.2,
                color: palette[i % palette.length],
            });
        }

        const drawLayer = (radius: number, segments: number, rotation: number, color: string, lineWidth: number, complexity: number) => {
            ctx.save();
            ctx.translate(width / 2, height / 2);
            ctx.rotate(rotation);
            ctx.strokeStyle = color;
            ctx.lineWidth = lineWidth;
            ctx.globalCompositeOperation = 'lighter';
            
            for (let i = 0; i < segments; i++) {
                const angle = (i / segments) * Math.PI * 2;
                ctx.beginPath();
                const startX = Math.cos(angle) * radius;
                const startY = Math.sin(angle) * radius;
                
                const endAngle = angle + (Math.PI * 2 / segments) * complexity;
                const endX = Math.cos(endAngle) * radius;
                const endY = Math.sin(endAngle) * radius;

                const cp1Angle = angle + (endAngle - angle) * 0.25;
                const cp1Radius = radius * (1 + 0.2 * Math.sin(rotation * 5 + i));
                const cp1x = Math.cos(cp1Angle) * cp1Radius;
                const cp1y = Math.sin(cp1Angle) * cp1Radius;
                
                const cp2Angle = angle + (endAngle - angle) * 0.75;
                const cp2Radius = radius * (1 - 0.2 * Math.cos(rotation * 5 + i));
                const cp2x = Math.cos(cp2Angle) * cp2Radius;
                const cp2y = Math.sin(cp2Angle) * cp2Radius;

                ctx.moveTo(startX, startY);
                ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, endX, endY);
                ctx.stroke();
            }
            ctx.restore();
        };

        const render = (timestamp: number) => {
            if (!canvasRef.current) return;
            ctx.fillStyle = 'rgba(0, 5, 10, 0.2)';
            ctx.fillRect(0, 0, width, height);
            
            ctx.save();
            ctx.beginPath();
            ctx.arc(width / 2, height / 2, Math.min(width,height) / 2 - 2, 0, Math.PI * 2);
            ctx.clip();

            // Particles
            ctx.globalCompositeOperation = 'lighter';
            particlesRef.current.forEach(p => {
                p.x += p.vx; p.y += p.vy;
                if (p.x < 0 || p.x > width) p.vx *= -1;
                if (p.y < 0 || p.y > height) p.vy *= -1;
                
                ctx.fillStyle = p.color;
                ctx.globalAlpha = p.opacity;
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                ctx.fill();
            });
            ctx.globalAlpha = 1;

            // Mandala Layers
            const baseTime = timestamp * 0.0001;
            const maxRadius = Math.min(width,height) / 2.2;
            drawLayer(maxRadius * 0.3, 6, baseTime * (seed % 3 + 1), palette[0], 0.5, 3);
            drawLayer(maxRadius * 0.5, 12, -baseTime * (seed % 2 + 0.5), palette[1], 0.7, 5);
            drawLayer(maxRadius * 0.7, 8, baseTime * (seed % 4 + 1.2), palette[2], 0.6, 2);
            drawLayer(maxRadius * 0.9, 16, -baseTime * (seed % 3 + 0.8), palette[0], 0.5, 7);
            
            ctx.restore();

            // Time Display
            const currentTime = timeRef.current;
            let h = currentTime.getHours();
            h = h % 12;
            h = h ? h : 12; // the hour '0' should be '12'
            const hours = String(h).padStart(2, '0');
            const minutes = String(currentTime.getMinutes()).padStart(2, '0');
            const seconds = String(currentTime.getSeconds()).padStart(2, '0');

            ctx.font = `bold ${Math.min(width,height) * 0.15}px Orbitron`;
            ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.shadowColor = 'cyan';
            ctx.shadowBlur = 15;
            ctx.fillText(`${hours}:${minutes}:${seconds}`, width / 2, height / 2);
            ctx.shadowBlur = 0;

            animationFrameId = requestAnimationFrame(render);
        };
        
        render(0);

        return () => {
            cancelAnimationFrame(animationFrameId);
        };
    }, [width, height, seed, palette]);

    return (
        <div ref={containerRef} className="w-full h-full rounded-full overflow-hidden bg-black">
            <canvas ref={canvasRef} />
        </div>
    );
};

export default CelestialMandalaWatchFace;