import { GOOGLE_API_KEY } from '../../../core/api/apiConstants';

export interface DestinationSuggestion {
  id: string;
  city: string;
  state?: string;
  country: string;
  formatted: string; // "City, State/Region, Country" or "City, Country"
  coordinates?: {
    latitude: number;
    longitude: number;
  };
  aliases?: string[];
  popularPlaces?: string[];
}

/**
 * Formats location canonically as:
 * - "City, State/Region, Country" if state is present
 * - "City, Country" if state is not present
 * Do not invent missing information.
 */
export function formatCanonicalDestination(
  city: string,
  state: string | undefined,
  country: string
): string {
  const cleanCity = city.trim();
  const cleanState = state ? state.trim() : '';
  const cleanCountry = country.trim();

  if (cleanState) {
    return `${cleanCity}, ${cleanState}, ${cleanCountry}`;
  }
  if (cleanCity.toLowerCase() === cleanCountry.toLowerCase()) {
    return cleanCity;
  }
  return `${cleanCity}, ${cleanCountry}`;
}

/**
 * Curated, verified destination catalog for Tourbhook.
 * Contains Indian and international travel hubs with official coordinates
 * and specific location hierarchies.
 */
export const CURATED_DESTINATIONS: DestinationSuggestion[] = [
  {
    id: 'dest-bengaluru',
    city: 'Bengaluru',
    state: 'Karnataka',
    country: 'India',
    formatted: 'Bengaluru, Karnataka, India',
    coordinates: { latitude: 12.9716, longitude: 77.5946 },
    aliases: ['bangalore', 'bengaluru', 'blr', 'silicon valley of india'],
    popularPlaces: ['Lalbagh', 'Bangalore Palace', 'Cubbon Park'],
  },
  {
    id: 'dest-hyderabad',
    city: 'Hyderabad',
    state: 'Telangana',
    country: 'India',
    formatted: 'Hyderabad, Telangana, India',
    coordinates: { latitude: 17.385, longitude: 78.4867 },
    aliases: ['hyderabad', 'hyd', 'city of pearls'],
    popularPlaces: ['Charminar', 'Golconda Fort', 'Hussain Sagar'],
  },
  {
    id: 'dest-bangkok',
    city: 'Bangkok',
    country: 'Thailand',
    formatted: 'Bangkok, Thailand',
    coordinates: { latitude: 13.7563, longitude: 100.5018 },
    aliases: ['bangkok', 'bkk', 'krung thep'],
    popularPlaces: ['Grand Palace', 'Wat Arun', 'Chatuchak Market'],
  },
  {
    id: 'dest-barcelona',
    city: 'Barcelona',
    state: 'Catalonia',
    country: 'Spain',
    formatted: 'Barcelona, Catalonia, Spain',
    coordinates: { latitude: 41.3879, longitude: 2.1699 },
    aliases: ['barcelona', 'bcn', 'catalunya', 'barca'],
    popularPlaces: ['Sagrada Familia', 'Park Güell', 'La Rambla'],
  },
  {
    id: 'dest-dhaka',
    city: 'Dhaka',
    country: 'Bangladesh',
    formatted: 'Dhaka, Bangladesh',
    coordinates: { latitude: 23.8103, longitude: 90.4125 },
    aliases: ['dhaka', 'dac', 'bangladesh'],
    popularPlaces: ['Lalbagh Fort', 'Ahsan Manzil', 'National Parliament'],
  },
  {
    id: 'dest-paris',
    city: 'Paris',
    state: 'Île-de-France',
    country: 'France',
    formatted: 'Paris, Île-de-France, France',
    coordinates: { latitude: 48.8566, longitude: 2.3522 },
    aliases: ['paris', 'city of light', 'france'],
    popularPlaces: ['Eiffel Tower', 'Louvre Museum', 'Montmartre'],
  },
  {
    id: 'dest-tokyo',
    city: 'Tokyo',
    country: 'Japan',
    formatted: 'Tokyo, Japan',
    coordinates: { latitude: 35.6762, longitude: 139.6503 },
    aliases: ['tokyo', 'edo', 'japan'],
    popularPlaces: ['Shibuya Crossing', 'Senso-ji', 'Shinjuku Gyoen'],
  },
  {
    id: 'dest-santorini',
    city: 'Santorini',
    country: 'Greece',
    formatted: 'Santorini, Greece',
    coordinates: { latitude: 36.3932, longitude: 25.4615 },
    aliases: ['santorini', 'thira', 'greece'],
    popularPlaces: ['Oia Sunset Point', 'Red Beach', 'Fira Cliffside'],
  },
  {
    id: 'dest-bali',
    city: 'Bali',
    country: 'Indonesia',
    formatted: 'Bali, Indonesia',
    coordinates: { latitude: -8.3405, longitude: 115.092 },
    aliases: ['bali', 'denpasar', 'ubud', 'indonesia'],
    popularPlaces: ['Tibumana Waterfall', 'Ubud Monkey Forest', 'Batu Bolong Beach'],
  },
  {
    id: 'dest-rome',
    city: 'Rome',
    state: 'Lazio',
    country: 'Italy',
    formatted: 'Rome, Lazio, Italy',
    coordinates: { latitude: 41.9028, longitude: 12.4964 },
    aliases: ['rome', 'roma', 'italy'],
    popularPlaces: ['Colosseum', 'Trevi Fountain', 'Pantheon'],
  },
  {
    id: 'dest-mumbai',
    city: 'Mumbai',
    state: 'Maharashtra',
    country: 'India',
    formatted: 'Mumbai, Maharashtra, India',
    coordinates: { latitude: 19.076, longitude: 72.8777 },
    aliases: ['mumbai', 'bombay', 'bom'],
    popularPlaces: ['Gateway of India', 'Marine Drive', 'Elephanta Caves'],
  },
  {
    id: 'dest-delhi',
    city: 'New Delhi',
    state: 'Delhi',
    country: 'India',
    formatted: 'New Delhi, Delhi, India',
    coordinates: { latitude: 28.6139, longitude: 77.209 },
    aliases: ['delhi', 'new delhi', 'dilli', 'ncr'],
    popularPlaces: ['India Gate', 'Qutub Minar', 'Red Fort'],
  },
  {
    id: 'dest-goa',
    city: 'Goa',
    country: 'India',
    formatted: 'Goa, India',
    coordinates: { latitude: 15.2993, longitude: 74.124 },
    aliases: ['goa', 'panaji', 'calangute'],
    popularPlaces: ['Baga Beach', 'Fort Aguada', 'Dudhsagar Falls'],
  },
  {
    id: 'dest-jaipur',
    city: 'Jaipur',
    state: 'Rajasthan',
    country: 'India',
    formatted: 'Jaipur, Rajasthan, India',
    coordinates: { latitude: 26.9124, longitude: 75.7873 },
    aliases: ['jaipur', 'pink city'],
    popularPlaces: ['Hawa Mahal', 'Amer Fort', 'City Palace'],
  },
  {
    id: 'dest-kochi',
    city: 'Kochi',
    state: 'Kerala',
    country: 'India',
    formatted: 'Kochi, Kerala, India',
    coordinates: { latitude: 9.9312, longitude: 76.2673 },
    aliases: ['kochi', 'cochin', 'kerala'],
    popularPlaces: ['Fort Kochi', 'Chinese Fishing Nets', 'Mattancherry Palace'],
  },
  {
    id: 'dest-chennai',
    city: 'Chennai',
    state: 'Tamil Nadu',
    country: 'India',
    formatted: 'Chennai, Tamil Nadu, India',
    coordinates: { latitude: 13.0827, longitude: 80.2707 },
    aliases: ['chennai', 'madras'],
    popularPlaces: ['Marina Beach', 'Kapaleeshwarar Temple', 'San Thome'],
  },
  {
    id: 'dest-kolkata',
    city: 'Kolkata',
    state: 'West Bengal',
    country: 'India',
    formatted: 'Kolkata, West Bengal, India',
    coordinates: { latitude: 22.5726, longitude: 88.3639 },
    aliases: ['kolkata', 'calcutta'],
    popularPlaces: ['Victoria Memorial', 'Howrah Bridge', 'Dakshineswar'],
  },
  {
    id: 'dest-london',
    city: 'London',
    state: 'England',
    country: 'United Kingdom',
    formatted: 'London, England, United Kingdom',
    coordinates: { latitude: 51.5074, longitude: -0.1278 },
    aliases: ['london', 'uk', 'great britain'],
    popularPlaces: ['Big Ben', 'Tower Bridge', 'British Museum'],
  },
  {
    id: 'dest-newyork',
    city: 'New York',
    state: 'New York',
    country: 'United States',
    formatted: 'New York, New York, United States',
    coordinates: { latitude: 40.7128, longitude: -74.006 },
    aliases: ['new york', 'nyc', 'manhattan'],
    popularPlaces: ['Central Park', 'Times Square', 'Empire State Building'],
  },
  {
    id: 'dest-dubai',
    city: 'Dubai',
    country: 'United Arab Emirates',
    formatted: 'Dubai, United Arab Emirates',
    coordinates: { latitude: 25.2048, longitude: 55.2708 },
    aliases: ['dubai', 'dxb', 'uae'],
    popularPlaces: ['Burj Khalifa', 'Dubai Mall', 'Palm Jumeirah'],
  },
  {
    id: 'dest-singapore',
    city: 'Singapore',
    country: 'Singapore',
    formatted: 'Singapore',
    coordinates: { latitude: 1.3521, longitude: 103.8198 },
    aliases: ['singapore', 'sin', 'lion city'],
    popularPlaces: ['Marina Bay Sands', 'Gardens by the Bay', 'Sentosa'],
  },
  {
    id: 'dest-sydney',
    city: 'Sydney',
    state: 'New South Wales',
    country: 'Australia',
    formatted: 'Sydney, New South Wales, Australia',
    coordinates: { latitude: -33.8688, longitude: 151.2093 },
    aliases: ['sydney', 'syd', 'australia'],
    popularPlaces: ['Sydney Opera House', 'Bondi Beach', 'Harbour Bridge'],
  },
  {
    id: 'dest-amsterdam',
    city: 'Amsterdam',
    state: 'North Holland',
    country: 'Netherlands',
    formatted: 'Amsterdam, North Holland, Netherlands',
    coordinates: { latitude: 52.3676, longitude: 4.9041 },
    aliases: ['amsterdam', 'holland', 'netherlands'],
    popularPlaces: ['Rijksmuseum', 'Anne Frank House', 'Van Gogh Museum'],
  },
  {
    id: 'dest-baku',
    city: 'Baku',
    country: 'Azerbaijan',
    formatted: 'Baku, Azerbaijan',
    coordinates: { latitude: 40.4093, longitude: 49.8671 },
    aliases: ['baku', 'azerbaijan'],
    popularPlaces: ['Flame Towers', 'Old City Icherisheher', 'Heydar Aliyev Center'],
  },
  {
    id: 'dest-basel',
    city: 'Basel',
    country: 'Switzerland',
    formatted: 'Basel, Switzerland',
    coordinates: { latitude: 47.5596, longitude: 7.5886 },
    aliases: ['basel', 'bale', 'switzerland'],
    popularPlaces: ['Basel Minster', 'Old Town', 'Kunstmuseum'],
  },
];

/**
 * Searches and filters destination suggestions based on user query string.
 * Supports prefix matching, token matching, alias matching, and graceful network integration.
 */
export async function searchDestinationSuggestions(
  query: string
): Promise<DestinationSuggestion[]> {
  const clean = query.trim().toLowerCase();
  if (!clean || clean.length < 1) {
    return [];
  }

  // 1. Filter curated catalog
  const catalogMatches = CURATED_DESTINATIONS.filter((dest) => {
    const cityMatch = dest.city.toLowerCase().includes(clean);
    const countryMatch = dest.country.toLowerCase().includes(clean);
    const stateMatch = dest.state ? dest.state.toLowerCase().includes(clean) : false;
    const formattedMatch = dest.formatted.toLowerCase().includes(clean);
    const aliasMatch = dest.aliases
      ? dest.aliases.some((a) => a.toLowerCase().includes(clean) || clean.includes(a.toLowerCase()))
      : false;

    return cityMatch || countryMatch || stateMatch || formattedMatch || aliasMatch;
  });

  // Sort: prioritize cities starting with query, then country matches
  catalogMatches.sort((a, b) => {
    const aCityStart = a.city.toLowerCase().startsWith(clean);
    const bCityStart = b.city.toLowerCase().startsWith(clean);
    if (aCityStart && !bCityStart) return -1;
    if (!aCityStart && bCityStart) return 1;

    const aFormattedStart = a.formatted.toLowerCase().startsWith(clean);
    const bFormattedStart = b.formatted.toLowerCase().startsWith(clean);
    if (aFormattedStart && !bFormattedStart) return -1;
    if (!aFormattedStart && bFormattedStart) return 1;

    return a.city.localeCompare(b.city);
  });

  return catalogMatches;
}
