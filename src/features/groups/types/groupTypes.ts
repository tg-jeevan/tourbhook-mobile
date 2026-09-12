export type VerificationStatus = 'pending' | 'verified' | 'rejected';

export interface TravelGroup {
  id: string;
  name: string;
  memberCount: number;
  maxMembers: number;
  memberAvatarEmojis: string[];
  tags: string[];
  categories: string[];
}

export const CATEGORY_FILTERS = ['All', 'Adventure', 'Culture', 'Food', 'Beach'] as const;
export type CategoryFilter = (typeof CATEGORY_FILTERS)[number];

export function getMockTravelGroups(): TravelGroup[] {
  return [
    {
      id: 'group-1',
      name: 'Bali Explorers',
      memberCount: 5,
      maxMembers: 6,
      memberAvatarEmojis: ['👩🏻', '👨🏽', '🧑🏻', '👴🏾'],
      tags: ['Beach', 'Adventure'],
      categories: ['beach', 'adventure'],
    },
    {
      id: 'group-2',
      name: 'Tokyo Travelers',
      memberCount: 4,
      maxMembers: 6,
      memberAvatarEmojis: ['🧑🏻', '👩🏽', '👨🏻', '👩🏾'],
      tags: ['Culture', 'Food'],
      categories: ['culture', 'food'],
    },
    {
      id: 'group-3',
      name: 'Europe Backpackers',
      memberCount: 6,
      maxMembers: 8,
      memberAvatarEmojis: ['👨🏼', '👩🏻', '🧑🏽', '👨🏾'],
      tags: ['Adventure', 'Culture'],
      categories: ['adventure', 'culture'],
    },
  ];
}