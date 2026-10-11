import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ArrowRight, Check } from 'lucide-react-native';
import { AppStackParamList, TravelMode } from '../../../core/navigation/types';
import { AppColors } from '../../../core/theme/colors';
import { TripFlowProgressHeader } from '../components/TripFlowProgressHeader';

// ── Travel mode options ──────────────────────────────────────────────────────
interface TravelModeOption {
  id: TravelMode;
  label: string;
  emoji: string;
  description: string;
  packingHint: string;
}

const TRAVEL_MODE_OPTIONS: TravelModeOption[] = [
  {
    id: 'Airplane',
    label: 'Airplane',
    emoji: '✈️',
    description: 'Long-distance air travel',
    packingHint: 'Carry-on essentials, liquids policy, boarding pass',
  },
  {
    id: 'Train',
    label: 'Train',
    emoji: '🚂',
    description: 'Rail journey',
    packingHint: 'Travel pillow, snacks, comfort items',
  },
  {
    id: 'Bus',
    label: 'Bus',
    emoji: '🚌',
    description: 'Road bus travel',
    packingHint: 'Travel snacks, headphones, motion comfort',
  },
  {
    id: 'Car',
    label: 'Car',
    emoji: '🚗',
    description: 'Personal or rental vehicle',
    packingHint: 'Road maps, car charger, roadside kit',
  },
  {
    id: 'Public Transport',
    label: 'Public Transport',
    emoji: '🚇',
    description: 'Metro, bus, tram',
    packingHint: 'Travel card, comfortable shoes, small backpack',
  },
  {
    id: 'Boat',
    label: 'Boat',
    emoji: '🚢',
    description: 'Ferry, cruise or water taxi',
    packingHint: 'Sea-sickness tablets, waterproof bag, light layers',
  },
];

export default function TravelModeScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<AppStackParamList, 'TravelMode'>>();
  const route = useRoute<RouteProp<AppStackParamList, 'TravelMode'>>();
  const tripParams = route.params;

  const [selectedModes, setSelectedModes] = useState<Set<TravelMode>>(new Set());

  const toggleMode = (mode: TravelMode) => {
    setSelectedModes((prev) => {
      const next = new Set(prev);
      if (next.has(mode)) {
        next.delete(mode);
      } else {
        next.add(mode);
      }
      return next;
    });
  };

  const handleNext = () => {
    navigation.navigate('CheckingPacking', {
      ...tripParams,
      travelModes: Array.from(selectedModes),
      tripId: tripParams?.tripId || `trip-${Date.now()}`,
    });
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <TripFlowProgressHeader
        currentStep={5}
        totalSteps={6}
        stepLabel="Step 5 of 6 · Travel Mode"
        onBack={() => navigation.goBack()}
        showCloseIcon={false}
      />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* ── HERO ─────────────────────────────────────────────────── */}
        <View style={styles.heroSection}>
          <Text style={styles.heroTitle}>How will you travel?</Text>
          <Text style={styles.heroSubtitle}>
            Select all modes of transport for your trip.{'\n'}
            This helps us personalise your packing list.
          </Text>
        </View>

        {/* ── TRAVEL MODE CARDS ────────────────────────────────────── */}
        <View style={styles.modesGrid}>
          {TRAVEL_MODE_OPTIONS.map((opt) => {
            const isSelected = selectedModes.has(opt.id);
            return (
              <TouchableOpacity
                key={opt.id}
                style={[styles.modeCard, isSelected && styles.modeCardSelected]}
                onPress={() => toggleMode(opt.id)}
                activeOpacity={0.8}
              >
                {/* Top row: emoji + check */}
                <View style={styles.modeCardTop}>
                  <Text style={styles.modeEmoji}>{opt.emoji}</Text>
                  {isSelected && (
                    <View style={styles.checkBadge}>
                      <Check size={11} color={AppColors.white} strokeWidth={3} />
                    </View>
                  )}
                </View>
                <Text style={[styles.modeLabel, isSelected && styles.modeLabelSelected]}>
                  {opt.label}
                </Text>
                <Text style={styles.modeDesc}>{opt.description}</Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* ── PACKING HINT ─────────────────────────────────────────── */}
        {selectedModes.size > 0 && (
          <View style={styles.packingHintCard}>
            <Text style={styles.packingHintTitle}>✅  Packing list will include:</Text>
            {Array.from(selectedModes).map((mode) => {
              const opt = TRAVEL_MODE_OPTIONS.find((o) => o.id === mode)!;
              return (
                <Text key={mode} style={styles.packingHintLine}>
                  {opt.emoji}  {opt.packingHint}
                </Text>
              );
            })}
          </View>
        )}

        <View style={styles.bottomSpacer} />

        {/* ── CTA ──────────────────────────────────────────────────── */}
        <TouchableOpacity
          style={styles.primaryCtaBtn}
          onPress={handleNext}
          activeOpacity={0.88}
        >
          <Text style={styles.primaryCtaText}>
            {selectedModes.size > 0 ? 'Next: Packing List' : 'Skip & Build Packing List'}
          </Text>
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
    paddingBottom: 36,
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

  /* Modes Grid 2x3 */
  modesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 16,
  },
  modeCard: {
    width: '47%',
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: '#EAE5DC',
    backgroundColor: AppColors.surface,
    padding: 16,
    position: 'relative',
    shadowColor: AppColors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 5,
    elevation: 1,
    minHeight: 100,
  },
  modeCardSelected: {
    borderColor: AppColors.primary,
    borderWidth: 2,
    backgroundColor: '#EFF6FF',
  },
  modeCardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  modeEmoji: {
    fontSize: 28,
  },
  checkBadge: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: AppColors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modeLabel: {
    fontSize: 14,
    fontWeight: '800',
    color: AppColors.textPrimary,
    marginBottom: 3,
  },
  modeLabelSelected: {
    color: AppColors.primary,
  },
  modeDesc: {
    fontSize: 11,
    color: AppColors.textMuted,
    lineHeight: 15,
  },

  /* Packing Hint */
  packingHintCard: {
    backgroundColor: '#F0FDF4',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#BBF7D0',
    padding: 14,
    gap: 6,
  },
  packingHintTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#166534',
    marginBottom: 4,
  },
  packingHintLine: {
    fontSize: 12,
    color: '#166534',
    lineHeight: 18,
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
