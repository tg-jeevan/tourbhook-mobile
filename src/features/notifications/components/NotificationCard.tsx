import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import {
  FileText,
  AlertTriangle,
  Calendar,
  Map,
  Star,
  Bell,
  MapPin,
  MoreVertical,
  ChevronRight,
} from 'lucide-react-native';
import { NotificationItem } from '../types/notificationTypes';
import { AppColors } from '../../../core/theme/colors';

interface NotificationCardProps {
  item: NotificationItem;
  onPress: () => void;
  onMorePress: () => void;
}

export const NotificationCard: React.FC<NotificationCardProps> = ({
  item,
  onPress,
  onMorePress,
}) => {
  const getCategoryConfig = () => {
    if (item.type === 'travel_news') {
      return {
        label: 'Travel News',
        badgeBg: '#E0F2FE',
        badgeText: '#0284C7',
        iconBg: '#E0F2FE',
        iconColor: '#0284C7',
        cardBg: '#F0F9FF',
        borderColor: '#BAE6FD',
        actionBg: '#E0F2FE',
        actionColor: '#0284C7',
        Icon: FileText,
      };
    }
    if (item.type === 'destination_alert') {
      return {
        label: 'Travel Alert',
        badgeBg: '#FFEDD5',
        badgeText: '#EA580C',
        iconBg: '#FEF3C7',
        iconColor: '#D97706',
        cardBg: '#FFFBEB',
        borderColor: '#FED7AA',
        actionBg: '#FFEDD5',
        actionColor: '#EA580C',
        Icon: AlertTriangle,
      };
    }
    if (item.type === 'travel_tip') {
      return {
        label: 'Travel Tip',
        badgeBg: '#F3E8FF',
        badgeText: '#7C3AED',
        iconBg: '#F3E8FF',
        iconColor: '#7C3AED',
        cardBg: '#FAF5FF',
        borderColor: '#E9D5FF',
        actionBg: '#F3E8FF',
        actionColor: '#7C3AED',
        Icon: Star,
      };
    }
    if (item.type === 'itinerary_update') {
      const isBooking = item.title.toLowerCase().includes('booking') || item.title.toLowerCase().includes('hotel');
      return {
        label: 'Itinerary',
        badgeBg: isBooking ? '#CCFBF1' : '#DCFCE7',
        badgeText: isBooking ? '#0D9488' : '#059669',
        iconBg: isBooking ? '#CCFBF1' : '#DCFCE7',
        iconColor: isBooking ? '#0D9488' : '#059669',
        cardBg: isBooking ? '#F0FDFA' : '#F0FDF4',
        borderColor: isBooking ? '#99F6E4' : '#BBF7D0',
        actionBg: isBooking ? '#CCFBF1' : '#DCFCE7',
        actionColor: isBooking ? '#0D9488' : '#059669',
        Icon: isBooking ? Map : Calendar,
      };
    }
    return {
      label: 'Update',
      badgeBg: '#F1F5F9',
      badgeText: '#475569',
      iconBg: '#F1F5F9',
      iconColor: '#475569',
      cardBg: '#FFFFFF',
      borderColor: '#E2E8F0',
      actionBg: '#F1F5F9',
      actionColor: '#475569',
      Icon: Bell,
    };
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

  const config = getCategoryConfig();
  const IconComponent = config.Icon;

  return (
    <TouchableOpacity
      style={[
        styles.cardContainer,
        { backgroundColor: config.cardBg, borderColor: config.borderColor },
      ]}
      onPress={onPress}
      activeOpacity={0.88}
    >
      {/* ── LEFT: ICON CONTAINER ────────────────────────────────── */}
      <View style={[styles.iconCircle, { backgroundColor: config.iconBg }]}>
        <IconComponent size={24} color={config.iconColor} strokeWidth={2.2} />
      </View>

      {/* ── CENTER: CONTENT BODY ────────────────────────────────── */}
      <View style={styles.centerContent}>
        {/* Category Pill */}
        <View style={[styles.categoryBadge, { backgroundColor: config.badgeBg }]}>
          <Text style={[styles.categoryText, { color: config.badgeText }]}>
            {config.label}
          </Text>
        </View>

        {/* Title */}
        <Text style={styles.title} numberOfLines={2}>
          {item.title}
        </Text>

        {/* Description */}
        <Text style={styles.message} numberOfLines={2}>
          {item.message}
        </Text>

        {/* Location / Destination */}
        {item.destination && (
          <View style={styles.locationRow}>
            <MapPin size={12} color={AppColors.primary} strokeWidth={2.2} />
            <Text style={styles.locationText}>{item.destination}</Text>
          </View>
        )}
      </View>

      {/* ── RIGHT: TIME, UNREAD, THREE-DOT, ACTION ARROW ───────── */}
      <View style={styles.rightColumn}>
        {/* Top: Time + Red Unread Dot + More Button */}
        <View style={styles.topMetaRow}>
          <Text style={styles.timeText}>{formatRelativeTime(item.timestamp)}</Text>
          {!item.isRead && <View style={styles.unreadDot} />}
          <TouchableOpacity
            style={styles.moreBtn}
            onPress={onMorePress}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <MoreVertical size={16} color={AppColors.textSecondary} />
          </TouchableOpacity>
        </View>

        {/* Bottom: Circular Action Button */}
        <TouchableOpacity
          style={[styles.actionCircle, { backgroundColor: config.actionBg }]}
          onPress={onPress}
          activeOpacity={0.8}
        >
          <ChevronRight size={18} color={config.actionColor} strokeWidth={2.5} />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    flexDirection: 'row',
    borderRadius: 22,
    borderWidth: 1,
    paddingVertical: 14,
    paddingHorizontal: 14,
    marginBottom: 12,
    shadowColor: AppColors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 6,
    elevation: 1,
    alignItems: 'flex-start',
  },
  iconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    marginTop: 2,
  },
  centerContent: {
    flex: 1,
    paddingRight: 8,
  },
  categoryBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 12,
    marginBottom: 6,
  },
  categoryText: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.1,
  },
  title: {
    fontSize: 15,
    fontWeight: '800',
    color: AppColors.textPrimary,
    lineHeight: 20,
    marginBottom: 4,
    letterSpacing: -0.2,
  },
  message: {
    fontSize: 13,
    color: AppColors.textSecondary,
    lineHeight: 18,
    marginBottom: 8,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  locationText: {
    fontSize: 12,
    fontWeight: '600',
    color: AppColors.primary,
  },
  rightColumn: {
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    height: '100%',
    minHeight: 90,
  },
  topMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  timeText: {
    fontSize: 11,
    color: AppColors.textMuted,
    fontWeight: '500',
  },
  unreadDot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: '#EF4444',
  },
  moreBtn: {
    padding: 2,
    marginLeft: 2,
  },
  actionCircle: {
    width: 34,
    height: 34,
    borderRadius: 17,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 'auto',
  },
});
