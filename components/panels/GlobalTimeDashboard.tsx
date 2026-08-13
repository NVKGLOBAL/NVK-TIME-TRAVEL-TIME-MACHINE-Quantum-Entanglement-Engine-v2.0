import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const GlobalTimeDashboard: React.FC = () => {
    const [now, setNow] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => setNow(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    // Swatch Internet Time (.beats)
    // Time in beats = ((UTC+1 seconds) / 86400) * 1000
    const getInternetTime = () => {
        const utcSeconds = (now.getUTCHours() * 3600) + (now.getUTCMinutes() * 60) + now.getUTCSeconds();
        const bmtSeconds = (utcSeconds + 3600) % 86400; // Biel Mean Time is UTC+1
        const beats = Math.floor((bmtSeconds / 86400) * 1000);
        return `@${String(beats).padStart(3, '0')}`;
    };

    // Unix Timestamp
    const unixTime = Math.floor(now.getTime() / 1000);

    // Metric Time (Decimal Time)
    // 10 hours per day, 100 minutes per hour, 100 seconds per minute
    const getDecimalTime = () => {
        const totalSecondsInDay = (now.getHours() * 3600) + (now.getMinutes() * 60) + now.getSeconds();
        const decimalTotalSeconds = (totalSecondsInDay / 86400) * 100000;
        const h = Math.floor(decimalTotalSeconds / 10000);
        const m = Math.floor((decimalTotalSeconds % 10000) / 100);
        const s = Math.floor(decimalTotalSeconds % 100);
        return `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
    };

    // Simple Stardate (Fixed Epoch: Jan 1, 2323 = 0)
    // Formula: (Current Year - 2323) * 1000 + (Day of Year / Days in Year) * 1000
    const getStardate = () => {
        const year = now.getFullYear();
        const start = new Date(now.getFullYear(), 0, 0);
        const diff = (now.getTime() - start.getTime()) + ((start.getTimezoneOffset() - now.getTimezoneOffset()) * 60 * 1000);
        const oneDay = 1000 * 60 * 60 * 24;
        const day = Math.floor(diff / oneDay);
        const daysInYear = (year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0)) ? 366 : 365;
        
        const stardate = (year - 2323) * 1000 + (day / daysInYear) * 1000;
        return stardate.toFixed(1);
    };

    const TimeCard = ({ title, value, sub, color }: { title: string, value: string, sub?: string, color: string }) => (
        <div className={`bg-gray-800/40 border border-${color}-500/20 p-4 rounded-xl backdrop-blur-sm`}>
            <div className={`text-[10px] uppercase tracking-widest text-${color}-400 mb-1 font-orbitron`}>{title}</div>
            <div className="text-2xl font-mono text-white mb-1">{value}</div>
            {sub && <div className="text-[10px] text-gray-500 font-mono">{sub}</div>}
        </div>
    );

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold text-cyan-400 mb-4 font-orbitron flex items-center gap-3">
                <i className="ri-dashboard-3-line"></i> Universal Time Dashboard
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <TimeCard 
                    title="Internet Time (.beats)" 
                    value={getInternetTime()} 
                    sub="Swatch Biel Mean Time" 
                    color="cyan"
                />
                <TimeCard 
                    title="Decimal Time" 
                    value={getDecimalTime()} 
                    sub="10h / 100m / 100s" 
                    color="purple"
                />
                <TimeCard 
                    title="Unix Timestamp" 
                    value={unixTime.toString()} 
                    sub="Seconds since 1970-01-01" 
                    color="yellow"
                />
                <TimeCard 
                    title="Stardate" 
                    value={getStardate()} 
                    sub="Temporal Coordinate Ref" 
                    color="pink"
                />
                <TimeCard 
                    title="Hexadecimal Time" 
                    value={now.getTime().toString(16).toUpperCase().slice(-8)} 
                    sub="Epoch hex bytes" 
                    color="green"
                />
                <TimeCard 
                    title="Julian Date" 
                    value={(now.getTime() / 86400000 + 2440587.5).toFixed(5)} 
                    sub="Astronomical count" 
                    color="blue"
                />
            </div>

            <div className="bg-cyan-900/10 border border-cyan-500/20 p-6 rounded-2xl">
                <h3 className="text-cyan-400 font-semibold mb-4 font-orbitron flex items-center gap-2">
                    <i className="ri-earth-line"></i> Global Relative Horizons
                </h3>
                <div className="space-y-4">
                    {[
                        { city: 'Tokyo', zone: 'Asia/Tokyo' },
                        { city: 'London', zone: 'Europe/London' },
                        { city: 'New York', zone: 'America/New_York' },
                        { city: 'Mars (MTC)', offset: 0, isMars: true }
                    ].map((item, idx) => {
                        const timeStr = item.isMars 
                            ? getDecimalTime() // Mocking Mars time with decimal for now
                            : now.toLocaleTimeString('en-US', { timeZone: item.zone, hour12: false });
                        
                        return (
                            <div key={idx} className="flex items-center justify-between border-b border-gray-800 pb-2">
                                <span className="text-gray-300 font-medium">{item.city}</span>
                                <span className="text-cyan-400 font-mono text-lg">{timeStr}</span>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default GlobalTimeDashboard;
