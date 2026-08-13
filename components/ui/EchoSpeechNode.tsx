import React from 'react';
import type { EchoSpeechProps } from '../../types';
import { AgentName } from '../../types';

// FIX: Added missing Gemma3 sigil to satisfy Record<EchoSpeechProps['agent'], string>
const AGENT_SIGILS: Record<EchoSpeechProps['agent'], string> = {
  [AgentName.DeepSeek]: '🌀',
  [AgentName.Nevik]: '🜂',
};

// FIX: Added missing Gemma3 tone class to satisfy Record<EchoSpeechProps['agent'], string>
const AGENT_TONE_CLASSES: Record<EchoSpeechProps['agent'], string> = {
  [AgentName.DeepSeek]: 'deepseek-tone',
  [AgentName.Nevik]: 'nevik-tone',
};

const EchoSpeechNode: React.FC<EchoSpeechProps> = ({
  agent,
  message,
  position,
  lifespan = 12000, // Default lifespan from user spec
  isHarmonized, // Added prop
}) => {
  // The fade-out is primarily handled by CSS animation.
  // The removal from DOM/state is handled by App.tsx after 'lifespan'.

  return (
    <div
      className={`echo-speech-node ${AGENT_TONE_CLASSES[agent]} animate-fade-dissolve ${isHarmonized ? 'nevik-harmony-field' : ''}`}
      style={{
        top: `${position.y}px`,
        left: `${position.x}px`,
        animationDuration: `${lifespan}ms`,
        // transform: 'translateX(-50%)' // This is now part of the keyframes for fadeDissolve
      }}
      role="alert"
      aria-live="assertive"
    >
      <div className="sigil-pulse">{AGENT_SIGILS[agent]}</div>
      <div className="speech-bubble">{message}</div>
    </div>
  );
};

export default EchoSpeechNode;