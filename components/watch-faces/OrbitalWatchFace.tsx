import React from 'react';
import { motion } from 'framer-motion';

interface WatchFaceProps {
    time: Date;
}

const OrbitalWatchFace: React.FC<WatchFaceProps> = ({ time }) => {
    const hours = time.getHours();
    const minutes = time.getMinutes();
    const seconds = time.getSeconds() + time.getMilliseconds() / 1000;

    const secondsRotation = (seconds / 60) * 360;
    const minutesRotation = (minutes / 60) * 360 + (seconds / 3600) * 360;
    const hoursRotation = (hours / 12) * 360 + (minutes / 720) * 360;

    const isPm = hours >= 12;
    const hoursStr = String(hours % 12 || 12).padStart(2, '0');
    const minutesStr = String(time.getMinutes()).padStart(2, '0');
    const secondsStr = String(time.getSeconds()).padStart(2, '0');

    return (
        <div className="relative w-full h-full rounded-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-slate-900 via-slate-950 to-black border-4 border-slate-700 shadow-[inset_0_0_35px_rgba(0,0,0,0.95)] flex items-center justify-center select-none overflow-hidden">
            {/* Ambient Starfield */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,#f8fafc_1px,transparent_1px)] bg-[size:24px_24px] opacity-20 pointer-events-none" />

            {/* Glowing Sun Core */}
            <motion.div
                className="w-10 h-10 bg-amber-400 rounded-full z-10 flex items-center justify-center border-2 border-amber-200"
                animate={{
                    scale: [1, 1.15, 1],
                    boxShadow: ["0 0 25px #f59e0b", "0 0 45px #fbbf24", "0 0 25px #f59e0b"]
                }}
                transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut"
                }}
            >
                <div className="w-4 h-4 rounded-full bg-white opacity-90 shadow-[0_0_10px_#fff]" />
            </motion.div>
            
            {/* Orbits */}
            <div className="absolute w-[80%] h-[80%] border border-cyan-500/30 rounded-full shadow-[0_0_15px_rgba(6,182,212,0.15)]" />
            <div className="absolute w-[60%] h-[60%] border border-sky-500/30 rounded-full shadow-[0_0_12px_rgba(14,165,233,0.15)]" />
            <div className="absolute w-[40%] h-[40%] border border-rose-500/30 rounded-full shadow-[0_0_10px_rgba(244,63,94,0.15)]" />

            {/* Hour Planet */}
            <motion.div
                className="absolute w-full h-full z-20 pointer-events-none"
                animate={{ rotate: hoursRotation }}
                transition={{ type: 'tween', ease: 'linear', duration: 1 }}
            >
                <motion.div 
                    className="absolute w-5 h-5 bg-amber-400 rounded-full top-[10%] left-1/2 -ml-2.5 border border-amber-200 shadow-[0_0_15px_#f59e0b]"
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                />
            </motion.div>

            {/* Minute Planet */}
            <motion.div
                className="absolute w-full h-full z-20 pointer-events-none"
                animate={{ rotate: minutesRotation }}
                transition={{ type: 'tween', ease: 'linear', duration: 1 }}
            >
                <motion.div 
                    className="absolute w-4 h-4 bg-cyan-400 rounded-full top-[20%] left-1/2 -ml-2 border border-cyan-200 shadow-[0_0_12px_#38bdf8]"
                    animate={{ scale: [1, 1.25, 1] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                />
            </motion.div>

            {/* Second Planet */}
            <motion.div
                className="absolute w-full h-full z-20 pointer-events-none"
                animate={{ rotate: secondsRotation }}
                transition={{ type: 'tween', ease: 'linear', duration: 1 }}
            >
                <div className="absolute w-3 h-3 bg-rose-500 rounded-full top-[30%] left-1/2 -ml-1.5 border border-rose-300 shadow-[0_0_10px_#f43f5e]" />
            </motion.div>

            {/* High Contrast Digital Readout Pill */}
            <div className="absolute bottom-5 px-3 py-0.5 rounded-full bg-slate-950/90 border border-cyan-500/60 shadow-[0_0_12px_rgba(6,182,212,0.4)] flex items-center gap-1.5 z-30">
                <span className="font-orbitron font-bold text-xs text-cyan-300 drop-shadow-[0_0_6px_#06b6d4]">
                    {hoursStr}:{minutesStr}:{secondsStr}
                </span>
                <span className="text-[9px] font-mono text-amber-400 font-bold">{isPm ? 'PM' : 'AM'}</span>
            </div>
        </div>
    );
};

export default OrbitalWatchFace;