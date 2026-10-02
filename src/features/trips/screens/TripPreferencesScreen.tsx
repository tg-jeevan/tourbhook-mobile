import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import {
  Check,
  Lightbulb,
  ArrowRight,
} from 'lucide-react-native';
import { AppStackParamList } from '../../../core/navigation/types';
import { AppColors } from '../../../core/theme/colors';
import { TripFlowProgressHeader } from '../components/TripFlowProgressHeader';
import { PreferenceIllustration } from '../components/PreferenceIllustration';

interface PreferenceItem {
  id: string;
  label: string;
  bgTint: string;
}

const PREFERENCE_ROWS: PreferenceItem[][] = [
  [
    { id: 'Adventure', label: 'Adventure', bgTint: '#F0F9FF' },
    { id: 'Nature', label: 'Nature', bgTint: '#F0FDF4' },
    { id: 'Culture', label: 'Culture', bgTint: '#FFF7ED' },
  ],
  [
    { id: 'Food', label: 'Food', bgTint: '#FFFBEB' },
    { id: 'Shopping', label: 'Shopping', bgTint: '#FAF5FF' },
    { id: 'Budget', label: 'Budget', bgTint: '#FEFCE8' },
  ],
  [
    { id: 'Relaxation', label: 'Relaxation', bgTint: '#F0F9FF' },
  ],
];

export default function TripPreferencesScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<AppStackParamList, 'TripPreferences'>>();
  const route = useRoute<RouteProp<AppStackParamList, 'TripPreferences'>>();

  const [selected, setSelected] = useState<string[]>(['Adventure', 'Relaxation']);

  const toggleSelect = (optId: string) => {
    if (selected.includes(optId)) {
      setSelected((prev) => prev.filter((item) => item !== optId));
    } else {
      setSelected((prev) => [...prev, optId]);
    }
  };

  const handleNext = () => {
    navigation.navigate('TripSummary', {
      destination: route.params?.destination || 'Paris, France',
      startDate: route.params?.startDate || 'Sept 12, 2026',
      endDate: route.params?.endDate || 'Sept 17, 2026',
      travelers: route.params?.travelers || 2,
      preferences: selected.length > 0 ? selected : ['Adventure', 'Relaxation'],
    });
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      {/* ── PROGRESS HEADER ───────────────────────────────────────── */}
      <TripFlowProgressHeader
        currentStep={2}
        onBack={() => navigation.goBack()}
        showCloseIcon={true}
      />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* ── HERO TITLE ───────────────────────────────────────────── */}
        <View style={styles.heroSection}>
          <Text style={styles.heroTitle}>Your Preferences</Text>
          <Text style={styles.heroSubtitle}>
            Select what matches your interests{'\n'}so we can create a personalized plan
          </Text>
        </View>

        {/* ── PREFERENCE CARDS GRID (3-COLUMN ROWS) ────────────────── */}
        <View style={styles.gridContainer}>
          {PREFERENCE_ROWS.map((row, rowIndex) => (
            <View key={`pref-row-${rowIndex}`} style={styles.gridRow}>
              {row.map((item) => {
                const isSelected = selected.includes(item.id);

                return (
                  <TouchableOpacity
                    key={item.id}
                    style={[
                      styles.prefCard,
                      { backgroundColor: item.bgTint },
                      isSelected && styles.prefCardSelected,
                    ]}
                    onPress={() => toggleSelect(item.id)}
                    activeOpacity={0.8}
                  >
                    {/* Top Right Checkmark Badge (if selected) */}
                    {isSelected && (
                      <View style={styles.checkBadge}>
                        <Check size={11} color={AppColors.white} strokeWidth={3} />
                      </View>
                    )}

                    {/* Artwork / Illustration */}
                    <View style={styles.illustrationWrap}>
                      <PreferenceIllustration id={item.id} />
                    </View>

                    {/* Preference Label */}
                    <Text
                      style={[
                        styles.prefCardLabel,
                        isSelected && styles.prefCardLabelSelected,
                      ]}
                      numberOfLines={1}
                    >
                      {item.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}

              {/* Empty placeholder slots to maintain equal column width */}
              {Array.from({ length: 3 - row.length }).map((_, i) => (
                <View key={`empty-slot-${i}`} style={styles.emptySlot} />
              ))}
            </View>
          ))}
        </View>

        {/* ── INFO BOX ─────────────────────────────────────────────── */}
        <View style={styles.infoBox}>
          <View style={styles.infoIconWrap}>
            <Lightbulb size={18} color={AppColors.primary} />
          </View>
          <Text style={styles.infoText}>
            Don't worry, you can always update{'\n'}these preferences later.
          </Text>
        </View>

        <View style={styles.bottomSpacer} />

        {/* ── PRIMARY CTA BUTTON ───────────────────────────────────── */}
        <TouchableOpacity
          style={styles.primaryCtaBtn}
          onPress={handleNext}
          activeOpacity={0.88}
        >
          <Text style={styles.primaryCtaText}>Build Itinerary</Text>
          <ArrowRight size={18} color={AppColors.white} />
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FAF7F2',
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 32,
  },

  /* Hero */
  heroSection: {
    marginTop: 4,
    marginBottom: 20,
  },
  heroTitle: {
    fontSize: 28,
    fontWeight: '900',
    color: AppColors.textPrimary,
    letterSpacing: -0.5,
    marginBottom: 6,
  },
  heroSubtitle: {
    fontSize: 13,
    color: AppColors.textMuted,
    lineHeight: 19,
  },

  /* Grid */
  gridContainer: {
    marginBottom: 16,
  },
  gridRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 10,
  },
  prefCard: {
    flex: 1,
    height: 112,
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    borderWidth: 1.5,
    borderColor: '#EAE5DC',
    paddingVertical: 10,
    paddingHorizontal: 4,
    alignItems: 'center',
    justifyContent: 'space-between',
    position: 'relative',
    shadowColor: AppColors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 5,
    elevation: 1,
  },
  prefCardSelected: {
    borderColor: AppColors.primary,
    borderWidth: 2,
    backgroundColor: '#F0F9FF',
  },
  checkBadge: {
    position: 'absolute',
    top: 6,
    right: 6,
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: AppColors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  illustrationWrap: {
    width: '100%',
    height: 54,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 2,
  },
  prefCardLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: AppColors.textPrimary,
    textAlign: 'center',
    marginBottom: 2,
  },
  prefCardLabelSelected: {
    color: AppColors.primary,
    fontWeight: '800',
  },
  emptySlot: {
    flex: 1,
    height: 112,
  },

  /* Info Box */
  infoBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0F9FF',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#BAE6FD',
    padding: 14,
    gap: 12,
  },
  infoIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#E0F2FE',
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoText: {
    flex: 1,
    fontSize: 12,
    color: AppColors.textSecondary,
    lineHeight: 17,
  },

  bottomSpacer: {
    height: 20,
  },

  /* CTA */
  primaryCtaBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: AppColors.primary,
    paddingVertical: 15,
    borderRadius: 22,
    shadowColor: AppColors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
  },
  primaryCtaText: {
    fontSize: 15,
    fontWeight: '800',
    color: AppColors.white,
  },
});