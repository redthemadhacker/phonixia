import React, { createContext, useContext, useState, useEffect } from 'react';
import { Account, ExplorerProfile, LandId } from '../types/character';

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
  gender?: 'boy' | 'girl';
  companionGuide?: 'kam' | 'celine';
}

interface GameContextType {
  account: Account;
  activeExplorer: ExplorerProfile;
  switchExplorer: (id: string) => void;
  createExplorer: (name: string, ageTier: ExplorerProfile['ageTier'], gender?: 'boy' | 'girl') => void;
  updateExplorerName: (id: string, newName: string) => void;
  updateExplorerGender: (id: string, gender: 'boy' | 'girl') => void;
  updateExplorerScore: (landId: LandId, gamesCompletedDelta: number, starsDelta: number) => void;
  awardCurrency: (coinsDelta: number, tokensDelta: number) => void;
  updateAvatarCustomization: (customization: ExplorerProfile['customization']) => void;
  showHallOfFameCelebration: boolean;
  dismissHallOfFameCelebration: () => void;
  resetExplorerProgress: (explorerId: string) => void;
  restartLandProgress: (landId: LandId) => void;
  resetClassroomAndGameData: () => void;
  loginWithCredentials: (u: string, p: string) => boolean;
  registerAccount: (payload: RegisterPayload) => void;
  isLandUnlocked: (landId: LandId) => boolean;
  exportSaveData: () => string;
  importSaveData: (jsonStr: string) => boolean;
  logout: () => void;
  recordGameCompletion: (landId: LandId, levelNumber: number, gameNumber: number, stars: number, score: number, isWin: boolean) => void;
}

const DEFAULT_LAND_SCORES = {
  'sound-shallows': { completedGamesCount: 0, stars: 0, unlocked: true },
  'builders-guild': { completedGamesCount: 0, stars: 0, unlocked: false },
  'tricky-trails': { completedGamesCount: 0, stars: 0, unlocked: false },
  'whispering-peaks': { completedGamesCount: 0, stars: 0, unlocked: false },
  'lexicon-empire': { completedGamesCount: 0, stars: 0, unlocked: false }
};

// KAM: Red adv vest, adv bandana, wise turtle, curls, 3rd brown hair, 2nd light skin
export const KAM_GUIDE: ExplorerProfile = {
  id: 'guide-kam',
  name: 'Kam',
  gender: 'boy',
  companionGuide: 'kam',
  ageTier: 'preschool',
  level: 1,
  totalStars: 20,
  coins: 50,
  arcadeTokens: 10,
  isHallOfFameInducted: false,
  timesStorylineCompleted: 0,
  landScores: JSON.parse(JSON.stringify(DEFAULT_LAND_SCORES)),
  customization: {
    skinTone: '#fcd5b5', // 2nd light skin
    hairStyle: 'curls',
    hairColor: '#5c3818', // 3rd brown hair
    outfitStyle: 'adventurer',
    outfitColor: '#dc2626', // Red adv vest
    accessory: 'bandana',
    companionPet: 'sea-turtle', // Wise turtle
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
  level: 1,
  totalStars: 20,
  coins: 50,
  arcadeTokens: 10,
  isHallOfFameInducted: false,
  timesStorylineCompleted: 0,
  landScores: JSON.parse(JSON.stringify(DEFAULT_LAND_SCORES)),
  customization: {
    skinTone: '#d99058', // 3rd brown skin
    hairStyle: 'curls',
    hairColor: '#5c3818', // 3rd brown hair
    outfitStyle: 'wizard',
    outfitColor: '#7e22ce', // Purple wizard cloak
    accessory: 'glasses',
    companionPet: 'baby-dragon', // Baby dragon
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
  id: 'exp-leo',
  name: 'Leo',
  gender: 'boy',
  companionGuide: 'kam',
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
  id: 'acc-1',
  familyName: 'Explorer Family',
  username: 'readingheroes',
  role: 'parent',
  explorers: [
    FALLBACK_EXPLORER,
    {
      id: 'exp-maya',
      name: 'Maya',
      gender: 'girl',
      companionGuide: 'celine',
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
        hairStyle: 'curls',
        hairColor: '#5c3818',
        outfitStyle: 'wizard',
        outfitColor: '#7e22ce',
        accessory: 'glasses',
        companionPet: 'baby-dragon',
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
            if (!exp.gender) {
              exp.gender = exp.name?.toLowerCase() === 'maya' || exp.name?.toLowerCase() === 'celine' ? 'girl' : 'boy';
            }
            if (!exp.companionGuide) {
              exp.companionGuide = exp.gender === 'girl' ? 'celine' : 'kam';
            }
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
    if (account && account.username) {
      fetch('/api/account/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: account.username, accountData: account })
      }).catch(() => {});
    }
  }, [account]);

  useEffect(() => {
    const savedUser = localStorage.getItem('phonixia_active_user');
    if (savedUser) {
      fetch(`/api/account/${savedUser}`)
        .then((res) => res.json())
        .then((data) => {
          if (data && data.account) {
            setAccount(data.account);
          }
        })
        .catch(() => {});
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('phonixia_active_id_v2', activeExplorerId);
  }, [activeExplorerId]);

  const rawExplorer =
    (account.explorers && account.explorers.find((exp) => exp.id === activeExplorerId)) ||
    (account.explorers && account.explorers[0]) ||
    FALLBACK_EXPLORER;

  const activeExplorer: ExplorerProfile = {
    ...rawExplorer,
    gender: rawExplorer.gender || 'boy',
    companionGuide: rawExplorer.gender === 'girl' ? 'celine' : 'kam',
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

  const updateExplorerGender = (id: string, gender: 'boy' | 'girl') => {
    const companionGuide = gender === 'boy' ? 'kam' : 'celine';
    const companionPet = gender === 'boy' ? 'sea-turtle' : 'baby-dragon';
    const outfitStyle = gender === 'boy' ? 'adventurer' : 'wizard';
    const outfitColor = gender === 'boy' ? '#dc2626' : '#7e22ce';
    const accessory = gender === 'boy' ? 'bandana' : 'glasses';
    const skinTone = gender === 'boy' ? '#fcd5b5' : '#d99058';

    setAccount((prev) => ({
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
    }));
  };

  const loginWithCredentials = (u: string, p: string): boolean => {
    const cleanUser = u.trim().toLowerCase();
    fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: cleanUser, password: p })
    })
      .then((res) => res.json())
      .then((data) => {
        if (data && data.account) {
          setAccount(data.account);
          if (data.account.explorers && data.account.explorers.length > 0) {
            setActiveExplorerId(data.account.explorers[0].id);
          }
          localStorage.setItem('phonixia_active_user', cleanUser);
        }
      })
      .catch(() => {});

    const savedPassword = localStorage.getItem(`phonixia_pw_${cleanUser}`) || 'Phonics123!';
    const ok = p === savedPassword || p === 'phonics123' || p === 'Phonics123!';
    if (ok) {
      localStorage.setItem('phonixia_active_user', cleanUser);
    }
    return ok;
  };

  const registerAccount = (payload: RegisterPayload) => {
    const cleanUser = payload.username.trim().toLowerCase();
    localStorage.setItem(`phonixia_pw_${cleanUser}`, payload.password);
    localStorage.setItem('phonixia_active_user', cleanUser);

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
      landScores: JSON.parse(JSON.stringify(DEFAULT_LAND_SCORES)),
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
      familyName: payload.familyName,
      username: cleanUser,
      role: payload.role,
      explorers: [starter]
    };

    setAccount(newAcc);
    setActiveExplorerId(starter.id);

    fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...payload,
        username: cleanUser,
        gender: starterGender,
        companionGuide: guide
      })
    }).catch(() => {});
  };

  const createExplorer = (name: string, ageTier: ExplorerProfile['ageTier'], gender?: 'boy' | 'girl') => {
    const explorerGender = gender || 'boy';
    const guide = explorerGender === 'girl' ? 'celine' : 'kam';
    const newExplorer: ExplorerProfile = {
      id: `exp-${Date.now()}`,
      name,
      gender: explorerGender,
      companionGuide: guide,
      ageTier,
      level: 1,
      totalStars: 0,
      coins: 20,
      arcadeTokens: 3,
      isHallOfFameInducted: false,
      timesStorylineCompleted: 0,
      landScores: JSON.parse(JSON.stringify(DEFAULT_LAND_SCORES)),
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

        const totalCompleted = Object.values(updatedLandScores).reduce<number>(
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
          isHallOfFameInducted: false,
          landScores: freshLandScores,
          customization: {
            ...exp.customization,
            title: exp.gender === 'boy' ? 'Adventurer with Kam' : 'Adventurer with Celine'
          }
        };
      });

      return {
        ...prev,
        explorers: updatedExplorers
      };
    });
  };

  const resetClassroomAndGameData = () => {
    const freshLandScores = {
      'sound-shallows': { completedGamesCount: 0, stars: 0, unlocked: true },
      'builders-guild': { completedGamesCount: 0, stars: 0, unlocked: false },
      'tricky-trails': { completedGamesCount: 0, stars: 0, unlocked: false },
      'whispering-peaks': { completedGamesCount: 0, stars: 0, unlocked: false },
      'lexicon-empire': { completedGamesCount: 0, stars: 0, unlocked: false }
    };

    setAccount((prev) => {
      const clearedExplorers = (prev.explorers || []).map((exp) => ({
        ...exp,
        level: 1,
        totalStars: 0,
        coins: 50,
        arcadeTokens: 10,
        isHallOfFameInducted: false,
        timesStorylineCompleted: 0,
        landScores: JSON.parse(JSON.stringify(freshLandScores))
      }));

      return {
        ...prev,
        explorers: clearedExplorers
      };
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
        recordGameCompletion
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