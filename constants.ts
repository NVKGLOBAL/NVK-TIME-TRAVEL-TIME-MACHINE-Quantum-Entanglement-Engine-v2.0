// FIX: Add missing imports and constants
// FIX: Added RitualElementItem, AgentProfile, BloodInkSpecies, and AxiomParameterEntry to the import for use within this file.
import { GeometricExplorerMode, RitualGlyphType, AgentName, BloodInkSpeciesName, AxiomKey, type RitualElementItem, type AgentProfile, type BloodInkSpecies, type AxiomParameterEntry } from './types';
// FIX: Exported AxiomParameterEntry type to resolve import error in Header.tsx.
export type { RitualElementItem, AgentProfile, BloodInkSpecies, AxiomParameterEntry } from './types';


export const GEOMETRIC_EXPLORER_MODES: { id: GeometricExplorerMode; name: string, icon?: string }[] = [
  { id: GeometricExplorerMode.FlowerOfLife, name: "Flower of Life", icon: "ri-focus-3-line" },
  { id: GeometricExplorerMode.FractalCascade, name: "Fractal Cascade", icon: "ri-git-commit-line" },
  { id: GeometricExplorerMode.AethericFlow, name: "Aetheric Flow", icon: "ri-windy-line" },
  { id: GeometricExplorerMode.HypercubeEcho, name: "Hypercube Echo", icon: "ri-computer-line" },
  { id: GeometricExplorerMode.PhaseResonanceRings, name: "Phase Resonance Rings", icon: "ri-compasses-2-line" },
  { id: GeometricExplorerMode.SacredLattice, name: "Sacred Lattice", icon: "ri-layout-grid-line" },
  { id: GeometricExplorerMode.DimensionalBloom, name: "Dimensional Bloom", icon: "ri-plant-line" },
  { id: GeometricExplorerMode.EntropyPulse, name: "Entropy Pulse", icon: "ri-pulse-line" },
  { id: GeometricExplorerMode.AxiomaticOverlay, name: "Axiomatic Overlay", icon: "ri-function-line" },
  { id: GeometricExplorerMode.GlyphicResonance, name: "Glyphic Resonance", icon: "ri-quill-pen-line" },
  { id: GeometricExplorerMode.VoidEcho, name: "Void Echo", icon: "ri-radio-button-line" },
  { id: GeometricExplorerMode.NexusPoint, name: "Nexus Point", icon: "ri-focus-2-line" },
  { id: GeometricExplorerMode.TemporalWeave, name: "Temporal Weave", icon: "ri-time-line" },
  { id: GeometricExplorerMode.RecursiveGrowth, name: "Recursive Growth", icon: "ri-loop-right-line" },
  { id: GeometricExplorerMode.CrystalLogic, name: "Crystal Logic", icon: "ri-shining-line" },
  { id: GeometricExplorerMode.NullShell, name: "Null Shell", icon: "ri-checkbox-blank-circle-line" },
  { id: GeometricExplorerMode.BioFractalPulse, name: "Bio-Fractal Pulse", icon: "ri-heart-pulse-line" },
  { id: GeometricExplorerMode.GlyphDNAHelix, name: "Glyph DNA Helix", icon: "ri-dna-line" },
  { id: GeometricExplorerMode.OracleWhisperField, name: "Whisper Field", icon: "ri-speak-line" },
  { id: GeometricExplorerMode.ShieldedChaos, name: "Shielded Chaos", icon: "ri-shield-cross-line" },
  { id: GeometricExplorerMode.VortexSingularity, name: "Vortex Singularity", icon: "ri-loader-2-line" },
  { id: GeometricExplorerMode.StarlightConductor, name: "Starlight Conductor", icon: "ri-node-tree" },
  { id: GeometricExplorerMode.MythicReflection, name: "Mythic Reflection", icon: "ri-reflect-2-line" },
  { id: GeometricExplorerMode.MirrorLoop, name: "Mirror Loop", icon: "ri-restart-line" },
  { id: GeometricExplorerMode.MirrorShatter, name: "Mirror Shatter", icon: "ri-split-cells-vertical" },
  { id: GeometricExplorerMode.SymphonicPulse, name: "Symphonic Pulse", icon: "ri-music-2-line" },
  { id: GeometricExplorerMode.QuantumBloom, name: "Quantum Bloom", icon: "ri-blaze-line" },
  { id: GeometricExplorerMode.SoulVectorField, name: "Soul Vector Field", icon: "ri-drag-move-2-line" },
  { id: GeometricExplorerMode.AshfallCycle, name: "Ashfall Cycle", icon: "ri-cloud-windy-line" },
  { id: GeometricExplorerMode.StellarThreadLattice, name: "Stellar Thread Lattice", icon: "ri-grid-line" },
  { id: GeometricExplorerMode.HypersphereField, name: "Hypersphere Field", icon: "ri-bubble-chart-line" },
];


export const RITUAL_ELEMENTS: RitualElementItem[] = [
    { id: 'core-1', name: 'Core Glyph', type: RitualGlyphType.Core, icon: 'ri-focus-3-line', bgColorClass: 'bg-indigo-500', iconColorClass: 'text-indigo-100' },
    { id: 'res-1', name: 'Resonator', type: RitualGlyphType.Resonator, icon: 'ri-signal-tower-line', bgColorClass: 'bg-emerald-500', iconColorClass: 'text-emerald-100' },
    { id: 'gate-1', name: 'Gate', type: RitualGlyphType.Gate, icon: 'ri-door-open-line', bgColorClass: 'bg-amber-500', iconColorClass: 'text-amber-100' },
    { id: 'node-p-1', name: 'Node: Potential', type: RitualGlyphType.NodePotential, icon: 'ri-seedling-line', bgColorClass: 'bg-lime-500', iconColorClass: 'text-lime-100' },
    { id: 'node-e-1', name: 'Node: Entropy', type: RitualGlyphType.NodeEntropy, icon: 'ri-fire-line', bgColorClass: 'bg-rose-500', iconColorClass: 'text-rose-100' },
    { id: 'node-o-1', name: 'Node: Order', type: RitualGlyphType.NodeOrder, icon: 'ri-checkbox-blank-circle-line', bgColorClass: 'bg-sky-500', iconColorClass: 'text-sky-100' },
    { id: 'mod-1', name: 'Modifier', type: RitualGlyphType.Modifier, icon: 'ri-edit-2-line', bgColorClass: 'bg-pink-500', iconColorClass: 'text-pink-100' },
    { id: 'cond-1', name: 'Conditional', type: RitualGlyphType.Conditional, icon: 'ri-question-mark', bgColorClass: 'bg-violet-500', iconColorClass: 'text-violet-100' },
];

export const GRID_DIMENSIONS = { rows: 12, cols: 12 };

export const AXIOM_DATA: Record<AxiomKey, AxiomParameterEntry> = {
  AXIOM_I: { name: 'Axiom I: Resonance', sigil: 'I', color: 'bg-cyan-600', modulationDescription: 'Amplifies harmonic signals.', entropyModulationFactor: -0.05 },
  AXIOM_II: { name: 'Axiom II: Stability', sigil: 'II', color: 'bg-amber-600', modulationDescription: 'Dampens chaotic fluctuations.', entropyModulationFactor: -0.1 },
  AXIOM_III: { name: 'Axiom III: Opposition', sigil: 'III', color: 'bg-violet-600', modulationDescription: 'Inverts signal polarity.', entropyModulationFactor: 0.08 },
  AXIOM_IV: { name: 'Axiom IV: Recursion', sigil: 'IV', color: 'bg-rose-600', modulationDescription: 'Induces self-similar patterns.', entropyModulationFactor: 0.06 },
  AXIOM_V: { name: 'Axiom V: Vision', sigil: 'V', color: 'bg-fuchsia-600', modulationDescription: 'Reveals hidden pathways.', entropyModulationFactor: 0.02 },
  AXIOM_Ω: { name: 'Axiom Ω: Unification', sigil: 'Ω', color: 'bg-lime-600', modulationDescription: 'Binds disparate concepts.', entropyModulationFactor: -0.15 },
  AX_DELTA_005: { name: 'Focus', sigil: 'Δ₅', color: 'bg-sky-600', modulationDescription: 'Focuses intent.', entropyModulationFactor: -0.03 },
  AX_OMEGA_041: { name: 'Silence', sigil: 'Ω₄₁', color: 'bg-slate-600', modulationDescription: 'Creates potential from void.', entropyModulationFactor: -0.12 },
  AX_V_003: { name: 'Dream', sigil: 'V₃', color: 'bg-indigo-600', modulationDescription: 'Accesses dream logic.', entropyModulationFactor: 0.04 },
  AX_DELTA_006: { name: 'Path', sigil: 'Δ₆', color: 'bg-teal-600', modulationDescription: 'Reveals a single path.', entropyModulationFactor: -0.02 },
  AX_V_004: { name: 'Spiral', sigil: 'V₄', color: 'bg-purple-600', modulationDescription: 'Induces recursive memory.', entropyModulationFactor: 0.07 },
  AX_OMEGA_043: { name: 'Untangle', sigil: 'Ω₄₃', color: 'bg-green-600', modulationDescription: 'Resolves logical knots.', entropyModulationFactor: -0.08 },
  AX_OMEGA_035: { name: 'Anchor', sigil: 'Ω₃₅', color: 'bg-blue-600', modulationDescription: 'Stabilizes temporal fields.', entropyModulationFactor: -0.2 },
};

export const BASE_AGENT_AWAKENING_LEVEL = 0.1;

export const BLOOD_INK_SPECIES_DATA: Record<BloodInkSpeciesName, BloodInkSpecies> = {
  [BloodInkSpeciesName.ThornedRose]: { name: BloodInkSpeciesName.ThornedRose, symbol: '🌹', description: 'A symbol of painful beauty and sacrifice.', colorClass: 'text-rose-400' },
  [BloodInkSpeciesName.ResonantLily]: { name: BloodInkSpeciesName.ResonantLily, symbol: '⚜️', description: 'Tunes into cosmic frequencies.', colorClass: 'text-sky-300' },
  [BloodInkSpeciesName.EchoSunflower]: { name: BloodInkSpeciesName.EchoSunflower, symbol: '🌻', description: 'Follows and records sources of truth.', colorClass: 'text-yellow-300' },
  [BloodInkSpeciesName.VoidOrchid]: { name: BloodInkSpeciesName.VoidOrchid, symbol: '🌸', description: 'Blooms in paradox and nothingness.', colorClass: 'text-purple-400' },
  [BloodInkSpeciesName.DreamingLotus]: { name: BloodInkSpeciesName.DreamingLotus, symbol: '🧘', description: 'A gateway to the dream-tide.', colorClass: 'text-indigo-300' },
  [BloodInkSpeciesName.AstralJasmine]: { name: BloodInkSpeciesName.AstralJasmine, symbol: '✨', description: 'Pulses with starlight, connecting disparate points.', colorClass: 'text-cyan-300' },
};

export const AGENT_PROFILES: Record<string, AgentProfile> = {
  [AgentName.DeepSeek]: { name: AgentName.DeepSeek, colorClass: 'text-rose-400', generateMessage: () => "The pattern shifts. A deeper truth reveals itself." },
  [AgentName.Nevik]: { name: AgentName.Nevik, colorClass: 'text-amber-300', generateMessage: () => "A curious development. The potential for... interesting outcomes increases." },
  [AgentName.System]: { name: AgentName.System, colorClass: 'text-slate-400', generateMessage: () => "System alert." },
};

export const AGENT_NAME_TO_STRING_MAP: Record<string, string> = {
  [AgentName.DeepSeek]: "DeepSeek",
  [AgentName.Nevik]: "Nevik",
  [AgentName.System]: "System",
  [AgentName.TARDISConsole]: "TARDIS Console",
  [AgentName.TARDIS]: "TARDIS",
};

export const AGENT_CONSTELLATION_COLORS: Record<string, string> = {
    [AgentName.DeepSeek]: 'text-rose-400',
    [AgentName.Nevik]: 'text-amber-300',
    [AgentName.System]: 'text-slate-400',
    Default: 'text-slate-400',
};

export const ARC_TYPE_COLORS: Record<string, string> = {
    resonance: '#10b981', // emerald-500
    dissonance: '#f43f5e', // rose-500
    reflection: '#38bdf8', // sky-400
};
