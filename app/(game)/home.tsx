import { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, Animated, Pressable } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Coins, Gem, Trophy, Zap, Star, Gift, Flame, Target } from 'lucide-react-native';
import { Image } from 'expo-image';

import { useGame } from '@/context/GameContext';
import { COLORS } from '@/constants/game';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export default function HomeScreen() {
    const { state, hatchEgg, claimQuestReward } = useGame();
    const insets = useSafeAreaInsets();
    const pulseAnim = useRef(new Animated.Value(1)).current;
    const floatAnim = useRef(new Animated.Value(0)).current;

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

        Animated.loop(
            Animated.sequence([
                Animated.timing(floatAnim, {
                    toValue: 1,
                    duration: 2000,
                    useNativeDriver: true,
                }),
                Animated.timing(floatAnim, {
                    toValue: 0,
                    duration: 2000,
                    useNativeDriver: true,
                }),
            ])
        ).start();
    }, [pulseAnim, floatAnim]);

    const floatInterpolation = floatAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [0, -10],
    });

    const hasEgg = !state.currentPet;
    const petImageUrl = hasEgg
        ? 'https://r2-pub.rork.com/generated-images/ca53a909-bd49-4038-9ae5-bcca3afd7e93.png'
        : state.currentPet?.type === 'dog' ? 'https://r2-pub.rork.com/generated-images/5146f62a-7c29-4f20-9def-4cb56c0e30f4.png'
            : state.currentPet?.type === 'dragon' ? 'https://r2-pub.rork.com/generated-images/61462dd3-0175-4171-860f-a89fdd69fa26.png'
                : state.currentPet?.type === 'tiger' ? 'https://r2-pub.rork.com/generated-images/79f98e51-9287-4b6a-a99c-85f55bcc42ee.png'
                    : 'https://r2-pub.rork.com/generated-images/c1a1b2b1-76c0-41f6-9b91-902de1d9733c.png';

    return (
        <ScrollView style={styles.container} contentContainerStyle={[styles.content, { paddingTop: insets.top + 12 }]}>
            <View style={styles.header}>
                <View style={styles.currencyContainer}>
                    <View style={styles.currency}>
                        <Coins size={20} color={COLORS.accent} />
                        <Text style={styles.currencyText}>{state.coins}</Text>
                    </View>
                    <View style={styles.currency}>
                        <Gem size={20} color={COLORS.secondary} />
                        <Text style={styles.currencyText}>{state.gems}</Text>
                    </View>
                </View>
                <View style={styles.streakBadge}>
                    <Flame size={16} color={COLORS.primary} />
                    <Text style={styles.streakText}>{state.loginStreak} Day Streak</Text>
                </View>
            </View>

            <Animated.View
                style={[
                    styles.petContainer,
                    { transform: [{ scale: pulseAnim }, { translateY: floatInterpolation }] },
                ]}
            >
                <View style={styles.petGlow} />
                <Image
                    source={{ uri: petImageUrl }}
                    style={styles.petImage}
                    contentFit="contain"
                />
                {hasEgg && (
                    <View style={styles.hatchOverlay}>
                        <Text style={styles.hatchText}>Tap to Hatch!</Text>
                    </View>
                )}
            </Animated.View>

            {state.currentPet && (
                <View style={styles.statsCard}>
                    <View style={styles.petHeader}>
                        <Text style={styles.petName}>{state.currentPet.name}</Text>
                        <View style={styles.stageBadge}>
                            <Star size={12} color={COLORS.accent} />
                            <Text style={styles.stageText}>{state.currentPet.stage}</Text>
                        </View>
                    </View>
                    <Text style={styles.levelText}>Level {state.currentPet.level}</Text>

                    <View style={styles.xpBar}>
                        <View
                            style={[
                                styles.xpFill,
                                { width: `${(state.currentPet.xp / state.currentPet.xpToNextLevel) * 100}%` }
                            ]}
                        />
                    </View>
                    <Text style={styles.xpText}>
                        {state.currentPet.xp} / {state.currentPet.xpToNextLevel} XP
                    </Text>

                    <View style={styles.statsRow}>
                        <View style={styles.stat}>
                            <Zap size={16} color={COLORS.primary} />
                            <Text style={styles.statValue}>{state.currentPet.stats.attack}</Text>
                            <Text style={styles.statLabel}>ATK</Text>
                        </View>
                        <View style={styles.stat}>
                            <Target size={16} color={COLORS.secondary} />
                            <Text style={styles.statValue}>{state.currentPet.stats.speed}</Text>
                            <Text style={styles.statLabel}>SPD</Text>
                        </View>
                        <View style={styles.stat}>
                            <Trophy size={16} color={COLORS.accent} />
                            <Text style={styles.statValue}>{state.battleWins}</Text>
                            <Text style={styles.statLabel}>WINS</Text>
                        </View>
                    </View>
                </View>
            )}

            {hasEgg && (
                <View style={styles.eggSelection}>
                    <Text style={styles.sectionTitle}>Choose Your Egg</Text>
                    <View style={styles.eggGrid}>
                        {['dog', 'dragon', 'tiger', 'alien'].map((type) => (
                            <AnimatedPressable
                                key={type}
                                style={styles.eggOption}
                                onPress={() => hatchEgg(type as import('@/constants/game').PetType)}
                            >
                                <Image
                                    source={{ uri: 'https://r2-pub.rork.com/generated-images/ca53a909-bd49-4038-9ae5-bcca3afd7e93.png' }}
                                    style={styles.eggImage}
                                    contentFit="contain"
                                />
                                <Text style={styles.eggType}>{type.charAt(0).toUpperCase() + type.slice(1)}</Text>
                            </AnimatedPressable>
                        ))}
                    </View>
                </View>
            )}

            <View style={styles.questsSection}>
                <Text style={styles.sectionTitle}>Daily Quests</Text>
                {state.dailyQuests.map((quest) => (
                    <View key={quest.id} style={styles.questCard}>
                        <View style={styles.questInfo}>
                            <Text style={styles.questTitle}>{quest.title}</Text>
                            <Text style={styles.questDesc}>{quest.description}</Text>
                            <View style={styles.questProgress}>
                                <View style={styles.progressBar}>
                                    <View
                                        style={[
                                            styles.progressFill,
                                            { width: `${(quest.progress / quest.target) * 100}%` }
                                        ]}
                                    />
                                </View>
                                <Text style={styles.progressText}>{quest.progress}/{quest.target}</Text>
                            </View>
                        </View>
                        <View style={styles.questReward}>
                            {quest.reward.coins && (
                                <View style={styles.rewardItem}>
                                    <Coins size={12} color={COLORS.accent} />
                                    <Text style={styles.rewardText}>{quest.reward.coins}</Text>
                                </View>
                            )}
                            {quest.reward.gems && (
                                <View style={styles.rewardItem}>
                                    <Gem size={12} color={COLORS.secondary} />
                                    <Text style={styles.rewardText}>{quest.reward.gems}</Text>
                                </View>
                            )}
                            {quest.completed && !quest.claimed && (
                                <Pressable
                                    style={styles.claimButton}
                                    onPress={() => claimQuestReward(quest.id)}
                                >
                                    <Gift size={16} color={COLORS.text} />
                                </Pressable>
                            )}
                        </View>
                    </View>
                ))}
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    content: {
        padding: 20,
        paddingBottom: 100,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    currencyContainer: {
        flexDirection: 'row',
        gap: 15,
    },
    currency: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        backgroundColor: COLORS.surface,
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
    },
    currencyText: {
        color: COLORS.text,
        fontWeight: 'bold',
        fontSize: 14,
    },
    streakBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        backgroundColor: COLORS.primary + '30',
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 15,
    },
    streakText: {
        color: COLORS.primary,
        fontSize: 12,
        fontWeight: '600',
    },
    petContainer: {
        width: 200,
        height: 200,
        alignSelf: 'center',
        alignItems: 'center',
        justifyContent: 'center',
        marginVertical: 20,
    },
    petGlow: {
        position: 'absolute',
        width: 250,
        height: 250,
        borderRadius: 125,
        backgroundColor: COLORS.accent + '15',
    },
    petImage: {
        width: 180,
        height: 180,
    },
    hatchOverlay: {
        position: 'absolute',
        bottom: 0,
        backgroundColor: COLORS.primary,
        paddingHorizontal: 20,
        paddingVertical: 8,
        borderRadius: 20,
    },
    hatchText: {
        color: COLORS.text,
        fontWeight: 'bold',
        fontSize: 14,
    },
    statsCard: {
        backgroundColor: COLORS.surface,
        borderRadius: 20,
        padding: 20,
        marginBottom: 20,
    },
    petHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    petName: {
        color: COLORS.text,
        fontSize: 24,
        fontWeight: 'bold',
    },
    stageBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        backgroundColor: COLORS.accent + '30',
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 15,
    },
    stageText: {
        color: COLORS.accent,
        fontSize: 12,
        fontWeight: '600',
        textTransform: 'capitalize',
    },
    levelText: {
        color: COLORS.textMuted,
        fontSize: 16,
        marginTop: 5,
    },
    xpBar: {
        height: 8,
        backgroundColor: COLORS.surfaceLight,
        borderRadius: 4,
        marginTop: 15,
        overflow: 'hidden',
    },
    xpFill: {
        height: '100%',
        backgroundColor: COLORS.secondary,
        borderRadius: 4,
    },
    xpText: {
        color: COLORS.textMuted,
        fontSize: 12,
        textAlign: 'center',
        marginTop: 5,
    },
    statsRow: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginTop: 20,
        paddingTop: 20,
        borderTopWidth: 1,
        borderTopColor: COLORS.surfaceLight,
    },
    stat: {
        alignItems: 'center',
    },
    statValue: {
        color: COLORS.text,
        fontSize: 20,
        fontWeight: 'bold',
        marginTop: 5,
    },
    statLabel: {
        color: COLORS.textMuted,
        fontSize: 12,
        marginTop: 2,
    },
    eggSelection: {
        marginBottom: 20,
    },
    sectionTitle: {
        color: COLORS.text,
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 15,
    },
    eggGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 10,
    },
    eggOption: {
        flex: 1,
        minWidth: '22%',
        backgroundColor: COLORS.surface,
        borderRadius: 16,
        padding: 15,
        alignItems: 'center',
        borderWidth: 2,
        borderColor: COLORS.surfaceLight,
    },
    eggImage: {
        width: 60,
        height: 60,
    },
    eggType: {
        color: COLORS.text,
        fontSize: 12,
        fontWeight: '600',
        marginTop: 8,
        textTransform: 'capitalize',
    },
    questsSection: {
        gap: 10,
    },
    questCard: {
        backgroundColor: COLORS.surface,
        borderRadius: 16,
        padding: 15,
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    questInfo: {
        flex: 1,
    },
    questTitle: {
        color: COLORS.text,
        fontSize: 16,
        fontWeight: '600',
    },
    questDesc: {
        color: COLORS.textMuted,
        fontSize: 12,
        marginTop: 4,
    },
    questProgress: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        marginTop: 10,
    },
    progressBar: {
        flex: 1,
        height: 6,
        backgroundColor: COLORS.surfaceLight,
        borderRadius: 3,
        overflow: 'hidden',
    },
    progressFill: {
        height: '100%',
        backgroundColor: COLORS.primary,
        borderRadius: 3,
    },
    progressText: {
        color: COLORS.textMuted,
        fontSize: 12,
        minWidth: 40,
    },
    questReward: {
        alignItems: 'flex-end',
        justifyContent: 'space-between',
    },
    rewardItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    rewardText: {
        color: COLORS.text,
        fontSize: 12,
    },
    claimButton: {
        backgroundColor: COLORS.success,
        padding: 8,
        borderRadius: 10,
    },
});
