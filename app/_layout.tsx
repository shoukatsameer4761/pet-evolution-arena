import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import React, { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { View, StyleSheet, Platform } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { GameProvider } from '@/context/GameContext';
import { COLORS } from '@/constants/game';

SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient();

function RootLayoutNav() {
    return (
        <View style={styles.container}>
            <StatusBar style="light" translucent backgroundColor="transparent" />
            <Stack
                screenOptions={{
                    headerShown: false,
                    contentStyle: { backgroundColor: COLORS.background },
                    animation: 'fade',
                }}
            >
                <Stack.Screen name="index" />
                <Stack.Screen name="(game)" />
                <Stack.Screen
                    name="mini-game"
                    options={{ animation: 'slide_from_right' }}
                />
                <Stack.Screen
                    name="battle"
                    options={{ animation: 'slide_from_right' }}
                />
                <Stack.Screen
                    name="modal"
                    options={{ presentation: 'modal', animation: 'slide_from_bottom' }}
                />
            </Stack>
        </View>
    );
}

export default function RootLayout() {
    useEffect(() => {
        void SplashScreen.hideAsync();
        if (Platform.OS === 'android') {
            try {
                const NavigationBar = require('expo-navigation-bar');
                void NavigationBar.setButtonStyleAsync('light');
            } catch {
                // expo-navigation-bar not available in Expo Go
            }
        }
    }, []);

    return (
        <SafeAreaProvider>
            <QueryClientProvider client={queryClient}>
                <GameProvider>
                    <RootLayoutNav />
                </GameProvider>
            </QueryClientProvider>
        </SafeAreaProvider>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
});
