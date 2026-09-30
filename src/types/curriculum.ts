import { LandId, GradeLevel } from './character';

export type GameType = 
  | 'SOUND_MATCH' 
  | 'WORD_BUILDER' 
  | 'RHYME_RUSH' 
  | 'RULE_DETECTIVE' 
  | 'ROOT_LAB' 
  | 'SYLLABLE_SPLIT' 
  | 'MAGIC_E' 
  | 'SIGHT_BRIDGE'
  | 'ORTHOGRAPHIC_MAP'
  | 'SYNTAX_COLOSSEUM'
  | 'DEBATE_CHAMBER'
  | 'ACADEMY_RESEARCH'
  | 'DISSERTATION_DEFENSE';

export interface PhonemeChunk {
  text: string;
  category: 'consonant' | 'short-vowel' | 'long-vowel' | 'vowel-team' | 'digraph' | 'blend' | 'r-controlled' | 'silent' | 'heart-part';
  sound: string;
  isIrregularHeartPart?: boolean;
}

export interface GameChallenge {
  id: string;
  gameNumber: number; // 1 to 50
  type: GameType;
  title: string;
  prompt: string;
  targetSoundOrWord: string;
  spokenAudioText: string;
  phonicsRuleTip: string;
  options: string[];
  correctAnswer: string | string[]; // string or array for sequence building
  explanation: string;
  difficultyRating: number; // 1 - 5
  phonemes?: PhonemeChunk[];
  scienceOfReadingStandard?: string;
  etymologyNotes?: string;
  accommodationsHelp?: string;
}

export interface LevelCurriculum {
  levelNumber: number; // 1 to 10
  name: string;
  gradeTier: string;
  skillFocus: string;
  description: string;
  games: GameChallenge[];
}

export interface LandCurriculum {
  id: LandId;
  name: string;
  realmNumber?: number;
  gradeLevel: string;
  themeColor: string;
  accentColor: string;
  lore: string;
  focusAreas?: string[];
  bossName?: string;
  bossTitle?: string;
  levels: LevelCurriculum[];
  oneHundredEightyDayScope?: {
    quarter1: string;
    quarter2: string;
    quarter3: string;
    quarter4: string;
    endOfYearMastery: string;
  };
}

export interface CollegeDefinition {
  id: string;
  name: string;
  deityDean: string;
  motto: string;
  focus: string;
  courses: string[];
  careerOutcomes: string[];
  capstoneProject: string;
  color: string;
}

export interface MasterPathwayDefinition {
  id: string;
  title: string;
  disciplines: string[];
  practicumRequirement: string;
  thesisTopic: string;
  loreMasterTitle: string;
  color: string;
}

export interface DoctoralArchiveTopic {
  id: string;
  title: string;
  subfields: string[];
  researchExpedition: string;
  dissertationDefenseChallenge: string;
  masterySeal: string;
}
