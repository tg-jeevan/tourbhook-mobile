import {
  calculateHaversineDistanceKm,
  generateDayRoute,
} from './itineraryRouteService';
import { TimelineItem } from '../types/itineraryPackingTypes';

describe('itineraryRouteService', () => {
  describe('calculateHaversineDistanceKm', () => {
    test('calculates accurate distance between known coordinates', () => {
      // Ubud Sacred Monkey Forest (-8.5188, 115.2584) to Ubud Palace (-8.5069, 115.2625)
      const dist = calculateHaversineDistanceKm(
        -8.5188,
        115.2584,
        -8.5069,
        115.2625
      );
      // Distance is ~1.4 km
      expect(dist).toBeGreaterThan(1.2);
      expect(dist).toBeLessThan(1.6);
    });

    test('returns 0 for identical points', () => {
      const dist = calculateHaversineDistanceKm(-8.5, 115.2, -8.5, 115.2);
      expect(dist).toBe(0);
    });
  });

  describe('generateDayRoute', () => {
    const mockItems: TimelineItem[] = [
      {
        id: 'act-1',
        type: 'activity',
        time: '09:00 AM',
        title: 'Stop 1',
        subtitle: 'First destination',
        category: 'sightseeing',
        latitude: -8.5188,
        longitude: 115.2584,
      },
      {
        id: 'break-1',
        type: 'break',
        time: '11:30 AM',
        title: 'Rest & Coffee',
        subtitle: '30 min break',
      },
      {
        id: 'act-2',
        type: 'activity',
        time: '12:30 PM',
        title: 'Stop 2 (No coordinates)',
        subtitle: 'Second destination',
        category: 'food',
      },
      {
        id: 'act-3',
        type: 'activity',
        time: '02:30 PM',
        title: 'Stop 3',
        subtitle: 'Third destination',
        category: 'sightseeing',
        latitude: -8.5069,
        longitude: 115.2625,
      },
    ];

    test('filters out breaks and non-geocoded items, maintaining chronological sequence', () => {
      const route = generateDayRoute(mockItems);

      expect(route.totalStops).toBe(2);
      expect(route.stops.length).toBe(2);
      expect(route.hasGeocodedStops).toBe(true);

      // Verify sequence numbering
      expect(route.stops[0].sequence).toBe(1);
      expect(route.stops[0].id).toBe('act-1');
      expect(route.stops[0].name).toBe('Stop 1');

      expect(route.stops[1].sequence).toBe(2);
      expect(route.stops[1].id).toBe('act-3');
      expect(route.stops[1].name).toBe('Stop 3');

      // Verify distance is computed
      expect(route.approximateDistanceKm).toBeGreaterThan(0);
      expect(route.formattedDistance).toBeDefined();
      expect(route.routeType).toBe('planned_sequence');
      expect(route.attributionText).toContain('Planned route sequence');
    });

    test('handles empty item lists gracefully', () => {
      const route = generateDayRoute([]);

      expect(route.totalStops).toBe(0);
      expect(route.stops).toEqual([]);
      expect(route.hasGeocodedStops).toBe(false);
      expect(route.approximateDistanceKm).toBeUndefined();
      expect(route.formattedDistance).toBeUndefined();
    });

    test('handles lists with no geocoded items gracefully', () => {
      const nonGeocoded: TimelineItem[] = [
        {
          id: 'act-no-geo',
          type: 'activity',
          time: '10:00 AM',
          title: 'Cooking Class',
          subtitle: 'Indoor session',
        },
      ];

      const route = generateDayRoute(nonGeocoded);
      expect(route.totalStops).toBe(0);
      expect(route.stops).toEqual([]);
      expect(route.hasGeocodedStops).toBe(false);
      expect(route.approximateDistanceKm).toBeUndefined();
    });
  });
});
