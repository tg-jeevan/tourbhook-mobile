export type VerificationStatus = 'pending' | 'verified' | 'rejected';

export interface TravelGroup {
  id: string;
  name: string;
  description?: string;
  statusBadge?: string;
  statusType?: 'popular' | 'active' | 'trending';
  categoryLabel?: string;
  memberCount: number;
  maxMembers: number;
  memberAvatarEmojis: string[];
  memberInitials?: string[];
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
      description: 'Exploring beaches, cafes and hidden gems in Bali together 🌴',
      statusBadge: 'Popular',
      statusType: 'popular',
      categoryLabel: 'BEACH',
      memberCount: 5,
      maxMembers: 6,
      memberAvatarEmojis: ['👩🏻', '👨🏽', '🧑🏻', '👴🏾'],
      memberInitials: ['A', 'R', 'S'],
      tags: ['Beach', 'Adventure'],
      categories: ['beach', 'adventure'],
    },
    {
      id: 'group-2',
      name: 'Tokyo Travelers',
      description: "Discovering Tokyo's food spots, culture and nightlife together 🍣",
      statusBadge: 'Active',
      statusType: 'active',
      categoryLabel: 'CULTURE',
      memberCount: 4,
      maxMembers: 6,
      memberAvatarEmojis: ['🧑🏻', '👩🏽', '👨🏻', '👩🏾'],
      memberInitials: ['K', 'M', 'T'],
      tags: ['Culture', 'Food'],
      categories: ['culture', 'food'],
    },
    {
      id: 'group-3',
      name: 'Europe Backpackers',
      description: 'Backpacking across Europe, sharing itineraries and travel tips ✈️',
      statusBadge: 'Trending',
      statusType: 'trending',
      categoryLabel: 'ADVENTURE',
      memberCount: 6,
      maxMembers: 8,
      memberAvatarEmojis: ['👨🏼', '👩🏻', '🧑🏽', '👨🏾'],
      memberInitials: ['S', 'D', 'P'],
      tags: ['Adventure', 'Culture'],
      categories: ['adventure', 'culture'],
    },
  ];
}