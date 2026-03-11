import { useState, useEffect, useCallback, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Pressable, Dimensions } from 'react-native';
import { router } from 'expo-router';
import { Swords, Zap, Trophy, X } from 'lucide-react-native';
import { Image } from 'expo-image';
import * as Haptics from 'expo-haptics';

import { useGame } from '@/context/GameContext';
import { COLORS, ABILITIES, Pet } from '@/constants/game';

const { width: _width } = Dimensions.get('window');

interface BattlePet extends Pet {
    currentHealth: number;
}

const ENEMY_TYPES = ['dog', 'dragon', 'tiger', 'alien'] as const;

const generateEnemy = (playerLevel: number): BattlePet => {
    const type = ENEMY_TYPES[Math.floor(Math.random() * ENEMY_TYPES.length)];
    const level = Math.max(1, playerLevel + Math.floor(Math.random() * 5) - 2);

    return {
        id: 'enemy',
        name: `Wild ${type.charAt(0).toUpperCase() + type.slice(1)}`,
        type,
        stage: level >= 30 ? 'legendary' : level >= 15 ? 'adult' : level >= 5 ? 'teen' : 'baby',
        level,
        xp: 0,
        xpToNextLevel: 100,
        stats: {
            health: 80 + level * 8,
            maxHealth: 80 + level * 8,
            attack: 12 + level * 2,
            speed: 10 + level,
            defense: 8 + level,
        },
        abilities: ['bite'],
        skin: 'default',
        isHatched: true,
        currentHealth: 80 + level * 8,
    };
};

export default function BattleScreen() {
    const { state, addXp, addCoins, recordBattleResult, updateQuestProgress } = useGame();
    const [playerPet, setPlayerPet] = useState<BattlePet | null>(null);
    const [enemyPet, setEnemyPet] = useState<BattlePet | null>(null);
    const [timeLeft, setTimeLeft] = useState(30);
    const [battleState, setBattleState] = useState<'active' | 'won' | 'lost'>('active');
    const [message, setMessage] = useState('');
    const [specialCooldown, setSpecialCooldown] = useState(0);
    const [isAttacking, setIsAttacking] = useState(false);

    const playerShake = useRef(new Animated.Value(0)).current;
    const enemyShake = useRef(new Animated.Value(0)).current;
    const playerFloat = useRef(new Animated.Value(0)).current;
    const enemyFloat = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        if (state.currentPet) {
            setPlayerPet({
                ...state.currentPet,
                currentHealth: state.currentPet.stats.maxHealth,
            });
            setEnemyPet(generateEnemy(state.currentPet.level));
        }

        const floatAnim = Animated.loop(
            Animated.sequence([
                Animated.timing(playerFloat, {
                    toValue: 1,
                    duration: 1000,
                    useNativeDriver: true,
                }),
                Animated.timing(playerFloat, {
                    toValue: 0,
                    duration: 1000,
                    useNativeDriver: true,
                }),
            ])
        );
        floatAnim.start();

        return () => {
            floatAnim.stop();
        };
    }, [state.currentPet]);

    useEffect(() => {
        if (timeLeft > 0 && battleState === 'active') {
            const timer = setTimeout(() => setTimeLeft(t => t - 1), 1000);
            return () => clearTimeout(timer);
        } else if (timeLeft === 0 && battleState === 'active') {
            endBattle(playerPet!.currentHealth > enemyPet!.currentHealth);
        }
    }, [timeLeft, battleState, playerPet, enemyPet]);

    useEffect(() => {
        if (specialCooldown > 0) {
            const timer = setTimeout(() => setSpecialCooldown(c => c - 1), 1000);
            return () => clearTimeout(timer);
        }
    }, [specialCooldown]);

    const shakeAnimation = (anim: Animated.Value) => {
        Animated.sequence([
            Animated.timing(anim, { toValue: 10, duration: 50, useNativeDriver: true }),
            Animated.timing(anim, { toValue: -10, duration: 50, useNativeDriver: true }),
            Animated.timing(anim, { toValue: 10, duration: 50, useNativeDriver: true }),
            Animated.timing(anim, { toValue: 0, duration: 50, useNativeDriver: true }),
        ]).start();
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
    const handleAttack = useCallback(() => {
        if (!playerPet || !enemyPet || isAttacking || battleState !== 'active') return;

        setIsAttacking(true);
        void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

        const damage = Math.floor(playerPet.stats.attack * (0.8 + Math.random() * 0.4));
        const newEnemyHealth = Math.max(0, enemyPet.currentHealth - damage);

        setEnemyPet({ ...enemyPet, currentHealth: newEnemyHealth });
        shakeAnimation(enemyShake);
        setMessage(`-${damage}!`);

        setTimeout(() => {
            if (newEnemyHealth <= 0) {
                endBattle(true);
            } else {
                enemyAttack();
            }
            setIsAttacking(false);
        }, 500);
    }, [playerPet, enemyPet, isAttacking, battleState]);

    // eslint-disable-next-line react-hooks/exhaustive-deps
    const handleSpecial = useCallback(() => {
        if (!playerPet || !enemyPet || specialCooldown > 0 || isAttacking || battleState !== 'active') return;

        setIsAttacking(true);
        setSpecialCooldown(5);
        void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);

        const damage = Math.floor(playerPet.stats.attack * 1.5 * (0.8 + Math.random() * 0.4));
        const newEnemyHealth = Math.max(0, enemyPet.currentHealth - damage);

        setEnemyPet({ ...enemyPet, currentHealth: newEnemyHealth });
        shakeAnimation(enemyShake);
        setMessage(`SPECIAL! -${damage}!`);

        setTimeout(() => {
            if (newEnemyHealth <= 0) {
                endBattle(true);
            } else {
                enemyAttack();
            }
            setIsAttacking(false);
        }, 500);
    }, [playerPet, enemyPet, specialCooldown, isAttacking, battleState]);

    // eslint-disable-next-line react-hooks/exhaustive-deps
    const enemyAttack = useCallback(() => {
        if (!playerPet || !enemyPet || battleState !== 'active') return;

        const damage = Math.floor(enemyPet.stats.attack * (0.7 + Math.random() * 0.4) * (100 / (100 + playerPet.stats.defense)));
        const newPlayerHealth = Math.max(0, playerPet.currentHealth - damage);

        setPlayerPet({ ...playerPet, currentHealth: newPlayerHealth });
        shakeAnimation(playerShake);
        setMessage(`Enemy attacks! -${damage}`);

        if (newPlayerHealth <= 0) {
            endBattle(false);
        }
    }, [playerPet, enemyPet, battleState]);

    const endBattle = useCallback((won: boolean) => {
        setBattleState(won ? 'won' : 'lost');
        recordBattleResult(won);

        if (won) {
            const xpReward = 50 + (enemyPet?.level || 1) * 5;
            const coinReward = 30 + (enemyPet?.level || 1) * 3;
            addXp(xpReward);
            addCoins(coinReward);
            updateQuestProgress('win_2', 1);
            void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        } else {
            void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
        }
    }, [enemyPet, recordBattleResult, addXp, addCoins, updateQuestProgress]);

    const getPetImage = (pet: BattlePet | null, _isEnemy = false) => {
        if (!pet) return 'https://r2-pub.rork.com/generated-images/ca53a909-bd49-4038-9ae5-bcca3afd7e93.png';
        const typeImages: Record<string, string> = {
            dog: 'https://r2-pub.rork.com/generated-images/5146f62a-7c29-4f20-9def-4cb56c0e30f4.png',
            dragon: 'https://r2-pub.rork.com/generated-images/61462dd3-0175-4171-860f-a89fdd69fa26.png',
            tiger: 'https://r2-pub.rork.com/generated-images/79f98e51-9287-4b6a-a99c-85f55bcc42ee.png',
            alien: 'https://r2-pub.rork.com/generated-images/c1a1b2b1-76c0-41f6-9b91-902de1d9733c.png',
        };
        return typeImages[pet.type] || typeImages.dog;
    };

    if (!playerPet || !enemyPet) {
        return (
            <View style={styles.container}>
                <Text style={styles.loadingText}>Preparing battle...</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Pressable onPress={() => router.back()} style={styles.backButton}>
                    <X size={24} color={COLORS.text} />
                </Pressable>
                <View style={styles.timerContainer}>
                    <Text style={styles.timer}>{timeLeft}s</Text>
                </View>
                <View style={styles.placeholder} />
            </View>

            <View style={styles.battleArea}>
                <Animated.View
                    style={[
                        styles.petContainer,
                        {
                            transform: [
                                { translateX: enemyShake },
                                { translateY: enemyFloat.interpolate({ inputRange: [0, 1], outputRange: [0, -5] }) }
                            ]
                        }
                    ]}
                >
                    <View style={styles.enemyBadge}>
                        <Text style={styles.enemyBadgeText}>ENEMY</Text>
                    </View>
                    <Image
                        source={{ uri: getPetImage(enemyPet, true) }}
                        style={styles.petImage}
                        contentFit="contain"
                    />
                    <Text style={styles.petName}>{enemyPet.name}</Text>
                    <Text style={styles.petLevel}>Lv.{enemyPet.level}</Text>
                    <View style={styles.healthBar}>
                        <View
                            style={[
                                styles.healthFill,
                                {
                                    width: `${(enemyPet.currentHealth / enemyPet.stats.maxHealth) * 100}%`,
                                    backgroundColor: enemyPet.currentHealth < enemyPet.stats.maxHealth * 0.3 ? COLORS.danger : COLORS.success
                                }
                            ]}
                        />
                    </View>
                    <Text style={styles.healthText}>{enemyPet.currentHealth}/{enemyPet.stats.maxHealth}</Text>
                </Animated.View>

                {message && (
                    <View style={styles.messageContainer}>
                        <Text style={styles.messageText}>{message}</Text>
                    </View>
                )}

                <Animated.View
                    style={[
                        styles.petContainer,
                        {
                            transform: [
                                { translateX: playerShake },
                                { translateY: playerFloat.interpolate({ inputRange: [0, 1], outputRange: [0, -5] }) }
                            ]
                        }
                    ]}
                >
                    <View style={styles.playerBadge}>
                        <Text style={styles.playerBadgeText}>YOU</Text>
                    </View>
                    <Image
                        source={{ uri: getPetImage(playerPet) }}
                        style={styles.petImage}
                        contentFit="contain"
                    />
                    <Text style={styles.petName}>{playerPet.name}</Text>
                    <Text style={styles.petLevel}>Lv.{playerPet.level}</Text>
                    <View style={styles.healthBar}>
                        <View
                            style={[
                                styles.healthFill,
                                {
                                    width: `${(playerPet.currentHealth / playerPet.stats.maxHealth) * 100}%`,
                                    backgroundColor: playerPet.currentHealth < playerPet.stats.maxHealth * 0.3 ? COLORS.danger : COLORS.primary
                                }
                            ]}
                        />
                    </View>
                    <Text style={styles.healthText}>{playerPet.currentHealth}/{playerPet.stats.maxHealth}</Text>
                </Animated.View>
            </View>

            {battleState === 'active' ? (
                <View style={styles.controls}>
                    <Pressable
                        style={[styles.attackButton, isAttacking && styles.buttonDisabled]}
                        onPress={handleAttack}
                        disabled={isAttacking}
                    >
                        <Swords size={28} color={COLORS.text} />
                        <Text style={styles.buttonText}>ATTACK</Text>
                    </Pressable>

                    <Pressable
                        style={[
                            styles.specialButton,
                            (specialCooldown > 0 || isAttacking) && styles.buttonDisabled
                        ]}
                        onPress={handleSpecial}
                        disabled={specialCooldown > 0 || isAttacking}
                    >
                        <Zap size={28} color={COLORS.text} />
                        <Text style={styles.buttonText}>
                            {specialCooldown > 0 ? `${specialCooldown}s` : 'SPECIAL'}
                        </Text>
                    </Pressable>
                </View>
            ) : (
                <View style={styles.resultContainer}>
                    <View style={[styles.resultBadge, battleState === 'won' ? styles.wonBadge : styles.lostBadge]}>
                        {battleState === 'won' ? (
                            <>
                                <Trophy size={40} color={COLORS.accent} />
                                <Text style={styles.resultText}>VICTORY!</Text>
                                <Text style={styles.rewardText}>+50 XP • +30 Coins</Text>
                            </>
                        ) : (
                            <>
                                <X size={40} color={COLORS.danger} />
                                <Text style={styles.resultText}>DEFEAT</Text>
                                <Text style={styles.rewardText}>Try again!</Text>
                            </>
                        )}
                    </View>
                    <Pressable style={styles.continueButton} onPress={() => router.back()}>
                        <Text style={styles.continueText}>CONTINUE</Text>
                    </Pressable>
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingTop: 60,
        paddingBottom: 10,
    },
    backButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: COLORS.surface,
        alignItems: 'center',
        justifyContent: 'center',
    },
    timerContainer: {
        backgroundColor: COLORS.surface,
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 20,
    },
    timer: {
        color: COLORS.text,
        fontSize: 20,
        fontWeight: 'bold',
    },
    placeholder: {
        width: 40,
    },
    battleArea: {
        flex: 1,
        justifyContent: 'space-around',
        paddingHorizontal: 30,
        paddingVertical: 20,
    },
    petContainer: {
        alignItems: 'center',
    },
    enemyBadge: {
        backgroundColor: COLORS.danger + '30',
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 10,
        marginBottom: 10,
    },
    enemyBadgeText: {
        color: COLORS.danger,
        fontSize: 10,
        fontWeight: 'bold',
    },
    playerBadge: {
        backgroundColor: COLORS.primary + '30',
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 10,
        marginBottom: 10,
    },
    playerBadgeText: {
        color: COLORS.primary,
        fontSize: 10,
        fontWeight: 'bold',
    },
    petImage: {
        width: 120,
        height: 120,
    },
    petName: {
        color: COLORS.text,
        fontSize: 18,
        fontWeight: 'bold',
        marginTop: 10,
    },
    petLevel: {
        color: COLORS.textMuted,
        fontSize: 14,
        marginTop: 2,
    },
    healthBar: {
        width: 150,
        height: 10,
        backgroundColor: COLORS.surfaceLight,
        borderRadius: 5,
        marginTop: 10,
        overflow: 'hidden',
    },
    healthFill: {
        height: '100%',
        borderRadius: 5,
    },
    healthText: {
        color: COLORS.textMuted,
        fontSize: 12,
        marginTop: 4,
    },
    messageContainer: {
        backgroundColor: COLORS.surface,
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 15,
        alignSelf: 'center',
    },
    messageText: {
        color: COLORS.text,
        fontSize: 16,
        fontWeight: 'bold',
    },
    controls: {
        flexDirection: 'row',
        gap: 20,
        paddingHorizontal: 30,
        paddingBottom: 50,
    },
    attackButton: {
        flex: 1,
        backgroundColor: COLORS.primary,
        borderRadius: 16,
        paddingVertical: 20,
        alignItems: 'center',
        gap: 8,
        shadowColor: COLORS.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.4,
        shadowRadius: 8,
        elevation: 8,
    },
    specialButton: {
        flex: 1,
        backgroundColor: COLORS.secondary,
        borderRadius: 16,
        paddingVertical: 20,
        alignItems: 'center',
        gap: 8,
        shadowColor: COLORS.secondary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.4,
        shadowRadius: 8,
        elevation: 8,
    },
    buttonDisabled: {
        opacity: 0.5,
    },
    buttonText: {
        color: COLORS.text,
        fontSize: 14,
        fontWeight: 'bold',
    },
    resultContainer: {
        paddingHorizontal: 30,
        paddingBottom: 50,
    },
    resultBadge: {
        borderRadius: 20,
        padding: 30,
        alignItems: 'center',
        marginBottom: 20,
    },
    wonBadge: {
        backgroundColor: COLORS.accent + '20',
        borderWidth: 2,
        borderColor: COLORS.accent,
    },
    lostBadge: {
        backgroundColor: COLORS.danger + '20',
        borderWidth: 2,
        borderColor: COLORS.danger,
    },
    resultText: {
        color: COLORS.text,
        fontSize: 28,
        fontWeight: 'bold',
        marginTop: 10,
    },
    rewardText: {
        color: COLORS.textMuted,
        fontSize: 16,
        marginTop: 5,
    },
    continueButton: {
        backgroundColor: COLORS.surface,
        borderRadius: 16,
        paddingVertical: 18,
        alignItems: 'center',
    },
    continueText: {
        color: COLORS.text,
        fontSize: 16,
        fontWeight: 'bold',
    },
    loadingText: {
        color: COLORS.text,
        fontSize: 20,
        textAlign: 'center',
        marginTop: 100,
    },
});
