import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
} from 'react-native';
import {
  Trees,
  Utensils,
  Armchair,
  Mountain,
  Sunset,
  Landmark,
  Compass,
  MoreVertical,
  Clock,
  MapPin,
  Coffee,
} from 'lucide-react-native';
import { TimelineItem } from '../types/itineraryPackingTypes';
import { AppColors } from '../../../core/theme/colors';

interface ItineraryTimelineItemProps {
  item: TimelineItem;
  isLast: boolean;
  sequenceNumber?: number;
  isSelected?: boolean;
  onPress: () => void;
  onMenuPress: () => void;
}

export const ItineraryTimelineItem: React.FC<ItineraryTimelineItemProps> = ({
  item,
  isLast,
  sequenceNumber,
  isSelected = false,
  onPress,
  onMenuPress,
}) => {
  const [imageError, setImageError] = useState(false);

  const getActivityVisual = () => {
    const title = item.title.toLowerCase();
    const sub = item.subtitle.toLowerCase();
    const cat = (item.category || '').toLowerCase();

    if (item.type === 'break') {
      return {
        bg: '#F3E8FF',
        badgeBg: '#FAF5FF',
        color: '#7C3AED',
        Icon: Coffee,
        categoryLabel: 'Rest & Transit',
      };
    }
    if (
      cat.includes('food') ||
      cat.includes('dining') ||
      title.includes('lunch') ||
      title.includes('dinner') ||
      title.includes('food') ||
      title.includes('cuisine') ||
      title.includes('warung') ||
      title.includes('café') ||
      title.includes('restaurant')
    ) {
      return {
        bg: '#FEF3C7',
        badgeBg: '#FFFBEB',
        color: '#D97706',
        Icon: Utensils,
        categoryLabel: 'Dining',
      };
    }
    if (
      cat.includes('wildlife') ||
      cat.includes('nature') ||
      title.includes('forest') ||
      title.includes('nature') ||
      title.includes('park') ||
      title.includes('monkey') ||
      title.includes('tree') ||
      sub.includes('forest')
    ) {
      return {
        bg: '#DCFCE7',
        badgeBg: '#F0FDF4',
        color: '#059669',
        Icon: Trees,
        categoryLabel: item.category || 'Nature & Wildlife',
      };
    }
    if (
      cat.includes('hike') ||
      cat.includes('adventure') ||
      title.includes('terrace') ||
      title.includes('mountain') ||
      title.includes('trek') ||
      title.includes('hike') ||
      title.includes('batur')
    ) {
      return {
        bg: '#ECFDF5',
        badgeBg: '#F0FDF4',
        color: '#059669',
        Icon: Mountain,
        categoryLabel: item.category || 'Adventure & Hike',
      };
    }
    if (
      cat.includes('beach') ||
      cat.includes('sunset') ||
      title.includes('sunset') ||
      title.includes('sunrise') ||
      title.includes('beach') ||
      title.includes('surf') ||
      title.includes('seminyak')
    ) {
      return {
        bg: '#FFEDD5',
        badgeBg: '#FFF7ED',
        color: '#EA580C',
        Icon: Sunset,
        categoryLabel: item.category || 'Beach & Sunset',
      };
    }
    if (
      cat.includes('landmark') ||
      cat.includes('cultural') ||
      cat.includes('temple') ||
      title.includes('temple') ||
      title.includes('dance') ||
      title.includes('uluwatu') ||
      title.includes('tanah lot') ||
      title.includes('culture')
    ) {
      return {
        bg: '#E0F2FE',
        badgeBg: '#F0F9FF',
        color: '#0284C7',
        Icon: Landmark,
        categoryLabel: item.category || 'Cultural Landmark',
      };
    }
    return {
      bg: '#E0F2FE',
      badgeBg: '#F0F9FF',
      color: '#0E7490',
      Icon: Compass,
      categoryLabel: item.category || 'Sightseeing',
    };
  };

  const visual = getActivityVisual();
  const IconComponent = visual.Icon;
  const isBreak = item.type === 'break';
  const showImage = !!item.imageUri && !imageError && !isBreak;

  return (
    <View style={styles.timelineRow} testID={`timeline-item-${item.id}`}>
      {/* ── LEFT TIMELINE RAIL ──────────────────────────────────────── */}
      <View style={styles.timelineRail}>
        {/* Connecting line */}
        {!isLast && (
          <View
            style={[
              styles.timelineLine,
              isBreak && styles.timelineLineDashed,
            ]}
          />
        )}

        {/* Pin marker / sequence badge */}
        {sequenceNumber && !isBreak ? (
          <View
            style={[
              styles.sequencePin,
              isSelected && styles.sequencePinSelected,
            ]}
          >
            <Text
              style={[
                styles.sequencePinText,
                isSelected && styles.sequencePinTextSelected,
              ]}
            >
              {sequenceNumber}
            </Text>
          </View>
        ) : (
          <View
            style={[
              styles.timelineDot,
              isBreak && styles.timelineDotBreak,
              isSelected && styles.timelineDotSelected,
            ]}
          />
        )}
      </View>

      {/* ── RIGHT ACTIVITY / BREAK CARD ────────────────────────────── */}
      {isBreak ? (
        /* ── COMPACT REST & TRAVEL BREAK CARD ── */
        <TouchableOpacity
          testID={`timeline-break-${item.id}`}
          style={[styles.breakCard, isSelected && styles.cardSelectedHighlight]}
          onPress={onPress}
          activeOpacity={0.85}
          accessibilityRole="button"
          accessibilityLabel={`${item.title}, ${item.time}`}
        >
          <View style={styles.breakIconWrap}>
            <Armchair size={15} color="#7C3AED" strokeWidth={2.2} />
          </View>
          <View style={styles.breakContentCol}>
            <View style={styles.breakTopRow}>
              <Text style={styles.breakTimeText}>{item.time}</Text>
              {item.durationMinutes && (
                <Text style={styles.breakDurationBadge}>
                  {item.durationMinutes} min
                </Text>
              )}
            </View>
            <Text style={styles.breakTitleText} numberOfLines={1}>
              {item.title}
            </Text>
            {!!item.subtitle && (
              <Text style={styles.breakSubtitleText} numberOfLines={1}>
                {item.subtitle}
              </Text>
            )}
          </View>

          <TouchableOpacity
            testID={`break-menu-btn-${item.id}`}
            style={styles.menuBtn}
            onPress={onMenuPress}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            accessibilityLabel="Activity options"
          >
            <MoreVertical size={16} color={AppColors.textMuted} />
          </TouchableOpacity>
        </TouchableOpacity>
      ) : (
        /* ── POLISHED IMAGE-LED ACTIVITY CARD ── */
        <TouchableOpacity
          testID={`timeline-activity-${item.id}`}
          style={[
            styles.activityCard,
            isSelected && styles.activityCardSelected,
          ]}
          onPress={onPress}
          activeOpacity={0.88}
          accessibilityRole="button"
          accessibilityLabel={`${item.title}, ${item.time}`}
        >
          {/* Visual Thumbnail Image or Category Placeholder */}
          <View style={styles.thumbnailContainer}>
            {showImage ? (
              <Image
                testID={`activity-image-${item.id}`}
                source={{ uri: item.imageUri }}
                style={styles.thumbnailImage}
                resizeMode="cover"
                onError={() => setImageError(true)}
              />
            ) : (
              <View
                testID={`activity-image-fallback-${item.id}`}
                style={[
                  styles.categoryFallbackBox,
                  { backgroundColor: visual.bg },
                ]}
              >
                <IconComponent
                  size={26}
                  color={visual.color}
                  strokeWidth={2.2}
                />
              </View>
            )}
          </View>

          {/* Activity Information Column */}
          <View style={styles.infoCol}>
            {/* Top Row: Scheduled Time + Category Badge + Menu */}
            <View style={styles.cardHeaderRow}>
              <View style={styles.timeBadge}>
                <Clock size={11} color={AppColors.primary} strokeWidth={2.2} />
                <Text style={styles.timeText}>{item.time}</Text>
              </View>

              <View
                style={[
                  styles.categoryBadge,
                  { backgroundColor: visual.badgeBg, borderColor: visual.bg },
                ]}
              >
                <Text style={[styles.categoryBadgeText, { color: visual.color }]}>
                  {visual.categoryLabel}
                </Text>
              </View>

              <TouchableOpacity
                testID={`activity-menu-btn-${item.id}`}
                style={styles.menuBtn}
                onPress={onMenuPress}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                accessibilityLabel="Activity menu options"
              >
                <MoreVertical size={16} color={AppColors.textMuted} />
              </TouchableOpacity>
            </View>

            {/* Activity Name */}
            <Text style={styles.titleText} numberOfLines={1}>
              {item.title}
            </Text>

            {/* Short Description */}
            <Text style={styles.descriptionText} numberOfLines={2}>
              {item.subtitle}
            </Text>

            {/* Footer Metadata: Location & Duration */}
            {(item.location || item.duration) && (
              <View style={styles.metaRow}>
                {!!item.location && (
                  <View style={styles.metaItem}>
                    <MapPin size={11} color={AppColors.primary} />
                    <Text style={styles.metaText} numberOfLines={1}>
                      {item.location}
                    </Text>
                  </View>
                )}
                {!!item.duration && (
                  <View style={styles.metaItem}>
                    <Clock size={11} color="#D97706" />
                    <Text style={styles.metaText}>{item.duration}</Text>
                  </View>
                )}
              </View>
            )}
          </View>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  timelineRow: {
    flexDirection: 'row',
    marginBottom: 12,
    position: 'relative',
  },
  timelineRail: {
    width: 26,
    alignItems: 'center',
    marginRight: 10,
    paddingTop: 16,
    position: 'relative',
  },
  timelineLine: {
    position: 'absolute',
    top: 28,
    bottom: -14,
    width: 2,
    left: 12,
    backgroundColor: '#CBD5E1',
    zIndex: 1,
  },
  timelineLineDashed: {
    backgroundColor: '#E2E8F0',
  },
  timelineDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: AppColors.primary,
    zIndex: 2,
    borderWidth: 2,
    borderColor: '#FAF7F2',
  },
  timelineDotBreak: {
    backgroundColor: '#FAF7F2',
    borderWidth: 2.5,
    borderColor: '#A855F7',
  },
  timelineDotSelected: {
    backgroundColor: AppColors.accent,
    transform: [{ scale: 1.25 }],
  },
  sequencePin: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: AppColors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
    zIndex: 2,
    shadowColor: AppColors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.15,
    shadowRadius: 2,
    elevation: 2,
  },
  sequencePinSelected: {
    backgroundColor: AppColors.accent,
    transform: [{ scale: 1.15 }],
  },
  sequencePinText: {
    fontSize: 10,
    fontWeight: '800',
    color: AppColors.white,
  },
  sequencePinTextSelected: {
    color: AppColors.white,
  },

  /* Activity Card */
  activityCard: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#EAE5DC',
    padding: 10,
    shadowColor: AppColors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
    alignItems: 'center',
  },
  activityCardSelected: {
    borderColor: AppColors.primary,
    backgroundColor: '#F8FDFF',
    borderWidth: 1.5,
    shadowColor: AppColors.primary,
    shadowOpacity: 0.12,
  },

  /* Thumbnail */
  thumbnailContainer: {
    width: 80,
    height: 80,
    borderRadius: 14,
    overflow: 'hidden',
    backgroundColor: '#F1F5F9',
  },
  thumbnailImage: {
    width: '100%',
    height: '100%',
  },
  categoryFallbackBox: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },

  /* Info Column */
  infoCol: {
    flex: 1,
    marginLeft: 11,
    justifyContent: 'center',
  },
  cardHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  timeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginRight: 6,
  },
  timeText: {
    fontSize: 11,
    fontWeight: '700',
    color: AppColors.primary,
  },
  categoryBadge: {
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 8,
    borderWidth: 1,
    marginRight: 'auto',
  },
  categoryBadgeText: {
    fontSize: 9.5,
    fontWeight: '700',
  },
  menuBtn: {
    padding: 2,
    marginLeft: 4,
  },
  titleText: {
    fontSize: 15,
    fontWeight: '800',
    color: AppColors.textPrimary,
    letterSpacing: -0.2,
    marginBottom: 2,
  },
  descriptionText: {
    fontSize: 12,
    color: AppColors.textSecondary,
    lineHeight: 16,
    marginBottom: 4,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 10,
    marginTop: 2,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    maxWidth: '75%',
  },
  metaText: {
    fontSize: 11,
    color: AppColors.textMuted,
    fontWeight: '500',
  },

  /* Break / Transit Card */
  breakCard: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FAF5FF',
    borderRadius: 14,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: '#E9D5FF',
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
  cardSelectedHighlight: {
    borderColor: AppColors.primary,
    borderStyle: 'solid',
    borderWidth: 1.5,
  },
  breakIconWrap: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F3E8FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  breakContentCol: {
    flex: 1,
  },
  breakTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 2,
  },
  breakTimeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#7C3AED',
  },
  breakDurationBadge: {
    fontSize: 10,
    fontWeight: '600',
    color: '#9333EA',
    backgroundColor: '#F3E8FF',
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 6,
  },
  breakTitleText: {
    fontSize: 13,
    fontWeight: '700',
    color: AppColors.textPrimary,
  },
  breakSubtitleText: {
    fontSize: 11,
    color: AppColors.textSecondary,
    marginTop: 1,
  },
});
