export type VerificationStatus = 'pending' | 'verified' | 'rejected';
export type GroupVisibility = 'public' | 'private';

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
  visibility?: GroupVisibility;
  requiresKyc?: boolean;
  inviteUrl?: string;
  isOwnedByCurrentUser?: boolean;
}

export const CATEGORY_FILTERS = ['All', 'Adventure', 'Culture', 'Food', 'Beach'] as const;
export type CategoryFilter = (typeof CATEGORY_FILTERS)[number];

export function getMockTravelGroups(): TravelGroup[] {
  const groups: TravelGroup[] = [
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
    {
      id: 'group-4',
      name: 'Swiss Alps Hikers 🏔️',
      description: 'Trekking dramatic alpine trails, mountain huts and scenic railways.',
      statusBadge: 'Active',
      statusType: 'active',
      categoryLabel: 'ADVENTURE',
      location: 'Interlaken, Switzerland',
      travelDates: '10 Dec – 17 Dec',
      memberCount: 7,
      maxMembers: 10,
      memberAvatarEmojis: ['🧗‍♂️', '🧑🏼', '👩🏽'],
      memberInitials: ['H', 'K', 'L'],
      tags: ['Adventure', 'Hiking'],
      categories: ['adventure'],
      notificationsEnabled: true,
    },
    {
      id: 'group-5',
      name: 'Kyoto Temple Walkers ⛩️',
      description: 'Quiet morning walks through shrines, tea ceremonies and bamboo groves.',
      statusBadge: 'Popular',
      statusType: 'popular',
      categoryLabel: 'CULTURE',
      location: 'Kyoto, Japan',
      travelDates: '14 Nov – 22 Nov',
      memberCount: 8,
      maxMembers: 12,
      memberAvatarEmojis: ['🎎', '👩🏻', '👨🏼'],
      memberInitials: ['Y', 'T', 'N'],
      tags: ['Culture', 'History'],
      categories: ['culture'],
      notificationsEnabled: true,
    },
    {
      id: 'group-6',
      name: 'Mediterranean Sailing Club ⛵',
      description: 'Island hopping, sunset anchorages and coastal tavernas in the Aegean.',
      statusBadge: 'Trending',
      statusType: 'trending',
      categoryLabel: 'BEACH',
      location: 'Santorini, Greece',
      travelDates: '18 Nov – 26 Nov',
      memberCount: 6,
      maxMembers: 8,
      memberAvatarEmojis: ['⛵', '🌊', '🧑🏻'],
      memberInitials: ['N', 'O', 'G'],
      tags: ['Beach', 'Sailing'],
      categories: ['beach', 'adventure'],
      notificationsEnabled: true,
    },
    {
      id: 'group-7',
      name: 'Bangkok Street Foodies 🍜',
      description: 'Night market crawls, spicy noodles, mango sticky rice and Michelin stalls.',
      statusBadge: 'Active',
      statusType: 'active',
      categoryLabel: 'FOOD',
      location: 'Bangkok, Thailand',
      travelDates: '22 Nov – 30 Nov',
      memberCount: 5,
      maxMembers: 8,
      memberAvatarEmojis: ['🥢', '👩🏽', '👨🏻'],
      memberInitials: ['B', 'P', 'W'],
      tags: ['Food', 'StreetFood'],
      categories: ['food', 'culture'],
      notificationsEnabled: true,
    },
    {
      id: 'group-8',
      name: 'Iceland Aurora Chasers 🌌',
      description: 'Hunting the Northern Lights, exploring ice caves and geothermal lagoons.',
      statusBadge: 'Trending',
      statusType: 'trending',
      categoryLabel: 'ADVENTURE',
      location: 'Reykjavik, Iceland',
      travelDates: '05 Jan – 12 Jan',
      memberCount: 9,
      maxMembers: 12,
      memberAvatarEmojis: ['❄️', '🧑🏼', '👩🏻'],
      memberInitials: ['I', 'J', 'R'],
      tags: ['Adventure', 'Aurora'],
      categories: ['adventure'],
      notificationsEnabled: true,
    },
    {
      id: 'group-9',
      name: 'Amalfi Coast Explorers 🍋',
      description: 'Cliffside strolls, Mediterranean lemon groves and beach clubs.',
      statusBadge: 'Popular',
      statusType: 'popular',
      categoryLabel: 'BEACH',
      location: 'Amalfi, Italy',
      travelDates: '12 Jan – 19 Jan',
      memberCount: 6,
      maxMembers: 8,
      memberAvatarEmojis: ['🏖️', '👩🏼', '👨🏽'],
      memberInitials: ['L', 'M', 'C'],
      tags: ['Beach', 'Scenic'],
      categories: ['beach'],
      notificationsEnabled: true,
    },
    {
      id: 'group-10',
      name: 'Barcelona Tapas Crawl 🍷',
      description: 'Exploring El Born and Gracia for pintxos, sangria and local tapas bars.',
      statusBadge: 'Active',
      statusType: 'active',
      categoryLabel: 'FOOD',
      location: 'Barcelona, Spain',
      travelDates: '18 Jan – 25 Jan',
      memberCount: 7,
      maxMembers: 10,
      memberAvatarEmojis: ['🥘', '🧑🏽', '👩🏻'],
      memberInitials: ['E', 'S', 'P'],
      tags: ['Food', 'Tapas'],
      categories: ['food'],
      notificationsEnabled: true,
    },
    {
      id: 'group-11',
      name: 'Peru Inca Trail Trekkers 🥾',
      description: 'Four-day trek through Cloud Forest ruins arriving at Machu Picchu sunrise.',
      statusBadge: 'Trending',
      statusType: 'trending',
      categoryLabel: 'ADVENTURE',
      location: 'Cusco, Peru',
      travelDates: '01 Feb – 09 Feb',
      memberCount: 5,
      maxMembers: 8,
      memberAvatarEmojis: ['🦙', '👨🏾', '👩🏽'],
      memberInitials: ['C', 'A', 'Z'],
      tags: ['Adventure', 'Trek'],
      categories: ['adventure', 'culture'],
      notificationsEnabled: true,
    },
    {
      id: 'group-12',
      name: 'Rome Antiquities & Art 🏛️',
      description: 'Colosseum underground, Vatican galleries and espresso hopping.',
      statusBadge: 'Popular',
      statusType: 'popular',
      categoryLabel: 'CULTURE',
      location: 'Rome, Italy',
      travelDates: '10 Feb – 16 Feb',
      memberCount: 8,
      maxMembers: 10,
      memberAvatarEmojis: ['🏛️', '🧑🏼', '👨🏻'],
      memberInitials: ['F', 'R', 'V'],
      tags: ['Culture', 'Art'],
      categories: ['culture'],
      notificationsEnabled: true,
    },
  ];

  return groups.map(group => ({
    ...group,
    visibility: group.id === 'group-12' ? 'private' : 'public',
    requiresKyc: group.id === 'group-paris' || group.id === 'group-8',
    inviteUrl: `https://tourbhook.app/join/${group.id}`,
    isOwnedByCurrentUser: false,
  }));
}
