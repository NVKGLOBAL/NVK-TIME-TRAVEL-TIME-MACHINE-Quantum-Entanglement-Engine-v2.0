import React from 'react';

interface UIGlitchEffectProps {
    intensity: number; // 0 to 1
}

const UIGlitchEffect: React.FC<UIGlitchEffectProps> = ({ intensity }) => {
    if (intensity <= 0) return null;

    const scanlineOpacity = intensity * 0.15;
    const glitchOpacity = intensity * 0.8;
    
    // Animate scanline speed based on intensity
    const scanlineDuration = Math.max(0.1, 1 - intensity * 0.9);

    return (
        <div className="fixed inset-0 z-[4500] pointer-events-none overflow-hidden" aria-hidden="true">
            {/* Scanline effect */}
            <div 
                className="absolute inset-0 bg-repeat"
                style={{
                    backgroundImage: 'linear-gradient(to bottom, rgba(255,255,255,0) 0%, rgba(255,255,255,0.05) 50%, rgba(255,255,255,0) 100%)',
                    backgroundSize: `100% ${4 - intensity * 3}px`,
                    opacity: scanlineOpacity,
                    animation: `scanmove ${scanlineDuration}s linear infinite`,
                }}
            />
            {/* Glitch effect - pseudo-elements for displacement */}
            <div 
                className="glitch-layer" 
                style={{ 
                    '--intensity': `${intensity * 10}px`,
                    opacity: glitchOpacity,
                } as React.CSSProperties}
            ></div>
            <div 
                className="glitch-layer" 
                style={{ 
                    '--intensity': `${intensity * 10}px`,
                    opacity: glitchOpacity,
                    animationDirection: 'reverse'
                } as React.CSSProperties}
            ></div>

            <style>{`
                @keyframes scanmove {
                    0% { background-position: 0 0; }
                    100% { background-position: 0 100%; }
                }

                @keyframes glitch {
                    0% { transform: translate(0); }
                    10% { transform: translate(var(--intensity), var(--intensity)); }
                    20% { transform: translate(calc(-1 * var(--intensity)), var(--intensity)); }
                    30% { transform: translate(var(--intensity), calc(-1 * var(--intensity))); }
                    40% { transform: translate(calc(-1 * var(--intensity)), calc(-1 * var(--intensity))); }
                    50% { transform: translate(0); }
                    100% { transform: translate(0); }
                }

                .glitch-layer {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: transparent;
                    animation: glitch 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94) both infinite;
                    mix-blend-mode: color-dodge;
                }
                .glitch-layer::before, .glitch-layer::after {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: rgba(255, 0, 0, 0.03);
                }
                .glitch-layer::after {
                    background: rgba(0, 0, 255, 0.03);
                    animation: glitch 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94) reverse both infinite;
                }
            `}</style>
        </div>
    );
};

export default UIGlitchEffect;
