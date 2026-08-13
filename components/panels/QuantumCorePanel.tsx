import React, { useRef, useEffect } from 'react';
import { BellState, QuantumState, EntanglementMetrics, Complex } from '../../types';

interface QuantumCorePanelProps {
    quantumAnchor: QuantumState | null;
    quantumDevice: QuantumState | null;
    metrics: EntanglementMetrics;
    selectedBellState: BellState;
    onBellStateChange: (state: BellState) => void;
    onRecalibrate: (bonusCoherence?: number) => void;
}

const MetricDisplay: React.FC<{ label: string; value: string | number; unit?: string }> = ({ label, value, unit }) => (
    <div className="bg-gray-800/60 rounded-lg p-3 text-center border border-gray-700/50 hover:border-cyan-500/30 transition-colors">
        <div className="text-xs text-cyan-300 uppercase font-mono tracking-wider">{label}</div>
        <div className="text-xl font-bold text-white font-orbitron mt-1">
            {typeof value === 'number' ? value.toFixed(4) : value}
            {unit && <span className="text-sm text-gray-400 ml-1">{unit}</span>}
        </div>
    </div>
);

const QuantumCorePanel: React.FC<QuantumCorePanelProps> = ({
    quantumAnchor,
    quantumDevice,
    metrics,
    selectedBellState,
    onBellStateChange,
    onRecalibrate,
}) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [isCalibrating, setIsCalibrating] = React.useState(false);
    const [calibrationValue, setCalibrationValue] = React.useState(0.5);
    const [targetFrequency, setTargetFrequency] = React.useState(0.5);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas || !quantumDevice) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let animationFrameId: number;
        const w = canvas.width;
        const h = canvas.height;
        let coherence = quantumDevice.coherenceLevel;

        const render = (time: number) => {
            ctx.clearRect(0, 0, w, h);
            
            if (isCalibrating) {
                // Calibration View: Resonance Matcher
                const centerX = w / 2;
                const centerY = h / 2;
                
                // Target Wave (Static/Ghostly)
                ctx.beginPath();
                ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
                ctx.lineWidth = 2;
                for (let x = 0; x < w; x++) {
                    const y = centerY + Math.sin(x * 0.02 * targetFrequency + time * 0.005) * 40;
                    if (x === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
                }
                ctx.stroke();

                // User Wave (Cyan)
                ctx.beginPath();
                ctx.strokeStyle = 'rgba(34, 211, 238, 0.6)';
                ctx.lineWidth = 3;
                for (let x = 0; x < w; x++) {
                    const y = centerY + Math.sin(x * 0.02 * calibrationValue + time * 0.005) * 40;
                    if (x === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
                }
                ctx.stroke();

                const diff = Math.abs(calibrationValue - targetFrequency);
                const resonance = Math.max(0, 1 - (diff * 2));
                
                ctx.fillStyle = `rgba(34, 211, 238, ${0.2 + resonance * 0.5})`;
                ctx.font = '16px Orbitron';
                ctx.textAlign = 'center';
                ctx.fillText(`RESONANCE: ${Math.round(resonance * 100)}%`, centerX, 30);
            } else {
                coherence = quantumDevice.coherenceLevel;
                const centerX = w / 2;
                const centerY = h / 2;
                
                const anchorX = centerX - w * 0.25;
                const deviceX = centerX + w * 0.25;
                
                const baseRadius = 30;
                const pulse = Math.sin(time * 0.002) * 5 * coherence;
                const jitter = (1 - coherence) * 10;
                
                // Draw Entanglement Connection
                const numLines = 1 + Math.floor(coherence * 15);
                for(let i=0; i<numLines; i++){
                    ctx.beginPath();
                    ctx.moveTo(anchorX, centerY);
                    const controlX1 = lerp(anchorX, deviceX, 0.3) + (Math.random() - 0.5) * jitter * 2;
                    const controlY1 = centerY + (Math.random() - 0.5) * 50 * (1 - coherence);
                    const controlX2 = lerp(anchorX, deviceX, 0.7) + (Math.random() - 0.5) * jitter * 2;
                    const controlY2 = centerY + (Math.random() - 0.5) * 50 * (1 - coherence);
                    ctx.bezierCurveTo(controlX1, controlY1, controlX2, controlY2, deviceX, centerY);
                    ctx.strokeStyle = `rgba(100, 220, 255, ${0.1 + coherence * 0.4})`;
                    ctx.lineWidth = Math.random() * 1.5 * coherence;
                    ctx.stroke();
                }

                // Draw Orbs (Anchor & Device)
                drawOrb(ctx, anchorX, centerY, baseRadius, coherence, pulse, jitter, 'ANCHOR');
                drawOrb(ctx, deviceX, centerY, baseRadius, coherence, pulse, jitter, 'DEVICE');
            }
            
            animationFrameId = requestAnimationFrame(render);
        };

        render(0);

        return () => {
            if (animationFrameId) cancelAnimationFrame(animationFrameId);
        };
    }, [quantumDevice, isCalibrating, calibrationValue, targetFrequency]);
    
    const startCalibration = () => {
        setIsCalibrating(true);
        setCalibrationValue(Math.random());
        setTargetFrequency(0.3 + Math.random() * 0.7);
    };

    const finishCalibration = () => {
        const diff = Math.abs(calibrationValue - targetFrequency);
        const bonus = Math.max(0, 1 - (diff * 2)) * 0.1; // Max 10% bonus coherence
        onRecalibrate(bonus);
        setIsCalibrating(false);
    };

    const lerp = (a: number, b: number, t: number) => a + (b-a)*t;

    const drawOrb = (ctx: CanvasRenderingContext2D, x: number, y: number, radius: number, coherence: number, pulse: number, jitter: number, label: string) => {
        const currentRadius = radius + pulse;
        const currentX = x + (Math.random() - 0.5) * jitter;
        const currentY = y + (Math.random() - 0.5) * jitter;

        // Glow
        const glowGradient = ctx.createRadialGradient(currentX, currentY, currentRadius * 0.8, currentX, currentY, currentRadius * 2);
        glowGradient.addColorStop(0, `rgba(100, 220, 255, ${0.4 * coherence})`);
        glowGradient.addColorStop(1, 'rgba(100, 220, 255, 0)');
        ctx.fillStyle = glowGradient;
        ctx.beginPath();
        ctx.arc(currentX, currentY, currentRadius * 2, 0, Math.PI * 2);
        ctx.fill();

        // Core
        ctx.fillStyle = `rgba(150, 230, 255, ${0.8 * coherence})`;
        ctx.beginPath();
        ctx.arc(currentX, currentY, currentRadius, 0, Math.PI * 2);
        ctx.fill();
        
        // Label
        ctx.fillStyle = 'white';
        ctx.font = '10px Orbitron, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(label, currentX, currentY + radius + 20);
    };

    const formatComplex = (c: Complex): string => {
        const real = c[0].toFixed(2);
        const imag = c[1].toFixed(2);
        if (parseFloat(imag) === 0) return real;
        return `${real}${c[1] >= 0 ? '+' : ''}${imag}i`;
    };


    if (!quantumDevice || !quantumAnchor) {
        return <div className="text-center p-8">Initializing Quantum Core...</div>;
    }

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold text-cyan-400 font-orbitron">Quantum Entanglement Core</h2>

            <div className="bg-gray-800/50 rounded-lg p-4">
                <canvas ref={canvasRef} width="750" height="200" className="w-full h-auto"></canvas>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <MetricDisplay label="Coherence" value={quantumDevice.coherenceLevel} />
                <MetricDisplay label="Concurrence" value={metrics.concurrence} />
                <MetricDisplay label="Fidelity" value={metrics.fidelity} />
                <MetricDisplay label="vN Entropy" value={quantumDevice.vonNeumannEntropy} />
                <MetricDisplay label="Bell State" value={quantumDevice.bellState} />
                <MetricDisplay label="Negativity" value={metrics.negativity} />
                <div className="bg-gray-800/60 rounded-lg p-3 col-span-2">
                    <div className="text-xs text-cyan-300 uppercase font-mono tracking-wider mb-2">Density Matrix (ρ)</div>
                     <div className="font-mono text-white text-sm grid grid-cols-2 gap-2 text-center">
                        <div>[{formatComplex(quantumDevice.densityMatrix[0][0])}, {formatComplex(quantumDevice.densityMatrix[0][1])}]</div>
                        <div>[{formatComplex(quantumDevice.densityMatrix[1][0])}, {formatComplex(quantumDevice.densityMatrix[1][1])}]</div>
                    </div>
                </div>
            </div>
            
            <div className="bg-gray-800/50 rounded-lg p-4 flex flex-col items-center gap-4">
                {isCalibrating ? (
                    <div className="w-full space-y-4">
                        <div className="flex items-center justify-between text-xs font-mono text-cyan-400 uppercase tracking-widest">
                            <span>Frequency Modulator</span>
                            <span>Target Signal Match</span>
                        </div>
                        <input 
                            type="range" 
                            min="0.1" 
                            max="0.9" 
                            step="0.001" 
                            value={calibrationValue}
                            onChange={(e) => setCalibrationValue(parseFloat(e.target.value))}
                            className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-cyan-500"
                        />
                         <button
                            onClick={finishCalibration}
                            className="w-full py-3 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg font-bold transition-all shadow-lg shadow-cyan-500/20 uppercase tracking-widest"
                        >
                            Confirm Phase Alignment
                        </button>
                    </div>
                ) : (
                    <div className="w-full flex flex-col md:flex-row items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                            <label htmlFor="bell-state-select" className="text-gray-300 text-sm">Bell State:</label>
                            <select
                            id="bell-state-select"
                            value={selectedBellState}
                            onChange={(e) => onBellStateChange(e.target.value as BellState)}
                            className="bg-gray-700 text-white rounded-lg px-3 py-1 border border-gray-600 focus:border-cyan-500 outline-none font-mono"
                            >
                                {Object.values(BellState).map(state => (
                                    <option key={state} value={state}>{state}</option>
                                ))}
                            </select>
                        </div>
                        <button
                            onClick={startCalibration}
                            className="px-8 py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg font-bold transition-all shadow-lg shadow-cyan-500/10 uppercase tracking-wider"
                        >
                            Initialize Calibration
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default QuantumCorePanel;