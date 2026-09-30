import { GradeLevel, LandId } from '../types/character';

export interface ProposalRealmCurriculum {
  realmId: LandId;
  realmNumber: number | string;
  name: string;
  ageBracket: string;
  minAge: number;
  maxAge: number;
  gradeEquivalent: string;
  mappedGradeLevel: GradeLevel;
  ageTier: 'preschool' | 'kindergarten' | 'early-elementary' | 'late-elementary' | 'middle-high' | 'collegiate' | 'doctoral';
  subtitle: string;
  lore: string;
  mechanics: string[];
  sampleQuest: string;
  curriculumFocus: string[];
  biomeTheme: string;
  color: string;
  runeIcon: string;
}

export const PROPOSAL_REALMS_CURRICULUM: ProposalRealmCurriculum[] = [
  {
    realmId: 'sound-shallows',
    realmNumber: 1,
    name: 'Sound Shallows',
    ageBracket: 'Ages 3–6',
    minAge: 3,
    maxAge: 6,
    gradeEquivalent: 'Pre-K to Kindergarten',
    mappedGradeLevel: 'Kindergarten',
    ageTier: 'preschool',
    subtitle: 'Auditory Processing & Phonemic Resonance',
    lore: 'A bioluminescent coastal archipelago where every pebble echoes with fundamental acoustic frequencies. Young navigators sculpt phonetic sandbars and attune crystal chimes to phoneme resonance.',
    mechanics: [
      'Speech resonance crystal attunement',
      'Sandpaper letter voxel sculpting',
      'Phonemic sound isolation & rhyming bays',
      'Alliteration tide pool exploration'
    ],
    sampleQuest: 'Tide of the First Consonants: Align 3 tuning crystals to /m/, /s/, and /t/ to calm the Whispering Surf.',
    curriculumFocus: [
      'Phonemic Awareness',
      'Oral Blending',
      'Letter-Sound Formations',
      'Auditory Discrimination'
    ],
    biomeTheme: 'Bioluminescent Coral Lagoons & Sandstone Caves',
    color: '#06b6d4',
    runeIcon: '🌊'
  },
  {
    realmId: 'builders-guild',
    realmNumber: 2,
    name: 'Builders Guild',
    ageBracket: 'Ages 6–9',
    minAge: 6,
    maxAge: 9,
    gradeEquivalent: 'Early Elementary (Grades 1–3)',
    mappedGradeLevel: 'Grade 2',
    ageTier: 'early-elementary',
    subtitle: 'Orthographic Forging & Syllable Slicing',
    lore: 'A bustling medieval quarry and foundry where raw consonant ores and molten vowel gems are smelted on magical anvils to forge structural tools and armor.',
    mechanics: [
      'Phonics Forge block smelting',
      'CVC mining & closed-syllable masonry',
      'Vowel team gem synthesizers (oa, ea, ai)',
      'Multisyllabic dungeon slicing blades'
    ],
    sampleQuest: 'The Molten Anvil: Smelt /k/ + /æ/ + /t/ to forge the Shadow Panther Mace, then slice compound words to breach the Gate of Frost.',
    curriculumFocus: [
      'Systematic Synthetic Phonics',
      'Orthographic Mapping',
      'Digraphs & Blends',
      'Syllable Division (Rabbit/Tiger/Camel)'
    ],
    biomeTheme: 'Voxel Stone Quarries & Molten Crystal Forges',
    color: '#10b981',
    runeIcon: '⚒️'
  },
  {
    realmId: 'tricky-trails',
    realmNumber: 3,
    name: 'Tricky Trails',
    ageBracket: 'Ages 8–11',
    minAge: 8,
    maxAge: 11,
    gradeEquivalent: 'Upper Elementary (Grades 3–5)',
    mappedGradeLevel: 'Grade 4',
    ageTier: 'late-elementary',
    subtitle: 'Irregular Heart-Words & Fluency Minecarts',
    lore: 'A treacherous labyrinth of twisting canyons and runaway railtracks. Rule-breaking words lurk in the mist; players must memorially anchor heart-words into their cognitive satchels to operate high-speed transit carts.',
    mechanics: [
      'Irregular heart-word labyrinth pathfinding',
      'Fluency pacing minecarts (timed decoding loops)',
      'Homophone mirror puzzles (there/their/they’re)',
      'Rapid automatic naming (RAN) agility gauntlets'
    ],
    sampleQuest: 'The Runaway Heart-Cart: Read and unlock 20 sight-word switches before your minecart enters the Void Chasm.',
    curriculumFocus: [
      'Sight Recognition by Orthographic Mapping',
      'Fluency Pacing (WPM)',
      'High-Frequency Irregularities',
      'Context Clues'
    ],
    biomeTheme: 'Winding Redwood Canyons & Deep Rail Mines',
    color: '#f59e0b',
    runeIcon: '🛤️'
  },
  {
    realmId: 'whispering-peaks',
    realmNumber: 4,
    name: 'Whispering Peaks',
    ageBracket: 'Ages 11–14',
    minAge: 11,
    maxAge: 14,
    gradeEquivalent: 'Middle School (Grades 6–8)',
    mappedGradeLevel: 'Grade 7',
    ageTier: 'middle-high',
    subtitle: 'Linguistic Archaeology & Root Extraction',
    lore: 'Ancient cloud-piercing mountain sanctuaries built atop Greco-Roman foundations. Explorers unearth ancient petrified affixes and roots to enchant high-tier flight gear.',
    mechanics: [
      'Greek & Latin root extraction pickaxes (chron, tele, bio)',
      'Prefix & suffix transmutation sockets (un-, dis-, -ology)',
      'Morphological family tree reconstruction',
      'Etymological archaeology dungeons'
    ],
    sampleQuest: 'Excavation of Chronos: Extract the root CHRON- and fuse with SYN- and -IC to synthesize an artifact that slows boss combat time.',
    curriculumFocus: [
      'Morphology & Etymology',
      'Greek & Latin Stems',
      'Academic Vocabulary (Tier 2/3)',
      'Connotative Analysis'
    ],
    biomeTheme: 'Marble Cloud Temples & Ancient Voxel Obelisks',
    color: '#8b5cf6',
    runeIcon: '🏛️'
  },
  {
    realmId: 'lexicon-empire',
    realmNumber: 5,
    name: 'Lexicon Empire',
    ageBracket: 'Ages 14–18',
    minAge: 14,
    maxAge: 18,
    gradeEquivalent: 'High School Endgame (Grades 9–12)',
    mappedGradeLevel: 'Grade 10',
    ageTier: 'middle-high',
    subtitle: 'Clausal Architecture & Dialectic Arenas',
    lore: 'The apex imperial capital powered by intricate syntax grids. Citizens engage in real-time rhetorical combat, building clausal fortresses and identifying logical fallacies to govern city-states.',
    mechanics: [
      'Clausal power grid wiring (dependent/independent switches)',
      'Dialectic colosseum rhetoric battles',
      'Logical fallacy disarming mini-games',
      'Formal rhetorical essay fortress synthesis'
    ],
    sampleQuest: 'The Senate Debate: Disarm an opponent’s Straw Man defense using a subordinate clause counter-shield to win the Golden Seal.',
    curriculumFocus: [
      'Advanced Syntax & Semantics',
      'Rhetorical Analysis (Ethos/Pathos/Logos)',
      'Logical Fallacies',
      'Collegiate Writing Rigor'
    ],
    biomeTheme: 'High-Tech Obsidian & Gold Imperial Citadels',
    color: '#ec4899',
    runeIcon: '👑'
  },
  {
    realmId: 'phonixia-academy',
    realmNumber: 'PG-1',
    name: 'Phonixia Academy',
    ageBracket: 'Collegiate & Adult (Ages 18–24)',
    minAge: 18,
    maxAge: 24,
    gradeEquivalent: 'Undergraduate & Pre-Law/Linguistics',
    mappedGradeLevel: 'College',
    ageTier: 'collegiate',
    subtitle: 'Collegiate Linguistics, IPA & Classical Rhetoric',
    lore: 'The floating ivory towers above the imperial capital. Adult scholars dissect generative syntax trees, transcribe world speech in the International Phonetic Alphabet (IPA), and debate in formal parliamentary colosseums.',
    mechanics: [
      'IPA phonetic transcription soundboard puzzles',
      'Generative grammar syntax tree parsing engines',
      'Historical sound shift simulations (Grimm’s Law & Great Vowel Shift)',
      'Forensic parliamentary debate trials'
    ],
    sampleQuest: 'Acoustic Spectrography: Construct a complete generative syntax tree for a 40-word complex compound sentence to earn the Dean’s Laurel.',
    curriculumFocus: [
      'Phonetics & Phonology',
      'Generative Syntax',
      'Diachronic Linguistics',
      'Aristotelian Forensic Rhetoric'
    ],
    biomeTheme: 'Floating Marble Spires & Resonant Crystal Amphitheaters',
    color: '#3b82f6',
    runeIcon: '🎓'
  },
  {
    realmId: 'masters-pathways',
    realmNumber: 'PG-2',
    name: 'Master\'s Pathways & Celestial Archives',
    ageBracket: 'Graduate & Lifelong (Ages 25+)',
    minAge: 25,
    maxAge: 99,
    gradeEquivalent: 'Master\'s & Doctoral Research',
    mappedGradeLevel: 'Graduate School',
    ageTier: 'doctoral',
    subtitle: 'Clinical Pedagogy, Investigative Writing & Neuro-Research',
    lore: 'The deep inner chambers where practitioners conduct clinical reading trials, draft high-stakes legal briefs, and mentor apprentice scribes in structured literacy.',
    mechanics: [
      'Clinical UDL reading intervention simulator',
      'Neuroimaging fMRI reading brain mapping puzzles',
      'Investigative journalism source forensics',
      'Endangered language phoneme preservation archives'
    ],
    sampleQuest: 'Clinical Intervention Practicum: Diagnose and resolve severe phonological dyslexia in 10 virtual apprentices using multisensory touch cues.',
    curriculumFocus: [
      'Structured Literacy Pedagogy',
      'Universal Design for Learning (UDL)',
      'Psycholinguistics RCTs',
      'Diachronic Phonology'
    ],
    biomeTheme: 'Subterranean Scribe Vaults & Illuminated Scriptoria',
    color: '#a855f7',
    runeIcon: '🌌'
  }
];

export function getProposalCurriculumForAge(ageInput: number | string): ProposalRealmCurriculum {
  const age = typeof ageInput === 'string' ? parseInt(ageInput, 10) || 5 : ageInput;

  if (age <= 5) return PROPOSAL_REALMS_CURRICULUM[0]; // Sound Shallows (3-6)
  if (age <= 8) return PROPOSAL_REALMS_CURRICULUM[1]; // Builders Guild (6-9)
  if (age <= 11) return PROPOSAL_REALMS_CURRICULUM[2]; // Tricky Trails (8-11)
  if (age <= 14) return PROPOSAL_REALMS_CURRICULUM[3]; // Whispering Peaks (11-14)
  if (age <= 18) return PROPOSAL_REALMS_CURRICULUM[4]; // Lexicon Empire (14-18)
  if (age <= 24) return PROPOSAL_REALMS_CURRICULUM[5]; // Phonixia Academy (18-24)
  return PROPOSAL_REALMS_CURRICULUM[6]; // Master's Pathways & Celestial Archives (25+)
}

export function mapAgeToCurriculumParameters(ageInput: number | string) {
  const age = typeof ageInput === 'string' ? parseInt(ageInput, 10) || 5 : ageInput;
  const curriculum = getProposalCurriculumForAge(age);

  let specificGrade: GradeLevel = curriculum.mappedGradeLevel;
  if (age <= 3) specificGrade = 'PreK3';
  else if (age === 4) specificGrade = 'PreK4';
  else if (age === 5 || age === 6) specificGrade = 'Kindergarten';
  else if (age === 7) specificGrade = 'Grade 1';
  else if (age === 8) specificGrade = 'Grade 2';
  else if (age === 9) specificGrade = 'Grade 3';
  else if (age === 10) specificGrade = 'Grade 4';
  else if (age === 11) specificGrade = 'Grade 5';
  else if (age === 12) specificGrade = 'Grade 6';
  else if (age === 13) specificGrade = 'Grade 7';
  else if (age === 14) specificGrade = 'Grade 8';
  else if (age === 15) specificGrade = 'Grade 9';
  else if (age === 16) specificGrade = 'Grade 10';
  else if (age === 17) specificGrade = 'Grade 11';
  else if (age === 18) specificGrade = 'Grade 12';
  else if (age <= 24) specificGrade = 'College';
  else if (age <= 30) specificGrade = 'Graduate School';
  else specificGrade = 'Adult Lifelong Learning';

  // Build unlocked lands up to mapped realm
  const unlockedLandScores: Record<string, { completedGamesCount: number; stars: number; unlocked: boolean }> = {
    'sound-shallows': { completedGamesCount: 0, stars: 0, unlocked: true },
    'builders-guild': { completedGamesCount: 0, stars: 0, unlocked: false },
    'tricky-trails': { completedGamesCount: 0, stars: 0, unlocked: false },
    'whispering-peaks': { completedGamesCount: 0, stars: 0, unlocked: false },
    'lexicon-empire': { completedGamesCount: 0, stars: 0, unlocked: false },
    'phonixia-academy': { completedGamesCount: 0, stars: 0, unlocked: false },
    'masters-pathways': { completedGamesCount: 0, stars: 0, unlocked: false },
    'celestial-archives': { completedGamesCount: 0, stars: 0, unlocked: false },
  };

  const realmOrder: LandId[] = [
    'sound-shallows',
    'builders-guild',
    'tricky-trails',
    'whispering-peaks',
    'lexicon-empire',
    'phonixia-academy',
    'masters-pathways',
    'celestial-archives'
  ];

  const targetIndex = realmOrder.indexOf(curriculum.realmId);
  realmOrder.forEach((r, idx) => {
    if (idx <= targetIndex) {
      unlockedLandScores[r] = {
        completedGamesCount: idx < targetIndex ? 50 : 0,
        stars: idx < targetIndex ? 150 : 0,
        unlocked: true
      };
    }
  });

  return {
    age,
    ageTier: curriculum.ageTier,
    gradeLevel: specificGrade,
    startingLand: curriculum.realmId,
    realmName: curriculum.name,
    activeContinentName: curriculum.name,
    proposalRealm: curriculum,
    subtitle: curriculum.subtitle,
    curriculumFocus: curriculum.curriculumFocus,
    sampleQuest: curriculum.sampleQuest,
    mechanics: curriculum.mechanics,
    unlockedLandScores
  };
}
