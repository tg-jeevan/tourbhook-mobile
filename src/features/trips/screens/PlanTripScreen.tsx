import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Alert,
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
  User,
  Heart,
  ShieldCheck,
  UserPlus,
  Sparkles,
  X,
} from 'lucide-react-native';
import { AppStackParamList, TravelerType, TravelPurpose } from '../../../core/navigation/types';
import { AppColors } from '../../../core/theme/colors';
import { TripFlowProgressHeader } from '../components/TripFlowProgressHeader';

// ── Traveler type config ─────────────────────────────────────────────────────
interface TravelerTypeOption {
  id: TravelerType;
  label: string;
  emoji: string;
  defaultAdults: number;
  minAdults: number;
  kidsEnabled: boolean;
}

const TRAVELER_TYPES: TravelerTypeOption[] = [
  { id: 'solo',   label: 'Solo',         emoji: '🧍', defaultAdults: 1, minAdults: 1, kidsEnabled: false },
  { id: 'couple', label: 'Couple',       emoji: '👫', defaultAdults: 2, minAdults: 2, kidsEnabled: false },
  { id: 'family', label: 'Family',       emoji: '👨‍👩‍👧', defaultAdults: 2, minAdults: 1, kidsEnabled: true  },
  { id: 'group',  label: 'Friends/Group',emoji: '👥', defaultAdults: 4, minAdults: 2, kidsEnabled: false },
];

// ── Purpose options ──────────────────────────────────────────────────────────
const PURPOSES: { id: TravelPurpose; label: string; emoji: string }[] = [
  { id: 'Leisure',      label: 'Leisure',      emoji: '🌴' },
  { id: 'Birthday',     label: 'Birthday',     emoji: '🎂' },
  { id: 'Bachelorette', label: 'Bachelorette', emoji: '💍' },
];

// ── Helpers ──────────────────────────────────────────────────────────────────
function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

function Counter({
  label,
  value,
  onDecrement,
  onIncrement,
  disabled,
  minValue,
}: {
  label: string;
  value: number;
  onDecrement: () => void;
  onIncrement: () => void;
  disabled?: boolean;
  minValue: number;
}) {
  return (
    <View style={[counterStyles.row, disabled && counterStyles.rowDisabled]}>
      <Text style={[counterStyles.label, disabled && counterStyles.labelDisabled]}>{label}</Text>
      <View style={counterStyles.controls}>
        <TouchableOpacity
          style={[counterStyles.btn, (disabled || value <= minValue) && counterStyles.btnDisabled]}
          onPress={onDecrement}
          disabled={disabled || value <= minValue}
          activeOpacity={0.7}
        >
          <Minus size={14} color={disabled || value <= minValue ? '#CBD5E1' : AppColors.primary} />
        </TouchableOpacity>
        <Text style={[counterStyles.value, disabled && counterStyles.valueDisabled]}>{value}</Text>
        <TouchableOpacity
          style={[counterStyles.btn, disabled && counterStyles.btnDisabled]}
          onPress={onIncrement}
          disabled={disabled}
          activeOpacity={0.7}
        >
          <Plus size={14} color={disabled ? '#CBD5E1' : AppColors.primary} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const counterStyles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
  rowDisabled: {
    opacity: 0.4,
  },
  label: {
    fontSize: 14,
    fontWeight: '700',
    color: AppColors.textPrimary,
  },
  labelDisabled: {
    color: AppColors.textMuted,
  },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  btn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#E0F2FE',
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnDisabled: {
    backgroundColor: '#F1F5F9',
  },
  value: {
    fontSize: 18,
    fontWeight: '900',
    color: AppColors.textPrimary,
    minWidth: 22,
    textAlign: 'center',
  },
  valueDisabled: {
    color: AppColors.textMuted,
  },
});

// ── Main Screen ──────────────────────────────────────────────────────────────
export default function PlanTripScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<AppStackParamList, 'PlanTrip'>>();

  // Core fields
  const [itineraryName, setItineraryName] = useState('');
  const [destination, setDestination] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  // Traveler type & counts
  const [travelerType, setTravelerType] = useState<TravelerType>('couple');
  const [adults, setAdults] = useState(2);
  const [kids, setKids] = useState(0);

  // Purpose
  const [purpose, setPurpose] = useState<TravelPurpose>('Leisure');

  // Age / Safety
  const [primaryAge, setPrimaryAge] = useState('');
  const [medicalInfo, setMedicalInfo] = useState('');

  const selectedTypeConfig = TRAVELER_TYPES.find((t) => t.id === travelerType)!;
  const ageNum = primaryAge.trim() ? parseInt(primaryAge.trim(), 10) : -1;
  const needsMedical = ageNum >= 60;

  // ── When traveler type changes, reset counts to sensible defaults ──────────
  const handleSelectTravelerType = (type: TravelerType) => {
    const cfg = TRAVELER_TYPES.find((t) => t.id === type)!;
    setTravelerType(type);
    setAdults(cfg.defaultAdults);
    setKids(0);
  };

  const handleAdultDecrement = () => {
    setAdults((prev) => clamp(prev - 1, selectedTypeConfig.minAdults, 20));
  };
  const handleAdultIncrement = () => {
    setAdults((prev) => Math.min(prev + 1, 20));
  };
  const handleKidDecrement = () => {
    setKids((prev) => Math.max(prev - 1, 0));
  };
  const handleKidIncrement = () => {
    setKids((prev) => Math.min(prev + 1, 10));
  };

  const handleNext = () => {
    if (!destination.trim()) {
      Alert.alert('Missing Destination', 'Please enter where you want to go.');
      return;
    }
    if (!startDate.trim() || !endDate.trim()) {
      Alert.alert('Missing Dates', 'Please enter your travel start and end dates.');
      return;
    }
    if (ageNum === -1) {
      Alert.alert('Age Required', 'Please enter your age for travel safety recommendations.');
      return;
    }
    if (needsMedical && !medicalInfo.trim()) {
      Alert.alert('Medical Info Required', 'For travelers aged 60+, please provide any relevant medical information for safety.');
      return;
    }

    navigation.navigate('TripPreferences', {
      itineraryName: itineraryName.trim() || undefined,
      destination: destination.trim(),
      startDate: startDate.trim(),
      endDate: endDate.trim(),
      travelerType,
      adults,
      kids,
      purpose,
      primaryAge: ageNum,
      medicalInfo: needsMedical ? medicalInfo.trim() : undefined,
    });
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <TripFlowProgressHeader
        currentStep={1}
        totalSteps={6}
        stepLabel="Step 1 of 6 · Trip Details"
        onBack={() => navigation.goBack()}
        showCloseIcon={true}
      />

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* ── HERO ─────────────────────────────────────────────────── */}
          <View style={styles.heroRow}>
            <View style={styles.heroTextCol}>
              <Text style={styles.heroTitle}>Plan Your Trip</Text>
              <Text style={styles.heroSubtitle}>
                Tell us about your journey and{'\n'}we'll build the perfect itinerary
              </Text>
            </View>
            <View style={styles.heroGraphicWrap}>
              <Svg width="90" height="90" viewBox="0 0 90 90" fill="none">
                <Circle cx="45" cy="45" r="40" fill="#E0F2FE" opacity={0.5} />
                <Path
                  d="M20 60 C35 35, 55 25, 70 30"
                  stroke="#0E7490"
                  strokeWidth="1.5"
                  strokeDasharray="3 3"
                  strokeOpacity={0.7}
                />
                <G transform="translate(60, 24) rotate(-25)">
                  <Path
                    d="M0 0 L6 2 L9 0 L7.5 3.5 L10 5 L7.5 5.5 L6.5 8.5 L5 5.5 L1.5 6 L2.5 4 Z"
                    fill="#0E7490"
                  />
                </G>
                <Circle cx="70" cy="28" r="8" fill="#FF6B4A" opacity={0.2} />
                <Circle cx="70" cy="28" r="4" fill="#FF6B4A" />
              </Svg>
            </View>
          </View>

          {/* ── ITINERARY NAME (Optional) ────────────────────────────── */}
          <View style={styles.sectionCard}>
            <View style={styles.sectionLabelRow}>
              <Sparkles size={15} color={AppColors.primary} />
              <Text style={styles.sectionLabel}>Itinerary Name</Text>
              <View style={styles.optionalBadge}>
                <Text style={styles.optionalBadgeText}>Optional</Text>
              </View>
            </View>
            <Text style={styles.fieldSupportingText}>
              Choose a name now. It cannot be changed after creation.
            </Text>
            <View style={styles.inputRow}>
              <TextInput
                style={styles.textInput}
                placeholder="Give your trip a name"
                placeholderTextColor={AppColors.textMuted}
                value={itineraryName}
                onChangeText={setItineraryName}
                maxLength={60}
              />
              {itineraryName.length > 0 && (
                <TouchableOpacity
                  style={styles.inputActionBtn}
                  onPress={() => setItineraryName('')}
                  activeOpacity={0.7}
                >
                  <X size={16} color={AppColors.textMuted} />
                </TouchableOpacity>
              )}
            </View>
          </View>

          {/* ── DESTINATION ──────────────────────────────────────────── */}
          <View style={styles.sectionCard}>
            <View style={styles.sectionLabelRow}>
              <MapPin size={15} color={AppColors.primary} />
              <Text style={styles.sectionLabel}>Destination</Text>
            </View>
            <View style={styles.inputRow}>
              <TextInput
                style={styles.textInput}
                placeholder="e.g. Bangalore, India"
                placeholderTextColor={AppColors.textMuted}
                value={destination}
                onChangeText={setDestination}
              />
              <TouchableOpacity
                style={styles.inputActionBtn}
                onPress={() => setDestination('')}
                activeOpacity={0.7}
              >
                <Crosshair size={18} color={AppColors.textMuted} />
              </TouchableOpacity>
            </View>
          </View>

          {/* ── TRAVEL DATES ─────────────────────────────────────────── */}
          <View style={styles.sectionCard}>
            <View style={styles.sectionLabelRow}>
              <Calendar size={15} color={AppColors.primary} />
              <Text style={styles.sectionLabel}>Travel Dates</Text>
            </View>
            <View style={styles.datesRow}>
              <View style={[styles.inputRow, { flex: 1 }]}>
                <TextInput
                  style={[styles.textInput, { fontSize: 13 }]}
                  placeholder="Start date"
                  placeholderTextColor={AppColors.textMuted}
                  value={startDate}
                  onChangeText={setStartDate}
                />
                <Calendar size={16} color={AppColors.textMuted} />
              </View>
              <Text style={styles.datesSeparator}>→</Text>
              <View style={[styles.inputRow, { flex: 1 }]}>
                <TextInput
                  style={[styles.textInput, { fontSize: 13 }]}
                  placeholder="End date"
                  placeholderTextColor={AppColors.textMuted}
                  value={endDate}
                  onChangeText={setEndDate}
                />
                <Calendar size={16} color={AppColors.textMuted} />
              </View>
            </View>
          </View>

          {/* ── TRAVELER TYPE ─────────────────────────────────────────── */}
          <View style={styles.sectionCard}>
            <View style={styles.sectionLabelRow}>
              <Users size={15} color={AppColors.primary} />
              <Text style={styles.sectionLabel}>Traveler Type</Text>
            </View>
            <View style={styles.typeChipsGrid}>
              {TRAVELER_TYPES.map((opt) => {
                const isActive = travelerType === opt.id;
                return (
                  <TouchableOpacity
                    key={opt.id}
                    style={[styles.typeChip, isActive && styles.typeChipActive]}
                    onPress={() => handleSelectTravelerType(opt.id)}
                    activeOpacity={0.8}
                  >
                    <Text style={styles.typeEmoji}>{opt.emoji}</Text>
                    <Text style={[styles.typeChipLabel, isActive && styles.typeChipLabelActive]}>
                      {opt.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          {/* ── TRAVELER COUNTS (dynamic by type) ────────────────────── */}
          <View style={styles.sectionCard}>
            <View style={styles.sectionLabelRow}>
              <UserPlus size={15} color={AppColors.primary} />
              <Text style={styles.sectionLabel}>Travelers</Text>
            </View>
            <Counter
              label="Adults"
              value={adults}
              minValue={selectedTypeConfig.minAdults}
              onDecrement={handleAdultDecrement}
              onIncrement={handleAdultIncrement}
            />
            <View style={styles.thinDivider} />
            <Counter
              label="Kids"
              value={kids}
              minValue={0}
              disabled={!selectedTypeConfig.kidsEnabled}
              onDecrement={handleKidDecrement}
              onIncrement={handleKidIncrement}
            />
            {!selectedTypeConfig.kidsEnabled && (
              <Text style={styles.disabledHint}>
                Kids are not applicable for {selectedTypeConfig.label} trips
              </Text>
            )}
          </View>

          {/* ── TRAVEL PURPOSE ────────────────────────────────────────── */}
          <View style={styles.sectionCard}>
            <View style={styles.sectionLabelRow}>
              <Heart size={15} color={AppColors.primary} />
              <Text style={styles.sectionLabel}>Travel Purpose</Text>
            </View>
            <View style={styles.purposeChipsRow}>
              {PURPOSES.map((p) => {
                const isActive = purpose === p.id;
                return (
                  <TouchableOpacity
                    key={p.id}
                    style={[styles.purposeChip, isActive && styles.purposeChipActive]}
                    onPress={() => setPurpose(p.id)}
                    activeOpacity={0.8}
                  >
                    <Text style={styles.purposeEmoji}>{p.emoji}</Text>
                    <Text style={[styles.purposeLabel, isActive && styles.purposeLabelActive]}>
                      {p.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          {/* ── AGE / SAFETY ──────────────────────────────────────────── */}
          <View style={styles.sectionCard}>
            <View style={styles.sectionLabelRow}>
              <ShieldCheck size={15} color={AppColors.primary} />
              <Text style={styles.sectionLabel}>Traveler Safety</Text>
              <View style={styles.requiredBadge}>
                <Text style={styles.requiredBadgeText}>Required</Text>
              </View>
            </View>
            <Text style={styles.safetyHint}>
              Your age helps us personalise recommendations and assess travel capability.
            </Text>
            <View style={styles.inputRow}>
              <User size={16} color={AppColors.textMuted} style={{ marginRight: 8 }} />
              <TextInput
                style={[styles.textInput]}
                placeholder="Your age (e.g. 28)"
                placeholderTextColor={AppColors.textMuted}
                value={primaryAge}
                onChangeText={(t) => setPrimaryAge(t.replace(/[^0-9]/g, ''))}
                keyboardType="numeric"
                maxLength={3}
              />
            </View>

            {needsMedical && (
              <>
                <View style={styles.medicalAlertBanner}>
                  <Text style={styles.medicalAlertText}>
                    ⚕️  For travelers aged 60+, please share any relevant medical information.
                    This helps us suggest appropriate activities and safety precautions.
                  </Text>
                </View>
                <View style={[styles.inputRow, styles.inputRowMultiline]}>
                  <TextInput
                    style={[styles.textInput, styles.multilineInput]}
                    placeholder="Medical conditions, mobility needs, dietary requirements…"
                    placeholderTextColor={AppColors.textMuted}
                    value={medicalInfo}
                    onChangeText={setMedicalInfo}
                    multiline
                    numberOfLines={3}
                  />
                </View>
              </>
            )}
          </View>

          <View style={styles.bottomSpacer} />

          {/* ── CTA ──────────────────────────────────────────────────── */}
          <TouchableOpacity
            style={styles.primaryCtaBtn}
            onPress={handleNext}
            activeOpacity={0.88}
          >
            <Text style={styles.primaryCtaText}>Next: Travel Style</Text>
            <ArrowRight size={18} color={AppColors.white} />
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
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
    width: 90,
    height: 90,
    borderRadius: 24,
    overflow: 'hidden',
    position: 'relative',
  },

  /* Section Cards */
  sectionCard: {
    backgroundColor: AppColors.surface,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#EAE5DC',
    paddingHorizontal: 16,
    paddingVertical: 14,
    marginBottom: 14,
    shadowColor: AppColors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 6,
    elevation: 1,
  },
  sectionLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 10,
  },
  sectionLabel: {
    fontSize: 13,
    fontWeight: '800',
    color: AppColors.textPrimary,
  },
  requiredBadge: {
    marginLeft: 4,
    backgroundColor: '#FEE2E2',
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 8,
  },
  requiredBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#DC2626',
  },
  optionalBadge: {
    marginLeft: 4,
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 8,
  },
  optionalBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: AppColors.textMuted,
  },
  fieldSupportingText: {
    fontSize: 12,
    color: AppColors.textMuted,
    lineHeight: 16,
    marginBottom: 8,
  },

  /* Input row */
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FAF7F2',
    borderRadius: 14,
    paddingHorizontal: 12,
    height: 46,
    borderWidth: 1,
    borderColor: '#EAE5DC',
  },
  inputRowMultiline: {
    height: 'auto',
    paddingVertical: 10,
    alignItems: 'flex-start',
  },
  textInput: {
    flex: 1,
    fontSize: 14,
    fontWeight: '600',
    color: AppColors.textPrimary,
    paddingVertical: 0,
  },
  multilineInput: {
    minHeight: 70,
    textAlignVertical: 'top',
  },
  inputActionBtn: {
    padding: 6,
  },

  /* Dates row */
  datesRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  datesSeparator: {
    fontSize: 18,
    color: AppColors.textMuted,
    fontWeight: '700',
  },

  /* Traveler type chips */
  typeChipsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  typeChip: {
    flex: 1,
    minWidth: '40%',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 14,
    paddingVertical: 11,
    borderRadius: 14,
    backgroundColor: '#FAF7F2',
    borderWidth: 1.5,
    borderColor: '#EAE5DC',
  },
  typeChipActive: {
    borderColor: AppColors.primary,
    backgroundColor: '#EFF6FF',
  },
  typeEmoji: {
    fontSize: 18,
  },
  typeChipLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: AppColors.textPrimary,
  },
  typeChipLabelActive: {
    color: AppColors.primary,
  },

  /* Thin divider between counter rows */
  thinDivider: {
    height: 1,
    backgroundColor: '#F3EFE8',
    marginVertical: 4,
  },
  disabledHint: {
    marginTop: 6,
    fontSize: 11,
    color: AppColors.textMuted,
    fontStyle: 'italic',
  },

  /* Purpose chips */
  purposeChipsRow: {
    flexDirection: 'row',
    gap: 10,
  },
  purposeChip: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 12,
    borderRadius: 14,
    backgroundColor: '#FAF7F2',
    borderWidth: 1.5,
    borderColor: '#EAE5DC',
    gap: 4,
  },
  purposeChipActive: {
    borderColor: AppColors.primary,
    backgroundColor: '#EFF6FF',
  },
  purposeEmoji: {
    fontSize: 22,
  },
  purposeLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: AppColors.textPrimary,
  },
  purposeLabelActive: {
    color: AppColors.primary,
  },

  /* Safety section */
  safetyHint: {
    fontSize: 12,
    color: AppColors.textMuted,
    lineHeight: 17,
    marginBottom: 10,
  },
  medicalAlertBanner: {
    marginTop: 12,
    marginBottom: 10,
    backgroundColor: '#FFF7ED',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#FED7AA',
    padding: 12,
  },
  medicalAlertText: {
    fontSize: 12,
    color: '#92400E',
    lineHeight: 17,
    fontWeight: '500',
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