import React, { useState, useEffect, useCallback, useRef, ErrorInfo, ReactNode } from 'react';
import { GameProvider, useGame } from './context/GameContext';
import { WorldCanvas } from './components/WorldCanvas';
import { LandLevelView } from './components/LandLevelView';
import { ActivePlayableStage } from './components/ActivePlayableStage';
import { CuteTravelCutscene } from './components/CuteTravelCutscene';
import { IslesOfPlay } from './components/IslesOfPlay';
import { ShellshoreArcade } from './components/ShellshoreArcade';
import { ArchitecturalWordForge } from './components/ArchitecturalWordForge';
import { HigherEducationHub } from './components/HigherEducationHub';
import { SpeechPracticeLab } from './components/SpeechPracticeLab';
import { AdaptiveAccessibilityModal } from './components/AdaptiveAccessibilityModal';
import { TeacherMTSSDashboard } from './components/TeacherMTSSDashboard';
import { CyberGuardianModal } from './components/CyberGuardianModal';
import { GradeMilestonesModal } from './components/GradeMilestonesModal';
import { BusinessLicensingModal } from './components/BusinessLicensingModal';
import { HomeHutModal } from './components/HomeHutModal';
import { HallOfFameCelebration } from './components/HallOfFameCelebration';
import { ParentPinModal } from './components/ParentPinModal';
import { ParentDashboard } from './components/ParentDashboard';
import { EducatorParentSanctumModal } from './components/EducatorParentSanctumModal';
import { AvatarRenderer } from './components/AvatarRenderer';
import { AuthGateway } from './components/AuthGateway';
import { LandId, MinigameId } from './types/character';
import { getCompanionGuide } from './context/GameContext';
import { sounds } from './utils/audio';
import { getComprehensiveStageChallenge } from './data/comprehensiveCurriculum';
import { MinigameDefinition } from './data/minigamesCurriculum';
import { 
  GraduationCap, 
  Hammer, 
  Mic, 
  Layers, 
  ShieldCheck, 
  Sparkles, 
  Users, 
  Volume2, 
  VolumeX, 
  BookOpen, 
  Award,
  Crown,
  Heart,
  Flame,
  Zap,
  Shield,
  Compass,
  Scroll,
  CheckCircle2,
  Map,
  ChevronRight,
  ChevronDown,
  Package,
  Lock,
  Sword,
  Star
} from 'lucide-react';

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { hasError: false, error: null };

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("ErrorBoundary caught:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '2rem', color: '#ff6b6b', background: '#111', minHeight: '100vh', fontFamily: 'monospace' }}>
          <h2>⚠️ Frontend Render Crash:</h2>
          <pre style={{ whiteSpace: 'pre-wrap', background: '#222', padding: '1rem', borderRadius: '8px' }}>
            {this.state.error?.stack || this.state.error?.message}
          </pre>
        </div>
      );
    }
    return this.props.children;
  }
}

type ViewState = 
  | 'world' 
  | 'land-map' 
  | 'playing-stage' 
  | 'isles' 
  | 'arcade' 
  | 'word-forge' 
  | 'higher-ed' 
  | 'speech-lab';

interface AuthenticatedGameViewProps {
  onLogout: () => void;
}

const AuthenticatedGameView: React.FC<AuthenticatedGameViewProps> = ({ onLogout }) => {
  const { 
    activeExplorer,
    showHallOfFameCelebration, 
    dismissHallOfFameCelebration,
    updateExplorerScore
  } = useGame();
  
  const companionGuide = getCompanionGuide(activeExplorer);

  const [currentView, setCurrentView] = useState<ViewState>('world');
  const [selectedLand, setSelectedLand] = useState<LandId>('sound-shallows');
  const [worldTransition, setWorldTransition] = useState<{
    targetLand: LandId;
    stationName: string;
    skillTitle: string;
  } | null>(null);
  const [activeStageNumber, setActiveStageNumber] = useState<number>(1);
  const [questionRandomSeed, setQuestionRandomSeed] = useState<number>(0);

  // Modals state
  const [isHomeHutOpen, setIsHomeHutOpen] = useState(true);
  const [manualCelebrationOpen, setManualCelebrationOpen] = useState(false);
  const [isParentPinModalOpen, setIsParentPinModalOpen] = useState(false);
  const [isParentDashboardOpen, setIsParentDashboardOpen] = useState(false);
  const [isEducatorSanctumOpen, setIsEducatorSanctumOpen] = useState(false);

  // In-Game MMO HUD States
  const [isAudioMuted, setIsAudioMuted] = useState(false);
  const [isQuestTrackerOpen, setIsQuestTrackerOpen] = useState(true);
  const [floatingCombatTexts, setFloatingCombatTexts] = useState<
    { id: number; text: string; color: string; x: number; y: number }[]
  >([]);

  // New Lifelong & UDL Modals (Accessible via Educator Sanctum)
  const [isAccessibilityModalOpen, setIsAccessibilityModalOpen] = useState(false);
  const [isTeacherDashboardOpen, setIsTeacherDashboardOpen] = useState(false);
  const [isCyberGuardianOpen, setIsCyberGuardianOpen] = useState(false);
  const [isGradeMilestonesOpen, setIsGradeMilestonesOpen] = useState(false);
  const [isBusinessLicensingOpen, setIsBusinessLicensingOpen] = useState(false);

  // Active Playable Stage state
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [realmLives, setRealmLives] = useState(3);
  const [earnedStars, setEarnedStars] = useState(0);
  const [roundCompleted, setRoundCompleted] = useState(false);

  // 5-MINUTE INACTIVITY SESSION TIMEOUT
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleInactivityLogout = useCallback(() => {
    onLogout();
    sounds.playError();
    sounds.speak('Session timed out after 5 minutes of inactivity. Please sign in again.');
  }, [onLogout]);

  const resetIdleTimer = useCallback(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    // 5 minutes = 300,000 ms
    timeoutRef.current = setTimeout(handleInactivityLogout, 5 * 60 * 1000);
  }, [handleInactivityLogout]);

  useEffect(() => {
    const events = ['mousedown', 'mousemove', 'keydown', 'touchstart', 'scroll', 'click'];
    events.forEach(event => window.addEventListener(event, resetIdleTimer));
    resetIdleTimer();

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      events.forEach(event => window.removeEventListener(event, resetIdleTimer));
    };
  }, [resetIdleTimer]);

  const activeQuestion = React.useMemo(() => {
    return getComprehensiveStageChallenge(selectedLand, activeStageNumber);
  }, [selectedLand, activeStageNumber, questionRandomSeed]);

  const handleLaunchStage = (stageNum: number) => {
    setActiveStageNumber(stageNum);
    setQuestionRandomSeed((s) => s + 1);
    setSelectedAnswer(null);
    setIsAnswered(false);
    setIsCorrect(false);
    setRoundCompleted(false);
    setRealmLives(3);
    setEarnedStars(0);
    setCurrentView('playing-stage');
  };

  const handleSelectChoice = (choice: string) => {
    if (isAnswered) return;
    setSelectedAnswer(choice);
    setIsAnswered(true);

    const win = choice.trim().toLowerCase() === activeQuestion.correct.trim().toLowerCase();
    setIsCorrect(win);

    if (win) {
      setEarnedStars(3);
      setRoundCompleted(true);
      updateExplorerScore(selectedLand, 1, 3);
    } else {
      setRealmLives((l) => Math.max(0, l - 1));
    }
  };

  const handleLaunchMinigamePractice = (minigame: MinigameDefinition) => {
    if (minigame.hub === 'isles-of-play') {
      setCurrentView('isles');
    } else {
      setCurrentView('arcade');
    }
  };

  const triggerFloatingText = useCallback((text: string, color: string = 'text-amber-300') => {
    const id = Date.now() + Math.random();
    const x = 50 + (Math.random() * 20 - 10);
    const y = 45 + (Math.random() * 15 - 7);
    setFloatingCombatTexts((prev) => [...prev.slice(-3), { id, text, color, x, y }]);
    setTimeout(() => {
      setFloatingCombatTexts((prev) => prev.filter((f) => f.id !== id));
    }, 1800);
  }, []);

  // RPG Hero Title based on RPG Level
  const adventurerTitle = React.useMemo(() => {
    const lvl = activeExplorer.level || 1;
    if (lvl >= 70) return 'Master of Phonixia';
    if (lvl >= 50) return 'High Lexicon Arcanist';
    if (lvl >= 30) return 'Morpheme Vanguard';
    if (lvl >= 15) return 'Syllable Spellblade';
    if (lvl >= 5) return 'Aether Wordweaver';
    return 'Rune Initiate';
  }, [activeExplorer.level]);

  // Zone Crest info
  const zoneInfo = React.useMemo(() => {
    if (currentView === 'word-forge') return { title: 'THE WORD FORGE', sub: 'The Titan Runesmith Anvil · Transmutation', icon: '⚡' };
    if (currentView === 'higher-ed') return { title: 'PHONIXIA ACADEMY', sub: 'High Collegium of Linguistics & Rhetoric', icon: '🏛️' };
    if (currentView === 'speech-lab') return { title: 'THE ORACLE CAVERN', sub: 'Speech Sanctuary & Vocal Acoustics', icon: '🎙️' };
    if (currentView === 'isles') return { title: 'ISLES OF PLAY', sub: 'Phonemic Archipelago Mini-Dungeons', icon: '🎮' };
    if (currentView === 'arcade') return { title: 'SHELLSHORE ARCADE', sub: 'Tidal Boardwalk & Phonics Trials', icon: '🕹️' };
    if (currentView === 'playing-stage') return { title: 'COMBAT ARENA', sub: `Stage #${activeStageNumber} · Trial of Mastery`, icon: '⚔️' };
    if (currentView === 'land-map') {
      const titles: Record<LandId, { title: string; sub: string; icon: string }> = {
        'sound-shallows': { title: 'SOUND SHALLOWS', sub: 'Chapter I · Citadel of Echoes', icon: '🌊' },
        'builders-guild': { title: 'BUILDERS GUILD', sub: 'Chapter II · The Titan Forges', icon: '🔨' },
        'tricky-trails': { title: 'TRICKY TRAILS', sub: 'Chapter III · Enchanted Canopy', icon: '🌿' },
        'whispering-peaks': { title: 'WHISPERING PEAKS', sub: 'Chapter IV · Glacial Monoliths', icon: '🏔️' },
        'lexicon-empire': { title: 'LEXICON EMPIRE', sub: 'Chapter V · Imperial Citadel', icon: '👑' },
        'phonixia-academy': { title: 'PHONIXIA ACADEMY', sub: 'Collegium of Scribes', icon: '🏛️' },
        'masters-pathways': { title: 'MASTER’S PATHWAYS', sub: 'Clinical Literacy Practicums', icon: '📜' },
        'celestial-archives': { title: 'CELESTIAL ARCHIVES', sub: 'Apex Sanctum of Knowledge', icon: '🌌' },
      };
      return titles[selectedLand] || { title: 'PHONIXIA CONTINENT', sub: 'Realm of Language', icon: '🗺️' };
    }
    return { title: 'THE KINGDOM OF PHONIXIA', sub: 'World Overworld Map · All Realms', icon: '🗺️' };
  }, [currentView, selectedLand, activeStageNumber]);

  // Active Quest info
  const activeQuest = React.useMemo(() => {
    const quests: Record<LandId, { name: string; obj: string; reward: string }> = {
      'sound-shallows': { name: 'The Sunken Pearl Runes', obj: 'Pop 3 Sound Pearls in Whispering Cove', reward: '+150 XP · +25 Gold' },
      'builders-guild': { name: 'Titan Keystone Forging', obj: 'Smash 5 CVC Bricks at the Foundry', reward: '+200 XP · Runic Plate' },
      'tricky-trails': { name: 'The Mirage Brambles', obj: 'Track 3 Silent-E Pods in the Canopy', reward: '+250 XP · Raptor Whistle' },
      'whispering-peaks': { name: 'Shatter the Frost Curse', obj: 'Break 3 Vowel Glaciers on Alpine Cavern', reward: '+300 XP · Frost Cloak' },
      'lexicon-empire': { name: 'The Shadow King Siege', obj: 'Breach the Throne Citadel Barrier', reward: '+500 XP · Mythic Crown' },
      'phonixia-academy': { name: 'The High Collegium Thesis', obj: 'Defend linguistic research before the Senate', reward: '+600 XP · Scribe Robes' },
      'masters-pathways': { name: 'Master Clinician Defense', obj: 'Synthesize multisensory dyslexia protocols', reward: '+800 XP · Master Ring' },
      'celestial-archives': { name: 'Supreme Coronation', obj: 'Master the Celestial Archives', reward: 'TITLE: MASTER OF PHONIXIA' },
    };
    return quests[selectedLand] || quests['sound-shallows'];
  }, [selectedLand]);

  // Ability Hotbar actions
  const castSoundBolt = useCallback(() => {
    sounds.playLaser();
    triggerFloatingText('⚡ SOUND RESONANCE! -45 DMG', 'text-cyan-300');
  }, [triggerFloatingText]);

  const castWordShield = useCallback(() => {
    sounds.playFanfare();
    triggerFloatingText('🛡️ RUNIC BARRIER ENGAGED!', 'text-emerald-300');
  }, [triggerFloatingText]);

  const openWordForge = useCallback(() => {
    sounds.playClick();
    triggerFloatingText('🔨 THE TITAN FORGE ACTIVATED!', 'text-amber-300');
    setCurrentView('word-forge');
  }, [triggerFloatingText]);

  const summonCompanionWisdom = useCallback(() => {
    sounds.playJump();
    triggerFloatingText(`🦅 ${companionGuide.name}: "Listen closely to the phoneme!"`, 'text-yellow-300');
    sounds.speakPhonicsSlow(activeQuestion.soundCue || 'Listen to the sound resonance!');
  }, [companionGuide.name, activeQuestion.soundCue, triggerFloatingText]);

  // Global Keyboard hotkeys
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable)) {
        return;
      }
      const k = e.key.toLowerCase();
      if (k === '1') castSoundBolt();
      if (k === '2') castWordShield();
      if (k === '3') openWordForge();
      if (k === '4') summonCompanionWisdom();
      if (k === 'm') setCurrentView('world');
      if (k === 'f') setCurrentView('word-forge');
      if (k === 'c') setIsHomeHutOpen(true);
      if (k === 'q') setIsQuestTrackerOpen((prev) => !prev);
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [castSoundBolt, castWordShield, openWordForge, summonCompanionWisdom]);

  const acc = activeExplorer.accessibility;

  return (
    <div className={`w-full h-full min-h-[100dvh] max-h-[100dvh] bg-slate-950 flex flex-col justify-between overflow-hidden select-none fixed inset-0 ${
      acc?.dyslexiaFont ? 'font-sans tracking-wide' : ''
    } ${acc?.highContrast ? 'contrast-125' : ''}`}>
      
      {/* 1. TOP MMO / RPG HUD OVERLAY */}
      <header className="absolute top-0 inset-x-0 z-40 p-2 sm:p-3 flex items-start justify-between pointer-events-none gap-2">
        
        {/* Character Status Plate (Top-Left) */}
        <div className="pointer-events-auto flex items-center gap-2.5 bg-slate-950/92 backdrop-blur-md px-3 py-2 rounded-2xl border-2 border-amber-500/70 shadow-[0_4px_25px_rgba(0,0,0,0.8)]">
          <div 
            onClick={() => { sounds.playClick(); setIsHomeHutOpen(true); }}
            className="relative w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-gradient-to-b from-amber-900 to-slate-950 border-2 border-amber-400 flex items-center justify-center overflow-hidden cursor-pointer shadow hover:scale-105 transition-transform"
            title="Open Hero Wardrobe & Gear [C]"
          >
            <AvatarRenderer customization={activeExplorer.customization} size={36} facing="down" showPet={false} />
            <span className="absolute -bottom-1 -right-1 px-1 bg-amber-500 text-slate-950 text-[9px] font-black rounded-full font-mono border border-slate-950 shadow">
              Lv.{activeExplorer.level}
            </span>
          </div>

          <div className="flex flex-col min-w-[120px] sm:min-w-[150px]">
            <div className="flex items-center justify-between gap-1">
              <span className="text-xs sm:text-sm font-black text-amber-200 font-display truncate max-w-[100px] sm:max-w-[130px]">
                {activeExplorer.name}
              </span>
              <span className="text-[9px] font-bold text-amber-400/90 font-mono tracking-wider truncate">
                {adventurerTitle}
              </span>
            </div>

            {/* HP & MP Dual Bars */}
            <div className="space-y-1 mt-1">
              {/* HP Bar */}
              <div className="w-full h-2 bg-slate-900 rounded-full border border-rose-500/60 overflow-hidden flex items-center p-0.5">
                <div 
                  style={{ width: `${realmLives === 3 ? 100 : realmLives === 2 ? 66 : 33}%` }}
                  className="h-full bg-gradient-to-r from-rose-600 to-red-400 rounded-full transition-all duration-300 shadow-[0_0_8px_rgba(244,63,94,0.7)]"
                />
              </div>
              {/* Sound Aether / MP Bar */}
              <div className="w-full h-1.5 bg-slate-900 rounded-full border border-cyan-500/60 overflow-hidden flex items-center p-0.5">
                <div className="w-[88%] h-full bg-gradient-to-r from-cyan-500 to-sky-400 rounded-full shadow-[0_0_6px_rgba(6,182,212,0.7)]" />
              </div>
            </div>

            {/* Currency Badges */}
            <div className="flex items-center gap-2 mt-1 text-[10px] font-mono font-bold">
              <span className="flex items-center gap-0.5 text-amber-400">
                <Star className="w-2.5 h-2.5 fill-amber-400" />
                {activeExplorer.totalStars}
              </span>
              <span className="text-yellow-400">🪙 {activeExplorer.coins}c</span>
              <span className="text-cyan-300 hidden sm:inline">🎟️ {activeExplorer.arcadeTokens}t</span>
            </div>
          </div>
        </div>

        {/* Zone Crest Banner (Top-Center) */}
        <div className="pointer-events-auto hidden md:flex flex-col items-center bg-slate-950/88 backdrop-blur-md px-4 py-1.5 rounded-2xl border border-amber-500/50 shadow-xl text-center animate-fade-in">
          <div className="flex items-center gap-1.5 text-amber-300 font-display font-black text-xs tracking-wider uppercase">
            <span>{zoneInfo.icon}</span>
            <span>{zoneInfo.title}</span>
          </div>
          <span className="text-[10px] font-bold text-slate-400 tracking-wide">
            {zoneInfo.sub}
          </span>
        </div>

        {/* Action Menu & Educator Vault (Top-Right) */}
        <div className="pointer-events-auto flex items-center gap-1.5 sm:gap-2">
          {/* Map Button */}
          <button
            onClick={() => { sounds.playClick(); setCurrentView('world'); }}
            className={`h-9 px-2.5 sm:px-3 rounded-xl border text-xs font-bold flex items-center gap-1.5 shadow transition cursor-pointer ${
              currentView === 'world' 
                ? 'bg-amber-500 text-slate-950 border-amber-400 font-black' 
                : 'bg-slate-950/90 text-amber-300 border-amber-500/60 hover:bg-slate-900'
            }`}
            title="World Realm Map [M]"
          >
            <Map className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Map</span>
          </button>

          {/* Word Forge */}
          <button
            onClick={() => { sounds.playClick(); setCurrentView('word-forge'); }}
            className={`h-9 px-2.5 sm:px-3 rounded-xl border text-xs font-bold flex items-center gap-1.5 shadow transition cursor-pointer ${
              currentView === 'word-forge' 
                ? 'bg-amber-500 text-slate-950 border-amber-400 font-black' 
                : 'bg-slate-950/90 text-amber-300 border-amber-500/60 hover:bg-slate-900'
            }`}
            title="Architectural Word Forge [F]"
          >
            <Hammer className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Forge</span>
          </button>

          {/* Arcade / Isles Quick Switch */}
          <button
            onClick={() => { sounds.playClick(); setCurrentView('arcade'); }}
            className={`h-9 px-2.5 sm:px-3 rounded-xl border text-xs font-bold flex items-center gap-1.5 shadow transition cursor-pointer ${
              currentView === 'arcade' || currentView === 'isles'
                ? 'bg-sky-500 text-slate-950 border-sky-400 font-black' 
                : 'bg-slate-950/90 text-sky-300 border-sky-500/60 hover:bg-slate-900'
            }`}
            title="Shellshore Arcade & Isles of Play"
          >
            <Compass className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Arcade</span>
          </button>

          {/* Speech Oracle */}
          <button
            onClick={() => { sounds.playClick(); setCurrentView('speech-lab'); }}
            className={`h-9 px-2.5 sm:px-3 rounded-xl border text-xs font-bold flex items-center gap-1.5 shadow transition cursor-pointer ${
              currentView === 'speech-lab' 
                ? 'bg-cyan-500 text-slate-950 border-cyan-400 font-black' 
                : 'bg-slate-950/90 text-cyan-300 border-cyan-500/60 hover:bg-slate-900'
            }`}
            title="Speech Practice Lab"
          >
            <Mic className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Speech</span>
          </button>

          {/* Audio / Voice Toggle */}
          <button
            onClick={() => {
              sounds.stopSpeech();
              const next = !isAudioMuted;
              setIsAudioMuted(next);
              sounds.speechEnabled = !next;
              sounds.soundEnabled = !next;
              if (!next) sounds.speak('Voice is enabled.');
            }}
            className="w-9 h-9 rounded-xl bg-slate-950/90 border border-amber-500/60 flex items-center justify-center text-amber-400 shadow hover:bg-slate-900 transition cursor-pointer"
            title={isAudioMuted ? 'Unmute Audio' : 'Mute Audio'}
          >
            {isAudioMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>

          {/* Camp / Wardrobe */}
          <button
            onClick={() => { sounds.playClick(); setIsHomeHutOpen(true); }}
            className="h-9 px-2.5 sm:px-3 rounded-xl bg-amber-600 hover:bg-amber-500 text-slate-950 font-black text-xs uppercase tracking-wider shadow border border-amber-300 flex items-center gap-1 cursor-pointer transition-transform hover:scale-105 active:scale-95"
            title="Hero Camp & Wardrobe [C]"
          >
            <span>🛖</span>
            <span className="hidden sm:inline">Camp</span>
          </button>

          {/* EDUCATOR & PARENT VAULT (PIN GATED) */}
          <button
            onClick={() => {
              sounds.playClick();
              setIsParentPinModalOpen(true);
            }}
            className="h-9 px-2.5 sm:px-3.5 rounded-xl bg-gradient-to-r from-amber-600 via-amber-500 to-yellow-500 hover:from-amber-500 hover:to-yellow-400 text-slate-950 font-black text-xs border border-amber-300 shadow-[0_0_15px_rgba(245,158,11,0.5)] flex items-center gap-1.5 cursor-pointer transition-transform hover:scale-105 active:scale-95"
            title="Educator & Parent Command Sanctum (PIN Protected)"
          >
            <Lock className="w-3.5 h-3.5 stroke-[2.5]" />
            <span className="hidden lg:inline">Educator &amp; Parent Vault</span>
          </button>
        </div>
      </header>

      {/* 2. RIGHT-SIDE RPG QUEST TRACKER */}
      <div className="absolute right-2 sm:right-3 top-16 z-30 pointer-events-auto">
        <div className="bg-slate-950/92 backdrop-blur-md border border-amber-500/50 rounded-2xl p-2.5 sm:p-3 shadow-xl max-w-[210px] sm:max-w-[240px] text-xs">
          <div 
            onClick={() => setIsQuestTrackerOpen((prev) => !prev)}
            className="flex items-center justify-between cursor-pointer text-amber-300 font-display font-black text-[11px] sm:text-xs uppercase tracking-wider pb-1 border-b border-amber-500/30"
          >
            <div className="flex items-center gap-1.5">
              <Scroll className="w-3.5 h-3.5 text-amber-400" />
              <span>Active Quest</span>
            </div>
            <ChevronDown className={`w-3.5 h-3.5 transition-transform ${isQuestTrackerOpen ? 'rotate-180' : ''}`} />
          </div>

          {isQuestTrackerOpen && (
            <div className="mt-2 space-y-1.5 animate-fade-in">
              <div className="font-bold text-amber-200 text-xs">{activeQuest.name}</div>
              <p className="text-[11px] text-slate-300 leading-snug">{activeQuest.obj}</p>
              <div className="pt-1 border-t border-slate-800 text-[10px] font-mono text-emerald-300 font-bold flex items-center justify-between">
                <span>Reward:</span>
                <span>{activeQuest.reward}</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 3. BOTTOM MMO ACTION HOTBAR */}
      <div className="absolute bottom-2 sm:bottom-3 inset-x-0 z-30 pointer-events-none flex items-center justify-center gap-2 px-2">
        <div className="pointer-events-auto flex items-center gap-1.5 sm:gap-2.5 bg-slate-950/92 backdrop-blur-md px-3 sm:px-4 py-2 rounded-2xl border-2 border-amber-500/60 shadow-[0_4px_30px_rgba(0,0,0,0.8)]">
          
          {/* Ability 1: Sound Bolt */}
          <button
            onClick={castSoundBolt}
            className="relative w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-b from-cyan-900 to-slate-950 border-2 border-cyan-400 text-cyan-200 flex flex-col items-center justify-center hover:scale-105 active:scale-95 transition-transform shadow-[0_0_12px_rgba(6,182,212,0.5)] cursor-pointer group"
            title="Cast Sound Bolt [1]"
          >
            <Zap className="w-4 h-4 sm:w-5 sm:h-5 text-cyan-300" />
            <span className="absolute -bottom-1 -right-1 px-1 bg-slate-900 text-cyan-300 text-[9px] font-mono font-bold rounded border border-cyan-500/50">
              1
            </span>
          </button>

          {/* Ability 2: Word Shield */}
          <button
            onClick={castWordShield}
            className="relative w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-b from-emerald-900 to-slate-950 border-2 border-emerald-400 text-emerald-200 flex flex-col items-center justify-center hover:scale-105 active:scale-95 transition-transform shadow-[0_0_12px_rgba(16,185,129,0.5)] cursor-pointer group"
            title="Cast Word Shield [2]"
          >
            <Shield className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-300" />
            <span className="absolute -bottom-1 -right-1 px-1 bg-slate-900 text-emerald-300 text-[9px] font-mono font-bold rounded border border-emerald-500/50">
              2
            </span>
          </button>

          {/* Ability 3: Word Forge */}
          <button
            onClick={openWordForge}
            className="relative w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-b from-amber-900 to-slate-950 border-2 border-amber-400 text-amber-200 flex flex-col items-center justify-center hover:scale-105 active:scale-95 transition-transform shadow-[0_0_12px_rgba(245,158,11,0.5)] cursor-pointer group"
            title="Open Word Forge Anvil [3]"
          >
            <Hammer className="w-4 h-4 sm:w-5 sm:h-5 text-amber-300" />
            <span className="absolute -bottom-1 -right-1 px-1 bg-slate-900 text-amber-300 text-[9px] font-mono font-bold rounded border border-amber-500/50">
              3
            </span>
          </button>

          {/* Ability 4: Companion Echo */}
          <button
            onClick={summonCompanionWisdom}
            className="relative w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-b from-purple-900 to-slate-950 border-2 border-purple-400 text-purple-200 flex flex-col items-center justify-center hover:scale-105 active:scale-95 transition-transform shadow-[0_0_12px_rgba(168,85,247,0.5)] cursor-pointer group"
            title="Companion Phonics Voice Guide [4]"
          >
            <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-purple-300" />
            <span className="absolute -bottom-1 -right-1 px-1 bg-slate-900 text-purple-300 text-[9px] font-mono font-bold rounded border border-purple-500/50">
              4
            </span>
          </button>

          {/* Ability Space: Action Leap */}
          <button
            onClick={() => {
              sounds.playJump();
              triggerFloatingText('💨 LEAP!', 'text-amber-300');
            }}
            className="h-10 sm:h-12 px-3 sm:px-4 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 font-black text-xs uppercase tracking-wider flex items-center gap-1.5 shadow-[0_0_15px_rgba(245,158,11,0.6)] cursor-pointer hover:scale-105 active:scale-95 transition-transform"
            title="Action Leap [SPACE]"
          >
            <span>💨</span>
            <span className="hidden sm:inline font-mono text-[10px]">SPACE</span>
          </button>
        </div>
      </div>

      {/* 4. FLOATING COMBAT TEXT OVERLAY */}
      <div className="absolute inset-0 pointer-events-none z-50 overflow-hidden">
        {floatingCombatTexts.map((fct) => (
          <div
            key={fct.id}
            style={{ left: `${fct.x}%`, top: `${fct.y}%` }}
            className={`absolute -translate-x-1/2 -translate-y-1/2 font-black text-base sm:text-xl font-display ${fct.color} drop-shadow-[0_2px_10px_rgba(0,0,0,0.9)] animate-bounce tracking-wider`}
          >
            {fct.text}
          </div>
        ))}
      </div>

      {/* WORLD TRANSITION CUTSCENE BETWEEN REALMS */}
      {worldTransition && (
        <CuteTravelCutscene
          landId={worldTransition.targetLand}
          fromStage={1}
          toStage={1}
          stationName={worldTransition.stationName}
          skillTitle={worldTransition.skillTitle}
          activeExplorer={activeExplorer}
          onArrived={() => {
            setSelectedLand(worldTransition.targetLand);
            setWorldTransition(null);
            setCurrentView('land-map');
          }}
        />
      )}

      {/* 1. GLOBAL WORLD CANVAS */}
      {currentView === 'world' && (
        <WorldCanvas
          onSelectLand={(landId) => {
            if (landId === 'phonixia-academy' || landId === 'masters-pathways' || landId === 'celestial-archives') {
              setCurrentView('higher-ed');
            } else {
              const names: Record<LandId, { station: string; skill: string }> = {
                'sound-shallows': { station: 'Whispering Cove', skill: 'Pure Phonics Sound Pearls' },
                'builders-guild': { station: 'Guild Word Forge', skill: 'Word Crane & Architecture' },
                'tricky-trails': { station: 'Canopy Crossing', skill: 'Tricky Sight Word Vines' },
                'whispering-peaks': { station: 'Blizzard Ridge', skill: 'Downhill Mountain Slalom' },
                'lexicon-empire': { station: 'Imperial Bastion', skill: 'Rhetoric & Clausal Fortresses' },
                'phonixia-academy': { station: 'Phonixia Academy', skill: 'Collegiate Linguistics' },
                'masters-pathways': { station: 'Master Pathways', skill: 'Multisensory Literacy' },
                'celestial-archives': { station: 'Celestial Sanctum', skill: 'Apex Coronation' }
              };
              const info = names[landId] || { station: 'Phonixia Realm', skill: 'Phonics Journey' };
              setWorldTransition({
                targetLand: landId,
                stationName: info.station,
                skillTitle: info.skill
              });
            }
          }}
          onSelectMinigame={(minigameId: MinigameId) => {
            if (minigameId === 'isles-of-play') setCurrentView('isles');
            if (minigameId === 'shellshore-arcade') setCurrentView('arcade');
            if (minigameId === 'word-forge') setCurrentView('word-forge');
            if (minigameId === 'speech-lab') setCurrentView('speech-lab');
          }}
          onOpenHomeHut={() => setIsHomeHutOpen(true)}
        />
      )}

      {/* 2. MAIN REALM EXPLORATION */}
      {currentView === 'land-map' && (
        <LandLevelView
          landId={selectedLand}
          onBackToWorld={() => setCurrentView('world')}
        />
      )}

      {/* 3. ACTIVE GAMEPLAY STAGE */}
      {currentView === 'playing-stage' && (
        <ActivePlayableStage
          landId={selectedLand}
          activeExplorer={activeExplorer}
          companionGuide={companionGuide}
          currentQuestion={activeQuestion}
          activeGameIndex={activeStageNumber}
          isAnswered={isAnswered}
          isCorrect={isCorrect}
          selectedAnswer={selectedAnswer}
          realmLives={realmLives}
          earnedStars={earnedStars}
          bossBarrierHp={100}
          roundCompleted={roundCompleted}
          onSelectChoice={handleSelectChoice}
          onFinishRound={() => setCurrentView('land-map')}
          onTryAgain={() => {
            setIsAnswered(false);
            setSelectedAnswer(null);
            sounds.speakPhonicsSlow(activeQuestion.soundCue);
          }}
          onNextLevel={() => {
            const nextStage = Math.min(50, activeStageNumber + 1);
            handleLaunchStage(nextStage);
          }}
          onClose={() => setCurrentView('land-map')}
          onOpenMinigamePractice={handleLaunchMinigamePractice}
        />
      )}

      {/* 4. ISLES OF PLAY */}
      {currentView === 'isles' && (
        <IslesOfPlay onBackToWorld={() => setCurrentView('world')} />
      )}

      {/* 5. SHELLSHORE ARCADE */}
      {currentView === 'arcade' && (
        <ShellshoreArcade onBackToWorld={() => setCurrentView('world')} />
      )}

      {/* 6. ARCHITECTURAL WORD FORGE */}
      {currentView === 'word-forge' && (
        <ArchitecturalWordForge onBack={() => setCurrentView('world')} />
      )}

      {/* 7. HIGHER EDUCATION HUB */}
      {currentView === 'higher-ed' && (
        <HigherEducationHub 
          onBack={() => setCurrentView('world')}
          onLaunchStage={(land, stage) => {
            setSelectedLand(land);
            handleLaunchStage(stage);
          }}
        />
      )}

      {/* 8. PRIVACY-SAFE SPEECH PRACTICE LAB */}
      {currentView === 'speech-lab' && (
        <SpeechPracticeLab onBack={() => setCurrentView('world')} />
      )}

      {/* 9. HOME HUT (PLAYER SELECT MODAL) */}
      {isHomeHutOpen && (
        <HomeHutModal
          onClose={() => setIsHomeHutOpen(false)}
          onOpenCelebration={() => {
            setIsHomeHutOpen(false);
            setManualCelebrationOpen(true);
          }}
          onOpenParentPortal={() => {
            setIsHomeHutOpen(false);
            setIsParentPinModalOpen(true);
          }}
        />
      )}

      {/* 10. WALL OF FAME CELEBRATION */}
      {(showHallOfFameCelebration || manualCelebrationOpen) && (
        <HallOfFameCelebration
          isReplay={manualCelebrationOpen}
          onDismiss={() => {
            dismissHallOfFameCelebration();
            setManualCelebrationOpen(false);
          }}
        />
      )}

      {/* 11. PARENT & TEACHER PIN GATE */}
      <ParentPinModal
        isOpen={isParentPinModalOpen}
        onClose={() => setIsParentPinModalOpen(false)}
        onSuccess={() => {
          setIsParentPinModalOpen(false);
          setIsEducatorSanctumOpen(true);
        }}
      />

      {/* 12. EDUCATOR & PARENT COMMAND SANCTUM (PIN GATED) */}
      <EducatorParentSanctumModal
        isOpen={isEducatorSanctumOpen}
        onClose={() => setIsEducatorSanctumOpen(false)}
      />

      {/* 13. LEGACY PARENT & TEACHER STATS DASHBOARD */}
      {isParentDashboardOpen && (
        <ParentDashboard
          onClose={() => setIsParentDashboardOpen(false)}
        />
      )}

      {/* 14. ADAPTIVE ACCESSIBILITY & UDL MODAL */}
      <AdaptiveAccessibilityModal
        isOpen={isAccessibilityModalOpen}
        onClose={() => setIsAccessibilityModalOpen(false)}
      />

      {/* 15. TEACHER MTSS / RTI DASHBOARD */}
      <TeacherMTSSDashboard
        isOpen={isTeacherDashboardOpen}
        onClose={() => setIsTeacherDashboardOpen(false)}
      />

      {/* 16. CYBER GUARDIAN FAMILY SAFETY MODAL */}
      <CyberGuardianModal
        isOpen={isCyberGuardianOpen}
        onClose={() => setIsCyberGuardianOpen(false)}
      />

      {/* 17. 19-TIER GRADE MILESTONES MODAL */}
      <GradeMilestonesModal
        isOpen={isGradeMilestonesOpen}
        onClose={() => setIsGradeMilestonesOpen(false)}
      />

      {/* 18. ETHICAL BUSINESS & LICENSING MODAL */}
      <BusinessLicensingModal
        isOpen={isBusinessLicensingOpen}
        onClose={() => setIsBusinessLicensingOpen(false)}
      />

    </div>
  );
};

const GameShell: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return sessionStorage.getItem('phonixia_active_session') === 'true';
  });

  const handleLogout = useCallback(() => {
    sessionStorage.removeItem('phonixia_active_session');
    setIsAuthenticated(false);
  }, []);

  if (!isAuthenticated) {
    return (
      <AuthGateway 
        onAuthenticated={() => {
          setIsAuthenticated(true);
        }} 
      />
    );
  }

  return <AuthenticatedGameView onLogout={handleLogout} />;
};

export default function App() {
  return (
    <ErrorBoundary>
      <GameProvider>
        <GameShell />
      </GameProvider>
    </ErrorBoundary>
  );
}