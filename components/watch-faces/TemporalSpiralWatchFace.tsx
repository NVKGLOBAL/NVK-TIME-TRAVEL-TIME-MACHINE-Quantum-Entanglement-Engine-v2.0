import React, { useMemo } from 'react';
import { motion } from 'framer-motion';

interface WatchFaceProps {
    time: Date;
}

const TemporalSpiralWatchFace: React.FC<WatchFaceProps> = ({ time }) => {
    // Clock hand rotation logic remains the same
    const hours = time.getHours();
    const minutes = time.getMinutes();
    const seconds = time.getSeconds();

    const secondsRotation = (seconds / 60) * 360;
    const minutesRotation = (minutes / 60) * 360 + (seconds / 60) * 6;
    const hoursRotation = (hours / 12) * 360 + (minutes / 60) * 30;

    // Generate SVG path for the spiral. Use useMemo to calculate only once.
    const spiralPathData = useMemo(() => {
        const radius = 100; // Based on viewBox 0 0 200 200
        const centerX = 100;
        const centerY = 100;

        const a = 0;
        const b = radius * 0.02;
        const points = [];
        let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;

        for (let i = 0; i < 500; i++) {
            const angle = 0.1 * i;
            const r = a + b * angle;
            if (r > radius * 0.6) break;

            const x = r * Math.cos(angle);
            const y = r * Math.sin(angle);
            points.push({x, y});
            minX = Math.min(minX, x);
            maxX = Math.max(maxX, x);
            minY = Math.min(minY, y);
            maxY = Math.max(maxY, y);
        }

        const spiralWidth = maxX - minX;
        const spiralHeight = maxY - minY;
        const spiralCenterX = minX + spiralWidth / 2;
        const spiralCenterY = minY + spiralHeight / 2;

        const offsetX = centerX - spiralCenterX;
        const offsetY = centerY - spiralCenterY;

        return points
            .map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x + offsetX} ${p.y + offsetY}`)
            .join(' ');
    }, []);

    return (
        <div className="relative w-full h-full rounded-full bg-black overflow-hidden border-4 border-gray-800">
            <svg viewBox="0 0 200 200" width="100%" height="100%" preserveAspectRatio="xMidYMid meet">
                <defs>
                    <clipPath id="watchFaceClip">
                        <circle cx="100" cy="100" r="100" />
                    </clipPath>
                    <filter id="noiseFilter">
                        <feTurbulence 
                            type="fractalNoise" 
                            baseFrequency="0.8" 
                            numOctaves="3" 
                            stitchTiles="stitch"
                            result="noise"
                        />
                         <feColorMatrix in="noise" type="matrix" values="1 0 0 0 0
                                                                      1 0 0 0 0
                                                                      1 0 0 0 0
                                                                      0 0 0 0.1 0" />
                    </filter>
                </defs>

                <g clipPath="url(#watchFaceClip)">
                    {/* Background */}
                    <rect x="0" y="0" width="200" height="200" fill="#111111" />
                    <rect x="0" y="0" width="200" height="200" filter="url(#noiseFilter)" />
                    
                    <motion.g 
                        style={{ originX: '100px', originY: '100px' }}
                        animate={{ rotate: -360 }}
                        transition={{ duration: 120, repeat: Infinity, ease: "linear"}}
                    >
                        {/* Outer Ring */}
                        <circle cx="100" cy="100" r="95" stroke="white" strokeWidth="10" fill="none" />

                        {/* Ticks */}
                        <g stroke="white">
                            {Array.from({ length: 12 }).map((_, i) => (
                                <line
                                    key={i}
                                    x1="100" y1="20"
                                    x2="100" y2="10"
                                    strokeWidth="5"
                                    transform={`rotate(${i * 30} 100 100)`}
                                />
                            ))}
                        </g>

                        {/* Triangle */}
                        <polygon points="100,187.5 85,175 115,175" fill="white" />
                        
                        {/* Spiral */}
                        <motion.path
                            d={spiralPathData}
                            stroke="white"
                            fill="none"
                            strokeLinecap="round"
                            animate={{ strokeWidth: [3.5, 4.5, 3.5] }}
                            transition={{
                                duration: 4,
                                repeat: Infinity,
                                ease: "easeInOut"
                            }}
                        />
                    </motion.g>
                </g>

                    {/* High Contrast Digital Readout Capsule */}
                    <g transform="translate(100, 158)">
                        <rect x="-38" y="-12" width="76" height="22" rx="11" fill="#020617" stroke="#06b6d4" strokeWidth="1.5" filter="drop-shadow(0 0 6px rgba(6,182,212,0.4))" />
                        <text x="0" y="3" textAnchor="middle" fill="#38bdf8" fontFamily="Orbitron" fontSize="10" fontWeight="bold" filter="drop-shadow(0 0 4px #0284c7)">
                            {String(hours % 12 || 12).padStart(2, '0')}:{String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
                        </text>
                    </g>

                    {/* Hands are motion elements on top of the clipped group */}
                    <g>
                        <motion.line
                            x1="100" y1="100" x2="100" y2="48"
                            stroke="#fbbf24"
                            strokeWidth="4"
                            strokeLinecap="round"
                            style={{ originX: '100px', originY: '100px' }}
                            animate={{ rotate: hoursRotation }}
                            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                            filter="drop-shadow(0 0 6px #f59e0b)"
                        />
                        <motion.line
                            x1="100" y1="100" x2="100" y2="28"
                            stroke="#38bdf8"
                            strokeWidth="2.5"
                            strokeLinecap="round"
                            style={{ originX: '100px', originY: '100px' }}
                            animate={{ rotate: minutesRotation }}
                            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                            filter="drop-shadow(0 0 6px #0284c7)"
                        />
                        <motion.line
                            x1="100" y1="100" x2="100" y2="18"
                            stroke="#f43f5e"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            style={{ originX: '100px', originY: '100px' }}
                            animate={{ rotate: secondsRotation }}
                            transition={{ type: 'tween', ease: 'linear', duration: 0.1 }}
                            filter="drop-shadow(0 0 8px #f43f5e)"
                        />
                        <circle cx="100" cy="100" r="4" fill="#fbbf24" stroke="#0f172a" strokeWidth="2" />
                    </g>
            </svg>
        </div>
    );
};

export default TemporalSpiralWatchFace;