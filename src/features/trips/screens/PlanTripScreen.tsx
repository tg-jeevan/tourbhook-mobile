import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AppStackParamList } from '../../../core/navigation/types';
import { BackButton } from '../../../core/components/BackButton';
import { CustomTextField } from '../../../core/components/CustomTextField';
import { PrimaryButton } from '../../../core/components/PrimaryButton';

export default function PlanTripScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<AppStackParamList, 'PlanTrip'>>();
  const [destination, setDestination] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [travelers, setTravelers] = useState('1');

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <BackButton onPress={() => navigation.goBack()} />
        <View style={styles.gap24} />
        <Text style={styles.title}>Plan Your Trip</Text>
        <Text style={styles.subtitle}>Enter trip details to build your itinerary</Text>
        <View style={styles.gap32} />

        <CustomTextField label="Where to?" hint="e.g. Paris, France" value={destination} onChangeText={setDestination} />
        <View style={styles.gap20} />
        <CustomTextField label="Start Date" hint="YYYY-MM-DD" value={startDate} onChangeText={setStartDate} />
        <View style={styles.gap20} />
        <CustomTextField label="End Date" hint="YYYY-MM-DD" value={endDate} onChangeText={setEndDate} />
        <View style={styles.gap20} />
        <CustomTextField label="Number of Travelers" hint="1" value={travelers} onChangeText={setTravelers} keyboardType="number-pad" />

        <View style={styles.gap32} />
        <PrimaryButton
          text="Next: Preferences"
          onPressed={() =>
            navigation.navigate('TripPreferences', {
              destination,
              startDate,
              endDate,
              travelers: parseInt(travelers, 10) || 1,
            })
          }
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#FFFFFF' },
  content: { padding: 24 },
  title: { fontSize: 28, fontWeight: '700', color: '#1A1A2E' },
  subtitle: { fontSize: 14, color: 'rgba(26,26,46,0.7)', marginTop: 8 },
  gap20: { height: 20 },
  gap24: { height: 24 },
  gap32: { height: 32 }
});