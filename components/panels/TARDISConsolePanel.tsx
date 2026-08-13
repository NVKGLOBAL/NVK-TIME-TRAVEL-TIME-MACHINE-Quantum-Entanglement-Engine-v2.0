
import React, { useState } from 'react';
import { AgentName } from '../../types';

interface TARDISConsolePanelProps {
  addEchoMessage: (source: AgentName | string, text: string, colorClass?: string) => void;
  onEngageDrive: (coordinate: string) => void;
  temporalCoordinate: string;
  setTemporalCoordinate: (coord: string) => void;
  dimensionalDrift: string;
  setDimensionalDrift: (drift: string) => void;
}

const TARDISConsolePanel: React.FC<TARDISConsolePanelProps> = ({ 
  addEchoMessage, 
  onEngageDrive,
  temporalCoordinate,
  setTemporalCoordinate,
  dimensionalDrift,
  setDimensionalDrift
}) => {
  const [isEngaging, setIsEngaging] = useState<boolean>(false);

  const handleRandomize = () => {
    const planets = ['Earth', 'Gallifrey', 'Skaro', 'Mondas', 'Telos', 'Trenzalore', 'Mars', 'New Earth', 'Voga', 'Metebelis Three', 'Tardis', 'Pyrovilia', 'Adipose 3', 'Raxacoricofallapatorius', 'Messaline', 'The Library'];
    const locations = ['London', 'The Capitol', 'Kaalann', 'Voga', 'New New York', 'Cardiff', 'The Library', 'Pompeii', 'Kyoto', 'Bar-Gal-Ara-Sol', 'San Helios', 'I.M. Foreman Scrap Merchant', 'Bad Wolf Bay', 'The Shadow Proclamation', 'Platform One', 'Woman Wept'];
    
    const randomPlanet = planets[Math.floor(Math.random() * planets.length)];
    const randomLocation = locations[Math.floor(Math.random() * locations.length)];

    let dateString;
    if (Math.random() > 0.5) {
        const randomYear = Math.floor(Math.random() * 5000000) + 1;
        const randomMonth = Math.floor(Math.random() * 12) + 1;
        const randomDay = Math.floor(Math.random() * 28) + 1;
        dateString = `${randomYear}-${String(randomMonth).padStart(2, '0')}-${String(randomDay).padStart(2, '0')}`;
    } else {
        const randomYear = Math.floor(Math.random() * 10000) + 1;
        dateString = `${randomYear}BC`;
    }

    const newCoordinate = `${randomPlanet}:${randomLocation}:${dateString}`;
    setTemporalCoordinate(newCoordinate);

    const newDrift = (Math.random() * 2 - 1).toFixed(6);
    setDimensionalDrift(newDrift);

    addEchoMessage(AgentName.TARDISConsole, `Fast-tracking randomizer protocols. New target acquired: ${newCoordinate}`, "text-sky-300");
  };

  const handleEngageDrive = () => {
    if (!temporalCoordinate.trim() || isNaN(parseFloat(dimensionalDrift))) {
      addEchoMessage(AgentName.TARDISConsole, "Error: Invalid temporal coordinate or dimensional drift factor.", "text-rose-400");
      return;
    }
    setIsEngaging(true);
    const message = `TARDIS Drive Engaged. Targeting Temporal Coordinate: ${temporalCoordinate}, Dimensional Drift: ${parseFloat(dimensionalDrift).toFixed(6)}. Dematerializing...`;
    addEchoMessage(AgentName.TARDISConsole, message, "text-sky-400");
    
    onEngageDrive(temporalCoordinate);

    setTimeout(() => {
      setIsEngaging(false);
    }, 1500);
  };

  return (
    <div className="tardis-console-panel bg-blue-900/70 backdrop-blur-md border-2 border-blue-700/50 rounded-xl shadow-2xl p-6 text-slate-100 font-['Cormorant']">
      <h3 className="text-xl font-['Cinzel'] font-bold text-sky-300 mb-6 text-center">
        <i className="ri-dashboard-3-line mr-2 align-middle"></i>TARDIS Console
      </h3>

      <div className="space-y-4">
        <div>
          <label htmlFor="temporalCoordinate" className="block text-sm font-medium text-slate-300 mb-1">
            Temporal Coordinate
          </label>
          <input
            type="text"
            id="temporalCoordinate"
            value={temporalCoordinate}
            onChange={(e) => setTemporalCoordinate(e.target.value)}
            className="w-full p-2.5 bg-slate-800 border border-slate-600 rounded-lg text-slate-100 placeholder-slate-500 focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-colors duration-150 text-sm"
            placeholder="e.g., Gallifrey:TheCapitol:YearMinusOne"
            disabled={isEngaging}
            aria-label="Temporal Coordinate Input"
          />
        </div>

        <div>
          <label htmlFor="dimensionalDrift" className="block text-sm font-medium text-slate-300 mb-1">
            Dimensional Drift Factor
          </label>
          <input
            type="number"
            id="dimensionalDrift"
            value={dimensionalDrift}
            onChange={(e) => setDimensionalDrift(e.target.value)}
            className="w-full p-2.5 bg-slate-800 border border-slate-600 rounded-lg text-slate-100 placeholder-slate-500 focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-colors duration-150 text-sm"
            placeholder="e.g., 0.07734"
            step="0.0001"
            disabled={isEngaging}
            aria-label="Dimensional Drift Factor Input"
          />
        </div>

        <div className="flex gap-3">
            <button
              onClick={handleRandomize}
              disabled={isEngaging}
              className="w-auto flex-grow px-4 py-3 rounded-lg bg-slate-700 hover:bg-slate-600 text-slate-200 font-['Cinzel'] font-semibold text-md tracking-wider transition-all duration-150 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center group"
              aria-label="Randomize Coordinates"
            >
              <i className="ri-shuffle-line mr-2 group-hover:animate-pulse"></i>
              Randomize
            </button>
            <button
              onClick={handleEngageDrive}
              disabled={isEngaging || !temporalCoordinate.trim() || isNaN(parseFloat(dimensionalDrift))}
              className={`w-auto flex-grow-[2] px-4 py-3 rounded-lg bg-sky-600 hover:bg-sky-500 text-white font-['Cinzel'] font-semibold text-md tracking-wider transition-all duration-150 ease-in-out disabled:bg-slate-700 disabled:text-slate-500 disabled:cursor-not-allowed flex items-center justify-center group shadow-lg hover:shadow-sky-500/40
                ${isEngaging ? 'animate-pulse' : ''}
              `}
              aria-label="Engage TARDIS Drive"
            >
              {isEngaging ? (
                <>
                  <i className="ri-loader-2-line animate-spin mr-2"></i>
                  Engaging...
                </>
              ) : (
                <>
                  <i className="ri-rocket-2-fill mr-2 group-hover:animate-ping-slow"></i>
                  Engage Drive
                </>
              )}
            </button>
        </div>
      </div>
      <p className="text-center text-xs text-blue-300/70 mt-5 font-mono">
        Authorized Seekers Only. Handle with temporal care.
      </p>
    </div>
  );
};

export default TARDISConsolePanel;
