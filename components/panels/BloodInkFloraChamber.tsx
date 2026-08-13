
import React from 'react';
import type { BloodInkFloraChamberProps, BloodInkSpeciesName } from '../../types';
import { BLOOD_INK_SPECIES_DATA } from '../../constants';


const getFloraThemeClasses = (speciesName: BloodInkSpeciesName | null): { bg: string, border: string, text: string, shadow: string } => {
    if (!speciesName) {
        return { 
            bg: 'bg-slate-800/70', 
            border: 'border-slate-700', 
            text: 'text-slate-400',
            shadow: 'shadow-slate-900/50'
        };
    }

    const speciesInfo = BLOOD_INK_SPECIES_DATA[speciesName];
    const color = speciesInfo.colorClass || 'text-slate-400'; // e.g., text-rose-400

    // Extract the color name (e.g., "rose") and intensity (e.g., "400")
    const match = color.match(/text-([a-z]+)-(\d+)/);
    if (match) {
        const colorName = match[1];
        // const intensity = parseInt(match[2]);
        // Adjust intensity for background and border for a cohesive theme
        return {
            bg: `bg-${colorName}-900/60`, // Darker background with opacity
            border: `border-${colorName}-700/80`, // Slightly lighter border
            text: `text-${colorName}-300`, // Lighter text for contrast
            shadow: `shadow-${colorName}-500/30`
        };
    }

    // Fallback if colorClass format is unexpected
    return { 
        bg: 'bg-slate-800/70', 
        border: 'border-slate-700', 
        text: 'text-slate-400',
        shadow: 'shadow-slate-900/50'
    };
};


const BloodInkFloraChamber: React.FC<BloodInkFloraChamberProps> = ({ activeSpeciesName, allSpeciesData }) => {
  const activeSpecies = activeSpeciesName ? allSpeciesData[activeSpeciesName] : null;
  const theme = getFloraThemeClasses(activeSpeciesName);

  return (
    <div 
      className={`blood-ink-flora-chamber w-full max-w-lg mx-auto p-4 rounded-lg border-2 transition-all duration-500 ease-in-out relative overflow-hidden ${theme.bg} ${theme.border} shadow-lg ${theme.shadow}`}
      style={{ minHeight: '120px' }}
      role="region"
      aria-label="Blood-Ink Flora Nurturing Chamber"
    >
      {/* Subtle background pattern/texture - placeholder */}
      <div 
        className="absolute inset-0 opacity-20"
        style={{
            backgroundImage: activeSpecies 
                ? `radial-gradient(circle, ${theme.text.replace('text-', 'rgba(').replace('-300', ',0.3)')} 0%, transparent 70%)` 
                : `radial-gradient(circle, rgba(100,116,139,0.1) 0%, transparent 60%)`,
            backgroundSize: '200% 200%',
            animation: activeSpecies ? 'subtleShine 15s linear infinite' : 'none',
        }}
      />
      
      <div className="relative z-10 flex flex-col items-center justify-center h-full text-center">
        {activeSpecies ? (
          <>
            <div 
              className={`text-5xl mb-1 transition-opacity duration-500 ${activeSpeciesName ? 'opacity-100 animate-pulse-fast' : 'opacity-0'}`}
              style={{ textShadow: `0 0 15px var(--tw-shadow-color, ${theme.text.replace('text-', 'rgba(').replace('-300', ',0.5)')})` }} // Using Tailwind shadow color variable
              aria-label={`Symbol: ${activeSpecies.symbol}`}
            >
              {activeSpecies.symbol}
            </div>
            <h4 className={`text-md font-cinzel font-semibold transition-opacity duration-500 ${theme.text}`}>
              {activeSpecies.name}
            </h4>
            <p className={`text-xs mt-0.5 transition-opacity duration-500 ${theme.text} opacity-70`}>
              {activeSpecies.description.substring(0, 70)}{activeSpecies.description.length > 70 ? '...' : ''}
            </p>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center">
            <div className="text-3xl text-slate-600 mb-1">
              <i className="ri-seedling-line"></i>
            </div>
            <h4 className="text-sm font-cinzel text-slate-500">Flora Dormant</h4>
            <p className="text-xs text-slate-600">Awaiting ritual echoes...</p>
          </div>
        )}
      </div>
      {/* Removed invalid <style jsx global> tag. 
          The 'subtleShine' animation needs to be defined globally (e.g., in CSS or index.html) to work.
          Example CSS for subtleShine:
          @keyframes subtleShine {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
          }
      */}
    </div>
  );
};

export default BloodInkFloraChamber;

// Helper to create Tailwind-compatible shadow color variable (conceptual, actual JIT handles this)
// This would typically be part of Tailwind's processing.
// For direct style usage:
// const shadowColor = theme.text.replace('text-', 'rgba(').replace('-300',',0.5'); // Example
// style={{ textShadow: `0 0 15px ${shadowColor}` }}
// Or use a filter: drop-shadow for more flexibility if textShadow isn't enough.
// For now, the class `theme.shadow` is a placeholder for future Tailwind config.
// Using textShadow directly with a parsed color.
