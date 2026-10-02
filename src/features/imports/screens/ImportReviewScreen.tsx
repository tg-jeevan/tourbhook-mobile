import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AppStackParamList } from '../../../core/navigation/types';
import { BackButton } from '../../../core/components/BackButton';
import { CustomTextField } from '../../../core/components/CustomTextField';
import { PrimaryButton } from '../../../core/components/PrimaryButton';
import { DraftPlace } from '../types/importTypes';
import { Typography } from '../../../core/theme/typography';
import { AppColors } from '../../../core/theme/colors';

const SOURCE_LABELS: Record<string, string> = {
  google_maps: 'Google Maps',
  tripit: 'Tripit',
  csv: 'CSV File',
};

export default function ImportReviewScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<AppStackParamList, 'ImportReview'>>();
  const { params } = useRoute<RouteProp<AppStackParamList, 'ImportReview'>>();
  const { draft } = params;

  const [destination, setDestination] = useState(draft.destination);
  const [startDate, setStartDate] = useState(draft.startDate);
  const [endDate, setEndDate] = useState(draft.endDate);
  const [travelers, setTravelers] = useState(String(draft.travelers));
  const [places, setPlaces] = useState<DraftPlace[]>(draft.places);

  const updatePlaceName = (id: string, name: string) => {
    setPlaces(prev => prev.map(place => (place.id === id ? { ...place, name } : place)));
  };

  const removePlace = (id: string) => {
    setPlaces(prev => prev.filter(place => place.id !== id));
  };

  const addPlace = () => {
    setPlaces(prev => [...prev, { id: `place-${Date.now()}`, name: '' }]);
  };

  const handleConfirm = () => {
    const finalTrip = {
      destination,
      startDate,
      endDate,
      travelers: parseInt(travelers, 10) || 1,
      places: places.filter(place => place.name.trim().length > 0),
    };
    console.log('Imported trip confirmed (beta, not yet persisted):', finalTrip);
    navigation.navigate('MyItineraries');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <BackButton onPress={() => navigation.goBack()} />
        <View style={styles.headerTitleRow}>
          <Text style={styles.headerTitle}>Review Import</Text>
          <View style={styles.betaBadge}>
            <Text style={styles.betaBadgeText}>Beta</Text>
          </View>
        </View>
        <View style={styles.headerPlaceholder} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.sourceNotice}>
          <Text style={styles.sourceNoticeText}>
            Imported from {SOURCE_LABELS[draft.source] ?? 'your data'}. Review and edit anything
            below before saving.
          </Text>
        </View>

        <Text style={styles.sectionTitle}>Trip details</Text>

        <View style={styles.field}>
          <CustomTextField label="Destination" hint="e.g. Rome, Italy" value={destination} onChangeText={setDestination} />
        </View>

        <View style={styles.row}>
          <View style={styles.rowField}>
            <CustomTextField label="Start date" hint="e.g. Oct 3, 2026" value={startDate} onChangeText={setStartDate} />
          </View>
          <View style={styles.rowField}>
            <CustomTextField label="End date" hint="e.g. Oct 8, 2026" value={endDate} onChangeText={setEndDate} />
          </View>
        </View>

        <View style={styles.field}>
          <CustomTextField
            label="Travelers"
            hint="1"
            value={travelers}
            onChangeText={setTravelers}
            keyboardType="number-pad"
          />
        </View>

        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionTitle}>Places</Text>
          <TouchableOpacity onPress={addPlace}>
            <Text style={styles.addPlaceText}>+ Add place</Text>
          </TouchableOpacity>
        </View>

        {places.length === 0 ? (
          <Text style={styles.emptyText}>No places yet — add one above.</Text>
        ) : (
          places.map(place => (
            <View key={place.id} style={styles.placeRow}>
              <View style={styles.placeInputWrapper}>
                <CustomTextField hint="Place name" value={place.name} onChangeText={text => updatePlaceName(place.id, text)} />
              </View>
              <TouchableOpacity style={styles.removeButton} onPress={() => removePlace(place.id)}>
                <Text style={styles.removeButtonText}>✕</Text>
              </TouchableOpacity>
            </View>
          ))
        )}
      </ScrollView>

      <View style={styles.footer}>
        <PrimaryButton text="Save as trip" onPressed={handleConfirm} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: AppColors.background },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: AppColors.surface,
    borderBottomWidth: 1,
    borderBottomColor: AppColors.borderLight,
  },
  headerTitleRow: { flex: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 8 },
  headerTitle: { ...Typography.screenTitle, color: AppColors.textPrimary },
  betaBadge: { backgroundColor: AppColors.primaryLight, borderRadius: 10, paddingHorizontal: 8, paddingVertical: 3 },
  betaBadgeText: { fontSize: 11, fontWeight: '700', color: AppColors.primaryDark },
  headerPlaceholder: { width: 44 },

  content: { padding: 20, paddingBottom: 32 },
  sourceNotice: { backgroundColor: AppColors.primaryLight, borderRadius: 14, padding: 14, marginBottom: 24 },
  sourceNoticeText: { fontSize: 13, color: AppColors.primaryDark, lineHeight: 18 },

  sectionTitle: { ...Typography.sectionHeading, color: AppColors.textPrimary, marginBottom: 12 },
  sectionHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 8 },
  addPlaceText: { fontSize: 13, fontWeight: '700', color: AppColors.primary },

  field: { marginBottom: 16 },
  row: { flexDirection: 'row', gap: 12, marginBottom: 16 },
  rowField: { flex: 1 },

  emptyText: { fontSize: 13, color: AppColors.textMuted, marginBottom: 12 },
  placeRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 12, gap: 10 },
  placeInputWrapper: { flex: 1 },
  removeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: AppColors.surfaceMuted,
    borderWidth: 1.5,
    borderColor: AppColors.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  removeButtonText: { fontSize: 14, color: AppColors.textMuted, fontWeight: '700' },

  footer: { padding: 20, borderTopWidth: 1, borderTopColor: AppColors.borderLight, backgroundColor: AppColors.surface },
});