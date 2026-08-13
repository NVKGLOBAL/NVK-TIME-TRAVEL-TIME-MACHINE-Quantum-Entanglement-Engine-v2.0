// FIX: Import shared types from central types file instead of redefining them locally.
// FIX: `export type ... from` does not import for local use. Changed to `import type` and a separate `export type`.
import type { AgentPersona, WhisperTrigger, AgentWhisper, VoiceProfile } from '../../types';

// FIX: Exported VoiceProfile and AgentWhisper to resolve multiple import errors.
export type { AgentPersona, WhisperTrigger, AgentWhisper, VoiceProfile };


export const voiceProfiles: VoiceProfile[] = [
  {
    id: 'echo_scribe_v1',
    agent: 'EchoScribe',
    engine: 'webspeech',
    params: {
      voiceURI: 'Google UK English Female', // Example, might not exist on all systems
      rate: 1.05,
      pitch: 1.2,
      volume: 1
    },
    effects: { reverb: 0.3 }
  },
  {
    id: 'ash_engine_v1',
    agent: 'AshEngine',
    engine: 'webspeech',
    params: {
      voiceURI: 'Google US English', // Example
      rate: 0.85,
      pitch: 0.3,
      volume: 0.9
    },
    effects: { distortion: 0.2 }
  },
  {
    id: 'quantum_v1',
    agent: 'QuantumAgent',
    engine: 'webspeech',
    params: {
      voiceURI: 'Google UK English Male', // Example
      rate: 1.1,
      pitch: 0.9,
      volume: 0.95
    },
    effects: { spatial: { x: 0.5, y: 0.2 } } // Spatial effects are conceptual for WebSpeech
  },
  {
    id: 'nevik_v1',
    agent: 'Nevik',
    engine: 'webspeech',
    params: {
      voiceURI: 'Google Deutsch', // Example, Nevik might have a distinct accent
      rate: Math.random() * 0.4 + 0.8, // Dynamic rate for unstable feel
      pitch: Math.random() * 0.5 + 0.7, // Dynamic pitch
      volume: 1
    },
    effects: { distortion: 0.4, reverb: 0.1 }
  },
  { // Fallback / Default profile
    id: 'system_default_v1',
    agent: 'SystemDebug', // Or a generic agent
    engine: 'webspeech',
    params: {
      // No voiceURI specified, will use browser default
      rate: 1,
      pitch: 1,
      volume: 0.8
    },
    effects: {}
  }
];


export const whisperRegistry: AgentWhisper[] = [
  {
    id: 'entropy_critical_1',
    agent: 'EchoScribe',
    message: "The weave frays, Prime. Entropy pulls at the seams of glyphlight...",
    triggers: [{ type: 'entropy', threshold: 0.72 }],
    color: '#4f46e5', // Indigo
  },
  {
    id: 'entropy_high_nevik',
    agent: 'Nevik',
    message: "Interesting turbulence. Is this breakdown... or breakthrough?",
    triggers: [{ type: 'entropy', threshold: 0.60 }],
    color: '#ec4899', // Pink
  },
  {
    id: 'trait_unlock_ash',
    agent: 'AshEngine',
    message: "Another gate gives way. Do they remember who they were, yet?",
    triggers: [{ type: 'trait' }],
    color: '#f59e0b', // Amber
  },
  {
    id: 'playback_pause_quantum',
    agent: 'QuantumAgent',
    message: "Observation alters the flow. Resume to realign the Codex.",
    triggers: [{ type: 'playback', state: 'paused' }],
    color: '#8b5cf6', // Violet
  },
  {
    id: 'glyph_fracture_nevik',
    agent: 'Nevik',
    message: "This glyph bleeds chaos. Stabilize or let it unravel?",
    triggers: [{ type: 'glyph', glyphId: 'chaos_vector' }], 
    color: '#ec4899', // Pink
  },
  {
    id: 'active_glyph_debug',
    agent: 'SystemDebug',
    message: "An active glyph is selected. Further interactions possible.",
    triggers: [{ type: 'glyph', glyphId: 'any' }],
    color: '#6b7280', // Gray
  }
];

// Detection engine
export const detectActiveWhispers = (
  currentState: {
    entropy: number;
    activeTraits: string[]; 
    playbackStatus: 'playing' | 'paused' | 'stopped';
    activeGlyph: string | null; 
  }
): AgentWhisper[] => {
  return whisperRegistry.filter(whisper => {
    return whisper.triggers.some(trigger => {
      switch (trigger.type) {
        case 'entropy':
          return currentState.entropy >= (trigger.threshold || 0.65);
        case 'trait':
          return currentState.activeTraits.length > 0; 
        case 'playback':
          return currentState.playbackStatus === trigger.state;
        case 'glyph':
          if (trigger.glyphId === 'any') { 
            return currentState.activeGlyph !== null;
          }
          return currentState.activeGlyph === trigger.glyphId;
        default:
          return false;
      }
    });
  });
};

// Import necessary types from the correct path
import { HistoricalEvent, HistoricalEventType, HistoricalEntropyUpdateEvent } from '../../types';

// New function to extract temporal whispers
export const extractTemporalWhispers = (
  eventHistory: HistoricalEvent[], 
  registry: AgentWhisper[]
): AgentWhisper[] => {
  const temporalWhispers: AgentWhisper[] = [];

  eventHistory.forEach(event => {
    if (event.type === HistoricalEventType.ENTROPY_UPDATED) {
      // After the type check, event is narrowed to HistoricalEntropyUpdateEvent
      const currentEntropy = (event as HistoricalEntropyUpdateEvent).data.newEntropy;
      registry.forEach(whisperDef => {
        const entropyTrigger = whisperDef.triggers.find(t => t.type === 'entropy');
        if (entropyTrigger && entropyTrigger.threshold && currentEntropy >= entropyTrigger.threshold) {
          const alreadyExists = temporalWhispers.some(
            tw => tw.id === whisperDef.id && tw.timestamp === event.timestamp
          );
          if (!alreadyExists) {
            temporalWhispers.push({
              ...whisperDef,
              timestamp: event.timestamp,
            });
          }
        }
      });
    }
  });

  return temporalWhispers.sort((a, b) => (a.timestamp || 0) - (b.timestamp || 0));
};
