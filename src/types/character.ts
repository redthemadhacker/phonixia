export type LandId =
  | 'sound-shallows'
  | 'builders-guild'
  | 'tricky-trails'
  | 'whispering-peaks'
  | 'lexicon-empire'
  | 'phonixia-academy'
  | 'masters-pathways'
  | 'celestial-archives';

export type MinigameId = 
  | 'isles-of-play' 
  | 'shellshore-arcade'
  | 'word-forge'
  | 'heart-vault'
  | 'archaeology-dig'
  | 'syntax-arena'
  | 'speech-lab';

export type GradeLevel =
  | 'PreK3'
  | 'PreK4'
  | 'Kindergarten'
  | 'Grade 1'
  | 'Grade 2'
  | 'Grade 3'
  | 'Grade 4'
  | 'Grade 5'
  | 'Grade 6'
  | 'Grade 7'
  | 'Grade 8'
  | 'Grade 9'
  | 'Grade 10'
  | 'Grade 11'
  | 'Grade 12'
  | 'College'
  | 'Graduate School'
  | 'Doctorate'
  | 'Adult Lifelong Learning';

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

export type LearningPathway = 
  | 'general-education'
  | 'supported-learning'
  | 'personalized-learning'
  | 'adaptive-learning';

export interface AccessibilitySettings {
  dyslexiaFont: boolean;
  colorCodedPhonemes: boolean; // Orton-Gillingham colors
  highContrast: boolean;
  reducedMotion: boolean;
  focusMode: boolean;
  speechSpeed: number; // 0.75, 0.9, 1.0, 1.15
  soundVolume: number;
  sensoryCalmMode: boolean;
  syllableChunking: boolean;
  aacEnabled: boolean;
  visualMouthGuides: boolean;
  screenTimeLimitMinutes: number;
}

export interface IEPProfile {
  hasActivePlan: boolean;
  planType: 'IEP' | '504' | 'MTSS-Tier2' | 'MTSS-Tier3' | 'Gifted-Accelerated' | 'None';
  primaryFocusArea: string;
  accommodations: string[];
  targetWCPM: number;
  currentWCPM: number;
  phonemicAccuracyPercent: number;
  notes: string;
}

export interface AvatarCustomization {
  skinTone: string;
  hairStyle: string;
  hairColor: string;
  outfitStyle?: string;
  outfitColor: string;
  accessory: string;
  companionPet: string;
  mount?: string;
  title: string;
  cloakRobe?: string;
  staffArtifact?: string;
}

export interface LandProgress {
  completedGamesCount: number;
  stars: number;
  unlocked: boolean;
  masteryBadgeEarned?: boolean;
}

export interface ExplorerProfile {
  id: string;
  name: string;
  age?: number | string;
  gradeLevel?: GradeLevel;
  ageTier: 'preschool' | 'kindergarten' | 'early-elementary' | 'late-elementary' | 'middle-high' | 'collegiate' | 'doctoral';
  learningPathway?: LearningPathway;
  level: number;
  totalStars: number;
  coins: number;
  arcadeTokens: number;
  scholarReputation?: number;
  isHallOfFameInducted: boolean;
  isMasterOfPhonixia?: boolean;
  timesStorylineCompleted: number;
  landScores: Partial<Record<LandId, LandProgress>> | Record<string, any>;
  customization: AvatarCustomization;
  gender?: 'boy' | 'girl';
  companionGuide?: 'kam' | 'celine';
  accessibility?: Partial<AccessibilitySettings>;
  iepProfile?: Partial<IEPProfile>;
  strugglingSkills?: Record<string, number>;
  completedDissertations?: string[];
  academicCollegeMajors?: string[];
  masteryDisciplines?: string[];
  cyberGuardianBadges?: string[];
}

export interface Account {
  id: string;
  familyName: string;
  username: string;
  role: 'parent' | 'teacher' | 'district-admin' | 'tutor';
  explorers: ExplorerProfile[];
  parentPin?: string;
  tier?: 'family-free' | 'family-pro' | 'school-license' | 'district-unlimited';
}
