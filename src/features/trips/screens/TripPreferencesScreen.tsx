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
import { AppStackParamList, TravelStyle } from '../../../core/navigation/types';
import { AppColors } from '../../../core/theme/colors';
import { TripFlowProgressHeader } from '../components/TripFlowProgressHeader';

// ── Travel Style options (product-spec) ──────────────────────────────────────
interface TravelStyleOption {
  id: TravelStyle;
  label: string;
  description: string;
  emoji: string;
  bgTint: string;
}

const TRAVEL_STYLES: TravelStyleOption[] = [
  {
    id: 'Budget Friendly',
    label: 'Budget Friendly',
    description: 'Smart travel on a tight budget',
    emoji: '💰',
    bgTint: '#F0FDF4',
  },
  {
    id: 'Fast Travel',
    label: 'Fast Travel',
    description: 'Pack in as many experiences as possible',
    emoji: '⚡',
    bgTint: '#FFF7ED',
  },
  {
    id: 'Relaxed Vacation',
    label: 'Relaxed Vacation',
    description: 'Slow-paced and refreshing escape',
    emoji: '🌅',
    bgTint: '#F0F9FF',
  },
  {
    id: 'Explore Everything',
    label: 'Explore Everything',
    description: 'Balanced mix of sights & experiences',
    emoji: '🗺️',
    bgTint: '#FAF5FF',
  },
];

export default function TripPreferencesScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<AppStackParamList, 'TripPreferences'>>();
  const route = useRoute<RouteProp<AppStackParamList, 'TripPreferences'>>();
  const tripParams = route.params;

  const [selectedStyle, setSelectedStyle] = useState<TravelStyle>('Explore Everything');

  const handleNext = () => {
    navigation.navigate('TripSummary', {
      // carry forward all PlanTrip params
      ...tripParams,
      travelStyle: selectedStyle,
    });
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <TripFlowProgressHeader
        currentStep={2}
        totalSteps={6}
        stepLabel="Step 2 of 6 · Travel Style"
        onBack={() => navigation.goBack()}
        showCloseIcon={false}
      />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* ── HERO ─────────────────────────────────────────────────── */}
        <View style={styles.heroSection}>
          <Text style={styles.heroTitle}>How do you like to travel?</Text>
          <Text style={styles.heroSubtitle}>
            Your travel style shapes the entire itinerary{'\n'}Pick the one that fits you best
          </Text>
        </View>

        {/* ── TRAVEL STYLE CARDS ───────────────────────────────────── */}
        <View style={styles.styleCardsGrid}>
          {TRAVEL_STYLES.map((style) => {
            const isSelected = selectedStyle === style.id;
            return (
              <TouchableOpacity
                key={style.id}
                style={[
                  styles.styleCard,
                  { backgroundColor: style.bgTint },
                  isSelected && styles.styleCardSelected,
                ]}
                onPress={() => setSelectedStyle(style.id)}
                activeOpacity={0.8}
              >
                {/* Check badge */}
                {isSelected && (
                  <View style={styles.checkBadge}>
                    <Check size={11} color={AppColors.white} strokeWidth={3} />
                  </View>
                )}

                <Text style={styles.styleEmoji}>{style.emoji}</Text>
                <Text style={[styles.styleLabel, isSelected && styles.styleLabelSelected]}>
                  {style.label}
                </Text>
                <Text style={styles.styleDesc}>{style.description}</Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* ── INFO BOX ─────────────────────────────────────────────── */}
        <View style={styles.infoBox}>
          <View style={styles.infoIconWrap}>
            <Lightbulb size={18} color={AppColors.primary} />
          </View>
          <Text style={styles.infoText}>
            This preference influences which places, timing, and{'\n'}pace we build into your itinerary.
          </Text>
        </View>

        <View style={styles.bottomSpacer} />

        {/* ── CTA ──────────────────────────────────────────────────── */}
        <TouchableOpacity
          style={styles.primaryCtaBtn}
          onPress={handleNext}
          activeOpacity={0.88}
        >
          <Text style={styles.primaryCtaText}>Next: Review Trip</Text>
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

  /* Style Cards 2x2 grid */
  styleCardsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 18,
  },
  styleCard: {
    width: '47%',
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: '#EAE5DC',
    padding: 18,
    position: 'relative',
    shadowColor: AppColors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 5,
    elevation: 1,
    minHeight: 130,
    justifyContent: 'flex-end',
  },
  styleCardSelected: {
    borderColor: AppColors.primary,
    borderWidth: 2,
  },
  checkBadge: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: AppColors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  styleEmoji: {
    fontSize: 30,
    marginBottom: 8,
  },
  styleLabel: {
    fontSize: 13,
    fontWeight: '800',
    color: AppColors.textPrimary,
    marginBottom: 4,
  },
  styleLabelSelected: {
    color: AppColors.primary,
  },
  styleDesc: {
    fontSize: 11,
    color: AppColors.textMuted,
    lineHeight: 15,
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