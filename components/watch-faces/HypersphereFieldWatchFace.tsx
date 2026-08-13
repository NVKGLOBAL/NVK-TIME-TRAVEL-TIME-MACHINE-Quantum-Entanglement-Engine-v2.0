import React, { useRef, useEffect } from 'react';
import { useDimensions } from '../../hooks/useDimensions';

interface HypersphereFieldWatchFaceProps {
    time: Date;
    modeName: string;
}

const HypersphereFieldWatchFace: React.FC<HypersphereFieldWatchFaceProps> = ({ time, modeName }) => {
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
            bgGrad.addColorStop(0, '#00001a');
            bgGrad.addColorStop(1, '#000000');
            ctx.fillStyle = bgGrad;
            ctx.fillRect(0, 0, width, height);

            // Hypersphere Field (3D-like Spheres)
            ctx.strokeStyle = 'rgba(100, 200, 255, 0.1)';
            ctx.lineWidth = 1;
            const numSpheres = 5;
            for (let i = 0; i < numSpheres; i++) {
                const sphereRadius = radius * (0.2 + (i / numSpheres) * 0.8);
                const angleX = timestamp * 0.0002 + i * 0.5;
                const angleY = timestamp * 0.0003 + i * 0.5;
                
                ctx.beginPath();
                for (let j = 0; j < 12; j++) {
                    const angle = (j / 12) * Math.PI * 2;
                    const x = centerX + Math.cos(angle) * sphereRadius * Math.cos(angleX);
                    const y = centerY + Math.sin(angle) * sphereRadius * Math.sin(angleY);
                    if (j === 0) ctx.moveTo(x, y);
                    else ctx.lineTo(x, y);
                }
                ctx.closePath();
                
                const sphereHue = (timestamp * 0.02 + i * 60) % 360;
                ctx.strokeStyle = `hsla(${sphereHue}, 70%, 60%, 0.2)`;
                ctx.stroke();
            }

            // Time Display
            const currentTime = timeRef.current;
            const hours = String(currentTime.getHours() % 12 || 12).padStart(2, '0');
            const minutes = String(currentTime.getMinutes()).padStart(2, '0');
            const seconds = String(currentTime.getSeconds()).padStart(2, '0');

            ctx.font = `bold ${radius * 0.2}px Orbitron`;
            ctx.fillStyle = '#fff';
            ctx.shadowColor = 'skyblue';
            ctx.shadowBlur = 15;
            ctx.textAlign = 'center';
            ctx.fillText(`${hours}:${minutes}`, centerX, centerY);
            
            ctx.font = `${radius * 0.08}px Orbitron`;
            ctx.fillStyle = 'rgba(100, 200, 255, 0.7)';
            ctx.fillText(seconds, centerX, centerY + radius * 0.15);
            ctx.shadowBlur = 0;

            // Mode Name
            ctx.font = '10px Orbitron';
            ctx.fillStyle = 'rgba(100, 200, 255, 0.3)';
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

export default HypersphereFieldWatchFace;
