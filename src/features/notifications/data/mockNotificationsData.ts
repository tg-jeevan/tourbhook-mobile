import { NotificationItem } from '../types/notificationTypes';

// Helper to compute timestamps relative to now
const getTimestamp = (daysAgo: number, hoursAgo = 0): string => {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  d.setHours(d.getHours() - hoursAgo);
  return d.toISOString();
};

export const RAW_MOCK_NOTIFICATIONS: NotificationItem[] = [
  // 1. Travel News - 2 hours ago (Today)
  {
    id: 'notif-1',
    title: 'Paris Travel Update: Louvre Extended Evening Hours',
    message: 'Musée du Louvre announces extended night openings and timed digital tickets for upcoming season.',
    timestamp: getTimestamp(0, 2),
    type: 'travel_news',
    destination: 'Paris, France',
    tripId: '1',
    isRead: false,
    newsContent: {
      headline: 'Louvre Extends Evening Hours & Implements Digital Smart Queue for Autumn Season',
      fullArticle:
        'Paris, France — The Musée du Louvre has officially announced revised operating schedules for the autumn travel season. Starting this week, the museum will remain open until 21:45 every Friday and Saturday to accommodate international travelers.\n\nVisitors holding Tourbhook reservations are advised to arrive 15 minutes prior to their allocated entry window at the Pyramid courtyard. Digital audio guides have also been updated with English, Spanish, and Japanese narration.\n\nSecurity checkpoints at Carrousel du Louvre have reported reduced queue times of under 10 minutes during evening slots.',
      source: 'Paris Tourism Board & Louvre Official Press',
      publishedAt: 'Today, 10:30 AM',
      urgency: 'normal',
      affectedPlaces: ['Louvre Museum', 'Tuileries Garden', 'Pyramide du Louvre'],
      keyTakeaways: [
        'Evening access extended until 21:45 on weekends',
        'Recommended entry via Carrousel underground concourse',
        'Direct digital ticket scanning active',
      ],
    },
  },

  // 2. Travel Alert - 5 hours ago (Today)
  {
    id: 'notif-2',
    title: 'Travel Advisory: Seine River Waterway Maintenance',
    message: 'Scheduled navigation adjustments near Pont Alexandre III during morning cruise hours.',
    timestamp: getTimestamp(0, 5),
    type: 'destination_alert',
    destination: 'Paris, France',
    tripId: '1',
    isRead: false,
    newsContent: {
      headline: 'Temporary Navigation Route Adjustments on the Seine River',
      fullArticle:
        'The Department of Paris Waterways has issued a brief advisory regarding standard maintenance work on Pont Alexandre III piers. River cruise departures from Pont Neuf will operate on normal timetables with a scenic detour through the southern channel.\n\nPassengers will enjoy unrestricted views of Grand Palais and the Eiffel Tower. No cancellations are expected for scheduled sightseeing cruises.',
      source: 'Voies Navigables de France (VNF)',
      publishedAt: 'Today, 08:15 AM',
      urgency: 'advisory',
      affectedPlaces: ['Pont Alexandre III', 'Seine River Cruise Terminal', 'Pont Neuf'],
      keyTakeaways: [
        'Cruises operating normally with minor southern canal routing',
        'Eiffel Tower views completely unobstructed',
        'Allow 10 minutes buffer for boarding',
      ],
    },
  },

  // 3. Itinerary - 3 days ago (This Week)
  {
    id: 'notif-3',
    title: 'Itinerary Synchronized: Paris Adventure',
    message: 'Your Day 2 Eiffel Tower booking has been confirmed and synced to your trip timeline.',
    timestamp: getTimestamp(3, 2),
    type: 'itinerary_update',
    destination: 'Paris, France',
    tripId: '1',
    isRead: true,
  },

  // 4. Travel Tip - 4 days ago (Earlier / This Week)
  {
    id: 'notif-4',
    title: 'Top 5 Cafés Near the Louvre',
    message: 'Discover the best-rated cafés within 10 minutes walk from the Louvre Museum.',
    timestamp: getTimestamp(4, 3),
    type: 'travel_tip',
    destination: 'Paris, France',
    tripId: '1',
    isRead: true,
    newsContent: {
      headline: 'Top 5 Artisanal Cafés Around the Louvre & Palais-Royal',
      fullArticle:
        'Looking for the quintessential Parisian coffee experience after exploring the Louvre? We have curated the top five spots including Café Marly with views of the glass pyramid, Kitsuné in the Palais-Royal gardens, and Telescop Café for specialty pour-overs.',
      source: 'Tourbhook Paris Local Guides',
      publishedAt: '4 days ago',
      urgency: 'normal',
      affectedPlaces: ['Café Marly', 'Palais-Royal', 'Rue de Rivoli'],
      keyTakeaways: [
        'Café Marly offers direct terrace views of the Louvre Pyramid',
        'Café Kitsuné features world-class matcha and terrace gardens',
        'Morning visits before 10 AM avoid lines',
      ],
    },
  },

  // 5. Itinerary / Booking - 6 days ago (Earlier / This Week)
  {
    id: 'notif-5',
    title: 'Bookings Confirmed',
    message: 'Your hotel in Paris has been confirmed for Sept 12 – Sept 17, 2026.',
    timestamp: getTimestamp(6, 1),
    type: 'itinerary_update',
    destination: 'Paris, France',
    tripId: '1',
    isRead: true,
  },

  // 6. Travel News - 14 days ago (Earlier)
  {
    id: 'notif-6',
    title: 'Tokyo Metro Pass: Digital Transit Expansion',
    message: 'Foreign tourist 72-hour metro passes now support contactless phone tap across all Tokyo lines.',
    timestamp: getTimestamp(14, 0),
    type: 'travel_news',
    destination: 'Tokyo, Japan',
    isRead: true,
    newsContent: {
      headline: 'Tokyo Metro & Toei Subway Launch Seamless Contactless Tourist Pass',
      fullArticle:
        'Tokyo, Japan — Tokyo Metro and the Tokyo Metropolitan Bureau of Transportation have expanded Apple Pay and Google Wallet integration for foreign traveler multi-day transit passes.\n\nTravelers can purchase and activate the 24, 48, or 72-hour unlimited subway passes directly without queuing at airport ticket counters. This pass covers all 13 subway lines across central Tokyo, providing unlimited transit to Shibuya, Shinjuku, Asakusa, and Ginza.',
      source: 'Tokyo Metropolitan Government Bureau of Transportation',
      publishedAt: 'Sep 01, 2026',
      urgency: 'normal',
      affectedPlaces: ['Shibuya Crossing', 'Senso-ji Asakusa', 'Shinjuku Station', 'Ginza'],
      keyTakeaways: [
        'Unlimited rides across all 13 Tokyo Metro and Toei subway lines',
        'Instant digital activation via smartphone wallet',
        'Substantial 40% savings compared to single ticket fares',
      ],
    },
  },

  // 7. Travel News - 180 days ago (within 365 days)
  {
    id: 'notif-7',
    title: 'Bali Eco-Tax & Heritage Guidelines',
    message: 'New tourist conservation contribution initiative active for temple and natural reserve entry.',
    timestamp: getTimestamp(180, 0),
    type: 'travel_news',
    destination: 'Bali, Indonesia',
    isRead: true,
    newsContent: {
      headline: 'Bali Implements Digital Tourist Contribution for Cultural Preservation',
      fullArticle:
        'Denpasar, Bali — The Provincial Government of Bali reminds incoming international travelers of the digital heritage contribution system. Funds directly support the preservation of sacred temple sites, marine sanctuaries in Nusa Penida, and traditional Subak irrigation systems in Ubud.\n\nVisitors can verify their tourist voucher online before visiting major cultural sites such as Uluwatu and Tanah Lot.',
      source: 'Bali Tourism Board',
      publishedAt: 'March 2026',
      urgency: 'advisory',
      affectedPlaces: ['Ubud Monkey Forest', 'Uluwatu Temple', 'Tanah Lot'],
      keyTakeaways: [
        'Applies to cultural heritage zones and marine parks',
        'Digital QR confirmation accepted at all major attractions',
        'Supports local sustainable tourism initiatives',
      ],
    },
  },

  // 8. EXPIRED / OLD Notification - 410 days ago (OUTSIDE 365-day retention -> MUST BE EXCLUDED)
  {
    id: 'notif-expired-1',
    title: 'Archived Travel Alert (Expired > 365 Days)',
    message: 'This notification is older than 365 days and should be automatically filtered out by retention rules.',
    timestamp: getTimestamp(410, 0),
    type: 'travel_news',
    destination: 'Rome, Italy',
    isRead: true,
    newsContent: {
      headline: 'Outdated Colosseum Restoration Notice from 2025',
      fullArticle: 'This is an expired notice from over a year ago.',
      source: 'Archive',
      publishedAt: 'July 2025',
    },
  },
];

/**
 * Filter notifications according to the 365-day retention requirement:
 * age <= 365 days: SHOW
 * age > 365 days: EXCLUDE
 */
export const getActiveNotifications = (): NotificationItem[] => {
  const ONE_YEAR_MS = 365 * 24 * 60 * 60 * 1000;
  const now = Date.now();

  return RAW_MOCK_NOTIFICATIONS.filter((item) => {
    const itemTime = new Date(item.timestamp).getTime();
    const ageMs = now - itemTime;
    return ageMs <= ONE_YEAR_MS;
  });
};
