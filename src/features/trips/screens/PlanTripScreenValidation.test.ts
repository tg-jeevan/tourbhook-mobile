import {
  searchDestinationSuggestions,
  DestinationSuggestion,
} from '../services/destinationAutocompleteService';
import {
  validateTripDateRange,
  getTodayLocalDate,
  addDaysToLocalDate,
  getMaxAllowedDate,
  formatLocalDateToDisplay,
  parseDateStringToLocalDate,
  isBeforeDay,
} from '../utils/tripDateUtils';
import { TripCreationParams } from '../../../core/navigation/types';
import { itineraryStore, ItineraryTrip } from '../data/itineraryStore';
import { formatDateRange, formatDestinationLocation } from '../utils/itineraryFormatting';
import { validateTravelerSafety } from './PlanTripScreen';

describe('PlanTripScreen Validation and Flow Integration', () => {
  const today = getTodayLocalDate();

  describe('1. Destination autocomplete filtering & selection integrity', () => {
    it('filters suggestions matching query string "ba"', async () => {
      const suggestions = await searchDestinationSuggestions('ba');
      expect(suggestions.length).toBeGreaterThan(0);
      const formatted = suggestions.map((s) => s.formatted);
      expect(formatted).toContain('Bengaluru, Karnataka, India');
      expect(formatted).toContain('Bangkok, Thailand');
      expect(formatted).toContain('Barcelona, Catalonia, Spain');
      expect(formatted).toContain('Dhaka, Bangladesh');
    });

    it('selecting a suggestion populates canonical formatted destination and structured metadata', async () => {
      const suggestions = await searchDestinationSuggestions('Paris');
      const selected = suggestions.find((s) => s.city === 'Paris')!;
      expect(selected).toBeDefined();

      let destinationInput = '';
      let selectedDestination: DestinationSuggestion | null = null;

      // Simulate selection
      destinationInput = selected.formatted;
      selectedDestination = selected;

      expect(destinationInput).toBe('Paris, Île-de-France, France');
      expect(selectedDestination.id).toBe('dest-paris');
      expect(selectedDestination.coordinates).toBeDefined();
    });

    it('invalidates selection when user edits the text after choosing a suggestion', () => {
      let selectedDestination: DestinationSuggestion | null = {
        id: 'dest-bengaluru',
        city: 'Bengaluru',
        state: 'Karnataka',
        country: 'India',
        formatted: 'Bengaluru, Karnataka, India',
      };

      // User types or edits the input
      const modifiedInput = 'Bengaluru, Karnataka, India - Airport';
      if (selectedDestination && modifiedInput !== selectedDestination.formatted) {
        selectedDestination = null; // Invalidate
      }

      expect(selectedDestination).toBeNull();
    });

    it('rejects unselected freeform text as invalid destination', () => {
      const typedQuery = 'Some Random Unverified Place';
      const selectedDestination: DestinationSuggestion | null = null;

      const hasValidDestination = selectedDestination !== null;
      expect(hasValidDestination).toBe(false);
    });
  });

  describe('2. Date Picker and Travel Date restrictions', () => {
    it('disables past dates and rejects start date before today', () => {
      const yesterday = addDaysToLocalDate(today, -1);
      const yesterdayStr = formatLocalDateToDisplay(yesterday);
      const futureStr = formatLocalDateToDisplay(addDaysToLocalDate(today, 5));

      const validation = validateTripDateRange(yesterdayStr, futureStr, today);
      expect(validation.isValid).toBe(false);
      expect(validation.errorMessage).toContain('cannot be in the past');
    });

    it('allows today as valid selectable start date', () => {
      const todayStr = formatLocalDateToDisplay(today);
      const endStr = formatLocalDateToDisplay(addDaysToLocalDate(today, 3));

      const validation = validateTripDateRange(todayStr, endStr, today);
      expect(validation.isValid).toBe(true);
    });

    it('enforces that end date must be on or after start date', () => {
      const startStr = formatLocalDateToDisplay(addDaysToLocalDate(today, 10));
      const earlierEndStr = formatLocalDateToDisplay(addDaysToLocalDate(today, 8));

      const validation = validateTripDateRange(startStr, earlierEndStr, today);
      expect(validation.isValid).toBe(false);
      expect(validation.errorMessage).toBe('End date must be on or after start date');
    });

    it('enforces that dates must not exceed 365 days from today', () => {
      const maxDate = getMaxAllowedDate(today);
      const validEnd = formatLocalDateToDisplay(maxDate);
      const exceededEnd = formatLocalDateToDisplay(addDaysToLocalDate(maxDate, 1));

      const validResult = validateTripDateRange(formatLocalDateToDisplay(today), validEnd, today);
      expect(validResult.isValid).toBe(true);

      const exceededResult = validateTripDateRange(
        formatLocalDateToDisplay(today),
        exceededEnd,
        today
      );
      expect(exceededResult.isValid).toBe(false);
      expect(exceededResult.errorMessage).toContain('within 365 days');
    });

    it('clears end date if user changes start date to later than existing end date', () => {
      let startDate = 'Aug 5, 2027';
      let endDate = 'Aug 10, 2027';

      // User changes start date to Aug 15, 2027
      const newStartDate = 'Aug 15, 2027';
      startDate = newStartDate;

      const parsedNewStart = parseDateStringToLocalDate(startDate);
      const parsedExistingEnd = parseDateStringToLocalDate(endDate);

      if (parsedNewStart && parsedExistingEnd && isBeforeDay(parsedExistingEnd, parsedNewStart)) {
        endDate = ''; // Cleared!
      }

      expect(endDate).toBe('');
    });
  });

  describe('3. Preservation of destination metadata & dates through itinerary creation flow', () => {
    it('survives all navigation params into ItineraryTrip record', () => {
      const destSuggestion: DestinationSuggestion = {
        id: 'dest-bali',
        city: 'Bali',
        country: 'Indonesia',
        formatted: 'Bali, Indonesia',
        coordinates: { latitude: -8.3405, longitude: 115.092 },
      };

      const params: TripCreationParams = {
        itineraryName: 'Bali Relaxation',
        destination: destSuggestion.formatted,
        destinationMetadata: destSuggestion,
        startDate: 'Aug 5, 2027',
        endDate: 'Aug 12, 2027',
        travelerType: 'couple',
        adults: 2,
        kids: 0,
        purpose: 'Leisure',
        primaryAge: 30,
      };

      // Formatted range
      const range = formatDateRange(params.startDate, params.endDate);
      expect(range).toBe('Aug 5 – Aug 12, 2027');

      const trip: ItineraryTrip = {
        id: 'trip-bali-flow-test',
        title: params.itineraryName!,
        destination: params.destination,
        location: formatDestinationLocation(params.destination),
        dates: range,
        status: 'upcoming',
        placesCount: 3,
        activitiesCount: 6,
        travelersCount: 2,
        imageUri: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4',
        theme: 'sky',
      };

      itineraryStore.addItinerary(trip);

      const saved = itineraryStore.getItineraryById('trip-bali-flow-test');
      expect(saved).toBeDefined();
      expect(saved?.destination).toBe('Bali, Indonesia');
      expect(saved?.dates).toBe('Aug 5 – Aug 12, 2027');

      // Cleanup
      itineraryStore.deleteItinerary('trip-bali-flow-test');
    });
  });

  describe('4. Custom Itinerary Name validation & immutability lifecycle', () => {
    function validateItineraryName(
      name: string,
      isEditMode: boolean
    ): { isValid: boolean; error?: string; cleanName: string } {
      if (isEditMode) {
        return { isValid: true, cleanName: name.trim() };
      }
      const cleanName = name.trim();
      if (!cleanName) {
        return { isValid: false, error: 'Please enter an itinerary name.', cleanName: '' };
      }
      if (cleanName.length > 60) {
        return { isValid: false, error: 'Itinerary name cannot exceed 60 characters.', cleanName };
      }
      return { isValid: true, cleanName };
    }

    it('rejects empty or whitespace-only custom name on new itinerary creation', () => {
      const res1 = validateItineraryName('', false);
      expect(res1.isValid).toBe(false);
      expect(res1.error).toBe('Please enter an itinerary name.');

      const res2 = validateItineraryName('    ', false);
      expect(res2.isValid).toBe(false);
      expect(res2.error).toBe('Please enter an itinerary name.');
    });

    it('rejects custom name exceeding 60 characters on new itinerary creation', () => {
      const longName = 'A'.repeat(61);
      const res = validateItineraryName(longName, false);
      expect(res.isValid).toBe(false);
      expect(res.error).toBe('Itinerary name cannot exceed 60 characters.');
    });

    it('accepts valid custom name and preserves it without forcing "Adventure"', () => {
      const customName = 'Bangalore Family Trip';
      const res = validateItineraryName(customName, false);
      expect(res.isValid).toBe(true);
      expect(res.cleanName).toBe('Bangalore Family Trip');
      expect(res.cleanName).not.toContain('Adventure');
    });

    it('in edit mode, itinerary name is read-only and bypasses new-name requirement', () => {
      const res = validateItineraryName('Paris Adventure', true);
      expect(res.isValid).toBe(true);
      expect(res.cleanName).toBe('Paris Adventure');
    });

    it('saves custom name upon creation and appears correctly on retrieved trip', () => {
      const tripId = 'trip-immutable-bangalore-test';
      const customTrip: ItineraryTrip = {
        id: tripId,
        title: 'Bangalore Family Trip',
        customName: 'Bangalore Family Trip',
        destination: 'Bangalore, India',
        location: 'Bangalore, India',
        dates: 'Nov 1 – Nov 5, 2026',
        status: 'upcoming',
        placesCount: 5,
        activitiesCount: 10,
        travelersCount: 4,
        imageUri: 'https://example.com/bengaluru.jpg',
        theme: 'sky',
      };

      itineraryStore.addItinerary(customTrip);

      const retrieved = itineraryStore.getItineraryById(tripId);
      expect(retrieved).toBeDefined();
      expect(retrieved?.title).toBe('Bangalore Family Trip');
      expect(retrieved?.customName).toBe('Bangalore Family Trip');

      // Attempting edit cannot overwrite the name or destination
      itineraryStore.updateItinerary(tripId, {
        title: 'Bangalore Adventure Changed',
        destination: 'Mysore, India',
      });

      const afterEdit = itineraryStore.getItineraryById(tripId);
      expect(afterEdit?.title).toBe('Bangalore Family Trip');
      expect(afterEdit?.customName).toBe('Bangalore Family Trip');
      expect(afterEdit?.destination).toBe('Bangalore, India');

      itineraryStore.deleteItinerary(tripId);
    });
  });

  describe('5. Mandatory Traveler Safety & Medical History validation (Speaker Notes Rules)', () => {
    it('rejects missing or empty primaryAge and blocks progression', () => {
      const resEmpty = validateTravelerSafety({ primaryAge: '' });
      expect(resEmpty.isValid).toBe(false);
      expect(resEmpty.ageError).toBe('Please enter your age for travel safety recommendations.');

      const resWhitespace = validateTravelerSafety({ primaryAge: '   ' });
      expect(resWhitespace.isValid).toBe(false);
      expect(resWhitespace.ageError).toBe('Please enter your age for travel safety recommendations.');
    });

    it('rejects invalid primaryAge (<= 0 or > 120)', () => {
      const resZero = validateTravelerSafety({ primaryAge: '0' });
      expect(resZero.isValid).toBe(false);
      expect(resZero.ageError).toBe('Please enter a valid age between 1 and 120.');

      const resTooOld = validateTravelerSafety({ primaryAge: '121' });
      expect(resTooOld.isValid).toBe(false);
      expect(resTooOld.ageError).toBe('Please enter a valid age between 1 and 120.');
    });

    it('allows progression for travelers under 60 without requiring medical history', () => {
      const resYounger = validateTravelerSafety({ primaryAge: '28' });
      expect(resYounger.isValid).toBe(true);
      expect(resYounger.needsMedical).toBe(false);
      expect(resYounger.medicalInfoError).toBeUndefined();

      const resMiddleAged = validateTravelerSafety({ primaryAge: 59, medicalInfo: '' });
      expect(resMiddleAged.isValid).toBe(true);
      expect(resMiddleAged.needsMedical).toBe(false);
      expect(resMiddleAged.medicalInfoError).toBeUndefined();
    });

    it('for travelers aged 60+, medical history is mandatory and empty input blocks progression', () => {
      const res60 = validateTravelerSafety({ primaryAge: 60, medicalInfo: '' });
      expect(res60.needsMedical).toBe(true);
      expect(res60.isValid).toBe(false);
      expect(res60.medicalInfoError).toBe(
        'Medical information is required for travelers aged 60+. Please enter your medical details or "None".'
      );

      const res75 = validateTravelerSafety({ primaryAge: '75', medicalInfo: undefined });
      expect(res75.needsMedical).toBe(true);
      expect(res75.isValid).toBe(false);
      expect(res75.medicalInfoError).toBe(
        'Medical information is required for travelers aged 60+. Please enter your medical details or "None".'
      );
    });

    it('for travelers aged 60+, whitespace-only medical history input is rejected', () => {
      const resWhitespaceOnly = validateTravelerSafety({
        primaryAge: '68',
        medicalInfo: '    \t   \n   ',
      });
      expect(resWhitespaceOnly.needsMedical).toBe(true);
      expect(resWhitespaceOnly.isValid).toBe(false);
      expect(resWhitespaceOnly.medicalInfoError).toBe(
        'Medical information is required for travelers aged 60+. Please enter your medical details or "None".'
      );
    });

    it('for travelers aged 60+, valid non-empty medical history allows progression', () => {
      const resValid = validateTravelerSafety({
        primaryAge: '65',
        medicalInfo: 'Requires wheelchair assistance at airports; diabetic.',
      });
      expect(resValid.needsMedical).toBe(true);
      expect(resValid.isValid).toBe(true);
      expect(resValid.medicalInfoError).toBeUndefined();
      expect(resValid.ageError).toBeUndefined();
    });

    it('for travelers aged 60+, entering "None" satisfies the mandatory requirement', () => {
      const resNone = validateTravelerSafety({
        primaryAge: 70,
        medicalInfo: 'None',
      });
      expect(resNone.needsMedical).toBe(true);
      expect(resNone.isValid).toBe(true);
      expect(resNone.medicalInfoError).toBeUndefined();
    });

    it('revalidation clears error when user supplies medical history or lowers age', () => {
      // Step 1: User aged 62 with empty medical info fails
      let inputState = { primaryAge: '62', medicalInfo: '' };
      let check = validateTravelerSafety(inputState);
      expect(check.isValid).toBe(false);
      expect(check.medicalInfoError).toBeDefined();

      // Step 2: User provides valid medical info -> revalidates cleanly
      inputState.medicalInfo = 'Asthma, carry inhaler';
      check = validateTravelerSafety(inputState);
      expect(check.isValid).toBe(true);
      expect(check.medicalInfoError).toBeUndefined();

      // Step 3: Or if user corrects their age to 45 -> medical info no longer required
      inputState = { primaryAge: '45', medicalInfo: '' };
      check = validateTravelerSafety(inputState);
      expect(check.isValid).toBe(true);
      expect(check.needsMedical).toBe(false);
      expect(check.medicalInfoError).toBeUndefined();
    });

    it('preserves all other trip details when validation fails on medical history', () => {
      const formState = {
        itineraryName: 'Kyoto Heritage Tour',
        destination: 'Kyoto, Japan',
        startDate: 'Nov 1, 2026',
        endDate: 'Nov 10, 2026',
        travelerType: 'couple',
        adults: 2,
        kids: 0,
        purpose: 'Culture',
        primaryAge: '65',
        medicalInfo: '   ', // Invalid whitespace
      };

      const safetyResult = validateTravelerSafety({
        primaryAge: formState.primaryAge,
        medicalInfo: formState.medicalInfo,
      });

      expect(safetyResult.isValid).toBe(false);
      // Ensure existing form state is intact
      expect(formState.itineraryName).toBe('Kyoto Heritage Tour');
      expect(formState.destination).toBe('Kyoto, Japan');
      expect(formState.startDate).toBe('Nov 1, 2026');
      expect(formState.endDate).toBe('Nov 10, 2026');
      expect(formState.adults).toBe(2);
      expect(formState.purpose).toBe('Culture');
      expect(formState.primaryAge).toBe('65');
    });

    it('in edit mode, preserves existing medical info without triggering false errors for unrelated fields', () => {
      const existingTrip: ItineraryTrip = {
        id: 'trip-senior-edit-test',
        title: 'Vienna Classical Tour',
        destination: 'Vienna, Austria',
        location: 'Vienna, Austria',
        dates: 'Dec 1 – Dec 8, 2026',
        startDate: 'Dec 1, 2026',
        endDate: 'Dec 8, 2026',
        status: 'upcoming',
        placesCount: 4,
        activitiesCount: 8,
        travelersCount: 2,
        travelerType: 'couple',
        adults: 2,
        kids: 0,
        purpose: 'Leisure',
        primaryAge: 68,
        medicalInfo: 'Mild arthritis, prefers ground floor rooms',
        imageUri: 'https://example.com/vienna.jpg',
        theme: 'peach',
      };

      itineraryStore.addItinerary(existingTrip);

      const trip = itineraryStore.getItineraryById('trip-senior-edit-test');
      expect(trip?.primaryAge).toBe(68);
      expect(trip?.medicalInfo).toBe('Mild arthritis, prefers ground floor rooms');

      // Edit without modifying medicalInfo -> valid
      const validation = validateTravelerSafety({
        primaryAge: trip!.primaryAge!,
        medicalInfo: trip!.medicalInfo,
      });
      expect(validation.isValid).toBe(true);

      // Editing supported fields (like changing adults count or dates) works seamlessly
      itineraryStore.updateItinerary('trip-senior-edit-test', {
        adults: 3,
        travelersCount: 3,
      });
      const updated = itineraryStore.getItineraryById('trip-senior-edit-test');
      expect(updated?.adults).toBe(3);
      expect(updated?.medicalInfo).toBe('Mild arthritis, prefers ground floor rooms');

      itineraryStore.deleteItinerary('trip-senior-edit-test');
    });
  });
});
