/**
 * Comprehensive Phonics Picture Dictionary & Visual Cue Engine
 * Designed for early learners, preschoolers, and kindergarteners.
 * Converts phonics letters, sounds, and CVC words into cute animated picture cards.
 */

export interface PhonicsPictureClue {
  word: string;
  emoji: string;
  phonics: string;
  category: 'animal' | 'food' | 'nature' | 'object' | 'action';
  animation: 'tail-wag' | 'bounce-gentle' | 'pulse-gentle' | 'spin-slow' | 'hop' | 'float' | 'wiggle';
  funSound: string;
  spokenHint: string;
  gradient: string;
  borderColor: string;
  badge: string;
}

// Master Phonics Picture Registry
export const PHONICS_PICTURE_DICTIONARY: Record<string, PhonicsPictureClue> = {
  // Common CVC and early animal words
  dog: {
    word: 'Dog',
    emoji: '🐶',
    phonics: '/d/ · /ɒ/ · /g/',
    category: 'animal',
    animation: 'tail-wag',
    funSound: 'Woof woof! Bouncy puppy!',
    spokenHint: 'Look at the cute puppy! D-O-G, dog! Woof woof!',
    gradient: 'from-amber-500 via-orange-500 to-amber-600',
    borderColor: 'border-amber-400',
    badge: '🐾 Puppy'
  },
  cat: {
    word: 'Cat',
    emoji: '🐱',
    phonics: '/k/ · /æ/ · /t/',
    category: 'animal',
    animation: 'wiggle',
    funSound: 'Meow meow! Playful kitty!',
    spokenHint: 'Look at the happy kitty! C-A-T, cat! Meow meow!',
    gradient: 'from-orange-400 via-amber-400 to-yellow-500',
    borderColor: 'border-amber-300',
    badge: '🐾 Kitty'
  },
  pig: {
    word: 'Pig',
    emoji: '🐷',
    phonics: '/p/ · /ɪ/ · /g/',
    category: 'animal',
    animation: 'bounce-gentle',
    funSound: 'Oink oink! Cheerful piggy!',
    spokenHint: 'Look at the friendly pig! P-I-G, pig! Oink oink!',
    gradient: 'from-pink-400 via-rose-400 to-pink-500',
    borderColor: 'border-pink-300',
    badge: '🌸 Piggy'
  },
  sun: {
    word: 'Sun',
    emoji: '☀️',
    phonics: '/s/ · /ʌ/ · /n/',
    category: 'nature',
    animation: 'spin-slow',
    funSound: 'Warm bright sunshine!',
    spokenHint: 'Look at the smiling sun! S-U-N, sun! Bright and warm!',
    gradient: 'from-yellow-400 via-amber-400 to-orange-400',
    borderColor: 'border-yellow-300',
    badge: '✨ Warm Sun'
  },
  bug: {
    word: 'Bug',
    emoji: '🐛',
    phonics: '/b/ · /ʌ/ · /g/',
    category: 'nature',
    animation: 'wiggle',
    funSound: 'Little crawling caterpillar bug!',
    spokenHint: 'Look at the cute bug! B-U-G, bug!',
    gradient: 'from-emerald-400 via-teal-400 to-green-500',
    borderColor: 'border-emerald-300',
    badge: '🌿 Little Bug'
  },
  fox: {
    word: 'Fox',
    emoji: '🦊',
    phonics: '/f/ · /ɒ/ · /k-s/',
    category: 'animal',
    animation: 'bounce-gentle',
    funSound: 'Clever woodland fox!',
    spokenHint: 'Look at the fluffy orange fox! F-O-X, fox!',
    gradient: 'from-orange-500 via-amber-600 to-red-500',
    borderColor: 'border-orange-400',
    badge: '🌲 Woodland Fox'
  },
  hat: {
    word: 'Hat',
    emoji: '🎩',
    phonics: '/h/ · /æ/ · /t/',
    category: 'object',
    animation: 'float',
    funSound: 'Magical top hat!',
    spokenHint: 'Look at the magic hat! H-A-T, hat!',
    gradient: 'from-indigo-500 via-purple-500 to-indigo-600',
    borderColor: 'border-purple-300',
    badge: '✨ Magic Hat'
  },
  bed: {
    word: 'Bed',
    emoji: '🛏️',
    phonics: '/b/ · /e/ · /d/',
    category: 'object',
    animation: 'pulse-gentle',
    funSound: 'Cozy nap bed!',
    spokenHint: 'Look at the comfy bed! B-E-D, bed! Time to rest!',
    gradient: 'from-sky-400 via-blue-500 to-indigo-500',
    borderColor: 'border-sky-300',
    badge: '🌙 Cozy Bed'
  },
  cup: {
    word: 'Cup',
    emoji: '🥤',
    phonics: '/k/ · /ʌ/ · /p/',
    category: 'object',
    animation: 'bounce-gentle',
    funSound: 'Sip sip refreshing drink!',
    spokenHint: 'Look at the cool drink cup! C-U-P, cup!',
    gradient: 'from-cyan-400 via-teal-400 to-blue-500',
    borderColor: 'border-cyan-300',
    badge: '🍹 Sip Cup'
  },
  bat: {
    word: 'Bat',
    emoji: '🦇',
    phonics: '/b/ · /æ/ · /t/',
    category: 'animal',
    animation: 'float',
    funSound: 'Gentle flying night bat!',
    spokenHint: 'Look at the fluttering bat! B-A-T, bat!',
    gradient: 'from-purple-600 via-indigo-700 to-slate-900',
    borderColor: 'border-purple-400',
    badge: '🌙 Friendly Bat'
  },
  frog: {
    word: 'Frog',
    emoji: '🐸',
    phonics: '/f/ · /r/ · /ɒ/ · /g/',
    category: 'animal',
    animation: 'hop',
    funSound: 'Ribbit ribbit hopping frog!',
    spokenHint: 'Look at the jumping green frog! F-R-O-G, frog! Ribbit!',
    gradient: 'from-green-400 via-emerald-500 to-teal-500',
    borderColor: 'border-green-300',
    badge: '🪷 Jumping Frog'
  },
  fish: {
    word: 'Fish',
    emoji: '🐟',
    phonics: '/f/ · /ɪ/ · /ʃ/',
    category: 'animal',
    animation: 'float',
    funSound: 'Splash splash little swimmer fish!',
    spokenHint: 'Look at the swimming fish! F-I-S-H, fish! Splash splash!',
    gradient: 'from-cyan-400 via-blue-500 to-teal-400',
    borderColor: 'border-cyan-300',
    badge: '🌊 Swimming Fish'
  },
  star: {
    word: 'Star',
    emoji: '⭐',
    phonics: '/s/ · /t/ · /ɑːr/',
    category: 'nature',
    animation: 'pulse-gentle',
    funSound: 'Twinkle twinkle shining star!',
    spokenHint: 'Look at the sparkling golden star! S-T-A-R, star!',
    gradient: 'from-amber-300 via-yellow-400 to-orange-400',
    borderColor: 'border-amber-300',
    badge: '🌟 Shining Star'
  },
  car: {
    word: 'Car',
    emoji: '🚗',
    phonics: '/k/ · /ɑːr/',
    category: 'object',
    animation: 'bounce-gentle',
    funSound: 'Beep beep zoom car!',
    spokenHint: 'Look at the speedy red car! C-A-R, car! Beep beep!',
    gradient: 'from-red-500 via-rose-500 to-red-600',
    borderColor: 'border-red-300',
    badge: '🏁 Zoom Car'
  },
  bus: {
    word: 'Bus',
    emoji: '🚌',
    phonics: '/b/ · /ʌ/ · /s/',
    category: 'object',
    animation: 'bounce-gentle',
    funSound: 'The wheels on the bus go round and round!',
    spokenHint: 'Look at the bright school bus! B-U-S, bus! Honk honk!',
    gradient: 'from-yellow-400 via-amber-500 to-orange-500',
    borderColor: 'border-amber-300',
    badge: '🚸 School Bus'
  },
  boat: {
    word: 'Boat',
    emoji: '⛵',
    phonics: '/b/ · /oʊ/ · /t/',
    category: 'object',
    animation: 'float',
    funSound: 'Sailing across gentle waves!',
    spokenHint: 'Look at the sailboat on the water! B-O-A-T, boat!',
    gradient: 'from-sky-400 via-blue-500 to-indigo-500',
    borderColor: 'border-sky-300',
    badge: '🌊 Sailboat'
  },
  bear: {
    word: 'Bear',
    emoji: '🐻',
    phonics: '/b/ · /eər/',
    category: 'animal',
    animation: 'bounce-gentle',
    funSound: 'Warm cuddly teddy bear!',
    spokenHint: 'Look at the friendly brown bear! B-E-A-R, bear!',
    gradient: 'from-amber-700 via-yellow-800 to-amber-900',
    borderColor: 'border-amber-400',
    badge: '🐾 Cuddly Bear'
  },
  duck: {
    word: 'Duck',
    emoji: '🦆',
    phonics: '/d/ · /ʌ/ · /k/',
    category: 'animal',
    animation: 'wiggle',
    funSound: 'Quack quack happy duck!',
    spokenHint: 'Look at the pond duck! D-U-C-K, duck! Quack quack!',
    gradient: 'from-emerald-500 via-teal-600 to-cyan-700',
    borderColor: 'border-emerald-300',
    badge: '🌊 Quacking Duck'
  },
  apple: {
    word: 'Apple',
    emoji: '🍎',
    phonics: '/æ/ · /p/ · /l/',
    category: 'food',
    animation: 'bounce-gentle',
    funSound: 'Crunchy sweet red apple!',
    spokenHint: 'Look at the shiny red apple! A-P-P-L-E, apple! Crunch crunch!',
    gradient: 'from-red-500 via-rose-500 to-red-600',
    borderColor: 'border-red-300',
    badge: '🍎 Sweet Apple'
  },
  ball: {
    word: 'Ball',
    emoji: '⚽',
    phonics: '/b/ · /ɔː/ · /l/',
    category: 'object',
    animation: 'bounce-gentle',
    funSound: 'Bouncy soccer ball!',
    spokenHint: 'Look at the bouncy ball! B-A-L-L, ball! Kick and score!',
    gradient: 'from-slate-200 via-slate-300 to-slate-400',
    borderColor: 'border-slate-300',
    badge: '⚽ Bouncy Ball'
  },
  bell: {
    word: 'Bell',
    emoji: '🔔',
    phonics: '/b/ · /e/ · /l/',
    category: 'object',
    animation: 'wiggle',
    funSound: 'Ding dong ringing bell!',
    spokenHint: 'Look at the golden chime bell! B-E-L-L, bell! Ding dong!',
    gradient: 'from-amber-400 via-yellow-400 to-amber-500',
    borderColor: 'border-amber-300',
    badge: '✨ Golden Bell'
  },
  bird: {
    word: 'Bird',
    emoji: '🐦',
    phonics: '/b/ · /ɜːr/ · /d/',
    category: 'animal',
    animation: 'hop',
    funSound: 'Chirp chirp singing bluebird!',
    spokenHint: 'Look at the sweet bluebird! B-I-R-D, bird! Chirp chirp!',
    gradient: 'from-sky-400 via-cyan-400 to-blue-500',
    borderColor: 'border-sky-300',
    badge: '🪶 Singing Bird'
  },
  cake: {
    word: 'Cake',
    emoji: '🎂',
    phonics: '/k/ · /eɪ/ · /k/',
    category: 'food',
    animation: 'pulse-gentle',
    funSound: 'Delicious birthday cake!',
    spokenHint: 'Look at the frosted party cake! C-A-K-E, cake! Yummy!',
    gradient: 'from-pink-400 via-purple-400 to-rose-400',
    borderColor: 'border-pink-300',
    badge: '🍰 Party Cake'
  },
  drum: {
    word: 'Drum',
    emoji: '🥁',
    phonics: '/d/ · /r/ · /ʌ/ · /m/',
    category: 'object',
    animation: 'bounce-gentle',
    funSound: 'Boom-tat-tat marching drum!',
    spokenHint: 'Look at the parade drum! D-R-U-M, drum! Rum-pum-pum!',
    gradient: 'from-red-500 via-amber-500 to-yellow-500',
    borderColor: 'border-amber-400',
    badge: '🎵 Beat Drum'
  },
  egg: {
    word: 'Egg',
    emoji: '🥚',
    phonics: '/e/ · /g/',
    category: 'food',
    animation: 'wiggle',
    funSound: 'Crack crack little surprise egg!',
    spokenHint: 'Look at the speckled egg! E-G-G, egg! What is hatching?',
    gradient: 'from-amber-100 via-slate-100 to-amber-200',
    borderColor: 'border-amber-200',
    badge: '🪺 Nest Egg'
  },
  gift: {
    word: 'Gift',
    emoji: '🎁',
    phonics: '/g/ · /ɪ/ · /f/ · /t/',
    category: 'object',
    animation: 'bounce-gentle',
    funSound: 'Surprise gift with a golden bow!',
    spokenHint: 'Look at the mystery gift box! G-I-F-T, gift! A special surprise!',
    gradient: 'from-purple-500 via-pink-500 to-red-400',
    borderColor: 'border-pink-300',
    badge: '🎀 Surprise Gift'
  },
  lion: {
    word: 'Lion',
    emoji: '🦁',
    phonics: '/l/ · /aɪ/ · /ə/ · /n/',
    category: 'animal',
    animation: 'tail-wag',
    funSound: 'Mighty brave king of the jungle!',
    spokenHint: 'Look at the brave golden lion! L-I-O-N, lion! Roar!',
    gradient: 'from-amber-500 via-yellow-500 to-orange-600',
    borderColor: 'border-amber-300',
    badge: '👑 Brave Lion'
  },
  moon: {
    word: 'Moon',
    emoji: '🌙',
    phonics: '/m/ · /uː/ · /n/',
    category: 'nature',
    animation: 'float',
    funSound: 'Glowing crescent moon at night!',
    spokenHint: 'Look at the glowing night moon! M-O-O-N, moon! Sleep tight!',
    gradient: 'from-indigo-600 via-sky-500 to-blue-700',
    borderColor: 'border-sky-300',
    badge: '⭐ Night Moon'
  },
  nest: {
    word: 'Nest',
    emoji: '🪺',
    phonics: '/n/ · /e/ · /s/ · /t/',
    category: 'nature',
    animation: 'pulse-gentle',
    funSound: 'Cozy treetop bird nest!',
    spokenHint: 'Look at the cozy bird nest! N-E-S-T, nest!',
    gradient: 'from-amber-700 via-yellow-700 to-amber-800',
    borderColor: 'border-amber-400',
    badge: '🌿 Cozy Nest'
  },
  owl: {
    word: 'Owl',
    emoji: '🦉',
    phonics: '/aʊ/ · /l/',
    category: 'animal',
    animation: 'wiggle',
    funSound: 'Hoot hoot wise night owl!',
    spokenHint: 'Look at the wise flying owl! O-W-L, owl! Hoot hoot!',
    gradient: 'from-amber-800 via-purple-900 to-slate-800',
    borderColor: 'border-amber-400',
    badge: '🌲 Wise Owl'
  },
  ring: {
    word: 'Ring',
    emoji: '💍',
    phonics: '/r/ · /ɪ/ · /ŋ/',
    category: 'object',
    animation: 'spin-slow',
    funSound: 'Sparkling diamond ring!',
    spokenHint: 'Look at the shiny diamond ring! R-I-N-G, ring! Sparkle sparkle!',
    gradient: 'from-cyan-400 via-blue-400 to-indigo-500',
    borderColor: 'border-cyan-300',
    badge: '💎 Shiny Ring'
  },
  ship: {
    word: 'Ship',
    emoji: '🚢',
    phonics: '/ʃ/ · /ɪ/ · /p/',
    category: 'object',
    animation: 'float',
    funSound: 'Toot toot ocean cruise ship!',
    spokenHint: 'Look at the giant ocean ship! S-H-I-P, ship! All aboard!',
    gradient: 'from-blue-600 via-indigo-600 to-teal-500',
    borderColor: 'border-cyan-400',
    badge: '⚓ Ocean Ship'
  },
  tree: {
    word: 'Tree',
    emoji: '🌲',
    phonics: '/t/ · /r/ · /iː/',
    category: 'nature',
    animation: 'wiggle',
    funSound: 'Tall leafy evergreen tree!',
    spokenHint: 'Look at the tall green tree! T-R-E-E, tree!',
    gradient: 'from-emerald-600 via-green-600 to-teal-700',
    borderColor: 'border-emerald-400',
    badge: '🌲 Green Tree'
  },
  van: {
    word: 'Van',
    emoji: '🚐',
    phonics: '/v/ · /æ/ · /n/',
    category: 'object',
    animation: 'bounce-gentle',
    funSound: 'Vroom vroom road trip camper van!',
    spokenHint: 'Look at the family adventure van! V-A-N, van! Vroom vroom!',
    gradient: 'from-teal-500 via-emerald-600 to-cyan-600',
    borderColor: 'border-teal-300',
    badge: '🛣️ Adventure Van'
  },
  whale: {
    word: 'Whale',
    emoji: '🐋',
    phonics: '/w/ · /eɪ/ · /l/',
    category: 'animal',
    animation: 'float',
    funSound: 'Whoosh! Spouting giant blue whale!',
    spokenHint: 'Look at the giant ocean whale! W-H-A-L-E, whale! Whoosh!',
    gradient: 'from-blue-500 via-indigo-600 to-cyan-500',
    borderColor: 'border-cyan-300',
    badge: '🌊 Blue Whale'
  },
  yak: {
    word: 'Yak',
    emoji: '🐂',
    phonics: '/j/ · /æ/ · /k/',
    category: 'animal',
    animation: 'bounce-gentle',
    funSound: 'Fluffy mountain yak!',
    spokenHint: 'Look at the shaggy horned yak! Y-A-K, yak!',
    gradient: 'from-amber-800 via-stone-800 to-yellow-900',
    borderColor: 'border-amber-400',
    badge: '🏔️ Mountain Yak'
  },
  zebra: {
    word: 'Zebra',
    emoji: '🦓',
    phonics: '/z/ · /e/ · /b/ · /r/ · /ə/',
    category: 'animal',
    animation: 'bounce-gentle',
    funSound: 'Galloping black-and-white striped zebra!',
    spokenHint: 'Look at the striped safari zebra! Z-E-B-R-A, zebra! Clip clop!',
    gradient: 'from-slate-700 via-slate-800 to-zinc-900',
    borderColor: 'border-slate-300',
    badge: '🌍 Striped Zebra'
  },
  // Single Letter Alphabet Phonics Visual Associations
  a: {
    word: 'Apple',
    emoji: '🍎',
    phonics: '/æ/ · Short A',
    category: 'food',
    animation: 'bounce-gentle',
    funSound: 'A is for Apple! Ah-ah-apple!',
    spokenHint: 'Letter A makes the sound ah like apple! 🍎',
    gradient: 'from-red-500 to-rose-600',
    borderColor: 'border-red-400',
    badge: 'Letter A'
  },
  b: {
    word: 'Bear',
    emoji: '🐻',
    phonics: '/b/ · B',
    category: 'animal',
    animation: 'bounce-gentle',
    funSound: 'B is for Bear! Buh-buh-bear!',
    spokenHint: 'Letter B makes the bouncy sound buh like bear! 🐻',
    gradient: 'from-amber-600 to-yellow-700',
    borderColor: 'border-amber-400',
    badge: 'Letter B'
  },
  c: {
    word: 'Cat',
    emoji: '🐱',
    phonics: '/k/ · C',
    category: 'animal',
    animation: 'wiggle',
    funSound: 'C is for Cat! Kuh-kuh-cat!',
    spokenHint: 'Letter C makes the clicking sound kuh like cat! 🐱',
    gradient: 'from-amber-400 to-orange-500',
    borderColor: 'border-amber-300',
    badge: 'Letter C'
  },
  d: {
    word: 'Dog',
    emoji: '🐶',
    phonics: '/d/ · D',
    category: 'animal',
    animation: 'tail-wag',
    funSound: 'D is for Dog! Duh-duh-dog!',
    spokenHint: 'Letter D makes the tapping sound duh like dog! 🐶',
    gradient: 'from-amber-500 to-orange-600',
    borderColor: 'border-amber-400',
    badge: 'Letter D'
  },
  e: {
    word: 'Elephant',
    emoji: '🐘',
    phonics: '/e/ · Short E',
    category: 'animal',
    animation: 'pulse-gentle',
    funSound: 'E is for Elephant! Eh-eh-elephant!',
    spokenHint: 'Letter E makes the sound eh like elephant! 🐘',
    gradient: 'from-indigo-400 to-blue-500',
    borderColor: 'border-indigo-300',
    badge: 'Letter E'
  },
  f: {
    word: 'Fish',
    emoji: '🐟',
    phonics: '/f/ · F',
    category: 'animal',
    animation: 'float',
    funSound: 'F is for Fish! Fff-fff-fish!',
    spokenHint: 'Letter F makes the breezy sound fff like fish! 🐟',
    gradient: 'from-cyan-400 to-blue-500',
    borderColor: 'border-cyan-300',
    badge: 'Letter F'
  },
  g: {
    word: 'Grapes',
    emoji: '🍇',
    phonics: '/g/ · G',
    category: 'food',
    animation: 'bounce-gentle',
    funSound: 'G is for Grapes! Guh-guh-grapes!',
    spokenHint: 'Letter G makes the sound guh like grapes! 🍇',
    gradient: 'from-purple-500 to-indigo-600',
    borderColor: 'border-purple-400',
    badge: 'Letter G'
  },
  h: {
    word: 'Hat',
    emoji: '🎩',
    phonics: '/h/ · H',
    category: 'object',
    animation: 'float',
    funSound: 'H is for Hat! Huh-huh-hat!',
    spokenHint: 'Letter H makes the breathing sound huh like hat! 🎩',
    gradient: 'from-purple-600 to-indigo-700',
    borderColor: 'border-purple-400',
    badge: 'Letter H'
  },
  i: {
    word: 'Igloo',
    emoji: '🧊',
    phonics: '/ɪ/ · Short I',
    category: 'nature',
    animation: 'pulse-gentle',
    funSound: 'I is for Igloo! Ih-ih-igloo!',
    spokenHint: 'Letter I makes the sound ih like igloo! 🧊',
    gradient: 'from-sky-400 to-cyan-500',
    borderColor: 'border-sky-300',
    badge: 'Letter I'
  },
  j: {
    word: 'Juice',
    emoji: '🧃',
    phonics: '/dʒ/ · J',
    category: 'food',
    animation: 'bounce-gentle',
    funSound: 'J is for Juice! Juh-juh-juice!',
    spokenHint: 'Letter J makes the jumping sound juh like juice! 🧃',
    gradient: 'from-orange-400 to-amber-500',
    borderColor: 'border-orange-300',
    badge: 'Letter J'
  },
  k: {
    word: 'Kite',
    emoji: '🪁',
    phonics: '/k/ · K',
    category: 'object',
    animation: 'float',
    funSound: 'K is for Kite! Kuh-kuh-kite!',
    spokenHint: 'Letter K makes the clicking sound kuh like kite! 🪁',
    gradient: 'from-rose-400 to-pink-500',
    borderColor: 'border-rose-300',
    badge: 'Letter K'
  },
  l: {
    word: 'Lion',
    emoji: '🦁',
    phonics: '/l/ · L',
    category: 'animal',
    animation: 'tail-wag',
    funSound: 'L is for Lion! Lll-lll-lion!',
    spokenHint: 'Letter L makes the sound lll like lion! 🦁',
    gradient: 'from-amber-400 to-yellow-500',
    borderColor: 'border-amber-300',
    badge: 'Letter L'
  },
  m: {
    word: 'Moon',
    emoji: '🌙',
    phonics: '/m/ · M',
    category: 'nature',
    animation: 'float',
    funSound: 'M is for Moon! Mmm-mmm-moon!',
    spokenHint: 'Letter M makes the humming sound mmm like moon! 🌙',
    gradient: 'from-indigo-500 to-purple-600',
    borderColor: 'border-indigo-300',
    badge: 'Letter M'
  },
  n: {
    word: 'Nest',
    emoji: '🪺',
    phonics: '/n/ · N',
    category: 'nature',
    animation: 'pulse-gentle',
    funSound: 'N is for Nest! Nnn-nnn-nest!',
    spokenHint: 'Letter N makes the sound nnn like nest! 🪺',
    gradient: 'from-amber-600 to-yellow-700',
    borderColor: 'border-amber-400',
    badge: 'Letter N'
  },
  o: {
    word: 'Octopus',
    emoji: '🐙',
    phonics: '/ɒ/ · Short O',
    category: 'animal',
    animation: 'wiggle',
    funSound: 'O is for Octopus! Ah-ah-octopus!',
    spokenHint: 'Letter O makes the sound ah like octopus! 🐙',
    gradient: 'from-purple-500 to-pink-500',
    borderColor: 'border-purple-300',
    badge: 'Letter O'
  },
  p: {
    word: 'Pig',
    emoji: '🐷',
    phonics: '/p/ · P',
    category: 'animal',
    animation: 'bounce-gentle',
    funSound: 'P is for Pig! Puh-puh-pig!',
    spokenHint: 'Letter P makes the popping sound puh like pig! 🐷',
    gradient: 'from-pink-400 to-rose-400',
    borderColor: 'border-pink-300',
    badge: 'Letter P'
  },
  q: {
    word: 'Queen',
    emoji: '👑',
    phonics: '/kw/ · Q',
    category: 'object',
    animation: 'pulse-gentle',
    funSound: 'Q is for Queen! Kw-kw-queen!',
    spokenHint: 'Letter Q makes the sound kw like queen! 👑',
    gradient: 'from-amber-400 to-yellow-500',
    borderColor: 'border-amber-300',
    badge: 'Letter Q'
  },
  r: {
    word: 'Rocket',
    emoji: '🚀',
    phonics: '/r/ · R',
    category: 'object',
    animation: 'bounce-gentle',
    funSound: 'R is for Rocket! Rrr-rrr-rocket!',
    spokenHint: 'Letter R makes the rolling sound rrr like rocket! 🚀',
    gradient: 'from-red-500 to-amber-500',
    borderColor: 'border-red-300',
    badge: 'Letter R'
  },
  s: {
    word: 'Sun',
    emoji: '☀️',
    phonics: '/s/ · S',
    category: 'nature',
    animation: 'spin-slow',
    funSound: 'S is for Sun! Sss-sss-sun!',
    spokenHint: 'Letter S makes the hissing sound sss like sun! ☀️',
    gradient: 'from-amber-400 to-yellow-400',
    borderColor: 'border-amber-300',
    badge: 'Letter S'
  },
  t: {
    word: 'Tree',
    emoji: '🌲',
    phonics: '/t/ · T',
    category: 'nature',
    animation: 'wiggle',
    funSound: 'T is for Tree! Tuh-tuh-tree!',
    spokenHint: 'Letter T makes the crisp sound tuh like tree! 🌲',
    gradient: 'from-emerald-500 to-green-600',
    borderColor: 'border-emerald-300',
    badge: 'Letter T'
  },
  u: {
    word: 'Umbrella',
    emoji: '☂️',
    phonics: '/ʌ/ · Short U',
    category: 'object',
    animation: 'float',
    funSound: 'U is for Umbrella! Uh-uh-umbrella!',
    spokenHint: 'Letter U makes the sound uh like umbrella! ☂️',
    gradient: 'from-purple-500 to-indigo-600',
    borderColor: 'border-purple-300',
    badge: 'Letter U'
  },
  v: {
    word: 'Van',
    emoji: '🚐',
    phonics: '/v/ · V',
    category: 'object',
    animation: 'bounce-gentle',
    funSound: 'V is for Van! Vvv-vvv-van!',
    spokenHint: 'Letter V makes the vibrating sound vvv like van! 🚐',
    gradient: 'from-teal-400 to-emerald-500',
    borderColor: 'border-teal-300',
    badge: 'Letter V'
  },
  w: {
    word: 'Whale',
    emoji: '🐋',
    phonics: '/w/ · W',
    category: 'animal',
    animation: 'float',
    funSound: 'W is for Whale! Wuh-wuh-whale!',
    spokenHint: 'Letter W makes the sound wuh like whale! 🐋',
    gradient: 'from-cyan-500 to-blue-600',
    borderColor: 'border-cyan-300',
    badge: 'Letter W'
  },
  x: {
    word: 'Fox',
    emoji: '🦊',
    phonics: '/ks/ · X',
    category: 'animal',
    animation: 'bounce-gentle',
    funSound: 'X as in Fox! Ks-ks-fox!',
    spokenHint: 'Letter X makes the sound ks like in fox! 🦊',
    gradient: 'from-orange-500 to-amber-600',
    borderColor: 'border-orange-400',
    badge: 'Letter X'
  },
  y: {
    word: 'Yarn',
    emoji: '🧶',
    phonics: '/j/ · Y',
    category: 'object',
    animation: 'wiggle',
    funSound: 'Y is for Yarn! Yuh-yuh-yarn!',
    spokenHint: 'Letter Y makes the sound yuh like yarn! 🧶',
    gradient: 'from-pink-400 to-rose-500',
    borderColor: 'border-pink-300',
    badge: 'Letter Y'
  },
  z: {
    word: 'Zebra',
    emoji: '🦓',
    phonics: '/z/ · Z',
    category: 'animal',
    animation: 'bounce-gentle',
    funSound: 'Z is for Zebra! Zzz-zzz-zebra!',
    spokenHint: 'Letter Z makes the buzzing sound zzz like zebra! 🦓',
    gradient: 'from-slate-600 to-zinc-800',
    borderColor: 'border-slate-300',
    badge: 'Letter Z'
  },
  // Digraphs & Blends
  sh: {
    word: 'Ship',
    emoji: '🚢',
    phonics: '/ʃ/ · Digraph SH',
    category: 'object',
    animation: 'float',
    funSound: 'SH says shhh like ship!',
    spokenHint: 'Shh! Digraph SH makes the quiet sound like ship! 🚢',
    gradient: 'from-blue-600 to-cyan-600',
    borderColor: 'border-cyan-300',
    badge: 'Digraph SH'
  },
  ch: {
    word: 'Chick',
    emoji: '🐥',
    phonics: '/tʃ/ · Digraph CH',
    category: 'animal',
    animation: 'hop',
    funSound: 'CH says ch-ch-ch like baby chick!',
    spokenHint: 'Chirp! Digraph CH makes the sound ch like chick! 🐥',
    gradient: 'from-yellow-400 to-amber-500',
    borderColor: 'border-yellow-300',
    badge: 'Digraph CH'
  },
  th: {
    word: 'Thunder',
    emoji: '⚡',
    phonics: '/θ/ or /ð/ · Digraph TH',
    category: 'nature',
    animation: 'pulse-gentle',
    funSound: 'TH says thhh like thunder!',
    spokenHint: 'Tongue between your teeth! TH makes the sound th like thunder! ⚡',
    gradient: 'from-amber-400 to-indigo-600',
    borderColor: 'border-amber-300',
    badge: 'Digraph TH'
  },
  wh: {
    word: 'Whale',
    emoji: '🐋',
    phonics: '/w/ · Digraph WH',
    category: 'animal',
    animation: 'float',
    funSound: 'WH says wh-wh-whale!',
    spokenHint: 'Blow gently! WH makes the sound wh like whale! 🐋',
    gradient: 'from-cyan-400 to-blue-600',
    borderColor: 'border-cyan-300',
    badge: 'Digraph WH'
  }
};

/**
 * Intelligently extracts or discovers the best picture clue for any game challenge
 */
export function getPictureClue(params: {
  targetSound?: string;
  word?: string;
  instruction?: string;
  soundCue?: string;
  builderTarget?: string;
  stageNumber?: number;
  landId?: string;
}): PhonicsPictureClue {
  const { targetSound = '', word = '', instruction = '', soundCue = '', builderTarget = '' } = params;

  // 1. Direct word checks
  const candidates = [
    builderTarget,
    word,
    targetSound,
    soundCue,
    instruction
  ];

  for (const c of candidates) {
    if (!c) continue;
    const clean = c.toLowerCase().trim();

    // Direct dictionary key match
    if (PHONICS_PICTURE_DICTIONARY[clean]) {
      return PHONICS_PICTURE_DICTIONARY[clean];
    }

    // Word boundary search inside text (e.g. "sound like dog", "ah as in apple", "build: DOG")
    for (const [key, clue] of Object.entries(PHONICS_PICTURE_DICTIONARY)) {
      const regex = new RegExp(`\\b${key}\\b`, 'i');
      if (regex.test(clean)) {
        return clue;
      }
    }
  }

  // 2. Letter sound matching (e.g. "A /æ/", "B /b/", "Letter C", "/k/")
  const letterMatch = targetSound.match(/^([a-zA-Z])(?:\s|\/|$)/);
  if (letterMatch && letterMatch[1]) {
    const singleLetter = letterMatch[1].toLowerCase();
    if (PHONICS_PICTURE_DICTIONARY[singleLetter]) {
      return PHONICS_PICTURE_DICTIONARY[singleLetter];
    }
  }

  // 3. Fallback cute star treasure clue
  return {
    word: builderTarget || targetSound || 'Phonics Sparkle',
    emoji: '⭐',
    phonics: targetSound || 'Sound Clue',
    category: 'nature',
    animation: 'bounce-gentle',
    funSound: 'Sparkling Phonics Clue!',
    spokenHint: `Listen closely: ${soundCue || targetSound || instruction}!`,
    gradient: 'from-amber-400 via-yellow-400 to-orange-400',
    borderColor: 'border-amber-300',
    badge: '✨ Star Clue'
  };
}
