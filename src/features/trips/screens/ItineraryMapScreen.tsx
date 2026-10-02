import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import MapView, { Marker, Polyline } from 'react-native-maps';
import { useNavigation } from '@react-navigation/native';
import { BackButton } from '../../../core/components/BackButton';
import { AppColors } from '../../../core/theme/colors';

interface RouteStop {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  sequence: number;
  time: string;
  duration: string;
  icon: string;
}

const mockRouteStops: RouteStop[] = [
  {
    id: '1',
    name: 'Eiffel Tower',
    latitude: 48.8584,
    longitude: 2.2945,
    sequence: 1,
    time: '09:00 AM',
    duration: '2 Hours',
    icon: 'explore',
  },
  {
    id: '2',
    name: 'Louvre Museum',
    latitude: 48.8606,
    longitude: 2.3376,
    sequence: 2,
    time: '11:30 AM',
    duration: '3 Hours',
    icon: 'explore',
  },
  {
    id: '3',
    name: 'Montmartre',
    latitude: 48.8867,
    longitude: 2.3431,
    sequence: 3,
    time: '03:00 PM',
    duration: '1.5 Hours',
    icon: 'explore',
  },
  {
    id: '4',
    name: 'Arc de Triomphe',
    latitude: 48.8738,
    longitude: 2.2950,
    sequence: 4,
    time: '05:30 PM',
    duration: '1 Hour',
    icon: 'explore',
  },
];

export default function ItineraryMapScreen() {
  const navigation = useNavigation<any>();
  const mapRef = useRef<MapView>(null);
  const [selectedDay, setSelectedDay] = useState(1);
  const [selectedStopId, setSelectedStopId] = useState<string | null>(null);

  const getOrderedRouteStops = (stops: RouteStop[]): RouteStop[] => {
    return [...stops].sort((a, b) => a.sequence - b.sequence);
  };

  const orderedStops = getOrderedRouteStops(mockRouteStops);

  useEffect(() => {
    if (mapRef.current && orderedStops.length > 0) {
      const coordinates = orderedStops.map((stop) => ({
        latitude: stop.latitude,
        longitude: stop.longitude,
      }));

      const timer = setTimeout(() => {
        mapRef.current?.fitToCoordinates(coordinates, {
          edgePadding: { top: 60, right: 60, bottom: 60, left: 60 },
          animated: true,
        });
      }, 500);

      return () => clearTimeout(timer);
    }
  }, [selectedDay]);

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <View style={styles.header}>
        <BackButton onPress={() => navigation.goBack()} />
        <View style={styles.headerTextContainer}>
          <Text style={styles.headerTitle}>Itinerary for Paris</Text>
          <Text style={styles.headerSubtitle}>Sept 12 - Sept 17  (2 Adults)</Text>
        </View>
      </View>

      <View style={styles.tabsContainer}>
        {[1, 2, 3].map((day) => {
          const isSelected = selectedDay === day;
          return (
            <TouchableOpacity
              key={day}
              style={[styles.tab, isSelected && styles.tabSelected]}
              onPress={() => setSelectedDay(day)}
            >
              <Text style={[styles.tabText, isSelected && styles.tabTextSelected]}>
                Day {day}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <View style={styles.mapContainer}>
        {orderedStops.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No stops available to display</Text>
          </View>
        ) : (
          <MapView
            ref={mapRef}
            style={styles.map}
            initialRegion={{
              latitude: orderedStops[0].latitude,
              longitude: orderedStops[0].longitude,
              latitudeDelta: 0.05,
              longitudeDelta: 0.05,
            }}
          >
            {orderedStops.map((stop) => {
              const isSelected = selectedStopId === stop.id;
              return (
                <Marker
                  key={stop.id}
                  coordinate={{
                    latitude: stop.latitude,
                    longitude: stop.longitude,
                  }}
                  onPress={() => setSelectedStopId(stop.id)}
                  title={stop.name}
                  description={stop.duration}
                >
                  <View
                    style={[
                      styles.customMarker,
                      isSelected && styles.customMarkerSelected,
                    ]}
                  >
                    <Text style={styles.customMarkerText}>{stop.sequence}</Text>
                  </View>
                </Marker>
              );
            })}

            <Polyline
              coordinates={orderedStops.map((stop) => ({
                latitude: stop.latitude,
                longitude: stop.longitude,
              }))}
              strokeColor={AppColors.primary}
              strokeWidth={4}
            />
          </MapView>
        )}
      </View>

      <ScrollView contentContainerStyle={styles.timelineList}>
        {orderedStops.map((stop, index) => {
          const isLast = index === orderedStops.length - 1;
          const isSelected = selectedStopId === stop.id;

          return (
            <TouchableOpacity
              key={stop.id}
              style={[styles.timelineRow, isSelected && styles.timelineRowSelected]}
              onPress={() => setSelectedStopId(stop.id)}
              activeOpacity={0.8}
            >
              <View style={styles.sequenceCol}>
                <View
                  style={[
                    styles.sequenceBadge,
                    isSelected && styles.sequenceBadgeSelected,
                  ]}
                >
                  <Text
                    style={[
                      styles.sequenceBadgeText,
                      isSelected && styles.sequenceBadgeTextSelected,
                    ]}
                  >
                    {stop.sequence}
                  </Text>
                </View>
                {!isLast && <View style={styles.timelineLine} />}
              </View>

              <View style={styles.infoCol}>
                <Text style={styles.timeText}>{stop.time}</Text>
                <Text style={styles.nameText}>{stop.name}</Text>
                <Text style={styles.durationText}>{stop.duration}</Text>
              </View>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: AppColors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 12,
    backgroundColor: AppColors.surface,
    borderBottomWidth: 1,
    borderBottomColor: AppColors.borderLight,
  },
  headerTextContainer: {
    marginLeft: 16,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: AppColors.textPrimary,
  },
  headerSubtitle: {
    fontSize: 14,
    color: AppColors.primary,
    fontWeight: '600',
    marginTop: 2,
  },

  tabsContainer: {
    flexDirection: 'row',
    backgroundColor: AppColors.surface,
    borderBottomWidth: 1,
    borderBottomColor: AppColors.borderLight,
    paddingHorizontal: 24,
  },
  tab: {
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  tabSelected: {
    borderBottomColor: AppColors.primary,
  },
  tabText: {
    fontSize: 16,
    color: AppColors.textMuted,
    fontWeight: '400',
  },
  tabTextSelected: {
    color: AppColors.primary,
    fontWeight: '600',
  },

  mapContainer: {
    height: 350,
    width: '100%',
    backgroundColor: AppColors.surfaceMuted,
    borderBottomWidth: 1,
    borderBottomColor: AppColors.borderLight,
  },
  map: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: AppColors.textMuted,
  },

  customMarker: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: AppColors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: AppColors.white,
    elevation: 4,
    shadowColor: AppColors.black,
    shadowOpacity: 0.25,
    shadowRadius: 3,
    shadowOffset: { width: 0, height: 2 },
  },
  customMarkerSelected: {
    backgroundColor: AppColors.accent,
    transform: [{ scale: 1.25 }],
  },
  customMarkerText: {
    color: AppColors.white,
    fontSize: 13,
    fontWeight: '700',
  },

  timelineList: {
    padding: 24,
  },
  timelineRow: {
    flexDirection: 'row',
    paddingBottom: 24,
  },
  timelineRowSelected: {
    backgroundColor: AppColors.primaryLight,
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
  },
  sequenceCol: {
    alignItems: 'center',
    marginRight: 16,
  },
  sequenceBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: AppColors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: AppColors.border,
  },
  sequenceBadgeSelected: {
    backgroundColor: AppColors.primary,
    borderColor: AppColors.primary,
  },
  sequenceBadgeText: {
    fontSize: 13,
    fontWeight: '600',
    color: AppColors.textMuted,
  },
  sequenceBadgeTextSelected: {
    color: AppColors.white,
  },
  timelineLine: {
    flex: 1,
    width: 2,
    backgroundColor: AppColors.border,
    marginTop: 4,
  },
  infoCol: {
    flex: 1,
  },
  timeText: {
    fontSize: 12,
    fontWeight: '500',
    color: AppColors.textMuted,
  },
  nameText: {
    fontSize: 16,
    fontWeight: '600',
    color: AppColors.textPrimary,
    marginTop: 2,
  },
  durationText: {
    fontSize: 13,
    color: AppColors.textMuted,
    marginTop: 2,
  },
});