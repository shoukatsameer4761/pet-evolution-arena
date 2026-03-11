import { useState, useEffect, useCallback, useRef } from 'react';
import { View, Text, StyleSheet, Pressable, Dimensions, PanResponder } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { X, Timer, Zap, Target, Shield, Trophy } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';

import { useGame } from '@/context/GameContext';
import { COLORS } from '@/constants/game';

const { width, height } = Dimensions.get('window');

interface GameObject {
    id: number;
    x: number;
    y: number;
    type: 'good' | 'bad';
}

export default function MiniGameScreen() {
    const { type } = useLocalSearchParams<{ type: 'tap' | 'catch' | 'dodge' }>();
    const { trainPet, addXp, addCoins, updateQuestProgress } = useGame();

    const [score, setScore] = useState(0);
    const [timeLeft, setTimeLeft] = useState(15);
    const [gameState, setGameState] = useState<'playing' | 'won' | 'lost'>('playing');
    const [objects, setObjects] = useState<GameObject[]>([]);
    const [playerX, setPlayerX] = useState(width / 2 - 30);
    const [collisionDetected, setCollisionDetected] = useState(false);

    const objectIdRef = useRef(0);
    const gameEndedRef = useRef(false);

    const endGame = useCallback((finalScore: number) => {
        if (gameEndedRef.current) return;
        gameEndedRef.current = true;

        setGameState('won');

        let statToTrain: keyof import('@/constants/game').PetStats = 'attack';
        if (type === 'tap') statToTrain = 'attack';
        else if (type === 'catch') statToTrain = 'speed';
        else if (type === 'dodge') statToTrain = 'defense';

        const bonus = Math.floor(finalScore / 5);

        setTimeout(() => {
            trainPet(statToTrain, bonus);
            addXp(finalScore * 2);
            addCoins(finalScore * 2);
            updateQuestProgress('train_3', 1);
        }, 0);

        void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }, [type, trainPet, addXp, addCoins, updateQuestProgress]);

    useEffect(() => {
        if (timeLeft > 0 && gameState === 'playing') {
            const timer = setTimeout(() => setTimeLeft(t => t - 1), 1000);
            return () => clearTimeout(timer);
        } else if (timeLeft === 0 && gameState === 'playing') {
            endGame(score);
        }
    }, [timeLeft, gameState, score, endGame]);

    useEffect(() => {
        if (gameState !== 'playing') return;

        if (type === 'tap' && score >= 30) {
            endGame(score);
        } else if (type === 'catch' && score >= 20) {
            endGame(score);
        }
    }, [score, gameState, type, endGame]);

    useEffect(() => {
        if (collisionDetected && gameState === 'playing') {
            setGameState('lost');
            void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
        }
    }, [collisionDetected, gameState]);

    useEffect(() => {
        if (type === 'catch' || type === 'dodge') {
            const spawnInterval = setInterval(() => {
                if (gameState !== 'playing' || gameEndedRef.current) return;

                const newObj: GameObject = {
                    id: objectIdRef.current++,
                    x: Math.random() * (width - 50),
                    y: type === 'catch' ? -50 : height - 100,
                    type: type === 'dodge' ? (Math.random() > 0.7 ? 'good' : 'bad') : 'good',
                };

                setObjects(prev => [...prev, newObj]);
            }, type === 'catch' ? 800 : 600);

            const moveInterval = setInterval(() => {
                if (gameState !== 'playing' || gameEndedRef.current) return;

                setObjects(prev => {
                    const updated = prev.map(obj => ({
                        ...obj,
                        y: type === 'catch' ? obj.y + 5 : obj.y - 8,
                    })).filter(obj => obj.y > -100 && obj.y < height + 100);

                    if (type === 'dodge') {
                        const collision = updated.find(obj =>
                            obj.type === 'bad' &&
                            obj.y < height - 80 &&
                            obj.y > height - 140 &&
                            obj.x > playerX - 40 &&
                            obj.x < playerX + 100
                        );
                        if (collision && !collisionDetected) {
                            setCollisionDetected(true);
                        }
                    }

                    return updated;
                });
            }, 30);

            return () => {
                clearInterval(spawnInterval);
                clearInterval(moveInterval);
            };
        }
    }, [type, gameState, playerX, collisionDetected]);

    const handleTap = () => {
        if (gameState !== 'playing' || type !== 'tap') return;

        void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        setScore(s => s + 1);
    };

    const handleCatch = (objId: number) => {
        if (gameState !== 'playing') return;

        void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        setObjects(prev => prev.filter(obj => obj.id !== objId));
        setScore(s => s + 1);
    };

    const panResponder = useRef(
        PanResponder.create({
            onMoveShouldSetPanResponder: () => true,
            onPanResponderMove: (_, gestureState) => {
                if (type === 'dodge' && gameState === 'playing') {
                    setPlayerX(Math.max(0, Math.min(width - 60, gestureState.moveX - 30)));
                }
            },
        })
    ).current;

    const getGameTitle = () => {
        switch (type) {
            case 'tap': return 'Tap Speed Challenge';
            case 'catch': return 'Food Catcher';
            case 'dodge': return 'Obstacle Dodge';
            default: return 'Mini Game';
        }
    };

    const getGameIcon = () => {
        switch (type) {
            case 'tap': return <Zap size={24} color={COLORS.primary} />;
            case 'catch': return <Target size={24} color={COLORS.secondary} />;
            case 'dodge': return <Shield size={24} color={COLORS.accent} />;
            default: return null;
        }
    };

    const getStatName = () => {
        switch (type) {
            case 'tap': return 'ATTACK';
            case 'catch': return 'SPEED';
            case 'dodge': return 'DEFENSE';
            default: return 'STATS';
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Pressable onPress={() => router.back()} style={styles.backButton}>
                    <X size={24} color={COLORS.text} />
                </Pressable>
                <View style={styles.titleContainer}>
                    {getGameIcon()}
                    <Text style={styles.title}>{getGameTitle()}</Text>
                </View>
                <View style={styles.placeholder} />
            </View>

            <View style={styles.statsBar}>
                <View style={styles.stat}>
                    <Trophy size={20} color={COLORS.accent} />
                    <Text style={styles.statText}>Score: {score}</Text>
                </View>
                <View style={styles.stat}>
                    <Timer size={20} color={COLORS.primary} />
                    <Text style={styles.statText}>{timeLeft}s</Text>
                </View>
            </View>

            {gameState === 'playing' && (
                <View style={styles.gameArea} {...(type === 'dodge' ? panResponder.panHandlers : {})}>
                    {type === 'tap' && (
                        <Pressable style={styles.tapZone} onPress={handleTap}>
                            <View style={styles.tapCircle}>
                                <Zap size={60} color={COLORS.primary} />
                            </View>
                            <Text style={styles.tapText}>TAP AS FAST AS YOU CAN!</Text>
                            <Text style={styles.tapTarget}>Target: 30 taps</Text>
                        </Pressable>
                    )}

                    {type === 'catch' && (
                        <View style={styles.catchArea}>
                            {objects.map(obj => (
                                <Pressable
                                    key={obj.id}
                                    style={[styles.catchable, { left: obj.x, top: obj.y }]}
                                    onPress={() => handleCatch(obj.id)}
                                >
                                    <View style={styles.foodItem}>
                                        <Text style={styles.foodEmoji}>🍖</Text>
                                    </View>
                                </Pressable>
                            ))}
                            <Text style={styles.catchText}>Catch the food!</Text>
                            <Text style={styles.catchTarget}>Target: 20 food items</Text>
                        </View>
                    )}

                    {type === 'dodge' && (
                        <View style={styles.dodgeArea}>
                            {objects.map(obj => (
                                <View
                                    key={obj.id}
                                    style={[
                                        styles.obstacle,
                                        { left: obj.x, top: obj.y },
                                        obj.type === 'good' && styles.goodObstacle
                                    ]}
                                >
                                    <Text style={styles.obstacleEmoji}>
                                        {obj.type === 'bad' ? '💣' : '💎'}
                                    </Text>
                                </View>
                            ))}
                            <View style={[styles.player, { left: playerX }]}>
                                <Text style={styles.playerEmoji}>🐾</Text>
                            </View>
                            <Text style={styles.dodgeText}>Drag to dodge bombs!</Text>
                            <Text style={styles.dodgeTarget}>Survive 15 seconds</Text>
                        </View>
                    )}
                </View>
            )}

            {gameState === 'won' && (
                <View style={styles.resultContainer}>
                    <View style={styles.resultCard}>
                        <Trophy size={50} color={COLORS.accent} />
                        <Text style={styles.resultTitle}>COMPLETE!</Text>
                        <Text style={styles.resultScore}>Score: {score}</Text>
                        <View style={styles.rewards}>
                            <Text style={styles.rewardText}>+{Math.floor(score / 5)} {getStatName()}</Text>
                            <Text style={styles.rewardText}>+{score * 2} XP</Text>
                            <Text style={styles.rewardText}>+{score * 2} Coins</Text>
                        </View>
                    </View>
                    <Pressable style={styles.continueButton} onPress={() => router.back()}>
                        <Text style={styles.continueText}>CONTINUE</Text>
                    </Pressable>
                </View>
            )}

            {gameState === 'lost' && (
                <View style={styles.resultContainer}>
                    <View style={[styles.resultCard, styles.lostCard]}>
                        <X size={50} color={COLORS.danger} />
                        <Text style={styles.resultTitle}>GAME OVER</Text>
                        <Text style={styles.resultScore}>Score: {score}</Text>
                        <Text style={styles.lostText}>You hit an obstacle!</Text>
                    </View>
                    <Pressable style={styles.continueButton} onPress={() => router.back()}>
                        <Text style={styles.continueText}>TRY AGAIN</Text>
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
    titleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    title: {
        color: COLORS.text,
        fontSize: 18,
        fontWeight: 'bold',
    },
    placeholder: {
        width: 40,
    },
    statsBar: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        paddingVertical: 15,
        backgroundColor: COLORS.surface,
        marginHorizontal: 20,
        borderRadius: 16,
        marginBottom: 20,
    },
    stat: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    statText: {
        color: COLORS.text,
        fontSize: 16,
        fontWeight: '600',
    },
    gameArea: {
        flex: 1,
        marginHorizontal: 20,
        backgroundColor: COLORS.surface,
        borderRadius: 20,
        overflow: 'hidden',
    },
    tapZone: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    tapCircle: {
        width: 200,
        height: 200,
        borderRadius: 100,
        backgroundColor: COLORS.primary + '30',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 4,
        borderColor: COLORS.primary,
    },
    tapText: {
        color: COLORS.text,
        fontSize: 18,
        fontWeight: 'bold',
        marginTop: 30,
    },
    tapTarget: {
        color: COLORS.textMuted,
        fontSize: 14,
        marginTop: 10,
    },
    catchArea: {
        flex: 1,
        position: 'relative',
    },
    catchable: {
        position: 'absolute',
        width: 50,
        height: 50,
        zIndex: 10,
    },
    foodItem: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: COLORS.success + '30',
        alignItems: 'center',
        justifyContent: 'center',
    },
    foodEmoji: {
        fontSize: 28,
    },
    catchText: {
        position: 'absolute',
        bottom: 80,
        alignSelf: 'center',
        color: COLORS.text,
        fontSize: 18,
        fontWeight: 'bold',
    },
    catchTarget: {
        position: 'absolute',
        bottom: 50,
        alignSelf: 'center',
        color: COLORS.textMuted,
        fontSize: 14,
    },
    dodgeArea: {
        flex: 1,
        position: 'relative',
    },
    obstacle: {
        position: 'absolute',
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: COLORS.danger + '30',
        alignItems: 'center',
        justifyContent: 'center',
    },
    goodObstacle: {
        backgroundColor: COLORS.secondary + '30',
    },
    obstacleEmoji: {
        fontSize: 24,
    },
    player: {
        position: 'absolute',
        bottom: 20,
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: COLORS.primary + '50',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 3,
        borderColor: COLORS.primary,
    },
    playerEmoji: {
        fontSize: 30,
    },
    dodgeText: {
        position: 'absolute',
        top: 30,
        alignSelf: 'center',
        color: COLORS.text,
        fontSize: 18,
        fontWeight: 'bold',
    },
    dodgeTarget: {
        position: 'absolute',
        top: 55,
        alignSelf: 'center',
        color: COLORS.textMuted,
        fontSize: 14,
    },
    resultContainer: {
        flex: 1,
        justifyContent: 'center',
        paddingHorizontal: 30,
    },
    resultCard: {
        backgroundColor: COLORS.surface,
        borderRadius: 20,
        padding: 30,
        alignItems: 'center',
        borderWidth: 2,
        borderColor: COLORS.accent,
    },
    lostCard: {
        borderColor: COLORS.danger,
    },
    resultTitle: {
        color: COLORS.text,
        fontSize: 24,
        fontWeight: 'bold',
        marginTop: 15,
    },
    resultScore: {
        color: COLORS.textMuted,
        fontSize: 18,
        marginTop: 10,
    },
    rewards: {
        marginTop: 20,
        gap: 8,
    },
    rewardText: {
        color: COLORS.accent,
        fontSize: 16,
        fontWeight: '600',
    },
    lostText: {
        color: COLORS.danger,
        fontSize: 14,
        marginTop: 10,
    },
    continueButton: {
        backgroundColor: COLORS.primary,
        borderRadius: 16,
        paddingVertical: 18,
        alignItems: 'center',
        marginTop: 20,
    },
    continueText: {
        color: COLORS.text,
        fontSize: 16,
        fontWeight: 'bold',
    },
});
