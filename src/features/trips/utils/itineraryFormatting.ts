import { TravelerType } from '../../../core/navigation/types';

export const MONTH_NAMES = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
] as const;

interface ParsedDate {
  day: number;
  month: number; // 1-12
  year: number;
}

const MONTH_MAP: Record<string, number> = {
  jan: 1,
  january: 1,
  feb: 2,
  february: 2,
  mar: 3,
  march: 3,
  apr: 4,
  april: 4,
  may: 5,
  jun: 6,
  june: 6,
  jul: 7,
  july: 7,
  aug: 8,
  august: 8,
  sep: 9,
  sept: 9,
  september: 9,
  oct: 10,
  october: 10,
  nov: 11,
  november: 11,
  dec: 12,
  december: 12,
};

/**
 * Parses a date string safely without timezone/UTC shift side effects.
 * Supports:
 * - '5/08/2027', '05/08/2027', '5-8-2027' (DD/MM/YYYY)
 * - '2027-08-05', '2027/08/05' (YYYY-MM-DD)
 * - 'Aug 5, 2027', '5 Aug 2027', 'Sept 12 2026'
 */
export function parseDateComponents(dateStr?: string): ParsedDate | null {
  if (!dateStr || typeof dateStr !== 'string') return null;
  const clean = dateStr.trim();
  if (!clean) return null;

  // 1. ISO format: YYYY-MM-DD or YYYY/MM/DD
  const isoMatch = clean.match(/^(\d{4})[-/. ](\d{1,2})[-/. ](\d{1,2})$/);
  if (isoMatch) {
    const year = parseInt(isoMatch[1], 10);
    const month = parseInt(isoMatch[2], 10);
    const day = parseInt(isoMatch[3], 10);
    if (month >= 1 && month <= 12 && day >= 1 && day <= 31) {
      return { day, month, year };
    }
  }

  // 2. International slash/dash: DD/MM/YYYY or D-M-YYYY
  const dmMatch = clean.match(/^(\d{1,2})[-/. ](\d{1,2})[-/. ](\d{4})$/);
  if (dmMatch) {
    const part1 = parseInt(dmMatch[1], 10);
    const part2 = parseInt(dmMatch[2], 10);
    const year = parseInt(dmMatch[3], 10);

    // If part1 is month > 12, it's invalid or swapped
    let day = part1;
    let month = part2;
    if (month > 12 && day <= 12) {
      // MM/DD/YYYY fallback
      month = part1;
      day = part2;
    }
    if (month >= 1 && month <= 12 && day >= 1 && day <= 31) {
      return { day, month, year };
    }
  }

  // 3. Named month format: 'Aug 5, 2027', '5 Aug 2027', 'Sept 12 2026'
  const words = clean.replace(/,/g, ' ').split(/\s+/);
  let foundMonth: number | null = null;
  let foundDay: number | null = null;
  let foundYear: number | null = null;

  for (const word of words) {
    const lower = word.toLowerCase();
    if (MONTH_MAP[lower]) {
      foundMonth = MONTH_MAP[lower];
    } else if (/^\d{4}$/.test(word)) {
      foundYear = parseInt(word, 10);
    } else if (/^\d{1,2}$/.test(word)) {
      foundDay = parseInt(word, 10);
    }
  }

  if (foundMonth && foundDay) {
    return {
      day: foundDay,
      month: foundMonth,
      year: foundYear || new Date().getFullYear(),
    };
  }

  return null;
}

/**
 * Standardizes date range display:
 * - 'Aug 5 – Aug 7, 2027' (same month & year)
 * - 'Sep 28 – Oct 4, 2026' (different month, same year)
 * - 'Dec 28, 2026 – Jan 3, 2027' (different year)
 */
export function formatDateRange(startDateStr?: string, endDateStr?: string): string {
  if (!startDateStr && !endDateStr) return 'Dates TBD';
  if (startDateStr && !endDateStr) {
    if (startDateStr.includes('–') || startDateStr.includes(' - ') || startDateStr.includes('-')) {
      // Split on en-dash or hyphen surrounded by spaces or between date tokens
      const delimiterMatch = startDateStr.match(/\s*[–—]\s*|\s+-\s+/);
      if (delimiterMatch && delimiterMatch.index !== undefined) {
        const p1 = startDateStr.slice(0, delimiterMatch.index).trim();
        const p2 = startDateStr.slice(delimiterMatch.index + delimiterMatch[0].length).trim();
        if (p1 && p2) {
          const yearMatch = p2.match(/\b(20\d{2})\b/);
          const effectiveP1 =
            yearMatch && !p1.match(/\b(20\d{2})\b/) ? `${p1}, ${yearMatch[1]}` : p1;
          return formatDateRange(effectiveP1, p2);
        }
      }
    }
    const single = parseDateComponents(startDateStr);
    if (single) return `${MONTH_NAMES[single.month - 1]} ${single.day}, ${single.year}`;
    return startDateStr;
  }
  if (!startDateStr && endDateStr) {
    const single = parseDateComponents(endDateStr);
    if (single) return `${MONTH_NAMES[single.month - 1]} ${single.day}, ${single.year}`;
    return endDateStr;
  }

  // If already formatted like 'Sep 12 - Sept 17, 2026' or '5/08/2027 – 7/08/2027'
  const start = parseDateComponents(startDateStr);
  const end = parseDateComponents(endDateStr);

  if (!start && !end) {
    return `${startDateStr || 'Upcoming'} – ${endDateStr || ''}`.trim();
  }
  if (start && !end) {
    return `${MONTH_NAMES[start.month - 1]} ${start.day}, ${start.year} – ${endDateStr}`;
  }
  if (!start && end) {
    return `${startDateStr} – ${MONTH_NAMES[end.month - 1]} ${end.day}, ${end.year}`;
  }

  if (start && end) {
    const startMonthName = MONTH_NAMES[start.month - 1];
    const endMonthName = MONTH_NAMES[end.month - 1];

    if (start.year === end.year) {
      if (start.month === end.month) {
        return `${startMonthName} ${start.day} – ${endMonthName} ${end.day}, ${start.year}`;
      }
      return `${startMonthName} ${start.day} – ${endMonthName} ${end.day}, ${start.year}`;
    }
    return `${startMonthName} ${start.day}, ${start.year} – ${endMonthName} ${end.day}, ${end.year}`;
  }

  return `${startDateStr} – ${endDateStr}`;
}

/** Known city -> country dictionary for standard normalization */
const KNOWN_DESTINATIONS: Record<string, { city: string; country: string }> = {
  bangalore: { city: 'Bangalore', country: 'India' },
  bengaluru: { city: 'Bangalore', country: 'India' },
  kerala: { city: 'Kerala', country: 'India' },
  paris: { city: 'Paris', country: 'France' },
  tokyo: { city: 'Tokyo', country: 'Japan' },
  santorini: { city: 'Santorini', country: 'Greece' },
  bali: { city: 'Bali', country: 'Indonesia' },
  rome: { city: 'Rome', country: 'Italy' },
  mumbai: { city: 'Mumbai', country: 'India' },
  bombay: { city: 'Mumbai', country: 'India' },
  delhi: { city: 'New Delhi', country: 'India' },
  'new delhi': { city: 'New Delhi', country: 'India' },
  goa: { city: 'Goa', country: 'India' },
  jaipur: { city: 'Jaipur', country: 'India' },
  london: { city: 'London', country: 'United Kingdom' },
  'new york': { city: 'New York', country: 'United States' },
  nyc: { city: 'New York', country: 'United States' },
  dubai: { city: 'Dubai', country: 'United Arab Emirates' },
  singapore: { city: 'Singapore', country: 'Singapore' },
  sydney: { city: 'Sydney', country: 'Australia' },
  amsterdam: { city: 'Amsterdam', country: 'Netherlands' },
  barcelona: { city: 'Barcelona', country: 'Spain' },
  berlin: { city: 'Berlin', country: 'Germany' },
};

/**
 * Normalizes destination to 'City, Country' standard format:
 * - 'Bangalore' -> 'Bangalore, India'
 * - 'Bangalore, India' -> 'Bangalore, India' (no duplicate country)
 * - 'Paris' -> 'Paris, France'
 * - 'Paris, France' -> 'Paris, France'
 * - 'UnknownCity' -> 'UnknownCity' (safe, doesn't blindly guess)
 */
export function formatDestinationLocation(destination?: string): string {
  if (!destination || typeof destination !== 'string') return '';
  const clean = destination.trim();
  if (!clean || clean === 'Your Destination') return clean;

  // Split by comma
  const parts = clean.split(',').map((p) => p.trim()).filter(Boolean);

  if (parts.length >= 2) {
    const city = parts[0];
    const country = parts[parts.length - 1];
    // Check if country is redundant or state was in middle
    const lookup = KNOWN_DESTINATIONS[city.toLowerCase()];
    if (lookup) {
      return `${lookup.city}, ${lookup.country}`;
    }
    // Clean deduplication
    if (city.toLowerCase() === country.toLowerCase()) {
      return city;
    }
    return `${city}, ${country}`;
  }

  // Single token without comma
  const lower = clean.toLowerCase();
  if (KNOWN_DESTINATIONS[lower]) {
    const match = KNOWN_DESTINATIONS[lower];
    return `${match.city}, ${match.country}`;
  }

  return clean;
}

/**
 * Extracts pure city/region name from destination string.
 * 'Bangalore, India' -> 'Bangalore'
 */
export function extractCityName(destination?: string): string {
  if (!destination || typeof destination !== 'string') return '';
  const clean = destination.trim();
  if (!clean) return '';
  const firstPart = clean.split(',')[0].trim();
  const lower = firstPart.toLowerCase();
  if (KNOWN_DESTINATIONS[lower]) {
    return KNOWN_DESTINATIONS[lower].city;
  }
  return firstPart;
}

/**
 * Generates sensible itinerary title:
 * - Custom name if provided: 'Bangalore Weekend Getaway'
 * - Default: `${City} Trip` (e.g. 'Bangalore Trip', 'Paris Trip')
 * - Never blindly appends 'Adventure'
 */
export function generateDefaultItineraryTitle(
  destination?: string,
  customName?: string
): string {
  const trimmedCustom = customName?.trim();
  if (trimmedCustom) {
    return trimmedCustom.slice(0, 60);
  }
  const city = extractCityName(destination);
  if (city && city !== 'Your Destination') {
    return `${city} Trip`;
  }
  return 'My Trip';
}

/**
 * Calculates traveler count consistently based on configuration:
 * - Solo: 1
 * - Couple: positive multiple of 2 (>= 2 and even)
 * - Family: adults + kids
 * - Group: adults + kids
 */
export function calculateTravelerCount(
  travelerType?: TravelerType,
  adults?: number,
  kids?: number
): number {
  if (travelerType === 'solo') return 1;
  const adultCount = typeof adults === 'number' && adults >= 1 ? adults : 1;
  const kidCount = typeof kids === 'number' && kids >= 0 ? kids : 0;
  if (travelerType === 'couple') {
    return adultCount >= 2 && adultCount % 2 === 0 ? adultCount : 2;
  }
  return adultCount + kidCount;
}

/**
 * Resolves destination image based on destination keyword mapping or curated defaults
 */
export function getDestinationImage(destination?: string): string {
  if (!destination) {
    return 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=600&auto=format&fit=crop&q=80';
  }

  const dest = destination.toLowerCase();

  if (dest.includes('bangalore') || dest.includes('bengaluru')) {
    // Bangalore Palace & gardens
    return 'https://images.unsplash.com/photo-1596176530529-78163a4f7af2?w=600&auto=format&fit=crop&q=80';
  }
  if (dest.includes('kerala')) {
    // Kerala backwaters & lush palms
    return 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=600&auto=format&fit=crop&q=80';
  }
  if (dest.includes('paris') || dest.includes('france')) {
    // Paris Eiffel Tower
    return 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=600&auto=format&fit=crop&q=80';
  }
  if (dest.includes('tokyo') || dest.includes('japan')) {
    // Tokyo Neon Streets
    return 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?w=600&auto=format&fit=crop&q=80';
  }
  if (dest.includes('santorini') || dest.includes('greece')) {
    // Santorini Aegean view
    return 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=600&auto=format&fit=crop&q=80';
  }
  if (dest.includes('bali') || dest.includes('indonesia')) {
    // Bali tropical waterfall
    return 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=600&auto=format&fit=crop&q=80';
  }
  if (dest.includes('rome') || dest.includes('italy')) {
    // Rome Colosseum
    return 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=600&auto=format&fit=crop&q=80';
  }

  // Curated neutral travel scenic fallback
  return 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=600&auto=format&fit=crop&q=80';
}

/**
 * Extracts and reconstructs start date and end date strings from a saved date range string
 * like "Sep 12 – Sep 17, 2026" or "2026-10-05 – 2026-10-12".
 */
export function extractStartAndEndDatesFromRange(rangeStr?: string): {
  startDate: string;
  endDate: string;
} {
  if (!rangeStr || typeof rangeStr !== 'string') {
    return { startDate: '', endDate: '' };
  }
  const clean = rangeStr.trim();
  if (!clean) {
    return { startDate: '', endDate: '' };
  }

  const delimiterMatch = clean.match(/\s*[–—]\s*|\s+-\s+/);
  if (!delimiterMatch || delimiterMatch.index === undefined) {
    return { startDate: clean, endDate: '' };
  }

  const p1 = clean.slice(0, delimiterMatch.index).trim();
  const p2 = clean.slice(delimiterMatch.index + delimiterMatch[0].length).trim();

  // If p1 does not include a 4-digit year but p2 does, append p2's year to p1
  const yearMatch = p2.match(/\b(20\d{2})\b/);
  let start = p1;
  let end = p2;
  if (yearMatch && !p1.match(/\b(20\d{2})\b/)) {
    start = `${p1}, ${yearMatch[1]}`;
  }

  return { startDate: start, endDate: end };
}
