// FIX: Import shared types from central types file instead of redefining them locally.
// FIX: `export type ... from` does not import for local use. Changed to `import type` and a separate `export type`.
import type { AgentPersona, WhisperTrigger, AgentWhisper } from '../../types';

// FIX: Exported AgentWhisper to resolve import errors in consumer hooks and components.
export type { AgentPersona, WhisperTrigger, AgentWhisper };

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
    triggers: [{ type: 'trait' }], // Any trait unlock (logic in detectActiveWhispers will need to check activeTraits length > 0 if specific traitId is not used)
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
    triggers: [{ type: 'glyph', glyphId: 'chaos_vector' }], // Placeholder glyphId
    color: '#ec4899', // Pink
  },
  {
    id: 'active_glyph_debug',
    agent: 'SystemDebug',
    message: "An active glyph is selected. Further interactions possible.",
    triggers: [{ type: 'glyph', glyphId: 'any' }], // Special case: if activeGlyph is not null
    color: '#6b7280', // Gray
  }
];

// Detection engine
export const detectActiveWhispers = (
  currentState: {
    entropy: number;
    activeTraits: string[]; // Array of current seeker traits
    playbackStatus: 'playing' | 'paused' | 'stopped';
    activeGlyph: string | null; // ID of the currently active/selected glyph
  }
): AgentWhisper[] => {
  return whisperRegistry.filter(whisper => {
    return whisper.triggers.some(trigger => {
      switch (trigger.type) {
        case 'entropy':
          return currentState.entropy >= (trigger.threshold || 0.65);
        case 'trait':
          // If a specific traitId is provided in trigger, check for that.
          // Otherwise, the original prompt example implied any trait activity.
          // For this version, let's assume a generic trait trigger fires if any traits exist.
          // This can be refined if trigger.traitId is used.
          return currentState.activeTraits.length > 0; // Simple check: any trait activity
        case 'playback':
          return currentState.playbackStatus === trigger.state;
        case 'glyph':
          if (trigger.glyphId === 'any') { // Special condition for SystemDebug whisper
            return currentState.activeGlyph !== null;
          }
          return currentState.activeGlyph === trigger.glyphId;
        default:
          return false;
      }
    });
  });
};