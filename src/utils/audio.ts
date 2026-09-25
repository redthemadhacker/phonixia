/**
 * Web Audio API synthesizer + Web Speech API speech reader for Phonixia
 */

class SoundEngine {
  private ctx: AudioContext | null = null;
  public soundEnabled: boolean = true;
  public speechEnabled: boolean = true;

  private initCtx() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
  }

  // Play a harmonious success chime
  playSuccess() {
    if (!this.soundEnabled) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      
      const freqs = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
      freqs.forEach((freq, idx) => {
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now + idx * 0.08);

        gain.gain.setValueAtTime(0, now + idx * 0.08);
        gain.gain.linearRampToValueAtTime(0.2, now + idx * 0.08 + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.08 + 0.35);

        osc.connect(gain);
        gain.connect(this.ctx!.destination);

        osc.start(now + idx * 0.08);
        osc.stop(now + idx * 0.08 + 0.36);
      });
    } catch {
      // Audio playback fails gracefully if blocked
    }
  }

  // Play a soft bounce/step sound
  playStep() {
    if (!this.soundEnabled) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(160, now);
      osc.frequency.exponentialRampToValueAtTime(80, now + 0.06);

      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.07);
    } catch {
      // Graceful error ignore
    }
  }

  // Play a coin / star pickup sound
  playCoin() {
    if (!this.soundEnabled) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'square';
      osc.frequency.setValueAtTime(987.77, now); // B5
      osc.frequency.setValueAtTime(1318.51, now + 0.08); // E6

      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.32);
    } catch {}
  }

  // Play a pop sound (for bubbles or letters)
  playPop() {
    if (!this.soundEnabled) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(300, now);
      osc.frequency.exponentialRampToValueAtTime(800, now + 0.08);

      gain.gain.setValueAtTime(0.18, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.11);
    } catch {}
  }

  // Play gentle error thud
  playError() {
    if (!this.soundEnabled) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(180, now);
      osc.frequency.exponentialRampToValueAtTime(110, now + 0.2);

      gain.gain.setValueAtTime(0.15, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.26);
    } catch {}
  }

  // Play epic level up fanfare
  playFanfare() {
    if (!this.soundEnabled) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      const notes = [
        { f: 523.25, d: 0.15, t: 0 },
        { f: 659.25, d: 0.15, t: 0.15 },
        { f: 783.99, d: 0.15, t: 0.3 },
        { f: 1046.50, d: 0.45, t: 0.45 },
      ];

      notes.forEach((n) => {
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(n.f, now + n.t);

        gain.gain.setValueAtTime(0.2, now + n.t);
        gain.gain.exponentialRampToValueAtTime(0.001, now + n.t + n.d);

        osc.connect(gain);
        gain.connect(this.ctx!.destination);

        osc.start(now + n.t);
        osc.stop(now + n.t + n.d);
      });
    } catch {}
  }

  private availableVoices: SpeechSynthesisVoice[] = [];
  public selectedVoiceName: string = '';

  constructor() {
    this.initVoices();
  }

  private initVoices() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      const load = () => {
        const voices = window.speechSynthesis.getVoices();
        if (voices.length > 0) {
          this.availableVoices = voices;
        }
      };
      load();
      if (window.speechSynthesis.onvoiceschanged !== undefined) {
        window.speechSynthesis.onvoiceschanged = load;
      }
      // Retry in 250ms and 1000ms as Chrome often populates voices asynchronously
      setTimeout(load, 250);
      setTimeout(load, 1000);
    }
  }

  public getVoices(): SpeechSynthesisVoice[] {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      const current = window.speechSynthesis.getVoices();
      if (current.length > 0) {
        this.availableVoices = current;
      }
    }
    return this.availableVoices;
  }

  public setVoice(name: string) {
    this.selectedVoiceName = name;
  }

  // Find the warmest, sweetest, most kid-friendly female voice available (Ms. Rachel style)
  private pickWarmestVoice(): SpeechSynthesisVoice | null {
    const voices = this.getVoices();
    if (!voices || voices.length === 0) return null;

    if (this.selectedVoiceName) {
      const chosen = voices.find(v => v.name === this.selectedVoiceName);
      if (chosen) return chosen;
    }

    // Rank voices by warmth and kid-friendliness
    // Tier 1: Microsoft Natural Online Neural Voices (exceptionally human-like, exactly like Ms. Rachel)
    const tier1 = voices.find(v => 
      v.name.includes('Jenny') || 
      v.name.includes('Aria') || 
      v.name.includes('Ana') ||
      (v.name.includes('Natural') && (v.name.includes('Female') || v.lang.startsWith('en-US')))
    );
    if (tier1) return tier1;

    // Tier 2: High quality Apple & Google voices
    const tier2 = voices.find(v => 
      v.name.includes('Google US English') ||
      v.name.includes('Samantha') ||
      v.name.includes('Ava') ||
      v.name.includes('Allison') ||
      v.name.includes('Victoria') ||
      v.name.includes('Karen') ||
      v.name.includes('Zoe') ||
      v.name.includes('Siri')
    );
    if (tier2) return tier2;

    // Tier 3: Any English female voice (exclude known robot/male voices)
    const tier3 = voices.find(v => 
      (v.lang === 'en-US' || v.lang.startsWith('en')) &&
      !v.name.toLowerCase().includes('david') &&
      !v.name.toLowerCase().includes('mark') &&
      !v.name.toLowerCase().includes('george') &&
      !v.name.toLowerCase().includes('espeak') &&
      !v.name.toLowerCase().includes('male')
    );
    if (tier3) return tier3;

    // Fallback: First en-US voice
    return voices.find(v => v.lang === 'en-US') || voices[0] || null;
  }

  // Format phonemes and words into warm, phonetic spoken English
  private cleanPhonemesForSpeech(text: string): string {
    let clean = text.trim();
    
    // Convert phoneme slashes like /m/ or /a/ into natural phonics sounds
    const phonemeMap: Record<string, string> = {
      '/a/': 'short a, ah',
      '/b/': 'buh',
      '/c/': 'kuh',
      '/d/': 'duh',
      '/e/': 'eh',
      '/f/': 'fff',
      '/g/': 'guh',
      '/h/': 'huh',
      '/i/': 'ih',
      '/j/': 'juh',
      '/k/': 'kuh',
      '/l/': 'lll',
      '/m/': 'mmm',
      '/n/': 'nnn',
      '/o/': 'aw',
      '/p/': 'puh',
      '/q/': 'kwuh',
      '/r/': 'rrr',
      '/s/': 'sss',
      '/t/': 't',
      '/u/': 'uh',
      '/v/': 'vvv',
      '/w/': 'wuh',
      '/x/': 'ks',
      '/y/': 'yuh',
      '/z/': 'zzz',
      '/sh/': 'shhh',
      '/ch/': 'ch',
      '/th/': 'th',
      '/ck/': 'k',
      '/wh/': 'wh',
    };

    if (phonemeMap[clean.toLowerCase()]) {
      return phonemeMap[clean.toLowerCase()];
    }

    // Clean remaining slashes and symbols so synthesizers never say "slash"
    clean = clean.replace(/[/\\_#*]/g, ' ');
    return clean.trim();
  }

  // Speak with warm, cheerful, melodic Ms. Rachel-style cadence
  speak(text: string, rate: number = 0.92, pitch: number = 1.18) {
    if (!this.speechEnabled || typeof window === 'undefined' || !('speechSynthesis' in window)) {
      return;
    }

    try {
      window.speechSynthesis.cancel(); // Stop previous utterance immediately

      const cleanedText = this.cleanPhonemesForSpeech(text);
      if (!cleanedText) return;

      const utterance = new SpeechSynthesisUtterance(cleanedText);
      utterance.rate = rate;     // Ms. Rachel gentle and clear pacing
      utterance.pitch = pitch;   // Warm, engaging, cheerful inflection
      utterance.volume = 1.0;
      utterance.lang = 'en-US';

      const voice = this.pickWarmestVoice();
      if (voice) {
        utterance.voice = voice;
      }

      window.speechSynthesis.speak(utterance);
    } catch {
      // Graceful voice fallback
    }
  }

  // Speak slow, melodic phonics sound for preschoolers and early readers
  speakPhonicsSlow(text: string) {
    this.speak(text, 0.78, 1.22);
  }
}

export const sounds = new SoundEngine();