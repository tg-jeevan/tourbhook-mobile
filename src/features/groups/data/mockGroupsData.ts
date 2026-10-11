import { GroupMember, GroupMessage } from '../types/groupTypes';

export const MOCK_GROUP_MEMBERS: Record<string, GroupMember[]> = {
  'group-paris': [
    {
      id: 'member-1',
      name: 'Maya Sharma',
      role: 'Group Admin • Travel Explorer',
      initials: 'MS',
      emoji: '🌟',
      colorScheme: { bg: '#FFE4E6', text: '#E11D48' },
    },
    {
      id: 'member-2',
      name: 'Aarav Mehta',
      role: 'Adventure Seeker',
      initials: 'AM',
      emoji: '🎒',
      colorScheme: { bg: '#E0F2FE', text: '#0284C7' },
    },
    {
      id: 'member-3',
      name: 'Rahul Verma',
      role: 'Paris Traveler',
      initials: 'RV',
      emoji: '📸',
      colorScheme: { bg: '#F3E8FF', text: '#7C3AED' },
    },
    {
      id: 'member-4',
      name: 'Sophie Laurent',
      role: 'Local Guide',
      initials: 'SL',
      emoji: '🥐',
      colorScheme: { bg: '#DCFCE7', text: '#059669' },
    },
    {
      id: 'member-current',
      name: 'Jeevan',
      role: 'You',
      initials: 'J',
      emoji: '✈️',
      colorScheme: { bg: '#FFEDD5', text: '#EA580C' },
      isCurrentUser: true,
    },
  ],
  default: [
    {
      id: 'member-d1',
      name: 'Elena Rostova',
      role: 'Group Admin',
      initials: 'ER',
      emoji: '🌴',
      colorScheme: { bg: '#E0F2FE', text: '#0284C7' },
    },
    {
      id: 'member-d2',
      name: 'Liam Chen',
      role: 'Explorer',
      initials: 'LC',
      emoji: '🎒',
      colorScheme: { bg: '#DCFCE7', text: '#059669' },
    },
    {
      id: 'member-current',
      name: 'Jeevan',
      role: 'You',
      initials: 'J',
      emoji: '✈️',
      colorScheme: { bg: '#FFEDD5', text: '#EA580C' },
      isCurrentUser: true,
    },
  ],
};

export const INITIAL_MOCK_MESSAGES: Record<string, GroupMessage[]> = {
  'group-paris': [
    {
      id: 'msg-1',
      groupId: 'group-paris',
      senderId: 'member-2',
      senderName: 'Aarav',
      senderAvatarEmoji: '🎒',
      senderInitials: 'AM',
      senderColor: '#0284C7',
      message: 'Hey everyone! Is anyone planning to visit Paris next month?',
      timestamp: '10:14 AM',
      isCurrentUser: false,
    },
    {
      id: 'msg-2',
      groupId: 'group-paris',
      senderId: 'member-1',
      senderName: 'Maya',
      senderAvatarEmoji: '🌟',
      senderInitials: 'MS',
      senderColor: '#E11D48',
      message: "Yes! I'm going from the 12th to 18th 😊",
      timestamp: '10:16 AM',
      isCurrentUser: false,
    },
    {
      id: 'msg-3',
      groupId: 'group-paris',
      senderId: 'member-3',
      senderName: 'Rahul',
      senderAvatarEmoji: '📸',
      senderInitials: 'RV',
      senderColor: '#7C3AED',
      message: "I'd definitely recommend visiting Montmartre early morning.",
      timestamp: '10:18 AM',
      isCurrentUser: false,
    },
    {
      id: 'msg-4',
      groupId: 'group-paris',
      senderId: 'member-current',
      senderName: 'You',
      senderInitials: 'J',
      message: 'Thanks! Adding that to my itinerary.',
      timestamp: '10:20 AM',
      isCurrentUser: true,
    },
    {
      id: 'msg-5',
      groupId: 'group-paris',
      senderId: 'member-1',
      senderName: 'Maya',
      senderAvatarEmoji: '🌟',
      senderInitials: 'MS',
      senderColor: '#E11D48',
      message: "Also don't miss the sunset near Sacré-Cœur!",
      timestamp: '10:22 AM',
      isCurrentUser: false,
    },
    {
      id: 'msg-6',
      groupId: 'group-paris',
      senderId: 'member-2',
      senderName: 'Aarav',
      senderAvatarEmoji: '🎒',
      senderInitials: 'AM',
      senderColor: '#0284C7',
      message: 'Anyone interested in doing a Seine river cruise together?',
      timestamp: '10:25 AM',
      isCurrentUser: false,
    },
  ],
  default: [
    {
      id: 'msg-d1',
      groupId: 'default',
      senderId: 'member-d1',
      senderName: 'Elena',
      senderAvatarEmoji: '🌴',
      senderInitials: 'ER',
      senderColor: '#0284C7',
      message: 'Welcome everyone to the trip group! Feel free to introduce yourselves.',
      timestamp: '09:30 AM',
      isCurrentUser: false,
    },
  ],
};

interface MockBotResponse {
  senderName: string;
  senderInitials: string;
  senderAvatarEmoji: string;
  senderColor: string;
  text: string;
}

/**
 * Generates a realistic mock auto-response from a group member
 * based on the user's sent message.
 */
export function generateMockGroupResponse(userText: string, groupName: string): MockBotResponse {
  const text = userText.toLowerCase().trim();

  if (text.includes('hi') || text.includes('hello') || text.includes('hey') || text.includes('hola')) {
    return {
      senderName: 'Maya',
      senderInitials: 'MS',
      senderAvatarEmoji: '🌟',
      senderColor: '#E11D48',
      text: `Hey! Welcome to ${groupName || 'the group'} 👋 Excited to travel together!`,
    };
  }

  if (text.includes('eiffel') || text.includes('tower')) {
    return {
      senderName: 'Rahul',
      senderInitials: 'RV',
      senderAvatarEmoji: '📸',
      senderColor: '#7C3AED',
      text: 'Yes! A few of us are planning to go tomorrow evening for the sunset & lights ✨',
    };
  }

  if (
    text.includes('recommend') ||
    text.includes('suggestion') ||
    text.includes('place') ||
    text.includes('visit')
  ) {
    return {
      senderName: 'Aarav',
      senderInitials: 'AM',
      senderAvatarEmoji: '🎒',
      senderColor: '#0284C7',
      text: 'Definitely check out Montmartre, Sainte-Chapelle, and the Latin Quarter cafes!',
    };
  }

  if (
    text.includes('food') ||
    text.includes('eat') ||
    text.includes('croissant') ||
    text.includes('cafe') ||
    text.includes('dinner')
  ) {
    return {
      senderName: 'Sophie',
      senderInitials: 'SL',
      senderAvatarEmoji: '🥐',
      senderColor: '#059669',
      text: 'You must try the fresh pastries at Du Pain et des Idées near Canal Saint-Martin! 🥐☕',
    };
  }

  if (text.includes('cruise') || text.includes('boat') || text.includes('seine')) {
    return {
      senderName: 'Aarav',
      senderInitials: 'AM',
      senderAvatarEmoji: '🎒',
      senderColor: '#0284C7',
      text: "Count me in for the sunset cruise! Let's book the 6 PM slot together.",
    };
  }

  // Generic rotating pool of friendly travel community responses
  const genericPool: MockBotResponse[] = [
    {
      senderName: 'Maya',
      senderInitials: 'MS',
      senderAvatarEmoji: '🌟',
      senderColor: '#E11D48',
      text: 'Sounds awesome! Adding that note to our group itinerary 🗺️',
    },
    {
      senderName: 'Rahul',
      senderInitials: 'RV',
      senderAvatarEmoji: '📸',
      senderColor: '#7C3AED',
      text: 'Great idea! I can bring my camera along for photos 📷',
    },
    {
      senderName: 'Aarav',
      senderInitials: 'AM',
      senderAvatarEmoji: '🎒',
      senderColor: '#0284C7',
      text: 'Totally agree, let’s sync up in the group chat before heading out!',
    },
  ];

  const randomIndex = Math.floor(Math.random() * genericPool.length);
  return genericPool[randomIndex];
}
