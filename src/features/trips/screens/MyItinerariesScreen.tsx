import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AppStackParamList } from '../../../core/navigation/types';

export default function MyItinerariesScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<AppStackParamList, 'MyItineraries'>>();

  const dummyTrips = [
    { id: '1', destination: 'Paris Adventure', dates: 'Sept 12 - Sept 17, 2026', image: require('../../../../assets/images/welcomeImage.jpg') },
    { id: '2', destination: 'Tokyo Explorer', dates: 'Oct 05 - Oct 12, 2026', image: require('../../../../assets/images/welcomeImage.jpg') },
    { id: '3', destination: 'Kerala Weekend', dates: 'Nov 20 - Nov 23, 2026', image: require('../../../../assets/images/welcomeImage.jpg') },
  ];


  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={{ flexDirection: 'column' }}>
          <Text style={styles.title}>My Itineraries</Text>
          {__DEV__ && (
            <TouchableOpacity onPress={() => navigation.navigate('DevScreenTester')}>
              <Text style={{ fontSize: 12, color: '#E91E63', fontWeight: 'bold', marginTop: 4 }}>Developer: Screen Tester</Text>
            </TouchableOpacity>
          )}
        </View>
        <TouchableOpacity onPress={() => navigation.navigate('ProfileMenu')}>
          <View style={styles.profileBadge} />
        </TouchableOpacity>
      </View>

      {dummyTrips.length === 0 ? (
        <View style={styles.empty}>
          <Text style={styles.emptyText}>No itineraries planned yet</Text>
        </View>
      ) : (
        <FlatList
          data={dummyTrips}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.card}
              onPress={() => navigation.navigate('TripDetails', { tripId: item.id })}
              activeOpacity={0.9}
            >
              <Image source={item.image} style={styles.cardImage} />
              <View style={styles.cardOverlay} />
              <View style={styles.cardContent}>
                <Text style={styles.cardTitle}>{item.destination}</Text>
                <Text style={styles.cardSubtitle}>{item.dates}</Text>
              </View>
            </TouchableOpacity>
          )}
        />
      )}

      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate('PlanTrip')}
      >
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 24 },
  title: { fontSize: 24, fontWeight: '700', color: '#1A1A2E' },
  profileBadge: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#F5F5F7', borderWidth: 1.5, borderColor: '#E8E8E8' },
  list: { padding: 24 },
  card: { height: 180, borderRadius: 16, overflow: 'hidden', marginBottom: 20 },
  cardImage: { width: '100%', height: '100%' },
  cardOverlay: { ...StyleSheet.absoluteFill, backgroundColor: 'rgba(0,0,0,0.3)' },
  cardContent: { position: 'absolute', bottom: 16, left: 16 },
  cardTitle: { fontSize: 20, fontWeight: '700', color: '#FFFFFF' },
  cardSubtitle: { fontSize: 14, color: 'rgba(255,255,255,0.8)', marginTop: 4 },
  empty: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  emptyText: { fontSize: 16, color: '#8E8E93' },
  fab: { position: 'absolute', bottom: 24, right: 24, width: 56, height: 56, borderRadius: 28, backgroundColor: '#E91E63', justifyContent: 'center', alignItems: 'center', elevation: 4 },
  fabText: { fontSize: 28, color: '#FFFFFF', fontWeight: '300' }
});