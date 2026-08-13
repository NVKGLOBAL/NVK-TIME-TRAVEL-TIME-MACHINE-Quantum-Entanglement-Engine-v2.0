import React, { useMemo } from 'react';
import { motion } from 'framer-motion';

interface LongTermTemporalVisualizerProps {
    currentTime: Date;
    targetDateTime: Date | null;
    onSetTarget: (years: number) => void;
}

const LongTermTemporalVisualizer: React.FC<LongTermTemporalVisualizerProps> = ({ currentTime, targetDateTime, onSetTarget }) => {
    const timeStats = useMemo(() => {
        if (!targetDateTime) return null;
        const diff = targetDateTime.getTime() - currentTime.getTime();
        const absDiff = Math.abs(diff);
        
        const totalSeconds = absDiff / 1000;
        const totalMinutes = totalSeconds / 60;
        const totalHours = totalMinutes / 60;
        const totalDays = totalHours / 24;
        const totalWeeks = totalDays / 7;
        const totalMonths = totalDays / 30.44;
        const totalYears = totalDays / 365.25;

        return {
            years: Math.floor(totalYears),
            months: Math.floor(totalMonths % 12),
            weeks: Math.floor(totalWeeks % 4.34),
            days: Math.floor(totalDays % 7),
            totalMonths: Math.floor(totalMonths),
            totalWeeks: Math.floor(totalWeeks),
            totalDays: Math.floor(totalDays),
            isPast: diff < 0
        };
    }, [currentTime, targetDateTime]);

    const quickJumps = [1, 5, 10, 20, 50, 100];

    return (
        <div className="space-y-6">
            {/* Quick Jump Controls */}
            <div className="bg-gray-800/30 rounded-xl p-4 border border-cyan-500/20">
                <h3 className="text-cyan-400 text-xs font-orbitron mb-3 uppercase tracking-widest flex items-center gap-2">
                    <i className="ri-flashlight-line"></i> Quick Temporal Displacement
                </h3>
                <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
                    {quickJumps.map(years => (
                        <button
                            key={years}
                            onClick={() => onSetTarget(years)}
                            className="bg-black/40 hover:bg-cyan-500/20 border border-gray-700 hover:border-cyan-500/50 rounded py-2 transition-all group"
                        >
                            <div className="text-lg font-bold text-white group-hover:text-cyan-300">{years}y</div>
                            <div className="text-[9px] text-gray-500 uppercase">Jump</div>
                        </button>
                    ))}
                </div>
            </div>

            {timeStats && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Visualization 1: The Grid of Months (The "Life Grid") */}
                    <div className="bg-gray-800/40 rounded-xl p-5 border border-purple-500/20">
                        <h4 className="text-purple-400 text-xs font-orbitron mb-4 uppercase tracking-widest">
                            The Monthly Matrix ({timeStats.totalMonths} months)
                        </h4>
                        <div className="flex flex-wrap gap-1 max-h-[200px] overflow-y-auto custom-scrollbar p-1">
                            {Array.from({ length: Math.min(timeStats.totalMonths, 1200) }).map((_, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ delay: (i % 100) * 0.001 }}
                                    className={`w-1.5 h-1.5 rounded-full ${i < 12 ? 'bg-purple-400' : 'bg-purple-900/40'} border border-purple-500/30`}
                                    title={`Month ${i + 1}`}
                                />
                            ))}
                            {timeStats.totalMonths > 1200 && (
                                <div className="text-[10px] text-gray-500 italic self-end ml-2">
                                    + {timeStats.totalMonths - 1200} more months...
                                </div>
                            )}
                        </div>
                        <p className="text-[10px] text-gray-500 mt-3 italic">
                            Each dot represents one lunar cycle of your journey. The first year is highlighted.
                        </p>
                    </div>

                    {/* Visualization 2: The Tree of Rings */}
                    <div className="bg-gray-800/40 rounded-xl p-5 border border-yellow-500/20 flex flex-col items-center justify-center relative overflow-hidden">
                        <h4 className="text-yellow-400 text-xs font-orbitron mb-4 uppercase tracking-widest self-start">
                            Chronological Rings ({timeStats.years} years)
                        </h4>
                        <div className="relative w-40 h-40 flex items-center justify-center">
                            {Array.from({ length: Math.min(timeStats.years, 50) }).map((_, i) => (
                                <div
                                    key={i}
                                    className="absolute rounded-full border border-yellow-500/20"
                                    style={{
                                        width: `${(i + 1) * (100 / Math.min(timeStats.years, 50))}%`,
                                        height: `${(i + 1) * (100 / Math.min(timeStats.years, 50))}%`,
                                        opacity: 1 - (i / Math.min(timeStats.years, 50))
                                    }}
                                />
                            ))}
                            <div className="z-10 text-center">
                                <div className="text-2xl font-bold text-white leading-none">{timeStats.years}</div>
                                <div className="text-[10px] text-yellow-500 uppercase">Solar Orbits</div>
                            </div>
                        </div>
                        <p className="text-[10px] text-gray-500 mt-4 text-center">
                            Visualizing the expansion of your personal timeline across the cosmos.
                        </p>
                    </div>

                    {/* Visualization 3: The Temporal Horizon (Perspective) */}
                    <div className="bg-gray-800/40 rounded-xl p-5 border border-cyan-500/20 lg:col-span-2">
                        <h4 className="text-cyan-400 text-xs font-orbitron mb-6 uppercase tracking-widest">
                            The Temporal Horizon
                        </h4>
                        <div className="relative h-24 w-full bg-black/40 rounded-lg overflow-hidden flex items-center px-4">
                            {/* Perspective Lines */}
                            <div className="absolute inset-0 opacity-20">
                                <div className="absolute top-0 left-0 w-full h-full" style={{ background: 'repeating-linear-gradient(90deg, transparent, transparent 40px, #06b6d4 41px)' }}></div>
                            </div>
                            
                            <div className="relative w-full h-1 bg-gray-700 rounded-full">
                                {/* Now Marker */}
                                <div className="absolute -top-2 left-0 flex flex-col items-center">
                                    <div className="w-0.5 h-5 bg-cyan-400"></div>
                                    <div className="text-[9px] text-cyan-400 font-bold mt-1">NOW</div>
                                </div>

                                {/* Target Marker */}
                                <motion.div 
                                    initial={{ left: 0 }}
                                    animate={{ left: '100%' }}
                                    className="absolute -top-2 flex flex-col items-center"
                                >
                                    <div className="w-0.5 h-5 bg-purple-500"></div>
                                    <div className="text-[9px] text-purple-400 font-bold mt-1">TARGET</div>
                                </motion.div>

                                {/* Progress Fill */}
                                <div className="h-full bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full w-full opacity-30"></div>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                            <div className="text-center">
                                <div className="text-lg font-bold text-white">{timeStats.totalWeeks.toLocaleString()}</div>
                                <div className="text-[9px] text-gray-500 uppercase">Weeks</div>
                            </div>
                            <div className="text-center">
                                <div className="text-lg font-bold text-white">{timeStats.totalDays.toLocaleString()}</div>
                                <div className="text-[9px] text-gray-500 uppercase">Days</div>
                            </div>
                            <div className="text-center">
                                <div className="text-lg font-bold text-white">{(timeStats.totalDays * 24).toLocaleString()}</div>
                                <div className="text-[9px] text-gray-500 uppercase">Hours</div>
                            </div>
                            <div className="text-center">
                                <div className="text-lg font-bold text-white">{(timeStats.totalDays * 1440).toLocaleString()}</div>
                                <div className="text-[9px] text-gray-500 uppercase">Minutes</div>
                            </div>
                        </div>
                    </div>

                    {/* Visualization 4: The Generational Scale */}
                    <div className="bg-gray-800/40 rounded-xl p-5 border border-red-500/20 lg:col-span-2">
                        <h4 className="text-red-400 text-xs font-orbitron mb-4 uppercase tracking-widest">
                            The Generational Scale
                        </h4>
                        <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
                            <div className="flex-1 text-center p-3 bg-black/20 rounded border border-red-500/10">
                                <div className="text-xl font-bold text-white">{(timeStats.years / 25).toFixed(1)}</div>
                                <div className="text-[9px] text-gray-500 uppercase">Human Generations</div>
                            </div>
                            <div className="flex-1 text-center p-3 bg-black/20 rounded border border-red-500/10">
                                <div className="text-xl font-bold text-white">{(timeStats.years / 10).toFixed(1)}</div>
                                <div className="text-[9px] text-gray-500 uppercase">Decades</div>
                            </div>
                            <div className="flex-1 text-center p-3 bg-black/20 rounded border border-red-500/10">
                                <div className="text-xl font-bold text-white">{(timeStats.years * 365.25).toFixed(0)}</div>
                                <div className="text-[9px] text-gray-500 uppercase">Solar Rotations</div>
                            </div>
                            <div className="flex-1 text-center p-3 bg-black/20 rounded border border-red-500/10">
                                <div className="text-xl font-bold text-white">{(timeStats.years * 12).toFixed(0)}</div>
                                <div className="text-[9px] text-gray-500 uppercase">Lunar Cycles</div>
                            </div>
                        </div>
                        <div className="mt-4 p-3 bg-red-900/10 rounded border border-red-500/20 text-center">
                            <p className="text-xs text-red-300 italic">
                                {timeStats.years >= 100 ? "A century of displacement. You are witnessing the rise and fall of civilizations." :
                                 timeStats.years >= 50 ? "Half a century. A lifetime of change in the blink of a quantum eye." :
                                 timeStats.years >= 20 ? "Two decades. Enough time for a child to become an adult." :
                                 timeStats.years >= 10 ? "A decade. The world will be unrecognizable upon your arrival." :
                                 "A short-range jump. The echoes of 'now' will still be audible."}
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default LongTermTemporalVisualizer;
