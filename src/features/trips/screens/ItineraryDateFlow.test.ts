import { itineraryStore, ItineraryTrip } from '../data/itineraryStore';
import {
  generateItineraryDaysForDates,
  getMockItineraryDays,
  TimelineItem,
} from '../types/itineraryPackingTypes';
import {
  formatDateRange,
  extractStartAndEndDatesFromRange,
} from '../utils/itineraryFormatting';
import {
  parseDateStringToLocalDate,
  getDaysBetween,
  addDaysToLocalDate,
  validateTripDateRange,
} from '../utils/tripDateUtils';

describe('Itinerary Date Consistency Flow', () => {
  beforeEach(() => {
    itineraryStore.resetToInitial();
  });

  describe('1. Dynamic Day Generation from Start and End Dates', () => {
    test('October 5–12, 2026 generates exactly 8 days with Oct 5 as Day 1 and Oct 12 as Day 8', () => {
      const days = generateItineraryDaysForDates('Oct 5, 2026', 'Oct 12, 2026');

      expect(days).toHaveLength(8);

      // Day 1: October 5
      expect(days[0].id).toBe('day-1');
      expect(days[0].dayLabel).toBe('Day 1');
      expect(days[0].dateLabel).toBe('Oct 5');
      expect(days[0].items.length).toBeGreaterThan(0);

      // Day 2 to Day 7
      expect(days[1].dayLabel).toBe('Day 2');
      expect(days[1].dateLabel).toBe('Oct 6');
      expect(days[2].dateLabel).toBe('Oct 7');
      expect(days[3].dateLabel).toBe('Oct 8');
      expect(days[4].dateLabel).toBe('Oct 9');
      expect(days[5].dateLabel).toBe('Oct 10');
      expect(days[6].dateLabel).toBe('Oct 11');

      // Day 8: October 12 (final day)
      expect(days[7].id).toBe('day-8');
      expect(days[7].dayLabel).toBe('Day 8');
      expect(days[7].dateLabel).toBe('Oct 12');
      expect(days[7].items.length).toBeGreaterThan(0);
    });

    test('single-day trip (Oct 5 to Oct 5) generates 1 day', () => {
      const days = generateItineraryDaysForDates('Oct 5, 2026', 'Oct 5, 2026');
      expect(days).toHaveLength(1);
      expect(days[0].dayLabel).toBe('Day 1');
      expect(days[0].dateLabel).toBe('Oct 5');
    });

    test('missing or invalid dates fallback to standard mock days without crash', () => {
      const days = generateItineraryDaysForDates('', '');
      expect(days).toHaveLength(4);
      expect(days[0].dayLabel).toBe('Day 1');
    });

    test('preserves existing custom items when regenerating days with adjusted dates', () => {
      const initialDays = generateItineraryDaysForDates('Oct 5, 2026', 'Oct 12, 2026');
      const customItem: TimelineItem = {
        id: 'custom-act-1',
        type: 'activity',
        time: '10:00 AM',
        title: 'Shibuya Crossing Photo Walk',
        subtitle: 'Capture the iconic crossing from above',
      };
      initialDays[0].items.push(customItem);

      // User shortened trip to Oct 5–10 (6 days)
      const updatedDays = generateItineraryDaysForDates('Oct 5, 2026', 'Oct 10, 2026', initialDays);
      expect(updatedDays).toHaveLength(6);
      expect(updatedDays[0].dateLabel).toBe('Oct 5');
      expect(updatedDays[5].dateLabel).toBe('Oct 10');
      expect(updatedDays[0].items.some((i) => i.id === 'custom-act-1')).toBe(true);
    });
  });

  describe('2. Store-level Itinerary Days Synchronization', () => {
    test('Tokyo Explorer (Trip 2) with Oct 5–12 dates returns 8 days starting Oct 5 and ending Oct 12', () => {
      const trip = itineraryStore.getItineraryById('2');
      expect(trip).toBeDefined();
      expect(trip?.dates).toBe('Oct 5 – Oct 12, 2026');
      expect(trip?.startDate).toBe('Oct 5, 2026');
      expect(trip?.endDate).toBe('Oct 12, 2026');

      const days = itineraryStore.getItineraryDays('2');
      expect(days).toHaveLength(8);
      expect(days[0].dayLabel).toBe('Day 1');
      expect(days[0].dateLabel).toBe('Oct 5');
      expect(days[7].dayLabel).toBe('Day 8');
      expect(days[7].dateLabel).toBe('Oct 12');
    });

    test('Paris Adventure (Trip 1) with Sep 12–17 dates returns 6 days starting Sep 12 and ending Sep 17', () => {
      const days = itineraryStore.getItineraryDays('1');
      expect(days).toHaveLength(6);
      expect(days[0].dateLabel).toBe('Sep 12');
      expect(days[5].dateLabel).toBe('Sep 17');
    });

    test('creating a new trip with Oct 5–12 saves authoritative dates and generates 8-day itinerary', () => {
      const newTripId = 'trip-new-oct';
      const formattedDates = formatDateRange('Oct 5, 2026', 'Oct 12, 2026');
      expect(formattedDates).toBe('Oct 5 – Oct 12, 2026');

      const newTrip: ItineraryTrip = {
        id: newTripId,
        title: 'Tokyo Autumn Trip',
        destination: 'Tokyo, Japan',
        location: 'Tokyo, Japan',
        dates: formattedDates,
        startDate: 'Oct 5, 2026',
        endDate: 'Oct 12, 2026',
        status: 'upcoming',
        placesCount: 5,
        activitiesCount: 10,
        travelersCount: 2,
        imageUri: 'https://images.unsplash.com/test',
        theme: 'peach',
      };

      itineraryStore.addItinerary(newTrip);

      const saved = itineraryStore.getItineraryById(newTripId);
      expect(saved).toBeDefined();
      expect(saved?.startDate).toBe('Oct 5, 2026');
      expect(saved?.endDate).toBe('Oct 12, 2026');
      expect(saved?.dates).toBe('Oct 5 – Oct 12, 2026');

      const days = itineraryStore.getItineraryDays(newTripId);
      expect(days).toHaveLength(8);
      expect(days[0].dateLabel).toBe('Oct 5');
      expect(days[7].dateLabel).toBe('Oct 12');
    });

    test('editing an existing trip preserves dates unless user explicitly changes them', () => {
      const tripId = '2';
      const originalTrip = itineraryStore.getItineraryById(tripId)!;
      const originalDates = originalTrip.dates;
      const originalStartDate = originalTrip.startDate;
      const originalEndDate = originalTrip.endDate;

      // Edit other attributes without changing dates
      itineraryStore.updateItinerary(tripId, {
        travelersCount: 4,
        adults: 3,
        kids: 1,
      });

      const updated = itineraryStore.getItineraryById(tripId)!;
      expect(updated.dates).toBe(originalDates);
      expect(updated.startDate).toBe(originalStartDate);
      expect(updated.endDate).toBe(originalEndDate);

      const days = itineraryStore.getItineraryDays(tripId);
      expect(days).toHaveLength(8);
      expect(days[0].dateLabel).toBe('Oct 5');
      expect(days[7].dateLabel).toBe('Oct 12');
    });

    test('editing an existing trip with new dates updates dates and regenerates day tabs', () => {
      const tripId = '2';
      const newFormattedDates = formatDateRange('Nov 1, 2026', 'Nov 5, 2026');
      expect(newFormattedDates).toBe('Nov 1 – Nov 5, 2026');

      itineraryStore.updateItinerary(tripId, {
        startDate: 'Nov 1, 2026',
        endDate: 'Nov 5, 2026',
        dates: newFormattedDates,
      });

      const updated = itineraryStore.getItineraryById(tripId)!;
      expect(updated.startDate).toBe('Nov 1, 2026');
      expect(updated.endDate).toBe('Nov 5, 2026');
      expect(updated.dates).toBe('Nov 1 – Nov 5, 2026');

      const days = itineraryStore.getItineraryDays(tripId);
      expect(days).toHaveLength(5);
      expect(days[0].dayLabel).toBe('Day 1');
      expect(days[0].dateLabel).toBe('Nov 1');
      expect(days[4].dayLabel).toBe('Day 5');
      expect(days[4].dateLabel).toBe('Nov 5');
    });
  });

  describe('3. Consistent Date Formatting Across Display Surfaces', () => {
    test('formatDateRange formats dates consistently as "Oct 5 – Oct 12, 2026"', () => {
      expect(formatDateRange('Oct 5, 2026', 'Oct 12, 2026')).toBe('Oct 5 – Oct 12, 2026');
      expect(formatDateRange('2026-10-05', '2026-10-12')).toBe('Oct 5 – Oct 12, 2026');
      expect(formatDateRange('5/10/2026', '12/10/2026')).toBe('Oct 5 – Oct 12, 2026');
      expect(formatDateRange('Oct 5 – Oct 12, 2026')).toBe('Oct 5 – Oct 12, 2026');
    });

    test('formatDateRange handles cross-month and cross-year ranges correctly', () => {
      expect(formatDateRange('Sep 28, 2026', 'Oct 4, 2026')).toBe('Sep 28 – Oct 4, 2026');
      expect(formatDateRange('Dec 28, 2026', 'Jan 3, 2027')).toBe('Dec 28, 2026 – Jan 3, 2027');
    });

    test('extractStartAndEndDatesFromRange safely retrieves authoritative start and end dates', () => {
      const extracted = extractStartAndEndDatesFromRange('Oct 5 – Oct 12, 2026');
      expect(extracted.startDate).toBe('Oct 5, 2026');
      expect(extracted.endDate).toBe('Oct 12, 2026');
    });
  });

  describe('4. Date Validation with Edit Mode Support', () => {
    test('validates date range for new trips', () => {
      const valid = validateTripDateRange('Aug 5, 2027', 'Aug 12, 2027');
      expect(valid.isValid).toBe(true);

      const invalid = validateTripDateRange('Aug 12, 2027', 'Aug 5, 2027');
      expect(invalid.isValid).toBe(false);
      expect(invalid.errorMessage).toBe('End date must be on or after start date');
    });

    test('allows original start date in edit mode even if it would otherwise be in past', () => {
      const today = { year: 2026, month: 10, day: 15 };
      // Start date is Oct 5, 2026 (prior to today Oct 15)
      const resultNew = validateTripDateRange('Oct 5, 2026', 'Oct 12, 2026', today);
      expect(resultNew.isValid).toBe(false);
      expect(resultNew.errorMessage).toBe('Start date cannot be in the past');

      // In edit mode with original start date preserved
      const resultEdit = validateTripDateRange('Oct 5, 2026', 'Oct 12, 2026', {
        today,
        isEditMode: true,
        originalStartDate: 'Oct 5, 2026',
      });
      expect(resultEdit.isValid).toBe(true);
    });
  });

  describe('5. Activity modifications persist in itineraryStore', () => {
    test('setItineraryDays persists modifications for the specific trip', () => {
      const days = itineraryStore.getItineraryDays('2');
      expect(days).toHaveLength(8);

      const updatedDays = days.map((d, index) => {
        if (index === 0) {
          return {
            ...d,
            items: d.items.filter((item) => item.id !== 'd1-1'),
          };
        }
        return d;
      });

      itineraryStore.setItineraryDays('2', updatedDays);

      const fetchedDays = itineraryStore.getItineraryDays('2');
      expect(fetchedDays[0].items.some((i) => i.id === 'd1-1')).toBe(false);
    });
  });
});
