
import React, { useEffect, useRef } from 'react';
import type { EchoMessage } from '../types';

interface EchoScribePanelProps {
  echoes: EchoMessage[];
}

export const EchoScribePanel: React.FC<EchoScribePanelProps> = ({ echoes }) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop = 0; // Scroll to top for new messages
    }
  }, [echoes]);

  return (
    <div className="bg-slate-900/80 backdrop-blur-sm border border-slate-700 rounded-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <div className="text-lg font-semibold text-slate-200 font-['Cinzel']">Echo Log</div>
        <div className="flex space-x-3">
          <button className="rounded-button bg-slate-800 hover:bg-slate-700 text-slate-200 px-3 py-1.5 text-sm transition whitespace-nowrap flex items-center">
            <i className="ri-history-line mr-1"></i>History
          </button>
          <button className="rounded-button bg-slate-800 hover:bg-slate-700 text-slate-200 px-3 py-1.5 text-sm transition whitespace-nowrap flex items-center">
            <i className="ri-save-line mr-1"></i>Save
          </button>
        </div>
      </div>
      <div ref={scrollContainerRef} className="h-64 overflow-y-auto space-y-4 p-2 bg-slate-800/50 rounded-md shadow-inner">
        {echoes.map((echo) => (
          <div key={echo.id} className="echo-message font-['Cormorant']">
            <span className={`${echo.colorClass} uppercase text-xs tracking-wide font-['Cinzel'] font-semibold`}>{echo.source}:</span>
            <div className="text-slate-200 whitespace-pre-line italic ml-2">{echo.text}</div>
          </div>
        ))}
      </div>
    </div>
  );
};
