import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Image,
  Modal,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import {
  Camera,
  Lock,
  CheckCircle2,
  MapPin,
  Calendar,
  RefreshCw,
  X,
  ChevronDown,
  Sparkles,
  AlertCircle,
  ShieldCheck,
} from 'lucide-react-native';
import { BackButton } from '../../../core/components/BackButton';
import { AppColors } from '../../../core/theme/colors';
import { useAuth } from '../../../core/auth/AuthContext';
import {
  profileService,
  validatePhoneNumber,
  validateDateOfBirth,
  DEFAULT_PROFILE,
} from '../services/profileService';

const COUNTRY_CODES = [
  { code: '+91', country: 'India', flag: '🇮🇳' },
  { code: '+1', country: 'USA', flag: '🇺🇸' },
  { code: '+44', country: 'UK', flag: '🇬🇧' },
  { code: '+971', country: 'UAE', flag: '🇦🇪' },
  { code: '+61', country: 'Australia', flag: '🇦🇺' },
  { code: '+65', country: 'Singapore', flag: '🇸🇬' },
];

const CURATED_AVATARS = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&q=80',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&q=80',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&q=80',
];

const MONTHS = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
];

export default function ProfileSettingsScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { user } = useAuth();

  // Read-only fields
  const [name, setName] = useState<string>(DEFAULT_PROFILE.name);
  const [email, setEmail] = useState<string>(DEFAULT_PROFILE.email);
  const [city, setCity] = useState<string>(DEFAULT_PROFILE.city);
  const [isGpsLoading, setIsGpsLoading] = useState<boolean>(false);
  const [gpsError, setGpsError] = useState<string | null>(null);

  // KYC status
  const routeKyc = route.params?.kycVerified;
  const isKycVerified: boolean =
    routeKyc !== undefined
      ? Boolean(routeKyc)
      : (user?.isVerified ?? DEFAULT_PROFILE.isKycVerified);

  // Editable fields
  const [phone, setPhone] = useState<string>(DEFAULT_PROFILE.phone);
  const [phoneError, setPhoneError] = useState<string | null>(null);
  const [countryCode, setCountryCode] = useState<string>('+91');
  const [showCountryModal, setShowCountryModal] = useState<boolean>(false);

  const [dob, setDob] = useState<string>(DEFAULT_PROFILE.dob);
  const [dobError, setDobError] = useState<string | null>(null);
  const [showDobModal, setShowDobModal] = useState<boolean>(false);

  // Temporary DOB state in modal
  const [tempYear, setTempYear] = useState<number>(1995);
  const [tempMonth, setTempMonth] = useState<number>(7); // Aug
  const [tempDay, setTempDay] = useState<number>(15);

  const [avatarUrl, setAvatarUrl] = useState<string | undefined>(undefined);
  const [showPhotoModal, setShowPhotoModal] = useState<boolean>(false);

  // Save state
  const [isSaving, setIsSaving] = useState<boolean>(false);

  // Load existing profile details
  useEffect(() => {
    let isMounted = true;
    (async () => {
      const profile = await profileService.loadProfile(user);
      if (isMounted) {
        setName(profile.name);
        setEmail(profile.email);
        setPhone(profile.phone);
        setDob(profile.dob);
        setCity(profile.city);
        setAvatarUrl(profile.avatarUrl);
      }
    })();
    return () => {
      isMounted = false;
    };
  }, [user]);

  // Handle GPS detection
  const handleDetectLocation = async () => {
    setIsGpsLoading(true);
    setGpsError(null);
    try {
      const res = await profileService.detectGpsCity();
      if (res.status === 'available' && res.formatted) {
        setCity(res.formatted);
      } else {
        setGpsError(res.errorMessage || 'Location unavailable');
        setCity('Location unavailable');
      }
    } catch {
      setGpsError('Could not retrieve GPS coordinates');
      setCity('Location unavailable');
    } finally {
      setIsGpsLoading(false);
    }
  };

  // Helper to get initials
  const getInitials = (fullName: string) => {
    const parts = fullName.trim().split(/\s+/);
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
    }
    return (parts[0]?.[0] || 'U').toUpperCase();
  };

  // Save changes handler
  const handleSaveChanges = async () => {
    if (isSaving) return;

    // Validate phone number
    const phoneValidation = validatePhoneNumber(phone, countryCode);
    if (!phoneValidation.isValid) {
      setPhoneError(phoneValidation.error || 'Invalid phone number');
      Alert.alert('Invalid Phone Number', phoneValidation.error || 'Please enter a valid phone number.');
      return;
    }
    setPhoneError(null);

    // Validate DOB if KYC is unverified
    if (!isKycVerified) {
      const dobValidation = validateDateOfBirth(dob);
      if (!dobValidation.isValid) {
        setDobError(dobValidation.error || 'Invalid date of birth');
        Alert.alert('Invalid Date of Birth', dobValidation.error || 'Please check your date of birth.');
        return;
      }
      setDobError(null);
    }

    setIsSaving(true);
    try {
      const result = await profileService.saveProfile(
        {
          phone: `${countryCode} ${phone.trim()}`,
          dob: !isKycVerified ? dob : undefined,
          avatarUrl,
        },
        user
      );

      setIsSaving(false);
      if (result.success) {
        Alert.alert(
          'Profile Updated 🎉',
          'Your profile changes have been saved successfully.',
          [
            {
              text: 'OK',
              onPress: () => {
                navigation.goBack();
              },
            },
          ]
        );
      } else {
        Alert.alert('Update Failed', result.error || 'Unable to update profile.');
      }
    } catch (err: any) {
      setIsSaving(false);
      Alert.alert('Update Failed', err?.message || 'Unable to update profile. Please try again.');
    }
  };

  // Confirm DOB from modal
  const handleConfirmDob = () => {
    const formatted = `${tempDay < 10 ? '0' : ''}${tempDay} ${MONTHS[tempMonth]} ${tempYear}`;
    const validation = validateDateOfBirth(formatted);
    if (!validation.isValid) {
      Alert.alert('Age Requirement', validation.error || 'You must be at least 18 years old.');
      return;
    }
    setDob(formatted);
    setDobError(null);
    setShowDobModal(false);
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom', 'left', 'right']}>
      {/* ── HEADER ──────────────────────────────────────────────── */}
      <View style={styles.header}>
        <BackButton onPress={() => navigation.goBack()} />
        <Text style={styles.headerTitle}>Edit Profile</Text>
        <View style={styles.headerPlaceholder} />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* ── 1. PROFILE PICTURE (EDITABLE) ───────────────────────── */}
        <View style={styles.avatarSection}>
          <TouchableOpacity
            style={styles.avatarWrap}
            onPress={() => setShowPhotoModal(true)}
            activeOpacity={0.8}
            testID="profile-picture-button"
          >
            {avatarUrl ? (
              <Image source={{ uri: avatarUrl }} style={styles.avatarImage} />
            ) : (
              <View style={styles.avatarPlaceholder}>
                <Text style={styles.avatarInitials}>{getInitials(name)}</Text>
              </View>
            )}
            <View style={styles.cameraBadge}>
              <Camera size={14} color={AppColors.white} />
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setShowPhotoModal(true)}
            activeOpacity={0.7}
            style={styles.changePhotoBtn}
          >
            <Text style={styles.changePhotoText}>Change Profile Photo</Text>
          </TouchableOpacity>
        </View>

        {/* ── 2. FULL NAME (READ-ONLY / KYC SOURCED) ──────────────── */}
        <View style={styles.fieldGroup}>
          <View style={styles.labelRow}>
            <Text style={styles.fieldLabel}>Full Name</Text>
            {isKycVerified ? (
              <View style={styles.verifiedChip} testID="kyc-verified-badge">
                <CheckCircle2 size={12} color={AppColors.successDark} />
                <Text style={styles.verifiedChipText}>KYC Verified</Text>
              </View>
            ) : (
              <View style={styles.pendingChip}>
                <Text style={styles.pendingChipText}>KYC Pending</Text>
              </View>
            )}
          </View>
          <View style={[styles.inputWrapper, styles.readOnlyInput]} testID="full-name-field">
            <Text style={styles.readOnlyText} numberOfLines={1}>
              {name}
            </Text>
            <Lock size={16} color={AppColors.textMuted} />
          </View>
          <Text style={styles.fieldHelpText}>
            {isKycVerified
              ? 'Sourced from your verified KYC government records • Read-only'
              : 'Complete KYC verification to update your official name'}
          </Text>
        </View>

        {/* ── 3. EMAIL (READ-ONLY) ────────────────────────────────── */}
        <View style={styles.fieldGroup}>
          <View style={styles.labelRow}>
            <Text style={styles.fieldLabel}>Email Address</Text>
          </View>
          <View style={[styles.inputWrapper, styles.readOnlyInput]} testID="email-field">
            <Text style={styles.readOnlyText} numberOfLines={1}>
              {email}
            </Text>
            <Lock size={16} color={AppColors.textMuted} />
          </View>
          <Text style={styles.fieldHelpText}>
            Associated with your primary Tourbhook account • Read-only
          </Text>
        </View>

        {/* ── 4. PHONE NUMBER (EDITABLE) ──────────────────────────── */}
        <View style={styles.fieldGroup}>
          <View style={styles.labelRow}>
            <Text style={styles.fieldLabel}>Phone Number</Text>
          </View>
          <View style={[styles.phoneRow, phoneError && styles.inputErrorBorder]}>
            {/* Country code selector */}
            <TouchableOpacity
              style={styles.countryPickerBtn}
              onPress={() => setShowCountryModal(true)}
              activeOpacity={0.7}
              testID="country-code-button"
            >
              <Text style={styles.countryCodeText}>{countryCode}</Text>
              <ChevronDown size={14} color={AppColors.textMuted} />
            </TouchableOpacity>

            <View style={styles.phoneDivider} />

            <TextInput
              style={styles.phoneInput}
              value={phone}
              onChangeText={(val) => {
                setPhone(val);
                if (phoneError) setPhoneError(null);
              }}
              placeholder="Enter mobile number"
              placeholderTextColor={AppColors.textLight}
              keyboardType="phone-pad"
              testID="phone-input"
            />
          </View>
          {phoneError ? (
            <View style={styles.errorRow}>
              <AlertCircle size={12} color={AppColors.error} />
              <Text style={styles.errorText}>{phoneError}</Text>
            </View>
          ) : (
            <Text style={styles.fieldHelpText}>Used for trip updates and booking alerts</Text>
          )}
        </View>

        {/* ── 5. DATE OF BIRTH (KYC-AWARE) ────────────────────────── */}
        <View style={styles.fieldGroup}>
          <View style={styles.labelRow}>
            <Text style={styles.fieldLabel}>Date of Birth</Text>
            {isKycVerified && (
              <View style={styles.verifiedChip}>
                <CheckCircle2 size={12} color={AppColors.successDark} />
                <Text style={styles.verifiedChipText}>KYC Verified</Text>
              </View>
            )}
          </View>

          {isKycVerified ? (
            // Read-only when KYC is verified
            <View style={[styles.inputWrapper, styles.readOnlyInput]} testID="dob-readonly-field">
              <Text style={styles.readOnlyText}>{dob}</Text>
              <Lock size={16} color={AppColors.textMuted} />
            </View>
          ) : (
            // Editable via date picker when unverified
            <TouchableOpacity
              style={[styles.inputWrapper, styles.editablePicker]}
              onPress={() => setShowDobModal(true)}
              activeOpacity={0.7}
              testID="dob-picker-button"
            >
              <Text style={styles.editablePickerText}>{dob || 'Select Date of Birth'}</Text>
              <Calendar size={18} color={AppColors.primary} />
            </TouchableOpacity>
          )}

          {dobError ? (
            <View style={styles.errorRow}>
              <AlertCircle size={12} color={AppColors.error} />
              <Text style={styles.errorText}>{dobError}</Text>
            </View>
          ) : (
            <Text style={styles.fieldHelpText}>
              {isKycVerified
                ? 'Verified from identity document • Read-only'
                : 'Tap to select your date of birth (Must be 18+ years)'}
            </Text>
          )}
        </View>

        {/* ── 6. CURRENT CITY (GPS-BASED / READ-ONLY) ─────────────── */}
        <View style={styles.fieldGroup}>
          <View style={styles.labelRow}>
            <Text style={styles.fieldLabel}>Current City</Text>
            <View style={styles.gpsChip}>
              <Text style={styles.gpsChipText}>GPS Auto-detected</Text>
            </View>
          </View>

          <View style={[styles.inputWrapper, styles.readOnlyInput]} testID="current-city-field">
            <View style={styles.cityTextRow}>
              <MapPin size={16} color={AppColors.primary} style={styles.mapIcon} />
              <Text
                style={[
                  styles.readOnlyText,
                  city === 'Location unavailable' && styles.textUnavailable,
                ]}
                numberOfLines={1}
              >
                {city}
              </Text>
            </View>

            <TouchableOpacity
              onPress={handleDetectLocation}
              disabled={isGpsLoading}
              activeOpacity={0.7}
              style={styles.gpsRefreshBtn}
              testID="detect-location-button"
            >
              {isGpsLoading ? (
                <ActivityIndicator size="small" color={AppColors.primary} />
              ) : (
                <RefreshCw size={15} color={AppColors.primary} />
              )}
            </TouchableOpacity>
          </View>

          <Text style={styles.fieldHelpText}>
            {gpsError
              ? `GPS status: ${gpsError}. You can refresh location anytime.`
              : 'Auto-detected through device location services • Read-only'}
          </Text>
        </View>

        <View style={styles.gap24} />

        {/* ── 7. SAVE CHANGES BUTTON ──────────────────────────────── */}
        <TouchableOpacity
          style={[styles.saveButton, isSaving && styles.saveButtonDisabled]}
          onPress={handleSaveChanges}
          activeOpacity={0.8}
          disabled={isSaving}
          testID="save-changes-button"
        >
          {isSaving ? (
            <View style={styles.savingWrap}>
              <ActivityIndicator color={AppColors.white} size="small" />
              <Text style={styles.saveButtonText}>Saving Changes...</Text>
            </View>
          ) : (
            <Text style={styles.saveButtonText}>Save Changes</Text>
          )}
        </TouchableOpacity>
      </ScrollView>

      {/* ── PHOTO PICKER MODAL ────────────────────────────────────── */}
      <Modal
        visible={showPhotoModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowPhotoModal(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowPhotoModal(false)}
        >
          <View style={styles.photoModalContent} onStartShouldSetResponder={() => true}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Update Profile Photo</Text>
              <TouchableOpacity onPress={() => setShowPhotoModal(false)}>
                <X size={20} color={AppColors.textMuted} />
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={styles.photoOption}
              onPress={() => {
                setAvatarUrl(CURATED_AVATARS[0]);
                setShowPhotoModal(false);
              }}
              testID="photo-option-camera"
            >
              <View style={styles.photoOptionIcon}>
                <Camera size={18} color={AppColors.primary} />
              </View>
              <View>
                <Text style={styles.photoOptionTitle}>Take Photo</Text>
                <Text style={styles.photoOptionSub}>Capture with your device camera</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.photoOption}
              onPress={() => {
                setAvatarUrl(CURATED_AVATARS[1]);
                setShowPhotoModal(false);
              }}
              testID="photo-option-gallery"
            >
              <View style={styles.photoOptionIcon}>
                <Sparkles size={18} color={AppColors.primary} />
              </View>
              <View>
                <Text style={styles.photoOptionTitle}>Choose from Gallery</Text>
                <Text style={styles.photoOptionSub}>Select an image from device library</Text>
              </View>
            </TouchableOpacity>

            {avatarUrl && (
              <TouchableOpacity
                style={styles.photoOption}
                onPress={() => {
                  setAvatarUrl(undefined);
                  setShowPhotoModal(false);
                }}
                testID="photo-option-remove"
              >
                <View style={[styles.photoOptionIcon, { backgroundColor: '#FEE2E2' }]}>
                  <X size={18} color={AppColors.error} />
                </View>
                <View>
                  <Text style={[styles.photoOptionTitle, { color: AppColors.error }]}>
                    Remove Current Photo
                  </Text>
                  <Text style={styles.photoOptionSub}>Revert to name initials avatar</Text>
                </View>
              </TouchableOpacity>
            )}
          </View>
        </TouchableOpacity>
      </Modal>

      {/* ── COUNTRY CODE PICKER MODAL ─────────────────────────────── */}
      <Modal
        visible={showCountryModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowCountryModal(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowCountryModal(false)}
        >
          <View style={styles.pickerModalContent} onStartShouldSetResponder={() => true}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Country Code</Text>
              <TouchableOpacity onPress={() => setShowCountryModal(false)}>
                <X size={20} color={AppColors.textMuted} />
              </TouchableOpacity>
            </View>
            {COUNTRY_CODES.map((item) => (
              <TouchableOpacity
                key={item.code}
                style={styles.countryRow}
                onPress={() => {
                  setCountryCode(item.code);
                  setShowCountryModal(false);
                }}
              >
                <Text style={styles.countryFlag}>{item.flag}</Text>
                <Text style={styles.countryName}>{item.country}</Text>
                <Text style={styles.countryCodeBadge}>{item.code}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>

      {/* ── DOB PICKER MODAL (FOR UNVERIFIED KYC) ──────────────────── */}
      <Modal
        visible={showDobModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowDobModal(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowDobModal(false)}
        >
          <View style={styles.dobModalContent} onStartShouldSetResponder={() => true}>
            <View style={styles.modalHeader}>
              <View>
                <Text style={styles.modalTitle}>Select Date of Birth</Text>
                <Text style={styles.modalSubtitle}>Must be at least 18 years old</Text>
              </View>
              <TouchableOpacity onPress={() => setShowDobModal(false)}>
                <X size={20} color={AppColors.textMuted} />
              </TouchableOpacity>
            </View>

            {/* Quick Year / Month / Day Selection Rows */}
            <View style={styles.pickerControlsRow}>
              {/* Day */}
              <View style={styles.pickerCol}>
                <Text style={styles.pickerColLabel}>Day</Text>
                <View style={styles.stepperWrap}>
                  <TouchableOpacity
                    style={styles.stepperBtn}
                    onPress={() => setTempDay((d) => Math.max(1, d - 1))}
                  >
                    <Text style={styles.stepperBtnText}>−</Text>
                  </TouchableOpacity>
                  <Text style={styles.stepperValue}>{tempDay}</Text>
                  <TouchableOpacity
                    style={styles.stepperBtn}
                    onPress={() => setTempDay((d) => Math.min(31, d + 1))}
                  >
                    <Text style={styles.stepperBtnText}>+</Text>
                  </TouchableOpacity>
                </View>
              </View>

              {/* Month */}
              <View style={styles.pickerCol}>
                <Text style={styles.pickerColLabel}>Month</Text>
                <View style={styles.stepperWrap}>
                  <TouchableOpacity
                    style={styles.stepperBtn}
                    onPress={() => setTempMonth((m) => Math.max(0, m - 1))}
                  >
                    <Text style={styles.stepperBtnText}>−</Text>
                  </TouchableOpacity>
                  <Text style={styles.stepperValue}>{MONTHS[tempMonth]}</Text>
                  <TouchableOpacity
                    style={styles.stepperBtn}
                    onPress={() => setTempMonth((m) => Math.min(11, m + 1))}
                  >
                    <Text style={styles.stepperBtnText}>+</Text>
                  </TouchableOpacity>
                </View>
              </View>

              {/* Year */}
              <View style={styles.pickerCol}>
                <Text style={styles.pickerColLabel}>Year</Text>
                <View style={styles.stepperWrap}>
                  <TouchableOpacity
                    style={styles.stepperBtn}
                    onPress={() => setTempYear((y) => Math.max(1940, y - 1))}
                  >
                    <Text style={styles.stepperBtnText}>−</Text>
                  </TouchableOpacity>
                  <Text style={styles.stepperValue}>{tempYear}</Text>
                  <TouchableOpacity
                    style={styles.stepperBtn}
                    onPress={() =>
                      setTempYear((y) => Math.min(new Date().getFullYear() - 18, y + 1))
                    }
                  >
                    <Text style={styles.stepperBtnText}>+</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>

            <TouchableOpacity
              style={styles.confirmDobBtn}
              onPress={handleConfirmDob}
              activeOpacity={0.8}
              testID="confirm-dob-button"
            >
              <Text style={styles.confirmDobBtnText}>Confirm Date of Birth</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: AppColors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: AppColors.surface,
    borderBottomWidth: 1,
    borderBottomColor: AppColors.borderLight,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: AppColors.textPrimary,
  },
  headerPlaceholder: {
    width: 44,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },

  // Avatar section
  avatarSection: {
    alignItems: 'center',
    marginBottom: 24,
  },
  avatarWrap: {
    position: 'relative',
    width: 96,
    height: 96,
    borderRadius: 48,
    borderWidth: 2,
    borderColor: AppColors.border,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: AppColors.surface,
    shadowColor: AppColors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  avatarImage: {
    width: 92,
    height: 92,
    borderRadius: 46,
  },
  avatarPlaceholder: {
    width: 92,
    height: 92,
    borderRadius: 46,
    backgroundColor: AppColors.surfaceHighlight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarInitials: {
    fontSize: 32,
    fontWeight: '800',
    color: AppColors.primary,
  },
  cameraBadge: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: AppColors.primary,
    borderWidth: 2,
    borderColor: AppColors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: AppColors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 3,
  },
  changePhotoBtn: {
    marginTop: 10,
    paddingVertical: 4,
    paddingHorizontal: 12,
  },
  changePhotoText: {
    fontSize: 13,
    fontWeight: '700',
    color: AppColors.primary,
  },

  // Fields
  fieldGroup: {
    marginBottom: 20,
  },
  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  fieldLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: AppColors.textPrimary,
  },
  fieldHelpText: {
    fontSize: 11.5,
    color: AppColors.textMuted,
    marginTop: 6,
    lineHeight: 16,
  },

  // Chips
  verifiedChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#A7F3D0',
  },
  verifiedChipText: {
    fontSize: 11,
    fontWeight: '700',
    color: AppColors.successDark,
  },
  pendingChip: {
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
  },
  pendingChipText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#D97706',
  },
  gpsChip: {
    backgroundColor: AppColors.surfaceHighlight,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
  },
  gpsChipText: {
    fontSize: 11,
    fontWeight: '700',
    color: AppColors.primary,
  },

  // Input styling
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: AppColors.surface,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: AppColors.border,
    paddingHorizontal: 16,
    height: 52,
  },
  readOnlyInput: {
    backgroundColor: '#F3EFE8', // Distinct soft warm sand read-only shade
    borderColor: AppColors.border,
  },
  readOnlyText: {
    flex: 1,
    fontSize: 14.5,
    fontWeight: '600',
    color: AppColors.textPrimary,
    marginRight: 10,
  },
  textUnavailable: {
    color: AppColors.textMuted,
    fontStyle: 'italic',
  },
  cityTextRow: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  mapIcon: {
    marginRight: 8,
  },
  gpsRefreshBtn: {
    padding: 6,
    borderRadius: 8,
    backgroundColor: AppColors.surfaceHighlight,
  },

  // Editable picker
  editablePicker: {
    backgroundColor: AppColors.surface,
    borderColor: AppColors.border,
  },
  editablePickerText: {
    fontSize: 14.5,
    fontWeight: '600',
    color: AppColors.textPrimary,
  },

  // Phone row
  phoneRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: AppColors.surface,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: AppColors.border,
    height: 52,
    overflow: 'hidden',
  },
  inputErrorBorder: {
    borderColor: AppColors.error,
  },
  countryPickerBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 12,
    height: '100%',
    backgroundColor: AppColors.surfaceSubtle,
  },
  countryCodeText: {
    fontSize: 14,
    fontWeight: '700',
    color: AppColors.textPrimary,
  },
  phoneDivider: {
    width: 1,
    height: 24,
    backgroundColor: AppColors.border,
  },
  phoneInput: {
    flex: 1,
    fontSize: 14.5,
    fontWeight: '600',
    color: AppColors.textPrimary,
    paddingHorizontal: 12,
    height: '100%',
  },
  errorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginTop: 6,
  },
  errorText: {
    fontSize: 11.5,
    color: AppColors.error,
    fontWeight: '600',
  },

  // Save button
  gap24: {
    height: 24,
  },
  saveButton: {
    backgroundColor: AppColors.primary,
    borderRadius: 14,
    height: 52,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: AppColors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 3,
  },
  saveButtonDisabled: {
    opacity: 0.65,
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: AppColors.white,
  },
  savingWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },

  // Modal shared
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(16, 36, 63, 0.5)',
    justifyContent: 'flex-end',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: AppColors.textPrimary,
  },
  modalSubtitle: {
    fontSize: 12,
    color: AppColors.textMuted,
    marginTop: 2,
  },

  // Photo modal
  photoModalContent: {
    backgroundColor: AppColors.surface,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    paddingBottom: 34,
  },
  photoOption: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: AppColors.borderLight,
  },
  photoOptionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: AppColors.surfaceHighlight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  photoOptionTitle: {
    fontSize: 14.5,
    fontWeight: '700',
    color: AppColors.textPrimary,
  },
  photoOptionSub: {
    fontSize: 12,
    color: AppColors.textMuted,
    marginTop: 2,
  },

  // Country modal
  pickerModalContent: {
    backgroundColor: AppColors.surface,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    paddingBottom: 34,
  },
  countryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: AppColors.borderLight,
  },
  countryFlag: {
    fontSize: 22,
    marginRight: 12,
  },
  countryName: {
    flex: 1,
    fontSize: 14.5,
    fontWeight: '600',
    color: AppColors.textPrimary,
  },
  countryCodeBadge: {
    fontSize: 14,
    fontWeight: '700',
    color: AppColors.primary,
  },

  // DOB modal
  dobModalContent: {
    backgroundColor: AppColors.surface,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    paddingBottom: 34,
  },
  pickerControlsRow: {
    flexDirection: 'row',
    gap: 10,
    marginVertical: 16,
  },
  pickerCol: {
    flex: 1,
    backgroundColor: AppColors.surfaceSubtle,
    borderRadius: 12,
    padding: 10,
    alignItems: 'center',
  },
  pickerColLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: AppColors.textMuted,
    marginBottom: 8,
  },
  stepperWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
  },
  stepperBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: AppColors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: AppColors.border,
  },
  stepperBtnText: {
    fontSize: 16,
    fontWeight: '800',
    color: AppColors.primary,
  },
  stepperValue: {
    fontSize: 14,
    fontWeight: '800',
    color: AppColors.textPrimary,
  },
  confirmDobBtn: {
    backgroundColor: AppColors.primary,
    borderRadius: 14,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
  },
  confirmDobBtnText: {
    fontSize: 15,
    fontWeight: '700',
    color: AppColors.white,
  },
});