import React, { useMemo } from 'react';

interface WatchFaceProps {
    time: Date;
}

const GRID = [
    "ITLISASTIME",
    "ACQUARTERDC",
    "TWENTYFIVEX",
    "HALFBTENSTO",
    "PASTERUNINE",
    "ONESIXTHREE",
    "FOURFIVETWO",
    "EIGHTELEVEN",
    "SEVENTWELVE",
    "TENSEOCLOCK",
];

const getActiveIndices = (time: Date) => {
    const h = time.getHours() % 12;
    const m = time.getMinutes();

    let indices = [ [0, 0], [0, 1], [0, 3], [0, 4] ]; // "IT IS"

    const round5 = Math.floor(m / 5);

    if (round5 === 0) indices.push(...[ [9, 5], [9, 6], [9, 7], [9, 8], [9, 9], [9, 10] ]); // O'CLOCK
    else if (round5 === 1) indices.push(...[ [2, 6], [2, 7], [2, 8], [2, 9] ]); // FIVE (minutes)
    else if (round5 === 2) indices.push(...[ [3, 5], [3, 6], [3, 7] ]); // TEN (minutes)
    else if (round5 === 3) indices.push(...[ [1, 2], [1, 3], [1, 4], [1, 5], [1, 6], [1, 7], [1, 8] ]); // A QUARTER
    else if (round5 === 4) indices.push(...[ [2, 0], [2, 1], [2, 2], [2, 3], [2, 4], [2, 5] ]); // TWENTY
    else if (round5 === 5) indices.push(...[ [2, 0], [2, 1], [2, 2], [2, 3], [2, 4], [2, 5], [2, 6], [2, 7], [2, 8], [2, 9] ]); // TWENTYFIVE
    else if (round5 === 6) indices.push(...[ [3, 0], [3, 1], [3, 2], [3, 3] ]); // HALF

    if (round5 > 0 && round5 <= 6) indices.push(...[ [4, 0], [4, 1], [4, 2], [4, 3] ]); // PAST
    
    if (round5 > 6) {
        indices.push(...[ [3, 8], [3, 9] ]); // TO
        if (round5 === 7) indices.push(...[ [2, 0], [2, 1], [2, 2], [2, 3], [2, 4], [2, 5], [2, 6], [2, 7], [2, 8], [2, 9] ]); // TWENTYFIVE
        else if (round5 === 8) indices.push(...[ [2, 0], [2, 1], [2, 2], [2, 3], [2, 4], [2, 5] ]); // TWENTY
        else if (round5 === 9) indices.push(...[ [1, 2], [1, 3], [1, 4], [1, 5], [1, 6], [1, 7], [1, 8] ]); // A QUARTER
        else if (round5 === 10) indices.push(...[ [3, 5], [3, 6], [3, 7] ]); // TEN (minutes)
        else if (round5 === 11) indices.push(...[ [2, 6], [2, 7], [2, 8], [2, 9] ]); // FIVE (minutes)
    }
    
    let hour = h;
    if (round5 > 6) hour = (h + 1) % 12;

    if (hour === 1 || hour === 13) indices.push(...[ [5, 0], [5, 1], [5, 2] ]); // ONE
    if (hour === 2) indices.push(...[ [6, 8], [6, 9], [6, 10] ]); // TWO
    if (hour === 3) indices.push(...[ [5, 6], [5, 7], [5, 8], [5, 9], [5, 10] ]); // THREE
    if (hour === 4) indices.push(...[ [6, 0], [6, 1], [6, 2], [6, 3] ]); // FOUR
    if (hour === 5) indices.push(...[ [6, 4], [6, 5], [6, 6], [6, 7] ]); // FIVE
    if (hour === 6) indices.push(...[ [5, 3], [5, 4], [5, 5] ]); // SIX
    if (hour === 7) indices.push(...[ [8, 0], [8, 1], [8, 2], [8, 3], [8, 4] ]); // SEVEN
    if (hour === 8) indices.push(...[ [7, 0], [7, 1], [7, 2], [7, 3], [7, 4] ]); // EIGHT
    if (hour === 9) indices.push(...[ [4, 7], [4, 8], [4, 9], [4, 10] ]); // NINE
    if (hour === 10) indices.push(...[ [9, 0], [9, 1], [9, 2] ]); // TEN
    if (hour === 11) indices.push(...[ [7, 5], [7, 6], [7, 7], [7, 8], [7, 9], [7, 10] ]); // ELEVEN
    if (hour === 0) indices.push(...[ [8, 5], [8, 6], [8, 7], [8, 8], [8, 9], [8, 10] ]); // TWELVE

    return indices;
}

const WordClockWatchFace: React.FC<WatchFaceProps> = ({ time }) => {
    const activeIndices = useMemo(() => new Set(getActiveIndices(time).map(([r, c]) => `${r}-${c}`)), [time]);

    let h = time.getHours();
    const isPm = h >= 12;
    h = h % 12 || 12;
    const hoursStr = String(h).padStart(2, '0');
    const minutesStr = String(time.getMinutes()).padStart(2, '0');
    const secondsStr = String(time.getSeconds()).padStart(2, '0');

    return (
        <div className="w-full h-full rounded-full bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-slate-900 via-slate-950 to-black flex flex-col items-center justify-center border-4 border-slate-700 p-3 relative overflow-hidden select-none">
            {/* Ambient Background Matrix Lines */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,#0284c7_0.5px,transparent_1px)] bg-[size:12px_12px] opacity-20 pointer-events-none" />

            {/* Word Matrix Grid */}
            <div className="flex flex-col gap-0.5 md:gap-1 z-10">
                {GRID.map((row, r) => (
                    <div key={r} className="flex justify-between gap-1 md:gap-1.5 font-mono">
                        {row.split('').map((char, c) => {
                            const isActive = activeIndices.has(`${r}-${c}`);
                            return (
                                <span
                                    key={c}
                                    className={`w-3 h-3 md:w-4 md:h-4 text-[10px] md:text-xs font-bold flex items-center justify-center transition-all duration-300 ${
                                        isActive
                                            ? 'text-cyan-300 drop-shadow-[0_0_8px_#22d3ee] scale-110'
                                            : 'text-slate-700/80'
                                    }`}
                                >
                                    {char}
                                </span>
                            );
                        })}
                    </div>
                ))}
            </div>

            {/* High Contrast Digital Readout Pill */}
            <div className="mt-2 px-3 py-0.5 rounded-full bg-slate-950/90 border border-amber-500/50 shadow-[0_0_12px_rgba(245,158,11,0.2)] flex items-center gap-1.5 z-10">
                <span className="font-orbitron font-bold text-xs text-amber-300 drop-shadow-[0_0_6px_#f59e0b]">
                    {hoursStr}:{minutesStr}:{secondsStr}
                </span>
                <span className="text-[9px] font-mono text-cyan-400 font-bold">{isPm ? 'PM' : 'AM'}</span>
            </div>
        </div>
    );
};

export default WordClockWatchFace;
