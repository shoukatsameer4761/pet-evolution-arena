import { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Pressable } from 'react-native';
import { router } from 'expo-router';
import { Trophy, Sparkles, Zap } from 'lucide-react-native';

import { COLORS } from '@/constants/game';

export default function SplashScreen() {
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const scaleAnim = useRef(new Animated.Value(0.8)).current;
    const floatAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.sequence([
            Animated.parallel([
                Animated.timing(fadeAnim, {
                    toValue: 1,
                    duration: 800,
                    useNativeDriver: true,
                }),
                Animated.spring(scaleAnim, {
                    toValue: 1,
                    friction: 8,
                    tension: 40,
                    useNativeDriver: true,
                }),
            ]),
        ]).start();

        Animated.loop(
            Animated.sequence([
                Animated.timing(floatAnim, {
                    toValue: 1,
                    duration: 1500,
                    useNativeDriver: true,
                }),
                Animated.timing(floatAnim, {
                    toValue: 0,
                    duration: 1500,
                    useNativeDriver: true,
                }),
            ])
        ).start();

        const _timer = setTimeout(() => {
            router.replace('/(game)/home');
        }, 2500);

        return () => clearTimeout(_timer);
    }, []);
    // eslint-disable-next-line react-hooks/exhaustive-deps

    const floatInterpolation = floatAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [0, -15],
    });

    return (
        <View style={styles.container}>
            <Animated.View
                style={[
                    styles.content,
                    {
                        opacity: fadeAnim,
                        transform: [{ scale: scaleAnim }],
                    },
                ]}
            >
                <Animated.View
                    style={[
                        styles.petContainer,
                        { transform: [{ translateY: floatInterpolation }] },
                    ]}
                >
                    <View style={styles.petGlow} />
                    <Sparkles size={80} color={COLORS.accent} />
                </Animated.View>

                <Text style={styles.title}>Pet Evolution</Text>
                <Text style={styles.subtitle}>ARENA</Text>

                <View style={styles.features}>
                    <View style={styles.feature}>
                        <Zap size={24} color={COLORS.accent} />
                        <Text style={styles.featureText}>Battle</Text>
                    </View>
                    <View style={styles.feature}>
                        <Trophy size={24} color={COLORS.secondary} />
                        <Text style={styles.featureText}>Evolve</Text>
                    </View>
                    <View style={styles.feature}>
                        <Sparkles size={24} color={COLORS.primary} />
                        <Text style={styles.featureText}>Collect</Text>
                    </View>
                </View>

                <Pressable
                    style={styles.button}
                    onPress={() => router.replace('/(game)/home')}
                >
                    <Text style={styles.buttonText}>PLAY NOW</Text>
                </Pressable>
            </Animated.View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
        alignItems: 'center',
        justifyContent: 'center',
    },
    content: {
        alignItems: 'center',
    },
    petContainer: {
        width: 150,
        height: 150,
        borderRadius: 75,
        backgroundColor: COLORS.surfaceLight,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 30,
        borderWidth: 3,
        borderColor: COLORS.accent,
    },
    petGlow: {
        position: 'absolute',
        width: 180,
        height: 180,
        borderRadius: 90,
        backgroundColor: COLORS.accent + '20',
    },
    title: {
        fontSize: 42,
        fontWeight: 'bold',
        color: COLORS.text,
        letterSpacing: 2,
    },
    subtitle: {
        fontSize: 56,
        fontWeight: '900',
        color: COLORS.primary,
        letterSpacing: 8,
        marginTop: -5,
    },
    features: {
        flexDirection: 'row',
        gap: 30,
        marginTop: 40,
        marginBottom: 50,
    },
    feature: {
        alignItems: 'center',
        gap: 8,
    },
    featureText: {
        color: COLORS.textMuted,
        fontSize: 14,
        fontWeight: '600',
    },
    button: {
        backgroundColor: COLORS.primary,
        paddingHorizontal: 50,
        paddingVertical: 16,
        borderRadius: 30,
        shadowColor: COLORS.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.4,
        shadowRadius: 8,
        elevation: 8,
    },
    buttonText: {
        color: COLORS.text,
        fontSize: 18,
        fontWeight: 'bold',
        letterSpacing: 2,
    },
});
