import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { X, ArrowLeft } from 'lucide-react-native';
import { AppColors } from '../../../core/theme/colors';

interface TripFlowProgressHeaderProps {
  currentStep: 1 | 2 | 3;
  onBack: () => void;
  showCloseIcon?: boolean;
}

export const TripFlowProgressHeader: React.FC<TripFlowProgressHeaderProps> = ({
  currentStep,
  onBack,
  showCloseIcon = true,
}) => {
  return (
    <View style={styles.container}>
      {/* Back / Close Button */}
      <TouchableOpacity
        style={styles.closeBtn}
        onPress={onBack}
        activeOpacity={0.7}
      >
        {showCloseIcon ? (
          <X size={22} color={AppColors.textPrimary} />
        ) : (
          <ArrowLeft size={22} color={AppColors.textPrimary} />
        )}
      </TouchableOpacity>

      {/* Center 3-Step Progress */}
      <View style={styles.progressCenterWrap}>
        <View style={styles.stepsIndicatorRow}>
          {/* Step 1 Dot */}
          <View style={[styles.stepDot, currentStep >= 1 && styles.stepDotActive]} />
          
          {/* Line 1-2 */}
          <View style={[styles.stepLine, currentStep >= 2 && styles.stepLineActive]} />

          {/* Step 2 Dot */}
          <View style={[styles.stepDot, currentStep >= 2 && styles.stepDotActive]} />

          {/* Line 2-3 */}
          <View style={[styles.stepLine, currentStep >= 3 && styles.stepLineActive]} />

          {/* Step 3 Dot */}
          <View style={[styles.stepDot, currentStep >= 3 && styles.stepDotActive]} />
        </View>

        <Text style={styles.stepText}>Step {currentStep} of 3</Text>
      </View>

      {/* Right placeholder to keep center balanced */}
      <View style={styles.rightPlaceholder} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: 'transparent',
  },
  closeBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressCenterWrap: {
    alignItems: 'center',
  },
  stepsIndicatorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 4,
  },
  stepDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#CBD5E1',
  },
  stepDotActive: {
    backgroundColor: AppColors.primary,
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  stepLine: {
    width: 28,
    height: 2,
    backgroundColor: '#E2E8F0',
  },
  stepLineActive: {
    backgroundColor: AppColors.primary,
  },
  stepText: {
    fontSize: 11,
    color: AppColors.textMuted,
    fontWeight: '600',
  },
  rightPlaceholder: {
    width: 38,
  },
});
