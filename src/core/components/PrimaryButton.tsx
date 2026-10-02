import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator, ViewStyle, TextStyle } from 'react-native';
import { AppColors } from '../theme/colors';

interface PrimaryButtonProps {
  text: string;
  onPressed: () => void;
  isLoading?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export const PrimaryButton: React.FC<PrimaryButtonProps> = ({
  text,
  onPressed,
  isLoading = false,
  style,
  textStyle,
}) => {
  return (
    <TouchableOpacity
      style={[styles.button, style]}
      onPress={isLoading ? undefined : onPressed}
      activeOpacity={0.8}
    >
      {isLoading ? (
        <ActivityIndicator color={AppColors.textOnPrimary} size="small" />
      ) : (
        <Text style={[styles.text, textStyle]}>{text}</Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    width: '100%',
    height: 56,
    borderRadius: 28,
    backgroundColor: AppColors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    color: AppColors.textOnPrimary,
    fontSize: 16,
    fontWeight: '600',
  },
});
