import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AppStackParamList } from '../../../core/navigation/types';
import { BackButton } from '../../../core/components/BackButton';

export default function ItineraryViewScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<AppStackParamList, 'ItineraryView'>>();
  const route = useRoute<RouteProp<AppStackParamList, 'ItineraryView'>>();
  const tripId = route.params?.tripId || '1';

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <BackButton onPress={() => navigation.goBack()} />
        <Text style={styles.headerTitle}>Itinerary View</Text>
        <TouchableOpacity onPress={() => navigation.navigate('ItineraryMap', { tripId })}>
          <Text style={styles.mapLink}>Map</Text>
        </TouchableOpacity>
      </View>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.timeline}>
          <Text style={styles.day}>Day 1</Text>
          <TouchableOpacity onPress={() => navigation.navigate('PlaceDetails', { placeId: '1', placeName: 'Eiffel Tower' })}>
            <Text style={styles.spot}>📍 Eiffel Tower - 10:00 AM</Text>
          </TouchableOpacity>
          <View style={styles.gap16} />
          <Text style={styles.day}>Day 2</Text>
          <TouchableOpacity onPress={() => navigation.navigate('PlaceDetails', { placeId: '2', placeName: 'Louvre Museum' })}>
            <Text style={styles.spot}>📍 Louvre Museum - 02:00 PM</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#FFFFFF' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12 },
  headerTitle: { fontSize: 18, fontWeight: '600', color: '#1A1A2E' },
  mapLink: { fontSize: 16, color: '#E91E63', fontWeight: '600', paddingHorizontal: 8 },
  content: { padding: 24 },
  timeline: { paddingLeft: 12 },
  day: { fontSize: 16, fontWeight: '700', color: '#E91E63', marginBottom: 8 },
  spot: { fontSize: 14, color: '#1A1A2E', textDecorationLine: 'underline' },
  gap16: { height: 16 }
});