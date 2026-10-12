import {
  normalizeAdultsForTravelerType,
  getNextAdultCount,
  getPrevAdultCount,
  isAdultIncrementDisabled,
  isAdultDecrementDisabled,
  isAdultCountValid,
  MAX_ADULT_COUNT,
} from './travelerRules';
import { calculateTravelerCount } from './itineraryFormatting';
import { itineraryStore, ItineraryTrip } from '../data/itineraryStore';

describe('Traveler Rules — Solo and Couple Traveler Rules', () => {
  describe('1. Solo traveler rules', () => {
    it('always normalizes Solo to exactly 1 adult', () => {
      expect(normalizeAdultsForTravelerType('solo')).toBe(1);
      expect(normalizeAdultsForTravelerType('solo', 1)).toBe(1);
      expect(normalizeAdultsForTravelerType('solo', 2)).toBe(1);
      expect(normalizeAdultsForTravelerType('solo', 5)).toBe(1);
      expect(normalizeAdultsForTravelerType('solo', 10)).toBe(1);
    });

    it('cannot increment or decrement Solo count', () => {
      // Both increment and decrement buttons are disabled
      expect(isAdultIncrementDisabled('solo', 1)).toBe(true);
      expect(isAdultDecrementDisabled('solo', 1)).toBe(true);

      // Even if called directly, handlers return 1
      expect(getNextAdultCount('solo', 1)).toBe(1);
      expect(getPrevAdultCount('solo', 1)).toBe(1);
    });

    it('validates Solo count: exactly 1 is valid, any other count is invalid', () => {
      expect(isAdultCountValid('solo', 1)).toBe(true);
      expect(isAdultCountValid('solo', 0)).toBe(false);
      expect(isAdultCountValid('solo', 2)).toBe(false);
      expect(isAdultCountValid('solo', 4)).toBe(false);
    });
  });

  describe('2. Couple traveler rules', () => {
    it('starts at 2 adults by default', () => {
      expect(normalizeAdultsForTravelerType('couple')).toBe(2);
      expect(normalizeAdultsForTravelerType('couple', 0)).toBe(2);
    });

    it('increments and decrements by two', () => {
      // Increment 2 -> 4 -> 6 -> 8
      let count = 2;
      count = getNextAdultCount('couple', count);
      expect(count).toBe(4);
      count = getNextAdultCount('couple', count);
      expect(count).toBe(6);
      count = getNextAdultCount('couple', count);
      expect(count).toBe(8);

      // Decrement 8 -> 6 -> 4 -> 2
      count = getPrevAdultCount('couple', count);
      expect(count).toBe(6);
      count = getPrevAdultCount('couple', count);
      expect(count).toBe(4);
      count = getPrevAdultCount('couple', count);
      expect(count).toBe(2);
    });

    it('never allows Couple adult count to fall below 2', () => {
      expect(getPrevAdultCount('couple', 2)).toBe(2);
      expect(isAdultDecrementDisabled('couple', 2)).toBe(true);
      expect(isAdultDecrementDisabled('couple', 4)).toBe(false);
    });

    it('disables increment at max adult limit', () => {
      expect(isAdultIncrementDisabled('couple', MAX_ADULT_COUNT)).toBe(true);
      expect(isAdultIncrementDisabled('couple', MAX_ADULT_COUNT - 2)).toBe(false);
      expect(getNextAdultCount('couple', MAX_ADULT_COUNT)).toBe(MAX_ADULT_COUNT);
    });

    it('switching from Solo (1) to Couple produces 2 adults', () => {
      const fromSoloAdults = 1;
      const coupleAdults = normalizeAdultsForTravelerType('couple', fromSoloAdults);
      expect(coupleAdults).toBe(2);
    });

    it('switching from an odd adult count to Couple normalizes correctly to next even count', () => {
      expect(normalizeAdultsForTravelerType('couple', 1)).toBe(2);
      expect(normalizeAdultsForTravelerType('couple', 3)).toBe(4);
      expect(normalizeAdultsForTravelerType('couple', 5)).toBe(6);
      expect(normalizeAdultsForTravelerType('couple', 7)).toBe(8);
      expect(normalizeAdultsForTravelerType('couple', 9)).toBe(10);
    });

    it('preserving already valid even numbers when switching to Couple', () => {
      expect(normalizeAdultsForTravelerType('couple', 2)).toBe(2);
      expect(normalizeAdultsForTravelerType('couple', 4)).toBe(4);
      expect(normalizeAdultsForTravelerType('couple', 6)).toBe(6);
      expect(normalizeAdultsForTravelerType('couple', 8)).toBe(8);
    });

    it('validates Couple adult count: only even numbers >= 2 up to max are valid', () => {
      expect(isAdultCountValid('couple', 2)).toBe(true);
      expect(isAdultCountValid('couple', 4)).toBe(true);
      expect(isAdultCountValid('couple', 6)).toBe(true);
      expect(isAdultCountValid('couple', 8)).toBe(true);

      // Invalid counts
      expect(isAdultCountValid('couple', 1)).toBe(false);
      expect(isAdultCountValid('couple', 3)).toBe(false);
      expect(isAdultCountValid('couple', 5)).toBe(false);
      expect(isAdultCountValid('couple', 7)).toBe(false);
      expect(isAdultCountValid('couple', 0)).toBe(false);
      expect(isAdultCountValid('couple', -2)).toBe(false);
    });
  });

  describe('3. Family and Friends/Group rules preserve existing behavior', () => {
    it('Family increments and decrements by 1 with min 1', () => {
      expect(getNextAdultCount('family', 2)).toBe(3);
      expect(getPrevAdultCount('family', 3)).toBe(2);
      expect(getPrevAdultCount('family', 2)).toBe(1);
      expect(getPrevAdultCount('family', 1)).toBe(1); // Min 1
      expect(isAdultDecrementDisabled('family', 1)).toBe(true);
      expect(isAdultDecrementDisabled('family', 2)).toBe(false);
    });

    it('Friends/Group increments and decrements by 1 with min 2', () => {
      expect(getNextAdultCount('group', 4)).toBe(5);
      expect(getPrevAdultCount('group', 5)).toBe(4);
      expect(getPrevAdultCount('group', 3)).toBe(2);
      expect(getPrevAdultCount('group', 2)).toBe(2); // Min 2
      expect(isAdultDecrementDisabled('group', 2)).toBe(true);
      expect(isAdultDecrementDisabled('group', 3)).toBe(false);
    });

    it('Family and Friends/Group do NOT enforce multiples of two', () => {
      expect(isAdultCountValid('family', 1)).toBe(true);
      expect(isAdultCountValid('family', 3)).toBe(true);
      expect(isAdultCountValid('family', 5)).toBe(true);

      expect(isAdultCountValid('group', 3)).toBe(true);
      expect(isAdultCountValid('group', 5)).toBe(true);
      expect(isAdultCountValid('group', 7)).toBe(true);
    });
  });

  describe('4. Final traveler count calculation and itinerary creation', () => {
    it('calculates total travelers correctly across all traveler types', () => {
      // Solo: always 1
      expect(calculateTravelerCount('solo', 1, 0)).toBe(1);
      expect(calculateTravelerCount('solo', 2, 0)).toBe(1);

      // Couple: preserves even count (2, 4, 6, 8)
      expect(calculateTravelerCount('couple', 2, 0)).toBe(2);
      expect(calculateTravelerCount('couple', 4, 0)).toBe(4);
      expect(calculateTravelerCount('couple', 6, 0)).toBe(6);
      expect(calculateTravelerCount('couple', 8, 0)).toBe(8);

      // Family: adults + kids
      expect(calculateTravelerCount('family', 2, 2)).toBe(4);
      expect(calculateTravelerCount('family', 3, 1)).toBe(4);

      // Group: adults + kids
      expect(calculateTravelerCount('group', 4, 0)).toBe(4);
      expect(calculateTravelerCount('group', 6, 0)).toBe(6);
    });

    it('persists correct traveler count into itinerary creation flow', () => {
      // Solo itinerary
      const soloTripId = 'test-solo-trip-1';
      const soloAdults = normalizeAdultsForTravelerType('solo', 3); // switched from 3 -> normalized to 1
      const soloTrip: ItineraryTrip = {
        id: soloTripId,
        title: 'Solo Exploration in Paris',
        destination: 'Paris, France',
        location: 'Paris, France',
        dates: '12 Oct - 16 Oct',
        status: 'upcoming',
        placesCount: 5,
        activitiesCount: 2,
        travelersCount: calculateTravelerCount('solo', soloAdults, 0),
        imageUri: 'https://example.com/paris.jpg',
        theme: 'sky',
      };
      itineraryStore.addItinerary(soloTrip);
      const storedSolo = itineraryStore.getItineraryById(soloTripId);
      expect(storedSolo?.travelersCount).toBe(1);

      // Couple itinerary with 4 travelers (double couple)
      const coupleTripId = 'test-couple-trip-1';
      const coupleAdults = normalizeAdultsForTravelerType('couple', 4);
      const coupleTrip: ItineraryTrip = {
        id: coupleTripId,
        title: 'Couples Retreat in Bali',
        destination: 'Bali, Indonesia',
        location: 'Bali, Indonesia',
        dates: '20 Nov - 25 Nov',
        status: 'upcoming',
        placesCount: 6,
        activitiesCount: 3,
        travelersCount: calculateTravelerCount('couple', coupleAdults, 0),
        imageUri: 'https://example.com/bali.jpg',
        theme: 'mint',
      };
      itineraryStore.addItinerary(coupleTrip);
      const storedCouple = itineraryStore.getItineraryById(coupleTripId);
      expect(storedCouple?.travelersCount).toBe(4);
    });
  });
});
