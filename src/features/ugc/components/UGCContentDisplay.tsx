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
  MapPin,
  Clock,
  ExternalLink,
  ShieldCheck,
  X,
  Share2,
} from 'lucide-react-native';
import { InstagramIcon, YouTubeIcon } from './SocialIcons';
import { AppStackParamList } from '../../../core/navigation/types';
import { filterApprovedDestinationReels } from '../data/mockUGCData';
import { UGCContentDisplayProps, UGCItem } from '../types/ugcTypes';

const PRIMARY_GREEN = '#1FAE5D';
const DARK_NAVY = '#1A1A2E';
const MUTED_TEXT = '#8E8E93';
const ACCENT_PINK = '#E91E63';
const INSTA_PURPLE = '#C13584';
const YT_RED = '#FF0000';

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
      {/* Section Header */}
      <View style={styles.sectionHeader}>
        <View style={styles.headerTitleColumn}>
          <View style={styles.titleRow}>
            <Text style={styles.sectionTitle}>Traveler Reels & Shorts</Text>
            <View style={styles.countBadge}>
              <Text style={styles.countText}>{approvedItems.length}</Text>
            </View>
          </View>
          <Text style={styles.sectionSubtitle}>
            Curated community videos verified by AI & moderation
          </Text>
        </View>

        <TouchableOpacity
          style={styles.addPostBtn}
          onPress={handleShareClick}
          activeOpacity={0.7}
        >
          <Text style={styles.addPostBtnText}>+ Share Reel</Text>
        </TouchableOpacity>
      </View>

      {/* Platform Filter Tabs */}
      <View style={styles.tabsRow}>
        <TouchableOpacity
          style={[styles.tabChip, platformFilter === 'all' && styles.tabChipActive]}
          onPress={() => setPlatformFilter('all')}
        >
          <Text style={[styles.tabChipText, platformFilter === 'all' && styles.tabChipTextActive]}>
            All ({filterApprovedDestinationReels(destination, 'all').length})
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tabChip, platformFilter === 'instagram' && styles.tabChipActive]}
          onPress={() => setPlatformFilter('instagram')}
        >
          <InstagramIcon size={14} color={platformFilter === 'instagram' ? '#FFFFFF' : INSTA_PURPLE} />
          <Text style={[styles.tabChipText, platformFilter === 'instagram' && styles.tabChipTextActive]}>
            Reels ({filterApprovedDestinationReels(destination, 'instagram').length})
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tabChip, platformFilter === 'youtube' && styles.tabChipActive]}
          onPress={() => setPlatformFilter('youtube')}
        >
          <YouTubeIcon size={14} color={platformFilter === 'youtube' ? '#FFFFFF' : YT_RED} />
          <Text style={[styles.tabChipText, platformFilter === 'youtube' && styles.tabChipTextActive]}>
            Shorts ({filterApprovedDestinationReels(destination, 'youtube').length})
          </Text>
        </TouchableOpacity>
      </View>

      {/* Reels List OR Empty State */}
      {approvedItems.length === 0 ? (
        <View style={styles.emptyCard}>
          <View style={styles.emptyIconCircle}>
            <InstagramIcon size={28} color={MUTED_TEXT} />
          </View>
          <Text style={styles.emptyTitle}>No Approved Reels Yet</Text>
          <Text style={styles.emptySubtitle}>
            Pending or unapproved submissions remain hidden under our zero-tolerance safety policy. Be the first to share a verified Reel for{' '}
            <Text style={styles.boldText}>{destination}</Text>!
          </Text>
          <TouchableOpacity
            style={styles.emptyCtaBtn}
            onPress={handleShareClick}
            activeOpacity={0.8}
          >
            <Text style={styles.emptyCtaText}>Submit a Reel / Short</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.itemsGrid}>
          {approvedItems.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={styles.card}
              activeOpacity={0.9}
              onPress={() => setSelectedReel(item)}
            >
              {/* Video Thumbnail */}
              <View style={styles.thumbnailContainer}>
                <Image source={{ uri: item.thumbnailUrl }} style={styles.thumbnail} />
                <View style={styles.thumbnailOverlay} />

                {/* Platform Badge */}
                <View
                  style={[
                    styles.platformBadge,
                    { backgroundColor: item.platform === 'instagram' ? INSTA_PURPLE : YT_RED },
                  ]}
                >
                  {item.platform === 'instagram' ? (
                    <InstagramIcon size={12} color="#FFFFFF" />
                  ) : (
                    <YouTubeIcon size={12} color="#FFFFFF" />
                  )}
                  <Text style={styles.platformBadgeText}>
                    {item.platform === 'instagram' ? 'Reel' : 'Short'}
                  </Text>
                </View>

                {/* Duration Badge */}
                {item.duration && (
                  <View style={styles.durationBadge}>
                    <Clock size={10} color="#FFFFFF" />
                    <Text style={styles.durationText}>{item.duration}</Text>
                  </View>
                )}

                {/* Center Play Button */}
                <View style={styles.playIconCircle}>
                  <Play size={18} color="#FFFFFF" fill="#FFFFFF" />
                </View>

                {/* Engagement Overlay Bottom */}
                <View style={styles.thumbStatsRow}>
                  {item.likesCount !== undefined && (
                    <View style={styles.thumbStat}>
                      <Heart size={12} color="#FFFFFF" fill="#FFFFFF" />
                      <Text style={styles.thumbStatText}>{item.likesCount.toLocaleString()}</Text>
                    </View>
                  )}
                  {item.viewsCount !== undefined && (
                    <View style={styles.thumbStat}>
                      <Eye size={12} color="#FFFFFF" />
                      <Text style={styles.thumbStatText}>{item.viewsCount.toLocaleString()}</Text>
                    </View>
                  )}
                </View>
              </View>

              {/* Card Body */}
              <View style={styles.cardBody}>
                <Text style={styles.cardTitle} numberOfLines={2}>
                  {item.title}
                </Text>

                <View style={styles.creatorRow}>
                  {item.creatorAvatar ? (
                    <Image source={{ uri: item.creatorAvatar }} style={styles.creatorAvatar} />
                  ) : (
                    <View style={styles.creatorAvatarFallback} />
                  )}
                  <Text style={styles.creatorHandle}>{item.creatorHandle}</Text>
                  <View style={styles.moderationApprovedChip}>
                    <ShieldCheck size={11} color={PRIMARY_GREEN} />
                    <Text style={styles.moderationApprovedText}>Approved</Text>
                  </View>
                </View>

                {/* AI Highlights Insight */}
                {item.aiAnalysis?.detectedPlace && (
                  <View style={styles.aiInsightRow}>
                    <Sparkles size={12} color={PRIMARY_GREEN} />
                    <Text style={styles.aiInsightText} numberOfLines={1}>
                      AI Spot: {item.aiAnalysis.detectedPlace}
                    </Text>
                  </View>
                )}
              </View>
            </TouchableOpacity>
          ))}
        </View>
      )}

      {/* Reel Preview & Details Modal */}
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
                        styles.platformBadge,
                        {
                          backgroundColor:
                            selectedReel.platform === 'instagram' ? INSTA_PURPLE : YT_RED,
                          position: 'relative',
                          top: 0,
                          left: 0,
                        },
                      ]}
                    >
                      {selectedReel.platform === 'instagram' ? (
                        <InstagramIcon size={12} color="#FFFFFF" />
                      ) : (
                        <YouTubeIcon size={12} color="#FFFFFF" />
                      )}
                      <Text style={styles.platformBadgeText}>
                        {selectedReel.platform === 'instagram' ? 'Instagram Reel' : 'YouTube Short'}
                      </Text>
                    </View>
                    <View style={styles.modalApprovedBadge}>
                      <ShieldCheck size={13} color={PRIMARY_GREEN} />
                      <Text style={styles.modalApprovedText}>Moderated & Approved</Text>
                    </View>
                  </View>

                  <TouchableOpacity
                    style={styles.modalCloseBtn}
                    onPress={() => setSelectedReel(null)}
                  >
                    <X size={20} color={DARK_NAVY} />
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
                        <Play size={24} color="#FFFFFF" fill="#FFFFFF" />
                      </View>
                      <Text style={styles.playPromptText}>Watch on {selectedReel.platform === 'instagram' ? 'Instagram' : 'YouTube'}</Text>
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
                        <Sparkles size={16} color={PRIMARY_GREEN} />
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
                          <Clock size={13} color={MUTED_TEXT} />
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
                    <ExternalLink size={18} color="#FFFFFF" />
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
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  headerTitleColumn: {
    flex: 1,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: DARK_NAVY,
  },
  countBadge: {
    backgroundColor: '#E8F7EE',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  countText: {
    color: PRIMARY_GREEN,
    fontSize: 12,
    fontWeight: '700',
  },
  sectionSubtitle: {
    fontSize: 12,
    color: MUTED_TEXT,
    marginTop: 2,
  },
  addPostBtn: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#FCE4EC',
    borderWidth: 1,
    borderColor: '#F8BBD0',
  },
  addPostBtnText: {
    color: ACCENT_PINK,
    fontSize: 13,
    fontWeight: '700',
  },
  tabsRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  tabChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: '#F5F5F7',
    borderWidth: 1,
    borderColor: '#E8E8E8',
  },
  tabChipActive: {
    backgroundColor: PRIMARY_GREEN,
    borderColor: PRIMARY_GREEN,
  },
  tabChipText: {
    fontSize: 12,
    color: '#555555',
    fontWeight: '600',
  },
  tabChipTextActive: {
    color: '#FFFFFF',
  },
  itemsGrid: {
    gap: 16,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#EEEEEE',
    overflow: 'hidden',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  thumbnailContainer: {
    height: 180,
    width: '100%',
    backgroundColor: '#EAEAEA',
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  thumbnail: {
    width: '100%',
    height: '100%',
  },
  thumbnailOverlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(0,0,0,0.25)',
  },
  platformBadge: {
    position: 'absolute',
    top: 10,
    left: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  platformBadgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  durationBadge: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 6,
  },
  durationText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '600',
  },
  playIconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.8)',
  },
  thumbStatsRow: {
    position: 'absolute',
    bottom: 10,
    left: 10,
    flexDirection: 'row',
    gap: 12,
  },
  thumbStat: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  thumbStatText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '600',
  },
  cardBody: {
    padding: 14,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: DARK_NAVY,
    lineHeight: 20,
    marginBottom: 8,
  },
  creatorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 6,
  },
  creatorAvatar: {
    width: 22,
    height: 22,
    borderRadius: 11,
  },
  creatorAvatarFallback: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#E8E8E8',
  },
  creatorHandle: {
    fontSize: 12,
    color: '#555555',
    fontWeight: '500',
    flex: 1,
  },
  moderationApprovedChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: '#E8F7EE',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  moderationApprovedText: {
    fontSize: 10,
    color: PRIMARY_GREEN,
    fontWeight: '700',
  },
  aiInsightRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginTop: 4,
    backgroundColor: '#F0FBF5',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  aiInsightText: {
    fontSize: 11,
    color: PRIMARY_GREEN,
    fontWeight: '600',
  },
  emptyCard: {
    backgroundColor: '#F8F9FA',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#EEEEEE',
  },
  emptyIconCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#EEEEEE',
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: DARK_NAVY,
    marginBottom: 6,
  },
  emptySubtitle: {
    fontSize: 13,
    color: MUTED_TEXT,
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 16,
  },
  boldText: {
    fontWeight: '700',
    color: DARK_NAVY,
  },
  emptyCtaBtn: {
    backgroundColor: PRIMARY_GREEN,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  emptyCtaText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 13,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
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
    borderBottomColor: '#EEEEEE',
  },
  modalTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  modalApprovedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#E8F7EE',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  modalApprovedText: {
    fontSize: 11,
    fontWeight: '700',
    color: PRIMARY_GREEN,
  },
  modalCloseBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F5F5F7',
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
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(0,0,0,0.4)',
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
    borderColor: '#FFFFFF',
  },
  playPromptText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 13,
  },
  modalReelTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: DARK_NAVY,
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
    color: DARK_NAVY,
  },
  modalDestSub: {
    fontSize: 12,
    color: PRIMARY_GREEN,
    fontWeight: '500',
  },
  aiBreakdownCard: {
    backgroundColor: '#F0FBF5',
    borderRadius: 14,
    padding: 14,
    borderLeftWidth: 4,
    borderLeftColor: PRIMARY_GREEN,
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
    color: DARK_NAVY,
  },
  aiSummaryText: {
    fontSize: 13,
    color: '#333333',
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
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#C2EAD0',
  },
  vibeChipText: {
    fontSize: 11,
    color: PRIMARY_GREEN,
    fontWeight: '600',
  },
  timingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  timingText: {
    fontSize: 12,
    color: MUTED_TEXT,
  },
  modalFooter: {
    paddingHorizontal: 20,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#EEEEEE',
  },
  openExternalBtn: {
    height: 48,
    borderRadius: 24,
    backgroundColor: PRIMARY_GREEN,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  openExternalBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
});
