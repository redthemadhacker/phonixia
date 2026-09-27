import React, { useState, useEffect } from 'react';
import { LandId, ExplorerProfile } from '../types/character';
import { AvatarRenderer } from './AvatarRenderer';
import { sounds } from '../utils/audio';
import { ArrowRight, Sparkles, Compass, MapPin } from 'lucide-react';

interface CuteTravelCutsceneProps {
  landId: LandId;
  fromStage: number;
  toStage: number;
  stationName: string;
  skillTitle: string;
  activeExplorer: ExplorerProfile;
  onArrived: () => void;
}

const REALM_THEMES: Record<LandId, {
  name: string;
  skyGradient: string;
  groundGradient: string;
  groundBorder: string;
  particles: string[];
  bannerBg: string;
  bannerBorder: string;
  accentColor: string;
  motifs: string[];
}> = {
  'sound-shallows': {
    name: 'Sound Shallows',
    skyGradient: 'from-cyan-950 via-teal-900 to-blue-950',
    groundGradient: 'from-blue-950 via-teal-950 to-teal-900',
    groundBorder: 'border-cyan-400',
    particles: ['🫧', '✨', '🌊', '⭐', '🫧'],
    bannerBg: 'bg-cyan-950/90',
    bannerBorder: 'border-cyan-400',
    accentColor: 'text-cyan-300',
    motifs: ['🪸', '🐠', '🐚', '🦀']
  },
  'builders-guild': {
    name: 'Builders Guild',
    skyGradient: 'from-amber-950 via-stone-900 to-stone-950',
    groundGradient: 'from-stone-950 via-amber-950 to-stone-900',
    groundBorder: 'border-amber-500',
    particles: ['⚙️', '✨', '🪙', '🧱', '⚡'],
    bannerBg: 'bg-stone-950/90',
    bannerBorder: 'border-amber-400',
    accentColor: 'text-amber-300',
    motifs: ['🔨', '🧱', '🛡️', '⚙️']
  },
  'tricky-trails': {
    name: 'Tricky Trails',
    skyGradient: 'from-emerald-950 via-slate-950 to-teal-950',
    groundGradient: 'from-stone-950 via-emerald-950 to-emerald-900',
    groundBorder: 'border-emerald-500',
    particles: ['🍃', '✨', '🍄', '🌿', '✨'],
    bannerBg: 'bg-emerald-950/90',
    bannerBorder: 'border-emerald-400',
    accentColor: 'text-emerald-300',
    motifs: ['🌲', '🪵', '🌿', '🍃']
  },
  'whispering-peaks': {
    name: 'Whispering Peaks',
    skyGradient: 'from-indigo-950 via-slate-900 to-cyan-950',
    groundGradient: 'from-slate-950 via-indigo-950 to-cyan-950',
    groundBorder: 'border-cyan-300',
    particles: ['❄️', '✨', '☁️', '🧊', '❄️'],
    bannerBg: 'bg-indigo-950/90',
    bannerBorder: 'border-cyan-400',
    accentColor: 'text-cyan-200',
    motifs: ['🏔️', '☁️', '❄️', '🧊']
  },
  'lexicon-empire': {
    name: 'Lexicon Empire',
    skyGradient: 'from-purple-950 via-slate-950 to-rose-950',
    groundGradient: 'from-slate-950 via-purple-950 to-rose-950',
    groundBorder: 'border-rose-500',
    particles: ['🔥', '✨', '⚡', '🏛️', '🔥'],
    bannerBg: 'bg-purple-950/90',
    bannerBorder: 'border-rose-400',
    accentColor: 'text-rose-300',
    motifs: ['🏛️', '⚡', '🗿', '🔥']
  }
};

export const CuteTravelCutscene: React.FC<CuteTravelCutsceneProps> = ({
  landId,
  fromStage,
  toStage,
  stationName,
  skillTitle,
  activeExplorer,
  onArrived
}) => {
  const theme = REALM_THEMES[landId] || REALM_THEMES['sound-shallows'];
  const [progress, setProgress] = useState(0);
  const [walkCycle, setWalkCycle] = useState(0);

  useEffect(() => {
    sounds.playWhoosh();
    sounds.playStep();

    const startTime = performance.now();
    const duration = 1600; // 1.6s cute travel cutscene
    let animId: number;

    const tick = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const p = Math.min(100, (elapsed / duration) * 100);
      setProgress(p);
      setWalkCycle((w) => (w + 0.35) % (Math.PI * 2));

      if (elapsed < duration) {
        animId = requestAnimationFrame(tick);
      } else {
        sounds.playFanfare();
        onArrived();
      }
    };

    animId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animId);
  }, [onArrived]);

  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-between overflow-hidden select-none bg-slate-950 animate-fade-in">
      {/* Background Animated Sky & Horizon */}
      <div className={`absolute inset-0 bg-gradient-to-b ${theme.skyGradient} flex flex-col justify-between overflow-hidden pointer-events-none`}>
        {/* Parallax Moving Stars & Particles */}
        <div className="absolute inset-0 overflow-hidden opacity-50">
          {theme.particles.map((p, i) => (
            <span
              key={i}
              style={{
                top: `${15 + (i * 18)}%`,
                left: `${(i * 22) + ((progress * 1.5) % 100)}%`,
                animationDelay: `${i * 200}ms`
              }}
              className="absolute text-xl sm:text-2xl animate-pulse transition-all duration-150"
            >
              {p}
            </span>
          ))}
        </div>

        {/* Top Header Banner */}
        <div className="relative z-20 pt-8 sm:pt-12 px-4 flex flex-col items-center text-center space-y-2">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-slate-900/80 border border-amber-400/60 shadow-lg">
            <Compass className="w-3.5 h-3.5 text-amber-400 animate-spin" />
            <span className="text-[11px] sm:text-xs font-mono font-black uppercase text-amber-300 tracking-wider">
              Advancing through {theme.name}
            </span>
          </div>

          <div className={`px-5 py-3 sm:px-8 sm:py-4 rounded-3xl ${theme.bannerBg} border-2 ${theme.bannerBorder} shadow-2xl space-y-1 max-w-lg`}>
            <div className="flex items-center justify-center gap-2 text-base sm:text-xl font-black font-display text-white tracking-wide">
              <span>Traveling to Level {toStage}</span>
              <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 text-amber-400 animate-pulse" />
              <span className={theme.accentColor}>{stationName}</span>
            </div>
            <p className="text-xs sm:text-sm font-bold text-slate-300">
              {skillTitle}
            </p>
          </div>
        </div>

        {/* Scenic Moving Ground / Roadway with Walking Avatar */}
        <div className="relative w-full h-44 sm:h-56 flex flex-col justify-end">
          {/* Animated Speed Lines / Road Dashes */}
          <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-amber-400/60 to-transparent" />

          {/* Running Player & Golden Eagle Companion */}
          <div
            style={{
              left: `${15 + progress * 0.65}%`,
              bottom: '52px',
              transform: 'translateX(-50%)'
            }}
            className="absolute z-20 flex flex-col items-center transition-all duration-75"
          >
            {/* Companion Speech Bubble */}
            <div className="absolute -top-10 bg-slate-950/90 border border-amber-400/70 px-2.5 py-0.5 rounded-full shadow-lg whitespace-nowrap animate-bounce flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-amber-300" />
              <span className="text-[10px] font-black text-amber-200">
                Level {toStage} ahead!
              </span>
            </div>

            {/* Avatar Running with Pet */}
            <AvatarRenderer
              customization={activeExplorer.customization}
              size={64}
              isWalking={true}
              isRunning={true}
              facing="right"
              walkCycle={walkCycle}
              showPet={true}
            />

            {/* Dust puff / running ripples */}
            <div className="flex items-center gap-1.5 -mt-2 text-xs opacity-75 animate-pulse">
              <span>💨</span>
              <span className="text-[9px] text-amber-300 font-mono font-bold">Zoom!</span>
            </div>
          </div>

          {/* Destination Landmark Milestone on Right */}
          <div className="absolute right-8 sm:right-16 bottom-14 z-10 flex flex-col items-center">
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-amber-400/20 border-2 border-amber-400 flex items-center justify-center text-2xl shadow-[0_0_25px_rgba(245,158,11,0.6)] animate-pulse">
              <MapPin className="w-7 h-7 text-amber-300" />
            </div>
            <span className="text-[10px] font-black font-mono text-amber-200 mt-1 bg-slate-950/90 px-2 py-0.5 rounded border border-amber-500/40">
              Level {toStage}
            </span>
          </div>

          {/* Ground Platform */}
          <div className={`w-full h-14 sm:h-16 bg-gradient-to-r ${theme.groundGradient} border-t-4 ${theme.groundBorder} flex items-center justify-around px-4 shadow-inner`}>
            {theme.motifs.map((m, idx) => (
              <span key={idx} className="text-xl sm:text-2xl opacity-60">
                {m}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Progress Bar & Quick Skip */}
      <div className="relative z-30 p-4 sm:p-6 bg-slate-950/90 border-t border-slate-800 flex items-center justify-between gap-4">
        <div className="flex-1 max-w-xl mx-auto flex flex-col items-center">
          <div className="w-full flex items-center justify-between text-xs font-mono font-bold text-slate-300 mb-1">
            <span>Explorer on the Move</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <div className="w-full h-3 bg-slate-900 rounded-full border border-amber-500/50 p-0.5 overflow-hidden">
            <div
              style={{ width: `${progress}%` }}
              className="h-full bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500 rounded-full transition-all duration-75 shadow-[0_0_10px_rgba(245,158,11,0.8)]"
            />
          </div>
        </div>

        <button
          onClick={() => {
            sounds.stopSpeech();
            sounds.playFanfare();
            onArrived();
          }}
          className="px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs uppercase tracking-wider flex items-center gap-1.5 cursor-pointer shadow-lg active:scale-95 transition-transform"
        >
          <span>Jump In</span>
          <ArrowRight className="w-3.5 h-3.5 stroke-[3]" />
        </button>
      </div>
    </div>
  );
};
