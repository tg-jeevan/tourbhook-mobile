export type VerificationStatus = 'pending' | 'verified' | 'rejected';

export interface GroupMember {
  id: string;
  name: string;
  role: string;
  avatarUrl?: string;
  initials: string;
  emoji: string;
  colorScheme: { bg: string; text: string };
  isCurrentUser?: boolean;
}

export interface GroupMessage {
  id: string;
  groupId: string;
  senderId: string;
  senderName: string;
  senderAvatarEmoji?: string;
  senderInitials?: string;
  senderColor?: string;
  message: string;
  timestamp: string;
  isCurrentUser: boolean;
  type?: 'text' | 'image' | 'system';
}

export interface TravelGroup {
  id: string;
  name: string;
  description?: string;
  statusBadge?: string;
  statusType?: 'popular' | 'active' | 'trending';
  categoryLabel?: string;
  location?: string;
  travelDates?: string;
  memberCount: number;
  maxMembers: number;
  memberAvatarEmojis: string[];
  memberInitials?: string[];
  tags: string[];
  categories: string[];
  notificationsEnabled?: boolean;
}

export const CATEGORY_FILTERS = ['All', 'Adventure', 'Culture', 'Food', 'Beach'] as const;
export type CategoryFilter = (typeof CATEGORY_FILTERS)[number];

export function getMockTravelGroups(): TravelGroup[] {
  return [
    {
      id: 'group-paris',
      name: 'Paris Explorers 🇫🇷',
      description:
        'Planning a Paris trip? Meet fellow travelers, share hidden gems, plan activities and connect with people exploring the city.',
      statusBadge: 'Popular',
      statusType: 'popular',
      categoryLabel: 'ADVENTURE',
      location: 'Paris, France',
      travelDates: '12 Oct – 18 Oct',
      memberCount: 128,
      maxMembers: 150,
      memberAvatarEmojis: ['👩🏻', '👨🏽', '🧑🏻', '🇫🇷'],
      memberInitials: ['M', 'A', 'R'],
      tags: ['Adventure', 'Culture', 'Food'],
      categories: ['adventure', 'culture', 'food'],
      notificationsEnabled: true,
    },
    {
      id: 'group-1',
      name: 'Bali Explorers',
      description: 'Exploring beaches, cafes and hidden gems in Bali together 🌴',
      statusBadge: 'Popular',
      statusType: 'popular',
      categoryLabel: 'BEACH',
      location: 'Bali, Indonesia',
      travelDates: '05 Nov – 15 Nov',
      memberCount: 5,
      maxMembers: 6,
      memberAvatarEmojis: ['👩🏻', '👨🏽', '🧑🏻', '👴🏾'],
      memberInitials: ['A', 'R', 'S'],
      tags: ['Beach', 'Adventure'],
      categories: ['beach', 'adventure'],
      notificationsEnabled: true,
    },
    {
      id: 'group-2',
      name: 'Tokyo Travelers',
      description: "Discovering Tokyo's food spots, culture and nightlife together 🍣",
      statusBadge: 'Active',
      statusType: 'active',
      categoryLabel: 'CULTURE',
      location: 'Tokyo, Japan',
      travelDates: '20 Nov – 28 Nov',
      memberCount: 4,
      maxMembers: 6,
      memberAvatarEmojis: ['🧑🏻', '👩🏽', '👨🏻', '👩🏾'],
      memberInitials: ['K', 'M', 'T'],
      tags: ['Culture', 'Food'],
      categories: ['culture', 'food'],
      notificationsEnabled: true,
    },
    {
      id: 'group-3',
      name: 'Europe Backpackers',
      description: 'Backpacking across Europe, sharing itineraries and travel tips ✈️',
      statusBadge: 'Trending',
      statusType: 'trending',
      categoryLabel: 'ADVENTURE',
      location: 'Central & Western Europe',
      travelDates: '01 Dec – 20 Dec',
      memberCount: 6,
      maxMembers: 8,
      memberAvatarEmojis: ['👨🏼', '👩🏻', '🧑🏽', '👨🏾'],
      memberInitials: ['S', 'D', 'P'],
      tags: ['Adventure', 'Culture'],
      categories: ['adventure', 'culture'],
      notificationsEnabled: true,
    },
  ];
}