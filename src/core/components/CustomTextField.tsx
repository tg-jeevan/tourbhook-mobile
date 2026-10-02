import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, KeyboardTypeOptions } from 'react-native';
import { AppColors } from '../theme/colors';

interface CustomTextFieldProps {
  label?: string;
  hint: string;
  prefixIcon?: React.ReactNode;
  suffixIcon?: React.ReactNode;
  obscureText?: boolean;
  value: string;
  onChangeText: (text: string) => void;
  keyboardType?: KeyboardTypeOptions;
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
}

export const CustomTextField: React.FC<CustomTextFieldProps> = ({
  label,
  hint,
  prefixIcon,
  suffixIcon,
  obscureText = false,
  value,
  onChangeText,
  keyboardType = 'default',
  autoCapitalize = 'none',
}) => {
  const [focused, setFocused] = useState(false);

  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}
      <View style={[styles.wrapper, focused && styles.focused]}>
        {prefixIcon && <View style={styles.prefix}>{prefixIcon}</View>}
        <TextInput
          style={styles.input}
          placeholder={hint}
          placeholderTextColor={AppColors.textLight}
          value={value}
          onChangeText={onChangeText}
          secureTextEntry={obscureText}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          autoCorrect={false}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
        />
        {suffixIcon && <View style={styles.suffix}>{suffixIcon}</View>}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: AppColors.textPrimary,
    marginBottom: 8,
  },
  wrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: AppColors.surface,
    borderRadius: 16,
    height: 56,
    paddingHorizontal: 20,
    borderWidth: 1.5,
    borderColor: AppColors.border,
  },
  focused: {
    borderColor: AppColors.primary,
  },
  prefix: {
    marginRight: 12,
  },
  suffix: {
    marginLeft: 12,
  },
  input: {
    flex: 1,
    height: '100%',
    color: AppColors.textPrimary,
    fontSize: 14,
    padding: 0,
  },
});
