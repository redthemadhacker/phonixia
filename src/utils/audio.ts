export interface VoicePersona {
  id: string;
  label: string;
  lang: string;
  gender: 'female' | 'male';
  rate: number;
  pitch: number;
  description: string;
}

export const VOICE_PERSONAS: VoicePersona[] = [
  {
    id: 'ms-rachel',
    label: 'Ms. Rachel Style (Warm & Expressive)',
    lang: 'en-US',
    gender: 'female',
    rate: 0.85,
    pitch: 1.3,
    description: 'Enthusiastic, slow, melodic, high-clarity voice for phonics mastery'
  },
  {
    id: 'us-female',
    label: 'US English - Female Guide',
    lang: 'en-US',
    gender: 'female',
    rate: 1.0,
    pitch: 1.05,
    description: 'Clear, gentle American narrator'
  },
  {
    id: 'us-male',
    label: 'US English - Male Scholar',
    lang: 'en-US',
    gender: 'male',
    rate: 0.95,
    pitch: 0.8,
    description: 'Encouraging, grounded deep American mentor'
  },
  {
    id: 'uk-female',
    label: 'UK English - Female Storyteller',
    lang: 'en-GB',
    gender: 'female',
    rate: 0.92,
    pitch: 1.08,
    description: 'Crisp, articulate British English narrator'
  },
  {
    id: 'uk-male',
    label: 'UK English - Male Professor',
    lang: 'en-GB',
    gender: 'male',
    rate: 0.92,
    pitch: 0.82,
    description: 'Refined, clear British English guide'
  }
];

class SoundManager {
  public soundEnabled: boolean = true;
  public speechEnabled: boolean = true;
  public activePersonaId: string = 'ms-rachel';
  public selectedVoiceName: string = '';

  private audioCtx: AudioContext | null = null;
  private cachedVoices: SpeechSynthesisVoice[] = [];

  constructor() {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      this.cachedVoices = window.speechSynthesis.getVoices();
      if (window.speechSynthesis.onvoiceschanged !== undefined) {
        window.speechSynthesis.onvoiceschanged = () => {
          this.cachedVoices = window.speechSynthesis.getVoices();
        };
      }
    }
  }

  private initCtx() {
    if (!this.audioCtx && typeof window !== 'undefined') {
      const AudioCtxClass = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtxClass) {
        this.audioCtx = new AudioCtxClass();
      }
    }
    if (this.audioCtx && this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
  }

  public getVoices(): SpeechSynthesisVoice[] {
    if (typeof window === 'undefined' || !window.speechSynthesis) return [];
    if (this.cachedVoices.length === 0) {
      this.cachedVoices = window.speechSynthesis.getVoices();
    }
    return this.cachedVoices;
  }

  public setPersona(personaId: string) {
    this.activePersonaId = personaId;
    const persona = VOICE_PERSONAS.find((p) => p.id === personaId);
    if (persona) {
      this.speak(`Voice updated to ${persona.label}`);
    }
  }

  public stopSpeech() {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
  }

  public speakPhonicsSlow(text: string) {
    if (!this.speechEnabled || typeof window === 'undefined' || !window.speechSynthesis) return;
    this.speak(text, 0.65, 1.15);
  }

  public speak(text: string, customRate?: number, customPitch?: number) {
    if (!this.speechEnabled || typeof window === 'undefined' || !window.speechSynthesis) return;

    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    const persona = VOICE_PERSONAS.find((p) => p.id === this.activePersonaId) || VOICE_PERSONAS[0];

    utterance.rate = customRate ?? persona.rate;
    utterance.pitch = customPitch ?? persona.pitch;

    const voices = this.getVoices();
    if (voices.length > 0) {
      let chosenVoice: SpeechSynthesisVoice | undefined;

      if (this.selectedVoiceName) {
        chosenVoice = voices.find(v => v.name === this.selectedVoiceName);
      }

      if (!chosenVoice) {
        const langMatches = voices.filter(v => 
          v.lang.toLowerCase().replace('_', '-').startsWith(persona.lang.toLowerCase())
        );

        const listToSearch = langMatches.length > 0 ? langMatches : voices;

        if (persona.id === 'ms-rachel') {
          // Warm expressive female voice
          chosenVoice = listToSearch.find(v => {
            const n = v.name.toLowerCase();
            return n.includes('samantha') || n.includes('victoria') || n.includes('zira') || n.includes('karen') || (n.includes('female') && !n.includes('male'));
          });
        } else if (persona.id === 'us-female') {
          // Alternative female or standard female
          chosenVoice = listToSearch.find(v => {
            const n = v.name.toLowerCase();
            return (n.includes('female') || n.includes('samantha') || n.includes('karen') || n.includes('susan') || n.includes('linda') || n.includes('zira')) && !n.includes('male');
          });
        } else if (persona.id === 'us-male') {
          // Strict male voice
          chosenVoice = listToSearch.find(v => {
            const n = v.name.toLowerCase();
            return n.includes('david') || n.includes('alex') || n.includes('mark') || n.includes('george') || n.includes('guy') || n.includes('male');
          });
        } else if (persona.id === 'uk-female') {
          // UK British female
          chosenVoice = listToSearch.find(v => {
            const n = v.name.toLowerCase();
            return (n.includes('female') || n.includes('victoria') || n.includes('hazel') || n.includes('serena') || n.includes('stephanie')) && !n.includes('male');
          });
        } else if (persona.id === 'uk-male') {
          // UK British male
          chosenVoice = listToSearch.find(v => {
            const n = v.name.toLowerCase();
            return (n.includes('male') || n.includes('daniel') || n.includes('george') || n.includes('oliver') || n.includes('arthur'));
          });
        }

        if (!chosenVoice && listToSearch.length > 0) {
          chosenVoice = listToSearch[0];
        }
      }

      if (chosenVoice) {
        utterance.voice = chosenVoice;
      }
    }

    window.speechSynthesis.speak(utterance);
  }

  public playStep() {
    if (!this.soundEnabled) return;
    this.initCtx();
    if (!this.audioCtx) return;

    const osc = this.audioCtx.createOscillator();
    const gain = this.audioCtx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(140, this.audioCtx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(45, this.audioCtx.currentTime + 0.05);

    gain.gain.setValueAtTime(0.08, this.audioCtx.currentTime);
    gain.gain.linearRampToValueAtTime(0, this.audioCtx.currentTime + 0.05);

    osc.connect(gain);
    gain.connect(this.audioCtx.destination);
    osc.start();
    osc.stop(this.audioCtx.currentTime + 0.05);
  }

  // Classic Mario-style Jump Sound: upward pitch sweep!
  public playJump() {
    if (!this.soundEnabled) return;
    this.initCtx();
    if (!this.audioCtx) return;

    const now = this.audioCtx.currentTime;
    const osc = this.audioCtx.createOscillator();
    const gain = this.audioCtx.createGain();

    osc.type = 'square';
    osc.frequency.setValueAtTime(150, now);
    osc.frequency.exponentialRampToValueAtTime(480, now + 0.16);

    gain.gain.setValueAtTime(0.12, now);
    gain.gain.linearRampToValueAtTime(0.09, now + 0.1);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);

    osc.connect(gain);
    gain.connect(this.audioCtx.destination);
    osc.start(now);
    osc.stop(now + 0.18);
  }

  // Block punch / head bonk bump
  public playBlockHit() {
    if (!this.soundEnabled) return;
    this.initCtx();
    if (!this.audioCtx) return;

    const now = this.audioCtx.currentTime;
    const osc = this.audioCtx.createOscillator();
    const gain = this.audioCtx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(260, now);
    osc.frequency.exponentialRampToValueAtTime(70, now + 0.09);

    gain.gain.setValueAtTime(0.18, now);
    gain.gain.linearRampToValueAtTime(0.001, now + 0.09);

    osc.connect(gain);
    gain.connect(this.audioCtx.destination);
    osc.start(now);
    osc.stop(now + 0.09);
  }

  // Bright Mario-style coin / star collect chime: B5 -> E6
  public playCollect() {
    if (!this.soundEnabled) return;
    this.initCtx();
    if (!this.audioCtx) return;

    const now = this.audioCtx.currentTime;
    [
      { f: 987.77, start: 0, dur: 0.08 },
      { f: 1318.51, start: 0.07, dur: 0.28 }
    ].forEach((note) => {
      const osc = this.audioCtx!.createOscillator();
      const gain = this.audioCtx!.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(note.f, now + note.start);

      gain.gain.setValueAtTime(0.15, now + note.start);
      gain.gain.exponentialRampToValueAtTime(0.001, now + note.start + note.dur);

      osc.connect(gain);
      gain.connect(this.audioCtx!.destination);
      osc.start(now + note.start);
      osc.stop(now + note.start + note.dur);
    });
  }

  // Water splash & bubble pop sound for Sound Shallows swimming
  public playSplash() {
    if (!this.soundEnabled) return;
    this.initCtx();
    if (!this.audioCtx) return;

    const now = this.audioCtx.currentTime;
    const osc = this.audioCtx.createOscillator();
    const gain = this.audioCtx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(240, now);
    osc.frequency.exponentialRampToValueAtTime(540, now + 0.12);

    gain.gain.setValueAtTime(0.18, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);

    osc.connect(gain);
    gain.connect(this.audioCtx.destination);
    osc.start(now);
    osc.stop(now + 0.18);
  }

  // Heavy stone masonry hammer & hoist drop sound for Builders Guild
  public playHammer() {
    if (!this.soundEnabled) return;
    this.initCtx();
    if (!this.audioCtx) return;

    const now = this.audioCtx.currentTime;
    const osc = this.audioCtx.createOscillator();
    const gain = this.audioCtx.createGain();
    osc.type = 'square';
    osc.frequency.setValueAtTime(140, now);
    osc.frequency.exponentialRampToValueAtTime(45, now + 0.15);

    gain.gain.setValueAtTime(0.25, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.16);

    osc.connect(gain);
    gain.connect(this.audioCtx.destination);
    osc.start(now);
    osc.stop(now + 0.16);
  }

  // Rapid rail wheel click-clack & switch sparks for Tricky Trails minecart
  public playMinecart() {
    if (!this.soundEnabled) return;
    this.initCtx();
    if (!this.audioCtx) return;

    const now = this.audioCtx.currentTime;
    [0, 0.05, 0.11].forEach((delay, i) => {
      const osc = this.audioCtx!.createOscillator();
      const gain = this.audioCtx!.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(200 + i * 80, now + delay);
      gain.gain.setValueAtTime(0.14, now + delay);
      gain.gain.exponentialRampToValueAtTime(0.001, now + delay + 0.04);
      osc.connect(gain);
      gain.connect(this.audioCtx!.destination);
      osc.start(now + delay);
      osc.stop(now + delay + 0.04);
    });
  }

  // Wind thermal whoosh for Whispering Peaks sky glider
  public playWhoosh() {
    if (!this.soundEnabled) return;
    this.initCtx();
    if (!this.audioCtx) return;

    const now = this.audioCtx.currentTime;
    const osc = this.audioCtx.createOscillator();
    const gain = this.audioCtx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(320, now);
    osc.frequency.exponentialRampToValueAtTime(160, now + 0.28);

    gain.gain.setValueAtTime(0.15, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.28);

    osc.connect(gain);
    gain.connect(this.audioCtx.destination);
    osc.start(now);
    osc.stop(now + 0.28);
  }

  // Golden Sun-Scepter laser beam blast for Lexicon Empire
  public playLaser() {
    if (!this.soundEnabled) return;
    this.initCtx();
    if (!this.audioCtx) return;

    const now = this.audioCtx.currentTime;
    const osc = this.audioCtx.createOscillator();
    const gain = this.audioCtx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(880, now);
    osc.frequency.exponentialRampToValueAtTime(110, now + 0.22);

    gain.gain.setValueAtTime(0.2, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);

    osc.connect(gain);
    gain.connect(this.audioCtx.destination);
    osc.start(now);
    osc.stop(now + 0.22);
  }

  public playSuccess() {
    if (!this.soundEnabled) return;
    this.initCtx();
    if (!this.audioCtx) return;

    const now = this.audioCtx.currentTime;
    [523.25, 659.25, 783.99, 1046.5].forEach((freq, idx) => {
      const osc = this.audioCtx!.createOscillator();
      const gain = this.audioCtx!.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + idx * 0.08);

      gain.gain.setValueAtTime(0.12, now + idx * 0.08);
      gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.08 + 0.22);

      osc.connect(gain);
      gain.connect(this.audioCtx!.destination);
      osc.start(now + idx * 0.08);
      osc.stop(now + idx * 0.08 + 0.22);
    });
  }

  public playError() {
    if (!this.soundEnabled) return;
    this.initCtx();
    if (!this.audioCtx) return;

    const now = this.audioCtx.currentTime;
    const osc = this.audioCtx.createOscillator();
    const gain = this.audioCtx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(180, now);
    osc.frequency.linearRampToValueAtTime(120, now + 0.2);

    gain.gain.setValueAtTime(0.1, now);
    gain.gain.linearRampToValueAtTime(0, now + 0.2);

    osc.connect(gain);
    gain.connect(this.audioCtx.destination);
    osc.start(now);
    osc.stop(now + 0.2);
  }

  // Mario-style heart loss / hit damage sound
  public playDamage() {
    if (!this.soundEnabled) return;
    this.initCtx();
    if (!this.audioCtx) return;

    const now = this.audioCtx.currentTime;
    const osc = this.audioCtx.createOscillator();
    const gain = this.audioCtx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(280, now);
    osc.frequency.exponentialRampToValueAtTime(80, now + 0.25);

    gain.gain.setValueAtTime(0.2, now);
    gain.gain.linearRampToValueAtTime(0.01, now + 0.25);

    osc.connect(gain);
    gain.connect(this.audioCtx.destination);
    osc.start(now);
    osc.stop(now + 0.25);
  }

  // Retro Mario Game Over descending melody
  public playGameOver() {
    if (!this.soundEnabled) return;
    this.initCtx();
    if (!this.audioCtx) return;

    const now = this.audioCtx.currentTime;
    // B4, F4, F4, F4, E4, D4, C4
    const notes = [
      { f: 493.88, t: 0.0, d: 0.18 },
      { f: 349.23, t: 0.2, d: 0.18 },
      { f: 349.23, t: 0.4, d: 0.18 },
      { f: 349.23, t: 0.6, d: 0.18 },
      { f: 329.63, t: 0.8, d: 0.18 },
      { f: 293.66, t: 1.0, d: 0.18 },
      { f: 261.63, t: 1.2, d: 0.45 },
    ];

    notes.forEach((n) => {
      const osc = this.audioCtx!.createOscillator();
      const gain = this.audioCtx!.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(n.f, now + n.t);

      gain.gain.setValueAtTime(0.16, now + n.t);
      gain.gain.exponentialRampToValueAtTime(0.001, now + n.t + n.d);

      osc.connect(gain);
      gain.connect(this.audioCtx!.destination);
      osc.start(now + n.t);
      osc.stop(now + n.t + n.d);
    });
  }

  public playFanfare() {
    if (!this.soundEnabled) return;
    this.initCtx();
    if (!this.audioCtx) return;

    const now = this.audioCtx.currentTime;
    const notes = [
      { f: 523.25, t: 0.0, d: 0.12 },
      { f: 659.25, t: 0.12, d: 0.12 },
      { f: 783.99, t: 0.24, d: 0.12 },
      { f: 1046.5, t: 0.36, d: 0.35 },
    ];

    notes.forEach((n) => {
      const osc = this.audioCtx!.createOscillator();
      const gain = this.audioCtx!.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(n.f, now + n.t);

      gain.gain.setValueAtTime(0.18, now + n.t);
      gain.gain.exponentialRampToValueAtTime(0.001, now + n.t + n.d);

      osc.connect(gain);
      gain.connect(this.audioCtx!.destination);
      osc.start(now + n.t);
      osc.stop(now + n.t + n.d);
    });
  }
}

export const sounds = new SoundManager();
