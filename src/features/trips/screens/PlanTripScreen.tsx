import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Svg, { Path, Circle, G } from 'react-native-svg';
import {
  MapPin,
  Calendar,
  Users,
  Crosshair,
  ArrowRight,
  Minus,
  Plus,
} from 'lucide-react-native';
import { AppStackParamList } from '../../../core/navigation/types';
import { AppColors } from '../../../core/theme/colors';
import { TripFlowProgressHeader } from '../components/TripFlowProgressHeader';

export default function PlanTripScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<AppStackParamList, 'PlanTrip'>>();

  const [destination, setDestination] = useState('Paris, France');
  const [startDate, setStartDate] = useState('Sept 12, 2026');
  const [endDate, setEndDate] = useState('Sept 17, 2026');
  const [travelersCount, setTravelersCount] = useState(2);

  const handleDecrement = () => {
    if (travelersCount > 1) {
      setTravelersCount((prev) => prev - 1);
    }
  };

  const handleIncrement = () => {
    setTravelersCount((prev) => prev + 1);
  };

  const handleNext = () => {
    navigation.navigate('TripPreferences', {
      destination: destination.trim() || 'Paris, France',
      startDate: startDate.trim() || 'Sept 12, 2026',
      endDate: endDate.trim() || 'Sept 17, 2026',
      travelers: travelersCount,
    });
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      {/* ── PROGRESS HEADER ───────────────────────────────────────── */}
      <TripFlowProgressHeader
        currentStep={1}
        onBack={() => navigation.goBack()}
        showCloseIcon={true}
      />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* ── HERO SECTION ─────────────────────────────────────────── */}
        <View style={styles.heroRow}>
          <View style={styles.heroTextCol}>
            <Text style={styles.heroTitle}>Plan Your Trip</Text>
            <Text style={styles.heroSubtitle}>
              Enter trip details to build your{'\n'}perfect itinerary
            </Text>
          </View>

          {/* Travel Landscape Illustration with flight arc */}
          <View style={styles.heroGraphicWrap}>
            <Image
              source={{
                uri: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=300&auto=format&fit=crop&q=80',
              }}
              style={styles.heroImage}
            />
            {/* SVG Flight arc and pin */}
            <View style={styles.svgOverlay} pointerEvents="none">
              <Svg width="110" height="90" viewBox="0 0 110 90" fill="none">
                <Path
                  d="M15 65 C25 35, 55 20, 85 25"
                  stroke="#0E7490"
                  strokeWidth="1.5"
                  strokeDasharray="3 3"
                  strokeOpacity={0.7}
                />
                {/* Airplane */}
                <G transform="translate(42, 35) rotate(-25)">
                  <Path
                    d="M0 0 L6 2 L9 0 L7.5 3.5 L10 5 L7.5 5.5 L6.5 8.5 L5 5.5 L1.5 6 L2.5 4 Z"
                    fill="#0E7490"
                  />
                </G>
                {/* Location Pin */}
                <Circle cx="88" cy="24" r="8" fill="#FF6B4A" opacity={0.25} />
                <Circle cx="88" cy="24" r="4" fill="#FF6B4A" />
              </Svg>
            </View>
          </View>
        </View>

        {/* ── FORM CARDS ───────────────────────────────────────────── */}
        <View style={styles.formCardsList}>
          {/* 1. Where to? */}
          <View style={styles.formCard}>
            <View style={styles.formCardLabelRow}>
              <MapPin size={15} color={AppColors.textPrimary} />
              <Text style={styles.formCardLabel}>Where to?</Text>
            </View>
            <View style={styles.inputInnerRow}>
              <TextInput
                style={styles.textInput}
                placeholder="e.g. Paris, France"
                placeholderTextColor={AppColors.textMuted}
                value={destination}
                onChangeText={setDestination}
              />
              <TouchableOpacity
                style={styles.inputActionBtn}
                onPress={() => setDestination('Paris, France')}
                activeOpacity={0.7}
              >
                <Crosshair size={18} color={AppColors.textMuted} />
              </TouchableOpacity>
            </View>
          </View>

          {/* 2. Start Date */}
          <View style={styles.formCard}>
            <View style={styles.formCardLabelRow}>
              <Calendar size={15} color={AppColors.textPrimary} />
              <Text style={styles.formCardLabel}>Start Date</Text>
            </View>
            <View style={styles.inputInnerRow}>
              <TextInput
                style={styles.textInput}
                placeholder="Select date (e.g. Sept 12, 2026)"
                placeholderTextColor={AppColors.textMuted}
                value={startDate}
                onChangeText={setStartDate}
              />
              <Calendar size={18} color={AppColors.textMuted} style={styles.inputEndIcon} />
            </View>
          </View>

          {/* 3. End Date */}
          <View style={styles.formCard}>
            <View style={styles.formCardLabelRow}>
              <Calendar size={15} color={AppColors.textPrimary} />
              <Text style={styles.formCardLabel}>End Date</Text>
            </View>
            <View style={styles.inputInnerRow}>
              <TextInput
                style={styles.textInput}
                placeholder="Select date (e.g. Sept 17, 2026)"
                placeholderTextColor={AppColors.textMuted}
                value={endDate}
                onChangeText={setEndDate}
              />
              <Calendar size={18} color={AppColors.textMuted} style={styles.inputEndIcon} />
            </View>
          </View>

          {/* 4. Number of Travelers */}
          <View style={styles.formCard}>
            <View style={styles.formCardLabelRow}>
              <Users size={15} color={AppColors.textPrimary} />
              <Text style={styles.formCardLabel}>Number of Travelers</Text>
            </View>
            <View style={styles.travelerCounterRow}>
              <TouchableOpacity
                style={styles.counterCircleBtn}
                onPress={handleDecrement}
                activeOpacity={0.7}
              >
                <Minus size={16} color={AppColors.primary} />
              </TouchableOpacity>

              <Text style={styles.travelerCountValue}>{travelersCount}</Text>

              <TouchableOpacity
                style={styles.counterCircleBtn}
                onPress={handleIncrement}
                activeOpacity={0.7}
              >
                <Plus size={16} color={AppColors.primary} />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <View style={styles.bottomSpacer} />

        {/* ── PRIMARY CTA BUTTON ───────────────────────────────────── */}
        <TouchableOpacity
          style={styles.primaryCtaBtn}
          onPress={handleNext}
          activeOpacity={0.88}
        >
          <Text style={styles.primaryCtaText}>Next: Preferences</Text>
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

  /* Hero Section */
  heroRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 6,
    marginBottom: 20,
  },
  heroTextCol: {
    flex: 1,
    paddingRight: 8,
  },
  heroTitle: {
    fontSize: 30,
    fontWeight: '900',
    color: AppColors.textPrimary,
    letterSpacing: -0.6,
    marginBottom: 6,
  },
  heroSubtitle: {
    fontSize: 13,
    color: AppColors.textMuted,
    lineHeight: 19,
  },
  heroGraphicWrap: {
    width: 100,
    height: 100,
    borderRadius: 24,
    overflow: 'hidden',
    position: 'relative',
  },
  heroImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  svgOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },

  /* Form Cards */
  formCardsList: {
    gap: 14,
  },
  formCard: {
    backgroundColor: AppColors.surface,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#EAE5DC',
    paddingHorizontal: 16,
    paddingVertical: 14,
    shadowColor: AppColors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 6,
    elevation: 1,
  },
  formCardLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 8,
  },
  formCardLabel: {
    fontSize: 13,
    fontWeight: '800',
    color: AppColors.textPrimary,
  },
  inputInnerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FAF7F2',
    borderRadius: 14,
    paddingHorizontal: 12,
    height: 46,
    borderWidth: 1,
    borderColor: '#EAE5DC',
  },
  textInput: {
    flex: 1,
    fontSize: 14,
    fontWeight: '600',
    color: AppColors.textPrimary,
    paddingVertical: 0,
  },
  inputActionBtn: {
    padding: 6,
  },
  inputEndIcon: {
    marginLeft: 6,
  },

  /* Traveler Counter */
  travelerCounterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 28,
    backgroundColor: '#FAF7F2',
    borderRadius: 14,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#EAE5DC',
  },
  counterCircleBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#E0F2FE',
    justifyContent: 'center',
    alignItems: 'center',
  },
  travelerCountValue: {
    fontSize: 18,
    fontWeight: '900',
    color: AppColors.textPrimary,
    minWidth: 20,
    textAlign: 'center',
  },

  bottomSpacer: {
    height: 24,
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