import {
  formatDateRange,
  formatDestinationLocation,
  extractCityName,
  generateDefaultItineraryTitle,
  calculateTravelerCount,
  getDestinationImage,
} from './itineraryFormatting';

describe('itineraryFormatting utilities', () => {
  describe('formatDateRange', () => {
    it('formats DD/MM/YYYY date ranges correctly in same month & year', () => {
      expect(formatDateRange('5/08/2027', '7/08/2027')).toBe('Aug 5 – Aug 7, 2027');
      expect(formatDateRange('05/08/2027', '07/08/2027')).toBe('Aug 5 – Aug 7, 2027');
      expect(formatDateRange('12/09/2026', '17/09/2026')).toBe('Sep 12 – Sep 17, 2026');
      expect(formatDateRange('5/10/2026', '8/10/2026')).toBe('Oct 5 – Oct 8, 2026');
    });

    it('formats ISO dates correctly', () => {
      expect(formatDateRange('2027-08-05', '2027-08-07')).toBe('Aug 5 – Aug 7, 2027');
      expect(formatDateRange('2026-09-12', '2026-09-17')).toBe('Sep 12 – Sep 17, 2026');
    });

    it('formats cross-month dates in same year', () => {
      expect(formatDateRange('28/09/2026', '04/10/2026')).toBe('Sep 28 – Oct 4, 2026');
    });

    it('formats cross-year dates', () => {
      expect(formatDateRange('28/12/2026', '03/01/2027')).toBe('Dec 28, 2026 – Jan 3, 2027');
    });

    it('handles already formatted or partial text gracefully', () => {
      expect(formatDateRange('Upcoming', '')).toBe('Upcoming');
      expect(formatDateRange(undefined, undefined)).toBe('Dates TBD');
      expect(formatDateRange('5/08/2027 – 7/08/2027')).toBe('Aug 5 – Aug 7, 2027');
      expect(formatDateRange('Sep 12 – Sep 17, 2026')).toBe('Sep 12 – Sep 17, 2026');
    });
  });

  describe('formatDestinationLocation', () => {
    it('normalizes known cities to City, Country format', () => {
      expect(formatDestinationLocation('Bangalore')).toBe('Bangalore, India');
      expect(formatDestinationLocation('bengaluru')).toBe('Bangalore, India');
      expect(formatDestinationLocation('Paris')).toBe('Paris, France');
      expect(formatDestinationLocation('Tokyo')).toBe('Tokyo, Japan');
      expect(formatDestinationLocation('Kerala')).toBe('Kerala, India');
      expect(formatDestinationLocation('Rome')).toBe('Rome, Italy');
    });

    it('preserves existing City, Country format without duplicating', () => {
      expect(formatDestinationLocation('Bangalore, India')).toBe('Bangalore, India');
      expect(formatDestinationLocation('Paris, France')).toBe('Paris, France');
      expect(formatDestinationLocation('Tokyo, Japan')).toBe('Tokyo, Japan');
      expect(formatDestinationLocation('Bangalore, Karnataka, India')).toBe('Bangalore, India');
    });

    it('safely handles unknown locations without guessing country', () => {
      expect(formatDestinationLocation('Atlantis')).toBe('Atlantis');
      expect(formatDestinationLocation('CustomCity, CustomCountry')).toBe('CustomCity, CustomCountry');
      expect(formatDestinationLocation('')).toBe('');
    });
  });

  describe('extractCityName', () => {
    it('extracts city name correctly', () => {
      expect(extractCityName('Bangalore, India')).toBe('Bangalore');
      expect(extractCityName('Paris, France')).toBe('Paris');
      expect(extractCityName('Tokyo')).toBe('Tokyo');
      expect(extractCityName('')).toBe('');
    });
  });

  describe('generateDefaultItineraryTitle', () => {
    it('uses custom itinerary name when provided', () => {
      expect(
        generateDefaultItineraryTitle('Bangalore, India', 'Bangalore Weekend Getaway')
      ).toBe('Bangalore Weekend Getaway');
      expect(
        generateDefaultItineraryTitle('Paris, France', 'Romantic French Holiday')
      ).toBe('Romantic French Holiday');
    });

    it('generates sensible default when custom name is omitted (not hardcoded Adventure)', () => {
      expect(generateDefaultItineraryTitle('Bangalore, India')).toBe('Bangalore Trip');
      expect(generateDefaultItineraryTitle('Paris, France')).toBe('Paris Trip');
      expect(generateDefaultItineraryTitle('Tokyo')).toBe('Tokyo Trip');
      expect(generateDefaultItineraryTitle('')).toBe('My Trip');
    });

    it('trims whitespace and enforces maximum length', () => {
      expect(
        generateDefaultItineraryTitle('Bangalore', '   Custom Name   ')
      ).toBe('Custom Name');
      const longName = 'A'.repeat(80);
      expect(
        generateDefaultItineraryTitle('Bangalore', longName).length
      ).toBe(60);
    });
  });

  describe('calculateTravelerCount', () => {
    it('calculates traveler counts accurately across traveler types', () => {
      expect(calculateTravelerCount('solo', 1, 0)).toBe(1);
      expect(calculateTravelerCount('solo', 4, 2)).toBe(1); // Solo is always 1
      expect(calculateTravelerCount('couple', 2, 0)).toBe(2);
      expect(calculateTravelerCount('family', 2, 2)).toBe(4);
      expect(calculateTravelerCount('group', 5, 0)).toBe(5);
    });
  });

  describe('getDestinationImage', () => {
    it('returns Bangalore specific image for Bangalore/Bengaluru', () => {
      const bangaloreImg = getDestinationImage('Bangalore, India');
      expect(bangaloreImg).toContain('photo-1596176530529');
    });

    it('returns Paris image for Paris', () => {
      const parisImg = getDestinationImage('Paris, France');
      expect(parisImg).toContain('photo-1502602898657');
    });

    it('returns fallback image for unspecified destination', () => {
      const fallback = getDestinationImage('Some Unknown Place');
      expect(fallback).toBeDefined();
    });
  });
});
