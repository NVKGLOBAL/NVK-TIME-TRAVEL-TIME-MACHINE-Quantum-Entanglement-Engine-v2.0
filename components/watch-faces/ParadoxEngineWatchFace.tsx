import React, { useRef, useEffect } from 'react';
import { useDimensions } from '../../hooks/useDimensions';

interface WatchFaceProps {
    time: Date;
    modeName?: string;
}

const ParadoxEngineWatchFace: React.FC<WatchFaceProps> = ({ time, modeName = "Paradox Engine" }) => {
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

        canvas.width = width * window.devicePixelRatio;
        canvas.height = height * window.devicePixelRatio;
        canvas.style.width = `${width}px`;
        canvas.style.height = `${height}px`;
        ctx.scale(window.devicePixelRatio, window.devicePixelRatio);

        let animationFrameId: number;

        const render = (timestamp: number) => {
            const currentTime = timeRef.current;
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

            // Paradox Core (Rotating Gears)
            ctx.strokeStyle = 'rgba(255, 50, 50, 0.3)';
            ctx.lineWidth = 1;
            const numGears = 3;
            for (let i = 0; i < numGears; i++) {
                const angle = (i / numGears) * Math.PI * 2 + timestamp * 0.0005 * (i % 2 === 0 ? 1 : -1);
                const r = radius * (0.3 + i * 0.2);
                ctx.beginPath();
                ctx.arc(centerX, centerY, r, 0, Math.PI * 2);
                ctx.stroke();
                
                // Teeth
                for (let j = 0; j < 12; j++) {
                    const toothAngle = (j / 12) * Math.PI * 2 + angle;
                    ctx.beginPath();
                    ctx.moveTo(centerX + Math.cos(toothAngle) * r, centerY + Math.sin(toothAngle) * r);
                    ctx.lineTo(centerX + Math.cos(toothAngle) * (r + 5), centerY + Math.sin(toothAngle) * (r + 5));
                    ctx.stroke();
                }
            }

            // Glitch Effect
            if (Math.random() > 0.95) {
                ctx.fillStyle = 'rgba(255, 0, 0, 0.1)';
                ctx.fillRect(0, Math.random() * height, width, Math.random() * 10);
            }

            // Time Display
            const hours = String(currentTime.getHours() % 12 || 12).padStart(2, '0');
            const minutes = String(currentTime.getMinutes()).padStart(2, '0');
            const seconds = String(currentTime.getSeconds()).padStart(2, '0');

            ctx.font = `bold ${radius * 0.25}px Orbitron`;
            ctx.fillStyle = '#fff';
            ctx.shadowColor = 'red';
            ctx.shadowBlur = 10;
            ctx.textAlign = 'center';
            ctx.fillText(`${hours}:${minutes}`, centerX, centerY - radius * 0.1);
            
            ctx.font = `${radius * 0.12}px Orbitron`;
            ctx.fillStyle = 'rgba(255, 100, 100, 0.8)';
            ctx.fillText(seconds, centerX, centerY + radius * 0.1);
            ctx.shadowBlur = 0;

            // Mode Name
            ctx.font = `${radius * 0.08}px Orbitron`;
            ctx.fillStyle = 'rgba(255, 50, 50, 0.4)';
            ctx.fillText(modeName.toUpperCase(), centerX, centerY + radius * 0.4);

            animationFrameId = requestAnimationFrame(render);
        };

        render(0);

        return () => cancelAnimationFrame(animationFrameId);
    }, [width, height, modeName]);

    return (
        <div ref={containerRef} className="w-full h-full bg-black rounded-full overflow-hidden flex items-center justify-center">
            <canvas ref={canvasRef} />
        </div>
    );
};

export default ParadoxEngineWatchFace;
