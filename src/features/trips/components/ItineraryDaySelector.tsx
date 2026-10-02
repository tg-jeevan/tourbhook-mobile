import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { ItineraryDay } from '../types/itineraryPackingTypes';
import { AppColors } from '../../../core/theme/colors';

interface ItineraryDaySelectorProps {
  days: ItineraryDay[];
  selectedIndex: number;
  onSelectIndex: (index: number) => void;
}

export const ItineraryDaySelector: React.FC<ItineraryDaySelectorProps> = ({
  days,
  selectedIndex,
  onSelectIndex,
}) => {
  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {days.map((day, index) => {
          const isSelected = index === selectedIndex;

          return (
            <TouchableOpacity
              key={day.id}
              style={[
                styles.dayCard,
                isSelected ? styles.dayCardActive : styles.dayCardInactive,
              ]}
              onPress={() => onSelectIndex(index)}
              activeOpacity={0.8}
            >
              <Text
                style={[
                  styles.dayLabel,
                  isSelected ? styles.dayLabelActive : styles.dayLabelInactive,
                ]}
              >
                {day.dayLabel}
              </Text>
              <Text
                style={[
                  styles.dateLabel,
                  isSelected ? styles.dateLabelActive : styles.dateLabelInactive,
                ]}
              >
                {day.dateLabel}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 12,
  },
  scrollContent: {
    paddingHorizontal: 20,
    flexDirection: 'row',
    gap: 10,
  },
  dayCard: {
    width: 76,
    paddingVertical: 12,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dayCardActive: {
    backgroundColor: AppColors.primary,
    shadowColor: AppColors.primary,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 3,
  },
  dayCardInactive: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#EAE5DC',
    shadowColor: AppColors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 3,
    elevation: 1,
  },
  dayLabel: {
    fontSize: 14,
    fontWeight: '800',
    marginBottom: 2,
  },
  dayLabelActive: {
    color: AppColors.white,
  },
  dayLabelInactive: {
    color: AppColors.textPrimary,
  },
  dateLabel: {
    fontSize: 12,
    fontWeight: '600',
  },
  dateLabelActive: {
    color: '#E0F2FE',
  },
  dateLabelInactive: {
    color: AppColors.textMuted,
  },
});
