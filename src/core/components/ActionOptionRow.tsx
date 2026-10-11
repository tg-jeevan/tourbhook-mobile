import React from 'react';
import {
  TouchableOpacity,
  View,
  Text,
  StyleSheet,
  ViewStyle,
} from 'react-native';
import { ChevronRight } from 'lucide-react-native';
import { AppColors } from '../theme/colors';

export interface ActionOptionRowProps {
  icon: React.ReactNode;
  title: string;
  description?: string;
  onPress: () => void;
  isDestructive?: boolean;
  showChevron?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
  testID?: string;
}

export const ActionOptionRow: React.FC<ActionOptionRowProps> = ({
  icon,
  title,
  description,
  onPress,
  isDestructive = false,
  showChevron = true,
  disabled = false,
  style,
  testID,
}) => {
  return (
    <TouchableOpacity
      style={[
        styles.container,
        isDestructive && styles.destructiveContainer,
        disabled && styles.disabled,
        style,
      ]}
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.7}
      testID={testID}
      accessibilityRole="button"
    >
      {/* Icon Capsule */}
      <View
        style={[
          styles.iconWrap,
          isDestructive ? styles.destructiveIconWrap : styles.standardIconWrap,
        ]}
      >
        {icon}
      </View>

      {/* Title & Description */}
      <View style={styles.textCol}>
        <Text
          style={[
            styles.title,
            isDestructive ? styles.destructiveTitle : styles.standardTitle,
          ]}
          numberOfLines={1}
        >
          {title}
        </Text>
        {description ? (
          <Text
            style={[
              styles.description,
              isDestructive
                ? styles.destructiveDescription
                : styles.standardDescription,
            ]}
            numberOfLines={1}
          >
            {description}
          </Text>
        ) : null}
      </View>

      {/* Trailing Chevron */}
      {showChevron && (
        <View style={styles.chevronWrap}>
          <ChevronRight
            size={18}
            color={isDestructive ? AppColors.accent : AppColors.textLight}
          />
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FAF7F2',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#EAE5DC',
    paddingVertical: 12,
    paddingHorizontal: 14,
    marginBottom: 10,
  },
  destructiveContainer: {
    backgroundColor: '#FFF7F5',
    borderColor: '#FED7AA',
  },
  disabled: {
    opacity: 0.5,
  },
  iconWrap: {
    width: 38,
    height: 38,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  standardIconWrap: {
    backgroundColor: '#E0F2FE',
  },
  destructiveIconWrap: {
    backgroundColor: '#FFE8E2',
  },
  textCol: {
    flex: 1,
    justifyContent: 'center',
  },
  title: {
    fontSize: 14,
    fontWeight: '800',
    letterSpacing: -0.2,
    marginBottom: 2,
  },
  standardTitle: {
    color: AppColors.textPrimary,
  },
  destructiveTitle: {
    color: AppColors.accent,
  },
  description: {
    fontSize: 12,
    fontWeight: '500',
    lineHeight: 16,
  },
  standardDescription: {
    color: AppColors.textMuted,
  },
  destructiveDescription: {
    color: '#EA580C',
  },
  chevronWrap: {
    marginLeft: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
