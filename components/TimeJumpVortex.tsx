import React, { useRef, useEffect } from 'react';
import type { TravelMethod } from '../types';

interface TimeJumpVortexProps {
    isJumping: boolean;
    isEmergency: boolean;
    method: TravelMethod;
}

const TimeJumpVortex: React.FC<TimeJumpVortexProps> = ({ isJumping, isEmergency, method }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const animationFrameId = useRef<number | undefined>(undefined);
    const animationState = useRef<any>({ phase: 0, phaseStart: 0, stars: null });

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!isJumping || !canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let w = canvas.width = window.innerWidth;
        let h = canvas.height = window.innerHeight;
        animationState.current = { phase: 0, phaseStart: Date.now(), stars: null };

        const animate = () => {
            if (!isJumping || !canvasRef.current) return;
            
            switch (method) {
                case 'teleportation':
                    animateTeleportation(ctx, w, h);
                    break;
                case 'wormhole':
                    animateWormhole(ctx, w, h);
                    break;
                default: // warp
                    animateWarp(ctx, w, h);
                    break;
            }
            animationFrameId.current = window.requestAnimationFrame(animate);
        };

        animate();

        return () => {
            if (animationFrameId.current) window.cancelAnimationFrame(animationFrameId.current);
        };

    }, [isJumping, isEmergency, method]);

    const animateTeleportation = (ctx: CanvasRenderingContext2D, w: number, h: number) => {
        const now = Date.now();
        const elapsed = now - animationState.current.phaseStart;
        const duration = isEmergency ? 4000 : 5000;

        // Phase 1: Departure Dissolve (0 - 1500ms)
        if (elapsed < 1500) {
            const progress = elapsed / 1500;
            ctx.fillStyle = 'rgba(0,0,0,0.2)';
            ctx.fillRect(0, 0, w, h);
            for (let i = 0; i < 200; i++) {
                ctx.fillStyle = `rgba(150, 200, 255, ${Math.random() * 0.7})`;
                const x = Math.random() * w;
                const y = Math.random() * h;
                const blockW = Math.random() * 80 + 20;
                const blockH = Math.random() * 3 + 1;
                if (Math.random() > progress) {
                    ctx.fillRect(x, y, blockW, blockH);
                }
            }
            if (elapsed < 300) {
                ctx.fillStyle = `rgba(255, 255, 255, ${1 - elapsed / 300})`;
                ctx.fillRect(0, 0, w, h);
            }
        } else if (elapsed < duration - 1500) {
            // Phase 2: In-transit (darkness)
            ctx.fillStyle = '#000';
            ctx.fillRect(0, 0, w, h);
        } else {
            // Phase 3: Arrival Reassembly (last 1500ms)
            const progress = (elapsed - (duration - 1500)) / 1500;
            ctx.fillStyle = '#000';
            ctx.fillRect(0, 0, w, h);
            
            // Scanlines wiping in
            const scanlineY = h * progress;
            ctx.fillStyle = 'rgba(150, 200, 255, 0.5)';
            ctx.fillRect(0, 0, w, scanlineY);
            
            // Digital noise
            for (let i = 0; i < 100; i++) {
                ctx.fillStyle = `rgba(150, 200, 255, ${Math.random() * 0.5})`;
                const x = Math.random() * w;
                const y = Math.random() * scanlineY;
                const blockW = Math.random() * 50 + 10;
                const blockH = Math.random() * 2 + 1;
                ctx.fillRect(x, y, blockW, blockH);
            }

            // Final white flash in
            if (progress > 0.8) {
                ctx.fillStyle = `rgba(255, 255, 255, ${(progress - 0.8) / 0.2})`;
                ctx.fillRect(0, 0, w, h);
            }
        }
    };
    
    const animateWormhole = (ctx: CanvasRenderingContext2D, w: number, h: number) => {
        ctx.fillStyle = 'rgba(5, 0, 20, 0.1)';
        ctx.fillRect(0, 0, w, h);
        const centerX = w / 2;
        const centerY = h / 2;

        if (!animationState.current.stars) {
             animationState.current.stars = Array.from({length: 1000}, () => ({
                 angle: Math.random() * Math.PI * 2,
                 radius: Math.random() * Math.min(w,h) * 0.5,
                 z: Math.random() * 1000,
                 speed: Math.random() * 2 + 1,
             }));
        }

        animationState.current.stars.forEach((star: any) => {
            star.z -= star.speed;
            if(star.z <= 0) {
                star.z = 1000;
            }
            
            const perspective = 256 / (256 + star.z);
            const x = centerX + Math.cos(star.angle + star.z*0.01) * star.radius * perspective;
            const y = centerY + Math.sin(star.angle + star.z*0.01) * star.radius * perspective;
            const size = (1 - star.z / 1000) * 3;

            ctx.beginPath();
            ctx.arc(x, y, Math.max(0.1, size), 0, Math.PI * 2);
            ctx.fillStyle = `hsla(${240 + star.z * 0.1}, 100%, ${80 - star.z/20}%, 0.9)`;
            ctx.fill();
        });
    };

    const animateWarp = (ctx: CanvasRenderingContext2D, w: number, h: number) => {
        ctx.fillStyle = isEmergency ? 'rgba(20,0,0,0.1)' : 'rgba(0,5,20,0.1)';
        ctx.fillRect(0, 0, w, h);

        const starColor = isEmergency ? 'rgba(255,100,100,0.8)' : 'rgba(200,220,255,0.8)';
        const starCount = 2000;
        const vel = 1.5;
        const focalLength = (w*w) / 1000;
        
        for(let i=0; i<starCount; i++){
            const z = ((Date.now() * vel) + i*100) % w;
            const x = (i * 137.5) % w - w/2; // Using golden angle for distribution
            const y = (i * 161.8) % h - h/2;

            const focal = focalLength / z;
            const newX = x * focal + w/2;
            const newY = y * focal + h/2;
            
            if (newX > 0 && newX < w && newY > 0 && newY < h) {
                ctx.fillStyle = starColor;
                ctx.beginPath();
                ctx.arc(newX, newY, focal, 0, Math.PI * 2);
                ctx.fill();
            }
        }
    };

    if(!isJumping) return null;

    return (
        <div className="fixed inset-0 z-[5000] bg-black">
            <canvas ref={canvasRef} className="w-full h-full" />
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                 <div
                    className={`font-orbitron text-3xl tracking-widest animate-pulse ${isEmergency ? 'text-red-400' : 'text-cyan-400'}`}
                    style={{ textShadow: '0 0 15px currentColor' }}
                 >
                    {isEmergency ? 'EMERGENCY JUMP' : method.toUpperCase()} IN PROGRESS
                 </div>
            </div>
        </div>
    );
};

export default TimeJumpVortex;