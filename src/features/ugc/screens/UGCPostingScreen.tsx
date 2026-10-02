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
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import {
  Link2,
  MapPin,
  ShieldCheck,
  ShieldAlert,
  Sparkles,
  CheckCircle2,
  Clock,
  ArrowRight,
  Info,
  Layers,
  AlertCircle,
} from 'lucide-react-native';
import { InstagramIcon, YouTubeIcon } from '../components/SocialIcons';
import { AppStackParamList } from '../../../core/navigation/types';
import { BackButton } from '../../../core/components/BackButton';
import { AppColors } from '../../../core/theme/colors';

type UGCPostingNavProp = NativeStackNavigationProp<AppStackParamList, 'UGCPosting'>;
type UGCPostingRouteProp = RouteProp<AppStackParamList, 'UGCPosting'>;

export type DetectedPlatform = 'instagram' | 'youtube' | null;

export const validateUGCLink = (
  url: string
): { isValid: boolean; error?: string; platform: DetectedPlatform } => {
  const trimmed = url.trim();

  if (!trimmed) {
    return {
      isValid: false,
      error: 'Please enter a video link.',
      platform: null,
    };
  }

  // Instagram Reel URL regex
  const instagramReelRegex =
    /^(https?:\/\/)?(www\.)?(instagr\.am|instagram\.com)\/(reel|reels|p)\/[A-Za-z0-9_-]+/i;

  // YouTube Shorts / video URL regex
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
    error: 'Please enter a valid Instagram Reel or YouTube Shorts URL.',
    platform: null,
  };
};

export default function UGCPostingScreen() {
  const navigation = useNavigation<UGCPostingNavProp>();
  const route = useRoute<UGCPostingRouteProp>();

  const destination = route.params?.destination || route.params?.placeName || 'Paris, France';
  const tripId = route.params?.tripId;

  const [link, setLink] = useState('');
  const [caption, setCaption] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [touched, setTouched] = useState(false);

  // Pipeline execution state
  const [pipelineStep, setPipelineStep] = useState<number>(0); // 0: Idle, 1: Ingesting, 2: AI Analysis, 3: Moderation, 4: Done
  const [isProcessing, setIsProcessing] = useState(false);
  const [submissionResult, setSubmissionResult] = useState<'approved' | 'rejected' | null>(null);

  const detectedPlatform = link.trim() ? validateUGCLink(link).platform : null;

  const handleLinkChange = (text: string) => {
    setLink(text);
    if (touched || errorMessage) {
      const validation = validateUGCLink(text);
      setErrorMessage(validation.isValid ? null : validation.error || null);
    }
  };

  const handleQuickPaste = (sampleUrl: string) => {
    setLink(sampleUrl);
    setErrorMessage(null);
    setTouched(true);
  };

  const handleSubmit = async () => {
    setTouched(true);
    const validation = validateUGCLink(link);

    if (!validation.isValid) {
      setErrorMessage(validation.error || 'Please enter a valid Instagram Reel or YouTube link.');
      return;
    }

    setErrorMessage(null);
    setIsProcessing(true);
    setPipelineStep(1);

    // Simulate backend pipeline steps
    await new Promise((r) => setTimeout(() => r(undefined), 600));
    setPipelineStep(2); // AI Analysis

    await new Promise((r) => setTimeout(() => r(undefined), 700));
    setPipelineStep(3); // Moderation check

    await new Promise((r) => setTimeout(() => r(undefined), 600));
    setPipelineStep(4); // Finalize

    // Check if test link is a rejection sample
    const isRejectedSample = link.toLowerCase().includes('spam') || link.toLowerCase().includes('reject');
    setSubmissionResult(isRejectedSample ? 'rejected' : 'approved');
    setIsProcessing(false);
  };

  const handleReset = () => {
    setLink('');
    setCaption('');
    setPipelineStep(0);
    setSubmissionResult(null);
    setTouched(false);
    setErrorMessage(null);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.flex1}
      >
        {/* Header */}
        <View style={styles.header}>
          <BackButton onPress={() => navigation.goBack()} />
          <Text style={styles.headerTitle}>Submit Reel / Video</Text>
          <View style={styles.placeholder} />
        </View>

        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          {/* Destination Association Banner */}
          <View style={styles.destBanner}>
            <MapPin size={16} color={AppColors.primary} />
            <Text style={styles.destLabel}>Associating with:</Text>
            <Text style={styles.destName} numberOfLines={1}>
              {destination}
            </Text>
          </View>

          {/* Submission Form (when not processed) */}
          {pipelineStep === 0 && (
            <>
              <Text style={styles.sectionHeading}>Share Travel Story</Text>
              <Text style={styles.sectionSub}>
                Paste an Instagram Reel or YouTube Shorts URL. The video will be analyzed by AI and verified under zero-tolerance moderation before appearing in {destination}.
              </Text>

              {/* URL Input */}
              <View style={styles.inputWrapper}>
                <View style={styles.inputLabelRow}>
                  <Text style={styles.inputLabel}>Reel or Shorts Link</Text>
                  {detectedPlatform && (
                    <View
                      style={[
                        styles.platformBadge,
                        {
                          backgroundColor:
                            detectedPlatform === 'instagram' ? AppColors.instagramAlt : AppColors.youtube,
                        },
                      ]}
                    >
                      {detectedPlatform === 'instagram' ? (
                        <InstagramIcon size={11} color={AppColors.white} />
                      ) : (
                        <YouTubeIcon size={11} color={AppColors.white} />
                      )}
                      <Text style={styles.platformBadgeText}>
                        {detectedPlatform === 'instagram' ? 'Instagram Reel' : 'YouTube Shorts'}
                      </Text>
                    </View>
                  )}
                </View>

                <View
                  style={[
                    styles.inputBox,
                    errorMessage ? styles.inputBoxError : null,
                  ]}
                >
                  <Link2 size={18} color={AppColors.textMuted} />
                  <TextInput
                    style={styles.input}
                    placeholder="https://www.instagram.com/reel/..."
                    placeholderTextColor={AppColors.textLight}
                    value={link}
                    onChangeText={handleLinkChange}
                    autoCapitalize="none"
                    autoCorrect={false}
                  />
                </View>
                {errorMessage && (
                  <View style={styles.errorRow}>
                    <AlertCircle size={13} color={AppColors.error} />
                    <Text style={styles.errorText}>{errorMessage}</Text>
                  </View>
                )}
              </View>

              {/* Quick Sample Links for Demo / Testing */}
              <View style={styles.samplesCard}>
                <Text style={styles.samplesTitle}>Quick Fill Sample URLs:</Text>
                <TouchableOpacity
                  style={styles.sampleItem}
                  onPress={() =>
                    handleQuickPaste('https://www.instagram.com/reel/C3_ParisSunset')
                  }
                >
                  <InstagramIcon size={13} color={AppColors.instagramAlt} />
                  <Text style={styles.sampleText} numberOfLines={1}>
                    Valid Instagram Reel (Paris Sunset)
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.sampleItem}
                  onPress={() =>
                    handleQuickPaste('https://youtube.com/shorts/ParisFoodGuide2026')
                  }
                >
                  <YouTubeIcon size={13} color={AppColors.youtube} />
                  <Text style={styles.sampleText} numberOfLines={1}>
                    Valid YouTube Shorts (Croissant Tour)
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.sampleItem}
                  onPress={() =>
                    handleQuickPaste('https://www.youtube.com/shorts/SpamVideoParis')
                  }
                >
                  <ShieldAlert size={13} color={AppColors.error} />
                  <Text style={styles.sampleText} numberOfLines={1}>
                    Sample Triggering Moderation Policy Rejection
                  </Text>
                </TouchableOpacity>
              </View>

              {/* Optional Caption */}
              <View style={styles.inputWrapper}>
                <Text style={styles.inputLabel}>Personal Note or Tip (Optional)</Text>
                <TextInput
                  style={[styles.inputBox, styles.captionBox]}
                  placeholder="e.g. Best visited right at 7 PM for golden hour..."
                  placeholderTextColor={AppColors.textLight}
                  value={caption}
                  onChangeText={setCaption}
                  multiline
                />
              </View>

              {/* Pipeline Overview Box */}
              <View style={styles.pipelineInfoBox}>
                <View style={styles.pipelineHeader}>
                  <Sparkles size={16} color={AppColors.primary} />
                  <Text style={styles.pipelineTitle}>Automated Processing Pipeline</Text>
                </View>
                <Text style={styles.pipelineDesc}>
                  1. Server validates URL → 2. Video ingestion & transcription → 3. AI highlights extraction → 4. Zero-tolerance moderation check → 5. Surface to travelers.
                </Text>
              </View>

              {/* Submit Button */}
              <TouchableOpacity
                style={styles.submitBtn}
                onPress={handleSubmit}
                activeOpacity={0.85}
              >
                <Text style={styles.submitBtnText}>Submit for AI Verification</Text>
                <ArrowRight size={18} color={AppColors.textOnPrimary} />
              </TouchableOpacity>
            </>
          )}

          {/* Processing Pipeline Animation State */}
          {isProcessing && (
            <View style={styles.processingCard}>
              <ActivityIndicator size="large" color={AppColors.primary} style={styles.spinner} />
              <Text style={styles.processingHeading}>Processing Travel Video</Text>
              <Text style={styles.processingSub}>Executing automated backend pipeline</Text>

              <View style={styles.stepsList}>
                <View style={styles.stepRow}>
                  <CheckCircle2
                    size={18}
                    color={pipelineStep >= 1 ? AppColors.primary : AppColors.borderDark}
                  />
                  <Text style={[styles.stepText, pipelineStep >= 1 && styles.stepTextActive]}>
                    1. Ingesting video & metadata
                  </Text>
                </View>

                <View style={styles.stepRow}>
                  <CheckCircle2
                    size={18}
                    color={pipelineStep >= 2 ? AppColors.primary : AppColors.borderDark}
                  />
                  <Text style={[styles.stepText, pipelineStep >= 2 && styles.stepTextActive]}>
                    2. AI Analysis & destination association
                  </Text>
                </View>

                <View style={styles.stepRow}>
                  <CheckCircle2
                    size={18}
                    color={pipelineStep >= 3 ? AppColors.primary : AppColors.borderDark}
                  />
                  <Text style={[styles.stepText, pipelineStep >= 3 && styles.stepTextActive]}>
                    3. Zero-tolerance moderation safety check
                  </Text>
                </View>
              </View>
            </View>
          )}

          {/* Finished State: APPROVED or REJECTED */}
          {!isProcessing && pipelineStep === 4 && (
            <View style={styles.resultContainer}>
              {submissionResult === 'approved' ? (
                <View style={styles.approvedCard}>
                  <View style={styles.approvedIconBg}>
                    <ShieldCheck size={36} color={AppColors.success} />
                  </View>
                  <Text style={styles.resultTitle}>Moderation Approved! 🎉</Text>
                  <Text style={styles.resultSub}>
                    Your Reel passed zero-tolerance safety checks and has been linked to{' '}
                    <Text style={styles.boldText}>{destination}</Text>.
                  </Text>

                  {/* AI Generated Preview */}
                  <View style={styles.aiGeneratedBox}>
                    <View style={styles.aiGenHeader}>
                      <Sparkles size={14} color={AppColors.primary} />
                      <Text style={styles.aiGenTitle}>AI Analysis Generated</Text>
                    </View>
                    <Text style={styles.aiGenText}>
                      "Scenic photography viewpoints around Trocadéro and Bir-Hakeim bridge during golden hour."
                    </Text>
                    <View style={styles.tagWrap}>
                      <Text style={styles.tagChip}>#Sunset</Text>
                      <Text style={styles.tagChip}>#PhotoSpot</Text>
                      <Text style={styles.tagChip}>#Romantic</Text>
                    </View>
                  </View>

                  <TouchableOpacity
                    style={styles.actionPrimaryBtn}
                    onPress={() => navigation.goBack()}
                  >
                    <Text style={styles.actionPrimaryText}>View in {destination}</Text>
                  </TouchableOpacity>

                  <TouchableOpacity style={styles.actionSecondaryBtn} onPress={handleReset}>
                    <Text style={styles.actionSecondaryText}>Submit Another Reel</Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <View style={styles.rejectedCard}>
                  <View style={styles.rejectedIconBg}>
                    <ShieldAlert size={36} color={AppColors.error} />
                  </View>
                  <Text style={styles.resultTitle}>Moderation Policy Notice</Text>
                  <Text style={styles.resultSub}>
                    This submission could not be approved due to zero-tolerance content policy restrictions (spam/unverified source). Under our strict safety rules, unapproved content is never displayed.
                  </Text>

                  <TouchableOpacity style={styles.actionSecondaryBtn} onPress={handleReset}>
                    <Text style={styles.actionSecondaryText}>Try Another Link</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: AppColors.background },
  flex1: { flex: 1 },
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
  headerTitle: { fontSize: 18, fontWeight: '700', color: AppColors.textPrimary },
  placeholder: { width: 44 },
  content: { padding: 20, paddingBottom: 36 },
  destBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: AppColors.surfaceHighlight,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: AppColors.primaryLight,
  },
  destLabel: { fontSize: 12, color: AppColors.textMuted, fontWeight: '500' },
  destName: { fontSize: 13, fontWeight: '700', color: AppColors.primary, flex: 1 },
  sectionHeading: { fontSize: 20, fontWeight: '700', color: AppColors.textPrimary, marginBottom: 4 },
  sectionSub: { fontSize: 13, color: AppColors.textMuted, lineHeight: 18, marginBottom: 20 },
  inputWrapper: { marginBottom: 16 },
  inputLabelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  inputLabel: { fontSize: 13, fontWeight: '600', color: AppColors.textPrimary },
  platformBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 6,
  },
  platformBadgeText: { color: AppColors.white, fontSize: 10, fontWeight: '700' },
  inputBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: AppColors.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: AppColors.border,
    paddingHorizontal: 12,
    height: 48,
    gap: 8,
  },
  captionBox: {
    height: 80,
    alignItems: 'flex-start',
    paddingTop: 10,
  },
  inputBoxError: { borderColor: AppColors.error, backgroundColor: AppColors.errorLight },
  input: { flex: 1, fontSize: 14, color: AppColors.textPrimary },
  errorRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 4 },
  errorText: { fontSize: 12, color: AppColors.error },
  samplesCard: {
    backgroundColor: AppColors.surface,
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: AppColors.border,
    marginBottom: 16,
    gap: 8,
  },
  samplesTitle: { fontSize: 11, fontWeight: '700', color: AppColors.textMuted, textTransform: 'uppercase' },
  sampleItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: AppColors.surfaceSubtle,
    padding: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: AppColors.borderLight,
  },
  sampleText: { fontSize: 12, color: AppColors.textPrimary, flex: 1 },
  pipelineInfoBox: {
    backgroundColor: AppColors.surfaceHighlight,
    borderRadius: 12,
    padding: 12,
    borderLeftWidth: 3,
    borderLeftColor: AppColors.primary,
    marginBottom: 24,
  },
  pipelineHeader: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 4 },
  pipelineTitle: { fontSize: 12, fontWeight: '700', color: AppColors.primary },
  pipelineDesc: { fontSize: 11, color: AppColors.textSecondary, lineHeight: 16 },
  submitBtn: {
    height: 50,
    borderRadius: 25,
    backgroundColor: AppColors.primary,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  submitBtnText: { color: AppColors.textOnPrimary, fontSize: 15, fontWeight: '700' },
  processingCard: {
    backgroundColor: AppColors.surface,
    borderRadius: 18,
    padding: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: AppColors.border,
    marginTop: 20,
  },
  spinner: { marginBottom: 16 },
  processingHeading: { fontSize: 18, fontWeight: '700', color: AppColors.textPrimary, marginBottom: 4 },
  processingSub: { fontSize: 13, color: AppColors.textMuted, marginBottom: 20 },
  stepsList: { width: '100%', gap: 12 },
  stepRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  stepText: { fontSize: 13, color: AppColors.textMuted },
  stepTextActive: { color: AppColors.textPrimary, fontWeight: '600' },
  resultContainer: { marginTop: 16 },
  approvedCard: {
    backgroundColor: AppColors.surface,
    borderRadius: 18,
    padding: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: AppColors.successBorder,
    shadowColor: AppColors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  approvedIconBg: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: AppColors.successLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  rejectedCard: {
    backgroundColor: AppColors.surface,
    borderRadius: 18,
    padding: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: AppColors.errorBorder,
  },
  rejectedIconBg: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: AppColors.errorLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  resultTitle: { fontSize: 18, fontWeight: '700', color: AppColors.textPrimary, marginBottom: 6 },
  resultSub: { fontSize: 13, color: AppColors.textMuted, textAlign: 'center', lineHeight: 18, marginBottom: 16 },
  boldText: { fontWeight: '700', color: AppColors.textPrimary },
  aiGeneratedBox: {
    width: '100%',
    backgroundColor: AppColors.surfaceHighlight,
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: AppColors.primaryLight,
    marginBottom: 20,
  },
  aiGenHeader: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 4 },
  aiGenTitle: { fontSize: 12, fontWeight: '700', color: AppColors.primary },
  aiGenText: { fontSize: 12, color: AppColors.textSecondary, fontStyle: 'italic', marginBottom: 8 },
  tagWrap: { flexDirection: 'row', gap: 6 },
  tagChip: {
    fontSize: 10,
    color: AppColors.primary,
    fontWeight: '700',
    backgroundColor: AppColors.surface,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: AppColors.primaryLight,
  },
  actionPrimaryBtn: {
    width: '100%',
    height: 48,
    borderRadius: 24,
    backgroundColor: AppColors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  actionPrimaryText: { color: AppColors.textOnPrimary, fontWeight: '700', fontSize: 14 },
  actionSecondaryBtn: {
    paddingVertical: 8,
  },
  actionSecondaryText: { color: AppColors.textMuted, fontWeight: '600', fontSize: 13 },
});
