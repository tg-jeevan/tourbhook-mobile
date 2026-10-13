import React from 'react';
import { ShieldCheck, Users } from 'lucide-react-native';
import { ConfirmationModal } from '../../../core/components/ConfirmationModal';
import { AppColors } from '../../../core/theme/colors';
import { SubscriptionPlan } from '../../profile/data/subscriptionStore';
import {
  GroupAccessBlockReason,
  getGroupLimits,
} from '../utils/groupAccess';

export function getGroupAccessGateCopy(
  reason: GroupAccessBlockReason,
  plan: SubscriptionPlan,
) {
  const limit = getGroupLimits(plan).joined;
  const canUpgrade = plan === 'free';
  return {
    kyc_required: {
      title: 'KYC verification required',
      message:
        'This group is limited to verified travelers. Complete KYC from your account before joining.',
      confirmText: 'Okay',
    },
    join_limit_reached: {
      title: 'Group joining limit reached',
      message: canUpgrade
        ? `Your free plan allows ${limit} joined groups. Upgrade to increase your allowance.`
        : `Your Voyager plan allows ${limit} joined groups. You have reached this limit.`,
      confirmText: canUpgrade ? 'View plans' : 'Okay',
    },
    group_full: {
      title: 'This group is full',
      message: 'The group has reached its member capacity. Try another travel group.',
      confirmText: 'Okay',
    },
    create_limit_reached: {
      title: 'Group creation limit reached',
      message: canUpgrade
        ? 'Open the plan page to review your group allowances.'
        : 'You have reached the Voyager group creation limit.',
      confirmText: canUpgrade ? 'View plans' : 'Okay',
    },
  }[reason];
}

export function GroupAccessGateModal({
  reason,
  plan,
  onClose,
  onPrimaryAction,
}: {
  reason: GroupAccessBlockReason | null;
  plan: SubscriptionPlan;
  onClose: () => void;
  onPrimaryAction: (reason: GroupAccessBlockReason) => void;
}) {
  if (!reason) {
    return null;
  }

  const copy = getGroupAccessGateCopy(reason, plan);

  return (
    <ConfirmationModal
      visible={true}
      onClose={onClose}
      onConfirm={() => onPrimaryAction(reason)}
      title={copy.title}
      message={copy.message}
      confirmText={copy.confirmText}
      cancelText="Not now"
      isDestructive={false}
      headerIcon={
        reason === 'kyc_required' ? (
          <ShieldCheck size={36} color={AppColors.primary} />
        ) : (
          <Users size={36} color={AppColors.primary} />
        )
      }
    />
  );
}
