
import React, { useState, useEffect, useRef } from 'react';
import type { TARDISVortexModalProps } from '../../types';

type AnimationPhase = 'dematerializing' | 'vortex' | 'landing' | 'arrived' | 'closed';

interface Star {
  x: number;
  y: number;
  z: number;
}

const cityCoordinates: { [key: string]: { x: number; y: number } } = {
  'london': { x: 51.5074, y: -0.1278 },
  // Add more cities as needed
};

const mapToCanvasCoords = (lat: number, lon: number, width: number, height: number) => {
    const x = (lon + 180) * (width / 360);
    const y = (90 - lat) * (height / 180);
    return { x, y };
};


const TARDISVortexModal: React.FC<TARDISVortexModalProps> = ({ isOpen, onClose, targetCoordinate }) => {
  const [phase, setPhase] = useState<AnimationPhase>('closed');
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameId = useRef<number | undefined>(undefined);
  const starsRef = useRef<Star[]>([]);
  const targetDateRef = useRef<Date | null>(null);
  const [displayDate, setDisplayDate] = useState<Date>(new Date());

  const { planet, city, date } = React.useMemo(() => {
    const parts = targetCoordinate.split(':');
    return {
      planet: parts[0] || 'Unknown',
      city: parts[1] || 'Unknown',
      date: parts[2] || new Date().toISOString().split('T')[0],
    };
  }, [targetCoordinate]);

  useEffect(() => {
    if (isOpen) {
      setPhase('dematerializing');
      targetDateRef.current = new Date(date);
      setDisplayDate(new Date());

      const timer = setTimeout(() => setPhase('vortex'), 1500); // Dematerialization duration
      return () => clearTimeout(timer);
    } else {
      setPhase('closed');
    }
  }, [isOpen, date]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (phase === 'vortex' && canvas) {
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      const numStars = 800;
      starsRef.current = Array.from({ length: numStars }, () => ({
        x: Math.random() * 2 - 1,
        y: Math.random() * 2 - 1,
        z: Math.random(),
      }));

      const animateVortex = () => {
        if (!canvasRef.current) return;
        ctx.fillStyle = 'rgba(0, 5, 20, 0.4)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;

        starsRef.current.forEach(star => {
          star.z -= 0.015;
          if (star.z <= 0) {
            star.x = Math.random() * 2 - 1;
            star.y = Math.random() * 2 - 1;
            star.z = 1;
          }

          const k = 128 / star.z;
          const px = star.x * k + centerX;
          const py = star.y * k + centerY;

          if (px > 0 && px < canvas.width && py > 0 && py < canvas.height) {
            const size = (1 - star.z) * 5;
            const shade = (1 - star.z) * 255;
            ctx.fillStyle = `rgb(${shade * 0.7}, ${shade * 0.8}, ${shade})`;
            ctx.beginPath();
            ctx.arc(px, py, size / 2, 0, Math.PI * 2);
            ctx.fill();
          }
        });
        animationFrameId.current = requestAnimationFrame(animateVortex);
      };
      animateVortex();

      const landingTimer = setTimeout(() => setPhase('landing'), 7000); // Vortex duration

      return () => {
        clearTimeout(landingTimer);
        if (animationFrameId.current) cancelAnimationFrame(animationFrameId.current);
      };
    }
  }, [phase]);
  
  // Clock animation
  useEffect(() => {
    if (phase === 'vortex' && targetDateRef.current) {
        const intervalId = setInterval(() => {
            setDisplayDate(current => {
                const diff = targetDateRef.current!.getTime() - current.getTime();
                const step = diff / 10; // Approach target date
                const newTime = current.getTime() + step;
                return new Date(newTime);
            });
        }, 100);
        return () => clearInterval(intervalId);
    } else if (phase === 'landing' && targetDateRef.current) {
        setDisplayDate(targetDateRef.current);
    }
  }, [phase]);


  useEffect(() => {
    if (phase === 'landing') {
      const arrivedTimer = setTimeout(() => setPhase('arrived'), 2000); // Landing duration
      return () => clearTimeout(arrivedTimer);
    }
    if (phase === 'arrived') {
      const closeTimer = setTimeout(onClose, 3000); // Arrived message duration
      return () => clearTimeout(closeTimer);
    }
  }, [phase, onClose]);

  if (!isOpen) return null;

  const targetCoords = cityCoordinates[city.toLowerCase()];

  return (
    <div className="fixed inset-0 z-[3000] bg-black text-slate-100 flex items-center justify-center overflow-hidden">
      <AnimatePresence>
        {phase === 'dematerializing' && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 1.5 }}
            transition={{ duration: 1.5 }}
            className="w-full h-full bg-slate-900"
          />
        )}
        {(phase === 'vortex' || phase === 'landing' || phase === 'arrived') && (
          <div className="absolute inset-0">
            <canvas ref={canvasRef} className={`w-full h-full transition-opacity duration-1000 ${phase === 'landing' ? 'opacity-0' : 'opacity-100'}`} />
            <div className={`absolute inset-0 bg-white transition-opacity duration-500 ${phase === 'landing' ? 'opacity-100' : 'opacity-0'}`} />
          </div>
        )}
        
        {(phase === 'vortex') && (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-8 pointer-events-none animate-fade-in-up">
                 <h2 className="text-4xl font-cinzel text-sky-300 drop-shadow-lg">JOURNEYING THROUGH THE TIME VORTEX</h2>
                 <div className="mt-8 font-mono text-2xl bg-black/50 p-4 rounded-lg border border-sky-500/50">
                    <div>{displayDate.toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}</div>
                    <div className="text-lg">{displayDate.toLocaleTimeString()}</div>
                 </div>
            </div>
        )}
        
        {(phase === 'arrived') && (
             <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-8 pointer-events-none bg-slate-900 animate-fade-in-up">
                <h2 className="text-5xl font-cinzel text-sky-200">ARRIVAL</h2>
                <p className="mt-4 text-2xl font-cormorant">{planet}: {city}</p>
                <p className="mt-2 text-xl font-mono text-sky-400">{displayDate.toDateString()}</p>
             </div>
        )}

      </AnimatePresence>
    </div>
  );
};

// Lazy-load framer-motion or define a simple animation fallback
const motion = {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>
};
const AnimatePresence: React.FC<{children: React.ReactNode}> = ({ children }) => <>{children}</>;


export default TARDISVortexModal;
