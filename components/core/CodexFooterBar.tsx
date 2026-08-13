
import React from 'react';
import type { ThreadcoilState } from '../../types'; // Import ThreadcoilState

type Props = {
  phase: string;
  mode: 'Spiral' | 'Singularity' | 'Archive';
  status: string;
  currentEntropy: number;
  onApplyOmegaAnchor: () => void;
  threadcoilState: ThreadcoilState; // New prop
  isTardisModeActive?: boolean; // New prop for TARDIS mode
};

const CodexFooterBar = ({ phase, mode, status, currentEntropy, onApplyOmegaAnchor, threadcoilState, isTardisModeActive }: Props) => {
  const modeColorClass = () => {
    switch (mode) {
      case 'Spiral':
        return 'text-emerald-400';
      case 'Singularity':
        return 'text-amber-400';
      case 'Archive':
        return 'text-slate-400';
      default:
        return 'text-slate-200';
    }
  };
  
  const threadcoilColorClass = () => {
    switch (threadcoilState) {
      case 'Inert': return 'text-slate-500';
      case 'Spooling': return 'text-cyan-400 animate-pulse-fast';
      case 'Woven': return 'text-emerald-400';
      case 'Knotted': return 'text-amber-400';
      case 'Frayed': return 'text-rose-400';
      default: return 'text-slate-400';
    }
  };

  const tardisSyncColorClass = isTardisModeActive ? 'text-cyan-300' : 'text-slate-500';

  const isOmegaAnchorDisabled = currentEntropy <= 0.6;

  const handleSystemRestore = () => {
    if (confirm('This will reset the current session to the last saved sacred state from your local codex. Unsaved changes may be lost. Proceed?')) {
      window.location.reload();
    }
  };

  return (
    <div className="codex-footer-bar flex items-center justify-between px-6 py-3 text-slate-300 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 border-t border-slate-700/50 shadow-inner text-xs uppercase tracking-wider font-mono">
      <div id="codex-phase-indicator" className="phase-indicator text-indigo-400">
        <span>Δ Phase: {phase}</span>
      </div>
      <div className={`mode-display ${modeColorClass()}`}>
        <span>{mode} Mode</span>
      </div>
      <div className={`threadcoil-status-display ${threadcoilColorClass()}`}>
        <span>Threadcoil: {threadcoilState}</span>
      </div>
      <div className={`tardis-sync-status ${tardisSyncColorClass}`}>
        <span>TARDIS Sync: {isTardisModeActive ? 'ACTIVE' : 'INERT'}</span>
      </div>
      <div className="status-panel text-amber-400 italic flex items-center space-x-4">
        <span>{status}</span>
        <button
          onClick={onApplyOmegaAnchor}
          disabled={isOmegaAnchorDisabled}
          className={`px-2 py-1 rounded text-xs font-semibold transition-colors duration-150 flex items-center
            ${isOmegaAnchorDisabled 
              ? 'bg-slate-700 text-slate-500 cursor-not-allowed' 
              : 'bg-sky-600 hover:bg-sky-500 text-sky-100'}`}
          title={isOmegaAnchorDisabled ? "Entropy stable, Ω-Anchor not needed." : "Apply Ω-Anchor to reduce system entropy by 0.1δ"}
        >
          <i className="ri-shield-star-line mr-1"></i>
          Ω-Anchor
        </button>
        <button
          onClick={handleSystemRestore}
          className="px-2 py-1 rounded text-xs font-semibold transition-colors duration-150 flex items-center bg-rose-700 hover:bg-rose-600 text-rose-100"
          title="Restore Sacred State: Reloads the application from the last saved state in your local codex."
        >
          <i className="ri-refresh-line mr-1"></i>
          Restore State
        </button>
      </div>
    </div>
  );
};

export default CodexFooterBar;
