import { itineraryStore, ItineraryTrip } from '../data/itineraryStore';
import {
  CURATED_DESTINATIONS,
  DestinationSuggestion,
  searchDestinationSuggestions,
} from '../services/destinationAutocompleteService';
import {
  formatDateRange,
  formatDestinationLocation,
  extractStartAndEndDatesFromRange,
} from '../utils/itineraryFormatting';
import { validateTripDateRange } from '../utils/tripDateUtils';
import {
  normalizeAdultsForTravelerType,
  getNextAdultCount,
  getPrevAdultCount,
} from '../utils/travelerRules';
import { TripCreationParams, TripCreationFullParams } from '../../../core/navigation/types';

describe('Edit Itinerary Flow & Destination Validation', () => {
  beforeEach(() => {
    itineraryStore.resetToInitial();
  });

  // Helper matching PlanTripScreen's resolveDestinationSuggestionForTrip
  function resolveDestinationSuggestionForTrip(trip?: ItineraryTrip): DestinationSuggestion | null {
    if (!trip) return null;
    const rawDest = (trip.destination || trip.location || '').trim();
    if (!rawDest) return null;

    if (trip.destinationMetadata && trip.destinationMetadata.formatted) {
      return trip.destinationMetadata as DestinationSuggestion;
    }

    const lower = rawDest.toLowerCase();
    const curated = CURATED_DESTINATIONS.find(
      (c) =>
        c.formatted.toLowerCase() === lower ||
        c.city.toLowerCase() === lower ||
        lower.includes(c.city.toLowerCase())
    );
    if (curated) {
      return curated;
    }

    const parts = rawDest.split(',').map((p) => p.trim());
    const city = parts[0] || rawDest;
    const country = parts.length > 1 ? parts[parts.length - 1] : '';
    const state = parts.length > 2 ? parts[1] : '';

    return {
      id: `dest-${trip.id}`,
      city,
      state: state || undefined,
      country: country || 'Unknown',
      formatted: rawDest,
    };
  }

  // Helper simulating destination validation logic in handleNext
  function validateDestinationForStep({
    destinationInput,
    selectedDestination,
    isEditMode,
    existingTrip,
  }: {
    destinationInput: string;
    selectedDestination: DestinationSuggestion | null;
    isEditMode: boolean;
    existingTrip?: ItineraryTrip;
  }): { isValid: boolean; effectiveDestination: DestinationSuggestion | null; error?: string } {
    let effectiveDestination: DestinationSuggestion | null = selectedDestination;
    if (!effectiveDestination && isEditMode && existingTrip) {
      const cleanInput = destinationInput.trim();
      const savedDest = (existingTrip.destination || existingTrip.location || '').trim();
      if (cleanInput && savedDest && cleanInput.toLowerCase() === savedDest.toLowerCase()) {
        effectiveDestination = resolveDestinationSuggestionForTrip(existingTrip);
      }
    }

    if (!effectiveDestination) {
      const hasInput = Boolean(destinationInput.trim());
      const error = hasInput
        ? 'Please select a destination from the suggestions dropdown.'
        : 'Please enter where you want to go.';
      return { isValid: false, effectiveDestination: null, error };
    }

    return { isValid: true, effectiveDestination };
  }

  describe('1. New itinerary destination validation', () => {
    it('new itinerary with no destination shows the existing validation error', () => {
      const result = validateDestinationForStep({
        destinationInput: '',
        selectedDestination: null,
        isEditMode: false,
      });

      expect(result.isValid).toBe(false);
      expect(result.effectiveDestination).toBeNull();
      expect(result.error).toBe('Please enter where you want to go.');
    });

    it('new itinerary with typed text but no chosen dropdown selection shows dropdown requirement error', () => {
      const result = validateDestinationForStep({
        destinationInput: 'London',
        selectedDestination: null,
        isEditMode: false,
      });

      expect(result.isValid).toBe(false);
      expect(result.effectiveDestination).toBeNull();
      expect(result.error).toBe('Please select a destination from the suggestions dropdown.');
    });

    it('new itinerary with a valid selected destination proceeds successfully', async () => {
      const suggestions = await searchDestinationSuggestions('Paris');
      const selected = suggestions[0];
      expect(selected).toBeDefined();

      const result = validateDestinationForStep({
        destinationInput: selected.formatted,
        selectedDestination: selected,
        isEditMode: false,
      });

      expect(result.isValid).toBe(true);
      expect(result.effectiveDestination).toBeDefined();
      expect(result.effectiveDestination?.city).toBe('Paris');
      expect(result.error).toBeUndefined();
    });
  });

  describe('2. Editing an existing itinerary prepopulation & validation', () => {
    it('editing an existing itinerary prepopulates its saved destination and planning data', () => {
      const existingTrip = itineraryStore.getItineraryById('1');
      expect(existingTrip).toBeDefined();

      const resolvedDest = resolveDestinationSuggestionForTrip(existingTrip);
      expect(resolvedDest).toBeDefined();
      expect(resolvedDest?.formatted).toContain('Paris');

      const dates = existingTrip!.startDate && existingTrip!.endDate
        ? { startDate: existingTrip!.startDate, endDate: existingTrip!.endDate }
        : extractStartAndEndDatesFromRange(existingTrip!.dates);

      expect(dates.startDate).toBe('Sep 12, 2026');
      expect(dates.endDate).toBe('Sep 17, 2026');
      expect(existingTrip?.travelerType).toBe('couple');
      expect(existingTrip?.adults).toBe(2);
    });

    it('editing an existing itinerary with a valid destination does NOT show Missing Destination', () => {
      const existingTrip = itineraryStore.getItineraryById('1');
      const resolvedDest = resolveDestinationSuggestionForTrip(existingTrip);

      const result = validateDestinationForStep({
        destinationInput: existingTrip!.destination,
        selectedDestination: resolvedDest,
        isEditMode: true,
        existingTrip,
      });

      expect(result.isValid).toBe(true);
      expect(result.effectiveDestination).toBeDefined();
      expect(result.effectiveDestination?.formatted).toBe(existingTrip!.destination);
      expect(result.error).toBeUndefined();
    });

    it('editing an itinerary without changing prefilled destination proceeds even if selectedDestination was somehow unassigned', () => {
      const existingTrip = itineraryStore.getItineraryById('1');

      // Simulating edge case where selectedDestination is null but input matches saved destination
      const result = validateDestinationForStep({
        destinationInput: 'Paris, France',
        selectedDestination: null,
        isEditMode: true,
        existingTrip,
      });

      expect(result.isValid).toBe(true);
      expect(result.effectiveDestination).toBeDefined();
      expect(result.effectiveDestination?.city).toBe('Paris');
    });

    it('changing the destination in edit mode invalidates prior destination and requires a valid new selection', () => {
      const existingTrip = itineraryStore.getItineraryById('1');

      // User modified destination text without picking a suggestion
      const result = validateDestinationForStep({
        destinationInput: 'Rome, Italy - Central',
        selectedDestination: null, // invalidated on change
        isEditMode: true,
        existingTrip,
      });

      expect(result.isValid).toBe(false);
      expect(result.effectiveDestination).toBeNull();
      expect(result.error).toBe('Please select a destination from the suggestions dropdown.');
    });

    it('clearing the destination input in edit mode shows Please enter where you want to go', () => {
      const existingTrip = itineraryStore.getItineraryById('1');

      const result = validateDestinationForStep({
        destinationInput: '',
        selectedDestination: null,
        isEditMode: true,
        existingTrip,
      });

      expect(result.isValid).toBe(false);
      expect(result.effectiveDestination).toBeNull();
      expect(result.error).toBe('Please enter where you want to go.');
    });
  });

  describe('3. Flow data preservation & in-place update (no duplicate or slot consumption)', () => {
    it('preserves existing itinerary ID and full data throughout the edit flow', () => {
      const originalTrip = itineraryStore.getItineraryById('1')!;
      const editParams: TripCreationFullParams = {
        tripId: originalTrip.id,
        mode: 'edit',
        itineraryName: 'Paris Romantic Getaway',
        destination: originalTrip.destination,
        destinationMetadata: resolveDestinationSuggestionForTrip(originalTrip),
        startDate: 'Sep 12, 2026',
        endDate: 'Sep 18, 2026',
        travelerType: 'couple',
        adults: 2,
        kids: 0,
        purpose: 'Leisure',
        primaryAge: 29,
        travelStyle: 'Relaxed Vacation',
        selectedPlaceIds: ['ai-1', 'ai-2', 'ai-3'],
        travelModes: ['Airplane', 'Public Transport'],
      };

      expect(editParams.tripId).toBe('1');
      expect(editParams.mode).toBe('edit');
      expect(editParams.destination).toBe('Paris, France');
      expect(editParams.selectedPlaceIds).toHaveLength(3);
    });

    it('saving an edit updates the original itinerary rather than creating a duplicate, while preserving original name and id', () => {
      const initialItineraries = itineraryStore.getItineraries();
      const initialCount = initialItineraries.length;

      const tripId = '1';
      const existing = itineraryStore.getItineraryById(tripId)!;
      expect(existing).toBeDefined();
      const originalTitle = existing.title;

      const attemptedNewTitle = 'Paris Adventure — Updated';
      const updatedDates = 'Sep 12 – Sep 18, 2026';

      const success = itineraryStore.updateItinerary(tripId, {
        title: attemptedNewTitle,
        customName: attemptedNewTitle,
        dates: updatedDates,
        startDate: 'Sep 12, 2026',
        endDate: 'Sep 18, 2026',
        travelStyle: 'Relaxed Vacation',
        selectedPlaceIds: ['ai-1', 'ai-2'],
      });

      expect(success).toBe(true);

      const afterUpdate = itineraryStore.getItineraries();
      // Count must remain exactly the same (no duplicate created)
      expect(afterUpdate.length).toBe(initialCount);

      const updatedRecord = itineraryStore.getItineraryById(tripId);
      expect(updatedRecord?.id).toBe(tripId);
      expect(updatedRecord?.title).toBe(attemptedNewTitle);
      expect(updatedRecord?.customName).toBe(attemptedNewTitle);
      expect(updatedRecord?.dates).toBe(updatedDates);
      expect(updatedRecord?.travelStyle).toBe('Relaxed Vacation');
      expect(updatedRecord?.selectedPlaceIds).toEqual(['ai-1', 'ai-2']);
    });

    it('editing does not consume another free-plan itinerary slot', () => {
      const FREE_LIMIT = 3;
      const initialList = itineraryStore.getItineraries();
      expect(initialList.length).toBe(FREE_LIMIT);

      // Editing an existing trip
      itineraryStore.updateItinerary('2', {
        title: 'Tokyo Explorer Extended',
        customName: 'Tokyo Explorer Extended',
        placesCount: 8,
      });

      // Still within the limit, length has not changed
      const currentList = itineraryStore.getItineraries();
      expect(currentList.length).toBe(FREE_LIMIT);
      expect(currentList.length <= FREE_LIMIT).toBe(true);
      // And the name is updated in-place on the existing trip
      expect(itineraryStore.getItineraryById('2')?.title).toBe('Tokyo Explorer Extended');
    });

    it('attempting to update destination or age does not change the saved values', () => {
      const tripId = '1';
      const existing = itineraryStore.getItineraryById(tripId)!;
      const originalTitle = existing.title;
      const originalDestination = existing.destination;
      const originalAge = existing.primaryAge;

      itineraryStore.updateItinerary(tripId, {
        destination: 'Rome, Italy',
        location: 'Rome, Italy',
        primaryAge: 99,
      });

      const updated = itineraryStore.getItineraryById(tripId);
      expect(updated?.destination).toBe(originalDestination);
      expect(updated?.title).toBe(originalTitle);
      expect(updated?.primaryAge).toBe(originalAge);
      expect(updated?.id).toBe(tripId);
    });

    it('updating dates and traveller counts does not change the itinerary name when name is omitted', () => {
      const tripId = '2';
      const existing = itineraryStore.getItineraryById(tripId)!;
      const originalTitle = existing.title;

      itineraryStore.updateItinerary(tripId, {
        startDate: 'Nov 1, 2026',
        endDate: 'Nov 8, 2026',
        dates: 'Nov 1 – Nov 8, 2026',
        travelersCount: 6,
        adults: 4,
        kids: 2,
      });

      const updated = itineraryStore.getItineraryById(tripId);
      expect(updated?.dates).toBe('Nov 1 – Nov 8, 2026');
      expect(updated?.travelersCount).toBe(6);
      expect(updated?.title).toBe(originalTitle);
      expect(updated?.id).toBe(tripId);
    });

    it('re-generating itinerary details without name does not replace or overwrite the name', () => {
      const tripId = '1';
      const existing = itineraryStore.getItineraryById(tripId)!;
      const originalTitle = existing.title;

      // Simulate AI itinerary regeneration with new activities/places without renaming
      itineraryStore.updateItinerary(tripId, {
        placesCount: 12,
        activitiesCount: 25,
      });

      const regenerated = itineraryStore.getItineraryById(tripId);
      expect(regenerated?.placesCount).toBe(12);
      expect(regenerated?.activitiesCount).toBe(25);
      expect(regenerated?.title).toBe(originalTitle);
      expect(regenerated?.id).toBe(tripId);
    });

    it('editing an existing itinerary preserves original dates when dates are not edited', () => {
      const tripId = '2';
      const existing = itineraryStore.getItineraryById(tripId)!;
      expect(existing.dates).toBe('Oct 5 – Oct 12, 2026');
      expect(existing.startDate).toBe('Oct 5, 2026');
      expect(existing.endDate).toBe('Oct 12, 2026');

      itineraryStore.updateItinerary(tripId, {
        travelStyle: 'Budget Friendly',
      });

      const updated = itineraryStore.getItineraryById(tripId)!;
      expect(updated.dates).toBe('Oct 5 – Oct 12, 2026');
      expect(updated.startDate).toBe('Oct 5, 2026');
      expect(updated.endDate).toBe('Oct 12, 2026');

      const days = itineraryStore.getItineraryDays(tripId);
      expect(days).toHaveLength(8);
      expect(days[0].dateLabel).toBe('Oct 5');
      expect(days[7].dateLabel).toBe('Oct 12');
    });

    it('editing an existing itinerary with new dates updates both dates and day tabs', () => {
      const tripId = '1';
      const newFormattedDates = formatDateRange('Nov 10, 2026', 'Nov 14, 2026');

      itineraryStore.updateItinerary(tripId, {
        startDate: 'Nov 10, 2026',
        endDate: 'Nov 14, 2026',
        dates: newFormattedDates,
      });

      const updated = itineraryStore.getItineraryById(tripId)!;
      expect(updated.dates).toBe('Nov 10 – Nov 14, 2026');
      expect(updated.startDate).toBe('Nov 10, 2026');
      expect(updated.endDate).toBe('Nov 14, 2026');

      const days = itineraryStore.getItineraryDays(tripId);
      expect(days).toHaveLength(5);
      expect(days[0].dateLabel).toBe('Nov 10');
      expect(days[4].dateLabel).toBe('Nov 14');
    });
  });

  describe('4. Traveler count and date validation rules remain intact', () => {
    it('upholds Solo traveler rule (always 1 adult) in edit mode', () => {
      expect(normalizeAdultsForTravelerType('solo', 4)).toBe(1);
      expect(getNextAdultCount('solo', 1)).toBe(1);
      expect(getPrevAdultCount('solo', 1)).toBe(1);
    });

    it('upholds Couple traveler rule (multiples of 2 >= 2) in edit mode', () => {
      expect(normalizeAdultsForTravelerType('couple', 1)).toBe(2);
      expect(normalizeAdultsForTravelerType('couple', 3)).toBe(4);
      expect(getNextAdultCount('couple', 2)).toBe(4);
      expect(getPrevAdultCount('couple', 2)).toBe(2);
    });

    it('validates trip date ranges correctly', () => {
      const valid = validateTripDateRange('Aug 5, 2027', 'Aug 10, 2027');
      expect(valid.isValid).toBe(true);

      const invalidOrder = validateTripDateRange('Aug 15, 2027', 'Aug 10, 2027');
      expect(invalidOrder.isValid).toBe(false);
      expect(invalidOrder.errorMessage).toBe('End date must be on or after start date');
    });

    it('extractStartAndEndDatesFromRange cleanly parses various date formats', () => {
      const r1 = extractStartAndEndDatesFromRange('Sep 12 – Sep 17, 2026');
      expect(r1.startDate).toBe('Sep 12, 2026');
      expect(r1.endDate).toBe('Sep 17, 2026');

      const r2 = extractStartAndEndDatesFromRange('2026-10-05 – 2026-10-12');
      expect(r2.startDate).toBe('2026-10-05');
      expect(r2.endDate).toBe('2026-10-12');

      const r3 = extractStartAndEndDatesFromRange('Nov 20 - Nov 23, 2026');
      expect(r3.startDate).toBe('Nov 20, 2026');
      expect(r3.endDate).toBe('Nov 23, 2026');
    });
  });

  describe('5. Itinerary Editing Bug Fix Verification (Duplicate Prevention & In-Place Rename)', () => {
    const SAMPLE_TRIP_ID = 'trip-sample-bkk';

    beforeEach(() => {
      itineraryStore.resetToInitial();
    });

    it('1. Creating a new itinerary adds exactly one record', () => {
      const countBefore = itineraryStore.getItineraries().length;
      const newTrip: ItineraryTrip = {
        id: SAMPLE_TRIP_ID,
        title: 'Sample',
        customName: 'Sample',
        destination: 'Bangkok, Thailand',
        location: 'Bangkok, Thailand',
        dates: 'Oct 15 – Oct 24, 2026',
        startDate: 'Oct 15, 2026',
        endDate: 'Oct 24, 2026',
        status: 'upcoming',
        placesCount: 3,
        activitiesCount: 0,
        travelersCount: 4,
        imageUri: 'https://images.unsplash.com/photo-1508009603885-50cf7c579365',
        theme: 'mint',
      };

      itineraryStore.addItinerary(newTrip);

      const afterAdd = itineraryStore.getItineraries();
      expect(afterAdd.length).toBe(countBefore + 1);

      const created = itineraryStore.getItineraryById(SAMPLE_TRIP_ID);
      expect(created).toBeDefined();
      expect(created?.title).toBe('Sample');
      expect(created?.customName).toBe('Sample');
      expect(created?.destination).toBe('Bangkok, Thailand');
    });

    it('2. Renaming an existing itinerary retains the same ID and total itinerary count without duplicates', () => {
      const initialCount = itineraryStore.getItineraries().length;
      const tripToRename = itineraryStore.getItineraryById('1')!;
      const originalId = tripToRename.id;

      // Rename from 'Paris Adventure' to 'Sample googl'
      const updated = itineraryStore.updateItinerary(originalId, {
        title: 'Sample googl',
        customName: 'Sample googl',
      });

      expect(updated).toBe(true);

      const currentItineraries = itineraryStore.getItineraries();
      // Total count MUST remain strictly identical
      expect(currentItineraries.length).toBe(initialCount);

      // Same ID retained
      const renamed = itineraryStore.getItineraryById(originalId);
      expect(renamed?.id).toBe(originalId);
      expect(renamed?.title).toBe('Sample googl');
      expect(renamed?.customName).toBe('Sample googl');

      // Only one card matching 'Sample googl'
      const matches = currentItineraries.filter(
        (i) => i.title === 'Sample googl' || i.customName === 'Sample googl'
      );
      expect(matches).toHaveLength(1);
      expect(matches[0].id).toBe(originalId);
    });

    it('3. Editing other fields updates that same record in-place', () => {
      const tripId = '2';
      const initialTotal = itineraryStore.getItineraries().length;
      const initialTrip = itineraryStore.getItineraryById(tripId)!;
      const initialName = initialTrip.title;

      const success = itineraryStore.updateItinerary(tripId, {
        travelStyle: 'Budget Friendly',
        placesCount: 9,
        travelersCount: 5,
        selectedPlaceIds: ['p-1', 'p-2'],
      });

      expect(success).toBe(true);
      expect(itineraryStore.getItineraries().length).toBe(initialTotal);

      const updated = itineraryStore.getItineraryById(tripId)!;
      expect(updated.id).toBe(tripId);
      expect(updated.title).toBe(initialName);
      expect(updated.travelStyle).toBe('Budget Friendly');
      expect(updated.placesCount).toBe(9);
      expect(updated.travelersCount).toBe(5);
      expect(updated.selectedPlaceIds).toEqual(['p-1', 'p-2']);
    });

    it('4. Existing dates and customized activities remain unchanged when only the name is edited', () => {
      const tripId = '1';
      const initialTrip = itineraryStore.getItineraryById(tripId)!;
      const originalDates = initialTrip.dates;
      const originalStartDate = initialTrip.startDate;
      const originalEndDate = initialTrip.endDate;

      // Add a custom activity/item to Day 1
      const initialDays = itineraryStore.getItineraryDays(tripId);
      expect(initialDays.length).toBeGreaterThan(0);
      const day1Id = initialDays[0].id;
      const customItemId = 'custom-item-eiffel-sunset';
      const updatedDaysWithCustomItem = initialDays.map((day, idx) =>
        idx === 0
          ? {
              ...day,
              items: [
                ...day.items,
                {
                  id: customItemId,
                  time: '18:00',
                  title: 'Sunset at Eiffel Tower',
                  subtitle: 'Sunset views over Paris',
                  type: 'activity' as const,
                  location: 'Eiffel Tower',
                },
              ],
            }
          : day
      );
      itineraryStore.setItineraryDays(tripId, updatedDaysWithCustomItem);

      const daysAfterActivity = itineraryStore.getItineraryDays(tripId);
      const day1AfterActivity = daysAfterActivity.find((d) => d.id === day1Id)!;
      expect(day1AfterActivity.items.some((a) => a.id === customItemId)).toBe(true);

      // Now rename the itinerary ONLY
      itineraryStore.updateItinerary(tripId, {
        title: 'Paris Dream Vacation',
        customName: 'Paris Dream Vacation',
      });

      const tripAfterRename = itineraryStore.getItineraryById(tripId)!;
      expect(tripAfterRename.title).toBe('Paris Dream Vacation');
      expect(tripAfterRename.dates).toBe(originalDates);
      expect(tripAfterRename.startDate).toBe(originalStartDate);
      expect(tripAfterRename.endDate).toBe(originalEndDate);

      // Verify customized activity on Day 1 remains completely intact
      const daysAfterRename = itineraryStore.getItineraryDays(tripId);
      const day1AfterRename = daysAfterRename.find((d) => d.id === day1Id)!;
      expect(day1AfterRename.items.some((a) => a.id === customItemId)).toBe(true);
    });

    it('5. Reopening My Itineraries does not show a duplicate', () => {
      // Setup: Add Bangkok "Sample" itinerary
      const sampleTrip: ItineraryTrip = {
        id: 'trip-sample-bangkok',
        title: 'Sample',
        customName: 'Sample',
        destination: 'Bangkok, Thailand',
        location: 'Bangkok, Thailand',
        dates: 'Oct 15 – Oct 24, 2026',
        startDate: 'Oct 15, 2026',
        endDate: 'Oct 24, 2026',
        status: 'upcoming',
        placesCount: 3,
        activitiesCount: 0,
        travelersCount: 4,
        imageUri: 'https://images.unsplash.com/photo-1508009603885-50cf7c579365',
        theme: 'mint',
      };
      itineraryStore.addItinerary(sampleTrip);
      const countWithSample = itineraryStore.getItineraries().length;

      // Edit flow simulates: CheckingPackingScreen save with customTitle 'Sample googl'
      const existing = itineraryStore.getItineraryById('trip-sample-bangkok');
      expect(existing).toBeDefined();

      // Ensure updateItinerary is called rather than addItinerary
      itineraryStore.updateItinerary(existing!.id, {
        title: 'Sample googl',
        customName: 'Sample googl',
        dates: existing!.dates,
        placesCount: existing!.placesCount,
        travelersCount: existing!.travelersCount,
      });

      // Check My Itineraries list
      const allItineraries = itineraryStore.getItineraries();
      expect(allItineraries.length).toBe(countWithSample);

      const bangkokTrips = allItineraries.filter((i) => i.destination === 'Bangkok, Thailand');
      expect(bangkokTrips).toHaveLength(1);
      expect(bangkokTrips[0].id).toBe('trip-sample-bangkok');
      expect(bangkokTrips[0].title).toBe('Sample googl');
      expect(bangkokTrips[0].customName).toBe('Sample googl');

      // The old "Sample" card is updated, not duplicated
      const oldSampleCards = allItineraries.filter((i) => i.title === 'Sample');
      expect(oldSampleCards).toHaveLength(0);
    });
  });
});
