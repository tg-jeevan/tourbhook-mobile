import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AppStackParamList } from '../../../core/navigation/types';
import { BackButton } from '../../../core/components/BackButton';
import { PrimaryButton } from '../../../core/components/PrimaryButton';

export default function TripSummaryScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<AppStackParamList, 'TripSummary'>>();
  const route = useRoute<RouteProp<AppStackParamList, 'TripSummary'>>();
  const params = route.params;

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.content}>
        <BackButton onPress={() => navigation.goBack()} />
        <View style={styles.gap24} />
        <Text style={styles.title}>Trip Summary</Text>
        <Text style={styles.subtitle}>Review your generated travel plan</Text>
        <View style={styles.gap32} />

        <View style={styles.summaryCard}>
          <Text style={styles.cardLabel}>Destination</Text>
          <Text style={styles.cardValue}>{params?.destination}</Text>
          <View style={styles.gap16} />
          <Text style={styles.cardLabel}>Dates</Text>
          <Text style={styles.cardValue}>{params?.startDate} to {params?.endDate}</Text>
          <View style={styles.gap16} />
          <Text style={styles.cardLabel}>Travelers</Text>
          <Text style={styles.cardValue}>{params?.travelers} Traveler(s)</Text>
          <View style={styles.gap16} />
          <Text style={styles.cardLabel}>Interests</Text>
          <Text style={styles.cardValue}>{params?.preferences?.join(', ') || 'None'}</Text>
        </View>

        <View style={styles.gap40} />
        <PrimaryButton text="Confirm & Open Itinerary" onPressed={() => navigation.navigate('TripDetails', { tripId: '1' })} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#FFFFFF' },
  content: { padding: 24 },
  title: { fontSize: 28, fontWeight: '700', color: '#1A1A2E' },
  subtitle: { fontSize: 14, color: 'rgba(26,26,46,0.7)', marginTop: 8 },
  summaryCard: { padding: 20, backgroundColor: '#F5F5F7', borderRadius: 16, borderWidth: 1, borderColor: '#E8E8E8' },
  cardLabel: { fontSize: 12, color: '#8E8E93', fontWeight: '500', textTransform: 'uppercase' },
  cardValue: { fontSize: 16, color: '#1A1A2E', fontWeight: '600', marginTop: 4 },
  gap16: { height: 16 },
  gap24: { height: 24 },
  gap32: { height: 32 },
  gap40: { height: 40 }
});