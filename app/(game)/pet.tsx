import { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Animated, Pressable, Dimensions } from 'react-native';
import { router } from 'expo-router';
import { Image } from 'expo-image';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
    Zap,
    Heart,
    Target,
    Shield,
    Flame,
    Dumbbell,
    Utensils,
    Sparkles,
    ChevronRight,
    Swords,
    Trophy,
    Star,
    CircleHelp,
} from 'lucide-react-native';
import * as Haptics from 'expo-haptics';

import { useGame } from '@/context/GameContext';
import { COLORS, EVOLUTION_STAGES, ABILITIES } from '@/constants/game';

const { width } = Dimensions.get('window');

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export default function PetScreen() {
    const { state, feedPet, trainPet, addXp, addCoins, updateQuestProgress } = useGame();
    const insets = useSafeAreaInsets();
    const [selectedTab, setSelectedTab] = useState<'stats' | 'training' | 'evolution'>('stats');
    const [feedAnimation, setFeedAnimation] = useState(false);
    const bounceAnim = useRef(new Animated.Value(0)).current;
    const pulseAnim = useRef(new Animated.Value(1)).current;

    useEffect(() => {
        Animated.loop(
            Animated.sequence([
                Animated.timing(pulseAnim, {
                    toValue: 1.05,
                    duration: 1000,
                    useNativeDriver: true,
                }),
                Animated.timing(pulseAnim, {
                    toValue: 1,
                    duration: 1000,
                    useNativeDriver: true,
                }),
            ])
        ).start();
    }, []);

    const pet = state.currentPet;

    const handleFeed = () => {
        if (state.food > 0 && pet) {
            void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            setFeedAnimation(true);
            feedPet();
            addXp(5);
            updateQuestProgress('feed_5', 1);
            setTimeout(() => setFeedAnimation(false), 500);
        }
    };

    const handleTrain = (stat: keyof import('@/constants/game').PetStats, cost: number) => {
        if (state.coins >= cost && pet) {
            void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
            trainPet(stat, 2);
            addXp(15);
            addCoins(-cost);
            updateQuestProgress('train_3', 1);

            Animated.sequence([
                Animated.timing(bounceAnim, {
                    toValue: 1,
                    duration: 100,
                    useNativeDriver: true,
                }),
                Animated.timing(bounceAnim, {
                    toValue: 0,
                    duration: 100,
                    useNativeDriver: true,
                }),
            ]).start();
        }
    };

    const getPetImage = () => {
        if (!pet) return 'https://r2-pub.rork.com/generated-images/ca53a909-bd49-4038-9ae5-bcca3afd7e93.png';
        const typeImages: Record<string, Record<string, string>> = {
            dog: {
                egg: 'https://r2-pub.rork.com/generated-images/ca53a909-bd49-4038-9ae5-bcca3afd7e93.png',
                baby: 'https://r2-pub.rork.com/generated-images/5146f62a-7c29-4f20-9def-4cb56c0e30f4.png',
                teen: 'https://r2-pub.rork.com/generated-images/5146f62a-7c29-4f20-9def-4cb56c0e30f4.png',
                adult: 'https://r2-pub.rork.com/generated-images/5146f62a-7c29-4f20-9def-4cb56c0e30f4.png',
                legendary: 'https://r2-pub.rork.com/generated-images/5146f62a-7c29-4f20-9def-4cb56c0e30f4.png',
            },
            dragon: {
                egg: 'https://r2-pub.rork.com/generated-images/ca53a909-bd49-4038-9ae5-bcca3afd7e93.png',
                baby: 'https://r2-pub.rork.com/generated-images/61462dd3-0175-4171-860f-a89fdd69fa26.png',
                teen: 'https://r2-pub.rork.com/generated-images/61462dd3-0175-4171-860f-a89fdd69fa26.png',
                adult: 'https://r2-pub.rork.com/generated-images/61462dd3-0175-4171-860f-a89fdd69fa26.png',
                legendary: 'https://r2-pub.rork.com/generated-images/61462dd3-0175-4171-860f-a89fdd69fa26.png',
            },
            tiger: {
                egg: 'https://r2-pub.rork.com/generated-images/ca53a909-bd49-4038-9ae5-bcca3afd7e93.png',
                baby: 'https://r2-pub.rork.com/generated-images/79f98e51-9287-4b6a-a99c-85f55bcc42ee.png',
                teen: 'https://r2-pub.rork.com/generated-images/79f98e51-9287-4b6a-a99c-85f55bcc42ee.png',
                adult: 'https://r2-pub.rork.com/generated-images/79f98e51-9287-4b6a-a99c-85f55bcc42ee.png',
                legendary: 'https://r2-pub.rork.com/generated-images/79f98e51-9287-4b6a-a99c-85f55bcc42ee.png',
            },
            alien: {
                egg: 'https://r2-pub.rork.com/generated-images/ca53a909-bd49-4038-9ae5-bcca3afd7e93.png',
                baby: 'https://r2-pub.rork.com/generated-images/c1a1b2b1-76c0-41f6-9b91-902de1d9733c.png',
                teen: 'https://r2-pub.rork.com/generated-images/c1a1b2b1-76c0-41f6-9b91-902de1d9733c.png',
                adult: 'https://r2-pub.rork.com/generated-images/c1a1b2b1-76c0-41f6-9b91-902de1d9733c.png',
                legendary: 'https://r2-pub.rork.com/generated-images/c1a1b2b1-76c0-41f6-9b91-902de1d9733c.png',
            },
        };
        return typeImages[pet.type]?.[pet.stage] || typeImages[pet.type]?.baby || typeImages.dog.baby;
    };

    if (!pet) {
        return (
            <View style={[styles.emptyContainer, { paddingTop: insets.top }]}>
                <CircleHelp size={80} color={COLORS.textMuted} />
                <Text style={styles.emptyText}>No pet yet!</Text>
                <Text style={styles.emptySubtext}>Go back and hatch an egg first</Text>
            </View>
        );
    }

    const bounceInterpolation = bounceAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [0, -20],
    });

    return (
        <ScrollView style={styles.container} contentContainerStyle={[styles.content, { paddingTop: insets.top + 12 }]}>
            <View style={styles.petDisplay}>
                <Animated.View
                    style={[
                        styles.petImageContainer,
                        { transform: [{ scale: pulseAnim }, { translateY: bounceInterpolation }] },
                    ]}
                >
                    <View style={styles.petGlow} />
                    <Image
                        source={{ uri: getPetImage() }}
                        style={styles.petImage}
                        contentFit="contain"
                    />
                    {feedAnimation && (
                        <Animated.View style={styles.feedEffect}>
                            <Heart size={40} color={COLORS.primary} fill={COLORS.primary} />
                        </Animated.View>
                    )}
                </Animated.View>

                <Text style={styles.petName}>{pet.name}</Text>
                <View style={styles.stageContainer}>
                    <Star size={16} color={COLORS.accent} />
                    <Text style={styles.stageText}>{pet.stage.toUpperCase()}</Text>
                </View>

                <View style={styles.levelBadge}>
                    <Text style={styles.levelText}>Level {pet.level}</Text>
                </View>
            </View>

            <View style={styles.tabs}>
                {(['stats', 'training', 'evolution'] as const).map((tab) => (
                    <Pressable
                        key={tab}
                        style={[styles.tab, selectedTab === tab && styles.activeTab]}
                        onPress={() => setSelectedTab(tab)}
                    >
                        <Text style={[styles.tabText, selectedTab === tab && styles.activeTabText]}>
                            {tab.charAt(0).toUpperCase() + tab.slice(1)}
                        </Text>
                    </Pressable>
                ))}
            </View>

            {selectedTab === 'stats' && (
                <View style={styles.statsContainer}>
                    <View style={styles.statCard}>
                        <View style={styles.statIcon}>
                            <Heart size={24} color={COLORS.primary} />
                        </View>
                        <View style={styles.statInfo}>
                            <Text style={styles.statLabel}>Health</Text>
                            <Text style={styles.statValue}>{pet.stats.health} / {pet.stats.maxHealth}</Text>
                        </View>
                        <View style={styles.statBar}>
                            <View
                                style={[
                                    styles.statBarFill,
                                    { width: `${(pet.stats.health / pet.stats.maxHealth) * 100}%`, backgroundColor: COLORS.primary }
                                ]}
                            />
                        </View>
                    </View>

                    <View style={styles.statCard}>
                        <View style={[styles.statIcon, { backgroundColor: COLORS.secondary + '30' }]}>
                            <Zap size={24} color={COLORS.secondary} />
                        </View>
                        <View style={styles.statInfo}>
                            <Text style={styles.statLabel}>Attack</Text>
                            <Text style={styles.statValue}>{pet.stats.attack}</Text>
                        </View>
                    </View>

                    <View style={styles.statCard}>
                        <View style={[styles.statIcon, { backgroundColor: COLORS.accent + '30' }]}>
                            <Target size={24} color={COLORS.accent} />
                        </View>
                        <View style={styles.statInfo}>
                            <Text style={styles.statLabel}>Speed</Text>
                            <Text style={styles.statValue}>{pet.stats.speed}</Text>
                        </View>
                    </View>

                    <View style={styles.statCard}>
                        <View style={[styles.statIcon, { backgroundColor: COLORS.success + '30' }]}>
                            <Shield size={24} color={COLORS.success} />
                        </View>
                        <View style={styles.statInfo}>
                            <Text style={styles.statLabel}>Defense</Text>
                            <Text style={styles.statValue}>{pet.stats.defense}</Text>
                        </View>
                    </View>

                    <Pressable
                        style={styles.feedButton}
                        onPress={handleFeed}
                        disabled={state.food <= 0}
                    >
                        <Utensils size={20} color={COLORS.text} />
                        <Text style={styles.feedButtonText}>Feed Pet ({state.food} left)</Text>
                    </Pressable>
                </View>
            )}

            {selectedTab === 'training' && (
                <View style={styles.trainingContainer}>
                    <Text style={styles.trainingTitle}>Mini-Games</Text>

                    <AnimatedPressable
                        style={styles.gameCard}
                        onPress={() => router.push('/mini-game?type=tap')}
                    >
                        <View style={[styles.gameIcon, { backgroundColor: COLORS.primary + '30' }]}>
                            <Zap size={32} color={COLORS.primary} />
                        </View>
                        <View style={styles.gameInfo}>
                            <Text style={styles.gameName}>Tap Speed Challenge</Text>
                            <Text style={styles.gameDesc}>Tap as fast as you can! Increases Attack</Text>
                        </View>
                        <ChevronRight size={24} color={COLORS.textMuted} />
                    </AnimatedPressable>

                    <AnimatedPressable
                        style={styles.gameCard}
                        onPress={() => router.push('/mini-game?type=catch')}
                    >
                        <View style={[styles.gameIcon, { backgroundColor: COLORS.secondary + '30' }]}>
                            <Target size={32} color={COLORS.secondary} />
                        </View>
                        <View style={styles.gameInfo}>
                            <Text style={styles.gameName}>Food Catcher</Text>
                            <Text style={styles.gameDesc}>Catch falling food! Increases Speed</Text>
                        </View>
                        <ChevronRight size={24} color={COLORS.textMuted} />
                    </AnimatedPressable>

                    <AnimatedPressable
                        style={styles.gameCard}
                        onPress={() => router.push('/mini-game?type=dodge')}
                    >
                        <View style={[styles.gameIcon, { backgroundColor: COLORS.accent + '30' }]}>
                            <Shield size={32} color={COLORS.accent} />
                        </View>
                        <View style={styles.gameInfo}>
                            <Text style={styles.gameName}>Obstacle Dodge</Text>
                            <Text style={styles.gameDesc}>Dodge obstacles! Increases Defense</Text>
                        </View>
                        <ChevronRight size={24} color={COLORS.textMuted} />
                    </AnimatedPressable>

                    <Text style={styles.trainingTitle}>Quick Training</Text>

                    <View style={styles.quickTraining}>
                        <Pressable
                            style={styles.trainButton}
                            onPress={() => handleTrain('attack', 20)}
                        >
                            <Dumbbell size={20} color={COLORS.text} />
                            <Text style={styles.trainText}>+2 ATK</Text>
                            <Text style={styles.trainCost}>20 coins</Text>
                        </Pressable>
                        <Pressable
                            style={styles.trainButton}
                            onPress={() => handleTrain('speed', 20)}
                        >
                            <Flame size={20} color={COLORS.text} />
                            <Text style={styles.trainText}>+2 SPD</Text>
                            <Text style={styles.trainCost}>20 coins</Text>
                        </Pressable>
                        <Pressable
                            style={styles.trainButton}
                            onPress={() => handleTrain('defense', 20)}
                        >
                            <Shield size={20} color={COLORS.text} />
                            <Text style={styles.trainText}>+2 DEF</Text>
                            <Text style={styles.trainCost}>20 coins</Text>
                        </Pressable>
                    </View>
                </View>
            )}

            {selectedTab === 'evolution' && (
                <View style={styles.evolutionContainer}>
                    <Text style={styles.evolutionTitle}>Evolution Path</Text>

                    {Object.values(EVOLUTION_STAGES).map((stage, index) => {
                        const isUnlocked = pet.level >= (stage === 'egg' ? 0 : stage === 'baby' ? 1 : stage === 'teen' ? 5 : stage === 'adult' ? 15 : 30);
                        const isCurrent = pet.stage === stage;

                        return (
                            <View key={stage} style={styles.evolutionStage}>
                                <View style={[
                                    styles.stageNode,
                                    isUnlocked && styles.stageUnlocked,
                                    isCurrent && styles.stageCurrent,
                                ]}>
                                    {isUnlocked ? (
                                        <Sparkles size={24} color={isCurrent ? COLORS.accent : COLORS.text} />
                                    ) : (
                                        <Star size={24} color={COLORS.textMuted} />
                                    )}
                                </View>
                                <View style={styles.stageInfo}>
                                    <Text style={[
                                        styles.stageName,
                                        isUnlocked && styles.stageNameUnlocked,
                                        isCurrent && styles.stageNameCurrent,
                                    ]}>
                                        {stage.charAt(0).toUpperCase() + stage.slice(1)}
                                    </Text>
                                    <Text style={styles.stageRequirement}>
                                        {stage === 'egg' ? 'Starting Form' : `Level ${stage === 'baby' ? 1 : stage === 'teen' ? 5 : stage === 'adult' ? 15 : 30}`}
                                    </Text>
                                </View>
                                {isCurrent && (
                                    <View style={styles.currentBadge}>
                                        <Text style={styles.currentText}>CURRENT</Text>
                                    </View>
                                )}
                            </View>
                        );
                    })}

                    <View style={styles.abilitiesSection}>
                        <Text style={styles.abilitiesTitle}>Abilities</Text>
                        {pet.abilities.map((ability) => (
                            <View key={ability} style={styles.abilityCard}>
                                <Swords size={20} color={COLORS.primary} />
                                <View style={styles.abilityInfo}>
                                    <Text style={styles.abilityName}>{ABILITIES[ability]?.name || ability}</Text>
                                    <Text style={styles.abilityDesc}>{ABILITIES[ability]?.description || 'Special attack'}</Text>
                                </View>
                                <View style={styles.abilityDamage}>
                                    <Text style={styles.damageText}>{ABILITIES[ability]?.damage || 0} DMG</Text>
                                </View>
                            </View>
                        ))}
                    </View>
                </View>
            )}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    content: {
        paddingBottom: 100,
    },
    emptyContainer: {
        flex: 1,
        backgroundColor: COLORS.background,
        alignItems: 'center',
        justifyContent: 'center',
        gap: 15,
    },
    emptyText: {
        color: COLORS.text,
        fontSize: 24,
        fontWeight: 'bold',
    },
    emptySubtext: {
        color: COLORS.textMuted,
        fontSize: 16,
    },
    petDisplay: {
        alignItems: 'center',
        paddingVertical: 30,
        backgroundColor: COLORS.surface,
        borderBottomLeftRadius: 30,
        borderBottomRightRadius: 30,
    },
    petImageContainer: {
        width: 180,
        height: 180,
        justifyContent: 'center',
        alignItems: 'center',
    },
    petGlow: {
        position: 'absolute',
        width: 200,
        height: 200,
        borderRadius: 100,
        backgroundColor: COLORS.accent + '15',
    },
    petImage: {
        width: 150,
        height: 150,
    },
    feedEffect: {
        position: 'absolute',
        top: -20,
    },
    petName: {
        color: COLORS.text,
        fontSize: 28,
        fontWeight: 'bold',
        marginTop: 15,
    },
    stageContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginTop: 10,
        backgroundColor: COLORS.accent + '20',
        paddingHorizontal: 15,
        paddingVertical: 8,
        borderRadius: 20,
    },
    stageText: {
        color: COLORS.accent,
        fontSize: 14,
        fontWeight: '600',
    },
    levelBadge: {
        marginTop: 10,
        backgroundColor: COLORS.surfaceLight,
        paddingHorizontal: 20,
        paddingVertical: 6,
        borderRadius: 15,
    },
    levelText: {
        color: COLORS.textMuted,
        fontSize: 14,
        fontWeight: '600',
    },
    tabs: {
        flexDirection: 'row',
        paddingHorizontal: 20,
        marginTop: 20,
        gap: 10,
    },
    tab: {
        flex: 1,
        paddingVertical: 12,
        borderRadius: 12,
        backgroundColor: COLORS.surface,
        alignItems: 'center',
    },
    activeTab: {
        backgroundColor: COLORS.primary,
    },
    tabText: {
        color: COLORS.textMuted,
        fontWeight: '600',
    },
    activeTabText: {
        color: COLORS.text,
    },
    statsContainer: {
        padding: 20,
        gap: 15,
    },
    statCard: {
        backgroundColor: COLORS.surface,
        borderRadius: 16,
        padding: 15,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 15,
    },
    statIcon: {
        width: 50,
        height: 50,
        borderRadius: 12,
        backgroundColor: COLORS.primary + '30',
        alignItems: 'center',
        justifyContent: 'center',
    },
    statInfo: {
        flex: 1,
    },
    statLabel: {
        color: COLORS.textMuted,
        fontSize: 12,
    },
    statValue: {
        color: COLORS.text,
        fontSize: 20,
        fontWeight: 'bold',
    },
    statBar: {
        width: 100,
        height: 8,
        backgroundColor: COLORS.surfaceLight,
        borderRadius: 4,
        overflow: 'hidden',
    },
    statBarFill: {
        height: '100%',
        borderRadius: 4,
    },
    feedButton: {
        backgroundColor: COLORS.success,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 10,
        paddingVertical: 16,
        borderRadius: 16,
        marginTop: 10,
    },
    feedButtonText: {
        color: COLORS.text,
        fontSize: 16,
        fontWeight: 'bold',
    },
    trainingContainer: {
        padding: 20,
    },
    trainingTitle: {
        color: COLORS.text,
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 15,
        marginTop: 10,
    },
    gameCard: {
        backgroundColor: COLORS.surface,
        borderRadius: 16,
        padding: 15,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 15,
        marginBottom: 10,
    },
    gameIcon: {
        width: 60,
        height: 60,
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
    },
    gameInfo: {
        flex: 1,
    },
    gameName: {
        color: COLORS.text,
        fontSize: 16,
        fontWeight: '600',
    },
    gameDesc: {
        color: COLORS.textMuted,
        fontSize: 12,
        marginTop: 4,
    },
    quickTraining: {
        flexDirection: 'row',
        gap: 10,
    },
    trainButton: {
        flex: 1,
        backgroundColor: COLORS.surface,
        borderRadius: 12,
        padding: 15,
        alignItems: 'center',
        gap: 8,
    },
    trainText: {
        color: COLORS.text,
        fontSize: 14,
        fontWeight: '600',
    },
    trainCost: {
        color: COLORS.accent,
        fontSize: 12,
    },
    evolutionContainer: {
        padding: 20,
    },
    evolutionTitle: {
        color: COLORS.text,
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    evolutionStage: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 15,
        marginBottom: 15,
        backgroundColor: COLORS.surface,
        padding: 15,
        borderRadius: 16,
    },
    stageNode: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: COLORS.surfaceLight,
        alignItems: 'center',
        justifyContent: 'center',
    },
    stageUnlocked: {
        backgroundColor: COLORS.success + '30',
    },
    stageCurrent: {
        backgroundColor: COLORS.accent + '30',
        borderWidth: 2,
        borderColor: COLORS.accent,
    },
    stageInfo: {
        flex: 1,
    },
    stageName: {
        color: COLORS.textMuted,
        fontSize: 16,
        fontWeight: '600',
        textTransform: 'capitalize',
    },
    stageNameUnlocked: {
        color: COLORS.text,
    },
    stageNameCurrent: {
        color: COLORS.accent,
    },
    stageRequirement: {
        color: COLORS.textMuted,
        fontSize: 12,
        marginTop: 4,
    },
    currentBadge: {
        backgroundColor: COLORS.accent,
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 10,
    },
    currentText: {
        color: COLORS.background,
        fontSize: 10,
        fontWeight: 'bold',
    },
    abilitiesSection: {
        marginTop: 20,
    },
    abilitiesTitle: {
        color: COLORS.text,
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 15,
    },
    abilityCard: {
        backgroundColor: COLORS.surface,
        borderRadius: 12,
        padding: 15,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        marginBottom: 10,
    },
    abilityInfo: {
        flex: 1,
    },
    abilityName: {
        color: COLORS.text,
        fontSize: 14,
        fontWeight: '600',
    },
    abilityDesc: {
        color: COLORS.textMuted,
        fontSize: 12,
        marginTop: 2,
    },
    abilityDamage: {
        backgroundColor: COLORS.primary + '30',
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 8,
    },
    damageText: {
        color: COLORS.primary,
        fontSize: 12,
        fontWeight: 'bold',
    },
});
