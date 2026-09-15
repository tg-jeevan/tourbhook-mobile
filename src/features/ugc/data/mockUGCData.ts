import { UGCItem } from '../types/ugcTypes';

export const MOCK_UGC_ITEMS: UGCItem[] = [
  // ── PARIS, FRANCE (APPROVED INSTAGRAM REELS & YOUTUBE SHORTS) ───
  {
    id: 'ugc-paris-1',
    destination: 'Paris, France',
    platform: 'instagram',
    url: 'https://www.instagram.com/reel/C3_ParisSunset',
    title: 'Top 5 Hidden Spots Near Eiffel Tower ✨',
    creatorHandle: '@wanderlust_claire',
    creatorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    thumbnailUrl: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=600&auto=format&fit=crop&q=80',
    status: 'approved', // APPROVED -> VISIBLE
    createdAt: '2026-09-01',
    likesCount: 1420,
    viewsCount: 18400,
    duration: '0:45',
    aiAnalysis: {
      summary: 'Scenic photography viewpoints around Trocadéro and Bir-Hakeim bridge during golden hour.',
      vibeTags: ['Scenic', 'Golden Hour', 'Photo Spots', 'Romantic'],
      detectedPlace: 'Pont de Bir-Hakeim',
      bestTimeToVisit: '18:30 - 20:00 (Sunset)',
      moderationScore: 0.99,
    },
  },
  {
    id: 'ugc-paris-2',
    destination: 'Paris, France',
    platform: 'youtube',
    url: 'https://www.youtube.com/shorts/ParisFoodGuide2026',
    title: 'Ultimate Paris Croissant & Cafe Walking Tour 🥐',
    creatorHandle: 'TravelBytes TV',
    creatorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    thumbnailUrl: 'https://images.unsplash.com/photo-1509299349698-dd22323b5963?w=600&auto=format&fit=crop&q=80',
    status: 'approved', // APPROVED -> VISIBLE
    createdAt: '2026-09-03',
    likesCount: 3890,
    viewsCount: 42100,
    duration: '0:58',
    aiAnalysis: {
      summary: 'Traditional boulangeries in Le Marais serving award-winning flaky butter croissants.',
      vibeTags: ['Foodie', 'Breakfast', 'Pastry', 'Walks'],
      detectedPlace: 'Le Marais, 4th Arr.',
      bestTimeToVisit: '08:00 - 10:00',
      moderationScore: 0.98,
    },
  },
  {
    id: 'ugc-paris-3',
    destination: 'Paris, France',
    platform: 'instagram',
    url: 'https://www.instagram.com/reel/PendingParisWalk',
    title: 'Night Walk by the Seine River',
    creatorHandle: '@night_explorer',
    thumbnailUrl: 'https://images.unsplash.com/photo-1511739001486-6bfe10ce785f?w=600&auto=format&fit=crop&q=80',
    status: 'pending', // PENDING — ZERO TOLERANCE: MUST BE HIDDEN
    createdAt: '2026-09-14',
    likesCount: 12,
  },
  {
    id: 'ugc-paris-4',
    destination: 'Paris, France',
    platform: 'youtube',
    url: 'https://www.youtube.com/shorts/SpamVideoParis',
    title: 'Unrelated Spam Video about Crypto',
    creatorHandle: 'SpamChannel',
    thumbnailUrl: 'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?w=600&auto=format&fit=crop&q=80',
    status: 'rejected', // REJECTED — ZERO TOLERANCE: MUST BE HIDDEN
    createdAt: '2026-09-10',
    likesCount: 0,
  },
  {
    id: 'ugc-paris-5',
    destination: 'Paris, France',
    platform: 'instagram',
    url: 'https://www.instagram.com/reel/UnverifiedParisPost',
    title: 'Unclassified Draft Reel',
    creatorHandle: '@mystery_user',
    thumbnailUrl: 'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?w=600&auto=format&fit=crop&q=80',
    status: 'pending', // PENDING / UNVERIFIED — MUST BE HIDDEN
    createdAt: '2026-09-15',
  },

  // ── EIFFEL TOWER (APPROVED INSTAGRAM REEL & YOUTUBE SHORTS) ───
  {
    id: 'ugc-eiffel-1',
    destination: 'Eiffel Tower',
    platform: 'instagram',
    url: 'https://www.instagram.com/reel/EiffelLightShow',
    title: 'Eiffel Tower Sparkling at 10 PM 🗼✨',
    creatorHandle: '@paris_moments',
    creatorAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    thumbnailUrl: 'https://images.unsplash.com/photo-1543349689-9a4d426bee8e?w=600&auto=format&fit=crop&q=80',
    status: 'approved', // APPROVED -> VISIBLE
    createdAt: '2026-09-05',
    likesCount: 2150,
    viewsCount: 29000,
    duration: '0:30',
    aiAnalysis: {
      summary: '5-minute hourly sparkle illumination viewed from Champ de Mars lawns.',
      vibeTags: ['Nightlife', 'Iconic', 'Must See'],
      detectedPlace: 'Champ de Mars',
      bestTimeToVisit: '22:00 sharp',
      moderationScore: 0.99,
    },
  },
  {
    id: 'ugc-eiffel-2',
    destination: 'Eiffel Tower',
    platform: 'youtube',
    url: 'https://youtube.com/shorts/EiffelSummitView',
    title: 'View from the Very Top of Eiffel Tower in 4K Shorts',
    creatorHandle: 'DroneTraveler',
    creatorAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    thumbnailUrl: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=600&auto=format&fit=crop&q=80',
    status: 'approved', // APPROVED -> VISIBLE
    createdAt: '2026-09-08',
    likesCount: 4500,
    viewsCount: 61000,
    duration: '0:50',
    aiAnalysis: {
      summary: 'Panoramic 360-degree glass elevator ascent to 276m summit platform.',
      vibeTags: ['Panorama', 'Adventure', 'Heights'],
      detectedPlace: 'Eiffel Summit',
      bestTimeToVisit: 'Morning clear skies',
      moderationScore: 0.97,
    },
  },
  {
    id: 'ugc-eiffel-3',
    destination: 'Eiffel Tower',
    platform: 'instagram',
    url: 'https://www.instagram.com/reel/EiffelPendingReview',
    title: 'Picnic at Champ de Mars',
    creatorHandle: '@picnic_lover',
    thumbnailUrl: 'https://images.unsplash.com/photo-1511739001486-6bfe10ce785f?w=600&auto=format&fit=crop&q=80',
    status: 'pending', // PENDING — MUST BE FILTERED OUT
    createdAt: '2026-09-12',
  },

  // ── BALI, INDONESIA (APPROVED INSTAGRAM REELS & YOUTUBE SHORTS) ─
  {
    id: 'ugc-bali-1',
    destination: 'Bali, Indonesia',
    platform: 'youtube',
    url: 'https://youtube.com/shorts/BaliWaterfallVlog',
    title: 'Chasing Waterfalls & Temples in Ubud, Bali 🌴',
    creatorHandle: '@tropical_adventures',
    creatorAvatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&auto=format&fit=crop&q=80',
    thumbnailUrl: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=600&auto=format&fit=crop&q=80',
    status: 'approved', // APPROVED -> VISIBLE
    createdAt: '2026-08-28',
    likesCount: 1890,
    viewsCount: 22400,
    duration: '0:40',
    aiAnalysis: {
      summary: 'Lush tropical canyon trek to Tibumana Waterfall near Ubud jungle.',
      vibeTags: ['Nature', 'Waterfalls', 'Jungle', 'Serene'],
      detectedPlace: 'Tibumana Waterfall, Ubud',
      bestTimeToVisit: 'Early morning 07:30',
      moderationScore: 0.99,
    },
  },
  {
    id: 'ugc-bali-2',
    destination: 'Bali, Indonesia',
    platform: 'instagram',
    url: 'https://www.instagram.com/reel/C1_BaliSunsetSwings',
    title: 'Canggu Sunset Swings & Surf Vibe 🌊',
    creatorHandle: '@bali_vibes',
    creatorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    thumbnailUrl: 'https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?w=600&auto=format&fit=crop&q=80',
    status: 'approved', // APPROVED -> VISIBLE
    createdAt: '2026-09-02',
    likesCount: 2980,
    viewsCount: 35000,
    duration: '0:35',
    aiAnalysis: {
      summary: 'Batu Bolong beach surfing breaks and acoustic beach bars at twilight.',
      vibeTags: ['Surfing', 'Sunset', 'Beach Bar', 'Relaxed'],
      detectedPlace: 'Batu Bolong Beach, Canggu',
      bestTimeToVisit: '17:45',
      moderationScore: 0.98,
    },
  },

  // ── TOKYO, JAPAN (MIXED APPROVED & PENDING/REJECTED FOR TESTING) 
  {
    id: 'ugc-tokyo-approved-1',
    destination: 'Tokyo, Japan',
    platform: 'youtube',
    url: 'https://youtube.com/shorts/TokyoShibuyaCrossingNight',
    title: 'Crazy Energy of Shibuya Crossing from Above 🚶‍♂️✨',
    creatorHandle: '@tokyo_street_vibes',
    creatorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    thumbnailUrl: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?w=600&auto=format&fit=crop&q=80',
    status: 'approved', // APPROVED -> VISIBLE
    createdAt: '2026-09-04',
    likesCount: 5120,
    viewsCount: 78000,
    duration: '0:30',
    aiAnalysis: {
      summary: 'Bird-eye view of Shibuya scramble crossing illuminated by colossal neon billboards.',
      vibeTags: ['Neon', 'Night Walk', 'Iconic', 'Cyberpunk'],
      detectedPlace: 'Shibuya Scramble Crossing',
      bestTimeToVisit: '20:00 - 22:00',
      moderationScore: 0.99,
    },
  },
  {
    id: 'ugc-tokyo-1',
    destination: 'Tokyo, Japan',
    platform: 'instagram',
    url: 'https://www.instagram.com/reel/TokyoPendingNight',
    title: 'Shinjuku Neon Lights',
    creatorHandle: '@tokyo_drift',
    thumbnailUrl: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?w=600&auto=format&fit=crop&q=80',
    status: 'pending', // PENDING -> MUST BE FILTERED OUT
    createdAt: '2026-09-14',
  },
  {
    id: 'ugc-tokyo-2',
    destination: 'Tokyo, Japan',
    platform: 'youtube',
    url: 'https://www.youtube.com/watch?v=TokyoRejectedSpam',
    title: 'Unverified Commercial Advert',
    creatorHandle: '@spam_bot',
    thumbnailUrl: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=600&auto=format&fit=crop&q=80',
    status: 'rejected', // REJECTED -> MUST BE FILTERED OUT
    createdAt: '2026-09-13',
  },
];

/**
 * CRITICAL ZERO-TOLERANCE MODERATION FILTER FUNCTION:
 * Under NO circumstances can pending, rejected, failed, or unapproved content be returned.
 * Only items with explicit status === 'approved' are allowed through.
 */
export const filterApprovedDestinationReels = (
  destination?: string,
  platformFilter: 'all' | 'instagram' | 'youtube' = 'all'
): UGCItem[] => {
  return MOCK_UGC_ITEMS.filter((item) => {
    // 1. STRICT ZERO-TOLERANCE MODERATION CHECK: Must be explicitly 'approved'
    if (item.status !== 'approved') {
      return false;
    }

    // 2. Destination match (if destination specified)
    if (destination && destination.trim()) {
      const target = destination.toLowerCase().trim();
      const itemDest = item.destination.toLowerCase().trim();
      const isMatch = target.includes(itemDest) || itemDest.includes(target);
      if (!isMatch) {
        return false;
      }
    }

    // 3. Platform filter
    if (platformFilter !== 'all' && item.platform !== platformFilter) {
      return false;
    }

    return true;
  });
};
