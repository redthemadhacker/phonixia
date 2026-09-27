import React, { createContext, useContext, useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { Account, ExplorerProfile, LandId } from '../types/character';

export const LAND_ORDER: LandId[] = [
  'sound-shallows',
  'builders-guild',
  'tricky-trails',
  'whispering-peaks',
  'lexicon-empire',
];

export const isLandUnlocked = (
  arg1import { LandId } from '../types/character';

export interface MinigameItem {
  id: string;
  hub: 'isles-of-play' | 'shellshore-arcade';
  title: string;
  icon: string;
  gameType: string;
  prompt: string;
  targetSoundOrWord: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
  scoreReimport { LandId } from '../types/character';

export interface MinigameItem {
  id: string;
  hub: 'isles-of-play' | 'shellshore-arcade';
  title: string;
  icon: string;
  gameType: string;
  prompt: string;
  targetSoundOrWord: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
  scoreReward: number;
}

// 25 Interactive Minigames:
// Isles of Play (Games 1-13: foundational phonics, rhyming, letter hunt, CVC pops)
// Shellshore Arcade (Games 14-25: advanced vowel teams, silent letters, root chemistry, rule trivia)
export const ALL_MINIGAMES: MinigameItem[] = [
  // --- ISLES OF PLAY (13 Games) ---
  {
    id: 'iop-1',
    hub: 'isles-of-play',
    title: 'Phoneme Bubble Pop: /sh/',
    icon: '🫧',
    gameType: 'BUBBLE_POP',
    prompt: 'Pop the bubble making the hushed /sh/ sound as in "ship"!',
    targetSoundOrWord: 'sh',
    options: ['sh', 'ch', 'th', 'wh'],
    correctAnswer: 'sh',
    explanation: 'S and H combine to make the gentle /sh/ sound!',
    scoreReward: 50
  },
  {
    id: 'iop-2',
    hub: 'isles-of-play',
    title: 'Word Blast Miner: CVC',
    icon: '⛏️',
    gameType: 'WORD_MINE',
    prompt: 'Mine the letter block that completes: C - A - ?',
    targetSoundOrWord: 'T',
    options: ['T', 'M', 'P', 'B'],
    correctAnswer: 'T',
    explanation: 'C + A + T forms the word "CAT"!',
    scoreReward: 60
  },
  {
    id: 'iop-3',
    hub: 'isles-of-play',
    title: 'Rhyme River Splash: -AT',
    icon: '🛶',
    gameType: 'RHYME_RUSH',
    prompt: 'Which creature swimming down the river rhymes with "bat"?',
    targetSoundOrWord: 'cat',
    options: ['cat', 'dog', 'pig', 'fox'],
    correctAnswer: 'cat',
    explanation: 'Bat and cat both belong to the -at family!',
    scoreReward: 50
  },
  {
    id: 'iop-4',
    hub: 'isles-of-play',
    title: 'Syllable Drum Beat',
    icon: '🥁',
    gameType: 'SYLLABLE_TAP',
    prompt: 'How many syllable beats do you hear in "BUTTERFLY"?',
    targetSoundOrWord: 'butterfly',
    options: ['1', '2', '3', '4'],
    correctAnswer: '3',
    explanation: 'But-ter-fly has 3 claps or beats!',
    scoreReward: 60
  },
  {
    id: 'iop-5',
    hub: 'isles-of-play',
    title: 'Vowel Lilypad Jump',
    icon: '🐸',
    gameType: 'LILYPAD_JUMP',
    prompt: 'Jump onto the lilypad with the short /o/ sound like "hop"!',
    targetSoundOrWord: 'hop',
    options: ['hop', 'hip', 'heap', 'hope'],
    correctAnswer: 'hop',
    explanation: 'Hop has the pure short O sound!',
    scoreReward: 50
  },
  {
    id: 'iop-6',
    hub: 'isles-of-play',
    title: 'Letter Balloon Dart: /ch/',
    icon: '🎈',
    gameType: 'BALLOON_DART',
    prompt: 'Pop the balloon that begins the word "cheese"!',
    targetSoundOrWord: 'ch',
    options: ['ch', 'sh', 'th', 'ph'],
    correctAnswer: 'ch',
    explanation: 'CH makes the energetic /ch/ sound!',
    scoreReward: 50
  },
  {
    id: 'iop-7',
    hub: 'isles-of-play',
    title: 'Sandcastle Builder: Digraph CK',
    icon: '🏰',
    gameType: 'SANDCASTLE_BUILD',
    prompt: 'Which word places CK directly after a short vowel?',
    targetSoundOrWord: 'duck',
    options: ['duck', 'duk', 'ducc', 'dukk'],
    correctAnswer: 'duck',
    explanation: 'CK comes right after a single short vowel in 1-syllable words!',
    scoreReward: 70
  },
  {
    id: 'iop-8',
    hub: 'isles-of-play',
    title: 'Seashell Sound Catcher',
    icon: '🐚',
    gameType: 'SHELL_CATCH',
    prompt: 'Catch the shell with the initial sound /b/ as in "bear"!',
    targetSoundOrWord: 'b',
    options: ['b', 'd', 'p', 'q'],
    correctAnswer: 'b',
    explanation: 'B has its belly in front: /b/ for bear!',
    scoreReward: 50
  },
  {
    id: 'iop-9',
    hub: 'isles-of-play',
    title: 'Magic E Meadow Wand',
    icon: '🪄',
    gameType: 'MAGIC_E_WAND',
    prompt: 'Wave your wand! Turn "kit" into a high flying toy:',
    targetSoundOrWord: 'kite',
    options: ['kite', 'kate', 'kote', 'kute'],
    correctAnswer: 'kite',
    explanation: 'Magic E makes I say its name: kit becomes kite!',
    scoreReward: 70
  },
  {
    id: 'iop-10',
    hub: 'isles-of-play',
    title: 'Sound Shinkansen Train',
    icon: '🚂',
    gameType: 'TRAIN_COUPLER',
    prompt: 'Couple the engine /s/ with /un/ to make:',
    targetSoundOrWord: 'sun',
    options: ['sun', 'son', 'sin', 'san'],
    correctAnswer: 'sun',
    explanation: 'S + U + N spells sun!',
    scoreReward: 50
  },
  {
    id: 'iop-11',
    hub: 'isles-of-play',
    title: 'Treasure Chest Code: Blend ST',
    icon: '🪙',
    gameType: 'CHEST_CRACK',
    prompt: 'Which word begins with the consonant blend /st/?',
    targetSoundOrWord: 'star',
    options: ['star', 'tar', 'scar', 'car'],
    correctAnswer: 'star',
    explanation: 'S and T blend seamlessly into /st/!',
    scoreReward: 60
  },
  {
    id: 'iop-12',
    hub: 'isles-of-play',
    title: 'Coconut Tree Drop',
    icon: '🌴',
    gameType: 'COCONUT_DROP',
    prompt: 'Which coconut matches the ending sound in "jump"?',
    targetSoundOrWord: 'mp',
    options: ['mp', 'nt', 'nk', 'nd'],
    correctAnswer: 'mp',
    explanation: 'J-U-M-P ends in the nasal blend /mp/!',
    scoreReward: 60
  },
  {
    id: 'iop-13',
    hub: 'isles-of-play',
    title: 'Campfire Rhyme Marshmallow',
    icon: '🏕️',
    gameType: 'CAMPFIRE_ROAST',
    prompt: 'Toast the marshmallow that rhymes with "light"!',
    targetSoundOrWord: 'bright',
    options: ['bright', 'late', 'lot', 'loot'],
    correctAnswer: 'bright',
    explanation: 'Light and bright both rhyme with -ight!',
    scoreReward: 70
  },

  // --- SHELLSHORE ARCADE (12 Games) ---
  {
    id: 'ssa-14',
    hub: 'shellshore-arcade',
    title: 'Pearl Diver Memory Match',
    icon: '🦪',
    gameType: 'PEARL_MATCH',
    prompt: 'Find the partner pearl for the diphthong OI in "coin"!',
    targetSoundOrWord: 'oy',
    options: ['oy', 'ai', 'ee', 'ou'],
    correctAnswer: 'oy',
    explanation: 'OI and OY are diphthong partners (coin / toy)!',
    scoreReward: 80
  },
  {
    id: 'ssa-15',
    hub: 'shellshore-arcade',
    title: 'Claw Crane: Missing Vowel Team',
    icon: '🕹️',
    gameType: 'CLAW_CRANE',
    prompt: 'Drop the claw onto the vowel team that spells "boat":',
    targetSoundOrWord: 'oa',
    options: ['oa', 'oe', 'ow', 'oo'],
    correctAnswer: 'oa',
    explanation: 'B-OA-T uses OA in the middle of a syllable!',
    scoreReward: 90
  },
  {
    id: 'ssa-16',
    hub: 'shellshore-arcade',
    title: 'Pinball Bumper: Silent Letters',
    icon: '🎰',
    gameType: 'PINBALL_BOUNCE',
    prompt: 'Hit the bumper with the silent K:',
    targetSoundOrWord: 'knight',
    options: ['knight', 'kite', 'king', 'koala'],
    correctAnswer: 'knight',
    explanation: 'Knight has a silent K before N!',
    scoreReward: 90
  },
  {
    id: 'ssa-17',
    hub: 'shellshore-arcade',
    title: 'Whack-A-Sound: Bossy R',
    icon: '🔨',
    gameType: 'WHACK_A_SOUND',
    prompt: 'Whack the mole making the /ar/ sound as in "star"!',
    targetSoundOrWord: 'spark',
    options: ['spark', 'speak', 'spoke', 'speck'],
    correctAnswer: 'spark',
    explanation: 'Bossy R makes AR shout /ar/!',
    scoreReward: 85
  },
  {
    id: 'ssa-18',
    hub: 'shellshore-arcade',
    title: 'The "I Before E" Rule Chamber',
    icon: '⚖️',
    gameType: 'RULE_CHAMBER',
    prompt: 'Spell the word for a person who steals (after TH, not C):',
    targetSoundOrWord: 'thief',
    options: ['thief', 'theif', 'thefe', 'thife'],
    correctAnswer: 'thief',
    explanation: 'I before E except after C: thief follows the standard rule!',
    scoreReward: 100
  },
  {
    id: 'ssa-19',
    hub: 'shellshore-arcade',
    title: 'Greek Root Reactor: PHON',
    icon: '⚡',
    gameType: 'ROOT_REACTOR',
    prompt: 'The Greek root "PHON" means:',
    targetSoundOrWord: 'sound / voice',
    options: ['sound / voice', 'light', 'earth', 'time'],
    correctAnswer: 'sound / voice',
    explanation: 'Phon means sound or voice, as in phonics and telephone!',
    scoreReward: 100
  },
  {
    id: 'ssa-20',
    hub: 'shellshore-arcade',
    title: 'Latin Stem Vault: STRUCT',
    icon: '🏛️',
    gameType: 'STEM_VAULT',
    prompt: 'The Latin root "STRUCT" in construction means:',
    targetSoundOrWord: 'to build',
    options: ['to build', 'to break', 'to speak', 'to throw'],
    correctAnswer: 'to build',
    explanation: 'Struct means to build, as in construct, structure, instruct!',
    scoreReward: 100
  },
  {
    id: 'ssa-21',
    hub: 'shellshore-arcade',
    title: 'Prefix Accelerator: DIS-',
    icon: '🚀',
    gameType: 'PREFIX_BOOST',
    prompt: 'Adding the prefix DIS- to "connect" creates a word meaning:',
    targetSoundOrWord: 'separate / break connection',
    options: ['separate / break connection', 'connect again', 'connect well', 'connect slowly'],
    correctAnswer: 'separate / break connection',
    explanation: 'Dis- indicates negation, reversal, or separation!',
    scoreReward: 90
  },
  {
    id: 'ssa-22',
    hub: 'shellshore-arcade',
    title: 'Neon Syllable Slicer: VCCV',
    icon: '⚔️',
    gameType: 'SYLLABLE_SLICE',
    prompt: 'Where do you slice the consonants in the word "RABBIT"?',
    targetSoundOrWord: 'rab - bit',
    options: ['rab - bit', 'ra - bbit', 'rabb - it', 'r - abbit'],
    correctAnswer: 'rab - bit',
    explanation: 'VCCV division rule: split neatly between the double consonants!',
    scoreReward: 90
  },
  {
    id: 'ssa-23',
    hub: 'shellshore-arcade',
    title: 'Retro Rhythm: Homophone Duels',
    icon: '🎵',
    gameType: 'HOMOPHONE_DUEL',
    prompt: 'Which word means a story or narrative (not the appendage of an animal)?',
    targetSoundOrWord: 'tale',
    options: ['tale', 'tail', 'tael', 'teal'],
    correctAnswer: 'tale',
    explanation: 'A tale is a story; a tail is on a fox or dog!',
    scoreReward: 95
  },
  {
    id: 'ssa-24',
    hub: 'shellshore-arcade',
    title: 'Morphology Matrix: -TION vs -SION',
    icon: '🔮',
    gameType: 'MORPH_MATRIX',
    prompt: 'Which word correctly uses -SION after the consonant S?',
    targetSoundOrWord: 'mission',
    options: ['mission', 'mition', 'mishun', 'missian'],
    correctAnswer: 'mission',
    explanation: 'Double SS takes -ION to form -ssion as in mission!',
    scoreReward: 100
  },
  {
    id: 'ssa-25',
    hub: 'shellshore-arcade',
    title: 'Grand High Scholar Etymology Crucible',
    icon: '👑',
    gameType: 'CRUCIBLE',
    prompt: 'Break down "CHRONOLOGY": Chron (Time) + Logy means:',
    targetSoundOrWord: 'The study of time order',
    options: ['The study of time order', 'A musical clock', 'Writing quickly', 'A stone building'],
    correctAnswer: 'The study of time order',
    explanation: 'Chron (time) + logy (study of) = the science of arranging events in order of occurrence!',
    scoreReward: 120
  }
];ward: number;
}

// 25 Interactive Minigames:
// Isles of Play (Games 1-13: foundational phonics, rhyming, letter hunt, CVC pops)
// Shellshore Arcade (Games 14-25: advanced vowel teams, silent letters, root chemistry, rule trivia)
export const ALL_MINIGAMES: MinigameItem[] = [
  // --- ISLES OF PLAY (13 Games) ---
  {
    id: 'iop-1',
    hub: 'isles-of-play',
    title: 'Phoneme Bubble Pop: /sh/',
    icon: '🫧',
    gameType: 'BUBBLE_POP',
    prompt: 'Pop the bubble making the hushed /sh/ sound as in "ship"!',
    targetSoundOrWord: 'sh',
    options: ['sh', 'ch', 'th', 'wh'],
    correctAnswer: 'sh',
    explanation: 'S and H combine to make the gentle /sh/ sound!',
    scoreReward: 50
  },
  {
    id: 'iop-2',
    hub: 'isles-of-play',
    title: 'Word Blast Miner: CVC',
    icon: '⛏️',
    gameType: 'WORD_MINE',
    prompt: 'Mine the letter block that completes: C - A - ?',
    targetSoundOrWord: 'T',
    options: ['T', 'M', 'P', 'B'],
    correctAnswer: 'T',
    explanation: 'C + A + T forms the word "CAT"!',
    scoreReward: 60
  },
  {
    id: 'iop-3',
    hub: 'isles-of-play',
    title: 'Rhyme River Splash: -AT',
    icon: '🛶',
    gameType: 'RHYME_RUSH',
    prompt: 'Which creature swimming down the river rhymes with "bat"?',
    targetSoundOrWord: 'cat',
    options: ['cat', 'dog', 'pig', 'fox'],
    correctAnswer: 'cat',
    explanation: 'Bat and cat both belong to the -at family!',
    scoreReward: 50
  },
  {
    id: 'iop-4',
    hub: 'isles-of-play',
    title: 'Syllable Drum Beat',
    icon: '🥁',
    gameType: 'SYLLABLE_TAP',
    prompt: 'How many syllable beats do you hear in "BUTTERFLY"?',
    targetSoundOrWord: 'butterfly',
    options: ['1', '2', '3', '4'],
    correctAnswer: '3',
    explanation: 'But-ter-fly has 3 claps or beats!',
    scoreReward: 60
  },
  {
    id: 'iop-5',
    hub: 'isles-of-play',
    title: 'Vowel Lilypad Jump',
    icon: '🐸',
    gameType: 'LILYPAD_JUMP',
    prompt: 'Jump onto the lilypad with the short /o/ sound like "hop"!',
    targetSoundOrWord: 'hop',
    options: ['hop', 'hip', 'heap', 'hope'],
    correctAnswer: 'hop',
    explanation: 'Hop has the pure short O sound!',
    scoreReward: 50
  },
  {
    id: 'iop-6',
    hub: 'isles-of-play',
    title: 'Letter Balloon Dart: /ch/',
    icon: '🎈',
    gameType: 'BALLOON_DART',
    prompt: 'Pop the balloon that begins the word "cheese"!',
    targetSoundOrWord: 'ch',
    options: ['ch', 'sh', 'th', 'ph'],
    correctAnswer: 'ch',
    explanation: 'CH makes the energetic /ch/ sound!',
    scoreReward: 50
  },
  {
    id: 'iop-7',
    hub: 'isles-of-play',
    title: 'Sandcastle Builder: Digraph CK',
    icon: '🏰',
    gameType: 'SANDCASTLE_BUILD',
    prompt: 'Which word places CK directly after a short vowel?',
    targetSoundOrWord: 'duck',
    options: ['duck', 'duk', 'ducc', 'dukk'],
    correctAnswer: 'duck',
    explanation: 'CK comes right after a single short vowel in 1-syllable words!',
    scoreReward: 70
  },
  {
    id: 'iop-8',
    hub: 'isles-of-play',
    title: 'Seashell Sound Catcher',
    icon: '🐚',
    gameType: 'SHELL_CATCH',
    prompt: 'Catch the shell with the initial sound /b/ as in "bear"!',
    targetSoundOrWord: 'b',
    options: ['b', 'd', 'p', 'q'],
    correctAnswer: 'b',
    explanation: 'B has its belly in front: /b/ for bear!',
    scoreReward: 50
  },
  {
    id: 'iop-9',
    hub: 'isles-of-play',
    title: 'Magic E Meadow Wand',
    icon: '🪄',
    gameType: 'MAGIC_E_WAND',
    prompt: 'Wave your wand! Turn "kit" into a high flying toy:',
    targetSoundOrWord: 'kite',
    options: ['kite', 'kate', 'kote', 'kute'],
    correctAnswer: 'kite',
    explanation: 'Magic E makes I say its name: kit becomes kite!',
    scoreReward: 70
  },
  {
    id: 'iop-10',
    hub: 'isles-of-play',
    title: 'Sound Shinkansen Train',
    icon: '🚂',
    gameType: 'TRAIN_COUPLER',
    prompt: 'Couple the engine /s/ with /un/ to make:',
    targetSoundOrWord: 'sun',
    options: ['sun', 'son', 'sin', 'san'],
    correctAnswer: 'sun',
    explanation: 'S + U + N spells sun!',
    scoreReward: 50
  },
  {
    id: 'iop-11',
    hub: 'isles-of-play',
    title: 'Treasure Chest Code: Blend ST',
    icon: '🪙',
    gameType: 'CHEST_CRACK',
    prompt: 'Which word begins with the consonant blend /st/?',
    targetSoundOrWord: 'star',
    options: ['star', 'tar', 'scar', 'car'],
    correctAnswer: 'star',
    explanation: 'S and T blend seamlessly into /st/!',
    scoreReward: 60
  },
  {
    id: 'iop-12',
    hub: 'isles-of-play',
    title: 'Coconut Tree Drop',
    icon: '🌴',
    gameType: 'COCONUT_DROP',
    prompt: 'Which coconut matches the ending sound in "jump"?',
    targetSoundOrWord: 'mp',
    options: ['mp', 'nt', 'nk', 'nd'],
    correctAnswer: 'mp',
    explanation: 'J-U-M-P ends in the nasal blend /mp/!',
    scoreReward: 60
  },
  {
    id: 'iop-13',
    hub: 'isles-of-play',
    title: 'Campfire Rhyme Marshmallow',
    icon: '🏕️',
    gameType: 'CAMPFIRE_ROAST',
    prompt: 'Toast the marshmallow that rhymes with "light"!',
    targetSoundOrWord: 'bright',
    options: ['bright', 'late', 'lot', 'loot'],
    correctAnswer: 'bright',
    explanation: 'Light and bright both rhyme with -ight!',
    scoreReward: 70
  },

  // --- SHELLSHORE ARCADE (12 Games) ---
  {
    id: 'ssa-14',
    hub: 'shellshore-arcade',
    title: 'Pearl Diver Memory Match',
    icon: '🦪',
    gameType: 'PEARL_MATCH',
    prompt: 'Find the partner pearl for the diphthong OI in "coin"!',
    targetSoundOrWord: 'oy',
    options: ['oy', 'ai', 'ee', 'ou'],
    correctAnswer: 'oy',
    explanation: 'OI and OY are diphthong partners (coin / toy)!',
    scoreReward: 80
  },
  {
    id: 'ssa-15',
    hub: 'shellshore-arcade',
    title: 'Claw Crane: Missing Vowel Team',
    icon: '🕹️',
    gameType: 'CLAW_CRANE',
    prompt: 'Drop the claw onto the vowel team that spells "boat":',
    targetSoundOrWord: 'oa',
    options: ['oa', 'oe', 'ow', 'oo'],
    correctAnswer: 'oa',
    explanation: 'B-OA-T uses OA in the middle of a syllable!',
    scoreReward: 90
  },
  {
    id: 'ssa-16',
    hub: 'shellshore-arcade',
    title: 'Pinball Bumper: Silent Letters',
    icon: '🎰',
    gameType: 'PINBALL_BOUNCE',
    prompt: 'Hit the bumper with the silent K:',
    targetSoundOrWord: 'knight',
    options: ['knight', 'kite', 'king', 'koala'],
    correctAnswer: 'knight',
    explanation: 'Knight has a silent K before N!',
    scoreReward: 90
  },
  {
    id: 'ssa-17',
    hub: 'shellshore-arcade',
    title: 'Whack-A-Sound: Bossy R',
    icon: '🔨',
    gameType: 'WHACK_A_SOUND',
    prompt: 'Whack the mole making the /ar/ sound as in "star"!',
    targetSoundOrWord: 'spark',
    options: ['spark', 'speak', 'spoke', 'speck'],
    correctAnswer: 'spark',
    explanation: 'Bossy R makes AR shout /ar/!',
    scoreReward: 85
  },
  {
    id: 'ssa-18',
    hub: 'shellshore-arcade',
    title: 'The "I Before E" Rule Chamber',
    icon: '⚖️',
    gameType: 'RULE_CHAMBER',
    prompt: 'Spell the word for a person who steals (after TH, not C):',
    targetSoundOrWord: 'thief',
    options: ['thief', 'theif', 'thefe', 'thife'],
    correctAnswer: 'thief',
    explanation: 'I before E except after C: thief follows the standard rule!',
    scoreReward: 100
  },
  {
    id: 'ssa-19',
    hub: 'shellshore-arcade',
    title: 'Greek Root Reactor: PHON',
    icon: '⚡',
    gameType: 'ROOT_REACTOR',
    prompt: 'The Greek root "PHON" means:',
    targetSoundOrWord: 'sound / voice',
    options: ['sound / voice', 'light', 'earth', 'time'],
    correctAnswer: 'sound / voice',
    explanation: 'Phon means sound or voice, as in phonics and telephone!',
    scoreReward: 100
  },
  {
    id: 'ssa-20',
    hub: 'shellshore-arcade',
    title: 'Latin Stem Vault: STRUCT',
    icon: '🏛️',
    gameType: 'STEM_VAULT',
    prompt: 'The Latin root "STRUCT" in construction means:',
    targetSoundOrWord: 'to build',
    options: ['to build', 'to break', 'to speak', 'to throw'],
    correctAnswer: 'to build',
    explanation: 'Struct means to build, as in construct, structure, instruct!',
    scoreReward: 100
  },
  {
    id: 'ssa-21',
    hub: 'shellshore-arcade',
    title: 'Prefix Accelerator: DIS-',
    icon: '🚀',
    gameType: 'PREFIX_BOOST',
    prompt: 'Adding the prefix DIS- to "connect" creates a word meaning:',
    targetSoundOrWord: 'separate / break connection',
    options: ['separate / break connection', 'connect again', 'connect well', 'connect slowly'],
    correctAnswer: 'separate / break connection',
    explanation: 'Dis- indicates negation, reversal, or separation!',
    scoreReward: 90
  },
  {
    id: 'ssa-22',
    hub: 'shellshore-arcade',
    title: 'Neon Syllable Slicer: VCCV',
    icon: '⚔️',
    gameType: 'SYLLABLE_SLICE',
    prompt: 'Where do you slice the consonants in the word "RABBIT"?',
    targetSoundOrWord: 'rab - bit',
    options: ['rab - bit', 'ra - bbit', 'rabb - it', 'r - abbit'],
    correctAnswer: 'rab - bit',
    explanation: 'VCCV division rule: split neatly between the double consonants!',
    scoreReward: 90
  },
  {
    id: 'ssa-23',
    hub: 'shellshore-arcade',
    title: 'Retro Rhythm: Homophone Duels',
    icon: '🎵',
    gameType: 'HOMOPHONE_DUEL',
    prompt: 'Which word means a story or narrative (not the appendage of an animal)?',
    targetSoundOrWord: 'tale',
    options: ['tale', 'tail', 'tael', 'teal'],
    correctAnswer: 'tale',
    explanation: 'A tale is a story; a tail is on a fox or dog!',
    scoreReward: 95
  },
  {
    id: 'ssa-24',
    hub: 'shellshore-arcade',
    title: 'Morphology Matrix: -TION vs -SION',
    icon: '🔮',
    gameType: 'MORPH_MATRIX',
    prompt: 'Which word correctly uses -SION after the consonant S?',
    targetSoundOrWord: 'mission',
    options: ['mission', 'mition', 'mishun', 'missian'],
    correctAnswer: 'mission',
    explanation: 'Double SS takes -ION to form -ssion as in mission!',
    scoreReward: 100
  },
  {
    id: 'ssa-25',
    hub: 'shellshore-arcade',
    title: 'Grand High Scholar Etymology Crucible',
    icon: '👑',
    gameType: 'CRUCIBLE',
    prompt: 'Break down "CHRONOLOGY": Chron (Time) + Logy means:',
    targetSoundOrWord: 'The study of time order',
    options: ['The study of time order', 'A musical clock', 'Writing quickly', 'A stone building'],
    correctAnswer: 'The study of time order',
    explanation: 'Chron (time) + logy (study of) = the science of arranging events in order of occurrence!',
    scoreReward: 120
  }
];: LandId | ExplorerProfile | Record<string, any>,
  arg2?: Record<string, any> | LandId
): boolean => {
  const landId: LandId = (
    typeof arg1 === 'string' ? arg1 : typeof arg2 === 'string' ? arg2 : ''
  ) as LandId;

  const scores = (typeof arg1 === 'object' && arg1 !== null)
    ? ((arg1 as any).landScores || arg1)
    : (typeof arg2 === 'object' && arg2 !== null ? ((arg2 as any).landScores || arg2) : null);

  if (!landId || landId === 'sound-shallows') return true;
  if (!LAND_ORDER.includes(landId)) return true;

  const landIndex = LAND_ORDER.indexOf(landId);
  if (landIndex <= 0) return true;

  if (scores && scores[landId]?.unlocked === true) return true;

  const prevLandId = LAND_ORDER[landIndex - 1];
  const prevLand = scores ? scores[prevLandId] : null;
  return Boolean(prevLand && prevLand.completedGamesCount >= 50);
};

export interface RegisterPayload {
  username: string;
  password: string;
  familyName: string;
  role: 'parent' | 'teacher';
  starterExplorerName: string;
  gender?: 'boy' | 'girl';
  companionGuide?: 'kam' | 'celine';
}

interface GameContextType {
  account: Account;
  activeExplorer: ExplorerProfile;
  switchExplorer: (id: string) => void;
  createExplorer: (name: string, ageTier: ExplorerProfile['ageTier'], gender?: 'boy' | 'girl') => void;
  deleteExplorer: (id: string) => void;
  deleteAccount: () => void;
  updateExplorerName: (id: string, newName: string) => void;
  updateExplorerGender: (id: string, gender: 'boy' | 'girl') => void;
  updateExplorerScore: (landId: LandId, gamesCompletedDelta: number, starsDelta: number) => void;
  awardCurrency: (coinsDelta: number, tokensDelta: number) => void;
  updateAvatarCustomization: (customization: ExplorerProfile['customization']) => void;
  showHallOfFameCelebration: boolean;
  dismissHallOfFameCelebration: () => void;
  resetExplorerProgress: (explorerId: string) => void;
  restartLandProgress: (landId: LandId) => void;
  resetClassroomAndGameData: () => void;
  loginWithCredentials: (u: string, p: string) => Promise<{ success: boolean; error?: string }>;
  registerAccount: (payload: RegisterPayload) => Promise<{ success: boolean; error?: string }>;
  isLandUnlocked: (landId: LandId) => boolean;
  exportSaveData: () => string;
  importSaveData: (jsonStr: string) => boolean;
  logout: () => void;
  recordGameCompletion: (landId: LandId, levelNumber: number, gameNumber: number, stars: number, score: number, isWin: boolean) => void;
  recordSkillMiss: (skillName: string) => void;
}

const DEFAULT_LAND_SCORES = {
  'sound-shallows': { completedGamesCount: 0, stars: 0, unlocked: true },
  'builders-guild': { completedGamesCount: 0, stars: 0, unlocked: false },
  'tricky-trails': { completedGamesCount: 0, stars: 0, unlocked: false },
  'whispering-peaks': { completedGamesCount: 0, stars: 0, unlocked: false },
  'lexicon-empire': { completedGamesCount: 0, stars: 0, unlocked: false }
};

export const getFreshLandScores = () => JSON.parse(JSON.stringify(DEFAULT_LAND_SCORES));

// KAM: Red adv vest, adv bandana, wise turtle, curls, 3rd brown hair, 2nd light skin
export const KAM_GUIDE: ExplorerProfile = {
  id: 'guide-kam',
  name: 'Kam',
  gender: 'boy',
  companionGuide: 'kam',
  ageTier: 'preschool',
  level: 1,
  totalStars: 20,
  coins: 50,
  arcadeTokens: 10,
  isHallOfFameInducted: false,
  timesStorylineCompleted: 0,
  landScores: getFreshLandScores(),
  strugglingSkills: {},
  customization: {
    skinTone: '#fcd5b5',
    hairStyle: 'curls',
    hairColor: '#5c3818',
    outfitStyle: 'adventurer',
    outfitColor: '#dc2626',
    accessory: 'bandana',
    companionPet: 'sea-turtle',
    title: 'Adventure Guide'
  }
};

// CELINE: Purple wizard cloak, glasses, curls, baby dragon, 3rd brown hair, 3rd brown skin
export const CELINE_GUIDE: ExplorerProfile = {
  id: 'guide-celine',
  name: 'Celine',
  gender: 'girl',
  companionGuide: 'celine',
  ageTier: 'kindergarten',
  level: 1,
  totalStars: 20,
  coins: 50,
  arcadeTokens: 10,
  isHallOfFameInducted: false,
  timesStorylineCompleted: 0,
  landScores: getFreshLandScores(),
  strugglingSkills: {},
  customization: {
    skinTone: '#d99058',
    hairStyle: 'curls',
    hairColor: '#5c3818',
    outfitStyle: 'wizard',
    outfitColor: '#7e22ce',
    accessory: 'glasses',
    companionPet: 'baby-dragon',
    title: 'Adventure Guide'
  }
};

export const getCompanionGuide = (explorer?: ExplorerProfile | null): ExplorerProfile => {
  if (!explorer) return KAM_GUIDE;
  if (explorer.gender === 'girl' || explorer.companionGuide === 'celine') {
    return CELINE_GUIDE;
  }
  return KAM_GUIDE;
};

const FALLBACK_EXPLORER: ExplorerProfile = {
  id: 'exp-kam',
  name: 'Kam',
  gender: 'boy',
  companionGuide: 'kam',
  ageTier: 'preschool',
  level: 1,
  totalStars: 0,
  coins: 30,
  arcadeTokens: 5,
  isHallOfFameInducted: false,
  timesStorylineCompleted: 0,
  landScores: {
    'sound-shallows': { completedGamesCount: 0, stars: 0, unlocked: true },
    'builders-guild': { completedGamesCount: 0, stars: 0, unlocked: false },
    'tricky-trails': { completedGamesCount: 0, stars: 0, unlocked: false },
    'whispering-peaks': { completedGamesCount: 0, stars: 0, unlocked: false },
    'lexicon-empire': { completedGamesCount: 0, stars: 0, unlocked: false }
  },
  strugglingSkills: {},
  customization: {
    skinTone: '#fcd5b5',
    hairStyle: 'curls',
    hairColor: '#5c3818',
    outfitStyle: 'adventurer',
    outfitColor: '#dc2626',
    accessory: 'bandana',
    companionPet: 'sea-turtle',
    title: 'Adventurer with Kam'
  }
};

const INITIAL_ACCOUNT: Account = {
  id: 'acc-readingheroes',
  familyName: 'Reading Heroes Family',
  username: 'readingheroes',
  role: 'parent',
  explorers: [
    FALLBACK_EXPLORER,
    {
      id: 'exp-lani',
      name: 'Lani',
      gender: 'girl',
      companionGuide: 'celine',
      ageTier: 'late-elementary',
      level: 50,
      totalStars: 774,
      coins: 950,
      arcadeTokens: 150,
      isHallOfFameInducted: true,
      timesStorylineCompleted: 1,
      landScores: {
        'sound-shallows': { completedGamesCount: 50, stars: 159, unlocked: true },
        'builders-guild': { completedGamesCount: 50, stars: 153, unlocked: true },
        'tricky-trails': { completedGamesCount: 50, stars: 156, unlocked: true },
        'whispering-peaks': { completedGamesCount: 50, stars: 153, unlocked: true },
        'lexicon-empire': { completedGamesCount: 50, stars: 153, unlocked: true }
      },
      strugglingSkills: {},
      customization: {
        skinTone: '#d99058',
        hairStyle: 'braids',
        hairColor: '#1e1b18',
        outfitStyle: 'wizard',
        outfitColor: '#a855f7',
        accessory: 'sparkles',
        companionPet: 'golden-phonix',
        title: 'Hall of Fame Grand Scholar'
      }
    }
  ]
};

const GameContext = createContext<GameContextType | undefined>(undefined);

export const GameProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [account, setAccount] = useState<Account>(() => {
    try {
      const saved = localStorage.getItem('phonixia_account_v2');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && Array.isArray(parsed.explorers) && parsed.explorers.length > 0) {
          return parsed;
        }
      }
    } catch {}
    return INITIAL_ACCOUNT;
  });

  const [activeExplorerId, setActiveExplorerId] = useState<string>(() => {
    return (
      localStorage.getItem('phonixia_active_id_v2') ||
      (account.explorers && account.explorers[0] ? account.explorers[0].id : FALLBACK_EXPLORER.id)
    );
  });

  const [showHallOfFameCelebration, setShowHallOfFameCelebration] = useState(false);
  const [isCloudLoaded, setIsCloudLoaded] = useState(false);

  // Helper to sync account to cloud and local storage
  const syncAccountData = useCallback((acc: Account) => {
    if (!acc || !acc.username) return;
    try {
      localStorage.setItem('phonixia_account_v2', JSON.stringify(acc));
      localStorage.setItem('phonixia_active_user', acc.username.toLowerCase());
      const all = JSON.parse(localStorage.getItem('phonixia_all_accounts_cache') || '{}');
      all[acc.username.toLowerCase()] = acc;
      localStorage.setItem('phonixia_all_accounts_cache', JSON.stringify(all));
    } catch {}

    fetch('/api/account/save', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: acc.username, accountData: acc })
    }).catch(() => {});
  }, []);

  // Initial cloud fetch on startup
  useEffect(() => {
    const savedUser = localStorage.getItem('phonixia_active_user') || 'readingheroes';
    fetch(`/api/account/${savedUser}`)
      .then((res) => {
        if (!res.ok) throw new Error('Account not found');
        return res.json();
      })
      .then((data) => {
        if (data && data.account) {
          setAccount(data.account);
          if (data.account.explorers && data.account.explorers.length > 0) {
            const savedActiveId = localStorage.getItem('phonixia_active_id_v2');
            const exists = data.account.explorers.some((e: any) => e.id === savedActiveId);
            setActiveExplorerId(exists ? savedActiveId! : data.account.explorers[0].id);
          }
          localStorage.setItem('phonixia_account_v2', JSON.stringify(data.account));
        }
      })
      .catch(() => {})
      .finally(() => {
        setIsCloudLoaded(true);
      });
  }, []);

  // Save changes to cloud whenever account updates (after initial load)
  useEffect(() => {
    if (!isCloudLoaded) return;
    syncAccountData(account);
  }, [account, isCloudLoaded, syncAccountData]);

  // Keep activeExplorerId cached
  useEffect(() => {
    if (activeExplorerId) {
      localStorage.setItem('phonixia_active_id_v2', activeExplorerId);
    }
  }, [activeExplorerId]);

  const rawExplorer = useMemo(() => {
    return (
      (account.explorers && account.explorers.find((exp) => exp.id === activeExplorerId)) ||
      (account.explorers && account.explorers[0]) ||
      FALLBACK_EXPLORER
    );
  }, [account.explorers, activeExplorerId]);

  const activeExplorer: ExplorerProfile = useMemo(() => {
    return {
      ...rawExplorer,
      gender: rawExplorer.gender || 'boy',
      companionGuide: rawExplorer.gender === 'girl' ? 'celine' : 'kam',
      strugglingSkills: rawExplorer.strugglingSkills || {},
      landScores: {
        ...DEFAULT_LAND_SCORES,
        ...(rawExplorer.landScores || {}),
        'sound-shallows': {
          completedGamesCount: rawExplorer.landScores?.['sound-shallows']?.completedGamesCount ?? 0,
          stars: rawExplorer.landScores?.['sound-shallows']?.stars ?? 0,
          unlocked: true,
        }
      }
    };
  }, [rawExplorer]);

  const checkLandUnlocked = useCallback((landId: LandId): boolean => {
    return isLandUnlocked(landId, activeExplorer.landScores);
  }, [activeExplorer.landScores]);

  const switchExplorer = (id: string) => {
    setActiveExplorerId(id);
    localStorage.setItem('phonixia_active_id_v2', id);
  };

  const updateExplorerName = (id: string, newName: string) => {
    const trimmed = newName.trim();
    if (!trimmed) return;
    setAccount((prev) => {
      const updated = {
        ...prev,
        explorers: (prev.explorers || []).map((exp) =>
          exp.id === id ? { ...exp, name: trimmed } : exp
        )
      };
      syncAccountData(updated);
      return updated;
    });
  };

  const updateExplorerGender = (id: string, gender: 'boy' | 'girl') => {
    const companionGuide: 'kam' | 'celine' = gender === 'boy' ? 'kam' : 'celine';
    const companionPet = gender === 'boy' ? 'sea-turtle' : 'baby-dragon';
    const outfitStyle = gender === 'boy' ? 'adventurer' : 'wizard';
    const outfitColor = gender === 'boy' ? '#dc2626' : '#7e22ce';
    const accessory = gender === 'boy' ? 'bandana' : 'glasses';
    const skinTone = gender === 'boy' ? '#fcd5b5' : '#d99058';

    setAccount((prev) => {
      const updated = {
        ...prev,
        explorers: (prev.explorers || []).map((exp) =>
          exp.id === id
            ? {
                ...exp,
                gender,
                companionGuide,
                customization: {
                  ...exp.customization,
                  skinTone,
                  hairStyle: 'curls',
                  hairColor: '#5c3818',
                  outfitStyle,
                  outfitColor,
                  accessory,
                  companionPet,
                  title: gender === 'boy' ? 'Adventurer with Kam' : 'Adventurer with Celine'
                }
              }
            : exp
        )
      };
      syncAccountData(updated);
      return updated;
    });
  };

  const recordSkillMiss = useCallback((skillName: string) => {
    if (!skillName) return;
    setAccount((prev) => ({
      ...prev,
      explorers: (prev.explorers || []).map((exp) => {
        if (exp.id !== activeExplorerId) return exp;
        const currentStruggles = exp.strugglingSkills || {};
        return {
          ...exp,
          strugglingSkills: {
            ...currentStruggles,
            [skillName]: (currentStruggles[skillName] || 0) + 1
          }
        };
      })
    }));

    try {
      const storageKey = `phonixia_struggles_${activeExplorerId}`;
      const existing = localStorage.getItem(storageKey);
      const parsed: Record<string, number> = existing ? JSON.parse(existing) : {};
      parsed[skillName] = (parsed[skillName] || 0) + 1;
      localStorage.setItem(storageKey, JSON.stringify(parsed));
    } catch {}
  }, [activeExplorerId]);

  // FULL CROSS-DEVICE & OFFLINE CLOUD LOGIN
  const loginWithCredentials = async (
    u: string,
    p: string
  ): Promise<{ success: boolean; error?: string }> => {
    const cleanUser = u.trim().toLowerCase();
    if (!cleanUser || !p) {
      return { success: false, error: 'Please enter both username and password.' };
    }

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: cleanUser, password: p })
      });

      const data = await res.json();
      if (res.ok && data.success && data.account) {
        setAccount(data.account);
        if (data.account.explorers && data.account.explorers.length > 0) {
          setActiveExplorerId(data.account.explorers[0].id);
          localStorage.setItem('phonixia_active_id_v2', data.account.explorers[0].id);
        }
        localStorage.setItem('phonixia_active_user', cleanUser);
        localStorage.setItem('phonixia_account_v2', JSON.stringify(data.account));
        localStorage.setItem(`phonixia_pw_${cleanUser}`, p);

        try {
          const all = JSON.parse(localStorage.getItem('phonixia_all_accounts_cache') || '{}');
          all[cleanUser] = data.account;
          localStorage.setItem('phonixia_all_accounts_cache', JSON.stringify(all));
        } catch {}

        setIsCloudLoaded(true);
        return { success: true };
      }

      if (data.error) {
        return { success: false, error: data.error };
      }
    } catch (networkErr) {
      console.warn('Network unreachable, checking offline cache:', networkErr);
    }

    // Offline / LocalStorage Cache Fallback
    const savedPassword = localStorage.getItem(`phonixia_pw_${cleanUser}`);
    let isPassValid = Boolean(savedPassword && p === savedPassword);

    if (!isPassValid && cleanUser === 'readingheroes') {
      const cleanPw = p.toLowerCase().replace(/[^a-z0-9]/g, '');
      if (cleanPw === 'phonics123' || p.toLowerCase() === 'phonics 123') {
        isPassValid = true;
      }
    }

    if (!isPassValid && cleanUser === 'phonixiatest') {
      const cleanPw = p.toLowerCase().replace(/[^a-z0-9]/g, '');
      if (cleanPw === 'cousins2026' || p.toLowerCase() === 'cousins2026!' || p.toLowerCase() === 'cousins 2026!') {
        isPassValid = true;
      }
    }

    if (isPassValid) {
      try {
        const all = JSON.parse(localStorage.getItem('phonixia_all_accounts_cache') || '{}');
        const cached = all[cleanUser] || (account.username?.toLowerCase() === cleanUser ? account : null);
        if (cached) {
          setAccount(cached);
          if (cached.explorers && cached.explorers.length > 0) {
            setActiveExplorerId(cached.explorers[0].id);
            localStorage.setItem('phonixia_active_id_v2', cached.explorers[0].id);
          }
          localStorage.setItem('phonixia_active_user', cleanUser);
          localStorage.setItem('phonixia_account_v2', JSON.stringify(cached));
          setIsCloudLoaded(true);
          return { success: true };
        }
      } catch {}
      localStorage.setItem('phonixia_active_user', cleanUser);
      setIsCloudLoaded(true);
      return { success: true };
    }

    return { success: false, error: 'Invalid username or password.' };
  };

  // REGISTER NEW ACCOUNT
  const registerAccount = async (
    payload: RegisterPayload
  ): Promise<{ success: boolean; error?: string }> => {
    const cleanUser = payload.username.trim().toLowerCase();
    const starterGender = payload.gender || 'boy';
    const guide = starterGender === 'boy' ? 'kam' : 'celine';

    const starter: ExplorerProfile = {
      id: `exp-${Date.now()}`,
      name: payload.starterExplorerName || 'Explorer',
      gender: starterGender,
      companionGuide: guide,
      ageTier: 'preschool',
      level: 1,
      totalStars: 0,
      coins: 30,
      arcadeTokens: 5,
      isHallOfFameInducted: false,
      timesStorylineCompleted: 0,
      landScores: getFreshLandScores(),
      strugglingSkills: {},
      customization: {
        skinTone: starterGender === 'boy' ? '#fcd5b5' : '#d99058',
        hairStyle: 'curls',
        hairColor: '#5c3818',
        outfitStyle: starterGender === 'boy' ? 'adventurer' : 'wizard',
        outfitColor: starterGender === 'boy' ? '#dc2626' : '#7e22ce',
        accessory: starterGender === 'boy' ? 'bandana' : 'glasses',
        companionPet: starterGender === 'boy' ? 'sea-turtle' : 'baby-dragon',
        title: starterGender === 'boy' ? 'Adventurer with Kam' : 'Adventurer with Celine'
      }
    };

    const newAcc: Account = {
      id: `acc-${Date.now()}`,
      familyName: payload.familyName || `${payload.starterExplorerName}'s Family`,
      username: cleanUser,
      role: payload.role || 'parent',
      explorers: [starter]
    };

    setAccount(newAcc);
    setActiveExplorerId(starter.id);
    localStorage.setItem(`phonixia_pw_${cleanUser}`, payload.password);
    localStorage.setItem('phonixia_active_user', cleanUser);
    localStorage.setItem('phonixia_account_v2', JSON.stringify(newAcc));
    localStorage.setItem('phonixia_active_id_v2', starter.id);

    try {
      const all = JSON.parse(localStorage.getItem('phonixia_all_accounts_cache') || '{}');
      all[cleanUser] = newAcc;
      localStorage.setItem('phonixia_all_accounts_cache', JSON.stringify(all));
    } catch {}

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...payload,
          username: cleanUser,
          gender: starterGender,
          companionGuide: guide
        })
      });
      const data = await res.json();
      if (!res.ok) {
        return { success: false, error: data.error || 'Failed to create account.' };
      }
      setIsCloudLoaded(true);
      return { success: true };
    } catch {
      setIsCloudLoaded(true);
      return { success: true };
    }
  };

  // UNLIMITED EXPLORER CREATION - Synchronized across cloud & localStorage
  const createExplorer = (name: string, ageTier: ExplorerProfile['ageTier'], gender?: 'boy' | 'girl') => {
    const cleanName = name.trim();
    if (!cleanName) return;

    const explorerGender = gender || 'boy';
    const guide = explorerGender === 'girl' ? 'celine' : 'kam';
    const newId = `exp-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`;

    const newExplorer: ExplorerProfile = {
      id: newId,
      name: cleanName,
      gender: explorerGender,
      companionGuide: guide,
      ageTier,
      level: 1,
      totalStars: 0,
      coins: 20,
      arcadeTokens: 3,
      isHallOfFameInducted: false,
      timesStorylineCompleted: 0,
      landScores: getFreshLandScores(),
      strugglingSkills: {},
      customization: {
        skinTone: explorerGender === 'boy' ? '#fcd5b5' : '#d99058',
        hairStyle: 'curls',
        hairColor: '#5c3818',
        outfitStyle: explorerGender === 'boy' ? 'adventurer' : 'wizard',
        outfitColor: explorerGender === 'boy' ? '#dc2626' : '#7e22ce',
        accessory: explorerGender === 'boy' ? 'bandana' : 'glasses',
        companionPet: explorerGender === 'boy' ? 'sea-turtle' : 'baby-dragon',
        title: explorerGender === 'boy' ? 'Adventurer with Kam' : 'Adventurer with Celine'
      }
    };

    setAccount((prev) => {
      const updatedExplorers = [...(prev.explorers || []), newExplorer];
      const updatedAccount = { ...prev, explorers: updatedExplorers };
      syncAccountData(updatedAccount);
      return updatedAccount;
    });
    setActiveExplorerId(newId);
  };

  // DELETE SINGLE CHILD EXPLORER PROFILE
  const deleteExplorer = useCallback((id: string) => {
    setAccount((prev) => {
      const remainingExplorers = (prev.explorers || []).filter((exp) => exp.id !== id);
      if (remainingExplorers.length === 0) return prev; // Keep at least 1 explorer
      const nextActiveId = remainingExplorers[0].id;
      setActiveExplorerId(nextActiveId);
      const updatedAccount = { ...prev, explorers: remainingExplorers };
      syncAccountData(updatedAccount);
      try {
        localStorage.removeItem(`phonixia_struggles_${id}`);
      } catch {}
      return updatedAccount;
    });
  }, [syncAccountData]);

  // PERMANENT ACCOUNT DELETION & DATA PURGE
  const deleteAccount = useCallback(() => {
    try {
      localStorage.removeItem('phonixia_account_v2');
      localStorage.removeItem('phonixia_active_id_v2');
      localStorage.removeItem('phonixia_active_user');
      localStorage.removeItem('phonixia_parent_pin');
      sessionStorage.removeItem('phonixia_active_session');

      if (account?.username) {
        localStorage.removeItem(`phonixia_pw_${account.username.toLowerCase()}`);
        fetch('/api/account/delete', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username: account.username })
        }).catch(() => {});
      }

      if (account?.explorers) {
        account.explorers.forEach((exp) => {
          localStorage.removeItem(`phonixia_struggles_${exp.id}`);
        });
      }
    } catch {}
    window.location.reload();
  }, [account]);

  const updateExplorerScore = (landId: LandId, gamesCompletedDelta: number, starsDelta: number) => {
    setAccount((prev) => {
      const updatedExplorers = (prev.explorers || []).map((exp) => {
        if (exp.id !== activeExplorerId) return exp;
        const currentLand = exp.landScores?.[landId] || { completedGamesCount: 0, stars: 0, unlocked: false };
        const newCompleted = Math.min(50, currentLand.completedGamesCount + gamesCompletedDelta);
        const newLandStars = currentLand.stars + starsDelta;

        const updatedLandScores = {
          ...(exp.landScores || DEFAULT_LAND_SCORES),
          [landId]: {
            ...currentLand,
            completedGamesCount: newCompleted,
            stars: newLandStars,
            unlocked: true
          }
        };

        if (newCompleted >= 50) {
          const currentIndex = LAND_ORDER.indexOf(landId);
          if (currentIndex !== -1 && currentIndex + 1 < LAND_ORDER.length) {
            const nextLandId = LAND_ORDER[currentIndex + 1];
            const nextLand = updatedLandScores[nextLandId] || { completedGamesCount: 0, stars: 0, unlocked: false };
            updatedLandScores[nextLandId] = {
              ...nextLand,
              unlocked: true
            };
          }
        }

        const totalCompleted = Object.values(updatedLandScores).reduce<number>(
          (sum: number, l: any) => sum + (l?.completedGamesCount || 0),
          0
        );

        const newStars = exp.totalStars + starsDelta;
        const newLevel = Math.max(1, Math.floor(newStars / 15) + 1);
        const shouldInduct = totalCompleted >= 250;

        if (shouldInduct && !exp.isHallOfFameInducted) {
          setShowHallOfFameCelebration(true);
        }

        return {
          ...exp,
          level: newLevel,
          totalStars: newStars,
          isHallOfFameInducted: exp.isHallOfFameInducted || shouldInduct,
          landScores: updatedLandScores
        };
      });

      const updatedAccount = {
        ...prev,
        explorers: updatedExplorers
      };
      syncAccountData(updatedAccount);
      return updatedAccount;
    });
  };

  const awardCurrency = (coinsDelta: number, tokensDelta: number) => {
    setAccount((prev) => {
      const updatedAccount = {
        ...prev,
        explorers: (prev.explorers || []).map((exp) =>
          exp.id === activeExplorerId
            ? {
                ...exp,
                coins: Math.max(0, exp.coins + coinsDelta),
                arcadeTokens: Math.max(0, exp.arcadeTokens + tokensDelta)
              }
            : exp
        )
      };
      syncAccountData(updatedAccount);
      return updatedAccount;
    });
  };

  const updateAvatarCustomization = (customization: ExplorerProfile['customization']) => {
    setAccount((prev) => {
      const updatedAccount = {
        ...prev,
        explorers: (prev.explorers || []).map((exp) =>
          exp.id === activeExplorerId ? { ...exp, customization } : exp
        )
      };
      syncAccountData(updatedAccount);
      return updatedAccount;
    });
  };

  const resetExplorerProgress = (explorerId: string) => {
    setAccount((prev) => {
      const updatedExplorers = (prev.explorers || []).map((exp) => {
        if (exp.id !== explorerId) return exp;
        return {
          ...exp,
          totalStars: 0,
          level: 1,
          isHallOfFameInducted: false,
          landScores: getFreshLandScores(),
          strugglingSkills: {},
          customization: {
            ...exp.customization,
            title: exp.gender === 'boy' ? 'Adventurer with Kam' : 'Adventurer with Celine'
          }
        };
      });
      const updatedAccount = {
        ...prev,
        explorers: updatedExplorers
      };
      syncAccountData(updatedAccount);
      return updatedAccount;
    });
  };

  const resetClassroomAndGameData = () => {
    setAccount((prev) => {
      const clearedExplorers = (prev.explorers || []).map((exp) => ({
        ...exp,
        level: 1,
        totalStars: 0,
        coins: 50,
        arcadeTokens: 10,
        isHallOfFameInducted: false,
        timesStorylineCompleted: 0,
        landScores: getFreshLandScores(),
        strugglingSkills: {}
      }));
      const updatedAccount = {
        ...prev,
        explorers: clearedExplorers
      };
      syncAccountData(updatedAccount);
      return updatedAccount;
    });

    try {
      localStorage.removeItem('phonixia_leaderboard');
      localStorage.removeItem('phonixia_classroom_scores');
      localStorage.removeItem('phonixia_high_scores');
    } catch {}

    fetch('/api/leaderboard/reset', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ accountId: account.id, username: account.username })
    }).catch(() => {});
  };

  const restartLandProgress = (landId: LandId) => {
    setAccount((prev) => {
      const updatedExplorers = (prev.explorers || []).map((exp) => {
        if (exp.id !== activeExplorerId) return exp;
        const currentScore = exp.landScores?.[landId] || { completedGamesCount: 0, stars: 0, unlocked: true };
        const starsLost = currentScore.stars || 0;
        return {
          ...exp,
          totalStars: Math.max(0, exp.totalStars - starsLost),
          landScores: {
            ...exp.landScores,
            [landId]: {
              completedGamesCount: 0,
              stars: 0,
              unlocked: true,
            }
          }
        };
      });
      const updatedAccount = {
        ...prev,
        explorers: updatedExplorers
      };
      syncAccountData(updatedAccount);
      return updatedAccount;
    });
  };

  const exportSaveData = (): string => {
    return JSON.stringify(account);
  };

  const importSaveData = (jsonStr: string): boolean => {
    try {
      const parsed = JSON.parse(jsonStr);
      if (parsed && Array.isArray(parsed.explorers) && parsed.explorers.length > 0) {
        setAccount(parsed);
        if (parsed.explorers[0]) {
          setActiveExplorerId(parsed.explorers[0].id);
        }
        syncAccountData(parsed);
        return true;
      }
    } catch {}
    return false;
  };

  const recordGameCompletion = (
    landId: LandId,
    _levelNumber: number,
    _gameNumber: number,
    stars: number,
    score: number,
    isWin: boolean
  ) => {
    if (isWin) {
      updateExplorerScore(landId, 1, stars);
      awardCurrency(Math.max(5, Math.floor(score / 10)), 1);
    }
  };

  const dismissHallOfFameCelebration = () => {
    setShowHallOfFameCelebration(false);
  };

  const logout = () => {
    sessionStorage.removeItem('phonixia_active_session');
  };

  return (
    <GameContext.Provider
      value={{
        account,
        activeExplorer,
        switchExplorer,
        createExplorer,
        deleteExplorer,
        deleteAccount,
        updateExplorerName,
        updateExplorerGender,
        updateExplorerScore,
        awardCurrency,
        updateAvatarCustomization,
        showHallOfFameCelebration,
        dismissHallOfFameCelebration,
        resetExplorerProgress,
        restartLandProgress,
        resetClassroomAndGameData,
        loginWithCredentials,
        registerAccount,
        isLandUnlocked: checkLandUnlocked,
        exportSaveData,
        importSaveData,
        logout,
        recordGameCompletion,
        recordSkillMiss
      }}
    >
      {children}
    </GameContext.Provider>
  );
};

export const useGame = () => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
};
