import React, { createContext, useContext, useState, useEffect } from 'react';
import { ExplorerProfile, ParentAccount, LandId, CharacterCustomization } from '../types/character';
import { sounds } from '../utils/audio';

const STORAGE_KEY = 'phonixia_parent_accounts_v4';
const ACTIVE_ACCOUNT_KEY = 'phonixia_active_account_v4';

const DEFAULT_CUSTOMIZATION: CharacterCustomization = {
  skinTone: '#fcd34d',
  hairStyle: 'spiky',
  hairColor: '#78350f',
  outfit: 'ranger-vest',
  headgear: 'explorer-hat',
  companionPet: 'phoenix-chick',
  title: 'Sound Scout'
};

const LAND_ORDER: LandId[] = [
  'sound-shallows',
  'builders-guild',
  'tricky-trails',
  'whispering-peaks',
  'lexicon-empire'
];

export const isLandUnlocked = (landId: LandId, landScores: ExplorerProfile['landScores']): boolean => {
  const index = LAND_ORDER.indexOf(landId);
  if (index <= 0) return true;
  const prevLandId = LAND_ORDER[index - 1];
  const prevLand = landScores[prevLandId];
  if (!prevLand) return false;
  return prevLand.completedGamesCount >= 20 || prevLand.highestLevelUnlocked >= 5;
};

const createEmptyLandScores = (): ExplorerProfile['landScores'] => ({
  'sound-shallows': {
    stars: 3,
    highestLevelUnlocked: 1,
    completedGamesCount: 1,
    totalAccuracy: 100,
    attemptsCount: 1,
    levels: {
      1: { stars: 3, unlocked: true, highScore: 300, completedGames: [1] },
      2: { stars: 0, unlocked: false, highScore: 0, completedGames: [] },
      3: { stars: 0, unlocked: false, highScore: 0, completedGames: [] },
      4: { stars: 0, unlocked: false, highScore: 0, completedGames: [] },
      5: { stars: 0, unlocked: false, highScore: 0, completedGames: [] }
    }
  },
  'builders-guild': {
    stars: 0,
    highestLevelUnlocked: 1,
    completedGamesCount: 0,
    totalAccuracy: 0,
    attemptsCount: 0,
    levels: {
      1: { stars: 0, unlocked: false, highScore: 0, completedGames: [] },
      2: { stars: 0, unlocked: false, highScore: 0, completedGames: [] },
      3: { stars: 0, unlocked: false, highScore: 0, completedGames: [] },
      4: { stars: 0, unlocked: false, highScore: 0, completedGames: [] },
      5: { stars: 0, unlocked: false, highScore: 0, completedGames: [] }
    }
  },
  'tricky-trails': {
    stars: 0,
    highestLevelUnlocked: 1,
    completedGamesCount: 0,
    totalAccuracy: 0,
    attemptsCount: 0,
    levels: {
      1: { stars: 0, unlocked: false, highScore: 0, completedGames: [] },
      2: { stars: 0, unlocked: false, highScore: 0, completedGames: [] },
      3: { stars: 0, unlocked: false, highScore: 0, completedGames: [] },
      4: { stars: 0, unlocked: false, highScore: 0, completedGames: [] },
      5: { stars: 0, unlocked: false, highScore: 0, completedGames: [] }
    }
  },
  'whispering-peaks': {
    stars: 0,
    highestLevelUnlocked: 1,
    completedGamesCount: 0,
    totalAccuracy: 0,
    attemptsCount: 0,
    levels: {
      1: { stars: 0, unlocked: false, highScore: 0, completedGames: [] },
      2: { stars: 0, unlocked: false, highScore: 0, completedGames: [] },
      3: { stars: 0, unlocked: false, highScore: 0, completedGames: [] },
      4: { stars: 0, unlocked: false, highScore: 0, completedGames: [] },
      5: { stars: 0, unlocked: false, highScore: 0, completedGames: [] }
    }
  },
  'lexicon-empire': {
    stars: 0,
    highestLevelUnlocked: 1,
    completedGamesCount: 0,
    totalAccuracy: 0,
    attemptsCount: 0,
    levels: {
      1: { stars: 0, unlocked: false, highScore: 0, completedGames: [] },
      2: { stars: 0, unlocked: false, highScore: 0, completedGames: [] },
      3: { stars: 0, unlocked: false, highScore: 0, completedGames: [] },
      4: { stars: 0, unlocked: false, highScore: 0, completedGames: [] },
      5: { stars: 0, unlocked: false, highScore: 0, completedGames: [] }
    }
  }
});

// Maya setup: 249 / 250 completed. Only Lexicon Empire Level 5 Game 10 remains!
const createMayaNearlyFinishedScores = (): ExplorerProfile['landScores'] => ({
  'sound-shallows': {
    stars: 150,
    highestLevelUnlocked: 5,
    completedGamesCount: 50,
    totalAccuracy: 100,
    attemptsCount: 50,
    levels: {
      1: { stars: 30, unlocked: true, highScore: 300, completedGames: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] },
      2: { stars: 30, unlocked: true, highScore: 300, completedGames: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] },
      3: { stars: 30, unlocked: true, highScore: 300, completedGames: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] },
      4: { stars: 30, unlocked: true, highScore: 300, completedGames: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] },
      5: { stars: 30, unlocked: true, highScore: 300, completedGames: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] }
    }
  },
  'builders-guild': {
    stars: 150,
    highestLevelUnlocked: 5,
    completedGamesCount: 50,
    totalAccuracy: 100,
    attemptsCount: 50,
    levels: {
      1: { stars: 30, unlocked: true, highScore: 300, completedGames: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] },
      2: { stars: 30, unlocked: true, highScore: 300, completedGames: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] },
      3: { stars: 30, unlocked: true, highScore: 300, completedGames: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] },
      4: { stars: 30, unlocked: true, highScore: 300, completedGames: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] },
      5: { stars: 30, unlocked: true, highScore: 300, completedGames: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] }
    }
  },
  'tricky-trails': {
    stars: 150,
    highestLevelUnlocked: 5,
    completedGamesCount: 50,
    totalAccuracy: 100,
    attemptsCount: 50,
    levels: {
      1: { stars: 30, unlocked: true, highScore: 300, completedGames: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] },
      2: { stars: 30, unlocked: true, highScore: 300, completedGames: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] },
      3: { stars: 30, unlocked: true, highScore: 300, completedGames: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] },
      4: { stars: 30, unlocked: true, highScore: 300, completedGames: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] },
      5: { stars: 30, unlocked: true, highScore: 300, completedGames: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] }
    }
  },
  'whispering-peaks': {
    stars: 150,
    highestLevelUnlocked: 5,
    completedGamesCount: 50,
    totalAccuracy: 100,
    attemptsCount: 50,
    levels: {
      1: { stars: 30, unlocked: true, highScore: 300, completedGames: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] },
      2: { stars: 30, unlocked: true, highScore: 300, completedGames: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] },
      3: { stars: 30, unlocked: true, highScore: 300, completedGames: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] },
      4: { stars: 30, unlocked: true, highScore: 300, completedGames: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] },
      5: { stars: 30, unlocked: true, highScore: 300, completedGames: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] }
    }
  },
  'lexicon-empire': {
    stars: 147,
    highestLevelUnlocked: 5,
    completedGamesCount: 49,
    totalAccuracy: 100,
    attemptsCount: 49,
    levels: {
      1: { stars: 30, unlocked: true, highScore: 300, completedGames: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] },
      2: { stars: 30, unlocked: true, highScore: 300, completedGames: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] },
      3: { stars: 30, unlocked: true, highScore: 300, completedGames: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] },
      4: { stars: 30, unlocked: true, highScore: 300, completedGames: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] },
      5: { stars: 27, unlocked: true, highScore: 270, completedGames: [1, 2, 3, 4, 5, 6, 7, 8, 9] } // Game 10 is ready to trigger!
    }
  }
});

const DEFAULT_EXPLORER_KAM: ExplorerProfile = {
  id: 'exp-kam-01',
  name: 'Kam',
  ageTier: 'preschool',
  customization: {
    ...DEFAULT_CUSTOMIZATION,
    hairStyle: 'spiky',
    hairColor: '#1e293b',
    outfit: 'ranger-vest',
    headgear: 'explorer-hat',
    companionPet: 'phoenix-chick',
    title: 'Sound Scout'
  },
  createdAt: new Date().toISOString(),
  totalStars: 3,
  coins: 180,
  arcadeTokens: 45,
  level: 1,
  streakDays: 4,
  lastPlayed: new Date().toISOString(),
  landScores: createEmptyLandScores(),
  minigameScores: {
    bubblePopper: 240,
    wordBlastMiner: 150,
    rhymeRiver: 180,
    syllableSmasher: 210,
    pearlDiver: 120,
    clawCrane: 190,
    vowelPinball: 310,
    whackASound: 270
  },
  achievements: ['First Word Found', 'Shallows Swimmer', 'Explorer Customizer']
};

const DEFAULT_EXPLORER_MAYA: ExplorerProfile = {
  id: 'exp-maya-02',
  name: 'Maya',
  ageTier: 'late-elementary',
  customization: {
    ...DEFAULT_CUSTOMIZATION,
    hairStyle: 'braids',
    hairColor: '#451a03',
    outfit: 'scholar-robe',
    headgear: 'pilot-goggles',
    companionPet: 'golden-eagle',
    title: 'Grand Phonixian'
  },
  createdAt: new Date().toISOString(),
  totalStars: 747,
  coins: 9940,
  arcadeTokens: 995,
  level: 49,
  streakDays: 29,
  lastPlayed: new Date().toISOString(),
  landScores: createMayaNearlyFinishedScores(),
  minigameScores: {
    bubblePopper: 990,
    wordBlastMiner: 850,
    rhymeRiver: 880,
    syllableSmasher: 910,
    pearlDiver: 820,
    clawCrane: 890,
    vowelPinball: 950,
    whackASound: 920
  },
  achievements: [
    'First Word Found',
    'Shallows Swimmer',
    'Explorer Customizer',
    'Guild Architect',
    'Master of Magic E',
    'Eagle Scout'
  ]
};

const SEED_ACCOUNT: ParentAccount = {
  id: 'acc-phoenix-family',
  username: 'kam_family',
  email: 'kam_family@phonixia.edu',
  familyName: 'Phoenix Explorers',
  explorers: [DEFAULT_EXPLORER_KAM, DEFAULT_EXPLORER_MAYA],
  activeExplorerId: DEFAULT_EXPLORER_MAYA.id // Active on Maya for immediate test
};

interface GameContextType {
  account: ParentAccount;
  activeExplorer: ExplorerProfile;
  allAccounts: ParentAccount[];
  switchExplorer: (explorerId: string) => void;
  createExplorer: (name: string, ageTier: ExplorerProfile['ageTier'], customization?: Partial<CharacterCustomization>) => void;
  updateExplorerCustomization: (customization: CharacterCustomization) => void;
  recordGameCompletion: (landId: LandId, levelNumber: number, gameNumber: number, starsEarned: number, score: number, isCorrect: boolean) => void;
  recordMinigameScore: (minigameKey: keyof ExplorerProfile['minigameScores'], score: number) => void;
  createAccount: (username: string, familyName: string, initialKidName: string, initialKidAge: ExplorerProfile['ageTier']) => void;
  loginAccount: (username: string) => boolean;
  logout: () => void;
  soundEnabled: boolean;
  toggleSound: () => void;
  speechEnabled: boolean;
  toggleSpeech: () => void;
  showHallOfFameCelebration: boolean;
  dismissHallOfFameCelebration: () => void;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

export const GameProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [allAccounts, setAllAccounts] = useState<ParentAccount[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {}
    return [SEED_ACCOUNT];
  });

  const [activeAccountId, setActiveAccountId] = useState<string>(() => {
    try {
      const stored = localStorage.getItem(ACTIVE_ACCOUNT_KEY);
      if (stored) return stored;
    } catch {}
    return SEED_ACCOUNT.id;
  });

  const [soundEnabled, setSoundEnabled] = useState(true);
  const [speechEnabled, setSpeechEnabled] = useState(true);
  const [showHallOfFameCelebration, setShowHallOfFameCelebration] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(allAccounts));
      localStorage.setItem(ACTIVE_ACCOUNT_KEY, activeAccountId);
    } catch {}
  }, [allAccounts, activeAccountId]);

  const currentAccount = allAccounts.find(a => a.id === activeAccountId) || allAccounts[0] || SEED_ACCOUNT;
  const activeExplorer = currentAccount.explorers.find(e => e.id === currentAccount.activeExplorerId) || currentAccount.explorers[0] || DEFAULT_EXPLORER_KAM;

  const toggleSound = () => {
    const next = !soundEnabled;
    setSoundEnabled(next);
    sounds.soundEnabled = next;
    if (next) sounds.playStep();
  };

  const toggleSpeech = () => {
    const next = !speechEnabled;
    setSpeechEnabled(next);
    sounds.speechEnabled = next;
  };

  const switchExplorer = (explorerId: string) => {
    setAllAccounts(prev => prev.map(acc => {
      if (acc.id === currentAccount.id) {
        return { ...acc, activeExplorerId: explorerId };
      }
      return acc;
    }));
    sounds.playCoin();
  };

  const createExplorer = (name: string, ageTier: ExplorerProfile['ageTier'], custom?: Partial<CharacterCustomization>) => {
    const newExplorer: ExplorerProfile = {
      id: `exp-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      name: name.trim() || 'Explorer',
      ageTier,
      customization: {
        ...DEFAULT_CUSTOMIZATION,
        ...custom
      },
      createdAt: new Date().toISOString(),
      totalStars: 0,
      coins: 50,
      arcadeTokens: 20,
      level: 1,
      streakDays: 1,
      lastPlayed: new Date().toISOString(),
      landScores: createEmptyLandScores(),
      minigameScores: {
        bubblePopper: 0,
        wordBlastMiner: 0,
        rhymeRiver: 0,
        syllableSmasher: 0,
        pearlDiver: 0,
        clawCrane: 0,
        vowelPinball: 0,
        whackASound: 0
      },
      achievements: ['New Adventurer']
    };

    setAllAccounts(prev => prev.map(acc => {
      if (acc.id === currentAccount.id) {
        return {
          ...acc,
          explorers: [...acc.explorers, newExplorer],
          activeExplorerId: newExplorer.id
        };
      }
      return acc;
    }));
    sounds.playSuccess();
  };

  const updateExplorerCustomization = (customization: CharacterCustomization) => {
    setAllAccounts(prev => prev.map(acc => {
      if (acc.id === currentAccount.id) {
        return {
          ...acc,
          explorers: acc.explorers.map(exp => {
            if (exp.id === acc.activeExplorerId) {
              return { ...exp, customization };
            }
            return exp;
          })
        };
      }
      return acc;
    }));
    sounds.playSuccess();
  };

  const recordGameCompletion = (
    landId: LandId,
    levelNumber: number,
    gameNumber: number,
    starsEarned: number,
    score: number,
    isCorrect: boolean
  ) => {
    setAllAccounts(prev => prev.map(acc => {
      if (acc.id === currentAccount.id) {
        return {
          ...acc,
          explorers: acc.explorers.map(exp => {
            if (exp.id === acc.activeExplorerId) {
              const currentLand = exp.landScores[landId];
              const currentLevel = currentLand.levels[levelNumber] || { stars: 0, unlocked: true, highScore: 0, completedGames: [] };
              
              const updatedGames = currentLevel.completedGames.includes(gameNumber)
                ? currentLevel.completedGames
                : [...currentLevel.completedGames, gameNumber];

              const newLevelStars = Math.max(currentLevel.stars, starsEarned);
              const newHighScore = Math.max(currentLevel.highScore, score);

              const updatedLevels = {
                ...currentLand.levels,
                [levelNumber]: {
                  ...currentLevel,
                  stars: newLevelStars,
                  highScore: newHighScore,
                  completedGames: updatedGames
                }
              };

              let newHighestLevel = currentLand.highestLevelUnlocked;
              if (updatedGames.length >= 5 && levelNumber < 5) {
                newHighestLevel = Math.max(newHighestLevel, levelNumber + 1);
                if (updatedLevels[levelNumber + 1]) {
                  updatedLevels[levelNumber + 1].unlocked = true;
                }
              }

              const totalLandStars = Object.values(updatedLevels).reduce((sum, lvl) => sum + lvl.stars, 0);
              const totalAttempts = currentLand.attemptsCount + 1;
              const totalAcc = Math.round(((currentLand.totalAccuracy * currentLand.attemptsCount) + (isCorrect ? 100 : 30)) / totalAttempts);

              const updatedLandScores = {
                ...exp.landScores,
                [landId]: {
                  ...currentLand,
                  stars: totalLandStars,
                  highestLevelUnlocked: newHighestLevel,
                  completedGamesCount: currentLand.completedGamesCount + (currentLevel.completedGames.includes(gameNumber) ? 0 : 1),
                  totalAccuracy: totalAcc,
                  attemptsCount: totalAttempts,
                  levels: updatedLevels
                }
              };

              const totalStarsAllLands = Object.values(updatedLandScores).reduce((sum, l) => sum + l.stars, 0);
              const totalGamesAllLands = Object.values(updatedLandScores).reduce((sum, l) => sum + l.completedGamesCount, 0);
              const coinsEarned = starsEarned * 15 + (isCorrect ? 10 : 2);
              const tokensEarned = starsEarned * 5;
              const newLevel = Math.floor(totalStarsAllLands / 6) + 1;

              // Check if 250th game was just reached
              const isHallOfFame = totalGamesAllLands >= 250 || totalStarsAllLands >= 750;
              if (isHallOfFame && !exp.achievements.includes('Phonixia Hall of Fame Inductee')) {
                setShowHallOfFameCelebration(true);
                sounds.playFanfare();
                sounds.speak(`Congratulations ${exp.name}! You explored all the lands of Phonixia and mastered reading!`, 0.9, 1.22);
              }

              return {
                ...exp,
                totalStars: totalStarsAllLands,
                coins: exp.coins + coinsEarned,
                arcadeTokens: exp.arcadeTokens + tokensEarned,
                level: newLevel,
                lastPlayed: new Date().toISOString(),
                landScores: updatedLandScores,
                achievements: isHallOfFame && !exp.achievements.includes('Phonixia Hall of Fame Inductee')
                  ? [...exp.achievements, 'Phonixia Hall of Fame Inductee']
                  : exp.achievements
              };
            }
            return exp;
          })
        };
      }
      return acc;
    }));
  };

  const dismissHallOfFameCelebration = () => {
    setShowHallOfFameCelebration(false);
  };

  const recordMinigameScore = (minigameKey: keyof ExplorerProfile['minigameScores'], score: number) => {
    setAllAccounts(prev => prev.map(acc => {
      if (acc.id === currentAccount.id) {
        return {
          ...acc,
          explorers: acc.explorers.map(exp => {
            if (exp.id === acc.activeExplorerId) {
              const currentHigh = exp.minigameScores[minigameKey] || 0;
              const isNewHigh = score > currentHigh;
              return {
                ...exp,
                coins: exp.coins + Math.floor(score / 10),
                arcadeTokens: exp.arcadeTokens + 5,
                minigameScores: {
                  ...exp.minigameScores,
                  [minigameKey]: Math.max(currentHigh, score)
                },
                achievements: isNewHigh && !exp.achievements.includes('Arcade High Roller')
                  ? [...exp.achievements, 'Arcade High Roller']
                  : exp.achievements
              };
            }
            return exp;
          })
        };
      }
      return acc;
    }));
  };

  const createAccount = (username: string, familyName: string, initialKidName: string, initialKidAge: ExplorerProfile['ageTier']) => {
    const newKid: ExplorerProfile = {
      id: `exp-${Date.now()}`,
      name: initialKidName || 'Explorer',
      ageTier: initialKidAge,
      customization: DEFAULT_CUSTOMIZATION,
      createdAt: new Date().toISOString(),
      totalStars: 0,
      coins: 50,
      arcadeTokens: 20,
      level: 1,
      streakDays: 1,
      lastPlayed: new Date().toISOString(),
      landScores: createEmptyLandScores(),
      minigameScores: {
        bubblePopper: 0,
        wordBlastMiner: 0,
        rhymeRiver: 0,
        syllableSmasher: 0,
        pearlDiver: 0,
        clawCrane: 0,
        vowelPinball: 0,
        whackASound: 0
      },
      achievements: ['Welcome to Phonixia']
    };

    const newAcc: ParentAccount = {
      id: `acc-${Date.now()}`,
      username: username.toLowerCase().replace(/\s+/g, '_'),
      email: `${username.toLowerCase()}@phonixia.edu`,
      familyName: familyName || `${username}'s Family`,
      explorers: [newKid],
      activeExplorerId: newKid.id
    };

    setAllAccounts(prev => [...prev, newAcc]);
    setActiveAccountId(newAcc.id);
    sounds.playFanfare();
  };

  const loginAccount = (username: string): boolean => {
    const found = allAccounts.find(a => a.username.toLowerCase() === username.trim().toLowerCase());
    if (found) {
      setActiveAccountId(found.id);
      sounds.playSuccess();
      return true;
    }
    return false;
  };

  const logout = () => {
    setActiveAccountId(SEED_ACCOUNT.id);
  };

  return (
    <GameContext.Provider
      value={{
        account: currentAccount,
        activeExplorer,
        allAccounts,
        switchExplorer,
        createExplorer,
        updateExplorerCustomization,
        recordGameCompletion,
        recordMinigameScore,
        createAccount,
        loginAccount,
        logout,
        soundEnabled,
        toggleSound,
        speechEnabled,
        toggleSpeech,
        showHallOfFameCelebration,
        dismissHallOfFameCelebration
      }}
    >
      {children}
    </GameContext.Provider>
  );
};

export const useGame = () => {
  const ctx = useContext(GameContext);
  if (!ctx) throw new Error('useGame must be used within GameProvider');
  return ctx;
};