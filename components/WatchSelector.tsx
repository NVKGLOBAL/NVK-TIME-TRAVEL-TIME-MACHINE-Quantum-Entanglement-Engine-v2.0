import React, { useState, useEffect, useMemo } from 'react';
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

export const WatchSelector: React.FC<WatchSelectorProps> = ({ currentTime, onSelect, initialIndex }) => {
  const [[page, direction], setPage] = useState([initialIndex, 0]);
  const [filterCategory, setFilterCategory] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const wrap = (min: number, max: number, v: number) => {
    const rangeSize = max - min;
    if (rangeSize <= 0) return 0;
    return ((((v - min) % rangeSize) + rangeSize) % rangeSize) + min;
  };

  // Filter list based on selected category / query
  const filteredIndexes = useMemo(() => {
    return watchFaces
      .map((face, index) => ({ face, index }))
      .filter(({ face }) => {
        const name = face.name.toUpperCase();
        if (searchQuery.trim()) {
          return name.includes(searchQuery.toUpperCase());
        }

        if (filterCategory === '3D SPATIAL') return name.includes('3D');
        if (filterCategory === 'CLASSIC & DIGITAL') return name.includes('CHRONOMETER') || name.includes('DIGITAL') || name.includes('WORD') || name.includes('BINARY') || name.includes('ORBITAL');
        if (filterCategory === 'GENERATIVE') return !name.includes('3D') && !name.includes('EXPLORER');
        if (filterCategory === 'EXPLORER') return name.includes('EXPLORER');
        return true;
      })
      .map(({ index }) => index);
  }, [filterCategory, searchQuery]);

  // Current selected face index in master watchFaces array
  const activeMasterIndex = wrap(0, watchFaces.length, page);
  const currentFace = watchFaces[activeMasterIndex] || watchFaces[0];
  const { name: faceName, Component, props: faceProps } = currentFace;

  const paginate = (newDirection: number) => {
    if (filteredIndexes.length > 0) {
      const currentFilteredPos = filteredIndexes.indexOf(activeMasterIndex);
      if (currentFilteredPos !== -1) {
        const nextFilteredPos = (currentFilteredPos + newDirection + filteredIndexes.length) % filteredIndexes.length;
        const nextMasterIndex = filteredIndexes[nextFilteredPos];
        setPage([nextMasterIndex, newDirection]);
        return;
      }
    }
    setPage([page + newDirection, newDirection]);
  };

  const jumpToIndex = (targetIndex: number) => {
    const newDir = targetIndex >= activeMasterIndex ? 1 : -1;
    setPage([targetIndex, newDir]);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        paginate(-1);
      } else if (e.key === 'ArrowRight') {
        paginate(1);
      } else if (e.key === 'Enter') {
        onSelect(activeMasterIndex);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeMasterIndex, page, filteredIndexes]);

  return (
    <div className="w-screen h-screen flex flex-col items-center justify-between bg-black overflow-hidden relative select-none p-4">
      <DynamicTemporalBackground watchFaceName={faceName} />

      {/* Top HUD Header: Search & Category Filter */}
      <div className="z-30 w-full max-w-5xl flex flex-col items-center gap-2 mt-2">
        <div className="flex items-center justify-between w-full bg-slate-950/85 backdrop-blur-md border border-cyan-500/30 rounded-2xl px-4 py-2 shadow-[0_0_20px_rgba(6,182,212,0.15)] flex-wrap gap-2">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 text-cyan-400 font-orbitron text-xs md:text-sm font-bold">
              <i className="ri-compasses-2-line text-lg animate-pulse" />
              <span className="hidden sm:inline">MULTIDIMENSIONAL CHRONO MATRIX</span>
              <span className="sm:hidden">CHRONO MATRIX</span>
            </div>

            {/* Shop NVK Smartwatches Button */}
            <a
              id="shop-nvk-smartwatches-btn-header"
              href="https://www.nvk.global/collections/nvk-time"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-amber-500/20 via-orange-500/20 to-amber-500/20 hover:from-amber-500/30 hover:via-orange-500/30 hover:to-amber-500/30 border border-amber-400/60 hover:border-amber-300 text-amber-300 hover:text-amber-100 font-orbitron font-bold text-xs rounded-xl transition-all shadow-[0_0_15px_rgba(245,158,11,0.25)] hover:shadow-[0_0_20px_rgba(245,158,11,0.45)] whitespace-nowrap"
              title="Shop Official NVK Smartwatches & Timepieces"
            >
              <i className="ri-shopping-bag-3-line text-amber-400 text-sm" />
              <span>Shop NVK Smartwatches</span>
              <i className="ri-external-link-line text-xs opacity-75" />
            </a>
          </div>

          {/* Quick Dropdown Picker */}
          <div className="flex items-center gap-2">
            <select
              value={activeMasterIndex}
              onChange={(e) => jumpToIndex(parseInt(e.target.value, 10))}
              className="bg-slate-900 border border-slate-700 text-cyan-300 font-mono text-xs rounded-xl px-3 py-1.5 focus:border-cyan-400 outline-none max-w-[200px] md:max-w-[280px] truncate"
            >
              {watchFaces.map((face, idx) => (
                <option key={idx} value={idx}>
                  #{idx + 1}: {face.name}
                </option>
              ))}
            </select>

            <button
              onClick={() => onSelect(activeMasterIndex)}
              className="px-4 py-1.5 bg-cyan-500 hover:bg-cyan-400 text-black font-orbitron font-bold text-xs rounded-xl transition-all shadow-[0_0_15px_rgba(6,182,212,0.4)] whitespace-nowrap"
            >
              ENGAGE FACE
            </button>
          </div>
        </div>

        {/* Quick Category Quick-Select Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto max-w-full custom-scrollbar py-1">
          {['ALL', '3D SPATIAL', 'CLASSIC & DIGITAL', 'GENERATIVE', 'EXPLORER'].map((cat) => (
            <button
              key={cat}
              onClick={() => {
                setFilterCategory(cat);
                setSearchQuery('');
              }}
              className={`px-3 py-1 rounded-full text-[11px] font-mono transition-all border whitespace-nowrap ${
                filterCategory === cat && !searchQuery
                  ? 'bg-cyan-500 text-black font-bold border-cyan-300 shadow-[0_0_10px_rgba(6,182,212,0.4)]'
                  : 'bg-slate-900/80 border-slate-800 text-slate-400 hover:text-white hover:border-slate-600'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Navigation Left / Right Arrows */}
      <button
        onClick={() => paginate(-1)}
        className="absolute left-3 md:left-12 top-1/2 -translate-y-1/2 z-20 text-white/40 hover:text-cyan-400 text-5xl md:text-6xl transition-colors rounded-full hover:bg-white/10 p-2"
        aria-label="Previous watch face"
      >
        <i className="ri-arrow-left-s-line" />
      </button>

      <button
        onClick={() => paginate(1)}
        className="absolute right-3 md:right-12 top-1/2 -translate-y-1/2 z-20 text-white/40 hover:text-cyan-400 text-5xl md:text-6xl transition-colors rounded-full hover:bg-white/10 p-2"
        aria-label="Next watch face"
      >
        <i className="ri-arrow-right-s-line" />
      </button>

      {/* Center Watch Face Display Frame */}
      <div className="relative w-full flex-1 flex items-center justify-center my-4">
        <AnimatePresence initial={false} custom={direction}>
          <motion.div
            key={page}
            className="absolute w-[320px] h-[320px] md:w-[420px] md:h-[420px] flex items-center justify-center cursor-grab active:cursor-grabbing"
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: 'spring', stiffness: 300, damping: 30 },
              opacity: { duration: 0.2 },
            }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={1}
            onDragEnd={(e, { offset, velocity }) => {
              const swipe = swipePower(offset.x, velocity.x);
              const dragDistance = offset.x;
              const dragThreshold = 100;

              if (swipe < -swipeConfidenceThreshold || dragDistance < -dragThreshold) {
                paginate(1);
              } else if (swipe > swipeConfidenceThreshold || dragDistance > dragThreshold) {
                paginate(-1);
              }
            }}
            onDoubleClick={() => onSelect(activeMasterIndex)}
          >
            {/* Multidimensional Watch Frame */}
            <div className="relative w-full h-full rounded-full p-[10px] bg-gradient-to-b from-slate-700 via-slate-900 to-slate-950 shadow-[0_0_60px_rgba(6,182,212,0.3)] border-4 border-slate-600/80 flex items-center justify-center group overflow-hidden">
              {/* Bezel Ring Ticks */}
              <div className="absolute inset-0 rounded-full border-[6px] border-slate-800/90 pointer-events-none z-10 flex items-center justify-center">
                {Array.from({ length: 12 }).map((_, i) => (
                  <div
                    key={i}
                    className="absolute w-1 h-3 bg-cyan-400/60 rounded-full origin-bottom"
                    style={{
                      transform: `rotate(${i * 30}deg) translateY(-185px)`,
                    }}
                  />
                ))}
              </div>

              {/* Curved Glass Reflection */}
              <div className="pointer-events-none absolute inset-0 rounded-full bg-gradient-to-tr from-transparent via-white/10 to-transparent z-20" />

              {/* Inner Depth Shadow & Watch Face Component Container */}
              <div className="relative w-full h-full rounded-full overflow-hidden bg-black shadow-[inset_0_0_35px_rgba(0,0,0,0.95)] flex items-center justify-center">
                <WatchFaceErrorBoundary faceName={faceName}>
                  <Component time={currentTime} {...faceProps} />
                </WatchFaceErrorBoundary>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Bottom HUD Details */}
      <div className="z-30 text-center pointer-events-none mb-4 bg-slate-950/70 backdrop-blur-md px-6 py-2 rounded-2xl border border-slate-800">
        <p className="font-orbitron text-cyan-300 text-base md:text-lg font-bold tracking-wider">{faceName}</p>
        <div className="flex items-center justify-center gap-3 text-slate-400 font-mono text-xs mt-0.5">
          <span>
            FACE #{activeMasterIndex + 1} / {watchFaces.length}
          </span>
          <span className="text-cyan-500">•</span>
          <span className="text-emerald-400 font-bold">
            {filteredIndexes.length} MATCHES IN FILTER
          </span>
        </div>
        <p className="text-slate-500 font-sans text-[11px] mt-1 animate-pulse">
          Double-click watch face or press Enter to Lock & Launch
        </p>
      </div>
    </div>
  );
};

export default WatchSelector;
