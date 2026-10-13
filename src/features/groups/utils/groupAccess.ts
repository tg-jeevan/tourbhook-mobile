import { SubscriptionPlan } from '../../profile/data/subscriptionStore';
import { TravelGroup } from '../types/groupTypes';

export type GroupAccessBlockReason =
  | 'create_limit_reached'
  | 'join_limit_reached'
  | 'kyc_required'
  | 'group_full';

export const GROUP_LIMITS: Record<
  SubscriptionPlan,
  { created: number; joined: number }
> = {
  free: { created: 2, joined: 2 },
  premium: { created: 5, joined: 5 },
};

export function getGroupLimits(plan: SubscriptionPlan) {
  return GROUP_LIMITS[plan];
}

export function getCreateGroupBlockReason(
  plan: SubscriptionPlan,
  createdCount: number,
): GroupAccessBlockReason | null {
  return createdCount >= getGroupLimits(plan).created
    ? 'create_limit_reached'
    : null;
}

export function getJoinGroupBlockReason({
  group,
  isVerified,
  isAlreadyJoined,
  joinedCount,
  plan,
}: {
  group: TravelGroup;
  isVerified: boolean;
  isAlreadyJoined: boolean;
  joinedCount: number;
  plan: SubscriptionPlan;
}): GroupAccessBlockReason | null {
  if (isAlreadyJoined || group.isOwnedByCurrentUser) {
    return null;
  }
  if (group.requiresKyc && !isVerified) {
    return 'kyc_required';
  }
  if (group.memberCount >= group.maxMembers) {
    return 'group_full';
  }
  return joinedCount >= getGroupLimits(plan).joined
    ? 'join_limit_reached'
    : null;
}

export function buildGroupShareContent(
  group: TravelGroup,
): { title: string; message: string } | null {
  const inviteUrl = group.inviteUrl?.trim();
  if (!inviteUrl) {
    return null;
  }

  const destination = group.location ? `\n📍 ${group.location}` : '';
  const dates = group.travelDates ? `\n📅 ${group.travelDates}` : '';
  return {
    title: `Tourbhook: ${group.name}`,
    message: `Join ${group.name} on Tourbhook.${destination}${dates}\n\n${inviteUrl}`,
  };
}

export function getPublicGroupPreview(
  groups: TravelGroup[],
  limit = 5,
): TravelGroup[] {
  return groups.filter(group => group.visibility !== 'private').slice(0, limit);
}
