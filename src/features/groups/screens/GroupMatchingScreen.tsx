import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Share,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Svg, { Path, Circle, Rect, G, Text as SvgText } from 'react-native-svg';
import {
  LayoutGrid,
  Mountain,
  Landmark,
  Utensils,
  Palmtree,
  Trees,
  Footprints,
  Camera,
  Car,
  Backpack,
  ChevronRight,
  Users,
  TrendingUp,
  Flame,
  Search,
  X,
  Plus,
  Share2,
} from 'lucide-react-native';
import { AppStackParamList } from '../../../core/navigation/types';
import { BottomNavBar } from '../../../core/components/BottomNavBar';
import { SkeletonBlock } from '../../../core/components/SkeletonBlock';
import { EmptyState } from '../../../core/components/EmptyState';
import { ErrorState } from '../../../core/components/ErrorState';
import { AppColors } from '../../../core/theme/colors';
import { CATEGORY_FILTERS, CategoryFilter, TravelGroup } from '../types/groupTypes';
import { useGroupMatches } from '../hooks/useGroupMatches';
import { GroupAccessBadges } from '../components/GroupAccessBadges';
import { buildGroupShareContent } from '../utils/groupAccess';

const PAGE_SIZE = 4;

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
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const [sharingGroupId, setSharingGroupId] = useState<string | null>(null);

  // Hook returns all groups and joined status
  const { groups: categoryGroups, isLoading, isError, retry, isJoined } = useGroupMatches(activeCategory);

  // Filter groups by search query
  const filteredGroups = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) {
      return categoryGroups;
    }

    return categoryGroups.filter((group) => {
      const matchName = group.name.toLowerCase().includes(query);
      const matchDesc = group.description ? group.description.toLowerCase().includes(query) : false;
      const matchLocation = group.location ? group.location.toLowerCase().includes(query) : false;
      const matchTags = group.tags.some((tag) => tag.toLowerCase().includes(query));
      const matchCategories = group.categories.some((cat) => cat.toLowerCase().includes(query));
      const matchCategoryLabel = group.categoryLabel ? group.categoryLabel.toLowerCase().includes(query) : false;

      return (
        matchName ||
        matchDesc ||
        matchLocation ||
        matchTags ||
        matchCategories ||
        matchCategoryLabel
      );
    });
  }, [categoryGroups, searchQuery]);

  // Paginated slice
  const displayedGroups = useMemo(() => {
    return filteredGroups.slice(0, page * PAGE_SIZE);
  }, [filteredGroups, page]);

  const hasMoreGroups = displayedGroups.length < filteredGroups.length;

  const handleShareGroup = async (group: TravelGroup) => {
    if (sharingGroupId) return;
    const shareContent = buildGroupShareContent(group);
    if (!shareContent) {
      Alert.alert(
        'Invite link unavailable',
        'This group does not have a shareable invitation link yet.',
      );
      return;
    }
    setSharingGroupId(group.id);
    try {
      await Share.share(shareContent);
    } catch {
      Alert.alert('Unable to share', 'Please try sharing this group again.');
    } finally {
      setSharingGroupId(null);
    }
  };

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
    const isNature =
      group.categoryLabel === 'NATURE' ||
      group.tags.some((t) => t.toLowerCase() === 'nature') ||
      group.categories.includes('nature');
    const isHiking =
      group.categoryLabel === 'HIKING' ||
      group.tags.some((t) => t.toLowerCase() === 'hiking') ||
      group.categories.includes('hiking');
    const isPhotography =
      group.categoryLabel === 'PHOTOGRAPHY' ||
      group.tags.some((t) => t.toLowerCase() === 'photography') ||
      group.categories.includes('photography');
    const isRoadTrips =
      group.categoryLabel === 'ROAD TRIPS' ||
      group.tags.some((t) => t.toLowerCase().includes('road trip')) ||
      group.categories.some((c) => c.includes('road trip'));
    const isBackpacking =
      group.categoryLabel === 'BACKPACKING' ||
      group.tags.some((t) => t.toLowerCase().includes('backpack')) ||
      group.categories.some((c) => c.includes('backpack'));

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
    if (isNature) {
      return (
        <View style={[styles.categoryPanel, { backgroundColor: '#DCFCE7' }]}>
          <Trees size={34} color="#16A34A" />
          <Text style={[styles.categoryPanelLabel, { color: '#16A34A' }]}>NATURE</Text>
        </View>
      );
    }
    if (isHiking) {
      return (
        <View style={[styles.categoryPanel, { backgroundColor: '#CCFBF1' }]}>
          <Footprints size={34} color="#0D9488" />
          <Text style={[styles.categoryPanelLabel, { color: '#0D9488' }]}>HIKING</Text>
        </View>
      );
    }
    if (isPhotography) {
      return (
        <View style={[styles.categoryPanel, { backgroundColor: '#EDE9FE' }]}>
          <Camera size={34} color="#8B5CF6" />
          <Text style={[styles.categoryPanelLabel, { color: '#8B5CF6' }]}>PHOTO</Text>
        </View>
      );
    }
    if (isRoadTrips) {
      return (
        <View style={[styles.categoryPanel, { backgroundColor: '#FFE4E6' }]}>
          <Car size={34} color="#E11D48" />
          <Text style={[styles.categoryPanelLabel, { color: '#E11D48' }]}>ROAD TRIP</Text>
        </View>
      );
    }
    if (isBackpacking) {
      return (
        <View style={[styles.categoryPanel, { backgroundColor: '#EEF2FF' }]}>
          <Backpack size={34} color="#6366F1" />
          <Text style={[styles.categoryPanelLabel, { color: '#6366F1' }]}>BACKPACK</Text>
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
    } else if (t === 'nature') {
      bg = '#DCFCE7';
      color = '#16A34A';
    } else if (t === 'hiking') {
      bg = '#CCFBF1';
      color = '#0D9488';
    } else if (t === 'photography' || t === 'photo') {
      bg = '#EDE9FE';
      color = '#8B5CF6';
    } else if (t === 'road trips' || t === 'road trip' || t === 'roadtrips') {
      bg = '#FFE4E6';
      color = '#E11D48';
    } else if (t === 'backpacking' || t === 'backpacker') {
      bg = '#EEF2FF';
      color = '#6366F1';
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
    const joined = isJoined(group.id);

    return (
      <TouchableOpacity
        key={group.id}
        style={styles.groupCard}
        activeOpacity={0.9}
        onPress={() => navigation.navigate('GroupDetails', { groupId: group.id })}
        testID={`matching-group-card-${group.id}`}
      >
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
          <GroupAccessBadges group={group} />

          {/* Member Avatars & Count */}
          {renderAvatarInitials(group)}

          {/* Bottom Tags & Actions */}
          <View style={styles.cardBottomRow}>
            <View style={styles.tagsContainer}>
              {group.tags.map((tag) => renderTagPill(tag))}
            </View>

            <View style={styles.cardActionsRow}>
              {/* Share Group Button */}
              <TouchableOpacity
                style={styles.shareIconButton}
                activeOpacity={0.7}
                disabled={sharingGroupId === group.id}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                onPress={(e) => {
                  e.stopPropagation();
                  handleShareGroup(group);
                }}
              >
                {sharingGroupId === group.id ? (
                  <ActivityIndicator size="small" color={AppColors.primary} />
                ) : (
                  <Share2 size={16} color={AppColors.textSecondary} />
                )}
              </TouchableOpacity>

              {/* View / Chat Navigation Arrow */}
              <TouchableOpacity
                style={[styles.arrowButton, joined && styles.arrowButtonJoined]}
                activeOpacity={0.8}
                onPress={() => {
                  if (joined) {
                    navigation.navigate('GroupChat', { groupId: group.id });
                  } else {
                    navigation.navigate('GroupDetails', { groupId: group.id });
                  }
                }}
              >
                <ChevronRight size={18} color={joined ? AppColors.success : AppColors.primary} />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* ── HERO HEADER AREA (NO CLOSE BUTTON) ───────────────────── */}
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

        {/* ── SEARCH INPUT ─────────────────────────────────────────── */}
        <View style={styles.searchContainer}>
          <Search size={18} color={AppColors.textMuted} style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search groups by name, destination or interest"
            placeholderTextColor={AppColors.textMuted}
            value={searchQuery}
            onChangeText={(text) => {
              setSearchQuery(text);
              setPage(1); // Reset pagination on search
            }}
            returnKeyType="search"
            autoCapitalize="none"
            autoCorrect={false}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity
              style={styles.clearSearchBtn}
              onPress={() => {
                setSearchQuery('');
                setPage(1);
              }}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <X size={16} color={AppColors.textMuted} />
            </TouchableOpacity>
          )}
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
                onPress={() => {
                  setActiveCategory(category);
                  setPage(1); // Reset pagination on category change
                }}
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

        {/* ── GROUPS LIST OR SKELETON / ERROR / EMPTY ─────────────── */}
        {isError ? (
          <ErrorState message="We couldn't load groups. Try again." onRetry={retry} />
        ) : isLoading ? (
          <>
            <SkeletonGroupCard />
            <SkeletonGroupCard />
            <SkeletonGroupCard />
          </>
        ) : filteredGroups.length === 0 ? (
          <View style={styles.emptyWrap}>
            <EmptyState
              icon="🧭"
              message={
                searchQuery.trim()
                  ? `No groups match "${searchQuery.trim()}". Try a different keyword or category.`
                  : `No travel groups found for ${activeCategory}.`
              }
            />
            {searchQuery.trim().length > 0 && (
              <TouchableOpacity
                style={styles.clearFilterBtn}
                onPress={() => {
                  setSearchQuery('');
                  setPage(1);
                }}
              >
                <Text style={styles.clearFilterBtnText}>Clear Search Filter</Text>
              </TouchableOpacity>
            )}
          </View>
        ) : (
          <>
            {displayedGroups.map(renderGroupCard)}

            {/* ── PAGINATION / LOAD MORE ───────────────────────────── */}
            {hasMoreGroups && (
              <TouchableOpacity
                style={styles.loadMoreBtn}
                onPress={() => setPage((p) => p + 1)}
                activeOpacity={0.8}
                testID="load-more-groups-btn"
              >
                <Text style={styles.loadMoreBtnText}>
                  Load More Groups ({filteredGroups.length - displayedGroups.length} remaining)
                </Text>
              </TouchableOpacity>
            )}
          </>
        )}
      </ScrollView>

      {/* ── FLOATING CREATE GROUP (+) BUTTON ───────────────────────── */}
      <TouchableOpacity
        style={styles.floatingCreateBtn}
        onPress={() => navigation.navigate('CreateGroup')}
        activeOpacity={0.88}
        accessibilityLabel="Create Travel Group"
      >
        <Plus size={26} color={AppColors.white} strokeWidth={2.6} />
      </TouchableOpacity>

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
    paddingTop: 12,
    paddingBottom: 110, // Generous padding so floating button doesn't obscure content
  },

  /* ── HERO HEADER ───────────────────────────────────────────────── */
  heroSection: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginTop: 4,
    marginBottom: 14,
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

  /* ── SEARCH CONTAINER ─────────────────────────────────────────── */
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E8E3DA',
    paddingHorizontal: 12,
    height: 48,
    marginBottom: 14,
    shadowColor: AppColors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 3,
    elevation: 1,
  },
  searchIcon: {
    marginRight: 6,
  },
  searchInput: {
    flex: 1,
    fontSize: 13,
    fontWeight: '600',
    color: AppColors.textPrimary,
    paddingVertical: 8,
  },
  clearSearchBtn: {
    padding: 4,
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
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 18,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E8E3DA',
  },
  filterChipActive: {
    backgroundColor: AppColors.primary,
    borderColor: AppColors.primary,
  },
  filterChipText: {
    fontSize: 13,
    fontWeight: '700',
    color: AppColors.textPrimary,
  },
  filterChipTextActive: {
    color: AppColors.white,
  },

  /* ── GROUP CARDS ───────────────────────────────────────────────── */
  groupCard: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    borderWidth: 1,
    borderColor: '#EAE5DC',
    marginBottom: 14,
    overflow: 'hidden',
    shadowColor: AppColors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  categoryPanel: {
    width: 90,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 18,
    paddingHorizontal: 8,
  },
  categoryPanelLabel: {
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 0.8,
    marginTop: 8,
    textAlign: 'center',
  },
  groupRightCol: {
    flex: 1,
    padding: 14,
    justifyContent: 'space-between',
  },
  groupHeaderRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 8,
    marginBottom: 4,
  },
  groupName: {
    flex: 1,
    fontSize: 15,
    fontWeight: '800',
    color: AppColors.textPrimary,
    letterSpacing: -0.2,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
  },
  statusBadgeText: {
    fontSize: 10,
    fontWeight: '800',
  },
  greenDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#16A34A',
  },
  groupDesc: {
    fontSize: 12,
    color: AppColors.textSecondary,
    lineHeight: 16,
    marginBottom: 10,
  },
  avatarStackRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  initialCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: -4,
    borderWidth: 1.5,
    borderColor: '#FFFFFF',
  },
  initialLetter: {
    fontSize: 10,
    fontWeight: '800',
  },
  groupUserCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#F1ECE4',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  overflowText: {
    fontSize: 11,
    fontWeight: '700',
    color: AppColors.textMuted,
    marginLeft: 4,
  },
  memberCountText: {
    fontSize: 11,
    fontWeight: '600',
    color: AppColors.textMuted,
    marginLeft: 6,
  },
  cardBottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    flex: 1,
    paddingRight: 6,
  },
  tagPill: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  tagPillText: {
    fontSize: 10,
    fontWeight: '800',
  },
  cardActionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  shareIconButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#FAF7F2',
    borderWidth: 1,
    borderColor: '#EAE5DC',
    justifyContent: 'center',
    alignItems: 'center',
  },
  arrowButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#E0F2FE',
    justifyContent: 'center',
    alignItems: 'center',
  },
  arrowButtonJoined: {
    backgroundColor: '#DCFCE7',
  },

  /* ── PAGINATION LOAD MORE ───────────────────────────────────────── */
  loadMoreBtn: {
    paddingVertical: 13,
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#E8E3DA',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 4,
    marginBottom: 16,
  },
  loadMoreBtnText: {
    fontSize: 13,
    fontWeight: '800',
    color: AppColors.primary,
  },

  /* ── EMPTY WRAP ─────────────────────────────────────────────────── */
  emptyWrap: {
    alignItems: 'center',
    paddingVertical: 12,
  },
  clearFilterBtn: {
    marginTop: 10,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 12,
    backgroundColor: '#E0F2FE',
  },
  clearFilterBtnText: {
    fontSize: 12,
    fontWeight: '800',
    color: AppColors.primary,
  },

  /* ── FLOATING CREATE GROUP BUTTON ───────────────────────────────── */
  floatingCreateBtn: {
    position: 'absolute',
    right: 20,
    bottom: 84, // Positioned above the BottomNavBar
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: AppColors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: AppColors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 6,
    zIndex: 50,
  },

  /* ── SKELETONS ─────────────────────────────────────────────────── */
  skeletonPanel: {
    width: 90,
    height: 120,
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
    gap: 6,
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
    width: 45,
    height: 16,
    borderRadius: 6,
  },
  skeletonTagLarge: {
    width: 65,
    height: 16,
    borderRadius: 6,
  },
});
