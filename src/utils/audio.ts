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
  private currentAudio: HTMLAudioElement | null = null;

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
    if (this.currentAudio) {
      this.currentAudio.pause();
      this.currentAudio.currentTime = 0;
      this.currentAudio = null;
    }
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
  }

  public cleanPhonicsForSpeech(rawText: string): string {
    if (!rawText) return '';
    let text = rawText.trim();

    // Isolated single letter pronunciation corrections
    if (text.toLowerCase() === 'x') {
      return 'ks';
    }
    if (text.toLowerCase() === 'c') {
      return 'k';
    }

    // Fix repeated consonant phoneme spelling so speech engine doesn't say "k - s - s - s"
    text = text.replace(/ksss/gi, 'ks');
    text = text.replace(/\bk\s*s\s*s\s*s\b/gi, 'ks');
    text = text.replace(/fff\s*-\s*ah\s*-\s*ksss/gi, 'f... ah... ks... spells fox!');
    text = text.replace(/d\s*-\s*ah\s*-\s*g/gi, 'd... ah... g... spells dog!');
    text = text.replace(/p\s*-\s*ih\s*-\s*g/gi, 'p... ih... g... spells pig!');
    text = text.replace(/k\s*-\s*ah\s*-\s*t/gi, 'k... ah... t... spells cat!');

    // Convert phonetic slashes into natural spoken equivalents
    text = text.replace(/\/æ\//g, 'short a');
    text = text.replace(/\/ɒ\//g, 'short o');
    text = text.replace(/\/ɛ\//g, 'short e');
    text = text.replace(/\/ɪ\//g, 'short i');
    text = text.replace(/\/ʌ\//g, 'short u');
    text = text.replace(/\/eɪ\//g, 'long a');
    text = text.replace(/\/aɪ\//g, 'long i');
    text = text.replace(/\/oʊ\//g, 'long o');
    text = text.replace(/\/uː\//g, 'long u');
    text = text.replace(/\/ʃ\//g, 'sh');
    text = text.replace(/\/tʃ\//g, 'ch');
    text = text.replace(/\/θ\//g, 'th');
    text = text.replace(/\/ŋk\//g, 'nk');
    text = text.replace(/\/bl\//g, 'b l');
    text = text.replace(/\/ɡr\//g, 'g r');
    text = text.replace(/\/st\//g, 's t');
    text = text.replace(/\/nd\//g, 'n d');
    text = text.replace(/\/mp\//g, 'm p');
    text = text.replace(/\/b\//g, 'b');
    text = text.replace(/\/t\//g, 't');
    text = text.replace(/\/m\//g, 'm');
    text = text.replace(/\/g\//g, 'g');
    text = text.replace(/\/s\//g, 's');
    text = text.replace(/\/d\//g, 'd');
    text = text.replace(/\/w\//g, 'w');
    text = text.replace(/\/k\//g, 'k');

    // Clean elongated strings
    text = text.replace(/\bshhh\b/gi, 'sh');
    text = text.replace(/\bchhh\b/gi, 'ch');
    text = text.replace(/\bthhh\b/gi, 'th');
    text = text.replace(/\bmmm\b/gi, 'm');
    text = text.replace(/\bsss\b/gi, 's');
    text = text.replace(/\bfff\b/gi, 'f');
    text = text.replace(/\blll\b/gi, 'l');
    text = text.replace(/\bnnn\b/gi, 'n');
    text = text.replace(/\baaa\b/gi, 'ah');
    text = text.replace(/\bpuh\b/gi, 'p');
    text = text.replace(/\bbuh\b/gi, 'b');
    text = text.replace(/\btuh\b/gi, 't');
    text = text.replace(/\bduh\b/gi, 'd');
    text = text.replace(/\bkuh\b/gi, 'k');
    text = text.replace(/\bguh\b/gi, 'g');
    text = text.replace(/\bjuh\b/gi, 'j');
    text = text.replace(/\bwuu\b/gi, 'w');
    text = text.replace(/\bzzz\b/gi, 'z');

    return text;
  }

  public speakPhonicsSlow(text: string) {
    if (!this.speechEnabled) return;
    this.speak(text, 0.75, 1.2);
  }

  public speak(text: string, customRate?: number, customPitch?: number) {
    if (!this.speechEnabled || typeof window === 'undefined') return;

    this.stopSpeech();

    const spokenText = this.cleanPhonicsForSpeech(text);
    if (!spokenText) return;

    const persona = VOICE_PERSONAS.find((p) => p.id === this.activePersonaId) || VOICE_PERSONAS[0];

    // Priority 1: High-Fidelity Studio Natural Human Speech Proxy
    if (typeof Audio !== 'undefined' && (!this.selectedVoiceName || this.activePersonaId === 'ms-rachel')) {
      try {
        const audioUrl = `/api/tts?text=${encodeURIComponent(spokenText)}`;
        const audio = new Audio(audioUrl);
        // Bright pitch and clear cadence for kid friendliness
        audio.playbackRate = customRate ?? (persona.id === 'ms-rachel' ? 1.0 : persona.rate);
        this.currentAudio = audio;

        audio.play().catch(() => {
          // If browser autoplay policies or offline, fallback to Web Speech
          this.fallbackSpeechSynthesis(spokenText, customRate, customPitch, persona);
        });
        return;
      } catch (e) {
        // Fallback below
      }
    }

    // Priority 2: Web Speech Synthesis API fallback
    this.fallbackSpeechSynthesis(spokenText, customRate, customPitch, persona);
  }

  private fallbackSpeechSynthesis(
    spokenText: string,
    customRate: number | undefined,
    customPitch: number | undefined,
    persona: VoicePersona
  ) {
    if (typeof window === 'undefined' || !window.speechSynthesis) return;

    const utterance = new SpeechSynthesisUtterance(spokenText);
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
          chosenVoice = listToSearch.find(v => {
            const n = v.name.toLowerCase();
            return n.includes('natural') || n.includes('google us english') || n.includes('samantha') || n.includes('ava') || n.includes('victoria') || n.includes('karen') || (n.includes('female') && !n.includes('male'));
          });
        } else if (persona.id === 'us-female') {
          chosenVoice = listToSearch.find(v => {
            const n = v.name.toLowerCase();
            return (n.includes('google') || n.includes('samantha') || n.includes('karen') || n.includes('ava') || n.includes('zira')) && !n.includes('male');
          });
        } else if (persona.id === 'us-male') {
          chosenVoice = listToSearch.find(v => {
            const n = v.name.toLowerCase();
            return n.includes('david') || n.includes('alex') || n.includes('mark') || n.includes('george') || n.includes('guy') || n.includes('male');
          });
        } else if (persona.id === 'uk-female') {
          chosenVoice = listToSearch.find(v => {
            const n = v.name.toLowerCase();
            return (n.includes('female') || n.includes('victoria') || n.includes('hazel') || n.includes('serena') || n.includes('stephanie')) && !n.includes('male');
          });
        } else if (persona.id === 'uk-male') {
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
