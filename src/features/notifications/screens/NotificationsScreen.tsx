import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Modal,
  ScrollView,
  Share,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import {
  Bell,
  Newspaper,
  Compass,
  Calendar,
  AlertTriangle,
  Info,
  CheckCheck,
  X,
  Share2,
  ChevronRight,
  ShieldAlert,
  Clock,
  MapPin,
  Sparkles,
} from 'lucide-react-native';
import { AppStackParamList } from '../../../core/navigation/types';
import { BackButton } from '../../../core/components/BackButton';
import {
  NotificationItem,
  NotificationFilterType,
  TravelNewsContent,
} from '../types/notificationTypes';
import { getActiveNotifications } from '../data/mockNotificationsData';

const PRIMARY_GREEN = '#1FAE5D';
const DARK_NAVY = '#1A1A2E';
const MUTED_TEXT = '#8E8E93';
const ACCENT_PINK = '#E91E63';
const AMBER_ADVISORY = '#F59E0B';

export default function NotificationsScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<AppStackParamList>>();

  // Active notifications filtered by 365-day retention rule
  const [notifications, setNotifications] = useState<NotificationItem[]>(() =>
    getActiveNotifications()
  );
  const [activeFilter, setActiveFilter] = useState<NotificationFilterType>('all');
  const [selectedNews, setSelectedNews] = useState<{
    item: NotificationItem;
    content: TravelNewsContent;
  } | null>(null);

  // Filtered list based on active tab
  const displayedNotifications = useMemo(() => {
    return notifications.filter((item) => {
      if (activeFilter === 'travel_news') {
        return item.type === 'travel_news' || item.type === 'destination_alert';
      }
      if (activeFilter === 'itinerary') {
        return item.type === 'itinerary_update';
      }
      return true;
    });
  }, [notifications, activeFilter]);

  const unreadCount = useMemo(() => {
    return notifications.filter((n) => !n.isRead).length;
  }, [notifications]);

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };

  const handleNotificationPress = (item: NotificationItem) => {
    // Mark as read
    setNotifications((prev) =>
      prev.map((n) => (n.id === item.id ? { ...n, isRead: true } : n))
    );

    // If it has news content, open the news reader modal
    if (item.newsContent) {
      setSelectedNews({ item, content: item.newsContent });
    } else if (item.tripId) {
      // Navigate to trip details if it is an itinerary update
      navigation.navigate('TripDetails', { tripId: item.tripId });
    }
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

  const formatRelativeTime = (isoString: string) => {
    const diffMs = Date.now() - new Date(isoString).getTime();
    const diffMinutes = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMinutes / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMinutes < 60) return `${Math.max(1, diffMinutes)}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 30) return `${diffDays}d ago`;

    try {
      const d = new Date(isoString);
      return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    } catch {
      return `${diffDays}d ago`;
    }
  };

  const getNotificationIcon = (type: NotificationItem['type']) => {
    switch (type) {
      case 'travel_news':
        return <Newspaper size={18} color="#FFFFFF" />;
      case 'destination_alert':
        return <AlertTriangle size={18} color="#FFFFFF" />;
      case 'itinerary_update':
        return <Compass size={18} color="#FFFFFF" />;
      default:
        return <Bell size={18} color="#FFFFFF" />;
    }
  };

  const getNotificationIconBg = (type: NotificationItem['type']) => {
    switch (type) {
      case 'travel_news':
        return PRIMARY_GREEN;
      case 'destination_alert':
        return AMBER_ADVISORY;
      case 'itinerary_update':
        return '#3B82F6';
      default:
        return DARK_NAVY;
    }
  };

  const renderNotificationCard = ({ item }: { item: NotificationItem }) => (
    <TouchableOpacity
      style={[styles.notifCard, !item.isRead && styles.notifCardUnread]}
      activeOpacity={0.85}
      onPress={() => handleNotificationPress(item)}
    >
      <View
        style={[
          styles.iconContainer,
          { backgroundColor: getNotificationIconBg(item.type) },
        ]}
      >
        {getNotificationIcon(item.type)}
      </View>

      <View style={styles.notifBody}>
        <View style={styles.notifHeaderRow}>
          <View style={styles.typeBadge}>
            <Text style={styles.typeBadgeText}>
              {item.type === 'travel_news'
                ? 'Travel News'
                : item.type === 'destination_alert'
                ? 'Travel Alert'
                : 'Itinerary'}
            </Text>
          </View>
          <Text style={styles.timeText}>{formatRelativeTime(item.timestamp)}</Text>
        </View>

        <Text style={[styles.notifTitle, !item.isRead && styles.notifTitleUnread]}>
          {item.title}
        </Text>

        <Text style={styles.notifMessage} numberOfLines={2}>
          {item.message}
        </Text>

        {item.destination && (
          <View style={styles.destinationTagRow}>
            <MapPin size={12} color={PRIMARY_GREEN} />
            <Text style={styles.destinationTagText}>{item.destination}</Text>
          </View>
        )}

        {item.newsContent && (
          <View style={styles.readNewsPrompt}>
            <Text style={styles.readNewsPromptText}>Tap to read full travel update</Text>
            <ChevronRight size={14} color={PRIMARY_GREEN} />
          </View>
        )}
      </View>

      {!item.isRead && <View style={styles.unreadDot} />}
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Top Header */}
      <View style={styles.header}>
        <BackButton onPress={() => navigation.goBack()} />
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>Notifications</Text>
          <Text style={styles.retentionNotice}>365-day history</Text>
        </View>
        {unreadCount > 0 ? (
          <TouchableOpacity style={styles.markReadBtn} onPress={markAllAsRead}>
            <CheckCheck size={18} color={PRIMARY_GREEN} />
          </TouchableOpacity>
        ) : (
          <View style={styles.placeholder} />
        )}
      </View>

      {/* Filter Tabs */}
      <View style={styles.tabsContainer}>
        <TouchableOpacity
          style={[styles.tabBtn, activeFilter === 'all' && styles.tabBtnActive]}
          onPress={() => setActiveFilter('all')}
        >
          <Text
            style={[styles.tabText, activeFilter === 'all' && styles.tabTextActive]}
          >
            All
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.tabBtn,
            activeFilter === 'travel_news' && styles.tabBtnActive,
          ]}
          onPress={() => setActiveFilter('travel_news')}
        >
          <Text
            style={[
              styles.tabText,
              activeFilter === 'travel_news' && styles.tabTextActive,
            ]}
          >
            Travel News & Alerts
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tabBtn, activeFilter === 'itinerary' && styles.tabBtnActive]}
          onPress={() => setActiveFilter('itinerary')}
        >
          <Text
            style={[
              styles.tabText,
              activeFilter === 'itinerary' && styles.tabTextActive,
            ]}
          >
            Itinerary
          </Text>
        </TouchableOpacity>
      </View>

      {/* Notifications List */}
      {displayedNotifications.length === 0 ? (
        <View style={styles.emptyContainer}>
          <View style={styles.emptyIconBg}>
            <Bell size={36} color={MUTED_TEXT} />
          </View>
          <Text style={styles.emptyTitle}>No notifications</Text>
          <Text style={styles.emptySubtitle}>
            {activeFilter === 'travel_news'
              ? 'No recent travel news or advisory notifications for your destinations.'
              : 'You are all caught up with your itinerary updates and travel notifications.'}
          </Text>
        </View>
      ) : (
        <FlatList
          data={displayedNotifications}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          renderItem={renderNotificationCard}
        />
      )}

      {/* Travel News Details Modal (Direct from Notification) */}
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
                <Newspaper size={14} color={PRIMARY_GREEN} />
                <Text style={styles.modalHeaderBadgeText}>Travel News & Advisory</Text>
              </View>
              <View style={styles.modalActions}>
                <TouchableOpacity style={styles.modalIconBtn} onPress={handleShareNews}>
                  <Share2 size={18} color={DARK_NAVY} />
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.modalIconBtn}
                  onPress={() => setSelectedNews(null)}
                >
                  <X size={20} color={DARK_NAVY} />
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
                      <MapPin size={12} color={PRIMARY_GREEN} />
                      <Text style={styles.articleDestText}>
                        {selectedNews.item.destination}
                      </Text>
                    </View>
                  )}
                  <View style={styles.articleTimeRow}>
                    <Clock size={12} color={MUTED_TEXT} />
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
                  <Info size={14} color="#555555" />
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
                          <MapPin size={12} color="#555555" />
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
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F2',
  },
  headerCenter: {
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: DARK_NAVY,
  },
  retentionNotice: {
    fontSize: 11,
    color: MUTED_TEXT,
    marginTop: 1,
  },
  markReadBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#E8F7EE',
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholder: {
    width: 36,
  },
  tabsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 10,
    gap: 8,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5F7',
  },
  tabBtn: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
    backgroundColor: '#F5F5F7',
    borderWidth: 1,
    borderColor: '#E8E8E8',
  },
  tabBtnActive: {
    backgroundColor: PRIMARY_GREEN,
    borderColor: PRIMARY_GREEN,
  },
  tabText: {
    fontSize: 13,
    color: '#555555',
    fontWeight: '500',
  },
  tabTextActive: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  listContent: {
    padding: 16,
    gap: 12,
  },
  notifCard: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: '#EEEEEE',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
    position: 'relative',
  },
  notifCardUnread: {
    backgroundColor: '#F9FDFB',
    borderColor: '#C2EAD0',
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    marginTop: 2,
  },
  notifBody: {
    flex: 1,
  },
  notifHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  typeBadge: {
    backgroundColor: '#F0F0F2',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  typeBadgeText: {
    fontSize: 11,
    fontWeight: '600',
    color: DARK_NAVY,
  },
  timeText: {
    fontSize: 12,
    color: MUTED_TEXT,
  },
  notifTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: DARK_NAVY,
    marginBottom: 4,
  },
  notifTitleUnread: {
    fontWeight: '700',
    color: '#0F172A',
  },
  notifMessage: {
    fontSize: 13,
    color: '#666666',
    lineHeight: 18,
    marginBottom: 6,
  },
  destinationTagRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 6,
  },
  destinationTagText: {
    fontSize: 12,
    color: PRIMARY_GREEN,
    fontWeight: '600',
  },
  readNewsPrompt: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 2,
  },
  readNewsPromptText: {
    fontSize: 12,
    fontWeight: '600',
    color: PRIMARY_GREEN,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: PRIMARY_GREEN,
    position: 'absolute',
    top: 14,
    right: 14,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  emptyIconBg: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#F5F5F7',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: DARK_NAVY,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: MUTED_TEXT,
    textAlign: 'center',
    lineHeight: 20,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
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
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },
  modalHeaderBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#E8F7EE',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  modalHeaderBadgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: PRIMARY_GREEN,
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
    backgroundColor: '#F5F5F7',
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
    backgroundColor: '#E8F7EE',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  articleDestText: {
    fontSize: 12,
    fontWeight: '600',
    color: PRIMARY_GREEN,
  },
  articleTimeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  articleTimeText: {
    fontSize: 12,
    color: MUTED_TEXT,
  },
  articleHeadline: {
    fontSize: 20,
    fontWeight: '700',
    color: DARK_NAVY,
    lineHeight: 26,
    marginBottom: 10,
  },
  sourceBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#F8F9FA',
    padding: 10,
    borderRadius: 8,
    marginBottom: 16,
  },
  sourceText: {
    fontSize: 12,
    color: '#555555',
  },
  takeawaysCard: {
    backgroundColor: '#F0FBF5',
    borderRadius: 12,
    padding: 14,
    borderLeftWidth: 4,
    borderLeftColor: PRIMARY_GREEN,
    marginBottom: 18,
  },
  takeawaysTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: DARK_NAVY,
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
    backgroundColor: PRIMARY_GREEN,
    marginTop: 6,
  },
  takeawayText: {
    fontSize: 13,
    color: '#333333',
    lineHeight: 18,
    flex: 1,
  },
  articleBody: {
    fontSize: 15,
    color: '#333333',
    lineHeight: 23,
    marginBottom: 20,
  },
  affectedSection: {
    marginBottom: 16,
  },
  affectedTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: DARK_NAVY,
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
    backgroundColor: '#F5F5F7',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
  },
  affectedChipText: {
    fontSize: 12,
    color: '#444444',
  },
  modalFooter: {
    paddingHorizontal: 20,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#EEEEEE',
  },
  modalDismissBtn: {
    height: 48,
    borderRadius: 24,
    backgroundColor: PRIMARY_GREEN,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalDismissBtnText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 15,
  },
});
