import { DestinationItem, ExploreCategory } from '../types/exploreTypes';
import { UGCItem } from '../../ugc/types/ugcTypes';
import { getMockTravelGroups, TravelGroup } from '../../groups/types/groupTypes';

export const MOCK_DESTINATIONS: DestinationItem[] = [
  {
    id: 'dest-paris',
    name: 'Paris',
    country: 'France',
    reelsCountText: '120+ reels',
    imageUri: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=600&auto=format&fit=crop&q=80',
    category: 'culture',
    description:
      'The City of Light dazzles with historic boulevards, iconic monuments like the Eiffel Tower, world-class art collections, and bohemian street cafes.',
    bestSeason: 'Spring & Autumn (Apr–Jun, Sep–Nov)',
    vibe: 'Romantic, Artistic, Historic & Culinary',
    rating: 4.9,
    reviewsCount: 3420,
    popularPlaces: [
      {
        id: 'place-eiffel',
        name: 'Eiffel Tower',
        category: 'Monument',
        rating: 4.8,
        reviewsCount: 1250,
        shortDesc: 'Iconic wrought-iron lattice tower on the Champ de Mars with panoramic views.',
        imageUri: 'https://images.unsplash.com/photo-1543349689-9a4d426bee8e?w=600&auto=format&fit=crop&q=80',
      },
      {
        id: 'place-louvre',
        name: 'Louvre Museum',
        category: 'Museum',
        rating: 4.9,
        reviewsCount: 2890,
        shortDesc: 'World’s largest art museum and historic monument with the Mona Lisa.',
        imageUri: 'https://images.unsplash.com/photo-1549887552-cb1071d3e5ca?w=600&auto=format&fit=crop&q=80',
      },
      {
        id: 'place-montmartre',
        name: 'Montmartre',
        category: 'Neighborhood',
        rating: 4.7,
        reviewsCount: 980,
        shortDesc: 'Charming hilltop bohemian village crowned by the white Sacré-Cœur basilica.',
        imageUri: 'https://images.unsplash.com/photo-1550547660-d9450f859349?w=600&auto=format&fit=crop&q=80',
      },
      {
        id: 'place-birhakeim',
        name: 'Pont de Bir-Hakeim',
        category: 'Photo Spot',
        rating: 4.8,
        reviewsCount: 650,
        shortDesc: 'Iconic double-decker steel bridge with framed perspectives of the Eiffel Tower.',
        imageUri: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=600&auto=format&fit=crop&q=80',
      },
    ],
  },
  {
    id: 'dest-santorini',
    name: 'Santorini',
    country: 'Greece',
    reelsCountText: '80+ reels',
    imageUri: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=600&auto=format&fit=crop&q=80',
    category: 'beach',
    description:
      'Famous for dramatic caldera views, whitewashed cliffside villages with blue domed churches, volcanic beaches, and legendary Aegean sunsets.',
    bestSeason: 'May to October (Peak Aegean sunshine)',
    vibe: 'Cycladic, Scenic, Coastal & Sunsets',
    rating: 4.9,
    reviewsCount: 1980,
    popularPlaces: [
      {
        id: 'place-oia',
        name: 'Oia Sunset Point',
        category: 'Viewpoint',
        rating: 4.9,
        reviewsCount: 1420,
        shortDesc: 'Clifftop castle ruins with the most iconic sunset vantage in the Mediterranean.',
        imageUri: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=600&auto=format&fit=crop&q=80',
      },
      {
        id: 'place-redbeach',
        name: 'Red Beach',
        category: 'Beach',
        rating: 4.6,
        reviewsCount: 780,
        shortDesc: 'Stunning volcanic red cliffs meeting crystal turquoise Aegean waters.',
        imageUri: 'https://images.unsplash.com/photo-1533105079780-92b9be482077?w=600&auto=format&fit=crop&q=80',
      },
      {
        id: 'place-fira',
        name: 'Fira Cliffside',
        category: 'Town',
        rating: 4.7,
        reviewsCount: 910,
        shortDesc: 'Vibrant capital perched on 400m high cliffs filled with boutique tavernas.',
        imageUri: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&auto=format&fit=crop&q=80',
      },
    ],
  },
  {
    id: 'dest-bali',
    name: 'Bali',
    country: 'Indonesia',
    reelsCountText: '150+ reels',
    imageUri: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=600&auto=format&fit=crop&q=80',
    category: 'nature',
    description:
      'Island of the Gods offering mystical water temples, lush emerald rice terraces, sacred monkey forests, world-class surf breaks, and wellness sanctuaries.',
    bestSeason: 'April to October (Dry surf & hike season)',
    vibe: 'Tropical, Spiritual, Surfing & Lush Nature',
    rating: 4.8,
    reviewsCount: 4120,
    popularPlaces: [
      {
        id: 'place-tibumana',
        name: 'Tibumana Waterfall',
        category: 'Waterfall',
        rating: 4.8,
        reviewsCount: 890,
        shortDesc: 'Hidden jungle waterfall in Bangli surrounded by lush tropical moss and pools.',
        imageUri: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=600&auto=format&fit=crop&q=80',
      },
      {
        id: 'place-ubudforest',
        name: 'Ubud Monkey Forest',
        category: 'Sanctuary',
        rating: 4.7,
        reviewsCount: 1650,
        shortDesc: 'Sacred sanctuary with ancient temples and hundreds of playful macaques.',
        imageUri: 'https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?w=600&auto=format&fit=crop&q=80',
      },
      {
        id: 'place-canggu',
        name: 'Batu Bolong Beach',
        category: 'Beach & Surf',
        rating: 4.7,
        reviewsCount: 1120,
        shortDesc: 'Vibrant sunset beach with gentle surf breaks and lively beach clubs.',
        imageUri: 'https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?w=600&auto=format&fit=crop&q=80',
      },
    ],
  },
  {
    id: 'dest-tokyo',
    name: 'Tokyo',
    country: 'Japan',
    reelsCountText: '90+ reels',
    imageUri: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?w=600&auto=format&fit=crop&q=80',
    category: 'food',
    description:
      'Ultra-modern neon metropolis seamlessly blending futuristic technology, Michelin-starred gastronomy, serene Shinto shrines, and rich pop-culture districts.',
    bestSeason: 'March–May (Cherry blossoms) & Oct–Nov (Autumn foliage)',
    vibe: 'Futuristic, Culinary, Dynamic & Traditional',
    rating: 4.9,
    reviewsCount: 3870,
    popularPlaces: [
      {
        id: 'place-shinjuku',
        name: 'Omoide Yokocho',
        category: 'Food Alley',
        rating: 4.8,
        reviewsCount: 1450,
        shortDesc: 'Atmospheric retro alleyway lined with sizzling yakitori grills and sake bars.',
        imageUri: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?w=600&auto=format&fit=crop&q=80',
      },
      {
        id: 'place-sensoji',
        name: 'Senso-ji Temple',
        category: 'Temple',
        rating: 4.9,
        reviewsCount: 2310,
        shortDesc: 'Tokyo’s oldest ancient Buddhist temple located in the heart of historic Asakusa.',
        imageUri: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=600&auto=format&fit=crop&q=80',
      },
      {
        id: 'place-teamlab',
        name: 'teamLab Planets',
        category: 'Digital Art',
        rating: 4.9,
        reviewsCount: 1980,
        shortDesc: 'Immersive body-interactive digital art museum where visitors walk through water.',
        imageUri: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=600&auto=format&fit=crop&q=80',
      },
    ],
  },
  {
    id: 'dest-rome',
    name: 'Rome',
    country: 'Italy',
    reelsCountText: '75+ reels',
    imageUri: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=600&auto=format&fit=crop&q=80',
    category: 'adventure',
    description:
      'The Eternal City echoes with over 2,500 years of history, from the gladiatorial Colosseum and Vatican treasures to mouthwatering fresh cacio e pepe.',
    bestSeason: 'April to June & September to October',
    vibe: 'Historic, Epic, Architectural & Dolce Vita',
    rating: 4.8,
    reviewsCount: 2950,
    popularPlaces: [
      {
        id: 'place-colosseum',
        name: 'Colosseum',
        category: 'Ancient Monument',
        rating: 4.9,
        reviewsCount: 3100,
        shortDesc: 'Majestic ancient amphitheatre and architectural marvel of the Roman Empire.',
        imageUri: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=600&auto=format&fit=crop&q=80',
      },
      {
        id: 'place-trevi',
        name: 'Trevi Fountain',
        category: 'Monument',
        rating: 4.8,
        reviewsCount: 2450,
        shortDesc: 'Grand Baroque fountain where travelers toss coins to ensure their return to Rome.',
        imageUri: 'https://images.unsplash.com/photo-1531572753322-ad063cecc140?w=600&auto=format&fit=crop&q=80',
      },
      {
        id: 'place-pantheon',
        name: 'Pantheon',
        category: 'Historic Temple',
        rating: 4.9,
        reviewsCount: 1870,
        shortDesc: 'Exceptionally preserved Roman temple with a colossal unreinforced concrete dome.',
        imageUri: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=600&auto=format&fit=crop&q=80',
      },
    ],
  },
];

export const MOCK_EXPLORE_REELS: (UGCItem & { category: 'adventure' | 'culture' | 'food' | 'beach' | 'nature' })[] = [
  {
    id: 'ugc-paris-1',
    destination: 'Paris, France',
    platform: 'instagram',
    url: 'https://www.instagram.com/reel/C3_ParisSunset',
    title: 'Top 5 Hidden Spots Near Eiffel Tower ✨',
    creatorHandle: '@wanderlust_claire',
    creatorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    thumbnailUrl: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=600&auto=format&fit=crop&q=80',
    status: 'approved',
    createdAt: '2026-09-01',
    likesCount: 1200,
    viewsCount: 18400,
    duration: '0:45',
    category: 'culture',
    aiAnalysis: {
      summary: 'Scenic photography viewpoints around Trocadéro and Bir-Hakeim bridge during golden hour.',
      vibeTags: ['Scenic', 'Golden Hour', 'Photo Spots', 'Romantic'],
      detectedPlace: 'Pont de Bir-Hakeim',
      bestTimeToVisit: '18:30 - 20:00 (Sunset)',
      moderationScore: 0.99,
    },
  },
  {
    id: 'ugc-santorini-1',
    destination: 'Santorini, Greece',
    platform: 'instagram',
    url: 'https://www.instagram.com/reel/SantoriniMagic',
    title: "A Day in Santorini You Can't Miss 💙",
    creatorHandle: '@travelbytes',
    creatorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    thumbnailUrl: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=600&auto=format&fit=crop&q=80',
    status: 'approved',
    createdAt: '2026-09-03',
    likesCount: 986,
    viewsCount: 14200,
    duration: '0:32',
    category: 'beach',
    aiAnalysis: {
      summary: 'Caldera cliff walks, blue-domed church photo ops in Oia, and sunset sailing.',
      vibeTags: ['Caldera', 'Blue Domes', 'Sunsets', 'Aegean'],
      detectedPlace: 'Oia Sunset Point',
      bestTimeToVisit: '17:30 - 19:30',
      moderationScore: 0.99,
    },
  },
  {
    id: 'ugc-bali-1',
    destination: 'Bali, Indonesia',
    platform: 'youtube',
    url: 'https://youtube.com/shorts/BaliTemplesBeaches',
    title: 'Temples, Beaches & Beyond 🌿',
    creatorHandle: '@explorewithjay',
    creatorAvatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&auto=format&fit=crop&q=80',
    thumbnailUrl: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=600&auto=format&fit=crop&q=80',
    status: 'approved',
    createdAt: '2026-08-28',
    likesCount: 2100,
    viewsCount: 31500,
    duration: '0:50',
    category: 'nature',
    aiAnalysis: {
      summary: 'Lush tropical canyon trek to Tibumana Waterfall near Ubud jungle & Uluwatu surf.',
      vibeTags: ['Nature', 'Waterfalls', 'Jungle', 'Serene'],
      detectedPlace: 'Tibumana Waterfall, Ubud',
      bestTimeToVisit: 'Early morning 07:30',
      moderationScore: 0.99,
    },
  },
  {
    id: 'ugc-tokyo-1',
    destination: 'Tokyo, Japan',
    platform: 'instagram',
    url: 'https://www.instagram.com/reel/TokyoStreetFood2026',
    title: 'Street Food Tour in Tokyo 🍣',
    creatorHandle: '@roamwithus',
    creatorAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    thumbnailUrl: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?w=600&auto=format&fit=crop&q=80',
    status: 'approved',
    createdAt: '2026-09-06',
    likesCount: 1540,
    viewsCount: 24600,
    duration: '0:28',
    category: 'food',
    aiAnalysis: {
      summary: 'Tasting sizzling yakitori, crispy gyoza, and tonkotsu ramen in Shinjuku alleyways.',
      vibeTags: ['Street Food', 'Shinjuku', 'Izakaya', 'Ramen'],
      detectedPlace: 'Omoide Yokocho',
      bestTimeToVisit: '19:00 - 22:00',
      moderationScore: 0.98,
    },
  },
  {
    id: 'ugc-rome-1',
    destination: 'Rome, Italy',
    platform: 'youtube',
    url: 'https://youtube.com/shorts/AncientRomeUnderground',
    title: 'Ancient Rome Hidden Underground 🏛️',
    creatorHandle: '@history_hunter',
    creatorAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    thumbnailUrl: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=600&auto=format&fit=crop&q=80',
    status: 'approved',
    createdAt: '2026-09-08',
    likesCount: 870,
    viewsCount: 13200,
    duration: '0:40',
    category: 'adventure',
    aiAnalysis: {
      summary: 'Exploring the subterranean chambers and gladiatorial passages under the Colosseum.',
      vibeTags: ['Colosseum', 'Archaeology', 'Ancient History'],
      detectedPlace: 'Colosseum Underground',
      bestTimeToVisit: '09:30 morning tour',
      moderationScore: 0.99,
    },
  },
];

export const getFilteredExploreContent = (category: ExploreCategory) => {
  if (category === 'All') {
    return {
      destinations: MOCK_DESTINATIONS,
      reels: MOCK_EXPLORE_REELS.filter((r) => r.status === 'approved'),
      groups: getMockTravelGroups(),
    };
  }

  const catLower = category.toLowerCase();

  const filteredDestinations = MOCK_DESTINATIONS.filter((d) => d.category === catLower);
  const filteredReels = MOCK_EXPLORE_REELS.filter(
    (r) => r.status === 'approved' && r.category === catLower
  );
  const filteredGroups = getMockTravelGroups().filter((g) =>
    g.categories.includes(catLower) || g.tags.some((t) => t.toLowerCase() === catLower)
  );

  return {
    destinations: filteredDestinations.length > 0 ? filteredDestinations : MOCK_DESTINATIONS,
    reels: filteredReels.length > 0 ? filteredReels : MOCK_EXPLORE_REELS.filter((r) => r.status === 'approved'),
    groups: filteredGroups.length > 0 ? filteredGroups : getMockTravelGroups(),
  };
};

export const getDestinationByNameOrId = (nameOrId?: string): DestinationItem => {
  if (!nameOrId) return MOCK_DESTINATIONS[0];
  const query = nameOrId.toLowerCase().trim();
  const match = MOCK_DESTINATIONS.find(
    (d) =>
      d.id.toLowerCase() === query ||
      d.name.toLowerCase() === query ||
      query.includes(d.name.toLowerCase()) ||
      d.name.toLowerCase().includes(query)
  );
  return match || MOCK_DESTINATIONS[0];
};

export const searchExploreContent = (query: string) => {
  const q = query.toLowerCase().trim();
  if (!q) return [];

  const results: {
    type: 'destination' | 'place' | 'reel' | 'group';
    id: string;
    title: string;
    subtitle: string;
    category?: string;
    imageUri?: string;
    payload?: any;
  }[] = [];

  // Match Destinations
  MOCK_DESTINATIONS.forEach((d) => {
    if (d.name.toLowerCase().includes(q) || d.country.toLowerCase().includes(q)) {
      results.push({
        type: 'destination',
        id: d.id,
        title: `${d.name}, ${d.country}`,
        subtitle: `Destination • ${d.reelsCountText}`,
        category: d.category,
        imageUri: d.imageUri,
        payload: d,
      });
    }

    // Match Places inside Destinations
    d.popularPlaces.forEach((p) => {
      if (p.name.toLowerCase().includes(q) || p.shortDesc.toLowerCase().includes(q)) {
        results.push({
          type: 'place',
          id: p.id,
          title: p.name,
          subtitle: `${d.name}, ${d.country} • ${p.category}`,
          category: p.category,
          imageUri: p.imageUri,
          payload: { place: p, destination: d },
        });
      }
    });
  });

  // Match Reels
  MOCK_EXPLORE_REELS.forEach((r) => {
    if (
      r.status === 'approved' &&
      (r.title.toLowerCase().includes(q) ||
        r.creatorHandle.toLowerCase().includes(q) ||
        r.destination.toLowerCase().includes(q) ||
        r.aiAnalysis?.detectedPlace?.toLowerCase().includes(q))
    ) {
      results.push({
        type: 'reel',
        id: r.id,
        title: r.title,
        subtitle: `${r.creatorHandle} • ${r.destination}`,
        category: r.category,
        imageUri: r.thumbnailUrl,
        payload: r,
      });
    }
  });

  // Match Groups
  getMockTravelGroups().forEach((g) => {
    if (
      g.name.toLowerCase().includes(q) ||
      g.description?.toLowerCase().includes(q) ||
      g.tags.some((t) => t.toLowerCase().includes(q))
    ) {
      results.push({
        type: 'group',
        id: g.id,
        title: g.name,
        subtitle: `Travel Group • ${g.memberCount}/${g.maxMembers} members`,
        category: g.categoryLabel,
        payload: g,
      });
    }
  });

  return results;
};
