import React, { useEffect, useRef, useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
} from 'react-native';
import MapView, { Marker, Polyline, PROVIDER_GOOGLE } from 'react-native-maps';
import {
  MapPin,
  Maximize2,
  Navigation,
  Compass,
  Lock,
  Unlock,
} from 'lucide-react-native';
import { AppColors } from '../../../core/theme/colors';
import { TimelineItem } from '../types/itineraryPackingTypes';
import {
  generateDayRoute,
  RouteStop,
} from '../services/itineraryRouteService';

interface ItineraryDayRouteMapProps {
  dayNumber: number;
  dayLabel: string;
  items: TimelineItem[];
  selectedStopId?: string | null;
  onSelectStop?: (stopId: string) => void;
  onExpandMap?: () => void;
}

export const ItineraryDayRouteMap: React.FC<ItineraryDayRouteMapProps> = ({
  dayNumber,
  dayLabel,
  items,
  selectedStopId,
  onSelectStop,
  onExpandMap,
}) => {
  const mapRef = useRef<MapView>(null);
  const [isInteractive, setIsInteractive] = useState(false);

  // Generate day-specific geocoded route
  const routeSummary = useMemo(() => generateDayRoute(items), [items]);
  const { stops, hasGeocodedStops, formattedDistance, attributionText } =
    routeSummary;

  // Fit map viewport to the selected day's coordinates
  useEffect(() => {
    if (mapRef.current && stops.length > 0) {
      const coordinates = stops.map((stop) => ({
        latitude: stop.latitude,
        longitude: stop.longitude,
      }));

      const timer = setTimeout(() => {
        if (coordinates.length === 1) {
          if (typeof (mapRef.current as any)?.animateToRegion === 'function') {
            (mapRef.current as any).animateToRegion({
              latitude: coordinates[0].latitude,
              longitude: coordinates[0].longitude,
              latitudeDelta: 0.04,
              longitudeDelta: 0.04,
            });
          }
        } else {
          if (typeof (mapRef.current as any)?.fitToCoordinates === 'function') {
            (mapRef.current as any).fitToCoordinates(coordinates, {
              edgePadding: { top: 40, right: 40, bottom: 40, left: 40 },
              animated: true,
            });
          }
        }
      }, 350);

      return () => clearTimeout(timer);
    }
  }, [stops, dayNumber]);

  return (
    <View style={styles.container} testID="day-route-map-section">
      {/* ── MAP HEADER ROW ────────────────────────────────────────── */}
      <View style={styles.headerRow}>
        <View style={styles.headerLeftCol}>
          <View style={styles.headerTitleRow}>
            <MapPin size={16} color={AppColors.primary} strokeWidth={2.5} />
            <Text style={styles.headerTitle}>{`${dayLabel} Route Map`}</Text>
          </View>
          <Text style={styles.headerSubtitle}>
            {hasGeocodedStops
              ? `${stops.length} planned ${
                  stops.length === 1 ? 'stop' : 'stops'
                }${formattedDistance ? ` · ${formattedDistance}` : ''}`
              : 'No mapped locations'}
          </Text>
        </View>

        {onExpandMap && (
          <TouchableOpacity
            style={styles.expandBtn}
            onPress={onExpandMap}
            activeOpacity={0.8}
            accessibilityRole="button"
            accessibilityLabel="Open Full Map"
            testID="expand-full-map-btn"
          >
            <Maximize2 size={13} color={AppColors.primary} strokeWidth={2.5} />
            <Text style={styles.expandBtnText}>Full Map</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* ── MAP CONTAINER OR EMPTY FALLBACK ───────────────────────── */}
      {!hasGeocodedStops ? (
        <View style={styles.emptyMapCard} testID="empty-route-map-state">
          <View style={styles.emptyIconCircle}>
            <Compass size={24} color={AppColors.primary} strokeWidth={2} />
          </View>
          <Text style={styles.emptyMapTitle}>{`No geocoded stops for ${dayLabel}`}</Text>
          <Text style={styles.emptyMapSubtitle}>
            Activities planned for this day don’t have location coordinates yet.
          </Text>
        </View>
      ) : (
        <View style={styles.mapCardWrap}>
          <MapView
            ref={mapRef}
            style={styles.map}
            provider={PROVIDER_GOOGLE}
            scrollEnabled={isInteractive}
            zoomEnabled={true}
            rotateEnabled={false}
            pitchEnabled={false}
            initialRegion={{
              latitude: stops[0].latitude,
              longitude: stops[0].longitude,
              latitudeDelta: 0.08,
              longitudeDelta: 0.08,
            }}
            testID="itinerary-day-mapview"
          >
            {/* Numbered Sequence Markers */}
            {stops.map((stop: RouteStop) => {
              const isSelected = selectedStopId === stop.id;
              return (
                <Marker
                  key={stop.id}
                  coordinate={{
                    latitude: stop.latitude,
                    longitude: stop.longitude,
                  }}
                  onPress={() => onSelectStop && onSelectStop(stop.id)}
                  title={`${stop.sequence}. ${stop.name}`}
                  description={stop.time}
                  testID={`map-marker-${stop.id}`}
                >
                  <View
                    style={[
                      styles.numberedMarker,
                      isSelected && styles.numberedMarkerSelected,
                    ]}
                  >
                    <Text
                      style={[
                        styles.markerNumberText,
                        isSelected && styles.markerNumberTextSelected,
                      ]}
                    >
                      {stop.sequence}
                    </Text>
                  </View>
                </Marker>
              );
            })}

            {/* Connecting Route Polyline */}
            {stops.length > 1 && (
              <Polyline
                coordinates={stops.map((s) => ({
                  latitude: s.latitude,
                  longitude: s.longitude,
                }))}
                strokeColor={AppColors.primary}
                strokeWidth={3.5}
                lineDashPattern={[6, 4]}
              />
            )}
          </MapView>

          {/* Interactive Lock/Unlock Toggle */}
          <TouchableOpacity
            style={styles.interactionToggleBtn}
            onPress={() => setIsInteractive((prev) => !prev)}
            activeOpacity={0.85}
            accessibilityRole="button"
            accessibilityLabel={
              isInteractive ? 'Lock map to scroll page' : 'Enable map gestures'
            }
          >
            {isInteractive ? (
              <>
                <Unlock size={11} color={AppColors.white} />
                <Text style={styles.interactionToggleText}>Interactive</Text>
              </>
            ) : (
              <>
                <Lock size={11} color={AppColors.textSecondary} />
                <Text style={[styles.interactionToggleText, { color: AppColors.textSecondary }]}>
                  Scroll Mode
                </Text>
              </>
            )}
          </TouchableOpacity>

          {/* Planned Sequence Footer Badge */}
          <View style={styles.mapAttributionPill} pointerEvents="none">
            <Navigation size={11} color={AppColors.primary} />
            <Text style={styles.mapAttributionText} numberOfLines={1}>
              {attributionText}
            </Text>
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 4,
    marginBottom: 16,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  headerLeftCol: {
    flex: 1,
    paddingRight: 8,
  },
  headerTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: AppColors.textPrimary,
    letterSpacing: -0.2,
  },
  headerSubtitle: {
    fontSize: 12,
    color: AppColors.textMuted,
    fontWeight: '600',
    marginTop: 2,
  },
  expandBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: '#E0F2FE',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#BAE6FD',
  },
  expandBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: AppColors.primary,
  },

  /* Map View Card */
  mapCardWrap: {
    height: 195,
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#EAE5DC',
    backgroundColor: '#F8FAFC',
    position: 'relative',
    shadowColor: AppColors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  map: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },

  /* Numbered Markers */
  numberedMarker: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: AppColors.primary,
    borderWidth: 2,
    borderColor: AppColors.white,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: AppColors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3,
    elevation: 4,
  },
  numberedMarkerSelected: {
    backgroundColor: AppColors.accent,
    transform: [{ scale: 1.25 }],
    borderColor: AppColors.white,
    shadowColor: AppColors.accent,
    shadowOpacity: 0.4,
    elevation: 6,
  },
  markerNumberText: {
    fontSize: 12,
    fontWeight: '800',
    color: AppColors.white,
  },
  markerNumberTextSelected: {
    color: AppColors.white,
  },

  /* Interactive Toggle Button */
  interactionToggleBtn: {
    position: 'absolute',
    top: 10,
    right: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(16, 36, 63, 0.85)',
    paddingHorizontal: 9,
    paddingVertical: 5,
    borderRadius: 12,
    shadowColor: AppColors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 3,
  },
  interactionToggleText: {
    fontSize: 10,
    fontWeight: '700',
    color: AppColors.white,
  },

  /* Attribution Footer Pill */
  mapAttributionPill: {
    position: 'absolute',
    bottom: 8,
    left: 8,
    right: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: 'rgba(255, 255, 255, 0.92)',
    paddingHorizontal: 10,
    paddingVertical: 4.5,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  mapAttributionText: {
    fontSize: 10,
    fontWeight: '600',
    color: AppColors.textSecondary,
    flex: 1,
  },

  /* Empty State */
  emptyMapCard: {
    height: 120,
    borderRadius: 18,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: '#CBD5E1',
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  emptyIconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F0F9FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 6,
  },
  emptyMapTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: AppColors.textPrimary,
  },
  emptyMapSubtitle: {
    fontSize: 11,
    color: AppColors.textMuted,
    textAlign: 'center',
    marginTop: 2,
  },
});
