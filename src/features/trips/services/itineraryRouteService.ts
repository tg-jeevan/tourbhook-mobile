import { TimelineItem } from '../types/itineraryPackingTypes';

export interface RouteStop {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  sequence: number;
  time: string;
  duration?: string;
  category?: string;
  imageUri?: string;
  location?: string;
}

export interface DayRouteSummary {
  stops: RouteStop[];
  totalStops: number;
  hasGeocodedStops: boolean;
  approximateDistanceKm?: number;
  formattedDistance?: string;
  routeType: 'planned_sequence';
  attributionText: string;
}

/**
 * Calculates straight-line distance between two coordinates using the Haversine formula.
 */
export function calculateHaversineDistanceKm(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number,
): number {
  const R = 6371; // Earth radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

/**
 * Generates an ordered route summary from an itinerary day's activity items.
 * Preserves the planned sequence order.
 * Note: Road navigation/directions and optimization require backend/Google Directions API integration;
 * straight-line connections are provided as the planned itinerary sequence.
 */
export function generateDayRoute(items: TimelineItem[]): DayRouteSummary {
  const stops: RouteStop[] = [];
  let sequence = 1;

  items.forEach((item) => {
    if (
      item.type === 'activity' &&
      typeof item.latitude === 'number' &&
      typeof item.longitude === 'number' &&
      !isNaN(item.latitude) &&
      !isNaN(item.longitude)
    ) {
      stops.push({
        id: item.id,
        name: item.title,
        latitude: item.latitude,
        longitude: item.longitude,
        sequence: sequence++,
        time: item.time,
        duration: item.duration,
        category: item.category,
        imageUri: item.imageUri,
        location: item.location,
      });
    }
  });

  let totalDistanceKm = 0;
  for (let i = 0; i < stops.length - 1; i++) {
    totalDistanceKm += calculateHaversineDistanceKm(
      stops[i].latitude,
      stops[i].longitude,
      stops[i + 1].latitude,
      stops[i + 1].longitude,
    );
  }

  const hasDistance = stops.length > 1;

  return {
    stops,
    totalStops: stops.length,
    hasGeocodedStops: stops.length > 0,
    approximateDistanceKm: hasDistance
      ? Math.round(totalDistanceKm * 10) / 10
      : undefined,
    formattedDistance: hasDistance
      ? `~${Math.round(totalDistanceKm)} km`
      : undefined,
    routeType: 'planned_sequence',
    attributionText:
      'Planned route sequence · Straight-line connection between planned stops',
  };
}
