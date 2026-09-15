import { EventItem } from '../types/eventTypes';

// Helper to get formatted date string relative to current date
const getRelativeDateStr = (offsetDays: number): string => {
  const d = new Date();
  d.setDate(d.getDate() + offsetDays);
  return d.toISOString().split('T')[0];
};

export const MOCK_EVENTS: EventItem[] = [
  // Paris Events
  {
    id: 'evt-paris-1',
    title: 'Paris Summer Jazz Festival',
    destination: 'Paris, France',
    destinationId: 'paris',
    location: 'Parc Floral de Paris',
    date: getRelativeDateStr(0), // Today
    time: '18:00 - 22:30',
    category: 'Music',
    shortDescription: 'Open-air jazz performances featuring world-renowned international ensembles.',
    fullDescription:
      'The Paris Summer Jazz Festival brings together world-class musicians in the tranquil botanical setting of the Parc Floral. Enjoy an evening of soothing melodies, wine tastings, and picnic spots.',
    imageUrl: 'https://images.unsplash.com/photo-1511192336575-5a79af67a629?auto=format&fit=crop&w=800&q=80',
    price: '€22',
    venueAddress: 'Route de la Pyramide, 75012 Paris, France',
    organizer: 'Paris Festival Committee',
    isPopular: true,
  },
  {
    id: 'evt-paris-2',
    title: 'Louvre Nocturne & Art Soirée',
    destination: 'Paris, France',
    destinationId: 'paris',
    location: 'Louvre Museum, 1st Arr.',
    date: getRelativeDateStr(2), // This week
    time: '19:00 - 23:00',
    category: 'Art',
    shortDescription: 'Experience the masterpieces under dramatic nocturnal lighting with guided tours.',
    fullDescription:
      'Explore the historic wings of the Louvre during the quiet nighttime hours. Special docent tours cover hidden Renaissance treasures and the iconic Mona Lisa with minimal crowds.',
    imageUrl: 'https://images.unsplash.com/photo-1549887552-cb1071d3e5ca?auto=format&fit=crop&w=800&q=80',
    price: '€17',
    venueAddress: 'Rue de Rivoli, 75001 Paris, France',
    organizer: 'Musée du Louvre',
    isPopular: true,
  },
  {
    id: 'evt-paris-3',
    title: 'Montmartre Wine & Gastronomy Walk',
    destination: 'Paris, France',
    destinationId: 'paris',
    location: 'Montmartre, 18th Arr.',
    date: getRelativeDateStr(4), // This week
    time: '11:00 - 14:30',
    category: 'Food & Drink',
    shortDescription: 'Taste artisanal cheeses, pastries, and French wines in the historic bohemian quarter.',
    fullDescription:
      'Stroll through the cobblestone streets of Montmartre guided by a local sommelier. Sample aged Comté, crisp baguettes, handmade macarons, and premier cru wines.',
    imageUrl: 'https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=800&q=80',
    price: '€65',
    venueAddress: 'Place du Tertre, 75018 Paris, France',
    organizer: 'Paris Foodies Club',
    isPopular: false,
  },
  {
    id: 'evt-paris-4',
    title: 'Seine River Sunset Classical Concert',
    destination: 'Paris, France',
    destinationId: 'paris',
    location: 'Pont Neuf Pier',
    date: getRelativeDateStr(12), // This month
    time: '20:00 - 21:45',
    category: 'Culture',
    shortDescription: 'Chamber music orchestra performing Chopin and Debussy aboard a river barge.',
    fullDescription:
      'A breathtaking musical journey cruising past the illuminated Notre Dame and Eiffel Tower. Includes a welcome glass of Champagne and classical repertoire performed by the Paris Soloists.',
    imageUrl: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=800&q=80',
    price: '€45',
    venueAddress: 'Square du Vert-Galant, 75001 Paris, France',
    organizer: 'Seine Symphonic Nights',
    isPopular: true,
  },
  {
    id: 'evt-paris-5',
    title: 'Paris Fashion & Textile Exhibition',
    destination: 'Paris, France',
    destinationId: 'paris',
    location: 'Palais Galliera, 16th Arr.',
    date: getRelativeDateStr(20), // This month
    time: '10:00 - 18:00',
    category: 'Culture',
    shortDescription: 'Centuries of haute couture history, vintage garments, and interactive design labs.',
    fullDescription:
      'Discover iconic garments from Christian Dior, Coco Chanel, and Yves Saint Laurent. The exhibition features sketches, rare fabric samples, and immersive multimedia installations.',
    imageUrl: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=800&q=80',
    price: '€15',
    venueAddress: '10 Avenue Pierre 1er de Serbie, 75116 Paris, France',
    organizer: 'City of Paris Fashion Museum',
    isPopular: false,
  },

  // Tokyo Events
  {
    id: 'evt-tokyo-1',
    title: 'Shinjuku Neon Food & Sake Crawl',
    destination: 'Tokyo, Japan',
    destinationId: 'tokyo',
    location: 'Omoide Yokocho, Shinjuku',
    date: getRelativeDateStr(0), // Today
    time: '18:30 - 21:30',
    category: 'Food & Drink',
    shortDescription: 'Navigate the atmospheric alleyways of Memory Lane with charcoal yakitori and craft sake.',
    fullDescription:
      'Immerse yourself in Shinjuku nightlife with a local guide. Visit tiny izakayas, taste sizzling wagyu skewers, authentic ramen, and discover artisanal junmai sake pairings.',
    imageUrl: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=800&q=80',
    price: '¥7,500',
    venueAddress: '1 Chome-2 Nishishinjuku, Shinjuku City, Tokyo 160-0023',
    organizer: 'Tokyo Night Wanderers',
    isPopular: true,
  },
  {
    id: 'evt-tokyo-2',
    title: 'Asakusa Traditional Lantern Ceremony',
    destination: 'Tokyo, Japan',
    destinationId: 'tokyo',
    location: 'Senso-ji Temple, Asakusa',
    date: getRelativeDateStr(3), // This week
    time: '17:00 - 20:30',
    category: 'Festival',
    shortDescription: 'Centuries-old festival of light, taiko drumming, and traditional street stalls.',
    fullDescription:
      'Witness hundreds of glowing lanterns illuminating Senso-ji grounds. Enjoy spirited taiko drum performances, yukata-clad dancers, and sweet dango treats along Nakamise-dori.',
    imageUrl: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=800&q=80',
    price: 'Free Admission',
    venueAddress: '2 Chome-3-1 Asakusa, Taito City, Tokyo 111-0032',
    organizer: 'Asakusa Tourism Association',
    isPopular: true,
  },
  {
    id: 'evt-tokyo-3',
    title: 'teamLab Planets Immersive Digital Art',
    destination: 'Tokyo, Japan',
    destinationId: 'tokyo',
    location: 'Toyosu Waterfront',
    date: getRelativeDateStr(8), // This month
    time: '09:00 - 22:00',
    category: 'Art',
    shortDescription: 'Walk through water, floating flowers, and infinite crystal universes.',
    fullDescription:
      'A museum where you walk barefoot through water and immerse your entire body in colossal artworks. An unforgettable sensory fusion of light, sound, and digital choreography.',
    imageUrl: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=800&q=80',
    price: '¥3,800',
    venueAddress: '6 Chome-1-16 Toyosu, Koto City, Tokyo 135-0061',
    organizer: 'teamLab Inc.',
    isPopular: true,
  },

  // Bali Events
  {
    id: 'evt-bali-1',
    title: 'Ubud Sunset Kecak Fire Dance',
    destination: 'Bali, Indonesia',
    destinationId: 'bali',
    location: 'Ubud Palace Stage',
    date: getRelativeDateStr(0), // Today
    time: '18:30 - 19:45',
    category: 'Culture',
    shortDescription: 'Hypnotic vocal chanting and dramatic Ramayana fire dance performance.',
    fullDescription:
      'Experience the spellbinding rhythm of a hundred Balinese men chanting in unison as the sun sets over the ancient stone courtyard of Ubud Palace.',
    imageUrl: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=800&q=80',
    price: 'IDR 150,000',
    venueAddress: 'Jl. Raya Ubud No.8, Ubud, Gianyar, Bali 80571',
    organizer: 'Ubud Royal Palace Cultural Society',
    isPopular: true,
  },
  {
    id: 'evt-bali-2',
    title: 'Canggu Eco Beach Cleanup & Sunset Beats',
    destination: 'Bali, Indonesia',
    destinationId: 'bali',
    location: 'Echo Beach, Canggu',
    date: getRelativeDateStr(2), // This week
    time: '16:30 - 21:00',
    category: 'Festival',
    shortDescription: 'Community coastal conservation followed by organic coconuts and acoustic reggae.',
    fullDescription:
      'Join eco-conscious travelers and locals for an uplifting beach cleanup initiative, followed by sunset beach games, chilled coconut mocktails, and live acoustic tunes.',
    imageUrl: 'https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?auto=format&fit=crop&w=800&q=80',
    price: 'Free Admission',
    venueAddress: 'Jl. Pura Batu Mejan, Canggu, Badung, Bali',
    organizer: 'Trash Hero Bali',
    isPopular: false,
  },
  {
    id: 'evt-bali-3',
    title: 'Seminyak Gourmet Chef Pop-Up Table',
    destination: 'Bali, Indonesia',
    destinationId: 'bali',
    location: 'Petitenget Beachfront, Seminyak',
    date: getRelativeDateStr(6), // This week
    time: '19:00 - 22:30',
    category: 'Food & Drink',
    shortDescription: '7-course farm-to-table tasting menu showcasing indigenous spice blends and ocean catch.',
    fullDescription:
      'Celebrated Indonesian and guest international chefs present a multi-sensory degustation dinner directly overlooking the Indian Ocean surf.',
    imageUrl: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80',
    price: 'IDR 850,000',
    venueAddress: 'Jl. Petitenget, Kerobokan Kelod, Seminyak, Bali',
    organizer: 'Bali Culinary Guild',
    isPopular: true,
  },
];

export const getEventsForDestination = (destinationOrId?: string): EventItem[] => {
  if (!destinationOrId) return MOCK_EVENTS;
  const q = destinationOrId.toLowerCase().trim();
  return MOCK_EVENTS.filter(
    (e) =>
      e.destinationId.toLowerCase().includes(q) ||
      e.destination.toLowerCase().includes(q) ||
      q.includes(e.destinationId.toLowerCase())
  );
};
