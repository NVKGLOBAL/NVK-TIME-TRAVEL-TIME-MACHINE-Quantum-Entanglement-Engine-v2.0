import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ParadoxShieldEffectProps {
    isActive: boolean;
    isActivating: boolean;
}

const Hexagon = ({ ...props }) => (
    <polygon points="100,0 50,-86.6 -50,-86.6 -100,0 -50,86.6 50,86.6" {...props} />
);

const ParadoxShieldEffect: React.FC<ParadoxShieldEffectProps> = ({ isActive, isActivating }) => {
    const hexGrid = [];
    const hexSize = 60;
    const gridWidth = Math.ceil(window.innerWidth / (hexSize * 1.5)) + 2;
    const gridHeight = Math.ceil(window.innerHeight / (hexSize * Math.sqrt(3))) + 2;

    for (let q = -Math.floor(gridWidth / 2); q <= Math.floor(gridWidth / 2); q++) {
        for (let r = -Math.floor(gridHeight / 2); r <= Math.floor(gridHeight / 2); r++) {
            const x = hexSize * (3 / 2 * q);
            const y = hexSize * (Math.sqrt(3) / 2 * q + Math.sqrt(3) * r);
            hexGrid.push({ id: `${q}-${r}`, x, y });
        }
    }

    return (
        <AnimatePresence>
            {isActive && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5 }}
                    className="fixed inset-0 z-[4000] pointer-events-none"
                >
                    <svg width="100%" height="100%" className="absolute inset-0">
                        <defs>
                            <radialGradient id="shieldGlow" cx="50%" cy="50%" r="50%">
                                <stop offset="0%" stopColor="rgba(0, 255, 255, 0)" />
                                <stop offset="50%" stopColor="rgba(0, 255, 255, 0.1)" />
                                <stop offset="100%" stopColor="rgba(0, 150, 150, 0.3)" />
                            </radialGradient>
                        </defs>
                        
                        <motion.g
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{
                                scale: isActivating ? [0.1, 1.2, 1] : 1,
                                opacity: isActivating ? [0, 1, 0.4] : 0.4,
                            }}
                            transition={{
                                duration: isActivating ? 1.5 : 0.5,
                                ease: 'easeOut',
                            }}
                            style={{ originX: '50%', originY: '50%' }}
                        >
                            <g transform={`translate(${window.innerWidth / 2}, ${window.innerHeight / 2})`}>
                                {hexGrid.map((hex, i) => (
                                    <motion.g
                                        key={hex.id}
                                        transform={`translate(${hex.x}, ${hex.y})`}
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        transition={{
                                            delay: isActivating ? Math.sqrt(hex.x * hex.x + hex.y * hex.y) / 2000 : 0,
                                            duration: 0.5
                                        }}
                                    >
                                        <Hexagon
                                            transform={`scale(${hexSize / 100})`}
                                            fill="none"
                                            stroke="rgba(0, 255, 255, 0.8)"
                                            strokeWidth={3}
                                        />
                                    </motion.g>
                                ))}
                            </g>
                        </motion.g>

                        {/* Persistent hum */}
                        <motion.g
                             animate={{ opacity: [0.2, 0.4, 0.2] }}
                             transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                        >
                             <g transform={`translate(${window.innerWidth / 2}, ${window.innerHeight / 2})`}>
                                {hexGrid.map((hex) => (
                                     <Hexagon
                                        key={`hum-${hex.id}`}
                                        transform={`translate(${hex.x}, ${hex.y}) scale(${hexSize / 100})`}
                                        fill="rgba(0, 150, 150, 0.03)"
                                     />
                                ))}
                            </g>
                        </motion.g>
                        
                         {/* Vignette */}
                        <rect width="100%" height="100%" fill="url(#shieldGlow)" />
                    </svg>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default ParadoxShieldEffect;
