import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Typography } from '../theme/typography';
import { AppColors } from '../theme/colors';

export function EmptyState({ icon, message }: { icon: string; message: string }) {
  return (
    <View style={styles.container}>
      <Text style={styles.icon}>{icon}</Text>
      <Text style={styles.message}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { alignItems: 'center', paddingVertical: 40, paddingHorizontal: 24 },
  icon: { fontSize: 32, marginBottom: 12 },
  message: { ...Typography.body, color: AppColors.textMuted, textAlign: 'center' },
});