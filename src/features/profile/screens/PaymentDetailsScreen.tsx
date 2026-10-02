import React from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { BackButton } from '../../../core/components/BackButton';
import { PrimaryButton } from '../../../core/components/PrimaryButton';
import { AppColors } from '../../../core/theme/colors';
import { subscriptionStore } from '../data/subscriptionStore';

export default function PaymentDetailsScreen() {
  const navigation = useNavigation<any>();

  const handlePay = () => {
    subscriptionStore.upgradeToPremium();
    Alert.alert(
      'Upgrade Successful! 🎉',
      'Welcome to Premium Voyager. You now have unlimited trips, AI reviews, and priority travel features.',
      [
        {
          text: 'Start Exploring',
          onPress: () => {
            navigation.navigate('MyItineraries');
          },
        },
      ],
      { cancelable: false }
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <BackButton onPress={() => navigation.goBack()} />
        <Text style={styles.headerTitle}>Payment Details</Text>
        <View style={styles.placeholder} />
      </View>
      <View style={styles.content}>
        <View style={styles.summaryCard}>
          <Text style={styles.info}>Plan: Premium — Voyager</Text>
          <Text style={styles.amount}>Total: ₹149 / month</Text>
          <Text style={styles.subtext}>Auto-renews monthly. Cancel anytime.</Text>
        </View>
        <View style={styles.gap32} />
        <PrimaryButton text="Pay Now" onPressed={handlePay} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: AppColors.background },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: AppColors.surface,
    borderBottomWidth: 1,
    borderBottomColor: AppColors.borderLight,
  },
  headerTitle: { fontSize: 18, fontWeight: '600', color: AppColors.textPrimary },
  placeholder: { width: 44 },
  content: { padding: 24, justifyContent: 'center', alignItems: 'center', flex: 1 },
  summaryCard: {
    width: '100%',
    backgroundColor: AppColors.surface,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: AppColors.border,
    padding: 24,
    alignItems: 'center',
  },
  info: { fontSize: 18, fontWeight: '700', color: AppColors.textPrimary },
  amount: { fontSize: 26, fontWeight: '900', color: AppColors.primary, marginTop: 12 },
  subtext: { fontSize: 12, color: AppColors.textMuted, marginTop: 8 },
  gap32: { height: 32 },
});