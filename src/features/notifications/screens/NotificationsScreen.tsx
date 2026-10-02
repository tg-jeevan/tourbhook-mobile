import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  Share,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import {
  Bell,
  Newspaper,
  X,
  Share2,
  Clock,
  MapPin,
  Check,
  CheckCheck,
  Trash2,
  Eye,
  EyeOff,
  Info,
} from 'lucide-react-native';
import { AppStackParamList } from '../../../core/navigation/types';
import {
  NotificationItem,
  NotificationFilterType,
  TravelNewsContent,
} from '../types/notificationTypes';
import { useNotificationState } from '../data/notificationStore';
import { AppColors } from '../../../core/theme/colors';
import { NotificationHeader } from '../components/NotificationHeader';
import { NotificationFilters } from '../components/NotificationFilters';
import { NotificationCard } from '../components/NotificationCard';

interface TimelineSection {
  id: 'today' | 'this_week' | 'earlier';
  title: string;
  dotColor: string;
  items: NotificationItem[];
}

export default function NotificationsScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<AppStackParamList>>();

  // Active notifications and shared unread count from store
  const {
    notifications,
    unreadCount,
    markAllAsRead,
    markAsRead,
    toggleReadStatus,
    deleteNotification,
  } = useNotificationState();

  const [activeFilter, setActiveFilter] = useState<NotificationFilterType>('all');
  const [selectedNews, setSelectedNews] = useState<{
    item: NotificationItem;
    content: TravelNewsContent;
  } | null>(null);
  const [actionItem, setActionItem] = useState<NotificationItem | null>(null);

  // Filtered list based on active tab
  const displayedNotifications = useMemo(() => {
    return notifications.filter((item) => {
      if (activeFilter === 'travel_news') {
        return item.type === 'travel_news' || item.type === 'destination_alert';
      }
      if (activeFilter === 'itinerary') {
        return item.type === 'itinerary_update' || item.type === 'travel_tip';
      }
      return true;
    });
  }, [notifications, activeFilter]);

  // Group notifications into dynamic timeline sections (Today, This Week, Earlier)
  const timelineSections = useMemo<TimelineSection[]>(() => {
    const now = Date.now();
    const ONE_DAY_MS = 24 * 60 * 60 * 1000;
    const ONE_WEEK_MS = 7 * ONE_DAY_MS;

    const todayItems: NotificationItem[] = [];
    const thisWeekItems: NotificationItem[] = [];
    const earlierItems: NotificationItem[] = [];

    displayedNotifications.forEach((item) => {
      const itemTime = new Date(item.timestamp).getTime();
      const ageMs = Math.max(0, now - itemTime);

      if (ageMs < ONE_DAY_MS) {
        todayItems.push(item);
      } else if (ageMs < ONE_WEEK_MS) {
        thisWeekItems.push(item);
      } else {
        earlierItems.push(item);
      }
    });

    const sections: TimelineSection[] = [];
    if (todayItems.length > 0) {
      sections.push({
        id: 'today',
        title: 'Today',
        dotColor: '#0E7490', // Ocean Teal
        items: todayItems,
      });
    }
    if (thisWeekItems.length > 0) {
      sections.push({
        id: 'this_week',
        title: 'This Week',
        dotColor: '#0284C7', // Blue
        items: thisWeekItems,
      });
    }
    if (earlierItems.length > 0) {
      sections.push({
        id: 'earlier',
        title: 'Earlier',
        dotColor: '#64748B', // Slate
        items: earlierItems,
      });
    }

    return sections;
  }, [displayedNotifications]);

  const handleNotificationPress = (item: NotificationItem) => {
    // Mark as read in store
    markAsRead(item.id);

    // If it has news content, open the news reader modal
    if (item.newsContent) {
      setSelectedNews({ item, content: item.newsContent });
    } else if (item.tripId) {
      // Navigate to trip details if it is an itinerary update
      navigation.navigate('TripDetails', { tripId: item.tripId });
    }
  };

  const handleToggleReadStatus = (item: NotificationItem) => {
    toggleReadStatus(item.id);
    setActionItem(null);
  };

  const handleDeleteNotification = (itemId: string) => {
    deleteNotification(itemId);
    setActionItem(null);
  };

  const handleShareNews = async () => {
    if (!selectedNews) return;
    try {
      await Share.share({
        title: selectedNews.content.headline,
        message: `${selectedNews.content.headline}\n\n${selectedNews.content.fullArticle}\n\nVia Tourbhook Travel Notifications`,
      });
    } catch {
      // Ignored
    }
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      {/* ── 1. HEADER ──────────────────────────────────────────────── */}
      <NotificationHeader
        onClose={() => navigation.goBack()}
        onMarkAllAsRead={markAllAsRead}
        hasUnread={unreadCount > 0}
      />

      {/* ── 2. NOTIFICATION FILTERS ────────────────────────────────── */}
      <NotificationFilters
        activeFilter={activeFilter}
        onSelectFilter={(f) => setActiveFilter(f)}
      />

      {/* ── 3. TIMELINE & LIST ─────────────────────────────────────── */}
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {timelineSections.length === 0 ? (
          <View style={styles.emptyContainer}>
            <View style={styles.emptyIconBg}>
              <Bell size={36} color={AppColors.textMuted} />
            </View>
            <Text style={styles.emptyTitle}>No notifications</Text>
            <Text style={styles.emptySubtitle}>
              {activeFilter === 'travel_news'
                ? 'No recent travel news or advisory notifications for your destinations.'
                : activeFilter === 'itinerary'
                ? 'No recent itinerary updates or booking notices.'
                : 'You are all caught up with your notifications.'}
            </Text>
          </View>
        ) : (
          <View style={styles.timelineContainer}>
            {/* Left Vertical Line */}
            <View style={styles.timelineVerticalLine} />

            {/* Sections */}
            {timelineSections.map((section) => (
              <View key={section.id} style={styles.sectionWrap}>
                {/* Section Header */}
                <View style={styles.sectionHeaderRow}>
                  <View
                    style={[styles.timelineNode, { backgroundColor: section.dotColor }]}
                  />
                  <Text style={styles.sectionTitle}>{section.title}</Text>
                </View>

                {/* Section Cards */}
                <View style={styles.sectionCardsWrap}>
                  {section.items.map((item) => (
                    <NotificationCard
                      key={item.id}
                      item={item}
                      onPress={() => handleNotificationPress(item)}
                      onMorePress={() => setActionItem(item)}
                    />
                  ))}
                </View>
              </View>
            ))}
          </View>
        )}
      </ScrollView>

      {/* ── 4. THREE-DOT ACTION MENU MODAL ─────────────────────────── */}
      <Modal
        visible={!!actionItem}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setActionItem(null)}
      >
        <TouchableOpacity
          style={styles.actionModalOverlay}
          activeOpacity={1}
          onPress={() => setActionItem(null)}
        >
          <View style={styles.actionModalCard}>
            <Text style={styles.actionModalHeader} numberOfLines={1}>
              {actionItem?.title}
            </Text>

            <TouchableOpacity
              style={styles.actionOptionBtn}
              onPress={() => actionItem && handleToggleReadStatus(actionItem)}
            >
              {actionItem?.isRead ? (
                <>
                  <EyeOff size={18} color={AppColors.textPrimary} />
                  <Text style={styles.actionOptionText}>Mark as Unread</Text>
                </>
              ) : (
                <>
                  <Eye size={18} color={AppColors.primary} />
                  <Text style={styles.actionOptionTextPrimary}>Mark as Read</Text>
                </>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.actionOptionBtn}
              onPress={() => actionItem && handleDeleteNotification(actionItem.id)}
            >
              <Trash2 size={18} color="#EF4444" />
              <Text style={styles.actionOptionTextDestructive}>
                Delete Notification
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.actionModalCancelBtn}
              onPress={() => setActionItem(null)}
            >
              <Text style={styles.actionModalCancelText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>

      {/* ── 5. TRAVEL NEWS DETAIL MODAL ────────────────────────────── */}
      <Modal
        visible={!!selectedNews}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setSelectedNews(null)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {/* Modal Header */}
            <View style={styles.modalHeader}>
              <View style={styles.modalHeaderBadge}>
                <Newspaper size={14} color={AppColors.primary} />
                <Text style={styles.modalHeaderBadgeText}>Travel News & Advisory</Text>
              </View>
              <View style={styles.modalActions}>
                <TouchableOpacity
                  style={styles.modalIconBtn}
                  onPress={handleShareNews}
                  accessibilityLabel="Share Article"
                >
                  <Share2 size={18} color={AppColors.textPrimary} />
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.modalIconBtn}
                  onPress={() => setSelectedNews(null)}
                  accessibilityLabel="Close"
                >
                  <X size={20} color={AppColors.textPrimary} />
                </TouchableOpacity>
              </View>
            </View>

            {selectedNews && (
              <ScrollView
                style={styles.modalScroll}
                contentContainerStyle={styles.modalScrollContent}
                showsVerticalScrollIndicator={false}
              >
                {/* Destination and Timestamp */}
                <View style={styles.articleMetaRow}>
                  {selectedNews.item.destination && (
                    <View style={styles.articleDestChip}>
                      <MapPin size={12} color={AppColors.primary} />
                      <Text style={styles.articleDestText}>
                        {selectedNews.item.destination}
                      </Text>
                    </View>
                  )}
                  <View style={styles.articleTimeRow}>
                    <Clock size={12} color={AppColors.textMuted} />
                    <Text style={styles.articleTimeText}>
                      {selectedNews.content.publishedAt}
                    </Text>
                  </View>
                </View>

                {/* Article Headline */}
                <Text style={styles.articleHeadline}>
                  {selectedNews.content.headline}
                </Text>

                {/* Source */}
                <View style={styles.sourceBox}>
                  <Info size={14} color={AppColors.textSecondary} />
                  <Text style={styles.sourceText}>
                    Source: {selectedNews.content.source}
                  </Text>
                </View>

                {/* Key Takeaways */}
                {selectedNews.content.keyTakeaways && (
                  <View style={styles.takeawaysCard}>
                    <Text style={styles.takeawaysTitle}>Traveler Key Takeaways</Text>
                    {selectedNews.content.keyTakeaways.map((point, idx) => (
                      <View key={idx} style={styles.takeawayItem}>
                        <View style={styles.takeawayBullet} />
                        <Text style={styles.takeawayText}>{point}</Text>
                      </View>
                    ))}
                  </View>
                )}

                {/* Full Article Content */}
                <Text style={styles.articleBody}>
                  {selectedNews.content.fullArticle}
                </Text>

                {/* Affected Places */}
                {selectedNews.content.affectedPlaces && (
                  <View style={styles.affectedSection}>
                    <Text style={styles.affectedTitle}>Affected Locations</Text>
                    <View style={styles.affectedChipsWrap}>
                      {selectedNews.content.affectedPlaces.map((place, idx) => (
                        <View key={idx} style={styles.affectedChip}>
                          <MapPin size={12} color={AppColors.textSecondary} />
                          <Text style={styles.affectedChipText}>{place}</Text>
                        </View>
                      ))}
                    </View>
                  </View>
                )}
              </ScrollView>
            )}

            {/* Modal Bottom Button */}
            <View style={styles.modalFooter}>
              <TouchableOpacity
                style={styles.modalDismissBtn}
                onPress={() => setSelectedNews(null)}
              >
                <Text style={styles.modalDismissBtnText}>Close Travel Update</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FAF7F2',
  },
  scrollContent: {
    paddingBottom: 40,
  },

  /* ── Timeline ── */
  timelineContainer: {
    position: 'relative',
    paddingLeft: 8,
    paddingRight: 16,
  },
  timelineVerticalLine: {
    position: 'absolute',
    top: 14,
    bottom: 24,
    left: 20,
    width: 2,
    backgroundColor: '#E2E8F0',
    zIndex: 0,
  },
  sectionWrap: {
    marginBottom: 20,
    position: 'relative',
    zIndex: 1,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 16,
    marginBottom: 12,
  },
  timelineNode: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 10,
    borderWidth: 2,
    borderColor: '#FAF7F2',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: AppColors.textPrimary,
    letterSpacing: -0.2,
  },
  sectionCardsWrap: {
    paddingLeft: 16,
  },

  /* ── Empty State ── */
  emptyContainer: {
    paddingTop: 80,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  emptyIconBg: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: AppColors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: AppColors.borderLight,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: AppColors.textPrimary,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: AppColors.textMuted,
    textAlign: 'center',
    lineHeight: 20,
  },

  /* ── Action Menu Modal ── */
  actionModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-end',
    padding: 16,
  },
  actionModalCard: {
    backgroundColor: AppColors.surface,
    borderRadius: 24,
    padding: 20,
    shadowColor: AppColors.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  actionModalHeader: {
    fontSize: 14,
    fontWeight: '700',
    color: AppColors.textMuted,
    marginBottom: 16,
    textAlign: 'center',
  },
  actionOptionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: AppColors.borderLight,
  },
  actionOptionText: {
    fontSize: 15,
    fontWeight: '600',
    color: AppColors.textPrimary,
  },
  actionOptionTextPrimary: {
    fontSize: 15,
    fontWeight: '700',
    color: AppColors.primary,
  },
  actionOptionTextDestructive: {
    fontSize: 15,
    fontWeight: '600',
    color: '#EF4444',
  },
  actionModalCancelBtn: {
    marginTop: 12,
    paddingVertical: 12,
    alignItems: 'center',
  },
  actionModalCancelText: {
    fontSize: 15,
    fontWeight: '700',
    color: AppColors.textSecondary,
  },

  /* ── Travel News Modal ── */
  modalOverlay: {
    flex: 1,
    backgroundColor: AppColors.overlay,
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: AppColors.surface,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    maxHeight: '88%',
    paddingBottom: 24,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: AppColors.borderLight,
  },
  modalHeaderBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: AppColors.primaryLight,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  modalHeaderBadgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: AppColors.primaryDark,
  },
  modalActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  modalIconBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: AppColors.surfaceMuted,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalScroll: {
    paddingHorizontal: 20,
  },
  modalScrollContent: {
    paddingVertical: 16,
  },
  articleMetaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  articleDestChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: AppColors.primaryLight,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  articleDestText: {
    fontSize: 12,
    fontWeight: '600',
    color: AppColors.primaryDark,
  },
  articleTimeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  articleTimeText: {
    fontSize: 12,
    color: AppColors.textMuted,
  },
  articleHeadline: {
    fontSize: 20,
    fontWeight: '800',
    color: AppColors.textPrimary,
    lineHeight: 26,
    marginBottom: 10,
  },
  sourceBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: AppColors.surfaceMuted,
    padding: 10,
    borderRadius: 8,
    marginBottom: 16,
  },
  sourceText: {
    fontSize: 12,
    color: AppColors.textSecondary,
  },
  takeawaysCard: {
    backgroundColor: AppColors.primaryLight,
    borderRadius: 12,
    padding: 14,
    borderLeftWidth: 4,
    borderLeftColor: AppColors.primary,
    marginBottom: 18,
  },
  takeawaysTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: AppColors.textPrimary,
    marginBottom: 8,
  },
  takeawayItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    marginBottom: 6,
  },
  takeawayBullet: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: AppColors.primary,
    marginTop: 6,
  },
  takeawayText: {
    fontSize: 13,
    color: AppColors.textPrimary,
    lineHeight: 18,
    flex: 1,
  },
  articleBody: {
    fontSize: 15,
    color: AppColors.textPrimary,
    lineHeight: 23,
    marginBottom: 20,
  },
  affectedSection: {
    marginBottom: 16,
  },
  affectedTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: AppColors.textPrimary,
    marginBottom: 8,
  },
  affectedChipsWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  affectedChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: AppColors.surfaceMuted,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
  },
  affectedChipText: {
    fontSize: 12,
    color: AppColors.textSecondary,
  },
  modalFooter: {
    paddingHorizontal: 20,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: AppColors.borderLight,
  },
  modalDismissBtn: {
    height: 48,
    borderRadius: 24,
    backgroundColor: AppColors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalDismissBtnText: {
    color: AppColors.white,
    fontWeight: '700',
    fontSize: 15,
  },
});
