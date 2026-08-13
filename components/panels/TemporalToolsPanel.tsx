import React, { useState, useEffect, useRef } from 'react';
import { AgentName, type TemporalToolsPanelProps } from '../../types';

// A simple styled switch component
const ToggleSwitch: React.FC<{ checked: boolean; onChange: (checked: boolean) => void; label: string }> = ({ checked, onChange, label }) => (
    <label className="flex items-center justify-between cursor-pointer group">
        <span className="text-xs text-slate-300 group-hover:text-sky-300 transition-colors">{label}</span>
        <div className="relative">
            <input type="checkbox" className="sr-only" checked={checked} onChange={(e) => onChange(e.target.checked)} />
            <div className={`block w-10 h-5 rounded-full transition-colors ${checked ? 'bg-sky-500' : 'bg-slate-600'}`}></div>
            <div className={`dot absolute left-0.5 top-0.5 bg-white w-4 h-4 rounded-full transition-transform ${checked ? 'translate-x-5' : ''}`}></div>
        </div>
    </label>
);

const TemporalToolsPanel: React.FC<TemporalToolsPanelProps> = ({
  temporalCoordinate,
  setTemporalCoordinate,
  currentEntropy,
  addEchoMessage,
  onEngageDrive
}) => {
  const [isEngaging, setIsEngaging] = useState<boolean>(false);
  const [isPhased, setIsPhased] = useState<boolean>(false);
  const integrityCanvasRef = useRef<HTMLCanvasElement>(null);

  const handleTimeJump = (amount: number, unit: 'day' | 'year') => {
    try {
      const parts = temporalCoordinate.split(':');
      const datePart = parts[parts.length - 1];
      const locationParts = parts.slice(0, -1);
      
      let currentDate = new Date(datePart);
      if (isNaN(currentDate.getTime())) {
          addEchoMessage(AgentName.TARDISConsole, `Time-Jump Error: Cannot parse date "${datePart}"`, "text-rose-400");
          return;
      }

      if (unit === 'day') {
        currentDate.setDate(currentDate.getDate() + amount);
      } else if (unit === 'year') {
        currentDate.setFullYear(currentDate.getFullYear() + amount);
      }
      
      const newDateString = currentDate.toISOString().split('T')[0];
      const newCoordinate = [...locationParts, newDateString].join(':');
      setTemporalCoordinate(newCoordinate);
      addEchoMessage(AgentName.TARDISConsole, `Temporal jump initiated: ${amount > 0 ? '+' : ''}${amount} ${unit}(s). New target: ${newCoordinate}`, "text-sky-300");

    } catch (e) {
      addEchoMessage(AgentName.TARDISConsole, "Temporal jump failed. Coordinate format unsupported.", "text-rose-400");
    }
  };
  
  const handleReturnToOrigin = () => {
    const origin = "Earth:London:1963-11-23";
    setTemporalCoordinate(origin);
    addEchoMessage(AgentName.TARDISConsole, "Emergency Temporal Shift: Returning to origin point.", "text-amber-400");
  };
  
  const handleChameleonCircuit = (disguise: string) => {
    addEchoMessage(AgentName.TARDISConsole, `Chameleon Circuit activated. Exterior form set to: ${disguise}.`, "text-cyan-300");
  };

  const handleSetAnchor = () => {
    addEchoMessage(AgentName.TARDISConsole, `Temporal Anchor set at coordinate: ${temporalCoordinate}`, "text-cyan-400");
  };

  const handleActivateBeacon = () => {
    addEchoMessage(AgentName.TARDISConsole, `Emergency temporal beacon activated. Broadcasting distress signal from current coordinates.`, "text-amber-300");
  };
  
  const handleTogglePhasing = (checked: boolean) => {
    setIsPhased(checked);
    addEchoMessage(AgentName.TARDISConsole, `Observation Mode (Phasing) ${checked ? 'Engaged' : 'Disengaged'}.`, "text-purple-300");
  };
  
  const handleLocalEngage = () => {
    setIsEngaging(true);
    onEngageDrive();
    setTimeout(() => setIsEngaging(false), 1500);
  };

  // Timeline Integrity Monitor canvas animation
  useEffect(() => {
    const canvas = integrityCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    const render = (time: number) => {
        const { width, height } = canvas;
        ctx.clearRect(0, 0, width, height);

        const t = Math.min(1, currentEntropy);
        const amplitude = height / 2 * 0.7 * (1 + t * 1.5); // Amplitude increases with entropy
        const frequency = 2 + t * 5; // Frequency increases
        const noise = t * (height / 4); // Noise increases
        const color = `hsla(${180 - t * 120}, 80%, 60%, ${0.6 + (1 - t) * 0.4})`;

        ctx.strokeStyle = color;
        ctx.lineWidth = 1.5;
        ctx.shadowColor = color;
        ctx.shadowBlur = 5;

        ctx.beginPath();
        for (let x = 0; x < width; x++) {
            const wave = Math.sin(x / (width / (2 * Math.PI * frequency)) + time * 0.002) * amplitude;
            const noiseVal = (Math.random() - 0.5) * noise;
            const y = height / 2 + wave + noiseVal;
            if (x === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
        }
        ctx.stroke();
        ctx.shadowBlur = 0;

        animationFrameId = requestAnimationFrame(render);
    };

    render(0);

    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, [currentEntropy]);

  const paradoxLevel = Math.min(1, Math.max(0, currentEntropy));
  const paradoxColor = paradoxLevel > 0.8 ? 'bg-red-500' : paradoxLevel > 0.6 ? 'bg-orange-500' : paradoxLevel > 0.4 ? 'bg-yellow-500' : 'bg-green-500';

  return (
    <div className="temporal-tools-panel bg-slate-900/80 backdrop-blur-md border border-slate-700/50 rounded-xl shadow-xl p-6 text-slate-100 font-['Cormorant']">
      <h3 className="text-xl font-['Cinzel'] font-bold text-slate-200 mb-4 text-center">
        <i className="ri-time-line mr-2 align-middle"></i>Temporal Tools
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Left Column: Navigation & Core Systems */}
        <div className="space-y-4">
            <div className="p-3 bg-slate-800/50 rounded-lg border border-slate-700">
                <h4 className="text-sm font-semibold text-slate-300 mb-2 font-['Cinzel']">Temporal Navigation</h4>
                <div className="grid grid-cols-2 gap-2 text-xs">
                    <button onClick={() => handleTimeJump(-1, 'day')} className="py-2 px-1 bg-slate-600/70 rounded-md transition-colors duration-200 hover:bg-slate-500/70">-1 Day</button>
                    <button onClick={() => handleTimeJump(1, 'day')} className="py-2 px-1 bg-slate-600/70 rounded-md transition-colors duration-200 hover:bg-slate-500/70">+1 Day</button>
                    <button onClick={() => handleTimeJump(-100, 'year')} className="py-2 px-1 bg-slate-600/70 rounded-md transition-colors duration-200 hover:bg-slate-500/70">-100 Years</button>
                    <button onClick={() => handleTimeJump(100, 'year')} className="py-2 px-1 bg-slate-600/70 rounded-md transition-colors duration-200 hover:bg-slate-500/70">+100 Years</button>
                </div>
                <button onClick={handleReturnToOrigin} className="w-full mt-2 py-2 px-3 text-xs bg-amber-700/80 hover:bg-amber-600/80 text-white rounded-md transition-colors">
                    Emergency Return to Origin
                </button>
            </div>
            
            <div className="p-3 bg-slate-800/50 rounded-lg border border-slate-700">
                <h4 className="text-sm font-semibold text-slate-300 mb-2 font-['Cinzel']">Auxiliary Systems</h4>
                <div className="space-y-2 text-xs">
                    <button onClick={handleSetAnchor} className="w-full text-left py-2 px-3 bg-slate-600/70 rounded-md transition-colors duration-200 hover:bg-slate-500/70 flex items-center"><i className="ri-anchor-line mr-2"></i>Set Temporal Anchor</button>
                    <button onClick={handleActivateBeacon} className="w-full text-left py-2 px-3 bg-slate-600/70 rounded-md transition-colors duration-200 hover:bg-slate-500/70 flex items-center"><i className="ri-broadcast-line mr-2"></i>Activate Emergency Beacon</button>
                    <div className="pt-2">
                        <ToggleSwitch label="Observation Mode" checked={isPhased} onChange={handleTogglePhasing} />
                    </div>
                </div>
            </div>
        </div>

        {/* Right Column: Status & Auxiliary */}
        <div className="space-y-4">
            <div className="p-3 bg-slate-800/50 rounded-lg border border-slate-700">
                <h4 className="text-sm font-semibold text-slate-300 mb-2 font-['Cinzel']">Timeline Integrity</h4>
                <canvas ref={integrityCanvasRef} width="200" height="60" className="w-full h-[60px] bg-black/30 rounded-md"></canvas>
            </div>

            <div className="p-3 bg-slate-800/50 rounded-lg border border-slate-700">
                <h4 className="text-sm font-semibold text-slate-300 mb-2 font-['Cinzel']">Paradox Meter</h4>
                <div className="w-full h-4 bg-slate-700 rounded-full overflow-hidden">
                    <div className={`h-full rounded-full transition-all duration-300 ${paradoxColor}`} style={{ width: `${paradoxLevel * 100}%` }}/>
                </div>
                <p className="text-xs text-center mt-1 text-slate-400">Risk Level: { (paradoxLevel * 100).toFixed(1) }%</p>
            </div>
            
            <div className="p-3 bg-slate-800/50 rounded-lg border border-slate-700">
                <h4 className="text-sm font-semibold text-slate-300 mb-2 font-['Cinzel']">Chameleon Circuit</h4>
                <select onChange={(e) => handleChameleonCircuit(e.target.value)} className="w-full p-2 text-xs bg-slate-700 border border-slate-600 rounded-md text-slate-200 focus:ring-1 focus:ring-cyan-500">
                    <option>Police Box (Default)</option>
                    <option>Phone Booth</option>
                    <option>Porta-Potty</option>
                    <option>Stone Obelisk</option>
                    <option>Vending Machine</option>
                </select>
            </div>
        </div>
      </div>
        
        <button onClick={handleLocalEngage} disabled={isEngaging} className="w-full mt-4 py-2 px-3 text-sm bg-sky-700/80 hover:bg-sky-600/80 text-white rounded-md transition-colors font-semibold disabled:opacity-50 disabled:cursor-wait">
            {isEngaging ? 'Engaging...' : 'Engage from Current Settings'}
        </button>
    </div>
  );
};

export default TemporalToolsPanel;
