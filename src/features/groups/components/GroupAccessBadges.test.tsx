import React from 'react';
import ReactTestRenderer from 'react-test-renderer';
import { GroupAccessBadges } from './GroupAccessBadges';
import { TravelGroup } from '../types/groupTypes';

const group: TravelGroup = {
  id: 'private-verified',
  name: 'Private Verified Group',
  memberCount: 1,
  maxMembers: 6,
  memberAvatarEmojis: [],
  tags: [],
  categories: [],
  visibility: 'private',
  requiresKyc: true,
};

describe('GroupAccessBadges', () => {
  it('shows private and KYC badges when both restrictions are enabled', () => {
    let renderer: ReactTestRenderer.ReactTestRenderer;
    ReactTestRenderer.act(() => {
      renderer = ReactTestRenderer.create(<GroupAccessBadges group={group} />);
    });

    expect(
      renderer!.root.findByProps({ testID: 'private-badge-private-verified' }),
    ).toBeDefined();
    expect(
      renderer!.root.findByProps({ testID: 'kyc-badge-private-verified' }),
    ).toBeDefined();
  });

  it('renders no badges for an unrestricted public group', () => {
    let renderer: ReactTestRenderer.ReactTestRenderer;
    ReactTestRenderer.act(() => {
      renderer = ReactTestRenderer.create(
        <GroupAccessBadges
          group={{ ...group, visibility: 'public', requiresKyc: false }}
        />,
      );
    });

    expect(renderer!.toJSON()).toBeNull();
  });
});
