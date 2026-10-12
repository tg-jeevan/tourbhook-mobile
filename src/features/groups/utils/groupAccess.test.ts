import { TravelGroup } from '../types/groupTypes';
import {
  buildGroupShareContent,
  getCreateGroupBlockReason,
  getGroupLimits,
  getJoinGroupBlockReason,
  getPublicGroupPreview,
} from './groupAccess';

const baseGroup: TravelGroup = {
  id: 'group-test',
  name: 'Test Travelers',
  description: 'A group used for access tests.',
  memberCount: 3,
  maxMembers: 8,
  memberAvatarEmojis: [],
  tags: ['Adventure'],
  categories: ['adventure'],
  visibility: 'public',
  requiresKyc: false,
  inviteUrl: 'https://tourbhook.app/join/group-test',
};

describe('group access rules', () => {
  it('uses separate create and join limits for each plan', () => {
    expect(getGroupLimits('free')).toEqual({ created: 2, joined: 2 });
    expect(getGroupLimits('premium')).toEqual({ created: 5, joined: 5 });
  });

  it('blocks creation only when the current plan limit is reached', () => {
    expect(getCreateGroupBlockReason('free', 1)).toBeNull();
    expect(getCreateGroupBlockReason('free', 2)).toBe('create_limit_reached');
    expect(getCreateGroupBlockReason('premium', 4)).toBeNull();
    expect(getCreateGroupBlockReason('premium', 5)).toBe('create_limit_reached');
  });

  it('requires explicit verification for KYC-only groups', () => {
    const group = { ...baseGroup, requiresKyc: true };

    expect(
      getJoinGroupBlockReason({
        group,
        isVerified: false,
        isAlreadyJoined: false,
        joinedCount: 0,
        plan: 'free',
      }),
    ).toBe('kyc_required');
    expect(
      getJoinGroupBlockReason({
        group,
        isVerified: true,
        isAlreadyJoined: false,
        joinedCount: 0,
        plan: 'free',
      }),
    ).toBeNull();
  });

  it('does not block an already joined user because of the current limit', () => {
    expect(
      getJoinGroupBlockReason({
        group: baseGroup,
        isVerified: false,
        isAlreadyJoined: true,
        joinedCount: 2,
        plan: 'free',
      }),
    ).toBeNull();
  });

  it('blocks full groups before attempting to join', () => {
    expect(
      getJoinGroupBlockReason({
        group: { ...baseGroup, memberCount: 8 },
        isVerified: true,
        isAlreadyJoined: false,
        joinedCount: 0,
        plan: 'premium',
      }),
    ).toBe('group_full');
  });

  it('builds share content only when a backend invitation URL exists', () => {
    expect(buildGroupShareContent({ ...baseGroup, inviteUrl: undefined })).toBeNull();

    const content = buildGroupShareContent(baseGroup);
    expect(content?.title).toBe('Tourbhook: Test Travelers');
    expect(content?.message).toContain(baseGroup.inviteUrl);
    expect(content?.message).toContain('Test Travelers');
  });

  it('filters private groups before applying the Explore preview limit', () => {
    const groups = Array.from({ length: 7 }, (_, index) => ({
      ...baseGroup,
      id: `group-${index}`,
      visibility: index === 0 ? ('private' as const) : ('public' as const),
    }));

    const preview = getPublicGroupPreview(groups);
    expect(preview).toHaveLength(5);
    expect(preview.some(group => group.visibility === 'private')).toBe(false);
    expect(preview[0].id).toBe('group-1');
  });
});
