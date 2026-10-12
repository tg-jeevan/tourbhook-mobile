import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Route, Crown, ChevronRight } from 'lucide-react-native';
import { CustomModal } from '../../../core/components/CustomModal';
import { InstagramIcon, YouTubeIcon } from '../../ugc/components/SocialIcons';
import { AppColors } from '../../../core/theme/colors';

export interface TripQuickActionMenuModalProps {
  visible: boolean;
  onClose: () => void;
  onCreateItinerary: () => void;
  onAddInstagramReel: () => void;
  onAddYouTubeShorts: () => void;
  onUpgradePlan: () => void;
}

export const TripQuickActionMenuModal: React.FC<TripQuickActionMenuModalProps> = ({
  visible,
  onClose,
  onCreateItinerary,
  onAddInstagramReel,
  onAddYouTubeShorts,
  onUpgradePlan,
}) => {
  return (
    <CustomModal
      visible={visible}
      onClose={onClose}
      showCloseButton={true}
      showDragHandle={true}
      dismissOnBackdropPress={true}
      title="What would you like to do?"
      subtitle="Plan your next adventure or share travel inspiration."
    >
      <View style={styles.container}>
        {/* Option 1 — Create a New Itinerary */}
        <TouchableOpacity
          style={styles.actionCard}
          onPress={() => {
            onClose();
            onCreateItinerary();
          }}
          activeOpacity={0.7}
          testID="action-create-itinerary"
          accessibilityRole="button"
          accessibilityLabel="Create a New Itinerary"
        >
          <View style={[styles.iconWrap, { backgroundColor: '#E0F2FE' }]}>
            <Route size={20} color={AppColors.primary} strokeWidth={2.2} />
          </View>
          <View style={styles.textWrap}>
            <Text style={styles.actionTitle}>Create a New Itinerary</Text>
            <Text style={styles.actionDesc}>Plan a new trip and build your itinerary.</Text>
          </View>
          <View style={styles.chevronWrap}>
            <ChevronRight size={18} color={AppColors.textMuted} />
          </View>
        </TouchableOpacity>

        {/* Option 2 — Add Your Instagram Reel */}
        <TouchableOpacity
          style={styles.actionCard}
          onPress={() => {
            onClose();
            onAddInstagramReel();
          }}
          activeOpacity={0.7}
          testID="action-add-instagram-reel"
          accessibilityRole="button"
          accessibilityLabel="Add Your Instagram Reel"
        >
          <View style={[styles.iconWrap, { backgroundColor: '#FDF2F8' }]}>
            <InstagramIcon size={20} color="#E1306C" />
          </View>
          <View style={styles.textWrap}>
            <Text style={styles.actionTitle}>Add Your Instagram Reel</Text>
            <Text style={styles.actionDesc}>
              Share an Instagram Reel to discover a destination.
            </Text>
          </View>
          <View style={styles.chevronWrap}>
            <ChevronRight size={18} color={AppColors.textMuted} />
          </View>
        </TouchableOpacity>

        {/* Option 3 — Add Your YouTube Shorts */}
        <TouchableOpacity
          style={styles.actionCard}
          onPress={() => {
            onClose();
            onAddYouTubeShorts();
          }}
          activeOpacity={0.7}
          testID="action-add-youtube-shorts"
          accessibilityRole="button"
          accessibilityLabel="Add Your YouTube Shorts"
        >
          <View style={[styles.iconWrap, { backgroundColor: '#FEF2F2' }]}>
            <YouTubeIcon size={20} color="#EF4444" />
          </View>
          <View style={styles.textWrap}>
            <Text style={styles.actionTitle}>Add Your YouTube Shorts</Text>
            <Text style={styles.actionDesc}>
              Share a YouTube Short to discover a destination.
            </Text>
          </View>
          <View style={styles.chevronWrap}>
            <ChevronRight size={18} color={AppColors.textMuted} />
          </View>
        </TouchableOpacity>

        {/* Option 4 — Want to Upgrade Your Plan? */}
        <TouchableOpacity
          style={[styles.actionCard, styles.upgradeCard]}
          onPress={() => {
            onClose();
            onUpgradePlan();
          }}
          activeOpacity={0.7}
          testID="action-upgrade-plan"
          accessibilityRole="button"
          accessibilityLabel="Want to Upgrade Your Plan?"
        >
          <View style={[styles.iconWrap, { backgroundColor: '#FEF3C7' }]}>
            <Crown size={20} color="#D97706" strokeWidth={2.2} />
          </View>
          <View style={styles.textWrap}>
            <View style={styles.upgradeTitleRow}>
              <Text style={styles.actionTitle}>Want to Upgrade Your Plan?</Text>
              <View style={styles.proBadge}>
                <Text style={styles.proBadgeText}>PRO</Text>
              </View>
            </View>
            <Text style={styles.actionDesc}>Unlock more ways to explore with Voyager.</Text>
          </View>
          <View style={styles.chevronWrap}>
            <ChevronRight size={18} color={AppColors.textMuted} />
          </View>
        </TouchableOpacity>
      </View>
    </CustomModal>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: 8,
    paddingBottom: 6,
  },
  actionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: AppColors.surface,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: AppColors.border,
    paddingVertical: 12,
    paddingHorizontal: 14,
    marginBottom: 10,
    shadowColor: AppColors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 3,
    elevation: 1,
  },
  upgradeCard: {
    borderColor: '#FDE68A',
    backgroundColor: '#FFFDF9',
  },
  iconWrap: {
    width: 42,
    height: 42,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  textWrap: {
    flex: 1,
    justifyContent: 'center',
  },
  upgradeTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  proBadge: {
    backgroundColor: AppColors.primary,
    paddingHorizontal: 6,
    paddingVertical: 1.5,
    borderRadius: 6,
  },
  proBadgeText: {
    fontSize: 9,
    fontWeight: '800',
    color: AppColors.white,
    letterSpacing: 0.5,
  },
  actionTitle: {
    fontSize: 14.5,
    fontWeight: '800',
    color: AppColors.textPrimary,
    marginBottom: 2,
    letterSpacing: -0.2,
  },
  actionDesc: {
    fontSize: 12,
    fontWeight: '500',
    color: AppColors.textMuted,
    lineHeight: 16,
  },
  chevronWrap: {
    marginLeft: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
