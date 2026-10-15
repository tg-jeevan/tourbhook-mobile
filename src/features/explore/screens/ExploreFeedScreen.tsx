import React, { useState, useMemo, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import {
  Search,
  Mic,
  Bell,
  Play,
  Heart,
  MessageCircle,
  Bookmark,
  MapPin,
  Calendar,
  Users,
  Mountain,
  Landmark,
  Utensils,
  Palmtree,
  Leaf,
  LayoutGrid,
  Check,
  ChevronRight,
  X,
  Sparkles,
  ArrowRight,
  Plus,
} from 'lucide-react-native';
import { AppStackParamList } from '../../../core/navigation/types';
import { AppColors } from '../../../core/theme/colors';
import { BottomNavBar } from '../../../core/components/BottomNavBar';
import { ExploreCategory, DestinationItem } from '../types/exploreTypes';
import {
  exploreVoiceSearchService,
  VoiceSearchStatus,
} from '../services/exploreVoiceSearchService';
import { getFilteredExploreContent, searchExploreContent } from '../data/mockExploreData';
import { UGCItem } from '../../ugc/types/ugcTypes';
import { TravelGroup } from '../../groups/types/groupTypes';
import { useAuth } from '../../../core/auth/AuthContext';
import { useSubscription } from '../../profile/data/subscriptionStore';
import { groupStore, useGroupState } from '../../groups/data/groupStore';
import { GroupAccessBadges } from '../../groups/components/GroupAccessBadges';
import { GroupAccessGateModal } from '../../groups/components/GroupAccessGateModal';
import {
  GroupAccessBlockReason,
  getJoinGroupBlockReason,
  getPublicGroupPreview,
} from '../../groups/utils/groupAccess';

const CATEGORIES: { label: ExploreCategory; icon: React.ComponentType<{ size: number; color: string }> }[] = [
  { label: 'All', icon: LayoutGrid },
  { label: 'Adventure', icon: Mountain },
  { label: 'Culture', icon: Landmark },
  { label: 'Food', icon: Utensils },
  { label: 'Beach', icon: Palmtree },
  { label: 'Nature', icon: Leaf },
];

export default function ExploreFeedScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<AppStackParamList>>();

  const [activeCategory, setActiveCategory] = useState<ExploreCategory>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [savedReelIds, setSavedReelIds] = useState<string[]>([]);
  const [likedReelIds, setLikedReelIds] = useState<string[]>([]);
  const [voiceStatus, setVoiceStatus] = useState<VoiceSearchStatus>('idle');
  const [voiceNotice, setVoiceNotice] = useState<string | null>(null);
  const [accessBlockReason, setAccessBlockReason] =
    useState<GroupAccessBlockReason | null>(null);
  const { user } = useAuth();
  const { plan } = useSubscription();
  const { joinedGroupCount } = useGroupState();

  useEffect(() => {
    const unsubscribe = exploreVoiceSearchService.subscribe((event) => {
      setVoiceStatus(event.status);

      if (event.status === 'recognized' && event.query) {
        setSearchQuery(event.query);
        setVoiceNotice(null);
      } else if (event.status === 'permission_denied') {
        setVoiceNotice(event.errorMessage || 'Microphone permission denied.');
        Alert.alert(
          'Microphone Permission Needed',
          'Please enable microphone access in device settings to use voice search.'
        );
      } else if (event.status === 'unavailable') {
        setVoiceNotice(
          event.errorMessage ||
            'Speech recognition engine is unavailable on this device.'
        );
      } else if (event.status === 'no_speech') {
        setVoiceNotice(
          event.errorMessage || 'No speech detected. Tap microphone to try again.'
        );
      } else if (event.status === 'error') {
        setVoiceNotice(
          event.errorMessage || 'Speech recognition failed. Please try again.'
        );
      }
    });

    return () => {
      unsubscribe();
      exploreVoiceSearchService.stopListening();
    };
  }, []);

  const isListening = voiceStatus === 'listening';

  const handleVoiceSearchPress = async () => {
    if (isListening) {
      exploreVoiceSearchService.stopListening();
      return;
    }
    setVoiceNotice(null);
    await exploreVoiceSearchService.startListening();
  };

  // Filtered content according to active category
  const { destinations, reels, groups } = useMemo(
    () => getFilteredExploreContent(activeCategory),
    [activeCategory]
  );

  // Search results
  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];
    return searchExploreContent(searchQuery);
  }, [searchQuery]);

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

  const handleJoinGroup = (group: TravelGroup) => {
    const isAlreadyJoined = groupStore.isGroupJoined(group.id);
    if (isAlreadyJoined) {
      navigation.navigate('GroupChat', { groupId: group.id });
      return;
    }

    const reason = getJoinGroupBlockReason({
      group,
      isVerified: user?.isVerified === true,
      isAlreadyJoined,
      joinedCount: joinedGroupCount,
      plan,
    });
    if (reason) {
      setAccessBlockReason(reason);
      return;
    }

    groupStore.joinGroup(group.id);
  };

  const handleReelPress = (reel: UGCItem) => {
    navigation.navigate('ReelViewer', {
      reelId: reel.id,
      reel: reel,
    });
  };

  const handleDestinationPress = (destination: DestinationItem) => {
    navigation.navigate('DestinationDetails', {
      destinationId: destination.id,
      destinationName: `${destination.name}, ${destination.country}`,
    });
  };

  const handleSearchResultPress = (result: any) => {
    setSearchQuery('');
    if (result.type === 'destination') {
      navigation.navigate('DestinationDetails', {
        destinationId: result.id,
        destinationName: result.title,
      });
    } else if (result.type === 'place') {
      navigation.navigate('PlaceDetails', {
        placeId: result.id,
        placeName: result.title,
      });
    } else if (result.type === 'reel') {
      navigation.navigate('ReelViewer', {
        reelId: result.id,
        reel: result.payload,
      });
    } else if (result.type === 'group') {
      navigation.navigate('GroupMatching');
    }
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* ── HEADER WITH NOTIFICATION BELL ────────────────────────── */}
        <View style={styles.headerRow}>
          <View style={styles.headerTextCol}>
            <Text style={styles.headerTitle}>Explore</Text>
            <Text style={styles.headerSubtitle}>
              Discover places, reels and travel communities
            </Text>
          </View>

          <TouchableOpacity
            style={styles.bellButton}
            onPress={() => navigation.navigate('Notifications')}
            activeOpacity={0.7}
          >
            <Bell size={20} color={AppColors.textPrimary} />
            <View style={styles.bellUnreadDot} />
          </TouchableOpacity>
        </View>

        {/* ── SEARCH BAR ───────────────────────────────────────────── */}
        <View style={styles.searchBarContainer}>
          <Search size={18} color={AppColors.textMuted} style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search destinations, places or travel reels..."
            placeholderTextColor={AppColors.textMuted}
            value={searchQuery}
            onChangeText={setSearchQuery}
            autoCorrect={false}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity
              onPress={() => setSearchQuery('')}
              style={styles.searchClearBtn}
              activeOpacity={0.7}
              accessibilityLabel="Clear search"
              accessibilityRole="button"
            >
              <X size={16} color={AppColors.textMuted} />
            </TouchableOpacity>
          )}
          <TouchableOpacity
            style={[
              styles.voiceSearchBtn,
              isListening && styles.voiceSearchBtnListening,
            ]}
            onPress={handleVoiceSearchPress}
            activeOpacity={0.7}
            accessibilityLabel="Voice search"
            accessibilityRole="button"
          >
            <Mic
              size={18}
              color={isListening ? AppColors.white : AppColors.primary}
            />
          </TouchableOpacity>
        </View>

        {/* ── VOICE SEARCH STATUS / LISTENING FEEDBACK ─────────────── */}
        {isListening && (
          <View style={styles.voiceListeningBanner}>
            <View style={styles.voicePulseDot} />
            <Text style={styles.voiceListeningText}>Listening... Speak destinations or places</Text>
            <TouchableOpacity
              onPress={() => exploreVoiceSearchService.stopListening()}
              style={styles.voiceCancelBtn}
              accessibilityLabel="Stop voice search"
            >
              <X size={14} color={AppColors.white} />
            </TouchableOpacity>
          </View>
        )}

        {voiceNotice && !isListening && (
          <View style={styles.voiceNoticeBanner}>
            <Text style={styles.voiceNoticeText} numberOfLines={2}>
              {voiceNotice}
            </Text>
            {voiceStatus === 'unavailable' && (
              <TouchableOpacity
                onPress={() => exploreVoiceSearchService.startListening({ sampleQuery: 'Paris' })}
                style={styles.voiceDemoBtn}
                accessibilityLabel="Test sample voice search"
              >
                <Text style={styles.voiceDemoBtnText}>Try "Paris"</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity
              onPress={() => setVoiceNotice(null)}
              style={styles.voiceNoticeCloseBtn}
              accessibilityLabel="Dismiss voice notice"
            >
              <X size={14} color={AppColors.textMuted} />
            </TouchableOpacity>
          </View>
        )}

        {/* ── SEARCH RESULTS DROPDOWN (IF QUERYING) ─────────────────── */}
        {searchQuery.trim().length > 0 && (
          <View style={styles.searchResultsBox}>
            <Text style={styles.searchResultsHeading}>
              Results for "{searchQuery}" ({searchResults.length})
            </Text>
            {searchResults.length === 0 ? (
              <Text style={styles.noResultsText}>No matching destinations or reels found.</Text>
            ) : (
              searchResults.map((item) => (
                <TouchableOpacity
                  key={`${item.type}-${item.id}`}
                  style={styles.searchResultItem}
                  onPress={() => handleSearchResultPress(item)}
                  activeOpacity={0.75}
                >
                  {item.imageUri ? (
                    <Image source={{ uri: item.imageUri }} style={styles.searchItemThumb} />
                  ) : (
                    <View style={styles.searchItemThumbFallback}>
                      <MapPin size={16} color={AppColors.primary} />
                    </View>
                  )}
                  <View style={styles.searchItemInfo}>
                    <Text style={styles.searchItemTitle} numberOfLines={1}>
                      {item.title}
                    </Text>
                    <Text style={styles.searchItemSub} numberOfLines={1}>
                      {item.subtitle}
                    </Text>
                  </View>
                  <ChevronRight size={16} color={AppColors.textMuted} />
                </TouchableOpacity>
              ))
            )}
          </View>
        )}

        {/* ── CATEGORY PILLS (HORIZONTAL SCROLL) ───────────────────── */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.horizontalScrollOuter}
          contentContainerStyle={styles.categoriesRow}
        >
          {CATEGORIES.map((cat) => {
            const isActive = cat.label === activeCategory;
            const IconComponent = cat.icon;
            return (
              <TouchableOpacity
                key={cat.label}
                style={[styles.categoryChip, isActive && styles.categoryChipActive]}
                onPress={() => setActiveCategory(cat.label)}
                activeOpacity={0.8}
              >
                <IconComponent
                  size={14}
                  color={isActive ? AppColors.white : AppColors.textPrimary}
                />
                <Text
                  style={[styles.categoryChipText, isActive && styles.categoryChipTextActive]}
                >
                  {cat.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* ── SECTION 1: TRAVEL REELS ──────────────────────────────── */}
        <View style={styles.sectionWrap}>
          <View style={styles.sectionHeaderRow}>
            <View style={styles.sectionTitleWithIcon}>
              <View style={[styles.sectionIconCircle, { backgroundColor: '#FFF1EE' }]}>
                <Play size={14} color={AppColors.accent} fill={AppColors.accent} />
              </View>
              <Text style={styles.sectionTitle}>Travel Reels</Text>
            </View>

            <View style={styles.headerRightActions}>
              <TouchableOpacity
                style={styles.shareReelHeaderBtn}
                onPress={() => navigation.navigate('UGCPosting')}
                activeOpacity={0.8}
                accessibilityRole="button"
                accessibilityLabel="Share a Travel Reel"
              >
                <Plus size={13} color={AppColors.accent} />
                <Text style={styles.shareReelHeaderText}>Share Reel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.seeAllTouchArea}
                onPress={() =>
                  navigation.navigate('ExploreCollection', { contentType: 'reels' })
                }
                activeOpacity={0.7}
                accessibilityRole="button"
                accessibilityLabel="See all Travel Reels"
                testID="see-all-travel-reels"
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              >
                <Text style={styles.seeAllText}>See all →</Text>
              </TouchableOpacity>
            </View>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.horizontalScrollOuter}
            contentContainerStyle={styles.reelsScrollRow}
          >
            {reels.map((reel) => {
              const isLiked = likedReelIds.includes(reel.id);
              const isSaved = savedReelIds.includes(reel.id);
              const displayLikes = isLiked
                ? (reel.likesCount || 1000) + 1
                : reel.likesCount || 1000;

              return (
                <TouchableOpacity
                  key={reel.id}
                  style={styles.reelCard}
                  activeOpacity={0.92}
                  onPress={() => handleReelPress(reel)}
                >
                  {/* Thumbnail Image */}
                  <Image source={{ uri: reel.thumbnailUrl }} style={styles.reelThumbnail} />
                  <View style={styles.reelDarkGradient} />

                  {/* Top-Left Play Duration Pill */}
                  <View style={styles.durationPill}>
                    <Play size={10} color={AppColors.white} fill={AppColors.white} />
                    <Text style={styles.durationText}>{reel.duration || '0:45'}</Text>
                  </View>

                  {/* Right Vertical Action Column */}
                  <View style={styles.reelActionCol}>
                    {/* Like */}
                    <TouchableOpacity
                      style={styles.reelActionBtn}
                      onPress={() => handleToggleLike(reel.id)}
                      activeOpacity={0.75}
                    >
                      <Heart
                        size={18}
                        color={isLiked ? '#FF385C' : AppColors.white}
                        fill={isLiked ? '#FF385C' : 'transparent'}
                      />
                      <Text style={styles.reelActionCount}>
                        {displayLikes > 999
                          ? `${(displayLikes / 1000).toFixed(1)}K`
                          : displayLikes}
                      </Text>
                    </TouchableOpacity>

                    {/* Comment */}
                    <TouchableOpacity
                      style={styles.reelActionBtn}
                      onPress={() => handleReelPress(reel)}
                      activeOpacity={0.75}
                    >
                      <MessageCircle size={18} color={AppColors.white} />
                      <Text style={styles.reelActionCount}>34</Text>
                    </TouchableOpacity>

                    {/* Bookmark */}
                    <TouchableOpacity
                      style={styles.reelActionBtn}
                      onPress={() => handleToggleSave(reel.id)}
                      activeOpacity={0.75}
                    >
                      <Bookmark
                        size={18}
                        color={isSaved ? AppColors.accent : AppColors.white}
                        fill={isSaved ? AppColors.accent : 'transparent'}
                      />
                    </TouchableOpacity>
                  </View>

                  {/* Bottom Content Overlay */}
                  <View style={styles.reelBottomOverlay}>
                    <Text style={styles.reelCardTitle} numberOfLines={2}>
                      {reel.title}
                    </Text>

                    <View style={styles.reelCreatorRow}>
                      {reel.creatorAvatar ? (
                        <Image
                          source={{ uri: reel.creatorAvatar }}
                          style={styles.reelCreatorAvatar}
                        />
                      ) : (
                        <View style={styles.reelCreatorAvatarFallback}>
                          <Text style={styles.reelCreatorInitial}>
                            {reel.creatorHandle?.[1]?.toUpperCase() || 'T'}
                          </Text>
                        </View>
                      )}
                      <Text style={styles.reelCreatorHandle} numberOfLines={1}>
                        {reel.creatorHandle}
                      </Text>
                    </View>
                  </View>
                </TouchableOpacity>
              );
            })}
          </ScrollView>

          {/* ── SHARE A TRAVEL REEL CALLOUT BANNER ─────────────────────── */}
          <TouchableOpacity
            style={styles.shareTravelReelBanner}
            onPress={() => navigation.navigate('UGCPosting')}
            activeOpacity={0.88}
            accessibilityRole="button"
            accessibilityLabel="Share a Travel Reel. Discover new places with the videos you love."
          >
            <View style={styles.shareBannerLeft}>
              <View style={styles.shareBannerIconBox}>
                <Sparkles size={18} color={AppColors.primary} />
              </View>
              <View style={styles.shareBannerTextWrap}>
                <Text style={styles.shareBannerTitle}>Share a Travel Reel</Text>
                <Text style={styles.shareBannerSubtitle}>
                  Discover new places with the videos you love.
                </Text>
              </View>
            </View>
            <View style={styles.shareBannerActionBtn}>
              <ArrowRight size={16} color={AppColors.textOnPrimary} />
            </View>
          </TouchableOpacity>
        </View>

        {/* ── SECTION 2: POPULAR DESTINATIONS ──────────────────────── */}
        <View style={styles.sectionWrap}>
          <View style={styles.sectionHeaderRow}>
            <View style={styles.sectionTitleWithIcon}>
              <View style={[styles.sectionIconCircle, { backgroundColor: '#E0F2FE' }]}>
                <MapPin size={14} color={AppColors.primary} />
              </View>
              <Text style={styles.sectionTitle}>Popular Destinations</Text>
            </View>

            <TouchableOpacity
              style={styles.seeAllTouchArea}
              onPress={() => navigation.navigate('AllDestinations')}
              activeOpacity={0.7}
              accessibilityRole="button"
              accessibilityLabel="See all Popular Destinations"
              testID="see-all-popular-destinations"
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <Text style={styles.seeAllText}>See all →</Text>
            </TouchableOpacity>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.horizontalScrollOuter}
            contentContainerStyle={styles.destinationsScrollRow}
          >
            {destinations.map((dest) => (
              <TouchableOpacity
                key={dest.id}
                style={styles.destinationCard}
                activeOpacity={0.9}
                onPress={() => handleDestinationPress(dest)}
                testID={`destination-card-${dest.id}`}
              >
                <Image source={{ uri: dest.imageUri }} style={styles.destImage} />
                <View style={styles.destGradientOverlay} />

                <View style={styles.destBottomContent}>
                  <View style={styles.destTextGroup}>
                    <Text style={styles.destNameText} numberOfLines={1}>
                      {dest.name}
                    </Text>
                    <Text style={styles.destCountryText} numberOfLines={1}>
                      {dest.country}
                    </Text>
                  </View>

                  <View style={styles.destReelsBadge}>
                    <Calendar size={10} color={AppColors.primary} />
                    <Text style={styles.destReelsCountText}>{dest.reelsCountText}</Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* ── SECTION 3: SUGGESTED TRAVEL GROUPS ────────────────────── */}
        <View style={styles.sectionWrap}>
          <View style={styles.sectionHeaderRow}>
            <View style={styles.sectionTitleWithIcon}>
              <View style={[styles.sectionIconCircle, { backgroundColor: '#E0F2FE' }]}>
                <Users size={14} color={AppColors.primary} />
              </View>
              <Text style={styles.sectionTitle}>Suggested Travel Groups</Text>
            </View>

            <TouchableOpacity
              style={styles.seeAllTouchArea}
              onPress={() => navigation.navigate('GroupMatching')}
              activeOpacity={0.7}
              accessibilityRole="button"
              accessibilityLabel="See all Suggested Travel Groups"
              testID="see-all-suggested-groups"
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <Text style={styles.seeAllText}>See all →</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.groupsVerticalList}>
            {getPublicGroupPreview(groups).map((group) => {
              const isJoined = groupStore.isGroupJoined(group.id);
              const isAdventure =
                group.categoryLabel === 'ADVENTURE' ||
                group.tags.some((t) => t.toLowerCase() === 'adventure') ||
                group.categories.includes('adventure');

              return (
                <TouchableOpacity
                  key={group.id}
                  style={styles.groupCard}
                  activeOpacity={0.9}
                  onPress={() => navigation.navigate('GroupDetails', { groupId: group.id })}
                  testID={`group-card-${group.id}`}
                >
                  {/* Left Category Panel */}
                  <View
                    style={[
                      styles.groupCategoryPanel,
                      { backgroundColor: isAdventure ? '#E0F2FE' : '#DCFCE7' },
                    ]}
                  >
                    {isAdventure ? (
                      <Mountain size={28} color="#0284C7" />
                    ) : (
                      <Palmtree size={28} color="#059669" />
                    )}
                  </View>

                  {/* Center Content */}
                  <View style={styles.groupCenterInfo}>
                    <Text style={styles.groupCardName} numberOfLines={1}>
                      {group.name}
                    </Text>
                    <Text style={styles.groupCardDesc} numberOfLines={2}>
                      {group.description}
                    </Text>
                    <GroupAccessBadges group={group} />

                    {/* Member Avatars & Count */}
                    <View style={styles.groupMembersRow}>
                      <View style={styles.groupAvatarStack}>
                        <Image
                          source={{
                            uri: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
                          }}
                          style={[styles.smallAvatarImg, { zIndex: 3 }]}
                        />
                        <Image
                          source={{
                            uri: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80',
                          }}
                          style={[styles.smallAvatarImg, { marginLeft: -8, zIndex: 2 }]}
                        />
                        <Image
                          source={{
                            uri: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80',
                          }}
                          style={[styles.smallAvatarImg, { marginLeft: -8, zIndex: 1 }]}
                        />
                      </View>
                      <Text style={styles.groupOverflowText}>
                        +{Math.max(1, group.memberCount - 3)}
                      </Text>
                      <Text style={styles.groupCountText}>
                        {group.memberCount}/{group.maxMembers} members
                      </Text>
                    </View>
                  </View>

                  {/* Right Join Button */}
                  <TouchableOpacity
                    style={[styles.groupJoinBtn, isJoined && styles.groupJoinedBtn]}
                    onPress={event => {
                      event.stopPropagation();
                      handleJoinGroup(group);
                    }}
                    activeOpacity={0.85}
                  >
                    {isJoined ? (
                      <>
                        <Check size={12} color={AppColors.white} />
                        <Text style={styles.groupJoinedBtnText}>Joined</Text>
                      </>
                    ) : (
                      <Text style={styles.groupJoinBtnText}>Join</Text>
                    )}
                  </TouchableOpacity>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      </ScrollView>

      {/* ── BOTTOM NAVIGATION ────────────────────────────────────── */}
      <BottomNavBar active="explore" />
      <GroupAccessGateModal
        reason={accessBlockReason}
        plan={plan}
        onClose={() => setAccessBlockReason(null)}
        onPrimaryAction={reason => {
          setAccessBlockReason(null);
          if (reason === 'join_limit_reached' && plan === 'free') {
            navigation.navigate('UpgradePlan');
          }
        }}
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
  horizontalScrollOuter: {
    marginHorizontal: -20,
  },

  /* ── HEADER ─────────────────────────────────────────────────────── */
  headerRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginTop: 8,
    marginBottom: 16,
  },
  headerTextCol: {
    flex: 1,
    paddingRight: 10,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: '900',
    color: AppColors.textPrimary,
    letterSpacing: -0.6,
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 13,
    color: AppColors.textMuted,
    lineHeight: 18,
  },
  bellButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: AppColors.surface,
    borderWidth: 1,
    borderColor: '#EAE5DC',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    marginTop: 2,
    shadowColor: AppColors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  bellUnreadDot: {
    position: 'absolute',
    top: 9,
    right: 10,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#EF4444',
    borderWidth: 1.5,
    borderColor: AppColors.white,
  },

  /* ── SEARCH BAR ─────────────────────────────────────────────────── */
  searchBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: AppColors.surface,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#EAE5DC',
    paddingHorizontal: 14,
    height: 50,
    marginBottom: 16,
    shadowColor: AppColors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 6,
    elevation: 1,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 13,
    color: AppColors.textPrimary,
    paddingVertical: 0,
  },
  searchClearBtn: {
    padding: 6,
  },
  voiceSearchBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 4,
    backgroundColor: '#F0F9FF',
  },
  voiceSearchBtnListening: {
    backgroundColor: AppColors.primary,
    shadowColor: AppColors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.35,
    shadowRadius: 4,
    elevation: 3,
  },
  voiceListeningBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: AppColors.primary,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 14,
    marginBottom: 14,
    gap: 8,
  },
  voicePulseDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#4ADE80',
  },
  voiceListeningText: {
    flex: 1,
    fontSize: 12,
    fontWeight: '700',
    color: AppColors.white,
  },
  voiceCancelBtn: {
    padding: 4,
  },
  voiceNoticeBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF3C7',
    borderWidth: 1,
    borderColor: '#FDE68A',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 14,
    marginBottom: 14,
    gap: 8,
  },
  voiceNoticeText: {
    flex: 1,
    fontSize: 11,
    color: '#92400E',
    fontWeight: '600',
  },
  voiceDemoBtn: {
    backgroundColor: AppColors.primary,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  voiceDemoBtnText: {
    fontSize: 11,
    fontWeight: '700',
    color: AppColors.white,
  },
  voiceNoticeCloseBtn: {
    padding: 4,
  },

  /* ── SEARCH RESULTS ─────────────────────────────────────────────── */
  searchResultsBox: {
    backgroundColor: AppColors.surface,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#EAE5DC',
    padding: 12,
    marginBottom: 16,
    shadowColor: AppColors.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 3,
  },
  searchResultsHeading: {
    fontSize: 12,
    fontWeight: '700',
    color: AppColors.textMuted,
    marginBottom: 10,
  },
  noResultsText: {
    fontSize: 13,
    color: AppColors.textSecondary,
    fontStyle: 'italic',
    paddingVertical: 8,
  },
  searchResultItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F3EFE8',
  },
  searchItemThumb: {
    width: 36,
    height: 36,
    borderRadius: 10,
    resizeMode: 'cover',
  },
  searchItemThumbFallback: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: '#E0F2FE',
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchItemInfo: {
    flex: 1,
    marginLeft: 10,
  },
  searchItemTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: AppColors.textPrimary,
  },
  searchItemSub: {
    fontSize: 11,
    color: AppColors.textMuted,
    marginTop: 2,
  },

  /* ── CATEGORY PILLS ─────────────────────────────────────────────── */
  categoriesRow: {
    flexDirection: 'row',
    gap: 8,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  categoryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 16,
    paddingVertical: 9,
    borderRadius: 20,
    backgroundColor: AppColors.surface,
    borderWidth: 1,
    borderColor: '#EAE5DC',
    shadowColor: AppColors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.02,
    shadowRadius: 4,
    elevation: 1,
  },
  categoryChipActive: {
    backgroundColor: AppColors.primary,
    borderColor: AppColors.primary,
  },
  categoryChipText: {
    fontSize: 12,
    fontWeight: '700',
    color: AppColors.textPrimary,
  },
  categoryChipTextActive: {
    color: AppColors.white,
  },

  /* ── SECTION COMMONS ────────────────────────────────────── */
  sectionWrap: {
    marginBottom: 28,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  sectionTitleWithIcon: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  sectionIconCircle: {
    width: 26,
    height: 26,
    borderRadius: 13,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: AppColors.textPrimary,
    letterSpacing: -0.3,
  },
  seeAllTouchArea: {
    paddingVertical: 4,
    paddingLeft: 6,
    paddingRight: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  seeAllText: {
    fontSize: 12,
    fontWeight: '700',
    color: AppColors.primary,
  },
  headerRightActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  shareReelHeaderBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#FFF1EE',
    borderWidth: 1,
    borderColor: '#FFD0C5',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 14,
  },
  shareReelHeaderText: {
    fontSize: 11,
    fontWeight: '700',
    color: AppColors.accent,
  },
  shareTravelReelBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: AppColors.surface,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#EAE5DC',
    padding: 14,
    marginTop: 18,
    shadowColor: AppColors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  shareBannerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
    paddingRight: 8,
  },
  shareBannerIconBox: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#E0F2FE',
    justifyContent: 'center',
    alignItems: 'center',
  },
  shareBannerTextWrap: {
    flex: 1,
  },
  shareBannerTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: AppColors.textPrimary,
    letterSpacing: -0.2,
  },
  shareBannerSubtitle: {
    fontSize: 11,
    color: AppColors.textMuted,
    marginTop: 2,
    lineHeight: 15,
  },
  shareBannerActionBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: AppColors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },

  /* ── REELS SECTION ──────────────────────────────────────────────── */
  reelsScrollRow: {
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 20,
  },
  reelCard: {
    width: 170,
    height: 275,
    borderRadius: 20,
    overflow: 'hidden',
    position: 'relative',
    backgroundColor: '#10243F',
    shadowColor: AppColors.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  reelThumbnail: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  reelDarkGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(16, 36, 63, 0.3)',
  },
  durationPill: {
    position: 'absolute',
    top: 10,
    left: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    zIndex: 5,
  },
  durationText: {
    fontSize: 10,
    fontWeight: '700',
    color: AppColors.white,
  },
  reelActionCol: {
    position: 'absolute',
    top: 80,
    right: 8,
    alignItems: 'center',
    gap: 10,
    zIndex: 5,
  },
  reelActionBtn: {
    alignItems: 'center',
    gap: 2,
    padding: 2,
  },
  reelActionCount: {
    fontSize: 10,
    fontWeight: '700',
    color: AppColors.white,
    textShadowColor: 'rgba(0, 0, 0, 0.8)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  reelBottomOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 12,
    paddingRight: 42,
    paddingTop: 24,
    backgroundColor: 'rgba(5, 11, 20, 0.65)',
  },
  reelCardTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: AppColors.white,
    lineHeight: 16,
    marginBottom: 6,
  },
  reelCreatorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  reelCreatorAvatar: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: AppColors.white,
  },
  reelCreatorAvatarFallback: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: AppColors.accent,
    justifyContent: 'center',
    alignItems: 'center',
  },
  reelCreatorInitial: {
    fontSize: 10,
    fontWeight: '700',
    color: AppColors.white,
  },
  reelCreatorHandle: {
    fontSize: 10,
    fontWeight: '600',
    color: 'rgba(255, 255, 255, 0.85)',
    flex: 1,
  },

  /* ── DESTINATIONS SECTION ───────────────────────────────────────── */
  destinationsScrollRow: {
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 20,
  },
  destinationCard: {
    width: 140,
    height: 195,
    borderRadius: 20,
    overflow: 'hidden',
    position: 'relative',
    backgroundColor: AppColors.surface,
    borderWidth: 1,
    borderColor: '#EAE5DC',
    shadowColor: AppColors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  destImage: {
    width: '100%',
    height: 110,
    resizeMode: 'cover',
  },
  destGradientOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 110,
    backgroundColor: 'rgba(16, 36, 63, 0.1)',
  },
  destBottomContent: {
    padding: 10,
    flex: 1,
    justifyContent: 'space-between',
  },
  destTextGroup: {
    justifyContent: 'flex-start',
  },
  destNameText: {
    fontSize: 14,
    fontWeight: '800',
    color: AppColors.textPrimary,
  },
  destCountryText: {
    fontSize: 11,
    color: AppColors.textMuted,
    marginTop: 2,
  },
  destReelsBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#F0F9FF',
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  destReelsCountText: {
    fontSize: 10,
    fontWeight: '700',
    color: AppColors.primary,
  },

  /* ── GROUPS SECTION ─────────────────────────────────────────────── */
  groupsVerticalList: {
    gap: 12,
  },
  groupCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: AppColors.surface,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: '#EAE5DC',
    padding: 12,
    shadowColor: AppColors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 6,
    elevation: 1,
  },
  groupCategoryPanel: {
    width: 56,
    height: 56,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  groupCenterInfo: {
    flex: 1,
    paddingRight: 10,
    justifyContent: 'center',
  },
  groupCardName: {
    fontSize: 14,
    fontWeight: '800',
    color: AppColors.textPrimary,
    marginBottom: 2,
  },
  groupCardDesc: {
    fontSize: 11,
    color: AppColors.textMuted,
    lineHeight: 15,
    marginBottom: 4,
  },
  groupMembersRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
  },
  groupAvatarStack: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  smallAvatarImg: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 1.5,
    borderColor: AppColors.surface,
  },
  groupOverflowText: {
    fontSize: 10,
    fontWeight: '700',
    color: AppColors.textMuted,
    marginLeft: 4,
    marginRight: 6,
  },
  groupCountText: {
    fontSize: 10,
    color: AppColors.textMuted,
    fontWeight: '600',
  },
  groupJoinBtn: {
    backgroundColor: AppColors.primary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
    minWidth: 70,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
  },
  groupJoinBtnText: {
    fontSize: 12,
    fontWeight: '800',
    color: AppColors.white,
  },
  groupJoinedBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#059669',
  },
  groupJoinedBtnText: {
    fontSize: 12,
    fontWeight: '800',
    color: AppColors.white,
  },
});
