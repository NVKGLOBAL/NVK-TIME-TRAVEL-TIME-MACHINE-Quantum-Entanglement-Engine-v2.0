import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const useTime = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const intervalId = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => clearInterval(intervalId);
  }, []);

  return time;
};

const QuantumClock = () => {
  const time = useTime();
  const hours = time.getHours();
  const minutes = time.getMinutes();
  const seconds = time.getSeconds();

  // Correctly handle the second hand tick with no spring for instant movement
  const secondsRotation = (seconds / 60) * 360;
  const minutesRotation = (minutes / 60) * 360 + (seconds / 60) * 6;
  const hoursRotation = (hours / 12) * 360 + (minutes / 60) * 30;


  const handTransition = {
    type: "spring",
    stiffness: 300,
    damping: 30,
  };
  
  const secondHandTransition = {
    type: "tween",
    ease: "linear",
    duration: 0.1, // Faster than 1s to ensure it 'ticks' rather than sweeps smoothly over a second if re-renders align badly.
  };

  return (
    <div className="relative w-24 h-24 flex items-center justify-center">
      <motion.svg
        width="96"
        height="96"
        viewBox="0 0 100 100"
        className="absolute"
      >
        {/* Static Rings */}
        <circle cx="50" cy="50" r="48" stroke="#38bdf8" strokeWidth="1" fill="none" opacity="0.3" />
        <circle cx="50" cy="50" r="40" stroke="#38bdf8" strokeWidth="0.5" fill="none" opacity="0.2" />
        
        {/* Ticks */}
        {Array.from({ length: 12 }).map((_, i) => (
          <line
            key={`hour-tick-${i}`}
            x1="50"
            y1="8"
            x2="50"
            y2="12"
            stroke="#38bdf8"
            strokeWidth="1"
            opacity="0.5"
            transform={`rotate(${i * 30} 50 50)`}
          />
        ))}
        {Array.from({ length: 60 }).map((_, i) => (
            i % 5 !== 0 && <line
              key={`minute-tick-${i}`}
              x1="50"
              y1="6"
              x2="50"
              y2="8"
              stroke="#38bdf8"
              strokeWidth="0.5"
              opacity="0.3"
              transform={`rotate(${i * 6} 50 50)`}
            />
          ))}


        {/* Hands */}
        <motion.line
          x1="50" y1="50" x2="50" y2="28"
          stroke="#f0f9ff" strokeWidth="2" strokeLinecap="round"
          initial={false}
          animate={{ rotate: hoursRotation }}
          transition={handTransition}
          style={{ originX: '50px', originY: '50px' }}
        />
        <motion.line
          x1="50" y1="50" x2="50" y2="18"
          stroke="#7dd3fc" strokeWidth="1.5" strokeLinecap="round"
          initial={false}
          animate={{ rotate: minutesRotation }}
          transition={handTransition}
          style={{ originX: '50px', originY: '50px' }}
        />
        <motion.line
          x1="50" y1="50" x2="50" y2="12"
          stroke="#f87171" strokeWidth="1" strokeLinecap="round"
          initial={false}
          animate={{ rotate: secondsRotation }}
          transition={secondHandTransition}
          style={{ originX: '50px', originY: '50px' }}
        />
         <circle cx="50" cy="50" r="2.5" fill="#f87171" stroke="#fff" strokeWidth="0.5" />
      </motion.svg>
      <div className="absolute top-[calc(50%-8px)] font-mono text-xs text-cyan-300 bg-black/50 px-1 rounded border border-cyan-500/30">
        {time.toLocaleTimeString('en-US', {hour: '2-digit', minute:'2-digit'})}
      </div>
    </div>
  );
};

export default QuantumClock;