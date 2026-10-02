import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Svg, {
  Defs,
  LinearGradient,
  Stop,
  Rect,
  Circle,
  Path,
  G,
} from 'react-native-svg';
import {
  X,
  CheckCircle2,
  Sparkles,
  ShieldCheck,
  Video,
  RefreshCw,
  LogOut,
  ChevronRight,
  Info,
  Layers,
  ArrowRight,
  ExternalLink,
  Play,
  User,
} from 'lucide-react-native';
import { InstagramIcon } from '../components/SocialIcons';
import { AppStackParamList } from '../../../core/navigation/types';
import { InstagramService } from '../services/instagramService';
import { InstagramConnectionState } from '../types/ugcTypes';
import { AppColors } from '../../../core/theme/colors';

/**
 * Official Instagram Gradient Badge
 * Accurately represents the official Instagram brand asset with vibrant gradient & glyph
 */
const OfficialInstagramGradientBadge = ({ size = 76 }: { size?: number }) => {
  const glyphSize = size * 0.52;
  const strokeW = Math.max(2, glyphSize * 0.08);
  const cornerR = glyphSize * 0.28;
  const centerR = glyphSize * 0.24;
  const dotR = glyphSize * 0.06;

  return (
    <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} fill="none">
      <Defs>
        <LinearGradient id="igGrad" x1="0%" y1="100%" x2="100%" y2="0%">
          <Stop offset="0%" stopColor="#FFDC80" />
          <Stop offset="20%" stopColor="#FCAF45" />
          <Stop offset="40%" stopColor="#F77737" />
          <Stop offset="65%" stopColor="#E1306C" />
          <Stop offset="85%" stopColor="#C13584" />
          <Stop offset="100%" stopColor="#833AB4" />
        </LinearGradient>
      </Defs>
      <Circle cx={size / 2} cy={size / 2} r={size / 2} fill="url(#igGrad)" />

      {/* Official White Instagram Camera Glyph */}
      <G transform={`translate(${(size - glyphSize) / 2}, ${(size - glyphSize) / 2})`}>
        <Rect
          x={strokeW / 2}
          y={strokeW / 2}
          width={glyphSize - strokeW}
          height={glyphSize - strokeW}
          rx={cornerR}
          ry={cornerR}
          stroke="#FFFFFF"
          strokeWidth={strokeW}
          fill="none"
        />
        <Circle
          cx={glyphSize / 2}
          cy={glyphSize / 2}
          r={centerR}
          stroke="#FFFFFF"
          strokeWidth={strokeW}
          fill="none"
        />
        <Circle
          cx={glyphSize - glyphSize * 0.22}
          cy={glyphSize * 0.22}
          r={dotR}
          fill="#FFFFFF"
        />
      </G>
    </Svg>
  );
};

/**
 * Travel Hero Scenic Illustration (Backdrop for disconnected state)
 */
const TravelHeroBackdrop = () => (
  <View style={styles.heroBackdropContainer} pointerEvents="none">
    <Svg width="100%" height="150" viewBox="0 0 360 150" fill="none">
      {/* Soft warm sun */}
      <Circle cx="290" cy="40" r="28" fill="#FDE68A" opacity={0.45} />
      
      {/* Soft landscape hills */}
      <Path
        d="M-20 130 C60 100 120 125 180 105 C240 85 300 115 380 95 L380 150 L-20 150 Z"
        fill="#E2F1F8"
        opacity={0.5}
      />
      <Path
        d="M-20 140 C80 120 160 135 240 120 C300 110 340 125 380 115 L380 150 L-20 150 Z"
        fill="#F0F7FA"
        opacity={0.8}
      />

      {/* Airplane flight path & plane */}
      <Path
        d="M 50 80 C 70 70, 95 65, 118 45"
        stroke="#0E7490"
        strokeWidth="1.5"
        strokeDasharray="4 4"
        strokeOpacity={0.6}
        fill="none"
      />
      <G transform="translate(112, 38) rotate(-22)">
        <Path
          d="M0 0 L8 3 L12 0 L10 5 L14 7 L10 8 L9 12 L7 8 L2 9 L4 6 Z"
          fill="#0E7490"
          opacity={0.85}
        />
      </G>

      {/* Subtle palm & villa silhouette on right */}
      <Path
        d="M330 110 C325 95 320 80 328 65"
        stroke="#0E7490"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeOpacity={0.3}
      />
      <Path
        d="M328 65 C320 60 305 65 300 75 M328 65 C325 52 315 48 308 55 M328 65 C335 50 345 52 350 60 M328 65 C340 62 355 70 355 80"
        stroke="#0E7490"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeOpacity={0.35}
        fill="none"
      />
    </Svg>
  </View>
);

export default function InstagramConnectScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<AppStackParamList>>();

  const [state, setState] = useState<InstagramConnectionState>(() =>
    InstagramService.getConnectionState()
  );
  const [isConnecting, setIsConnecting] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);

  const handleConnect = async () => {
    setIsConnecting(true);
    try {
      const newState = await InstagramService.connectInstagram();
      setState(newState);
      Alert.alert(
        'Instagram Connected!',
        `Successfully linked @${newState.profile?.username}. Your approved travel Reels are now synchronized.`
      );
    } catch {
      Alert.alert('Connection Failed', 'Could not connect to Instagram. Please try again.');
    } finally {
      setIsConnecting(false);
    }
  };

  const handleDisconnect = () => {
    Alert.alert(
      'Disconnect Instagram Account?',
      'Your previously synced travel Reels will remain in draft review. You can reconnect anytime.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Disconnect',
          style: 'destructive',
          onPress: async () => {
            const newState = await InstagramService.disconnectInstagram();
            setState(newState);
          },
        },
      ]
    );
  };

  const handleSyncReels = async () => {
    setIsSyncing(true);
    await new Promise((resolve) => setTimeout(() => resolve(undefined), 800));
    setIsSyncing(false);
    Alert.alert('Reels Synchronized', 'All recent travel Reels are up to date and passed to moderation.');
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      {/* ── TOP HEADER ────────────────────────────────────────────── */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.closeBtn}
          onPress={() => navigation.goBack()}
          activeOpacity={0.7}
          accessibilityLabel="Close Instagram Connection"
        >
          <X size={24} color={AppColors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Instagram Connection</Text>
        <View style={styles.headerPlaceholder} />
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {!state.isConnected ? (
          /* ── STATE 1: NOT CONNECTED ONBOARDING ──────────────────────────── */
          <View style={styles.notConnectedContainer}>
            {/* Scenic Travel Backdrop */}
            <TravelHeroBackdrop />

            {/* Instagram Hero Branding */}
            <View style={styles.heroSection}>
              {/* Outer soft glow ring */}
              <View style={styles.glowRing}>
                {/* Accent spark rays */}
                <View style={styles.sparkleTopRight} />
                <View style={styles.sparkleTopRight2} />
                <OfficialInstagramGradientBadge size={84} />
              </View>

              <Text style={styles.heroTitle}>Connect Your Instagram</Text>
              <Text style={styles.heroSubtitle}>
                Seamlessly sync and showcase your travel Reels, stories, and recommendations directly within Tourbhook itineraries.
              </Text>
            </View>

            {/* Feature Benefit Cards Container */}
            <View style={styles.benefitCardsCard}>
              {/* CARD 1: Auto-Sync */}
              <View style={styles.benefitRow}>
                <View style={[styles.benefitIconBox, { backgroundColor: '#E0F2FE' }]}>
                  <Video size={20} color={AppColors.primary} />
                </View>
                <View style={styles.benefitTextCol}>
                  <Text style={styles.benefitHeading}>Auto-Sync Travel Reels</Text>
                  <Text style={styles.benefitDescription}>
                    Import your public destination Reels without manually uploading video files.
                  </Text>
                </View>
              </View>

              <View style={styles.cardDivider} />

              {/* CARD 2: AI Destination Association */}
              <View style={styles.benefitRow}>
                <View style={[styles.benefitIconBox, { backgroundColor: '#F3E8FF' }]}>
                  <Sparkles size={20} color="#7C3AED" />
                </View>
                <View style={styles.benefitTextCol}>
                  <Text style={styles.benefitHeading}>AI Destination Association</Text>
                  <Text style={styles.benefitDescription}>
                    Smart analysis automatically tags landmark venues, secret spots, and sunset timings.
                  </Text>
                </View>
              </View>

              <View style={styles.cardDivider} />

              {/* CARD 3: Content Safety */}
              <View style={styles.benefitRow}>
                <View style={[styles.benefitIconBox, { backgroundColor: '#FFE8E2' }]}>
                  <ShieldCheck size={20} color={AppColors.accent} />
                </View>
                <View style={styles.benefitTextCol}>
                  <Text style={styles.benefitHeading}>Zero-Tolerance Content Safety</Text>
                  <Text style={styles.benefitDescription}>
                    All submitted videos undergo strict moderation before being surfaced to fellow travelers.
                  </Text>
                </View>
              </View>
            </View>

            {/* Privacy Note */}
            <View style={styles.privacyRow}>
              <View style={styles.privacyIconBox}>
                <Info size={14} color="#0284C7" />
              </View>
              <Text style={styles.privacyText}>
                Tourbhook only accesses your public travel Reels. We will never post or modify anything on your account.
              </Text>
            </View>

            {/* Primary Connect CTA */}
            <TouchableOpacity
              style={styles.primaryCtaBtn}
              onPress={handleConnect}
              disabled={isConnecting}
              activeOpacity={0.88}
            >
              {isConnecting ? (
                <>
                  <ActivityIndicator color={AppColors.white} size="small" />
                  <Text style={styles.primaryCtaText}>Connecting to Instagram...</Text>
                </>
              ) : (
                <>
                  <InstagramIcon size={22} color={AppColors.white} />
                  <Text style={styles.primaryCtaText}>Connect with Instagram</Text>
                  <ArrowRight size={20} color={AppColors.white} />
                </>
              )}
            </TouchableOpacity>
          </View>
        ) : (
          /* ── STATE 2: CONNECTED PROFILE DASHBOARD ───────────────────────── */
          <View style={styles.connectedContainer}>
            {/* Profile Card */}
            <View style={styles.profileCard}>
              <View style={styles.profileTopRow}>
                {/* Avatar with Instagram Badge */}
                <View style={styles.avatarContainer}>
                  {state.profile?.profilePicUrl ? (
                    <Image
                      source={{ uri: state.profile.profilePicUrl }}
                      style={styles.profileAvatar}
                    />
                  ) : (
                    <View style={styles.profileAvatarFallback}>
                      <Text style={styles.avatarFallbackText}>
                        {state.profile?.fullName?.[0] || 'M'}
                      </Text>
                    </View>
                  )}
                  <View style={styles.profileInstaBadge}>
                    <OfficialInstagramGradientBadge size={20} />
                  </View>
                </View>

                {/* Profile Identity & Status */}
                <View style={styles.profileIdentityCol}>
                  <View style={styles.nameRow}>
                    <Text style={styles.profileFullName} numberOfLines={1}>
                      {state.profile?.fullName || 'Mani | Travel Explorer'}
                    </Text>
                    {state.profile?.isVerified && (
                      <CheckCircle2 size={16} color="#0284C7" style={styles.verifiedIcon} />
                    )}
                  </View>

                  <Text style={styles.profileUsername}>
                    @{state.profile?.username || 'wanderlust_mani'}
                  </Text>

                  <View style={styles.verifiedStatusBadge}>
                    <View style={styles.statusGreenDot} />
                    <Text style={styles.statusBadgeText}>Connected & Verified</Text>
                  </View>
                </View>

                {/* View Profile Action */}
                <TouchableOpacity
                  style={styles.viewProfileBtn}
                  activeOpacity={0.7}
                  onPress={() =>
                    Alert.alert(
                      'Instagram Profile',
                      `Viewing @${state.profile?.username || 'wanderlust_mani'} on Instagram.`
                    )
                  }
                >
                  <Text style={styles.viewProfileText}>View Profile</Text>
                  <ExternalLink size={13} color={AppColors.textPrimary} />
                </TouchableOpacity>
              </View>

              {/* Profile Bio */}
              <Text style={styles.profileBio}>
                {state.profile?.bio ||
                  'Exploring hidden cafes, scenic sunset points, and local gems across Europe & Asia ✈️🌍'}
              </Text>

              {/* Horizontal Statistics Row */}
              <View style={styles.statsContainer}>
                {/* Stat 1: Synced Reels */}
                <View style={styles.statCol}>
                  <View style={[styles.statIconBadge, { backgroundColor: '#FFE8E2' }]}>
                    <Play size={13} color={AppColors.accent} fill={AppColors.accent} />
                  </View>
                  <View style={styles.statTextCol}>
                    <Text style={styles.statNumber}>{state.profile?.reelsCount || 14}</Text>
                    <Text style={styles.statSubLabel}>Synced Reels</Text>
                  </View>
                </View>

                <View style={styles.statVerticalDivider} />

                {/* Stat 2: Moderation Pass */}
                <View style={styles.statCol}>
                  <View style={[styles.statIconBadge, { backgroundColor: '#ECFDF5' }]}>
                    <ShieldCheck size={14} color={AppColors.success} />
                  </View>
                  <View style={styles.statTextCol}>
                    <Text style={styles.statNumber}>100%</Text>
                    <Text style={styles.statSubLabel}>Moderation Pass</Text>
                  </View>
                </View>

                <View style={styles.statVerticalDivider} />

                {/* Stat 3: Account Status */}
                <View style={styles.statCol}>
                  <View style={[styles.statIconBadge, { backgroundColor: '#E0F2FE' }]}>
                    <User size={14} color="#0284C7" />
                  </View>
                  <View style={styles.statTextCol}>
                    <Text style={styles.statNumber}>Active</Text>
                    <Text style={styles.statSubLabel}>Account Status</Text>
                  </View>
                </View>
              </View>
            </View>

            {/* ── MANAGE YOUR SYNC SECTION ───────────────────────── */}
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Manage Your Sync</Text>
              <Text style={styles.sectionSubtitle}>
                Keep your travel content in sync with Tourbhook.
              </Text>
            </View>

            {/* Action Card 1: View Synced Reels */}
            <TouchableOpacity
              style={styles.actionCard}
              activeOpacity={0.75}
              onPress={() => navigation.navigate('TripDetails', { tripId: '1' })}
            >
              <View style={[styles.actionIconCircle, { backgroundColor: '#E0F2FE' }]}>
                <Layers size={20} color={AppColors.primary} />
              </View>
              <View style={styles.actionDetailsCol}>
                <Text style={styles.actionTitleText}>View Synced Destination Reels</Text>
                <Text style={styles.actionSubText}>
                  Browse your approved Reels in Tourbhook itineraries.
                </Text>
              </View>
              <View style={styles.actionChevronCircle}>
                <ChevronRight size={16} color={AppColors.textMuted} />
              </View>
            </TouchableOpacity>

            {/* Action Card 2: Sync Recent Reels */}
            <TouchableOpacity
              style={styles.actionCard}
              activeOpacity={0.75}
              onPress={handleSyncReels}
              disabled={isSyncing}
            >
              <View style={[styles.actionIconCircle, { backgroundColor: '#DCFCE7' }]}>
                {isSyncing ? (
                  <ActivityIndicator size="small" color={AppColors.success} />
                ) : (
                  <RefreshCw size={19} color={AppColors.success} />
                )}
              </View>
              <View style={styles.actionDetailsCol}>
                <Text style={styles.actionTitleText}>
                  {isSyncing ? 'Syncing Reels...' : 'Sync Recent Reels'}
                </Text>
                <Text style={styles.actionSubText}>
                  Fetch the latest public Reels from your profile.
                </Text>
              </View>
              <View style={styles.actionChevronCircle}>
                <ChevronRight size={16} color={AppColors.textMuted} />
              </View>
            </TouchableOpacity>

            {/* ── CONNECTION BENEFITS SECTION ────────────────────── */}
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Connection Benefits</Text>
              <Text style={styles.sectionSubtitle}>
                Your Instagram content works for your travels.
              </Text>
            </View>

            <View style={styles.connectedBenefitsContainer}>
              {/* Benefit 1 */}
              <View style={styles.connBenefitItem}>
                <Video size={20} color={AppColors.accent} />
                <Text style={styles.connBenefitTitle}>Auto-sync</Text>
                <Text style={styles.connBenefitSub}>travel Reels</Text>
              </View>

              <View style={styles.connBenefitDivider} />

              {/* Benefit 2 */}
              <View style={styles.connBenefitItem}>
                <Sparkles size={20} color="#8B5CF6" />
                <Text style={styles.connBenefitTitle}>AI tags</Text>
                <Text style={styles.connBenefitSub}>destinations</Text>
              </View>

              <View style={styles.connBenefitDivider} />

              {/* Benefit 3 */}
              <View style={styles.connBenefitItem}>
                <ShieldCheck size={20} color={AppColors.success} />
                <Text style={styles.connBenefitTitle}>Safe &</Text>
                <Text style={styles.connBenefitSub}>moderated</Text>
              </View>
            </View>

            {/* ── DISCONNECT INSTAGRAM ACTION ─────────────────────── */}
            <TouchableOpacity
              style={styles.destructiveDisconnectBtn}
              onPress={handleDisconnect}
              activeOpacity={0.8}
            >
              <LogOut size={18} color={AppColors.error} />
              <Text style={styles.destructiveDisconnectText}>
                Disconnect Instagram Account
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FAF7F2',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: '#FAF7F2',
  },
  closeBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: AppColors.textPrimary,
    letterSpacing: -0.2,
  },
  headerPlaceholder: {
    width: 40,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },

  /* ── NOT CONNECTED HERO ────────────────────────────────────────── */
  notConnectedContainer: {
    alignItems: 'center',
    position: 'relative',
  },
  heroBackdropContainer: {
    position: 'absolute',
    top: -10,
    left: -20,
    right: -20,
    height: 150,
  },
  heroSection: {
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 20,
  },
  glowRing: {
    width: 108,
    height: 108,
    borderRadius: 54,
    backgroundColor: '#FFF1F2',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 18,
    position: 'relative',
    shadowColor: '#E1306C',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.18,
    shadowRadius: 16,
    elevation: 4,
  },
  sparkleTopRight: {
    position: 'absolute',
    top: 6,
    right: 10,
    width: 10,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: '#E1306C',
    transform: [{ rotate: '45deg' }],
  },
  sparkleTopRight2: {
    position: 'absolute',
    top: 18,
    right: -2,
    width: 10,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: '#E1306C',
    transform: [{ rotate: '15deg' }],
  },
  heroTitle: {
    fontSize: 25,
    fontWeight: '800',
    color: AppColors.textPrimary,
    textAlign: 'center',
    marginBottom: 8,
    letterSpacing: -0.4,
  },
  heroSubtitle: {
    fontSize: 14,
    color: AppColors.textMuted,
    textAlign: 'center',
    lineHeight: 21,
    paddingHorizontal: 12,
  },

  /* ── BENEFIT CARDS ─────────────────────────────────────────────── */
  benefitCardsCard: {
    width: '100%',
    backgroundColor: AppColors.surface,
    borderRadius: 22,
    paddingVertical: 18,
    paddingHorizontal: 18,
    borderWidth: 1,
    borderColor: '#EAE5DC',
    marginBottom: 16,
    shadowColor: AppColors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 10,
    elevation: 2,
  },
  benefitRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 14,
    paddingVertical: 2,
  },
  benefitIconBox: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 2,
  },
  benefitTextCol: {
    flex: 1,
  },
  benefitHeading: {
    fontSize: 15,
    fontWeight: '700',
    color: AppColors.textPrimary,
    marginBottom: 4,
    letterSpacing: -0.2,
  },
  benefitDescription: {
    fontSize: 13,
    color: AppColors.textSecondary,
    lineHeight: 18,
  },
  cardDivider: {
    height: 1,
    backgroundColor: '#F3EFE8',
    marginVertical: 14,
  },

  /* ── PRIVACY ROW ───────────────────────────────────────────────── */
  privacyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 6,
    marginBottom: 24,
  },
  privacyIconBox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#E0F2FE',
    justifyContent: 'center',
    alignItems: 'center',
  },
  privacyText: {
    flex: 1,
    fontSize: 12,
    color: AppColors.textMuted,
    lineHeight: 17,
  },

  /* ── PRIMARY CTA ───────────────────────────────────────────────── */
  primaryCtaBtn: {
    width: '100%',
    height: 54,
    borderRadius: 27,
    backgroundColor: AppColors.primary,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
    shadowColor: AppColors.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.28,
    shadowRadius: 12,
    elevation: 4,
  },
  primaryCtaText: {
    color: AppColors.white,
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: -0.1,
  },

  /* ── CONNECTED STATE STYLES ────────────────────────────────────── */
  connectedContainer: {
    paddingTop: 6,
  },
  profileCard: {
    backgroundColor: AppColors.surface,
    borderRadius: 24,
    padding: 20,
    borderWidth: 1,
    borderColor: '#EAE5DC',
    shadowColor: AppColors.black,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 2,
    marginBottom: 8,
  },
  profileTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarContainer: {
    position: 'relative',
    marginRight: 12,
  },
  profileAvatar: {
    width: 58,
    height: 58,
    borderRadius: 29,
    borderWidth: 2,
    borderColor: '#FCE7F3',
  },
  profileAvatarFallback: {
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: '#FCE7F3',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarFallbackText: {
    fontSize: 22,
    fontWeight: '800',
    color: '#DB2777',
  },
  profileInstaBadge: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: AppColors.white,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileIdentityCol: {
    flex: 1,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 2,
  },
  profileFullName: {
    fontSize: 16,
    fontWeight: '700',
    color: AppColors.textPrimary,
    letterSpacing: -0.2,
  },
  verifiedIcon: {
    marginTop: 1,
  },
  profileUsername: {
    fontSize: 13,
    color: AppColors.textMuted,
    fontWeight: '500',
    marginBottom: 6,
  },
  verifiedStatusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
    alignSelf: 'flex-start',
  },
  statusGreenDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: AppColors.success,
  },
  statusBadgeText: {
    fontSize: 11,
    fontWeight: '600',
    color: AppColors.success,
  },
  viewProfileBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#D4CFC6',
    backgroundColor: '#FAF7F2',
  },
  viewProfileText: {
    fontSize: 12,
    fontWeight: '600',
    color: AppColors.textPrimary,
  },
  profileBio: {
    fontSize: 13,
    color: AppColors.textSecondary,
    lineHeight: 19,
    marginTop: 14,
    marginBottom: 16,
  },

  /* ── PROFILE STATS ─────────────────────────────────────────────── */
  statsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FAF7F2',
    borderRadius: 16,
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderWidth: 1,
    borderColor: '#EFECE6',
  },
  statCol: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  statIconBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statTextCol: {
    alignItems: 'flex-start',
  },
  statNumber: {
    fontSize: 14,
    fontWeight: '800',
    color: AppColors.textPrimary,
    lineHeight: 17,
  },
  statSubLabel: {
    fontSize: 10,
    color: AppColors.textMuted,
    fontWeight: '500',
  },
  statVerticalDivider: {
    width: 1,
    height: 26,
    backgroundColor: '#E5E0D8',
  },

  /* ── SECTION HEADERS ───────────────────────────────────────────── */
  sectionHeader: {
    marginTop: 22,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: AppColors.textPrimary,
    marginBottom: 2,
    letterSpacing: -0.3,
  },
  sectionSubtitle: {
    fontSize: 13,
    color: AppColors.textMuted,
  },

  /* ── ACTION CARDS ──────────────────────────────────────────────── */
  actionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: AppColors.surface,
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: '#EAE5DC',
    marginBottom: 12,
    shadowColor: AppColors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 8,
    elevation: 1,
  },
  actionIconCircle: {
    width: 44,
    height: 44,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  actionDetailsCol: {
    flex: 1,
  },
  actionTitleText: {
    fontSize: 14,
    fontWeight: '700',
    color: AppColors.textPrimary,
    marginBottom: 3,
  },
  actionSubText: {
    fontSize: 12,
    color: AppColors.textMuted,
    lineHeight: 16,
  },
  actionChevronCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#F6F1E8',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },

  /* ── CONNECTED BENEFITS ────────────────────────────────────────── */
  connectedBenefitsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF7F5',
    borderRadius: 18,
    paddingVertical: 14,
    paddingHorizontal: 8,
    borderWidth: 1,
    borderColor: '#FFE4DE',
    marginBottom: 16,
  },
  connBenefitItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  connBenefitTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: AppColors.textPrimary,
    marginTop: 6,
  },
  connBenefitSub: {
    fontSize: 11,
    color: AppColors.textMuted,
    marginTop: 1,
  },
  connBenefitDivider: {
    width: 1,
    height: 32,
    backgroundColor: '#FFE0D8',
  },

  /* ── DESTRUCTIVE DISCONNECT BUTTON ─────────────────────────────── */
  destructiveDisconnectBtn: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    height: 52,
    borderRadius: 16,
    backgroundColor: '#FFF5F5',
    borderWidth: 1,
    borderColor: '#FECACA',
    marginTop: 8,
  },
  destructiveDisconnectText: {
    color: AppColors.error,
    fontWeight: '700',
    fontSize: 15,
  },
});

