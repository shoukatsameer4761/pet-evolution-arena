import createContextHook from '@nkzw/create-context-hook';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState, useCallback, useMemo } from 'react';
import {
    Pet,
    PetType,
    EvolutionStage,
    EVOLUTION_STAGES,
    PET_BASE_STATS,
    STAGE_MULTIPLIERS,
    EVOLUTION_LEVELS,
    Quest,
    Achievement,
    GameState,
} from '@/constants/game';

const STORAGE_KEY = '@pet_evolution_arena';

const generateId = () => Math.random().toString(36).substr(2, 9);

const createInitialPet = (type: PetType): Pet => ({
    id: generateId(),
    name: type.charAt(0).toUpperCase() + type.slice(1),
    type,
    stage: EVOLUTION_STAGES.EGG,
    level: 0,
    xp: 0,
    xpToNextLevel: 100,
    stats: { ...PET_BASE_STATS[type] },
    abilities: ['bite'],
    skin: 'default',
    isHatched: false,
});

const createDailyQuests = (): Quest[] => [
    { id: 'train_3', title: 'Train Your Pet', description: 'Complete 3 training sessions', reward: { coins: 50, food: 10 }, progress: 0, target: 3, completed: false, claimed: false },
    { id: 'win_2', title: 'Arena Champion', description: 'Win 2 arena battles', reward: { coins: 100, gems: 5 }, progress: 0, target: 2, completed: false, claimed: false },
    { id: 'feed_5', title: 'Feeding Time', description: 'Feed your pet 5 times', reward: { food: 20 }, progress: 0, target: 5, completed: false, claimed: false },
    { id: 'evolve', title: 'Evolution', description: 'Evolve your pet to next stage', reward: { gems: 10, coins: 200 }, progress: 0, target: 1, completed: false, claimed: false },
];

const createAchievements = (): Achievement[] => [
    { id: 'first_battle', title: 'First Battle', description: 'Win your first arena battle', reward: { coins: 100 }, unlocked: false, claimed: false },
    { id: 'level_10', title: 'Level 10', description: 'Reach level 10 with any pet', reward: { gems: 20 }, unlocked: false, claimed: false },
    { id: 'legendary', title: 'Legendary', description: 'Evolve a pet to legendary stage', reward: { gems: 100 }, unlocked: false, claimed: false },
    { id: 'battle_10', title: 'Battle Veteran', description: 'Win 10 arena battles', reward: { coins: 500 }, unlocked: false, claimed: false },
];

const initialGameState: GameState = {
    coins: 200,
    gems: 10,
    food: 20,
    currentPet: null,
    ownedPets: [],
    unlockedStages: [EVOLUTION_STAGES.EGG],
    dailyQuests: createDailyQuests(),
    achievements: createAchievements(),
    lastLogin: new Date().toISOString(),
    loginStreak: 1,
    battleWins: 0,
    battleLosses: 0,
    highestArena: 0,
    unlockedSkins: ['default'],
    isVip: false,
    vipExpiryDate: null,
};

export const [GameProvider, useGame] = createContextHook(() => {
    // eslint-disable-next-line react-hooks/exhaustive-deps
    const [state, setState] = useState<GameState>(initialGameState);
    const [isLoading, setIsLoading] = useState(true);
    const [xpMultiplier, setXpMultiplier] = useState(1);

    useEffect(() => {
        void loadGame();
    }, []);

    useEffect(() => {
        if (!isLoading) {
            void saveGame();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [state, isLoading]);

    const loadGame = async () => {
        try {
            const saved = await AsyncStorage.getItem(STORAGE_KEY);
            if (saved) {
                const parsed = JSON.parse(saved);
                const lastLogin = new Date(parsed.lastLogin);
                const now = new Date();
                const daysDiff = Math.floor((now.getTime() - lastLogin.getTime()) / (1000 * 60 * 60 * 24));

                if (daysDiff >= 1) {
                    parsed.loginStreak = daysDiff === 1 ? parsed.loginStreak + 1 : 1;
                    parsed.dailyQuests = createDailyQuests();
                    parsed.coins += Math.min(parsed.loginStreak * 50, 500);
                    parsed.gems += Math.min(parsed.loginStreak, 10);
                }

                setState({ ...initialGameState, ...parsed, lastLogin: now.toISOString() });
            }
        } catch (error) {
            console.error('Failed to load game:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const saveGame = async () => {
        try {
            await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(state));
        } catch (error) {
            console.error('Failed to save game:', error);
        }
    };

    const hatchEgg = useCallback((type: PetType) => {
        const newPet = createInitialPet(type);
        newPet.stage = EVOLUTION_STAGES.BABY;
        newPet.level = 1;
        newPet.isHatched = true;

        setState(prev => ({
            ...prev,
            currentPet: newPet,
            ownedPets: [...prev.ownedPets, newPet],
            unlockedStages: [...new Set([...prev.unlockedStages, EVOLUTION_STAGES.BABY])],
        }));
    }, []);

    const addXp = useCallback((amount: number) => {
        setState(prev => {
            if (!prev.currentPet) return prev;

            const newXp = prev.currentPet.xp + amount * xpMultiplier;
            let newLevel = prev.currentPet.level;
            let xpToNext = prev.currentPet.xpToNextLevel;
            let newStage = prev.currentPet.stage;
            let evolved = false;

            let remainingXp = newXp;
            while (remainingXp >= xpToNext) {
                remainingXp -= xpToNext;
                newLevel++;
                xpToNext = Math.floor(xpToNext * 1.2);

                const stages = Object.values(EVOLUTION_STAGES);
                for (let i = 0; i < stages.length - 1; i++) {
                    if (stages[i] === newStage && newLevel >= EVOLUTION_LEVELS[stages[i + 1]]) {
                        newStage = stages[i + 1];
                        evolved = true;
                    }
                }
            }

            const updatedPet = {
                ...prev.currentPet,
                xp: remainingXp,
                xpToNextLevel: xpToNext,
                level: newLevel,
                stage: newStage,
                stats: evolved ? calculateStats(prev.currentPet.type, newStage, newLevel) : prev.currentPet.stats,
            };

            return {
                ...prev,
                currentPet: updatedPet,
                ownedPets: prev.ownedPets.map(p => p.id === updatedPet.id ? updatedPet : p),
            };
        });
    }, [xpMultiplier]);

    const calculateStats = (type: PetType, stage: EvolutionStage, level: number): import('@/constants/game').PetStats => {
        const base = PET_BASE_STATS[type];
        const multiplier = STAGE_MULTIPLIERS[stage];
        const levelBonus = 1 + (level - 1) * 0.05;

        return {
            health: Math.floor(base.health * multiplier * levelBonus),
            maxHealth: Math.floor(base.maxHealth * multiplier * levelBonus),
            attack: Math.floor(base.attack * multiplier * levelBonus),
            speed: Math.floor(base.speed * multiplier * levelBonus),
            defense: Math.floor(base.defense * multiplier * levelBonus),
        };
    };

    const feedPet = useCallback(() => {
        setState(prev => {
            if (!prev.currentPet || prev.food <= 0) return prev;

            const healAmount = Math.floor(prev.currentPet.stats.maxHealth * 0.2);
            const updatedPet = {
                ...prev.currentPet,
                stats: {
                    ...prev.currentPet.stats,
                    health: Math.min(prev.currentPet.stats.health + healAmount, prev.currentPet.stats.maxHealth),
                },
            };

            return {
                ...prev,
                food: prev.food - 1,
                currentPet: updatedPet,
            };
        });
    }, []);

    const trainPet = useCallback((stat: keyof import('@/constants/game').PetStats, amount: number) => {
        setState(prev => {
            if (!prev.currentPet) return prev;

            const updatedPet = {
                ...prev.currentPet,
                stats: {
                    ...prev.currentPet.stats,
                    [stat]: prev.currentPet.stats[stat] + amount,
                },
            };

            return {
                ...prev,
                currentPet: updatedPet,
            };
        });
    }, []);

    const addCoins = useCallback((amount: number) => {
        setState(prev => ({ ...prev, coins: prev.coins + amount }));
    }, []);

    const addGems = useCallback((amount: number) => {
        setState(prev => ({ ...prev, gems: prev.gems + amount }));
    }, []);

    const addFood = useCallback((amount: number) => {
        setState(prev => ({ ...prev, food: prev.food + amount }));
    }, []);

    const spendCoins = useCallback((amount: number) => {
        setState(prev => ({ ...prev, coins: Math.max(0, prev.coins - amount) }));
    }, []);

    const spendGems = useCallback((amount: number) => {
        setState(prev => ({ ...prev, gems: Math.max(0, prev.gems - amount) }));
    }, []);

    const updateQuestProgress = useCallback((questId: string, progress: number) => {
        setState(prev => ({
            ...prev,
            dailyQuests: prev.dailyQuests.map(q =>
                q.id === questId && !q.completed
                    ? { ...q, progress: Math.min(q.progress + progress, q.target), completed: q.progress + progress >= q.target }
                    : q
            ),
        }));
    }, []);

    const claimQuestReward = useCallback((questId: string) => {
        setState(prev => {
            const quest = prev.dailyQuests.find(q => q.id === questId);
            if (!quest || !quest.completed || quest.claimed) return prev;

            return {
                ...prev,
                coins: prev.coins + (quest.reward.coins || 0),
                gems: prev.gems + (quest.reward.gems || 0),
                food: prev.food + (quest.reward.food || 0),
                dailyQuests: prev.dailyQuests.map(q => q.id === questId ? { ...q, claimed: true } : q),
            };
        });
    }, []);

    const unlockAchievement = useCallback((achievementId: string) => {
        setState(prev => ({
            ...prev,
            achievements: prev.achievements.map(a =>
                a.id === achievementId ? { ...a, unlocked: true } : a
            ),
        }));
    }, []);

    const claimAchievementReward = useCallback((achievementId: string) => {
        setState(prev => {
            const achievement = prev.achievements.find(a => a.id === achievementId);
            if (!achievement || !achievement.unlocked || achievement.claimed) return prev;

            return {
                ...prev,
                coins: prev.coins + (achievement.reward.coins || 0),
                gems: prev.gems + (achievement.reward.gems || 0),
                achievements: prev.achievements.map(a => a.id === achievementId ? { ...a, claimed: true } : a),
            };
        });
    }, []);

    const recordBattleResult = useCallback((won: boolean) => {
        setState(prev => ({
            ...prev,
            battleWins: won ? prev.battleWins + 1 : prev.battleWins,
            battleLosses: !won ? prev.battleLosses + 1 : prev.battleLosses,
        }));
    }, []);

    const activateXpBoost = useCallback((multiplier: number, durationMs: number) => {
        setXpMultiplier(multiplier);
        setTimeout(() => setXpMultiplier(1), durationMs);
    }, []);

    const unlockSkin = useCallback((skinId: string) => {
        setState(prev => ({
            ...prev,
            unlockedSkins: [...new Set([...prev.unlockedSkins, skinId])],
        }));
    }, []);

    const setVipStatus = useCallback((active: boolean, expiryDate?: string) => {
        setState(prev => ({
            ...prev,
            isVip: active,
            vipExpiryDate: expiryDate || null,
        }));
    }, []);

    const equipSkin = useCallback((skinId: string) => {
        setState(prev => {
            if (!prev.currentPet || !prev.unlockedSkins.includes(skinId)) return prev;

            const updatedPet = { ...prev.currentPet, skin: skinId };
            return {
                ...prev,
                currentPet: updatedPet,
                ownedPets: prev.ownedPets.map(p => p.id === updatedPet.id ? updatedPet : p),
            };
        });
    }, []);

    return useMemo(() => ({
        state,
        isLoading,
        xpMultiplier,
        hatchEgg,
        addXp,
        feedPet,
        trainPet,
        addCoins,
        addGems,
        addFood,
        spendCoins,
        spendGems,
        updateQuestProgress,
        claimQuestReward,
        unlockAchievement,
        claimAchievementReward,
        recordBattleResult,
        activateXpBoost,
        unlockSkin,
        setVipStatus,
        equipSkin,
    }), [
        state,
        isLoading,
        xpMultiplier,
        hatchEgg,
        addXp,
        feedPet,
        trainPet,
        addCoins,
        addGems,
        addFood,
        spendCoins,
        spendGems,
        updateQuestProgress,
        claimQuestReward,
        unlockAchievement,
        claimAchievementReward,
        recordBattleResult,
        activateXpBoost,
        unlockSkin,
        setVipStatus,
        equipSkin,
    ]);
});
