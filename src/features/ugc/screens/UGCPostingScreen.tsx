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
  Image,
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
  AlertCircle,
  RotateCcw,
  ExternalLink,
  Edit3,
  Check,
  HelpCircle,
} from 'lucide-react-native';
import { InstagramIcon, YouTubeIcon } from '../components/SocialIcons';
import { AppStackParamList } from '../../../core/navigation/types';
import { BackButton } from '../../../core/components/BackButton';
import { AppColors } from '../../../core/theme/colors';
import {
  analyzeVideoUrl,
  submitReelCandidate,
  VideoAnalysisResult,
  DestinationMatchStatus,
} from '../services/ugcService';

type UGCPostingNavProp = NativeStackNavigationProp<AppStackParamList, 'UGCPosting'>;
type UGCPostingRouteProp = RouteProp<AppStackParamList, 'UGCPosting'>;

export type DetectedPlatform = 'instagram' | 'youtube' | null;

/**
 * Validates whether the user supplied link is a supported Instagram Reel or YouTube Shorts URL.
 */
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

  // Instagram Reel / Post URL regex
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

export type ScreenStage = 'input' | 'processing' | 'review' | 'confirmation' | 'rejected' | 'error';

export default function UGCPostingScreen() {
  const navigation = useNavigation<UGCPostingNavProp>();
  const route = useRoute<UGCPostingRouteProp>();

  // Optional contextual destination passed from elsewhere (does NOT constrain inference)
  const contextualDestination = route.params?.destination || route.params?.placeName;

  const [link, setLink] = useState('');
  const [personalTip, setPersonalTip] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [touched, setTouched] = useState(false);

  // Pipeline flow states
  const [stage, setStage] = useState<ScreenStage>('input');
  const [processingStepIndex, setProcessingStepIndex] = useState<number>(0);
  const [isProcessing, setIsProcessing] = useState(false);

  // AI Analysis Results
  const [analysisResult, setAnalysisResult] = useState<VideoAnalysisResult | null>(null);
  const [userConfirmedDestination, setUserConfirmedDestination] = useState<string>('');
  const [isEditingDestination, setIsEditingDestination] = useState(false);

  // Submission Result
  const [submissionId, setSubmissionId] = useState<string>('');
  const [isNewCandidateSubmitted, setIsNewCandidateSubmitted] = useState(false);

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

  /**
   * Step A -> Step B -> Step C: Start processing the pasted URL
   */
  const handleStartAnalysis = async () => {
    if (isProcessing) return; // Prevent duplicate taps

    setTouched(true);
    const validation = validateUGCLink(link);

    if (!validation.isValid || !validation.platform) {
      setErrorMessage(validation.error || 'Please enter a valid Instagram Reel or YouTube Shorts link.');
      return;
    }

    // Check for spam rejection test
    const isSpamTest = link.toLowerCase().includes('spam') || link.toLowerCase().includes('reject');

    setErrorMessage(null);
    setIsProcessing(true);
    setStage('processing');
    setProcessingStepIndex(1); // 1. Reading video details

    try {
      // Step 1: Reading video details
      await new Promise((r) => setTimeout(() => r(undefined), 450));
      setProcessingStepIndex(2); // 2. Identifying destination

      // Step 2: Ingest & AI Analysis
      const result = await analyzeVideoUrl(link, validation.platform);

      await new Promise((r) => setTimeout(() => r(undefined), 450));
      setProcessingStepIndex(3); // 3. Extracting travel insights

      await new Promise((r) => setTimeout(() => r(undefined), 400));
      setProcessingStepIndex(4); // 4. Checking existing destinations

      await new Promise((r) => setTimeout(() => r(undefined), 400));
      setProcessingStepIndex(5); // 5. Reviewing content safety

      await new Promise((r) => setTimeout(() => r(undefined), 350));

      setIsProcessing(false);

      if (isSpamTest) {
        setStage('rejected');
      } else {
        setAnalysisResult(result);
        setUserConfirmedDestination(result.detectedDestination);
        setStage('review');
      }
    } catch {
      setIsProcessing(false);
      setStage('error');
    }
  };

  /**
   * Step C -> Step E: Finalize submission for moderation
   */
  const handleConfirmSubmit = async () => {
    if (!analysisResult || isProcessing) return;

    setIsProcessing(true);

    try {
      const finalDest = userConfirmedDestination.trim() || analysisResult.detectedDestination;
      const isNewCandidate = analysisResult.matchStatus === 'candidate_new';

      const response = await submitReelCandidate({
        url: analysisResult.url,
        platform: analysisResult.platform,
        title: analysisResult.title,
        creatorHandle: analysisResult.creatorHandle,
        thumbnailUrl: analysisResult.thumbnailUrl,
        destination: finalDest,
        destinationId: analysisResult.matchingDestinationId,
        isNewDestinationCandidate: isNewCandidate,
        notes: personalTip,
      });

      setSubmissionId(response.submissionId);
      setIsNewCandidateSubmitted(response.isNewCandidate);
      setIsProcessing(false);
      setStage('confirmation');
    } catch {
      setIsProcessing(false);
      setStage('error');
    }
  };

  const handleReset = () => {
    setLink('');
    setPersonalTip('');
    setStage('input');
    setProcessingStepIndex(0);
    setAnalysisResult(null);
    setSubmissionId('');
    setErrorMessage(null);
    setTouched(false);
    setIsProcessing(false);
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.flex1}
      >
        {/* Header */}
        <View style={styles.header}>
          <BackButton onPress={() => navigation.goBack()} />
          <Text style={styles.headerTitle}>Share a Travel Reel</Text>
          <View style={styles.placeholder} />
        </View>

        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          {/* Subtitle / Value proposition */}
          <View style={styles.titleWrap}>
            <Text style={styles.pageSubtitle}>
              Discover new places with the videos you love.
            </Text>
            <Text style={styles.pageExplanation}>
              Paste any Instagram Reel or YouTube Short. Our AI will automatically infer the destination, extract key travel tips, and match it to our verified guide.
            </Text>
          </View>

          {/* ════════════════════════════════════════════════════════════════
              STEP A: PASTE URL & INPUT FORM
             ════════════════════════════════════════════════════════════════ */}
          {stage === 'input' && (
            <View style={styles.stepContainer}>
              {/* Optional context hint if user arrived from a place */}
              {contextualDestination && (
                <View style={styles.contextHintBox}>
                  <MapPin size={14} color={AppColors.primary} />
                  <Text style={styles.contextHintText} numberOfLines={1}>
                    Browsing from {contextualDestination}. Destination will be inferred from your video.
                  </Text>
                </View>
              )}

              {/* URL Input Box */}
              <View style={styles.inputWrapper}>
                <View style={styles.inputLabelRow}>
                  <Text style={styles.inputLabel}>Reel or Shorts Link</Text>
                  {detectedPlatform && (
                    <View
                      style={[
                        styles.platformBadge,
                        {
                          backgroundColor:
                            detectedPlatform === 'instagram'
                              ? AppColors.instagramAlt
                              : AppColors.youtube,
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
                    placeholder="Paste an Instagram Reel or YouTube Short link"
                    placeholderTextColor={AppColors.textLight}
                    value={link}
                    onChangeText={handleLinkChange}
                    autoCapitalize="none"
                    autoCorrect={false}
                    accessibilityLabel="Video URL input"
                  />
                </View>
                {errorMessage && (
                  <View style={styles.errorRow}>
                    <AlertCircle size={13} color={AppColors.error} />
                    <Text style={styles.errorText}>{errorMessage}</Text>
                  </View>
                )}
              </View>

              {/* Quick Sample Links for Interactive Testing */}
              <View style={styles.samplesCard}>
                <Text style={styles.samplesTitle}>Try Sample Travel Videos:</Text>

                <TouchableOpacity
                  style={styles.sampleItem}
                  onPress={() =>
                    handleQuickPaste('https://www.instagram.com/reel/C3_ParisSunset')
                  }
                  activeOpacity={0.7}
                >
                  <InstagramIcon size={13} color={AppColors.instagramAlt} />
                  <Text style={styles.sampleText} numberOfLines={1}>
                    Paris Sunset Reel (Matches Paris, France)
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.sampleItem}
                  onPress={() =>
                    handleQuickPaste('https://youtube.com/shorts/BaliHiddenWaterfalls')
                  }
                  activeOpacity={0.7}
                >
                  <YouTubeIcon size={13} color={AppColors.youtube} />
                  <Text style={styles.sampleText} numberOfLines={1}>
                    Bali Waterfalls Short (Matches Bali, Indonesia)
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.sampleItem}
                  onPress={() =>
                    handleQuickPaste('https://www.instagram.com/reel/FaroeIslandsAdventure')
                  }
                  activeOpacity={0.7}
                >
                  <InstagramIcon size={13} color={AppColors.instagramAlt} />
                  <Text style={styles.sampleText} numberOfLines={1}>
                    Faroe Islands Reel (Proposes New Destination)
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.sampleItem}
                  onPress={() =>
                    handleQuickPaste('https://www.youtube.com/shorts/AmbiguousBeachSunset')
                  }
                  activeOpacity={0.7}
                >
                  <YouTubeIcon size={13} color={AppColors.youtube} />
                  <Text style={styles.sampleText} numberOfLines={1}>
                    Ambiguous Sunset (Low Confidence Demonstration)
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.sampleItem}
                  onPress={() =>
                    handleQuickPaste('https://www.youtube.com/shorts/SpamCommercialVideo')
                  }
                  activeOpacity={0.7}
                >
                  <ShieldAlert size={13} color={AppColors.error} />
                  <Text style={styles.sampleText} numberOfLines={1}>
                    Spam Sample (Zero-Tolerance Moderation Notice)
                  </Text>
                </TouchableOpacity>
              </View>

              {/* Optional Traveler Tip */}
              <View style={styles.inputWrapper}>
                <Text style={styles.inputLabel}>Traveler Tip / Context (Optional)</Text>
                <TextInput
                  style={[styles.inputBox, styles.captionBox]}
                  placeholder="e.g. Best time is early morning to beat the tourist rush..."
                  placeholderTextColor={AppColors.textLight}
                  value={personalTip}
                  onChangeText={setPersonalTip}
                  multiline
                />
              </View>

              {/* Primary Action Button */}
              <TouchableOpacity
                style={[styles.primaryCtaBtn, isProcessing && styles.btnDisabled]}
                onPress={handleStartAnalysis}
                disabled={isProcessing}
                activeOpacity={0.85}
              >
                <Sparkles size={18} color={AppColors.textOnPrimary} />
                <Text style={styles.primaryCtaBtnText}>Analyse Video with AI</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* ════════════════════════════════════════════════════════════════
              STEP B: PROCESSING STATE
             ════════════════════════════════════════════════════════════════ */}
          {stage === 'processing' && (
            <View style={styles.processingCard}>
              <ActivityIndicator size="large" color={AppColors.primary} style={styles.spinner} />
              <Text style={styles.processingHeading}>Analyzing Travel Video</Text>
              <Text style={styles.processingSub}>
                Executing AI analysis and destination matching pipeline
              </Text>

              <View style={styles.stepsList}>
                <View style={styles.stepRow}>
                  <CheckCircle2
                    size={18}
                    color={processingStepIndex >= 1 ? AppColors.primary : AppColors.borderDark}
                  />
                  <Text style={[styles.stepText, processingStepIndex >= 1 && styles.stepTextActive]}>
                    1. Reading video details & platform metadata
                  </Text>
                </View>

                <View style={styles.stepRow}>
                  <CheckCircle2
                    size={18}
                    color={processingStepIndex >= 2 ? AppColors.primary : AppColors.borderDark}
                  />
                  <Text style={[styles.stepText, processingStepIndex >= 2 && styles.stepTextActive]}>
                    2. Identifying destination with AI
                  </Text>
                </View>

                <View style={styles.stepRow}>
                  <CheckCircle2
                    size={18}
                    color={processingStepIndex >= 3 ? AppColors.primary : AppColors.borderDark}
                  />
                  <Text style={[styles.stepText, processingStepIndex >= 3 && styles.stepTextActive]}>
                    3. Extracting travel insights & highlights
                  </Text>
                </View>

                <View style={styles.stepRow}>
                  <CheckCircle2
                    size={18}
                    color={processingStepIndex >= 4 ? AppColors.primary : AppColors.borderDark}
                  />
                  <Text style={[styles.stepText, processingStepIndex >= 4 && styles.stepTextActive]}>
                    4. Checking existing Tourbhook destinations
                  </Text>
                </View>

                <View style={styles.stepRow}>
                  <CheckCircle2
                    size={18}
                    color={processingStepIndex >= 5 ? AppColors.primary : AppColors.borderDark}
                  />
                  <Text style={[styles.stepText, processingStepIndex >= 5 && styles.stepTextActive]}>
                    5. Reviewing content safety & zero-tolerance rules
                  </Text>
                </View>
              </View>

              <View style={styles.honestNoticeBox}>
                <Info size={14} color={AppColors.textMuted} />
                <Text style={styles.honestNoticeText}>
                  Development mode: Simulating AI video ingestion pipeline. Real inference server integration pending.
                </Text>
              </View>
            </View>
          )}

          {/* ════════════════════════════════════════════════════════════════
              STEP C & D: AI ANALYSIS RESULTS & DESTINATION MATCHING
             ════════════════════════════════════════════════════════════════ */}
          {stage === 'review' && analysisResult && (
            <View style={styles.reviewContainer}>
              {/* Video Preview Card */}
              <View style={styles.videoPreviewCard}>
                <Image
                  source={{ uri: analysisResult.thumbnailUrl }}
                  style={styles.previewThumbnail}
                />
                <View style={styles.previewInfo}>
                  <View style={styles.previewPlatformTag}>
                    {analysisResult.platform === 'instagram' ? (
                      <InstagramIcon size={12} color={AppColors.white} />
                    ) : (
                      <YouTubeIcon size={12} color={AppColors.white} />
                    )}
                    <Text style={styles.previewPlatformText}>
                      {analysisResult.platform === 'instagram' ? 'Instagram Reel' : 'YouTube Short'}
                    </Text>
                  </View>
                  <Text style={styles.previewTitle} numberOfLines={2}>
                    {analysisResult.title}
                  </Text>
                  <Text style={styles.previewCreator}>{analysisResult.creatorHandle}</Text>
                </View>
              </View>

              {/* AI Inferred Destination & Matching Card */}
              <View style={styles.destinationMatchCard}>
                <View style={styles.destMatchHeader}>
                  <View style={styles.destIconBadge}>
                    <MapPin size={18} color={AppColors.primary} />
                  </View>
                  <View style={styles.destHeaderTexts}>
                    <Text style={styles.destSectionEyebrow}>AI Inferred Destination</Text>
                    {isEditingDestination ? (
                      <View style={styles.destEditRow}>
                        <TextInput
                          style={styles.destEditInput}
                          value={userConfirmedDestination}
                          onChangeText={setUserConfirmedDestination}
                          autoFocus
                        />
                        <TouchableOpacity
                          style={styles.destSaveBtn}
                          onPress={() => setIsEditingDestination(false)}
                        >
                          <Check size={16} color={AppColors.white} />
                        </TouchableOpacity>
                      </View>
                    ) : (
                      <View style={styles.destDisplayRow}>
                        <Text style={styles.destMainName}>{userConfirmedDestination}</Text>
                        <TouchableOpacity
                          onPress={() => setIsEditingDestination(true)}
                          style={styles.destEditToggle}
                        >
                          <Edit3 size={14} color={AppColors.primary} />
                        </TouchableOpacity>
                      </View>
                    )}
                  </View>

                  {/* Confidence Badge */}
                  <View
                    style={[
                      styles.confidencePill,
                      analysisResult.locationConfidence >= 0.85
                        ? styles.confidenceHigh
                        : styles.confidenceModerate,
                    ]}
                  >
                    <Text
                      style={[
                        styles.confidencePillText,
                        analysisResult.locationConfidence >= 0.85
                          ? styles.confidenceHighText
                          : styles.confidenceModerateText,
                      ]}
                    >
                      {Math.round(analysisResult.locationConfidence * 100)}% Confidence
                    </Text>
                  </View>
                </View>

                {/* ── Case 1: Existing Destination Found ── */}
                {analysisResult.matchStatus === 'exact_match' && (
                  <View style={styles.matchNoticeBox}>
                    <CheckCircle2 size={16} color={AppColors.success} />
                    <View style={styles.matchNoticeTexts}>
                      <Text style={styles.matchNoticeTitle}>
                        Verified Destination Match Found
                      </Text>
                      <Text style={styles.matchNoticeDesc}>
                        Matches our existing guide for{' '}
                        <Text style={styles.boldText}>
                          {analysisResult.matchingDestinationName || analysisResult.detectedDestination}
                        </Text>
                        . Once approved, this video will appear on its Place Details page.
                      </Text>
                    </View>
                  </View>
                )}

                {/* ── Case 2: New Destination Candidate ── */}
                {analysisResult.matchStatus === 'candidate_new' && (
                  <View style={[styles.matchNoticeBox, styles.matchNoticeNew]}>
                    <Sparkles size={16} color={AppColors.accent} />
                    <View style={styles.matchNoticeTexts}>
                      <Text style={[styles.matchNoticeTitle, { color: AppColors.accentDark }]}>
                        New Destination Candidate
                      </Text>
                      <Text style={styles.matchNoticeDesc}>
                        "{analysisResult.detectedDestination}" is not yet in our catalog. Submitting this video will create a candidate destination for editorial review.
                      </Text>
                    </View>
                  </View>
                )}

                {/* ── Case 3: Ambiguous / Low Confidence ── */}
                {analysisResult.matchStatus === 'ambiguous' && (
                  <View style={[styles.matchNoticeBox, styles.matchNoticeAmbiguous]}>
                    <HelpCircle size={16} color={AppColors.warningDark} />
                    <View style={styles.matchNoticeTexts}>
                      <Text style={[styles.matchNoticeTitle, { color: AppColors.warningDark }]}>
                        Location Ambiguous (Low Confidence)
                      </Text>
                      <Text style={styles.matchNoticeDesc}>
                        The video lacks clear visual landmark confirmation. Please tap the pencil icon above to confirm or refine the destination before submitting.
                      </Text>
                    </View>
                  </View>
                )}
              </View>

              {/* Extracted Travel Insights Breakdown */}
              <View style={styles.insightsCard}>
                <View style={styles.insightsHeader}>
                  <Sparkles size={16} color={AppColors.primary} />
                  <Text style={styles.insightsTitle}>Extracted Travel Insights</Text>
                </View>

                <Text style={styles.insightsSummary}>{analysisResult.summary}</Text>

                {analysisResult.detectedPlaces?.length > 0 && (
                  <View style={styles.insightItemRow}>
                    <MapPin size={13} color={AppColors.textMuted} />
                    <Text style={styles.insightItemText}>
                      Detected spots: {analysisResult.detectedPlaces.join(', ')}
                    </Text>
                  </View>
                )}

                {analysisResult.bestTimeToVisit && (
                  <View style={styles.insightItemRow}>
                    <Clock size={13} color={AppColors.textMuted} />
                    <Text style={styles.insightItemText}>
                      Recommended time: {analysisResult.bestTimeToVisit}
                    </Text>
                  </View>
                )}

                {analysisResult.vibeTags?.length > 0 && (
                  <View style={styles.vibeChipsContainer}>
                    {analysisResult.vibeTags.map((tag, i) => (
                      <View key={i} style={styles.vibeChip}>
                        <Text style={styles.vibeChipText}>#{tag}</Text>
                      </View>
                    ))}
                  </View>
                )}
              </View>

              {/* Zero-Tolerance Policy Reminder */}
              <View style={styles.safetyReminderBox}>
                <ShieldCheck size={16} color={AppColors.success} />
                <Text style={styles.safetyReminderText}>
                  Zero-Tolerance Content Safety: Your submission will enter pending moderation. Unapproved content is never shown to other travelers.
                </Text>
              </View>

              {/* Action Buttons */}
              <TouchableOpacity
                style={[styles.primaryCtaBtn, isProcessing && styles.btnDisabled]}
                onPress={handleConfirmSubmit}
                disabled={isProcessing}
                activeOpacity={0.85}
              >
                <Text style={styles.primaryCtaBtnText}>Submit for Moderation Review</Text>
                <ArrowRight size={18} color={AppColors.textOnPrimary} />
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.secondaryCtaBtn}
                onPress={handleReset}
                activeOpacity={0.8}
              >
                <RotateCcw size={15} color={AppColors.textSecondary} />
                <Text style={styles.secondaryCtaBtnText}>Edit or Enter Different URL</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* ════════════════════════════════════════════════════════════════
              STEP E: SUBMISSION CONFIRMATION
             ════════════════════════════════════════════════════════════════ */}
          {stage === 'confirmation' && (
            <View style={styles.resultContainer}>
              <View style={styles.successIconBox}>
                <ShieldCheck size={44} color={AppColors.success} />
              </View>

              <Text style={styles.successTitle}>
                Your travel Reel has been submitted for review.
              </Text>

              <Text style={styles.successDesc}>
                Under Tourbhook's zero-tolerance content safety policy, your video is now in the review queue. It will appear on the{' '}
                <Text style={styles.boldText}>
                  {userConfirmedDestination || analysisResult?.detectedDestination}
                </Text>{' '}
                page once approved by our moderation team.
              </Text>

              <View style={styles.submissionDetailsCard}>
                <View style={styles.subDetailRow}>
                  <Text style={styles.subDetailLabel}>Destination:</Text>
                  <Text style={styles.subDetailValue}>
                    {userConfirmedDestination || analysisResult?.detectedDestination}
                  </Text>
                </View>

                <View style={styles.subDetailRow}>
                  <Text style={styles.subDetailLabel}>Catalog Status:</Text>
                  <Text style={styles.subDetailValue}>
                    {isNewCandidateSubmitted
                      ? 'New destination candidate'
                      : 'Linked to existing guide'}
                  </Text>
                </View>

                <View style={styles.subDetailRow}>
                  <Text style={styles.subDetailLabel}>Moderation Status:</Text>
                  <View style={styles.pendingBadge}>
                    <Text style={styles.pendingBadgeText}>Pending Approval</Text>
                  </View>
                </View>

                {submissionId ? (
                  <View style={styles.subDetailRow}>
                    <Text style={styles.subDetailLabel}>Reference ID:</Text>
                    <Text style={styles.subDetailMuted}>{submissionId}</Text>
                  </View>
                ) : null}
              </View>

              <TouchableOpacity
                style={styles.primaryCtaBtn}
                onPress={() => navigation.goBack()}
                activeOpacity={0.85}
              >
                <Text style={styles.primaryCtaBtnText}>Done — Back to Explore</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.secondaryCtaBtn}
                onPress={handleReset}
                activeOpacity={0.8}
              >
                <Text style={styles.secondaryCtaBtnText}>Share Another Reel</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* ════════════════════════════════════════════════════════════════
              REJECTION / SAFETY NOTICE STATE
             ════════════════════════════════════════════════════════════════ */}
          {stage === 'rejected' && (
            <View style={styles.resultContainer}>
              <View style={styles.rejectedIconBox}>
                <ShieldAlert size={44} color={AppColors.error} />
              </View>

              <Text style={styles.rejectedTitle}>Moderation Policy Notice</Text>

              <Text style={styles.rejectedDesc}>
                This video did not pass our automated content safety standards (commercial advertising, spam, or restricted content). Under Tourbhook's zero-tolerance policy, unverified content is never displayed to travelers.
              </Text>

              <TouchableOpacity
                style={styles.secondaryCtaBtn}
                onPress={handleReset}
                activeOpacity={0.85}
              >
                <RotateCcw size={15} color={AppColors.textSecondary} />
                <Text style={styles.secondaryCtaBtnText}>Try Another Video Link</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* ERROR STATE */}
          {stage === 'error' && (
            <View style={styles.resultContainer}>
              <View style={styles.rejectedIconBox}>
                <AlertCircle size={44} color={AppColors.warning} />
              </View>

              <Text style={styles.rejectedTitle}>Processing Unavailable</Text>

              <Text style={styles.rejectedDesc}>
                We were unable to extract details from this video link. Please verify the URL is public and accessible, or try again in a moment.
              </Text>

              <TouchableOpacity
                style={styles.primaryCtaBtn}
                onPress={handleReset}
                activeOpacity={0.85}
              >
                <RotateCcw size={15} color={AppColors.textOnPrimary} />
                <Text style={styles.primaryCtaBtnText}>Retry Submission</Text>
              </TouchableOpacity>
            </View>
          )}
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
  flex1: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FAF7F2',
    borderBottomWidth: 1,
    borderBottomColor: '#EAE5DC',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: AppColors.textPrimary,
  },
  placeholder: {
    width: 40,
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 40,
  },
  titleWrap: {
    marginBottom: 20,
  },
  pageSubtitle: {
    fontSize: 22,
    fontWeight: '900',
    color: AppColors.textPrimary,
    letterSpacing: -0.4,
    marginBottom: 6,
  },
  pageExplanation: {
    fontSize: 13,
    color: AppColors.textSecondary,
    lineHeight: 19,
  },
  contextHintBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#E0F2FE',
    paddingHorizontal: 12,
    paddingVertical: 9,
    borderRadius: 12,
    marginBottom: 16,
  },
  contextHintText: {
    fontSize: 12,
    color: AppColors.primaryDark,
    fontWeight: '600',
    flex: 1,
  },

  /* ── STEP A INPUT STYLES ────────────────────────────────────────── */
  stepContainer: {
    gap: 16,
  },
  inputWrapper: {
    marginBottom: 6,
  },
  inputLabelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  inputLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: AppColors.textPrimary,
  },
  platformBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  platformBadgeText: {
    color: AppColors.white,
    fontSize: 10,
    fontWeight: '800',
  },
  inputBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: AppColors.surface,
    borderWidth: 1,
    borderColor: '#EAE5DC',
    borderRadius: 16,
    paddingHorizontal: 14,
    height: 52,
    shadowColor: AppColors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 1,
  },
  inputBoxError: {
    borderColor: AppColors.error,
  },
  input: {
    flex: 1,
    marginLeft: 10,
    fontSize: 14,
    color: AppColors.textPrimary,
  },
  captionBox: {
    height: 72,
    alignItems: 'flex-start',
    paddingVertical: 10,
  },
  errorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginTop: 6,
    paddingLeft: 4,
  },
  errorText: {
    fontSize: 12,
    color: AppColors.error,
    fontWeight: '600',
  },

  /* Quick samples */
  samplesCard: {
    backgroundColor: AppColors.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#EAE5DC',
    padding: 14,
  },
  samplesTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: AppColors.textSecondary,
    marginBottom: 10,
    textTransform: 'uppercase',
    letterSpacing: 0.3,
  },
  sampleItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F5F0E8',
  },
  sampleText: {
    fontSize: 12,
    fontWeight: '600',
    color: AppColors.textPrimary,
    flex: 1,
  },

  /* CTA Buttons */
  primaryCtaBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: AppColors.primary,
    height: 52,
    borderRadius: 18,
    marginTop: 8,
    shadowColor: AppColors.primary,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 3,
  },
  primaryCtaBtnText: {
    fontSize: 15,
    fontWeight: '800',
    color: AppColors.textOnPrimary,
  },
  secondaryCtaBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: AppColors.surface,
    borderWidth: 1,
    borderColor: '#EAE5DC',
    height: 48,
    borderRadius: 16,
    marginTop: 10,
  },
  secondaryCtaBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: AppColors.textSecondary,
  },
  btnDisabled: {
    opacity: 0.6,
  },

  /* ── STEP B PROCESSING STYLES ──────────────────────────────────── */
  processingCard: {
    backgroundColor: AppColors.surface,
    borderRadius: 22,
    padding: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#EAE5DC',
    shadowColor: AppColors.black,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  spinner: {
    marginBottom: 14,
  },
  processingHeading: {
    fontSize: 19,
    fontWeight: '900',
    color: AppColors.textPrimary,
    marginBottom: 4,
  },
  processingSub: {
    fontSize: 13,
    color: AppColors.textMuted,
    textAlign: 'center',
    marginBottom: 22,
  },
  stepsList: {
    width: '100%',
    gap: 12,
    marginBottom: 20,
  },
  stepRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  stepText: {
    fontSize: 13,
    color: AppColors.textMuted,
    fontWeight: '500',
  },
  stepTextActive: {
    color: AppColors.textPrimary,
    fontWeight: '700',
  },
  honestNoticeBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#F5F0E8',
    padding: 10,
    borderRadius: 10,
    width: '100%',
  },
  honestNoticeText: {
    fontSize: 11,
    color: AppColors.textSecondary,
    lineHeight: 15,
    flex: 1,
  },

  /* ── STEP C & D REVIEW STYLES ──────────────────────────────────── */
  reviewContainer: {
    gap: 16,
  },
  videoPreviewCard: {
    flexDirection: 'row',
    backgroundColor: AppColors.surface,
    borderRadius: 18,
    padding: 12,
    borderWidth: 1,
    borderColor: '#EAE5DC',
    gap: 12,
  },
  previewThumbnail: {
    width: 90,
    height: 120,
    borderRadius: 12,
    backgroundColor: '#10243F',
  },
  previewInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  previewPlatformTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: AppColors.textPrimary,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    alignSelf: 'flex-start',
    marginBottom: 6,
  },
  previewPlatformText: {
    color: AppColors.white,
    fontSize: 9,
    fontWeight: '700',
  },
  previewTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: AppColors.textPrimary,
    lineHeight: 19,
    marginBottom: 4,
  },
  previewCreator: {
    fontSize: 12,
    color: AppColors.textMuted,
    fontWeight: '500',
  },

  /* Destination match card */
  destinationMatchCard: {
    backgroundColor: AppColors.surface,
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: '#EAE5DC',
  },
  destMatchHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 14,
  },
  destIconBadge: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#E0F2FE',
    justifyContent: 'center',
    alignItems: 'center',
  },
  destHeaderTexts: {
    flex: 1,
  },
  destSectionEyebrow: {
    fontSize: 11,
    fontWeight: '700',
    color: AppColors.textMuted,
    textTransform: 'uppercase',
  },
  destDisplayRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  destMainName: {
    fontSize: 17,
    fontWeight: '900',
    color: AppColors.textPrimary,
  },
  destEditToggle: {
    padding: 4,
  },
  destEditRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 4,
  },
  destEditInput: {
    flex: 1,
    height: 36,
    backgroundColor: '#F5F0E8',
    borderRadius: 8,
    paddingHorizontal: 8,
    fontSize: 14,
    fontWeight: '700',
    color: AppColors.textPrimary,
  },
  destSaveBtn: {
    width: 36,
    height: 36,
    borderRadius: 8,
    backgroundColor: AppColors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  confidencePill: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  confidencePillText: {
    fontSize: 11,
    fontWeight: '800',
  },
  confidenceHigh: {
    backgroundColor: '#ECFDF5',
  },
  confidenceHighText: {
    color: AppColors.success,
    fontSize: 11,
    fontWeight: '800',
  },
  confidenceModerate: {
    backgroundColor: '#FFFBEB',
  },
  confidenceModerateText: {
    color: AppColors.warningDark,
    fontSize: 11,
    fontWeight: '800',
  },

  /* Match Notice Box */
  matchNoticeBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    backgroundColor: '#F0FDF4',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#BBF7D0',
  },
  matchNoticeNew: {
    backgroundColor: '#FFF7ED',
    borderColor: '#FFEDD5',
  },
  matchNoticeAmbiguous: {
    backgroundColor: '#FFFBEB',
    borderColor: '#FDE68A',
  },
  matchNoticeTexts: {
    flex: 1,
  },
  matchNoticeTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: AppColors.successDark,
    marginBottom: 2,
  },
  matchNoticeDesc: {
    fontSize: 12,
    color: AppColors.textSecondary,
    lineHeight: 17,
  },
  boldText: {
    fontWeight: '800',
    color: AppColors.textPrimary,
  },

  /* Insights card */
  insightsCard: {
    backgroundColor: AppColors.surface,
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: '#EAE5DC',
    gap: 10,
  },
  insightsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  insightsTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: AppColors.textPrimary,
  },
  insightsSummary: {
    fontSize: 13,
    color: AppColors.textSecondary,
    lineHeight: 19,
  },
  insightItemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  insightItemText: {
    fontSize: 12,
    color: AppColors.textPrimary,
    fontWeight: '600',
  },
  vibeChipsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: 4,
  },
  vibeChip: {
    backgroundColor: '#F5F0E8',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  vibeChipText: {
    fontSize: 11,
    fontWeight: '700',
    color: AppColors.primary,
  },
  safetyReminderBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#ECFDF5',
    padding: 12,
    borderRadius: 12,
  },
  safetyReminderText: {
    fontSize: 11,
    color: AppColors.successDark,
    lineHeight: 16,
    flex: 1,
    fontWeight: '600',
  },

  /* ── STEP E CONFIRMATION STYLES ────────────────────────────────── */
  resultContainer: {
    backgroundColor: AppColors.surface,
    borderRadius: 22,
    padding: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#EAE5DC',
    shadowColor: AppColors.black,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  successIconBox: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#ECFDF5',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  successTitle: {
    fontSize: 20,
    fontWeight: '900',
    color: AppColors.textPrimary,
    textAlign: 'center',
    marginBottom: 10,
    letterSpacing: -0.3,
  },
  successDesc: {
    fontSize: 13,
    color: AppColors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 20,
  },
  submissionDetailsCard: {
    width: '100%',
    backgroundColor: '#FAF7F2',
    borderRadius: 14,
    padding: 14,
    gap: 10,
    marginBottom: 20,
  },
  subDetailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  subDetailLabel: {
    fontSize: 12,
    color: AppColors.textMuted,
    fontWeight: '600',
  },
  subDetailValue: {
    fontSize: 13,
    color: AppColors.textPrimary,
    fontWeight: '800',
  },
  subDetailMuted: {
    fontSize: 11,
    color: AppColors.textMuted,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  pendingBadge: {
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  pendingBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#D97706',
  },

  /* ── REJECTION STYLES ─────────────────────────────────────────── */
  rejectedIconBox: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#FEF2F2',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  rejectedTitle: {
    fontSize: 19,
    fontWeight: '900',
    color: AppColors.error,
    textAlign: 'center',
    marginBottom: 8,
  },
  rejectedDesc: {
    fontSize: 13,
    color: AppColors.textSecondary,
    textAlign: 'center',
    lineHeight: 19,
    marginBottom: 20,
  },
});
