import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AppStackParamList } from '../../../core/navigation/types';
import { BackButton } from '../../../core/components/BackButton';
import { PrimaryButton } from '../../../core/components/PrimaryButton';

export default function UpgradePlanScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<AppStackParamList, 'UpgradePlan'>>();

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <BackButton onPress={() => navigation.goBack()} />
        <Text style={styles.headerTitle}>Upgrade Plan</Text>
        <View style={styles.placeholder} />
      </View>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.planCard}>
          <Text style={styles.planTitle}>Pro Plan</Text>
          <Text style={styles.planPrice}>$9.99/mo</Text>
          <Text style={styles.planBenefit}>✓ Unlimited dynamic itineraries</Text>
          <Text style={styles.planBenefit}>✓ Offline maps & routing support</Text>
          <View style={styles.gap24} />
          <PrimaryButton text="Upgrade Now" onPressed={() => navigation.navigate('PaymentMethods', { planId: 'pro' })} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#FFFFFF' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12 },
  headerTitle: { fontSize: 18, fontWeight: '600', color: '#1A1A2E' },
  placeholder: { width: 44 },
  content: { padding: 24 },
  planCard: { padding: 24, backgroundColor: '#FCE4EC', borderRadius: 16, borderWidth: 1.5, borderColor: '#E91E63' },
  planTitle: { fontSize: 20, fontWeight: '700', color: '#E91E63' },
  planPrice: { fontSize: 28, fontWeight: '800', color: '#1A1A2E', marginVertical: 12 },
  planBenefit: { fontSize: 14, color: 'rgba(26,26,46,0.8)', marginTop: 8 },
  gap24: { height: 24 }
});