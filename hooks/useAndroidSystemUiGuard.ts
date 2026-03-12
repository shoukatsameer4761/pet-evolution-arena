import { useEffect } from 'react';
import { AppState, Dimensions, Platform } from 'react-native';

export function useAndroidSystemUiGuard() {
    useEffect(() => {
        if (Platform.OS !== 'android') return;

        let isMounted = true;
        let navigationBar: {
            setButtonStyleAsync?: (style: 'light' | 'dark') => Promise<void>;
            setBackgroundColorAsync?: (color: string) => Promise<void>;
            setPositionAsync?: (position: 'absolute' | 'relative') => Promise<void>;
            setBehaviorAsync?: (behavior: 'overlay-swipe' | 'inset-swipe' | 'inset-touch') => Promise<void>;
        } | null = null;

        try {
            // Keep dynamic require for Expo Go compatibility.
            // eslint-disable-next-line @typescript-eslint/no-require-imports
            navigationBar = require('expo-navigation-bar');
        } catch {
            return;
        }

        const applySystemUi = async () => {
            if (!isMounted || !navigationBar) return;
            try {
                await navigationBar.setPositionAsync?.('absolute');
                await navigationBar.setBackgroundColorAsync?.('#00000000');
                await navigationBar.setBehaviorAsync?.('overlay-swipe');
                await navigationBar.setButtonStyleAsync?.('light');
            } catch {
                // Ignore system UI errors to prevent blocking app navigation.
            }
        };

        void applySystemUi();

        const appStateSub = AppState.addEventListener('change', (state) => {
            if (state === 'active') {
                void applySystemUi();
            }
        });

        const dimensionsSub = Dimensions.addEventListener('change', () => {
            void applySystemUi();
        });

        return () => {
            isMounted = false;
            appStateSub.remove();
            dimensionsSub.remove();
        };
    }, []);
}
