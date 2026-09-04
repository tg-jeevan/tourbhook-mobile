import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AppStackParamList } from '../../../core/navigation/types';
import { BackButton } from '../../../core/components/BackButton';
import { PrimaryButton } from '../../../core/components/PrimaryButton';

export default function TripPreferencesScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<AppStackParamList, 'TripPreferences'>>();
  const route = useRoute<RouteProp<AppStackParamList, 'TripPreferences'>>();
  const [selected, setSelected] = useState<string[]>([]);

  const options = ['Adventure', 'Nature', 'Culture', 'Food', 'Shopping', 'Budget', 'Relaxation'];

  const toggleSelect = (opt: string) => {
    if (selected.includes(opt)) {
      setSelected(selected.filter(item => item !== opt));
    } else {
      setSelected([...selected, opt]);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.content}>
        <BackButton onPress={() => navigation.goBack()} />
        <View style={styles.gap24} />
        <Text style={styles.title}>Your Preferences</Text>
        <Text style={styles.subtitle}>Select what matches your interests</Text>
        <View style={styles.gap32} />

        <View style={styles.grid}>
          {options.map((opt) => {
            const isSel = selected.includes(opt);
            return (
              <TouchableOpacity
                key={opt}
                style={[styles.chip, isSel && styles.chipSelected]}
                onPress={() => toggleSelect(opt)}
                activeOpacity={0.7}
              >
                <Text style={[styles.chipText, isSel && styles.chipTextSelected]}>{opt}</Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <View style={styles.gap40} />
        <PrimaryButton
          text="Build Itinerary"
          onPressed={() =>
            navigation.navigate('TripSummary', {
              ...route.params,
              preferences: selected,
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
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  chip: { paddingVertical: 10, paddingHorizontal: 18, borderRadius: 20, borderWidth: 1.5, borderColor: '#E8E8E8', backgroundColor: '#FFFFFF' },
  chipSelected: { borderColor: '#E91E63', backgroundColor: '#FCE4EC' },
  chipText: { fontSize: 14, color: '#1A1A2E' },
  chipTextSelected: { color: '#E91E63', fontWeight: '600' },
  gap24: { height: 24 },
  gap32: { height: 32 },
  gap40: { height: 40 }
});