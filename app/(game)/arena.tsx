import { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Animated, Pressable, Dimensions } from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
    Trophy,
    Swords,
    Zap,
    Target,
    Shield,
    Star,
    TrendingUp,
    Users,
} from 'lucide-react-native';
import { Image } from 'expo-image';
import * as Haptics from 'expo-haptics';

import { useGame } from '@/context/GameContext';
import { COLORS, LEADERBOARD_ENTRIES } from '@/constants/game';

const { width: _width } = Dimensions.get('window');

export default function ArenaScreen() {
    const { state } = useGame();
    const insets = useSafeAreaInsets();
    const [selectedTier, setSelectedTier] = useState<'bronze' | 'silver' | 'gold' | 'legendary'>('bronze');
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
    }, [pulseAnim]);

    const pet = state.currentPet;

    const tiers = [
        { id: 'bronze', name: 'Bronze', minLevel: 1, color: '#CD7F32', rewards: { coins: 50, xp: 20 } },
        { id: 'silver', name: 'Silver', minLevel: 5, color: '#C0C0C0', rewards: { coins: 100, xp: 40 } },
        { id: 'gold', name: 'Gold', minLevel: 10, color: '#FFD700', rewards: { coins: 200, xp: 80 } },
        { id: 'legendary', name: 'Legendary', minLevel: 20, color: '#FF6B6B', rewards: { coins: 500, xp: 200 } },
    ];

    const getPetImage = () => {
        if (!pet) return 'https://r2-pub.rork.com/generated-images/ca53a909-bd49-4038-9ae5-bcca3afd7e93.png';
        const typeImages: Record<string, string> = {
            dog: 'https://r2-pub.rork.com/generated-images/5146f62a-7c29-4f20-9def-4cb56c0e30f4.png',
            dragon: 'https://r2-pub.rork.com/generated-images/61462dd3-0175-4171-860f-a89fdd69fa26.png',
            tiger: 'https://r2-pub.rork.com/generated-images/79f98e51-9287-4b6a-a99c-85f55bcc42ee.png',
            alien: 'https://r2-pub.rork.com/generated-images/c1a1b2b1-76c0-41f6-9b91-902de1d9733c.png',
        };
        return typeImages[pet.type] || typeImages.dog;
    };

    const startBattle = () => {
        void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        router.push('/battle');
    };

    return (
        <ScrollView style={styles.container} contentContainerStyle={[styles.content, { paddingTop: insets.top + 12 }]}>
            <View style={styles.header}>
                <Text style={styles.title}>Battle Arena</Text>
                <View style={styles.recordBadge}>
                    <Trophy size={16} color={COLORS.accent} />
                    <Text style={styles.recordText}>{state.battleWins}W - {state.battleLosses}L</Text>
                </View>
            </View>

            {pet ? (
                <View style={styles.petCard}>
                    <Animated.View style={[styles.petImageContainer, { transform: [{ scale: pulseAnim }] }]}>
                        <Image
                            source={{ uri: getPetImage() }}
                            style={styles.petImage}
                            contentFit="contain"
                        />
                    </Animated.View>
                    <View style={styles.petInfo}>
                        <Text style={styles.petName}>{pet.name}</Text>
                        <Text style={styles.petLevel}>Level {pet.level} • {pet.stage}</Text>
                        <View style={styles.statsRow}>
                            <View style={styles.miniStat}>
                                <Zap size={14} color={COLORS.primary} />
                                <Text style={styles.miniStatText}>{pet.stats.attack}</Text>
                            </View>
                            <View style={styles.miniStat}>
                                <Target size={14} color={COLORS.secondary} />
                                <Text style={styles.miniStatText}>{pet.stats.speed}</Text>
                            </View>
                            <View style={styles.miniStat}>
                                <Shield size={14} color={COLORS.success} />
                                <Text style={styles.miniStatText}>{pet.stats.defense}</Text>
                            </View>
                        </View>
                    </View>
                </View>
            ) : (
                <View style={styles.noPetCard}>
                    <Text style={styles.noPetText}>Hatch a pet first to battle!</Text>
                </View>
            )}

            <Text style={styles.sectionTitle}>Select Arena Tier</Text>

            <View style={styles.tierGrid}>
                {tiers.map((tier) => {
                    const isLocked = !pet || pet.level < tier.minLevel;
                    const isSelected = selectedTier === tier.id;

                    return (
                        <Pressable
                            key={tier.id}
                            style={[
                                styles.tierCard,
                                isSelected && styles.tierSelected,
                                isLocked && styles.tierLocked,
                            ]}
                            onPress={() => !isLocked && setSelectedTier(tier.id as typeof selectedTier)}
                            disabled={isLocked}
                        >
                            <View style={[styles.tierIcon, { backgroundColor: tier.color + '30' }]}>
                                <Star size={24} color={isLocked ? COLORS.textMuted : tier.color} fill={isLocked ? 'transparent' : tier.color} />
                            </View>
                            <Text style={[styles.tierName, isLocked && styles.tierTextLocked]}>{tier.name}</Text>
                            <Text style={styles.tierReq}>Lv. {tier.minLevel}+</Text>
                            {isLocked && (
                                <View style={styles.lockedOverlay}>
                                    <Text style={styles.lockedText}>🔒</Text>
                                </View>
                            )}
                        </Pressable>
                    );
                })}
            </View>

            <View style={styles.rewardsCard}>
                <Text style={styles.rewardsTitle}>Victory Rewards</Text>
                <View style={styles.rewardsRow}>
                    <View style={styles.rewardItem}>
                        <View style={[styles.rewardIcon, { backgroundColor: COLORS.accent + '30' }]}>
                            <TrendingUp size={20} color={COLORS.accent} />
                        </View>
                        <Text style={styles.rewardValue}>+{tiers.find(t => t.id === selectedTier)?.rewards.xp} XP</Text>
                    </View>
                    <View style={styles.rewardItem}>
                        <View style={[styles.rewardIcon, { backgroundColor: COLORS.secondary + '30' }]}>
                            <Zap size={20} color={COLORS.secondary} />
                        </View>
                        <Text style={styles.rewardValue}>+{tiers.find(t => t.id === selectedTier)?.rewards.coins} Coins</Text>
                    </View>
                </View>
            </View>

            <Pressable
                style={[styles.battleButton, !pet && styles.battleButtonDisabled]}
                onPress={startBattle}
                disabled={!pet}
            >
                <Swords size={28} color={COLORS.text} />
                <Text style={styles.battleButtonText}>START BATTLE</Text>
            </Pressable>

            <View style={styles.leaderboardSection}>
                <View style={styles.leaderboardHeader}>
                    <Users size={20} color={COLORS.accent} />
                    <Text style={styles.leaderboardTitle}>Global Leaderboard</Text>
                </View>

                {LEADERBOARD_ENTRIES.map((entry, _index) => (
                    <View key={entry.rank} style={styles.leaderboardRow}>
                        <View style={styles.rankContainer}>
                            {entry.rank <= 3 ? (
                                <View style={[
                                    styles.rankBadge,
                                    entry.rank === 1 && styles.goldBadge,
                                    entry.rank === 2 && styles.silverBadge,
                                    entry.rank === 3 && styles.bronzeBadge,
                                ]}>
                                    <Text style={styles.rankText}>{entry.rank}</Text>
                                </View>
                            ) : (
                                <Text style={styles.rankNumber}>#{entry.rank}</Text>
                            )}
                        </View>
                        <View style={styles.playerInfo}>
                            <Text style={styles.playerName}>{entry.name}</Text>
                            <Text style={styles.playerPet}>{entry.pet}</Text>
                        </View>
                        <View style={styles.playerStats}>
                            <Text style={styles.trophyCount}>{entry.trophies} 🏆</Text>
                            <Text style={styles.winCount}>{entry.wins}W</Text>
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
    title: {
        color: COLORS.text,
        fontSize: 28,
        fontWeight: 'bold',
    },
    recordBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        backgroundColor: COLORS.surface,
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
    },
    recordText: {
        color: COLORS.text,
        fontSize: 14,
        fontWeight: '600',
    },
    petCard: {
        backgroundColor: COLORS.surface,
        borderRadius: 20,
        padding: 20,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 15,
        marginBottom: 20,
    },
    petImageContainer: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: COLORS.surfaceLight,
        alignItems: 'center',
        justifyContent: 'center',
    },
    petImage: {
        width: 80,
        height: 80,
    },
    petInfo: {
        flex: 1,
    },
    petName: {
        color: COLORS.text,
        fontSize: 22,
        fontWeight: 'bold',
    },
    petLevel: {
        color: COLORS.textMuted,
        fontSize: 14,
        marginTop: 4,
        textTransform: 'capitalize',
    },
    statsRow: {
        flexDirection: 'row',
        gap: 15,
        marginTop: 10,
    },
    miniStat: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    miniStatText: {
        color: COLORS.text,
        fontSize: 14,
        fontWeight: '600',
    },
    noPetCard: {
        backgroundColor: COLORS.surface,
        borderRadius: 20,
        padding: 30,
        alignItems: 'center',
        marginBottom: 20,
    },
    noPetText: {
        color: COLORS.textMuted,
        fontSize: 16,
    },
    sectionTitle: {
        color: COLORS.text,
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 15,
    },
    tierGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 10,
        marginBottom: 20,
    },
    tierCard: {
        flex: 1,
        minWidth: '22%',
        backgroundColor: COLORS.surface,
        borderRadius: 16,
        padding: 15,
        alignItems: 'center',
        borderWidth: 2,
        borderColor: COLORS.surfaceLight,
        position: 'relative',
    },
    tierSelected: {
        borderColor: COLORS.primary,
        backgroundColor: COLORS.primary + '15',
    },
    tierLocked: {
        opacity: 0.6,
    },
    tierIcon: {
        width: 50,
        height: 50,
        borderRadius: 25,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 8,
    },
    tierName: {
        color: COLORS.text,
        fontSize: 14,
        fontWeight: '600',
    },
    tierTextLocked: {
        color: COLORS.textMuted,
    },
    tierReq: {
        color: COLORS.textMuted,
        fontSize: 12,
        marginTop: 4,
    },
    lockedOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: COLORS.background + '80',
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
    },
    lockedText: {
        fontSize: 24,
    },
    rewardsCard: {
        backgroundColor: COLORS.surface,
        borderRadius: 16,
        padding: 20,
        marginBottom: 20,
    },
    rewardsTitle: {
        color: COLORS.text,
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 15,
    },
    rewardsRow: {
        flexDirection: 'row',
        gap: 20,
    },
    rewardItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    rewardIcon: {
        width: 40,
        height: 40,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
    },
    rewardValue: {
        color: COLORS.text,
        fontSize: 14,
        fontWeight: '600',
    },
    battleButton: {
        backgroundColor: COLORS.primary,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 10,
        paddingVertical: 18,
        borderRadius: 16,
        marginBottom: 20,
        shadowColor: COLORS.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.4,
        shadowRadius: 8,
        elevation: 8,
    },
    battleButtonDisabled: {
        backgroundColor: COLORS.surfaceLight,
        shadowOpacity: 0,
    },
    battleButtonText: {
        color: COLORS.text,
        fontSize: 18,
        fontWeight: 'bold',
    },
    leaderboardSection: {
        backgroundColor: COLORS.surface,
        borderRadius: 20,
        padding: 20,
    },
    leaderboardHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        marginBottom: 15,
    },
    leaderboardTitle: {
        color: COLORS.text,
        fontSize: 18,
        fontWeight: 'bold',
    },
    leaderboardRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.surfaceLight,
    },
    rankContainer: {
        width: 40,
        alignItems: 'center',
    },
    rankBadge: {
        width: 30,
        height: 30,
        borderRadius: 15,
        alignItems: 'center',
        justifyContent: 'center',
    },
    goldBadge: {
        backgroundColor: '#FFD700',
    },
    silverBadge: {
        backgroundColor: '#C0C0C0',
    },
    bronzeBadge: {
        backgroundColor: '#CD7F32',
    },
    rankText: {
        color: COLORS.background,
        fontWeight: 'bold',
        fontSize: 14,
    },
    rankNumber: {
        color: COLORS.textMuted,
        fontSize: 14,
        fontWeight: '600',
    },
    playerInfo: {
        flex: 1,
        paddingHorizontal: 10,
    },
    playerName: {
        color: COLORS.text,
        fontSize: 14,
        fontWeight: '600',
    },
    playerPet: {
        color: COLORS.textMuted,
        fontSize: 12,
        marginTop: 2,
    },
    playerStats: {
        alignItems: 'flex-end',
    },
    trophyCount: {
        color: COLORS.accent,
        fontSize: 14,
        fontWeight: '600',
    },
    winCount: {
        color: COLORS.textMuted,
        fontSize: 12,
        marginTop: 2,
    },
});
