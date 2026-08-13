import React from 'react';
import { motion } from 'framer-motion';

interface WatchFaceProps {
    time: Date;
}

const AnalogWatchFace: React.FC<WatchFaceProps> = ({ time }) => {
    const hours = time.getHours();
    const minutes = time.getMinutes();
    const seconds = time.getSeconds();
    const milliseconds = time.getMilliseconds();

    const smoothSeconds = seconds + milliseconds / 1000;
    const secondsRotation = (smoothSeconds / 60) * 360;
    const minutesRotation = (minutes / 60) * 360 + (smoothSeconds / 60) * 6;
    const hoursRotation = ((hours % 12) / 12) * 360 + (minutes / 60) * 30;

    const dateNum = time.getDate();
    const dayStr = time.toLocaleDateString('en-US', { weekday: 'short' }).toUpperCase();

    return (
        <div className="relative w-full h-full rounded-full bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-slate-900 via-slate-950 to-black border-4 border-slate-700 shadow-[inset_0_0_30px_rgba(0,0,0,0.9)] overflow-hidden flex items-center justify-center select-none">
            {/* Outer Tachymeter Dial Scale */}
            <div className="absolute inset-2 rounded-full border border-slate-800/80 pointer-events-none flex items-center justify-center">
                {Array.from({ length: 60 }).map((_, i) => {
                    const isHour = i % 5 === 0;
                    return (
                        <div
                            key={i}
                            className="absolute w-full h-full"
                            style={{ transform: `rotate(${i * 6}deg)` }}
                        >
                            <div
                                className={`absolute top-1 left-1/2 -ml-0.5 rounded-sm ${
                                    isHour
                                        ? 'w-1 h-3 bg-cyan-400 shadow-[0_0_6px_#22d3ee]'
                                        : 'w-[1px] h-1.5 bg-slate-600'
                                }`}
                            />
                        </div>
                    );
                })}
            </div>

            {/* High Contrast 3D Cardinal Hour Numerals */}
            {[
                { num: '12', pos: 'top-3 left-1/2 -translate-x-1/2' },
                { num: '3', pos: 'right-3 top-1/2 -translate-y-1/2' },
                { num: '6', pos: 'bottom-3 left-1/2 -translate-x-1/2' },
                { num: '9', pos: 'left-3 top-1/2 -translate-y-1/2' },
            ].map(({ num, pos }) => (
                <span
                    key={num}
                    className={`absolute ${pos} font-orbitron font-bold text-base md:text-lg text-amber-300 drop-shadow-[0_0_8px_rgba(252,211,77,0.6)] z-10`}
                >
                    {num}
                </span>
            ))}

            {/* Sub-Dials */}
            {/* Top Sub-Dial: 24h Cycle */}
            <div className="absolute top-[22%] w-16 h-16 md:w-20 md:h-20 rounded-full border border-slate-700/80 bg-slate-900/80 shadow-inner flex flex-col items-center justify-center z-0">
                <span className="text-[8px] font-orbitron text-cyan-400/80 tracking-wider">24H</span>
                <span className="text-[10px] font-mono text-amber-300 font-bold">
                    {String(hours).padStart(2, '0')}
                </span>
            </div>

            {/* Bottom Sub-Dial: Seconds Meter */}
            <div className="absolute bottom-[22%] w-16 h-16 md:w-20 md:h-20 rounded-full border border-slate-700/80 bg-slate-900/80 shadow-inner flex flex-col items-center justify-center z-0">
                <span className="text-[8px] font-orbitron text-cyan-400/80 tracking-wider">SEC</span>
                <span className="text-[10px] font-mono text-cyan-300 font-bold">
                    {String(seconds).padStart(2, '0')}
                </span>
            </div>

            {/* Date Window at 3 o'clock */}
            <div className="absolute right-[18%] top-1/2 -translate-y-1/2 bg-slate-900 border border-amber-500/50 rounded px-1.5 py-0.5 shadow-md flex items-center gap-1 z-10">
                <span className="text-[9px] font-mono font-bold text-amber-400">{dayStr}</span>
                <span className="text-xs font-mono font-bold text-white bg-slate-950 px-1 rounded">{dateNum}</span>
            </div>

            {/* Hour Hand */}
            <motion.div
                className="absolute w-2 h-[28%] bg-gradient-to-t from-slate-300 via-amber-200 to-amber-400 bottom-1/2 left-1/2 -ml-1 rounded-t-sm shadow-[0_4px_10px_rgba(0,0,0,0.9)] z-20"
                style={{ originY: '100%' }}
                animate={{ rotate: hoursRotation }}
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            >
                <div className="w-1 h-[60%] bg-emerald-300 mx-auto mt-1 rounded-sm shadow-[0_0_6px_#6ee7b7]" />
            </motion.div>

            {/* Minute Hand */}
            <motion.div
                className="absolute w-1.5 h-[38%] bg-gradient-to-t from-slate-300 via-cyan-200 to-cyan-400 bottom-1/2 left-1/2 -ml-[3px] rounded-t-sm shadow-[0_4px_12px_rgba(0,0,0,0.9)] z-25"
                style={{ originY: '100%' }}
                animate={{ rotate: minutesRotation }}
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            >
                <div className="w-0.5 h-[70%] bg-cyan-300 mx-auto mt-1 rounded-sm shadow-[0_0_8px_#67e8f9]" />
            </motion.div>

            {/* Second Hand */}
            <motion.div
                className="absolute w-0.5 h-[44%] bg-rose-500 bottom-1/2 left-1/2 -ml-[1px] rounded-t-full shadow-[0_0_8px_#f43f5e] z-30"
                style={{ originY: '100%' }}
                animate={{ rotate: secondsRotation }}
                transition={{ type: 'tween', ease: 'linear', duration: 0.1 }}
            >
                <div className="w-2 h-2 rounded-full bg-rose-500 -ml-0.75 -mt-1 shadow-[0_0_10px_#f43f5e]" />
            </motion.div>

            {/* Center Pin Cap */}
            <div className="absolute w-3.5 h-3.5 rounded-full bg-gradient-to-br from-amber-300 to-amber-600 border-2 border-slate-950 shadow-md z-40 flex items-center justify-center">
                <div className="w-1 h-1 rounded-full bg-rose-500" />
            </div>
        </div>
    );
};

export default AnalogWatchFace;