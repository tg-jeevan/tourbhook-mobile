import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Dimensions,
  Linking,
  Share,
  ScrollView,
  StatusBar,
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
  Pause,
  MapPin,
  Sparkles,
  ShieldCheck,
  ExternalLink,
  Clock,
  Check,
} from 'lucide-react-native';
import { AppStackParamList } from '../../../core/navigation/types';
import { AppColors } from '../../../core/theme/colors';
import { InstagramIcon, YouTubeIcon } from '../../ugc/components/SocialIcons';
import { UGCItem } from '../../ugc/types/ugcTypes';
import { MOCK_EXPLORE_REELS } from '../data/mockExploreData';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

export default function ReelViewerScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<AppStackParamList>>();
  const route = useRoute<RouteProp<AppStackParamList, 'ReelViewer'>>();

  // Find the selected reel or fallback to default
  const passedReel = route.params?.reel;
  const reelId = route.params?.reelId;
  const reel: UGCItem =
    passedReel ||
    MOCK_EXPLORE_REELS.find((r) => r.id === reelId) ||
    MOCK_EXPLORE_REELS[0];

  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [isLiked, setIsLiked] = useState<boolean>(false);
  const [likeCount, setLikeCount] = useState<number>(reel.likesCount || 1200);
  const [isSaved, setIsSaved] = useState<boolean>(false);
  const [isFollowing, setIsFollowing] = useState<boolean>(false);
  const [showAiInsight, setShowAiInsight] = useState<boolean>(true);

  const handleToggleLike = () => {
    if (isLiked) {
      setIsLiked(false);
      setLikeCount((prev) => prev - 1);
    } else {
      setIsLiked(true);
      setLikeCount((prev) => prev + 1);
    }
  };

  const handleShare = async () => {
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

  const handleOpenExternal = async () => {
    try {
      if (reel.url) {
        await Linking.openURL(reel.url);
      }
    } catch {
      // Ignored
    }
  };

  const handleNavigateDestination = () => {
    const dest = reel.destination.split(',')[0].trim();
    navigation.navigate('DestinationDetails', {
      destinationName: reel.destination,
      destinationId: `dest-${dest.toLowerCase()}`,
    });
  };

  const handleNavigatePlace = (placeName: string) => {
    navigation.navigate('PlaceDetails', {
      placeId: 'place-1',
      placeName: placeName,
    });
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      {/* ── BACKGROUND FULL-SCREEN MEDIA ─────────────────────────── */}
      <Image source={{ uri: reel.thumbnailUrl }} style={styles.backgroundImage} />
      <View style={styles.mediaOverlayGradient} />

      {/* ── TAP PLAY/PAUSE OVERLAY ────────────────────────────────── */}
      <TouchableOpacity
        style={styles.touchMediaArea}
        activeOpacity={1}
        onPress={() => setIsPlaying((prev) => !prev)}
      >
        {!isPlaying && (
          <View style={styles.centerPlayBadge}>
            <Play size={36} color={AppColors.white} fill={AppColors.white} />
          </View>
        )}
      </TouchableOpacity>

      {/* ── TOP NAVIGATION & MODERATION BAR ───────────────────────── */}
      <SafeAreaView style={styles.topSafeArea} edges={['top']}>
        <View style={styles.topBarRow}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
            activeOpacity={0.8}
          >
            <ArrowLeft size={22} color={AppColors.white} />
          </TouchableOpacity>

          <View style={styles.topBadgesRow}>
            {/* Moderation Badge */}
            <View style={styles.moderationBadge}>
              <ShieldCheck size={13} color="#10B981" />
              <Text style={styles.moderationBadgeText}>Approved</Text>
            </View>

            {/* Platform Badge */}
            <View
              style={[
                styles.platformBadge,
                {
                  backgroundColor:
                    reel.platform === 'instagram' ? AppColors.instagram : AppColors.youtube,
                },
              ]}
            >
              {reel.platform === 'instagram' ? (
                <InstagramIcon size={12} color={AppColors.white} />
              ) : (
                <YouTubeIcon size={12} color={AppColors.white} />
              )}
              <Text style={styles.platformBadgeText}>
                {reel.platform === 'instagram' ? 'Reel' : 'Short'}
              </Text>
            </View>
          </View>
        </View>
      </SafeAreaView>

      {/* ── RIGHT FLOATING ACTIONS BAR ────────────────────────────── */}
      <View style={styles.rightActionsBar}>
        {/* Like Button */}
        <TouchableOpacity
          style={styles.actionBtnItem}
          onPress={handleToggleLike}
          activeOpacity={0.8}
        >
          <View style={[styles.actionIconCircle, isLiked && styles.actionIconCircleLiked]}>
            <Heart
              size={22}
              color={isLiked ? '#FF385C' : AppColors.white}
              fill={isLiked ? '#FF385C' : 'transparent'}
            />
          </View>
          <Text style={styles.actionBtnLabel}>
            {likeCount > 999 ? `${(likeCount / 1000).toFixed(1)}k` : likeCount}
          </Text>
        </TouchableOpacity>

        {/* Comment Button */}
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

        {/* Bookmark / Save Button */}
        <TouchableOpacity
          style={styles.actionBtnItem}
          onPress={() => setIsSaved((prev) => !prev)}
          activeOpacity={0.8}
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

        {/* Share Button */}
        <TouchableOpacity
          style={styles.actionBtnItem}
          onPress={handleShare}
          activeOpacity={0.8}
        >
          <View style={styles.actionIconCircle}>
            <Share2 size={22} color={AppColors.white} />
          </View>
          <Text style={styles.actionBtnLabel}>Share</Text>
        </TouchableOpacity>
      </View>

      {/* ── BOTTOM OVERLAY CONTENT ────────────────────────────────── */}
      <SafeAreaView style={styles.bottomSafeArea} edges={['bottom']}>
        <View style={styles.bottomContentBox}>
          {/* Creator Profile Row */}
          <View style={styles.creatorProfileRow}>
            {reel.creatorAvatar ? (
              <Image source={{ uri: reel.creatorAvatar }} style={styles.creatorAvatarImg} />
            ) : (
              <View style={styles.creatorAvatarFallback}>
                <Text style={styles.creatorInitialText}>
                  {reel.creatorHandle?.[1]?.toUpperCase() || 'T'}
                </Text>
              </View>
            )}

            <View style={styles.creatorNameWrap}>
              <Text style={styles.creatorHandleText}>{reel.creatorHandle}</Text>
            </View>

            <TouchableOpacity
              style={[styles.followBtn, isFollowing && styles.followingBtn]}
              onPress={() => setIsFollowing((prev) => !prev)}
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

          {/* Reel Title */}
          <Text style={styles.reelTitleText}>{reel.title}</Text>

          {/* Destination & Place Tags */}
          <View style={styles.tagsRow}>
            {/* Clickable Destination Tag */}
            <TouchableOpacity
              style={styles.destTagPill}
              onPress={handleNavigateDestination}
              activeOpacity={0.8}
            >
              <MapPin size={13} color="#38BDF8" />
              <Text style={styles.destTagText}>{reel.destination}</Text>
            </TouchableOpacity>

            {/* Clickable AI Detected Place Tag */}
            {reel.aiAnalysis?.detectedPlace && (
              <TouchableOpacity
                style={styles.placeTagPill}
                onPress={() => handleNavigatePlace(reel.aiAnalysis!.detectedPlace!)}
                activeOpacity={0.8}
              >
                <Sparkles size={13} color="#FBBF24" />
                <Text style={styles.placeTagText} numberOfLines={1}>
                  {reel.aiAnalysis.detectedPlace}
                </Text>
              </TouchableOpacity>
            )}
          </View>

          {/* AI Insight Card */}
          {reel.aiAnalysis && showAiInsight && (
            <View style={styles.aiInsightCard}>
              <View style={styles.aiInsightHeader}>
                <Sparkles size={14} color="#38BDF8" />
                <Text style={styles.aiInsightHeading}>AI Travel Insight</Text>
                <View style={styles.bestTimeBadge}>
                  <Clock size={11} color="#94A3B8" />
                  <Text style={styles.bestTimeText}>
                    {reel.aiAnalysis.bestTimeToVisit || 'Sunset Golden Hour'}
                  </Text>
                </View>
              </View>
              <Text style={styles.aiInsightSummary}>{reel.aiAnalysis.summary}</Text>
            </View>
          )}

          {/* Video Scrubber / Duration Bar */}
          <View style={styles.scrubberRow}>
            <View style={styles.progressBarTrack}>
              <View style={[styles.progressBarFilled, { width: isPlaying ? '65%' : '35%' }]} />
            </View>
            <Text style={styles.durationText}>{reel.duration || '0:45'}</Text>
          </View>

          {/* Primary Action Button: Open in Instagram / YouTube */}
          <TouchableOpacity
            style={[
              styles.openExternalActionBtn,
              {
                backgroundColor:
                  reel.platform === 'instagram' ? '#E1306C' : '#FF0000',
              },
            ]}
            onPress={handleOpenExternal}
            activeOpacity={0.85}
          >
            {reel.platform === 'instagram' ? (
              <InstagramIcon size={18} color={AppColors.white} />
            ) : (
              <YouTubeIcon size={18} color={AppColors.white} />
            )}
            <Text style={styles.openExternalActionText}>
              Open in {reel.platform === 'instagram' ? 'Instagram' : 'YouTube'}
            </Text>
            <ExternalLink size={16} color={AppColors.white} />
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
    zIndex: 10,
  },
  topBarRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  topBadgesRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  moderationBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: 'rgba(16, 185, 129, 0.22)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.4)',
  },
  moderationBadgeText: {
    color: '#34D399',
    fontSize: 11,
    fontWeight: '700',
  },
  platformBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 14,
  },
  platformBadgeText: {
    color: AppColors.white,
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.3,
  },

  /* ── RIGHT ACTIONS ─────────────────────────────────────────────── */
  rightActionsBar: {
    position: 'absolute',
    right: 14,
    bottom: 230,
    alignItems: 'center',
    gap: 16,
    zIndex: 10,
  },
  actionBtnItem: {
    alignItems: 'center',
    gap: 4,
  },
  actionIconCircle: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
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
    backgroundColor: 'rgba(5, 11, 20, 0.75)',
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
    width: 34,
    height: 34,
    borderRadius: 17,
    borderWidth: 1.5,
    borderColor: AppColors.white,
  },
  creatorAvatarFallback: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: AppColors.accent,
    justifyContent: 'center',
    alignItems: 'center',
  },
  creatorInitialText: {
    fontSize: 14,
    fontWeight: '800',
    color: AppColors.white,
  },
  creatorNameWrap: {
    flex: 1,
    marginLeft: 10,
  },
  creatorHandleText: {
    fontSize: 14,
    fontWeight: '800',
    color: AppColors.white,
  },
  followBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
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
    fontSize: 15,
    fontWeight: '700',
    color: AppColors.white,
    lineHeight: 20,
    marginBottom: 10,
  },

  tagsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flexWrap: 'wrap',
    marginBottom: 10,
  },
  destTagPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: 'rgba(14, 116, 144, 0.35)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(56, 189, 248, 0.4)',
  },
  destTagText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#E0F2FE',
  },
  placeTagPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: 'rgba(245, 158, 11, 0.25)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(251, 191, 36, 0.4)',
  },
  placeTagText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FEF3C7',
  },

  /* AI Insight */
  aiInsightCard: {
    backgroundColor: 'rgba(15, 23, 42, 0.85)',
    borderRadius: 14,
    padding: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: 'rgba(56, 189, 248, 0.2)',
  },
  aiInsightHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  aiInsightHeading: {
    fontSize: 12,
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
    lineHeight: 16,
  },

  /* Scrubber */
  scrubberRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 10,
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
    paddingVertical: 12,
    borderRadius: 16,
    shadowColor: AppColors.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 4,
  },
  openExternalActionText: {
    fontSize: 13,
    fontWeight: '800',
    color: AppColors.white,
  },
});
