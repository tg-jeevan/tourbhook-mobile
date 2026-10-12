import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Easing,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AppStackParamList } from '../../../core/navigation/types';
import { AppColors } from '../../../core/theme/colors';
import { itineraryStore, ItineraryTrip } from '../data/itineraryStore';
import {
  formatDateRange,
  formatDestinationLocation,
  generateDefaultItineraryTitle,
  calculateTravelerCount,
  getDestinationImage,
} from '../utils/itineraryFormatting';

/**
 * CheckingPackingScreen — Step 6 of the creation flow.
 *
 * Acts as the "blank / building itinerary" loading state.
 * Shows a pulsing animation while the itinerary is "generating",
 * registers the new trip into the store, then auto-navigates to ItineraryView.
 */
export default function CheckingPackingScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<AppStackParamList, 'CheckingPacking'>>();
  const route = useRoute<RouteProp<AppStackParamList, 'CheckingPacking'>>();
  const params = route.params;
  const tripId = params?.tripId || `trip-${Date.now()}`;

  // ── Animations ──────────────────────────────────────────────────────────
  const pulseAnim  = useRef(new Animated.Value(0.8)).current;
  const dotAnim1   = useRef(new Animated.Value(0)).current;
  const dotAnim2   = useRef(new Animated.Value(0)).current;
  const dotAnim3   = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // If this is a newly planned trip, add it to the itineraryStore source of truth
    if (params?.destination && params.destination !== 'Your Destination') {
      const existing = itineraryStore.getItineraryById(tripId);
      if (!existing) {
        const formattedLocation = formatDestinationLocation(params.destination);
        const customTitle = params.itineraryName?.trim();
        const finalTitle = generateDefaultItineraryTitle(params.destination, customTitle);
        const formattedDates = formatDateRange(params.startDate, params.endDate);
        const destImage = getDestinationImage(params.destination);
        const placesCount = params.selectedPlaceIds ? params.selectedPlaceIds.length : 0;
        const activitiesCount = 0;
        const travelersCount = calculateTravelerCount(
          params.travelerType,
          params.adults,
          params.kids
        );

        const newTrip: ItineraryTrip = {
          id: tripId,
          title: finalTitle,
          customName: customTitle || undefined,
          destination: formattedLocation,
          location: formattedLocation,
          dates: formattedDates,
          startDate: params.startDate,
          endDate: params.endDate,
          status: 'upcoming',
          placesCount,
          activitiesCount,
          travelersCount,
          imageUri: destImage,
          theme:
            params.travelStyle === 'Budget Friendly'
              ? 'mint'
              : params.travelStyle === 'Fast Travel'
              ? 'peach'
              : 'sky',
        };
        itineraryStore.addItinerary(newTrip);
      }
    }

    // Soft pulse ring
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.15,
          duration: 900,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 0.8,
          duration: 900,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ]),
    ).start();

    // Staggered loading dots
    const stagger = (dot: Animated.Value, delay: number) =>
      Animated.loop(
        Animated.sequence([
          Animated.delay(delay),
          Animated.timing(dot, { toValue: 1, duration: 400, useNativeDriver: true }),
          Animated.timing(dot, { toValue: 0, duration: 400, useNativeDriver: true }),
          Animated.delay(800 - delay),
        ]),
      );

    stagger(dotAnim1, 0).start();
    stagger(dotAnim2, 300).start();
    stagger(dotAnim3, 600).start();

    // Auto-navigate to itinerary view after simulated generation delay
    const timer = setTimeout(() => {
      navigation.replace('ItineraryView', { tripId });
    }, 3000);

    return () => clearTimeout(timer);
  }, [navigation, tripId, params, pulseAnim, dotAnim1, dotAnim2, dotAnim3]);

  const dotStyle = (anim: Animated.Value) => ({
    opacity: anim.interpolate({ inputRange: [0, 1], outputRange: [0.3, 1] }),
    transform: [
      { scale: anim.interpolate({ inputRange: [0, 1], outputRange: [0.8, 1.2] }) },
    ],
  });

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right', 'bottom']}>
      <View style={styles.centerContent}>
        {/* Pulsing animated circle */}
        <View style={styles.animationContainer}>
          <Animated.View
            style={[styles.pulseRing, { transform: [{ scale: pulseAnim }] }]}
          />
          <View style={styles.innerCircle}>
            <Text style={styles.innerEmoji}>✈️</Text>
          </View>
        </View>

        {/* Loading dots */}
        <View style={styles.dotsRow}>
          <Animated.View style={[styles.dot, dotStyle(dotAnim1)]} />
          <Animated.View style={[styles.dot, dotStyle(dotAnim2)]} />
          <Animated.View style={[styles.dot, dotStyle(dotAnim3)]} />
        </View>

        {/* Text */}
        <Text style={styles.title}>My Itinerary</Text>
        <Text style={styles.subtitle}>Building your personalised itinerary…</Text>
        <Text style={styles.hint}>
          This may take a moment. We're crafting days,{'\n'}
          activities, timings and logistics just for you.
        </Text>

        {/* Steps being processed */}
        <View style={styles.stepsCard}>
          <Text style={styles.stepsCardTitle}>✓  Trip details captured</Text>
          <Text style={styles.stepsCardTitle}>✓  Places selected</Text>
          <Text style={styles.stepsCardTitle}>✓  Travel mode set</Text>
          <Text style={styles.stepsCardActive}>⟳  Generating itinerary…</Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FAF7F2',
  },
  centerContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },

  /* Animation */
  animationContainer: {
    width: 120,
    height: 120,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  pulseRing: {
    position: 'absolute',
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#E0F2FE',
    opacity: 0.5,
  },
  innerCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#BAE6FD',
    justifyContent: 'center',
    alignItems: 'center',
  },
  innerEmoji: {
    fontSize: 32,
  },

  /* Dots */
  dotsRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 24,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: AppColors.primary,
  },

  /* Text */
  title: {
    fontSize: 26,
    fontWeight: '900',
    color: AppColors.textPrimary,
    letterSpacing: -0.4,
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 15,
    fontWeight: '700',
    color: AppColors.primary,
    marginBottom: 10,
    textAlign: 'center',
  },
  hint: {
    fontSize: 13,
    color: AppColors.textMuted,
    lineHeight: 19,
    textAlign: 'center',
    marginBottom: 28,
  },

  /* Steps Card */
  stepsCard: {
    width: '100%',
    backgroundColor: AppColors.surface,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#EAE5DC',
    padding: 18,
    gap: 8,
  },
  stepsCardTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#059669',
    lineHeight: 20,
  },
  stepsCardActive: {
    fontSize: 13,
    fontWeight: '700',
    color: AppColors.primary,
    lineHeight: 20,
  },
});
