import React, { useRef, useEffect } from 'react';
import { useDimensions } from '../../hooks/useDimensions';

interface GlitchCoreWatchFaceProps {
    time: Date;
    modeName: string;
}

const GlitchCoreWatchFace: React.FC<GlitchCoreWatchFaceProps> = ({ time, modeName }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const { width, height } = useDimensions(containerRef);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas || width === 0 || height === 0) return;
        
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        canvas.width = width * window.devicePixelRatio;
        canvas.height = height * window.devicePixelRatio;
        canvas.style.width = `${width}px`;
        canvas.style.height = `${height}px`;
        ctx.scale(window.devicePixelRatio, window.devicePixelRatio);

        let animationFrameId: number;

        const render = (timestamp: number) => {
            ctx.clearRect(0, 0, width, height);

            const centerX = width / 2;
            const centerY = height / 2;
            const radius = Math.min(width, height) * 0.45;

            // Background
            const bgGrad = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, radius * 1.5);
            bgGrad.addColorStop(0, '#1a0000');
            bgGrad.addColorStop(1, '#000000');
            ctx.fillStyle = bgGrad;
            ctx.fillRect(0, 0, width, height);

            // Glitch Core (Flickering Rectangles)
            if (Math.random() > 0.8) {
                const numGlitch = 10;
                for (let i = 0; i < numGlitch; i++) {
                    const gx = Math.random() * width;
                    const gy = Math.random() * height;
                    const gw = Math.random() * 50;
                    const gh = Math.random() * 5;
                    ctx.fillStyle = `rgba(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255}, 0.5)`;
                    ctx.fillRect(gx, gy, gw, gh);
                }
            }

            // Time Display
            const hours = String(time.getHours() % 12 || 12).padStart(2, '0');
            const minutes = String(time.getMinutes()).padStart(2, '0');
            const seconds = String(time.getSeconds()).padStart(2, '0');

            ctx.font = `bold ${radius * 0.2}px Orbitron`;
            ctx.fillStyle = '#fff';
            ctx.shadowColor = 'red';
            ctx.shadowBlur = 15;
            ctx.textAlign = 'center';
            
            // Glitchy offset
            const offset = Math.random() > 0.95 ? (Math.random() - 0.5) * 10 : 0;
            ctx.fillText(`${hours}:${minutes}`, centerX + offset, centerY);
            
            ctx.font = `${radius * 0.08}px Orbitron`;
            ctx.fillStyle = 'rgba(255, 0, 0, 0.7)';
            ctx.fillText(seconds, centerX, centerY + radius * 0.15);
            ctx.shadowBlur = 0;

            // Mode Name
            ctx.font = '10px Orbitron';
            ctx.fillStyle = 'rgba(255, 0, 0, 0.3)';
            ctx.fillText(modeName.toUpperCase(), centerX, centerY - radius * 0.25);

            animationFrameId = requestAnimationFrame(render);
        };

        render(0);

        return () => cancelAnimationFrame(animationFrameId);
    }, [width, height, time, modeName]);

    return (
        <div ref={containerRef} className="w-full h-full bg-black rounded-full overflow-hidden">
            <canvas ref={canvasRef} />
        </div>
    );
};

export default GlitchCoreWatchFace;
