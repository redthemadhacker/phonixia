import React, { createContext, useContext, useState, useEffect } from 'react';
import { Account, ExplorerProfile, LandId, MinigameId } from '../types/character';

interface GameContextType {
  account: Account;
  activeExplorer: ExplorerProfile;
  switchExplorer: (id: string) => void;
  createExplorer: (name: string, ageTier: ExplorerProfile['ageTier']) => void;
  updateExplorerScore: (landId: LandId, gamesCompletedDelta: number, starsDelta: number) => void;
  awardCurrency: (coinsDelta: number, tokensDelta: number) => void;
  updateAvatarCustomization: (customization: ExplorerProfile['customization']) => void;
  showHallOfFameCelebration: boolean;
  dismissHallOfFameCelebration: () => void;
  resetExplorerProgress: (explorerId: string) => void;
  logout: () => void;
}

const DEFAULT_LAND_SCORES = {
  'sound-shallows': { completedGamesCount: 0, stars: 0, unlocked: true },
  'builders-guild': { completedGamesCount: 0, stars: 0, unlocked: true },
  'tricky-trails': { completedGamesCount: 0, stars: 0, unlocked: true },
  'whispering-peaks': { completedGamesCount: 0, stars: 0, unlocked: true },
  'lexicon-empire': { completedGamesCount: 0, stars: 0, unlocked: true }
};

const INITIAL_ACCOUNT: Account = {
  id: 'acc-1',
  familyName: 'Explorer Family',
  username: 'readingheroes',
  role: 'parent',
  explorers: [
    {
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
    },
    {
      id: 'exp-maya',
      name: 'Maya',
      ageTier: 'late-elementary',
      level: 50,
      totalStars: 747,
      coins: 850,
      arcadeTokens: 120,
      isHallOfFameInducted: false,
      timesStorylineCompleted: 0,
      landScores: {
        'sound-shallows': { completedGamesCount: 50, stars: 150, unlocked: true },
        'builders-guild': { completedGamesCount: 50, stars: 150, unlocked: true },
        'tricky-trails': { completedGamesCount: 50, stars: 150, unlocked: true },
        'whispering-peaks': { completedGamesCount: 50, stars: 150, unlocked: true },
        'lexicon-empire': { completedGamesCount: 49, stars: 147, unlocked: true }
      },
      customization: {
        skinTone: '#d99058',
        hairStyle: 'braids',
        hairColor: '#1e1b18',
        outfitColor: '#a855f7',
        accessory: 'sparkles',
        companionPet: 'golden-phonix',
        title: 'Vowel Valkyrie'
      }
    }
  ]
};

const GameContext = createContext<GameContextType | undefined>(undefined);

export const GameProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [account, setAccount] = useState<Account>(() => {
    const saved = localStorage.getItem('phonixia_account_v2');
    return saved ? JSON.parse(saved) : INITIAL_ACCOUNT;
  });

  const [activeExplorerId, setActiveExplorerId] = useState<string>(() => {
    return localStorage.getItem('phonixia_active_id_v2') || account.explorers[0].id;
  });

  const [showHallOfFameCelebration, setShowHallOfFameCelebration] = useState(false);

  useEffect(() => {
    localStorage.setItem('phonixia_account_v2', JSON.stringify(account));
  }, [account]);

  useEffect(() => {
    localStorage.setItem('phonixia_active_id_v2', activeExplorerId);
  }, [activeExplorerId]);

  const activeExplorer =
    account.explorers.find((exp) => exp.id === activeExplorerId) || account.explorers[0];

  const switchExplorer = (id: string) => {
    setActiveExplorerId(id);
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
      explorers: [...prev.explorers, newExplorer]
    }));
    setActiveExplorerId(newExplorer.id);
  };

  const updateExplorerScore = (landId: LandId, gamesCompletedDelta: number, starsDelta: number) => {
    setAccount((prev) => {
      const updatedExplorers = prev.explorers.map((exp) => {
        if (exp.id !== activeExplorerId) return exp;

        const currentLand = exp.landScores[landId] || { completedGamesCount: 0, stars: 0, unlocked: true };
        const newCompleted = Math.min(50, currentLand.completedGamesCount + gamesCompletedDelta);
        const newLandStars = currentLand.stars + starsDelta;

        const updatedLandScores = {
          ...exp.landScores,
          [landId]: {
            ...currentLand,
            completedGamesCount: newCompleted,
            stars: newLandStars
          }
        };

        const totalCompleted = Object.values(updatedLandScores).reduce(
          (sum, l) => sum + (l.completedGamesCount || 0),
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
      explorers: prev.explorers.map((exp) =>
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
      explorers: prev.explorers.map((exp) =>
        exp.id === activeExplorerId ? { ...exp, customization } : exp
      )
    }));
  };

  const resetExplorerProgress = (explorerId: string) => {
    setAccount((prev) => {
      const updatedExplorers = prev.explorers.map((exp) => {
        if (exp.id !== explorerId) return exp;

        const freshLandScores = {
          'sound-shallows': { completedGamesCount: 0, stars: 0, unlocked: true },
          'builders-guild': { completedGamesCount: 0, stars: 0, unlocked: true },
          'tricky-trails': { completedGamesCount: 0, stars: 0, unlocked: true },
          'whispering-peaks': { completedGamesCount: 0, stars: 0, unlocked: true },
          'lexicon-empire': { completedGamesCount: 0, stars: 0, unlocked: true }
        };

        return {
          ...exp,
          totalStars: 0,
          level: 1,
          // Permanently stays in Hall of Fame
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

  const dismissHallOfFameCelebration = () => {
    setShowHallOfFameCelebration(false);
  };

  const logout = () => {
    localStorage.removeItem('phonixia_is_logged_in_v1');
  };

  return (
    <GameContext.Provider
      value={{
        account,
        activeExplorer,
        switchExplorer,
        createExplorer,
        updateExplorerScore,
        awardCurrency,
        updateAvatarCustomization,
        showHallOfFameCelebration,
        dismissHallOfFameCelebration,
        resetExplorerProgress,
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