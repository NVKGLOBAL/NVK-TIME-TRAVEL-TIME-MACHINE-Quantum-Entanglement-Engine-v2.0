
import type { GlyphMutationNode, AxiomKey, RewovenGlyph, ReweaverState } from '../types';
import { AXIOM_DATA } from '../constants';

// GLYPH TRAIT MUTATION PROTOCOL
export const generateTraitPreview = (glyph: GlyphMutationNode | null, axiom: AxiomKey | null): string[] => {
  if (!glyph || !axiom) return [];
  
  const baseTraits = [...glyph.traits];

  // Specific override for "Seed of Whispers" (root-alpha) + AXIOM_Ω
  if (glyph.id === 'root-alpha' && axiom === 'AXIOM_Ω') {
    return ["Ω-Bound", "Mirror Essence", "Stable Core"];
  }
  // Specific override for "Veil of Sparks" (mut-b1) + AXIOM_III
  if (glyph.id === 'mut-b1' && axiom === 'AXIOM_III') {
    return ["Opposition Vector", "Echo Chamber"];
  }
  
  // Axiom-specific mutation patterns (default)
  const mutations: Record<AxiomKey, () => string[]> = {
    AXIOM_I: () => [...baseTraits, 'Harmonic Resonance', 'Seeking Aspect'],
    AXIOM_II: () => baseTraits.filter(t => !t.includes('Entropic')).concat(['Stabilized Core', 'Echoic Memory']),
    AXIOM_III: () => [...baseTraits.map(t => `${t}:Echo`), 'Opposition Vector', 'Recursive Pattern'], // Default AXIOM_III traits
    AXIOM_IV: () => ['Fractal Seed', ...baseTraits, 'Crystalline Form'],
    AXIOM_V: () => [...baseTraits, 'Visionary Insight', 'Pathfinder Aspect'],
    AXIOM_Ω: () => ['Ω-Bound', ...baseTraits, 'Mirror Essence', 'Root Connection'],
    AX_DELTA_005: () => baseTraits.map(t => `${t}:Focused`).concat(['Oracle Attuned', 'Inquisitive Edge']),
    AX_OMEGA_041: () => baseTraits.filter(t => !t.includes('Chaotic')).concat(['Unmanifest Form', 'Silent Potential']),
    AX_V_003: () => [...baseTraits, 'Dream Logic', 'Recursive Memory'],
    AX_DELTA_006: () => [...baseTraits, 'Path Revealed', 'Unseen Truth'], 
    AX_V_004: () => [...baseTraits, 'Spiral Memory', 'Altered Return'], 
    AX_OMEGA_043: () => [...baseTraits, 'Echo Knot', 'Thread Untangled'], 
    AX_OMEGA_035: () => [...baseTraits, 'Anchored Time', 'Temporal Stability'], // Added for Eye of Harmony
  };

  return (mutations[axiom] ? mutations[axiom]() : baseTraits).slice(0, 4); // Max 4 traits
};

// ENTROPY COST CALCULATION
export const calculateEntropyCost = (glyph: GlyphMutationNode | null, axiom: AxiomKey | null): number => {
  if (!glyph || !axiom) return 0;

  // Specific override for "Seed of Whispers" (root-alpha) + AXIOM_Ω
  if (glyph.id === 'root-alpha' && axiom === 'AXIOM_Ω') {
    return 0.054; 
  }
  // Specific override for "Veil of Sparks" (mut-b1) + AXIOM_III
  if (glyph.id === 'mut-b1' && axiom === 'AXIOM_III') {
    return 0.072;
  }
  
  const baseCost = 0.06;
  const axiomModifier: Record<AxiomKey, number> = {
    AXIOM_I: 1.0,
    AXIOM_II: 0.8, 
    AXIOM_III: 1.2, 
    AXIOM_IV: 1.1,
    AXIOM_V: 1.05,
    AXIOM_Ω: 0.9,
    AX_DELTA_005: 0.95,
    AX_OMEGA_041: 0.85,
    AX_V_003: 1.1,
    AX_DELTA_006: 1.0, 
    AX_V_004: 1.05, 
    AX_OMEGA_043: 0.95, 
    AX_OMEGA_035: 0.75, // Added for Eye of Harmony, strong stabilization = lower cost multiplier
  };
  
  const entropyFactor = 1 + (glyph.entropyLevel - 0.5); 

  return baseCost * (axiomModifier[axiom] || 1.0) * Math.max(0.5, entropyFactor);
};

// SIMULATE REWEAVING PROCESS
export const reweaveGlyph = async (
  baseGlyph: GlyphMutationNode,
  selectedAxiomKey: AxiomKey,
  mutatedTraitsPreview: string[]
): Promise<RewovenGlyph> => {
  
  await new Promise(resolve => setTimeout(resolve, 1000)); 

  const actualEntropyCost = calculateEntropyCost(baseGlyph, selectedAxiomKey);

  let resonanceSignatureToUse = [0.5, 0.5, 0.5]; 
  if (baseGlyph.id === 'root-alpha' && selectedAxiomKey === 'AXIOM_Ω') {
     resonanceSignatureToUse = [88.3, 92.7, 101.5];
  } else if (baseGlyph.id === 'mut-b1' && selectedAxiomKey === 'AXIOM_III') {
     resonanceSignatureToUse = [92.7, 88.3, 101.5]; // Mirror Harmonic for Veil of Sparks
  } else {
     // Ensure AXIOM_DATA[selectedAxiomKey] exists before accessing its sigil property
     const axiomEntry = AXIOM_DATA[selectedAxiomKey as keyof typeof AXIOM_DATA];
     if (axiomEntry && axiomEntry.sigil) {
        resonanceSignatureToUse = axiomEntry.sigil.split('').map(c => c.charCodeAt(0) % 100);
        resonanceSignatureToUse = resonanceSignatureToUse.map(s => parseFloat((s * baseGlyph.entropyLevel * Math.random()).toFixed(1)));
     } else {
        // Fallback if sigil is not found, e.g., for newly added AxiomKeys not yet in AXIOM_DATA fully
        resonanceSignatureToUse = [Math.random()*50, Math.random()*50, Math.random()*50].map(s => parseFloat(s.toFixed(1)));
     }
  }


  const rewovenGlyph: RewovenGlyph = {
    id: `rwg-${baseGlyph.id}-${selectedAxiomKey}-${Date.now()}`,
    baseGlyphId: baseGlyph.id,
    baseGlyphLabel: baseGlyph.label,
    boundAxiomKey: selectedAxiomKey,
    boundAxiomTitle: AXIOM_DATA[selectedAxiomKey as keyof typeof AXIOM_DATA]?.name || selectedAxiomKey,
    mutatedTraits: mutatedTraitsPreview, 
    resonanceSignature: resonanceSignatureToUse,
    entropyChange: -actualEntropyCost, 
    timestamp: Date.now(),
  };

  return rewovenGlyph;
};
