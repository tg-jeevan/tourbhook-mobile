import React, { useState, useMemo, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Dimensions,
  Linking,
  Share,
  StatusBar,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import {
  ArrowLeft,
  Heart,
  MessageCircle,
  Bookmark,
  Share2,
  Play,
  MapPin,
  Sparkles,
  ShieldCheck,
  ExternalLink,
  Clock,
  Check,
  AlertCircle,
  Film,
} from 'lucide-react-native';
import { AppStackParamList } from '../../../core/navigation/types';
import { AppColors } from '../../../core/theme/colors';
import { InstagramIcon, YouTubeIcon } from '../../ugc/components/SocialIcons';
import { UGCItem } from '../../ugc/types/ugcTypes';
import { filterApprovedDestinationReels } from '../../ugc/data/mockUGCData';
import { MOCK_EXPLORE_REELS } from '../data/mockExploreData';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

type PlatformFilter = 'all' | 'instagram' | 'youtube';

/**
 * Collects and deduplicates all approved reels from UGC and Explore datasets.
 * STRICT ZERO-TOLERANCE MODERATION: Only items with status === 'approved' are returned.
 */
function getApprovedReels(
  destination?: string,
  platformFilter: PlatformFilter = 'all'
): UGCItem[] {
  const fromUGC = filterApprovedDestinationReels(destination, platformFilter);
  const fromExplore = MOCK_EXPLORE_REELS.filter((item) => {
    if (item.status !== 'approved') return false;
    if (destination && destination.trim()) {
      const target = destination.toLowerCase().trim();
      const itemDest = item.destination.toLowerCase().trim();
      if (!target.includes(itemDest) && !itemDest.includes(target)) return false;
    }
    if (platformFilter !== 'all' && item.platform !== platformFilter) return false;
    return true;
  });

  const map = new Map<string, UGCItem>();
  fromUGC.forEach((r) => map.set(r.id, r));
  fromExplore.forEach((r) => {
    if (!map.has(r.id)) {
      map.set(r.id, r);
    }
  });

  return Array.from(map.values()).filter((r) => r.status === 'approved');
}

export default function ReelViewerScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<AppStackParamList>>();
  const route = useRoute<RouteProp<AppStackParamList, 'ReelViewer'>>();

  const passedReel = route.params?.reel;
  const initialReelId = route.params?.reelId;
  const destinationParam = route.params?.destination;
  const initialFilter: PlatformFilter = route.params?.filter || 'all';

  const [platformFilter, setPlatformFilter] = useState<PlatformFilter>(initialFilter);
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [likedReelIds, setLikedReelIds] = useState<string[]>([]);
  const [savedReelIds, setSavedReelIds] = useState<string[]>([]);
  const [followingCreators, setFollowingCreators] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const flatListRef = useRef<FlatList<UGCItem>>(null);

  // Compute all approved reels for current filter
  const approvedReels = useMemo(() => {
    return getApprovedReels(destinationParam, platformFilter);
  }, [destinationParam, platformFilter]);

  // Determine initial index when first loading or filter changes
  useEffect(() => {
    if (initialReelId && approvedReels.length > 0) {
      const foundIdx = approvedReels.findIndex((r) => r.id === initialReelId);
      if (foundIdx >= 0) {
        setActiveIndex(foundIdx);
        flatListRef.current?.scrollToIndex({ index: foundIdx, animated: false });
      }
    }
  }, [initialReelId, approvedReels]);

  const handleToggleLike = (reelId: string) => {
    setLikedReelIds((prev) =>
      prev.includes(reelId) ? prev.filter((id) => id !== reelId) : [...prev, reelId]
    );
  };

  const handleToggleSave = (reelId: string) => {
    setSavedReelIds((prev) =>
      prev.includes(reelId) ? prev.filter((id) => id !== reelId) : [...prev, reelId]
    );
  };

  const handleToggleFollow = (creatorHandle: string) => {
    setFollowingCreators((prev) =>
      prev.includes(creatorHandle)
        ? prev.filter((handle) => handle !== creatorHandle)
        : [...prev, creatorHandle]
    );
  };

  const handleShare = async (reel: UGCItem) => {
    try {
      await Share.share({
        title: reel.title,
        message: `Check out this travel reel: "${reel.title}" on Tourbhook! ${reel.url}`,
        url: reel.url,
      });
    } catch {
      // Ignored
    }
  };

  const handleOpenExternal = async (reel: UGCItem) => {
    try {
      if (reel.url) {
        await Linking.openURL(reel.url);
      }
    } catch {
      // Ignored
    }
  };

  const handleNavigateDestination = (destinationName: string) => {
    const destName = destinationName.split(',')[0].trim();
    navigation.navigate('DestinationDetails', {
      destinationName,
      destinationId: `dest-${destName.toLowerCase()}`,
    });
  };

  const handleNavigatePlace = (placeName: string) => {
    navigation.navigate('PlaceDetails', {
      placeId: 'place-1',
      placeName,
    });
  };

  const renderFilterTabs = () => (
    <View style={styles.filterPillsRow}>
      <TouchableOpacity
        style={[styles.filterPill, platformFilter === 'all' && styles.filterPillActive]}
        onPress={() => setPlatformFilter('all')}
        activeOpacity={0.8}
        testID="filter-reels-all"
      >
        <Text
          style={[
            styles.filterPillText,
            platformFilter === 'all' && styles.filterPillTextActive,
          ]}
        >
          All
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[
          styles.filterPill,
          platformFilter === 'instagram' && styles.filterPillActive,
        ]}
        onPress={() => setPlatformFilter('instagram')}
        activeOpacity={0.8}
        testID="filter-reels-instagram"
      >
        <InstagramIcon size={12} color={AppColors.white} />
        <Text
          style={[
            styles.filterPillText,
            platformFilter === 'instagram' && styles.filterPillTextActive,
          ]}
        >
          Instagram
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[
          styles.filterPill,
          platformFilter === 'youtube' && styles.filterPillActive,
        ]}
        onPress={() => setPlatformFilter('youtube')}
        activeOpacity={0.8}
        testID="filter-reels-youtube"
      >
        <YouTubeIcon size={12} color={AppColors.white} />
        <Text
          style={[
            styles.filterPillText,
            platformFilter === 'youtube' && styles.filterPillTextActive,
          ]}
        >
          YouTube
        </Text>
      </TouchableOpacity>
    </View>
  );

  const renderReelItem = ({ item, index }: { item: UGCItem; index: number }) => {
    const isLiked = likedReelIds.includes(item.id);
    const isSaved = savedReelIds.includes(item.id);
    const isFollowing = followingCreators.includes(item.creatorHandle);
    const isCurrentActive = index === activeIndex;
    const displayLikes = isLiked
      ? (item.likesCount || 1000) + 1
      : item.likesCount || 1000;

    return (
      <View style={styles.reelSlideContainer} key={item.id} testID={`reel-slide-${item.id}`}>
        {/* Background Full-Screen Thumbnail/Media */}
        <Image source={{ uri: item.thumbnailUrl }} style={styles.backgroundImage} />
        <View style={styles.mediaOverlayGradient} />

        {/* Tap Play/Pause Overlay */}
        <TouchableOpacity
          style={styles.touchMediaArea}
          activeOpacity={1}
          onPress={() => setIsPlaying((prev) => !prev)}
        >
          {!isPlaying && isCurrentActive && (
            <View style={styles.centerPlayBadge}>
              <Play size={36} color={AppColors.white} fill={AppColors.white} />
            </View>
          )}
        </TouchableOpacity>

        {/* Right Floating Actions Column */}
        <View style={styles.rightActionsBar}>
          {/* Like */}
          <TouchableOpacity
            style={styles.actionBtnItem}
            onPress={() => handleToggleLike(item.id)}
            activeOpacity={0.8}
            testID={`like-btn-${item.id}`}
          >
            <View style={[styles.actionIconCircle, isLiked && styles.actionIconCircleLiked]}>
              <Heart
                size={22}
                color={isLiked ? '#FF385C' : AppColors.white}
                fill={isLiked ? '#FF385C' : 'transparent'}
              />
            </View>
            <Text style={styles.actionBtnLabel}>
              {displayLikes > 999
                ? `${(displayLikes / 1000).toFixed(1)}k`
                : displayLikes}
            </Text>
          </TouchableOpacity>

          {/* Comment */}
          <TouchableOpacity
            style={styles.actionBtnItem}
            onPress={() => {}}
            activeOpacity={0.8}
          >
            <View style={styles.actionIconCircle}>
              <MessageCircle size={22} color={AppColors.white} />
            </View>
            <Text style={styles.actionBtnLabel}>34</Text>
          </TouchableOpacity>

          {/* Bookmark / Save */}
          <TouchableOpacity
            style={styles.actionBtnItem}
            onPress={() => handleToggleSave(item.id)}
            activeOpacity={0.8}
            testID={`save-btn-${item.id}`}
          >
            <View style={[styles.actionIconCircle, isSaved && styles.actionIconCircleSaved]}>
              <Bookmark
                size={22}
                color={isSaved ? AppColors.accent : AppColors.white}
                fill={isSaved ? AppColors.accent : 'transparent'}
              />
            </View>
            <Text style={styles.actionBtnLabel}>{isSaved ? 'Saved' : 'Save'}</Text>
          </TouchableOpacity>

          {/* Share */}
          <TouchableOpacity
            style={styles.actionBtnItem}
            onPress={() => handleShare(item)}
            activeOpacity={0.8}
            testID={`share-btn-${item.id}`}
          >
            <View style={styles.actionIconCircle}>
              <Share2 size={22} color={AppColors.white} />
            </View>
            <Text style={styles.actionBtnLabel}>Share</Text>
          </TouchableOpacity>
        </View>

        {/* Bottom Overlay Content */}
        <SafeAreaView style={styles.bottomSafeArea} edges={['bottom']}>
          <View style={styles.bottomContentBox}>
            {/* Creator Profile Row */}
            <View style={styles.creatorProfileRow}>
              {item.creatorAvatar ? (
                <Image source={{ uri: item.creatorAvatar }} style={styles.creatorAvatarImg} />
              ) : (
                <View style={styles.creatorAvatarFallback}>
                  <Text style={styles.creatorInitialText}>
                    {item.creatorHandle?.[1]?.toUpperCase() || 'T'}
                  </Text>
                </View>
              )}

              <View style={styles.creatorNameWrap}>
                <Text style={styles.creatorHandleText}>{item.creatorHandle}</Text>
              </View>

              <TouchableOpacity
                style={[styles.followBtn, isFollowing && styles.followingBtn]}
                onPress={() => handleToggleFollow(item.creatorHandle)}
                activeOpacity={0.85}
              >
                {isFollowing ? (
                  <>
                    <Check size={12} color={AppColors.white} />
                    <Text style={styles.followingBtnText}>Following</Text>
                  </>
                ) : (
                  <Text style={styles.followBtnText}>+ Follow</Text>
                )}
              </TouchableOpacity>
            </View>

            {/* Reel Title / Caption */}
            <Text style={styles.reelTitleText}>{item.title}</Text>

            {/* Destination & Place Tags */}
            <View style={styles.tagsRow}>
              {/* Clickable Destination Tag */}
              <TouchableOpacity
                style={styles.destTagPill}
                onPress={() => handleNavigateDestination(item.destination)}
                activeOpacity={0.8}
                testID={`dest-pill-${item.id}`}
              >
                <MapPin size={13} color="#38BDF8" />
                <Text style={styles.destTagText}>{item.destination}</Text>
              </TouchableOpacity>

              {/* Clickable AI Detected Place Tag */}
              {item.aiAnalysis?.detectedPlace && (
                <TouchableOpacity
                  style={styles.placeTagPill}
                  onPress={() => handleNavigatePlace(item.aiAnalysis!.detectedPlace!)}
                  activeOpacity={0.8}
                  testID={`place-pill-${item.id}`}
                >
                  <Sparkles size={13} color="#FBBF24" />
                  <Text style={styles.placeTagText} numberOfLines={1}>
                    {item.aiAnalysis.detectedPlace}
                  </Text>
                </TouchableOpacity>
              )}
            </View>

            {/* AI Insight Card */}
            {item.aiAnalysis && (
              <View style={styles.aiInsightCard}>
                <View style={styles.aiInsightHeader}>
                  <Sparkles size={14} color="#38BDF8" />
                  <Text style={styles.aiInsightHeading}>AI Travel Insight</Text>
                  <View style={styles.bestTimeBadge}>
                    <Clock size={11} color="#94A3B8" />
                    <Text style={styles.bestTimeText}>
                      {item.aiAnalysis.bestTimeToVisit || 'Sunset Golden Hour'}
                    </Text>
                  </View>
                </View>
                <Text style={styles.aiInsightSummary}>{item.aiAnalysis.summary}</Text>
              </View>
            )}

            {/* Scrubber / Autoplay duration indicator */}
            <View style={styles.scrubberRow}>
              <View style={styles.progressBarTrack}>
                <View
                  style={[
                    styles.progressBarFilled,
                    { width: isPlaying && isCurrentActive ? '65%' : '20%' },
                  ]}
                />
              </View>
              <Text style={styles.durationText}>{item.duration || '0:45'}</Text>
            </View>

            {/* Open in Instagram / YouTube CTA */}
            <TouchableOpacity
              style={[
                styles.openExternalActionBtn,
                {
                  backgroundColor:
                    item.platform === 'instagram' ? '#E1306C' : '#FF0000',
                },
              ]}
              onPress={() => handleOpenExternal(item)}
              activeOpacity={0.85}
              testID={`open-external-${item.id}`}
            >
              {item.platform === 'instagram' ? (
                <InstagramIcon size={18} color={AppColors.white} />
              ) : (
                <YouTubeIcon size={18} color={AppColors.white} />
              )}
              <Text style={styles.openExternalActionText}>
                Open in {item.platform === 'instagram' ? 'Instagram' : 'YouTube'}
              </Text>
              <ExternalLink size={16} color={AppColors.white} />
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </View>
    );
  };

  const currentReel = approvedReels[activeIndex] || approvedReels[0];

  return (
    <View style={styles.container}>
      <StatusBar hidden={true} barStyle="light-content" />

      {/* ── TOP NAVIGATION & MODERATION BAR (FIXED OVERLAY) ────────── */}
      <SafeAreaView style={styles.topSafeArea} edges={['top']}>
        <View style={styles.topBarRow}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
            activeOpacity={0.8}
            accessibilityRole="button"
            accessibilityLabel="Go back to Explore"
            testID="reel-viewer-back-btn"
          >
            <ArrowLeft size={22} color={AppColors.white} />
          </TouchableOpacity>

          {/* Platform Filters */}
          {renderFilterTabs()}

          <View style={styles.topBadgesRow}>
            {/* Moderation Badge */}
            <View style={styles.moderationBadge}>
              <ShieldCheck size={13} color="#10B981" />
              <Text style={styles.moderationBadgeText}>Approved</Text>
            </View>

            {/* Platform Badge of currently visible reel */}
            {currentReel && (
              <View
                style={[
                  styles.platformBadge,
                  {
                    backgroundColor:
                      currentReel.platform === 'instagram'
                        ? AppColors.instagram
                        : AppColors.youtube,
                  },
                ]}
              >
                {currentReel.platform === 'instagram' ? (
                  <InstagramIcon size={12} color={AppColors.white} />
                ) : (
                  <YouTubeIcon size={12} color={AppColors.white} />
                )}
                <Text style={styles.platformBadgeText}>
                  {currentReel.platform === 'instagram' ? 'Reel' : 'Short'}
                </Text>
              </View>
            )}
          </View>
        </View>
      </SafeAreaView>

      {/* ── MAIN CONTENT: VERTICAL REELS FEED / EMPTY / LOADING ──── */}
      {isLoading ? (
        <View style={styles.loadingContainer} testID="reels-loading-state">
          <ActivityIndicator size="large" color={AppColors.primary} />
          <Text style={styles.loadingText}>Loading Travel Reels...</Text>
        </View>
      ) : approvedReels.length === 0 ? (
        <View style={styles.emptyContainer} testID="reels-empty-state">
          <View style={styles.emptyIconCircle}>
            <Film size={36} color={AppColors.primary} />
          </View>
          <Text style={styles.emptyTitle}>No Approved Reels Found</Text>
          <Text style={styles.emptySubtitle}>
            There are no approved travel videos available for the selected platform filter.
          </Text>
          <TouchableOpacity
            style={styles.resetFilterBtn}
            onPress={() => setPlatformFilter('all')}
            activeOpacity={0.8}
          >
            <Text style={styles.resetFilterText}>View All Approved Reels</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          ref={flatListRef}
          data={approvedReels}
          keyExtractor={(item) => item.id}
          pagingEnabled
          showsVerticalScrollIndicator={false}
          snapToInterval={SCREEN_HEIGHT}
          snapToAlignment="start"
          decelerationRate="fast"
          getItemLayout={(_, index) => ({
            length: SCREEN_HEIGHT,
            offset: SCREEN_HEIGHT * index,
            index,
          })}
          onMomentumScrollEnd={(e) => {
            const nextIdx = Math.round(e.nativeEvent.contentOffset.y / SCREEN_HEIGHT);
            if (nextIdx >= 0 && nextIdx < approvedReels.length) {
              setActiveIndex(nextIdx);
              setIsPlaying(true);
            }
          }}
          renderItem={renderReelItem}
          testID="approved-reels-feed"
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#050B14',
  },
  reelSlideContainer: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
    position: 'relative',
    backgroundColor: '#050B14',
  },
  backgroundImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
    resizeMode: 'cover',
  },
  mediaOverlayGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
    backgroundColor: 'rgba(5, 11, 20, 0.45)',
  },
  touchMediaArea: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
    justifyContent: 'center',
    alignItems: 'center',
  },
  centerPlayBadge: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: 'rgba(0, 0, 0, 0.55)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.6)',
  },

  /* ── TOP BAR ───────────────────────────────────────────────────── */
  topSafeArea: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 20,
  },
  topBarRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  backButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  filterPillsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 20,
    padding: 3,
    gap: 4,
  },
  filterPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 16,
  },
  filterPillActive: {
    backgroundColor: AppColors.primary,
  },
  filterPillText: {
    fontSize: 11,
    fontWeight: '700',
    color: 'rgba(255, 255, 255, 0.7)',
  },
  filterPillTextActive: {
    color: AppColors.white,
  },
  topBadgesRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  moderationBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(16, 185, 129, 0.25)',
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.5)',
  },
  moderationBadgeText: {
    color: '#34D399',
    fontSize: 10,
    fontWeight: '800',
  },
  platformBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 12,
  },
  platformBadgeText: {
    color: AppColors.white,
    fontSize: 10,
    fontWeight: '800',
  },

  /* ── RIGHT ACTIONS ─────────────────────────────────────────────── */
  rightActionsBar: {
    position: 'absolute',
    right: 14,
    bottom: 250,
    alignItems: 'center',
    gap: 16,
    zIndex: 10,
  },
  actionBtnItem: {
    alignItems: 'center',
    gap: 4,
  },
  actionIconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  actionIconCircleLiked: {
    backgroundColor: 'rgba(255, 56, 92, 0.25)',
    borderColor: '#FF385C',
  },
  actionIconCircleSaved: {
    backgroundColor: 'rgba(255, 107, 74, 0.25)',
    borderColor: AppColors.accent,
  },
  actionBtnLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: AppColors.white,
    textShadowColor: 'rgba(0, 0, 0, 0.8)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },

  /* ── BOTTOM OVERLAY ────────────────────────────────────────────── */
  bottomSafeArea: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 10,
  },
  bottomContentBox: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    paddingTop: 10,
    backgroundColor: 'rgba(5, 11, 20, 0.8)',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
  },
  creatorProfileRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  creatorAvatarImg: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: AppColors.white,
  },
  creatorAvatarFallback: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: AppColors.accent,
    justifyContent: 'center',
    alignItems: 'center',
  },
  creatorInitialText: {
    fontSize: 13,
    fontWeight: '800',
    color: AppColors.white,
  },
  creatorNameWrap: {
    flex: 1,
    marginLeft: 10,
  },
  creatorHandleText: {
    fontSize: 13,
    fontWeight: '800',
    color: AppColors.white,
  },
  followBtn: {
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.35)',
  },
  followBtnText: {
    fontSize: 11,
    fontWeight: '700',
    color: AppColors.white,
  },
  followingBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#0E7490',
    borderColor: '#0E7490',
  },
  followingBtnText: {
    fontSize: 11,
    fontWeight: '700',
    color: AppColors.white,
  },

  reelTitleText: {
    fontSize: 14,
    fontWeight: '700',
    color: AppColors.white,
    lineHeight: 19,
    marginBottom: 8,
  },

  tagsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flexWrap: 'wrap',
    marginBottom: 8,
  },
  destTagPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: 'rgba(14, 116, 144, 0.35)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(56, 189, 248, 0.4)',
  },
  destTagText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#E0F2FE',
  },
  placeTagPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: 'rgba(245, 158, 11, 0.25)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(251, 191, 36, 0.4)',
  },
  placeTagText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#FEF3C7',
  },

  /* AI Insight */
  aiInsightCard: {
    backgroundColor: 'rgba(15, 23, 42, 0.85)',
    borderRadius: 12,
    padding: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: 'rgba(56, 189, 248, 0.2)',
  },
  aiInsightHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 3,
  },
  aiInsightHeading: {
    fontSize: 11,
    fontWeight: '800',
    color: '#38BDF8',
    flex: 1,
  },
  bestTimeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  bestTimeText: {
    fontSize: 10,
    color: '#94A3B8',
    fontWeight: '500',
  },
  aiInsightSummary: {
    fontSize: 11,
    color: '#CBD5E1',
    lineHeight: 15,
  },

  /* Scrubber */
  scrubberRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 8,
  },
  progressBarTrack: {
    flex: 1,
    height: 3,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 1.5,
  },
  progressBarFilled: {
    height: '100%',
    backgroundColor: '#0E7490',
    borderRadius: 1.5,
  },
  durationText: {
    fontSize: 10,
    color: '#94A3B8',
    fontWeight: '600',
  },

  /* Primary Action */
  openExternalActionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 10,
    borderRadius: 14,
    shadowColor: AppColors.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 4,
  },
  openExternalActionText: {
    fontSize: 12,
    fontWeight: '800',
    color: AppColors.white,
  },

  /* Loading & Empty */
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  loadingText: {
    color: AppColors.white,
    fontSize: 14,
    fontWeight: '600',
    marginTop: 12,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  emptyIconCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: 'rgba(14, 116, 144, 0.25)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: AppColors.white,
    marginBottom: 8,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: 13,
    color: '#94A3B8',
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 20,
  },
  resetFilterBtn: {
    backgroundColor: AppColors.primary,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  resetFilterText: {
    fontSize: 13,
    fontWeight: '700',
    color: AppColors.white,
  },
});
