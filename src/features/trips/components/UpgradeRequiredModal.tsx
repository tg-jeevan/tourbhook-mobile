import React from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity } from 'react-native';
import { Sparkles, X, ArrowRight, Compass } from 'lucide-react-native';
import { AppColors } from '../../../core/theme/colors';

interface UpgradeRequiredModalProps {
  visible: boolean;
  onClose: () => void;
  onUpgrade: () => void;
  itineraryCount?: number;
  maxLimit?: number;
}

export const UpgradeRequiredModal: React.FC<UpgradeRequiredModalProps> = ({
  visible,
  onClose,
  onUpgrade,
  itineraryCount = 3,
  maxLimit = 3,
}) => {
  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modalCard}>
          {/* Top Close Button */}
          <TouchableOpacity
            style={styles.closeBtn}
            onPress={onClose}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            accessibilityLabel="Close modal"
          >
            <X size={20} color={AppColors.textSecondary} />
          </TouchableOpacity>

          {/* Sparkles Icon Container */}
          <View style={styles.iconCircle}>
            <Sparkles size={28} color={AppColors.primary} strokeWidth={2.2} />
          </View>

          {/* Title & Description */}
          <Text style={styles.title}>Upgrade to keep exploring</Text>
          <Text style={styles.description}>
            You've reached the {maxLimit}-trip limit on the Free plan. Upgrade to
            create more trips and unlock premium travel features.
          </Text>

          {/* Usage & Plan Info Card */}
          <View style={styles.usageCard}>
            <View style={styles.usageRow}>
              <View style={styles.planBadge}>
                <Compass size={14} color={AppColors.primary} />
                <Text style={styles.planBadgeText}>Free — Explorer</Text>
              </View>
              <Text style={styles.usageCountText}>
                {itineraryCount} / {maxLimit} itineraries used
              </Text>
            </View>

            {/* Progress Bar */}
            <View style={styles.progressTrack}>
              <View style={styles.progressFill} />
            </View>
          </View>

          {/* Primary Upgrade CTA Button */}
          <TouchableOpacity
            style={styles.primaryBtn}
            onPress={onUpgrade}
            activeOpacity={0.88}
          >
            <Text style={styles.primaryBtnText}>Upgrade Plan</Text>
            <ArrowRight size={18} color={AppColors.white} />
          </TouchableOpacity>

          {/* Secondary "Maybe Later" Button */}
          <TouchableOpacity
            style={styles.secondaryBtn}
            onPress={onClose}
            activeOpacity={0.7}
          >
            <Text style={styles.secondaryBtnText}>Maybe Later</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(16, 36, 63, 0.55)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  modalCard: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 28,
    paddingHorizontal: 24,
    paddingTop: 28,
    paddingBottom: 24,
    alignItems: 'center',
    shadowColor: AppColors.black,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 10,
    position: 'relative',
  },
  closeBtn: {
    position: 'absolute',
    top: 18,
    right: 18,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F1ECE4',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  iconCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#E0F2FE',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    borderWidth: 2,
    borderColor: '#BAE6FD',
  },
  title: {
    fontSize: 22,
    fontWeight: '900',
    color: AppColors.textPrimary,
    textAlign: 'center',
    letterSpacing: -0.4,
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    color: AppColors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 20,
    paddingHorizontal: 4,
  },
  usageCard: {
    width: '100%',
    backgroundColor: '#FAF7F2',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#EAE5DC',
    padding: 14,
    marginBottom: 20,
  },
  usageRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  planBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#E0F2FE',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  planBadgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: AppColors.primary,
  },
  usageCountText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FF6B4A', // Sunset coral highlight
  },
  progressTrack: {
    height: 6,
    borderRadius: 3,
    backgroundColor: '#E2E8F0',
    overflow: 'hidden',
  },
  progressFill: {
    width: '100%',
    height: '100%',
    backgroundColor: '#FF6B4A',
    borderRadius: 3,
  },
  primaryBtn: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: AppColors.primary,
    paddingVertical: 15,
    borderRadius: 22,
    shadowColor: AppColors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
    marginBottom: 10,
  },
  primaryBtnText: {
    fontSize: 15,
    fontWeight: '800',
    color: AppColors.white,
  },
  secondaryBtn: {
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  secondaryBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: AppColors.textMuted,
  },
});
