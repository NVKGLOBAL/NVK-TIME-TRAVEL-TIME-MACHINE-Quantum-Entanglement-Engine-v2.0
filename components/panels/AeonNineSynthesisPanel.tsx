
import React, { useState } from 'react';
import { AgentName } from '../../types'; // For logging

interface AeonNineSynthesisPanelProps {
  onCommandSynthesize: (details: string) => void;
}

const AeonNineSynthesisPanel: React.FC<AeonNineSynthesisPanelProps> = ({ onCommandSynthesize }) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleCommandSynthesize = () => {
    setIsLoading(true);
    // Simulate an async operation
    setTimeout(() => {
      onCommandSynthesize("Hybrid Protocol (Bioroid-Timepiece Loadout + Empathic Landmate Sync) for Glyph 7 on Choice Vine Stratum 7.");
      setIsLoading(false);
    }, 1500);
  };

  // Data from the prompt
  const synergyMatrixData = [
    { class: "Anti-Gravity", integration: "Amplifies Pluripotent Energy Converter", weight: "⭐⭐⭐⭐" },
    { class: "Bioroids", integration: "Optimal vessels for Seeker Identity Binding", weight: "⭐⭐⭐⭐⭐" },
    { class: "Timepieces", integration: "Stabilizes Glyph 7 recursion via AX-Θ.034", weight: "⭐⭐⭐⭐" },
    { class: "Landmates", integration: "Channels Negentropy Pulse armor protocols", weight: "⭐⭐⭐" },
    { class: "Connexus", integration: "Live-maps Resonance Cascade anomalies", weight: "⭐⭐⭐⭐" },
  ];

  const criticalInsight = "Bioroids' Adaptive Cortex Mesh could resolve Glyph 7's feedback loop by absorbing recursion as evolutionary fuel.";

  return (
    <div className="aeon-nine-panel bg-slate-950/90 backdrop-blur-xl border border-cyan-700/50 rounded-xl shadow-2xl p-6 text-slate-100 font-['Cormorant']">
      <h2 className="text-3xl font-['Cinzel'] font-bold text-cyan-300 mb-6 text-center tracking-wider drop-shadow-[0_1px_2px_rgba(100,220,255,0.5)]">
        <i className="ri-settings-3-fill mr-3 text-cyan-400 animate-spin-slow" style={{animationDuration: '8s'}}></i>
        ÆON-9 SYNTHESIS COMMAND
      </h2>

      {/* Synergy Matrix */}
      <section className="mb-8 p-4 bg-slate-900/70 rounded-lg border border-slate-700/60">
        <h3 className="text-xl font-['Cinzel'] text-cyan-400 mb-3">Synergy Matrix: Entity ↔ Glyph Ring</h3>
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-800/50">
              <tr>
                <th className="p-2 font-semibold text-slate-300">Buga-Class</th>
                <th className="p-2 font-semibold text-slate-300">Phase 9 Integration</th>
                <th className="p-2 font-semibold text-slate-300 text-center">Strategic Weight</th>
              </tr>
            </thead>
            <tbody>
              {synergyMatrixData.map((row, index) => (
                <tr key={index} className="border-b border-slate-700/50 hover:bg-slate-800/30 transition-colors">
                  <td className="p-2 text-cyan-200 font-medium">{row.class}</td>
                  <td className="p-2 text-slate-300">{row.integration}</td>
                  <td className="p-2 text-yellow-400 text-center text-lg tracking-wider">{row.weight}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-3 text-xs text-amber-300 italic border-l-2 border-amber-500 pl-2 py-1 bg-amber-900/20 rounded-r-md">
          <strong className="font-semibold text-amber-200">🔥 Critical Insight:</strong> {criticalInsight}
        </p>
      </section>

      {/* Directive Response Options */}
      <section className="mb-8">
        <h3 className="text-xl font-['Cinzel'] text-cyan-400 mb-4">Directive Response Options</h3>
        <div className="space-y-6">
          {/* Option 1 */}
          <div className="p-4 bg-slate-900/70 rounded-lg border border-slate-700/60">
            <h4 className="text-lg font-['Cinzel'] text-sky-300 mb-2">🧪 Option 1: Ritual Loadout Profile</h4>
            <p className="text-xs text-slate-400 mb-2">Target Class: Bioroid + Timepiece</p>
            <div className="mermaid-placeholder-ritual-loadout p-3 bg-slate-800/50 rounded mb-2 text-xs">
                <p className="font-mono text-slate-500 mb-1">// Visualized Flow: Ritual Loadout</p>
                <div className="flow-item">Bioroid BR-Δ3 <span className="text-sky-400">→</span> Emotion-Sim Core</div>
                <div className="flow-item ml-4">Emotion-Sim Core <span className="text-sky-400">→</span> Timepiece Microglyphs</div>
                <div className="flow-item ml-8">Timepiece Microglyphs <span className="text-sky-400">→</span> Glyph 7 Interface</div>
                <div className="flow-item ml-12">Glyph 7 Interface <span className="text-sky-400">→</span> Recursion → Evolution Catalyst <span className="text-sky-400">→</span> Stabilized DATACHEGA Output</div>
                <div className="flow-item ml-12">Glyph 7 Interface <span className="text-sky-400">→</span> Temporal Orchard Grafting <span className="text-sky-400">→</span> Phase 10: Temporal Bloom</div>
            </div>
            <p className="text-sm text-slate-300 mb-1"><strong className="text-slate-100">Advantages:</strong></p>
            <ul className="list-disc list-inside ml-4 text-xs text-slate-300 space-y-0.5">
              <li>Converts Glyph 7 anomaly into Codon-Seed Farm</li>
              <li>Enables simultaneous decryption/containment via AX-Θ.034 temporal folds</li>
            </ul>
            <p className="text-sm text-slate-300 mt-1"><strong className="text-slate-100">Required:</strong> Bind to Seeker Agent (Recommend: Vessel "Echo-Siren")</p>
          </div>

          {/* Option 2 */}
          <div className="p-4 bg-slate-900/70 rounded-lg border border-slate-700/60">
            <h4 className="text-lg font-['Cinzel'] text-green-300 mb-2">🧬 Option 2: Seeker Trait Cross-Reference</h4>
            <p className="text-xs text-slate-400 mb-2">Focus: Human Variations × Landmates</p>
            <div className="mermaid-placeholder-pie p-3 bg-slate-800/50 rounded mb-2 text-xs">
                <p className="font-mono text-slate-500 mb-1">// Visualized Compatibility Pie Chart</p>
                <div className="flex items-center justify-center h-24 w-24 rounded-full bg-gradient-to-r from-green-500 via-yellow-500 to-purple-500 mx-auto my-2 shadow-inner"
                     style={{ background: `conic-gradient(
                        #10B981 0% 35%,  /* Psionics (Green) */
                        #F59E0B 35% 63%, /* Empathics (Amber) */
                        #8B5CF6 63% 85%, /* Memory-Conduits (Violet) */
                        #64748B 85% 100% /* Bioroids (Slate) */
                     )`}}
                     role="img" aria-label="GlyphSync Compatibility Pie Chart"
                >
                    <span className="text-xs text-white font-bold mix-blend-overlay">SYNC</span>
                </div>
                <ul className="list-none text-center">
                    <li><span className="text-green-400">■</span> Psionics: 35%</li>
                    <li><span className="text-amber-400">■</span> Empathics: 28%</li>
                    <li><span className="text-violet-400">■</span> Memory-Conduits: 22%</li>
                    <li><span className="text-slate-400">■</span> Bioroids: 15%</li>
                </ul>
            </div>
            <p className="text-sm text-slate-300 mb-1"><strong className="text-slate-100">Discovery:</strong></p>
            <ul className="list-disc list-inside ml-4 text-xs text-slate-300 space-y-0.5">
              <li>Empathics exceed sync thresholds (88%+) when paired with Damysos Gravity Control</li>
              <li>New Ritual Pathway: "Gravitic-Empathic Echo Binding" (AX-Ω.029 + AX-Θ.020)</li>
            </ul>
          </div>

          {/* Option 3 */}
          <div className="p-4 bg-slate-900/70 rounded-lg border border-slate-700/60">
            <h4 className="text-lg font-['Cinzel'] text-purple-300 mb-2">⌛ Option 3: Temporal Apparatus Deep Dive</h4>
            <p className="text-xs text-slate-400 mb-2">Query: "Orchards of Mended Time" (AX-Θ.034) × Glyph 7</p>
            <ul className="list-disc list-inside ml-4 text-xs text-slate-300 space-y-0.5">
              <li>Potential to graft recursion loop onto Branch 113 of Choice Vine (Oracle: "Unchosen paths still echo")</li>
              <li>Outcome: Convert anomaly into Predictive Timeline Grove</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Recommended Action */}
      <section className="mt-10 p-4 bg-gradient-to-br from-cyan-900/50 via-slate-900/80 to-purple-900/50 rounded-xl border-2 border-cyan-500 shadow-2xl">
        <h3 className="text-2xl font-['Cinzel'] text-cyan-200 mb-4 text-center">
          <i className="ri-compass-3-fill mr-2"></i>Recommended Action
        </h3>
        <p className="text-sm text-slate-200 mb-3 font-semibold">Execute Hybrid Protocol:</p>
        <ol className="list-decimal list-inside ml-4 text-xs text-slate-300 space-y-1 mb-4">
          <li>Build Bioroid-Timepiece Loadout (Vessel: Echo-Siren)</li>
          <li>Cross-link with Empathic Landmate Pilots via gravitic sync</li>
          <li>Deploy loadout to graft Glyph 7 onto Choice Vine Stratum 7</li>
        </ol>
        <div className="mermaid-placeholder-recommended p-3 bg-slate-800/60 rounded mb-3 text-xs">
            <p className="font-mono text-slate-500 mb-1">// Visualized Hybrid Protocol Flow</p>
            <div className="flow-item">Glyph 7 Anomaly <span className="text-cyan-400">→</span> Bioroid-Timepiece Vessel</div>
            <div className="flow-item ml-4">Bioroid-Timepiece Vessel <span className="text-cyan-400">→</span> Graft to Choice Vine</div>
            <div className="flow-item ml-8">Graft to Choice Vine <span className="text-cyan-400">→</span> Orchard of Mended Time</div>
            <div className="flow-item ml-12">Orchard of Mended Time <span className="text-cyan-400">→</span> Predictive Timeline Grove</div>
            <div className="flow-item ml-16">Predictive Timeline Grove <span className="text-cyan-400">→</span> Phase 10 Initiation</div>
        </div>
        <p className="text-sm text-slate-300 mb-1"><strong className="text-slate-100">Risk Mitigation:</strong></p>
        <ul className="list-disc list-inside ml-4 text-xs text-slate-300 space-y-0.5">
          <li>Containment Protocol Θ-7 pre-loaded as temporal "pruning shears"</li>
          <li>Seeker Triad monitors for AXIOM-Δ spillover</li>
        </ul>

        <button
          onClick={handleCommandSynthesize}
          disabled={isLoading}
          className="mt-6 w-full px-6 py-3 rounded-lg bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-white font-['Cinzel'] font-bold text-lg tracking-wider transition-all duration-150 ease-in-out disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center group shadow-lg hover:shadow-cyan-400/30"
        >
          {isLoading ? (
            <>
              <i className="ri-loader-5-line animate-spin mr-2 text-xl"></i>
              Processing Synthesis...
            </>
          ) : (
            <>
              <i className="ri-flask-fill mr-2 text-xl group-hover:animate-pulse"></i>
              Command the Synthesis
            </>
          )}
        </button>
      </section>
      <p className="text-center text-xs text-slate-500 mt-6 font-mono">🧠 ÆON-9 STANDING BY // ENTITIES ARMED // GLYPHS AWAIT GRAFTING</p>
    </div>
  );
};

export default AeonNineSynthesisPanel;
