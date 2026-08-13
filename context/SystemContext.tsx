
import React, { createContext, useContext, ReactNode } from 'react';

export interface SystemStateContextType {
  entropy: number;
  activeTraits: string[];
  playbackStatus: 'playing' | 'paused' | 'stopped';
  activeGlyph: string | null;
}

const SystemStateContext = createContext<SystemStateContextType | undefined>(undefined);

export const SystemStateProvider: React.FC<{ value: SystemStateContextType, children: ReactNode }> = ({ value, children }) => {
  return <SystemStateContext.Provider value={value}>{children}</SystemStateContext.Provider>;
};

export const useSystemState = (): SystemStateContextType => {
  const context = useContext(SystemStateContext);
  if (context === undefined) {
    throw new Error('useSystemState must be used within a SystemStateProvider');
  }
  return context;
};
