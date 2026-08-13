import React, { useRef, useEffect } from 'react';
import { useDimensions } from '../../hooks/useDimensions';

interface NexusCoreWatchFaceProps {
    time: Date;
    modeName: string;
}

const NexusCoreWatchFace: React.FC<NexusCoreWatchFaceProps> = ({ time, modeName }) => {
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
            ctx.clearRect(0, 0, width, height);

            const centerX = width / 2;
            const centerY = height / 2;
            const radius = Math.min(width, height) * 0.45;

            // Background
            const bgGrad = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, radius * 1.5);
            bgGrad.addColorStop(0, '#1a1a1a');
            bgGrad.addColorStop(1, '#000000');
            ctx.fillStyle = bgGrad;
            ctx.fillRect(0, 0, width, height);

            // Nexus Core (Central Hub with Connections)
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
            ctx.lineWidth = 1;
            const numNodes = 12;
            for (let i = 0; i < numNodes; i++) {
                const angle = (i / numNodes) * Math.PI * 2 + timestamp * 0.0001;
                const r = radius * 0.8;
                const nx = centerX + Math.cos(angle) * r;
                const ny = centerY + Math.sin(angle) * r;
                
                ctx.beginPath();
                ctx.moveTo(centerX, centerY);
                ctx.lineTo(nx, ny);
                ctx.stroke();
                
                ctx.beginPath();
                ctx.arc(nx, ny, 4, 0, Math.PI * 2);
                ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
                ctx.fill();
            }

            // Core Glow
            const coreGrad = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, radius * 0.2);
            coreGrad.addColorStop(0, 'rgba(255, 255, 255, 0.8)');
            coreGrad.addColorStop(1, 'rgba(255, 255, 255, 0)');
            ctx.fillStyle = coreGrad;
            ctx.beginPath();
            ctx.arc(centerX, centerY, radius * 0.2, 0, Math.PI * 2);
            ctx.fill();

            // Time Display
            const currentTime = timeRef.current;
            const hours = String(currentTime.getHours() % 12 || 12).padStart(2, '0');
            const minutes = String(currentTime.getMinutes()).padStart(2, '0');
            const seconds = String(currentTime.getSeconds()).padStart(2, '0');

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
    }, [width, height, modeName]);

    return (
        <div ref={containerRef} className="w-full h-full bg-black rounded-full overflow-hidden">
            <canvas ref={canvasRef} />
        </div>
    );
};

export default NexusCoreWatchFace;
