export type LandId =
  | 'sound-shallows'
  | 'builders-guild'
  | 'tricky-trails'
  | 'whispering-peaks'
  | 'lexicon-empire';

export type MinigameId = 'isles-of-play' | 'shellshore-arcade';

export interface LandmarkNode {
  id: string;
  name: string;
  tagline: string;
  targetAge: string;
  x: number;
  y: number;
  icon: string;
  color: string;
  accentColor: string;
  description: string;
}

export interface AvatarCustomization {
  skinTone: string;
  hairStyle: string;
  hairColor: string;
  outfitStyle?: string;
  outfitColor: string;
  accessory: string;
  companionPet: string;
  title: string;
}

export interface LandProgress {
  completedGamesCount: number;
  stars: number;
  unlocked: boolean;
}

export interface ExplorerProfile {
  id: string;
  name: string;
  ageTier: 'preschool' | 'kindergarten' | 'early-elementary' | 'late-elementary' | 'middle-high';
  level: number;
  totalStars: number;
  coins: number;
  arcadeTokens: number;
  isHallOfFameInducted: boolean;
  timesStorylineCompleted: number;
  landScores: Record<LandId, LandProgress>;
  customization: AvatarCustomization;
  gender?: 'boy' | 'girl';
  companionGuide?: 'kam' | 'celine';
}

export interface Account {
  id: string;
  familyName: string;
  username: string;
  role: 'parent' | 'teacher';
  explorers: ExplorerProfile[];
}