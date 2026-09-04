import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AppStackParamList } from '../../../core/navigation/types';
import { BackButton } from '../../../core/components/BackButton';
import { PrimaryButton } from '../../../core/components/PrimaryButton';

type UGCPostingNavProp = NativeStackNavigationProp<AppStackParamList, 'UGCPosting'>;
type UGCPostingRouteProp = RouteProp<AppStackParamList, 'UGCPosting'>;

// ── CUSTOM INLINE ICONS ──────────────────────────────────────
const LinkIcon = () => (
  <View style={styles.iconBox}>
    <View style={styles.linkCircle1} />
    <View style={styles.linkCircle2} />
  </View>
);

const LocationPinIcon = () => (
  <View style={styles.iconBox}>
    <View style={styles.pinHead} />
    <View style={styles.pinPoint} />
  </View>
);

const ShieldIcon = () => (
  <View style={styles.iconBox}>
    <View style={styles.shieldBody} />
  </View>
);

const CheckCircleIcon = () => (
  <View style={styles.checkCircle}>
    <Text style={styles.checkMark}>✓</Text>
  </View>
);

// ── URL VALIDATION HELPER ────────────────────────────────────
export type DetectedPlatform = 'instagram' | 'youtube' | null;

export const validateUGCLink = (url: string): { isValid: boolean; error?: string; platform: DetectedPlatform } => {
  const trimmed = url.trim();

  if (!trimmed) {
    return {
      isValid: false,
      error: 'Please enter a video link.',
      platform: null,
    };
  }

  // Instagram Reel URL regex
  // Matches: https://www.instagram.com/reel/..., https://instagram.com/reels/..., https://www.instagram.com/p/...
  const instagramReelRegex =
    /^(https?:\/\/)?(www\.)?instagram\.com\/(reel|reels|p)\/[A-Za-z0-9_-]+/i;

  // YouTube video / Shorts URL regex
  // Matches: https://www.youtube.com/watch?v=..., https://youtu.be/..., https://youtube.com/shorts/...
  const youtubeRegex =
    /^(https?:\/\/)?((www|m)\.)?(youtube\.com\/(watch\?v=[A-Za-z0-9_-]+|shorts\/[A-Za-z0-9_-]+|v\/[A-Za-z0-9_-]+|embed\/[A-Za-z0-9_-]+)|youtu\.be\/[A-Za-z0-9_-]+)/i;

  if (instagramReelRegex.test(trimmed)) {
    return { isValid: true, platform: 'instagram' };
  }

  if (youtubeRegex.test(trimmed)) {
    return { isValid: true, platform: 'youtube' };
  }

  return {
    isValid: false,
    error: 'Please enter a valid Instagram Reel or YouTube link.',
    platform: null,
  };
};

export default function UGCPostingScreen() {
  const navigation = useNavigation<UGCPostingNavProp>();
  const route = useRoute<UGCPostingRouteProp>();

  const destination = route.params?.destination || route.params?.placeName || 'Paris, France';

  const [link, setLink] = useState('');
  const [caption, setCaption] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [touched, setTouched] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleLinkChange = (text: string) => {
    setLink(text);
    if (touched || errorMessage) {
      const validation = validateUGCLink(text);
      setErrorMessage(validation.isValid ? null : validation.error || null);
    }
  };

  const handleBlur = () => {
    setIsFocused(false);
    setTouched(true);
    if (link.trim()) {
      const validation = validateUGCLink(link);
      setErrorMessage(validation.isValid ? null : validation.error || null);
    }
  };

  const handleSubmit = () => {
    setTouched(true);
    const validation = validateUGCLink(link);

    if (!validation.isValid) {
      setErrorMessage(validation.error || 'Please enter a valid Instagram Reel or YouTube link.');
      return;
    }

    setErrorMessage(null);
    setIsSubmitting(true);

    // Simulate submission for UI verification
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
    }, 1000);
  };

  const handleReset = () => {
    setLink('');
    setCaption('');
    setTouched(false);
    setErrorMessage(null);
    setIsSuccess(false);
  };

  const validationResult = link ? validateUGCLink(link) : { isValid: false, platform: null };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <KeyboardAvoidingView
        style={styles.flex1}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={styles.header}>
          <BackButton onPress={() => navigation.goBack()} />
          <Text style={styles.headerTitle}>Share Travel Content</Text>
          <View style={styles.headerPlaceholder} />
        </View>

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {isSuccess ? (
            <View style={styles.successContainer}>
              <View style={styles.successBadge}>
                <Text style={styles.successBadgeIcon}>✓</Text>
              </View>
              <Text style={styles.successTitle}>Content Submitted!</Text>
              <Text style={styles.successSubtitle}>
                Your travel video for <Text style={styles.boldText}>{destination}</Text> has been submitted for review according to our content policy.
              </Text>
              <View style={styles.successCard}>
                <Text style={styles.successCardLabel}>Submitted Link</Text>
                <Text style={styles.successCardLink} numberOfLines={2}>{link}</Text>
              </View>
              <View style={styles.gap24} />
              <PrimaryButton text="Submit Another Link" onPressed={handleReset} />
              <View style={styles.gap12} />
              <TouchableOpacity
                style={styles.secondaryButton}
                onPress={() => navigation.goBack()}
                activeOpacity={0.7}
              >
                <Text style={styles.secondaryButtonText}>Back to Trips</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <>
              {/* Destination Context Card */}
              <View style={styles.destinationCard}>
                <View style={styles.destinationHeader}>
                  <View style={styles.pinCircle}>
                    <LocationPinIcon />
                  </View>
                  <View style={styles.destinationInfo}>
                    <Text style={styles.destinationLabel}>DESTINATION</Text>
                    <Text style={styles.destinationName}>{destination}</Text>
                  </View>
                </View>
                <Text style={styles.destinationDesc}>
                  Share your favorite Reel or YouTube video from your visit to inspire fellow travelers.
                </Text>
              </View>

              <View style={styles.gap20} />

              {/* UGC Link Input Section */}
              <View style={styles.inputSection}>
                <View style={styles.labelRow}>
                  <Text style={styles.inputLabel}>Video or Reel Link</Text>
                  {validationResult.platform && (
                    <View style={styles.platformBadge}>
                      <Text style={styles.platformBadgeText}>
                        {validationResult.platform === 'instagram' ? '📷 Instagram Reel' : '▶ YouTube Video'}
                      </Text>
                    </View>
                  )}
                </View>

                <View
                  style={[
                    styles.inputWrapper,
                    isFocused && styles.inputWrapperFocused,
                    errorMessage ? styles.inputWrapperError : null,
                  ]}
                >
                  <View style={styles.inputPrefix}>
                    <LinkIcon />
                  </View>
                  <TextInput
                    style={styles.textInput}
                    placeholder="https://www.instagram.com/reel/... or YouTube URL"
                    placeholderTextColor="#B0B0B8"
                    value={link}
                    onChangeText={handleLinkChange}
                    onFocus={() => setIsFocused(true)}
                    onBlur={handleBlur}
                    autoCapitalize="none"
                    autoCorrect={false}
                    keyboardType="url"
                  />
                  {link.length > 0 && (
                    <TouchableOpacity
                      onPress={() => handleLinkChange('')}
                      style={styles.clearBtn}
                      activeOpacity={0.7}
                    >
                      <Text style={styles.clearBtnText}>✕</Text>
                    </TouchableOpacity>
                  )}
                </View>

                {/* Inline Validation Error Message */}
                {errorMessage ? (
                  <View style={styles.errorRow}>
                    <Text style={styles.errorIcon}>⚠</Text>
                    <Text style={styles.errorText}>{errorMessage}</Text>
                  </View>
                ) : null}

                {/* Supported Platforms Helper */}
                <View style={styles.supportedRow}>
                  <Text style={styles.supportedLabel}>Supported platforms:</Text>
                  <View style={styles.tag}>
                    <Text style={styles.tagText}>Instagram Reels</Text>
                  </View>
                  <View style={styles.tag}>
                    <Text style={styles.tagText}>YouTube</Text>
                  </View>
                </View>
              </View>

              <View style={styles.gap20} />

              {/* Optional Caption Field */}
              <View style={styles.inputSection}>
                <Text style={styles.inputLabel}>Notes or Description <Text style={styles.optionalText}>(Optional)</Text></Text>
                <View style={[styles.captionWrapper]}>
                  <TextInput
                    style={styles.captionInput}
                    placeholder="Tell us what makes this video special..."
                    placeholderTextColor="#B0B0B8"
                    value={caption}
                    onChangeText={setCaption}
                    multiline
                    numberOfLines={3}
                    maxLength={200}
                  />
                </View>
              </View>

              <View style={styles.gap24} />

              {/* Clear, Unambiguous Content Policy Section */}
              <View style={styles.policyCard}>
                <View style={styles.policyHeader}>
                  <View style={styles.shieldCircle}>
                    <ShieldIcon />
                  </View>
                  <Text style={styles.policyTitle}>Content Policy & Community Rules</Text>
                </View>

                <View style={styles.policyDivider} />

                <View style={styles.policyItem}>
                  <Text style={styles.policyBullet}>•</Text>
                  <Text style={styles.policyText}>
                    <Text style={styles.boldText}>Destination Relevant:</Text> Content must depict or relate directly to travel experiences in {destination}.
                  </Text>
                </View>

                <View style={styles.policyItem}>
                  <Text style={styles.policyBullet}>•</Text>
                  <Text style={styles.policyText}>
                    <Text style={styles.boldText}>Originality & Rights:</Text> You must have the right or authorization to share the submitted video.
                  </Text>
                </View>

                <View style={styles.policyItem}>
                  <Text style={styles.policyBullet}>•</Text>
                  <Text style={styles.policyText}>
                    <Text style={styles.boldText}>Prohibited Content:</Text> Inappropriate, misleading, abusive, defamatory, or infringing content is strictly prohibited.
                  </Text>
                </View>

                <View style={styles.policyItem}>
                  <Text style={styles.policyBullet}>•</Text>
                  <Text style={styles.policyText}>
                    <Text style={styles.boldText}>Moderation:</Text> Submitted content may be reviewed, rejected, or removed at any time in accordance with community guidelines.
                  </Text>
                </View>
              </View>

              <View style={styles.gap32} />

              {/* Submit Button */}
              <PrimaryButton
                text="Submit Content"
                onPressed={handleSubmit}
                isLoading={isSubmitting}
              />

              <View style={styles.gap24} />
            </>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  flex1: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1A1A2E',
    fontFamily: Platform.OS === 'android' ? 'Inter-Bold' : undefined,
  },
  headerPlaceholder: {
    width: 44,
  },
  scrollContent: {
    padding: 20,
  },

  // Destination Context Card
  destinationCard: {
    backgroundColor: '#FCE4EC', // Soft pink background matching Flutter theme
    borderRadius: 16,
    padding: 18,
    borderWidth: 1,
    borderColor: '#F8BBD0',
  },
  destinationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  pinCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#E91E63',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  destinationInfo: {
    flex: 1,
  },
  destinationLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#E91E63',
    letterSpacing: 0.8,
  },
  destinationName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1A1A2E',
    fontFamily: Platform.OS === 'android' ? 'Inter-Bold' : undefined,
  },
  destinationDesc: {
    fontSize: 13,
    color: 'rgba(26, 26, 46, 0.75)',
    lineHeight: 18,
  },

  // Input Sections
  inputSection: {
    width: '100%',
  },
  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1A1A2E',
    fontFamily: Platform.OS === 'android' ? 'Inter-SemiBold' : undefined,
  },
  optionalText: {
    fontSize: 13,
    fontWeight: '400',
    color: '#8E8E93',
  },
  platformBadge: {
    backgroundColor: '#E8F5E9',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
  },
  platformBadgeText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#2E7D32',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F7',
    borderRadius: 16,
    height: 56,
    paddingHorizontal: 16,
    borderWidth: 1.5,
    borderColor: '#E8E8E8',
  },
  inputWrapperFocused: {
    borderColor: '#E91E63',
    backgroundColor: '#FFFFFF',
  },
  inputWrapperError: {
    borderColor: '#E53935',
    backgroundColor: '#FFF5F5',
  },
  inputPrefix: {
    marginRight: 10,
  },
  textInput: {
    flex: 1,
    height: '100%',
    color: '#1A1A2E',
    fontSize: 14,
    fontFamily: Platform.OS === 'android' ? 'Inter-Regular' : undefined,
    padding: 0,
  },
  clearBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#E0E0E0',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  clearBtnText: {
    fontSize: 12,
    color: '#666666',
    fontWeight: 'bold',
  },

  // Validation Error
  errorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
    paddingHorizontal: 4,
  },
  errorIcon: {
    fontSize: 13,
    color: '#E53935',
    marginRight: 6,
  },
  errorText: {
    fontSize: 13,
    color: '#E53935',
    fontWeight: '500',
    flex: 1,
    fontFamily: Platform.OS === 'android' ? 'Inter-Medium' : undefined,
  },

  // Supported Platforms
  supportedRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    flexWrap: 'wrap',
    gap: 6,
  },
  supportedLabel: {
    fontSize: 12,
    color: '#8E8E93',
  },
  tag: {
    backgroundColor: '#F5F5F7',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E8E8E8',
  },
  tagText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#1A1A2E',
  },

  // Caption Field
  captionWrapper: {
    backgroundColor: '#F5F5F7',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1.5,
    borderColor: '#E8E8E8',
    height: 90,
  },
  captionInput: {
    color: '#1A1A2E',
    fontSize: 14,
    fontFamily: Platform.OS === 'android' ? 'Inter-Regular' : undefined,
    textAlignVertical: 'top',
    height: '100%',
    padding: 0,
  },

  // Content Policy Card
  policyCard: {
    backgroundColor: '#FAFAFC',
    borderRadius: 16,
    padding: 18,
    borderWidth: 1,
    borderColor: '#E8E8E8',
  },
  policyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  shieldCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#1B2A4A',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  policyTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1A1A2E',
    fontFamily: Platform.OS === 'android' ? 'Inter-Bold' : undefined,
  },
  policyDivider: {
    height: 1,
    backgroundColor: '#EEEEEE',
    marginVertical: 12,
  },
  policyItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  policyBullet: {
    fontSize: 16,
    color: '#E91E63',
    marginRight: 8,
    lineHeight: 18,
  },
  policyText: {
    fontSize: 13,
    color: 'rgba(26, 26, 46, 0.8)',
    lineHeight: 18,
    flex: 1,
    fontFamily: Platform.OS === 'android' ? 'Inter-Regular' : undefined,
  },
  boldText: {
    fontWeight: '700',
    color: '#1A1A2E',
  },

  // Success View
  successContainer: {
    alignItems: 'center',
    paddingVertical: 32,
    paddingHorizontal: 16,
  },
  successBadge: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#4CAF50',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  successBadgeIcon: {
    fontSize: 36,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  successTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1A1A2E',
    marginBottom: 8,
  },
  successSubtitle: {
    fontSize: 14,
    color: '#8E8E93',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 24,
  },
  successCard: {
    width: '100%',
    backgroundColor: '#F5F5F7',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E8E8E8',
  },
  successCardLabel: {
    fontSize: 12,
    color: '#8E8E93',
    fontWeight: '600',
    marginBottom: 4,
  },
  successCardLink: {
    fontSize: 13,
    color: '#1A1A2E',
    fontWeight: '500',
  },
  secondaryButton: {
    width: '100%',
    height: 52,
    borderRadius: 26,
    borderWidth: 1.5,
    borderColor: '#E8E8E8',
    justifyContent: 'center',
    alignItems: 'center',
  },
  secondaryButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1A1A2E',
  },

  // Simple Shapes for Icons
  iconBox: {
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  linkCircle1: {
    width: 12,
    height: 12,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#8E8E93',
    position: 'absolute',
    left: 1,
    top: 2,
  },
  linkCircle2: {
    width: 12,
    height: 12,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#8E8E93',
    position: 'absolute',
    right: 1,
    bottom: 2,
  },
  pinHead: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#FFFFFF',
  },
  pinPoint: {
    width: 4,
    height: 4,
    backgroundColor: '#FFFFFF',
    transform: [{ rotate: '45deg' }],
    marginTop: -2,
  },
  shieldBody: {
    width: 12,
    height: 14,
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 2,
    borderTopRightRadius: 2,
    borderBottomLeftRadius: 6,
    borderBottomRightRadius: 6,
  },
  checkCircle: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#4CAF50',
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkMark: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: 'bold',
  },

  // Spacing Helpers
  gap12: { height: 12 },
  gap20: { height: 20 },
  gap24: { height: 24 },
  gap32: { height: 32 },
});
