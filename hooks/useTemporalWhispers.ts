import React, { useState, useEffect, useCallback, useMemo } from 'react';
import type { PlaybackState, HistoricalEvent } from '../types';
import { HistoricalEventType } from '../types';
import { whisperRegistry, extractTemporalWhispers, voiceProfiles, type VoiceProfile, type AgentWhisper } from '../lib/whisper/VoiceRegistry';
import { VoiceEngine } from '../lib/whisper/VoiceEngine';

// Instantiate VoiceEngine once
const voiceEngine = new VoiceEngine();

export const useTemporalWhispers = (
  eventHistory: HistoricalEvent[],
  setPlaybackState: React.Dispatch<React.SetStateAction<PlaybackState>>
) => {
  const [temporalWhispers, setTemporalWhispers] = useState<AgentWhisper[]>([]);

  useEffect(() => {
    if (eventHistory.length > 0) {
      const extracted = extractTemporalWhispers(eventHistory, whisperRegistry);
      setTemporalWhispers(extracted);
    } else {
      setTemporalWhispers([]);
    }
  }, [eventHistory]);

  const playAudio = useCallback(async (whisper: AgentWhisper) => {
    if (!whisper || !whisper.message) {
      console.warn("useTemporalWhispers: playAudio called with invalid whisper object.", whisper);
      return;
    }

    let profile: VoiceProfile | undefined = voiceProfiles.find(p => p.agent === whisper.agent);
    
    if (!profile) {
      console.warn(`Voice profile not found for agent: ${whisper.agent}. Using default.`);
      profile = voiceProfiles.find(p => p.agent === 'SystemDebug'); // Fallback to a default/debug profile
    }
    
    if (!profile) { // If still no profile (even default is missing)
        console.error("Default voice profile is missing. Cannot play audio.");
        // Basic fallback if everything else fails
        if (typeof window !== 'undefined' && window.speechSynthesis) {
            const utterance = new SpeechSynthesisUtterance(whisper.message);
            window.speechSynthesis.speak(utterance);
        }
        return;
    }

    try {
      // console.log(`useTemporalWhispers: Attempting to play audio for whisper ID ${whisper.id} with agent ${whisper.agent}`);
      await voiceEngine.speak(whisper.message, profile);
    } catch (error) {
      console.error('useTemporalWhispers: Voice synthesis failed for whisper:', whisper.id, error);
      // Fallback to basic browser TTS if voiceEngine.speak fails
      if (typeof window !== 'undefined' && window.speechSynthesis) {
        console.warn('useTemporalWhispers: Falling back to basic browser TTS.');
        const utterance = new SpeechSynthesisUtterance(whisper.message);
        // utterance.lang = 'en-US'; // Optional: set a default language
        window.speechSynthesis.speak(utterance);
      } else {
        alert(`Audio Playback Error for: ${whisper.agent}\n${whisper.message.substring(0,100)}...`);
      }
    }
  }, []); // voiceEngine is stable, no need to include in deps

  const seekToTime = useCallback((timestamp: number) => {
    setPlaybackState(prev => ({
      ...prev,
      currentHistoricalTime: timestamp,
      isActive: false, // Typically pause when seeking, can be changed if live seek is desired
    }));
  }, [setPlaybackState]);

  return { temporalWhispers, playAudio, seekToTime };
};
