import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { 
  Account, 
  ExplorerProfile, 
  LandId, 
  GradeLevel, 
  LearningPathway, 
  AccessibilitySettings, 
  IEPProfile 
} from '../types/character';

export const LAND_ORDER: LandId[] = [
  'sound-shallows',
  'builders-guild',
  'tricky-trails',
  'whispering-peaks',
  'lexicon-empire',
  'phonixia-academy',
  'masters-pathways',
  'celestial-archives'
];

export const DEFAULT_ACCESSIBILITY: AccessibilitySettings = {
  dyslexiaFont: false,
  colorCodedPhonemes: true,
  highContrast: false,
  reducedMotion: false,
  focusMode: false,
  speechSpeed: 1.0,
  soundVolume: 1.0,
  sensoryCalmMode: false,
  syllableChunking: true,
  aacEnabled: false,
  visualMouthGuides: true,
  screenTimeLimitMinutes: 45
};

export const DEFAULT_IEP: IEPProfile = {
  hasActivePlan: false,
  planType: 'None',
  primaryFocusArea: 'Phonological Awareness & Fluency',
  accommodations: ['Visual phoneme color-coding', 'Text-to-speech replay', 'Extended response time'],
  targetWCPM: 60,
  currentWCPM: 42,
  phonemicAccuracyPercent: 88,
  notes: 'Progressing well through Structured Literacy scope and sequence.'
};

export const isLandUnlocked = (
  arg1: LandId | ExplorerProfile | Record<string, any>,
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

  // Higher Ed Expansions can unlock after Lexicon Empire (Stage 50)
  if (landId === 'phonixia-academy') {
    return Boolean(scores?.['lexicon-empire']?.completedGamesCount >= 50);
  }
  if (landId === 'masters-pathways') {
    return Boolean(scores?.['phonixia-academy']?.completedGamesCount >= 10 || scores?.['lexicon-empire']?.completedGamesCount >= 50);
  }
  if (landId === 'celestial-archives') {
    return Boolean(scores?.['masters-pathways']?.completedGamesCount >= 10 || scores?.['lexicon-empire']?.completedGamesCount >= 50);
  }

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
  updateExplorerScore: (landId: LandId, gamesCompletedDelta: number, starsDelta: number, specificCompletedCount?: number) => void;
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
  updateAccessibilitySettings: (settings: Partial<AccessibilitySettings>) => void;
  updateIEPProfile: (profile: Partial<IEPProfile>) => void;
  updateGradeLevel: (grade: GradeLevel) => void;
  updateLearningPathway: (pathway: LearningPathway) => void;
  awardScholarReputation: (delta: number) => void;
  inductMasterOfPhonixia: () => void;
  recordDissertationCompleted: (topicId: string) => void;
  recordCyberBadge: (badgeId: string) => void;
}

const DEFAULT_LAND_SCORES = {
  'sound-shallows': { completedGamesCount: 0, stars: 0, unlocked: true },
  'builders-guild': { completedGamesCount: 0, stars: 0, unlocked: false },
  'tricky-trails': { completedGamesCount: 0, stars: 0, unlocked: false },
  'whispering-peaks': { completedGamesCount: 0, stars: 0, unlocked: false },
  'lexicon-empire': { completedGamesCount: 0, stars: 0, unlocked: false },
  'phonixia-academy': { completedGamesCount: 0, stars: 0, unlocked: false },
  'masters-pathways': { completedGamesCount: 0, stars: 0, unlocked: false },
  'celestial-archives': { completedGamesCount: 0, stars: 0, unlocked: false }
};

export const getFreshLandScores = () => JSON.parse(JSON.stringify(DEFAULT_LAND_SCORES));

// KAM: Red adv vest, adv bandana, wise turtle, curls, 3rd brown hair, 2nd light skin
export const KAM_GUIDE: ExplorerProfile = {
  id: 'guide-kam',
  name: 'Kam',
  gender: 'boy',
  companionGuide: 'kam',
  ageTier: 'preschool',
  gradeLevel: 'PreK3',
  learningPathway: 'general-education',
  level: 1,
  totalStars: 20,
  coins: 50,
  arcadeTokens: 10,
  scholarReputation: 100,
  isHallOfFameInducted: false,
  isMasterOfPhonixia: false,
  timesStorylineCompleted: 0,
  landScores: getFreshLandScores(),
  strugglingSkills: {},
  accessibility: { ...DEFAULT_ACCESSIBILITY },
  iepProfile: { ...DEFAULT_IEP },
  completedDissertations: [],
  academicCollegeMajors: [],
  masteryDisciplines: [],
  cyberGuardianBadges: ['safe-password-initiate'],
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
  gradeLevel: 'Kindergarten',
  learningPathway: 'general-education',
  level: 1,
  totalStars: 20,
  coins: 50,
  arcadeTokens: 10,
  scholarReputation: 100,
  isHallOfFameInducted: false,
  isMasterOfPhonixia: false,
  timesStorylineCompleted: 0,
  landScores: getFreshLandScores(),
  strugglingSkills: {},
  accessibility: { ...DEFAULT_ACCESSIBILITY },
  iepProfile: { ...DEFAULT_IEP },
  completedDissertations: [],
  academicCollegeMajors: [],
  masteryDisciplines: [],
  cyberGuardianBadges: ['safe-password-initiate'],
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
  gradeLevel: 'PreK3',
  learningPathway: 'general-education',
  level: 1,
  totalStars: 0,
  coins: 30,
  arcadeTokens: 5,
  scholarReputation: 100,
  isHallOfFameInducted: false,
  isMasterOfPhonixia: false,
  timesStorylineCompleted: 0,
  landScores: getFreshLandScores(),
  strugglingSkills: {},
  accessibility: { ...DEFAULT_ACCESSIBILITY },
  iepProfile: { ...DEFAULT_IEP },
  completedDissertations: [],
  academicCollegeMajors: [],
  masteryDisciplines: [],
  cyberGuardianBadges: [],
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
  tier: 'family-pro',
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

export const PHONIXIATEST_ACCOUNT: Account = {
  id: 'acc-phonixiatest',
  familyName: "Cousins Test Family",
  username: 'phonixiatest',
  role: 'parent',
  explorers: [
    {
      id: 'exp-zuri',
      name: 'Zuri',
      gender: 'girl',
      age: 10,
      companionGuide: 'celine',
      ageTier: 'late-elementary',
      level: 10,
      totalStars: 30,
      coins: 60,
      arcadeTokens: 10,
      isHallOfFameInducted: false,
      timesStorylineCompleted: 0,
      landScores: {
        'sound-shallows': { completedGamesCount: 10, stars: 30, unlocked: true },
        'builders-guild': { completedGamesCount: 0, stars: 0, unlocked: false },
        'tricky-trails': { completedGamesCount: 0, stars: 0, unlocked: false },
        'whispering-peaks': { completedGamesCount: 0, stars: 0, unlocked: false },
        'lexicon-empire': { completedGamesCount: 0, stars: 0, unlocked: false }
      },
      strugglingSkills: {},
      customization: {
        skinTone: '#8d5524',
        hairStyle: 'braids',
        hairColor: '#1e1b18',
        outfitStyle: 'wizard',
        outfitColor: '#7e22ce',
        accessory: 'glasses',
        companionPet: 'baby-dragon',
        title: 'Sound Shallows Master (10/10)'
      }
    },
    {
      id: 'exp-landry',
      name: 'Landry',
      gender: 'girl',
      age: 4,
      companionGuide: 'celine',
      ageTier: 'preschool',
      level: 10,
      totalStars: 30,
      coins: 60,
      arcadeTokens: 10,
      isHallOfFameInducted: false,
      timesStorylineCompleted: 0,
      landScores: {
        'sound-shallows': { completedGamesCount: 10, stars: 30, unlocked: true },
        'builders-guild': { completedGamesCount: 0, stars: 0, unlocked: false },
        'tricky-trails': { completedGamesCount: 0, stars: 0, unlocked: false },
        'whispering-peaks': { completedGamesCount: 0, stars: 0, unlocked: false },
        'lexicon-empire': { completedGamesCount: 0, stars: 0, unlocked: false }
      },
      strugglingSkills: {},
      customization: {
        skinTone: '#ffd1a4',
        hairStyle: 'pigtails',
        hairColor: '#4a2e18',
        outfitStyle: 'wizard',
        outfitColor: '#10b981',
        accessory: 'bandana',
        companionPet: 'baby-dragon',
        title: 'Sound Shallows Master (10/10)'
      }
    },
    {
      id: 'exp-joleigh',
      name: 'Joleigh',
      gender: 'girl',
      age: 6,
      companionGuide: 'celine',
      ageTier: 'early-elementary',
      level: 10,
      totalStars: 30,
      coins: 60,
      arcadeTokens: 10,
      isHallOfFameInducted: false,
      timesStorylineCompleted: 0,
      landScores: {
        'sound-shallows': { completedGamesCount: 10, stars: 30, unlocked: true },
        'builders-guild': { completedGamesCount: 0, stars: 0, unlocked: false },
        'tricky-trails': { completedGamesCount: 0, stars: 0, unlocked: false },
        'whispering-peaks': { completedGamesCount: 0, stars: 0, unlocked: false },
        'lexicon-empire': { completedGamesCount: 0, stars: 0, unlocked: false }
      },
      strugglingSkills: {},
      customization: {
        skinTone: '#fcd5b5',
        hairStyle: 'pigtails',
        hairColor: '#d97706',
        outfitStyle: 'wizard',
        outfitColor: '#ec4899',
        accessory: 'sparkles',
        companionPet: 'baby-dragon',
        title: 'Sound Shallows Master (10/10)'
      }
    },
    {
      id: 'exp-amari',
      name: 'Amari',
      gender: 'girl',
      age: '11+',
      companionGuide: 'celine',
      ageTier: 'middle-high',
      level: 1,
      totalStars: 3,
      coins: 35,
      arcadeTokens: 5,
      isHallOfFameInducted: false,
      timesStorylineCompleted: 0,
      landScores: {
        'sound-shallows': { completedGamesCount: 1, stars: 3, unlocked: true },
        'builders-guild': { completedGamesCount: 0, stars: 0, unlocked: false },
        'tricky-trails': { completedGamesCount: 0, stars: 0, unlocked: false },
        'whispering-peaks': { completedGamesCount: 0, stars: 0, unlocked: false },
        'lexicon-empire': { completedGamesCount: 0, stars: 0, unlocked: false }
      },
      strugglingSkills: {},
      customization: {
        skinTone: '#8d5524',
        hairStyle: 'curls',
        hairColor: '#1a110b',
        outfitStyle: 'wizard',
        outfitColor: '#2563eb',
        accessory: 'glasses',
        companionPet: 'baby-dragon',
        title: 'Sound Shallows Explorer (1/10)'
      }
    }
  ]
};

const GameContext = createContext<GameContextType | undefined>(undefined);

export const GameProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [account, setAccount] = useState<Account>(() => {
    try {
      const activeUser = localStorage.getItem('phonixia_active_user') || 'phonixiatest';
      const saved = localStorage.getItem('phonixia_account_v2');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && Array.isArray(parsed.explorers) && parsed.explorers.length >= 4 && parsed.username === 'phonixiatest') {
          return parsed;
        }
        if (activeUser === 'readingheroes' && parsed && Array.isArray(parsed.explorers) && parsed.explorers.length > 0) {
          return parsed;
        }
      }
      return PHONIXIATEST_ACCOUNT;
    } catch {}
    return PHONIXIATEST_ACCOUNT;
  });

  const [activeExplorerId, setActiveExplorerId] = useState<string>(() => {
    const cachedId = localStorage.getItem('phonixia_active_id_v2');
    if (cachedId && account.explorers?.some((e) => e.id === cachedId)) {
      return cachedId;
    }
    return (account.explorers && account.explorers[0]) ? account.explorers[0].id : 'exp-zuri';
  });

  const [showHallOfFameCelebration, setShowHallOfFameCelebration] = useState(false);
  const [isCloudLoaded, setIsCloudLoaded] = useState(false);

  // Helper to sync account to cloud and local storage
  const syncAccountData = useCallback((acc: Account) => {
    if (!acc || !acc.username || !Array.isArray(acc.explorers) || acc.explorers.length === 0) return;
    const userKey = acc.username.toLowerCase();

    try {
      localStorage.setItem('phonixia_account_v2', JSON.stringify(acc));
      localStorage.setItem('phonixia_active_user', userKey);
      const all = JSON.parse(localStorage.getItem('phonixia_all_accounts_cache') || '{}');
      all[userKey] = acc;
      localStorage.setItem('phonixia_all_accounts_cache', JSON.stringify(all));
    } catch (err) {
      console.warn('LocalStorage sync error:', err);
    }

    fetch('/api/account/save', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: userKey, accountData: acc })
    }).catch((err) => console.warn('Cloud sync error:', err));
  }, []);

  // Initial cloud fetch on startup
  useEffect(() => {
    const savedUser = localStorage.getItem('phonixia_active_user') || 'phonixiatest';
    
    // First check local cache
    let localAccount: Account | null = null;
    try {
      const cached = localStorage.getItem('phonixia_account_v2');
      if (cached) localAccount = JSON.parse(cached);
    } catch {}

    fetch(`/api/account/${savedUser}`)
      .then((res) => {
        if (!res.ok) throw new Error('Account not found');
        return res.json();
      })
      .then((data) => {
        if (data && data.account && Array.isArray(data.account.explorers) && data.account.explorers.length > 0) {
          // Verify matching account
          if (data.account.username?.toLowerCase() !== savedUser.toLowerCase()) {
            return;
          }

          const getAccountScore = (acc: Account | null) => {
            if (!acc || !acc.explorers) return 0;
            return acc.explorers.reduce((sum, e) => {
              const games = Object.values(e.landScores || {}).reduce(
                (gSum: number, l: any) => gSum + (l?.completedGamesCount || 0),
                0
              );
              return sum + (e.totalStars || 0) * 100 + games;
            }, 0);
          };

          const remoteScore = getAccountScore(data.account);
          const localScore = (localAccount && localAccount.username?.toLowerCase() === savedUser.toLowerCase())
            ? getAccountScore(localAccount)
            : 0;

          if (remoteScore > localScore) {
            setAccount(data.account);
            localStorage.setItem('phonixia_account_v2', JSON.stringify(data.account));
          } else if (localAccount && localScore > remoteScore) {
            // Push local account up to cloud since local is ahead!
            syncAccountData(localAccount);
          }
        }
      })
      .catch(() => {})
      .finally(() => {
        setIsCloudLoaded(true);
      });
  }, [syncAccountData]);

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
      gradeLevel: rawExplorer.gradeLevel || 'Kindergarten',
      learningPathway: rawExplorer.learningPathway || 'general-education',
      scholarReputation: rawExplorer.scholarReputation ?? 100,
      isMasterOfPhonixia: Boolean(rawExplorer.isMasterOfPhonixia),
      strugglingSkills: rawExplorer.strugglingSkills || {},
      accessibility: {
        ...DEFAULT_ACCESSIBILITY,
        ...(rawExplorer.accessibility || {})
      },
      iepProfile: {
        ...DEFAULT_IEP,
        ...(rawExplorer.iepProfile || {})
      },
      completedDissertations: rawExplorer.completedDissertations || [],
      academicCollegeMajors: rawExplorer.academicCollegeMajors || [],
      masteryDisciplines: rawExplorer.masteryDisciplines || [],
      cyberGuardianBadges: rawExplorer.cyberGuardianBadges || ['safe-password-initiate'],
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

  const updateAccessibilitySettings = useCallback((settings: Partial<AccessibilitySettings>) => {
    setAccount((prev) => {
      const updated = {
        ...prev,
        explorers: (prev.explorers || []).map((exp) =>
          exp.id === activeExplorerId
            ? {
                ...exp,
                accessibility: {
                  ...DEFAULT_ACCESSIBILITY,
                  ...(exp.accessibility || {}),
                  ...settings
                }
              }
            : exp
        )
      };
      syncAccountData(updated);
      return updated;
    });
  }, [activeExplorerId, syncAccountData]);

  const updateIEPProfile = useCallback((profile: Partial<IEPProfile>) => {
    setAccount((prev) => {
      const updated = {
        ...prev,
        explorers: (prev.explorers || []).map((exp) =>
          exp.id === activeExplorerId
            ? {
                ...exp,
                iepProfile: {
                  ...DEFAULT_IEP,
                  ...(exp.iepProfile || {}),
                  ...profile
                }
              }
            : exp
        )
      };
      syncAccountData(updated);
      return updated;
    });
  }, [activeExplorerId, syncAccountData]);

  const updateGradeLevel = useCallback((grade: GradeLevel) => {
    setAccount((prev) => {
      const updated = {
        ...prev,
        explorers: (prev.explorers || []).map((exp) =>
          exp.id === activeExplorerId ? { ...exp, gradeLevel: grade } : exp
        )
      };
      syncAccountData(updated);
      return updated;
    });
  }, [activeExplorerId, syncAccountData]);

  const updateLearningPathway = useCallback((pathway: LearningPathway) => {
    setAccount((prev) => {
      const updated = {
        ...prev,
        explorers: (prev.explorers || []).map((exp) =>
          exp.id === activeExplorerId ? { ...exp, learningPathway: pathway } : exp
        )
      };
      syncAccountData(updated);
      return updated;
    });
  }, [activeExplorerId, syncAccountData]);

  const awardScholarReputation = useCallback((delta: number) => {
    setAccount((prev) => {
      const updated = {
        ...prev,
        explorers: (prev.explorers || []).map((exp) =>
          exp.id === activeExplorerId
            ? { ...exp, scholarReputation: Math.max(0, (exp.scholarReputation ?? 100) + delta) }
            : exp
        )
      };
      syncAccountData(updated);
      return updated;
    });
  }, [activeExplorerId, syncAccountData]);

  const inductMasterOfPhonixia = useCallback(() => {
    setAccount((prev) => {
      const updated = {
        ...prev,
        explorers: (prev.explorers || []).map((exp) =>
          exp.id === activeExplorerId
            ? { 
                ...exp, 
                isMasterOfPhonixia: true,
                customization: {
                  ...exp.customization,
                  title: 'MASTER OF PHONIXIA',
                  companionPet: 'golden-phonix',
                  mount: 'celestial-gryphon'
                }
              }
            : exp
        )
      };
      syncAccountData(updated);
      return updated;
    });
  }, [activeExplorerId, syncAccountData]);

  const recordDissertationCompleted = useCallback((topicId: string) => {
    setAccount((prev) => {
      const updated = {
        ...prev,
        explorers: (prev.explorers || []).map((exp) => {
          if (exp.id !== activeExplorerId) return exp;
          const current = exp.completedDissertations || [];
          if (current.includes(topicId)) return exp;
          return {
            ...exp,
            completedDissertations: [...current, topicId],
            totalStars: exp.totalStars + 10,
            coins: exp.coins + 100
          };
        })
      };
      syncAccountData(updated);
      return updated;
    });
  }, [activeExplorerId, syncAccountData]);

  const recordCyberBadge = useCallback((badgeId: string) => {
    setAccount((prev) => {
      const updated = {
        ...prev,
        explorers: (prev.explorers || []).map((exp) => {
          if (exp.id !== activeExplorerId) return exp;
          const current = exp.cyberGuardianBadges || [];
          if (current.includes(badgeId)) return exp;
          return {
            ...exp,
            cyberGuardianBadges: [...current, badgeId],
            arcadeTokens: exp.arcadeTokens + 5
          };
        })
      };
      syncAccountData(updated);
      return updated;
    });
  }, [activeExplorerId, syncAccountData]);

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
      gradeLevel: 'Kindergarten',
      learningPathway: 'general-education',
      level: 1,
      totalStars: 0,
      coins: 20,
      arcadeTokens: 3,
      scholarReputation: 100,
      isHallOfFameInducted: false,
      isMasterOfPhonixia: false,
      timesStorylineCompleted: 0,
      landScores: getFreshLandScores(),
      strugglingSkills: {},
      accessibility: { ...DEFAULT_ACCESSIBILITY },
      iepProfile: { ...DEFAULT_IEP },
      completedDissertations: [],
      academicCollegeMajors: [],
      masteryDisciplines: [],
      cyberGuardianBadges: ['safe-password-initiate'],
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

  const deleteExplorer = useCallback((id: string) => {
    setAccount((prev) => {
      const remainingExplorers = (prev.explorers || []).filter((exp) => exp.id !== id);
      if (remainingExplorers.length === 0) return prev;
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

  const updateExplorerScore = (
    landId: LandId, 
    gamesCompletedDelta: number, 
    starsDelta: number, 
    specificCompletedCount?: number
  ) => {
    setAccount((prev) => {
      const hasActive = (prev.explorers || []).some((e) => e.id === activeExplorerId);
      const targetExpId = hasActive ? activeExplorerId : (prev.explorers?.[0]?.id || '');

      const updatedExplorers = (prev.explorers || []).map((exp) => {
        if (exp.id !== targetExpId) return exp;
        const currentLand = exp.landScores?.[landId] || { completedGamesCount: 0, stars: 0, unlocked: false };
        
        let newCompleted = currentLand.completedGamesCount;
        if (typeof specificCompletedCount === 'number') {
          newCompleted = Math.min(50, Math.max(currentLand.completedGamesCount, specificCompletedCount));
        } else {
          newCompleted = Math.min(50, Math.max(currentLand.completedGamesCount, currentLand.completedGamesCount + gamesCompletedDelta));
        }

        const newLandStars = currentLand.stars + Math.max(0, starsDelta);

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
        recordSkillMiss,
        updateAccessibilitySettings,
        updateIEPProfile,
        updateGradeLevel,
        updateLearningPathway,
        awardScholarReputation,
        inductMasterOfPhonixia,
        recordDissertationCompleted,
        recordCyberBadge
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