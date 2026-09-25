import React, { createContext, useContext, useState, useEffect } from 'react';
import { Account, ExplorerProfile, LandId, MinigameId } from '../types/character';

export const LAND_ORDER: LandId[] = [
  'sound-shallows',
  'builders-guild',
  'tricky-trails',
  'whispering-peaks',
  'lexicon-empire',
];

export const isLandUnlocked = (arg1: any, arg2?: any): boolean => {
  const landId: LandId = (typeof arg1 === 'string' ? arg1 : typeof arg2 === 'string' ? arg2 : '') as LandId;
  const scores = (typeof arg1 === 'object' && arg1 !== null)
    ? (arg1.landScores || arg1)
    : (typeof arg2 === 'object' && arg2 !== null ? (arg2.landScores || arg2) : null);

  if (landId === 'sound-shallows') return true;
  if (!LAND_ORDER.includes(landId)) return true;

  const landIndex = LAND_ORDER.indexOf(landId);
  if (landIndex <= 0) return true;

  if (scores && scores[landId]?.unlocked === true) return true;

  const prevLandId = LAND_ORDER[landIndex - 1];
  const prevLand = scores ? scores[prevLandId] : null;
  return Boolean(prevLand && prevLand.completedGamesCount >= 50);
};

interface RegisterPayload {
  username: string;
  password: string;
  familyName: string;
  role: 'parent' | 'teacher';
  starterExplorerName: string;
}

interface GameContextType {
  account: Account;
  activeExplorer: ExplorerProfile;
  switchExplorer: (id: string) => void;
  createExplorer: (name: string, ageTier: ExplorerProfile['ageTier']) => void;
  updateExplorerName: (id: string, newName: string) => void;
  updateExplorerScore: (landId: LandId, gamesCompletedDelta: number, starsDelta: number) => void;
  awardCurrency: (coinsDelta: number, tokensDelta: number) => void;
  updateAvatarCustomization: (customization: ExplorerProfile['customization']) => void;
  showHallOfFameCelebration: boolean;
  dismissHallOfFameCelebration: () => void;
  resetExplorerProgress: (explorerId: string) => void;
  loginWithCredentials: (u: string, p: string) => boolean;
  registerAccount: (payload: RegisterPayload) => void;
  isLandUnlocked: (landId: LandId) => boolean;
  exportSaveData: () => string;
  importSaveData: (jsonStr: string) => boolean;
  logout: () => void;
}

const DEFAULT_LAND_SCORES = {
  'sound-shallows': { completedGamesCount: 0, stars: 0, unlocked: true },
  'builders-guild': { completedGamesCount: 0, stars: 0, unlocked: false },
  'tricky-trails': { completedGamesCount: 0, stars: 0, unlocked: false },
  'whispering-peaks': { completedGamesCount: 0, stars: 0, unlocked: false },
  'lexicon-empire': { completedGamesCount: 0, stars: 0, unlocked: false }
};

const FALLBACK_EXPLORER: ExplorerProfile = {
  id: 'exp-kam',
  name: 'Kam',
  ageTier: 'preschool',
  level: 1,
  totalStars: 12,
  coins: 40,
  arcadeTokens: 5,
  isHallOfFameInducted: false,
  timesStorylineCompleted: 0,
  landScores: {
    'sound-shallows': { completedGamesCount: 4, stars: 12, unlocked: true },
    'builders-guild': { completedGamesCount: 0, stars: 0, unlocked: false },
    'tricky-trails': { completedGamesCount: 0, stars: 0, unlocked: false },
    'whispering-peaks': { completedGamesCount: 0, stars: 0, unlocked: false },
    'lexicon-empire': { completedGamesCount: 0, stars: 0, unlocked: false }
  },
  customization: {
    skinTone: '#ffd1a4',
    hairStyle: 'curls',
    hairColor: '#3d2314',
    outfitColor: '#3b82f6',
    accessory: 'glasses',
    companionPet: 'baby-dragon',
    title: 'Shallow Scout'
  }
};

const INITIAL_ACCOUNT: Account = {
  id: 'acc-1',
  familyName: 'Explorer Family',
  username: 'readingheroes',
  role: 'parent',
  explorers: [
    FALLBACK_EXPLORER,
    {
      id: 'exp-maya',
      name: 'Maya',
      ageTier: 'late-elementary',
      level: 50,
      totalStars: 750,
      coins: 850,
      arcadeTokens: 120,
      isHallOfFameInducted: true,
      timesStorylineCompleted: 1,
      landScores: {
        'sound-shallows': { completedGamesCount: 50, stars: 150, unlocked: true },
        'builders-guild': { completedGamesCount: 50, stars: 150, unlocked: true },
        'tricky-trails': { completedGamesCount: 50, stars: 150, unlocked: true },
        'whispering-peaks': { completedGamesCount: 50, stars: 150, unlocked: true },
        'lexicon-empire': { completedGamesCount: 50, stars: 150, unlocked: true }
      },
      customization: {
        skinTone: '#d99058',
        hairStyle: 'braids',
        hairColor: '#1e1b18',
        outfitColor: '#a855f7',
        accessory: 'sparkles',
        companionPet: 'golden-phonix',
        title: 'Hall of Fame Grand Scholar'
      }
    }
  ]
};

const GameContext = createContext<GameContextType | undefined>(undefined);

export const GameProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [account, setAccount] = useState<Account>(() => {
    try {
      const saved = localStorage.getItem('phonixia_account_v2');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && Array.isArray(parsed.explorers) && parsed.explorers.length > 0) {
          parsed.explorers.forEach((exp: any) => {
            if (!exp.landScores) {
              exp.landScores = JSON.parse(JSON.stringify(DEFAULT_LAND_SCORES));
            }
            LAND_ORDER.forEach((landId, idx) => {
              if (!exp.landScores[landId]) {
                exp.landScores[landId] = { completedGamesCount: 0, stars: 0, unlocked: idx === 0 };
              }
              if (idx === 0) {
                exp.landScores[landId].unlocked = true;
              } else {
                const prevId = LAND_ORDER[idx - 1];
                const prevCount = exp.landScores[prevId]?.completedGamesCount || 0;
                exp.landScores[landId].unlocked = prevCount >= 50;
              }
            });
          });
          return parsed;
        }
      }
    } catch {
      // fallback
    }
    return INITIAL_ACCOUNT;
  });

  const [activeExplorerId, setActiveExplorerId] = useState<string>(() => {
    return (
      localStorage.getItem('phonixia_active_id_v2') ||
      (account.explorers && account.explorers[0] ? account.explorers[0].id : FALLBACK_EXPLORER.id)
    );
  });

  const [showHallOfFameCelebration, setShowHallOfFameCelebration] = useState(false);

  useEffect(() => {
    localStorage.setItem('phonixia_account_v2', JSON.stringify(account));
  }, [account]);

  useEffect(() => {
    localStorage.setItem('phonixia_active_id_v2', activeExplorerId);
  }, [activeExplorerId]);

  const rawExplorer =
    (account.explorers && account.explorers.find((exp) => exp.id === activeExplorerId)) ||
    (account.explorers && account.explorers[0]) ||
    FALLBACK_EXPLORER;

  const activeExplorer: ExplorerProfile = {
    ...rawExplorer,
    landScores: {
      ...DEFAULT_LAND_SCORES,
      ...(rawExplorer.landScores || {}),
      'sound-shallows': {
        completedGamesCount: rawExplorer.landScores?.['sound-shallows']?.completedGamesCount ?? 4,
        stars: rawExplorer.landScores?.['sound-shallows']?.stars ?? 12,
        unlocked: true,
      }
    }
  };

  const checkLandUnlocked = (landId: LandId): boolean => {
    return isLandUnlocked(landId, activeExplorer.landScores);
  };

  const switchExplorer = (id: string) => {
    setActiveExplorerId(id);
  };

  const updateExplorerName = (id: string, newName: string) => {
    const trimmed = newName.trim();
    if (!trimmed) return;
    setAccount((prev) => ({
      ...prev,
      explorers: (prev.explorers || []).map((exp) =>
        exp.id === id ? { ...exp, name: trimmed } : exp
      )
    }));
  };

  const loginWithCredentials = (u: string, p: string): boolean => {
    const savedPassword = localStorage.getItem(`phonixia_pw_${u}`) || 'phonics123';
    return p === savedPassword;
  };

  const registerAccount = (payload: RegisterPayload) => {
    localStorage.setItem(`phonixia_pw_${payload.username}`, payload.password);

    const starter: ExplorerProfile = {
      id: `exp-${Date.now()}`,
      name: payload.starterExplorerName || 'Explorer',
      ageTier: 'preschool',
      level: 1,
      totalStars: 0,
      coins: 30,
      arcadeTokens: 5,
      isHallOfFameInducted: false,
      timesStorylineCompleted: 0,
      landScores: JSON.parse(JSON.stringify(DEFAULT_LAND_SCORES)),
      customization: {
        skinTone: '#ffd1a4',
        hairStyle: 'curls',
        hairColor: '#3d2314',
        outfitColor: '#3b82f6',
        accessory: 'none',
        companionPet: 'woodland-fox',
        title: 'Apprentice Reader'
      }
    };

    const newAcc: Account = {
      id: `acc-${Date.now()}`,
      familyName: payload.familyName,
      username: payload.username,
      role: payload.role,
      explorers: [starter]
    };

    setAccount(newAcc);
    setActiveExplorerId(starter.id);
  };

  const createExplorer = (name: string, ageTier: ExplorerProfile['ageTier']) => {
    const newExplorer: ExplorerProfile = {
      id: `exp-${Date.now()}`,
      name,
      ageTier,
      level: 1,
      totalStars: 0,
      coins: 20,
      arcadeTokens: 3,
      isHallOfFameInducted: false,
      timesStorylineCompleted: 0,
      landScores: JSON.parse(JSON.stringify(DEFAULT_LAND_SCORES)),
      customization: {
        skinTone: '#ffd1a4',
        hairStyle: 'curls',
        hairColor: '#3d2314',
        outfitColor: '#22c55e',
        accessory: 'none',
        companionPet: 'woodland-fox',
        title: 'Novice Reader'
      }
    };

    setAccount((prev) => ({
      ...prev,
      explorers: [...(prev.explorers || []), newExplorer]
    }));
    setActiveExplorerId(newExplorer.id);
  };

  const updateExplorerScore = (landId: LandId, gamesCompletedDelta: number, starsDelta: number) => {
    setAccount((prev) => {
      const updatedExplorers = (prev.explorers || []).map((exp) => {
        if (exp.id !== activeExplorerId) return exp;

        const currentLand = exp.landScores?.[landId] || { completedGamesCount: 0, stars: 0, unlocked: false };
        const newCompleted = Math.min(50, currentLand.completedGamesCount + gamesCompletedDelta);
        const newLandStars = currentLand.stars + starsDelta;

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

        const totalCompleted = Object.values(updatedLandScores).reduce(
          (sum: number, l: any) => sum + (l?.completedGamesCount || 0),
          0
        );

        const shouldInduct = totalCompleted >= 250;

        if (shouldInduct && !exp.isHallOfFameInducted) {
          setShowHallOfFameCelebration(true);
        }

        return {
          ...exp,
          totalStars: exp.totalStars + starsDelta,
          isHallOfFameInducted: exp.isHallOfFameInducted || shouldInduct,
          landScores: updatedLandScores
        };
      });

      return {
        ...prev,
        explorers: updatedExplorers
      };
    });
  };

  const awardCurrency = (coinsDelta: number, tokensDelta: number) => {
    setAccount((prev) => ({
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
    }));
  };

  const updateAvatarCustomization = (customization: ExplorerProfile['customization']) => {
    setAccount((prev) => ({
      ...prev,
      explorers: (prev.explorers || []).map((exp) =>
        exp.id === activeExplorerId ? { ...exp, customization } : exp
      )
    }));
  };

  const resetExplorerProgress = (explorerId: string) => {
    setAccount((prev) => {
      const updatedExplorers = (prev.explorers || []).map((exp) => {
        if (exp.id !== explorerId) return exp;

        const freshLandScores = {
          'sound-shallows': { completedGamesCount: 0, stars: 0, unlocked: true },
          'builders-guild': { completedGamesCount: 0, stars: 0, unlocked: false },
          'tricky-trails': { completedGamesCount: 0, stars: 0, unlocked: false },
          'whispering-peaks': { completedGamesCount: 0, stars: 0, unlocked: false },
          'lexicon-empire': { completedGamesCount: 0, stars: 0, unlocked: false }
        };

        return {
          ...exp,
          totalStars: 0,
          level: 1,
          isHallOfFameInducted: true,
          timesStorylineCompleted: (exp.timesStorylineCompleted || 0) + 1,
          landScores: freshLandScores,
          customization: {
            ...exp.customization,
            title: 'Veteran Grand Scholar'
          }
        };
      });

      return {
        ...prev,
        explorers: updatedExplorers
      };
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
        return true;
      }
    } catch {
      // invalid
    }
    return false;
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
        updateExplorerName,
        updateExplorerScore,
        awardCurrency,
        updateAvatarCustomization,
        showHallOfFameCelebration,
        dismissHallOfFameCelebration,
        resetExplorerProgress,
        loginWithCredentials,
        registerAccount,
        isLandUnlocked: checkLandUnlocked,
        exportSaveData,
        importSaveData,
        logout
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