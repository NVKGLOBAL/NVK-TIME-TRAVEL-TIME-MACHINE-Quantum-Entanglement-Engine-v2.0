import React from 'react';

const TimeWarpedWatch: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="relative w-full h-full">
    <svg width="0" height="0" className="absolute">
      <defs>
        <filter id="time-warp-filter">
          <feTurbulence type="fractalNoise" baseFrequency="0.02 0.5" numOctaves="2" seed={Math.random()} result="turbulence">
             <animate 
                attributeName="baseFrequency" 
                dur="3s" 
                values="0.02 0.5; 0.03 0.6; 0.02 0.5"
                repeatCount="indefinite" />
          </feTurbulence>
          <feDisplacementMap in="SourceGraphic" in2="turbulence" scale="4" xChannelSelector="R" yChannelSelector="A" />
        </filter>
      </defs>
    </svg>
    <div
      className="w-full h-full"
      style={{ filter: 'url(#time-warp-filter) blur(0.5px)' }}
    >
      {children}
    </div>
    {/* Add some glitchy scanlines */}
    <div className="absolute inset-0 overflow-hidden rounded-full">
        <div className="absolute top-0 left-0 w-full h-1 bg-purple-400/30 opacity-50 animate-scanline"></div>
    </div>
    <style>{`
        @keyframes scanline {
            0% { transform: translateY(-20px); }
            100% { transform: translateY(120%); }
        }
        .animate-scanline {
            animation: scanline 2.5s infinite linear;
            animation-delay: ${Math.random() * 2.5}s;
        }
    `}</style>
  </div>
);

export default TimeWarpedWatch;