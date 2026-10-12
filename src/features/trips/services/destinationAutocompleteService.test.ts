import {
  searchDestinationSuggestions,
  formatCanonicalDestination,
  CURATED_DESTINATIONS,
} from './destinationAutocompleteService';

describe('destinationAutocompleteService', () => {
  describe('formatCanonicalDestination', () => {
    it('formats with state/region when state is present', () => {
      expect(formatCanonicalDestination('Bengaluru', 'Karnataka', 'India')).toBe(
        'Bengaluru, Karnataka, India'
      );
      expect(formatCanonicalDestination('Paris', 'Île-de-France', 'France')).toBe(
        'Paris, Île-de-France, France'
      );
      expect(formatCanonicalDestination('Hyderabad', 'Telangana', 'India')).toBe(
        'Hyderabad, Telangana, India'
      );
    });

    it('formats as City, Country when state is undefined or empty', () => {
      expect(formatCanonicalDestination('Bangkok', undefined, 'Thailand')).toBe(
        'Bangkok, Thailand'
      );
      expect(formatCanonicalDestination('Tokyo', '', 'Japan')).toBe('Tokyo, Japan');
      expect(formatCanonicalDestination('Santorini', undefined, 'Greece')).toBe(
        'Santorini, Greece'
      );
    });

    it('avoids repeating city name when city and country are identical', () => {
      expect(formatCanonicalDestination('Singapore', undefined, 'Singapore')).toBe(
        'Singapore'
      );
    });
  });

  describe('searchDestinationSuggestions', () => {
    it('returns empty array when query is empty or whitespace', async () => {
      expect(await searchDestinationSuggestions('')).toEqual([]);
      expect(await searchDestinationSuggestions('   ')).toEqual([]);
    });

    it('filters suggestions for query "ba" matching Bengaluru, Bangkok, Barcelona, and Dhaka', async () => {
      const results = await searchDestinationSuggestions('ba');
      expect(results.length).toBeGreaterThan(0);

      const cities = results.map((r) => r.city);
      expect(cities).toContain('Bengaluru');
      expect(cities).toContain('Bangkok');
      expect(cities).toContain('Barcelona');
      expect(cities).toContain('Dhaka'); // Dhaka in Bangladesh (contains "ba")
    });

    it('filters suggestions for Indian travel hubs', async () => {
      const results = await searchDestinationSuggestions('hyd');
      expect(results.length).toBeGreaterThan(0);
      expect(results[0].city).toBe('Hyderabad');
      expect(results[0].formatted).toBe('Hyderabad, Telangana, India');
      expect(results[0].coordinates).toEqual({ latitude: 17.385, longitude: 78.4867 });
    });

    it('handles alias matching (e.g. "bangalore" matches "Bengaluru")', async () => {
      const results = await searchDestinationSuggestions('bangalore');
      expect(results.length).toBeGreaterThan(0);
      expect(results[0].city).toBe('Bengaluru');
      expect(results[0].formatted).toBe('Bengaluru, Karnataka, India');
    });

    it('preserves structured destination metadata including ID and coordinates', async () => {
      const results = await searchDestinationSuggestions('Paris');
      expect(results.length).toBeGreaterThan(0);
      const paris = results.find((r) => r.city === 'Paris');
      expect(paris).toBeDefined();
      expect(paris?.id).toBe('dest-paris');
      expect(paris?.formatted).toBe('Paris, Île-de-France, France');
      expect(paris?.coordinates?.latitude).toBeCloseTo(48.8566);
      expect(paris?.coordinates?.longitude).toBeCloseTo(2.3522);
    });

    it('prioritizes prefix matches over contains matches', async () => {
      const results = await searchDestinationSuggestions('ro');
      expect(results.length).toBeGreaterThan(0);
      expect(results[0].city).toBe('Rome');
    });
  });
});
