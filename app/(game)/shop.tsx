import { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Alert, Linking } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
    Coins,
    Gem,
    Zap,
    Heart,
    Sparkles,
    Crown,
    Package,
    RotateCcw,
} from 'lucide-react-native';

import * as Haptics from 'expo-haptics';

import { useGame } from '@/context/GameContext';
import { COLORS, SHOP_ITEMS } from '@/constants/game';
import {
    useOfferings,
    usePurchasePackage,
    useRestorePurchases,
    useRevenueCatSetup,
    useIsDevMode,
    DEV_GEM_PACKS,
    DAILY_DEAL,
    type DevGemPack,
} from '@/hooks/useRevenueCat';

export default function ShopScreen() {
    const { state, spendCoins, addFood, addCoins, addGems, activateXpBoost, unlockSkin, setVipStatus, equipSkin } = useGame();
    const insets = useSafeAreaInsets();
    const [activeTab, setActiveTab] = useState<'items' | 'gems' | 'skins'>('items');
    useRevenueCatSetup();
    const { data: offerings } = useOfferings();
    const { mutate: purchasePackage } = usePurchasePackage();
    const { mutate: restorePurchases, isPending: isRestoring } = useRestorePurchases();
    const isDevMode = useIsDevMode();

    const handlePurchase = (item: typeof SHOP_ITEMS[0]) => {
        if (state.coins < item.price) {
            void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
            Alert.alert('Not Enough Coins', 'Earn more coins by battling!');
            return;
        }

        Alert.alert(
            'Confirm Purchase',
            `Buy ${item.name} for ${item.price} coins?`,
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Buy',
                    onPress: () => {
                        void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
                        spendCoins(item.price);

                        switch (item.type) {
                            case 'food':
                                addFood(item.amount || 0);
                                break;
                            case 'boost':
                                activateXpBoost(2, item.duration || 3600000);
                                break;
                        }

                        Alert.alert('Purchase Successful!', `You bought ${item.name}`);
                    },
                },
            ]
        );
    };

    const handleGemPurchase = (pack: { id: string; amount: number; price: string; bonus: number; isSubscription: boolean; package?: any }) => {
        if (isDevMode) {
            // Simulated purchase for development/testing
            Alert.alert(
                pack.isSubscription ? 'Subscribe to VIP' : 'Buy Gems',
                `${pack.isSubscription ? 'VIP Membership' : `${pack.amount}${pack.bonus > 0 ? ` + ${pack.bonus} bonus` : ''} gems`} for ${pack.price}\n\n(Dev Mode: purchase will be simulated)`,
                [
                    { text: 'Cancel', style: 'cancel' },
                    {
                        text: 'Simulate Purchase',
                        onPress: () => {
                            void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
                            if (pack.isSubscription) {
                                setVipStatus(true, new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString());
                                Alert.alert('VIP Activated!', 'Welcome to VIP! You now have daily gems, exclusive skins, and 2x XP boost!');
                            } else {
                                addGems(pack.amount + pack.bonus);
                                Alert.alert('Purchase Successful!', `You received ${pack.amount + pack.bonus} gems!`);
                            }
                        },
                    },
                ]
            );
            return;
        }

        if (!pack.package) {
            Alert.alert('Unavailable', 'This purchase is not available right now.');
            return;
        }

        if (pack.isSubscription) {
            purchasePackage(pack.package, {
                onSuccess: (result) => {
                    const entitlement = result.customerInfo.entitlements.active['premium'];
                    const isActive = entitlement != null;
                    setVipStatus(isActive, entitlement?.expirationDate ?? undefined);
                    Alert.alert(
                        'VIP Activated!',
                        'Welcome to VIP! You now have daily gems, exclusive skins, and 2x XP boost!'
                    );
                },
            });
        } else {
            purchasePackage(pack.package, {
                onSuccess: () => {
                    addGems(pack.amount + pack.bonus);
                    void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
                    Alert.alert('Purchase Successful!', `You received ${pack.amount + pack.bonus} gems!`);
                },
            });
        }
    };

    const handleDailyDeal = () => {
        if (isDevMode) {
            Alert.alert(
                'Daily Special',
                `${DAILY_DEAL.coins} Coins + ${DAILY_DEAL.gems} Gems + ${DAILY_DEAL.food} Food for ${DAILY_DEAL.price}\n\n(Dev Mode: purchase will be simulated)`,
                [
                    { text: 'Cancel', style: 'cancel' },
                    {
                        text: 'Simulate Purchase',
                        onPress: () => {
                            void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
                            addCoins(DAILY_DEAL.coins);
                            addGems(DAILY_DEAL.gems);
                            addFood(DAILY_DEAL.food);
                            Alert.alert('Purchase Successful!', `You received ${DAILY_DEAL.coins} coins, ${DAILY_DEAL.gems} gems, and ${DAILY_DEAL.food} food!`);
                        },
                    },
                ]
            );
            return;
        }

        // In production, find the daily deal package from RevenueCat offerings
        const dailyPkg = offerings?.current?.availablePackages.find(
            pkg => pkg.identifier.toLowerCase().includes('daily') || pkg.identifier.toLowerCase().includes('special')
        );

        if (dailyPkg) {
            purchasePackage(dailyPkg, {
                onSuccess: () => {
                    addCoins(DAILY_DEAL.coins);
                    addGems(DAILY_DEAL.gems);
                    addFood(DAILY_DEAL.food);
                    void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
                    Alert.alert('Purchase Successful!', `You received ${DAILY_DEAL.coins} coins, ${DAILY_DEAL.gems} gems, and ${DAILY_DEAL.food} food!`);
                },
            });
        } else {
            Alert.alert('Unavailable', 'Daily Special is not available right now. Please try again later.');
        }
    };

    const handleSkinPurchase = (skin: typeof skins[0]) => {
        if (skin.unlocked) {
            equipSkin(skin.id);
            Alert.alert('Skin Equipped!', `Your pet is now wearing the ${skin.name} skin!`);
            return;
        }

        if (state.coins < skin.price) {
            void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
            Alert.alert('Not Enough Coins', 'Earn more coins by battling!');
            return;
        }

        Alert.alert(
            'Confirm Purchase',
            `Unlock ${skin.name} skin for ${skin.price} coins?`,
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Unlock',
                    onPress: () => {
                        void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
                        spendCoins(skin.price);
                        unlockSkin(skin.id);
                        equipSkin(skin.id);
                        Alert.alert('Skin Unlocked!', `You unlocked and equipped the ${skin.name} skin!`);
                    },
                },
            ]
        );
    };

    const liveGemPacks = offerings?.current?.availablePackages.map(pkg => ({
        id: pkg.identifier,
        package: pkg,
        amount: parseInt(pkg.identifier.includes('monthly') ? '100' : pkg.identifier.includes('yearly') ? '1200' : '100'),
        price: pkg.product.priceString,
        bonus: pkg.identifier.includes('yearly') ? 200 : 0,
        isSubscription: pkg.packageType === 'MONTHLY' || pkg.packageType === 'ANNUAL',
    })) || [];

    const gemPacks = liveGemPacks.length > 0 ? liveGemPacks : (isDevMode ? DEV_GEM_PACKS : []);

    const skins = [
        { id: 'golden', name: 'Golden', color: '#FFD700', price: 500, unlocked: state.isVip || state.unlockedSkins.includes('golden') },
        { id: 'crystal', name: 'Crystal', color: '#4ECDC4', price: 750, unlocked: state.isVip || state.unlockedSkins.includes('crystal') },
        { id: 'shadow', name: 'Shadow', color: '#6C5CE7', price: 1000, unlocked: state.isVip || state.unlockedSkins.includes('shadow') },
        { id: 'rainbow', name: 'Rainbow', color: '#FF6B6B', price: 1500, unlocked: state.isVip || state.unlockedSkins.includes('rainbow') },
    ];

    return (
        <ScrollView style={styles.container} contentContainerStyle={[styles.content, { paddingTop: insets.top + 12 }]}>
            <View style={styles.header}>
                <Text style={styles.title}>Shop</Text>
                <View style={styles.currencyContainer}>
                    <View style={styles.currency}>
                        <Coins size={18} color={COLORS.accent} />
                        <Text style={styles.currencyText}>{state.coins}</Text>
                    </View>
                    <View style={styles.currency}>
                        <Gem size={18} color={COLORS.secondary} />
                        <Text style={styles.currencyText}>{state.gems}</Text>
                    </View>
                </View>
            </View>

            <View style={styles.tabs}>
                {(['items', 'gems', 'skins'] as const).map((tab) => (
                    <Pressable
                        key={tab}
                        style={[styles.tab, activeTab === tab && styles.activeTab]}
                        onPress={() => setActiveTab(tab)}
                    >
                        <Text style={[styles.tabText, activeTab === tab && styles.activeTabText]}>
                            {tab.charAt(0).toUpperCase() + tab.slice(1)}
                        </Text>
                    </Pressable>
                ))}
            </View>

            {activeTab === 'items' && (
                <View style={styles.itemsGrid}>
                    {SHOP_ITEMS.map((item) => (
                        <Pressable
                            key={item.id}
                            style={styles.itemCard}
                            onPress={() => handlePurchase(item)}
                        >
                            <View style={styles.itemIcon}>
                                {item.type === 'food' && <Heart size={32} color={COLORS.primary} />}
                                {item.type === 'boost' && <Zap size={32} color={COLORS.secondary} />}
                                {item.type === 'token' && <Crown size={32} color={COLORS.warning} />}
                            </View>
                            <Text style={styles.itemName}>{item.name}</Text>
                            <Text style={styles.itemDesc}>{item.description}</Text>
                            <View style={styles.itemPrice}>
                                <Coins size={14} color={COLORS.accent} />
                                <Text style={styles.priceText}>{item.price}</Text>
                            </View>
                        </Pressable>
                    ))}
                </View>
            )}

            {activeTab === 'gems' && (
                <View style={styles.gemsContainer}>
                    <View style={styles.gemsBanner}>
                        <Gem size={40} color={COLORS.secondary} />
                        <Text style={styles.gemsBannerTitle}>Get More Gems!</Text>
                        <Text style={styles.gemsBannerDesc}>Premium currency for exclusive items</Text>
                    </View>

                    {gemPacks.length === 0 && (
                        <View style={styles.gemPackUnavailable}>
                            <Text style={styles.gemPackUnavailableTitle}>Store Unavailable</Text>
                            <Text style={styles.gemPackUnavailableDesc}>
                                Gem packs could not be loaded. Check your internet connection and try again.
                            </Text>
                        </View>
                    )}

                    {isDevMode && gemPacks.length > 0 && (
                        <View style={styles.devBanner}>
                            <Text style={styles.devBannerText}>🛠 Dev Mode — purchases are simulated</Text>
                        </View>
                    )}

                    {gemPacks.map((pack) => (
                        <Pressable
                            key={pack.id}
                            style={styles.gemPack}
                            onPress={() => handleGemPurchase(pack)}
                        >
                            <View style={styles.gemPackInfo}>
                                <View style={styles.gemAmount}>
                                    <Gem size={24} color={COLORS.secondary} />
                                    <Text style={styles.gemAmountText}>{pack.amount}</Text>
                                    {pack.bonus > 0 && (
                                        <View style={styles.bonusBadge}>
                                            <Text style={styles.bonusText}>+{pack.bonus}</Text>
                                        </View>
                                    )}
                                </View>
                            </View>
                            <Pressable style={styles.buyButton} onPress={() => handleGemPurchase(pack)}>
                                <Text style={styles.buyButtonText}>{pack.price}</Text>
                            </Pressable>
                        </Pressable>
                    ))}

                    <View style={styles.vipCard}>
                        <Crown size={32} color={COLORS.accent} />
                        <View style={styles.vipInfo}>
                            <Text style={styles.vipTitle}>
                                {state.isVip ? 'VIP Active ✓' : 'VIP Membership'}
                            </Text>
                            <Text style={styles.vipDesc}>Daily gems, exclusive skins, 2x XP</Text>
                        </View>
                        {!state.isVip && (
                            <Pressable
                                style={styles.vipButton}
                                onPress={() => {
                                    const vipPack = gemPacks.find(p => p.isSubscription);
                                    if (vipPack) {
                                        handleGemPurchase(vipPack);
                                    } else {
                                        Alert.alert('Unavailable', 'VIP subscription is not available right now. Please try again later.');
                                    }
                                }}
                            >
                                <Text style={styles.vipButtonText}>Subscribe</Text>
                            </Pressable>
                        )}
                    </View>

                    <Pressable
                        style={styles.restoreButton}
                        onPress={() => {
                            if (isDevMode) {
                                Alert.alert('Restored', 'Purchases restored! (Dev Mode)');
                                return;
                            }
                            restorePurchases();
                        }}
                        disabled={isRestoring}
                    >
                        <RotateCcw size={16} color={COLORS.textMuted} />
                        <Text style={styles.restoreText}>
                            {isRestoring ? 'Restoring...' : 'Restore Purchases'}
                        </Text>
                    </Pressable>
                </View>
            )}

            {activeTab === 'skins' && (
                <View style={styles.skinsContainer}>
                    <Text style={styles.skinsSubtitle}>Customize Your Pet</Text>

                    {skins.map((skin) => (
                        <Pressable
                            key={skin.id}
                            style={[styles.skinCard, { borderColor: skin.color }]}
                            onPress={() => handleSkinPurchase(skin)}
                        >
                            <View style={[styles.skinPreview, { backgroundColor: skin.color + '30' }]}>
                                <Sparkles size={32} color={skin.color} />
                            </View>
                            <View style={styles.skinInfo}>
                                <Text style={styles.skinName}>{skin.name}</Text>
                                <View style={styles.skinPrice}>
                                    <Coins size={14} color={COLORS.accent} />
                                    <Text style={styles.skinPriceText}>
                                        {skin.unlocked ? 'Owned' : skin.price}
                                    </Text>
                                </View>
                            </View>
                            <Pressable
                                style={[
                                    styles.skinBuyButton,
                                    skin.unlocked
                                        ? { backgroundColor: COLORS.success }
                                        : state.coins >= skin.price
                                            ? { backgroundColor: skin.color }
                                            : styles.skinBuyDisabled
                                ]}
                                disabled={!skin.unlocked && state.coins < skin.price}
                                onPress={() => handleSkinPurchase(skin)}
                            >
                                <Text style={styles.skinBuyText}>
                                    {skin.unlocked
                                        ? (state.currentPet?.skin === skin.id ? 'Equipped' : 'Equip')
                                        : state.coins >= skin.price
                                            ? 'Buy'
                                            : 'Locked'}
                                </Text>
                            </Pressable>
                        </Pressable>
                    ))}
                </View>
            )}

            <View style={styles.dailyDeal}>
                <View style={styles.dealHeader}>
                    <Package size={20} color={COLORS.primary} />
                    <Text style={styles.dealTitle}>Daily Special</Text>
                    <View style={styles.timerBadge}>
                        <Text style={styles.timerText}>23:59:59</Text>
                    </View>
                </View>
                <View style={styles.dealContent}>
                    <View style={styles.dealItems}>
                        <View style={styles.dealItem}>
                            <Coins size={16} color={COLORS.accent} />
                            <Text style={styles.dealItemText}>500 Coins</Text>
                        </View>
                        <View style={styles.dealItem}>
                            <Gem size={16} color={COLORS.secondary} />
                            <Text style={styles.dealItemText}>50 Gems</Text>
                        </View>
                        <View style={styles.dealItem}>
                            <Heart size={16} color={COLORS.primary} />
                            <Text style={styles.dealItemText}>100 Food</Text>
                        </View>
                    </View>
                    <View style={styles.dealPrice}>
                        <Text style={styles.dealOldPrice}>$9.99</Text>
                        <Pressable style={styles.dealBuyButton} onPress={handleDailyDeal}>
                            <Text style={styles.dealBuyText}>$4.99</Text>
                        </Pressable>
                    </View>
                </View>
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
    currencyContainer: {
        flexDirection: 'row',
        gap: 10,
    },
    currency: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        backgroundColor: COLORS.surface,
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 15,
    },
    currencyText: {
        color: COLORS.text,
        fontWeight: 'bold',
        fontSize: 14,
    },
    tabs: {
        flexDirection: 'row',
        gap: 10,
        marginBottom: 20,
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
    itemsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 10,
    },
    itemCard: {
        flex: 1,
        minWidth: '30%',
        backgroundColor: COLORS.surface,
        borderRadius: 16,
        padding: 15,
        alignItems: 'center',
    },
    itemIcon: {
        width: 60,
        height: 60,
        borderRadius: 16,
        backgroundColor: COLORS.surfaceLight,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 10,
    },
    itemName: {
        color: COLORS.text,
        fontSize: 14,
        fontWeight: '600',
        textAlign: 'center',
    },
    itemDesc: {
        color: COLORS.textMuted,
        fontSize: 11,
        textAlign: 'center',
        marginTop: 4,
    },
    itemPrice: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        marginTop: 10,
        backgroundColor: COLORS.accent + '20',
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 10,
    },
    priceText: {
        color: COLORS.accent,
        fontWeight: 'bold',
    },
    gemsContainer: {
        gap: 10,
    },
    gemsBanner: {
        backgroundColor: COLORS.surface,
        borderRadius: 20,
        padding: 25,
        alignItems: 'center',
        marginBottom: 10,
    },
    gemsBannerTitle: {
        color: COLORS.text,
        fontSize: 22,
        fontWeight: 'bold',
        marginTop: 10,
    },
    gemsBannerDesc: {
        color: COLORS.textMuted,
        fontSize: 14,
        marginTop: 5,
    },
    gemPack: {
        backgroundColor: COLORS.surface,
        borderRadius: 16,
        padding: 15,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    gemPackInfo: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    gemAmount: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    gemAmountText: {
        color: COLORS.text,
        fontSize: 20,
        fontWeight: 'bold',
    },
    bonusBadge: {
        backgroundColor: COLORS.success + '30',
        paddingHorizontal: 8,
        paddingVertical: 3,
        borderRadius: 10,
    },
    bonusText: {
        color: COLORS.success,
        fontSize: 12,
        fontWeight: 'bold',
    },
    buyButton: {
        backgroundColor: COLORS.secondary,
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 10,
    },
    buyButtonText: {
        color: COLORS.text,
        fontWeight: 'bold',
    },
    vipCard: {
        backgroundColor: COLORS.accent + '20',
        borderRadius: 16,
        padding: 20,
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 10,
        borderWidth: 2,
        borderColor: COLORS.accent,
    },
    vipInfo: {
        flex: 1,
        marginLeft: 15,
    },
    vipTitle: {
        color: COLORS.accent,
        fontSize: 18,
        fontWeight: 'bold',
    },
    vipDesc: {
        color: COLORS.textMuted,
        fontSize: 12,
        marginTop: 4,
    },
    vipButton: {
        backgroundColor: COLORS.accent,
        paddingHorizontal: 15,
        paddingVertical: 10,
        borderRadius: 10,
    },
    vipButtonText: {
        color: COLORS.background,
        fontWeight: 'bold',
    },
    restoreButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        paddingVertical: 14,
        marginTop: 6,
    },
    restoreText: {
        color: COLORS.textMuted,
        fontSize: 14,
    },
    gemPackUnavailable: {
        backgroundColor: COLORS.surface,
        borderRadius: 16,
        padding: 20,
        alignItems: 'center',
    },
    gemPackUnavailableTitle: {
        color: COLORS.textMuted,
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 6,
    },
    gemPackUnavailableDesc: {
        color: COLORS.textMuted,
        fontSize: 13,
        textAlign: 'center',
        lineHeight: 18,
    },
    devBanner: {
        backgroundColor: '#2d2a00',
        borderRadius: 8,
        padding: 8,
        alignItems: 'center',
        marginBottom: 8,
    },
    devBannerText: {
        color: '#ffd600',
        fontSize: 12,
        fontWeight: '600',
    },
    skinsContainer: {
        gap: 10,
    },
    skinsSubtitle: {
        color: COLORS.textMuted,
        fontSize: 14,
        marginBottom: 10,
    },
    skinCard: {
        backgroundColor: COLORS.surface,
        borderRadius: 16,
        padding: 15,
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 2,
    },
    skinPreview: {
        width: 60,
        height: 60,
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
    },
    skinInfo: {
        flex: 1,
        marginLeft: 15,
    },
    skinName: {
        color: COLORS.text,
        fontSize: 16,
        fontWeight: '600',
    },
    skinPrice: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        marginTop: 4,
    },
    skinPriceText: {
        color: COLORS.accent,
        fontWeight: 'bold',
    },
    skinBuyButton: {
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 10,
    },
    skinBuyDisabled: {
        backgroundColor: COLORS.surfaceLight,
    },
    skinBuyText: {
        color: COLORS.text,
        fontWeight: 'bold',
    },
    dailyDeal: {
        backgroundColor: COLORS.surface,
        borderRadius: 20,
        padding: 20,
        marginTop: 20,
    },
    dealHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        marginBottom: 15,
    },
    dealTitle: {
        color: COLORS.text,
        fontSize: 18,
        fontWeight: 'bold',
        flex: 1,
    },
    timerBadge: {
        backgroundColor: COLORS.danger + '30',
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 10,
    },
    timerText: {
        color: COLORS.danger,
        fontSize: 12,
        fontWeight: '600',
    },
    dealContent: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    dealItems: {
        gap: 8,
    },
    dealItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    dealItemText: {
        color: COLORS.text,
        fontSize: 14,
    },
    dealPrice: {
        alignItems: 'center',
    },
    dealOldPrice: {
        color: COLORS.textMuted,
        fontSize: 14,
        textDecorationLine: 'line-through',
    },
    dealBuyButton: {
        backgroundColor: COLORS.success,
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 10,
        marginTop: 5,
    },
    dealBuyText: {
        color: COLORS.text,
        fontWeight: 'bold',
        fontSize: 16,
    },
});
