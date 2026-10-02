import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { X, Check } from 'lucide-react-native';
import { AppColors } from '../../../core/theme/colors';

interface NotificationHeaderProps {
  onClose: () => void;
  onMarkAllAsRead: () => void;
  hasUnread: boolean;
}

export const NotificationHeader: React.FC<NotificationHeaderProps> = ({
  onClose,
  onMarkAllAsRead,
  hasUnread,
}) => {
  return (
    <View style={styles.container}>
      {/* Left Close Button */}
      <TouchableOpacity
        style={styles.closeBtn}
        onPress={onClose}
        activeOpacity={0.7}
        accessibilityLabel="Close Notifications"
      >
        <X size={22} color={AppColors.textPrimary} strokeWidth={2.2} />
      </TouchableOpacity>

      {/* Center Title & Subtitle */}
      <View style={styles.centerWrap}>
        <Text style={styles.title}>Notifications</Text>
        <Text style={styles.subtitle}>365-day history</Text>
      </View>

      {/* Right Mark All Read Button */}
      <TouchableOpacity
        style={[styles.markAllBtn, !hasUnread && styles.markAllBtnDimmed]}
        onPress={onMarkAllAsRead}
        activeOpacity={0.75}
        accessibilityLabel="Mark all as read"
      >
        <Check size={20} color={AppColors.primary} strokeWidth={2.5} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 16,
    backgroundColor: 'transparent',
  },
  closeBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  centerWrap: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 22,
    fontWeight: '900',
    color: AppColors.textPrimary,
    letterSpacing: -0.4,
  },
  subtitle: {
    fontSize: 12,
    fontWeight: '500',
    color: AppColors.textMuted,
    marginTop: 2,
  },
  markAllBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#E0F2FE',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: AppColors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 1,
  },
  markAllBtnDimmed: {
    opacity: 0.8,
  },
});
