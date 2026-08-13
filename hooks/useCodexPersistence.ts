
import { useEffect } from 'react';
import type { PersistenceTarget, CodexStateSnapshot, EchoMessage, AgentNode, SimulationGrid, GlyphMutationNode, PlacedGlyph, CanvasConnection, HistoricalEvent, RewovenGlyph } from '../types';

const CODEX_APP_VERSION = 'Δ.2.3'; // Version for storage schema (updated for seekerTraits & new events)

const safeGetItem = (key: string): string | null => {
  try {
    return localStorage.getItem(key);
  } catch (e) {
    console.warn(`CodexPersistence: Failed to get item '${key}' from localStorage.`, e);
    return null;
  }
};

const safeSetItem = (key: string, value: string): void => {
  try {
    localStorage.setItem(key, value);
  } catch (e) {
    console.warn(`CodexPersistence: Failed to set item '${key}' in localStorage.`, e);
  }
};

const safeClearStorage = (): void => {
  try {
    const currentVersion = safeGetItem('codexVersion'); 
    localStorage.clear();
    if (currentVersion) { 
        safeSetItem('codexVersion', currentVersion);
    }
    console.log('CodexPersistence: localStorage cleared (except version potentially).');
  } catch (e) {
    console.warn(`CodexPersistence: Failed to clear localStorage.`, e);
  }
};


export const useCodexPersistence = (
  targets: PersistenceTarget[],
  stateValues: CodexStateSnapshot
) => {
  useEffect(() => {
    const saveState = () => {
      console.log('CodexPersistence: Attempting to save state...');
      targets.forEach(target => {
        try {
          switch (target) {
            case 'EchoLog':
              if (stateValues.echoLog) safeSetItem('codexEchoLog', JSON.stringify(stateValues.echoLog));
              break;
            case 'AgentGridState':
              if (stateValues.agentGridState) safeSetItem('codexAgentGridState', JSON.stringify(stateValues.agentGridState));
              break;
            case 'GlyphTree':
              if (stateValues.glyphTree) safeSetItem('codexGlyphTree', JSON.stringify(stateValues.glyphTree));
              break;
            case 'RitualState':
              if (stateValues.ritualState) safeSetItem('codexRitualState', JSON.stringify(stateValues.ritualState));
              break;
            case 'SystemEntropy':
              if (typeof stateValues.systemEntropy === 'number') safeSetItem('codexSystemEntropy', stateValues.systemEntropy.toString());
              break;
            case 'AutoEchoState':
              if (stateValues.autoEchoState) safeSetItem('codexAutoEchoState', JSON.stringify(stateValues.autoEchoState));
              break;
            case 'EventHistory':
                 if (stateValues.eventHistory) safeSetItem('codexEventHistory', JSON.stringify(stateValues.eventHistory));
                 break;
            case 'ReweavingHistory':
                if (stateValues.reweavingHistory) safeSetItem('codexReweavingHistory', JSON.stringify(stateValues.reweavingHistory));
                break;
            // SeekerTraits is now part of the main snapshot, handled below
          }
        } catch (e) {
            console.error(`CodexPersistence: Error saving target ${target}`, e);
        }
      });
      // Save seekerTraits explicitly if present in the snapshot
      if (stateValues.seekerTraits) {
        safeSetItem('codexSeekerTraits', JSON.stringify(stateValues.seekerTraits));
      }
      safeSetItem('codexVersion', CODEX_APP_VERSION); 
      console.log('CodexPersistence: State saved.');
    };

    const phaseIndicatorElement = document.getElementById('codex-phase-indicator');
    let phaseObserver: MutationObserver | null = null;

    if (phaseIndicatorElement) {
      phaseObserver = new MutationObserver(saveState);
      phaseObserver.observe(phaseIndicatorElement, { childList: true, characterData: true, subtree: true });
    }

    window.addEventListener('beforeunload', saveState);

    return () => {
      if (phaseObserver) phaseObserver.disconnect();
      window.removeEventListener('beforeunload', saveState);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [targets, stateValues]); 

  const hydrateState = (): CodexStateSnapshot => {
    console.log('CodexPersistence: Hydrating state...');
    const storedVersion = safeGetItem('codexVersion');
    if (storedVersion !== CODEX_APP_VERSION) {
      console.warn(`CodexPersistence: Version mismatch (stored: ${storedVersion}, app: ${CODEX_APP_VERSION}). Clearing non-version storage.`);
      const keysToClear: Array<keyof CodexStateSnapshot | string> = ['codexEchoLog', 'codexAgentGridState', 'codexGlyphTree', 'codexRitualState', 'codexSystemEntropy', 'codexAutoEchoState', 'codexEventHistory', 'codexReweavingHistory', 'codexSeekerTraits'];
      keysToClear.forEach(key => {
        try { localStorage.removeItem(key as string); } catch (e) { console.warn("Error removing item", key, e); }
      });
      safeSetItem('codexVersion', CODEX_APP_VERSION);
    }

    const hydrated: CodexStateSnapshot = {};
    try {
      targets.forEach(target => {
        switch (target) {
          case 'EchoLog':
            hydrated.echoLog = JSON.parse(safeGetItem('codexEchoLog') || '[]') as EchoMessage[];
            break;
          case 'AgentGridState':
            hydrated.agentGridState = JSON.parse(safeGetItem('codexAgentGridState') || '{}') as { agents: AgentNode[]; grid: SimulationGrid };
            break;
          case 'GlyphTree':
            hydrated.glyphTree = JSON.parse(safeGetItem('codexGlyphTree') || '[]') as GlyphMutationNode[];
            break;
          case 'RitualState':
            hydrated.ritualState = JSON.parse(safeGetItem('codexRitualState') || '{}') as { currentPhase: string; chaliceStatus: string; placedGlyphs: PlacedGlyph[]; connections: CanvasConnection[]; };
            break;
          case 'SystemEntropy':
            hydrated.systemEntropy = parseFloat(safeGetItem('codexSystemEntropy') || '0');
            break;
          case 'AutoEchoState':
            hydrated.autoEchoState = JSON.parse(safeGetItem('codexAutoEchoState') || '{}') as { isAutoEchoPaused: boolean; agentAwakeningLevelModifier: number; };
            break;
          case 'EventHistory':
            hydrated.eventHistory = JSON.parse(safeGetItem('codexEventHistory') || '[]') as HistoricalEvent[];
            break;
          case 'ReweavingHistory':
            hydrated.reweavingHistory = JSON.parse(safeGetItem('codexReweavingHistory') || '[]') as RewovenGlyph[];
            break;
        }
      });
      // Hydrate seekerTraits explicitly
      hydrated.seekerTraits = JSON.parse(safeGetItem('codexSeekerTraits') || 'null') as string[] | null || undefined; // Allow undefined if not found or null
      if (hydrated.seekerTraits === null) delete hydrated.seekerTraits; // Remove if explicitly null from storage

    } catch (e) {
        console.error("CodexPersistence: Error during hydration parsing.", e);
    }
    console.log('CodexPersistence: Hydration complete.');
    return hydrated;
  };

  return { hydrateState, safeClearStorage }; 
};
