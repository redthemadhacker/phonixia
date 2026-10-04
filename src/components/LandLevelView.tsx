import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useGame, getCompanionGuide } from '../context/GameContext';
import { LandId } from '../types/character';
import { AvatarRenderer } from './AvatarRenderer';
import { ActivePlayableStage } from './ActivePlayableStage';
import { CuteTravelCutscene } from './CuteTravelCutscene';
import { sounds, VOICE_PERSONAS } from '../utils/audio';
import { getComprehensiveStageChallenge } from '../data/comprehensiveCurriculum';
import { 
  ArrowLeft, Star, Volume2, CheckCircle2, RotateCcw, 
  Footprints, Play, ArrowLeft as ArrowLeftIcon, 
  ArrowRight, Mic, X, ChevronsUp, Sparkles, Trophy, Heart, Flame, Shield
} from 'lucide-react';

const shallowsBg = '/sound.jpeg';
const buildersBg = '/build.jpeg';
const trailsBg = '/trails.jpeg';
const peaksBg = '/peak.jpeg';
const empireBg = '/empire.jpeg';

interface LandLevelViewProps {
  landId: LandId;
  onBackToWorld: () => void;
}

interface StationNode {
  stationIndex: number;
  name: string;
  skillTitle: string;
  x: number;
  y: number;
  icon: string;
}

interface GameQuestion {
  instruction: string;
  targetSound: string;
  soundCue: string;
  choices: string[];
  correct: string;
  explanation: string;
  missionTitle?: string;
  actionPrompt?: string;
  spokenPrompt?: string;
  builderLetters?: string[];
  builderTarget?: string;
}

const LAND_STATIONS: Record<LandId, StationNode[]> = {
  'sound-shallows': [
    { stationIndex: 1, name: 'Whispering Cove', skillTitle: 'First Letter Sounds', x: 20, y: 35, icon: '🐚' },
    { stationIndex: 2, name: 'Rhyme Reef', skillTitle: 'Rhyming Word Families', x: 42, y: 25, icon: '🌊' },
    { stationIndex: 3, name: 'Tidepool Rock', skillTitle: 'Ending Consonants', x: 75, y: 32, icon: '🦀' },
    { stationIndex: 4, name: 'Sunken Shallows', skillTitle: 'Short Vowels (A, E, I)', x: 35, y: 72, icon: '⭐' },
    { stationIndex: 5, name: 'Citadel Gates', skillTitle: 'Full 3-Sound Blending', x: 70, y: 68, icon: '🏰' },
  ],
  'builders-guild': [
    { stationIndex: 1, name: 'Quarry Anvil', skillTitle: 'Basic CVC Word Blends', x: 22, y: 32, icon: '🔨' },
    { stationIndex: 2, name: 'Steam Foundry', skillTitle: 'Digraph SH & CH', x: 45, y: 26, icon: '⚙️' },
    { stationIndex: 3, name: 'Welding Yard', skillTitle: 'Digraph TH & WH', x: 76, y: 34, icon: '🔥' },
    { stationIndex: 4, name: 'Crane Pier', skillTitle: 'Double Letters (FF, LL, SS)', x: 30, y: 72, icon: '🏗️' },
    { stationIndex: 5, name: 'Guild Fortress', skillTitle: 'Compound CVC Structures', x: 72, y: 68, icon: '🛡️' },
  ],
  'tricky-trails': [
    { stationIndex: 1, name: 'Mossy Clearing', skillTitle: 'Sight Words Tier 1', x: 20, y: 30, icon: '🌿' },
    { stationIndex: 2, name: 'Magic E Grove', skillTitle: 'Silent E Rule (A_E, I_E)', x: 48, y: 24, icon: '✨' },
    { stationIndex: 3, name: 'Winding Hollow', skillTitle: 'Silent E Rule (O_E, U_E)', x: 78, y: 32, icon: '🌲' },
    { stationIndex: 4, name: 'Tricky Stone Path', skillTitle: 'Irregular Sight Words', x: 32, y: 74, icon: '🗿' },
    { stationIndex: 5, name: 'Canopy Summit', skillTitle: 'Fluency Sight Challenge', x: 72, y: 70, icon: '🦅' },
  ],
  'whispering-peaks': [
    { stationIndex: 1, name: 'Glacial Ridge', skillTitle: 'Vowel Teams EE & EA', x: 20, y: 32, icon: '❄️' },
    { stationIndex: 2, name: 'Alpine Cavern', skillTitle: 'Vowel Teams OA & AI', x: 46, y: 25, icon: '⛰️' },
    { stationIndex: 3, name: 'Bossy R Pass', skillTitle: 'Bossy R (AR & OR)', x: 78, y: 32, icon: '🌪️' },
    { stationIndex: 4, name: 'Blizzard Bluff', skillTitle: 'Bossy R (ER, IR, UR)', x: 34, y: 72, icon: '🏔️' },
    { stationIndex: 5, name: 'Phonix Eyrie', skillTitle: 'Multi-Syllable Peak Challenge', x: 74, y: 68, icon: '👑' },
  ],
  'lexicon-empire': [
    { stationIndex: 1, name: 'Colonnade of Time', skillTitle: 'Greek Root CHRON & BIO', x: 22, y: 32, icon: '🏛️' },
    { stationIndex: 2, name: 'Senate Archives', skillTitle: 'Greek Root GEO & TELE', x: 45, y: 24, icon: '📜' },
    { stationIndex: 3, name: 'Latin Pillar', skillTitle: 'Latin Root SPEC & PORT', x: 78, y: 30, icon: '🗿' },
    { stationIndex: 4, name: 'Affix Foundry', skillTitle: 'Prefixes & Suffixes', x: 32, y: 72, icon: '⚖️' },
    { stationIndex: 5, name: 'Golden Acropolis', skillTitle: 'Grand Etymology Mastery', x: 72, y: 66, icon: '👑' },
  ],
  'phonixia-academy': [
    { stationIndex: 1, name: 'Hall of Linguistics', skillTitle: 'Phonetics & IPA', x: 20, y: 30, icon: '🏛️' },
    { stationIndex: 2, name: 'Colloquium of Storycraft', skillTitle: 'Narrative Architecture', x: 45, y: 25, icon: '📖' },
    { stationIndex: 3, name: 'Chamber of Rhetoric', skillTitle: 'Ethos, Pathos & Logos', x: 76, y: 32, icon: '⚖️' },
    { stationIndex: 4, name: 'Grammar Arcanum', skillTitle: 'Syntax Tree Parsing', x: 32, y: 70, icon: '📜' },
    { stationIndex: 5, name: 'Grand Senate', skillTitle: 'Collegiate Capstone Defense', x: 72, y: 66, icon: '🎓' },
  ],
  'masters-pathways': [
    { stationIndex: 1, name: 'Clinical Lab', skillTitle: 'Diagnostic Dyslexia Assessment', x: 22, y: 32, icon: '🔬' },
    { stationIndex: 2, name: 'Neurolinguistics Lab', skillTitle: 'Visual Word Form Area', x: 46, y: 24, icon: '🧠' },
    { stationIndex: 3, name: 'MTSS Tier 3 Studio', skillTitle: 'Multisensory Interventions', x: 78, y: 30, icon: '📊' },
    { stationIndex: 4, name: 'Oratory Amphitheater', skillTitle: 'Prosody & Public Dialectic', x: 34, y: 72, icon: '🎙️' },
    { stationIndex: 5, name: 'High Council of Masters', skillTitle: 'Master Thesis Defense', x: 74, y: 68, icon: '📜' },
  ],
  'celestial-archives': [
    { stationIndex: 1, name: 'Reading Rope Sanctum', skillTitle: 'Scarborough’s Reading Rope', x: 22, y: 30, icon: '🌌' },
    { stationIndex: 2, name: 'Neuronal Recycling Vault', skillTitle: 'Dehaene Cortical Evolution', x: 48, y: 22, icon: '✨' },
    { stationIndex: 3, name: 'Ancient Glyphs Observatory', skillTitle: 'Phoenician & PIE Decipherment', x: 78, y: 32, icon: '🗿' },
    { stationIndex: 4, name: 'AI & Language Nexus', skillTitle: 'Transformer Semantics & LLMs', x: 30, y: 74, icon: '⚡' },
    { stationIndex: 5, name: 'Throne of the Master', skillTitle: 'Supreme Title: MASTER OF PHONIXIA', x: 72, y: 68, icon: '👑' },
  ],
};

const LAND_CONFIG: Record<LandId, { name: string; bg: string; color: string }> = {
  'sound-shallows': { name: 'Sound Shallows', bg: shallowsBg, color: '#38bdf8' },
  'builders-guild': { name: 'Builders Guild', bg: buildersBg, color: '#fbbf24' },
  'tricky-trails': { name: 'Tricky Trails', bg: trailsBg, color: '#34d399' },
  'whispering-peaks': { name: 'Whispering Peaks', bg: peaksBg, color: '#818cf8' },
  'lexicon-empire': { name: 'Lexicon Empire', bg: empireBg, color: '#f59e0b' },
  'phonixia-academy': { name: 'Phonixia Academy', bg: empireBg, color: '#a855f7' },
  'masters-pathways': { name: 'Master’s Pathways', bg: peaksBg, color: '#10b981' },
  'celestial-archives': { name: 'Celestial Archives', bg: shallowsBg, color: '#eab308' },
};

interface LandTheme {
  questName: string;
  questAction: string;
  questLore: string;
  mechanic: 'swim' | 'smash' | 'vine' | 'cloud' | 'boss';
  icon: string;
  skyGradient: string;
  groundGradient: string;
  groundBorder: string;
  decor: string[];
  blockBg: string;
  blockBorder: string;
  blockShadow: string;
  jumpBtn: string;
  jumpLabel: string;
  jumpIconEmoji: string;
  accentBadge: string;
  hudBg: string;
}

const LAND_THEMES: Record<LandId, LandTheme> = {
  'sound-shallows': {
    questName: 'Underwater Pearl Dive',
    questAction: 'Swim & Dive upward to pop the Coral Sound Pearl!',
    questLore: 'The Shadow King submerged the reef! Swim through luminous waters and pop Sound Pearls to clear the murk!',
    mechanic: 'swim',
    icon: '🌊',
    skyGradient: 'from-cyan-950 via-teal-950 to-blue-950',
    groundGradient: 'from-blue-950 via-teal-950 to-teal-900',
    groundBorder: 'border-cyan-400',
    decor: ['🪸', '🫧', '⭐', '🐠', '🫧'],
    blockBg: 'bg-gradient-to-b from-cyan-300 via-teal-400 to-sky-500 text-slate-950',
    blockBorder: 'border-cyan-200',
    blockShadow: 'shadow-[0_0_20px_rgba(6,182,212,0.6)]',
    jumpBtn: 'bg-gradient-to-r from-cyan-500 via-teal-400 to-sky-500 text-slate-950 shadow-[0_0_20px_rgba(6,182,212,0.7)] hover:from-cyan-400',
    jumpLabel: 'SWIM UP',
    jumpIconEmoji: '🫧',
    accentBadge: 'bg-cyan-500/20 text-cyan-300 border-cyan-400/50',
    hudBg: 'border-cyan-500/50'
  },
  'builders-guild': {
    questName: 'Castle Rampart Builder',
    questAction: 'Leap up & smash the Question Brick to forge fortress keystones!',
    questLore: 'The Citadel ramparts are crumbling! Smash the heavy Question Bricks to forge ancient keystones and rebuild the gates!',
    mechanic: 'smash',
    icon: '🔨',
    skyGradient: 'from-amber-950 via-stone-900 to-stone-950',
    groundGradient: 'from-stone-950 via-amber-950 to-stone-900',
    groundBorder: 'border-amber-600',
    decor: ['⚙️', '🧱', '🔨', '🪙', '🧱'],
    blockBg: 'bg-gradient-to-b from-amber-400 via-amber-500 to-amber-600 text-slate-950',
    blockBorder: 'border-amber-200',
    blockShadow: 'shadow-[0_4px_0_rgba(180,83,9,1)] shadow-[0_0_15px_rgba(245,158,11,0.5)]',
    jumpBtn: 'bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-600 text-slate-950 shadow-[0_0_20px_rgba(245,158,11,0.7)] hover:from-amber-400',
    jumpLabel: 'SMASH BRICK',
    jumpIconEmoji: '🧱',
    accentBadge: 'bg-amber-500/20 text-amber-300 border-amber-400/50',
    hudBg: 'border-amber-500/50'
  },
  'tricky-trails': {
    questName: 'Jungle Canopy Vine Runner',
    questAction: 'Leap across the bramble pit to snatch the Golden Vine Fruit!',
    questLore: 'Dark shadow brambles overrun the jungle! Swing across thorny chasms and grab glowing Golden Rune Pods!',
    mechanic: 'vine',
    icon: '🌿',
    skyGradient: 'from-emerald-950 via-slate-950 to-emerald-950',
    groundGradient: 'from-stone-950 via-emerald-950 to-emerald-900',
    groundBorder: 'border-emerald-500',
    decor: ['🍃', '🪵', '🍄', '🌿', '🍃'],
    blockBg: 'bg-gradient-to-b from-emerald-300 via-emerald-400 to-teal-500 text-slate-950',
    blockBorder: 'border-emerald-200',
    blockShadow: 'shadow-[0_0_20px_rgba(16,185,129,0.6)]',
    jumpBtn: 'bg-gradient-to-r from-emerald-500 via-green-400 to-teal-500 text-slate-950 shadow-[0_0_20px_rgba(16,185,129,0.7)] hover:from-emerald-400',
    jumpLabel: 'VINE LEAP',
    jumpIconEmoji: '🍃',
    accentBadge: 'bg-emerald-500/20 text-emerald-300 border-emerald-400/50',
    hudBg: 'border-emerald-500/50'
  },
  'whispering-peaks': {
    questName: 'Glacier Slide & Cloud Bounce',
    questAction: 'Spring high off the aurora clouds to shatter the Frost Crystal!',
    questLore: 'A dark blizzard froze the sacred peaks! Bounce high off aurora spring-clouds to shatter frozen vowel glaciers!',
    mechanic: 'cloud',
    icon: '❄️',
    skyGradient: 'from-indigo-950 via-slate-900 to-cyan-950',
    groundGradient: 'from-slate-950 via-indigo-950 to-cyan-950',
    groundBorder: 'border-cyan-300',
    decor: ['❄️', '☁️', '🧊', '🏔️', '❄️'],
    blockBg: 'bg-gradient-to-b from-sky-200 via-indigo-300 to-purple-400 text-slate-950',
    blockBorder: 'border-cyan-100',
    blockShadow: 'shadow-[0_0_20px_rgba(99,102,241,0.6)]',
    jumpBtn: 'bg-gradient-to-r from-indigo-500 via-sky-400 to-cyan-400 text-slate-950 shadow-[0_0_20px_rgba(99,102,241,0.7)] hover:from-sky-300',
    jumpLabel: 'CLOUD BOUNCE',
    jumpIconEmoji: '☁️',
    accentBadge: 'bg-indigo-500/20 text-indigo-300 border-indigo-400/50',
    hudBg: 'border-indigo-500/50'
  },
  'lexicon-empire': {
    questName: 'Shadow King Magma Showdown',
    questAction: 'Dodge the Shadow King\'s magma fireballs & strike the Royal Obelisk!',
    questLore: 'The Final Boss Battle! Storm the Obsidian Fortress of the Shadow King, shatter his dark energy shield, and rescue the Golden Phonix!',
    mechanic: 'boss',
    icon: '🔥',
    skyGradient: 'from-purple-950 via-slate-950 to-rose-950',
    groundGradient: 'from-slate-950 via-purple-950 to-rose-950',
    groundBorder: 'border-rose-500',
    decor: ['🔥', '⚡', '👹', '🗿', '🔥'],
    blockBg: 'bg-gradient-to-b from-amber-300 via-rose-400 to-purple-600 text-slate-950',
    blockBorder: 'border-amber-300',
    blockShadow: 'shadow-[0_0_25px_rgba(244,63,94,0.7)]',
    jumpBtn: 'bg-gradient-to-r from-rose-500 via-amber-400 to-purple-600 text-slate-950 shadow-[0_0_25px_rgba(244,63,94,0.8)] hover:from-rose-400',
    jumpLabel: 'HERO STRIKE',
    jumpIconEmoji: '⚡',
    accentBadge: 'bg-rose-500/20 text-rose-300 border-rose-400/50',
    hudBg: 'border-rose-500/50'
  },
  'phonixia-academy': {
    questName: 'Collegiate Lecture Hall & Colloquium',
    questAction: 'Solve collegiate linguistic parsing trees to defend academic honors!',
    questLore: 'Enter the grand lecture halls of the 8 Colleges. Advance scholarship, conduct research, and master high linguistics!',
    mechanic: 'boss',
    icon: '🏛️',
    skyGradient: 'from-purple-950 via-slate-900 to-indigo-950',
    groundGradient: 'from-slate-950 via-purple-950 to-indigo-900',
    groundBorder: 'border-purple-400',
    decor: ['📜', '🏛️', '🎓', '📚', '🖋️'],
    blockBg: 'bg-gradient-to-b from-purple-300 via-indigo-400 to-violet-600 text-slate-950',
    blockBorder: 'border-purple-300',
    blockShadow: 'shadow-[0_0_20px_rgba(168,85,247,0.7)]',
    jumpBtn: 'bg-gradient-to-r from-purple-500 via-indigo-400 to-violet-600 text-slate-950 shadow-[0_0_20px_rgba(168,85,247,0.8)] hover:from-purple-400',
    jumpLabel: 'DEFEND THESIS',
    jumpIconEmoji: '🎓',
    accentBadge: 'bg-purple-500/20 text-purple-300 border-purple-400/50',
    hudBg: 'border-purple-500/50'
  },
  'masters-pathways': {
    questName: 'Master’s Clinical Practicum & Socratic Seminar',
    questAction: 'Apply advanced diagnostic reading interventions to unlock clinical masteries!',
    questLore: 'Conduct specialized master-level practicums in dyslexia intervention, neurolinguistics, and oratorical debate!',
    mechanic: 'boss',
    icon: '📜',
    skyGradient: 'from-emerald-950 via-slate-900 to-teal-950',
    groundGradient: 'from-slate-950 via-emerald-950 to-teal-900',
    groundBorder: 'border-emerald-400',
    decor: ['🔬', '🧠', '📜', '⚖️', '🌟'],
    blockBg: 'bg-gradient-to-b from-emerald-300 via-teal-400 to-emerald-600 text-slate-950',
    blockBorder: 'border-emerald-300',
    blockShadow: 'shadow-[0_0_20px_rgba(16,185,129,0.7)]',
    jumpBtn: 'bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-600 text-slate-950 shadow-[0_0_20px_rgba(16,185,129,0.8)] hover:from-emerald-400',
    jumpLabel: 'MASTER PRACTICUM',
    jumpIconEmoji: '🔬',
    accentBadge: 'bg-emerald-500/20 text-emerald-300 border-emerald-400/50',
    hudBg: 'border-emerald-500/50'
  },
  'celestial-archives': {
    questName: 'Doctoral Senate Defense & Master of Phonixia',
    questAction: 'Attain the Supreme Seal of Literacy & Defend your Doctoral Dissertation!',
    questLore: 'The pinnacle of human literacy science. Synthesize reading neuroscience, evolutionary linguistics, and earn the supreme title: MASTER OF PHONIXIA!',
    mechanic: 'boss',
    icon: '🌌',
    skyGradient: 'from-amber-950 via-slate-950 to-yellow-950',
    groundGradient: 'from-slate-950 via-amber-950 to-yellow-900',
    groundBorder: 'border-yellow-400',
    decor: ['🌌', '✨', '👑', '🕊️', '☀️'],
    blockBg: 'bg-gradient-to-b from-yellow-200 via-amber-400 to-yellow-600 text-slate-950',
    blockBorder: 'border-yellow-300',
    blockShadow: 'shadow-[0_0_25px_rgba(234,179,8,0.8)]',
    jumpBtn: 'bg-gradient-to-r from-yellow-400 via-amber-300 to-yellow-500 text-slate-950 shadow-[0_0_25px_rgba(234,179,8,0.9)] hover:from-yellow-300',
    jumpLabel: 'CELESTIAL SEAL',
    jumpIconEmoji: '👑',
    accentBadge: 'bg-yellow-500/20 text-yellow-300 border-yellow-400/50',
    hudBg: 'border-yellow-500/50'
  }
};

// Rich procedural question bank ensures NO TWO GAMES ARE THE SAME
const GET_GAME_QUESTION = (landId: LandId, overallGameIndex: number): GameQuestion => {
  const challenge = getComprehensiveStageChallenge(landId, overallGameIndex);
  return {
    missionTitle: challenge.skillTitle,
    actionPrompt: challenge.instruction,
    instruction: challenge.instruction,
    targetSound: challenge.targetSound,
    soundCue: challenge.soundCue,
    choices: challenge.choices,
    correct: challenge.correct,
    explanation: challenge.explanation,
    spokenPrompt: challenge.spokenPrompt,
    builderLetters: challenge.builderLetters,
    builderTarget: challenge.builderTarget
  };
};

export const LandLevelView: React.FC<LandLevelViewProps> = ({ landId, onBackToWorld }) => {
  const { activeExplorer, updateExplorerScore, awardCurrency, restartLandProgress } = useGame();
  const companionGuide = getCompanionGuide(activeExplorer);
  const config = LAND_CONFIG[landId] || LAND_CONFIG['sound-shallows'];
  const theme = LAND_THEMES[landId] || LAND_THEMES['sound-shallows'];
  const stations = LAND_STATIONS[landId] || LAND_STATIONS['sound-shallows'];

  const landProgress = activeExplorer.landScores?.[landId] || { completedGamesCount: 0, stars: 0, unlocked: true };

  const containerRef = useRef<HTMLDivElement>(null);
  const playerPosRef = useRef<{ x: number; y: number }>({ x: stations[0].x, y: stations[0].y + 5 });
  const [playerPos, setPlayerPos] = useState<{ x: number; y: number }>({ x: stations[0].x, y: stations[0].y + 5 });
  const targetPosRef = useRef<{ x: number; y: number } | null>(null);

  const [facing, setFacing] = useState<'left' | 'right' | 'down' | 'up'>('down');
  const [isMoving, setIsMoving] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [walkCycle, setWalkCycle] = useState(0);

  const [nearbyStation, setNearbyStation] = useState<StationNode | null>(null);
  const [selectedStation, setSelectedStation] = useState<StationNode | null>(null);

  const [activeGameIndex, setActiveGameIndex] = useState<number | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState<GameQuestion | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [roundCompleted, setRoundCompleted] = useState(false);
  const [earnedStars, setEarnedStars] = useState(3);

  // Mario 3 Lives System
  const [realmLives, setRealmLives] = useState<number>(3);
  const [isGameOver, setIsGameOver] = useState<boolean>(false);
  const [screenDamageFlash, setScreenDamageFlash] = useState<boolean>(false);
  const [isCharacterDying, setIsCharacterDying] = useState<boolean>(false);
  const hasSavedThisRoundRef = useRef<boolean>(false);

  // Shadow King Boss Barrier (for Land 5)
  const [bossBarrierHp, setBossBarrierHp] = useState<number>(100);

  const [showVoiceModal, setShowVoiceModal] = useState(false);

  // Jump physics on land map
  const [jumpOffset, setJumpOffset] = useState<number>(0);
  const [isJumping, setIsJumping] = useState<boolean>(false);

  // Cute Travel Cutscene State across all 50 stages in all 5 games
  const [travelingState, setTravelingState] = useState<{
    from: number;
    to: number;
    stationName: string;
    skillTitle: string;
  } | null>(null);

  // Return to Phonixia Citadel Travel Animation
  const [isReturningToPhonixia, setIsReturningToPhonixia] = useState<boolean>(false);

  // Refs for callbacks to prevent stale closures in event listeners
  const triggerMapJumpRef = useRef<() => void>(() => {});
  const handleSelectChoiceRef = useRef<(choice: string) => void>(() => {});

  const handleSelectChoice = useCallback((choice: string) => {
    if (!currentQuestion || isAnswered) return;
    sounds.stopSpeech();
    setSelectedAnswer(choice);
    setIsAnswered(true);

    const cleanChoice = choice.trim().toLowerCase();
    const cleanCorrect = currentQuestion.correct.trim().toLowerCase();
    const correct = 
      cleanChoice === cleanCorrect ||
      (cleanCorrect === 'e' && (cleanChoice === 'er' || cleanChoice === 'sister')) ||
      (cleanCorrect === 'er' && (cleanChoice === 'e' || cleanChoice === 'sister')) ||
      (cleanCorrect === 'sister' && (cleanChoice === 'e' || cleanChoice === 'er'));
    setIsCorrect(correct);

    if (correct) {
      sounds.playSuccess();
      sounds.speak(`Awesome! ${currentQuestion.explanation}`);
      if (theme.mechanic === 'boss') {
        setBossBarrierHp((prev) => Math.max(0, prev - 25));
      }

      // CRITICAL: Cache & Save progress immediately on win!
      if (!hasSavedThisRoundRef.current) {
        hasSavedThisRoundRef.current = true;
        const currentCompleted = landProgress.completedGamesCount || 0;
        const stageIdx = activeGameIndex || 1;
        const nextCompleted = Math.max(currentCompleted, stageIdx);
        const delta = nextCompleted - currentCompleted;
        updateExplorerScore(landId, delta, earnedStars);
        awardCurrency(15, 2);
      }
    } else {
      setEarnedStars((prev) => Math.max(1, prev - 1));

      // Getting an answer wrong restores life force to boss barrier!
      if (theme.mechanic === 'boss') {
        setBossBarrierHp((prev) => Math.min(100, prev + 15));
      }

      // Screen damage flash
      setScreenDamageFlash(true);
      setTimeout(() => setScreenDamageFlash(false), 400);

      // Mario Lives System: 1 wrong answer = 1 heart lost!
      setRealmLives((prev) => {
        const next = prev - 1;
        if (next <= 0) {
          // Character death animation!
          setIsCharacterDying(true);
          // Mario retro game over melody ONLY - no voice talking over death!
          sounds.playGameOver();
          setTimeout(() => {
            setIsGameOver(true);
            setIsCharacterDying(false);
          }, 700);
        } else {
          sounds.playDamage();
        }
        return Math.max(0, next);
      });
    }
  }, [currentQuestion, isAnswered, theme.mechanic, landProgress.completedGamesCount, activeGameIndex, updateExplorerScore, landId, earnedStars, awardCurrency]);

  handleSelectChoiceRef.current = handleSelectChoice;

  const handleGameOverRestart = () => {
    // Keep saved stage completions cached - do not wipe progress!
    setRealmLives(3);
    setIsGameOver(false);
    setIsCharacterDying(false);
    const resumeStage = activeGameIndex || Math.min(50, (landProgress.completedGamesCount || 0) + 1);
    startPlayableGame(resumeStage);
    sounds.playFanfare();
  };

  const triggerMapJump = useCallback(() => {
    if (isJumping) return;
    setIsJumping(true);
    sounds.playJump();

    const startTime = performance.now();
    const jumpDuration = 450;
    const maxDisplacement = 40;

    const animateJump = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / jumpDuration, 1);
      const height = Math.sin(progress * Math.PI) * maxDisplacement;
      setJumpOffset(height);

      if (progress < 1) {
        requestAnimationFrame(animateJump);
      } else {
        setJumpOffset(0);
        setIsJumping(false);
      }
    };

    requestAnimationFrame(animateJump);
  }, [isJumping]);

  triggerMapJumpRef.current = triggerMapJump;

  const dirKeysRef = useRef({ up: false, down: false, left: false, right: false, shift: false });
  const [activeDpad, setActiveDpad] = useState({ up: false, down: false, left: false, right: false });
  const lastKeyTimeRef = useRef<number>(0);
  const requestRef = useRef<number | null>(null);
  const lastStepSoundTime = useRef<number>(0);
  const enterCooldown = useRef<number>(0);
  const lastEnteredStation = useRef<number | null>(null);

  // Stop speech when unmounting
  useEffect(() => {
    return () => {
      sounds.stopSpeech();
    };
  }, []);

  useEffect(() => {
    containerRef.current?.focus();
    const activeStationIdx = Math.min(4, Math.floor(landProgress.completedGamesCount / 10));
    const st = stations[activeStationIdx] || stations[0];
    playerPosRef.current = { x: st.x, y: Math.min(88, st.y + 5) };
    setPlayerPos({ x: st.x, y: Math.min(88, st.y + 5) });
  }, [stations, landProgress.completedGamesCount]);

  const triggerTravelAnimation = useCallback((nextStage: number) => {
    if (nextStage > 50) {
      setActiveGameIndex(null);
      setCurrentQuestion(null);
      return;
    }
    const targetStationIdx = Math.min(4, Math.floor((nextStage - 1) / 10));
    const targetStation = stations[targetStationIdx] || stations[0];
    const nextQ = GET_GAME_QUESTION(landId, nextStage);

    setActiveGameIndex(null);
    setCurrentQuestion(null);
    setSelectedStation(null);

    setTravelingState({
      from: activeGameIndex || 1,
      to: nextStage,
      stationName: targetStation.name,
      skillTitle: nextQ.missionTitle || targetStation.skillTitle
    });
  }, [stations, landId, activeGameIndex]);

  const isStationUnlocked = useCallback((stIndex: number): boolean => {
    return landProgress.completedGamesCount >= (stIndex - 1) * 10;
  }, [landProgress.completedGamesCount]);

  const triggerStationOpen = useCallback((station: StationNode) => {
    sounds.stopSpeech();
    if (isStationUnlocked(station.stationIndex)) {
      sounds.playSuccess();
      const stationStart = (station.stationIndex - 1) * 10 + 1;
      const targetStage = Math.min(
        station.stationIndex * 10,
        Math.max(stationStart, landProgress.completedGamesCount + 1)
      );
      triggerTravelAnimation(targetStage);
    } else {
      sounds.playError();
      sounds.speak(`This area is locked! Complete all challenges in the previous station first!`);
    }
  }, [isStationUnlocked, landProgress.completedGamesCount, triggerTravelAnimation]);

  const checkProximity = useCallback((x: number, y: number) => {
    let closest: StationNode | null = null;
    let minDistance = 7.0;

    stations.forEach((st) => {
      const dist = Math.hypot(st.x - x, st.y - y);
      if (dist < minDistance) {
        minDistance = dist;
        closest = st;
      }
    });

    // DO NOT auto-open! Player passes over freely and presses Space bar to enter!
    setNearbyStation(closest);
  }, [stations]);

  // Global Keyboard event handling (Uses Refs to avoid stale closures!)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable)) {
        return;
      }
      if (activeGameIndex !== null) return;
      const k = e.key ? e.key.toLowerCase() : '';
      const code = e.code || '';
      let matched = false;

      // Space bar or Enter: If on/near a station, jump to enter and travel! Otherwise jump on map.
      if (k === ' ' || k === 'enter' || code === 'Space' || code === 'Enter') {
        e.preventDefault();
        matched = true;
        if (nearbyStation) {
          triggerStationOpen(nearbyStation);
        } else {
          triggerMapJumpRef.current();
        }
      }

      if (k === 'arrowup' || k === 'up' || k === 'w' || code === 'ArrowUp' || code === 'KeyW') {
        dirKeysRef.current.up = true;
        setActiveDpad((prev) => ({ ...prev, up: true }));
        matched = true;
      }
      if (k === 'arrowdown' || k === 'down' || k === 's' || code === 'ArrowDown' || code === 'KeyS') {
        dirKeysRef.current.down = true;
        setActiveDpad((prev) => ({ ...prev, down: true }));
        matched = true;
      }
      if (k === 'arrowleft' || k === 'left' || k === 'a' || code === 'ArrowLeft' || code === 'KeyA') {
        dirKeysRef.current.left = true;
        setActiveDpad((prev) => ({ ...prev, left: true }));
        matched = true;
      }
      if (k === 'arrowright' || k === 'right' || k === 'd' || code === 'ArrowRight' || code === 'KeyD') {
        dirKeysRef.current.right = true;
        setActiveDpad((prev) => ({ ...prev, right: true }));
        matched = true;
      }
      if (k === 'shift' || code === 'ShiftLeft' || code === 'ShiftRight') {
        dirKeysRef.current.shift = true;
        matched = true;
      }

      if ((k === 'e' || k === 'enter' || code === 'KeyE' || code === 'Enter') && nearbyStation && !selectedStation) {
        matched = true;
        triggerStationOpen(nearbyStation);
      }

      if (matched) {
        targetPosRef.current = null;
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable)) {
        return;
      }
      if (activeGameIndex !== null) return;
      const k = e.key ? e.key.toLowerCase() : '';
      const code = e.code || '';

      if (k === 'arrowup' || k === 'up' || k === 'w' || code === 'ArrowUp' || code === 'KeyW') {
        dirKeysRef.current.up = false;
        setActiveDpad((prev) => ({ ...prev, up: false }));
      }
      if (k === 'arrowdown' || k === 'down' || k === 's' || code === 'ArrowDown' || code === 'KeyS') {
        dirKeysRef.current.down = false;
        setActiveDpad((prev) => ({ ...prev, down: false }));
      }
      if (k === 'arrowleft' || k === 'left' || k === 'a' || code === 'ArrowLeft' || code === 'KeyA') {
        dirKeysRef.current.left = false;
        setActiveDpad((prev) => ({ ...prev, left: false }));
      }
      if (k === 'arrowright' || k === 'right' || k === 'd' || code === 'ArrowRight' || code === 'KeyD') {
        dirKeysRef.current.right = false;
        setActiveDpad((prev) => ({ ...prev, right: false }));
      }
      if (k === 'shift' || code === 'ShiftLeft' || code === 'ShiftRight') {
        dirKeysRef.current.shift = false;
      }

      const anyActive = dirKeysRef.current.up || dirKeysRef.current.down || dirKeysRef.current.left || dirKeysRef.current.right;
      if (!anyActive) lastKeyTimeRef.current = 0;
    };

    window.addEventListener('keydown', handleKeyDown, { passive: false });
    window.addEventListener('keyup', handleKeyUp, { passive: false });
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [nearbyStation, selectedStation, activeGameIndex, triggerStationOpen]);

  // World map walk cycle loop
  useEffect(() => {
    let prevTime = performance.now();

    const loop = (currentTime: number) => {
      const dt = Math.min((currentTime - prevTime) / 1000, 0.1);
      prevTime = currentTime;

      const dirs = dirKeysRef.current;
      let dx = 0;
      let dy = 0;

      if (dirs.up) dy -= 1;
      if (dirs.down) dy += 1;
      if (dirs.left) dx -= 1;
      if (dirs.right) dx += 1;

      const running = dirs.shift;
      setIsRunning(running);
      const baseSpeed = running ? 18 : 10;

      let moving = false;
      let newX = playerPosRef.current.x;
      let newY = playerPosRef.current.y;

      if (dx !== 0 || dy !== 0) {
        targetPosRef.current = null;
        const len = Math.hypot(dx, dy);

        if (Math.abs(dx) >= Math.abs(dy)) {
          setFacing(dx > 0 ? 'right' : 'left');
        } else {
          setFacing(dy > 0 ? 'down' : 'up');
        }

        newX = Math.max(5, Math.min(95, playerPosRef.current.x + (dx / len) * baseSpeed * dt));
        newY = Math.max(12, Math.min(90, playerPosRef.current.y + (dy / len) * baseSpeed * dt));
        moving = true;
      } else if (targetPosRef.current) {
        const target = targetPosRef.current;
        const distX = target.x - playerPosRef.current.x;
        const distY = target.y - playerPosRef.current.y;
        const dist = Math.hypot(distX, distY);

        if (dist > 0.8) {
          if (Math.abs(distX) > Math.abs(distY)) {
            setFacing(distX > 0 ? 'right' : 'left');
          } else {
            setFacing(distY > 0 ? 'down' : 'up');
          }

          newX = playerPosRef.current.x + (distX / dist) * baseSpeed * dt;
          newY = playerPosRef.current.y + (distY / dist) * baseSpeed * dt;
          moving = true;
        } else {
          targetPosRef.current = null;
        }
      }

      if (moving) {
        playerPosRef.current = { x: newX, y: newY };
        setPlayerPos({ x: newX, y: newY });
        setIsMoving(true);
        setWalkCycle((prev) => (prev + dt * (running ? 16 : 9)) % (Math.PI * 2));
        checkProximity(newX, newY);

        const stepCadence = running ? 200 : 320;
        if (currentTime - lastStepSoundTime.current > stepCadence) {
          sounds.playStep();
          lastStepSoundTime.current = currentTime;
        }
      } else {
        setIsMoving(false);
        setWalkCycle(0);
      }

      requestRef.current = requestAnimationFrame(loop);
    };

    requestRef.current = requestAnimationFrame(loop);
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [checkProximity]);

  const handleMapClick = (e: React.MouseEvent<HTMLDivElement>) => {
    containerRef.current?.focus();
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = ((e.clientX - rect.left) / rect.width) * 100;
    const clickY = ((e.clientY - rect.top) / rect.height) * 100;
    targetPosRef.current = { x: clickX, y: clickY };
  };

  const handleDpadPress = (dir: 'up' | 'down' | 'left' | 'right') => {
    containerRef.current?.focus();
    dirKeysRef.current[dir] = true;
    setActiveDpad((prev) => ({ ...prev, [dir]: true }));
    if (!lastKeyTimeRef.current) lastKeyTimeRef.current = performance.now();
  };

  const handleDpadRelease = (dir: 'up' | 'down' | 'left' | 'right') => {
    dirKeysRef.current[dir] = false;
    setActiveDpad((prev) => ({ ...prev, [dir]: false }));
    const anyActive = dirKeysRef.current.up || dirKeysRef.current.down || dirKeysRef.current.left || dirKeysRef.current.right;
    if (!anyActive) lastKeyTimeRef.current = 0;
  };

  const startPlayableGame = (gameNum: number) => {
    sounds.stopSpeech();
    const q = GET_GAME_QUESTION(landId, gameNum);
    setCurrentQuestion(q);
    setActiveGameIndex(gameNum);
    setSelectedAnswer(null);
    setIsAnswered(false);
    setIsCorrect(false);
    setRoundCompleted(false);
    setEarnedStars(3);
    setSelectedStation(null);
  };

  const finishGameRound = () => {
    if (!activeGameIndex) return;
    sounds.stopSpeech();
    setRoundCompleted(true);
    sounds.playFanfare();

    const currentCompleted = landProgress.completedGamesCount || 0;
    const nextCompleted = Math.max(currentCompleted, activeGameIndex);
    const delta = nextCompleted - currentCompleted;
    updateExplorerScore(landId, delta, earnedStars);
    awardCurrency(15, 2);
  };

  return (
    <div
      ref={containerRef}
      tabIndex={0}
      onClick={() => containerRef.current?.focus()}
      className={`relative w-full h-full flex flex-col justify-between select-none outline-none overflow-hidden ${
        screenDamageFlash ? 'ring-8 ring-rose-600 ring-inset bg-rose-950/40 animate-pulse' : ''
      }`}
    >
      {/* Top HUD */}
      <div 
        style={{
          top: 'calc(env(safe-area-inset-top, 0px) + 8px)',
          left: 'calc(env(safe-area-inset-left, 0px) + 8px)',
          right: 'calc(env(safe-area-inset-right, 0px) + 8px)'
        }}
        className="absolute z-40 flex items-center justify-between pointer-events-none"
      >
        <button
          onClick={() => {
            sounds.stopSpeech();
            sounds.playFanfare();
            setIsReturningToPhonixia(true);
          }}
          className="pointer-events-auto px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl sm:rounded-2xl bg-slate-950/85 backdrop-blur-md hover:bg-slate-900 text-amber-300 border border-amber-500/70 text-xs font-black flex items-center gap-1.5 cursor-pointer shadow-xl transition-transform hover:scale-105 active:scale-95"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Citadel Map</span>
        </button>

        <div className="pointer-events-auto text-center bg-slate-950/85 backdrop-blur-md px-3 sm:px-4 py-1 sm:py-1.5 rounded-xl sm:rounded-2xl border border-amber-500/50 shadow-xl">
          <h2 className="text-xs sm:text-sm font-black text-amber-300 font-display uppercase tracking-wide flex items-center gap-1.5 justify-center">
            <span>{theme.icon}</span>
            <span>{config.name}</span>
          </h2>
          <span className="text-[9px] sm:text-[10px] text-slate-400 font-mono font-bold">
            {landProgress.completedGamesCount} / 50 Completed
          </span>
        </div>

        <div className="pointer-events-auto flex items-center gap-2">
          {/* Mario 3 Lives Display: ❤️ ❤️ ❤️ */}
          <div 
            title="Mario 3 Lives: 3 mistakes and you restart this land!"
            className="flex items-center gap-1 px-2.5 py-1 sm:py-1.5 rounded-xl sm:rounded-2xl bg-slate-950/90 backdrop-blur-md border border-rose-500/80 shadow-[0_0_15px_rgba(244,63,94,0.3)]"
          >
            {Array.from({ length: 3 }).map((_, i) => (
              <span key={i} className="text-xs sm:text-sm transition-transform duration-200">
                {i < realmLives ? '❤️' : '🖤'}
              </span>
            ))}
          </div>

          <button
            onClick={() => {
              sounds.stopSpeech();
              setShowVoiceModal(true);
            }}
            className="h-8 sm:h-9 px-2.5 rounded-xl sm:rounded-2xl bg-slate-950/85 backdrop-blur-md border border-amber-500/60 text-amber-300 text-xs font-bold flex items-center gap-1 cursor-pointer"
          >
            <Mic className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Voice</span>
          </button>

          <div className="flex items-center gap-1 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-xl sm:rounded-2xl bg-slate-950/85 backdrop-blur-md border border-amber-500/60 text-amber-400 text-[11px] sm:text-xs font-mono font-bold shadow-xl">
            <Star className="w-3.5 h-3.5 fill-amber-400" />
            <span>{landProgress.stars}</span>
          </div>
        </div>
      </div>

      {/* Main Realm Territory Canvas with Background Art */}
      <div
        onClick={handleMapClick}
        className="relative flex-1 w-full cursor-crosshair overflow-hidden select-none"
        style={{ backgroundColor: '#07101e' }}
      >
        <img
          src={config.bg}
          alt={`${config.name} Territory Canvas`}
          className="absolute inset-0 w-full h-full object-fill select-none pointer-events-none z-0"
        />

        {/* 5 Clean Mario-Style Landmark Station Circular Nodes on the Map */}
        {stations.map((st) => {
          const unlocked = isStationUnlocked(st.stationIndex);
          const completedInStation = Math.min(10, Math.max(0, landProgress.completedGamesCount - (st.stationIndex - 1) * 10));
          const isMastered = completedInStation >= 10;
          const isNearby = nearbyStation?.stationIndex === st.stationIndex;
          const stationStart = (st.stationIndex - 1) * 10 + 1;
          const activeStage = Math.min(
            st.stationIndex * 10,
            Math.max(stationStart, landProgress.completedGamesCount + 1)
          );

          return (
            <div
              key={st.stationIndex}
              style={{ left: `${st.x}%`, top: `${st.y}%` }}
              onClick={(e) => {
                e.stopPropagation();
                triggerStationOpen(st);
              }}
              className="absolute z-15 -translate-x-1/2 -translate-y-1/2 cursor-pointer group select-none"
            >
              {/* Mario Circular Node */}
              <div
                className={`relative rounded-full flex flex-col items-center justify-center transition-all ${
                  unlocked
                    ? isNearby
                      ? 'w-10 h-10 sm:w-12 sm:h-12 bg-amber-400 border-2 border-white ring-4 ring-amber-400/80 shadow-[0_0_20px_rgba(245,158,11,1)] scale-120 animate-bounce'
                      : 'w-8 h-8 sm:w-10 sm:h-10 bg-black border-2 border-amber-400 shadow-xl hover:scale-115'
                    : 'w-7 h-7 sm:w-9 sm:h-9 bg-slate-900 border-2 border-slate-700 opacity-60'
                }`}
              >
                <span className="text-sm sm:text-base">{st.icon}</span>

                {/* Cleared Mario Flag */}
                {isMastered && (
                  <div className="absolute -top-3.5 -right-1 text-xs animate-pulse">
                    🚩
                  </div>
                )}
              </div>

              {/* Station Number & Stars mini pill */}
              <div className="mt-1 flex items-center justify-center">
                <span className={`text-[9px] font-mono font-black px-1.5 py-0.2 rounded-full shadow ${
                  isMastered
                    ? 'bg-amber-400 text-slate-950'
                    : unlocked
                    ? 'bg-slate-950/90 text-amber-300 border border-amber-500/50'
                    : 'bg-slate-900 text-slate-500'
                }`}>
                  #{st.stationIndex} · {completedInStation}/10
                </span>
              </div>

              {/* Pop-Over Mario Banner on Proximity */}
              {isNearby && (
                <div className="absolute bottom-12 left-1/2 -translate-x-1/2 bg-slate-950/95 border-2 border-amber-400 px-3 py-1.5 rounded-xl shadow-[0_0_25px_rgba(245,158,11,0.7)] whitespace-nowrap z-40 text-center animate-scale-up pointer-events-none">
                  <div className="text-[11px] font-black text-amber-200 flex items-center justify-center gap-1">
                    <span>{st.icon}</span>
                    <span>{st.name}</span>
                  </div>
                  <div className="text-[9px] font-bold text-slate-300">
                    {unlocked ? `Level ${activeStage} · Press SPACE or Tap to Play` : 'Locked · Complete earlier stages first'}
                  </div>
                </div>
              )}
            </div>
          );
        })}

        {/* Traveling Companion Guide (Kam or Celine) on Map */}
        <div
          style={{
            left: `${playerPos.x - (facing === 'left' ? -3.5 : 3.5)}%`,
            top: `${playerPos.y - jumpOffset * 0.2}%`,
            transform: 'translate(-50%, -50%)',
          }}
          className="absolute z-19 pointer-events-none transition-transform duration-75 flex flex-col items-center"
        >
          <div className="absolute -top-5 left-1/2 -translate-x-1/2 bg-slate-950/90 border border-amber-400/60 px-1.5 py-0.2 rounded-full shadow whitespace-nowrap">
            <span className="text-[9px] font-bold text-amber-200">{companionGuide.name}</span>
          </div>
          <AvatarRenderer
            customization={companionGuide.customization}
            size={38}
            isWalking={isMoving}
            isRunning={isRunning}
            isJumping={jumpOffset > 2}
            facing={facing}
            walkCycle={walkCycle}
            showPet={false}
          />
        </div>

        {/* Active Player Avatar on Map */}
        <div
          style={{
            left: `${playerPos.x}%`,
            top: `${playerPos.y - jumpOffset * 0.2}%`,
            transform: 'translate(-50%, -50%)',
          }}
          className="absolute z-20 pointer-events-none transition-transform duration-75 flex flex-col items-center"
        >
          <div className="absolute -top-5 left-1/2 -translate-x-1/2 bg-slate-950/90 border border-amber-400/60 px-2 py-0.2 rounded-full shadow whitespace-nowrap">
            <span className="text-[9px] font-black text-amber-300">{activeExplorer.name}</span>
          </div>
          <AvatarRenderer
            customization={activeExplorer.customization}
            size={46}
            isWalking={isMoving}
            isRunning={isRunning}
            isJumping={jumpOffset > 2}
            facing={facing}
            walkCycle={walkCycle}
            showPet={true}
          />
        </div>

        {/* Map On-Screen Controls */}
        <div 
          style={{
            bottom: 'calc(env(safe-area-inset-bottom, 0px) + 64px)',
            right: 'calc(env(safe-area-inset-right, 0px) + 12px)'
          }}
          className="absolute z-30 flex items-center gap-2 select-none touch-none"
        >
          {/* Virtual Dpad */}
          <div className="bg-slate-950/90 p-1.5 rounded-2xl border border-amber-500/40 shadow-2xl flex flex-col items-center gap-1">
            <button
              onMouseDown={() => handleDpadPress('up')}
              onMouseUp={() => handleDpadRelease('up')}
              onTouchStart={(e) => { e.preventDefault(); handleDpadPress('up'); }}
              onTouchEnd={(e) => { e.preventDefault(); handleDpadRelease('up'); }}
              className={`w-7 h-7 sm:w-9 sm:h-9 rounded-lg flex items-center justify-center border transition-all ${
                activeDpad.up ? 'bg-amber-400 text-slate-950 border-amber-300' : 'bg-slate-900 text-amber-300 border-amber-500/40'
              }`}
            >
              <ArrowLeftIcon className="w-4 h-4 rotate-90 stroke-[2.5]" />
            </button>

            <div className="flex items-center gap-1">
              <button
                onMouseDown={() => handleDpadPress('left')}
                onMouseUp={() => handleDpadRelease('left')}
                onTouchStart={(e) => { e.preventDefault(); handleDpadPress('left'); }}
                onTouchEnd={(e) => { e.preventDefault(); handleDpadRelease('left'); }}
                className={`w-7 h-7 sm:w-9 sm:h-9 rounded-lg flex items-center justify-center border transition-all ${
                  activeDpad.left ? 'bg-amber-400 text-slate-950 border-amber-300' : 'bg-slate-900 text-amber-300 border-amber-500/40'
                }`}
              >
                <ArrowLeftIcon className="w-4 h-4 stroke-[2.5]" />
              </button>

              <button
                onMouseDown={() => handleDpadPress('down')}
                onMouseUp={() => handleDpadRelease('down')}
                onTouchStart={(e) => { e.preventDefault(); handleDpadPress('down'); }}
                onTouchEnd={(e) => { e.preventDefault(); handleDpadRelease('down'); }}
                className={`w-7 h-7 sm:w-9 sm:h-9 rounded-lg flex items-center justify-center border transition-all ${
                  activeDpad.down ? 'bg-amber-400 text-slate-950 border-amber-300' : 'bg-slate-900 text-amber-300 border-amber-500/40'
                }`}
              >
                <ArrowLeftIcon className="w-4 h-4 -rotate-90 stroke-[2.5]" />
              </button>

              <button
                onMouseDown={() => handleDpadPress('right')}
                onMouseUp={() => handleDpadRelease('right')}
                onTouchStart={(e) => { e.preventDefault(); handleDpadPress('right'); }}
                onTouchEnd={(e) => { e.preventDefault(); handleDpadRelease('right'); }}
                className={`w-7 h-7 sm:w-9 sm:h-9 rounded-lg flex items-center justify-center border transition-all ${
                  activeDpad.right ? 'bg-amber-400 text-slate-950 border-amber-300' : 'bg-slate-900 text-amber-300 border-amber-500/40'
                }`}
              >
                <ArrowRight className="w-4 h-4 stroke-[2.5]" />
              </button>
            </div>
          </div>

          {/* Arcade Map Jump Button */}
          <button
            onClick={triggerMapJump}
            onTouchStart={(e) => { e.preventDefault(); triggerMapJump(); }}
            className={`h-16 sm:h-20 w-12 sm:w-14 rounded-xl sm:rounded-2xl border-2 flex flex-col items-center justify-center gap-1 font-black text-[9px] sm:text-[11px] uppercase tracking-wider transition-all cursor-pointer ${
              isJumping
                ? 'bg-amber-300 text-slate-950 border-white scale-95 shadow-[0_0_15px_rgba(245,158,11,0.8)]'
                : 'bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 border-amber-300 shadow-[0_0_15px_rgba(245,158,11,0.5)] active:scale-95'
            }`}
          >
            <ChevronsUp className="w-4 h-4 stroke-[3]" />
            <span>JUMP</span>
          </button>
        </div>
      </div>

      {/* Bottom Proximity Station Bar */}
      <div 
        style={{
          paddingBottom: 'calc(env(safe-area-inset-bottom, 0px) + 8px)',
          paddingLeft: 'calc(env(safe-area-inset-left, 0px) + 8px)',
          paddingRight: 'calc(env(safe-area-inset-right, 0px) + 8px)'
        }}
        className="p-2 sm:p-2.5 bg-slate-950/95 border-t border-amber-900/60 flex items-center justify-between gap-2 overflow-x-auto scrollbar-none"
      >
        <div className="flex items-center gap-2">
          {nearbyStation ? (
            <div className="flex items-center gap-2 bg-slate-900/90 px-2.5 py-1 rounded-xl border border-amber-500/40">
              <span className="text-xl">{nearbyStation.icon}</span>
              <div>
                <span className="text-xs font-bold text-slate-100">{nearbyStation.name}</span>
                <span className="text-[10px] text-amber-400 ml-1">({nearbyStation.skillTitle})</span>
              </div>
              <button
                onClick={() => triggerStationOpen(nearbyStation)}
                className="px-2.5 py-1 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-black shadow cursor-pointer flex items-center gap-1"
              >
                <Play className="w-3 h-3 fill-current" />
                <span>Enter</span>
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 text-xs text-slate-400 pl-1">
              <Footprints className="w-3.5 h-3.5 text-amber-400" />
              <span className="text-[11px] hidden xs:inline">Walk to any landmark station to enter!</span>
            </div>
          )}
        </div>

        <div className="flex items-center gap-1 overflow-x-auto">
          {stations.map((st) => (
            <button
              key={st.stationIndex}
              onClick={() => {
                playerPosRef.current = { x: st.x, y: st.y + 5 };
                setPlayerPos({ x: st.x, y: st.y + 5 });
                triggerStationOpen(st);
              }}
              className="px-2.5 py-1 text-[10px] sm:text-xs font-bold rounded-lg bg-slate-900 text-slate-200 border border-amber-500/30 whitespace-nowrap cursor-pointer hover:bg-amber-950"
            >
              {st.name}
            </button>
          ))}
        </div>
      </div>

      {/* 2. ACTIVE PLAYABLE PHONICS GAME STAGE: REALM-SPECIFIC VIDEO GAME */}
      {activeGameIndex !== null && currentQuestion && (
        <ActivePlayableStage
          landId={landId}
          activeExplorer={activeExplorer}
          companionGuide={companionGuide}
          currentQuestion={currentQuestion}
          activeGameIndex={activeGameIndex}
          isAnswered={isAnswered}
          isCorrect={isCorrect}
          selectedAnswer={selectedAnswer}
          realmLives={realmLives}
          earnedStars={earnedStars}
          bossBarrierHp={bossBarrierHp}
          roundCompleted={roundCompleted}
          onSelectChoice={handleSelectChoice}
          onFinishRound={finishGameRound}
          onTryAgain={() => startPlayableGame(activeGameIndex)}
          onNextLevel={() => triggerTravelAnimation(activeGameIndex + 1)}
          onClose={() => {
            sounds.stopSpeech();
            setActiveGameIndex(null);
          }}
        />
      )}

      {/* 3. CUTE TRAVEL CUTSCENE: CHARACTER TRAVELS TO NEXT LEVEL ACROSS ALL 50 STAGES */}
      {travelingState && (
        <CuteTravelCutscene
          landId={landId}
          fromStage={travelingState.from}
          toStage={travelingState.to}
          stationName={travelingState.stationName}
          skillTitle={travelingState.skillTitle}
          activeExplorer={activeExplorer}
          onArrived={() => {
            const destStage = travelingState.to;
            setTravelingState(null);
            startPlayableGame(destStage);
          }}
        />
      )}

      {/* 4. RETURN TRAVEL CUTSCENE: TRAVEL BACK TO PHONIXIA CITADEL */}
      {isReturningToPhonixia && (
        <CuteTravelCutscene
          landId={landId}
          fromStage={landProgress.completedGamesCount || 1}
          toStage={1}
          stationName="Phonixia Citadel"
          skillTitle="Returning to Phonixia Harbor"
          activeExplorer={activeExplorer}
          onArrived={() => {
            setIsReturningToPhonixia(false);
            onBackToWorld();
          }}
        />
      )}

      {/* 3. MARIO GAME OVER MODAL: SAVIOR DEFEATED AFTER 3 MISTAKES */}
      {isGameOver && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/95 backdrop-blur-md animate-fade-in select-none">
          <div className="relative w-full max-w-md bg-gradient-to-b from-slate-900 via-rose-950/70 to-slate-950 border-4 border-rose-500 rounded-3xl p-6 sm:p-8 text-center space-y-5 shadow-[0_0_60px_rgba(244,63,94,0.6)] animate-scale-up">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-rose-500/20 border border-rose-400 text-rose-300 font-mono font-black text-xs uppercase tracking-widest animate-pulse">
              <span>💀 0 LIVES REMAINING 💀</span>
            </div>

            <div className="space-y-2">
              <h2 className="text-2xl sm:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-rose-400 via-red-300 to-amber-300 font-display uppercase tracking-wide drop-shadow">
                SAVIOR DEFEATED!
              </h2>
              <p className="text-xs sm:text-sm font-bold text-rose-200">
                The Shadow King reclaimed {config.name}!
              </p>
              <p className="text-[11px] sm:text-xs text-slate-300 max-w-sm mx-auto leading-relaxed pt-1">
                You made 3 mistakes and ran out of hearts! Just like in Mario, you must return to the beginning of this realm to try again.
              </p>
            </div>

            {/* Empty Hearts Display */}
            <div className="flex items-center justify-center gap-3 py-2">
              <span className="text-3xl animate-bounce">💔</span>
              <span className="text-3xl animate-bounce" style={{ animationDelay: '150ms' }}>💔</span>
              <span className="text-3xl animate-bounce" style={{ animationDelay: '300ms' }}>💔</span>
            </div>

            {/* Restart Button */}
            <button
              onClick={handleGameOverRestart}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 hover:from-amber-300 hover:to-yellow-300 text-slate-950 font-black text-xs sm:text-sm uppercase tracking-wider shadow-[0_0_25px_rgba(245,158,11,0.6)] cursor-pointer flex items-center justify-center gap-2 transition-transform hover:scale-105 active:scale-95 border-2 border-amber-200"
            >
              <RotateCcw className="w-4 h-4 stroke-[3]" />
              <span>Restart {config.name} (Level 1)</span>
            </button>
          </div>
        </div>
      )}

      {/* Voice Studio Modal */}
      {showVoiceModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/90 backdrop-blur-md animate-fade-in select-none">
          <div className="relative w-full max-w-md bg-slate-900 border-2 border-amber-400 rounded-3xl p-5 sm:p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Mic className="w-5 h-5 text-amber-400" />
                <h3 className="text-sm font-black text-amber-300 uppercase tracking-wide">
                  Phonics Voice Studio
                </h3>
              </div>
              <button
                onClick={() => {
                  sounds.stopSpeech();
                  setShowVoiceModal(false);
                }}
                className="w-8 h-8 rounded-xl bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2 max-h-[60vh] overflow-y-auto pr-1">
              {VOICE_PERSONAS.map((v) => {
                const isActive = sounds.activePersonaId === v.id;
                return (
                  <button
                    key={v.id}
                    onClick={() => {
                      sounds.stopSpeech();
                      sounds.setPersona(v.id);
                    }}
                    className={`w-full p-3 rounded-2xl border text-left transition-all cursor-pointer flex items-start justify-between ${
                      isActive
                        ? 'bg-amber-500/20 border-amber-400 shadow-md ring-1 ring-amber-400'
                        : 'bg-slate-950 border-slate-800 hover:border-slate-700 text-slate-300'
                    }`}
                  >
                    <div>
                      <div className="text-xs font-black text-amber-200">{v.label}</div>
                      <div className="text-[10px] text-slate-400 mt-0.5">{v.description}</div>
                    </div>
                    {isActive && (
                      <span className="text-[9px] font-black uppercase bg-amber-500 text-slate-950 px-2 py-0.5 rounded-full shrink-0">
                        Active
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            <button
              onClick={() => {
                sounds.speak('Hi there! Welcome back to Phonixia! Are you ready to read?');
                setShowVoiceModal(false);
              }}
              className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs uppercase tracking-wider shadow cursor-pointer"
            >
              Test Voice &amp; Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
