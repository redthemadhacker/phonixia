import { LandId } from '../types/character';

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
];