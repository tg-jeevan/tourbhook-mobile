import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import {
  Trees,
  Utensils,
  Armchair,
  Mountain,
  Sunset,
  Landmark,
  Compass,
  MoreVertical,
} from 'lucide-react-native';
import { TimelineItem } from '../types/itineraryPackingTypes';
import { AppColors } from '../../../core/theme/colors';

interface ItineraryTimelineItemProps {
  item: TimelineItem;
  isLast: boolean;
  onPress: () => void;
  onMenuPress: () => void;
}

export const ItineraryTimelineItem: React.FC<ItineraryTimelineItemProps> = ({
  item,
  isLast,
  onPress,
  onMenuPress,
}) => {
  const getActivityVisual = () => {
    const title = item.title.toLowerCase();
    const sub = item.subtitle.toLowerCase();

    if (item.type === 'break') {
      return {
        bg: '#F3E8FF',
        color: '#7C3AED',
        Icon: Armchair,
      };
    }
    if (
      title.includes('forest') ||
      title.includes('nature') ||
      title.includes('park') ||
      title.includes('tree') ||
      sub.includes('forest')
    ) {
      return {
        bg: '#DCFCE7',
        color: '#059669',
        Icon: Trees,
      };
    }
    if (
      title.includes('lunch') ||
      title.includes('dinner') ||
      title.includes('food') ||
      title.includes('cuisine') ||
      title.includes('café') ||
      title.includes('restaurant')
    ) {
      return {
        bg: '#FEF3C7',
        color: '#D97706',
        Icon: Utensils,
      };
    }
    if (
      title.includes('terrace') ||
      title.includes('mountain') ||
      title.includes('trek') ||
      title.includes('hike') ||
      title.includes('batur')
    ) {
      return {
        bg: '#DCFCE7',
        color: '#059669',
        Icon: Mountain,
      };
    }
    if (
      title.includes('sunset') ||
      title.includes('sunrise') ||
      title.includes('beach') ||
      title.includes('seminyak')
    ) {
      return {
        bg: '#FFEDD5',
        color: '#EA580C',
        Icon: Sunset,
      };
    }
    if (
      title.includes('temple') ||
      title.includes('dance') ||
      title.includes('uluwatu') ||
      title.includes('culture')
    ) {
      return {
        bg: '#FFEDD5',
        color: '#EA580C',
        Icon: Landmark,
      };
    }
    return {
      bg: '#E0F2FE',
      color: '#0284C7',
      Icon: Compass,
    };
  };

  const visual = getActivityVisual();
  const IconComponent = visual.Icon;
  const isBreak = item.type === 'break';

  return (
    <View style={styles.timelineRow}>
      {/* ── LEFT TIMELINE RAIL ──────────────────────────────────────── */}
      <View style={styles.timelineRail}>
        <View style={[styles.timelineDot, isBreak && styles.timelineDotBreak]} />
        {!isLast && (
          <View
            style={[
              styles.timelineLine,
              isBreak && styles.timelineLineDashed,
            ]}
          />
        )}
      </View>

      {/* ── RIGHT ACTIVITY / BREAK CARD ────────────────────────────── */}
      <TouchableOpacity
        style={[
          styles.activityCard,
          isBreak && styles.breakCard,
        ]}
        onPress={onPress}
        activeOpacity={0.88}
      >
        <View style={styles.textColumn}>
          {/* Time */}
          <Text style={styles.timeText}>{item.time}</Text>

          {/* Title */}
          <Text style={styles.titleText} numberOfLines={1}>
            {item.title}
          </Text>

          {/* Subtitle / Duration */}
          <Text style={styles.subtitleText} numberOfLines={1}>
            {item.subtitle}
            {isBreak && item.durationMinutes ? ` · ${item.durationMinutes} min` : ''}
          </Text>
        </View>

        {/* Right Icon Box + Three-Dot Menu */}
        <View style={styles.rightActionsCol}>
          <TouchableOpacity
            style={styles.menuBtn}
            onPress={onMenuPress}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <MoreVertical size={16} color={AppColors.textSecondary} />
          </TouchableOpacity>

          <View style={[styles.iconBox, { backgroundColor: visual.bg }]}>
            <IconComponent size={22} color={visual.color} strokeWidth={2.2} />
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  timelineRow: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  timelineRail: {
    width: 24,
    alignItems: 'center',
    marginRight: 10,
  },
  timelineDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: AppColors.primary,
    marginTop: 20,
    zIndex: 2,
    borderWidth: 2,
    borderColor: '#FAF7F2',
  },
  timelineDotBreak: {
    backgroundColor: '#FAF7F2',
    borderWidth: 2.5,
    borderColor: '#94A3B8',
  },
  timelineLine: {
    width: 2,
    flex: 1,
    backgroundColor: '#CBD5E1',
    marginTop: 2,
    marginBottom: -16,
  },
  timelineLineDashed: {
    backgroundColor: '#E2E8F0',
  },
  activityCard: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    borderWidth: 1,
    borderColor: '#EAE5DC',
    paddingVertical: 14,
    paddingHorizontal: 16,
    shadowColor: AppColors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 6,
    elevation: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  breakCard: {
    backgroundColor: '#FAF5FF',
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: '#E9D5FF',
  },
  textColumn: {
    flex: 1,
    paddingRight: 12,
  },
  timeText: {
    fontSize: 12,
    fontWeight: '600',
    color: AppColors.textMuted,
    marginBottom: 4,
  },
  titleText: {
    fontSize: 16,
    fontWeight: '800',
    color: AppColors.textPrimary,
    letterSpacing: -0.2,
    marginBottom: 4,
  },
  subtitleText: {
    fontSize: 13,
    color: AppColors.textSecondary,
    lineHeight: 18,
  },
  rightActionsCol: {
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    height: '100%',
    minHeight: 64,
  },
  menuBtn: {
    padding: 2,
  },
  iconBox: {
    width: 44,
    height: 44,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 'auto',
  },
});
