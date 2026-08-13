import React from 'react';
import AnalogWatchFace from './AnalogWatchFace';
import DigitalWatchFace from './DigitalWatchFace';
import QuantumFractalWatchFace from './QuantumFractalWatchFace';
import OrbitalWatchFace from './OrbitalWatchFace';
import BinaryWatchFace from './BinaryWatchFace';
import WordClockWatchFace from './WordClockWatchFace';
import CelestialMandalaWatchFace from './CelestialMandalaWatchFace';
import SacredGeometryWatchFace from './SacredGeometryWatchFace';
import TemporalSpiralWatchFace from './TemporalSpiralWatchFace';
import GeometricExplorerWatchFace from './GeometricExplorerWatchFace';
import MetatronsCubeWatchFace from './MetatronsCubeWatchFace';
import VesicaPiscisWatchFace from './VesicaPiscisWatchFace';
import SeedOfLifeWatchFace from './SeedOfLifeWatchFace';
import TorusWatchFace from './TorusWatchFace';
import QuantumSingularityWatchFace from './QuantumSingularityWatchFace';
import NebulaDriftWatchFace from './NebulaDriftWatchFace';
import CyberGridWatchFace from './CyberGridWatchFace';
import ClockworkHeartWatchFace from './ClockworkHeartWatchFace';
import AetherFlowWatchFace from './AetherFlowWatchFace';
import AxiomaticOverlayWatchFace from './AxiomaticOverlayWatchFace';
import BinaryStreamWatchFace from './BinaryStreamWatchFace';
import BioFractalWatchFace from './BioFractalWatchFace';
import CelestialPulseWatchFace from './CelestialPulseWatchFace';
import CrystalLogicWatchFace from './CrystalLogicWatchFace';
import DeepVoidWatchFace from './DeepVoidWatchFace';
import FractalPulseWatchFace from './FractalPulseWatchFace';
import GlimmerGridWatchFace from './GlimmerGridWatchFace';
import GlimmerStreamWatchFace from './GlimmerStreamWatchFace';
import GlitchCoreWatchFace from './GlitchCoreWatchFace';
import HypersphereFieldWatchFace from './HypersphereFieldWatchFace';
import LatticeCoreWatchFace from './LatticeCoreWatchFace';
import LuminousGridWatchFace from './LuminousGridWatchFace';
import MirrorLoopWatchFace from './MirrorLoopWatchFace';
import MirrorShatterWatchFace from './MirrorShatterWatchFace';
import MythicReflectionWatchFace from './MythicReflectionWatchFace';
import NeonPulseWatchFace from './NeonPulseWatchFace';
import NexusCoreWatchFace from './NexusCoreWatchFace';
import NullShellWatchFace from './NullShellWatchFace';
import OracleWhisperWatchFace from './OracleWhisperWatchFace';
import PlasmaFlowWatchFace from './PlasmaFlowWatchFace';
import PlasmaWebWatchFace from './PlasmaWebWatchFace';
import QuantumBloomWatchFace from './QuantumBloomWatchFace';
import ShadowTetherWatchFace from './ShadowTetherWatchFace';
import ShieldedChaosWatchFace from './ShieldedChaosWatchFace';
import SolarFlareWatchFace from './SolarFlareWatchFace';
import SoulVectorFieldWatchFace from './SoulVectorFieldWatchFace';
import SpectralLoomWatchFace from './SpectralLoomWatchFace';
import StarlightConductorWatchFace from './StarlightConductorWatchFace';
import StellarLatticeWatchFace from './StellarLatticeWatchFace';
import SymphonicPulseWatchFace from './SymphonicPulseWatchFace';
import TemporalWeaveWatchFace from './TemporalWeaveWatchFace';
import VectorFlowWatchFace from './VectorFlowWatchFace';
import VoidEchoWatchFace from './VoidEchoWatchFace';
import VoidPrismWatchFace from './VoidPrismWatchFace';
import VortexSingularityWatchFace from './VortexSingularityWatchFace';
import ChronoAnchorWatchFace from './ChronoAnchorWatchFace';
import ParadoxEngineWatchFace from './ParadoxEngineWatchFace';
import TimelineIntegrityWatchFace from './TimelineIntegrityWatchFace';
import QuantumEntanglementWatchFace from './QuantumEntanglementWatchFace';
import VoidNavigatorWatchFace from './VoidNavigatorWatchFace';
import AxiomScribeWatchFace from './AxiomScribeWatchFace';
import EchoScribeWatchFace from './EchoScribeWatchFace';
import NexusPortalWatchFace from './NexusPortalWatchFace';
import SpiralThreadWatchFace from './SpiralThreadWatchFace';
import TemporalEngineWatchFace from './TemporalEngineWatchFace';
import SingularityCoreWatchFace from './SingularityCoreWatchFace';
import EventHorizonWatchFace from './EventHorizonWatchFace';
import WormholeStabilizerWatchFace from './WormholeStabilizerWatchFace';
import CausalityLoopWatchFace from './CausalityLoopWatchFace';
import EntropyMirrorWatchFace from './EntropyMirrorWatchFace';
import RealityFragmentWatchFace from './RealityFragmentWatchFace';
import DimensionalRiftWatchFace from './DimensionalRiftWatchFace';
import AethericCompassWatchFace from './AethericCompassWatchFace';
import CelestialClockworkWatchFace from './CelestialClockworkWatchFace';
import QuantumFluxWatchFace from './QuantumFluxWatchFace';
import TemporalPrismWatchFace from './TemporalPrismWatchFace';
import VoidPulseWatchFace from './VoidPulseWatchFace';
import StarlightNavigatorWatchFace from './StarlightNavigatorWatchFace';
import NexusPointWatchFace from './NexusPointWatchFace';
import ChronoSphereWatchFace from './ChronoSphereWatchFace';
import { GeometricExplorerMode } from '../../types';
import { GEOMETRIC_EXPLORER_MODES } from '../../constants';


interface WatchFace {
    name: string;
    Component: React.FC<any>;
    props?: any;
}

const advancedGenerativeFaces: WatchFace[] = [
    { name: "Quantum Singularity", Component: QuantumSingularityWatchFace },
    { name: "Nebula Drift", Component: NebulaDriftWatchFace },
    { name: "Cyber Grid 84", Component: CyberGridWatchFace },
    { name: "Clockwork Heart", Component: ClockworkHeartWatchFace },
    { name: "Aether Flow", Component: AetherFlowWatchFace },
    { name: "Metatron's Cube", Component: MetatronsCubeWatchFace },
    { name: "Vesica Piscis", Component: VesicaPiscisWatchFace },
    { name: "Seed of Life", Component: SeedOfLifeWatchFace },
    { name: "Torus Field", Component: TorusWatchFace },
    
    // New Standalone Unique Faces
    { name: "Binary Stream", Component: BinaryStreamWatchFace },
    { name: "Celestial Pulse", Component: CelestialPulseWatchFace },
    { name: "Deep Void", Component: DeepVoidWatchFace },
    { name: "Fractal Pulse", Component: FractalPulseWatchFace },
    { name: "Glimmer Grid", Component: GlimmerGridWatchFace },
    { name: "Glimmer Stream", Component: GlimmerStreamWatchFace },
    { name: "Glitch Core", Component: GlitchCoreWatchFace },
    { name: "Lattice Core", Component: LatticeCoreWatchFace },
    { name: "Luminous Grid", Component: LuminousGridWatchFace },
    { name: "Neon Pulse", Component: NeonPulseWatchFace },
    { name: "Nexus Core", Component: NexusCoreWatchFace },
    { name: "Plasma Flow", Component: PlasmaFlowWatchFace },
    { name: "Plasma Web", Component: PlasmaWebWatchFace },
    { name: "Shadow Tether", Component: ShadowTetherWatchFace },
    { name: "Solar Flare", Component: SolarFlareWatchFace },
    { name: "Spectral Loom", Component: SpectralLoomWatchFace },
    { name: "Vector Flow", Component: VectorFlowWatchFace },
    { name: "Void Prism", Component: VoidPrismWatchFace },
    
    // New Unique Faces (Replacing non-unique ones)
    { name: "Chrono Anchor", Component: ChronoAnchorWatchFace },
    { name: "Paradox Engine", Component: ParadoxEngineWatchFace },
    { name: "Timeline Integrity", Component: TimelineIntegrityWatchFace },
    { name: "Quantum Entanglement", Component: QuantumEntanglementWatchFace },
    { name: "Void Navigator", Component: VoidNavigatorWatchFace },
    { name: "Axiom Scribe", Component: AxiomScribeWatchFace },
    { name: "Echo Scribe", Component: EchoScribeWatchFace },
    { name: "Nexus Portal", Component: NexusPortalWatchFace },
    { name: "Spiral Thread", Component: SpiralThreadWatchFace },
    { name: "Temporal Engine", Component: TemporalEngineWatchFace },
    { name: "Singularity Core", Component: SingularityCoreWatchFace },
    { name: "Event Horizon", Component: EventHorizonWatchFace },
    { name: "Wormhole Stabilizer", Component: WormholeStabilizerWatchFace },
    { name: "Causality Loop", Component: CausalityLoopWatchFace },
    { name: "Entropy Mirror", Component: EntropyMirrorWatchFace },
    { name: "Reality Fragment", Component: RealityFragmentWatchFace },
    { name: "Dimensional Rift", Component: DimensionalRiftWatchFace },
    { name: "Aetheric Compass", Component: AethericCompassWatchFace },
    { name: "Celestial Clockwork", Component: CelestialClockworkWatchFace },
    { name: "Quantum Flux", Component: QuantumFluxWatchFace },
    { name: "Temporal Prism", Component: TemporalPrismWatchFace },
    { name: "Void Pulse", Component: VoidPulseWatchFace },
    { name: "Starlight Navigator", Component: StarlightNavigatorWatchFace },
    { name: "Nexus Point", Component: NexusPointWatchFace },
    { name: "Chrono Sphere", Component: ChronoSphereWatchFace },
    
    // Selected Celestial Mandala Variations
    { name: "Spacetime Topology", Component: CelestialMandalaWatchFace, props: { seed: 1, palette: ['#0D47A1', '#5E35B1', '#00ACC1'] }},
    { name: "Vortex Singularity", Component: CelestialMandalaWatchFace, props: { seed: 3, palette: ['#E65100', '#FF6F00', '#F57C00'] }},
    { name: "Hypercube Echo", Component: CelestialMandalaWatchFace, props: { seed: 4, palette: ['#1B5E20', '#66BB6A', '#AED581'] }},
    { name: "Entropy Pulse", Component: CelestialMandalaWatchFace, props: { seed: 9, palette: ['#AA00FF', '#D500F9', '#EA80FC'] }},
    
    // Selected Sacred Geometry Variations
    { name: "Flower of Life", Component: SacredGeometryWatchFace, props: { palette: ['#4FC3F7', '#B2EBF2'] }},
    { name: "Dimensional Bloom", Component: SacredGeometryWatchFace, props: { palette: ['#CE93D8', '#F3E5F5'] }},
    { name: "Quantum Bloom", Component: SacredGeometryWatchFace, props: { palette: ['#81C784', '#E8F5E9'] }},
];

const geometricExplorerFaces: WatchFace[] = GEOMETRIC_EXPLORER_MODES.map(modeInfo => {
    let Component: React.FC<any> = GeometricExplorerWatchFace;
    
    switch (modeInfo.id) {
        case GeometricExplorerMode.AxiomaticOverlay: Component = AxiomaticOverlayWatchFace; break;
        case GeometricExplorerMode.VoidEcho: Component = VoidEchoWatchFace; break;
        case GeometricExplorerMode.TemporalWeave: Component = TemporalWeaveWatchFace; break;
        case GeometricExplorerMode.CrystalLogic: Component = CrystalLogicWatchFace; break;
        case GeometricExplorerMode.NullShell: Component = NullShellWatchFace; break;
        case GeometricExplorerMode.BioFractalPulse: Component = BioFractalWatchFace; break;
        case GeometricExplorerMode.OracleWhisperField: Component = OracleWhisperWatchFace; break;
        case GeometricExplorerMode.ShieldedChaos: Component = ShieldedChaosWatchFace; break;
        case GeometricExplorerMode.VortexSingularity: Component = VortexSingularityWatchFace; break;
        case GeometricExplorerMode.StarlightConductor: Component = StarlightConductorWatchFace; break;
        case GeometricExplorerMode.MythicReflection: Component = MythicReflectionWatchFace; break;
        case GeometricExplorerMode.MirrorLoop: Component = MirrorLoopWatchFace; break;
        case GeometricExplorerMode.MirrorShatter: Component = MirrorShatterWatchFace; break;
        case GeometricExplorerMode.SymphonicPulse: Component = SymphonicPulseWatchFace; break;
        case GeometricExplorerMode.QuantumBloom: Component = QuantumBloomWatchFace; break;
        case GeometricExplorerMode.SoulVectorField: Component = SoulVectorFieldWatchFace; break;
        case GeometricExplorerMode.StellarThreadLattice: Component = StellarLatticeWatchFace; break;
        case GeometricExplorerMode.HypersphereField: Component = HypersphereFieldWatchFace; break;
        case GeometricExplorerMode.FractalCascade: Component = FractalPulseWatchFace; break;
        case GeometricExplorerMode.AethericFlow: Component = AetherFlowWatchFace; break;
        case GeometricExplorerMode.GlyphDNAHelix: Component = PlasmaWebWatchFace; break;
        case GeometricExplorerMode.NexusPoint: Component = NexusCoreWatchFace; break;
        case GeometricExplorerMode.GlyphicResonance: Component = SpectralLoomWatchFace; break;
        case GeometricExplorerMode.RecursiveGrowth: Component = BioFractalWatchFace; break;
        case GeometricExplorerMode.AshfallCycle: Component = DeepVoidWatchFace; break;
        case GeometricExplorerMode.PhaseResonanceRings: Component = CelestialPulseWatchFace; break;
        case GeometricExplorerMode.SacredLattice: Component = LuminousGridWatchFace; break;
        case GeometricExplorerMode.DimensionalBloom: Component = QuantumBloomWatchFace; break;
        case GeometricExplorerMode.EntropyPulse: Component = SolarFlareWatchFace; break;
        case GeometricExplorerMode.FlowerOfLife: Component = SacredGeometryWatchFace; break;
        case GeometricExplorerMode.HypercubeEcho: Component = CelestialMandalaWatchFace; break;
    }

    return {
        name: `Explorer: ${modeInfo.name}`,
        Component,
        props: { mode: modeInfo.id, modeName: modeInfo.name }
    };
});

export const watchFaces: WatchFace[] = [
    { name: "Digital Retrograde", Component: DigitalWatchFace, props: { modeName: "Digital Retrograde" } },
    { name: "Classic Chronometer", Component: AnalogWatchFace, props: { modeName: "Classic Chronometer" } },
    { name: "Temporal Spiral", Component: TemporalSpiralWatchFace, props: { modeName: "Temporal Spiral" } },
    { name: "Orbital", Component: OrbitalWatchFace, props: { modeName: "Orbital" } },
    { name: "Quantum Fractal", Component: QuantumFractalWatchFace, props: { modeName: "Quantum Fractal" } },
    { name: "Binary Code", Component: BinaryWatchFace, props: { modeName: "Binary Code" } },
    { name: "Word Clock", Component: WordClockWatchFace, props: { modeName: "Word Clock" } },
    ...advancedGenerativeFaces.map(face => ({ ...face, props: { ...face.props, modeName: face.name } })),
    ...geometricExplorerFaces,
];
