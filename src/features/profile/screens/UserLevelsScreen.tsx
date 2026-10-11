import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import Svg, { Defs, LinearGradient, Stop, Rect } from 'react-native-svg';
import {
  ChevronLeft,
  X,
  Trophy,
  Lock,
  Check,
  Footprints,
  Compass,
  Award,
  Globe,
  Crown,
} from 'lucide-react-native';
import { AppColors } from '../../../core/theme/colors';
import { useAuth } from '../../../core/auth/AuthContext';
import { useSubscription } from '../data/subscriptionStore';
import { useItineraryState } from '../../trips/data/itineraryStore';
import {
  calculateUserLevelProgress,
  USER_LEVEL_TIERS,
  UserLevelTier,
} from '../data/userLevelStore';

// Level icons matching each explorer tier
const LEVEL_ICONS: Record<string, React.ComponentType<{ size?: number; color?: string }>> = {
  wanderer: Footprints,
  explorer: Compass,
  adventurer: Award,
  globetrotter: Globe,
  legend: Crown,
};

export default function UserLevelsScreen() {
  const navigation = useNavigation();
  const { user } = useAuth();
  const { isPremium } = useSubscription();
  const { itineraries } = useItineraryState();

  const tripCount = Array.isArray(itineraries) ? itineraries.length : 0;
  const levelProgress = calculateUserLevelProgress(tripCount, user, isPremium);

  // Find index of current user tier for unlocked/locked status comparisons
  const currentTierIndex = USER_LEVEL_TIERS.findIndex(
    (tier) => tier.id === levelProgress.currentTier.id
  );

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      {/* 1. Header */}
      <View style={styles.header}>
        <TouchableOpacity
          testID="back-button"
          onPress={() => navigation.goBack()}
          style={styles.headerButton}
          accessibilityRole="button"
          accessibilityLabel="Back"
          hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
        >
          <ChevronLeft size={24} color={AppColors.textPrimary} />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>User Levels</Text>

        <TouchableOpacity
          testID="close-button"
          onPress={() => navigation.goBack()}
          style={styles.headerButton}
          accessibilityRole="button"
          accessibilityLabel="Close"
          hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
        >
          <X size={22} color={AppColors.textPrimary} />
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* 2. Prominent Current Level Card */}
        <View style={styles.currentCard}>
          {/* Subtle vibrant background gradient */}
          <Svg
            height="100%"
            width="100%"
            style={StyleSheet.absoluteFill}
            pointerEvents="none"
          >
            <Defs>
              <LinearGradient id="currentCardGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <Stop offset="0%" stopColor="#FF4A68" />
                <Stop offset="100%" stopColor="#FF7A8A" />
              </LinearGradient>
            </Defs>
            <Rect width="100%" height="100%" rx={20} fill="url(#currentCardGrad)" />
          </Svg>

          {/* Top Row: Label, Name & Trophy Icon */}
          <View style={styles.cardTopRow}>
            <View style={styles.cardTitleContainer}>
              <Text style={styles.cardSubLabel}>Your Current Level</Text>
              <Text testID="current-level-name" style={styles.cardLevelName} numberOfLines={1}>
                {levelProgress.currentLevelName}
              </Text>
            </View>
            <View style={styles.trophyBadge}>
              <Trophy size={22} color="#FFFFFF" />
            </View>
          </View>

          {/* Middle Row: Progress percentage & bar */}
          <View style={styles.progressSection}>
            <View style={styles.progressLabelRow}>
              <Text style={styles.progressLabel}>Progress to next level</Text>
              <Text testID="progress-percent" style={styles.progressPercentText}>
                {`${levelProgress.progressPercent}%`}
              </Text>
            </View>

            <View style={styles.progressBarTrack}>
              <View
                style={[
                  styles.progressBarFill,
                  { width: `${Math.min(100, Math.max(0, levelProgress.progressPercent))}%` },
                ]}
              />
            </View>
          </View>

          {/* Requirement / Next Level Helper Subtext */}
          <Text testID="next-level-message" style={styles.nextLevelRequirement} numberOfLines={2}>
            {levelProgress.nextLevelMessage}
          </Text>
        </View>

        {/* 3. All Levels Section */}
        <View style={styles.allLevelsSection}>
          <Text style={styles.sectionHeading}>All Levels</Text>

          <View style={styles.levelsList}>
            {USER_LEVEL_TIERS.map((tier: UserLevelTier, index: number) => {
              const isCurrent = tier.id === levelProgress.currentTier.id;
              const isAchieved = index < currentTierIndex;
              const isLocked = !isCurrent && !isAchieved;

              const TierIconComponent = LEVEL_ICONS[tier.id] || Trophy;

              return (
                <View
                  key={tier.id}
                  style={[
                    styles.levelCard,
                    isCurrent ? styles.levelCardCurrent : styles.levelCardNeutral,
                  ]}
                  accessibilityRole="text"
                  accessibilityLabel={`${tier.name} level, ${tier.rangeLabel}${
                    isCurrent ? ', current level' : isLocked ? ', locked' : ', completed'
                  }`}
                >
                  {/* Left Icon Badge */}
                  <View
                    style={[
                      styles.tierIconBadge,
                      { backgroundColor: tier.iconBg },
                    ]}
                  >
                    <TierIconComponent size={20} color={tier.iconColor} />
                  </View>

                  {/* Level Details */}
                  <View style={styles.tierDetails}>
                    <View style={styles.tierNameRow}>
                      <Text
                        style={[
                          styles.tierName,
                          isCurrent && styles.tierNameCurrent,
                        ]}
                        numberOfLines={1}
                      >
                        {tier.name}
                      </Text>

                      {isCurrent && (
                        <View testID="current-badge" style={styles.currentBadge}>
                          <Text style={styles.currentBadgeText}>CURRENT</Text>
                        </View>
                      )}

                      {isLocked && (
                        <Lock
                          size={13}
                          color={AppColors.textMuted}
                          style={styles.lockIcon}
                        />
                      )}

                      {isAchieved && (
                        <Check
                          size={14}
                          color={AppColors.success}
                          style={styles.checkIcon}
                        />
                      )}
                    </View>

                    <Text style={styles.tierRangeText}>{tier.rangeLabel}</Text>
                  </View>
                </View>
              );
            })}
          </View>
        </View>
      </ScrollView>
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
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: AppColors.surface,
    borderBottomWidth: 1,
    borderBottomColor: AppColors.borderLight,
  },
  headerButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: AppColors.textPrimary,
    textAlign: 'center',
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 36,
  },
  currentCard: {
    borderRadius: 20,
    padding: 20,
    backgroundColor: '#FF516A',
    overflow: 'hidden',
    shadowColor: '#FF4A68',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 3,
  },
  cardTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  cardTitleContainer: {
    flex: 1,
    paddingRight: 12,
  },
  cardSubLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: 'rgba(255, 255, 255, 0.85)',
    letterSpacing: 0.2,
  },
  cardLevelName: {
    fontSize: 26,
    fontWeight: '700',
    color: '#FFFFFF',
    marginTop: 4,
    letterSpacing: -0.3,
  },
  trophyBadge: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: 'rgba(255, 255, 255, 0.22)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressSection: {
    marginTop: 18,
  },
  progressLabelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  progressLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: 'rgba(255, 255, 255, 0.88)',
  },
  progressPercentText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  progressBarTrack: {
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 3,
    backgroundColor: '#FFFFFF',
  },
  nextLevelRequirement: {
    fontSize: 12,
    fontWeight: '500',
    color: 'rgba(255, 255, 255, 0.95)',
    marginTop: 10,
    lineHeight: 16,
  },
  allLevelsSection: {
    marginTop: 24,
  },
  sectionHeading: {
    fontSize: 18,
    fontWeight: '700',
    color: AppColors.textPrimary,
    marginBottom: 12,
  },
  levelsList: {
    gap: 10,
  },
  levelCard: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 16,
  },
  levelCardNeutral: {
    backgroundColor: AppColors.surface,
    borderWidth: 1,
    borderColor: AppColors.borderLight,
  },
  levelCardCurrent: {
    backgroundColor: '#FFF0F3',
    borderWidth: 1.5,
    borderColor: '#FF4A68',
  },
  tierIconBadge: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  tierDetails: {
    flex: 1,
  },
  tierNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  tierName: {
    fontSize: 16,
    fontWeight: '700',
    color: AppColors.textPrimary,
  },
  tierNameCurrent: {
    color: AppColors.textPrimary,
  },
  currentBadge: {
    backgroundColor: '#FF2E55',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    marginLeft: 8,
  },
  currentBadgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  lockIcon: {
    marginLeft: 6,
  },
  checkIcon: {
    marginLeft: 6,
  },
  tierRangeText: {
    fontSize: 13,
    fontWeight: '500',
    color: AppColors.textMuted,
    marginTop: 3,
  },
});