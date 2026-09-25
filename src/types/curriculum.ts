import { LandId } from './character';

export type GameType = 
  | 'SOUND_MATCH' 
  | 'WORD_BUILDER' 
  | 'RHYME_RUSH' 
  | 'RULE_DETECTIVE' 
  | 'ROOT_LAB' 
  | 'SYLLABLE_SPLIT' 
  | 'MAGIC_E' 
  | 'SIGHT_BRIDGE';

export interface GameChallenge {
  id: string;
  gameNumber: number; // 1 to 10
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
}

export interface LevelCurriculum {
  levelNumber: number; // 1 to 5
  name: string;
  gradeTier: string;
  skillFocus: string;
  description: string;
  games: GameChallenge[];
}

export interface LandCurriculum {
  id: LandId;
  name: string;
  gradeLevel: string;
  themeColor: string;
  accentColor: string;
  lore: string;
  levels: LevelCurriculum[];
}