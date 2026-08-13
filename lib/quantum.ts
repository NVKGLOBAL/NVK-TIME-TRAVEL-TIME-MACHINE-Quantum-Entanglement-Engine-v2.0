import { BellState, QuantumState, EntanglementMetrics, Complex } from '../types';

// --- TRUE QUANTUM MECHANICS SIMULATION ---
// This file implements a more realistic (though still simplified for web)
// model of qubit mechanics using density matrices and complex numbers.

// Helper for log base 2
const log2 = (n: number) => n <= 0 ? 0 : Math.log(n) / Math.log(2);

/**
 * Creates a new quantum state, representing a pure superposition.
 * While not a true representation of a Bell pair's subsystem (which would be mixed),
 * this aligns with the app's concept of coherence starting at 1.0 and decaying.
 */
const createPureSuperposition = (bellState: BellState): QuantumState => {
  const state: QuantumState = {
    bellState,
    coherenceLevel: 1.0,
    vonNeumannEntropy: 0, // A pure state has zero entropy
    densityMatrix: [
      [[0.5, 0], [0.5, 0]],
      [[0.5, 0], [0.5, 0]],
    ],
  };
  return state;
};

/**
 * Creates a representation of two entangled qubits.
 */
export const createBellPair = (bellState: BellState): [QuantumState, QuantumState] => {
  const state = createPureSuperposition(bellState);
  // For the simulation's purpose, both the anchor and device start in this ideal state.
  return [JSON.parse(JSON.stringify(state)), JSON.parse(JSON.stringify(state))];
};

/**
 * Calculates entanglement metrics based on a simplified coherence model.
 * In a real system, this would involve the full two-qubit density matrix.
 */
export const calculateEntanglementMetrics = (stateA: QuantumState, stateB: QuantumState): EntanglementMetrics => {
  // We'll base the metrics on the device's state, as it's the one that decoheres.
  const coherence = stateB.coherenceLevel;
  
  // Plausible formulas that tie metrics to coherence level
  const fidelity = coherence;
  const concurrence = coherence; // In this model, loss of coherence directly means loss of entanglement.
  const negativity = Math.max(0, (concurrence * 2) - 1);

  return {
    concurrence,
    fidelity,
    negativity,
  };
};

/**
 * Updates a quantum state's density matrix and entropy based on its coherence level.
 */
const updateStateFromCoherence = (state: QuantumState): QuantumState => {
  const c = state.coherenceLevel;
  const newState = { ...state };

  // Update density matrix: off-diagonal elements decay with coherence
  // ρ = [[0.5, 0.5*c], [0.5*c, 0.5]]
  newState.densityMatrix = [
    [[0.5, 0], [0.5 * c, 0]],
    [[0.5 * c, 0], [0.5, 0]],
  ];

  // Calculate eigenvalues of the density matrix to find entropy.
  // For a 2x2 matrix [[a, b], [c, d]], eigenvalues are:
  // λ = (a+d)/2 ± sqrt(((a-d)/2)² + bc)
  // Here, a=0.5, d=0.5, b=c=0.5*c.
  // λ = 0.5 ± sqrt(0 + (0.5*c)²) = 0.5 ± 0.5*c
  const lambda1 = 0.5 * (1 + c);
  const lambda2 = 0.5 * (1 - c);

  // Von Neumann Entropy S = -Σ(λ_i * log₂(λ_i))
  newState.vonNeumannEntropy = -(lambda1 * log2(lambda1) + lambda2 * log2(lambda2));

  return newState;
}


/**
 * Simulates decoherence over time by reducing the coherence level.
 */
export const applyDecoherence = (state: QuantumState, timeDelta: number, overrideRate?: number): QuantumState => {
  const decoherenceRate = overrideRate !== undefined ? overrideRate : 0.005; // Coherence loss per second
  const newCoherence = Math.max(0, state.coherenceLevel - decoherenceRate * (timeDelta / 1000));
  
  return updateStateFromCoherence({ ...state, coherenceLevel: newCoherence });
};

/**
 * Simulates a quantum error correction process by increasing coherence.
 */
export const applyQuantumErrorCorrection = (state: QuantumState): QuantumState => {
  const correctionEfficiency = 0.95;
  const newCoherence = Math.min(1.0, state.coherenceLevel + (1 - state.coherenceLevel) * correctionEfficiency);

  return updateStateFromCoherence({ ...state, coherenceLevel: newCoherence });
};

/**
 * Enhanced check for Chronology Protection Conjecture violation, including quantum factors.
 */
// FIX: Allow quantumState to be null and add a check before using it.
export const detectCTC = (originTime: Date, targetTime: Date, quantumState: QuantumState | null): { detected: boolean; reason: string } => {
    const timeDiffSeconds = (originTime.getTime() - targetTime.getTime()) / 1000;

    // Paradox risk for short jumps into the past
    if (timeDiffSeconds > 0 && timeDiffSeconds < 60 * 60 * 24) {
        return { detected: true, reason: 'Temporal proximity creates high risk of causal loop. Vacuum polarization escalating.' };
    }

    // High quantum uncertainty (entropy) makes past jumps more dangerous
    if (quantumState && timeDiffSeconds > 0 && quantumState.vonNeumannEntropy > 0.5) {
        return { detected: true, reason: 'High local entropy flux near the event horizon indicates worldline instability. CTC formation probable.' };
    }

    // A jump to a time before the device could have existed (arbitrary)
    if (targetTime.getFullYear() < 1900) {
        if(Math.random() > 0.8) {
             return { detected: true, reason: 'Target destination predates stable causality. High risk of timeline unraveling.' };
        }
    }

    return { detected: false, reason: 'Worldline appears stable. No closed timelike curves detected.' };
};


/**
 * Generates plausible parameters for a wormhole jump, now dependent on entanglement.
 */
export const calculateWormholeParams = (origin: Date, target: Date, coherence: number, entanglement: EntanglementMetrics): { throatRadius: string, traversalTime: string, stability: number } => {
    const timeDiffYears = Math.abs(target.getFullYear() - origin.getFullYear());
    
    // Wormhole stability is now critically dependent on the Concurrence metric of entanglement.
    const stability = entanglement.concurrence ** 2;

    // A high degree of entanglement is required to sustain a wormhole.
    if (stability < 0.8) { 
        return {
            throatRadius: 'COLLAPSING',
            traversalTime: 'INFINITE',
            stability,
        };
    }

    return {
        throatRadius: `${(1 / (1 + timeDiffYears * 0.01) * stability).toFixed(4)} Planck Lengths`,
        traversalTime: `${(timeDiffYears * 0.001 / stability).toFixed(6)}s (subjective)`,
        stability,
    };
};