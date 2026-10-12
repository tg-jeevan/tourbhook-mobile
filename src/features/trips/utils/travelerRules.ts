import { TravelerType } from '../../../core/navigation/types';

export const MAX_ADULT_COUNT = 20;

/**
 * Normalizes adult count based on TravelerType business rules:
 * - Solo: exactly 1 adult.
 * - Couple: positive multiple of 2 (>= 2 and even).
 *   If 1 -> 2. If odd -> next even number (e.g. 3 -> 4, 5 -> 6).
 * - Family: >= 1 (default 2).
 * - Friends/Group: >= 2 (default 4).
 */
export function normalizeAdultsForTravelerType(
  type: TravelerType,
  currentAdults?: number
): number {
  if (type === 'solo') {
    return 1;
  }

  if (type === 'couple') {
    if (typeof currentAdults !== 'number' || currentAdults < 2) {
      return 2;
    }
    // If odd, normalize to next even number up to MAX_ADULT_COUNT
    let normalized = currentAdults % 2 !== 0 ? currentAdults + 1 : currentAdults;
    if (normalized < 2) normalized = 2;
    if (normalized > MAX_ADULT_COUNT) normalized = MAX_ADULT_COUNT;
    return normalized;
  }

  if (type === 'family') {
    if (typeof currentAdults !== 'number' || currentAdults < 1) {
      return 2;
    }
    return Math.min(Math.max(currentAdults, 1), MAX_ADULT_COUNT);
  }

  // Friends/Group
  if (typeof currentAdults !== 'number' || currentAdults < 2) {
    return 4;
  }
  return Math.min(Math.max(currentAdults, 2), MAX_ADULT_COUNT);
}

/**
 * Calculates next adult count on '+' increment:
 * - Solo: 1 (disabled, cannot increment).
 * - Couple: increases by 2 (e.g. 2 -> 4 -> 6 -> 8).
 * - Family: increases by 1.
 * - Friends/Group: increases by 1.
 */
export function getNextAdultCount(
  type: TravelerType,
  currentAdults: number,
  maxAdults: number = MAX_ADULT_COUNT
): number {
  if (type === 'solo') {
    return 1;
  }

  if (type === 'couple') {
    const next = currentAdults + 2;
    return Math.min(next, maxAdults);
  }

  return Math.min(currentAdults + 1, maxAdults);
}

/**
 * Calculates previous adult count on '−' decrement:
 * - Solo: 1 (disabled, cannot decrement).
 * - Couple: decreases by 2 (e.g. 8 -> 6 -> 4 -> 2, minimum 2).
 * - Family: decreases by 1 (minimum 1).
 * - Friends/Group: decreases by 1 (minimum 2).
 */
export function getPrevAdultCount(type: TravelerType, currentAdults: number): number {
  if (type === 'solo') {
    return 1;
  }

  if (type === 'couple') {
    const prev = currentAdults - 2;
    return Math.max(prev, 2);
  }

  if (type === 'family') {
    return Math.max(currentAdults - 1, 1);
  }

  // Friends/Group
  return Math.max(currentAdults - 1, 2);
}

/**
 * Determines whether adult increment button should be disabled:
 * - Solo: always true.
 * - Couple: disabled if next count would exceed maxAdults.
 * - Family/Group: disabled if currentAdults >= maxAdults.
 */
export function isAdultIncrementDisabled(
  type: TravelerType,
  currentAdults: number,
  maxAdults: number = MAX_ADULT_COUNT
): boolean {
  if (type === 'solo') {
    return true;
  }

  if (type === 'couple') {
    return currentAdults + 2 > maxAdults;
  }

  return currentAdults >= maxAdults;
}

/**
 * Determines whether adult decrement button should be disabled:
 * - Solo: always true.
 * - Couple: disabled if currentAdults <= 2.
 * - Family: disabled if currentAdults <= 1.
 * - Friends/Group: disabled if currentAdults <= 2.
 */
export function isAdultDecrementDisabled(
  type: TravelerType,
  currentAdults: number
): boolean {
  if (type === 'solo') {
    return true;
  }

  if (type === 'couple') {
    return currentAdults <= 2;
  }

  if (type === 'family') {
    return currentAdults <= 1;
  }

  // Friends/Group
  return currentAdults <= 2;
}

/**
 * Validates adult count for a given traveler type:
 */
export function isAdultCountValid(type: TravelerType, adults: number): boolean {
  if (type === 'solo') {
    return adults === 1;
  }

  if (type === 'couple') {
    return adults >= 2 && adults % 2 === 0 && adults <= MAX_ADULT_COUNT;
  }

  if (type === 'family') {
    return adults >= 1 && adults <= MAX_ADULT_COUNT;
  }

  if (type === 'group') {
    return adults >= 2 && adults <= MAX_ADULT_COUNT;
  }

  return false;
}
