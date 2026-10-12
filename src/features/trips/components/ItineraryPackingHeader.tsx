import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { X } from 'lucide-react-native';
import { AppColors } from '../../../core/theme/colors';

export type ItineraryPackingTab = 'itinerary' | 'packing';

interface ItineraryPackingHeaderProps {
  activeTab: ItineraryPackingTab;
  onSelectTab: (tab: ItineraryPackingTab) => void;
  onClose: () => void;
  title?: string;
  subtitle?: string;
}

export const ItineraryPackingHeader: React.FC<ItineraryPackingHeaderProps> = ({
  activeTab,
  onSelectTab,
  onClose,
  title,
  subtitle,
}) => {
  return (
    <View style={styles.container}>
      {/* Top Row: Close Button + Title */}
      <View style={styles.topRow}>
        <TouchableOpacity
          style={styles.closeBtn}
          onPress={onClose}
          activeOpacity={0.7}
          accessibilityLabel="Close"
        >
          <X size={22} color={AppColors.textPrimary} strokeWidth={2.2} />
        </TouchableOpacity>

        <View style={styles.titleWrap}>
          <Text style={styles.headerTitle} numberOfLines={1}>
            {title || 'My Itinerary'}
          </Text>
          {subtitle ? (
            <Text style={styles.headerSubtitle} numberOfLines={1}>
              {subtitle}
            </Text>
          ) : null}
        </View>

        <View style={styles.placeholder} />
      </View>

      {/* Tabs Row */}
      <View style={styles.tabsRow}>
        <TouchableOpacity
          testID="tab-itinerary-btn"
          style={styles.tabItem}
          onPress={() => onSelectTab('itinerary')}
          activeOpacity={0.8}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === 'itinerary' && styles.tabTextActive,
            ]}
          >
            Itinerary
          </Text>
          {activeTab === 'itinerary' && <View style={styles.activeUnderline} />}
        </TouchableOpacity>

        <TouchableOpacity
          testID="tab-packing-btn"
          style={styles.tabItem}
          onPress={() => onSelectTab('packing')}
          activeOpacity={0.8}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === 'packing' && styles.tabTextActive,
            ]}
          >
            Packing List
          </Text>
          {activeTab === 'packing' && <View style={styles.activeUnderline} />}
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FAF7F2',
    borderBottomWidth: 1,
    borderBottomColor: '#EAE5DC',
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 6,
  },
  closeBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    justifyContent: 'center',
    alignItems: 'center',
  },
  titleWrap: {
    alignItems: 'center',
    justifyContent: 'center',
    maxWidth: '70%',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: AppColors.textPrimary,
    letterSpacing: -0.3,
  },
  headerSubtitle: {
    fontSize: 12,
    fontWeight: '600',
    color: AppColors.textMuted,
    marginTop: 1,
  },
  placeholder: {
    width: 38,
  },
  tabsRow: {
    flexDirection: 'row',
    paddingHorizontal: 24,
    marginTop: 4,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 10,
    position: 'relative',
  },
  tabText: {
    fontSize: 15,
    fontWeight: '700',
    color: AppColors.textMuted,
  },
  tabTextActive: {
    color: AppColors.primary,
    fontWeight: '800',
  },
  activeUnderline: {
    position: 'absolute',
    bottom: 0,
    left: '20%',
    right: '20%',
    height: 3,
    backgroundColor: AppColors.primary,
    borderTopLeftRadius: 3,
    borderTopRightRadius: 3,
  },
});
