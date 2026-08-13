import React, { useRef, useEffect } from 'react';
import { useDimensions } from '../../hooks/useDimensions';

interface VoidPrismWatchFaceProps {
    time: Date;
    modeName: string;
}

const VoidPrismWatchFace: React.FC<VoidPrismWatchFaceProps> = ({ time, modeName }) => {
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
            bgGrad.addColorStop(0, '#050505');
            bgGrad.addColorStop(1, '#000000');
            ctx.fillStyle = bgGrad;
            ctx.fillRect(0, 0, width, height);

            // Void Prism (Rotating Triangle)
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
            ctx.lineWidth = 1;
            const numPrisms = 3;
            for (let i = 0; i < numPrisms; i++) {
                const angle = (timestamp * 0.0001 + i * 0.5) * (i % 2 === 0 ? 1 : -1);
                const prismRadius = radius * (0.3 + (i / numPrisms) * 0.6);
                
                ctx.beginPath();
                for (let j = 0; j < 3; j++) {
                    const jAngle = (j / 3) * Math.PI * 2 + angle;
                    const x = centerX + Math.cos(jAngle) * prismRadius;
                    const y = centerY + Math.sin(jAngle) * prismRadius;
                    if (j === 0) ctx.moveTo(x, y);
                    else ctx.lineTo(x, y);
                }
                ctx.closePath();
                
                const prismHue = (timestamp * 0.01 + i * 120) % 360;
                ctx.strokeStyle = `hsla(${prismHue}, 70%, 60%, 0.3)`;
                ctx.stroke();
            }

            // Time Display
            const hours = String(time.getHours() % 12 || 12).padStart(2, '0');
            const minutes = String(time.getMinutes()).padStart(2, '0');
            const seconds = String(time.getSeconds()).padStart(2, '0');

            ctx.font = `bold ${radius * 0.2}px Orbitron`;
            ctx.fillStyle = '#fff';
            ctx.shadowColor = 'white';
            ctx.shadowBlur = 15;
            ctx.textAlign = 'center';
            ctx.fillText(`${hours}:${minutes}`, centerX, centerY);
            
            ctx.font = `${radius * 0.08}px Orbitron`;
            ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
            ctx.fillText(seconds, centerX, centerY + radius * 0.15);
            ctx.shadowBlur = 0;

            // Mode Name
            ctx.font = '10px Orbitron';
            ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
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

export default VoidPrismWatchFace;
