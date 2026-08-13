import React, { useRef, useEffect } from 'react';

interface NexusPortalProps {
    isOpen: boolean;
    onComplete: () => void;
}

interface Particle {
    x: number;
    y: number;
    angle: number;
    speed: number;
    radius: number;
    size: number;
    color: string;
}

const NexusPortal: React.FC<NexusPortalProps> = ({ isOpen, onComplete }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const animationFrameId = useRef<number | undefined>(undefined);
    const startTimeRef = useRef<number>(0);
    const particlesRef = useRef<Particle[]>([]);
    const DURATION = 3500; // ms

    useEffect(() => {
        if (!isOpen) return;

        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        
        startTimeRef.current = performance.now();
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        particlesRef.current = Array.from({ length: 2000 }, () => ({
            angle: Math.random() * Math.PI * 2,
            speed: Math.random() * 0.01 + 0.005,
            radius: Math.random() * 50,
            size: Math.random() * 2 + 1,
            color: `hsla(${240 + Math.random() * 60}, 100%, ${70 + Math.random() * 20}%, ${0.5 + Math.random() * 0.5})`,
            x: 0, y: 0 // Will be calculated
        }));


        const animate = (timestamp: number) => {
            if (!canvasRef.current) return;
            const elapsed = timestamp - startTimeRef.current;
            const progress = Math.min(elapsed / DURATION, 1);
            
            const w = canvas.width;
            const h = canvas.height;
            const centerX = w / 2;
            const centerY = h / 2;

            ctx.fillStyle = 'rgba(0, 0, 10, 0.1)';
            ctx.fillRect(0, 0, w, h);

            // Phase 1: Small point
            const initialPulse = Math.sin(progress * Math.PI * 4) * 5 + 10;
            if (progress < 0.15) {
                ctx.fillStyle = 'white';
                ctx.beginPath();
                ctx.arc(centerX, centerY, initialPulse, 0, Math.PI * 2);
                ctx.fill();
            }

            // Phase 2: Vortex grows
            if (progress >= 0.15) {
                const portalRadius = (progress - 0.15) / 0.85 * (Math.max(w, h) / 1.5);
                
                particlesRef.current.forEach(p => {
                    p.angle += p.speed;
                    p.radius += 0.5;

                    const effectiveRadius = p.radius % portalRadius;

                    p.x = centerX + Math.cos(p.angle) * effectiveRadius;
                    p.y = centerY + Math.sin(p.angle) * effectiveRadius;
                    
                    ctx.fillStyle = p.color;
                    ctx.beginPath();
                    ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                    ctx.fill();
                });
            }

            // Phase 3: White out
            if (progress > 0.8) {
                const whiteoutProgress = (progress - 0.8) / 0.2;
                ctx.fillStyle = `rgba(255, 255, 255, ${whiteoutProgress})`;
                ctx.fillRect(0, 0, w, h);
            }

            if (progress < 1) {
                animationFrameId.current = requestAnimationFrame(animate);
            } else {
                onComplete();
            }
        };
        
        animationFrameId.current = requestAnimationFrame(animate);

        return () => {
            if (animationFrameId.current) {
                cancelAnimationFrame(animationFrameId.current);
            }
        };

    }, [isOpen, onComplete]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[6000] bg-black">
            <canvas ref={canvasRef} className="w-full h-full" />
        </div>
    );
};

export default NexusPortal;