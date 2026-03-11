import { useEffect } from 'react';
import { Platform, Alert } from 'react-native';
import Purchases, { LOG_LEVEL, PurchasesPackage, CustomerInfo } from 'react-native-purchases';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Constants, { ExecutionEnvironment } from 'expo-constants';

const isExpoGo = Constants.executionEnvironment === ExecutionEnvironment.StoreClient;

const API_KEYS = {
  ios: process.env.EXPO_PUBLIC_REVENUECAT_IOS_API_KEY ?? '',
  android: process.env.EXPO_PUBLIC_REVENUECAT_ANDROID_API_KEY ?? '',
};

function getAPIKey(): string {
  return Platform.select({
    ios: API_KEYS.ios,
    android: API_KEYS.android,
    default: '',
  }) ?? '';
}

let isConfigured = false;

export function configureRevenueCat() {
  if (isConfigured || isExpoGo) return;

  const apiKey = getAPIKey();
  if (!apiKey) {
    console.warn('RevenueCat API key not configured');
    return;
  }

  try {
    void Purchases.setLogLevel(__DEV__ ? LOG_LEVEL.DEBUG : LOG_LEVEL.ERROR);
    Purchases.configure({ apiKey });
    isConfigured = true;
  } catch (error) {
    console.warn('RevenueCat configuration failed:', error);
  }
}

export function useOfferings() {
  return useQuery({
    queryKey: ['revenuecat', 'offerings'],
    queryFn: async () => {
      const offerings = await Purchases.getOfferings();
      return offerings;
    },
    staleTime: 5 * 60 * 1000,
    enabled: isConfigured,
  });
}

export function useCustomerInfo() {
  return useQuery({
    queryKey: ['revenuecat', 'customerInfo'],
    queryFn: async () => {
      const customerInfo = await Purchases.getCustomerInfo();
      return customerInfo;
    },
    staleTime: 60 * 1000,
    enabled: isConfigured,
  });
}

export function usePurchasePackage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (aPackage: PurchasesPackage): Promise<{ customerInfo: CustomerInfo; success: boolean }> => {
      const { customerInfo } = await Purchases.purchasePackage(aPackage);
      return { customerInfo, success: true };
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['revenuecat', 'customerInfo'] });
    },
    onError: (error: Error) => {
      if (!error.message.includes('cancelled')) {
        Alert.alert('Purchase Failed', error.message);
      }
    },
  });
}

export function useRestorePurchases() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (): Promise<CustomerInfo> => {
      const customerInfo = await Purchases.restorePurchases();
      return customerInfo;
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['revenuecat', 'customerInfo'] });
      Alert.alert('Success', 'Purchases restored successfully!');
    },
    onError: (error: Error) => {
      Alert.alert('Restore Failed', error.message);
    },
  });
}

export function useCheckPremiumStatus() {
  const { data: customerInfo, isLoading } = useCustomerInfo();

  const isPremium = customerInfo?.entitlements.active['premium'] != null;

  return { isPremium, isLoading, customerInfo };
}

export function useRevenueCatSetup() {
  useEffect(() => {
    configureRevenueCat();
  }, []);
}
