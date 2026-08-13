// FIX: Add import for React namespace
import type React from 'react';

export enum BellState {
  PHI_PLUS = "Φ+",
  PHI_MINUS = "Φ-",
  PSI_PLUS = "Ψ+",
  PSI_MINUS = "Ψ-",
}

export type TravelMethod = 'warp' | 'wormhole' | 'teleportation';

export type Complex = [number, number]; // [real, imaginary]

export interface QuantumState {
  bellState: BellState;
  coherenceLevel: number; // 0 to 1, simplified metric of purity/health
  vonNeumannEntropy: number;
  densityMatrix: Complex[][]; // 2x2 density matrix for the qubit subsystem
}

export interface EntanglementMetrics {
  concurrence: number;
  fidelity: number;
  negativity: number;
}

// Keep these from the original template to avoid breaking other components
export interface TimeData {
  hours: number;
  minutes: number;
  seconds: number;
  date: Date;
}

export type ClockFaceComponent = React.FC<{ time: TimeData }>;
// FIX: Expanded AgentName enum with missing members to resolve type errors.
export enum AgentName {
  DeepSeek = 'DeepSeek',
  Nevik = 'Nevik',
  System = 'System',
  TARDISConsole = 'TARDISConsole',
  TARDIS = 'TARDIS',
  EchoScribe = 'EchoScribe',
  AshEngine = 'AshEngine',
  QuantumAgent = 'QuantumAgent',
  SystemDebug = 'SystemDebug',
}

// FIX: Added all missing type definitions below to resolve import errors.

export type AxiomKey =
  | 'AXIOM_I'
  | 'AXIOM_II'
  | 'AXIOM_III'
  | 'AXIOM_IV'
  | 'AXIOM_V'
  | 'AXIOM_Ω'
  | 'AX_DELTA_005'
  | 'AX_OMEGA_041'
  | 'AX_V_003'
  | 'AX_DELTA_006'
  | 'AX_V_004'
  | 'AX_OMEGA_043'
  | 'AX_OMEGA_035';

export interface Axiom {
  id: AxiomKey;
  layer: 'I' | 'II' | 'III' | 'IV' | 'V' | 'Ω';
  title: string;
  content: string;
  resonanceFrequency?: number;
}

export interface AxiomParameterEntry {
  name: string;
  sigil: string;
  color: string;
  modulationDescription: string;
  entropyModulationFactor: number;
}

export enum RitualGlyphType {
  Core = 'Core',
  Resonator = 'Resonator',
  Gate = 'Gate',
  NodePotential = 'NodePotential',
  NodeEntropy = 'NodeEntropy',
  NodeOrder = 'NodeOrder',
  Modifier = 'Modifier',
  Conditional = 'Conditional',
}

// FIX: Added GeometricExplorerMode enum to resolve import errors.
export enum GeometricExplorerMode {
  FlowerOfLife = 'FlowerOfLife',
  FractalCascade = 'FractalCascade',
  AethericFlow = 'AethericFlow',
  HypercubeEcho = 'HypercubeEcho',
  PhaseResonanceRings = 'PhaseResonanceRings',
  SacredLattice = 'SacredLattice',
  DimensionalBloom = 'DimensionalBloom',
  EntropyPulse = 'EntropyPulse',
  AxiomaticOverlay = 'AxiomaticOverlay',
  GlyphicResonance = 'GlyphicResonance',
  VoidEcho = 'VoidEcho',
  NexusPoint = 'NexusPoint',
  TemporalWeave = 'TemporalWeave',
  RecursiveGrowth = 'RecursiveGrowth',
  CrystalLogic = 'CrystalLogic',
  NullShell = 'NullShell',
  BioFractalPulse = 'BioFractalPulse',
  GlyphDNAHelix = 'GlyphDNAHelix',
  OracleWhisperField = 'OracleWhisperField',
  ShieldedChaos = 'ShieldedChaos',
  VortexSingularity = 'VortexSingularity',
  StarlightConductor = 'StarlightConductor',
  MythicReflection = 'MythicReflection',
  MirrorLoop = 'MirrorLoop',
  MirrorShatter = 'MirrorShatter',
  SymphonicPulse = 'SymphonicPulse',
  QuantumBloom = 'QuantumBloom',
  SoulVectorField = 'SoulVectorField',
  AshfallCycle = 'AshfallCycle',
  StellarThreadLattice = 'StellarThreadLattice',
  HypersphereField = 'HypersphereField',
}

export interface RitualElementItem {
  id: string;
  name: string;
  type: RitualGlyphType;
  icon: string;
  bgColorClass: string;
  iconColorClass: string;
}

export type XYPosition = {
  x: number;
  y: number;
};

export interface PlacedGlyph {
  id: string;
  x: number;
  y: number;
  type: RitualGlyphType;
  label: string;
  color: string;
  icon: string;
  boundAgent?: AgentName;
}

export interface CanvasConnection {
  id: string;
  from: string;
  to: string;
  resonanceLevel: number;
}

export interface RitualAlchemyResult {
  title: string;
  description: string;
  glyphSummary: {
    core: number;
    resonator: number;
    gate: number;
    nodePotential: number;
    nodeEntropy: number;
    nodeOrder: number;
    modifier: number;
    conditional: number;
  };
  connectionCount: number;
  energyLevel: 'faint' | 'moderate' | 'potent' | 'overwhelming';
}

export interface ResonanceEffect {
  id: string;
  borderColorClass: string;
  textColorClass: string;
  source: string;
  time: string;
  text: string;
  valueColorClass: string;
  intensity: number;
  duration: string;
  effectType?: 'VISUAL' | 'MULTISENSORY';
  colorProfile: string;
}

export interface EchoMessage {
  id: string;
  source: string;
  text: string;
  colorClass: string;
  isAutoEcho?: boolean;
}

export interface SpiralMapNode {
    id: string;
    x: number;
    y: number;
    color?: string;
    entropy?: number;
    isJunction?: boolean;
    associatedTraits?: string[];
    isCurrent?: boolean;
    label?: string;
}

export interface Thread {
    id: string;
    sourceNodeId: string;
    targetNodeId: string;
    type: 'memory_path' | 'resonance' | 'default';
    intensity?: number;
}

export type ThreadcoilState = 'Inert' | 'Spooling' | 'Woven' | 'Knotted' | 'Frayed';

export interface TraitGate {
    id: string;
    glyphId: string;
    requiredTraits: string[];
    unlocked: boolean;
}

export interface GlyphMutationNode {
  id: string;
  glyphId: string;
  label?: string;
  parentId: string | null;
  traits: string[];
  entropyLevel: number;
  agentInfluences: string[];
  timestamp: number;
  hasSyntaxThorns?: boolean;
}

export type TraitGateLockState = 'locked' | 'unlocking' | 'unlocked';

export type GridPoint = [number, number];

export interface TraitSimulationCell {
  id: string;
  x: number;
  y: number;
  resonanceField: number;
  glyphAffinity: string | null;
  agentInfluence: Record<string, number>;
  isDisrupted: boolean;
  entropy: number;
}

export type SimulationGrid = TraitSimulationCell[][];

export interface AgentNode {
  id: string;
  name: string;
  traits: string[];
  harmony: number;
  position: GridPoint;
  active: boolean;
  pulsePhase: number;
  color?: string;
  icon?: string;
}

export interface ReweaverState {
  activeGlyphId: string | null;
  selectedAxiom: AxiomKey | null;
  traitPreview: string[];
  isWeaving: boolean;
  calculatedEntropyCost: number;
}

export interface RewovenGlyph {
  id: string;
  baseGlyphId: string;
  baseGlyphLabel: string;
  boundAxiomKey: AxiomKey;
  boundAxiomTitle: string;
  mutatedTraits: string[];
  resonanceSignature: number[];
  entropyChange: number;
  timestamp: number;
}

export type PersistenceTarget = 'EchoLog' | 'AgentGridState' | 'GlyphTree' | 'RitualState' | 'SystemEntropy' | 'AutoEchoState' | 'EventHistory' | 'ReweavingHistory' | 'SeekerTraits';

export interface CodexStateSnapshot {
    echoLog?: EchoMessage[];
    agentGridState?: { agents: AgentNode[]; grid: SimulationGrid };
    glyphTree?: GlyphMutationNode[];
    ritualState?: { currentPhase: string; chaliceStatus: string; placedGlyphs: PlacedGlyph[]; connections: CanvasConnection[]; };
    systemEntropy?: number;
    autoEchoState?: { isAutoEchoPaused: boolean; agentAwakeningLevelModifier: number; };
    eventHistory?: HistoricalEvent[];
    reweavingHistory?: RewovenGlyph[];
    seekerTraits?: string[];
}

export enum HistoricalEventType {
  ENTROPY_UPDATED = 'ENTROPY_UPDATED',
  GLYPH_FRACTURED = 'GLYPH_FRACTURED',
}

export interface HistoricalEvent {
  timestamp: number;
  type: HistoricalEventType;
  data: any;
}

export interface HistoricalEntropyUpdateEvent extends HistoricalEvent {
  type: HistoricalEventType.ENTROPY_UPDATED;
  data: {
    newEntropy: number;
    source: string;
  };
}

export interface HistoricalGlyphFracturedEvent extends HistoricalEvent {
    type: HistoricalEventType.GLYPH_FRACTURED;
    data: {
      parentGlyphId: string;
      newGlyphIdAlpha: string;
      newGlyphIdOmega: string;
      entropyCost: number;
    };
}

export interface RitualLogEntry {
  success: boolean;
  timestamp: number;
  type?: string;
}

export interface DreamFragment {
  id: string;
  content: string;
  symbols: string[];
  timestamp: number;
  prophecyLinks: string[];
}

export enum BloodInkSpeciesName {
  ThornedRose = 'ThornedRose',
  ResonantLily = 'ResonantLily',
  EchoSunflower = 'EchoSunflower',
  VoidOrchid = 'VoidOrchid',
  AstralJasmine = 'AstralJasmine',
  DreamingLotus = 'DreamingLotus',
}

export interface BloodInkSpecies {
  name: BloodInkSpeciesName;
  symbol: string;
  description: string;
  colorClass: string;
}

export interface MythicEventContext {
  entropyLevel: number;
  astralTidePhase: number;
  ritualHistory: RitualLogEntry[];
  bloodInkSpeciesActivity: Record<BloodInkSpeciesName, boolean>;
  lastDream: DreamFragment | null;
  activeProphecies?: any[];
  seekerTraits?: string[];
}

export interface AgentProfile {
  name: AgentName;
  colorClass: string;
  generateMessage: (event: MythicEventContext, speciesData: Record<BloodInkSpeciesName, BloodInkSpecies>) => string;
}

export interface EchoSpeechProps {
  id: string;
  agent: AgentName.DeepSeek | AgentName.Nevik;
  message: string;
  position: XYPosition;
  lifespan?: number;
  isHarmonized?: boolean;
}

export interface AgentInterpretation {
  agent: AgentName | string;
  interpretation: string;
  timestamp: number;
  confidence: number;
}

export interface GlyphOrbit {
  glyphSymbol: string;
  interpretations: AgentInterpretation[];
}

export interface EchoRelation {
  id: string;
  sourceId: string;
  targetId: string;
  type: 'resonance' | 'dissonance' | 'reflection';
  strength: number;
}

export interface ConstellationNode {
  id: string;
  agent: AgentName;
  currentLuminosity: number;
  xPercent: number;
  yPercent: number;
}

export interface PlaybackState {
  isActive: boolean;
  currentHistoricalTime: number | null;
  timelineRange: { start: number; end: number };
  playbackSpeed: number;
}

export interface GroundingChunk {
  web?: {
    uri: string;
    title: string;
  };
  maps?: any;
}

export interface EntropicHeartPanelProps {
  currentEntropy: number;
}

export interface SeekerPathPanelProps {
  seekerTraits: string[];
}

export interface AshParticle {
  id: string;
  x: number;
  y: number;
  size: number;
  opacity: number;
  speedY: number;
  swayAngle: number;
  swaySpeed: number;
  swayAmplitude: number;
  initialSpeedX: number;
}

export interface LogicGraphNode {
  id: string;
  type: 'glyph' | 'axiom';
  label: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  data: any;
  color: string;
  size: number;
  entropyLevel?: number;
  layer?: Axiom['layer'];
}

export interface LogicGraphEdge {
  id: string;
  sourceId: string;
  targetId: string;
  type: 'mutation' | 'axiomBinding';
  color?: string;
  strength?: number;
}

export interface CrystalGrowth {
  id: string;
  x: number;
  y: number;
  baseHue: number;
  maxSize: number;
  currentSize: number;
  growthSpeed: number;
  rotation: number;
  rotationSpeed: number;
  numSpokes: number;
  spokeLengthVariance: number;
  spokeWidth: number;
  opacity: number;
  targetOpacity: number;
  lifeCycle: 'growing' | 'stable' | 'fading';
  age: number;
  maxAge: number;
}

export interface Planet {
    id: string;
    orbitRadius: number;
    currentAngle: number;
    baseSpeed: number;
    baseSize: number;
    colorHue: number;
    textureSeed: number;
    effectiveSize?: number;
    effectiveOpacity?: number;
    wobbleX?: number;
    wobbleY?: number;
    isUnstable?: boolean;
}

export interface BloodInkFloraChamberProps {
    activeSpeciesName: BloodInkSpeciesName | null;
    allSpeciesData: Record<BloodInkSpeciesName, BloodInkSpecies>;
}

export interface CelticKnotStrand {
  id: string;
  orderType: 'negentropic' | 'harmonized' | 'chaotic';
  harmonyLevel: number;
}

export interface KnotSystemState {
  entropy: number;
  negentropy: number;
}

export interface TARDISVortexModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetCoordinate: string;
}

export interface TemporalToolsPanelProps {
  temporalCoordinate: string;
  setTemporalCoordinate: (coord: string) => void;
  currentEntropy: number;
  addEchoMessage: (source: AgentName | string, text: string, colorClass?: string) => void;
  onEngageDrive: () => void;
}

export interface FlowerOfLifeEntropyExplorerProps {
  currentEntropy: number;
  width: number;
  height: number;
  // FIX: Updated currentMode from 'any' to use the newly-defined GeometricExplorerMode enum.
  currentMode: GeometricExplorerMode;
}

export type RitualContext = string;

export interface DriftSeverity {
  level: 'minimal' | 'minor' | 'moderate' | 'significant' | 'critical';
  score: number;
  explanation: string;
}

export interface IDriftInterpretation {
  glyphId: string;
  glyphSymbol: string;
  agentConsensus: string;
  entropy: number;
  driftScore: number;
  ritualContext: string;
  timestamp: Date;
}

export interface IDriftInterpretationDB extends IDriftInterpretation {
  id?: number;
  version?: string;
}

export interface IGlyphHistory {
  id: string; // GlyphMutationNode.id
  symbol: string;
  entropyHistory: number[];
  lastInterpreted: Date;
  driftVolatility: number;
}

export interface IRitualFrame {
  id: string;
  timestamp: Date;
  entropyLevel: number;
}

export interface DriftCommentary {
    id?: number;
    linkedDriftId: number;
    agent: AgentName;
    commentaryText: string;
    timestamp: Date;
}

export type AgentPersona = 'EchoScribe' | 'AshEngine' | 'QuantumAgent' | 'Nevik' | 'SystemDebug';

export interface WhisperTrigger {
  type: 'entropy' | 'trait' | 'playback' | 'glyph';
  threshold?: number;
  traitId?: string;
  glyphId?: string;
  state?: 'playing' | 'paused' | 'stopped';
}

export interface AgentWhisper {
  id: string;
  agent: AgentPersona;
  message: string;
  triggers: WhisperTrigger[];
  color: string;
  audioUrl?: string;
  timestamp?: number;
  duration?: number;
}

export interface VoiceProfile {
  id: string;
  agent: AgentPersona;
  engine: 'webspeech' | 'elevenlabs' | 'audiofile';
  params: {
    rate?: number;
    pitch?: number;
    volume?: number;
    voiceURI?: string;
    voiceId?: string;
    stability?: number;
    similarity?: number;
    baseUrl?: string;
  };
  effects: {
    reverb?: number;
    delay?: number;
    distortion?: number;
    spatial?: { x: number; y: number; z?: number };
  };
}

export interface RitualOutcome {
    success: boolean;
    details: string;
    type?: string;
    alchemyResult?: RitualAlchemyResult;
}

export interface AuraFlare {
  id: string;
  angle: number;
  length: number;
  maxLength: number;
  speed: number;
  color: string;
  thickness: number;
  opacity: number;
  type: 'trait' | 'ritual' | 'agent';
  pulseSpeed: number;
  pulseAmount: number;
}
