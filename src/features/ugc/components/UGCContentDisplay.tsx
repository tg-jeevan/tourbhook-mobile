import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Linking,
  ScrollView,
  Modal,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import {
  Play,
  Heart,
  Eye,
  Sparkles,
  Bookmark,
  MoreHorizontal,
  ChevronDown,
  Clock,
  ExternalLink,
  ShieldCheck,
  Upload,
  X,
  Video,
} from 'lucide-react-native';
import { InstagramIcon, YouTubeIcon } from './SocialIcons';
import { AppStackParamList } from '../../../core/navigation/types';
import { filterApprovedDestinationReels } from '../data/mockUGCData';
import { UGCContentDisplayProps, UGCItem } from '../types/ugcTypes';
import { AppColors } from '../../../core/theme/colors';

export const UGCContentDisplay: React.FC<UGCContentDisplayProps> = ({
  destination,
  tripId,
  placeId,
  onPostClick,
}) => {
  const navigation = useNavigation<NativeStackNavigationProp<AppStackParamList>>();
  const [platformFilter, setPlatformFilter] = useState<'all' | 'instagram' | 'youtube'>('all');
  const [selectedReel, setSelectedReel] = useState<UGCItem | null>(null);

  // CRITICAL ZERO-TOLERANCE MODERATION: ONLY approved items for this destination
  const approvedItems = filterApprovedDestinationReels(destination, platformFilter);
  const totalAllCount = filterApprovedDestinationReels(destination, 'all').length;
  const totalReelsCount = filterApprovedDestinationReels(destination, 'instagram').length;
  const totalShortsCount = filterApprovedDestinationReels(destination, 'youtube').length;

  const handleOpenLink = async (url: string) => {
    try {
      const supported = await Linking.canOpenURL(url);
      if (supported) {
        await Linking.openURL(url);
      } else {
        await Linking.openURL(url);
      }
    } catch {
      // Fallback
    }
  };

  const handleShareClick = () => {
    if (onPostClick) {
      onPostClick();
    } else {
      navigation.navigate('UGCPosting', { destination, tripId });
    }
  };

  return (
    <View style={styles.container}>
      {/* ── SECTION HEADER ────────────────────────────────────────── */}
      <View style={styles.sectionHeaderRow}>
        <View style={styles.headerTitleWrap}>
          <View style={styles.titleWithCount}>
            <Text style={styles.sectionTitle}>Traveler Reels & Shorts</Text>
            <View style={styles.countBadge}>
              <Text style={styles.countBadgeText}>{approvedItems.length}</Text>
            </View>
          </View>
          <Text style={styles.sectionSubtitle}>
            Curated community videos from Instagram, verified by AI & moderation.
          </Text>
        </View>

        <TouchableOpacity
          style={styles.shareReelBtn}
          onPress={handleShareClick}
          activeOpacity={0.8}
        >
          <Upload size={13} color={AppColors.accent} />
          <Text style={styles.shareReelBtnText}>Share Reel</Text>
        </TouchableOpacity>
      </View>

      {/* ── FILTER & SORT PILLS ROW ────────────────────────────────── */}
      <View style={styles.filtersRow}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filtersScroll}
        >
          {/* All Filter */}
          <TouchableOpacity
            style={[styles.filterPill, platformFilter === 'all' && styles.filterPillActive]}
            onPress={() => setPlatformFilter('all')}
            activeOpacity={0.75}
          >
            <Text
              style={[
                styles.filterPillText,
                platformFilter === 'all' && styles.filterPillTextActive,
              ]}
            >
              All ({totalAllCount})
            </Text>
          </TouchableOpacity>

          {/* Instagram Reels Filter */}
          <TouchableOpacity
            style={[styles.filterPill, platformFilter === 'instagram' && styles.filterPillActive]}
            onPress={() => setPlatformFilter('instagram')}
            activeOpacity={0.75}
          >
            <InstagramIcon
              size={13}
              color={platformFilter === 'instagram' ? AppColors.white : AppColors.instagramAlt}
            />
            <Text
              style={[
                styles.filterPillText,
                platformFilter === 'instagram' && styles.filterPillTextActive,
              ]}
            >
              Reels ({totalReelsCount})
            </Text>
          </TouchableOpacity>

          {/* YouTube Shorts Filter */}
          <TouchableOpacity
            style={[styles.filterPill, platformFilter === 'youtube' && styles.filterPillActive]}
            onPress={() => setPlatformFilter('youtube')}
            activeOpacity={0.75}
          >
            <YouTubeIcon
              size={13}
              color={platformFilter === 'youtube' ? AppColors.white : AppColors.youtube}
            />
            <Text
              style={[
                styles.filterPillText,
                platformFilter === 'youtube' && styles.filterPillTextActive,
              ]}
            >
              Shorts ({totalShortsCount})
            </Text>
          </TouchableOpacity>

          {/* Sort Pill */}
          <View style={styles.sortPill}>
            <Text style={styles.sortPillText}>Latest</Text>
            <ChevronDown size={13} color={AppColors.textSecondary} />
          </View>
        </ScrollView>
      </View>

      {/* ── REELS CARDS LIST OR MODERATION EMPTY STATE ─────────────── */}
      {approvedItems.length === 0 ? (
        /* Empty / Zero-Tolerance Moderation Proof State */
        <View style={styles.emptyCard}>
          <View style={styles.emptyIconContainer}>
            <Video size={28} color={AppColors.primary} />
          </View>
          <Text style={styles.emptyTitle}>No approved reels yet</Text>
          <Text style={styles.emptySubtitle}>
            Travel reels for this destination will appear here once they pass our moderation review.
          </Text>

          <View style={styles.moderationNoticeBox}>
            <ShieldCheck size={16} color={AppColors.success} />
            <Text style={styles.moderationNoticeText}>
              Zero-Tolerance Content Safety: Pending or unapproved submissions remain hidden.
            </Text>
          </View>

          <TouchableOpacity
            style={styles.emptySubmitBtn}
            onPress={handleShareClick}
            activeOpacity={0.85}
          >
            <Text style={styles.emptySubmitBtnText}>+ Submit a Reel / Short</Text>
          </TouchableOpacity>
        </View>
      ) : (
        /* Content Cards List (Horizontal split-card design) */
        <View style={styles.cardsList}>
          {approvedItems.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={styles.horizontalCard}
              activeOpacity={0.92}
              onPress={() => setSelectedReel(item)}
            >
              {/* Left Column: Video Thumbnail */}
              <View style={styles.thumbColumn}>
                <Image source={{ uri: item.thumbnailUrl }} style={styles.thumbnailImg} />
                <View style={styles.thumbDarkGradient} />

                {/* Top Left Platform Badge */}
                <View
                  style={[
                    styles.platformTag,
                    {
                      backgroundColor:
                        item.platform === 'instagram' ? AppColors.instagram : AppColors.youtube,
                    },
                  ]}
                >
                  {item.platform === 'instagram' ? (
                    <InstagramIcon size={10} color={AppColors.white} />
                  ) : (
                    <YouTubeIcon size={10} color={AppColors.white} />
                  )}
                  <Text style={styles.platformTagText}>
                    {item.platform === 'instagram' ? 'REEL' : 'SHORT'}
                  </Text>
                </View>

                {/* Top Right Duration */}
                {item.duration && (
                  <View style={styles.durationTag}>
                    <Text style={styles.durationTagText}>{item.duration}</Text>
                  </View>
                )}

                {/* Center Play Button */}
                <View style={styles.centerPlayCircle}>
                  <Play size={16} color={AppColors.white} fill={AppColors.white} />
                </View>
              </View>

              {/* Right Column: Card Details */}
              <View style={styles.detailsColumn}>
                <View style={styles.detailsTopWrap}>
                  {/* Title */}
                  <Text style={styles.cardTitle} numberOfLines={2}>
                    {item.title}
                  </Text>

                  {/* Creator & Moderation Row */}
                  <View style={styles.creatorRow}>
                    {item.creatorAvatar ? (
                      <Image source={{ uri: item.creatorAvatar }} style={styles.creatorAvatar} />
                    ) : (
                      <View style={styles.creatorAvatarFallback}>
                        <Text style={styles.creatorInitial}>
                          {item.creatorHandle?.[1] || item.creatorHandle?.[0] || 'T'}
                        </Text>
                      </View>
                    )}
                    <Text style={styles.creatorHandle} numberOfLines={1}>
                      {item.creatorHandle}
                    </Text>

                    <View style={styles.approvedPill}>
                      <ShieldCheck size={11} color={AppColors.success} />
                      <Text style={styles.approvedPillText}>Approved</Text>
                    </View>
                  </View>

                  {/* AI Spot Association */}
                  {item.aiAnalysis?.detectedPlace && (
                    <View style={styles.aiSpotPill}>
                      <Sparkles size={11} color={AppColors.primary} />
                      <Text style={styles.aiSpotText} numberOfLines={1}>
                        AI Spot: {item.aiAnalysis.detectedPlace}
                      </Text>
                    </View>
                  )}
                </View>

                {/* Engagement & Secondary Actions Row */}
                <View style={styles.engagementRow}>
                  <View style={styles.leftStats}>
                    {item.likesCount !== undefined && (
                      <View style={styles.statItem}>
                        <Heart size={12} color={AppColors.textMuted} />
                        <Text style={styles.statNumber}>
                          {item.likesCount > 999
                            ? `${(item.likesCount / 1000).toFixed(1).replace('.0', '')},${(item.likesCount % 1000).toString().padStart(3, '0')}`
                            : item.likesCount}
                        </Text>
                      </View>
                    )}

                    {item.viewsCount !== undefined && (
                      <View style={styles.statItem}>
                        <Eye size={12} color={AppColors.textMuted} />
                        <Text style={styles.statNumber}>
                          {item.viewsCount > 999
                            ? `${Math.floor(item.viewsCount / 1000)},${(item.viewsCount % 1000).toString().padStart(3, '0')}`
                            : item.viewsCount}
                        </Text>
                      </View>
                    )}
                  </View>

                  <View style={styles.rightActions}>
                    <Bookmark size={13} color={AppColors.textMuted} />
                    <MoreHorizontal size={14} color={AppColors.textMuted} />
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      )}

      {/* ── MODAL PREVIEW & DETAILS ────────────────────────────────── */}
      <Modal
        visible={!!selectedReel}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setSelectedReel(null)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {selectedReel && (
              <>
                <View style={styles.modalHeader}>
                  <View style={styles.modalTitleRow}>
                    <View
                      style={[
                        styles.platformTag,
                        {
                          backgroundColor:
                            selectedReel.platform === 'instagram'
                              ? AppColors.instagram
                              : AppColors.youtube,
                          position: 'relative',
                          top: 0,
                          left: 0,
                        },
                      ]}
                    >
                      {selectedReel.platform === 'instagram' ? (
                        <InstagramIcon size={12} color={AppColors.white} />
                      ) : (
                        <YouTubeIcon size={12} color={AppColors.white} />
                      )}
                      <Text style={styles.platformTagText}>
                        {selectedReel.platform === 'instagram' ? 'Instagram Reel' : 'YouTube Short'}
                      </Text>
                    </View>
                    <View style={styles.approvedPill}>
                      <ShieldCheck size={12} color={AppColors.success} />
                      <Text style={styles.approvedPillText}>Approved</Text>
                    </View>
                  </View>

                  <TouchableOpacity
                    style={styles.modalCloseBtn}
                    onPress={() => setSelectedReel(null)}
                  >
                    <X size={20} color={AppColors.textPrimary} />
                  </TouchableOpacity>
                </View>

                <ScrollView style={styles.modalBody} showsVerticalScrollIndicator={false}>
                  {/* Thumbnail Preview Banner */}
                  <View style={styles.modalThumbWrap}>
                    <Image
                      source={{ uri: selectedReel.thumbnailUrl }}
                      style={styles.modalThumb}
                    />
                    <TouchableOpacity
                      style={styles.modalPlayOverlay}
                      onPress={() => handleOpenLink(selectedReel.url)}
                      activeOpacity={0.85}
                    >
                      <View style={styles.largePlayCircle}>
                        <Play size={24} color={AppColors.white} fill={AppColors.white} />
                      </View>
                      <Text style={styles.playPromptText}>
                        Watch on {selectedReel.platform === 'instagram' ? 'Instagram' : 'YouTube'}
                      </Text>
                    </TouchableOpacity>
                  </View>

                  <Text style={styles.modalReelTitle}>{selectedReel.title}</Text>

                  <View style={styles.modalCreatorRow}>
                    {selectedReel.creatorAvatar && (
                      <Image
                        source={{ uri: selectedReel.creatorAvatar }}
                        style={styles.modalAvatar}
                      />
                    )}
                    <View>
                      <Text style={styles.modalCreatorName}>{selectedReel.creatorHandle}</Text>
                      <Text style={styles.modalDestSub}>{selectedReel.destination}</Text>
                    </View>
                  </View>

                  {/* AI Analysis Breakdown */}
                  {selectedReel.aiAnalysis && (
                    <View style={styles.aiBreakdownCard}>
                      <View style={styles.aiHeaderRow}>
                        <Sparkles size={16} color={AppColors.primary} />
                        <Text style={styles.aiCardTitle}>AI Travel Insight</Text>
                      </View>

                      {selectedReel.aiAnalysis.summary && (
                        <Text style={styles.aiSummaryText}>
                          {selectedReel.aiAnalysis.summary}
                        </Text>
                      )}

                      {selectedReel.aiAnalysis.vibeTags && (
                        <View style={styles.vibeChipsWrap}>
                          {selectedReel.aiAnalysis.vibeTags.map((tag, idx) => (
                            <View key={idx} style={styles.vibeChip}>
                              <Text style={styles.vibeChipText}>#{tag}</Text>
                            </View>
                          ))}
                        </View>
                      )}

                      {selectedReel.aiAnalysis.bestTimeToVisit && (
                        <View style={styles.timingRow}>
                          <Clock size={13} color={AppColors.textMuted} />
                          <Text style={styles.timingText}>
                            Best time: {selectedReel.aiAnalysis.bestTimeToVisit}
                          </Text>
                        </View>
                      )}
                    </View>
                  )}
                </ScrollView>

                {/* Modal Footer Action */}
                <View style={styles.modalFooter}>
                  <TouchableOpacity
                    style={styles.openExternalBtn}
                    onPress={() => handleOpenLink(selectedReel.url)}
                    activeOpacity={0.85}
                  >
                    <ExternalLink size={18} color={AppColors.textOnPrimary} />
                    <Text style={styles.openExternalBtnText}>
                      Open in {selectedReel.platform === 'instagram' ? 'Instagram App' : 'YouTube App'}
                    </Text>
                  </TouchableOpacity>
                </View>
              </>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 8,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  headerTitleWrap: {
    flex: 1,
    paddingRight: 10,
  },
  titleWithCount: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: AppColors.textPrimary,
    letterSpacing: -0.2,
  },
  countBadge: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#E0F2FE',
    justifyContent: 'center',
    alignItems: 'center',
  },
  countBadgeText: {
    fontSize: 12,
    fontWeight: '800',
    color: AppColors.primary,
  },
  sectionSubtitle: {
    fontSize: 12,
    color: AppColors.textMuted,
    marginTop: 3,
    lineHeight: 17,
  },
  shareReelBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: '#FFF1EE',
    borderWidth: 1,
    borderColor: '#FFD0C5',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 18,
    marginTop: 2,
  },
  shareReelBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: AppColors.accent,
  },

  /* ── FILTER TABS ───────────────────────────────────────────────── */
  filtersRow: {
    marginBottom: 16,
  },
  filtersScroll: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  filterPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 18,
    backgroundColor: AppColors.surface,
    borderWidth: 1,
    borderColor: '#EAE5DC',
  },
  filterPillActive: {
    backgroundColor: AppColors.primary,
    borderColor: AppColors.primary,
  },
  filterPillText: {
    fontSize: 12,
    fontWeight: '600',
    color: AppColors.textPrimary,
  },
  filterPillTextActive: {
    color: AppColors.white,
    fontWeight: '700',
  },
  sortPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 18,
    backgroundColor: AppColors.surface,
    borderWidth: 1,
    borderColor: '#EAE5DC',
  },
  sortPillText: {
    fontSize: 12,
    fontWeight: '600',
    color: AppColors.textPrimary,
  },

  /* ── REEL CARDS (HORIZONTAL SPLIT) ─────────────────────────────── */
  cardsList: {
    gap: 14,
  },
  horizontalCard: {
    flexDirection: 'row',
    backgroundColor: AppColors.surface,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#EAE5DC',
    padding: 10,
    shadowColor: AppColors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  thumbColumn: {
    width: 145,
    height: 165,
    borderRadius: 16,
    overflow: 'hidden',
    position: 'relative',
    backgroundColor: '#10243F',
  },
  thumbnailImg: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  thumbDarkGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(16,36,63,0.22)',
  },
  platformTag: {
    position: 'absolute',
    top: 8,
    left: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 6,
    zIndex: 2,
  },
  platformTagText: {
    color: AppColors.white,
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.2,
  },
  durationTag: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    zIndex: 2,
  },
  durationTagText: {
    color: AppColors.white,
    fontSize: 9,
    fontWeight: '700',
  },
  centerPlayCircle: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginTop: -20,
    marginLeft: -20,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: AppColors.white,
    zIndex: 2,
  },

  /* ── DETAILS COLUMN ────────────────────────────────────────────── */
  detailsColumn: {
    flex: 1,
    paddingLeft: 12,
    paddingRight: 4,
    paddingVertical: 4,
    justifyContent: 'space-between',
  },
  detailsTopWrap: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: AppColors.textPrimary,
    lineHeight: 19,
    marginBottom: 8,
    letterSpacing: -0.2,
  },
  creatorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 6,
  },
  creatorAvatar: {
    width: 20,
    height: 20,
    borderRadius: 10,
  },
  creatorAvatarFallback: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#FFE8E2',
    justifyContent: 'center',
    alignItems: 'center',
  },
  creatorInitial: {
    fontSize: 10,
    fontWeight: '700',
    color: AppColors.accent,
  },
  creatorHandle: {
    fontSize: 11,
    color: AppColors.textSecondary,
    fontWeight: '500',
    flex: 1,
  },
  approvedPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  approvedPillText: {
    fontSize: 10,
    color: AppColors.success,
    fontWeight: '700',
  },
  aiSpotPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#E6F4F8',
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 6,
    alignSelf: 'flex-start',
    marginTop: 2,
  },
  aiSpotText: {
    fontSize: 10,
    color: AppColors.primary,
    fontWeight: '600',
  },

  /* ── ENGAGEMENT ROW ────────────────────────────────────────────── */
  engagementRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#F3EFE8',
    marginTop: 6,
  },
  leftStats: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statNumber: {
    fontSize: 10,
    color: AppColors.textMuted,
    fontWeight: '600',
  },
  rightActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },

  /* ── EMPTY / MODERATION PROOF STATE ────────────────────────────── */
  emptyCard: {
    backgroundColor: AppColors.surface,
    borderRadius: 22,
    padding: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#EAE5DC',
    shadowColor: AppColors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 8,
    elevation: 1,
  },
  emptyIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#FAF7F2',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#EAE5DC',
  },
  emptyTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: AppColors.textPrimary,
    marginBottom: 6,
    letterSpacing: -0.2,
  },
  emptySubtitle: {
    fontSize: 13,
    color: AppColors.textMuted,
    textAlign: 'center',
    lineHeight: 19,
    marginBottom: 16,
    paddingHorizontal: 8,
  },
  moderationNoticeBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    marginBottom: 18,
  },
  moderationNoticeText: {
    flex: 1,
    fontSize: 11,
    color: AppColors.success,
    fontWeight: '600',
    lineHeight: 15,
  },
  emptySubmitBtn: {
    backgroundColor: AppColors.primary,
    paddingHorizontal: 22,
    paddingVertical: 12,
    borderRadius: 22,
    shadowColor: AppColors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 3,
  },
  emptySubmitBtnText: {
    color: AppColors.white,
    fontWeight: '700',
    fontSize: 13,
  },

  /* ── MODAL STYLES ──────────────────────────────────────────────── */
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: AppColors.surface,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '85%',
    paddingBottom: 24,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0EAE1',
  },
  modalTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  modalCloseBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FAF7F2',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalBody: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  modalThumbWrap: {
    width: '100%',
    height: 200,
    borderRadius: 16,
    overflow: 'hidden',
    position: 'relative',
    marginBottom: 16,
  },
  modalThumb: {
    width: '100%',
    height: '100%',
  },
  modalPlayOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(16,36,63,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  largePlayCircle: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: AppColors.white,
  },
  playPromptText: {
    color: AppColors.white,
    fontWeight: '700',
    fontSize: 13,
  },
  modalReelTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: AppColors.textPrimary,
    lineHeight: 24,
    marginBottom: 12,
  },
  modalCreatorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 18,
  },
  modalAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
  },
  modalCreatorName: {
    fontSize: 14,
    fontWeight: '700',
    color: AppColors.textPrimary,
  },
  modalDestSub: {
    fontSize: 12,
    color: AppColors.primary,
    fontWeight: '500',
  },
  aiBreakdownCard: {
    backgroundColor: '#E6F4F8',
    borderRadius: 14,
    padding: 14,
    borderLeftWidth: 4,
    borderLeftColor: AppColors.primary,
    marginBottom: 16,
  },
  aiHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 6,
  },
  aiCardTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: AppColors.textPrimary,
  },
  aiSummaryText: {
    fontSize: 13,
    color: AppColors.textSecondary,
    lineHeight: 18,
    marginBottom: 10,
  },
  vibeChipsWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 8,
  },
  vibeChip: {
    backgroundColor: '#D1EBF5',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  vibeChipText: {
    fontSize: 11,
    fontWeight: '600',
    color: AppColors.primary,
  },
  timingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 4,
  },
  timingText: {
    fontSize: 11,
    color: AppColors.textMuted,
    fontWeight: '500',
  },
  modalFooter: {
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  openExternalBtn: {
    backgroundColor: AppColors.primary,
    height: 50,
    borderRadius: 25,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  openExternalBtnText: {
    color: AppColors.textOnPrimary,
    fontWeight: '700',
    fontSize: 15,
  },
});
