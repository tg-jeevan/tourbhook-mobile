import {
  LocalDate,
  getTodayLocalDate,
  addDaysToLocalDate,
  getMaxAllowedDate,
  compareLocalDates,
  isBeforeDay,
  isAfterDay,
  isSameDay,
  formatLocalDateToDisplay,
  parseDateStringToLocalDate,
  generateMonthCalendar,
  validateTripDateRange,
} from './tripDateUtils';
import { TripCreationParams } from '../../../core/navigation/types';
import { itineraryStore, ItineraryTrip } from '../data/itineraryStore';
import { formatDateRange, formatDestinationLocation } from './itineraryFormatting';

describe('tripDateUtils', () => {
  const mockToday: LocalDate = { year: 2026, month: 10, day: 11 };

  describe('Local date arithmetic and comparison', () => {
    it('accurately adds days across month and year boundaries', () => {
      const added = addDaysToLocalDate({ year: 2026, month: 10, day: 25 }, 10);
      expect(added).toEqual({ year: 2026, month: 11, day: 4 });

      const yearAdded = addDaysToLocalDate({ year: 2026, month: 12, day: 30 }, 5);
      expect(yearAdded).toEqual({ year: 2027, month: 1, day: 4 });
    });

    it('calculates the 365-day maximum window from today', () => {
      const maxAllowed = getMaxAllowedDate(mockToday);
      expect(maxAllowed).toEqual({ year: 2027, month: 10, day: 11 });
    });

    it('correctly compares dates and determines before, after, and same day', () => {
      const d1: LocalDate = { year: 2026, month: 10, day: 11 };
      const d2: LocalDate = { year: 2026, month: 10, day: 12 };
      const dPast: LocalDate = { year: 2026, month: 10, day: 10 };

      expect(isSameDay(d1, d1)).toBe(true);
      expect(isBeforeDay(dPast, d1)).toBe(true);
      expect(isAfterDay(d2, d1)).toBe(true);
      expect(isBeforeDay(d2, d1)).toBe(false);
      expect(compareLocalDates(d1, d2)).toBeLessThan(0);
      expect(compareLocalDates(d2, d1)).toBeGreaterThan(0);
      expect(compareLocalDates(d1, d1)).toBe(0);
    });

    it('formats LocalDate into display string: "Aug 5, 2027"', () => {
      expect(formatLocalDateToDisplay({ year: 2027, month: 8, day: 5 })).toBe('Aug 5, 2027');
      expect(formatLocalDateToDisplay({ year: 2026, month: 12, day: 25 })).toBe('Dec 25, 2026');
    });

    it('parses date strings safely into LocalDate', () => {
      expect(parseDateStringToLocalDate('Aug 5, 2027')).toEqual({
        year: 2027,
        month: 8,
        day: 5,
      });
      expect(parseDateStringToLocalDate('2026-10-11')).toEqual({
        year: 2026,
        month: 10,
        day: 11,
      });
    });
  });

  describe('validateTripDateRange business rules', () => {
    it('disallows missing start date or end date', () => {
      expect(validateTripDateRange('', 'Aug 10, 2027', mockToday)).toEqual({
        isValid: false,
        errorMessage: 'Start date is required',
        field: 'startDate',
      });

      expect(validateTripDateRange('Aug 5, 2027', '', mockToday)).toEqual({
        isValid: false,
        errorMessage: 'End date is required',
        field: 'endDate',
      });
    });

    it('disables past dates (start date before today is rejected)', () => {
      const result = validateTripDateRange('Oct 10, 2026', 'Oct 15, 2026', mockToday);
      expect(result.isValid).toBe(false);
      expect(result.errorMessage).toBe('Start date cannot be in the past');
      expect(result.field).toBe('startDate');
    });

    it('allows today as valid start date', () => {
      const result = validateTripDateRange('Oct 11, 2026', 'Oct 15, 2026', mockToday);
      expect(result.isValid).toBe(true);
    });

    it('enforces that end date must be on or after start date', () => {
      // Same day is valid
      const sameDay = validateTripDateRange('Oct 15, 2026', 'Oct 15, 2026', mockToday);
      expect(sameDay.isValid).toBe(true);

      // End before start is rejected
      const invalid = validateTripDateRange('Oct 20, 2026', 'Oct 18, 2026', mockToday);
      expect(invalid.isValid).toBe(false);
      expect(invalid.errorMessage).toBe('End date must be on or after start date');
      expect(invalid.field).toBe('range');
    });

    it('enforces the 365-day maximum window from today', () => {
      // Exactly 365 days is allowed
      const validBoundary = validateTripDateRange('Oct 11, 2026', 'Oct 11, 2027', mockToday);
      expect(validBoundary.isValid).toBe(true);

      // 366 days is rejected
      const exceeded = validateTripDateRange('Oct 11, 2026', 'Oct 15, 2027', mockToday);
      expect(exceeded.isValid).toBe(false);
      expect(exceeded.errorMessage).toContain('within 365 days');
      expect(exceeded.field).toBe('endDate');
    });
  });

  describe('generateMonthCalendar', () => {
    it('disables days before minDate and after maxDate', () => {
      const minDate: LocalDate = { year: 2026, month: 10, day: 15 };
      const maxDate: LocalDate = { year: 2026, month: 10, day: 20 };

      const cells = generateMonthCalendar(2026, 10, {
        minDate,
        maxDate,
        today: mockToday,
      });

      const oct14 = cells.find((c) => c.isCurrentMonth && c.dayNumber === 14);
      expect(oct14?.isDisabled).toBe(true);

      const oct15 = cells.find((c) => c.isCurrentMonth && c.dayNumber === 15);
      expect(oct15?.isDisabled).toBe(false);

      const oct20 = cells.find((c) => c.isCurrentMonth && c.dayNumber === 20);
      expect(oct20?.isDisabled).toBe(false);

      const oct21 = cells.find((c) => c.isCurrentMonth && c.dayNumber === 21);
      expect(oct21?.isDisabled).toBe(true);
    });
  });

  describe('Preserving destination metadata and dates through itinerary creation flow', () => {
    it('preserves structured destination metadata and dates in trip creation parameters', () => {
      const selectedDest = {
        id: 'dest-bengaluru',
        city: 'Bengaluru',
        state: 'Karnataka',
        country: 'India',
        formatted: 'Bengaluru, Karnataka, India',
        coordinates: { latitude: 12.9716, longitude: 77.5946 },
      };

      const creationParams: TripCreationParams = {
        itineraryName: 'Tech Hub Exploration',
        destination: selectedDest.formatted,
        destinationMetadata: selectedDest,
        startDate: 'Aug 5, 2027',
        endDate: 'Aug 12, 2027',
        travelerType: 'couple',
        adults: 2,
        kids: 0,
        purpose: 'Leisure',
        primaryAge: 28,
      };

      expect(creationParams.destination).toBe('Bengaluru, Karnataka, India');
      expect(creationParams.destinationMetadata.id).toBe('dest-bengaluru');
      expect(creationParams.destinationMetadata.coordinates.latitude).toBeCloseTo(12.9716);

      // Verify date range formatting output
      const rangeDisplay = formatDateRange(creationParams.startDate, creationParams.endDate);
      expect(rangeDisplay).toBe('Aug 5 – Aug 12, 2027');

      // Verify persistence into ItineraryTrip
      const tripRecord: ItineraryTrip = {
        id: 'test-trip-bengaluru',
        title: creationParams.itineraryName!,
        destination: creationParams.destination,
        location: formatDestinationLocation(creationParams.destination),
        dates: rangeDisplay,
        status: 'upcoming',
        placesCount: 4,
        activitiesCount: 8,
        travelersCount: 2,
        imageUri: 'https://images.unsplash.com/photo-1596176530529-78163a4f7af2',
        theme: 'sky',
      };

      itineraryStore.addItinerary(tripRecord);
      const retrieved = itineraryStore.getItineraryById('test-trip-bengaluru');

      expect(retrieved).toBeDefined();
      expect(retrieved?.destination).toBe('Bengaluru, Karnataka, India');
      expect(retrieved?.dates).toBe('Aug 5 – Aug 12, 2027');

      // Cleanup
      itineraryStore.deleteItinerary('test-trip-bengaluru');
    });
  });
});
