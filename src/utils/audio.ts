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
    rate: 0.88,
    pitch: 1.25,
    description: 'Enthusiastic, slow, melodic, high-clarity voice for phonics mastery'
  },
  {
    id: 'us-female',
    label: 'US English - Female Guide',
    lang: 'en-US',
    gender: 'female',
    rate: 0.95,
    pitch: 1.05,
    description: 'Clear, gentle American narrator'
  },
  {
    id: 'us-male',
    label: 'US English - Male Scholar',
    lang: 'en-US',
    gender: 'male',
    rate: 0.95,
    pitch: 0.95,
    description: 'Encouraging, grounded American mentor'
  },
  {
    id: 'uk-female',
    label: 'UK English - Female Storyteller',
    lang: 'en-GB',
    gender: 'female',
    rate: 0.92,
    pitch: 1.05,
    description: 'Crisp, articulate British English narrator'
  },
  {
    id: 'uk-male',
    label: 'UK English - Male Professor',
    lang: 'en-GB',
    gender: 'male',
    rate: 0.92,
    pitch: 0.95,
    description: 'Refined, clear British English guide'
  }
];

class SoundManager {
  public soundEnabled: boolean = true;
  public speechEnabled: boolean = true;
  public activePersonaId: string = 'ms-rachel';
  public selectedVoiceName: string = '';

  private audioCtx: AudioContext | null = null;

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
    return window.speechSynthesis.getVoices();
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

  public speak(text: string, customRate?: number, customPitch?: number) {
    if (!this.speechEnabled || typeof window === 'undefined' || !window.speechSynthesis) return;

    // Cut off any sentence currently playing before starting the next
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    const persona = VOICE_PERSONAS.find((p) => p.id === this.activePersonaId) || VOICE_PERSONAS[0];

    utterance.rate = customRate ?? persona.rate;
    utterance.pitch = customPitch ?? persona.pitch;

    const voices = this.getVoices();
    if (voices.length > 0) {
      let targetVoice = voices.find((v) => {
        const matchesLang = v.lang.toLowerCase().replace('_', '-').startsWith(persona.lang.toLowerCase());
        const nameLower = v.name.toLowerCase();
        const isFemale = nameLower.includes('female') || nameLower.includes('samantha') || nameLower.includes('karen') || nameLower.includes('victoria') || nameLower.includes('zira');
        const isMale = nameLower.includes('male') || nameLower.includes('david') || nameLower.includes('george') || nameLower.includes('daniel');

        if (persona.gender === 'female') return matchesLang && (isFemale || !isMale);
        return matchesLang && (isMale || !isFemale);
      });

      if (!targetVoice) {
        targetVoice = voices.find((v) => v.lang.toLowerCase().replace('_', '-').startsWith(persona.lang.toLowerCase()));
      }

      if (targetVoice) {
        utterance.voice = targetVoice;
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
    osc.frequency.setValueAtTime(120, this.audioCtx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(40, this.audioCtx.currentTime + 0.06);

    gain.gain.setValueAtTime(0.08, this.audioCtx.currentTime);
    gain.gain.linearRampToValueAtTime(0, this.audioCtx.currentTime + 0.06);

    osc.connect(gain);
    gain.connect(this.audioCtx.destination);
    osc.start();
    osc.stop(this.audioCtx.currentTime + 0.06);
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
    osc.frequency.linearRampToValueAtTime(130, now + 0.2);

    gain.gain.setValueAtTime(0.1, now);
    gain.gain.linearRampToValueAtTime(0, now + 0.2);

    osc.connect(gain);
    gain.connect(this.audioCtx.destination);
    osc.start(now);
    osc.stop(now + 0.2);
  }

  public playFanfare() {
    if (!this.soundEnabled) return;
    this.initCtx();
    if (!this.audioCtx) return;

    const now = this.audioCtx.currentTime;
    const notes = [
      { f: 523.25, t: 0.0, d: 0.15 },
      { f: 659.25, t: 0.15, d: 0.15 },
      { f: 783.99, t: 0.3, d: 0.15 },
      { f: 1046.5, t: 0.45, d: 0.4 },
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