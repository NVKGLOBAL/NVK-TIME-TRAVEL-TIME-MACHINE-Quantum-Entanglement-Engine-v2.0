
import React from 'react';
import type { SeekerPathPanelProps } from '../../types';

const SeekerPathPanel: React.FC<SeekerPathPanelProps> = ({ seekerTraits }) => {
  return (
    <div className="seeker-path-panel bg-slate-900/80 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6 shadow-2xl my-8 text-slate-100">
      <h3 className="text-xl font-['Cinzel'] font-bold mb-6 text-center">The Seeker's Path</h3>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Left Pane: Trait Tree */}
        <div className="trait-tree-section bg-slate-800/50 p-4 rounded-lg border border-slate-700">
          <h4 className="text-lg font-['Cinzel'] text-purple-300 mb-3">Seeker's Trait Tree</h4>
          {seekerTraits.length > 0 ? (
            <ul className="list-disc list-inside space-y-1 text-sm font-['Cormorant']">
              {seekerTraits.map(trait => (
                <li key={trait} className="ml-2 text-slate-300">{trait}</li>
              ))}
            </ul>
          ) : (
             <p className="text-slate-500 italic text-sm">No traits acquired yet.</p>
          )}
          <p className="text-slate-600 italic text-xs mt-4">(Full trait evolution tree visualization pending...)</p>
        </div>

        {/* Right Pane: Sigil Builder */}
        <div className="sigil-builder-section bg-slate-800/50 p-4 rounded-lg border border-slate-700">
          <h4 className="text-lg font-['Cinzel'] text-amber-300 mb-3">Narrative Sigil Forge</h4>
          <div className="h-40 flex items-center justify-center border-2 border-dashed border-slate-600 rounded-md bg-slate-700/30">
            <p className="text-slate-500 italic text-sm">Sigil crafting interface pending...</p>
          </div>
          <button 
            className="mt-4 w-full px-4 py-2 text-sm rounded-button bg-amber-600 hover:bg-amber-500 text-white transition-colors disabled:bg-slate-600 disabled:cursor-not-allowed"
            disabled // Enable when functionality is ready
          >
            <i className="ri-compass-discover-line mr-2"></i>Export Sigil (Coming Soon)
          </button>
        </div>
      </div>
      
      <p className="text-xs text-slate-600 italic mt-6 text-center">(This panel will evolve to track your choices and allow symbolic manifestation of your journey.)</p>
    </div>
  );
};

export default SeekerPathPanel;
