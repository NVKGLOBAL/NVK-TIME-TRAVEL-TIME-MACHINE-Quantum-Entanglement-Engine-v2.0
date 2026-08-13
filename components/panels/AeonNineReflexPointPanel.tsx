
import React, { useState } from 'react';
import { AgentName } from '../../types'; // For logging

interface AeonNineReflexPointPanelProps {
  onSelectDirective: (directiveDescription: string) => void;
}

const CodeBlock: React.FC<{ code: string; language: string; title?: string }> = ({ code, language, title }) => (
  <div className="my-3 bg-slate-800/70 p-3 rounded-lg border border-slate-700/60 shadow-inner">
    {title && <p className="text-xs text-slate-400 mb-1 font-mono">// {title}</p>}
    <pre className="text-xs text-slate-200 overflow-x-auto custom-scrollbar p-2 rounded bg-slate-900/50">
      <code className={`language-${language}`}>{code.trim()}</code>
    </pre>
  </div>
);

const OutputBlock: React.FC<{ title: string; content: string[] }> = ({ title, content }) => (
  <div className="my-3 p-3 bg-slate-800/70 rounded-lg border border-amber-600/50 text-amber-300">
    <p className="text-xs font-mono text-amber-400 mb-1.5">{title}:</p>
    {content.map((line, index) => (
      <p key={index} className="text-xs font-mono leading-snug">{line}</p>
    ))}
  </div>
);

const AeonNineReflexPointPanel: React.FC<AeonNineReflexPointPanelProps> = ({ onSelectDirective }) => {
  const [isLoadingDirective, setIsLoadingDirective] = useState<string | null>(null);

  const handleSelectDirective = (directiveKey: string, description: string) => {
    setIsLoadingDirective(directiveKey);
    // Simulate an async operation
    setTimeout(() => {
      onSelectDirective(description);
      setIsLoadingDirective(null);
    }, 1200);
  };
  
  const analysisData = [
    { metric: "Protoculture Flux", value: "8.7×10^14 Glyph-Joules", interpretation: "Stratum-wide awakening threshold" },
    { metric: "Invid Dissipation", value: "94.2%", interpretation: "Entity-class fragmented to spores" },
    { metric: "Zentraedi Sync Rate", value: "73.6%", interpretation: "Genetic-memetic reintegration" },
    { metric: "Residual Threat", value: "Robotech Masters Echo", interpretation: "Archiver-class seeking AX-Ω.001" },
  ];

  const directives = [
    { key: "cards", icon: "ri-gallery-line", text: "Generate Ritual Loadout Cards for Veritech & Zentraedi units.", fullDescription: "Generate Ritual Loadout Cards for Veritech Transformable Vessels (Guardian Mode focus) and Zentraedi Macroscale Entities (Post-awakening)." },
    { key: "trace", icon: "ri-radar-line", text: "Trace Robotech Masters Echo to Tirol (Origin World Node).", fullDescription: "Trace Robotech Masters Echo to Tirol (Origin World Node) via Fold Paths." },
    { key: "barrier", icon: "ri-shield-star-line", text: "Deploy Omni-Directional Barrier around Monument City.", fullDescription: "Deploy Omni-Directional Barrier around Monument City (Archive Node)." },
  ];

  return (
    <div className="aeon-nine-reflex-panel bg-slate-950/90 backdrop-blur-xl border-2 border-purple-600/60 rounded-xl shadow-2xl p-6 text-slate-100 font-['Cormorant']">
      <h2 className="text-3xl font-['Cinzel'] font-bold text-purple-300 mb-6 text-center tracking-wider drop-shadow-[0_1px_2px_rgba(200,150,255,0.6)]">
        <i className="ri-focus-3-line mr-3 text-purple-400 animate-pulse-fast"></i>
        ÆON-9 REFLEX POINT SIMULATION
      </h2>

      <section className="mb-6 p-3 bg-slate-900/60 rounded-lg border border-slate-700/50">
        <p className="text-sm text-purple-200"><strong className="font-semibold">Directive Accepted:</strong> ÆON-9 Integration</p>
        <p className="text-xs text-slate-300"><strong className="text-slate-100">Selected Integration:</strong> 💠 Simulate Reflex Point Event (AX-Ω.000 Tier)</p>
        <p className="text-xs text-slate-300"><strong className="text-slate-100">Resonance Matrix:</strong> Flower of Life glyph engaged. Hyperspace Fold Paths mapped for temporal anchoring.</p>
      </section>

      {/* Simulation Phases */}
      <div className="grid md:grid-cols-2 gap-6 mb-8">
        {/* Phase 1 */}
        <section className="p-4 bg-slate-900/70 rounded-lg border border-slate-700/60">
          <h3 className="text-xl font-['Cinzel'] text-sky-300 mb-3">Phase 1: Harmonic Convergence</h3>
          <CodeBlock language="python" title="CODEX RUNTIME ENGINE v.9.7" code={`
import Protoculture_Core as PC
from Glyph_Constellation import AX_Ω_000, AX_Ω_001

# Activate Flower of Life (Primal Glyph)
PC.inject_glyph(AX_Ω_001, entropy_threshold=0.05)

# Initiate Fold Paths to AX-Ω.000
fold_path = PC.generate_fold_path(
    origin="ALuCE",
    destination=AX_Ω_000,
    chrono_compression="83%" # SX Point 83 Inflection
)
          `} />
          <OutputBlock title="Output" content={[
            "INVID HIVE ENTITY-CLASS: INV-Δ DETECTED",
            "SYNCHRONICITY WAVEFORM: 99.7%",
            "ZENTRAEDI MACROSCALE ENTITIES: REAWAKENING"
          ]} />
        </section>

        {/* Phase 2 */}
        <section className="p-4 bg-slate-900/70 rounded-lg border border-slate-700/60">
          <h3 className="text-xl font-['Cinzel'] text-rose-300 mb-3">Phase 2: Resonance Cascade</h3>
          <div className="text-xs text-slate-300 mb-3 p-2 bg-slate-800/50 rounded border border-slate-700/50">
            <p className="font-semibold text-slate-200 mb-1">Codex Event Log:</p>
            <ul className="list-disc list-inside ml-3 space-y-0.5">
              <li>Grand Cannon (Planetary Anchor) → Overloaded. Redirecting energy to Reflex Furnace.</li>
              <li>Daedalus Maneuver initiated → Spatial collapse inverted. Battloid ArmorShells phase-shifting.</li>
              <li>Omni-Directional Barrier (OBDS) destabilized by Invid Echo-Spores.</li>
            </ul>
          </div>
          <CodeBlock language="lua" title="Tactical Ritual Override" code={`
-- DEPLOY: Wolf Pack (Seeker Cell WOLF)
local wolf_pack = {
  units = { "Varitech VF-1S", "Destroid MBR-04" },
  ritual = "Recursion Adaptation",
  sync_glyph = "AX_Ω_000" -- Note: Corrected from image to be valid Lua string
}

wolf_pack:execute("Ritual_Override") -- Returns "Fold Jump: 15th ATAC Cluster"
          `} />
           <OutputBlock title="Result" content={[
            "INVID HIVE COLLAPSE AT AX-Ω.000 EPICENTER",
            "PROTOCULTURE GLYPH: LIFE-PRIME AMPLIFIED ×10^3",
            "CODA: Harmonic silence → Residual dream-thread detected (Optera Origin Stratum)"
          ]} />
        </section>
      </div>
      
      {/* Post-Simulation Analysis */}
      <section className="mb-8 p-4 bg-slate-900/70 rounded-lg border border-slate-700/60">
        <h3 className="text-xl font-['Cinzel'] text-amber-300 mb-3">🌌 Post-Simulation Codex Analysis</h3>
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-800/50">
              <tr>
                <th className="p-2 font-semibold text-slate-300">Metric</th>
                <th className="p-2 font-semibold text-slate-300">Value</th>
                <th className="p-2 font-semibold text-slate-300">Interpretation</th>
              </tr>
            </thead>
            <tbody>
              {analysisData.map((row, index) => (
                <tr key={index} className="border-b border-slate-700/50 hover:bg-slate-800/30 transition-colors">
                  <td className="p-2 text-amber-200 font-medium">{row.metric}</td>
                  <td className="p-2 text-slate-200 font-mono">{row.value}</td>
                  <td className="p-2 text-slate-300 italic">{row.interpretation}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Next Directives */}
      <section className="mt-10 p-4 bg-gradient-to-br from-purple-900/60 via-slate-900/80 to-sky-900/60 rounded-xl border-2 border-purple-500 shadow-2xl">
        <h3 className="text-2xl font-['Cinzel'] text-purple-200 mb-4 text-center">
          <i className="ri-arrow-right-double-line mr-2"></i>Next Directives (ÆON-9)
        </h3>
        <div className="space-y-3">
          {directives.map((directive) => (
            <button
              key={directive.key}
              onClick={() => handleSelectDirective(directive.key, directive.fullDescription)}
              disabled={isLoadingDirective === directive.key}
              className={`w-full px-4 py-2.5 rounded-lg bg-slate-800 hover:bg-slate-700/80 border border-slate-700 text-slate-200 hover:text-purple-300 transition-all duration-150 ease-in-out disabled:opacity-70 disabled:cursor-wait flex items-center text-left group focus:ring-2 focus:ring-purple-400 focus:outline-none`}
            >
              <i className={`${directive.icon} mr-3 text-lg text-purple-400 group-hover:text-purple-300 transition-colors`}></i>
              <span className="flex-grow text-sm">{directive.text}</span>
              {isLoadingDirective === directive.key && <i className="ri-loader-4-line animate-spin ml-2 text-purple-300"></i>}
            </button>
          ))}
        </div>
      </section>
      
      <p className="text-center text-xs text-slate-500 mt-8 font-mono">
        <em className="text-purple-400">"When the Flower blooms at ground zero, even shadows resonate."</em><br/>― Tri-Sophian Datachega Glyph 9.7
      </p>
    </div>
  );
};

export default AeonNineReflexPointPanel;
