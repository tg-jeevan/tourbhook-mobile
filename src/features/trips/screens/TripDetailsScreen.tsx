import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AppStackParamList } from '../../../core/navigation/types';
import { BackButton } from '../../../core/components/BackButton';

import { UGCContentDisplay } from '../../ugc/components/UGCContentDisplay';

export default function TripDetailsScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<AppStackParamList, 'TripDetails'>>();
  const route = useRoute<RouteProp<AppStackParamList, 'TripDetails'>>();
  const tripId = route.params?.tripId || '1';
  const destination = 'Paris, France';

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <BackButton onPress={() => navigation.goBack()} />
        <Text style={styles.headerTitle}>Trip Details</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.destTitle}>{destination}</Text>
        <Text style={styles.destDates}>Sept 10 - Sept 17, 2026</Text>
        <View style={styles.gap24} />

        <View style={styles.actionRow}>
          <TouchableOpacity style={styles.actionBtn} onPress={() => navigation.navigate('ItineraryView', { tripId })}>
            <Text style={styles.actionBtnText}>View Itinerary</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionBtn} onPress={() => navigation.navigate('PackingList', { tripId })}>
            <Text style={styles.actionBtnText}>Packing List</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={styles.eventsBannerBtn}
          onPress={() =>
            navigation.navigate('EventsFeed', {
              destinationId: 'paris',
              destinationName: destination,
            })
          }
          activeOpacity={0.85}
        >
          <Text style={styles.eventsBannerTitle}>🎉 Explore {destination} Events & Activities</Text>
          <Text style={styles.eventsBannerSubtitle}>Browse live festivals, food walks & concerts</Text>
        </TouchableOpacity>

        <View style={styles.gap24} />
        <Text style={styles.sectionTitle}>Quick Itinerary Overview</Text>
        <View style={styles.dayCard}>
          <Text style={styles.dayTitle}>Day 1: Arrival & Exploration</Text>
          <Text style={styles.dayActivity}>10:00 AM - Eiffel Tower Visit</Text>
          <Text style={styles.dayActivity}>02:00 PM - Seine River Cruise</Text>
        </View>

        <View style={styles.gap24} />
        {/* Destination UGC / Traveler Stories Display */}
        <UGCContentDisplay
          destination={destination}
          tripId={tripId}
        />
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
  destTitle: { fontSize: 28, fontWeight: '700', color: '#1A1A2E' },
  destDates: { fontSize: 14, color: '#8E8E93', marginTop: 4 },
  actionRow: { flexDirection: 'row', gap: 12 },
  actionBtn: { flex: 1, height: 50, borderRadius: 25, borderWidth: 1.5, borderColor: '#E91E63', justifyContent: 'center', alignItems: 'center' },
  actionBtnText: { color: '#E91E63', fontWeight: '600' },
  eventsBannerBtn: { marginTop: 12, padding: 14, backgroundColor: '#E8F7EE', borderRadius: 14, borderWidth: 1, borderColor: '#C2EAD0' },
  eventsBannerTitle: { fontSize: 14, fontWeight: '700', color: '#1A1A2E', marginBottom: 2 },
  eventsBannerSubtitle: { fontSize: 12, color: '#1FAE5D', fontWeight: '500' },
  shareUgcBtn: { width: '100%', height: 48, borderRadius: 24, backgroundColor: '#FCE4EC', borderWidth: 1, borderColor: '#F8BBD0', justifyContent: 'center', alignItems: 'center' },
  shareUgcBtnText: { color: '#E91E63', fontWeight: '700', fontSize: 14 },
  sectionTitle: { fontSize: 18, fontWeight: '700', color: '#1A1A2E', marginBottom: 12 },
  dayCard: { padding: 16, backgroundColor: '#F5F5F7', borderRadius: 12 },
  dayTitle: { fontSize: 16, fontWeight: '600', color: '#1A1A2E', marginBottom: 8 },
  dayActivity: { fontSize: 14, color: 'rgba(26,26,46,0.8)', marginTop: 4 },
  gap12: { height: 12 },
  gap24: { height: 24 }
});