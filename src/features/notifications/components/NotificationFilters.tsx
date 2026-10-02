import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { LayoutGrid, Newspaper, Map } from 'lucide-react-native';
import { NotificationFilterType } from '../types/notificationTypes';
import { AppColors } from '../../../core/theme/colors';

interface NotificationFiltersProps {
  activeFilter: NotificationFilterType;
  onSelectFilter: (filter: NotificationFilterType) => void;
}

export const NotificationFilters: React.FC<NotificationFiltersProps> = ({
  activeFilter,
  onSelectFilter,
}) => {
  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Filter 1: All */}
        <TouchableOpacity
          style={[
            styles.pillBtn,
            activeFilter === 'all' ? styles.pillBtnActive : styles.pillBtnInactive,
          ]}
          onPress={() => onSelectFilter('all')}
          activeOpacity={0.8}
        >
          <LayoutGrid
            size={16}
            color={activeFilter === 'all' ? AppColors.white : AppColors.textPrimary}
          />
          <Text
            style={[
              styles.pillText,
              activeFilter === 'all' ? styles.pillTextActive : styles.pillTextInactive,
            ]}
          >
            All
          </Text>
        </TouchableOpacity>

        {/* Filter 2: Travel News & Alerts */}
        <TouchableOpacity
          style={[
            styles.pillBtn,
            activeFilter === 'travel_news' ? styles.pillBtnActive : styles.pillBtnInactive,
          ]}
          onPress={() => onSelectFilter('travel_news')}
          activeOpacity={0.8}
        >
          <Newspaper
            size={16}
            color={activeFilter === 'travel_news' ? AppColors.white : AppColors.textPrimary}
          />
          <Text
            style={[
              styles.pillText,
              activeFilter === 'travel_news'
                ? styles.pillTextActive
                : styles.pillTextInactive,
            ]}
          >
            Travel News & Alerts
          </Text>
        </TouchableOpacity>

        {/* Filter 3: Itinerary */}
        <TouchableOpacity
          style={[
            styles.pillBtn,
            activeFilter === 'itinerary' ? styles.pillBtnActive : styles.pillBtnInactive,
          ]}
          onPress={() => onSelectFilter('itinerary')}
          activeOpacity={0.8}
        >
          <Map
            size={16}
            color={activeFilter === 'itinerary' ? AppColors.white : AppColors.textPrimary}
          />
          <Text
            style={[
              styles.pillText,
              activeFilter === 'itinerary'
                ? styles.pillTextActive
                : styles.pillTextInactive,
            ]}
          >
            Itinerary
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingBottom: 16,
  },
  scrollContent: {
    paddingHorizontal: 20,
    flexDirection: 'row',
    gap: 10,
    alignItems: 'center',
  },
  pillBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 24,
  },
  pillBtnActive: {
    backgroundColor: AppColors.primary, // Ocean Teal #0E7490
    shadowColor: AppColors.primary,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 3,
  },
  pillBtnInactive: {
    backgroundColor: AppColors.white,
    borderWidth: 1,
    borderColor: '#EAE5DC',
    shadowColor: AppColors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 3,
    elevation: 1,
  },
  pillText: {
    fontSize: 13,
    fontWeight: '700',
  },
  pillTextActive: {
    color: AppColors.white,
  },
  pillTextInactive: {
    color: AppColors.textPrimary,
  },
});
