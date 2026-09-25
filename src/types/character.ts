export type LandId =
  | 'sound-shallows'
  | 'builders-guild'
  | 'tricky-trails'
  | 'whispering-peaks'
  | 'lexicon-empire';

export type MinigameId = 'isles-of-play' | 'shellshore-arcade';

export interface LandProgress {
  completedGamesCount: number;
  stars: number;
  unlocked: boolean;
}

export interface AvatarCustomization {
  skinTone: string;
  hairStyle: string;
  hairColor: string;
  outfitColor: string;
  accessory: string;
  companionPet: string;
  title: string;
}

export interface ExplorerProfile {
  id: string;
  name: string;
  ageTier: 'preschool' | 'kindergarten' | 'early-elementary' | 'late-elementary' | 'middle-school';
  level: number;
  totalStars: number;
  coins: number;
  arcadeTokens: number;
  landScores: Record<LandId, LandProgress>;
  customization: AvatarCustomization;
  // Permanent Hall of Fame & Storyline markers
  isHallOfFameInducted?: boolean;
  timesStorylineCompleted?: number;
}

export interface Account {
  id: string;
  familyName: string;
  username: string;
  role: 'parent' | 'teacher';
  explorers: ExplorerProfile[];
}