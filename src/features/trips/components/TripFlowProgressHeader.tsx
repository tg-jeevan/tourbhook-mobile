import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { X, ArrowLeft } from 'lucide-react-native';
import { AppColors } from '../../../core/theme/colors';

interface TripFlowProgressHeaderProps {
  /** 1-based step number */
  currentStep: number;
  /** Total steps in the flow */
  totalSteps?: number;
  /** Step label shown below the dots */
  stepLabel?: string;
  onBack: () => void;
  /** Show X (close) icon. False shows ← (back) */
  showCloseIcon?: boolean;
}

export const TripFlowProgressHeader: React.FC<TripFlowProgressHeaderProps> = ({
  currentStep,
  totalSteps = 6,
  stepLabel,
  onBack,
  showCloseIcon = true,
}) => {
  const steps = Array.from({ length: totalSteps }, (_, i) => i + 1);

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

      {/* Center Progress */}
      <View style={styles.progressCenterWrap}>
        <View style={styles.stepsIndicatorRow}>
          {steps.map((step, idx) => (
            <React.Fragment key={step}>
              {/* Step Dot */}
              <View
                style={[
                  styles.stepDot,
                  currentStep >= step && styles.stepDotActive,
                  currentStep === step && styles.stepDotCurrent,
                ]}
              />
              {/* Connecting line (not after last dot) */}
              {idx < totalSteps - 1 && (
                <View
                  style={[
                    styles.stepLine,
                    currentStep > step && styles.stepLineActive,
                  ]}
                />
              )}
            </React.Fragment>
          ))}
        </View>

        <Text style={styles.stepText}>
          {stepLabel || `Step ${currentStep} of ${totalSteps}`}
        </Text>
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
    gap: 3,
    marginBottom: 4,
  },
  stepDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: '#CBD5E1',
  },
  stepDotActive: {
    backgroundColor: AppColors.primary,
  },
  stepDotCurrent: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  stepLine: {
    width: 18,
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
