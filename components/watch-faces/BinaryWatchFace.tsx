import React from 'react';

interface WatchFaceProps {
    time: Date;
}

const toBinary = (num: number, length: number) => {
    return num.toString(2).padStart(length, '0');
};

const BinaryRow: React.FC<{ value: string; label: string; colorClass: string }> = ({ value, label, colorClass }) => (
    <div className="flex items-center justify-between gap-2">
        <span className="text-cyan-400 font-orbitron font-bold text-xs w-4">{label}</span>
        <div className="flex items-center gap-1.5 md:gap-2">
            {value.split('').map((bit, i) => (
                <div
                    key={i}
                    className={`w-3.5 h-3.5 md:w-4 md:h-4 rounded-full border border-slate-700 transition-all duration-300 flex items-center justify-center ${
                        bit === '1'
                            ? `${colorClass} scale-110 shadow-[0_0_10px_currentColor]`
                            : 'bg-slate-900/90 opacity-40'
                    }`}
                >
                    {bit === '1' && <div className="w-1 h-1 rounded-full bg-white opacity-80" />}
                </div>
            ))}
        </div>
    </div>
);

const BinaryWatchFace: React.FC<WatchFaceProps> = ({ time }) => {
    let h = time.getHours();
    const isPm = h >= 12;
    h = h % 12 || 12;
    const hours = toBinary(h, 6);
    const minutes = toBinary(time.getMinutes(), 6);
    const seconds = toBinary(time.getSeconds(), 6);

    const hoursStr = String(h).padStart(2, '0');
    const minutesStr = String(time.getMinutes()).padStart(2, '0');
    const secondsStr = String(time.getSeconds()).padStart(2, '0');

    return (
        <div className="w-full h-full rounded-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-slate-900 via-slate-950 to-black flex flex-col items-center justify-center border-4 border-slate-700 shadow-[inset_0_0_30px_rgba(0,0,0,0.9)] p-4 relative overflow-hidden select-none">
            {/* Ambient Matrix Code Lines */}
            <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(16,185,129,0.05)_1px,transparent_1px)] bg-[size:100%_8px] pointer-events-none" />

            {/* Bit Position Headers */}
            <div className="flex items-center gap-1.5 md:gap-2 ml-6 mb-2 text-[8px] font-mono text-slate-500">
                {['32', '16', '8', '4', '2', '1'].map((val) => (
                    <span key={val} className="w-3.5 md:w-4 text-center">
                        {val}
                    </span>
                ))}
            </div>

            {/* Rows */}
            <div className="font-mono space-y-2.5 z-10">
                <BinaryRow value={hours} label="H" colorClass="bg-amber-400 text-amber-400 border-amber-300" />
                <BinaryRow value={minutes} label="M" colorClass="bg-cyan-400 text-cyan-400 border-cyan-300" />
                <BinaryRow value={seconds} label="S" colorClass="bg-emerald-400 text-emerald-400 border-emerald-300" />
            </div>

            {/* Digital Readout Pill */}
            <div className="mt-3 px-3 py-0.5 rounded-full bg-slate-950 border border-cyan-500/50 shadow-[0_0_10px_rgba(6,182,212,0.3)] flex items-center gap-1 z-10">
                <span className="font-orbitron font-bold text-xs text-cyan-300 drop-shadow-[0_0_6px_#06b6d4]">
                    {hoursStr}:{minutesStr}:{secondsStr}
                </span>
                <span className="text-[9px] font-mono text-amber-400 font-bold">{isPm ? 'PM' : 'AM'}</span>
            </div>
        </div>
    );
};

export default BinaryWatchFace;