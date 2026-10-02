import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { X } from 'lucide-react-native';
import { AppColors } from '../../../core/theme/colors';

export type ItineraryPackingTab = 'itinerary' | 'packing';

interface ItineraryPackingHeaderProps {
  activeTab: ItineraryPackingTab;
  onSelectTab: (tab: ItineraryPackingTab) => void;
  onClose: () => void;
}

export const ItineraryPackingHeader: React.FC<ItineraryPackingHeaderProps> = ({
  activeTab,
  onSelectTab,
  onClose,
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

        <Text style={styles.headerTitle}>My Itinerary</Text>

        <View style={styles.placeholder} />
      </View>

      {/* Tabs Row */}
      <View style={styles.tabsRow}>
        <TouchableOpacity
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
  headerTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: AppColors.textPrimary,
    letterSpacing: -0.3,
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
