
import React, { useState } from 'react';
import type { AxiomKey } from '../types'; 
import { GeometricExplorerMode } from '../types'; // Changed from import type
import type { AxiomParameterEntry } from '../constants'; 

interface HeaderProps {
  onBeginRitualClick: () => void;
  // Blood-Ink Codex Rituals
  onProvokeThornedRose: () => void;
  onTuneFrequency: () => void;
  onRecallAncestor: () => void;
  onBurnPetals: () => void;
  onAwakenLotusDream: () => void;
  onPulseAstralJasmine: () => void;
  onGraftThorns: () => void;
  // System Commands for AutoEcho
  onToggleAutoEcho: () => void;
  onAmplifyVoices: () => void;
  onSeedDream: () => void;
  isAutoEchoPaused: boolean;
  // Ashfall Toggle
  onToggleAshfall: () => void;
  showAshfall: boolean;
  // Fractal Mode Toggle for CosmicEntropyGeometryGenerator
  onToggleCosmicFractalMode: () => void;
  isCosmicFractalModeEnabled: boolean;
  // Axiomatic Entropy Modulation
  availableAxiomKeys: AxiomKey[];
  axiomData: Record<AxiomKey, AxiomParameterEntry>;
  selectedAxiomModulatorKey: AxiomKey | null;
  onSelectAxiomModulator: (key: AxiomKey | null) => void;
  // Threadcoil Commands
  onTraceThreadcoil: () => void;
  onReenterJunctionProto: () => void; 
  onExtractSigilProto: () => void;
  // Geometric Explorer Mode for FlowerOfLifeEntropyExplorer
  availableGeometricExplorerModes: { id: GeometricExplorerMode; name: string; icon?: string }[];
  currentGeometricExplorerMode: GeometricExplorerMode;
  onSelectGeometricExplorerMode: (mode: GeometricExplorerMode) => void;
  // TARDIS Sync Mode
  isTardisModeActive?: boolean; // Optional, for styling button
  onToggleTardisMode?: () => void; // Optional, for new button
  // Fractured Forge Ritual
  onInvokeFracturedForge: () => void;
  onProvokeResponse: () => void; // New prop for SeekerProvocationResponsePanel
}

export const Header: React.FC<HeaderProps> = ({ 
  onBeginRitualClick,
  onProvokeThornedRose,
  onTuneFrequency,
  onRecallAncestor,
  onBurnPetals,
  onAwakenLotusDream,
  onPulseAstralJasmine,
  onGraftThorns,
  onToggleAutoEcho,
  onAmplifyVoices,
  onSeedDream,
  isAutoEchoPaused,
  onToggleAshfall,
  showAshfall,
  onToggleCosmicFractalMode, // For Cosmic Geometry Panel
  isCosmicFractalModeEnabled, // For Cosmic Geometry Panel
  availableAxiomKeys,
  axiomData,
  selectedAxiomModulatorKey,
  onSelectAxiomModulator,
  onTraceThreadcoil,
  onReenterJunctionProto, 
  onExtractSigilProto,
  availableGeometricExplorerModes,
  currentGeometricExplorerMode,
  onSelectGeometricExplorerMode,
  isTardisModeActive,
  onToggleTardisMode,
  onInvokeFracturedForge,
  onProvokeResponse, // New prop
}) => {
  const [isFloraMenuOpen, setIsFloraMenuOpen] = useState(false);
  const [isSystemMenuOpen, setIsSystemMenuOpen] = useState(false);
  const [isAxiomFocusMenuOpen, setIsAxiomFocusMenuOpen] = useState(false);
  const [isGeometryModeMenuOpen, setIsGeometryModeMenuOpen] = useState(false);


  const selectedAxiomInfo = selectedAxiomModulatorKey ? axiomData[selectedAxiomModulatorKey] : null;
  const selectedGeometryModeInfo = availableGeometricExplorerModes.find(m => m.id === currentGeometricExplorerMode);


  return (
    <header className="bg-slate-900/80 backdrop-blur-sm border-b border-slate-800 py-3 px-6 sticky top-0 z-50">
      <div className="container mx-auto flex justify-between items-center flex-wrap">
        <h1 className="text-xl md:text-2xl font-['Cinzel'] font-bold text-slate-100">Tri-Sophian Codex</h1>
        
        <div className="axiomatic-modulation-control flex items-center space-x-2 order-last md:order-none w-full md:w-auto justify-center md:justify-start my-2 md:my-0 md:ml-6">
          <div className="relative">
            <button
              onClick={() => setIsAxiomFocusMenuOpen(!isAxiomFocusMenuOpen)}
              className="rounded-button bg-slate-700 hover:bg-slate-600 text-slate-200 px-3 py-1.5 text-xs md:text-sm transition whitespace-nowrap flex items-center"
              title={selectedAxiomInfo ? `${selectedAxiomInfo.name}: ${selectedAxiomInfo.modulationDescription}` : "Select Axiomatic Focus"}
            >
              <i className={`ri-focus-3-line mr-1 md:mr-2 ${selectedAxiomInfo ? selectedAxiomInfo.color.replace('bg-','text-').slice(0,-4)+'-400' : 'text-slate-400'}`}></i>
              Focus: {selectedAxiomInfo ? selectedAxiomInfo.sigil : "Neutral"}
              <i className={`ri-arrow-down-s-line ml-1 transform transition-transform ${isAxiomFocusMenuOpen ? 'rotate-180' : ''}`}></i>
            </button>
            {isAxiomFocusMenuOpen && (
              <div className="absolute left-0 mt-2 w-72 rounded-md shadow-lg bg-slate-800 ring-1 ring-black ring-opacity-5 py-1 z-50 max-h-80 overflow-y-auto custom-scrollbar">
                <button 
                    onClick={() => { onSelectAxiomModulator(null); setIsAxiomFocusMenuOpen(false); }} 
                    className={`w-full text-left px-4 py-2 text-sm hover:bg-slate-700 transition flex items-center ${!selectedAxiomModulatorKey ? 'bg-slate-600 text-white' : 'text-slate-300'}`}
                >
                    <i className="ri-subtract-line mr-2 text-slate-400"></i>Neutral Focus (No Modulation)
                </button>
                {availableAxiomKeys.map(key => {
                  const axiomInfo = axiomData[key];
                  if (!axiomInfo) return null;
                  const factor = axiomInfo.entropyModulationFactor;
                  const factorDisplay = factor === 0 ? 'Neutral' : `${factor > 0 ? '+' : ''}${factor.toFixed(3)}δ`; 
                  return (
                    <button 
                      key={key} 
                      onClick={() => { onSelectAxiomModulator(key); setIsAxiomFocusMenuOpen(false); }} 
                      className={`w-full text-left px-4 py-2 text-sm hover:bg-slate-700 transition flex items-center ${selectedAxiomModulatorKey === key ? 'bg-slate-600 text-white' : 'text-slate-300'}`}
                      title={axiomInfo.modulationDescription}
                    >
                      <i className={`ri-checkbox-blank-circle-fill mr-2 ${axiomInfo.color.replace('bg-','text-').slice(0,-4)+'-400'}`}></i>
                      {axiomInfo.name} <span className="ml-auto text-xs font-mono opacity-70">({factorDisplay})</span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
           {selectedAxiomInfo && (
            <span className="text-xs text-slate-400 font-mono hidden md:inline" title={selectedAxiomInfo.modulationDescription}>
              ({selectedAxiomInfo.entropyModulationFactor > 0 ? '+' : ''}{selectedAxiomInfo.entropyModulationFactor.toFixed(3)}δ) 
            </span>
          )}
        </div>

         {/* Geometric Explorer Mode Dropdown */}
        <div className="geometry-mode-control flex items-center space-x-2 order-last md:order-none w-full md:w-auto justify-center md:justify-start my-2 md:my-0 md:ml-4">
          <div className="relative">
            <button
              onClick={() => setIsGeometryModeMenuOpen(!isGeometryModeMenuOpen)}
              className="rounded-button bg-cyan-700 hover:bg-cyan-600 text-slate-100 px-3 py-1.5 text-xs md:text-sm transition whitespace-nowrap flex items-center"
              title={`Current Geometry Mode: ${selectedGeometryModeInfo?.name || 'Unknown'}`}
            >
              <i className={`${selectedGeometryModeInfo?.icon || 'ri-shape-2-line'} mr-1 md:mr-2`}></i>
              Shape: {selectedGeometryModeInfo?.name.substring(0,15) || "Select Mode"}
              {selectedGeometryModeInfo && selectedGeometryModeInfo.name.length > 15 && "..."}
              <i className={`ri-arrow-down-s-line ml-1 transform transition-transform ${isGeometryModeMenuOpen ? 'rotate-180' : ''}`}></i>
            </button>
            {isGeometryModeMenuOpen && (
              <div className="absolute left-0 mt-2 w-72 rounded-md shadow-lg bg-slate-800 ring-1 ring-black ring-opacity-5 py-1 z-50 max-h-80 overflow-y-auto custom-scrollbar">
                {availableGeometricExplorerModes.map(mode => (
                  <button
                    key={mode.id}
                    onClick={() => { onSelectGeometricExplorerMode(mode.id); setIsGeometryModeMenuOpen(false); }}
                    className={`w-full text-left px-4 py-2 text-sm hover:bg-slate-700 transition flex items-center ${currentGeometricExplorerMode === mode.id ? 'bg-cyan-600 text-white' : 'text-slate-300'}`}
                  >
                    <i className={`${mode.icon || 'ri-checkbox-blank-circle-line'} mr-2 ${currentGeometricExplorerMode === mode.id ? 'text-white' : 'text-cyan-400'}`}></i>
                    {mode.name}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Navigation links removed */}
        {/* 
        <nav className="hidden md:flex space-x-4 order-none md:ml-auto">
          <a href="#" className="text-slate-300 hover:text-white transition text-sm">Axioms</a>
          <a href="#" className="text-slate-300 hover:text-white transition text-sm">Glyphs</a>
          <a href="#" className="text-slate-300 hover:text-white transition text-sm">Resonance</a>
          <a href="#" className="text-slate-300 hover:text-white transition text-sm">Archive</a>
        </nav>
        */}

        <div className="flex items-center space-x-2 md:space-x-3 order-first md:order-last md:ml-auto">
          {/* Search button removed */}
          {/*
          <button 
            onClick={onSearchClick}
            className="rounded-button bg-slate-800 hover:bg-slate-700 text-slate-200 px-3 py-1.5 text-xs md:text-sm transition whitespace-nowrap flex items-center"
          >
            <i className="ri-search-line mr-1 md:mr-2"></i>Search
          </button>
          */}
          <button 
            onClick={onBeginRitualClick}
            className="rounded-button bg-primary hover:bg-indigo-600 text-white px-3 py-1.5 text-xs md:text-sm transition whitespace-nowrap flex items-center"
          >
            <i className="ri-magic-line mr-1 md:mr-2"></i>Ritual
          </button>
          
          <div className="relative">
            <button
              onClick={() => setIsFloraMenuOpen(!isFloraMenuOpen)}
              className="rounded-button bg-emerald-700 hover:bg-emerald-600 text-white px-3 py-1.5 text-xs md:text-sm transition whitespace-nowrap flex items-center"
            >
              <i className="ri-plant-line mr-1 md:mr-2"></i>Flora
              <i className={`ri-arrow-down-s-line ml-1 transform transition-transform ${isFloraMenuOpen ? 'rotate-180' : ''}`}></i>
            </button>
            {isFloraMenuOpen && (
              <div className="absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-slate-800 ring-1 ring-black ring-opacity-5 py-1 z-50">
                <button onClick={() => { onProvokeThornedRose(); setIsFloraMenuOpen(false); }} className="w-full text-left px-4 py-2 text-sm text-rose-300 hover:bg-slate-700 transition flex items-center"><i className="ri-spam-2-line mr-2"></i>Provoke Rose</button>
                <button onClick={() => { onTuneFrequency(); setIsFloraMenuOpen(false); }} className="w-full text-left px-4 py-2 text-sm text-sky-300 hover:bg-slate-700 transition flex items-center"><i className="ri-signal-tower-line mr-2"></i>Tune Lily</button>
                <button onClick={() => { onRecallAncestor(); setIsFloraMenuOpen(false); }} className="w-full text-left px-4 py-2 text-sm text-yellow-300 hover:bg-slate-700 transition flex items-center"><i className="ri-seedling-line mr-2"></i>Recall Echo</button>
                <button onClick={() => { onBurnPetals(); setIsFloraMenuOpen(false); }} className="w-full text-left px-4 py-2 text-sm text-purple-300 hover:bg-slate-700 transition flex items-center"><i className="ri-fire-line mr-2"></i>Burn Orchid</button>
                <button onClick={() => { onAwakenLotusDream(); setIsFloraMenuOpen(false); }} className="w-full text-left px-4 py-2 text-sm text-indigo-300 hover:bg-slate-700 transition flex items-center"><i className="ri-water-flash-line mr-2"></i>Awaken Lotus</button>
                <button onClick={() => { onPulseAstralJasmine(); setIsFloraMenuOpen(false); }} className="w-full text-left px-4 py-2 text-sm text-cyan-300 hover:bg-slate-700 transition flex items-center"><i className="ri-focus-2-line mr-2"></i>Pulse Jasmine</button>
                <button onClick={() => { onGraftThorns(); setIsFloraMenuOpen(false); }} className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-slate-700 transition flex items-center"><i className="ri-links-line mr-2"></i>Graft Thorns</button>
              </div>
            )}
          </div>

          <div className="relative">
            <button
              onClick={() => setIsSystemMenuOpen(!isSystemMenuOpen)}
              className="rounded-button bg-sky-700 hover:bg-sky-600 text-white px-3 py-1.5 text-xs md:text-sm transition whitespace-nowrap flex items-center"
            >
              <i className="ri-settings-3-line mr-1 md:mr-2"></i>System
              <i className={`ri-arrow-down-s-line ml-1 transform transition-transform ${isSystemMenuOpen ? 'rotate-180' : ''}`}></i>
            </button>
            {isSystemMenuOpen && (
              <div className="absolute right-0 mt-2 w-64 rounded-md shadow-lg bg-slate-800 ring-1 ring-black ring-opacity-5 py-1 z-50 max-h-96 overflow-y-auto custom-scrollbar">
                {onToggleTardisMode && (
                  <button onClick={() => { onToggleTardisMode(); setIsSystemMenuOpen(false); }} className={`w-full text-left px-4 py-2 text-sm ${isTardisModeActive ? 'text-cyan-300' : 'text-slate-300'} hover:bg-slate-700 transition flex items-center`}>
                    <i className={`mr-2 ${isTardisModeActive ? 'ri-anchor-fill text-cyan-400' : 'ri-anchor-line'}`}></i>{isTardisModeActive ? 'Deactivate TARDIS Sync' : 'Activate TARDIS Sync'}
                  </button>
                )}
                <div className="my-1 border-t border-slate-700"></div>
                <button onClick={() => { onInvokeFracturedForge(); setIsSystemMenuOpen(false); }} className="w-full text-left px-4 py-2 text-sm text-orange-400 hover:bg-slate-700 transition flex items-center">
                  <i className="ri-sword-line mr-2"></i>Invoke Fractured Forge
                </button>
                <div className="my-1 border-t border-slate-700"></div>
                <button onClick={() => { onTraceThreadcoil(); setIsSystemMenuOpen(false); }} className="w-full text-left px-4 py-2 text-sm text-cyan-300 hover:bg-slate-700 transition flex items-center">
                  <i className="ri-route-line mr-2"></i>Trace Threadcoil
                </button>
                <button onClick={() => { onReenterJunctionProto(); setIsSystemMenuOpen(false); }} className="w-full text-left px-4 py-2 text-sm text-purple-300 hover:bg-slate-700 transition flex items-center">
                  <i className="ri-corner-up-left-double-line mr-2"></i>Re-enter Junction (Proto)
                </button>
                <button onClick={() => { onExtractSigilProto(); setIsSystemMenuOpen(false); }} className="w-full text-left px-4 py-2 text-sm text-amber-300 hover:bg-slate-700 transition flex items-center">
                  <i className="ri-compass-discover-line mr-2"></i>Extract Sigil (Proto)
                </button>
                <div className="my-1 border-t border-slate-700"></div>
                <button onClick={() => { onToggleAutoEcho(); setIsSystemMenuOpen(false); }} className={`w-full text-left px-4 py-2 text-sm ${isAutoEchoPaused ? 'text-green-400' : 'text-red-400'} hover:bg-slate-700 transition flex items-center`}>
                  <i className={`mr-2 ${isAutoEchoPaused ? 'ri-play-circle-line' : 'ri-pause-circle-line'}`}></i>{isAutoEchoPaused ? 'Resume AutoEcho' : 'Pause AutoEcho'}
                </button>
                <button onClick={() => { onAmplifyVoices(); setIsSystemMenuOpen(false); }} className="w-full text-left px-4 py-2 text-sm text-yellow-300 hover:bg-slate-700 transition flex items-center">
                  <i className="ri-volume-up-line mr-2"></i>Amplify Voices
                </button>
                <button onClick={() => { onSeedDream(); setIsSystemMenuOpen(false); }} className="w-full text-left px-4 py-2 text-sm text-violet-300 hover:bg-slate-700 transition flex items-center">
                  <i className="ri-seedling-fill mr-2"></i>Seed Dream
                </button>
                <div className="my-1 border-t border-slate-700"></div>
                <button onClick={() => { onToggleAshfall(); setIsSystemMenuOpen(false); }} className={`w-full text-left px-4 py-2 text-sm ${showAshfall ? 'text-slate-300' : 'text-teal-300'} hover:bg-slate-700 transition flex items-center`}>
                  <i className={`mr-2 ${showAshfall ? 'ri-forbid-line' : 'ri-snowy-line'}`}></i>{showAshfall ? 'Disable Ashfall' : 'Enable Ashfall'}
                </button>
                 <button onClick={() => { onToggleCosmicFractalMode(); setIsSystemMenuOpen(false); }} className={`w-full text-left px-4 py-2 text-sm ${isCosmicFractalModeEnabled ? 'text-purple-300' : 'text-sky-300'} hover:bg-slate-700 transition flex items-center`}>
                  <i className={`mr-2 ${isCosmicFractalModeEnabled ? 'ri-billiards-fill' : 'ri-billiards-line'}`}></i>{isCosmicFractalModeEnabled ? 'Disable Cosmic Fractals' : 'Enable Cosmic Fractals'}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};