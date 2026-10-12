import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { CheckCircle2, Sparkles } from 'lucide-react-native';
import { AppColors } from '../../../core/theme/colors';

export interface PackingProgressBannerProps {
  totalItems: number;
  packedItems: number;
  percentage: number;
  motivationalMessage: string;
}

export const PackingProgressBanner: React.FC<PackingProgressBannerProps> = ({
  totalItems,
  packedItems,
  percentage,
  motivationalMessage,
}) => {
  const clampedPercentage = Math.min(100, Math.max(0, percentage));

  if (totalItems === 0) {
    return (
      <View style={styles.cardContainer}>
        <View style={styles.emptyRow}>
          <View style={styles.iconCircleEmpty}>
            <Sparkles size={20} color={AppColors.primary} />
          </View>
          <View style={styles.emptyTextWrap}>
            <Text style={styles.titleText}>Start Your Packing List 🎒</Text>
            <Text style={styles.subtitleText}>{motivationalMessage}</Text>
          </View>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.cardContainer}>
      {/* Top Row: Motivational Title & Percentage Badge */}
      <View style={styles.topRow}>
        <View style={styles.titleCol}>
          <Text style={styles.titleText}>{motivationalMessage}</Text>
          <Text style={styles.subtitleText}>
            {clampedPercentage}% of your packing items have been checked and packed.
          </Text>
        </View>
        <View
          style={[
            styles.percentageBadge,
            clampedPercentage === 100 && styles.percentageBadgeComplete,
          ]}
        >
          {clampedPercentage === 100 ? (
            <CheckCircle2 size={16} color={AppColors.success} />
          ) : (
            <Text style={styles.percentageText}>{clampedPercentage}%</Text>
          )}
        </View>
      </View>

      {/* Progress Bar Track */}
      <View style={styles.progressTrack}>
        <View
          style={[
            styles.progressFill,
            { width: `${clampedPercentage}%` },
            clampedPercentage === 100 && styles.progressFillComplete,
          ]}
        />
      </View>

      {/* Bottom Row: Counts & Milestone Label */}
      <View style={styles.bottomRow}>
        <Text style={styles.counterText}>
          {packedItems} of {totalItems} items packed
        </Text>
        {clampedPercentage === 100 ? (
          <Text style={styles.milestoneComplete}>All packed & ready! ✈️</Text>
        ) : clampedPercentage >= 60 ? (
          <Text style={styles.milestoneProgress}>Almost there!</Text>
        ) : null}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E6E1D8',
    padding: 16,
    marginBottom: 14,
    shadowColor: AppColors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 12,
  },
  titleCol: {
    flex: 1,
  },
  titleText: {
    fontSize: 15,
    fontWeight: '800',
    color: AppColors.textPrimary,
    letterSpacing: -0.2,
    lineHeight: 20,
  },
  subtitleText: {
    fontSize: 12,
    color: AppColors.textSecondary,
    marginTop: 3,
    lineHeight: 16,
  },
  percentageBadge: {
    backgroundColor: '#E0F2FE',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  percentageBadgeComplete: {
    backgroundColor: '#DCFCE7',
  },
  percentageText: {
    fontSize: 13,
    fontWeight: '800',
    color: AppColors.primary,
  },
  progressTrack: {
    height: 8,
    backgroundColor: '#F1ECE4',
    borderRadius: 4,
    overflow: 'hidden',
    marginTop: 12,
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    backgroundColor: AppColors.primary,
    borderRadius: 4,
  },
  progressFillComplete: {
    backgroundColor: AppColors.success,
  },
  bottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  counterText: {
    fontSize: 12,
    fontWeight: '700',
    color: AppColors.textSecondary,
  },
  milestoneProgress: {
    fontSize: 11,
    fontWeight: '700',
    color: AppColors.primary,
  },
  milestoneComplete: {
    fontSize: 11,
    fontWeight: '700',
    color: AppColors.success,
  },
  emptyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconCircleEmpty: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#E0F2FE',
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyTextWrap: {
    flex: 1,
  },
});
