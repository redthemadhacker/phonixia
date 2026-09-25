import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useGame } from '../context/GameContext';
import { LandId } from '../types/character';
import { AvatarRenderer } from './AvatarRenderer';
import { sounds, VOICE_PERSONAS } from '../utils/audio';
import { 
  ArrowLeft, Star, Volume2, CheckCircle2, RotateCcw, 
  Footprints, Play, Lock, ArrowUp, ArrowDown, ArrowLeft as ArrowLeftIcon, 
  ArrowRight, Mic, X
} from 'lucide-react';

import shallowsBg from '../../sound.jpeg';
import buildersBg from '../../build.jpeg';
import trailsBg from '../../trails.jpeg';
import peaksBg from '../../peak.jpeg';
import empireBg from '../../empire.jpeg';

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
    { stationIndex: 5, name: 'Phoenix Eyrie', skillTitle: 'Multi-Syllable Peak Challenge', x: 74, y: 68, icon: '👑' },
  ],
  'lexicon-empire': [
    { stationIndex: 1, name: 'Colonnade of Time', skillTitle: 'Greek Root CHRON & BIO', x: 22, y: 32, icon: '🏛️' },
    { stationIndex: 2, name: 'Senate Archives', skillTitle: 'Greek Root GEO & TELE', x: 45, y: 24, icon: '📜' },
    { stationIndex: 3, name: 'Latin Pillar', skillTitle: 'Latin Root SPEC & PORT', x: 78, y: 30, icon: '🗿' },
    { stationIndex: 4, name: 'Affix Foundry', skillTitle: 'Prefixes & Suffixes', x: 32, y: 72, icon: '⚖️' },
    { stationIndex: 5, name: 'Golden Acropolis', skillTitle: 'Grand Etymology Mastery', x: 72, y: 66, icon: '👑' },
  ],
};

const LAND_CONFIG: Record<LandId, { name: string; bg: string; color: string }> = {
  'sound-shallows': { name: 'Sound Shallows', bg: shallowsBg, color: '#38bdf8' },
  'builders-guild': { name: 'Builders Guild', bg: buildersBg, color: '#fbbf24' },
  'tricky-trails': { name: 'Tricky Trails', bg: trailsBg, color: '#34d399' },
  'whispering-peaks': { name: 'Whispering Peaks', bg: peaksBg, color: '#818cf8' },
  'lexicon-empire': { name: 'Lexicon Empire', bg: empireBg, color: '#f59e0b' },
};

const GET_GAME_QUESTION = (landId: LandId, overallGameIndex: number): GameQuestion => {
  if (landId === 'sound-shallows') {
    const letters = ['B', 'M', 'S', 'T', 'P', 'F', 'R', 'D', 'C', 'N', 'L', 'G', 'H', 'J', 'W', 'Z'];
    const letter = letters[(overallGameIndex - 1) % letters.length];
    
    if (overallGameIndex <= 10) {
      return {
        instruction: 'Listen carefully! Which letter makes the sound?',
        targetSound: `/${letter.toLowerCase()}/`,
        soundCue: `Which letter makes the sound, /${letter.toLowerCase()}/?`,
        choices: [letter, 'A', 'O', 'T'].sort(() => Math.random() - 0.5),
        correct: letter,
        explanation: `Letter ${letter} makes the sound /${letter.toLowerCase()}/!`
      };
    } else if (overallGameIndex <= 20) {
      const rhymes = [
        { word: 'PAN', rh: 'FAN', dist: ['CAT', 'PIG', 'DOG'] },
        { word: 'BAT', rh: 'HAT', dist: ['SUN', 'CUP', 'LOG'] },
        { word: 'PIG', rh: 'WIG', dist: ['PEN', 'BED', 'RUN'] },
        { word: 'SUN', rh: 'RUN', dist: ['HOP', 'SIT', 'MAN'] },
      ];
      const r = rhymes[(overallGameIndex - 11) % rhymes.length];
      return {
        instruction: `Find the word that rhymes with ${r.word}:`,
        targetSound: r.word,
        soundCue: `Which word rhymes with ${r.word}?`,
        choices: [r.rh, ...r.dist].sort(() => Math.random() - 0.5),
        correct: r.rh,
        explanation: `${r.word} and ${r.rh} both rhyme!`
      };
    } else {
      const blends = [
        { blend: '/b/ /a/ /t/', word: 'BAT', dist: ['BET', 'BIT', 'BOT'] },
        { blend: '/s/ /u/ /n/', word: 'SUN', dist: ['SIN', 'SON', 'SAD'] },
        { blend: '/m/ /a/ /p/', word: 'MAP', dist: ['MOP', 'MUP', 'MAT'] },
      ];
      const b = blends[(overallGameIndex - 21) % blends.length];
      return {
        instruction: 'Blend these sounds together to form the word:',
        targetSound: b.blend,
        soundCue: `Blend these sounds: ${b.blend}. What word is it?`,
        choices: [b.word, ...b.dist].sort(() => Math.random() - 0.5),
        correct: b.word,
        explanation: `${b.blend} blends into the word ${b.word}!`
      };
    }
  }

  if (landId === 'builders-guild') {
    if (overallGameIndex <= 20) {
      const cvc = [
        { word: 'CAT', prompt: '/c/ /a/ /t/', dist: ['COT', 'CUT', 'CAR'] },
        { word: 'DOG', prompt: '/d/ /o/ /g/', dist: ['DIG', 'DUG', 'DOT'] },
        { word: 'BED', prompt: '/b/ /e/ /d/', dist: ['BAD', 'BUD', 'BAT'] },
      ];
      const c = cvc[(overallGameIndex - 1) % cvc.length];
      return {
        instruction: 'What word do these sounds build?',
        targetSound: c.prompt,
        soundCue: `What word does ${c.prompt} build?`,
        choices: [c.word, ...c.dist].sort(() => Math.random() - 0.5),
        correct: c.word,
        explanation: `${c.prompt} builds the word ${c.word}!`
      };
    } else {
      const digraphs = [
        { word: 'SHIP', target: 'SH', cue: '__IP (sails on ocean)', dist: ['CH', 'TH', 'WH'] },
        { word: 'CHIN', target: 'CH', cue: '__IN (on your face)', dist: ['SH', 'TH', 'PH'] },
        { word: 'THAT', target: 'TH', cue: '__AT (pointing over there)', dist: ['WH', 'CH', 'SH'] },
      ];
      const d = digraphs[(overallGameIndex - 21) % digraphs.length];
      return {
        instruction: 'Pick the correct digraph for the word:',
        targetSound: d.cue,
        soundCue: `Which digraph completes ${d.cue}?`,
        choices: [d.target, ...d.dist].sort(() => Math.random() - 0.5),
        correct: d.target,
        explanation: `${d.target} finishes the word ${d.word}!`
      };
    }
  }

  if (landId === 'tricky-trails') {
    if (overallGameIndex <= 20) {
      const sights = ['THE', 'AND', 'SAID', 'YOU', 'LOOK', 'COME', 'HAVE', 'THEY'];
      const s = sights[(overallGameIndex - 1) % sights.length];
      return {
        instruction: 'Read the tricky sight word:',
        targetSound: s,
        soundCue: `Can you spot the sight word: ${s}?`,
        choices: [s, s + 'E', 'NOT', 'SEE'].filter((v, i, a) => a.indexOf(v) === i).slice(0, 4).sort(() => Math.random() - 0.5),
        correct: s,
        explanation: `Great reading! "${s}" is an essential sight word.`
      };
    } else {
      const magicE = [
        { base: 'CAP', magic: 'CAPE', dist: ['COP', 'CUP', 'COPE'] },
        { base: 'PIN', magic: 'PINE', dist: ['PAN', 'PUN', 'PALE'] },
        { base: 'HOP', magic: 'HOPE', dist: ['HIP', 'HEAP', 'HYPE'] },
        { base: 'TUB', magic: 'TUBE', dist: ['TAB', 'TOE', 'TAIL'] },
      ];
      const m = magicE[(overallGameIndex - 21) % magicE.length];
      return {
        instruction: `Magic Silent E: Add 'e' to ${m.base}. What does it become?`,
        targetSound: `${m.base} + E`,
        soundCue: `Add silent E to ${m.base}. What does it make?`,
        choices: [m.magic, ...m.dist].sort(() => Math.random() - 0.5),
        correct: m.magic,
        explanation: `Silent E makes the vowel say its name: ${m.base} becomes ${m.magic}!`
      };
    }
  }

  if (landId === 'whispering-peaks') {
    const vowelTeams = [
      { word: 'BOAT', target: 'OA', cue: 'B - OA - T', dist: ['OE', 'OW', 'OO'] },
      { word: 'RAIN', target: 'AI', cue: 'R - AI - N', dist: ['AY', 'EA', 'EY'] },
      { word: 'MEAT', target: 'EA', cue: 'M - EA - T', dist: ['EE', 'EI', 'EY'] },
      { word: 'STAR', target: 'AR', cue: 'Bossy R: ST - AR', dist: ['OR', 'ER', 'IR'] },
    ];
    const vt = vowelTeams[(overallGameIndex - 1) % vowelTeams.length];
    return {
      instruction: `Identify the vowel sound pattern in the word:`,
      targetSound: vt.word,
      soundCue: `Which letters make the vowel sound in ${vt.word}?`,
      choices: [vt.target, ...vt.dist].sort(() => Math.random() - 0.5),
      correct: vt.target,
      explanation: `${vt.cue} uses '${vt.target}'!`
    };
  }

  const roots = [
    { root: 'CHRON', meaning: 'Time', example: 'Chronological', dist: ['Earth', 'Life', 'Sound'] },
    { root: 'BIO', meaning: 'Life', example: 'Biology', dist: ['Water', 'Time', 'Light'] },
    { root: 'GEO', meaning: 'Earth', example: 'Geology', dist: ['Sky', 'Life', 'Heat'] },
    { root: 'TELE', meaning: 'Far/Distant', example: 'Telescope', dist: ['Near', 'Small', 'Fast'] },
  ];
  const r = roots[(overallGameIndex - 1) % roots.length];
  return {
    instruction: `Root Analysis: What is the meaning of "${r.root}"?`,
    targetSound: `${r.root} (${r.example})`,
    soundCue: `The root is ${r.root}, as in ${r.example}. What does it mean?`,
    choices: [r.meaning, ...r.dist].sort(() => Math.random() - 0.5),
    correct: r.meaning,
    explanation: `The root "${r.root}" translates to "${r.meaning}"!`
  };
};

export const LandLevelView: React.FC<LandLevelViewProps> = ({ landId, onBackToWorld }) => {
  const { activeExplorer, updateExplorerScore, awardCurrency } = useGame();
  const config = LAND_CONFIG[landId] || LAND_CONFIG['sound-shallows'];
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

  const [showVoiceModal, setShowVoiceModal] = useState(false);

  const dirKeysRef = useRef({ up: false, down: false, left: false, right: false, shift: false });
  const [activeDpad, setActiveDpad] = useState({ up: false, down: false, left: false, right: false });
  const lastKeyTimeRef = useRef<number>(0);
  const requestRef = useRef<number | null>(null);
  const lastStepSoundTime = useRef<number>(0);
  const enterCooldown = useRef<number>(0);
  const lastEnteredStation = useRef<number | null>(null);

  // Immediately stop speech when unmounting or leaving this screen
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

  const isStationUnlocked = useCallback((stIndex: number): boolean => {
    return landProgress.completedGamesCount >= (stIndex - 1) * 10;
  }, [landProgress.completedGamesCount]);

  const triggerStationOpen = useCallback((station: StationNode) => {
    sounds.stopSpeech();
    if (isStationUnlocked(station.stationIndex)) {
      sounds.playSuccess();
      sounds.speak(`Welcome to ${station.name}! Complete each challenge to advance!`);
      setSelectedStation(station);
    } else {
      sounds.playError();
      sounds.speak(`This area is locked! Complete all challenges in the previous station first!`);
    }
  }, [isStationUnlocked]);

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

    setNearbyStation(closest);

    const now = Date.now();
    if (closest && minDistance < 4.2 && now > enterCooldown.current && !selectedStation && activeGameIndex === null) {
      const target = closest as StationNode;
      if (lastEnteredStation.current !== target.stationIndex) {
        lastEnteredStation.current = target.stationIndex;
        enterCooldown.current = now + 2000;
        triggerStationOpen(target);
      }
    } else if (!closest || minDistance > 7.5) {
      lastEnteredStation.current = null;
    }
  }, [stations, triggerStationOpen, selectedStation, activeGameIndex]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const k = e.key ? e.key.toLowerCase() : '';
      const code = e.code || '';
      let matched = false;

      if (k === 'arrowup' || k === 'up' || k === 'w' || code === 'ArrowUp' || code === 'KeyW') {
        dirKeysRef.current.up = true;
        setActiveDpad(prev => ({ ...prev, up: true }));
        matched = true;
      }
      if (k === 'arrowdown' || k === 'down' || k === 's' || code === 'ArrowDown' || code === 'KeyS') {
        dirKeysRef.current.down = true;
        setActiveDpad(prev => ({ ...prev, down: true }));
        matched = true;
      }
      if (k === 'arrowleft' || k === 'left' || k === 'a' || code === 'ArrowLeft' || code === 'KeyA') {
        dirKeysRef.current.left = true;
        setActiveDpad(prev => ({ ...prev, left: true }));
        matched = true;
      }
      if (k === 'arrowright' || k === 'right' || k === 'd' || code === 'ArrowRight' || code === 'KeyD') {
        dirKeysRef.current.right = true;
        setActiveDpad(prev => ({ ...prev, right: true }));
        matched = true;
      }
      if (k === 'shift' || code === 'ShiftLeft' || code === 'ShiftRight') {
        dirKeysRef.current.shift = true;
        matched = true;
      }

      if ((k === 'e' || k === ' ' || k === 'enter' || code === 'KeyE' || code === 'Space') && nearbyStation && !selectedStation && activeGameIndex === null) {
        matched = true;
        triggerStationOpen(nearbyStation);
      }

      if (matched) {
        targetPosRef.current = null;
        if (['arrowup', 'arrowdown', 'arrowleft', 'arrowright', 'space'].includes(k)) {
          e.preventDefault();
        }
        if (!lastKeyTimeRef.current) lastKeyTimeRef.current = performance.now();
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      const k = e.key ? e.key.toLowerCase() : '';
      const code = e.code || '';

      if (k === 'arrowup' || k === 'up' || k === 'w' || code === 'ArrowUp' || code === 'KeyW') {
        dirKeysRef.current.up = false;
        setActiveDpad(prev => ({ ...prev, up: false }));
      }
      if (k === 'arrowdown' || k === 'down' || k === 's' || code === 'ArrowDown' || code === 'KeyS') {
        dirKeysRef.current.down = false;
        setActiveDpad(prev => ({ ...prev, down: false }));
      }
      if (k === 'arrowleft' || k === 'left' || k === 'a' || code === 'ArrowLeft' || code === 'KeyA') {
        dirKeysRef.current.left = false;
        setActiveDpad(prev => ({ ...prev, left: false }));
      }
      if (k === 'arrowright' || k === 'right' || k === 'd' || code === 'ArrowRight' || code === 'KeyD') {
        dirKeysRef.current.right = false;
        setActiveDpad(prev => ({ ...prev, right: false }));
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

      const isHeld = lastKeyTimeRef.current > 0 && (currentTime - lastKeyTimeRef.current > 280);
      const running = isHeld || dirs.shift;
      setIsRunning(running);

      const baseSpeed = running ? 36 : 20;

      let newX = playerPosRef.current.x;
      let newY = playerPosRef.current.y;
      let moving = false;

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
    setActiveDpad(prev => ({ ...prev, [dir]: true }));
    if (!lastKeyTimeRef.current) lastKeyTimeRef.current = performance.now();
  };

  const handleDpadRelease = (dir: 'up' | 'down' | 'left' | 'right') => {
    dirKeysRef.current[dir] = false;
    setActiveDpad(prev => ({ ...prev, [dir]: false }));
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

    setTimeout(() => {
      sounds.speak(`${q.instruction} ${q.soundCue}`);
    }, 250);
  };

  const handleSelectChoice = (choice: string) => {
    if (!currentQuestion || isAnswered) return;
    sounds.stopSpeech();
    setSelectedAnswer(choice);
    setIsAnswered(true);

    const correct = choice.trim().toLowerCase() === currentQuestion.correct.trim().toLowerCase();
    setIsCorrect(correct);

    if (correct) {
      sounds.playSuccess();
      sounds.speak(`Awesome! ${currentQuestion.explanation}`);
    } else {
      sounds.playError();
      sounds.speak(`Not quite! The answer was ${currentQuestion.correct}.`);
      setEarnedStars((prev) => Math.max(1, prev - 1));
    }
  };

  const finishGameRound = () => {
    if (!activeGameIndex) return;
    sounds.stopSpeech();
    setRoundCompleted(true);
    sounds.playFanfare();

    const wasNext = activeGameIndex === landProgress.completedGamesCount + 1;
    updateExplorerScore(landId, wasNext ? 1 : 0, earnedStars);
    awardCurrency(15, 2);
  };

  return (
    <div
      ref={containerRef}
      tabIndex={0}
      onClick={() => containerRef.current?.focus()}
      className="relative w-full h-full flex flex-col justify-between select-none outline-none overflow-hidden"
    >
      {/* Top HUD */}
      <div className="absolute top-2 inset-x-2 sm:top-3 sm:inset-x-4 z-40 flex items-center justify-between pointer-events-none">
        <button
          onClick={() => {
            sounds.stopSpeech();
            sounds.playStep();
            onBackToWorld();
          }}
          className="pointer-events-auto px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl sm:rounded-2xl bg-slate-950/85 backdrop-blur-md hover:bg-slate-900 text-amber-300 border border-amber-500/70 text-xs font-black flex items-center gap-1.5 cursor-pointer shadow-xl transition-transform hover:scale-105 active:scale-95"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Citadel Map</span>
        </button>

        <div className="pointer-events-auto text-center bg-slate-950/85 backdrop-blur-md px-3 sm:px-4 py-1 sm:py-1.5 rounded-xl sm:rounded-2xl border border-amber-500/50 shadow-xl">
          <h2 className="text-xs sm:text-sm font-black text-amber-300 font-display uppercase tracking-wide">
            {config.name}
          </h2>
          <span className="text-[9px] sm:text-[10px] text-slate-400 font-mono font-bold">
            {landProgress.completedGamesCount} / 50 Completed
          </span>
        </div>

        <div className="pointer-events-auto flex items-center gap-2">
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

        {/* 5 Clean Landmark Stations on the Map */}
        {stations.map((st) => {
          const unlocked = isStationUnlocked(st.stationIndex);
          const completedInStation = Math.min(10, Math.max(0, landProgress.completedGamesCount - (st.stationIndex - 1) * 10));
          const isMastered = completedInStation >= 10;

          return (
            <div
              key={st.stationIndex}
              style={{ left: `${st.x}%`, top: `${st.y}%` }}
              onClick={(e) => {
                e.stopPropagation();
                triggerStationOpen(st);
              }}
              className="absolute z-10 -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-transform hover:scale-115 active:scale-95 group"
            >
              <div
                className={`relative px-3.5 py-2.5 rounded-2xl border-2 shadow-2xl flex flex-col items-center backdrop-blur-md transition-all ${
                  unlocked
                    ? 'bg-slate-950/90 border-amber-400 hover:border-amber-300'
                    : 'bg-slate-950/80 border-slate-800 opacity-60'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{st.icon}</span>
                  <div className="text-left">
                    <div className="text-xs font-black text-amber-300 leading-tight">
                      {st.name}
                    </div>
                    <div className="text-[10px] text-slate-400 font-medium">
                      {st.skillTitle}
                    </div>
                  </div>
                </div>

                <div className="mt-1.5 px-2.5 py-0.5 rounded-full bg-slate-900 border border-amber-500/40 text-[9px] font-bold text-amber-300 flex items-center gap-1">
                  {!unlocked ? (
                    <>
                      <Lock className="w-2.5 h-2.5 text-slate-400" />
                      <span>Locked</span>
                    </>
                  ) : isMastered ? (
                    <>
                      <CheckCircle2 className="w-2.5 h-2.5 text-emerald-400 stroke-[3]" />
                      <span className="text-emerald-300">Mastered</span>
                    </>
                  ) : (
                    <span>Ready</span>
                  )}
                </div>
              </div>
            </div>
          );
        })}

        {/* Player Avatar */}
        <div
          className="absolute z-30 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
          style={{ left: `${playerPos.x}%`, top: `${playerPos.y}%` }}
        >
          {targetPosRef.current && (
            <div className="absolute -inset-4 rounded-full border-2 border-amber-400 animate-ping opacity-40 pointer-events-none" />
          )}

          <div className="absolute -top-7 left-1/2 -translate-x-1/2 bg-slate-950/95 border border-amber-400/90 px-2 py-0.5 rounded-full shadow-xl whitespace-nowrap flex items-center gap-1">
            <span className="text-[10px] font-extrabold text-amber-300">{activeExplorer.name}</span>
            {isRunning && <span className="text-[8px] text-amber-400 font-black uppercase tracking-wider">Run</span>}
          </div>

          <AvatarRenderer
            customization={activeExplorer.customization}
            size={52}
            isWalking={isMoving}
            isRunning={isRunning}
            facing={facing}
            walkCycle={walkCycle}
            showPet={true}
          />
        </div>

        {/* On-Screen D-Pad */}
        <div
          onClick={(e) => e.stopPropagation()}
          className="absolute bottom-2 left-2 sm:bottom-4 sm:left-4 z-40 bg-slate-950/85 backdrop-blur-md p-1.5 rounded-xl sm:rounded-2xl border border-amber-600/50 shadow-2xl flex flex-col items-center gap-1 select-none pointer-events-auto"
        >
          <button
            onMouseDown={() => handleDpadPress('up')}
            onMouseUp={() => handleDpadRelease('up')}
            onTouchStart={() => handleDpadPress('up')}
            onTouchEnd={() => handleDpadRelease('up')}
            className={`w-7 h-7 sm:w-9 sm:h-9 rounded-lg flex items-center justify-center border transition-all ${
              activeDpad.up ? 'bg-amber-400 text-slate-950 border-amber-300' : 'bg-slate-900 text-amber-300 border-amber-500/40'
            }`}
          >
            <ArrowUp className="w-4 h-4 stroke-[2.5]" />
          </button>

          <div className="flex items-center gap-1">
            <button
              onMouseDown={() => handleDpadPress('left')}
              onMouseUp={() => handleDpadRelease('left')}
              onTouchStart={() => handleDpadPress('left')}
              onTouchEnd={() => handleDpadRelease('left')}
              className={`w-7 h-7 sm:w-9 sm:h-9 rounded-lg flex items-center justify-center border transition-all ${
                activeDpad.left ? 'bg-amber-400 text-slate-950 border-amber-300' : 'bg-slate-900 text-amber-300 border-amber-500/40'
              }`}
            >
              <ArrowLeftIcon className="w-4 h-4 stroke-[2.5]" />
            </button>

            <button
              onMouseDown={() => handleDpadPress('down')}
              onMouseUp={() => handleDpadRelease('down')}
              onTouchStart={() => handleDpadPress('down')}
              onTouchEnd={() => handleDpadRelease('down')}
              className={`w-7 h-7 sm:w-9 sm:h-9 rounded-lg flex items-center justify-center border transition-all ${
                activeDpad.down ? 'bg-amber-400 text-slate-950 border-amber-300' : 'bg-slate-900 text-amber-300 border-amber-500/40'
              }`}
            >
              <ArrowDown className="w-4 h-4 stroke-[2.5]" />
            </button>

            <button
              onMouseDown={() => handleDpadPress('right')}
              onMouseUp={() => handleDpadRelease('right')}
              onTouchStart={() => handleDpadPress('right')}
              onTouchEnd={() => handleDpadRelease('right')}
              className={`w-7 h-7 sm:w-9 sm:h-9 rounded-lg flex items-center justify-center border transition-all ${
                activeDpad.right ? 'bg-amber-400 text-slate-950 border-amber-300' : 'bg-slate-900 text-amber-300 border-amber-500/40'
              }`}
            >
              <ArrowRight className="w-4 h-4 stroke-[2.5]" />
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Proximity Station Bar */}
      <div className="p-2 sm:p-2.5 bg-slate-950/95 border-t border-amber-900/60 flex items-center justify-between gap-2 overflow-x-auto">
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

      {/* 1. STATION HUB MODAL: Sequential Mario Progression */}
      {selectedStation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/90 backdrop-blur-md animate-fade-in select-none">
          <div className="relative w-full max-w-lg bg-slate-900 border-2 border-amber-400 rounded-3xl p-5 sm:p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <span className="text-2xl">{selectedStation.icon}</span>
                <div>
                  <h3 className="text-sm font-black text-amber-300 uppercase tracking-wide">
                    {selectedStation.name}
                  </h3>
                  <p className="text-[11px] text-slate-400">{selectedStation.skillTitle} · Complete in Order to Advance</p>
                </div>
              </div>
              <button
                onClick={() => {
                  sounds.stopSpeech();
                  setSelectedStation(null);
                }}
                className="w-8 h-8 rounded-xl bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 max-h-[50vh] overflow-y-auto pr-1">
              {Array.from({ length: 10 }, (_, i) => {
                const gameNum = (selectedStation.stationIndex - 1) * 10 + (i + 1);
                const isCleared = landProgress.completedGamesCount >= gameNum;
                const isUnlocked = landProgress.completedGamesCount >= (gameNum - 1);

                return (
                  <button
                    key={gameNum}
                    disabled={!isUnlocked}
                    onClick={() => startPlayableGame(gameNum)}
                    className={`p-3 rounded-2xl border text-center flex flex-col items-center justify-center transition-all cursor-pointer ${
                      isCleared
                        ? 'bg-amber-500/20 border-amber-400 text-amber-300 shadow'
                        : isUnlocked
                        ? 'bg-slate-950 border-amber-500/70 text-slate-200 hover:border-amber-300 hover:scale-105'
                        : 'bg-slate-950 border-slate-800 text-slate-600 opacity-40 cursor-not-allowed'
                    }`}
                  >
                    <span className="text-lg font-black font-mono">
                      {isCleared ? '⭐' : isUnlocked ? '▶' : '🔒'}
                    </span>
                    <span className="text-[10px] font-black uppercase mt-1">
                      {isCleared ? 'Cleared' : isUnlocked ? 'Play' : 'Locked'}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* 2. ACTIVE PLAYABLE PHONICS GAME STAGE */}
      {activeGameIndex !== null && currentQuestion && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/90 backdrop-blur-md animate-fade-in select-none">
          <div className="relative w-full max-w-lg bg-slate-900 border-2 border-amber-400 rounded-3xl p-5 sm:p-7 text-center space-y-4 shadow-[0_0_50px_rgba(245,158,11,0.5)] animate-scale-up">
            
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <span className="text-xs font-mono font-bold text-amber-400 uppercase">
                {config.name} · Phonics Challenge
              </span>
              <div className="flex gap-1 text-amber-400">
                {Array.from({ length: 3 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`w-3.5 h-3.5 ${
                      i < earnedStars ? 'fill-amber-400 text-amber-400' : 'text-slate-600'
                    }`}
                  />
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <p className="text-xs sm:text-sm text-slate-300 font-medium">
                {currentQuestion.instruction}
              </p>

              <div className="inline-flex items-center gap-3 bg-amber-500/20 border-2 border-amber-400 px-5 py-2.5 rounded-2xl shadow-inner">
                <span className="text-2xl sm:text-3xl font-black text-amber-300 font-display tracking-widest">
                  {currentQuestion.targetSound}
                </span>
                <button
                  type="button"
                  onClick={() => sounds.speak(currentQuestion.soundCue)}
                  className="p-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 shadow cursor-pointer transition-transform hover:scale-110 active:scale-95"
                  title="Speak Cue"
                >
                  <Volume2 className="w-5 h-5 stroke-[2.5]" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              {currentQuestion.choices.map((choice) => {
                const isSelected = selectedAnswer === choice;
                let btnStyle = 'bg-slate-950 hover:bg-slate-800 border-slate-700 text-slate-200';

                if (isAnswered) {
                  if (choice.trim().toLowerCase() === currentQuestion.correct.trim().toLowerCase()) {
                    btnStyle = 'bg-emerald-600 border-emerald-400 text-white font-black scale-102 shadow-lg';
                  } else if (isSelected) {
                    btnStyle = 'bg-rose-900 border-rose-500 text-rose-200 opacity-80';
                  } else {
                    btnStyle = 'bg-slate-950 border-slate-800 text-slate-600 opacity-50';
                  }
                }

                return (
                  <button
                    key={choice}
                    onClick={() => handleSelectChoice(choice)}
                    disabled={isAnswered}
                    className={`py-3.5 sm:py-4 px-3 rounded-2xl border-2 text-base sm:text-lg font-black font-display tracking-wide shadow-md transition-all cursor-pointer flex items-center justify-center gap-2 ${btnStyle}`}
                  >
                    <span>{choice}</span>
                  </button>
                );
              })}
            </div>

            {isAnswered && (
              <div className="space-y-3 pt-2 animate-fade-in text-center">
                <p className={`text-xs font-bold ${isCorrect ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {currentQuestion.explanation}
                </p>

                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      sounds.stopSpeech();
                      startPlayableGame(activeGameIndex);
                    }}
                    className="flex-1 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Try Again</span>
                  </button>

                  <button
                    onClick={finishGameRound}
                    className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 text-slate-950 font-black text-xs uppercase tracking-wider shadow-xl flex items-center justify-center gap-1.5 cursor-pointer transition-transform hover:scale-105 active:scale-95"
                  >
                    <span>Finish Round</span>
                    <CheckCircle2 className="w-4 h-4 stroke-[3]" />
                  </button>
                </div>
              </div>
            )}

            {roundCompleted && (
              <div className="pt-2 animate-fade-in space-y-2 border-t border-slate-800">
                <div className="text-amber-400 font-black text-sm">
                  🎉 Challenge Passed! Next Challenge Unlocked!
                </div>
                <div className="flex justify-center gap-2">
                  <button
                    onClick={() => {
                      sounds.stopSpeech();
                      setActiveGameIndex(null);
                    }}
                    className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-bold cursor-pointer"
                  >
                    Return to Map
                  </button>
                  {activeGameIndex < 50 && (
                    <button
                      onClick={() => {
                        sounds.stopSpeech();
                        startPlayableGame(activeGameIndex + 1);
                      }}
                      className="px-5 py-2 rounded-xl bg-amber-500 text-slate-950 font-black text-xs uppercase tracking-wider shadow cursor-pointer"
                    >
                      Next Challenge →
                    </button>
                  )}
                </div>
              </div>
            )}
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
              Test Voice & Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};