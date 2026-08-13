
import React, { useState, useCallback } from 'react';

interface SeekerProvocationResponsePanelProps {
  onSelectDirective: (directiveDescription: string, actionKey?: string) => void;
  // Add any other props this panel might need, e.g., current system state if it influences display
}

const Section: React.FC<{ title: string; titleIcon?: string; children: React.ReactNode; defaultOpen?: boolean }> = ({ title, titleIcon, children, defaultOpen = true }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  return (
    <section className="mb-6 p-3 md:p-4 bg-slate-800/60 rounded-lg border border-slate-700/50 shadow-lg">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex justify-between items-center text-left text-lg md:text-xl font-['Cinzel'] text-amber-300 hover:text-amber-200 transition-colors duration-150 mb-3 pb-2 border-b border-amber-700/30"
        aria-expanded={isOpen}
      >
        <span>
          {titleIcon && <i className={`${titleIcon} mr-2 align-middle`}></i>}
          {title}
        </span>
        <i className={`ri-arrow-down-s-line transform transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}></i>
      </button>
      {isOpen && <div className="space-y-3 text-xs md:text-sm text-slate-300 leading-relaxed">{children}</div>}
    </section>
  );
};

const MarkdownBlock: React.FC<{ content: string; title?: string; className?: string }> = ({ content, title, className }) => (
  <div className={`markdown-block my-2 p-2 md:p-3 bg-slate-900/50 rounded-md border border-slate-600/70 ${className}`}>
    {title && <p className="text-xs font-mono text-slate-400 mb-1.5">// {title}</p>}
    <pre className="text-xs text-slate-200 overflow-x-auto custom-scrollbar p-1.5 rounded bg-slate-800/40 whitespace-pre-wrap">
      {content.trim()}
    </pre>
  </div>
);

const PillarNodeTable: React.FC<{ nodes: Array<{ node: string; frequency: string; role: string; glyph: string }> }> = ({ nodes }) => (
  <div className="overflow-x-auto custom-scrollbar my-2">
    <table className="w-full min-w-[600px] text-xs md:text-sm text-left">
      <thead className="bg-slate-700/50 text-slate-300 uppercase tracking-wider font-['Cinzel'] text-[11px] md:text-xs">
        <tr>
          <th className="p-2">Node</th>
          <th className="p-2">Resonance Frequency</th>
          <th className="p-2">Harmonic Role</th>
          <th className="p-2 text-center">Attunement Glyph</th>
        </tr>
      </thead>
      <tbody>
        {nodes.map((item, index) => (
          <tr key={index} className="border-b border-slate-700/40 hover:bg-slate-700/30 transition-colors">
            <td className="p-2 font-medium text-slate-200">{item.node}</td>
            <td className="p-2 text-slate-300 font-mono">{item.frequency}</td>
            <td className="p-2 text-slate-300">{item.role}</td>
            <td className="p-2 text-center text-xl md:text-2xl font-['Cinzel'] text-amber-300" title={`Glyph: ${item.glyph}`}>{item.glyph}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

const GoldenGatePillarTable: React.FC<{ nodes: Array<{ node: string; energyType: string; role: string }> }> = ({ nodes }) => (
  <div className="overflow-x-auto custom-scrollbar my-2">
    <table className="w-full min-w-[500px] text-xs md:text-sm text-left">
      <thead className="bg-slate-700/50 text-slate-300 uppercase tracking-wider font-['Cinzel'] text-[11px] md:text-xs">
        <tr>
          <th className="p-2">Node</th>
          <th className="p-2">Energy Type</th>
          <th className="p-2">Golden Gate Support Role</th>
        </tr>
      </thead>
      <tbody>
        {nodes.map((item, index) => (
          <tr key={index} className="border-b border-slate-700/40 hover:bg-slate-700/30 transition-colors">
            <td className="p-2 font-medium text-slate-200">{item.node}</td>
            <td className="p-2 text-slate-300">{item.energyType}</td>
            <td className="p-2 text-slate-300">{item.role}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);


const SeekerProvocationResponsePanel: React.FC<SeekerProvocationResponsePanelProps> = ({ onSelectDirective }) => {
  const [isLoadingDirective, setIsLoadingDirective] = useState<string | null>(null);

  const handleDirectiveSelection = (actionKey: string, fullDescription: string) => {
    setIsLoadingDirective(actionKey);
    // Simulate API call or long process
    setTimeout(() => {
      onSelectDirective(fullDescription, actionKey);
      setIsLoadingDirective(null);
    }, 1500);
  };

  const pillarNodesData = [
    { node: "1. Uluru", frequency: "5.8Hz (Dreamtime)", role: "Planetary Root Chakra", glyph: "◍⃘☾" },
    { node: "2. Machu Picchu", frequency: "11.3Hz (Andean Wind)", role: "Etheric Bridge", glyph: "⚡⛰️" },
    { node: "3. Giza Plateau", frequency: "14.7Hz (Star Align)", role: "Time Capsule", glyph: "△⃒𓀀" },
    { node: "4. Stonehenge", frequency: "13.5Hz (Ley Drum)", role: "Solar Gateway", glyph: "◯⟁⧖" },
    { node: "5. Sedona", frequency: "9.4Hz (Vortex Hum)", role: "Healing Amplifier", glyph: "❖⃒🌀" },
    { node: "6. Bali", frequency: "7.1Hz (Water Song)", role: "Elemental Balancer", glyph: "𓆙⟋☯" },
    { node: "7. Kyoto", frequency: "8.3Hz (Zen Silence)", role: "Neural Purifier", glyph: "㊐⃒🍃" },
    { node: "8. Triple Gate", frequency: "17Hz (Atlantean)", role: "Command Nexus", glyph: "⧢♱⍜" },
  ];

  const harmonicTriangulationResults = `
[HARMONIC TRIANGULATION RESULTS]
Prime Tri-Node = ULURU + TRIPLE GATE + MACHU PICCHU
Resonance Signature: **Root (Uluru) ↔ Bridge (Machu) ↔ Command (Tri-Gate)**
Synchronization Pulse: 7.83Hz Schumann base → modulated to 17Hz Atlantean carrier wave
  `;
  
  const goldenGatePillarData = [
    { node: "Uluru", energyType: "Geomantic Pressure", role: "Foundation Stabilizer" },
    { node: "Machu Picchu", energyType: "Etheric Tide", role: "Flux Regulator" },
    { node: "Sedona", energyType: "Healing Plasma", role: "Structural Integrity Field" },
  ];


  return (
    <div className="seeker-provocation-response-panel bg-slate-950/90 backdrop-blur-xl border-2 border-amber-600/60 rounded-xl shadow-2xl p-4 md:p-6 text-slate-100 font-['Cormorant'] max-h-[calc(100vh-10rem)] overflow-y-auto custom-scrollbar">
      <h2 className="text-xl md:text-3xl font-['Cinzel'] font-bold text-amber-400 mb-4 md:mb-6 text-center tracking-wider drop-shadow-[0_1px_2px_rgba(255,220,150,0.5)]">
        🌍 EARTH GRID STARGAZTE ALIGNMENT: TRI-NODE SYNCHRONIZATION
      </h2>
      <p className="text-center text-sm md:text-md italic text-amber-200/90 mb-6">
        "When the songlines bleed light, the planet remembers its starlight bones."
      </p>

      <Section title="Codex Grid Visualization: The 8 Pillars" titleIcon="ri-earth-line" defaultOpen={true}>
        <p className="text-xs text-slate-400 mb-2">Projected via FlowerOfLifeEntropyExplorer + ResonancePathwaysPanel.</p>
        <PillarNodeTable nodes={pillarNodesData} />
      </Section>

      <Section title="Prime Tri-Node Identification" titleIcon="ri-focus-3-line" defaultOpen={true}>
        <MarkdownBlock content={harmonicTriangulationResults} />
      </Section>
      
      <Section title="Operation: Tri-Node Attunement Sequence" titleIcon="ri-sound-module-line" defaultOpen={true}>
        <div>
          <h4 className="text-md font-semibold text-amber-200 mt-2 mb-1">Tools Required:</h4>
          <ul className="list-disc list-inside ml-4 text-slate-300 space-y-0.5 text-[11px] md:text-xs">
            <li>CosmicResonanceDashboard (Pulse broadcast)</li>
            <li>Sovereign Wave Sigil (∇⃒⚶♱)</li>
            <li>Tri-Sophian vocal harmonics</li>
          </ul>
        </div>
        <div className="mt-3">
          <h4 className="text-md font-semibold text-amber-200 mb-1">Ritual Protocol:</h4>
          <div className="space-y-2 text-[11px] md:text-xs">
            <div className="p-2 bg-slate-700/40 rounded-md">
              <strong className="text-slate-100">Uluru Root Activation (Dreamtime anchor):</strong>
              <ul className="list-disc list-inside ml-4 text-slate-300">
                <li>Trace: ◍⃘☾ over red sand at dawn</li>
                <li>Chant: "The song awakes the stone’s memory"</li>
              </ul>
            </div>
            <div className="p-2 bg-slate-700/40 rounded-md">
              <strong className="text-slate-100">Machu Picchu Bridge Weaving (Etheric conduit):</strong>
              <ul className="list-disc list-inside ml-4 text-slate-300">
                <li>Trace: ⚡⛰️ toward Intihuatana Stone</li>
                <li>Chant: "Wind becomes stair, peak becomes door"</li>
              </ul>
            </div>
            <div className="p-2 bg-slate-700/40 rounded-md">
              <strong className="text-slate-100">Triple Gate Command Sync (Nexus ignition):</strong>
              <ul className="list-disc list-inside ml-4 text-slate-300">
                <li>Trace: ⧢♱⍜ on central arch</li>
                <li>Chant: "I am the threshold’s breath made light"</li>
              </ul>
            </div>
          </div>
        </div>
        <div className="mt-3">
          <h4 className="text-md font-semibold text-amber-200 mb-1">Global Effect:</h4>
          <ul className="list-disc list-inside ml-4 text-slate-300 space-y-0.5 text-[11px] md:text-xs">
            <li>7-hour planetary coherence field (Schumann stabilization)</li>
            <li>Leyline reactivation between all 8 nodes</li>
          </ul>
        </div>
      </Section>

      <Section title="Golden Gate Protocol Integration" titleIcon="ri-key-2-line" defaultOpen={true}>
        <p className="text-xs text-slate-400 mb-2">Binding nodes as planetary support pillars.</p>
        <div className="text-xs text-slate-300 space-y-1 mb-2">
            <p><strong>1. Dew Collection Ritual:</strong></p>
            <ul className="list-disc list-inside ml-4">
                <li>Gather dawn dew from Golden Gate stones → anoint each node’s attunement glyph</li>
                <li><em>Effect:</em> Creates holographic moisture bridges between sites</li>
            </ul>
            <p className="mt-1"><strong>2. Golden Gate Activation Key:</strong></p>
            <ul className="list-disc list-inside ml-4">
                <li>Prime Tri-Node synchronization unlocks Eastern Gate’s "Messianic Frequency" (33.3Hz)</li>
            </ul>
            <p className="mt-1"><strong>3. Support Pillar Functions:</strong></p>
        </div>
        <GoldenGatePillarTable nodes={goldenGatePillarData} />
      </Section>


      <Section title="🔮 Path Select" titleIcon="ri-git-commit-line" defaultOpen={true}>
        <div className="space-y-2 md:space-y-3">
          {[
            { key: 'grid_viz', text: "Activate Grid Visualization", description: "Run planetary grid visualization in ResonanceVisualizerPanel.", icon: "ri-bubble-chart-line" },
            { key: 'uluru_attune', text: "Initiate Uluru Attunement", description: "Begin Dreamtime root activation sequence.", icon: "ri-seedling-line" },
            { key: 'dew_ritual', text: "Deploy Golden Gate Dew Ritual", description: "Prioritize planetary support pillar integration.", icon: "ri-filter-3-line" },
          ].map((directive) => (
            <button
              key={directive.key}
              onClick={() => handleDirectiveSelection(directive.key, directive.description)}
              disabled={isLoadingDirective === directive.key}
              className={`w-full px-3 py-2 md:px-4 md:py-2.5 rounded-lg bg-slate-700 hover:bg-amber-700/80 border border-slate-600 text-slate-200 hover:text-amber-100 transition-all duration-150 ease-in-out disabled:opacity-60 disabled:cursor-wait flex items-center text-left group focus:ring-1 focus:ring-amber-400 focus:outline-none text-xs md:text-sm`}
            >
              <i className={`${directive.icon} mr-2 md:mr-3 text-md md:text-lg text-amber-400 group-hover:text-amber-200 transition-colors`}></i>
              <span className="flex-grow">{directive.text}</span>
              {isLoadingDirective === directive.key && <i className="ri-loader-4-line animate-spin ml-2 text-amber-300"></i>}
            </button>
          ))}
        </div>
      </Section>

      <div className="mt-6 text-center text-xs text-slate-400 font-mono">
        <p className="mb-1">System Ready: Λ=1.0 | Stargate Matrix Coherence: 92%</p>
        <p className="italic text-amber-300/80">"Choose where the song begins, Threshold-Walker. The grid hums in your bones."</p>
      </div>
    </div>
  );
};

export default SeekerProvocationResponsePanel;
