import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { LockKeyhole, ShieldCheck } from 'lucide-react-native';
import { AppColors } from '../../../core/theme/colors';
import { TravelGroup } from '../types/groupTypes';

export function GroupAccessBadges({ group }: { group: TravelGroup }) {
  if (group.visibility !== 'private' && !group.requiresKyc) {
    return null;
  }

  return (
    <View style={styles.row}>
      {group.visibility === 'private' ? (
        <View style={styles.privateBadge} testID={`private-badge-${group.id}`}>
          <LockKeyhole size={11} color={AppColors.textSecondary} />
          <Text style={styles.privateText}>Private</Text>
        </View>
      ) : null}
      {group.requiresKyc ? (
        <View style={styles.kycBadge} testID={`kyc-badge-${group.id}`}>
          <ShieldCheck size={11} color={AppColors.primaryDark} />
          <Text style={styles.kycText}>KYC verified</Text>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: 6,
  },
  privateBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 7,
    paddingVertical: 4,
    borderRadius: 999,
    backgroundColor: AppColors.surfaceMuted,
  },
  privateText: {
    fontSize: 10,
    fontWeight: '800',
    color: AppColors.textSecondary,
  },
  kycBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 7,
    paddingVertical: 4,
    borderRadius: 999,
    backgroundColor: AppColors.primaryLight,
  },
  kycText: {
    fontSize: 10,
    fontWeight: '800',
    color: AppColors.primaryDark,
  },
});
