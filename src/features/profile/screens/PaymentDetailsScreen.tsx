import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { BackButton } from '../../../core/components/BackButton';
import { PrimaryButton } from '../../../core/components/PrimaryButton';

export default function PaymentDetailsScreen() {
  const navigation = useNavigation();

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <BackButton onPress={() => navigation.goBack()} />
        <Text style={styles.headerTitle}>Payment Details</Text>
        <View style={styles.placeholder} />
      </View>
      <View style={styles.content}>
        <Text style={styles.info}>Plan: Pro Plan Upgrade</Text>
        <Text style={styles.amount}>Total: $9.99</Text>
        <View style={styles.gap32} />
        <PrimaryButton text="Pay Now" onPressed={() => navigation.goBack()} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#FFFFFF' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12 },
  headerTitle: { fontSize: 18, fontWeight: '600', color: '#1A1A2E' },
  placeholder: { width: 44 },
  content: { padding: 24, justifyContent: 'center', alignItems: 'center', flex: 1 },
  info: { fontSize: 18, color: '#1A1A2E' },
  amount: { fontSize: 24, fontWeight: '800', color: '#E91E63', marginTop: 12 },
  gap32: { height: 32 }
});