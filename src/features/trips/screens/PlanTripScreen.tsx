import React, { useState, useEffect } from 'react';
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
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
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
  Check,
  Lock,
} from 'lucide-react-native';
import { AppStackParamList, TravelerType, TravelPurpose } from '../../../core/navigation/types';
import { AppColors } from '../../../core/theme/colors';
import { TripFlowProgressHeader } from '../components/TripFlowProgressHeader';
import {
  searchDestinationSuggestions,
  DestinationSuggestion,
  CURATED_DESTINATIONS,
} from '../services/destinationAutocompleteService';
import {
  validateTripDateRange,
  parseDateStringToLocalDate,
  isBeforeDay,
} from '../utils/tripDateUtils';
import { TripDatePickerModal } from '../components/TripDatePickerModal';
import {
  formatDateRange,
  extractStartAndEndDatesFromRange,
} from '../utils/itineraryFormatting';
import {
  normalizeAdultsForTravelerType,
  getNextAdultCount,
  getPrevAdultCount,
  isAdultIncrementDisabled,
  isAdultDecrementDisabled,
} from '../utils/travelerRules';
import { itineraryStore, ItineraryTrip } from '../data/itineraryStore';

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
  decrementDisabled,
  incrementDisabled,
  minValue,
}: {
  label: string;
  value: number;
  onDecrement: () => void;
  onIncrement: () => void;
  disabled?: boolean;
  decrementDisabled?: boolean;
  incrementDisabled?: boolean;
  minValue?: number;
}) {
  const isDecDisabled =
    disabled ||
    (decrementDisabled !== undefined
      ? decrementDisabled
      : minValue !== undefined && value <= minValue);
  const isIncDisabled =
    disabled || (incrementDisabled !== undefined ? incrementDisabled : false);

  return (
    <View style={[counterStyles.row, disabled && counterStyles.rowDisabled]}>
      <Text style={[counterStyles.label, disabled && counterStyles.labelDisabled]}>{label}</Text>
      <View style={counterStyles.controls}>
        <TouchableOpacity
          style={[counterStyles.btn, isDecDisabled && counterStyles.btnDisabled]}
          onPress={onDecrement}
          disabled={isDecDisabled}
          activeOpacity={0.7}
        >
          <Minus size={14} color={isDecDisabled ? '#CBD5E1' : AppColors.primary} />
        </TouchableOpacity>
        <Text style={[counterStyles.value, (disabled || (isDecDisabled && isIncDisabled)) && counterStyles.valueDisabled]}>{value}</Text>
        <TouchableOpacity
          style={[counterStyles.btn, isIncDisabled && counterStyles.btnDisabled]}
          onPress={onIncrement}
          disabled={isIncDisabled}
          activeOpacity={0.7}
        >
          <Plus size={14} color={isIncDisabled ? '#CBD5E1' : AppColors.primary} />
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

// ── Destination resolution helper for existing trip ─────────────────────────
function resolveDestinationSuggestionForTrip(trip?: ItineraryTrip): DestinationSuggestion | null {
  if (!trip) return null;
  const rawDest = (trip.destination || trip.location || '').trim();
  if (!rawDest) return null;

  if (trip.destinationMetadata && trip.destinationMetadata.formatted) {
    return trip.destinationMetadata as DestinationSuggestion;
  }

  // Check CURATED_DESTINATIONS for an exact or city match
  const lower = rawDest.toLowerCase();
  const curated = CURATED_DESTINATIONS.find(
    (c) =>
      c.formatted.toLowerCase() === lower ||
      c.city.toLowerCase() === lower ||
      lower.includes(c.city.toLowerCase())
  );
  if (curated) {
    return curated;
  }

  // Synthesize a structured DestinationSuggestion
  const parts = rawDest.split(',').map((p) => p.trim());
  const city = parts[0] || rawDest;
  const country = parts.length > 1 ? parts[parts.length - 1] : '';
  const state = parts.length > 2 ? parts[1] : '';

  return {
    id: `dest-${trip.id}`,
    city,
    state: state || undefined,
    country: country || 'Unknown',
    formatted: rawDest,
  };
}

export interface TravelerSafetyValidationResult {
  isValid: boolean;
  ageNum: number;
  needsMedical: boolean;
  ageError?: string;
  medicalInfoError?: string;
}

export function validateTravelerSafety({
  primaryAge,
  medicalInfo,
  isEditMode,
}: {
  primaryAge: string | number;
  medicalInfo?: string;
  isEditMode?: boolean;
}): TravelerSafetyValidationResult {
  const ageStr = String(primaryAge ?? '').trim();
  const ageNum = ageStr ? parseInt(ageStr, 10) : -1;
  let ageError: string | undefined;
  let medicalInfoError: string | undefined;

  if (ageNum === -1 || !ageStr) {
    if (!isEditMode) {
      ageError = 'Please enter your age for travel safety recommendations.';
    }
  } else if (isNaN(ageNum) || ageNum <= 0 || ageNum > 120) {
    if (!isEditMode) {
      ageError = 'Please enter a valid age between 1 and 120.';
    }
  }

  const needsMedical = ageNum >= 60;
  if (needsMedical) {
    const cleanMedical = (medicalInfo || '').trim();
    if (!cleanMedical) {
      medicalInfoError =
        'Medical information is required for travelers aged 60+. Please enter your medical details or "None".';
    }
  }

  const isValid = !ageError && !medicalInfoError;
  return {
    isValid,
    ageNum,
    needsMedical,
    ageError,
    medicalInfoError,
  };
}

// ── Main Screen ──────────────────────────────────────────────────────────────
export default function PlanTripScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<AppStackParamList, 'PlanTrip'>>();
  const route = useRoute<RouteProp<AppStackParamList, 'PlanTrip'>>();
  const editTripId = route.params?.tripId;
  const isEditMode = Boolean(
    route.params?.isEditing === true ||
    route.params?.mode === 'edit' ||
    Boolean(editTripId && itineraryStore.getItineraryById(editTripId))
  );
  const existingTrip = editTripId ? itineraryStore.getItineraryById(editTripId) : undefined;

  // Core fields
  const [itineraryName, setItineraryName] = useState(
    () => existingTrip?.customName || existingTrip?.title || ''
  );
  const [itineraryNameError, setItineraryNameError] = useState<string | null>(null);

  // Destination autocomplete state
  const [destinationInput, setDestinationInput] = useState(
    () => existingTrip ? (existingTrip.destination || existingTrip.location || '') : ''
  );
  const [selectedDestination, setSelectedDestination] = useState<DestinationSuggestion | null>(
    () => resolveDestinationSuggestionForTrip(existingTrip)
  );
  const [suggestions, setSuggestions] = useState<DestinationSuggestion[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);
  const [destinationError, setDestinationError] = useState<string | null>(null);

  // Travel dates state
  const initialDates = existingTrip
    ? existingTrip.startDate && existingTrip.endDate
      ? { startDate: existingTrip.startDate, endDate: existingTrip.endDate }
      : extractStartAndEndDatesFromRange(existingTrip.dates)
    : { startDate: '', endDate: '' };
  const [startDate, setStartDate] = useState(initialDates.startDate);
  const [endDate, setEndDate] = useState(initialDates.endDate);
  const [dateErrors, setDateErrors] = useState<{
    startDate?: string;
    endDate?: string;
    range?: string;
  }>({});
  const [datePickerModal, setDatePickerModal] = useState<{
    visible: boolean;
    mode: 'start' | 'end';
  }>({ visible: false, mode: 'start' });

  // Traveler type & counts
  const initialTravelerType: TravelerType =
    existingTrip?.travelerType ||
    (existingTrip?.travelersCount === 1
      ? 'solo'
      : existingTrip?.travelersCount === 2
      ? 'couple'
      : 'couple');
  const [travelerType, setTravelerType] = useState<TravelerType>(initialTravelerType);

  const initialAdults = existingTrip?.adults !== undefined
    ? normalizeAdultsForTravelerType(initialTravelerType, existingTrip.adults)
    : existingTrip?.travelersCount !== undefined
    ? normalizeAdultsForTravelerType(initialTravelerType, existingTrip.travelersCount)
    : 2;
  const [adults, setAdults] = useState(initialAdults);
  const [kids, setKids] = useState(existingTrip?.kids !== undefined ? existingTrip.kids : 0);

  // Purpose
  const [purpose, setPurpose] = useState<TravelPurpose>(
    () => existingTrip?.purpose || 'Leisure'
  );

  // Age / Safety
  const [primaryAge, setPrimaryAge] = useState(
    () => (existingTrip?.primaryAge !== undefined && existingTrip.primaryAge > 0 ? String(existingTrip.primaryAge) : '')
  );
  const [medicalInfo, setMedicalInfo] = useState(
    () => existingTrip?.medicalInfo || ''
  );
  const [ageError, setAgeError] = useState<string | null>(null);
  const [medicalInfoError, setMedicalInfoError] = useState<string | null>(null);

  const selectedTypeConfig = TRAVELER_TYPES.find((t) => t.id === travelerType)!;
  const ageNum = primaryAge.trim() ? parseInt(primaryAge.trim(), 10) : -1;
  const effectiveAge = isEditMode && existingTrip?.primaryAge !== undefined && existingTrip.primaryAge > 0
    ? existingTrip.primaryAge
    : ageNum;
  const needsMedical = effectiveAge >= 60;

  // Sync state if editTripId or existingTrip changes
  useEffect(() => {
    if (editTripId) {
      const trip = itineraryStore.getItineraryById(editTripId);
      if (trip) {
        if (!destinationInput) {
          setDestinationInput(trip.destination || trip.location || '');
        }
        if (!selectedDestination) {
          setSelectedDestination(resolveDestinationSuggestionForTrip(trip));
        }
        if (!startDate && !endDate) {
          const d = trip.startDate && trip.endDate
            ? { startDate: trip.startDate, endDate: trip.endDate }
            : extractStartAndEndDatesFromRange(trip.dates);
          setStartDate(d.startDate);
          setEndDate(d.endDate);
        }
        if (trip.primaryAge !== undefined && trip.primaryAge > 0 && !primaryAge) {
          setPrimaryAge(String(trip.primaryAge));
        }
        if (trip.medicalInfo && !medicalInfo) {
          setMedicalInfo(trip.medicalInfo);
        }
      }
    }
  }, [editTripId]);

  // ── Debounced Destination Autocomplete ─────────────────────────────────────
  useEffect(() => {
    const clean = destinationInput.trim();
    if (clean.length < 1) {
      setSuggestions([]);
      setIsLoadingSuggestions(false);
      return;
    }

    if (selectedDestination && clean === selectedDestination.formatted) {
      return;
    }

    setIsLoadingSuggestions(true);
    const timer = setTimeout(async () => {
      try {
        const results = await searchDestinationSuggestions(clean);
        setSuggestions(results);
      } catch {
        setSuggestions([]);
      } finally {
        setIsLoadingSuggestions(false);
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [destinationInput, selectedDestination]);

  const handleDestinationInputChange = (text: string) => {
    setDestinationInput(text);
    setDestinationError(null);

    // Invalidate previous selection if edited
    if (selectedDestination && text !== selectedDestination.formatted) {
      setSelectedDestination(null);
    }

    if (text.trim().length >= 1) {
      setShowDropdown(true);
    } else {
      setShowDropdown(false);
      setSuggestions([]);
    }
  };

  const handleSelectDestination = (item: DestinationSuggestion) => {
    setDestinationInput(item.formatted);
    setSelectedDestination(item);
    setShowDropdown(false);
    setDestinationError(null);
  };

  const handleClearDestination = () => {
    setDestinationInput('');
    setSelectedDestination(null);
    setSuggestions([]);
    setShowDropdown(false);
    setDestinationError(null);
  };

  // ── Date Selection & Calendar Modal Handlers ───────────────────────────────
  const handleOpenDatePicker = (mode: 'start' | 'end') => {
    setShowDropdown(false);
    setDatePickerModal({ visible: true, mode });
  };

  const handleDatePicked = (formattedDate: string) => {
    setDateErrors({});
    if (datePickerModal.mode === 'start') {
      setStartDate(formattedDate);
      if (endDate) {
        const parsedNewStart = parseDateStringToLocalDate(formattedDate);
        const parsedExistingEnd = parseDateStringToLocalDate(endDate);
        if (parsedNewStart && parsedExistingEnd && isBeforeDay(parsedExistingEnd, parsedNewStart)) {
          setEndDate('');
          setDateErrors({
            endDate:
              'End date was cleared because it was earlier than updated start date. Please choose a new end date.',
          });
        }
      }
    } else {
      setEndDate(formattedDate);
    }
    setDatePickerModal({ visible: false, mode: 'start' });
  };

  // ── When traveler type changes, reset counts to sensible defaults ──────────
  const handleSelectTravelerType = (type: TravelerType) => {
    const cfg = TRAVELER_TYPES.find((t) => t.id === type)!;
    setTravelerType(type);
    if (type === 'solo') {
      setAdults(1);
    } else if (type === 'couple') {
      setAdults(normalizeAdultsForTravelerType('couple', adults));
    } else {
      setAdults(cfg.defaultAdults);
    }
    setKids(0);
  };

  const handleAdultDecrement = () => {
    setAdults((prev) => getPrevAdultCount(travelerType, prev));
  };
  const handleAdultIncrement = () => {
    setAdults((prev) => getNextAdultCount(travelerType, prev));
  };
  const handleKidDecrement = () => {
    setKids((prev) => Math.max(prev - 1, 0));
  };
  const handleKidIncrement = () => {
    setKids((prev) => Math.min(prev + 1, 10));
  };

  const handleNext = () => {
    let hasError = false;

    // 1. Itinerary Name validation:
    // Required on initial creation; permanently immutable when editing existing trip.
    if (!isEditMode) {
      const cleanName = itineraryName.trim();
      if (!cleanName) {
        setItineraryNameError('Please enter an itinerary name.');
        Alert.alert('Missing Itinerary Name', 'Please enter a name for your itinerary.');
        hasError = true;
      } else if (cleanName.length > 60) {
        setItineraryNameError('Itinerary name cannot exceed 60 characters.');
        Alert.alert('Name Too Long', 'Itinerary name cannot exceed 60 characters.');
        hasError = true;
      } else {
        setItineraryNameError(null);
      }
    }

    // 2. Destination validation:
    // 2. Destination validation:
    let effectiveDestination: DestinationSuggestion | null = selectedDestination;
    if (isEditMode && existingTrip) {
      if (!effectiveDestination) {
        effectiveDestination = resolveDestinationSuggestionForTrip(existingTrip);
      }
    } else {
      if (!effectiveDestination) {
        const hasInput = Boolean(destinationInput.trim());
        const errorMsg = hasInput
          ? 'Please select a destination from the suggestions dropdown.'
          : 'Please enter where you want to go.';
        setDestinationError(
          hasInput
            ? 'Please select a destination from the suggestions dropdown.'
            : 'Destination is required. Please type and choose a destination.'
        );
        Alert.alert('Missing Destination', errorMsg);
        hasError = true;
      } else {
        setDestinationError(null);
      }
    }

    // 3. Dates validation
    const dateCheck = validateTripDateRange(startDate, endDate, undefined, {
      isEditMode,
      originalStartDate: initialDates.startDate,
    });
    if (!dateCheck.isValid) {
      if (dateCheck.field === 'startDate') {
        setDateErrors({ startDate: dateCheck.errorMessage });
      } else if (dateCheck.field === 'endDate') {
        setDateErrors({ endDate: dateCheck.errorMessage });
      } else {
        setDateErrors({ range: dateCheck.errorMessage });
      }
      hasError = true;
    } else {
      setDateErrors({});
    }

    // 4. Traveler Safety / Age & Medical Info validation
    const safetyCheck = validateTravelerSafety({
      primaryAge: effectiveAge,
      medicalInfo,
      isEditMode,
    });
    if (!safetyCheck.isValid) {
      if (!isEditMode) {
        setAgeError(safetyCheck.ageError || null);
      }
      setMedicalInfoError(safetyCheck.medicalInfoError || null);
      hasError = true;
    } else {
      setAgeError(null);
      setMedicalInfoError(null);
    }

    if (!effectiveDestination || hasError) {
      return;
    }

    const finalAdults = normalizeAdultsForTravelerType(travelerType, adults);
    const finalKids = travelerType === 'family' ? kids : 0;

    const effectiveItineraryName = isEditMode
      ? (existingTrip?.customName || existingTrip?.title || itineraryName).trim()
      : itineraryName.trim();

    navigation.navigate('TripPreferences', {
      tripId: editTripId,
      mode: isEditMode ? 'edit' : 'create',
      isEditing: isEditMode,
      itineraryName: effectiveItineraryName,
      destination: effectiveDestination.formatted,
      destinationMetadata: effectiveDestination,
      startDate: startDate.trim(),
      endDate: endDate.trim(),
      travelerType,
      adults: finalAdults,
      kids: finalKids,
      purpose,
      primaryAge: safetyCheck.ageNum,
      medicalInfo: safetyCheck.needsMedical ? medicalInfo.trim() : undefined,
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

          {/* ── ITINERARY NAME ───────────────────────────────────────── */}
          <View style={styles.sectionCard}>
            <View style={styles.sectionLabelRow}>
              {isEditMode ? (
                <Lock size={15} color={AppColors.primary} />
              ) : (
                <Sparkles size={15} color={AppColors.primary} />
              )}
              <Text style={styles.sectionLabel}>Itinerary Name</Text>
              {isEditMode ? (
                <View style={styles.readOnlyBadge}>
                  <Text style={styles.readOnlyBadgeText}>Read-Only</Text>
                </View>
              ) : (
                <View style={styles.requiredBadge}>
                  <Text style={styles.requiredBadgeText}>Required</Text>
                </View>
              )}
            </View>

            {isEditMode ? (
              <>
                <Text style={styles.fieldSupportingText}>
                  Chosen when this trip was created — it cannot be changed.
                </Text>
                <View style={styles.readOnlyInputBox}>
                  <Text style={styles.readOnlyText} numberOfLines={1}>
                    {existingTrip?.customName || existingTrip?.title || itineraryName || 'My Itinerary'}
                  </Text>
                  <Lock size={15} color={AppColors.textMuted} />
                </View>
              </>
            ) : (
              <>
                <Text style={styles.fieldSupportingText}>
                  Choose a name — it cannot be changed later.
                </Text>
                <View
                  style={[
                    styles.inputRow,
                    itineraryNameError ? styles.inputRowError : null,
                  ]}
                >
                  <TextInput
                    style={styles.textInput}
                    placeholder="e.g. Bangalore Family Trip"
                    placeholderTextColor={AppColors.textMuted}
                    value={itineraryName}
                    onChangeText={(text) => {
                      setItineraryName(text);
                      if (itineraryNameError) {
                        setItineraryNameError(null);
                      }
                    }}
                    maxLength={60}
                    accessibilityLabel="Itinerary Name"
                    testID="plan-trip-name-input"
                  />
                  {itineraryName.length > 0 && (
                    <TouchableOpacity
                      style={styles.inputActionBtn}
                      onPress={() => setItineraryName('')}
                      activeOpacity={0.7}
                      accessibilityLabel="Clear itinerary name"
                    >
                      <X size={16} color={AppColors.textMuted} />
                    </TouchableOpacity>
                  )}
                </View>
                {itineraryNameError ? (
                  <Text style={styles.inlineErrorText}>{itineraryNameError}</Text>
                ) : null}
              </>
            )}
          </View>

          {/* ── DESTINATION ──────────────────────────────────────────── */}
          <View style={[styles.sectionCard, isEditMode ? undefined : { zIndex: 100 }]}>
            <View style={styles.sectionLabelRow}>
              {isEditMode ? (
                <Lock size={15} color={AppColors.textMuted} />
              ) : (
                <MapPin size={15} color={AppColors.primary} />
              )}
              <Text style={styles.sectionLabel}>Destination</Text>
              {isEditMode ? (
                <View style={styles.readOnlyBadge}>
                  <Text style={styles.readOnlyBadgeText}>Read-Only</Text>
                </View>
              ) : (
                <View style={styles.requiredBadge}>
                  <Text style={styles.requiredBadgeText}>Required</Text>
                </View>
              )}
            </View>

            {isEditMode ? (
              <>
                <Text style={styles.fieldSupportingText}>
                  Chosen when this trip was created — it cannot be changed.
                </Text>
                <View style={styles.readOnlyInputBox}>
                  <Text style={styles.readOnlyText} numberOfLines={1}>
                    {existingTrip?.destination || existingTrip?.location || destinationInput || 'Saved Destination'}
                  </Text>
                  <Lock size={15} color={AppColors.textMuted} />
                </View>
              </>
            ) : (
              <View style={{ position: 'relative', zIndex: 100 }}>
                <View style={[styles.inputRow, destinationError ? styles.inputRowError : null]}>
                  <TextInput
                    style={styles.textInput}
                    placeholder="e.g. Bangalore, India"
                    placeholderTextColor={AppColors.textMuted}
                    value={destinationInput}
                    onChangeText={handleDestinationInputChange}
                    onFocus={() => {
                      if (destinationInput.trim().length >= 1) {
                        setShowDropdown(true);
                      }
                    }}
                    autoCorrect={false}
                  />
                  {destinationInput.length > 0 ? (
                    <TouchableOpacity
                      style={styles.inputActionBtn}
                      onPress={handleClearDestination}
                      activeOpacity={0.7}
                      accessibilityLabel="Clear destination"
                      accessibilityRole="button"
                    >
                      <X size={16} color={AppColors.textMuted} />
                    </TouchableOpacity>
                  ) : (
                    <View style={styles.inputActionBtn}>
                      <Crosshair size={18} color={AppColors.textMuted} />
                    </View>
                  )}
                </View>

                {/* Selection Confirmed Badge */}
                {selectedDestination && (
                  <View style={styles.selectionConfirmedRow}>
                    <Check size={12} color="#059669" />
                    <Text style={styles.selectionConfirmedText}>
                      Selected: {selectedDestination.formatted}
                    </Text>
                  </View>
                )}

                {/* Inline Destination Error */}
                {destinationError && (
                  <Text style={styles.inlineErrorText}>{destinationError}</Text>
                )}

                {/* Dropdown Suggestions */}
                {showDropdown && (
                  <View style={styles.dropdownContainer}>
                    {isLoadingSuggestions ? (
                      <View style={styles.dropdownLoadingRow}>
                        <ActivityIndicator size="small" color={AppColors.primary} />
                        <Text style={styles.dropdownLoadingText}>Searching destinations...</Text>
                      </View>
                    ) : suggestions.length === 0 ? (
                      <View style={styles.dropdownEmptyRow}>
                        <Text style={styles.dropdownEmptyText}>
                          No destinations found for "{destinationInput}"
                        </Text>
                      </View>
                    ) : (
                      <ScrollView
                        style={styles.dropdownScroll}
                        keyboardShouldPersistTaps="always"
                        nestedScrollEnabled={true}
                      >
                        {suggestions.map((item) => (
                          <TouchableOpacity
                            key={item.id}
                            style={styles.dropdownItem}
                            onPress={() => handleSelectDestination(item)}
                            activeOpacity={0.7}
                            accessibilityLabel={item.formatted}
                            accessibilityRole="button"
                          >
                            <View style={styles.dropdownItemIconWrap}>
                              <MapPin size={14} color={AppColors.primary} />
                            </View>
                            <View style={styles.dropdownItemTextWrap}>
                              <Text style={styles.dropdownItemTitle}>{item.city}</Text>
                              <Text style={styles.dropdownItemSubtitle} numberOfLines={1}>
                                {item.state ? `${item.state}, ` : ''}{item.country}
                              </Text>
                            </View>
                          </TouchableOpacity>
                        ))}
                      </ScrollView>
                    )}
                  </View>
                )}
              </View>
            )}
          </View>

          {/* ── TRAVEL DATES ─────────────────────────────────────────── */}
          <View style={styles.sectionCard}>
            <View style={styles.sectionLabelRow}>
              <Calendar size={15} color={AppColors.primary} />
              <Text style={styles.sectionLabel}>Travel Dates</Text>
              <View style={styles.requiredBadge}>
                <Text style={styles.requiredBadgeText}>Required</Text>
              </View>
            </View>
            <View style={styles.datesRow}>
              <TouchableOpacity
                style={[styles.dateButton, dateErrors.startDate ? styles.inputRowError : null]}
                onPress={() => handleOpenDatePicker('start')}
                activeOpacity={0.8}
                accessibilityLabel="Select start date"
                accessibilityRole="button"
              >
                <View style={styles.dateButtonTextCol}>
                  <Text style={styles.dateButtonLabel}>Start date</Text>
                  <Text
                    style={[
                      styles.dateButtonValue,
                      !startDate && styles.dateButtonPlaceholder,
                    ]}
                  >
                    {startDate ? startDate : 'Select date'}
                  </Text>
                </View>
                <Calendar size={16} color={startDate ? AppColors.primary : AppColors.textMuted} />
              </TouchableOpacity>

              <Text style={styles.datesSeparator}>→</Text>

              <TouchableOpacity
                style={[
                  styles.dateButton,
                  dateErrors.endDate || dateErrors.range ? styles.inputRowError : null,
                ]}
                onPress={() => handleOpenDatePicker('end')}
                activeOpacity={0.8}
                accessibilityLabel="Select end date"
                accessibilityRole="button"
              >
                <View style={styles.dateButtonTextCol}>
                  <Text style={styles.dateButtonLabel}>End date</Text>
                  <Text
                    style={[
                      styles.dateButtonValue,
                      !endDate && styles.dateButtonPlaceholder,
                    ]}
                  >
                    {endDate ? endDate : 'Select date'}
                  </Text>
                </View>
                <Calendar size={16} color={endDate ? AppColors.primary : AppColors.textMuted} />
              </TouchableOpacity>
            </View>

            {/* Display formatted range if both selected */}
            {startDate && endDate && (
              <View style={styles.dateRangeBadge}>
                <Sparkles size={13} color={AppColors.primary} />
                <Text style={styles.dateRangeBadgeText}>
                  {formatDateRange(startDate, endDate)}
                </Text>
              </View>
            )}

            {/* Inline Date Errors */}
            {(dateErrors.startDate || dateErrors.endDate || dateErrors.range) && (
              <Text style={styles.inlineErrorText}>
                {dateErrors.startDate || dateErrors.endDate || dateErrors.range}
              </Text>
            )}
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
              decrementDisabled={isAdultDecrementDisabled(travelerType, adults)}
              incrementDisabled={isAdultIncrementDisabled(travelerType, adults)}
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
              {isEditMode ? (
                <Lock size={15} color={AppColors.primary} />
              ) : (
                <ShieldCheck size={15} color={AppColors.primary} />
              )}
              <Text style={styles.sectionLabel}>Traveler Safety</Text>
              {isEditMode ? (
                <View style={styles.readOnlyBadge}>
                  <Text style={styles.readOnlyBadgeText}>Read-Only</Text>
                </View>
              ) : (
                <View style={styles.requiredBadge}>
                  <Text style={styles.requiredBadgeText}>Required</Text>
                </View>
              )}
            </View>
            {isEditMode ? (
              <>
                <Text style={styles.fieldSupportingText}>
                  Age entered when this trip was created — cannot be changed.
                </Text>
                <View style={styles.readOnlyInputBox}>
                  <User size={16} color={AppColors.textMuted} style={{ marginRight: 8 }} />
                  <Text style={styles.readOnlyText}>
                    {effectiveAge > 0
                      ? `${effectiveAge} years old`
                      : primaryAge
                      ? `${primaryAge} years old`
                      : 'Age recorded'}
                  </Text>
                  <Lock size={15} color={AppColors.textMuted} />
                </View>
              </>
            ) : (
              <>
                <Text style={styles.safetyHint}>
                  Your age helps us personalise recommendations and assess travel capability.
                </Text>
                <View style={[styles.inputRow, ageError ? styles.inputRowError : null]}>
                  <User size={16} color={AppColors.textMuted} style={{ marginRight: 8 }} />
                  <TextInput
                    style={[styles.textInput]}
                    placeholder="Your age (e.g. 28)"
                    placeholderTextColor={AppColors.textMuted}
                    value={primaryAge}
                    onChangeText={(t) => {
                      const clean = t.replace(/[^0-9]/g, '');
                      setPrimaryAge(clean);
                      if (ageError) {
                        setAgeError(null);
                      }
                      const nextAgeNum = clean ? parseInt(clean, 10) : -1;
                      if (nextAgeNum < 60 && medicalInfoError) {
                        setMedicalInfoError(null);
                      }
                    }}
                    keyboardType="numeric"
                    maxLength={3}
                    accessibilityLabel="Your age"
                    testID="plan-trip-age-input"
                  />
                </View>
                {ageError ? (
                  <Text style={styles.inlineErrorText} testID="plan-trip-age-error">
                    {ageError}
                  </Text>
                ) : null}
              </>
            )}

            {needsMedical && (
              <>
                <View style={styles.medicalSubheaderRow}>
                  <Text style={styles.medicalSubheaderLabel}>Medical History</Text>
                  <View style={styles.requiredBadge} testID="plan-trip-medical-required-badge">
                    <Text style={styles.requiredBadgeText}>Required</Text>
                  </View>
                </View>
                <View style={styles.medicalAlertBanner}>
                  <Text style={styles.medicalAlertText}>
                    ⚕️  For travelers aged 60+, please share any relevant medical information.
                    This helps us suggest appropriate activities and safety precautions.
                  </Text>
                </View>
                <Text style={styles.safetyHint}>
                  Please list any medical conditions, mobility assistance needs, or dietary requirements (or enter &quot;None&quot;).
                </Text>
                <View
                  style={[
                    styles.inputRow,
                    styles.inputRowMultiline,
                    medicalInfoError ? styles.inputRowError : null,
                  ]}
                >
                  <TextInput
                    style={[styles.textInput, styles.multilineInput]}
                    placeholder="Medical conditions, mobility needs, dietary requirements…"
                    placeholderTextColor={AppColors.textMuted}
                    value={medicalInfo}
                    onChangeText={(t) => {
                      setMedicalInfo(t);
                      if (medicalInfoError && t.trim().length > 0) {
                        setMedicalInfoError(null);
                      }
                    }}
                    multiline
                    numberOfLines={3}
                    accessibilityLabel="Medical History"
                    testID="plan-trip-medical-input"
                  />
                </View>
                {medicalInfoError ? (
                  <Text style={styles.inlineErrorText} testID="plan-trip-medical-error">
                    {medicalInfoError}
                  </Text>
                ) : null}
              </>
            )}
          </View>

          <View style={styles.bottomSpacer} />

          {/* ── CTA ──────────────────────────────────────────────────── */}
          <TouchableOpacity
            style={styles.primaryCtaBtn}
            onPress={handleNext}
            activeOpacity={0.88}
            accessibilityLabel="Next: Travel Style"
            testID="plan-trip-next-button"
          >
            <Text style={styles.primaryCtaText}>Next: Travel Style</Text>
            <ArrowRight size={18} color={AppColors.white} />
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* ── CALENDAR DATE PICKER MODAL ─────────────────────────────── */}
      <TripDatePickerModal
        visible={datePickerModal.visible}
        mode={datePickerModal.mode}
        currentValue={datePickerModal.mode === 'start' ? startDate : endDate}
        referenceStartDate={datePickerModal.mode === 'end' ? startDate : undefined}
        onSelectDate={handleDatePicked}
        onClose={() => setDatePickerModal((prev) => ({ ...prev, visible: false }))}
      />
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
  readOnlyBadge: {
    marginLeft: 4,
    backgroundColor: '#E2E8F0',
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 8,
  },
  readOnlyBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#475569',
  },
  readOnlyInputBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F8FAFC',
    borderRadius: 14,
    paddingHorizontal: 14,
    height: 46,
    borderWidth: 1,
    borderColor: '#CBD5E1',
  },
  readOnlyText: {
    flex: 1,
    fontSize: 14,
    fontWeight: '700',
    color: AppColors.textPrimary,
    paddingRight: 8,
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
  inputRowError: {
    borderColor: '#EF4444',
    backgroundColor: '#FEF2F2',
  },
  inlineErrorText: {
    fontSize: 11,
    color: '#DC2626',
    fontWeight: '700',
    marginTop: 6,
    marginLeft: 2,
  },
  selectionConfirmedRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 8,
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#A7F3D0',
  },
  selectionConfirmedText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#065F46',
  },

  /* Autocomplete Dropdown */
  dropdownContainer: {
    position: 'absolute',
    top: 50,
    left: 0,
    right: 0,
    backgroundColor: AppColors.surface,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#EAE5DC',
    maxHeight: 220,
    zIndex: 9999,
    elevation: 8,
    shadowColor: AppColors.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 10,
    overflow: 'hidden',
  },
  dropdownScroll: {
    maxHeight: 218,
  },
  dropdownItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F3EFE8',
    gap: 10,
  },
  dropdownItemIconWrap: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#E0F2FE',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dropdownItemTextWrap: {
    flex: 1,
  },
  dropdownItemTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: AppColors.textPrimary,
  },
  dropdownItemSubtitle: {
    fontSize: 11,
    color: AppColors.textMuted,
    marginTop: 1,
  },
  dropdownLoadingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 16,
  },
  dropdownLoadingText: {
    fontSize: 12,
    color: AppColors.textMuted,
    fontWeight: '600',
  },
  dropdownEmptyRow: {
    paddingVertical: 16,
    alignItems: 'center',
    paddingHorizontal: 12,
  },
  dropdownEmptyText: {
    fontSize: 12,
    color: AppColors.textMuted,
    fontStyle: 'italic',
    textAlign: 'center',
  },

  /* Dates row & buttons */
  datesRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  dateButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FAF7F2',
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 8,
    height: 48,
    borderWidth: 1,
    borderColor: '#EAE5DC',
  },
  dateButtonTextCol: {
    flex: 1,
  },
  dateButtonLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: AppColors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  dateButtonValue: {
    fontSize: 13,
    fontWeight: '700',
    color: AppColors.textPrimary,
    marginTop: 1,
  },
  dateButtonPlaceholder: {
    color: AppColors.textMuted,
    fontWeight: '600',
  },
  dateRangeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 10,
    backgroundColor: '#E0F2FE',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
    alignSelf: 'flex-start',
  },
  dateRangeBadgeText: {
    fontSize: 11,
    fontWeight: '800',
    color: AppColors.primary,
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
  medicalSubheaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 14,
    marginBottom: 6,
  },
  medicalSubheaderLabel: {
    fontSize: 13,
    fontWeight: '800',
    color: AppColors.textPrimary,
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