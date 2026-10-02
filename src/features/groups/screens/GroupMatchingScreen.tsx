import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Svg, { Path, Circle, Rect, G, Text as SvgText } from 'react-native-svg';
import {
  X,
  LayoutGrid,
  Mountain,
  Landmark,
  Utensils,
  Palmtree,
  ChevronRight,
  Users,
  ShieldCheck,
  TrendingUp,
  Flame,
} from 'lucide-react-native';
import { AppStackParamList } from '../../../core/navigation/types';
import { BottomNavBar } from '../../../core/components/BottomNavBar';
import { SkeletonBlock } from '../../../core/components/SkeletonBlock';
import { EmptyState } from '../../../core/components/EmptyState';
import { ErrorState } from '../../../core/components/ErrorState';
import { AppColors } from '../../../core/theme/colors';
import { CATEGORY_FILTERS, CategoryFilter, TravelGroup } from '../types/groupTypes';
import { useGroupMatches } from '../hooks/useGroupMatches';
import { useVerificationStatus } from '../hooks/useVerificationStatus';

/**
 * Torii Gate / Culture SVG Icon
 */
const ToriiCultureIcon = ({ size = 32, color = '#EA580C' }: { size?: number; color?: string }) => (
  <Svg width={size} height={size} viewBox="0 0 32 32" fill="none">
    <Path
      d="M3 8 C10 6.5, 22 6.5, 29 8"
      stroke={color}
      strokeWidth="2.5"
      strokeLinecap="round"
    />
    <Path
      d="M5 12 L27 12"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
    />
    <Path
      d="M10 8 L10 26 M22 8 L22 26"
      stroke={color}
      strokeWidth="2.5"
      strokeLinecap="round"
    />
    <Path
      d="M16 8 L16 12"
      stroke={color}
      strokeWidth="1.8"
      strokeLinecap="round"
    />
  </Svg>
);

/**
 * Header Decorative Travel & Community Graphic
 */
const GroupsHeaderGraphic = () => (
  <View style={styles.headerGraphicContainer} pointerEvents="none">
    <Svg width="160" height="130" viewBox="0 0 160 130" fill="none">
      {/* Soft organic cloud / map shape */}
      <Path
        d="M20 50 C40 10, 110 5, 145 25 C170 45, 155 95, 130 115 C100 135, 45 125, 25 105 C5 85, 0 65, 20 50 Z"
        fill="#E2F1F8"
        opacity={0.7}
      />

      {/* Dashed flight curve */}
      <Path
        d="M 35 100 C 65 70, 95 60, 140 30"
        stroke="#0E7490"
        strokeWidth="1.5"
        strokeDasharray="4 4"
        strokeOpacity={0.5}
        fill="none"
      />

      {/* Location Pin */}
      <Circle cx="45" cy="48" r="14" fill="#FFE8E2" opacity={0.85} />
      <Circle cx="45" cy="48" r="6" fill="#0E7490" />

      {/* Speech sticker */}
      <G transform="translate(85, 38)">
        <Rect
          x="0"
          y="0"
          width="62"
          height="54"
          rx="12"
          fill="#FFFFFF"
          stroke="#E5E0D8"
          strokeWidth="1"
        />
        <SvgText
          x="31"
          y="18"
          fontSize="9"
          fontWeight="bold"
          fill="#3B4D63"
          textAnchor="middle"
        >
          Meet
        </SvgText>
        <SvgText
          x="31"
          y="30"
          fontSize="9"
          fontWeight="bold"
          fill="#3B4D63"
          textAnchor="middle"
        >
          Explore
        </SvgText>
        <SvgText
          x="31"
          y="42"
          fontSize="9"
          fontWeight="bold"
          fill="#3B4D63"
          textAnchor="middle"
        >
          Share
        </SvgText>
      </G>

      {/* Accent sparks */}
      <Path
        d="M148 45 L152 42 M154 50 L158 50 M150 56 L154 59"
        stroke="#0E7490"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeOpacity={0.6}
      />
    </Svg>
  </View>
);

function SkeletonGroupCard() {
  return (
    <View style={styles.groupCard}>
      <SkeletonBlock style={styles.skeletonPanel} />
      <View style={styles.groupRightCol}>
        <SkeletonBlock style={styles.skeletonTitle} />
        <SkeletonBlock style={styles.skeletonSubtitle} />
        <View style={styles.skeletonAvatarRow}>
          <SkeletonBlock style={styles.skeletonAvatar} />
          <SkeletonBlock style={styles.skeletonAvatar} />
          <SkeletonBlock style={styles.skeletonAvatar} />
        </View>
        <View style={styles.skeletonTagRow}>
          <SkeletonBlock style={styles.skeletonTagSmall} />
          <SkeletonBlock style={styles.skeletonTagLarge} />
        </View>
      </View>
    </View>
  );
}

export default function GroupMatchingScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<AppStackParamList, 'GroupMatching'>>();

  const [activeCategory, setActiveCategory] = useState<CategoryFilter>('All');
  const { groups, isLoading, isError, retry, joinedGroupIds, joinGroup } = useGroupMatches(activeCategory);
  const verificationStatus = useVerificationStatus();

  // Helper to render Category Panel Icon & Styling
  const renderCategoryPanel = (group: TravelGroup) => {
    const isBeach =
      group.categoryLabel === 'BEACH' ||
      group.tags.some((t) => t.toLowerCase() === 'beach') ||
      group.categories.includes('beach');
    const isCulture =
      group.categoryLabel === 'CULTURE' ||
      group.tags.some((t) => t.toLowerCase() === 'culture') ||
      group.categories.includes('culture');
    const isAdventure =
      group.categoryLabel === 'ADVENTURE' ||
      group.tags.some((t) => t.toLowerCase() === 'adventure') ||
      group.categories.includes('adventure');
    const isFood =
      group.categoryLabel === 'FOOD' ||
      group.tags.some((t) => t.toLowerCase() === 'food') ||
      group.categories.includes('food');

    if (isBeach) {
      return (
        <View style={[styles.categoryPanel, { backgroundColor: '#DCFCE7' }]}>
          <Palmtree size={34} color="#059669" />
          <Text style={[styles.categoryPanelLabel, { color: '#059669' }]}>BEACH</Text>
        </View>
      );
    }
    if (isCulture) {
      return (
        <View style={[styles.categoryPanel, { backgroundColor: '#FFEDD5' }]}>
          <ToriiCultureIcon size={34} color="#EA580C" />
          <Text style={[styles.categoryPanelLabel, { color: '#EA580C' }]}>CULTURE</Text>
        </View>
      );
    }
    if (isAdventure) {
      return (
        <View style={[styles.categoryPanel, { backgroundColor: '#E0F2FE' }]}>
          <Mountain size={34} color="#0284C7" />
          <Text style={[styles.categoryPanelLabel, { color: '#0284C7' }]}>ADVENTURE</Text>
        </View>
      );
    }
    if (isFood) {
      return (
        <View style={[styles.categoryPanel, { backgroundColor: '#FEF3C7' }]}>
          <Utensils size={34} color="#D97706" />
          <Text style={[styles.categoryPanelLabel, { color: '#D97706' }]}>FOOD</Text>
        </View>
      );
    }

    // Default fallback
    return (
      <View style={[styles.categoryPanel, { backgroundColor: '#E0F2FE' }]}>
        <Mountain size={34} color="#0284C7" />
        <Text style={[styles.categoryPanelLabel, { color: '#0284C7' }]}>
          {group.tags[0]?.toUpperCase() || 'TRAVEL'}
        </Text>
      </View>
    );
  };

  // Helper to render Tag pill
  const renderTagPill = (tag: string) => {
    const t = tag.toLowerCase();
    let bg = '#E0F2FE';
    let color = '#0284C7';

    if (t === 'beach') {
      bg = '#DCFCE7';
      color = '#059669';
    } else if (t === 'adventure') {
      bg = '#E0F2FE';
      color = '#0284C7';
    } else if (t === 'culture') {
      bg = '#F3E8FF';
      color = '#7C3AED';
    } else if (t === 'food') {
      bg = '#FFEDD5';
      color = '#EA580C';
    }

    return (
      <View key={tag} style={[styles.tagPill, { backgroundColor: bg }]}>
        <Text style={[styles.tagPillText, { color }]}>{tag}</Text>
      </View>
    );
  };

  // Helper to render initial avatars
  const renderAvatarInitials = (group: TravelGroup) => {
    const initials = group.memberInitials || ['A', 'B', 'C'];
    const colorSchemes = [
      { bg: '#FFE4E6', text: '#E11D48' },
      { bg: '#E0F2FE', text: '#0284C7' },
      { bg: '#F3E8FF', text: '#7C3AED' },
      { bg: '#DCFCE7', text: '#059669' },
      { bg: '#FFEDD5', text: '#EA580C' },
    ];

    const overflowCount = Math.max(1, group.memberCount - initials.length);

    return (
      <View style={styles.avatarStackRow}>
        {initials.slice(0, 3).map((letter, idx) => {
          const scheme = colorSchemes[idx % colorSchemes.length];
          return (
            <View
              key={`${group.id}-initial-${idx}`}
              style={[styles.initialCircle, { backgroundColor: scheme.bg }]}
            >
              <Text style={[styles.initialLetter, { color: scheme.text }]}>{letter}</Text>
            </View>
          );
        })}
        {/* Group user icon */}
        <View style={styles.groupUserCircle}>
          <Users size={12} color={AppColors.textMuted} />
        </View>
        {/* Overflow indicator */}
        <Text style={styles.overflowText}>+{overflowCount}</Text>
        {/* Count */}
        <Text style={styles.memberCountText}>
          {group.memberCount}/{group.maxMembers} members
        </Text>
      </View>
    );
  };

  const renderGroupCard = (group: TravelGroup) => {
    const isJoined = joinedGroupIds.includes(group.id);

    return (
      <View key={group.id} style={styles.groupCard}>
        {/* Left Category Icon Panel */}
        {renderCategoryPanel(group)}

        {/* Right Content Area */}
        <View style={styles.groupRightCol}>
          {/* Top Title & Status Badge */}
          <View style={styles.groupHeaderRow}>
            <Text style={styles.groupName} numberOfLines={1}>
              {group.name}
            </Text>

            {group.statusType === 'popular' && (
              <View style={[styles.statusBadge, { backgroundColor: '#FFF1EE' }]}>
                <Flame size={11} color={AppColors.accent} />
                <Text style={[styles.statusBadgeText, { color: AppColors.accent }]}>Popular</Text>
              </View>
            )}

            {group.statusType === 'active' && (
              <View style={[styles.statusBadge, { backgroundColor: '#DCFCE7' }]}>
                <View style={styles.greenDot} />
                <Text style={[styles.statusBadgeText, { color: '#16A34A' }]}>Active</Text>
              </View>
            )}

            {group.statusType === 'trending' && (
              <View style={[styles.statusBadge, { backgroundColor: '#E0F2FE' }]}>
                <TrendingUp size={11} color="#0284C7" />
                <Text style={[styles.statusBadgeText, { color: '#0284C7' }]}>Trending</Text>
              </View>
            )}
          </View>

          {/* Description */}
          <Text style={styles.groupDesc} numberOfLines={2}>
            {group.description || 'Exploring together with fellow travelers 🌍'}
          </Text>

          {/* Member Avatars & Count */}
          {renderAvatarInitials(group)}

          {/* Bottom Tags & Navigation Arrow */}
          <View style={styles.cardBottomRow}>
            <View style={styles.tagsContainer}>
              {group.tags.map((tag) => renderTagPill(tag))}
            </View>

            <TouchableOpacity
              style={[styles.arrowButton, isJoined && styles.arrowButtonJoined]}
              activeOpacity={0.8}
              onPress={() => joinGroup(group.id)}
            >
              <ChevronRight size={18} color={isJoined ? AppColors.success : AppColors.primary} />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* ── SCREEN TOP CLOSE BUTTON ──────────────────────────────── */}
        <TouchableOpacity
          style={styles.closeBtn}
          onPress={() => navigation.goBack()}
          activeOpacity={0.7}
        >
          <X size={24} color={AppColors.textPrimary} />
        </TouchableOpacity>

        {/* ── HERO HEADER AREA ─────────────────────────────────────── */}
        <View style={styles.heroSection}>
          <View style={styles.heroTextCol}>
            <Text style={styles.eyebrowText}>TRAVEL TOGETHER</Text>
            <Text style={styles.heroHeading}>Find Your{'\n'}Travel Group</Text>
            <Text style={styles.heroDescription}>
              Join communities of travelers who share{'\n'}your interests and destinations.
            </Text>
          </View>
          <GroupsHeaderGraphic />
        </View>

        {/* ── CATEGORY FILTERS ROW ─────────────────────────────────── */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterRow}
        >
          {CATEGORY_FILTERS.map((category) => {
            const isActive = category === activeCategory;
            return (
              <TouchableOpacity
                key={category}
                style={[styles.filterChip, isActive && styles.filterChipActive]}
                onPress={() => setActiveCategory(category)}
                activeOpacity={0.8}
              >
                {category === 'All' && (
                  <LayoutGrid
                    size={14}
                    color={isActive ? AppColors.white : AppColors.textPrimary}
                  />
                )}
                {category === 'Adventure' && (
                  <Mountain
                    size={14}
                    color={isActive ? AppColors.white : AppColors.textPrimary}
                  />
                )}
                {category === 'Culture' && (
                  <Landmark
                    size={14}
                    color={isActive ? AppColors.white : AppColors.textPrimary}
                  />
                )}
                {category === 'Food' && (
                  <Utensils
                    size={14}
                    color={isActive ? AppColors.white : AppColors.textPrimary}
                  />
                )}
                {category === 'Beach' && (
                  <Palmtree
                    size={14}
                    color={isActive ? AppColors.white : AppColors.textPrimary}
                  />
                )}

                <Text style={[styles.filterChipText, isActive && styles.filterChipTextActive]}>
                  {category}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* ── GROUPS LIST OR SKELETON / ERROR ──────────────────────── */}
        {isError ? (
          <ErrorState message="We couldn't load groups. Try again." onRetry={retry} />
        ) : isLoading ? (
          <>
            <SkeletonGroupCard />
            <SkeletonGroupCard />
            <SkeletonGroupCard />
          </>
        ) : groups.length === 0 ? (
          <EmptyState icon="🧭" message="No travel groups found for this category." />
        ) : (
          groups.map(renderGroupCard)
        )}

        {/* ── VERIFICATION STATUS CARD ─────────────────────────────── */}
        <View style={styles.verificationCard}>
          <View style={styles.verificationIconBox}>
            <ShieldCheck size={26} color={AppColors.white} />
          </View>

          <View style={styles.verificationTextCol}>
            <Text style={styles.verificationEyebrow}>VERIFICATION STATUS</Text>
            <Text style={styles.verificationTitle}>
              {verificationStatus === 'verified'
                ? 'Verified Profile'
                : verificationStatus === 'rejected'
                ? 'Verification Needed'
                : 'Pending Verification'}
            </Text>
            <Text style={styles.verificationSubtitle}>
              {verificationStatus === 'verified'
                ? 'Your profile is verified. You can now join groups and connect with travelers.'
                : verificationStatus === 'rejected'
                ? 'Please complete document verification to join groups.'
                : 'Your profile is currently under review.'}
            </Text>
          </View>

          <View style={styles.verifiedPill}>
            <Text style={styles.verifiedPillText}>✓ Verified</Text>
          </View>
        </View>
      </ScrollView>

      {/* ── BOTTOM NAVIGATION ────────────────────────────────────── */}
      <BottomNavBar active="groups" />
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
    paddingBottom: 24,
  },
  closeBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'flex-start',
    marginTop: 4,
  },

  /* ── HERO HEADER ───────────────────────────────────────────────── */
  heroSection: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginTop: 6,
    marginBottom: 16,
    position: 'relative',
  },
  heroTextCol: {
    flex: 1,
    paddingRight: 6,
  },
  eyebrowText: {
    fontSize: 11,
    fontWeight: '700',
    color: AppColors.textMuted,
    letterSpacing: 1.2,
    marginBottom: 4,
  },
  heroHeading: {
    fontSize: 32,
    fontWeight: '900',
    color: AppColors.textPrimary,
    letterSpacing: -0.8,
    lineHeight: 38,
    marginBottom: 8,
  },
  heroDescription: {
    fontSize: 13,
    color: AppColors.textMuted,
    lineHeight: 20,
  },
  headerGraphicContainer: {
    width: 140,
    height: 120,
    alignItems: 'flex-end',
    justifyContent: 'center',
    marginTop: -10,
  },

  /* ── FILTER PILLS ──────────────────────────────────────────────── */
  filterRow: {
    flexDirection: 'row',
    gap: 8,
    paddingBottom: 18,
  },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: AppColors.surface,
    borderWidth: 1,
    borderColor: '#EAE5DC',
  },
  filterChipActive: {
    backgroundColor: AppColors.primary,
    borderColor: AppColors.primary,
  },
  filterChipText: {
    fontSize: 12,
    fontWeight: '600',
    color: AppColors.textPrimary,
  },
  filterChipTextActive: {
    color: AppColors.white,
    fontWeight: '700',
  },

  /* ── GROUP CARDS ───────────────────────────────────────────────── */
  groupCard: {
    flexDirection: 'row',
    backgroundColor: AppColors.surface,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: '#EAE5DC',
    padding: 12,
    marginBottom: 14,
    shadowColor: AppColors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  categoryPanel: {
    width: 96,
    height: 128,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
    marginRight: 12,
  },
  categoryPanelLabel: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1.2,
  },
  groupRightCol: {
    flex: 1,
    justifyContent: 'space-between',
    paddingVertical: 2,
  },
  groupHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  groupName: {
    fontSize: 16,
    fontWeight: '800',
    color: AppColors.textPrimary,
    flex: 1,
    letterSpacing: -0.2,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
    marginLeft: 6,
  },
  statusBadgeText: {
    fontSize: 11,
    fontWeight: '700',
  },
  greenDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#16A34A',
  },
  groupDesc: {
    fontSize: 12,
    color: AppColors.textMuted,
    lineHeight: 16,
    marginTop: 2,
    marginBottom: 6,
  },

  /* ── AVATARS ROW ───────────────────────────────────────────────── */
  avatarStackRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  initialCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 4,
  },
  initialLetter: {
    fontSize: 10,
    fontWeight: '800',
  },
  groupUserCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#F1F5F9',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 4,
  },
  overflowText: {
    fontSize: 11,
    fontWeight: '600',
    color: AppColors.textMuted,
    marginRight: 6,
  },
  memberCountText: {
    fontSize: 11,
    color: AppColors.textMuted,
    fontWeight: '500',
  },

  /* ── CARD BOTTOM ROW ───────────────────────────────────────────── */
  cardBottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  tagsContainer: {
    flexDirection: 'row',
    gap: 6,
    flex: 1,
    flexWrap: 'wrap',
  },
  tagPill: {
    paddingHorizontal: 9,
    paddingVertical: 3,
    borderRadius: 8,
  },
  tagPillText: {
    fontSize: 11,
    fontWeight: '700',
  },
  arrowButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#E0F2FE',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  arrowButtonJoined: {
    backgroundColor: '#DCFCE7',
  },

  /* ── VERIFICATION STATUS CARD ──────────────────────────────────── */
  verificationCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ECFDF5',
    borderRadius: 22,
    borderWidth: 1,
    borderColor: '#BBF7D0',
    padding: 16,
    marginTop: 10,
    marginBottom: 16,
  },
  verificationIconBox: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#10B981',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  verificationTextCol: {
    flex: 1,
  },
  verificationEyebrow: {
    fontSize: 10,
    fontWeight: '800',
    color: '#059669',
    letterSpacing: 1.0,
    marginBottom: 2,
  },
  verificationTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: AppColors.textPrimary,
    marginBottom: 2,
  },
  verificationSubtitle: {
    fontSize: 11,
    color: '#047857',
    lineHeight: 15,
  },
  verifiedPill: {
    backgroundColor: '#047857',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 14,
    marginLeft: 8,
  },
  verifiedPillText: {
    fontSize: 11,
    fontWeight: '700',
    color: AppColors.white,
  },

  /* ── SKELETON STYLES ───────────────────────────────────────────── */
  skeletonPanel: {
    width: 96,
    height: 128,
    borderRadius: 18,
    marginRight: 12,
  },
  skeletonTitle: {
    width: '60%',
    height: 16,
    marginBottom: 8,
  },
  skeletonSubtitle: {
    width: '90%',
    height: 12,
    marginBottom: 10,
  },
  skeletonAvatarRow: {
    flexDirection: 'row',
    gap: 4,
    marginBottom: 10,
  },
  skeletonAvatar: {
    width: 22,
    height: 22,
    borderRadius: 11,
  },
  skeletonTagRow: {
    flexDirection: 'row',
    gap: 6,
  },
  skeletonTagSmall: {
    width: 50,
    height: 20,
    borderRadius: 8,
  },
  skeletonTagLarge: {
    width: 70,
    height: 20,
    borderRadius: 8,
  },
});