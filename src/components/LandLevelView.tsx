import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useGame, getCompanionGuide } from '../context/GameContext';
import { LandId } from '../types/character';
import { AvatarRenderer } from './AvatarRenderer';
import { ActivePlayableStage } from './ActivePlayableStage';
import { sounds, VOICE_PERSONAS } from '../utils/audio';
import { 
  ArrowLeft, Star, Volume2, CheckCircle2, RotateCcw, 
  Footprints, Play, ArrowLeft as ArrowLeftIcon, 
  ArrowRight, Mic, X, ChevronsUp, Sparkles, Trophy, Heart, Flame, Shield
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
  missionTitle?: string;
  actionPrompt?: string;
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
    questLore: 'The Final Boss Battle! Storm the Obsidian Fortress of the Shadow King, shatter his dark energy shield, and rescue the Golden Phoenix!',
    mechanic: 'boss',
    icon: '🔥',
    skyGradient: 'from-purple-950 via-slate-950 to-rose-950',
    groundGradient: 'from-slate-950 via-purple-950 to-rose-950',
    groundBorder: 'border-rose-500',
    decor: ['🔥', '⚡', '👑', '🗿', '🔥'],
    blockBg: 'bg-gradient-to-b from-amber-300 via-rose-400 to-purple-600 text-slate-950',
    blockBorder: 'border-amber-300',
    blockShadow: 'shadow-[0_0_25px_rgba(244,63,94,0.7)]',
    jumpBtn: 'bg-gradient-to-r from-rose-500 via-amber-400 to-purple-600 text-slate-950 shadow-[0_0_25px_rgba(244,63,94,0.8)] hover:from-rose-400',
    jumpLabel: 'HERO STRIKE',
    jumpIconEmoji: '⚡',
    accentBadge: 'bg-rose-500/20 text-rose-300 border-rose-400/50',
    hudBg: 'border-rose-500/50'
  }
};

// Rich procedural question bank ensures NO TWO GAMES ARE THE SAME
const GET_GAME_QUESTION = (landId: LandId, overallGameIndex: number): GameQuestion => {
  const seed = (overallGameIndex * 37 + Math.floor(Date.now() / 60000)) % 1000;

  if (landId === 'sound-shallows') {
    const letters = ['B', 'M', 'S', 'T', 'P', 'F', 'R', 'D', 'C', 'N', 'L', 'G', 'H', 'J', 'W', 'Z'];
    const letter = letters[(overallGameIndex + seed) % letters.length];
    
    if (overallGameIndex <= 10) {
      const distractors = letters.filter(l => l !== letter).sort(() => Math.random() - 0.5).slice(0, 3);
      return {
        missionTitle: `Mission 1-${overallGameIndex}: Pearl Reef Trench`,
        actionPrompt: `Swim up to pop the /${letter.toLowerCase()}/ Sound Pearl!`,
        instruction: 'Listen carefully! Which letter makes this initial sound?',
        targetSound: `/${letter.toLowerCase()}/`,
        soundCue: `Which letter makes the sound, /${letter.toLowerCase()}/?`,
        choices: [letter, ...distractors].sort(() => Math.random() - 0.5),
        correct: letter,
        explanation: `Letter ${letter} makes the sound /${letter.toLowerCase()}/!`
      };
    } else if (overallGameIndex <= 20) {
      const rhymes = [
        { word: 'PAN', rh: 'FAN', dist: ['CAT', 'PIG', 'DOG'] },
        { word: 'BAT', rh: 'HAT', dist: ['SUN', 'CUP', 'LOG'] },
        { word: 'PIG', rh: 'WIG', dist: ['PEN', 'BED', 'RUN'] },
        { word: 'SUN', rh: 'RUN', dist: ['HOP', 'SIT', 'MAN'] },
        { word: 'HOP', rh: 'TOP', dist: ['BUG', 'MAP', 'BED'] },
        { word: 'BUG', rh: 'MUG', dist: ['FIN', 'POT', 'HEN'] },
        { word: 'CAT', rh: 'MAT', dist: ['FOX', 'LIP', 'BUS'] },
        { word: 'DOG', rh: 'LOG', dist: ['RAT', 'PIN', 'WEB'] },
        { word: 'NET', rh: 'WET', dist: ['CUP', 'MOP', 'FAN'] },
        { word: 'LIP', rh: 'TIP', dist: ['BAG', 'RUG', 'MUD'] },
      ];
      const r = rhymes[(overallGameIndex + seed) % rhymes.length];
      return {
        missionTitle: `Mission 2-${overallGameIndex - 10}: Clamshell Rhyme Cove`,
        actionPrompt: `Pop the rhyming pearl for ${r.word}!`,
        instruction: `Find the pearl that rhymes with ${r.word}:`,
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
        { blend: '/p/ /i/ /g/', word: 'PIG', dist: ['PUG', 'PEG', 'PIN'] },
        { blend: '/h/ /e/ /n/', word: 'HEN', dist: ['HAT', 'HOT', 'HUT'] },
        { blend: '/f/ /o/ /x/', word: 'FOX', dist: ['FIX', 'FAX', 'BOX'] },
        { blend: '/c/ /u/ /p/', word: 'CUP', dist: ['CAP', 'COP', 'CUT'] },
        { blend: '/r/ /e/ /d/', word: 'RED', dist: ['ROD', 'RAD', 'RID'] },
      ];
      const b = blends[(overallGameIndex + seed) % blends.length];
      return {
        missionTitle: `Mission 3-${overallGameIndex - 20}: Sunken Sound Lagoon`,
        actionPrompt: `Blend the phonemes and pop the target pearl!`,
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
        { word: 'PIG', prompt: '/p/ /i/ /g/', dist: ['PEG', 'PUG', 'PIN'] },
        { word: 'VAN', prompt: '/v/ /a/ /n/', dist: ['VON', 'VET', 'CAN'] },
        { word: 'FOX', prompt: '/f/ /o/ /x/', dist: ['FAX', 'FIX', 'BOX'] },
        { word: 'NET', prompt: '/n/ /e/ /t/', dist: ['NOT', 'NUT', 'PET'] },
        { word: 'ZIP', prompt: '/z/ /i/ /p/', dist: ['ZAP', 'LIP', 'TIP'] },
      ];
      const c = cvc[(overallGameIndex + seed) % cvc.length];
      return {
        missionTitle: `Mission 1-${overallGameIndex}: Quarry Forge Anvil`,
        actionPrompt: `Headbutt the Question Brick to forge the word!`,
        instruction: 'What word do these keystones build?',
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
        { word: 'WHALE', target: 'WH', cue: '__ALE (giant sea swimmer)', dist: ['SH', 'CH', 'TH'] },
        { word: 'FISH', target: 'SH', cue: 'FI__ (swims in pond)', dist: ['CH', 'TH', 'WH'] },
        { word: 'MUCH', target: 'CH', cue: 'MU__ (a lot of something)', dist: ['SH', 'TH', 'PH'] },
        { word: 'MOTH', target: 'TH', cue: 'MO__ (night winged insect)', dist: ['SH', 'CH', 'WH'] },
      ];
      const d = digraphs[(overallGameIndex + seed) % digraphs.length];
      return {
        missionTitle: `Mission 2-${overallGameIndex - 20}: Steam Gear Works`,
        actionPrompt: `Smash the masonry block to complete the digraph!`,
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
      const sights = [
        'THE', 'AND', 'SAID', 'YOU', 'LOOK', 'COME', 'HAVE', 'THEY', 
        'WERE', 'WHERE', 'WHAT', 'THERE', 'COULD', 'WOULD', 'SOME'
      ];
      const s = sights[(overallGameIndex + seed) % sights.length];
      const dist = sights.filter(w => w !== s).sort(() => Math.random() - 0.5).slice(0, 3);
      return {
        missionTitle: `Mission 1-${overallGameIndex}: Bramble Pit Trail`,
        actionPrompt: `Leap the vine pit to grab the Rune Pod!`,
        instruction: 'Read the tricky sight word:',
        targetSound: s,
        soundCue: `Can you spot the sight word: ${s}?`,
        choices: [s, ...dist].sort(() => Math.random() - 0.5),
        correct: s,
        explanation: `Great reading! "${s}" is an essential sight word.`
      };
    } else {
      const magicE = [
        { base: 'CAP', magic: 'CAPE', dist: ['COP', 'CUP', 'COPE'] },
        { base: 'PIN', magic: 'PINE', dist: ['PAN', 'PUN', 'PALE'] },
        { base: 'HOP', magic: 'HOPE', dist: ['HIP', 'HEAP', 'HYPE'] },
        { base: 'TUB', magic: 'TUBE', dist: ['TAB', 'TOE', 'TAIL'] },
        { base: 'KIT', magic: 'KITE', dist: ['KAT', 'KNOT', 'KEPT'] },
        { base: 'ROB', magic: 'ROBE', dist: ['RUB', 'RIB', 'ROOF'] },
        { base: 'NOT', magic: 'NOTE', dist: ['NUT', 'NET', 'NEAT'] },
      ];
      const m = magicE[(overallGameIndex + seed) % magicE.length];
      return {
        missionTitle: `Mission 2-${overallGameIndex - 20}: Magic Silent E Grove`,
        actionPrompt: `Snatch the magical Silent E fruit!`,
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
      { word: 'CORN', target: 'OR', cue: 'Bossy R: C - OR - N', dist: ['AR', 'UR', 'ER'] },
      { word: 'BIRD', target: 'IR', cue: 'Bossy R: B - IR - D', dist: ['AR', 'OR', 'UR'] },
      { word: 'TREE', target: 'EE', cue: 'Vowel Team: TR - EE', dist: ['EA', 'IE', 'EY'] },
      { word: 'GOAT', target: 'OA', cue: 'Vowel Team: G - OA - T', dist: ['OW', 'OU', 'OO'] },
    ];
    const vt = vowelTeams[(overallGameIndex + seed) % vowelTeams.length];
    return {
      missionTitle: `Mission ${overallGameIndex}: Frost Cloud Peak`,
      actionPrompt: `Bounce high off the clouds to shatter the Frost Crystal!`,
      instruction: `Identify the vowel sound pattern in the word:`,
      targetSound: vt.word,
      soundCue: `Which letters make the vowel sound in ${vt.word}?`,
      choices: [vt.target, ...vt.dist].sort(() => Math.random() - 0.5),
      correct: vt.target,
      explanation: `${vt.cue} uses '${vt.target}'!`
    };
  }

  // Lexicon Empire: Final Boss Showdown vs The Shadow King!
  const roots = [
    { root: 'CHRON', meaning: 'Time', example: 'Chronological', dist: ['Earth', 'Life', 'Sound'] },
    { root: 'BIO', meaning: 'Life', example: 'Biology', dist: ['Water', 'Time', 'Light'] },
    { root: 'GEO', meaning: 'Earth', example: 'Geology', dist: ['Sky', 'Life', 'Heat'] },
    { root: 'TELE', meaning: 'Far/Distant', example: 'Telescope', dist: ['Near', 'Small', 'Fast'] },
    { root: 'GRAPH', meaning: 'Write/Draw', example: 'Autograph', dist: ['Speak', 'Hear', 'Count'] },
    { root: 'PHON', meaning: 'Sound', example: 'Symphony', dist: ['Color', 'Shape', 'Taste'] },
    { root: 'SPEC', meaning: 'Look/See', example: 'Inspect', dist: ['Touch', 'Smell', 'Move'] },
    { root: 'PORT', meaning: 'Carry', example: 'Transport', dist: ['Break', 'Throw', 'Build'] },
  ];
  const r = roots[(overallGameIndex + seed) % roots.length];
  return {
    missionTitle: `Boss Showdown ${overallGameIndex}: Magma Citadel of the Shadow King`,
    actionPrompt: `Heroic Strike! Hit the Royal Obelisk to shatter the Shadow King's cage!`,
    instruction: `Shadow King's Barrier: What is the linguistic power of "${r.root}"?`,
    targetSound: `${r.root} (${r.example})`,
    soundCue: `The root is ${r.root}, as in ${r.example}. What does it mean?`,
    choices: [r.meaning, ...r.dist].sort(() => Math.random() - 0.5),
    correct: r.meaning,
    explanation: `The root "${r.root}" translates to "${r.meaning}"! You damaged the Shadow King!`
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

  // Shadow King Boss Barrier (for Land 5)
  const [bossBarrierHp, setBossBarrierHp] = useState<number>(100);

  const [showVoiceModal, setShowVoiceModal] = useState(false);

  // Jump physics on land map
  const [jumpOffset, setJumpOffset] = useState<number>(0);
  const [isJumping, setIsJumping] = useState<boolean>(false);

  // Refs for callbacks to prevent stale closures in event listeners
  const triggerMapJumpRef = useRef<() => void>(() => {});
  const handleSelectChoiceRef = useRef<(choice: string) => void>(() => {});

  const handleSelectChoice = useCallback((choice: string) => {
    if (!currentQuestion || isAnswered) return;
    sounds.stopSpeech();
    setSelectedAnswer(choice);
    setIsAnswered(true);

    const correct = choice.trim().toLowerCase() === currentQuestion.correct.trim().toLowerCase();
    setIsCorrect(correct);

    if (correct) {
      sounds.playSuccess();
      sounds.speak(`Awesome! ${currentQuestion.explanation}`);
      if (theme.mechanic === 'boss') {
        setBossBarrierHp((prev) => Math.max(0, prev - 25));
      }
    } else {
      sounds.speak('Not quite! Listen closely to the sound and try again!');
      setEarnedStars((prev) => Math.max(1, prev - 1));

      // Screen damage flash
      setScreenDamageFlash(true);
      setTimeout(() => setScreenDamageFlash(false), 400);

      // Mario Lives System: 1 wrong answer = 1 heart lost!
      setRealmLives((prev) => {
        const next = prev - 1;
        if (next <= 0) {
          // Character death animation!
          setIsCharacterDying(true);
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
  }, [currentQuestion, isAnswered, theme.mechanic]);

  handleSelectChoiceRef.current = handleSelectChoice;

  const handleGameOverRestart = () => {
    restartLandProgress(landId);
    setRealmLives(3);
    setIsGameOver(false);
    setIsCharacterDying(false);
    setActiveGameIndex(null);
    setCurrentQuestion(null);
    setSelectedStation(null);
    setSelectedAnswer(null);
    setIsAnswered(false);
    setIsCorrect(false);
    setRoundCompleted(false);
    setEarnedStars(3);
    setBossBarrierHp(100);
    setPlayerPos({ x: stations[0].x, y: stations[0].y + 5 });
    playerPosRef.current = { x: stations[0].x, y: stations[0].y + 5 };
    sounds.playFanfare();
    sounds.speak(`Restarting ${config.name} from Level 1! Jump into action!`);
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

  // Global Keyboard event handling (Uses Refs to avoid stale closures!)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (activeGameIndex !== null) return;
      const k = e.key ? e.key.toLowerCase() : '';
      const code = e.code || '';
      let matched = false;

      // Space bar, Tab, W, ArrowUp jump action
      if (k === ' ' || k === 'tab' || k === 'w' || k === 'arrowup' || code === 'Space' || code === 'Tab' || code === 'KeyW' || code === 'ArrowUp') {
        e.preventDefault();
        matched = true;
        triggerMapJumpRef.current();
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
      const baseSpeed = running ? 26 : 14;

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

    setTimeout(() => {
      sounds.speak(`${q.instruction} ${q.soundCue}`);
    }, 250);
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
            sounds.playStep();
            onBackToWorld();
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
                    <span className="text-xs font-black text-amber-300 tracking-wide block uppercase">
                      {st.name}
                    </span>
                    <span className="text-[10px] text-slate-300 font-bold block">
                      {st.skillTitle}
                    </span>
                  </div>
                </div>

                {/* Stars / Clear Status badge */}
                <div className="mt-1.5 flex items-center gap-1.5">
                  <span className={`text-[10px] font-mono font-bold px-2 py-0.2 rounded-full ${
                    isMastered
                      ? 'bg-amber-400 text-slate-950 font-black'
                      : unlocked
                      ? 'bg-slate-800 text-amber-300 border border-amber-500/40'
                      : 'bg-slate-900 text-slate-500'
                  }`}>
                    {completedInStation} / 10
                  </span>
                  {isMastered && <span className="text-xs">⭐</span>}
                </div>
              </div>
            </div>
          );
        })}

        {/* Traveling Companion Guide (Kam or Celine) on Map */}
        <div
          style={{
            left: `${playerPos.x - (facing === 'left' ? -3.5 : 3.5)}%`,
            top: `${playerPos.y - jumpOffset * 0.2}%`,
            transform: `translate(-50%, -50%) ${facing === 'left' ? 'scaleX(-1)' : 'scaleX(1)'}`,
          }}
          className="absolute z-19 pointer-events-none transition-transform duration-75 flex flex-col items-center"
        >
          <div className="absolute -top-5 left-1/2 -translate-x-1/2 bg-slate-950/90 border border-amber-400/60 px-1.5 py-0.2 rounded-full shadow whitespace-nowrap">
            <span className="text-[9px] font-bold text-amber-200">{companionGuide.name}</span>
          </div>
          <AvatarRenderer customization={companionGuide.customization} size={38} showPet={false} />
        </div>

        {/* Active Player Avatar on Map */}
        <div
          style={{
            left: `${playerPos.x}%`,
            top: `${playerPos.y - jumpOffset * 0.2}%`,
            transform: `translate(-50%, -50%) ${facing === 'left' ? 'scaleX(-1)' : 'scaleX(1)'}`,
          }}
          className="absolute z-20 pointer-events-none transition-transform duration-75 flex flex-col items-center"
        >
          <div className="absolute -top-5 left-1/2 -translate-x-1/2 bg-slate-950/90 border border-amber-400/60 px-2 py-0.2 rounded-full shadow whitespace-nowrap">
            <span className="text-[9px] font-black text-amber-300">{activeExplorer.name}</span>
          </div>
          <AvatarRenderer customization={activeExplorer.customization} size={46} showPet={true} />
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
          onNextLevel={() => startPlayableGame(activeGameIndex + 1)}
          onClose={() => {
            sounds.stopSpeech();
            setActiveGameIndex(null);
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
