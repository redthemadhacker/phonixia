export type LandId = 
  | 'sound-shallows'
  | 'builders-guild'
  | 'tricky-trails'
  | 'whispering-peaks'
  | 'lexicon-empire';

export type MinigameId = 'isles-of-play' | 'shellshore-arcade';

export interface CharacterCustomization {
  skinTone: string;
  hairStyle: 'short' | 'spiky' | 'curly' | 'wavy' | 'afro' | 'braids' | 'explorer-bun';
  hairColor: string;
  outfit: 'ranger-vest' | 'phoenix-cloak' | 'scholar-robe' | 'safari-suit' | 'cyber-tunic';
  headgear: 'explorer-hat' | 'phoenix-crown' | 'pilot-goggles' | 'bandana' | 'cap' | 'none';
  companionPet: 'phoenix-chick' | 'clever-fox' | 'golden-eagle' | 'coral-turtle' | 'gem-golem';
  title: string;
}

export interface ExplorerProfile {
  id: string;
  name: string;
  ageTier: 'preschool' | 'kindergarten' | 'early-elementary' | 'late-elementary' | 'middle-school';
  customization: CharacterCustomization;
  createdAt: string;
  totalStars: number;
  coins: number;
  arcadeTokens: number;
  level: number;
  streakDays: number;
  lastPlayed: string;
  landScores: Record<LandId, {
    stars: number;
    highestLevelUnlocked: number;
    completedGamesCount: number;
    totalAccuracy: number;
    attemptsCount: number;
    levels: Record<number, {
      stars: number;
      unlocked: boolean;
      highScore: number;
      completedGames: number[];
    }>;
  }>;
  minigameScores: {
    bubblePopper: number;
    wordBlastMiner: number;
    rhymeRiver: number;
    syllableSmasher: number;
    pearlDiver: number;
    clawCrane: number;
    vowelPinball: number;
    whackASound: number;
  };
  achievements: string[];
}

export interface ParentAccount {
  id: string;
  username: string;
  email: string;
  familyName: string;
  explorers: ExplorerProfile[];
  activeExplorerId: string;
}

export interface LandmarkNode {
  id: LandId | MinigameId | 'phoenix-castle' | 'home-hut';
  name: string;
  tagline: string;
  targetAge: string;
  x: number; // percentage coordinates 0-100 on the world map
  y: number;
  icon: string;
  color: string;
  accentColor: string;
  description: string;
}