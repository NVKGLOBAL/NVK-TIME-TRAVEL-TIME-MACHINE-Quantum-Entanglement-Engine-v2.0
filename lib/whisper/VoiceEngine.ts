
import type { VoiceProfile } from './VoiceRegistry';

export class VoiceEngine {
  private audioContext: AudioContext | null = null;
  private availableVoices: SpeechSynthesisVoice[] = [];

  constructor() {
    if (typeof window !== 'undefined' && (window.AudioContext || (window as any).webkitAudioContext)) {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      this.loadVoices();
      if (window.speechSynthesis.onvoiceschanged !== undefined) {
        window.speechSynthesis.onvoiceschanged = () => this.loadVoices();
      }
    }
  }

  private loadVoices() {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      this.availableVoices = window.speechSynthesis.getVoices();
      // console.log("VoiceEngine: Voices loaded", this.availableVoices.map(v => v.name + " (" + v.lang + ") [" + v.voiceURI + "]"));
    }
  }
  
  private async webSpeechSynthesis(text: string, profile: VoiceProfile): Promise<void> {
    return new Promise((resolve, reject) => {
      if (typeof window === 'undefined' || !window.speechSynthesis) {
        reject(new Error("Speech synthesis not supported."));
        return;
      }
      
      // Ensure voices are loaded, might be async
      if (this.availableVoices.length === 0) {
        this.loadVoices(); // Attempt to load again
      }

      const utterance = new SpeechSynthesisUtterance(text);

      if (profile.params.voiceURI) {
        const selectedVoice = this.availableVoices.find(voice => voice.voiceURI === profile.params.voiceURI || voice.name === profile.params.voiceURI);
        if (selectedVoice) {
          utterance.voice = selectedVoice;
        } else {
          console.warn(`VoiceEngine: VoiceURI "${profile.params.voiceURI}" not found. Using browser default.`);
        }
      }
      
      utterance.pitch = profile.params.pitch ?? 1;
      utterance.rate = profile.params.rate ?? 1; // Rate can be > 1 for faster speech
      utterance.volume = profile.params.volume ?? 1;

      utterance.onend = () => {
        // console.log("VoiceEngine: Speech finished for:", text.substring(0,20)+"...");
        resolve();
      };

      utterance.onerror = (event) => {
        console.error("VoiceEngine: SpeechSynthesisUtterance error", event);
        reject(new Error(`Speech synthesis error: ${event.error}`));
      };
      
      // console.log("VoiceEngine: Attempting to speak:", utterance, "Profile:", profile);
      window.speechSynthesis.speak(utterance);
    });
  }

  private async elevenLabsSynthesis(text: string, profile: VoiceProfile): Promise<void> {
    console.warn("VoiceEngine: ElevenLabs synthesis not implemented.", text, profile);
    return Promise.reject(new Error("ElevenLabs not implemented."));
    // Stub:
    // const response = await fetch('https://api.elevenlabs.io/v1/text-to-speech/' + profile.params.voiceId, { /* ... */ });
    // const audioBuffer = await response.arrayBuffer();
    // return this.playAudioBuffer(audioBuffer, profile);
  }

  private async playAudioFile(text: string, profile: VoiceProfile): Promise<void> {
    console.warn("VoiceEngine: Audio file playback not implemented.", text, profile);
    return Promise.reject(new Error("Audio file playback not implemented."));
    // Stub:
    // const textHash = btoa(text).substring(0, 12);
    // const response = await fetch(`${profile.params.baseUrl}${textHash}.mp3`);
    // const buffer = await response.arrayBuffer();
    // return this.playAudioBuffer(buffer, profile);
  }
  
  private async playAudioBuffer(buffer: ArrayBuffer, profile: VoiceProfile): Promise<void> {
    if (!this.audioContext) {
      console.error("VoiceEngine: AudioContext not available for playAudioBuffer.");
      return Promise.reject(new Error("AudioContext not available."));
    }
    const source = this.audioContext.createBufferSource();
    source.buffer = await this.audioContext.decodeAudioData(buffer);
    
    // TODO: Implement effects chain from profile.effects using Web Audio API nodes
    // const panner = this.audioContext.createStereoPanner(); etc.
    // if (profile.effects.spatial) panner.pan.value = profile.effects.spatial.x;
    // source.connect(panner).connect(this.audioContext.destination);
    
    source.connect(this.audioContext.destination); // Connect directly for now
    source.start();
    return new Promise<void>((resolve) => { // Corrected to pass a function to resolve
      source.onended = () => resolve();
    });
  }
  
  // Placeholder for effects, to be built out with Web Audio API
  // private createReverb(intensity: number) { /* ... */ }
  // private createDelay(ms: number) { /* ... */ }
  // private createDistortion(amount: number) { /* ... */ }

  public async speak(text: string, profile: VoiceProfile): Promise<void> {
    // If profile specifies Nevik, re-randomize rate/pitch for this call
    if (profile.agent === 'Nevik' && profile.engine === 'webspeech') {
        const dynamicProfile = JSON.parse(JSON.stringify(profile)); // Deep copy
        dynamicProfile.params.rate = Math.random() * 0.4 + 0.8;
        dynamicProfile.params.pitch = Math.random() * 0.5 + 0.7;
        profile = dynamicProfile;
    }

    switch (profile.engine) {
      case 'webspeech':
        return this.webSpeechSynthesis(text, profile);
      case 'elevenlabs':
        return this.elevenLabsSynthesis(text, profile);
      case 'audiofile':
        return this.playAudioFile(text, profile);
      default:
        console.error(`VoiceEngine: Unknown speech engine "${(profile as any).engine}"`);
        return Promise.reject(new Error("Unknown speech engine."));
    }
  }
}
