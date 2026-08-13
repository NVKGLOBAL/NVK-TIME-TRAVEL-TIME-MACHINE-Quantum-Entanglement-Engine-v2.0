import React, { useRef, useEffect } from 'react';

interface GenerativeWatchFaceProps {
    time: Date;
    seed: number;
    palette: [string, string, string];
}

interface Particle {
    x: number;
    y: number;
    vx: number;
    vy: number;
    size: number;
    color: string;
    seed: number;
}

const GenerativeWatchFace: React.FC<GenerativeWatchFaceProps> = ({ time, seed, palette }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const particlesRef = useRef<Particle[]>([]);

    useEffect(() => {
        const canvas = canvasRef.current;
        const container = containerRef.current;
        if (!canvas || !container) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        
        let animationFrameId: number;

        const resizeCanvas = () => {
            const { width, height } = container.getBoundingClientRect();
            canvas.width = width;
            canvas.height = height;

            // Initialize particles on resize
            const numParticles = 50 + (seed % 50);
            particlesRef.current = [];
            for(let i=0; i<numParticles; i++) {
                const particleSeed = (seed + i * 137.5);
                particlesRef.current.push({
                    x: width / 2,
                    y: height / 2,
                    vx: Math.sin(particleSeed) * 2,
                    vy: Math.cos(particleSeed) * 2,
                    size: (particleSeed % 2) + 1,
                    color: palette[i % palette.length],
                    seed: particleSeed
                });
            }
        };

        const render = (timestamp: number) => {
            const w = canvas.width;
            const h = canvas.height;
            if (w === 0 || h === 0) {
                animationFrameId = requestAnimationFrame(render);
                return;
            };

            ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
            ctx.fillRect(0, 0, w, h);

            particlesRef.current.forEach(p => {
                // Update velocity based on time and seed
                const angle = Math.sin(timestamp * 0.0001 * (p.seed % 1) + p.seed);
                p.vx += Math.cos(angle) * 0.1;
                p.vy += Math.sin(angle) * 0.1;

                // Dampen velocity
                p.vx *= 0.98;
                p.vy *= 0.98;

                p.x += p.vx;
                p.y += p.vy;

                // Boundary check
                if (p.x < 0 || p.x > w) p.vx *= -1;
                if (p.y < 0 || p.y > h) p.vy *= -1;

                // Draw
                ctx.fillStyle = p.color;
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                ctx.fill();
            });

            // High Contrast Digital Time Capsule
            const now = time;
            let rawHours = now.getHours();
            const isPm = rawHours >= 12;
            const formattedHour = rawHours % 12 || 12;
            const hours = String(formattedHour).padStart(2, '0');
            const minutes = String(now.getMinutes()).padStart(2, '0');
            const seconds = String(now.getSeconds()).padStart(2, '0');

            ctx.save();
            const minDim = Math.min(w, h);
            const pillW = minDim * 0.65;
            const pillH = minDim * 0.22;
            const pillX = w / 2 - pillW / 2;
            const pillY = h / 2 - pillH / 2;
            const cornerR = Math.min(pillH / 2, pillW / 2);

            ctx.fillStyle = 'rgba(2, 6, 23, 0.85)';
            ctx.strokeStyle = palette[0] || '#06b6d4';
            ctx.lineWidth = 2;
            ctx.shadowColor = palette[0] || '#06b6d4';
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

            ctx.font = `bold ${minDim * 0.11}px "Orbitron", sans-serif`;
            ctx.fillStyle = '#ffffff';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.shadowColor = palette[1] || '#38bdf8';
            ctx.shadowBlur = 10;
            ctx.fillText(`${hours}:${minutes}:${seconds}`, w / 2, h / 2 - pillH * 0.1);

            ctx.font = `bold ${minDim * 0.05}px "Orbitron", sans-serif`;
            ctx.fillStyle = palette[2] || '#fbbf24';
            ctx.shadowColor = palette[2] || '#f59e0b';
            ctx.shadowBlur = 6;
            ctx.fillText(`${isPm ? 'PM' : 'AM'} • GENERATIVE CORE`, w / 2, h / 2 + pillH * 0.28);

            ctx.restore();

            animationFrameId = requestAnimationFrame(render);
        };
        
        const observer = new ResizeObserver(resizeCanvas);
        observer.observe(container);

        resizeCanvas(); // Initial call
        render(0);

        return () => {
            cancelAnimationFrame(animationFrameId);
            observer.disconnect();
        };
    }, [seed, palette]);

    return (
        <div ref={containerRef} className="w-full h-full rounded-full overflow-hidden border-4 border-gray-800">
            <canvas ref={canvasRef} />
        </div>
    );
};

export default GenerativeWatchFace;
