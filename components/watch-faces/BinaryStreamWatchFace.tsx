import React, { useRef, useEffect } from 'react';
import { useDimensions } from '../../hooks/useDimensions';

interface BinaryStreamWatchFaceProps {
    time: Date;
    modeName: string;
}

const BinaryStreamWatchFace: React.FC<BinaryStreamWatchFaceProps> = ({ time, modeName }) => {
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
            bgGrad.addColorStop(0, '#001a00');
            bgGrad.addColorStop(1, '#000000');
            ctx.fillStyle = bgGrad;
            ctx.fillRect(0, 0, width, height);

            // Binary Stream (Falling 0s and 1s)
            ctx.font = '10px Courier New';
            ctx.fillStyle = 'rgba(0, 255, 0, 0.2)';
            const numColumns = 20;
            for (let i = 0; i < numColumns; i++) {
                const x = (i / numColumns) * width;
                const offset = (timestamp * 0.1 + i * 50) % height;
                for (let j = 0; j < 10; j++) {
                    const y = (offset + j * 15) % height;
                    const char = Math.random() > 0.5 ? '1' : '0';
                    ctx.fillText(char, x, y);
                }
            }

            // Time Display
            const hours = String(time.getHours() % 12 || 12).padStart(2, '0');
            const minutes = String(time.getMinutes()).padStart(2, '0');
            const seconds = String(time.getSeconds()).padStart(2, '0');

            ctx.font = `bold ${radius * 0.2}px Orbitron`;
            ctx.fillStyle = '#fff';
            ctx.shadowColor = 'lime';
            ctx.shadowBlur = 15;
            ctx.textAlign = 'center';
            ctx.fillText(`${hours}:${minutes}`, centerX, centerY);
            
            ctx.font = `${radius * 0.08}px Orbitron`;
            ctx.fillStyle = 'rgba(0, 255, 0, 0.7)';
            ctx.fillText(seconds, centerX, centerY + radius * 0.15);
            ctx.shadowBlur = 0;

            // Mode Name
            ctx.font = '10px Orbitron';
            ctx.fillStyle = 'rgba(0, 255, 0, 0.3)';
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

export default BinaryStreamWatchFace;
