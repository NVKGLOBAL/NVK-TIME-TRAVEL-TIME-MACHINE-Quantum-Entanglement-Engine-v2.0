import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { watchFaces } from './watch-faces/watchFaceRegistry';
import DynamicTemporalBackground from './visuals/DynamicTemporalBackground';
import WatchFaceErrorBoundary from './watch-faces/WatchFaceErrorBoundary';

const swipeConfidenceThreshold = 10000;
const swipePower = (offset: number, velocity: number) => {
  return Math.abs(offset) * velocity;
};

const variants = {
  enter: (direction: number) => {
    return {
      x: direction > 0 ? '100%' : '-100%',
      opacity: 0,
      scale: 0.8,
    };
  },
  center: {
    zIndex: 1,
    x: 0,
    opacity: 1,
    scale: 1,
  },
  exit: (direction: number) => {
    return {
      zIndex: 0,
      x: direction < 0 ? '100%' : '-100%',
      opacity: 0,
      scale: 0.8,
    };
  },
};

interface WatchSelectorProps {
    currentTime: Date;
    onSelect: (index: number) => void;
    initialIndex: number;
}

const WatchSelector: React.FC<WatchSelectorProps> = ({ currentTime, onSelect, initialIndex }) => {
    const [[page, direction], setPage] = useState([initialIndex, 0]);

    const wrap = (min: number, max: number, v: number) => {
        const rangeSize = max - min;
        return ((((v - min) % rangeSize) + rangeSize) % rangeSize) + min;
    }
    
    const faceIndex = wrap(0, watchFaces.length, page);
    const currentFace = watchFaces[faceIndex] || watchFaces[0];
    const { name: faceName, Component, props: faceProps } = currentFace;

    const paginate = (newDirection: number) => {
        setPage([page + newDirection, newDirection]);
    };

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'ArrowLeft') {
                paginate(-1);
            } else if (e.key === 'ArrowRight') {
                paginate(1);
            } else if (e.key === 'Enter') {
                onSelect(faceIndex);
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [faceIndex, page]);

    return (
        <div className="w-screen h-screen flex flex-col items-center justify-center bg-black overflow-hidden relative select-none">
            <DynamicTemporalBackground watchFaceName={faceName} />
             {/* Navigation Buttons */}
            <button 
                onClick={() => paginate(-1)}
                className="absolute left-4 md:left-24 top-1/2 -translate-y-1/2 z-20 text-white/40 hover:text-white/90 text-6xl transition-colors rounded-full hover:bg-white/10 p-2"
                aria-label="Previous watch face"
            >
                <i className="ri-arrow-left-s-line"></i>
            </button>
            <button 
                onClick={() => paginate(1)}
                className="absolute right-4 md:right-24 top-1/2 -translate-y-1/2 z-20 text-white/40 hover:text-white/90 text-6xl transition-colors rounded-full hover:bg-white/10 p-2"
                aria-label="Next watch face"
            >
                <i className="ri-arrow-right-s-line"></i>
            </button>

            <AnimatePresence initial={false} custom={direction}>
                <motion.div
                    key={page}
                    className="absolute w-[350px] h-[350px] md:w-[400px] md:h-[400px] flex items-center justify-center cursor-grab active:cursor-grabbing"
                    custom={direction}
                    variants={variants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{
                        x: { type: "spring", stiffness: 300, damping: 30 },
                        opacity: { duration: 0.2 },
                    }}
                    drag="x"
                    dragConstraints={{ left: 0, right: 0 }}
                    dragElastic={1}
                    onDragEnd={(e, { offset, velocity }) => {
                        const swipe = swipePower(offset.x, velocity.x);
                        const dragDistance = offset.x;
                        const dragThreshold = 100; // A drag of 100px is enough for a slow drag

                        if (swipe < -swipeConfidenceThreshold || dragDistance < -dragThreshold) {
                            paginate(1);
                        } else if (swipe > swipeConfidenceThreshold || dragDistance > dragThreshold) {
                            paginate(-1);
                        }
                    }}
                    onDoubleClick={() => onSelect(faceIndex)}
                >
                    {/* This is the 3D Multidimensional Watch Frame */}
                    <div className="relative w-full h-full rounded-full p-[10px] bg-gradient-to-b from-slate-700 via-slate-900 to-slate-950 shadow-[0_0_60px_rgba(6,182,212,0.25)] border-4 border-slate-600/80 flex items-center justify-center group overflow-hidden">
                       {/* Bezel Ring Ticks & Markers */}
                       <div className="absolute inset-0 rounded-full border-[6px] border-slate-800/90 pointer-events-none z-10 flex items-center justify-center">
                          {Array.from({ length: 12 }).map((_, i) => (
                              <div
                                  key={i}
                                  className="absolute w-1 h-3 bg-cyan-400/60 rounded-full origin-bottom"
                                  style={{
                                      transform: `rotate(${i * 30}deg) translateY(-175px)`,
                                  }}
                              />
                          ))}
                       </div>
                       
                       {/* Curved Specular Glass Reflection */}
                       <div className="pointer-events-none absolute inset-0 rounded-full bg-gradient-to-tr from-transparent via-white/10 to-transparent z-20" />
                       
                       {/* Inner Depth Shadow & Watch Face Container */}
                       <div className="relative w-full h-full rounded-full overflow-hidden bg-black shadow-[inset_0_0_35px_rgba(0,0,0,0.95)] flex items-center justify-center">
                           <WatchFaceErrorBoundary faceName={faceName}>
                               <Component time={currentTime} {...faceProps} />
                           </WatchFaceErrorBoundary>
                       </div>
                    </div>
                </motion.div>
            </AnimatePresence>
            
            {/* HUD */}
            <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10 text-center pointer-events-none">
                <p className="font-orbitron text-white text-lg">{faceName}</p>
                <p className="text-gray-400 font-mono text-sm">{faceIndex + 1} / {watchFaces.length}</p>
                 <p className="text-gray-500 font-sans text-xs mt-4 animate-pulse">Double tap face to open Time Machine</p>
            </div>
        </div>
    );
};

export default WatchSelector;