import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { Check } from 'lucide-react-native';
import { LanguageItem } from '../data/languages';
import { AppColors } from '../../../core/theme/colors';

export interface LanguageOptionProps {
  language: LanguageItem;
  isSelected: boolean;
  isLoading: boolean;
  onSelect: (language: LanguageItem) => void;
  disabled?: boolean;
}

export const LanguageOption: React.FC<LanguageOptionProps> = ({
  language,
  isSelected,
  isLoading,
  onSelect,
  disabled = false,
}) => {
  return (
    <TouchableOpacity
      style={[
        styles.card,
        isSelected && styles.cardSelected,
        disabled && styles.cardDisabled,
      ]}
      onPress={() => onSelect(language)}
      disabled={disabled || isLoading}
      activeOpacity={0.7}
      accessibilityRole="button"
      accessibilityLabel={`${language.name}, ${language.nativeName}`}
      accessibilityState={{ selected: isSelected, busy: isLoading, disabled }}
    >
      {/* Left Symbol / Script Badge */}
      <View
        style={[
          styles.symbolBadge,
          isSelected && styles.symbolBadgeSelected,
        ]}
      >
        <Text
          style={[
            styles.symbolText,
            isSelected && styles.symbolTextSelected,
          ]}
        >
          {language.symbol}
        </Text>
      </View>

      {/* Language Names */}
      <View style={styles.textContainer}>
        <Text
          style={[
            styles.nativeNameText,
            isSelected && styles.nativeNameTextSelected,
          ]}
        >
          {language.nativeName}
        </Text>
        <Text style={styles.englishNameText}>{language.name}</Text>
      </View>

      {/* Right Selection / Loading State */}
      <View style={styles.actionContainer}>
        {isLoading ? (
          <View style={styles.loadingRow}>
            <Text style={styles.updatingText}>Updating...</Text>
            <ActivityIndicator size="small" color={AppColors.primary} />
          </View>
        ) : isSelected ? (
          <View style={styles.checkCircle}>
            <Check size={14} color={AppColors.white} strokeWidth={2.5} />
          </View>
        ) : (
          <View style={styles.unselectedCircle} />
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: AppColors.surface,
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: AppColors.border,
    shadowColor: AppColors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 3,
    elevation: 1,
  },
  cardSelected: {
    borderColor: AppColors.primary,
    borderWidth: 1.5,
    backgroundColor: '#F0F9FF',
  },
  cardDisabled: {
    opacity: 0.7,
  },
  symbolBadge: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: AppColors.surfaceSubtle,
    borderWidth: 1,
    borderColor: AppColors.borderLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  symbolBadgeSelected: {
    backgroundColor: AppColors.primaryLight,
    borderColor: '#BAE6FD',
  },
  symbolText: {
    fontSize: 16,
    fontWeight: '700',
    color: AppColors.textSecondary,
  },
  symbolTextSelected: {
    color: AppColors.primary,
  },
  textContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  nativeNameText: {
    fontSize: 16,
    fontWeight: '600',
    color: AppColors.textPrimary,
  },
  nativeNameTextSelected: {
    color: AppColors.textPrimary,
    fontWeight: '700',
  },
  englishNameText: {
    fontSize: 13,
    color: AppColors.textMuted,
    marginTop: 2,
    fontWeight: '400',
  },
  actionContainer: {
    marginLeft: 12,
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  loadingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  updatingText: {
    fontSize: 12,
    color: AppColors.primary,
    fontWeight: '600',
  },
  checkCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: AppColors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  unselectedCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 1.5,
    borderColor: AppColors.borderDark,
    backgroundColor: AppColors.surface,
  },
});
