import { Tabs } from 'expo-router';
import { Home, Swords, Trophy, Store } from 'lucide-react-native';
import { View, StyleSheet, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { COLORS } from '@/constants/game';

export default function GameLayout() {
    const insets = useSafeAreaInsets();
    const tabBarHeight = Platform.OS === 'android' ? 64 : 56 + insets.bottom;

    return (
        <Tabs
            screenOptions={{
                tabBarActiveTintColor: COLORS.primary,
                tabBarInactiveTintColor: COLORS.textMuted,
                headerShown: false,
                tabBarStyle: {
                    backgroundColor: COLORS.surface,
                    borderTopWidth: 0,
                    borderTopColor: COLORS.surfaceLight,
                    elevation: 0,
                    height: tabBarHeight,
                    paddingBottom: Platform.OS === 'android' ? 8 : insets.bottom,
                    paddingTop: 6,
                },
                tabBarItemStyle: styles.tabBarItem,
                tabBarLabelStyle: styles.tabBarLabel,
            }}
        >
            <Tabs.Screen
                name="home"
                options={{
                    title: 'Home',
                    tabBarIcon: ({ color }) => <Home size={24} color={color} />,
                }}
            />
            <Tabs.Screen
                name="pet"
                options={{
                    title: 'Pet',
                    tabBarIcon: ({ color }) => (
                        <View style={[styles.iconContainer, { backgroundColor: color + '20' }]}>
                            <Swords size={24} color={color} />
                        </View>
                    ),
                }}
            />
            <Tabs.Screen
                name="arena"
                options={{
                    title: 'Arena',
                    tabBarIcon: ({ color }) => <Trophy size={24} color={color} />,
                }}
            />
            <Tabs.Screen
                name="shop"
                options={{
                    title: 'Shop',
                    tabBarIcon: ({ color }) => <Store size={24} color={color} />,
                }}
            />
        </Tabs>
    );
}

const styles = StyleSheet.create({
    tabBarItem: {
        paddingTop: 2,
    },
    tabBarLabel: {
        fontSize: 11,
        fontWeight: '600',
    },
    iconContainer: {
        padding: 8,
        borderRadius: 12,
    },
});
