import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface WatchFaceProps {
    time: Date;
}

const Digit: React.FC<{ value: string }> = ({ value }) => (
  <div className="relative w-[0.65em] h-[1em] overflow-hidden flex items-center justify-center">
    <AnimatePresence initial={false}>
        <motion.span
            key={value}
            initial={{ y: '100%', opacity: 0 }}
            animate={{ y: '0%', opacity: 1 }}
            exit={{ y: '-100%', opacity: 0 }}
            transition={{ type: 'spring', stiffness: 350, damping: 25 }}
            className="absolute inset-0 flex items-center justify-center"
        >
            {value}
        </motion.span>
    </AnimatePresence>
  </div>
);

const DigitalWatchFace: React.FC<WatchFaceProps> = ({ time }) => {
    let h = time.getHours();
    const isPm = h >= 12;
    h = h % 12;
    h = h ? h : 12;
    const hours = String(h).padStart(2, '0');
    const minutes = String(time.getMinutes()).padStart(2, '0');
    const seconds = String(time.getSeconds()).padStart(2, '0');

    const dateStr = time.toLocaleDateString('en-US', { month: 'short', day: '2-digit', weekday: 'short' }).toUpperCase();
    const secondsPercent = (time.getSeconds() / 60) * 100;

    return (
        <div className="relative w-full h-full rounded-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-slate-900 via-black to-slate-950 border-4 border-cyan-500/50 shadow-[0_0_30px_rgba(6,182,212,0.3)] flex flex-col items-center justify-center p-4 overflow-hidden select-none">
            {/* Ambient Cyber Grid Overlay */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#082f49_1px,transparent_1px),linear-gradient(to_bottom,#082f49_1px,transparent_1px)] bg-[size:16px_16px] opacity-25 pointer-events-none" />

            {/* Seconds Ring Arc */}
            <svg className="absolute inset-3 w-[calc(100%-24px)] h-[calc(100%-24px)] pointer-events-none transform -rotate-90">
                <circle
                    cx="50%"
                    cy="50%"
                    r="45%"
                    className="stroke-slate-800"
                    strokeWidth="3"
                    fill="none"
                />
                <circle
                    cx="50%"
                    cy="50%"
                    r="45%"
                    className="stroke-cyan-400 drop-shadow-[0_0_8px_#22d3ee]"
                    strokeWidth="4"
                    strokeDasharray="283"
                    strokeDashoffset={283 - (283 * secondsPercent) / 100}
                    strokeLinecap="round"
                    fill="none"
                />
            </svg>

            {/* Top Date & Status Bar */}
            <div className="flex items-center gap-2 mb-2 z-10">
                <span className="px-2 py-0.5 rounded bg-cyan-950 border border-cyan-500/40 text-[10px] md:text-xs font-mono font-bold text-cyan-300 shadow-[0_0_8px_rgba(6,182,212,0.3)]">
                    {dateStr}
                </span>
                <span className="px-1.5 py-0.5 rounded bg-amber-950 border border-amber-500/40 text-[10px] font-orbitron font-bold text-amber-400">
                    {isPm ? 'PM' : 'AM'}
                </span>
            </div>

            {/* Main Digital Clock Readout */}
            <div className="font-orbitron font-black text-3xl md:text-5xl text-cyan-300 flex items-center justify-center z-10" style={{ textShadow: '0 0 12px #06b6d4, 0 0 25px #06b6d4, 0 0 35px #0891b2' }}>
                <Digit value={hours[0]} />
                <Digit value={hours[1]} />
                <span className="animate-pulse mx-0.5 text-amber-400">:</span>
                <Digit value={minutes[0]} />
                <Digit value={minutes[1]} />
            </div>

            {/* Bottom Seconds Meter & Milliseconds */}
            <div className="flex items-center gap-2 mt-2 z-10">
                <div className="flex items-center bg-slate-900 border border-slate-700 rounded px-2 py-0.5 text-xs font-mono">
                    <span className="text-slate-400 text-[9px] mr-1">SEC</span>
                    <span className="text-rose-400 font-bold text-sm tracking-wider drop-shadow-[0_0_6px_#f43f5e]">{seconds}</span>
                </div>
            </div>
        </div>
    );
};

export default DigitalWatchFace;